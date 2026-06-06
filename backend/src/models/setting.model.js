const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    logo: String,
    favicon: String,
    contactNumber: String,
    whatsappNumber: String,
    email: String,
    address: String,
    // Animated "analytics" counters shown on Home & About. Editable in admin.
    stats: [
      {
        value: Number,
        suffix: String,
        label: String,
      },
    ],
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      linkedin: String,
      twitter: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingsSchema);
