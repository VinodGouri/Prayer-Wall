const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const getUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  assemblyName: user.assemblyName,
});

// POST /api/auth/register (Email/Password)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      token: generateToken(user),
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login (Email/Password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.banned) {
      return res.status(403).json({ message: 'Account has been suspended' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Please sign in with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user),
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    
    if (!email || !googleId) {
      return res.status(400).json({ message: 'Google account missing email or ID' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        avatar: avatar || '',
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
    }

    if (user.banned) {
      return res.status(403).json({ message: 'Account has been suspended' });
    }

    res.json({
      token: generateToken(user),
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ message: 'Invalid Google login' });
  }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { assemblyName } = req.body;
    
    if (assemblyName) {
      req.user.assemblyName = assemblyName;
      await req.user.save();
    }

    res.json({ user: getUserResponse(req.user) });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: getUserResponse(req.user) });
});

module.exports = router;
