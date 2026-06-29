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
import ProductCard from '../components/ProductCard';

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

console.log(`🔧 Marketplace - API URL: ${API_URL}`);

// ✅ FONCTION DE MÉLANGE AVEC CONTRAINTE DE CATÉGORIE
const shuffleProductsWithCategoryConstraint = (products) => {
  if (!products || products.length <= 1) return products || [];
  
  // Séparer les produits par catégorie
  const productsByCategory = {};
  products.forEach(product => {
    const category = product.category || product.type || 'Other';
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });
  
  // Mélanger chaque catégorie individuellement
  Object.keys(productsByCategory).forEach(category => {
    for (let i = productsByCategory[category].length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsByCategory[category][i], productsByCategory[category][j]] = 
        [productsByCategory[category][j], productsByCategory[category][i]];
    }
  });
  
  // Obtenir les catégories avec leur nombre de produits
  const categoryCounts = Object.keys(productsByCategory).map(cat => ({
    category: cat,
    count: productsByCategory[cat].length,
    products: productsByCategory[cat],
    index: 0
  }));
  
  // Trier par ordre décroissant pour commencer par les catégories avec le plus de produits
  categoryCounts.sort((a, b) => b.count - a.count);
  
  const result = [];
  let lastCategory = null;
  
  // Tant qu'il reste des produits à placer
  while (categoryCounts.some(cat => cat.index < cat.count)) {
    // Filtrer les catégories qui ont encore des produits et qui ne sont pas la dernière utilisée
    let availableCategories = categoryCounts.filter(cat => 
      cat.index < cat.count && cat.category !== lastCategory
    );
    
    // Si aucune catégorie disponible (uniquement la dernière catégorie reste), on prend celle-ci
    if (availableCategories.length === 0) {
      availableCategories = categoryCounts.filter(cat => cat.index < cat.count);
    }
    
    // Choisir une catégorie aléatoirement parmi celles disponibles
    const randomIndex = Math.floor(Math.random() * availableCategories.length);
    const selectedCategory = availableCategories[randomIndex];
    
    // Ajouter le prochain produit de cette catégorie
    result.push(selectedCategory.products[selectedCategory.index]);
    selectedCategory.index++;
    lastCategory = selectedCategory.category;
  }
  
  return result;
};

const Marketplace = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    if (imageUrl.startsWith('/uploads/')) return `${BACKEND_URL}${imageUrl}`;
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
        
        console.log('Produits reçus de l\'API:', apiProducts);
        
        const formattedProducts = apiProducts.map((p, index) => ({
          _id: p._id || p.id || index,
          id: p._id || p.id || index,
          name: p.name,
          dosage: p.dosage,
          purity: p.purity || '≥99%',
          price: p.price,
          oldPrice: p.oldPrice || null,
          rating: p.rating || 4.8,
          reviews: p.reviews || Math.floor(Math.random() * 200) + 10,
          type: p.type,
          category: p.category || p.type || 'Other',
          isPopular: p.isPopular || false,
          isBestSeller: p.isBestSeller || false,
          isNew: p.isNew || false,
          image: getFullImageUrl(p.image),
          stock: p.stock || 0 
        }));
        
        console.log('Produits formatés:', formattedProducts);
        setProducts(formattedProducts);
        
        // ✅ Appliquer le mélange initial
        const shuffled = shuffleProductsWithCategoryConstraint(formattedProducts);
        console.log('Produits mélangés:', shuffled);
        setFilteredProducts(shuffled);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
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

  // ✅ Effet pour le filtrage et le mélange (recalculé quand le type ou la recherche change)
  useEffect(() => {
    if (products.length === 0) return;
    
    console.log('Filtrage et mélange - Type:', selectedType, 'Recherche:', searchQuery);
    
    let filtered = products.filter(product => {
      if (selectedType !== 'all' && product.type !== selectedType) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    
    console.log('Produits filtrés (avant mélange):', filtered.length);
    
    // ✅ Mélanger avec contrainte de catégorie
    const shuffled = shuffleProductsWithCategoryConstraint(filtered);
    console.log('Produits après mélange:', shuffled.length);
    
    setFilteredProducts(shuffled);
    setVisibleCount(20);
  }, [selectedType, searchQuery, products]);

  // ✅ Effet pour le tri (appliqué sur les produits déjà mélangés)
  useEffect(() => {
    if (filteredProducts.length === 0) return;
    
    console.log('Application du tri:', sortBy);
    
    // On garde une copie des produits mélangés
    let sorted = [...filteredProducts];
    
    switch(sortBy) {
      case 'popular':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }
    
    // ✅ On garde l'ordre trié sans remélanger
    setFilteredProducts(sorted);
  }, [sortBy]);

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

  // ✅ Fonction pour la vue rapide
  const handleQuickView = (product) => {
    console.log('Quick view:', product);
    navigate(`/product/${product._id}`);
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  console.log('Affichage final:', displayedProducts.length, 'produits sur', filteredProducts.length);

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
                key={product._id}
                id={product._id}
                _id={product._id}
                name={product.name}
                dosage={product.dosage}
                purity={product.purity}
                price={product.price}
                oldPrice={product.oldPrice}
                rating={product.rating}
                reviews={product.reviews}
                category={product.category}
                image={product.image}
                isBestSeller={product.isBestSeller}
                isPopular={product.isPopular}
                isNew={product.isNew}
                stock={product.stock}
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
  );
};

export default Marketplace;