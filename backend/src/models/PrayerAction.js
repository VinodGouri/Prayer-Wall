const mongoose = require('mongoose');

const prayerActionSchema = new mongoose.Schema({
  prayerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrayerRequest',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Enforce one prayer action per user per request
prayerActionSchema.index({ prayerId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('PrayerAction', prayerActionSchema);
