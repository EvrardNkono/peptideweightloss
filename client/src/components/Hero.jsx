// src/components/Hero.jsx
import React from 'react';
import { ArrowRight, Shield, FlaskConical, CheckCircle, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gradient-to-r from-[#2563EB]/5 to-[#10B981]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#F59E0B]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE */}
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-gray-50 rounded-2xl shadow-xl overflow-hidden group p-6 sm:p-10">
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5">
                <FlaskConical size={12} className="text-[#2563EB]" />
                <span className="text-xs font-semibold text-gray-700">LAB TESTED</span>
              </div>
              <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                <span className="text-xs font-bold text-[#10B981]">99% PURE</span>
              </div>

              <img
                src="/images/pept.png"
                alt="Premium Peptides"
                loading="eager"
                className="w-full h-auto max-h-[420px] mx-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />

              <div className="mt-6 flex justify-between gap-2 flex-wrap">
                <div className="bg-white rounded-lg px-3 py-1.5 shadow-md border border-gray-100">
                  <div className="text-xs text-gray-500">Molecular Weight</div>
                  <div className="text-xs font-mono font-semibold text-gray-800">~4,113.6 g/mol</div>
                </div>
                <div className="bg-white rounded-lg px-3 py-1.5 shadow-md border border-gray-100">
                  <div className="text-xs text-gray-500">Formula</div>
                  <div className="text-xs font-mono font-semibold text-gray-800">C₁₈₇H₂₉₁N₅₉O₅₉</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 sm:-right-6 top-8 z-30">
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full px-4 py-2 shadow-lg">
                <span className="text-xs font-bold text-white whitespace-nowrap">BEST SELLER</span>
              </div>
            </div>
          </div>

          {/* TEXTE */}
          <div className="order-1 lg:order-2">
            <div className="flex gap-2 mb-6 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 rounded-full px-3 py-1">
                <Shield size={12} className="text-[#2563EB]" />
                <span className="text-xs font-medium text-[#2563EB]">GMP Certified</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#10B981]/10 rounded-full px-3 py-1">
                <Award size={12} className="text-[#10B981]" />
                <span className="text-xs font-medium text-[#10B981]">ISO 9001</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-gray-900">Premium</span>
              <br />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                Peptides
              </span>
              <br />
              <span className="text-gray-800">For Weight Loss</span>
            </h1>

            <p className="text-gray-500 leading-relaxed mb-6 max-w-md">
              Scientifically formulated, third-party tested, and clinically validated peptides to support your weight loss journey.
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
    </section>
  );
};

export default Hero;