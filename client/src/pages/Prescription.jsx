// src/pages/Prescription.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Stethoscope, 
  FileText, 
  Clock, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Shield,
  AlertCircle,
  Star,
  Award,
  Heart,
  Microscope,
  Activity,
  Calendar,
  Loader2
} from 'lucide-react';

// ✅ CONFIGURATION AUTOMATIQUE DE L'URL BACKEND
const getApiUrl = () => {
  // En production (Vercel), on utilise l'URL du backend déployé
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  // En développement (local), on utilise localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
console.log(`🔧 Prescription - API URL: ${API_URL}`); // Pour vérifier en console

const Prescription = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    medicalHistory: '',
    currentMedications: '',
    symptoms: '',
    goals: '',
    preferredPeptides: '',
    additionalInfo: ''
  });
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const experts = [
    {
      name: 'Dr. Bradley Hotwinks',
      title: 'Chief Medical Officer',
      specialty: 'Peptide Therapy & Metabolic Health',
      experience: '20+ years',
      rating: 4.9,
      reviews: 567,
      badge: 'Board Certified Endocrinologist',
      available: true,
      bio: 'Leading expert in peptide therapeutics with over 20 years of clinical experience. Published author in leading medical journals.',
      image: '/images/bradley.webp'
    },
    {
      name: 'Dr. Sarah Thompson',
      title: 'Senior Endocrinologist',
      specialty: 'Weight Management & Metabolic Disorders',
      experience: '15+ years',
      rating: 4.9,
      reviews: 234,
      badge: 'Board Certified',
      available: true,
      bio: 'Specializes in metabolic health and peptide-based weight management protocols.',
      image: '/images/sarah.webp'
    },
    {
      name: 'Dr. Michael Chen',
      title: 'Clinical Pharmacologist',
      specialty: 'Peptide Research & Development',
      experience: '12+ years',
      rating: 4.8,
      reviews: 189,
      badge: 'PhD in Pharmacology',
      available: true,
      bio: 'Expert in peptide pharmacology and therapeutic applications.',
      image: '/images/michel.webp'
    },
    {
      name: 'Dr. Emily Rodriguez',
      title: 'Functional Medicine Specialist',
      specialty: 'Integrative Health & Nutrition',
      experience: '10+ years',
      rating: 4.9,
      reviews: 156,
      badge: 'Integrative Medicine',
      available: true,
      bio: 'Holistic approach to peptide therapy combined with nutrition and lifestyle optimization.',
      image: '/images/emily.webp'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.post(`${API_URL}/prescriptions`, formData, config);
      
      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting prescription:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your consultation request. Our medical team will review your information 
              and respond within 24-48 hours.
            </p>
            
            <Link 
              to="/my-prescriptions" 
              className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1E40AF] transition mb-3 w-full"
            >
              <FileText size={18} />
              View My Prescriptions
            </Link>
            
            <button
              onClick={() => { 
                setIsSubmitted(false); 
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  age: '',
                  weight: '',
                  height: '',
                  medicalHistory: '',
                  currentMedications: '',
                  symptoms: '',
                  goals: '',
                  preferredPeptides: '',
                  additionalInfo: ''
                }); 
                setSelectedExpert(null);
              }}
              className="w-full border border-gray-300 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/prescription.jpeg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Stethoscope size={14} className="text-white" />
              <span className="text-sm font-semibold text-white tracking-wide">MEDICAL CONSULTATION</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Get Professional 
              <span className="block text-yellow-200">Medical Guidance</span>
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Consult with our expert medical team for personalized peptide recommendations and prescriptions
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'request' 
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Request Consultation
          </button>
          <button
            onClick={() => setActiveTab('experts')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'experts' 
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Our Experts
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'info' 
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Medical Information
          </button>
        </div>

        {/* Tab: Request Consultation */}
        {activeTab === 'request' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Consultation Request</h2>
                <p className="text-gray-500 mb-6">Fill out the form below and our medical team will review your case</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="John Smith"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                        placeholder="Years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                        placeholder="kg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                    <textarea
                      rows={3}
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                      placeholder="Please describe any relevant medical conditions, past surgeries, or health concerns..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                    <textarea
                      rows={2}
                      value={formData.currentMedications}
                      onChange={(e) => setFormData({...formData, currentMedications: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                      placeholder="List any medications or supplements you are currently taking..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Goals</label>
                    <textarea
                      rows={2}
                      value={formData.goals}
                      onChange={(e) => setFormData({...formData, goals: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                      placeholder="What are your primary health and wellness goals?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Peptides (Optional)</label>
                    <input
                      type="text"
                      value={formData.preferredPeptides}
                      onChange={(e) => setFormData({...formData, preferredPeptides: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                      placeholder="e.g., Semaglutide, Tirzepatide, BPC-157..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                    <textarea
                      rows={2}
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                      placeholder="Any other information you'd like to share..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : null}
                    {loading ? 'Submitting...' : 'Submit Consultation Request'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-[#2563EB]" />
                  <h3 className="font-bold text-gray-800">Response Time</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Our medical team typically responds within 24-48 hours. 
                  Urgent inquiries will be prioritized.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={24} className="text-[#10B981]" />
                  <h3 className="font-bold text-gray-800">Confidentiality</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  All medical information is kept strictly confidential 
                  and compliant with healthcare privacy regulations (HIPAA).
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={24} className="text-[#F59E0B]" />
                  <h3 className="font-bold text-gray-800">Important Note</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  This is a consultation request. Final prescriptions require 
                  a formal medical evaluation and may be subject to local regulations.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={24} className="text-[#2563EB]" />
                  <h3 className="font-bold text-gray-800">Track Your Requests</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  View the status of your consultation requests and medical feedback.
                </p>
                <Link 
                  to="/my-prescriptions" 
                  className="inline-flex items-center gap-2 text-[#2563EB] font-medium text-sm hover:underline"
                >
                  Go to My Prescriptions →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Our Experts */}
        {activeTab === 'experts' && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Meet Our Medical Experts</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Our team of board-certified physicians and pharmacologists specialize in peptide therapy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experts.map((expert, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-56 bg-gradient-to-br from-[#2563EB]/5 to-[#10B981]/5 flex items-center justify-center overflow-hidden">
                    <img 
                      src={expert.image} 
                      alt={expert.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(expert.name) + '&background=2563EB&color=fff&size=128';
                      }}
                    />
                  </div>
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#F59E0B]/10 rounded-full px-2 py-0.5 text-xs text-[#D97706] mb-2">
                      <Star size={10} className="fill-[#F59E0B]" />
                      {expert.rating} ({expert.reviews} reviews)
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{expert.name}</h3>
                    <p className="text-sm text-[#2563EB] font-medium mb-1">{expert.title}</p>
                    <p className="text-sm text-gray-500 mb-2">{expert.specialty}</p>
                    <div className="flex justify-center gap-2 mb-4 flex-wrap">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{expert.experience}</span>
                      <span className="text-xs bg-[#2563EB]/10 text-[#2563EB] px-2 py-1 rounded-full">{expert.badge}</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('request')}
                      className="w-full border border-[#2563EB] text-[#2563EB] py-2 rounded-lg font-medium hover:bg-[#2563EB] hover:text-white transition"
                    >
                      Request Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Medical Information */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Prescription Process</h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Submit Request', desc: 'Fill out the consultation form with your medical history and goals' },
                  { step: 2, title: 'Expert Review', desc: 'Our medical team reviews your information within 24-48 hours' },
                  { step: 3, title: 'Medical Evaluation', desc: 'Receive a personalized medical evaluation and recommendation' },
                  { step: 4, title: 'Prescription', desc: 'Get your prescription if medically appropriate' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#2563EB] font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#10B981] mt-0.5" />
                    <span className="text-gray-600">Valid government-issued ID</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#10B981] mt-0.5" />
                    <span className="text-gray-600">Complete medical history documentation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#10B981] mt-0.5" />
                    <span className="text-gray-600">Recent blood work (if available)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#10B981] mt-0.5" />
                    <span className="text-gray-600">List of current medications</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Medical Disclaimer</h3>
                    <p className="text-sm text-gray-600">
                      Prescriptions are issued at the discretion of licensed physicians. 
                      Not all requests will result in a prescription. This service is not 
                      a substitute for emergency medical care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescription;