// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        setCart([]);
      }
    }
  }, []);

  // ✅ Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Ajouter un produit au panier
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id || product._id,
            name: product.name,
            price: product.price,
            image: product.image || '/images/pept.png',
            dosage: product.dosage || 'N/A',
            quantity: quantity,
            selectedSupplements: [],
            notes: ''
          }
        ];
      }
    });
  };

  // ✅ Retirer un produit du panier
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // ✅ Mettre à jour la quantité
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // ✅ Augmenter la quantité
  const increaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ✅ Diminuer la quantité
  const decreaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ✅ Vider le panier
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // ✅ Calculer le total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // ✅ Calculer le nombre d'articles
  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // ✅ Calculer les économies
  const getCartSavings = () => {
    return 0;
  };

  // ✅ Ajouter une note à un article
  const addNoteToItem = (productId, note) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, notes: note }
          : item
      )
    );
  };

  // ✅ Ajouter un supplément à un article
  const addSupplementToItem = (productId, supplement) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? {
              ...item,
              selectedSupplements: [...(item.selectedSupplements || []), supplement]
            }
          : item
      )
    );
  };

  // ✅ Retirer un supplément
  const removeSupplementFromItem = (productId, supplementId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? {
              ...item,
              selectedSupplements: (item.selectedSupplements || []).filter(
                s => s.id !== supplementId
              )
            }
          : item
      )
    );
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    getCartSavings,
    addNoteToItem,
    addSupplementToItem,
    removeSupplementFromItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook personnalisé
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;