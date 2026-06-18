// server/routes/productRoutes.js
const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBestSellers,
  addLike
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getProducts);
router.get('/bestsellers', getBestSellers);

// ✅ Like AVANT /:id et SANS protect
router.put('/:id/like', addLike);

router.get('/:id', getProduct);

// Routes protégées (admin uniquement)
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;