// server/routes/productRoutes.js
const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBestSellers,
  addLike  // ✅ IMPORT de la nouvelle fonction
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getProducts);
router.get('/bestsellers', getBestSellers);
router.get('/:id', getProduct);

// ✅ Route pour ajouter un like (protégée - utilisateur connecté)
router.put('/:id/like', protect, addLike);

// Routes protégées (admin uniquement)
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;