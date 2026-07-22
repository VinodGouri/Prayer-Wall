const express = require('express');
const PrayerRequest = require('../models/PrayerRequest');
const PrayerAction = require('../models/PrayerAction');
const { auth, optionalAuth } = require('../middleware/auth');
const { getVerseForPrayer } = require('../utils/bibleVerses');

const router = express.Router();

// GET /api/prayers — List active prayers (public, with optional auth for "hasPrayed" flag)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, sort = 'newest', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { status: 'active', hidden: false };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { prayerText: { $regex: search, $options: 'i' } },
        { assemblyName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 }; // newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'most_prayed') sortOption = { prayerCount: -1 };

    const prayers = await PrayerRequest.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await PrayerRequest.countDocuments(filter);

    // If user is logged in, check which prayers they've prayed for
    let prayedSet = new Set();
    if (req.user) {
      const prayerIds = prayers.map(p => p._id);
      const actions = await PrayerAction.find({
        prayerId: { $in: prayerIds },
        userId: req.user._id,
      });
      prayedSet = new Set(actions.map(a => a.prayerId.toString()));
    }

    const result = prayers.map(p => ({
      ...p,
      name: p.anonymous ? 'Anonymous' : p.name,
      phone: undefined, // never expose phone publicly
      hasPrayed: prayedSet.has(p._id.toString()),
    }));

    res.json({
      prayers: result,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get prayers error:', error);
    res.status(500).json({ message: 'Error fetching prayers' });
  }
});

// POST /api/prayers — Create a new prayer request (supports guests)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, anonymous, category, prayerText, phone } = req.body;
    // Guest gets it from body, authenticated users get it from their profile
    const assemblyName = req.user ? req.user.assemblyName : req.body.assemblyName;
    const displayName = req.user ? (name || req.user.name) : (name || 'Guest');

    if (!category || !prayerText || !assemblyName) {
      return res.status(400).json({ message: 'Category, prayer text, and assembly name are required' });
    }

    if (prayerText.length > 500) {
      return res.status(400).json({ message: 'Prayer text must be 500 characters or less' });
    }

    const prayer = new PrayerRequest({
      userId: req.user?._id || undefined,
      name: displayName,
      anonymous: anonymous || false,
      category,
      prayerText,
      assemblyName,
      phone: phone || '',
    });

    // Attach a comforting Bible verse matched to the category + prayer text
    const verse = getVerseForPrayer(category, prayerText);
    prayer.bibleVerse = { reference: verse.reference, text: verse.text };

    await prayer.save();

    res.status(201).json({
      message: 'Your prayer has been shared with believers.',
      prayer,
    });
  } catch (error) {
    console.error('Create prayer error:', error);
    res.status(500).json({ message: 'Error creating prayer request' });
  }
});

// POST /api/prayers/:id/pray — "I'm Praying" action
router.post('/:id/pray', auth, async (req, res) => {
  try {
    const prayer = await PrayerRequest.findById(req.params.id);
    if (!prayer || prayer.status !== 'active') {
      return res.status(404).json({ message: 'Prayer not found or not active' });
    }

    // Check if already prayed
    const existing = await PrayerAction.findOne({
      prayerId: prayer._id,
      userId: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already prayed for this request' });
    }

    await PrayerAction.create({
      prayerId: prayer._id,
      userId: req.user._id,
    });

    prayer.prayerCount += 1;
    await prayer.save();

    res.json({ prayerCount: prayer.prayerCount });
  } catch (error) {
    console.error('Pray action error:', error);
    res.status(500).json({ message: 'Error recording prayer' });
  }
});

// POST /api/prayers/:id/answered — Mark prayer as answered (soft commit)
router.post('/:id/answered', optionalAuth, async (req, res) => {
  try {
    const prayer = await PrayerRequest.findById(req.params.id);

    if (!prayer) {
      return res.status(404).json({ message: 'Prayer not found' });
    }

    if (prayer.status !== 'active') {
      return res.status(400).json({ message: 'Prayer is not active' });
    }

    // Owner check: if prayer is owned by a registered user, require auth matching
    if (prayer.userId) {
      if (!req.user || prayer.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to mark this prayer as answered' });
      }
    }

    prayer.status = 'pending_answered';
    prayer.pendingAnsweredAt = new Date();
    await prayer.save();

    // Schedule auto-commit after 5 seconds
    setTimeout(async () => {
      try {
        const current = await PrayerRequest.findById(prayer._id);
        if (current && current.status === 'pending_answered') {
          current.status = 'answered';
          current.answeredAt = new Date();
          current.pendingAnsweredAt = null;
          await current.save();
        }
      } catch (err) {
        console.error('Auto-commit answered error:', err);
      }
    }, 5000);

    res.json({ message: 'Prayer marked as answered. You have 5 seconds to undo.' });
  } catch (error) {
    console.error('Mark answered error:', error);
    res.status(500).json({ message: 'Error marking prayer as answered' });
  }
});

// POST /api/prayers/:id/undo-answered — Undo within 5s grace window
router.post('/:id/undo-answered', optionalAuth, async (req, res) => {
  try {
    const prayer = await PrayerRequest.findById(req.params.id);

    if (!prayer) {
      return res.status(404).json({ message: 'Prayer not found' });
    }

    if (prayer.status !== 'pending_answered') {
      return res.status(400).json({ message: 'Cannot undo — prayer is already committed or active' });
    }

    // Owner check: if prayer is owned by a registered user, require auth matching
    if (prayer.userId) {
      if (!req.user || prayer.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to restore this prayer' });
      }
    }

    prayer.status = 'active';
    prayer.pendingAnsweredAt = null;
    await prayer.save();

    res.json({ message: 'Prayer restored to active.' });
  } catch (error) {
    console.error('Undo answered error:', error);
    res.status(500).json({ message: 'Error undoing answered status' });
  }
});

// GET /api/prayers/:id — Single prayer detail
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    // Validate that id looks like a valid MongoDB ObjectId before querying
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid prayer ID' });
    }

    const prayer = await PrayerRequest.findById(req.params.id).lean();
    if (!prayer) {
      return res.status(404).json({ message: 'Prayer not found' });
    }

    let hasPrayed = false;
    if (req.user) {
      const action = await PrayerAction.findOne({
        prayerId: prayer._id,
        userId: req.user._id,
      });
      hasPrayed = !!action;
    }

    res.json({
      ...prayer,
      name: prayer.anonymous ? 'Anonymous' : prayer.name,
      phone: undefined,
      hasPrayed,
    });
  } catch (error) {
    console.error('Get prayer error:', error);
    res.status(500).json({ message: 'Error fetching prayer' });
  }
});

module.exports = router;
