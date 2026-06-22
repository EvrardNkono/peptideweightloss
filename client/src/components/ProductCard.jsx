// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Heart, TrendingUp, FlaskConical, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ 
  id,
  _id,
  name, 
  dosage, 
  purity = "≥99%", 
  price, 
  oldPrice, 
  rating = 4.9, 
  reviews = 0,
  category,
  image = "/images/pept.png",
  isBestSeller = false,
  isPopular = false,
  isNew = false,
  stock = 0,
  onQuickView
}) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const productId = _id || id;

  if (!productId) {
    console.warn('⚠️ ProductCard: Missing ID for product:', name);
  }

  const _isBestSeller = isBestSeller === true || isBestSeller === 'true';
  const _isPopular    = isPopular === true    || isPopular === 'true';
  const _isNew        = isNew === true        || isNew === 'true';

  const getProductColor = () => {
    if (name?.includes('Semaglutide')) return 'blue';
    if (name?.includes('Tirzepatide')) return 'green';
    if (name?.includes('AOD-9604')) return 'yellow';
    if (category === 'premium') return 'blue';
    if (category === 'popular') return 'green';
    return 'blue';
  };

  const color = getProductColor();
  
  const colorClasses = {
    blue: {
      bg: 'bg-[#2563EB]',
      bgLight: 'bg-[#2563EB]/10',
      text: 'text-[#2563EB]',
      border: 'border-[#2563EB]',
      hover: 'hover:bg-[#2563EB]',
      gradient: 'from-[#2563EB] to-[#1E40AF]'
    },
    green: {
      bg: 'bg-[#10B981]',
      bgLight: 'bg-[#10B981]/10',
      text: 'text-[#10B981]',
      border: 'border-[#10B981]',
      hover: 'hover:bg-[#10B981]',
      gradient: 'from-[#10B981] to-[#059669]'
    },
    yellow: {
      bg: 'bg-[#F59E0B]',
      bgLight: 'bg-[#F59E0B]/10',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]',
      hover: 'hover:bg-[#F59E0B]',
      gradient: 'from-[#F59E0B] to-[#D97706]'
    }
  };

  const colors = colorClasses[color];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
        ))}
        {hasHalfStar && (
          <Star key="half" size={12} className="fill-[#F59E0B] text-[#F59E0B] opacity-50" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={12} className="text-gray-300" />
        ))}
      </>
    );
  };

  // ✅ Toujours utiliser le contexte directement
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (stock <= 0) return;
    
    const productData = {
      id: productId,
      name: name,
      price: price,
      image: image,
      dosage: dosage,
    };
    
    addToCart(productData);

    // Feedback visuel
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const CardContent = () => (
    <>
      {/* BADGES */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
        {_isBestSeller && (
          <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star size={10} className="fill-white" />
            BEST SELLER
          </div>
        )}
        {_isPopular && (
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <TrendingUp size={10} className="text-white" />
            POPULAR
          </div>
        )}
        {_isNew && (
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            ✨ NEW
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-hidden">
        <div className="relative rounded-xl overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/pept.png';
            }}
          />
        </div>
        
        {/* Badge purity */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
          <div className="flex items-center gap-1">
            <FlaskConical size={10} className="text-[#10B981]" />
            <span className="text-[10px] font-semibold text-gray-700">{purity}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {category && (
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {category}
          </div>
        )}

        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
          {name}
        </h3>

        <p className="text-sm text-gray-500 mb-2">{dosage}</p>

        {/* Stock badge */}
        <div className="flex items-center gap-1 mb-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            stock > 0 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-500'
          }`}>
            {stock > 0 ? '● Available' : '● Out of Stock'}
          </span>
        </div>

        {/* Rating et Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {renderStars(rating)}
          </div>
          <span className="text-sm font-semibold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">
            ({reviews} {reviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">${price}</span>
          {oldPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">${oldPrice}</span>
              <span className="text-xs font-semibold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full">
                -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {productId ? (
        <Link to={`/product/${productId}`} className="block">
          <CardContent />
        </Link>
      ) : (
        <div className="block">
          <CardContent />
        </div>
      )}

      {/* Actions rapides (hover) */}
      <div className={`absolute top-3 right-3 z-30 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart size={14} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onQuickView) onQuickView();
          }}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Eye size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Bouton Add to Cart */}
      <div className="p-4 pt-0">
        <button 
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : addedToCart
                ? 'bg-green-500 text-white'
                : `${colors.bgLight} ${colors.text} hover:text-white hover:${colors.bg}`
          } group/btn`}
        >
          {addedToCart ? (
            <>
              <Check size={16} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart size={16} className="transition-transform group-hover/btn:scale-110" />
              {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1 mt-3">
          <TrendingUp size={10} className="text-[#10B981]" />
          <span className="text-[10px] text-gray-400">Free shipping on orders $1000+</span>
        </div>
      </div>

      {/* Bordure colorée en bas */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </div>
  );
};

export default ProductCard;