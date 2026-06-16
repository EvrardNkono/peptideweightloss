// server/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;