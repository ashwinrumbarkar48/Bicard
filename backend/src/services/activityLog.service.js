const ActivityLog = require('../models/activityLog.model');

/**
 * Record an admin action. Never throws — logging failures must not break
 * the request that triggered them.
 *
 * @param {object} params
 * @param {object} [params.req]      Express request (for user/ip/ua)
 * @param {string} params.action     e.g. "create", "update", "delete", "login"
 * @param {string} params.entity     e.g. "Course", "Blog"
 * @param {object} [params.metadata] Arbitrary extra detail
 */
const logActivity = async ({ req, action, entity, metadata = {} }) => {
  try {
    await ActivityLog.create({
      user: req && req.user ? req.user._id : undefined,
      action,
      entity,
      metadata,
      ipAddress: req ? req.ip : undefined,
      userAgent: req ? req.headers['user-agent'] : undefined,
    });
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
};

module.exports = { logActivity };
