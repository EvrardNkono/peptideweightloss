// server/controllers/prescriptionController.js
const Prescription = require('../models/Prescription');
const crypto = require('crypto');
const { sendTrackingEmail } = require('../config/email');

// @desc    Create a new prescription request
// @route   POST /api/prescriptions
// @access  Public (no auth required)
exports.createPrescription = async (req, res) => {
  try {
    // Generate unique tracking token
    const trackingToken = crypto.randomBytes(32).toString('hex');
    
    const prescriptionData = {
      ...req.body,
      userId: req.user?._id || null,
      trackingToken: trackingToken,
      status: 'pending'
    };
    
    const prescription = await Prescription.create(prescriptionData);
    
    // Send tracking email
    try {
      await sendTrackingEmail(prescription.email, prescription.name, trackingToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't block the request if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Prescription request submitted successfully. A tracking link has been sent to your email.',
      data: {
        _id: prescription._id,
        trackingToken: trackingToken
      }
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Track prescription by token (public)
// @route   GET /api/prescriptions/track/:token
// @access  Public
exports.trackPrescriptionByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const prescription = await Prescription.findOne({ trackingToken: token });
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        _id: prescription._id,
        name: prescription.name,
        email: prescription.email,
        status: prescription.status,
        notes: prescription.notes,
        preferredPeptides: prescription.preferredPeptides,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt
      }
    });
  } catch (error) {
    console.error('Error tracking prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get prescriptions (admin sees all, user sees theirs)
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res) => {
  try {
    let query = {};
    
    if (!req.user?.isAdmin) {
      query = { userId: req.user?._id };
    }
    
    const prescriptions = await Prescription.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    // Check authorization
    if (!req.user?.isAdmin && prescription.userId?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prescription'
      });
    }
    
    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update prescription status (admin only)
// @route   PUT /api/prescriptions/:id/status
// @access  Private/Admin
exports.updatePrescriptionStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes: notes || null,
        reviewedBy: req.user?.name || 'Admin',
        reviewedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    res.json({
      success: true,
      message: `Prescription status updated to ${status}`,
      data: prescription
    });
  } catch (error) {
    console.error('Error updating prescription status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete prescription (admin only)
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};