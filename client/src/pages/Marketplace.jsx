// src/pages/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, X, Star, ShoppingCart, Eye, ChevronDown, 
  Grid3x3, List, SlidersHorizontal, FlaskConical, Beaker, 
  Activity, TrendingUp, Store, Pill, Syringe, 
  Package, MapPin, Loader2
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Marketplace = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]); // ← Augmenté à 2000
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryToTypeMap = {
    'sarms': 'sarm',
    'hgh': 'hgh',
    'steroids': 'steroid',
    'pct': 'pct',
    'weight-loss': 'weight-loss',
    'african-products': 'african',
  };

  const productTypes = [
    { id: 'all', name: 'All Products', icon: <Store size={16} />, color: '#2563EB', slug: '' },
    { id: 'sarm', name: 'SARMs', icon: <FlaskConical size={16} />, color: '#8B5CF6', slug: 'sarms' },
    { id: 'hgh', name: 'HGH', icon: <Activity size={16} />, color: '#06B6D4', slug: 'hgh' },
    { id: 'steroid', name: 'Steroids', icon: <Syringe size={16} />, color: '#EF4444', slug: 'steroids' },
    { id: 'pct', name: 'Post Cycle Therapy', icon: <Package size={16} />, color: '#F59E0B', slug: 'pct' },
    { id: 'weight-loss', name: 'Weight Loss', icon: <TrendingUp size={16} />, color: '#10B981', slug: 'weight-loss' },
    { id: 'african', name: 'African Products', icon: <MapPin size={16} />, color: '#8B5CF6', slug: 'african-products' }
  ];

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/images/pept.png') return '/images/pept.png';
    if (imageUrl.startsWith('/uploads/')) return `http://localhost:5000${imageUrl}`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return imageUrl;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products`);
        let apiProducts = response.data.data || response.data;
        apiProducts = apiProducts.filter(p => p.status !== 'inactive');
        
        console.log('Produits reçus de l\'API:', apiProducts); // ← Debug
        
        const formattedProducts = apiProducts.map((p, index) => ({
          id: p._id || p.id || index,
          name: p.name,
          dosage: p.dosage,
          purity: p.purity || '≥99%',
          price: p.price,
          oldPrice: p.oldPrice || null,
          rating: p.rating || 4.8,
          reviews: p.reviews || Math.floor(Math.random() * 200) + 10,
          type: p.type,
          isPopular: p.isPopular || false,
          isNew: p.isNew || false,
          image: p.image || '/images/pept.png',
        }));
        
        console.log('Produits formatés:', formattedProducts); // ← Debug
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category && categoryToTypeMap[category]) {
      setSelectedType(categoryToTypeMap[category]);
    } else {
      setSelectedType('all');
    }
    setVisibleCount(20);
  }, [category]);

  const getTypeCount = (typeId) => {
    if (typeId === 'all') return products.length;
    return products.filter(p => p.type === typeId).length;
  };

  const handleTypeChange = (typeId, slug) => {
    setSelectedType(typeId);
    setVisibleCount(20);
    if (slug) {
      navigate(`/marketplace/${slug}`);
    } else {
      navigate('/marketplace');
    }
  };

  // Filtrer les produits - Version sans filtre de prix pour tester
  const filteredProducts = products.filter(product => {
    if (selectedType !== 'all' && product.type !== selectedType) return false;
    // FILTRE PRIX DÉSACTIVÉ TEMPORAIREMENT
    // if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
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

  // Debug: Afficher dans la console
  console.log('selectedType:', selectedType);
  console.log('filteredProducts count:', filteredProducts.length);
  console.log('displayedProducts:', displayedProducts);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-4">
      {/* Barre de catégories */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {productTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id, type.slug)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.icon}
                {type.name}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedType === type.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {getTypeCount(type.id)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-3">
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

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 text-sm">
            Showing {displayedProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Store size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400">
              {selectedType !== 'all' ? `No ${selectedType} products available yet.` : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {displayedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode} 
                getFullImageUrl={getFullImageUrl}
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
  );
};

const ProductCard = ({ product, viewMode, getFullImageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex gap-4">
        <img src={getFullImageUrl(product.image)} alt={product.name} className="w-24 h-24 object-cover rounded-lg" onError={(e) => e.target.src = '/images/pept.png'} />
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.dosage}</p>
          <div className="flex items-center gap-2 mt-2">
            <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-sm">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-2xl font-bold">${product.price}</span>
            <button className="bg-[#2563EB] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#1E40AF] transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img src={getFullImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" onError={(e) => e.target.src = '/images/pept.png'} />
        {product.isPopular && <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded-full">BEST SELLER</span>}
        {product.isNew && <span className="absolute top-3 right-3 bg-[#2563EB] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.dosage}</p>
        <div className="flex items-center gap-2 my-2">
          <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-sm">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <button className="bg-[#2563EB] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#1E40AF] transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;