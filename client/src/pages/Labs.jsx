// src/pages/Labs.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, Trophy, Star, Award, Shield, FlaskConical, 
  Microscope, Pill, Syringe, TestTube, Beaker, Activity,
  CheckCircle, Truck, Clock, Heart, Users, Globe,
  Mail, Phone, MapPin, ExternalLink, ChevronRight,
  FileText, Clipboard, GraduationCap, TrendingUp, ShoppingBag
} from 'lucide-react';

// Données réelles des laboratoires
const labsData = {
  'quanta': {
    name: 'Quanta',
    fullName: 'Quanta Biosciences',
    rank: 1,
    description: 'Gold Standard in peptide research and development. Industry leader in quality control and third-party verification.',
    longDescription: `Quanta Biosciences has established itself as the undisputed leader in peptide research and manufacturing. With state-of-the-art facilities in Switzerland and the United States, Quanta sets the benchmark for quality, purity, and consistency in the peptide industry.

Their commitment to excellence is reflected in their rigorous testing protocols, which exceed standard industry requirements by 300%. Every batch undergoes triple-stage HPLC-MS verification and endotoxin testing.`,
    founded: 2008,
    headquarters: 'Basel, Switzerland',
    facilities: ['Switzerland', 'USA', 'Germany'],
    certifications: ['ISO 9001:2024', 'GMP Certified', 'FDA Registered', 'EU GMP'],
    specialties: ['Research Peptides', 'GLP-1 Agonists', 'Growth Hormone Secretagogues'],
    products: ['Semaglutide', 'Tirzepatide', 'Retatrutide', 'Tesamorelin'],
    quality: 'Triple-tested with HPLC-MS, 99.5%+ purity guarantee',
    shipping: 'Worldwide discreet shipping, 24-48h processing',
    stats: {
      years: 16,
      clients: '5000+',
      purity: '99.5%',
      studies: 120
    }
  },
  'viogen': {
    name: 'Viogen',
    fullName: 'Viogen Laboratories',
    rank: 2,
    description: 'Cult Favorite among researchers. Known for innovation and customer-centric approach.',
    longDescription: `Viogen Laboratories has quickly become a favorite among the research community for their innovative approach and exceptional customer service. Founded by former research scientists, Viogen understands exactly what researchers need.

Their patented peptide stabilization technology extends shelf life by up to 40%, making them a preferred choice for long-term research projects.`,
    founded: 2012,
    headquarters: 'Vienna, Austria',
    facilities: ['Austria', 'Netherlands'],
    certifications: ['ISO 9001:2024', 'GMP Certified', 'In-house Testing'],
    specialties: ['Peptide Blends', 'Custom Synthesis', 'Research Kits'],
    products: ['BPC-157 + TB-500', 'CJC-1295 + Ipamorelin', 'GHRP-2/GHRP-6'],
    quality: 'In-house HPLC testing, 99%+ purity guarantee',
    shipping: 'Express shipping to EU and USA, 24h processing',
    stats: {
      years: 12,
      clients: '2500+',
      purity: '99%',
      studies: 45
    }
  },
  'deus-medical': {
    name: 'Deus Medical',
    fullName: 'Deus Medical Research',
    rank: 3,
    description: 'The Consistent Performer. Reliable quality with exceptional consistency across all batches.',
    longDescription: `Deus Medical has built its reputation on one principle: consistency. Researchers trust Deus for predictable, reliable results batch after batch. Their quality management system ensures that every vial meets exact specifications.

With multiple manufacturing facilities and a dedicated quality assurance team, Deus Medical has become a go-to source for institutional researchers.`,
    founded: 2010,
    headquarters: 'Madrid, Spain',
    facilities: ['Spain', 'Portugal'],
    certifications: ['GMP Certified', 'ISO 13485', 'CE Marked'],
    specialties: ['Metabolic Peptides', 'Research Standards', 'Clinical Grade'],
    products: ['Semaglutide', 'Tirzepatide', 'MOTS-c', 'SS-31'],
    quality: 'Batch-to-batch consistency, 99%+ purity',
    shipping: 'EU and international shipping, 48h processing',
    stats: {
      years: 14,
      clients: '3000+',
      purity: '99.2%',
      studies: 78
    }
  },
  'balkan': {
    name: 'Balkan Pharmaceuticals',
    fullName: 'Balkan Pharmaceuticals',
    rank: 4,
    description: 'Pharma-Grade Quality. Pharmaceutical standards applied to research peptides.',
    longDescription: `Balkan Pharmaceuticals brings pharmaceutical-grade manufacturing standards to the research peptide industry. Their facilities are designed to pharmaceutical specifications, and their quality control processes mirror those used for approved medications.

This attention to detail makes Balkan a trusted partner for researchers requiring the highest possible standards.`,
    founded: 2005,
    headquarters: 'Chisinau, Moldova',
    facilities: ['Moldova', 'Romania'],
    certifications: ['GMP Certified', 'Pharma License', 'WHO GMP'],
    specialties: ['Pharmaceutical Grade', 'Clinical Research', 'API Manufacturing'],
    products: ['Semaglutide', 'Tirzepatide', 'HGH Fragments'],
    quality: 'Pharmaceutical-grade manufacturing, 99.7%+ purity',
    shipping: 'Global shipping with tracking, 24-48h processing',
    stats: {
      years: 19,
      clients: '8000+',
      purity: '99.7%',
      studies: 95
    }
  },
  'pharmacom': {
    name: 'Pharmacom',
    fullName: 'Pharmacom Labs',
    rank: 5,
    description: 'Legacy Name in peptide research. Two decades of experience and expertise.',
    longDescription: `Pharmacom Labs has been a pillar of the research peptide community for nearly two decades. Their longevity speaks to their commitment to quality and customer satisfaction.

With a vast product catalog and extensive research support, Pharmacom continues to be a preferred supplier for both independent and institutional researchers.`,
    founded: 2006,
    headquarters: 'Hong Kong',
    facilities: ['Hong Kong', 'China'],
    certifications: ['ISO 9001', 'In-house Testing'],
    specialties: ['Comprehensive Catalog', 'Research Support', 'Technical Documentation'],
    products: ['Complete peptide line', 'SARMs', 'Research Chemicals'],
    quality: 'Multi-point testing, 99%+ purity',
    shipping: 'Discreet worldwide shipping, 48h processing',
    stats: {
      years: 18,
      clients: '10000+',
      purity: '99%',
      studies: 150
    }
  },
  'pharmaqo': {
    name: 'Pharmaqo',
    fullName: 'Pharmaqo Labs',
    rank: 6,
    description: 'The New Contender. Modern facilities with cutting-edge technology.',
    longDescription: `Pharmaqo Labs represents the new generation of peptide manufacturing. With state-of-the-art facilities and a focus on technological innovation, Pharmaqo is quickly becoming a preferred supplier for researchers seeking modern solutions.

Their investment in automated manufacturing and quality control systems ensures exceptional consistency and purity.`,
    founded: 2015,
    headquarters: 'Manchester, UK',
    facilities: ['United Kingdom', 'Ireland'],
    certifications: ['GMP Certified', 'UKAS Accredited'],
    specialties: ['Next-Generation Peptides', 'Novel Compounds', 'Research Innovation'],
    products: ['New peptide sequences', 'Advanced blends', 'Research standards'],
    quality: 'Automated QC systems, 99%+ purity',
    shipping: 'UK and EU shipping, 24h processing',
    stats: {
      years: 9,
      clients: '1500+',
      purity: '99%',
      studies: 30
    }
  },
  'intex-pharma': {
    name: 'Intex Pharma',
    fullName: 'Intex Pharmaceuticals',
    rank: 7,
    description: 'The Specialist. Focused on high-purity compounds and specialized peptides.',
    longDescription: `Intex Pharma has carved out a niche as a specialist in high-purity compounds and specialized peptides. Their focus on quality over quantity has earned them a loyal following among discerning researchers.

Each product batch is individually tested and documented, with full transparency provided to researchers.`,
    founded: 2014,
    headquarters: 'Prague, Czech Republic',
    facilities: ['Czech Republic'],
    certifications: ['ISO 9001', 'In-house HPLC'],
    specialties: ['High-Purity Peptides', 'Specialty Compounds', 'Custom Synthesis'],
    products: ['AOD-9604', 'MOTS-c', 'SS-31', 'Humanin'],
    quality: 'Individual batch testing, 99.5%+ purity',
    shipping: 'EU shipping, 24-48h processing',
    stats: {
      years: 10,
      clients: '800+',
      purity: '99.5%',
      studies: 25
    }
  },
  'status': {
    name: 'Status',
    fullName: 'Status Research Labs',
    rank: 8,
    description: 'The Underrated Pick. Exceptional value with quality that exceeds expectations.',
    longDescription: `Status Research Labs may not have the flashiest marketing, but their products speak for themselves. Consistently rated highly in blind testing, Status offers exceptional value without compromising on quality.

Their lean operation allows them to offer competitive pricing while maintaining rigorous quality standards.`,
    founded: 2016,
    headquarters: 'Tallinn, Estonia',
    facilities: ['Estonia', 'Latvia'],
    certifications: ['ISO 9001', 'Third-party Tested'],
    specialties: ['Value Research Peptides', 'Essential Compounds', 'Quality Assurance'],
    products: ['Essential peptide line', 'Research basics', 'Core compounds'],
    quality: 'Third-party verified, 98.5%+ purity',
    shipping: 'EU and international shipping, 48h processing',
    stats: {
      years: 8,
      clients: '1200+',
      purity: '98.5%',
      studies: 20
    }
  },
  'atech': {
    name: 'A-Tech Labs',
    fullName: 'A-Tech Laboratories',
    rank: 9,
    description: 'The Transparent One. Full disclosure and complete testing transparency.',
    longDescription: `A-Tech Labs has built their reputation on transparency. Every batch comes with complete testing documentation, and customers can access historical batch data online.

Their commitment to openness has earned them trust among researchers who demand full visibility into their research materials.`,
    founded: 2017,
    headquarters: 'Warsaw, Poland',
    facilities: ['Poland'],
    certifications: ['ISO 9001', 'Full Transparency'],
    specialties: ['Transparent Testing', 'Documented Quality', 'Research Support'],
    products: ['Full testing documentation', 'Verified peptides', 'Research standards'],
    quality: 'Fully documented testing, 99%+ purity',
    shipping: 'EU shipping, 24h processing',
    stats: {
      years: 7,
      clients: '600+',
      purity: '99%',
      studies: 15
    }
  },
  'morph': {
    name: 'Morph',
    fullName: 'Morph Research Labs',
    rank: 10,
    description: 'High Potential. Emerging leader with strong quality metrics.',
    longDescription: `Morph Research Labs is rapidly establishing itself as a quality-focused manufacturer of research peptides. Despite being relatively new to the market, their quality metrics rival established competitors.

With a focus on continuous improvement and customer feedback, Morph is positioned for significant growth in the research community.`,
    founded: 2019,
    headquarters: 'Ljubljana, Slovenia',
    facilities: ['Slovenia'],
    certifications: ['ISO 9001', 'In-progress GMP'],
    specialties: ['Emerging Standards', 'Quality Focus', 'Customer Service'],
    products: ['Core peptide line', 'Essential compounds', 'Quality research materials'],
    quality: 'ISO-certified, 98.5%+ purity target',
    shipping: 'EU shipping, 24-48h processing',
    stats: {
      years: 5,
      clients: '400+',
      purity: '98.5%',
      studies: 10
    }
  }
};

// Composant principal de la page Labs
const Labs = () => {
  const { labId } = useParams();
  const [selectedLab, setSelectedLab] = useState(labId || 'quanta');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (labId && labsData[labId]) {
      setSelectedLab(labId);
    }
  }, [labId]);

  const currentLab = labsData[selectedLab];
  const allLabs = Object.keys(labsData).map(key => ({ id: key, ...labsData[key] }));

  if (!labId || !currentLab) {
    return <LabsList labs={allLabs} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/labs" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
              All Labs <ChevronRight size={14} />
            </Link>
            <span className="text-white/60">|</span>
            <span className="text-white font-semibold">{currentLab.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              {currentLab.rank === 1 && <Trophy size={40} className="text-yellow-300" />}
              {currentLab.rank === 2 && <Star size={40} className="text-blue-300" />}
              {currentLab.rank === 3 && <Award size={40} className="text-amber-300" />}
              {currentLab.rank > 3 && <Building2 size={40} className="text-white/80" />}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentLab.rank === 1 ? 'bg-yellow-500' : currentLab.rank === 2 ? 'bg-blue-500' : currentLab.rank === 3 ? 'bg-amber-500' : 'bg-gray-500'} text-white`}>
                  #{currentLab.rank}
                </span>
                <span className="text-white/80 text-sm">{currentLab.description}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{currentLab.name}</h1>
              <p className="text-white/80 mt-2 max-w-2xl">{currentLab.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {['overview', 'products', 'quality'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all duration-200 ${
                activeTab === tab 
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About {currentLab.name}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentLab.longDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Building2 size={18} className="text-[#2563EB]" /> Facilities
                  </h3>
                  <ul className="space-y-2">
                    {currentLab.facilities.map((facility, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle size={14} className="text-[#10B981]" />
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield size={18} className="text-[#2563EB]" /> Certifications
                  </h3>
                  <ul className="space-y-2">
                    {currentLab.certifications.map((cert, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle size={14} className="text-[#10B981]" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {currentLab.specialties.map((specialty, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Key Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Founded</div>
                    <div className="text-xl font-bold text-gray-800">{currentLab.founded}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Headquarters</div>
                    <div className="text-xl font-bold text-gray-800">{currentLab.headquarters}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-[#2563EB]">{currentLab.stats.years}</div>
                      <div className="text-xs text-gray-500">Years of Excellence</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#10B981]">{currentLab.stats.clients}</div>
                      <div className="text-xs text-gray-500">Research Clients</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#F59E0B]">{currentLab.stats.purity}</div>
                      <div className="text-xs text-gray-500">Purity Guarantee</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#2563EB]">{currentLab.stats.studies}+</div>
                      <div className="text-xs text-gray-500">Research Citations</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton Shop Products - remplace l'ancienne section contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} className="text-[#2563EB]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Shop {currentLab.name} Products</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Browse our complete collection of {currentLab.name} research peptides
                </p>
                <Link 
                  to="/shop/peptides" 
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1E40AF] transition w-full justify-center"
                >
                  Shop Now <ShoppingBag size={16} />
                </Link>
              </div>

              {/* CTA vers les produits */}
              <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#2563EB]/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FlaskConical size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available now</p>
                    <p className="text-sm font-medium text-gray-800">View all {currentLab.name} products →</p>
                  </div>
                  <Link to="/shop/peptides" className="ml-auto">
                    <ChevronRight size={20} className="text-[#2563EB]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Products */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Products from {currentLab.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentLab.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Pill size={20} className="text-[#2563EB]" />
                      <span className="font-medium text-gray-800">{product}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">Why Choose {currentLab.name} Products?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-[#10B981] mt-0.5" />
                    <span className="text-sm text-gray-600">{currentLab.quality}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Truck size={16} className="text-[#10B981] mt-0.5" />
                    <span className="text-sm text-gray-600">{currentLab.shipping}</span>
                  </li>
                </ul>
              </div>
              
              {/* Bouton Shop Now dans le tab products */}
              <div className="mt-4 bg-[#2563EB]/5 rounded-2xl p-4 text-center">
                <Link 
                  to="/shop/peptides" 
                  className="inline-flex items-center gap-2 text-[#2563EB] font-semibold hover:gap-3 transition-all"
                >
                  Browse all {currentLab.name} products <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Quality */}
        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quality Assurance</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {currentLab.name} maintains rigorous quality control standards across all manufacturing processes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  <span className="text-gray-600">HPLC-MS testing on every batch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  <span className="text-gray-600">Certificate of Analysis available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  <span className="text-gray-600">Stability tested for storage</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {currentLab.certifications.map((cert, idx) => (
                  <span key={idx} className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                    {cert}
                  </span>
                ))}
              </div>
              
              {/* Bouton Shop Now dans le tab quality */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link 
                  to="/shop/peptides" 
                  className="flex items-center justify-between text-[#2563EB] font-medium hover:text-[#1E40AF] transition"
                >
                  <span>Shop {currentLab.name} products</span>
                  <ShoppingBag size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour la liste de tous les laboratoires
const LabsList = ({ labs }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-[1400px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Building2 size={14} className="text-white" />
            <span className="text-sm font-semibold text-white tracking-wide">OUR PARTNERS</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Trusted Research 
            <span className="block text-yellow-200">Laboratories</span>
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            We partner exclusively with verified, third-party tested laboratories to ensure the highest quality research peptides
          </p>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <Link 
              key={lab.id} 
              to={`/labs/${lab.id}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lab.rank === 1 ? 'bg-yellow-100' : 
                    lab.rank === 2 ? 'bg-blue-100' : 
                    lab.rank === 3 ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    {lab.rank === 1 && <Trophy size={24} className="text-yellow-600" />}
                    {lab.rank === 2 && <Star size={24} className="text-blue-600" />}
                    {lab.rank === 3 && <Award size={24} className="text-amber-600" />}
                    {lab.rank > 3 && <Building2 size={24} className="text-gray-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{lab.name}</h3>
                    <p className="text-xs text-gray-500">Rank #{lab.rank}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-gray-600 text-sm mb-4">{lab.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">📅 Founded {lab.founded}</span>
                <span className="flex items-center gap-1">📍 {lab.headquarters.split(',')[0]}</span>
              </div>
              {/* Lien rapide vers les produits */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-[#2563EB] flex items-center gap-1">
                  View products <ChevronRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Labs;