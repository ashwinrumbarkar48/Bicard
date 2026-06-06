const buildCrudRouter = require('./crud.route');
const courseController = require('../controllers/course.controller');

module.exports = buildCrudRouter(courseController, { imageField: 'image', hasSlug: true });
