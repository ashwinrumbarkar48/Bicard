const Testimonial = require('../models/testimonial.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(Testimonial, {
  entity: 'Testimonial',
  imageField: 'image',
  searchFields: ['studentName', 'course', 'testimonial'],
});
