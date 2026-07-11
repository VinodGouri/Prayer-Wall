const mongoose = require('mongoose');

const testimonySchema = new mongoose.Schema({
  prayerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrayerRequest',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  testimonyText: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  approvedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

testimonySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Testimony', testimonySchema);
