const { paginate } = require('../utils/queryFeatures');
const { uniqueSlug } = require('../utils/slugify');
const { logActivity } = require('../services/activityLog.service');

/**
 * Build a standard set of CRUD handlers for a soft-deletable Mongoose model.
 *
 * @param {import('mongoose').Model} Model
 * @param {object} options
 * @param {string} options.entity            Human label, e.g. "Course"
 * @param {string[]} [options.searchFields]  Fields searched by ?search=
 * @param {string[]} [options.filterFields]  Fields exposed as exact filters
 * @param {string} [options.slugSource]      Field whose value is slugified (enables slug + /:slug lookup)
 * @param {string} [options.imageField]      Field that stores an uploaded image path
 * @param {object} [options.publicQuery]     Extra conditions applied to public (non-admin) list/detail
 */
const createCrudController = (Model, options = {}) => {
  const {
    entity = 'Item',
    searchFields = [],
    filterFields = [],
    slugSource = null,
    imageField = 'image',
    publicQuery = {},
  } = options;

  const applyImage = (req, body) => {
    if (req.file) body[imageField] = `/uploads/${req.file.filename}`;
    return body;
  };

  // multipart/form-data sends arrays/objects as JSON strings — parse them back.
  const coerceJson = (body) => {
    Object.keys(body).forEach((key) => {
      const val = body[key];
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
          try {
            body[key] = JSON.parse(trimmed);
          } catch (_) {
            /* leave as-is if it isn't valid JSON */
          }
        }
      }
    });
    return body;
  };

  return {
    // GET /  — admin list (everything not soft-deleted)
    list: async (req, res, next) => {
      try {
        const result = await paginate(Model, req.query, { searchFields, filterFields });
        res.json(result);
      } catch (err) {
        next(err);
      }
    },

    // GET /public  — published-only list for the website
    listPublic: async (req, res, next) => {
      try {
        const result = await paginate(Model, req.query, {
          searchFields,
          filterFields,
          baseQuery: publicQuery,
        });
        res.json(result);
      } catch (err) {
        next(err);
      }
    },

    // GET /:id
    getById: async (req, res, next) => {
      try {
        const doc = await Model.findOne({ _id: req.params.id, isDeleted: false });
        if (!doc) return res.status(404).json({ error: `${entity} not found` });
        res.json({ data: doc });
      } catch (err) {
        next(err);
      }
    },

    // GET /slug/:slug  — public detail
    getBySlug: async (req, res, next) => {
      try {
        const doc = await Model.findOne({ slug: req.params.slug, isDeleted: false, ...publicQuery });
        if (!doc) return res.status(404).json({ error: `${entity} not found` });
        res.json({ data: doc });
      } catch (err) {
        next(err);
      }
    },

    // POST /
    create: async (req, res, next) => {
      try {
        const body = coerceJson(applyImage(req, { ...req.body }));
        if (slugSource) {
          body.slug = await uniqueSlug(Model, body.slug || body[slugSource]);
        }
        const doc = await Model.create(body);
        await logActivity({ req, action: 'create', entity, metadata: { id: doc._id } });
        res.status(201).json({ data: doc });
      } catch (err) {
        next(err);
      }
    },

    // PUT /:id
    update: async (req, res, next) => {
      try {
        const doc = await Model.findOne({ _id: req.params.id, isDeleted: false });
        if (!doc) return res.status(404).json({ error: `${entity} not found` });

        const body = coerceJson(applyImage(req, { ...req.body }));
        if (slugSource && (body.slug || body[slugSource])) {
          body.slug = await uniqueSlug(Model, body.slug || body[slugSource], doc._id);
        }
        Object.assign(doc, body);
        await doc.save();
        await logActivity({ req, action: 'update', entity, metadata: { id: doc._id } });
        res.json({ data: doc });
      } catch (err) {
        next(err);
      }
    },

    // DELETE /:id  — soft delete
    remove: async (req, res, next) => {
      try {
        const doc = await Model.findOneAndUpdate(
          { _id: req.params.id, isDeleted: false },
          { isDeleted: true },
          { new: true }
        );
        if (!doc) return res.status(404).json({ error: `${entity} not found` });
        await logActivity({ req, action: 'delete', entity, metadata: { id: doc._id } });
        res.json({ message: `${entity} deleted successfully` });
      } catch (err) {
        next(err);
      }
    },
  };
};

module.exports = { createCrudController };
