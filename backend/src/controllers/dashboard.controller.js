const Lead = require('../models/lead.model');
const Course = require('../models/course.model');
const Blog = require('../models/blog.model');
const Faculty = require('../models/faculty.model');
const Testimonial = require('../models/testimonial.model');

// GET /api/dashboard/stats  (admin)
exports.stats = async (req, res, next) => {
  try {
    const [totalLeads, totalCourses, totalBlogs, totalFaculty, totalTestimonials] = await Promise.all([
      Lead.countDocuments({ isDeleted: false }),
      Course.countDocuments({ isDeleted: false }),
      Blog.countDocuments({ isDeleted: false }),
      Faculty.countDocuments({ isDeleted: false }),
      Testimonial.countDocuments({ isDeleted: false }),
    ]);

    // Leads grouped by month for the last 6 months.
    const since = new Date();
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const monthlyAgg = await Lead.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyLeads = [];
    const cursor = new Date(since);
    for (let i = 0; i < 6; i += 1) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const found = monthlyAgg.find((d) => d._id.year === y && d._id.month === m);
      monthlyLeads.push({ label: `${monthNames[m - 1]} ${y}`, count: found ? found.count : 0 });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    // Inquiry sources distribution.
    const sourceAgg = await Lead.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);
    const inquirySources = sourceAgg.map((s) => ({ label: s._id || 'Unknown', count: s.count }));

    res.json({
      cards: { totalLeads, totalCourses, totalBlogs, totalFaculty, totalTestimonials },
      charts: { monthlyLeads, inquirySources },
    });
  } catch (err) {
    next(err);
  }
};
