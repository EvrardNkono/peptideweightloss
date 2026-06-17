// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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

// ✅ Composant qui a accès au Router
const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // ✅ Vérifier si on est sur une page admin
  const isAdminPage = location.pathname.startsWith('/admin');

  console.log('📍 Pathname:', location.pathname);
  console.log('🏷️ isAdminPage:', isAdminPage);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/peptides" element={<Peptides />} />
          <Route path="/shop/blends" element={<PeptideBlends />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:category" element={<Marketplace />} />
          <Route path="/my-prescriptions" element={<MyPrescriptions token={token} />} />
          <Route path="/about" element={<About />} />
          <Route path="/knowledge" element={<KnowledgeCenter />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:labId" element={<Labs />} />
          <Route path="/admin/*" element={<AdminDashboard onLogout={() => {}} token={token} />} />
        </Routes>
      </main>
      {/* ✅ FOOTER - Caché sur les pages admin */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;