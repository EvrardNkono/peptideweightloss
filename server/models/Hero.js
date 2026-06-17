// server/models/Hero.js
const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  images: {
    type: [String],
    default: ['/images/pept.png'],
    validate: {
      validator: function(arr) {
        return arr.length <= 4;
      },
      message: 'Maximum 4 images allowed'
    }
  },
  title: {
    type: String,
    default: 'Premium Peptides For Weight Loss'
  },
  subtitle: {
    type: String,
    default: 'Your fully licensed corporate distributor for premium peptides, SARMs, and clinical-grade research compounds'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hero', heroSchema);