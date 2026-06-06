const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { paginate } = require('../utils/queryFeatures');
const { logActivity } = require('../services/activityLog.service');

const sanitize = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

// GET /api/users  (Super Admin)
exports.list = async (req, res, next) => {
  try {
    const result = await paginate(User, req.query, {
      searchFields: ['name', 'email'],
      filterFields: ['role'],
    });
    result.data = result.data.map((u) => {
      delete u.password;
      delete u.resetPasswordToken;
      delete u.resetPasswordExpires;
      return u;
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/users  (Super Admin)
exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'A user with that email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role });
    await logActivity({ req, action: 'create', entity: 'User', metadata: { id: user._id } });
    res.status(201).json({ data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id  (Super Admin)
exports.update = async (req, res, next) => {
  try {
    const { name, role, password } = req.body;
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 12);
    await user.save();
    await logActivity({ req, action: 'update', entity: 'User', metadata: { id: user._id } });
    res.json({ data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (Super Admin, soft delete)
exports.remove = async (req, res, next) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    await logActivity({ req, action: 'delete', entity: 'User', metadata: { id: user._id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
