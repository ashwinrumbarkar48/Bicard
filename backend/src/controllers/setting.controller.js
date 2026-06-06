const Setting = require('../models/setting.model');
const { logActivity } = require('../services/activityLog.service');

// Settings is a singleton document. Fetch-or-create.
const getOrCreate = async () => {
  let doc = await Setting.findOne({ isDeleted: false });
  if (!doc) doc = await Setting.create({});
  return doc;
};

// GET /api/settings  (public)
exports.get = async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    res.json({ data: doc });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings  (admin)
exports.update = async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    const body = { ...req.body };

    // Handle uploaded logo / favicon if present.
    if (req.files) {
      if (req.files.logo) body.logo = `/uploads/${req.files.logo[0].filename}`;
      if (req.files.favicon) body.favicon = `/uploads/${req.files.favicon[0].filename}`;
    }

    // socialLinks / stats may arrive as JSON strings from multipart forms.
    if (typeof body.socialLinks === 'string') {
      try {
        body.socialLinks = JSON.parse(body.socialLinks);
      } catch (_) {
        delete body.socialLinks;
      }
    }
    if (typeof body.stats === 'string') {
      try {
        body.stats = JSON.parse(body.stats);
      } catch (_) {
        delete body.stats;
      }
    }

    Object.assign(doc, body);
    await doc.save();
    await logActivity({ req, action: 'update', entity: 'Setting' });
    res.json({ data: doc });
  } catch (err) {
    next(err);
  }
};
