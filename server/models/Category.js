// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'Package'
  },
  color: {
    type: String,
    default: '#2563EB'
  },
  bgColor: {
    type: String,
    default: '#EFF6FF'
  },
  section: {
    type: String,
    enum: ['peptides', 'marketplace'],
    required: [true, 'Section is required (peptides or marketplace)'],
    default: 'marketplace'
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// CORRECTION ICI : Changé 'save' pour 'validate' et passage en ASYNC (sans next)
categorySchema.pre('validate', function () {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Nettoie aussi les tirets au début et à la fin
  }
});

module.exports = mongoose.model('Category', categorySchema);