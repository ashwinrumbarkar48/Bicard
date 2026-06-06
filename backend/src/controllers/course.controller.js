const Course = require('../models/course.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(Course, {
  entity: 'Course',
  slugSource: 'title',
  imageField: 'image',
  searchFields: ['title', 'shortDescription', 'description'],
  filterFields: ['isPublished', 'category'],
  publicQuery: { isPublished: true },
});
