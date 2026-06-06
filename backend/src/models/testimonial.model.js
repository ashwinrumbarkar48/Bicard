const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    course: String,
    rating: { type: Number, min: 0, max: 5 },
    testimonial: String,
    image: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
