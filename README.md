# CORE CMS - Complete Package

A full-featured Content Management System for holiday home businesses in Dubai.

## Features

- **Dark Theme Design** - Modern, professional appearance
- **Admin Panel** - Full CMS with rich text editor and image upload
- **Content Types** - Pages, Blog Posts, Case Studies, Testimonials
- **Form Management** - Contact forms and Book a Call requests
- **Responsive Design** - Works on all devices

## Project Structure

```
CORE-CMS-DOWNLOAD/
├── frontend/          # React frontend
│   ├── src/          # Source code
│   ├── package.json  # Dependencies
│   └── ...
└── backend/          # Node.js backend
    ├── server.js     # Main server file
    ├── package.json  # Dependencies
    └── uploads/      # Uploaded images
```

## Quick Start

### 1. Install Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000`

### 2. Install Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Access Admin Panel

- URL: `http://localhost:3000/#/admin/login`
- Email: `admin@core.com`
- Password: `admin123`

## Admin Features

- **Dashboard** - Overview of all content
- **Pages** - Edit homepage and other pages
- **Blog Posts** - Create/edit with rich text editor and image upload
- **Case Studies** - Showcase success stories
- **Testimonials** - Manage client reviews
- **Form Submissions** - View contact form entries
- **Book a Call** - Manage booking requests

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/upload/:type` - Upload images
- `GET/POST/PUT/DELETE /api/admin/blog-posts` - Blog management
- `GET/POST/PUT/DELETE /api/admin/case-studies` - Case studies
- `GET/POST/PUT/DELETE /api/admin/testimonials` - Testimonials
- `GET/PUT /api/admin/pages` - Pages
- `POST /api/contact` - Contact form
- `POST /api/book-a-call` - Book a call form

## Contact Information

- Phone: +971 58 506 6875
- Email: hello@coredxb.com
