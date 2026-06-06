const express = require('express');
const upload = require('../middleware/upload.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');

/**
 * Build a router exposing public read routes + protected admin write routes
 * for a controller produced by crud.factory.
 *
 * @param {object} controller             From createCrudController()
 * @param {object} [opts]
 * @param {string} [opts.imageField]       multipart field name for image upload
 * @param {boolean} [opts.hasSlug]         expose GET /slug/:slug
 * @param {string[]} [opts.writeRoles]     roles allowed to write
 */
const buildCrudRouter = (controller, opts = {}) => {
  const {
    imageField = 'image',
    hasSlug = false,
    writeRoles = ['Super Admin', 'Admin', 'Marketing'],
  } = opts;

  const router = express.Router();
  const single = upload.single(imageField);
  const guard = [protect, authorize(...writeRoles)];

  // ---- Public read ----
  router.get('/public', controller.listPublic);
  if (hasSlug) router.get('/slug/:slug', controller.getBySlug);

  // ---- Admin read ----
  router.get('/', protect, controller.list);
  router.get('/:id', protect, controller.getById);

  // ---- Admin write ----
  router.post('/', ...guard, single, controller.create);
  router.put('/:id', ...guard, single, controller.update);
  router.delete('/:id', protect, authorize('Super Admin', 'Admin'), controller.remove);

  return router;
};

module.exports = buildCrudRouter;
