// src/pages/MyPrescriptions.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Clock, CheckCircle, AlertCircle, Eye, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const MyPrescriptions = ({ token }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> };
      case 'reviewed':
        return { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: <FileText size={14} /> };
      case 'approved':
        return { label: 'Approved', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> };
      case 'rejected':
        return { label: 'Not Approved', color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: null };
    }
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const storedToken = token || localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      
      try {
        const config = { headers: { Authorization: `Bearer ${storedToken}` } };
        const res = await axios.get(`${API_URL}/prescriptions`, config);
        setPrescriptions(res.data.data || []);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        if (error.response?.status === 401) {
          console.log('Unauthorized - please login again');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Prescription Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Track the status of your medical consultation requests</p>
        </div>
        
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Requests</h3>
            <p className="text-gray-400">You haven't submitted any prescription requests yet</p>
            <Link 
              to="/prescription" 
              className="inline-block mt-4 px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition"
            >
              Submit a Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const status = getStatusBadge(prescription.status);
              return (
                <div key={prescription._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {prescription._id.slice(-8)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Submitted on {new Date(prescription.createdAt).toLocaleDateString('en-US')}
                      </p>
                      <p className="font-medium text-gray-800 mt-2">
                        {prescription.preferredPeptides || 'No peptides specified'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPrescription(prescription);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye size={18} />
                      <span className="text-sm">Details</span>
                    </button>
                  </div>
                  
                  {/* Doctor's Note - visible for non-pending statuses */}
                  {prescription.notes && prescription.status !== 'pending' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium mb-1">📋 Doctor's Note:</p>
                      <p className="text-sm text-blue-800">{prescription.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedPrescription && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Patient Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 block">Full Name</label>
                      <p className="font-medium text-gray-800">{selectedPrescription.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Email</label>
                      <p className="font-medium text-gray-800">{selectedPrescription.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Phone</label>
                      <p className="font-medium text-gray-800">{selectedPrescription.phone || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Age / Weight</label>
                      <p className="font-medium text-gray-800">{selectedPrescription.age || '-'} years / {selectedPrescription.weight || '-'} kg</p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Medical Information</h3>
                  <div>
                    <label className="text-xs text-gray-500 block">Medical History</label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedPrescription.medicalHistory || '-'}</p>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs text-gray-500 block">Current Medications</label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedPrescription.currentMedications || '-'}</p>
                  </div>
                </div>

                {/* Health Goals */}
                <div>
                  <label className="text-xs text-gray-500 block">Health Goals</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedPrescription.goals || '-'}</p>
                </div>

                {/* Preferred Peptides */}
                <div>
                  <label className="text-xs text-gray-500 block">Preferred Peptides</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedPrescription.preferredPeptides || '-'}</p>
                </div>

                {/* Additional Info */}
                {selectedPrescription.additionalInfo && (
                  <div>
                    <label className="text-xs text-gray-500 block">Additional Information</label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedPrescription.additionalInfo}</p>
                  </div>
                )}

                {/* Doctor's Note - Important */}
                {selectedPrescription.notes && (
                  <div className="border-t pt-4 mt-2">
                    <label className="text-xs text-gray-500 block flex items-center gap-1">
                      <span className="text-blue-600">👨‍⚕️</span> Doctor's Note
                    </label>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg mt-1 text-blue-800 border border-blue-200">
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="border-t pt-4 mt-2">
                  <label className="text-xs text-gray-500 block">Current Status</label>
                  <div className="mt-2">
                    {(() => {
                      const status = getStatusBadge(selectedPrescription.status);
                      return (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Submission Info */}
                <div className="border-t pt-4 text-xs text-gray-400">
                  <p>Request ID: {selectedPrescription._id}</p>
                  <p>Submitted: {new Date(selectedPrescription.createdAt).toLocaleString('en-US')}</p>
                  {selectedPrescription.reviewedAt && (
                    <p>Last Updated: {new Date(selectedPrescription.reviewedAt).toLocaleString('en-US')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;