const Faculty = require('../models/faculty.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(Faculty, {
  entity: 'Faculty',
  imageField: 'photo',
  searchFields: ['name', 'designation', 'qualification'],
});
