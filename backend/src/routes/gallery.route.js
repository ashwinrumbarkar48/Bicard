const buildCrudRouter = require('./crud.route');
const galleryController = require('../controllers/gallery.controller');

module.exports = buildCrudRouter(galleryController, { imageField: 'image' });
