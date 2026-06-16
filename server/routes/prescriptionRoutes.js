// server/routes/prescriptionRoutes.js
const express = require('express');
const {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescriptionStatus,
  deletePrescription,
  trackPrescriptionByToken
} = require('../controllers/prescriptionController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createPrescription);
router.get('/track/:token', trackPrescriptionByToken);

// Protected routes (authentication required)
router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescription);
router.put('/:id/status', protect, admin, updatePrescriptionStatus);
router.delete('/:id', protect, admin, deletePrescription);

module.exports = router;