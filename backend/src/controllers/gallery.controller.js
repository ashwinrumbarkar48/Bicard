const Gallery = require('../models/gallery.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(Gallery, {
  entity: 'Gallery Item',
  imageField: 'image',
  searchFields: ['title', 'category'],
  filterFields: ['category'],
});
