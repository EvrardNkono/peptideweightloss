// src/components/CartDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getItemCount, getCartTotal } = useCart();

  const itemCount = getItemCount();
  const total = getCartTotal();

  // ✅ Fermer le dropdown au clic externe
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🛒 Icône du panier */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
        aria-label="Open cart"
      >
        <ShoppingCart size={22} className="text-gray-700" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      {/* 📋 Dropdown du panier */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Your Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Your cart is empty</p>
                <Link
                  to="/marketplace"
                  className="mt-3 inline-block text-[#2563EB] text-sm font-medium hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Start Shopping →
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                    onError={(e) => { e.target.src = '/images/pept.png'; }}
                  />
                  
                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.dosage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-0.5 hover:bg-gray-200 rounded transition"
                      >
                        <Minus size={12} className="text-gray-500" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-0.5 hover:bg-gray-200 rounded transition"
                      >
                        <Plus size={12} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Prix + Remove */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center bg-[#2563EB] text-white py-2 rounded-xl font-semibold hover:bg-[#1E40AF] transition flex items-center justify-center gap-1"
                >
                  Checkout <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;