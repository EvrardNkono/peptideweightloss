// src/context/ProductContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products`);
        let apiProducts = response.data.data || [];
        apiProducts = apiProducts.filter(p => p.status !== 'inactive');
        
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
          image: getImageUrl(p.image),
          stock: p.stock || 0,
          description: p.description || ''
        }));
        
        setAllProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Impossible de charger les produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fonction de recherche côté client
  const searchProducts = (query) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    
    return allProducts.filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.dosage?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.type?.toLowerCase().includes(searchTerm)
      );
    });
  };

  return (
    <ProductContext.Provider value={{
      allProducts,
      loading,
      error,
      searchProducts,
      getImageUrl
    }}>
      {children}
    </ProductContext.Provider>
  );
};