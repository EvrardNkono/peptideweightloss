// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  Package,
  AlertTriangle,
  X,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    clearCart,
    getCartTotal,
    getItemCount,
    getCartSavings
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const total = getCartTotal();
  const itemCount = getItemCount();
  const savings = getCartSavings();
  const shipping = total > 200 ? 0 : 9.99;
  const grandTotal = total - savings + shipping;

  // ✅ Appliquer un code promo (simulé)
  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E40AF] transition"
          >
            <ArrowLeft size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingBag size={28} className="text-[#2563EB]" />
            Your Cart
          </h1>
          <span className="text-gray-500 text-sm">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                <span className="col-span-2">Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="px-4 md:px-6 py-4">
                    <div className="flex flex-col md:grid md:grid-cols-5 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-2 flex items-center gap-4 w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          onError={(e) => { e.target.src = '/images/pept.png'; }}
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-400">{item.dosage}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-600 text-sm font-medium mt-1 flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-center md:text-left">
                        <span className="font-semibold text-gray-800">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Minus size={16} className="text-gray-500" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Plus size={16} className="text-gray-500" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right font-bold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                <Link
                  to="/marketplace"
                  className="text-[#2563EB] font-medium hover:underline flex items-center gap-1"
                >
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-500 font-medium hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Savings</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-xs text-gray-400 text-right">
                    Free shipping on orders $200+
                  </div>
                )}
              </div>

              {/* Promo Code */}
              <div className="py-4 border-b border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2563EB] outline-none"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-500 text-xs mt-1">✅ Promo code applied!</p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#2563EB]">${grandTotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                  <Truck size={14} />
                  <span>Free shipping on orders $1000+</span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1E40AF] transition"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 text-center pt-2">
                  <div className="flex flex-col items-center gap-1">
                    <Shield size={14} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Clock size={14} />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Package size={14} />
                    <span>Discreet Packaging</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles size={14} />
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;