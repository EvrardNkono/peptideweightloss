// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import AboutPeptideWeightLoss from '../components/AboutPeptideWeightLoss';
import PeptideScience from '../components/PeptideScience';
import { Shield, Truck, FlaskConical, Star, Loader2, TrendingUp, Sparkles } from 'lucide-react';

// ✅ CONFIGURATION AUTOMATIQUE DE L'URL BACKEND
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'bestseller', 'popular', 'new'

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (imageUrl) => {
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

  // Récupérer tous les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/products`);
        let apiProducts = response.data.data || [];
        
        // Filtrer les produits actifs
        apiProducts = apiProducts.filter(p => p.status !== 'inactive');
        
        // Transformer les produits pour le format attendu
        const formattedProducts = apiProducts.map((p) => ({
          id: p._id || p.id,
          name: p.name,
          dosage: p.dosage || '5mg/vial',
          purity: p.purity || '≥99%',
          price: p.price,
          oldPrice: p.oldPrice || null,
          rating: p.rating || 4.8,
          reviews: p.reviews || Math.floor(Math.random() * 200) + 10,
          category: p.category || 'Peptide',
          type: p.type || 'peptide',
          isBestSeller: p.isBestSeller || false,
          isPopular: p.isPopular || false,
          isNew: p.isNew || false,
          image: p.image || '/images/pept.png',
          stock: p.stock || 0
        }));
        
        setAllProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Impossible de charger les produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrer les produits selon la catégorie sélectionnée
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProducts(allProducts);
    } else if (activeFilter === 'bestseller') {
      setFilteredProducts(allProducts.filter(p => p.isBestSeller === true));
    } else if (activeFilter === 'popular') {
      setFilteredProducts(allProducts.filter(p => p.isPopular === true));
    } else if (activeFilter === 'new') {
      setFilteredProducts(allProducts.filter(p => p.isNew === true));
    }
  }, [activeFilter, allProducts]);

  // Compter les produits par catégorie
  const counts = {
    all: allProducts.length,
    bestseller: allProducts.filter(p => p.isBestSeller).length,
    popular: allProducts.filter(p => p.isPopular).length,
    new: allProducts.filter(p => p.isNew).length,
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
  };

  const handleQuickView = (product) => {
    console.log('Quick view:', product);
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div>
        <Hero />
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-500">
              <Loader2 size={24} className="animate-spin text-[#2563EB]" />
              <span>Chargement des produits...</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Déterminer quel titre et icône afficher selon le filtre
  const getSectionInfo = () => {
    switch(activeFilter) {
      case 'bestseller':
        return { 
          title: 'Best Sellers', 
          icon: <Star size={20} className="fill-[#F59E0B] text-[#F59E0B]" />,
          color: 'from-amber-500 to-amber-600',
          badgeColor: 'bg-amber-100 text-amber-700'
        };
      case 'popular':
        return { 
          title: 'Popular Products', 
          icon: <TrendingUp size={20} className="text-[#2563EB]" />,
          color: 'from-blue-500 to-blue-600',
          badgeColor: 'bg-blue-100 text-blue-700'
        };
      case 'new':
        return { 
          title: 'New Arrivals', 
          icon: <Sparkles size={20} className="text-[#10B981]" />,
          color: 'from-green-500 to-green-600',
          badgeColor: 'bg-green-100 text-green-700'
        };
      default:
        return { 
          title: 'All Products', 
          icon: <FlaskConical size={20} className="text-[#2563EB]" />,
          color: 'from-[#2563EB] to-[#10B981]',
          badgeColor: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We provide the highest quality peptides with exceptional customer service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="text-[#2563EB]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lab Tested</h3>
              <p className="text-gray-500">Every batch is third-party tested for purity and potency</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#10B981]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">99% Purity</h3>
              <p className="text-gray-500">High-performance liquid chromatography verified</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-[#F59E0B]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Shipping</h3>
              <p className="text-gray-500">Discreet packaging with tracking worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section avec Filtres */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Our Products
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Discover our premium selection of research peptides
            </p>
          </div>

          {/* ✅ FILTRES - 4 boutons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FlaskConical size={16} />
              All ({counts.all})
            </button>
            <button
              onClick={() => setActiveFilter('bestseller')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === 'bestseller'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Star size={16} className="fill-current" />
              Best Sellers ({counts.bestseller})
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === 'popular'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={16} />
              Popular ({counts.popular})
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === 'new'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles size={16} />
              New ({counts.new})
            </button>
          </div>

          {/* ✅ TITRE DYNAMIQUE DE LA SECTION */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-gray-100 text-gray-700' : sectionInfo.badgeColor}`}>
              {sectionInfo.icon}
              <span className="font-semibold">{sectionInfo.title}</span>
              <span className="text-xs opacity-70">({filteredProducts.length})</span>
            </div>
          </div>

          {/* ✅ PRODUITS FILTRÉS - AVEC isPopular CORRIGÉ */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-gray-500">Aucun produit dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  dosage={product.dosage}
                  purity={product.purity}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  category={product.category}
                  isBestSeller={product.isBestSeller}
                  isPopular={product.isPopular}      // ✅ AJOUTÉ - C'EST CE QUI MANQUAIT !
                  isNew={product.isNew}
                  image={getImageUrl(product.image)}
                  onAddToCart={() => handleAddToCart(product)}
                  onQuickView={() => handleQuickView(product)}
                />
              ))}
            </div>
          )}

          {/* Bouton View All */}
          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="group bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white px-10 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5"
            >
              View All Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutPeptideWeightLoss />

      {/* Peptide Science Section */}
      <PeptideScience />

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-500">Thousands of satisfied customers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex text-[#F59E0B] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2563EB] to-[#10B981]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have achieved their weight loss goals with our premium peptides
          </p>
          <Link
            to="/marketplace"
            className="bg-[#F59E0B] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#D97706] transition-all duration-300 hover:-translate-y-0.5 shadow-lg inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const testimonials = [
  { text: 'Lost 15kg in 3 months. Life changing!', name: 'Sarah J.', result: 'Lost 15kg' },
  { text: 'Amazing quality and fast shipping', name: 'Michael T.', result: 'Lost 10kg' },
  { text: 'The customer service is outstanding', name: 'Emma L.', result: 'Lost 12kg' },
];

export default Home;