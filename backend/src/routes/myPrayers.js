const express = require('express');
const PrayerRequest = require('../models/PrayerRequest');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/my-prayers/active — User's active prayers
router.get('/active', auth, async (req, res) => {
  try {
    const prayers = await PrayerRequest.find({
      userId: req.user._id,
      status: { $in: ['active', 'pending_answered'] },
    }).sort({ createdAt: -1 }).lean();

    res.json({ prayers });
  } catch (error) {
    console.error('My active prayers error:', error);
    res.status(500).json({ message: 'Error fetching active prayers' });
  }
});

// GET /api/my-prayers/answered — User's answered prayers
router.get('/answered', auth, async (req, res) => {
  try {
    const prayers = await PrayerRequest.find({
      userId: req.user._id,
      status: 'answered',
    }).sort({ answeredAt: -1 }).lean();

    // Check if testimony exists for each
    const Testimony = require('../models/Testimony');
    const prayerIds = prayers.map(p => p._id);
    const testimonies = await Testimony.find({ prayerId: { $in: prayerIds } }).lean();
    const testimonyMap = {};
    testimonies.forEach(t => {
      testimonyMap[t.prayerId.toString()] = t;
    });

    const result = prayers.map(p => ({
      ...p,
      testimony: testimonyMap[p._id.toString()] || null,
    }));

    res.json({ prayers: result });
  } catch (error) {
    console.error('My answered prayers error:', error);
    res.status(500).json({ message: 'Error fetching answered prayers' });
  }
});

module.exports = router;
