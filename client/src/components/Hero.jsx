// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, FlaskConical, CheckCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://peptideweightloss.vercel.app/api'
  : 'http://localhost:5000/api';

const BACKEND_URL = API_URL.replace('/api', '');

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // ✅ Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/images/pept.png') {
      return '/images/pept.png';
    }
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/uploads/')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get(`${API_URL}/hero`);
        setHeroData(response.data.data);
      } catch (error) {
        console.error('Error fetching hero:', error);
        setHeroData({
          images: ['/images/pept.png'],
          title: 'State-Licensed, FDA-Registered, CFS Certified',
          subtitle: 'Your fully compliant corporate distributor for domestic and international operations. Trusted by over 290 clinics worldwide.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  // ✅ SLIDESHOW AUTOMATIQUE - Change d'image toutes les 4 secondes
  useEffect(() => {
    if (!heroData || heroData.images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroData.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroData, isPaused]);

  const nextImage = () => {
    if (heroData && heroData.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % heroData.images.length);
    }
  };

  const prevImage = () => {
    if (heroData && heroData.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + heroData.images.length) % heroData.images.length);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-white overflow-hidden py-20">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  const images = heroData?.images || ['/images/pept.png'];
  const currentImage = getImageUrl(images[currentImageIndex] || '/images/pept.png');

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gradient-to-r from-[#2563EB]/5 to-[#10B981]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#F59E0B]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE */}
          <div className="relative order-2 lg:order-1">
            <div 
              className="relative bg-gray-50 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5">
                <FlaskConical size={12} className="text-[#2563EB]" />
                <span className="text-xs font-semibold text-gray-700">LAB TESTED</span>
              </div>
              <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                <span className="text-xs font-bold text-[#10B981]">99% PURE</span>
              </div>

              {/* Image principale avec carrousel - TAILLE FIXE */}
              <div className="relative flex items-center justify-center h-[420px]">
                <img
                  src={currentImage}
                  alt="Premium Peptides"
                  loading="eager"
                  className="w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500"
                  onError={(e) => { e.target.src = '/images/pept.png'; }}
                />
                
                {/* Flèches de navigation si plusieurs images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition z-10 hover:scale-110"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition z-10 hover:scale-110"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Indicateurs de navigation */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'bg-[#2563EB] w-8' 
                          : 'bg-gray-300 hover:bg-gray-400 w-2'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Barre de progression du slideshow */}
              {images.length > 1 && !isPaused && (
                <div className="w-full h-0.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full"
                    style={{
                      width: '100%',
                      animation: 'progress 4s linear infinite',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Badge BEST SELLER */}
            <div className="absolute -right-4 sm:-right-6 top-8 z-30">
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full px-4 py-2 shadow-lg">
                <span className="text-xs font-bold text-white whitespace-nowrap">BEST SELLER</span>
              </div>
            </div>
          </div>

          {/* TEXTE - NOUVEAU TITRE */}
          <div className="order-1 lg:order-2">
            {/* ✅ NOUVEAU TITRE - State-Licensed, FDA-Registered, CFS Certified */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-gray-900">State-Licensed,</span>
              <br />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                FDA-Registered,
              </span>
              <br />
              <span className="text-gray-800">CFS Certified</span>
            </h1>

            {/* ✅ SOUS-TITRE */}
            <p className="text-gray-500 leading-relaxed mb-6 max-w-md">
              Your fully compliant corporate distributor for domestic and international operations. Trusted by over 290 clinics worldwide.
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
              {[
                { text: "Lab tested & certified", color: "#2563EB" },
                { text: "99.5% purity HPLC", color: "#10B981" },
                { text: "Worldwide shipping", color: "#F59E0B" },
                { text: "24/7 expert support", color: "#2563EB" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle size={14} style={{ color: item.color }} />
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50">
                Shop Now
                <ArrowRight size={16} />
              </button>
              <button className="border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold hover:border-[#2563EB] hover:text-[#2563EB] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                View Research
              </button>
            </div>

            <div className="flex gap-8 mt-8 pt-6 border-t border-gray-100">
              <div>
                <div className="text-xl font-bold text-gray-900">10k+</div>
                <div className="text-xs text-gray-400">Happy Clients</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#10B981]">98%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#2563EB]">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Animation CSS pour la barre de progression */}
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;