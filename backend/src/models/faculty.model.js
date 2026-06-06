const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: String,
    qualification: String,
    experience: String,
    photo: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
