const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// ==================== FILE UPLOAD CONFIGURATION ====================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(uploadsDir, req.params.type || 'general');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==================== IN-MEMORY DATA STORE ====================

const dataStore = {
  users: [
    {
      id: '1',
      email: 'admin@core.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin',
      role: 'admin'
    }
  ],
  pages: [
    {
      id: '1',
      slug: 'home',
      title: 'Home Page',
      content: {
        hero: {
          title: 'Operating Partner for Holiday Home Businesses',
          subtitle: 'We built the infrastructure so you don\'t have to.'
        }
      },
      metaTitle: 'CORE - Holiday Home Management Dubai',
      metaDescription: 'The operating partner for holiday home businesses in Dubai.',
      isPublished: true,
      updatedAt: new Date().toISOString()
    }
  ],
  blogPosts: [
    {
      id: '1',
      title: 'How to Maximize Your Holiday Home Revenue in Dubai',
      slug: 'maximize-holiday-home-revenue-dubai',
      excerpt: 'Discover proven strategies to increase your rental income.',
      content: '<p>Dubai\'s holiday home market is one of the most lucrative in the world.</p>',
      category: 'Revenue Management',
      tags: ['dubai', 'revenue', 'tips'],
      author: 'CORE Team',
      authorTitle: 'Revenue Management Experts',
      featuredImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      isPublished: true,
      publishedAt: '2024-01-15T00:00:00.000Z',
      createdAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    }
  ],
  caseStudies: [
    {
      id: '1',
      title: 'How We Increased Revenue by 35% for a Palm Jumeirah Villa',
      slug: 'palm-jumeirah-villa-revenue-increase',
      client: 'Luxury Villa Owner',
      clientName: 'Mohammed Al-Rashid',
      clientLocation: 'Palm Jumeirah, Dubai',
      propertyType: 'Villa',
      excerpt: 'A comprehensive case study on dynamic pricing.',
      content: '<p>When we first started working with this Palm Jumeirah villa...</p>',
      challenge: 'Low occupancy rates and below-market pricing.',
      solution: 'Implemented dynamic pricing strategy.',
      results: [
        { metric: 'Revenue Increase', value: '35%' },
        { metric: 'Occupancy Rate', value: '85%' }
      ],
      stats: [
        { value: '35%', label: 'Revenue Increase' },
        { value: '85%', label: 'Occupancy Rate' },
        { value: '4.9', label: 'Guest Rating' }
      ],
      featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      isPublished: true,
      createdAt: '2024-01-20T00:00:00.000Z',
      updatedAt: '2024-01-20T00:00:00.000Z'
    }
  ],
  testimonials: [
    {
      id: '1',
      name: 'Abir Chammah',
      title: 'Manager, Monty Holiday Home',
      company: 'Monty Holiday Home',
      content: 'CORE has been an absolute asset to our team.',
      rating: 5,
      isPublished: true,
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    }
  ],
  settings: {
    siteName: 'CORE',
    siteDescription: 'Operating Partner for Holiday Home Businesses',
    contactEmail: 'hello@coredxb.com',
    contactPhone: '+971 58 506 6875'
  },
  contactSubmissions: [],
  bookings: []
};

// ==================== AUTHENTICATION MIDDLEWARE ====================

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = dataStore.users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// ==================== FILE UPLOAD ROUTES ====================

app.post('/api/upload/:type', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.params.type}/${req.file.filename}`;
    res.json({
      message: 'File uploaded successfully',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== PAGES API ====================

app.get('/api/pages', (req, res) => {
  const pages = dataStore.pages.filter(p => p.isPublished).map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription
  }));
  res.json(pages);
});

app.get('/api/pages/:slug', (req, res) => {
  const page = dataStore.pages.find(p => p.slug === req.params.slug && p.isPublished);
  if (!page) {
    return res.status(404).json({ message: 'Page not found' });
  }
  res.json(page);
});

app.get('/api/admin/pages', authMiddleware, (req, res) => {
  res.json(dataStore.pages);
});

app.get('/api/admin/pages/:id', authMiddleware, (req, res) => {
  const page = dataStore.pages.find(p => p.id === req.params.id);
  if (!page) {
    return res.status(404).json({ message: 'Page not found' });
  }
  res.json(page);
});

app.post('/api/admin/pages', authMiddleware, (req, res) => {
  const newPage = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.pages.push(newPage);
  res.status(201).json(newPage);
});

app.put('/api/admin/pages/:id', authMiddleware, (req, res) => {
  const index = dataStore.pages.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Page not found' });
  }
  dataStore.pages[index] = {
    ...dataStore.pages[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(dataStore.pages[index]);
});

app.delete('/api/admin/pages/:id', authMiddleware, (req, res) => {
  const index = dataStore.pages.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Page not found' });
  }
  dataStore.pages.splice(index, 1);
  res.json({ message: 'Page deleted' });
});

// ==================== BLOG POSTS API ====================

app.get('/api/blog-posts', (req, res) => {
  const posts = dataStore.blogPosts
    .filter(p => p.isPublished)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  res.json(posts);
});

app.get('/api/blog-posts/:slug', (req, res) => {
  const post = dataStore.blogPosts.find(p => p.slug === req.params.slug && p.isPublished);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

app.get('/api/blog-posts/id/:id', (req, res) => {
  const post = dataStore.blogPosts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

app.get('/api/admin/blog-posts', authMiddleware, (req, res) => {
  res.json(dataStore.blogPosts);
});

app.post('/api/admin/blog-posts', authMiddleware, (req, res) => {
  const newPost = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.blogPosts.push(newPost);
  res.status(201).json(newPost);
});

app.put('/api/admin/blog-posts/:id', authMiddleware, (req, res) => {
  const index = dataStore.blogPosts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  dataStore.blogPosts[index] = {
    ...dataStore.blogPosts[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(dataStore.blogPosts[index]);
});

app.delete('/api/admin/blog-posts/:id', authMiddleware, (req, res) => {
  const index = dataStore.blogPosts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  dataStore.blogPosts.splice(index, 1);
  res.json({ message: 'Post deleted' });
});

// ==================== CASE STUDIES API ====================

app.get('/api/case-studies', (req, res) => {
  const studies = dataStore.caseStudies.filter(s => s.isPublished);
  res.json(studies);
});

app.get('/api/case-studies/:slug', (req, res) => {
  const study = dataStore.caseStudies.find(s => s.slug === req.params.slug && s.isPublished);
  if (!study) {
    return res.status(404).json({ message: 'Case study not found' });
  }
  res.json(study);
});

app.get('/api/case-studies/id/:id', (req, res) => {
  const study = dataStore.caseStudies.find(s => s.id === req.params.id);
  if (!study) {
    return res.status(404).json({ message: 'Case study not found' });
  }
  res.json(study);
});

app.get('/api/admin/case-studies', authMiddleware, (req, res) => {
  res.json(dataStore.caseStudies);
});

app.post('/api/admin/case-studies', authMiddleware, (req, res) => {
  const newStudy = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.caseStudies.push(newStudy);
  res.status(201).json(newStudy);
});

app.put('/api/admin/case-studies/:id', authMiddleware, (req, res) => {
  const index = dataStore.caseStudies.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Case study not found' });
  }
  dataStore.caseStudies[index] = {
    ...dataStore.caseStudies[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(dataStore.caseStudies[index]);
});

app.delete('/api/admin/case-studies/:id', authMiddleware, (req, res) => {
  const index = dataStore.caseStudies.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Case study not found' });
  }
  dataStore.caseStudies.splice(index, 1);
  res.json({ message: 'Case study deleted' });
});

// ==================== TESTIMONIALS API ====================

app.get('/api/testimonials', (req, res) => {
  const testimonials = dataStore.testimonials.filter(t => t.isPublished);
  res.json(testimonials);
});

app.get('/api/testimonials/:id', (req, res) => {
  const testimonial = dataStore.testimonials.find(t => t.id === req.params.id);
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  res.json(testimonial);
});

app.get('/api/admin/testimonials', authMiddleware, (req, res) => {
  res.json(dataStore.testimonials);
});

app.post('/api/admin/testimonials', authMiddleware, (req, res) => {
  const newTestimonial = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.testimonials.push(newTestimonial);
  res.status(201).json(newTestimonial);
});

app.put('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  const index = dataStore.testimonials.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  dataStore.testimonials[index] = {
    ...dataStore.testimonials[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(dataStore.testimonials[index]);
});

app.delete('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  const index = dataStore.testimonials.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  dataStore.testimonials.splice(index, 1);
  res.json({ message: 'Testimonial deleted' });
});

// ==================== SETTINGS API ====================

app.get('/api/settings', (req, res) => {
  res.json(dataStore.settings);
});

app.put('/api/admin/settings', authMiddleware, (req, res) => {
  dataStore.settings = { ...dataStore.settings, ...req.body };
  res.json(dataStore.settings);
});

// ==================== STATS API ====================

app.get('/api/admin/stats', authMiddleware, (req, res) => {
  res.json({
    blogPosts: dataStore.blogPosts.length,
    caseStudies: dataStore.caseStudies.length,
    testimonials: dataStore.testimonials.length,
    pages: dataStore.pages.length,
    totalViews: '12.5K'
  });
});

// ==================== CONTACT FORM API ====================

app.post('/api/contact', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('message').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const submission = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  dataStore.contactSubmissions.push(submission);
  res.status(201).json({ message: 'Contact form submitted successfully' });
});

app.get('/api/admin/contact-submissions', authMiddleware, (req, res) => {
  res.json(dataStore.contactSubmissions);
});

app.put('/api/admin/contact-submissions/:id/read', authMiddleware, (req, res) => {
  const submission = dataStore.contactSubmissions.find(s => s.id === req.params.id);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  submission.isRead = true;
  res.json(submission);
});

app.delete('/api/admin/contact-submissions/:id', authMiddleware, (req, res) => {
  const index = dataStore.contactSubmissions.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  dataStore.contactSubmissions.splice(index, 1);
  res.json({ message: 'Submission deleted' });
});

// ==================== BOOK A CALL API ====================

app.post('/api/book-a-call', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('preferredDate').notEmpty(),
  body('preferredTime').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const booking = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  dataStore.bookings.push(booking);
  res.status(201).json({ message: 'Booking created successfully' });
});

app.get('/api/admin/book-a-call', authMiddleware, (req, res) => {
  res.json(dataStore.bookings);
});

app.put('/api/admin/book-a-call/:id/status', authMiddleware, (req, res) => {
  const booking = dataStore.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  booking.status = req.body.status;
  res.json(booking);
});

app.delete('/api/admin/book-a-call/:id', authMiddleware, (req, res) => {
  const index = dataStore.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  dataStore.bookings.splice(index, 1);
  res.json({ message: 'Booking deleted' });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Uploads directory: ${uploadsDir}`);
});
