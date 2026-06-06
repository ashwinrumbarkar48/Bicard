const mongoose = require('mongoose');

const placementPartnerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    logo: String,
    website: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlacementPartner', placementPartnerSchema);
