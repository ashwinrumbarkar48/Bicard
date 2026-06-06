const buildCrudRouter = require('./crud.route');
const facultyController = require('../controllers/faculty.controller');

module.exports = buildCrudRouter(facultyController, { imageField: 'photo' });
