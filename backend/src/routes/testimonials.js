const express = require('express');
const Testimony = require('../models/Testimony');
const PrayerRequest = require('../models/PrayerRequest');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials — Public approved testimonials
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { status: 'approved' };

    const testimonials = await Testimony.find(filter)
      .sort({ approvedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'prayerId',
        select: 'name anonymous category prayerText assemblyName answeredAt prayerCount',
      })
      .populate({
        path: 'userId',
        select: 'name avatar',
      })
      .lean();

    const total = await Testimony.countDocuments(filter);

    // Filter by category on the prayer side if needed
    let result = testimonials.map(t => ({
      id: t._id,
      testimonyText: t.testimonyText,
      createdAt: t.createdAt,
      approvedAt: t.approvedAt,
      prayer: t.prayerId ? {
        name: t.prayerId.anonymous ? 'Anonymous' : t.prayerId.name,
        category: t.prayerId.category,
        prayerText: t.prayerId.prayerText,
        assemblyName: t.prayerId.assemblyName,
        answeredAt: t.prayerId.answeredAt,
        prayerCount: t.prayerId.prayerCount,
      } : null,
      user: t.userId ? {
        name: t.prayerId?.anonymous ? 'Anonymous' : t.userId.name,
        avatar: t.prayerId?.anonymous ? '' : t.userId.avatar,
      } : null,
    }));

    if (category && category !== 'all') {
      result = result.filter(t => t.prayer?.category === category);
    }

    res.json({
      testimonials: result,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
});

// POST /api/testimonials — Submit testimony for an answered prayer (supports guests)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { prayerId, testimonyText } = req.body;

    if (!prayerId || !testimonyText) {
      return res.status(400).json({ message: 'Prayer ID and testimony text are required' });
    }

    // Verify the prayer is answered
    const prayer = await PrayerRequest.findById(prayerId);

    if (!prayer) {
      return res.status(404).json({ message: 'Prayer request not found' });
    }

    if (prayer.status !== 'answered') {
      return res.status(400).json({ message: 'Testimonies can only be submitted for answered prayers' });
    }

    // Owner check: if prayer is owned by a registered user, require auth matching
    if (prayer.userId) {
      if (!req.user || prayer.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to submit testimony for this prayer' });
      }
    }

    // Check if testimony already exists
    const existing = await Testimony.findOne({ prayerId });
    if (existing) {
      return res.status(400).json({ message: 'Testimony already submitted for this prayer' });
    }

    const testimony = new Testimony({
      prayerId,
      userId: req.user?._id || undefined,
      testimonyText,
    });

    await testimony.save();

    res.status(201).json({
      message: 'Testimony submitted for admin approval.',
      testimony,
    });
  } catch (error) {
    console.error('Submit testimony error:', error);
    res.status(500).json({ message: 'Error submitting testimony' });
  }
});

module.exports = router;
