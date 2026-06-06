const Course = require('../models/course.model');
const Blog = require('../models/blog.model');

const siteUrl = () => (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

// GET /sitemap.xml
exports.sitemap = async (req, res, next) => {
  try {
    const base = siteUrl();
    const staticPaths = ['', '/about', '/courses', '/blogs', '/faculty', '/gallery', '/contact'];

    const [courses, blogs] = await Promise.all([
      Course.find({ isPublished: true, isDeleted: false }).select('slug updatedAt').lean(),
      Blog.find({ status: 'published', isDeleted: false }).select('slug updatedAt').lean(),
    ]);

    const urls = [
      ...staticPaths.map((p) => ({ loc: `${base}${p}`, lastmod: null })),
      ...courses.map((c) => ({ loc: `${base}/courses/${c.slug}`, lastmod: c.updatedAt })),
      ...blogs.map((b) => ({ loc: `${base}/blogs/${b.slug}`, lastmod: b.updatedAt })),
    ];

    const body = urls
      .map(
        (u) =>
          `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</url>`
      )
      .join('\n');

    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
  } catch (err) {
    next(err);
  }
};

// GET /robots.txt
exports.robots = (req, res) => {
  const base = siteUrl();
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`);
};
