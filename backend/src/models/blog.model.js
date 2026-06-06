const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    content: String,
    category: String,
    featuredImage: String,
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
