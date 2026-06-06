const Lead = require('../models/lead.model');
const Setting = require('../models/setting.model');
const { paginate } = require('../utils/queryFeatures');
const { verifyRecaptcha } = require('../utils/recaptcha');
const { logActivity } = require('../services/activityLog.service');
const sendEmail = require('../services/email.service');

// POST /api/leads/contact  (public)  — Contact Form
// POST /api/leads/inquiry  (public)  — Course Inquiry Form
const createPublicLead = (source) => async (req, res, next) => {
  try {
    const { name, email, mobile, message, course, recaptchaToken } = req.body;

    const human = await verifyRecaptcha(recaptchaToken, req.ip);
    if (!human) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const lead = await Lead.create({ name, email, mobile, message, course, source });

    // Notify staff (best-effort). "To" address: LEADS_NOTIFY_EMAIL env wins,
    // otherwise fall back to the institute email set in admin → Settings.
    let notify = process.env.LEADS_NOTIFY_EMAIL;
    if (!notify) {
      const settings = await Setting.findOne({ isDeleted: false }).select('email').lean();
      notify = settings?.email;
    }
    if (notify) {
      sendEmail({
        to: notify,
        replyTo: email,
        subject: `New ${source}: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile || '-'}\nCourse: ${course || '-'}\nMessage: ${message || '-'}`,
      }).catch((e) => console.error('Lead notification email failed:', e.message));
    }

    res.status(201).json({ message: 'Thank you! Our team will reach out to you shortly.', data: { id: lead._id } });
  } catch (err) {
    next(err);
  }
};

exports.submitContact = createPublicLead('Contact Form');
exports.submitInquiry = createPublicLead('Course Inquiry Form');

// GET /api/leads  (admin)
exports.list = async (req, res, next) => {
  try {
    const result = await paginate(Lead, req.query, {
      searchFields: ['name', 'email', 'mobile', 'course'],
      filterFields: ['status', 'source'],
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/:id
exports.getById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ data: lead });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/leads/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { status },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await logActivity({ req, action: 'update-status', entity: 'Lead', metadata: { id: lead._id, status } });
    res.json({ data: lead });
  } catch (err) {
    next(err);
  }
};

// POST /api/leads/:id/notes
exports.addNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text is required.' });
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    lead.notes.push({ text });
    await lead.save();
    res.json({ data: lead });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/leads/:id  (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/export  (admin) — CSV
exports.exportCsv = async (req, res, next) => {
  try {
    const leads = await Lead.find({ isDeleted: false }).sort('-createdAt').lean();
    const headers = ['Name', 'Email', 'Mobile', 'Course', 'Source', 'Status', 'Message', 'Created At'];
    const escape = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      [l.name, l.email, l.mobile, l.course, l.source, l.status, l.message, l.createdAt && l.createdAt.toISOString()]
        .map(escape)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`bicard-leads-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
