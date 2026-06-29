// src/pages/Peptides.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Star, ShoppingCart, Eye, ChevronDown, Grid3x3, List, SlidersHorizontal, FlaskConical, Beaker, Droplets, Zap, Activity, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

console.log(`🔧 Peptides - API URL: ${API_URL}`);

const Peptides = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // ✅ Récupérer les catégories peptides
        const categoriesRes = await axios.get(`${API_URL}/categories?section=peptides`);
        const peptideCategories = categoriesRes.data.data || [];
        
        // ✅ Récupérer tous les produits
        const response = await axios.get(`${API_URL}/products`);
        let apiProducts = response.data.data || response.data;
        
        // ✅ Filtrer les produits qui appartiennent aux catégories peptides
        const peptideSlugs = peptideCategories.map(c => c.slug);
        const filteredApiProducts = apiProducts.filter(p => 
          peptideSlugs.includes(p.type) || peptideSlugs.includes(p.category) || p.type === 'peptide' || p.type === 'blend'
        );
        
        if (filteredApiProducts.length > 0) {
          const formattedProducts = filteredApiProducts.map((p, index) => ({
            _id: p._id || p.id || index,
            id: p._id || p.id || index,
            name: p.name,
            dosage: p.dosage || p.moreDetails || 'N/A',
            purity: p.purity || '≥99%',
            price: p.price,
            oldPrice: p.oldPrice || null,
            rating: p.rating || 4.8,
            reviews: p.reviews || Math.floor(Math.random() * 200) + 10,
            category: p.category || p.type || 'peptide',
            type: p.type || 'peptide',
            isPopular: p.isPopular || false,
            isNew: p.isNew || false,
            isBestSeller: p.isBestSeller || false,
            image: getFullImageUrl(p.image),
            stock: p.stock || 0
          }));
          setProducts(formattedProducts);
          
          // ✅ Générer les catégories dynamiquement
          const allCategories = [
            { id: 'all', name: 'All Peptides', icon: <FlaskConical size={16} />, count: formattedProducts.length }
          ];
          
          // Ajouter les catégories peptides
          peptideCategories.forEach(cat => {
            const count = formattedProducts.filter(p => 
              p.type === cat.slug || p.category === cat.slug
            ).length;
            if (count > 0) {
              allCategories.push({
                id: cat.slug,
                name: cat.name,
                icon: <Beaker size={16} style={{ color: cat.color || '#6B7280' }} />,
                count: count,
                color: cat.color
              });
            }
          });
          
          // Ajouter "Peptides" et "Blends" génériques si des produits existent
          const peptideCount = formattedProducts.filter(p => p.type === 'peptide').length;
          const blendCount = formattedProducts.filter(p => p.type === 'blend').length;
          
          if (peptideCount > 0) {
            allCategories.push({
              id: 'peptide',
              name: 'Peptides',
              icon: <FlaskConical size={16} />,
              count: peptideCount
            });
          }
          if (blendCount > 0) {
            allCategories.push({
              id: 'blend',
              name: 'Peptide Blends',
              icon: <Beaker size={16} />,
              count: blendCount
            });
          }
          
          setCategories(allCategories);
        } else {
          // Fallback avec données statiques
          setProducts([]);
          setCategories([
            { id: 'all', name: 'All Peptides', icon: <FlaskConical size={16} />, count: 0 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setCategories([
          { id: 'all', name: 'All Peptides', icon: <FlaskConical size={16} />, count: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory && product.type !== selectedCategory) return false;
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
          <p className="text-gray-500">Loading peptides...</p>
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
              Premium Research Peptides
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-6">
              Discover our extensive collection of high-purity peptides for advanced research
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm">
                <FlaskConical size={14} /> 99.5%+ Purity
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm">
                <Activity size={14} /> HPLC Tested
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm">
                <Zap size={14} /> Third-Party Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search peptides..."
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
          
          {/* Filtres - Sidebar */}
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
                      <span className="flex items-center gap-2">
                        <span style={{ color: cat.color || '#6B7280' }}>{cat.icon}</span>
                        {cat.name}
                      </span>
                      <span className="text-xs text-gray-400">({cat.count})</span>
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
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
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
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm">Showing {displayedProducts.length} of {filteredProducts.length} products</p>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <FlaskConical size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
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
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peptides;