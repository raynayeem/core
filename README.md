# CORE CMS - Complete Package

A full-featured Content Management System for holiday home businesses in Dubai.

## Deployment Documentation

For AWS EC2 Docker deployment with environment setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Features

- **Dark Theme Design** - Modern, professional appearance
- **Admin Panel** - Full CMS with rich text editor and image upload
- **Content Types** - Pages, Blog Posts, Case Studies, Testimonials
- **Form Management** - Contact forms and Book a Call requests
- **Responsive Design** - Works on all devices
- **MongoDB Database** - Persistent data storage

## Project Structure

```
CORE-CMS-DOWNLOAD/
├── frontend/          # React frontend
│   ├── src/          # Source code
│   ├── package.json  # Dependencies
│   └── ...
└── backend/          # Node.js backend with MongoDB
    ├── server.js     # Main server file
    ├── package.json  # Dependencies
    ├── .env.example  # Environment variables template
    └── uploads/      # Uploaded images
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

## Quick Start

### 1. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/docs/manual/installation/

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud - Free)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` file with your Atlas URI

### 2. Install Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env and update MONGODB_URI if needed
# MONGODB_URI=mongodb://localhost:27017/core-cms

# Install dependencies
npm install

# Start server
npm start
```

Backend runs on `http://localhost:5000`

### 3. Install Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Access Admin Panel

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/upload/:type` | Upload images |
| GET | `/api/blog-posts` | Get published blog posts |
| GET | `/api/blog-posts/:slug` | Get single blog post |
| GET | `/api/admin/blog-posts` | Get all blog posts (admin) |
| POST | `/api/admin/blog-posts` | Create blog post |
| PUT | `/api/admin/blog-posts/:id` | Update blog post |
| DELETE | `/api/admin/blog-posts/:id` | Delete blog post |
| GET | `/api/case-studies` | Get published case studies |
| GET | `/api/case-studies/:slug` | Get single case study |
| GET | `/api/admin/case-studies` | Get all case studies (admin) |
| POST | `/api/admin/case-studies` | Create case study |
| PUT | `/api/admin/case-studies/:id` | Update case study |
| DELETE | `/api/admin/case-studies/:id` | Delete case study |
| GET | `/api/testimonials` | Get published testimonials |
| GET | `/api/admin/testimonials` | Get all testimonials (admin) |
| POST | `/api/admin/testimonials` | Create testimonial |
| PUT | `/api/admin/testimonials/:id` | Update testimonial |
| DELETE | `/api/admin/testimonials/:id` | Delete testimonial |
| GET | `/api/pages` | Get published pages |
| GET | `/api/pages/:slug` | Get single page |
| GET | `/api/admin/pages` | Get all pages (admin) |
| PUT | `/api/admin/pages/:id` | Update page |
| GET | `/api/settings` | Get site settings |
| PUT | `/api/admin/settings` | Update settings |
| GET | `/api/admin/stats` | Get dashboard stats |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/admin/contact-submissions` | Get contact submissions |
| PUT | `/api/admin/contact-submissions/:id/read` | Mark submission as read |
| DELETE | `/api/admin/contact-submissions/:id` | Delete submission |
| POST | `/api/book-a-call` | Submit booking request |
| GET | `/api/admin/book-a-call` | Get all bookings |
| PUT | `/api/admin/book-a-call/:id/status` | Update booking status |
| DELETE | `/api/admin/book-a-call/:id` | Delete booking |

## MongoDB Schemas

### User
- email (String, unique)
- password (String, hashed)
- name (String)
- role (String)

### Page
- slug (String, unique)
- title (String)
- content (Object)
- metaTitle (String)
- metaDescription (String)
- isPublished (Boolean)

### BlogPost
- title (String)
- slug (String, unique)
- excerpt (String)
- content (String)
- category (String)
- tags (Array)
- author (String)
- authorTitle (String)
- featuredImage (String)
- isPublished (Boolean)
- publishedAt (Date)

### CaseStudy
- title (String)
- slug (String, unique)
- client (String)
- clientName (String)
- clientLocation (String)
- propertyType (String)
- excerpt (String)
- content (String)
- challenge (String)
- solution (String)
- results (Array)
- stats (Array)
- featuredImage (String)
- isPublished (Boolean)

### Testimonial
- name (String)
- title (String)
- company (String)
- content (String)
- rating (Number)
- isPublished (Boolean)

### ContactSubmission
- name (String)
- email (String)
- phone (String)
- message (String)
- isRead (Boolean)

### Booking
- name (String)
- email (String)
- phone (String)
- company (String)
- preferredDate (String)
- preferredTime (String)
- message (String)
- status (String: pending, confirmed, completed, cancelled)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/core-cms` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-change-in-production` |
| `PORT` | Server port | `5000` |

## Contact Information

- Phone: **+971 58 506 6875**
- Email: **hello@coredxb.com**
