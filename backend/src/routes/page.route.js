const buildCrudRouter = require('./crud.route');
const pageController = require('../controllers/page.controller');

module.exports = buildCrudRouter(pageController, { hasSlug: true });
