// server/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;