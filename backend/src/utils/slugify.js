/**
 * Convert a string into a URL-friendly slug.
 * "Embedded C++ & RTOS!" -> "embedded-c-rtos"
 */
const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Generate a slug that is unique within a Mongoose model.
 * Appends -2, -3, ... when a collision is found.
 */
const uniqueSlug = async (Model, value, excludeId = null) => {
  const base = slugify(value) || 'item';
  let slug = base;
  let counter = 2;

  /* eslint-disable no-await-in-loop */
  while (true) {
    const query = { slug, isDeleted: false };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query).lean();
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
  /* eslint-enable no-await-in-loop */
};

module.exports = { slugify, uniqueSlug };
