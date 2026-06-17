// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle,
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
  Award
} from 'lucide-react';

// Configuration API
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    console.log('🔍 ProductDetail - ID reçu:', id);
    console.log('🔍 Type de ID:', typeof id);
    
    if (!id || id === 'undefined' || id === 'null' || id === '') {
      console.error('❌ ID invalide');
      setError('Invalid product ID');
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
      
      // 🔍 LOG DÉTAILLÉ DE LA RÉPONSE
      console.log('📦 FULL API RESPONSE:', JSON.stringify(response.data, null, 2));
      console.log('📦 Response status:', response.status);
      console.log('📦 Response data type:', typeof response.data);
      console.log('📦 Response data keys:', Object.keys(response.data));
      
      // ✅ ESSAYER DIFFÉRENTES STRUCTURES DE RÉPONSE
      let productData = null;
      
      // Structure 1: { success: true, product: {...} }
      if (response.data && response.data.success && response.data.product) {
        console.log('✅ Structure 1: success + product');
        productData = response.data.product;
      }
      // Structure 2: { product: {...} }
      else if (response.data && response.data.product) {
        console.log('✅ Structure 2: product direct');
        productData = response.data.product;
      }
      // Structure 3: { data: {...} }
      else if (response.data && response.data.data) {
        console.log('✅ Structure 3: data wrapper');
        productData = response.data.data;
      }
      // Structure 4: Directement le produit
      else if (response.data && response.data._id) {
        console.log('✅ Structure 4: Direct product object');
        productData = response.data;
      }
      // Structure 5: Array avec un élément
      else if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('✅ Structure 5: Array');
        productData = response.data[0];
      }
      // Structure 6: Si la réponse a une propriété qui contient le produit
      else {
        console.log('⚠️ Structure inconnue, recherche d\'un objet avec _id');
        const keys = Object.keys(response.data);
        for (const key of keys) {
          const value = response.data[key];
          if (value && typeof value === 'object' && value._id) {
            productData = value;
            console.log(`✅ Structure 6: Trouvé dans la propriété "${key}"`);
            break;
          }
        }
      }
      
      if (!productData) {
        console.error('❌ Aucun produit trouvé dans la réponse');
        console.log('📦 Contenu complet de la réponse:', response.data);
        setError('Product not found in response');
        setLoading(false);
        return;
      }
      
      console.log('✅ Produit extrait:', productData);
      console.log('✅ Product ID:', productData._id);
      console.log('✅ Product Name:', productData.name);
      console.log('✅ Product Image:', productData.image);
      
      // S'assurer que le produit a toutes les propriétés nécessaires
      const sanitizedProduct = {
        ...productData,
        image: productData.image || '/images/pept.png',
        price: productData.price || 0,
        oldPrice: productData.oldPrice || null,
        stock: productData.stock || 0,
        rating: productData.rating || 4.8,
        reviews: productData.reviews || 0,
        type: productData.type || 'peptide',
        category: productData.category || productData.type || 'peptide',
        isNew: productData.isNew || false,
        isPopular: productData.isPopular || false,
        isBestSeller: productData.isBestSeller || false,
        purity: productData.purity || '≥99%',
        dosage: productData.dosage || 'N/A',
        description: productData.description || `Premium ${productData.name || ''} peptide.`
      };
      
      setProduct(sanitizedProduct);
      setSelectedImage(sanitizedProduct.image);
      
      // Fetch related products
      if (sanitizedProduct.category) {
        fetchRelatedProducts(sanitizedProduct.category);
      }
      
    } catch (err) {
      console.error('❌ Error fetching product:', err);
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      if (err.response?.status === 404) {
        setError('Product not found');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/products?category=${category}&limit=4`);
      
      let products = [];
      if (response.data.success && response.data.products) {
        products = response.data.products;
      } else if (Array.isArray(response.data.data)) {
        products = response.data.data;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }
      
      setRelatedProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const handleAddToCart = () => {
    console.log('🛒 Adding to cart:', { productId: id, quantity, product });
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

  // Afficher l'erreur avec plus de détails
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2563EB] mx-auto mb-4" />
          <p className="text-gray-500">Loading product details...</p>
          <p className="text-xs text-gray-400 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-2">{error || 'The product you are looking for does not exist.'}</p>
          <p className="text-xs text-gray-400 mb-6">ID: {id}</p>
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
          <span className="text-gray-800 font-medium truncate">{product.name || 'Product'}</span>
        </nav>

        {/* Debug info (à supprimer plus tard) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4 text-xs text-gray-600">
          <p>🔍 Debug: Product ID: {product._id}</p>
          <p>📦 Product data: {JSON.stringify(product, null, 2).substring(0, 200)}...</p>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Left - Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
              <img
                src={selectedImage || '/images/pept.png'}
                alt={product.name || 'Product'}
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/pept.png';
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[product.image, '/images/pept.png'].filter(Boolean).map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`bg-white rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === img ? 'border-[#2563EB] shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name || 'Product'} ${index + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/pept.png';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.type && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(product.type)}`}>
                  {product.type}
                </span>
              )}
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
              {product.stock > 50 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-800">
                  In Stock
                </span>
              )}
              {product.stock <= 10 && product.stock > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-yellow-100 text-yellow-800">
                  Low Stock
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name || 'Product'}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating || 4.8) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating || 4.8} ({product.reviews || 0} reviews)
              </span>
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
              {product.dosage && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dosage</span>
                  <span className="font-medium text-gray-800">{product.dosage}</span>
                </div>
              )}
              {product.purity && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Purity</span>
                  <span className="font-medium text-gray-800">{product.purity}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800 capitalize">{product.category}</span>
                </div>
              )}
              {product.stock !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock</span>
                  <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                  </span>
                </div>
              )}
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
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-[#2563EB]" />
                <span>Quality guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-[#2563EB]" />
                <span>24h dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={16} className="text-[#2563EB]" />
                <span>Discreet packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Product Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description || `Premium ${product.name || ''} peptide. High purity ${product.purity || '≥99%'} with guaranteed quality.`}
            </p>
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
                  <p className="text-[#2563EB] font-bold">{formatPrice(related.price)}</p>
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