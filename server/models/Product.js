// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['peptide', 'blend', 'sarm', 'steroid', 'hgh', 'pct', 'weight-loss', 'african'],
    required: true,
    default: 'peptide'
  },
  
  // ✅ NOUVEAU : More Details (remplace dosage pour plus d'infos)
  moreDetails: {
    type: String,
    default: '',
    trim: true
  },
  
  // ✅ NOUVEAU : Product Description
  description: {
    type: String,
    default: '',
    trim: true
  },
  
  // ✅ Gardé pour compatibilité (mais sera progressivement remplacé par moreDetails)
  dosage: {
    type: String,
    default: ''
  },
  
  purity: {
    type: String,
    default: '≥99%'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: '/images/pept.png'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // ✅ NOUVEAU : Likes (Popularité)
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('Product', productSchema);