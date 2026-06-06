const Page = require('../models/page.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(Page, {
  entity: 'Page',
  slugSource: 'title',
  searchFields: ['title', 'content'],
  filterFields: ['isPublished'],
  publicQuery: { isPublished: true },
});
