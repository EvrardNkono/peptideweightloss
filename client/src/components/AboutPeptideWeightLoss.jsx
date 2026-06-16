// src/components/AboutPeptideWeightLoss.jsx
import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  FlaskConical, 
  Award, 
  Truck, 
  Clock, 
  CheckCircle, 
  Users, 
  Heart, 
  Microscope,
  Star,
  TrendingUp,
  Zap,
  Activity
} from 'lucide-react';

const AboutPeptideWeightLoss = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: "10k+", label: "Happy Customers", icon: <Users size={24} />, color: "#2563EB" },
    { value: "98%", label: "Success Rate", icon: <TrendingUp size={24} />, color: "#10B981" },
    { value: "50+", label: "Research Papers", icon: <Microscope size={24} />, color: "#F59E0B" },
    { value: "24/7", label: "Expert Support", icon: <Clock size={24} />, color: "#2563EB" }
  ];

  const values = [
    {
      title: "Premium Quality",
      description: "All our peptides are tested in third-party laboratories with 99.5% purity guaranteed.",
      icon: <FlaskConical size={28} />,
      color: "#2563EB"
    },
    {
      title: "Scientific Excellence",
      description: "Backed by cutting-edge research and developed by leading scientists in peptide therapy.",
      icon: <Microscope size={28} />,
      color: "#10B981"
    },
    {
      title: "Customer First",
      description: "Dedicated 24/7 support team to guide you through your weight loss journey.",
      icon: <Heart size={28} />,
      color: "#F59E0B"
    },
    {
      title: "Global Shipping",
      description: "Discreet worldwide delivery with tracking and insurance for every order.",
      icon: <Truck size={28} />,
      color: "#2563EB"
    }
  ];

  const certifications = [
    { name: "GMP Certified", icon: <Shield size={16} />, color: "#2563EB" },
    { name: "ISO 9001:2024", icon: <Award size={16} />, color: "#10B981" },
    { name: "FDA Registered", icon: <CheckCircle size={16} />, color: "#F59E0B" },
    { name: "3rd Party Tested", icon: <FlaskConical size={16} />, color: "#2563EB" }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 rounded-full px-4 py-1.5 mb-4">
            <Activity size={14} className="text-[#2563EB]" />
            <span className="text-xs font-semibold text-[#2563EB] tracking-wide">ABOUT US</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Who We Are
          </h2>
          <p className={`text-gray-500 max-w-2xl mx-auto text-lg transition-all duration-700 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            PeptideWeightLoss is a leading provider of premium research peptides dedicated to advancing health and wellness.
          </p>
        </div>

        {/* Histoire / Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className={`transition-all duration-700 delay-200 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2563EB]/10 via-[#10B981]/10 to-[#F59E0B]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                    <Zap size={24} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full" />
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To provide researchers and health enthusiasts with the highest quality peptides, backed by scientific excellence and uncompromising standards of purity.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every product in our catalog undergoes rigorous third-party testing to ensure 99.5% purity, so you can focus on what matters most — achieving your goals.
                </p>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#F59E0B]/10 via-[#10B981]/10 to-[#2563EB]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                    <Heart size={24} className="text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Our Promise</h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#10B981] to-[#F59E0B] rounded-full" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "100% transparent lab results",
                    "Discreet packaging & shipping",
                    "24/7 expert customer support",
                    "30-day satisfaction guarantee"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#10B981]" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Valeurs / Pourquoi nous */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Why Choose PeptideWeightLoss</h3>
            <p className="text-gray-500">We set the standard for quality and service in the peptide industry</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${value.color}15` }}>
                  <div style={{ color: value.color }}>{value.icon}</div>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${stat.color}15` }}>
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-md border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Certifications & Compliance</h3>
            <p className="text-gray-500 text-sm">We operate under the highest industry standards</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <div style={{ color: cert.color }}>{cert.icon}</div>
                <span className="text-sm font-medium text-gray-700">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2">
            <Activity size={20} className="text-[#2563EB]" />
            <span className="font-bold text-xl">
              <span className="text-[#2563EB]">Peptide</span>
              <span className="text-[#10B981]">Weight</span>
              <span className="text-[#F59E0B]">Loss</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Empowering Research — Catalyzing Discovery</p>
        </div>
      </div>
    </section>
  );
};

export default AboutPeptideWeightLoss;