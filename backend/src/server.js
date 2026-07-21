require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const prayerRoutes = require('./routes/prayers');
const myPrayerRoutes = require('./routes/myPrayers');
const testimonialRoutes = require('./routes/testimonials');
const adminRoutes = require('./routes/admin');
const { seedCategories } = require('./utils/seedCategories');
const { seedAdmin } = require('./utils/seedAdmin');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, '')); // strip trailing slashes

console.log('🌐 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Normalize: strip trailing slash from incoming origin
    const normalizedOrigin = origin.replace(/\/+$/, '');
    // Allow any *.vercel.app subdomain (covers all preview/branch deployments)
    if (normalizedOrigin.endsWith('.vercel.app')) return callback(null, true);
    // Allow explicitly listed origins (localhost, custom domains, etc.)
    if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
    console.warn('⚠️ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/my-prayers', myPrayerRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Prayer Wall Backend is running 🙏' });
});

// Categories endpoint (public)
app.get('/api/categories', async (req, res) => {
  try {
    const Category = require('./models/Category');
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Start server
const start = async () => {
  await connectDB();
  await seedCategories();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`🙏 Prayer Wall Backend running on port ${PORT}`);
  });
};

start();
