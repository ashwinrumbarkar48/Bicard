const mongoose = require('mongoose');

/**
 * Generic static content page (e.g. Staffing Solutions, Terms & Conditions,
 * Placements intro). Fully editable from the admin portal.
 */
const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    content: String, // HTML
    metaTitle: String,
    metaDescription: String,
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);
