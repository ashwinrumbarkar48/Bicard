const Blog = require('../models/blog.model');
const { createCrudController } = require('./crud.factory');

module.exports = createCrudController(Blog, {
  entity: 'Blog',
  slugSource: 'title',
  imageField: 'featuredImage',
  searchFields: ['title', 'content', 'category'],
  filterFields: ['status', 'category'],
  publicQuery: { status: 'published' },
});
