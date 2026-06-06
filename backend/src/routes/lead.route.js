const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { contactLimiter } = require('../middleware/rateLimit.middleware');

// ---- Public submissions (rate limited + reCAPTCHA) ----
router.post('/contact', contactLimiter, leadController.submitContact);
router.post('/inquiry', contactLimiter, leadController.submitInquiry);

// ---- Admin ----
router.get('/export', protect, leadController.exportCsv);
router.get('/', protect, leadController.list);
router.get('/:id', protect, leadController.getById);
router.patch('/:id/status', protect, leadController.updateStatus);
router.post('/:id/notes', protect, leadController.addNote);
router.delete('/:id', protect, authorize('Super Admin', 'Admin'), leadController.remove);

module.exports = router;
