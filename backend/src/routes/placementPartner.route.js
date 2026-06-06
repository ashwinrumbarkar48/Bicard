const buildCrudRouter = require('./crud.route');
const partnerController = require('../controllers/placementPartner.controller');

module.exports = buildCrudRouter(partnerController, { imageField: 'logo' });
