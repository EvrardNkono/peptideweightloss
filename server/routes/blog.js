// backend/routes/blog.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { protect, admin } = require('../middleware/auth');

// ============================================================
// GET - Récupérer tous les articles (public)
// ============================================================
router.get('/', async (req, res) => {
  try {
    const { category, status, featured, limit = 20, page = 1 } = req.query;
    
    const query = {};
    
    // Filtrer par catégorie
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Filtrer par statut (par défaut: seulement publiés)
    if (status) {
      query.status = status;
    } else {
      query.status = 'published';
    }
    
    // Filtrer par featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET - Récupérer tous les articles (admin seulement)
// ============================================================
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET - Récupérer un article par ID (public)
// ============================================================
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Incrémenter les vues
    post.views += 1;
    await post.save();
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET - Récupérer un article par slug (public)
// ============================================================
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Incrémenter les vues
    post.views += 1;
    await post.save();
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// POST - Créer un article (admin seulement)
// ============================================================
router.post('/', protect, admin, async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();
    
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    // Gestion des erreurs de validation
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PUT - Mettre à jour un article (admin seulement)
// ============================================================
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// DELETE - Supprimer un article (admin seulement)
// ============================================================
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// POST - Ajouter un like à un article (public)
// ============================================================
router.post('/:id/like', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    post.likes += 1;
    await post.save();
    
    res.json({ success: true, data: { likes: post.likes } });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET - Récupérer les articles populaires (public)
// ============================================================
router.get('/popular/limit', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(limit);
    
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET - Récupérer les catégories avec le nombre d'articles
// ============================================================
router.get('/categories/stats', async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;