// server/routes/categoryRoutes.js
const express = require('express');
const {
  getCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/', getCategories);           // GET /api/categories?section=peptides

// Admin only
router.get('/all', protect, admin, getAllCategories);
router.get('/:id', getCategory);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;