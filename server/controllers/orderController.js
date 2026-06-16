// server/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, guestEmail } = req.body;
    let userId = req.user ? req.user.id : null;
    
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      total += product.price * item.quantity;
    }
    
    const order = await Order.create({
      userId,
      guestEmail: userId ? null : guestEmail,
      items,
      total,
      shippingAddress,
      paymentMethod
    });
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};