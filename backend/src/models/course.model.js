const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    // 'Course' = short-term courses, 'Training' = diploma / long training programs.
    // Drives the Courses vs Training menus on the website.
    category: { type: String, enum: ['Course', 'Training'], default: 'Course', index: true },
    shortDescription: String,
    description: String,
    duration: String,
    fees: String,
    curriculum: [String],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    benefits: [String],
    image: String,
    metaTitle: String,
    metaDescription: String,
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
