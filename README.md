# BICARD — CMS-Driven Website, Admin Portal & API

A complete, Udemy-style training-institute platform for **BICARD** (embedded systems institute, Pune). Fully CMS-driven — every piece of website content is managed from the admin portal and served via the API. No hardcoded content.

| App | Stack | Dev URL | Deploy target |
| --- | --- | --- | --- |
| **backend** | Node + Express + MongoDB (Mongoose) + JWT | http://localhost:5000 | Railway |
| **website** | React (Vite) + Tailwind + Redux Toolkit | http://localhost:3000 | GoDaddy (static build) |
| **admin** | React (Vite) + Tailwind + Redux Toolkit + Recharts | http://localhost:3001 | Vercel |

## 📖 Documentation

| Doc | For |
| --- | --- |
| [docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md) | **Non-technical** — managing all website content from the admin portal |
| [docs/SETUP-AND-DEPLOYMENT.md](docs/SETUP-AND-DEPLOYMENT.md) | Running locally, email/SMTP setup, deployment |
| [docs/HANDOVER.md](docs/HANDOVER.md) | What's built, content inventory, credentials, outstanding items |

## Design system

The UI pairs **Udemy-style typography** (`Hanken Grotesk`, the closest free match to Udemy Sans) with the **BICARD brand palette** sourced from bicard.org:

| Token | Hex | Use |
| --- | --- | --- |
| `brand` (primary) | `#00633F` | Green — headers, primary buttons, links |
| `accent` | `#C6272B` | Red — CTAs, highlights |
| `highlight` | `#FDD303` | Yellow — badges, accents |
| `ink` | `#1c1d1f` | Near-black body text (Udemy-style) |

Tokens live in each app's `tailwind.config.js` and are shared verbatim between website and admin.

---

## Quick start

> Requires **Node 18+** and a **MongoDB Atlas** connection string.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then fill in MONGODB_URI, JWT_SECRET, SMTP_*
npm run seed                # creates Super Admin + sample content
npm run dev                 # http://localhost:5000
```

The seed creates a Super Admin (default `admin@bicard.org` / `Admin@123` — override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

### 2. Admin portal

```bash
cd admin
npm install
cp .env.example .env        # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                 # http://localhost:3001  → log in with the seeded admin
```

### 3. Website

```bash
cd website
npm install
cp .env.example .env
npm run dev                 # http://localhost:3000
```

---

## Backend architecture

```
backend/src/
├── config/db.js              MongoDB connection
├── models/                   11 Mongoose models (soft-delete + timestamps)
│                             incl. Page (generic CMS pages) + Course.category (Course/Training)
├── controllers/
│   ├── crud.factory.js       Generic list/getOne/create/update/soft-delete
│   ├── *.controller.js       Per-module controllers (most use the factory)
│   ├── lead / setting / dashboard / user / seo controllers (custom)
├── routes/
│   ├── crud.route.js         Builds public-read + protected-write routes
│   └── *.route.js
├── middleware/               auth (JWT + RBAC), rate limiting, multer upload
├── services/                 email (SMTP w/ console fallback), activity log
├── utils/                    slugify, pagination, reCAPTCHA verify, jwt
├── seed.js                   Seed admin + demo content
├── app.js / server.js
```

**Roles:** Super Admin, Admin, Counselor, Marketing (RBAC enforced in route guards).

### Key API endpoints

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/api/auth/login` | public (5/15min) |
| `POST` | `/api/auth/forgot-password` | public (3/hr) |
| `GET`  | `/api/auth/me` | auth |
| `GET`  | `/api/courses/public` · `/api/courses/slug/:slug` | public |
| `GET/POST/PUT/DELETE` | `/api/courses` … | admin |
| _(same pattern: blogs, faculty, placement-partners, testimonials, gallery, **pages**)_ | | |
| `GET`  | `/api/pages/public` · `/api/pages/slug/:slug` | public (Placements, Staffing, Terms) |
| `POST` | `/api/leads/contact` · `/api/leads/inquiry` | public (5/hr + reCAPTCHA) |
| `GET`  | `/api/leads` · `/api/leads/export` (CSV) | admin |
| `GET/PUT` | `/api/settings` | public read / admin write |
| `GET`  | `/api/dashboard/stats` | admin |
| `GET`  | `/api/users` … | Super Admin |
| `GET`  | `/sitemap.xml` · `/robots.txt` | public |

### Security (Phase 15)
JWT auth · bcrypt (cost 12) · Helmet · CORS allow-list · per-route rate limiting · Google reCAPTCHA v3 on public forms (auto-disabled when `RECAPTCHA_SECRET` is blank).

---

## Deployment

### Backend → Railway
1. New project → Deploy from repo → root `backend/`.
2. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `SMTP_*`, `FRONTEND_URL`, `ADMIN_URL`, `CORS_ORIGINS`, `RECAPTCHA_SECRET`.
3. Railway runs `npm start` (see `railway.json`). Run `npm run seed` once via the Railway shell.
   > Note: uploaded files are stored on disk under `uploads/`. For production durability, mount a Railway volume at `/app/uploads` or switch the upload middleware to S3/Cloudinary.

### Admin → Vercel
1. Import repo → root directory `admin/`.
2. Build command `npm run build`, output `dist`.
3. Env var `VITE_API_URL=https://<your-railway-app>/api`, `VITE_ASSET_URL=https://<your-railway-app>`.
4. SPA routing handled by `vercel.json`.

### Website → GoDaddy
1. Set `VITE_API_URL` / `VITE_ASSET_URL` to the Railway backend, then `npm run build`.
2. Upload the contents of `website/dist/` to GoDaddy `public_html/` (the included `.htaccess` handles SPA routing on Apache).

---

## Build status
All three apps install and build cleanly (`npm run build`). Backend boots and loads all routes/models without error.
