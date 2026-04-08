const express = require('express');
const mongoose = require('mongoose');
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/core-cms';

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

// ==================== MONGODB CONNECTION ====================

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Running in memory-only mode (data will not persist)');
  });

// ==================== MONGOOSE SCHEMAS ====================

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Page Schema
const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  metaTitle: { type: String },
  metaDescription: { type: String },
  isPublished: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Page = mongoose.model('Page', pageSchema);

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  category: { type: String },
  tags: [{ type: String }],
  author: { type: String, default: 'CORE Team' },
  authorTitle: { type: String },
  featuredImage: { type: String },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Case Study Schema
const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  client: { type: String },
  clientName: { type: String },
  clientLocation: { type: String },
  propertyType: { type: String },
  excerpt: { type: String },
  content: { type: String, required: true },
  challenge: { type: String },
  solution: { type: String },
  results: [{ metric: String, value: String }],
  stats: [{ value: String, label: String }],
  featuredImage: { type: String },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  company: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// Settings Schema
const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'CORE' },
  siteDescription: { type: String, default: 'Operating Partner for Holiday Home Businesses' },
  contactEmail: { type: String, default: 'hello@coredxb.com' },
  contactPhone: { type: String, default: '+971 58 506 6875' },
  socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model('Settings', settingsSchema);

// Contact Submission Schema
const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

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

// ==================== SEED DATA ====================

const seedData = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@core.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@core.com',
        password: bcrypt.hashSync('admin123', 10),
        name: 'Admin',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Check if settings exist
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({
        siteName: 'CORE',
        siteDescription: 'Operating Partner for Holiday Home Businesses',
        contactEmail: 'hello@coredxb.com',
        contactPhone: '+971 58 506 6875',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/core-dxb'
        }
      });
      console.log('Default settings created');
    }

    // Check if pages exist
    const pagesCount = await Page.countDocuments();
    if (pagesCount === 0) {
      await Page.insertMany([
        {
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
          isPublished: true
        },
        {
          slug: 'revenue-management',
          title: 'Revenue Management',
          content: {
            hero: {
              title: 'Revenue Management',
              subtitle: 'Put your rates on autopilot.'
            }
          },
          metaTitle: 'Revenue Management - CORE',
          metaDescription: 'AI-powered dynamic pricing for holiday homes in Dubai.',
          isPublished: true
        },
        {
          slug: 'operations',
          title: 'Operations',
          content: {
            hero: {
              title: 'Operations',
              subtitle: 'End-to-end operations management.'
            }
          },
          metaTitle: 'Operations - CORE',
          metaDescription: 'Complete operations management for holiday homes.',
          isPublished: true
        },
        {
          slug: 'about',
          title: 'About Us',
          content: {
            hero: {
              title: 'WELCOME TO CORE',
              subtitle: 'Running a holiday home business isn\'t hard because of the guests.'
            }
          },
          metaTitle: 'About Us - CORE',
          metaDescription: 'Learn about CORE and our mission.',
          isPublished: true
        },
        {
          slug: 'pricing',
          title: 'Pricing',
          content: {
            hero: {
              title: 'Simple, transparent pricing',
              subtitle: 'Choose the plan that fits your portfolio.'
            }
          },
          metaTitle: 'Pricing - CORE',
          metaDescription: 'Transparent pricing for holiday home management.',
          isPublished: true
        }
      ]);
      console.log('Default pages created');
    }

    // Check if blog posts exist
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.insertMany([
        {
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
          publishedAt: new Date('2024-01-15')
        },
        {
          title: 'The Ultimate Guide to Guest Communication',
          slug: 'ultimate-guide-guest-communication',
          excerpt: 'Learn how effective communication can lead to better reviews.',
          content: '<p>Communication is the cornerstone of a successful holiday home business.</p>',
          category: 'Guest Experience',
          tags: ['communication', 'guest-experience', 'tips'],
          author: 'Sarah Johnson',
          authorTitle: 'Guest Experience Manager',
          featuredImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800',
          isPublished: true,
          publishedAt: new Date('2024-02-01')
        },
        {
          title: 'Dubai Tourism Trends for 2024',
          slug: 'dubai-tourism-trends-2024',
          excerpt: 'Stay ahead of the curve with insights into the latest trends.',
          content: '<p>Dubai continues to be one of the world\'s top tourist destinations.</p>',
          category: 'Market Insights',
          tags: ['dubai', 'trends', 'market'],
          author: 'Ahmed Hassan',
          authorTitle: 'Market Analyst',
          featuredImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
          isPublished: true,
          publishedAt: new Date('2024-02-15')
        }
      ]);
      console.log('Default blog posts created');
    }

    // Check if case studies exist
    const caseStudyCount = await CaseStudy.countDocuments();
    if (caseStudyCount === 0) {
      await CaseStudy.create({
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
          { metric: 'Occupancy Rate', value: '85%' },
          { metric: 'Average Daily Rate', value: '+28%' }
        ],
        stats: [
          { value: '35%', label: 'Revenue Increase' },
          { value: '85%', label: 'Occupancy Rate' },
          { value: '4.9', label: 'Guest Rating' }
        ],
        featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        isPublished: true
      });
      console.log('Default case study created');
    }

    // Check if testimonials exist
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany([
        {
          name: 'Abir Chammah',
          title: 'Manager, Monty Holiday Home',
          company: 'Monty Holiday Home',
          content: 'CORE has been an absolute asset to our team. Their sharp eye for market trends, dynamic pricing strategies, and consistent focus on revenue growth have made a real impact on our performance.',
          rating: 5,
          isPublished: true
        },
        {
          name: 'Charlie Ridge',
          title: 'Owner, Farwell and Gervase',
          company: 'Farwell and Gervase',
          content: 'Working with CORE has been an absolute game changer for my Airbnb business in Dubai. Their expertise in revenue management and pricing strategy has helped me maximise my earnings.',
          rating: 5,
          isPublished: true
        }
      ]);
      console.log('Default testimonials created');
    }

    console.log('Seed data complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run seed after connection
mongoose.connection.once('open', () => {
  seedData();
});

// ==================== AUTHENTICATION MIDDLEWARE ====================

const authMiddleware = async (req, res, next) => {
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

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find({ isPublished: true }).select('slug title metaTitle metaDescription');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/pages', authMiddleware, async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/pages', authMiddleware, async (req, res) => {
  try {
    const page = new Page(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== BLOG POSTS API ====================

app.get('/api/blog-posts', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true })
      .sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/blog-posts/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/blog-posts/id/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/blog-posts', authMiddleware, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/blog-posts', authMiddleware, async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/blog-posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/blog-posts/:id', authMiddleware, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CASE STUDIES API ====================

app.get('/api/case-studies', async (req, res) => {
  try {
    const studies = await CaseStudy.find({ isPublished: true });
    res.json(studies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    const study = await CaseStudy.findOne({ slug: req.params.slug, isPublished: true });
    if (!study) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    res.json(study);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/case-studies/id/:id', async (req, res) => {
  try {
    const study = await CaseStudy.findById(req.params.id);
    if (!study) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    res.json(study);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/case-studies', authMiddleware, async (req, res) => {
  try {
    const studies = await CaseStudy.find().sort({ createdAt: -1 });
    res.json(studies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/case-studies', authMiddleware, async (req, res) => {
  try {
    const study = new CaseStudy(req.body);
    await study.save();
    res.status(201).json(study);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/case-studies/:id', authMiddleware, async (req, res) => {
  try {
    const study = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!study) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    res.json(study);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/case-studies/:id', authMiddleware, async (req, res) => {
  try {
    await CaseStudy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Case study deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== TESTIMONIALS API ====================

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== SETTINGS API ====================

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== STATS API ====================

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const [blogPosts, caseStudies, testimonials, pages] = await Promise.all([
      BlogPost.countDocuments(),
      CaseStudy.countDocuments(),
      Testimonial.countDocuments(),
      Page.countDocuments()
    ]);
    
    res.json({
      blogPosts,
      caseStudies,
      testimonials,
      pages,
      totalViews: '12.5K'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CONTACT FORM API ====================

app.post('/api/contact', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('message').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const submission = new ContactSubmission(req.body);
    await submission.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/contact-submissions', authMiddleware, async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/contact-submissions/:id/read', authMiddleware, async (req, res) => {
  try {
    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/contact-submissions/:id', authMiddleware, async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== BOOK A CALL API ====================

app.post('/api/book-a-call', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('preferredDate').notEmpty(),
  body('preferredTime').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/book-a-call', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/book-a-call/:id/status', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/book-a-call/:id', authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});
