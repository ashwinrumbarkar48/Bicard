const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: String,
    message: String,
    course: String,
    source: { type: String, enum: ['Contact Form', 'Course Inquiry Form'], default: 'Contact Form' },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
    notes: [{ text: String, createdAt: { type: Date, default: Date.now } }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
