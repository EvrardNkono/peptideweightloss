// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
import BlogPost from './pages/BlogPost'; // ✅ IMPORT DU BLOG POST

const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const isAdminPage = location.pathname.startsWith('/admin');

  // ✅ ÉTATS PARTAGÉS POUR LES MENUS
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketplaceDropdownOpen, setIsMarketplaceDropdownOpen] = useState(false);

  // ✅ FONCTION POUR OUVRIR LE BON MENU SELON L'APPAREIL
  const openMarketplaceMenu = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(true);
    } else {
      setIsMarketplaceDropdownOpen(true);
    }
  };

  console.log('📍 Pathname:', location.pathname);
  console.log('🏷️ isAdminPage:', isAdminPage);

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
          
          {/* ✅ ROUTES SHOP */}
          <Route path="/shop" element={<Marketplace />} />
          <Route path="/shop/peptides" element={<Peptides />} />
          <Route path="/shop/blends" element={<PeptideBlends />} />
          <Route path="/shop/:category" element={<Marketplace />} />
          
          {/* ✅ ROUTES MARKETPLACE */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:category" element={<Marketplace />} />
          
          {/* ✅ ROUTES PRODUITS */}
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* ✅ CART PAGE */}
          <Route path="/cart" element={<CartPage />} />
          
          {/* ✅ CHECKOUT PAGE */}
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
          <Route path="/blog/:id" element={<BlogPost />} /> {/* ✅ ARTICLE COMPLET */}
          
          {/* ✅ ADMIN ROUTES */}
          <Route path="/admin/*" element={<AdminDashboard onLogout={() => {}} token={token} />} />
          
          {/* ✅ ROUTE 404 - FALLBACK */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-500">Page not found</p>
              <a href="/" className="mt-4 inline-block text-[#2563EB] hover:underline">Go back home</a>
            </div>
          </div>} />
        </Routes>
      </main>
      <Footer />
      
      {/* ✅ BOUTON WHATSAPP SUR TOUTES LES PAGES */}
      <WhatsAppButton />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;