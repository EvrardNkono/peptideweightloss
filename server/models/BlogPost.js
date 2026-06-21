// backend/models/BlogPost.js
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'GLP-1 Agonists',
      'Peptide Blends',
      'Growth Hormones',
      'Healing Peptides',
      'SARMs',
      'Research Guides',
      'Research Trends'
    ]
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorRole: {
    type: String,
    default: '',
    trim: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  image: {
    type: String,
    default: '/images/blog/default.jpg'
  },
  tags: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// ✅ Générer un slug à partir du titre avant de sauvegarder
BlogPostSchema.pre('save', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// ✅ Index pour la recherche
BlogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('BlogPost', BlogPostSchema);