const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('./middleware/rateLimit.middleware');

const authRoutes = require('./routes/auth.route');
const courseRoutes = require('./routes/course.route');
const blogRoutes = require('./routes/blog.route');
const facultyRoutes = require('./routes/faculty.route');
const partnerRoutes = require('./routes/placementPartner.route');
const testimonialRoutes = require('./routes/testimonial.route');
const galleryRoutes = require('./routes/gallery.route');
const pageRoutes = require('./routes/page.route');
const leadRoutes = require('./routes/lead.route');
const settingRoutes = require('./routes/setting.route');
const dashboardRoutes = require('./routes/dashboard.route');
const userRoutes = require('./routes/user.route');
const seoRoutes = require('./routes/seo.route');

const app = express();

// Behind Railway / proxy — needed for correct req.ip + rate limiting.
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// SEO endpoints are served at the root (sitemap.xml, robots.txt).
app.use('/', seoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BICARD API is running' });
});

// Global limiter applies to the API surface only.
app.use('/api', rateLimit.globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/placement-partners', partnerRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
