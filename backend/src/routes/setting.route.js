const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const upload = require('../middleware/upload.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', settingController.get); // public
router.put(
  '/',
  protect,
  authorize('Super Admin', 'Admin'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  settingController.update
);

module.exports = router;
