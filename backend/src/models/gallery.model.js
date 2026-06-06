const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    image: String,
    videoUrl: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
