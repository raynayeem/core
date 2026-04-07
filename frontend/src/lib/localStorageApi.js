// LocalStorage API fallback for when backend is not available
// This allows the admin panel to work for editing content

const STORAGE_KEYS = {
  BLOG_POSTS: 'core_blog_posts',
  CASE_STUDIES: 'core_case_studies',
  TESTIMONIALS: 'core_testimonials',
  PAGES: 'core_pages',
  SETTINGS: 'core_settings'
};

// Initialize with sample data if empty
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)) {
    const sampleBlogPosts = [
      {
        _id: '1',
        title: 'How to Maximize Your Holiday Home Revenue in Dubai',
        slug: 'maximize-holiday-home-revenue-dubai',
        excerpt: 'Discover proven strategies to increase your rental income and occupancy rates in Dubai\'s competitive holiday home market.',
        content: '<p>Dubai\'s holiday home market is one of the most lucrative in the world. With millions of tourists visiting each year, property owners have a unique opportunity to generate significant rental income.</p><h2>Understanding the Market</h2><p>The key to maximizing revenue is understanding seasonal demand patterns...</p>',
        category: 'Revenue Management',
        tags: ['dubai', 'revenue', 'tips'],
        author: 'CORE Team',
        authorTitle: 'Revenue Management Experts',
        featuredImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        isPublished: true,
        publishedAt: '2024-01-15T00:00:00.000Z',
        createdAt: '2024-01-10T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: '2',
        title: 'The Ultimate Guide to Guest Communication',
        slug: 'ultimate-guide-guest-communication',
        excerpt: 'Learn how effective communication can lead to better reviews, higher occupancy, and increased revenue.',
        content: '<p>Communication is the cornerstone of a successful holiday home business. From the moment a guest books until they check out, every interaction matters.</p><h2>Pre-Arrival Communication</h2><p>Setting expectations early is crucial...</p>',
        category: 'Guest Experience',
        tags: ['communication', 'guest-experience', 'tips'],
        author: 'Sarah Johnson',
        authorTitle: 'Guest Experience Manager',
        featuredImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800',
        isPublished: true,
        publishedAt: '2024-02-01T00:00:00.000Z',
        createdAt: '2024-01-25T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z'
      },
      {
        _id: '3',
        title: 'Dubai Tourism Trends for 2024',
        slug: 'dubai-tourism-trends-2024',
        excerpt: 'Stay ahead of the curve with insights into the latest trends shaping Dubai\'s tourism and hospitality sector.',
        content: '<p>Dubai continues to be one of the world\'s top tourist destinations. Understanding the trends can help you position your property for success.</p><h2>Key Trends</h2><p>1. Extended stays are becoming more popular...</p>',
        category: 'Market Insights',
        tags: ['dubai', 'trends', 'market'],
        author: 'Ahmed Hassan',
        authorTitle: 'Market Analyst',
        featuredImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        isPublished: true,
        publishedAt: '2024-02-15T00:00:00.000Z',
        createdAt: '2024-02-10T00:00:00.000Z',
        updatedAt: '2024-02-15T00:00:00.000Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(sampleBlogPosts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CASE_STUDIES)) {
    const sampleCaseStudies = [
      {
        _id: '1',
        title: 'How We Increased Revenue by 35% for a Palm Jumeirah Villa',
        slug: 'palm-jumeirah-villa-revenue-increase',
        client: 'Luxury Villa Owner',
        clientName: 'Mohammed Al-Rashid',
        clientLocation: 'Palm Jumeirah, Dubai',
        propertyType: 'Villa',
        excerpt: 'A comprehensive case study on how dynamic pricing and strategic marketing transformed a luxury villa\'s performance.',
        content: '<p>When we first started working with this Palm Jumeirah villa, the owner was struggling with inconsistent bookings and below-market rates.</p><h2>The Challenge</h2><p>The property was beautiful but underperforming...</p>',
        challenge: 'Low occupancy rates and below-market pricing despite a premium location.',
        solution: 'Implemented dynamic pricing strategy and enhanced listing optimization.',
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
        isPublished: true,
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(sampleCaseStudies));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    const sampleTestimonials = [
      {
        _id: '1',
        name: 'Abir Chammah',
        title: 'Manager, Monty Holiday Home',
        company: 'Monty Holiday Home',
        content: 'CORE has been an absolute asset to our team. Their sharp eye for market trends, dynamic pricing strategies, and consistent focus on revenue growth have made a real impact on our performance.',
        rating: 5,
        isPublished: true,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: '2',
        name: 'Charlie Ridge',
        title: 'Owner, Farwell and Gervase',
        company: 'Farwell and Gervase',
        content: 'Working with CORE has been an absolute game changer for my Airbnb business in Dubai. Their expertise in revenue management and pricing strategy has helped me maximise my earnings.',
        rating: 5,
        isPublished: true,
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: '2024-02-01T00:00:00.000Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(sampleTestimonials));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PAGES)) {
    const samplePages = [
      {
        _id: '1',
        slug: 'home',
        title: 'Home',
        content: {
          hero: {
            title: 'Operating Partner for Holiday Home Businesses',
            subtitle: 'We built the infrastructure so you don\'t have to.'
          }
        },
        metaTitle: 'CORE - Holiday Home Management Dubai',
        metaDescription: 'The operating partner for holiday home businesses in Dubai.',
        isPublished: true,
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(samplePages));
  }
};

// Initialize data
initializeData();

// Blog Posts
export const getBlogPosts = () => {
  const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
  return JSON.parse(data || '[]');
};

export const getBlogPostById = (id) => {
  const posts = getBlogPosts();
  return posts.find(p => p._id === id);
};

export const getBlogPostBySlug = (slug) => {
  const posts = getBlogPosts();
  return posts.find(p => p.slug === slug);
};

export const createBlogPost = (data) => {
  const posts = getBlogPosts();
  const newPost = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  posts.push(newPost);
  localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
  return newPost;
};

export const updateBlogPost = (id, data) => {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p._id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
    return posts[index];
  }
  throw new Error('Post not found');
};

export const deleteBlogPost = (id) => {
  const posts = getBlogPosts();
  const filtered = posts.filter(p => p._id !== id);
  localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(filtered));
};

// Case Studies
export const getCaseStudies = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CASE_STUDIES);
  return JSON.parse(data || '[]');
};

export const getCaseStudyById = (id) => {
  const studies = getCaseStudies();
  return studies.find(s => s._id === id);
};

export const getCaseStudyBySlug = (slug) => {
  const studies = getCaseStudies();
  return studies.find(s => s.slug === slug);
};

export const createCaseStudy = (data) => {
  const studies = getCaseStudies();
  const newStudy = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  studies.push(newStudy);
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(studies));
  return newStudy;
};

export const updateCaseStudy = (id, data) => {
  const studies = getCaseStudies();
  const index = studies.findIndex(s => s._id === id);
  if (index !== -1) {
    studies[index] = { ...studies[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(studies));
    return studies[index];
  }
  throw new Error('Case study not found');
};

export const deleteCaseStudy = (id) => {
  const studies = getCaseStudies();
  const filtered = studies.filter(s => s._id !== id);
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(filtered));
};

// Testimonials
export const getTestimonials = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
  return JSON.parse(data || '[]');
};

export const getTestimonialById = (id) => {
  const testimonials = getTestimonials();
  return testimonials.find(t => t._id === id);
};

export const createTestimonial = (data) => {
  const testimonials = getTestimonials();
  const newTestimonial = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  testimonials.push(newTestimonial);
  localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  return newTestimonial;
};

export const updateTestimonial = (id, data) => {
  const testimonials = getTestimonials();
  const index = testimonials.findIndex(t => t._id === id);
  if (index !== -1) {
    testimonials[index] = { ...testimonials[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return testimonials[index];
  }
  throw new Error('Testimonial not found');
};

export const deleteTestimonial = (id) => {
  const testimonials = getTestimonials();
  const filtered = testimonials.filter(t => t._id !== id);
  localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(filtered));
};

// Pages
export const getPages = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PAGES);
  return JSON.parse(data || '[]');
};

export const getPageBySlug = (slug) => {
  const pages = getPages();
  return pages.find(p => p.slug === slug);
};

export const createPage = (data) => {
  const pages = getPages();
  const newPage = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  pages.push(newPage);
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  return newPage;
};

export const updatePage = (id, data) => {
  const pages = getPages();
  const index = pages.findIndex(p => p._id === id);
  if (index !== -1) {
    pages[index] = { ...pages[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
    return pages[index];
  }
  throw new Error('Page not found');
};

export const deletePage = (id) => {
  const pages = getPages();
  const filtered = pages.filter(p => p._id !== id);
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(filtered));
};

// Settings
export const getSettings = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return JSON.parse(data || '{}');
};

export const updateSettings = (data) => {
  const settings = getSettings();
  const updated = { ...settings, ...data };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
};
