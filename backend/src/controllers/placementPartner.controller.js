const PlacementPartner = require('../models/placementPartner.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(PlacementPartner, {
  entity: 'Placement Partner',
  imageField: 'logo',
  searchFields: ['companyName', 'description'],
});
