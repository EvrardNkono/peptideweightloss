// src/pages/PeptideBlends.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Star, ShoppingCart, Eye, ChevronDown, Grid3x3, List, SlidersHorizontal, FlaskConical, Beaker, Droplets, Zap, Activity, TrendingUp, Store, Pill, Syringe, Building2, Award, ArrowRight } from 'lucide-react';
import axios from 'axios';
// ✅ IMPORT DU COMPOSANT PRODUCTCARD
import ProductCard from '../components/ProductCard';

// ✅ CONFIGURATION AUTOMATIQUE DE L'URL BACKEND
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

console.log(`🔧 PeptideBlends - API URL: ${API_URL}`);

const PeptideBlends = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données statiques de fallback
  const staticBlends = [
    { id: 1, name: 'BPC-157 + TB-500', dosage: '5mg/5mg', purity: '≥99%', price: 109.99, oldPrice: 149.99, rating: 4.9, reviews: 234, category: 'healing', type: 'blend', isPopular: true, isNew: false, isBestSeller: true, description: 'The ultimate healing stack for tissue repair and recovery', image: '/images/pept.png' },
    { id: 2, name: 'GLOW Blend', dosage: '35mg/10mg/5mg', purity: '≥99%', price: 129.99, rating: 4.8, reviews: 89, category: 'healing', type: 'blend', isPopular: false, isNew: true, isBestSeller: false, description: 'GHK-Cu + BPC-157 + TB-500 for skin, hair, and tissue health', image: '/images/pept.png' },
    { id: 3, name: 'Wolverine Stack', dosage: '10mg/10mg', purity: '≥99%', price: 119.99, rating: 4.9, reviews: 156, category: 'healing', type: 'blend', isPopular: true, isNew: false, isBestSeller: true, description: 'BPC-157 + TB-500 for maximum recovery', image: '/images/pept.png' },
    { id: 4, name: 'CJC-1295 + Ipamorelin', dosage: '5mg/5mg', purity: '≥99%', price: 114.99, oldPrice: 149.99, rating: 4.8, reviews: 167, category: 'growth', type: 'blend', isPopular: true, isNew: false, isBestSeller: false, description: 'Synergistic GH release blend', image: '/images/pept.png' },
    { id: 5, name: 'GHRP-2 + GHRP-6', dosage: '5mg/5mg', purity: '≥99%', price: 89.99, oldPrice: 119.99, rating: 4.7, reviews: 98, category: 'growth', type: 'blend', isPopular: false, isNew: false, isBestSeller: false, description: 'Dual GHRP for maximum GH pulses', image: '/images/pept.png' },
    { id: 6, name: 'Tesamorelin + Ipamorelin', dosage: '2mg/5mg', purity: '≥99%', price: 139.99, rating: 4.9, reviews: 76, category: 'growth', type: 'blend', isPopular: true, isNew: true, isBestSeller: false, description: 'Premium GH-releasing blend', image: '/images/pept.png' },
    { id: 7, name: 'AOD-9604 + MOTS-c', dosage: '5mg/10mg', purity: '≥99%', price: 129.99, oldPrice: 169.99, rating: 4.8, reviews: 112, category: 'fat', type: 'blend', isPopular: true, isNew: false, isBestSeller: false, description: 'Advanced fat metabolism stack', image: '/images/pept.png' },
    { id: 8, name: 'Frag 176-191 + AOD-9604', dosage: '5mg/5mg', purity: '≥99%', price: 99.99, rating: 4.7, reviews: 67, category: 'fat', type: 'blend', isPopular: false, isNew: true, isBestSeller: false, description: 'Targeted fat loss peptide blend', image: '/images/pept.png' }
  ];

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/images/pept.png') {
      return '/images/pept.png';
    }
    if (imageUrl.startsWith('/uploads/')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchBlends = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products`);
        let apiProducts = response.data.data || response.data;
        
        const blendProducts = apiProducts.filter(p => p.type === 'blend');
        
        if (blendProducts.length > 0) {
          const formattedBlends = blendProducts.map((p, index) => ({
            _id: p._id || p.id || index,
            id: p._id || p.id || index,
            name: p.name,
            dosage: p.dosage || p.moreDetails || 'N/A',
            purity: p.purity || '≥99%',
            price: p.price,
            oldPrice: p.oldPrice || null,
            rating: p.rating || 4.8,
            reviews: p.reviews || Math.floor(Math.random() * 200) + 10,
            category: p.category === 'healing' ? 'healing' : p.category === 'growth' ? 'growth' : p.category === 'fat' ? 'fat' : 'healing',
            type: p.type || 'blend',
            isPopular: p.isPopular || false,
            isNew: p.isNew || false,
            isBestSeller: p.isBestSeller || false,
            description: p.description || `${p.name} premium peptide blend for research`,
            image: getFullImageUrl(p.image),
            stock: p.stock || 0
          }));
          setProducts(formattedBlends);
        } else {
          setProducts(staticBlends);
        }
      } catch (error) {
        console.error('Error fetching blends:', error);
        setProducts(staticBlends);
      } finally {
        setLoading(false);
      }
    };

    fetchBlends();
  }, []);

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  const categories = [
    { id: 'all', name: 'All Blends', icon: <Beaker size={16} /> },
    { id: 'healing', name: 'Healing Blends', icon: <Droplets size={16} /> },
    { id: 'growth', name: 'Growth Blends', icon: <Zap size={16} /> },
    { id: 'fat', name: 'Fat Burning Blends', icon: <TrendingUp size={16} /> }
  ];

  const featuredLabs = [
    { name: 'Quanta', rank: 1, icon: <Award size={16} className="text-yellow-500" />, href: '/labs/quanta', description: 'Gold Standard' },
    { name: 'Deus Medical', rank: 3, icon: <Building2 size={16} />, href: '/labs/deus-medical', description: 'Consistent Performer' },
    { name: 'Balkan Pharmaceuticals', rank: 4, icon: <Pill size={16} />, href: '/labs/balkan', description: 'Pharma-Grade' },
    { name: 'Pharmacom', rank: 5, icon: <Syringe size={16} />, href: '/labs/pharmacom', description: 'Legacy Name' },
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  // ✅ Fonctions pour le panier et vue rapide
  const handleAddToCart = (product) => {
    console.log('🛒 Adding to cart:', product);
    alert(`Added ${product.name} to cart!`);
  };

  const handleQuickView = (product) => {
    console.log('👁️ Quick view:', product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading peptide blends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero avec image de background */}
      <div 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/peptide.webp")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Peptide Blends
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-6">
              Synergistic combinations for enhanced research results
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/marketplace" className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] rounded-full px-5 py-2 text-white text-sm font-semibold transition-colors">
                <Store size={14} /> Browse General Marketplace
              </Link>
              <Link to="/labs" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full px-5 py-2 text-white text-sm font-semibold transition-colors">
                <Building2 size={14} /> View Our Labs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de navigation rapide */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-sm">
            <Link to="/marketplace" className="flex items-center gap-2 hover:underline">
              <Store size={16} /> General Marketplace
              <ArrowRight size={14} />
            </Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link to="/marketplace/sarms" className="flex items-center gap-2 hover:underline">
              <FlaskConical size={16} /> SARMs
            </Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link to="/marketplace/hgh" className="flex items-center gap-2 hover:underline">
              <Activity size={16} /> HGH
            </Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link to="/marketplace/steroids" className="flex items-center gap-2 hover:underline">
              <Pill size={16} /> Steroids
            </Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link to="/labs" className="flex items-center gap-2 hover:underline">
              <Building2 size={16} /> Our Labs (10 Verified)
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 font-medium text-gray-700"
            >
              <Filter size={18} /> Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 pr-10 bg-white rounded-xl border border-gray-200 text-gray-700 font-medium appearance-none cursor-pointer focus:border-[#2563EB] outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            <div className="hidden sm:flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
                <button onClick={() => setFilterOpen(false)} className="md:hidden">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                        selectedCategory === cat.id
                          ? 'bg-[#2563EB]/10 text-[#2563EB] font-medium'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">{cat.icon} {cat.name}</span>
                      <span className="text-xs text-gray-400">({getCategoryCount(cat.id)})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 500]);
                  setSearchQuery('');
                }}
                className="w-full py-2 text-center text-[#2563EB] font-medium hover:bg-[#2563EB]/10 rounded-lg transition"
              >
                Reset All Filters
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Store size={16} className="text-[#F59E0B]" /> Shop More
                </h4>
                <div className="space-y-2">
                  <Link to="/marketplace" className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    <span>All Marketplace</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/marketplace/sarms" className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    <span>SARMs</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/marketplace/hgh" className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    <span>HGH</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/marketplace/steroids" className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    <span>Steroids</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-[#2563EB]" /> Featured Labs
                </h4>
                <div className="space-y-2">
                  {featuredLabs.map((lab) => (
                    <Link
                      key={lab.name}
                      to={lab.href}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs font-mono">#{lab.rank}</span>
                        <span className="group-hover:text-[#2563EB] transition-colors">{lab.icon}</span>
                        <span>{lab.name}</span>
                      </span>
                      <span className="text-xs text-gray-400">{lab.description}</span>
                    </Link>
                  ))}
                  <Link to="/labs" className="flex items-center justify-center w-full px-3 py-2 mt-2 text-center text-[#2563EB] font-medium text-sm hover:bg-[#2563EB]/10 rounded-lg transition">
                    View All 10 Labs →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm">Showing {displayedProducts.length} of {filteredProducts.length} blends</p>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Beaker size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No blends found</h3>
                <p className="text-gray-400">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    _id={product._id || product.id}
                    id={product.id || product._id}
                    name={product.name}
                    dosage={product.dosage}
                    purity={product.purity}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    rating={product.rating}
                    reviews={product.reviews}
                    category={product.category}
                    image={product.image}
                    isBestSeller={product.isBestSeller || false}
                    isPopular={product.isPopular || false}
                    isNew={product.isNew || false}
                    stock={product.stock}
                    onAddToCart={() => handleAddToCart(product)}
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </div>
            )}

            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount(visibleCount + 20)}
                  className="px-8 py-3 border-2 border-[#2563EB] text-[#2563EB] rounded-full font-semibold hover:bg-[#2563EB] hover:text-white transition"
                >
                  Load More Blends
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeptideBlends;