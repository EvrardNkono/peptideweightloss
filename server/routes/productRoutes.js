// server/routes/productRoutes.js
const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestSellers,
  toggleLike  // ✅ toggleLike au lieu de addLike
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getProducts);
router.get('/bestsellers', getBestSellers);
router.get('/:id', getProduct);

// ✅ Route like — protect obligatoire pour req.user
router.put('/:id/like', protect, toggleLike);

// Routes admin
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;