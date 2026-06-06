const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seo.controller');

router.get('/sitemap.xml', seoController.sitemap);
router.get('/robots.txt', seoController.robots);

module.exports = router;
