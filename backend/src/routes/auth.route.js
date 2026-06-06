const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginLimiter, forgotPasswordLimiter } = require('../middleware/rateLimit.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', loginLimiter, authController.login);
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', protect, authController.changePassword);
router.get('/me', protect, authController.me);

module.exports = router;
