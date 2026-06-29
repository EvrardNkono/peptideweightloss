// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Peptides from './pages/Peptides';
import PeptideBlends from './pages/PeptideBlends';
import Marketplace from './pages/Marketplace';
import MyPrescriptions from './pages/MyPrescriptions';
import About from './pages/About';
import KnowledgeCenter from './pages/KnowledgeCenter';
import Contact from './pages/Contact';
import Account from './pages/Account';
import Prescription from './pages/Prescription';
import Labs from './pages/Labs';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

const AppContent = () => {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketplaceDropdownOpen, setIsMarketplaceDropdownOpen] = useState(false);

  const openMarketplaceMenu = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(true);
    } else {
      setIsMarketplaceDropdownOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/';
  };

  console.log('📍 Pathname:', location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMarketplaceDropdownOpen={isMarketplaceDropdownOpen}
        setIsMarketplaceDropdownOpen={setIsMarketplaceDropdownOpen}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onOpenMarketplace={openMarketplaceMenu} />} />
          
          {/* ✅ ROUTES SHOP - AVEC SOUS-CATEGORIES */}
          <Route path="/shop" element={<Marketplace />} />
          <Route path="/shop/peptides" element={<Peptides />} />
          <Route path="/shop/peptides/:categorySlug" element={<Peptides />} />
          <Route path="/shop/blends" element={<PeptideBlends />} />
          <Route path="/shop/:category" element={<Marketplace />} />
          
          {/* ✅ ROUTES MARKETPLACE - AVEC SOUS-CATEGORIES DYNAMIQUES */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:category" element={<Marketplace />} />
          
          {/* ✅ ROUTES PRODUITS */}
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* ✅ CART & CHECKOUT */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* ✅ AUTRES ROUTES */}
          <Route path="/my-prescriptions" element={<MyPrescriptions token={token} />} />
          <Route path="/about" element={<About />} />
          <Route path="/knowledge" element={<KnowledgeCenter />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:labId" element={<Labs />} />
          
          {/* ✅ BLOG ROUTES */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          
          {/* ✅ ADMIN ROUTES */}
          <Route path="/admin/*" element={<AdminDashboard onLogout={handleLogout} token={token} />} />
          
          {/* ✅ ROUTE 404 - FALLBACK */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// ✅ COMPOSANT 404
const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gray-50">
    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page not found</h2>
    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
    <a href="/" className="px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1E40AF] transition shadow-md hover:shadow-lg">
      Go back home
    </a>
  </div>
);

function App() {
  return (
    <CartProvider>
      <ProductProvider>
        <Router>
          <AppContent />
        </Router>
      </ProductProvider>
    </CartProvider>
  );
}

export default App;