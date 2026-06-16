// server/models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  age: {
    type: Number
  },
  weight: {
    type: Number
  },
  height: {
    type: String
  },
  medicalHistory: {
    type: String
  },
  currentMedications: {
    type: String
  },
  symptoms: {
    type: String
  },
  goals: {
    type: String
  },
  preferredPeptides: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  trackingToken: {
    type: String,
    unique: true,
    sparse: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);