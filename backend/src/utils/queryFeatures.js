/**
 * Build a paginated, searchable, sortable list response from a Mongoose model.
 *
 * @param {import('mongoose').Model} Model
 * @param {object} reqQuery        Express req.query
 * @param {object} [options]
 * @param {string[]} [options.searchFields]  Fields matched against ?search=
 * @param {string[]} [options.filterFields]  Fields allowed as exact filters (?status=new)
 * @param {object}  [options.baseQuery]      Always-applied conditions
 * @returns {Promise<{ data: any[], pagination: object }>}
 */
const paginate = async (Model, reqQuery = {}, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    baseQuery = {},
  } = options;

  const page = Math.max(parseInt(reqQuery.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(reqQuery.limit, 10) || 12, 1), 100);
  const skip = (page - 1) * limit;

  const query = { isDeleted: false, ...baseQuery };

  if (reqQuery.search && searchFields.length) {
    const regex = new RegExp(reqQuery.search.trim(), 'i');
    query.$or = searchFields.map((field) => ({ [field]: regex }));
  }

  filterFields.forEach((field) => {
    if (reqQuery[field] !== undefined && reqQuery[field] !== '') {
      query[field] = reqQuery[field];
    }
  });

  const sort = reqQuery.sort || '-createdAt';

  const [data, total] = await Promise.all([
    Model.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Model.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { paginate };
