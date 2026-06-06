const buildCrudRouter = require('./crud.route');
const blogController = require('../controllers/blog.controller');

module.exports = buildCrudRouter(blogController, { imageField: 'featuredImage', hasSlug: true });
