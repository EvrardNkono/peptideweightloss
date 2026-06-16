// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Peptides from './pages/Peptides';
import PeptideBlends from './pages/PeptideBlends';
import Marketplace from './pages/Marketplace';
import MyPrescriptions from './pages/MyPrescriptions';  // ← AJOUTER CET IMPORT
import About from './pages/About';
import KnowledgeCenter from './pages/KnowledgeCenter';
import Contact from './pages/Contact';
import Account from './pages/Account';
import Prescription from './pages/Prescription';
import Labs from './pages/Labs';

function App() {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/peptides" element={<Peptides />} />
          <Route path="/shop/blends" element={<PeptideBlends />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:category" element={<Marketplace />} />
          <Route path="/my-prescriptions" element={<MyPrescriptions token={token} />} />  {/* ← AJOUTER CETTE ROUTE */}
          <Route path="/about" element={<About />} />
          <Route path="/knowledge" element={<KnowledgeCenter />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:labId" element={<Labs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;