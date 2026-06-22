// src/pages/About.jsx
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
  Activity,
  MapPin,
  Phone,
  Mail,
  Globe,
  Factory,
  FileText,
  ThumbsUp,
  Lock,
  RefreshCw,
  Headphones,
  Building2,
  BadgeCheck,
  Leaf,
  Trophy
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: "50,000+", label: "Happy Customers", icon: <Users size={24} />, color: "#2563EB" },
    { value: "99.5%", label: "Purity Guaranteed", icon: <FlaskConical size={24} />, color: "#10B981" },
    { value: "100+", label: "Research Papers", icon: <Microscope size={24} />, color: "#F59E0B" },
    { value: "24/7", label: "Expert Support", icon: <Headphones size={24} />, color: "#2563EB" }
  ];

  const values = [
    { title: "Premium Quality", description: "All our peptides are third-party tested with 99.5%+ purity guaranteed.", icon: <FlaskConical size={28} />, color: "#2563EB" },
    { title: "Scientific Excellence", description: "Backed by cutting-edge research and leading scientists.", icon: <Microscope size={28} />, color: "#10B981" },
    { title: "Customer First", description: "Dedicated 24/7 support to guide you through your journey.", icon: <Heart size={28} />, color: "#F59E0B" },
    { title: "Fast & Discreet", description: "Worldwide shipping with tracking and privacy protection.", icon: <Truck size={28} />, color: "#2563EB" }
  ];

  const certifications = [
    { name: "GMP Certified", icon: <Shield size={16} />, color: "#2563EB" },
    { name: "ISO 9001:2024", icon: <Award size={16} />, color: "#10B981" },
    { name: "FDA Registered", icon: <BadgeCheck size={16} />, color: "#F59E0B" },
    { name: "3rd Party Tested", icon: <FlaskConical size={16} />, color: "#2563EB" },
    { name: "HPLC Verified", icon: <FileText size={16} />, color: "#10B981" },
    { name: "GMP Facility", icon: <Factory size={16} />, color: "#F59E0B" }
  ];

  const commitments = [
    { text: "100% transparent lab results", icon: <FileText size={18} /> },
    { text: "Privacy-Protected Delivery & shipping", icon: <Lock size={18} /> },
    { text: "30-day satisfaction guarantee", icon: <RefreshCw size={18} /> },
    { text: "Free shipping on orders $1000+", icon: <Truck size={18} /> },
    { text: "Loyalty rewards program", icon: <Trophy size={18} /> },
    { text: "Eco-friendly packaging", icon: <Leaf size={18} /> }
  ];

  const team = [
    { name: "Dr. Sarah Thompson", role: "Chief Scientific Officer", bio: "PhD in Biochemistry with 15+ years in peptide research.", icon: <Microscope size={24} /> },
    { name: "Dr. Michael Chen", role: "Head of Quality Control", bio: "Former FDA inspector with expertise in pharmaceutical QC.", icon: <FlaskConical size={24} /> },
    { name: "Prof. James Wilson", role: "Research Director", bio: "Published in Nature, NEJM, and leading peptide journals.", icon: <Award size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section avec image background */}
      <div 
        className="relative h-[450px] md:h-[550px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/about.avif")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative h-full flex items-center">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#2563EB]/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <Heart size={14} className="text-[#2563EB]" />
                <span className="text-sm font-semibold text-white tracking-wide">TRUSTED SINCE 2019</span>
              </div>
              
              {/* Titre */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                Empowering Research,
                <br />
                <span className="bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                  Transforming Lives
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
                PeptideWeightLoss is a leading provider of premium research peptides, 
                dedicated to advancing scientific discovery and improving metabolic health worldwide.
              </p>
              
              {/* Badges qualité */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                  <Shield size={14} /> GMP Certified
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                  <Microscope size={14} /> ISO 9001:2024
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                  <Award size={14} /> FDA Registered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 rounded-full px-4 py-1.5 mb-4">
                <Activity size={14} className="text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#2563EB] tracking-wide">OUR MISSION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                Advancing Metabolic Health Through Science
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At PeptideWeightLoss, we believe that everyone deserves access to high-quality research peptides 
                that can transform their health journey. Our mission is to provide scientists, researchers, 
                and health enthusiasts with the purest, most reliable peptides available.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With over 50,000 satisfied customers and 100+ published research papers citing our products, 
                we've established ourselves as a trusted partner in peptide research worldwide.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2563EB]/10 via-[#10B981]/10 to-[#F59E0B]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 size={28} className="text-[#2563EB]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">2019</div>
                    <div className="text-xs text-gray-500">Year Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin size={28} className="text-[#10B981]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">USA</div>
                    <div className="text-xs text-gray-500">Headquarters</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe size={28} className="text-[#F59E0B]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">50+</div>
                    <div className="text-xs text-gray-500">Countries Served</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users size={28} className="text-[#2563EB]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">50k+</div>
                    <div className="text-xs text-gray-500">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 rounded-full px-4 py-1.5 mb-4">
              <Heart size={14} className="text-[#2563EB]" />
              <span className="text-xs font-semibold text-[#2563EB] tracking-wide">OUR VALUES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us Every Day
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our core values guide everything we do — from product development to customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${value.color}15` }}>
                  <div style={{ color: value.color }}>{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 rounded-full px-4 py-1.5 mb-4">
              <Shield size={14} className="text-[#10B981]" />
              <span className="text-xs font-semibold text-[#10B981] tracking-wide">QUALITY ASSURANCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Uncompromising Quality Standards
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Every product undergoes rigorous testing to ensure the highest quality and purity.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FlaskConical size={20} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Third-Party Testing</h3>
                    <p className="text-gray-500">Every batch is independently verified by ISO-certified laboratories for purity and potency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Certificate of Analysis</h3>
                    <p className="text-gray-500">HPLC-MS reports available for every batch, showing 99.5%+ purity guaranteed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Factory size={20} className="text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">cGMP Manufacturing</h3>
                    <p className="text-gray-500">Produced in FDA-registered, cGMP-certified facilities in the USA.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-3">
                {certifications.map((cert, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700">
                    <span style={{ color: cert.color }}>{cert.icon}</span>
                    {cert.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 rounded-full px-4 py-1.5 mb-4">
              <ThumbsUp size={14} className="text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#D97706] tracking-wide">OUR COMMITMENT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              We Stand Behind Our Products
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our promises to every customer — backed by our reputation.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {commitments.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-xs font-medium text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 rounded-full px-4 py-1.5 mb-4">
              <Users size={14} className="text-[#2563EB]" />
              <span className="text-xs font-semibold text-[#2563EB] tracking-wide">SCIENTIFIC LEADERSHIP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Scientific Team
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              World-class experts dedicated to peptide research and quality control.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-sm text-[#2563EB] font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2563EB] to-[#10B981]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Have Questions? We're Here to Help</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any questions about our products or services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-[#2563EB] px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              Contact Us
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
              View Research
            </button>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="bg-gray-900 text-white py-8 text-center text-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <p>© 2024 PeptideWeightLoss. All rights reserved. For research purposes only.</p>
        </div>
      </div>
    </div>
  );
};

export default About;