const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String, // Only required for manual registration
  },
  avatar: {
    type: String,
    default: '',
  },
  assemblyName: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['registered_user', 'admin'],
    default: 'registered_user',
  },
  banned: {
    type: Boolean,
    default: false,
  },
  mustChangePassword: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
