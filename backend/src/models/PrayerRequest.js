const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  prayerText: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
  },
  assemblyName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  prayerCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'pending_answered', 'answered'],
    default: 'active',
  },
  pendingAnsweredAt: {
    type: Date,
    default: null,
  },
  answeredAt: {
    type: Date,
    default: null,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  bibleVerse: {
    reference: { type: String, default: '' },
    text: { type: String, default: '' },
    referenceTe: { type: String, default: '' },
    textTe: { type: String, default: '' },
  },
}, { timestamps: true });

// Index for efficient queries
prayerRequestSchema.index({ status: 1, createdAt: -1 });
prayerRequestSchema.index({ userId: 1, status: 1 });
prayerRequestSchema.index({ category: 1 });
prayerRequestSchema.index({ prayerCount: -1 });

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
