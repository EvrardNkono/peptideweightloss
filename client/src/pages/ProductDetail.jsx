// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  AlertCircle,
  Minus,
  Plus,
  Truck,
  Shield,
  Clock,
  Package,
  ChevronRight,
  Loader2,
  Info,
  FileText,
  ThumbsUp
} from 'lucide-react';

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('🔍 ProductDetail - ID reçu:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      console.error('❌ ID invalide');
      setError('Product ID is missing');
      setLoading(false);
      return;
    }
    
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`🔍 Fetching product: ${API_URL}/products/${id}`);
      const response = await axios.get(`${API_URL}/products/${id}`);
      
      console.log('📦 API Response:', response.data);
      
      let productData = null;
      
      if (response.data && response.data.success && response.data.data) {
        console.log('✅ Structure: success + data');
        productData = response.data.data;
      } else if (response.data && response.data.product) {
        console.log('✅ Structure: product');
        productData = response.data.product;
      } else if (response.data && response.data._id) {
        console.log('✅ Structure: direct product');
        productData = response.data;
      } else {
        console.error('❌ Structure inconnue:', response.data);
        setError('Unexpected response structure');
        setLoading(false);
        return;
      }
      
      if (!productData) {
        setError('Product not found');
        setLoading(false);
        return;
      }
      
      console.log('✅ Produit extrait:', productData);
      
      const safeProduct = {
        _id: productData._id || id,
        name: productData.name || 'Product',
        moreDetails: productData.moreDetails || productData.dosage || 'N/A',
        description: productData.description || `Premium ${productData.name || ''} peptide. High purity ${productData.purity || '≥99%'} with guaranteed quality.`,
        dosage: productData.dosage || productData.moreDetails || 'N/A',
        purity: productData.purity || '≥99%',
        price: productData.price || 0,
        oldPrice: productData.oldPrice || null,
        rating: productData.rating || 4.8,
        reviews: productData.reviews || 0,
        type: productData.type || 'peptide',
        category: productData.category || 'peptide',
        stock: productData.stock || 0,
        isNew: productData.isNew || false,
        isPopular: productData.isPopular || false,
        isBestSeller: productData.isBestSeller || false,
        image: productData.image || '/images/pept.png',
        status: productData.status || 'active',
        createdAt: productData.createdAt || new Date().toISOString(),
        likes: productData.likes || 0
      };
      
      console.log('✅ Produit sécurisé:', safeProduct);
      setProduct(safeProduct);
      setSelectedImage(safeProduct.image);
      setLikesCount(safeProduct.likes || 0);
      
      // ✅ Vérifier si l'utilisateur a déjà liké
      if (token && productData.likedBy) {
        try {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          setHasLiked(productData.likedBy.includes(userId));
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
      
      if (safeProduct.category) {
        fetchRelatedProducts(safeProduct.category);
      }
      
    } catch (err) {
      console.error('❌ Error fetching product:', err);
      
      if (err.response?.status === 404) {
        setError('Product not found');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/products?category=${category}&limit=4`);
      
      let products = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }
      
      setRelatedProducts(products.filter(p => p._id !== id).slice(0, 4));
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  // ✅ TOGGLE LIKE
  const handleToggleLike = async () => {
    if (!token) {
      alert('Please login to like this product');
      return;
    }
    
    if (isLiking) return;
    setIsLiking(true);
    
    try {
      const response = await axios.put(
        `${API_URL}/products/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setLikesCount(response.data.data.likes);
        setHasLiked(response.data.data.hasLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddToCart = () => {
    console.log('🛒 Adding to cart:', { productId: id, quantity });
    alert(`Added ${quantity} x ${product?.name || 'product'} to cart!`);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getTypeColor = (type) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    const colors = {
      peptide: 'bg-blue-100 text-blue-800',
      blend: 'bg-purple-100 text-purple-800',
      sarm: 'bg-indigo-100 text-indigo-800',
      steroid: 'bg-red-100 text-red-800',
      hgh: 'bg-emerald-100 text-emerald-800',
      pct: 'bg-amber-100 text-amber-800',
      'weight-loss': 'bg-green-100 text-green-800',
      african: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={18} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star key="half" size={18} className="fill-yellow-400 text-yellow-400 opacity-50" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={18} className="text-gray-300" />
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2563EB] mx-auto mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-2">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1E40AF] transition"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#2563EB]">Home</Link>
          <ChevronRight size={14} />
          <Link to="/marketplace" className="hover:text-[#2563EB]">Marketplace</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Left - Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
              <img
                src={selectedImage || '/images/pept.png'}
                alt={product.name}
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/pept.png';
                }}
              />
            </div>
            
            {/* Miniatures - UNIQUEMENT l'image du produit */}
            <div className="grid grid-cols-4 gap-3">
              {product.image && product.image !== '/images/pept.png' ? (
                <div
                  onClick={() => setSelectedImage(product.image)}
                  className={`bg-white rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === product.image ? 'border-[#2563EB] shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/pept.png';
                    }}
                  />
                </div>
              ) : (
                <div
                  onClick={() => setSelectedImage('/images/pept.png')}
                  className="bg-white rounded-xl overflow-hidden cursor-pointer border-2 border-[#2563EB] shadow-md"
                >
                  <img
                    src="/images/pept.png"
                    alt="Default"
                    className="w-full h-20 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(product.type)}`}>
                {product.type}
              </span>
              {product.isNew && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-emerald-100 text-emerald-800">
                  New
                </span>
              )}
              {product.isPopular && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-orange-100 text-orange-800">
                  Popular
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-amber-100 text-amber-800">
                  Best Seller
                </span>
              )}
              {product.stock > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-800">
                  In Stock
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            {/* Rating & Reviews & Likes */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(product.rating || 4.8)}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating || 4.8} ({product.reviews || 0} reviews)
              </span>
              
              {/* BOUTON LIKE */}
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  hasLiked 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {isLiking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ThumbsUp size={16} className={hasLiked ? 'fill-white' : ''} />
                )}
                <span>{likesCount}</span>
              </button>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.oldPrice ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-[#2563EB]">{formatPrice(product.price)}</span>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-[#2563EB]">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Info size={14} />
                  Details
                </span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">
                  {product.moreDetails || product.dosage || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Purity</span>
                <span className="font-medium text-gray-800">{product.purity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-800 capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Stock</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? '✅ Available' : '❌ Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                  product.stock > 0
                    ? 'bg-[#2563EB] text-white hover:bg-[#1E40AF]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => setIsWishlist(!isWishlist)}
                className={`px-6 py-3 rounded-xl border transition ${
                  isWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Heart size={20} className={isWishlist ? 'fill-red-500' : ''} />
              </button>
              <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 transition">
                <Share2 size={20} />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} className="text-[#2563EB]" />
                <span>Insured Global Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-[#2563EB]" />
                <span>Lab-Tested Purity</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-[#2563EB]" />
                <span>Ships in 1–5 Days</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={16} className="text-[#2563EB]" />
                <span>Privacy-Protected Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-[#2563EB]" />
              <h2 className="text-xl font-bold text-gray-800">Product Description</h2>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || `Premium ${product.name} peptide. High purity ${product.purity} with guaranteed quality.`}
            </p>
            
            {product.moreDetails && product.moreDetails !== product.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">📋 More Details</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.moreDetails}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
              <Link to="/marketplace" className="text-sm text-[#2563EB] hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  to={`/product/${related._id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
                >
                  <img
                    src={related.image || '/images/pept.png'}
                    alt={related.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/pept.png';
                    }}
                  />
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{related.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[#2563EB] font-bold">{formatPrice(related.price)}</p>
                    {related.likes > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <ThumbsUp size={12} /> {related.likes}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;