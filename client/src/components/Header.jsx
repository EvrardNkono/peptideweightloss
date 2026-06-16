// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, User, ShoppingCart, Menu, X, Activity, ChevronDown, 
  FlaskConical, Beaker, FlaskRound as Flask, Microscope, Pill, 
  Syringe, TestTube, Building2, Trophy, Star, Award, Store, 
  Package, Layers, FileText, Stethoscope, MapPin
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isLabsDropdownOpen, setIsLabsDropdownOpen] = useState(false);
  const [isMarketplaceDropdownOpen, setIsMarketplaceDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const labsTimeoutRef = useRef(null);
  const marketplaceTimeoutRef = useRef(null);

  // Gérer l'ouverture du dropdown Shop avec délai
  const handleShopMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsShopDropdownOpen(true);
  };

  const handleShopMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsShopDropdownOpen(false);
    }, 150);
  };

  // Gérer l'ouverture du dropdown Labs avec délai
  const handleLabsMouseEnter = () => {
    if (labsTimeoutRef.current) clearTimeout(labsTimeoutRef.current);
    setIsLabsDropdownOpen(true);
  };

  const handleLabsMouseLeave = () => {
    labsTimeoutRef.current = setTimeout(() => {
      setIsLabsDropdownOpen(false);
    }, 150);
  };

  // Gérer l'ouverture du dropdown Marketplace avec délai
  const handleMarketplaceMouseEnter = () => {
    if (marketplaceTimeoutRef.current) clearTimeout(marketplaceTimeoutRef.current);
    setIsMarketplaceDropdownOpen(true);
  };

  const handleMarketplaceMouseLeave = () => {
    marketplaceTimeoutRef.current = setTimeout(() => {
      setIsMarketplaceDropdownOpen(false);
    }, 150);
  };

  // Nettoyer les timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (labsTimeoutRef.current) clearTimeout(labsTimeoutRef.current);
      if (marketplaceTimeoutRef.current) clearTimeout(marketplaceTimeoutRef.current);
    };
  }, []);

  // Liste des 10 laboratoires les plus crédibles
  const topLabs = [
    { name: 'Quanta', href: '/labs/quanta', rank: 1, icon: <Trophy size={16} className="text-yellow-500" />, description: 'Gold Standard' },
    { name: 'Viogen', href: '/labs/viogen', rank: 2, icon: <Star size={16} className="text-blue-500" />, description: 'Cult Favorite' },
    { name: 'Deus Medical', href: '/labs/deus-medical', rank: 3, icon: <Building2 size={16} />, description: 'The Consistent Performer' },
    { name: 'Balkan Pharmaceuticals', href: '/labs/balkan', rank: 4, icon: <Pill size={16} />, description: 'Pharma-Grade' },
    { name: 'Pharmacom', href: '/labs/pharmacom', rank: 5, icon: <Flask size={16} />, description: 'Legacy Name' },
    { name: 'Pharmaqo', href: '/labs/pharmaqo', rank: 6, icon: <Syringe size={16} />, description: 'The New Contender' },
    { name: 'Intex Pharma', href: '/labs/intex-pharma', rank: 7, icon: <Beaker size={16} />, description: 'The Specialist' },
    { name: 'Status', href: '/labs/status', rank: 8, icon: <Activity size={16} />, description: 'The Underrated Pick' },
    { name: 'A-Tech Labs', href: '/labs/atech', rank: 9, icon: <Microscope size={16} />, description: 'The Transparent One' },
    { name: 'Morph', href: '/labs/morph', rank: 10, icon: <Award size={16} />, description: 'High Potential' },
  ];

  // Marketplace dropdown items
  const marketplaceItems = [
    { name: 'All Products', href: '/marketplace', icon: <Store size={16} />, description: 'Browse everything' },
    { name: 'SARMs', href: '/marketplace/sarms', icon: <FlaskConical size={16} />, description: 'Selective Androgen Receptor Modulators' },
    { name: 'HGH', href: '/marketplace/hgh', icon: <Activity size={16} />, description: 'Human Growth Hormone' },
    { name: 'Steroids', href: '/marketplace/steroids', icon: <Pill size={16} />, description: 'Anabolic compounds' },
    { name: 'Post Cycle Therapy', href: '/marketplace/pct', icon: <Package size={16} />, description: 'PCT & ancillaries' },
    { name: 'Weight Loss', href: '/marketplace/weight-loss', icon: <Beaker size={16} />, description: 'Semaglutide, Tirzepatide & more' },
    { name: 'African Products', href: '/marketplace/african-products', icon: <MapPin size={16} className="text-[#10B981]" />, description: '🇿🇦 Premium African products' },
  ];

  const navItems = [
    { 
      name: 'BUY PEPTIDES', 
      href: '/shop',
      hasDropdown: true,
      dropdownKey: 'shop',
      dropdownItems: [
        { name: 'Peptides', href: '/shop/peptides', icon: <FlaskConical size={16} /> },
        { name: 'Peptide Blends', href: '/shop/blends', icon: <Beaker size={16} /> }
      ]
    },
    { 
      name: 'GENERAL MARKETPLACE', 
      href: '/marketplace',
      hasDropdown: true,
      dropdownKey: 'marketplace',
      dropdownItems: marketplaceItems
    },
    { 
      name: 'OUR LABS', 
      href: '/labs',
      hasDropdown: true,
      dropdownKey: 'labs',
      dropdownItems: topLabs
    },
    { name: 'PRESCRIPTION', href: '/prescription', hasDropdown: false },
    { name: 'ABOUT US', href: '/about', hasDropdown: false },
    { name: 'KNOWLEDGE CENTER', href: '/knowledge', hasDropdown: false },
    { name: 'CONTACT US', href: '/contact', hasDropdown: false },
  ];

  // Fonction pour obtenir le gestionnaire d'événements selon le dropdown
  const getDropdownHandlers = (dropdownKey) => {
    switch(dropdownKey) {
      case 'shop':
        return { onMouseEnter: handleShopMouseEnter, onMouseLeave: handleShopMouseLeave, isOpen: isShopDropdownOpen };
      case 'marketplace':
        return { onMouseEnter: handleMarketplaceMouseEnter, onMouseLeave: handleMarketplaceMouseLeave, isOpen: isMarketplaceDropdownOpen };
      case 'labs':
        return { onMouseEnter: handleLabsMouseEnter, onMouseLeave: handleLabsMouseLeave, isOpen: isLabsDropdownOpen };
      default:
        return { onMouseEnter: () => {}, onMouseLeave: () => {}, isOpen: false };
    }
  };

  // Fonction pour obtenir le contenu du dropdown selon le type
  const renderDropdownContent = (item) => {
    const handlers = getDropdownHandlers(item.dropdownKey);
    
    if (item.dropdownKey === 'shop') {
      return handlers.isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
        >
          {item.dropdownItems.map((subItem) => (
            <Link
              key={subItem.name}
              to={subItem.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2563EB] transition-colors"
            >
              <span className="text-[#2563EB]">{subItem.icon}</span>
              <span className="text-sm font-medium">{subItem.name}</span>
            </Link>
          ))}
        </div>
      );
    }
    
    if (item.dropdownKey === 'marketplace') {
      return handlers.isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
        >
          <Link
            to="/marketplace"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#F59E0B]/5 to-[#2563EB]/5 hover:from-[#F59E0B]/10 hover:to-[#2563EB]/10 transition-colors"
          >
            <span className="font-bold text-[#F59E0B]">🛒 ALL MARKETPLACE</span>
            <span className="text-xs text-[#2563EB]">view all →</span>
          </Link>
          
          <div className="grid grid-cols-2 gap-1 p-2">
            {item.dropdownItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className="flex flex-col items-start gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className={`${subItem.name === 'African Products' ? 'text-[#10B981]' : 'text-[#F59E0B]'} group-hover:text-[#2563EB] transition-colors`}>
                    {subItem.icon}
                  </span>
                  <span className={`text-sm font-medium ${subItem.name === 'African Products' ? 'text-[#10B981]' : 'text-gray-700'} group-hover:text-[#2563EB]`}>
                    {subItem.name}
                  </span>
                </div>
                {subItem.description && (
                  <span className="text-xs text-gray-400 pl-6">{subItem.description}</span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
              <span>Premium products</span>
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
              <span>Fast shipping</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (item.dropdownKey === 'labs') {
      return handlers.isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
        >
          <Link
            to="/labs"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#2563EB]/5 to-[#10B981]/5 hover:from-[#2563EB]/10 hover:to-[#10B981]/10 transition-colors"
          >
            <span className="font-bold text-[#2563EB]">🏆 ALL TOP LABS</span>
            <span className="text-xs text-[#10B981]">10 verified →</span>
          </Link>
          
          <div className="max-h-[400px] overflow-y-auto">
            {item.dropdownItems.map((lab) => (
              <Link
                key={lab.name}
                to={lab.href}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs font-mono w-5">#{lab.rank}</span>
                  <span className="text-[#2563EB] group-hover:text-[#10B981] transition-colors">
                    {lab.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#2563EB]">
                    {lab.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-[#10B981] transition-colors">
                  {lab.description}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></span>
              <span>Third-party tested labs</span>
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
              <span>10 verified partners</span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar - Support email + My Account */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-xs sm:text-sm">
            <div className="text-gray-500">
              <span className="hidden sm:inline text-[#10B981]">support@</span>
              <span className="text-[#2563EB]">peptideweightloss.com</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/account" 
                className="text-gray-600 hover:text-[#2563EB] transition flex items-center gap-1"
              >
                <User size={14} className="text-[#2563EB]" />
                <span className="hover:text-[#2563EB]">MY ACCOUNT</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <Activity className="text-[#2563EB] group-hover:text-[#10B981] transition-colors" size={28} />
            <div className="font-bold text-xl sm:text-2xl">
              <span className="text-[#2563EB] group-hover:text-[#2563EB]/80 transition">Peptide</span>
              <span className="text-[#10B981] group-hover:text-[#10B981]/80 transition">Weight</span>
              <span className="text-[#F59E0B] group-hover:text-[#F59E0B]/80 transition">Loss</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const handlers = getDropdownHandlers(item.dropdownKey);
              const isOpen = handlers.isOpen;
              
              return (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div 
                      className="relative inline-block"
                      onMouseEnter={handlers.onMouseEnter}
                      onMouseLeave={handlers.onMouseLeave}
                    >
                      <button
                        className="flex items-center gap-1 text-gray-700 font-semibold text-sm tracking-wide hover:text-[#2563EB] transition-colors py-2"
                      >
                        {item.name}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {renderDropdownContent(item)}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-gray-700 font-semibold text-sm tracking-wide hover:text-[#2563EB] transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-[#2563EB] transition">
              <Search size={20} />
            </button>
            
            <button className="text-gray-600 hover:text-[#2563EB] transition relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-[#F59E0B] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
            
            <button
              className="lg:hidden text-gray-600 hover:text-[#2563EB] transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <>
                    <div className="py-3 text-gray-700 font-medium">
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1 border-l-2 border-[#2563EB]/20 ml-2 mb-2">
                      {item.dropdownItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="flex items-center gap-3 py-2 text-gray-600 hover:text-[#2563EB] transition-colors text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-[#F59E0B]">
                            {subItem.icon || (subItem.rank && <span className="text-xs">#{subItem.rank}</span>)}
                          </span>
                          <span className="flex-1">{subItem.name}</span>
                          {subItem.description && (
                            <span className="text-xs text-gray-400">{subItem.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="block py-3 text-gray-700 font-medium hover:text-[#2563EB] hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;