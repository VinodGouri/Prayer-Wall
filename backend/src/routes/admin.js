const express = require('express');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const PrayerRequest = require('../models/PrayerRequest');
const Testimony = require('../models/Testimony');
const PrayerAction = require('../models/PrayerAction');

const router = express.Router();

// All admin routes require auth + admin middleware
router.use(auth, admin);

// GET /api/admin/dashboard — Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalPrayers,
      activePrayers,
      answeredPrayers,
      todayPrayers,
      pendingTestimonies,
      totalPrayerActions,
    ] = await Promise.all([
      User.countDocuments(),
      PrayerRequest.countDocuments(),
      PrayerRequest.countDocuments({ status: 'active' }),
      PrayerRequest.countDocuments({ status: 'answered' }),
      PrayerRequest.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Testimony.countDocuments({ status: 'pending' }),
      PrayerAction.countDocuments(),
    ]);

    // Category breakdown
    const categoryStats = await PrayerRequest.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Oldest active requests (for admin outreach)
    const oldestActive = await PrayerRequest.find({ status: 'active' })
      .sort({ createdAt: 1 })
      .limit(10)
      .populate('userId', 'name email')
      .lean();

    // Recent prayers for the management feed
    const recentPrayers = await PrayerRequest.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name email')
      .lean();

    res.json({
      stats: {
        totalUsers,
        totalPrayers,
        activePrayers,
        answeredPrayers,
        todayPrayers,
        pendingTestimonies,
        totalPrayerActions,
      },
      categoryStats,
      oldestActive,
      recentPrayers,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// GET /api/admin/testimonials/pending — Pending testimonies
router.get('/testimonials/pending', async (req, res) => {
  try {
    const testimonies = await Testimony.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate({
        path: 'prayerId',
        select: 'name category prayerText assemblyName anonymous',
      })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .lean();

    res.json({ testimonies });
  } catch (error) {
    console.error('Pending testimonies error:', error);
    res.status(500).json({ message: 'Error fetching pending testimonies' });
  }
});

// PATCH /api/admin/testimonials/:id/approve — Approve testimony
router.patch('/testimonials/:id/approve', async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);
    if (!testimony) {
      return res.status(404).json({ message: 'Testimony not found' });
    }

    testimony.status = 'approved';
    testimony.approvedBy = req.user._id;
    testimony.approvedAt = new Date();
    await testimony.save();

    res.json({ message: 'Testimony approved', testimony });
  } catch (error) {
    console.error('Approve testimony error:', error);
    res.status(500).json({ message: 'Error approving testimony' });
  }
});

// PATCH /api/admin/testimonials/:id/reject — Reject testimony
router.patch('/testimonials/:id/reject', async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);
    if (!testimony) {
      return res.status(404).json({ message: 'Testimony not found' });
    }

    testimony.status = 'rejected';
    await testimony.save();

    res.json({ message: 'Testimony rejected', testimony });
  } catch (error) {
    console.error('Reject testimony error:', error);
    res.status(500).json({ message: 'Error rejecting testimony' });
  }
});

// DELETE /api/admin/prayers/:id — Delete a prayer
router.delete('/prayers/:id', async (req, res) => {
  try {
    const prayer = await PrayerRequest.findByIdAndDelete(req.params.id);
    if (!prayer) {
      return res.status(404).json({ message: 'Prayer not found' });
    }

    // Also delete related actions
    await PrayerAction.deleteMany({ prayerId: req.params.id });

    res.json({ message: 'Prayer deleted' });
  } catch (error) {
    console.error('Delete prayer error:', error);
    res.status(500).json({ message: 'Error deleting prayer' });
  }
});

// PATCH /api/admin/prayers/:id — Hide/feature/lock a prayer
router.patch('/prayers/:id', async (req, res) => {
  try {
    const { hidden, featured } = req.body;
    const prayer = await PrayerRequest.findById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ message: 'Prayer not found' });
    }

    if (hidden !== undefined) prayer.hidden = hidden;
    if (featured !== undefined) prayer.featured = featured;
    await prayer.save();

    res.json({ message: 'Prayer updated', prayer });
  } catch (error) {
    console.error('Update prayer error:', error);
    res.status(500).json({ message: 'Error updating prayer' });
  }
});

// PATCH /api/admin/users/:id/ban — Ban a user
router.patch('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.banned = !user.banned;
    await user.save();

    res.json({ message: user.banned ? 'User banned' : 'User unbanned', user });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Error banning user' });
  }
});

// GET /api/admin/categories — List categories
router.get('/categories', async (req, res) => {
  try {
    const Category = require('../models/Category');
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
