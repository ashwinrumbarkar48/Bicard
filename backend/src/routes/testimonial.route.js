const buildCrudRouter = require('./crud.route');
const testimonialController = require('../controllers/testimonial.controller');

module.exports = buildCrudRouter(testimonialController, { imageField: 'image' });
