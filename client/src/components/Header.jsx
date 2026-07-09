// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, User, ShoppingCart, Menu, X, Activity, ChevronDown, 
  FlaskConical, Beaker, FlaskRound as Flask, Microscope, Pill, 
  Syringe, TestTube, Building2, Trophy, Star, Award, Store, 
  Package, Layers, FileText, Stethoscope, MapPin, BookOpen,
  Info, Mail, PenTool, XCircle, Tag, Loader2, ChevronRight
} from 'lucide-react';
import CartDropdown from './CartDropdown';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import axios from 'axios';

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const Header = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isMarketplaceDropdownOpen,
  setIsMarketplaceDropdownOpen
}) => {
  const { getItemCount } = useCart();
  const { searchProducts } = useProducts();
  const navigate = useNavigate();
  
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isLabsDropdownOpen, setIsLabsDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  
  // ✅ ÉTATS POUR LES CATÉGORIES DYNAMIQUES
  const [peptideCategories, setPeptideCategories] = useState([]);
  const [marketplaceCategories, setMarketplaceCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // États de recherche
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const timeoutRef = useRef(null);
  const labsTimeoutRef = useRef(null);
  const marketplaceTimeoutRef = useRef(null);
  const companyTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const itemCount = getItemCount();

  // ✅ CHARGER LES CATÉGORIES DEPUIS L'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        if (res.data.success) {
          const allCategories = res.data.data || [];
          
          // Séparer les catégories par section
          const peptides = allCategories.filter(cat => cat.section === 'peptides' && cat.isActive);
          const marketplace = allCategories.filter(cat => cat.section === 'marketplace' && cat.isActive);
          
          setPeptideCategories(peptides);
          setMarketplaceCategories(marketplace);
        }
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
        // Fallback en cas d'erreur
        setPeptideCategories([
          { name: 'Peptide Blends', slug: 'blends', color: '#10B981' },
          { name: 'GLP-1 Agonists', slug: 'glp-1', color: '#2563EB' },
          { name: 'Healing Peptides', slug: 'healing', color: '#8B5CF6' },
        ]);
        setMarketplaceCategories([
          { name: 'SARMs', slug: 'sarms', color: '#8B5CF6' },
          { name: 'HGH', slug: 'hgh', color: '#06B6D4' },
          { name: 'Steroids', slug: 'steroids', color: '#EF4444' },
          { name: 'Post Cycle Therapy', slug: 'pct', color: '#F59E0B' },
          { name: 'Weight Loss', slug: 'weight-loss', color: '#10B981' },
          { name: 'African Products', slug: 'african-products', color: '#8B5CF6' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Gestion de la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = searchProducts(query);
    setSearchResults(results);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleProductClick = (productId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/marketplace/${productId}`);
  };

  const handleShopMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsShopDropdownOpen(true);
  };

  const handleShopMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsShopDropdownOpen(false);
    }, 150);
  };

  const handleLabsMouseEnter = () => {
    if (labsTimeoutRef.current) clearTimeout(labsTimeoutRef.current);
    setIsLabsDropdownOpen(true);
  };

  const handleLabsMouseLeave = () => {
    labsTimeoutRef.current = setTimeout(() => {
      setIsLabsDropdownOpen(false);
    }, 150);
  };

  const handleMarketplaceMouseEnter = () => {
    if (marketplaceTimeoutRef.current) clearTimeout(marketplaceTimeoutRef.current);
    setIsMarketplaceDropdownOpen(true);
  };

  const handleMarketplaceMouseLeave = () => {
    marketplaceTimeoutRef.current = setTimeout(() => {
      setIsMarketplaceDropdownOpen(false);
    }, 150);
  };

  const handleCompanyMouseEnter = () => {
    if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
    setIsCompanyDropdownOpen(true);
  };

  const handleCompanyMouseLeave = () => {
    companyTimeoutRef.current = setTimeout(() => {
      setIsCompanyDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (labsTimeoutRef.current) clearTimeout(labsTimeoutRef.current);
      if (marketplaceTimeoutRef.current) clearTimeout(marketplaceTimeoutRef.current);
      if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
    };
  }, []);

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

  // ✅ ÉLÉMENTS DU MENU "BUY PEPTIDES" avec les catégories dynamiques
  const getShopItems = () => {
    // Catégorie principale "Peptides" en dur
    const baseItems = [
      { name: 'Peptides', href: '/shop/peptides', icon: <FlaskConical size={16} />, isMain: true }
    ];
    
    // Ajouter les sous-catégories de peptides
    const subItems = peptideCategories.map(cat => ({
      name: cat.name,
      href: `/shop/peptides/${cat.slug}`,
      icon: <ChevronRight size={14} style={{ color: cat.color || '#6B7280' }} />,
      isSub: true,
      color: cat.color
    }));
    
    return [...baseItems, ...subItems];
  };

  // ✅ ÉLÉMENTS DU MENU "GENERAL MARKETPLACE"
  const getMarketplaceItems = () => {
    const baseItems = [
      { name: 'All Products', href: '/marketplace', icon: <Store size={16} />, description: 'Browse everything', isMain: true }
    ];
    
    const categoryItems = marketplaceCategories.map(cat => ({
      name: cat.name,
      href: `/marketplace/${cat.slug}`,
      icon: <Tag size={16} style={{ color: cat.color || '#6B7280' }} />,
      description: cat.description || '',
      color: cat.color
    }));
    
    return [...baseItems, ...categoryItems];
  };

  // ✅ ITEMS DYNAMIQUES
  const shopItems = getShopItems();
  const marketplaceItems = getMarketplaceItems();

  const navItems = [
    { 
      name: 'BUY PEPTIDES', 
      href: '/shop',
      hasDropdown: true,
      dropdownKey: 'shop',
      dropdownItems: shopItems
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
    { name: 'KNOWLEDGE CENTER', href: '/knowledge', hasDropdown: false },
    { 
      name: 'COMPANY', 
      href: '#',
      hasDropdown: true,
      dropdownKey: 'company',
      dropdownItems: [
        { name: 'About Us', href: '/about', icon: <Info size={16} />, description: 'Learn about our mission' },
        { name: 'Blog', href: '/blog', icon: <BookOpen size={16} />, description: 'Research insights' },
        { name: 'Contact Us', href: '/contact', icon: <Mail size={16} />, description: 'Get in touch' },
      ]
    },
  ];

  const getDropdownHandlers = (dropdownKey) => {
    switch(dropdownKey) {
      case 'shop':
        return { onMouseEnter: handleShopMouseEnter, onMouseLeave: handleShopMouseLeave, isOpen: isShopDropdownOpen };
      case 'marketplace':
        return { onMouseEnter: handleMarketplaceMouseEnter, onMouseLeave: handleMarketplaceMouseLeave, isOpen: isMarketplaceDropdownOpen };
      case 'labs':
        return { onMouseEnter: handleLabsMouseEnter, onMouseLeave: handleLabsMouseLeave, isOpen: isLabsDropdownOpen };
      case 'company':
        return { onMouseEnter: handleCompanyMouseEnter, onMouseLeave: handleCompanyMouseLeave, isOpen: isCompanyDropdownOpen };
      default:
        return { onMouseEnter: () => {}, onMouseLeave: () => {}, isOpen: false };
    }
  };

  const renderDropdownContent = (item) => {
    const handlers = getDropdownHandlers(item.dropdownKey);
    
    // ✅ DROPDOWN "BUY PEPTIDES"
    if (item.dropdownKey === 'shop') {
      if (categoriesLoading) {
        return handlers.isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50"
            onMouseEnter={handlers.onMouseEnter}
            onMouseLeave={handlers.onMouseLeave}
          >
            <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
              <Loader2 size={16} className="animate-spin text-[#2563EB]" />
              <span className="text-sm">Chargement...</span>
            </div>
          </div>
        );
      }
      
      return handlers.isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
        >
          {item.dropdownItems.map((subItem, index) => {
            // ✅ Si c'est l'élément principal "Peptides"
            if (subItem.isMain) {
              return (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2563EB] transition-colors border-b border-gray-100"
                >
                  <span className="text-[#2563EB]">{subItem.icon}</span>
                  <span className="text-sm font-bold">{subItem.name}</span>
                </Link>
              );
            }
            
            // ✅ Sous-catégories avec indentation
            return (
              <Link
                key={subItem.name}
                to={subItem.href}
                className="flex items-center gap-3 px-4 py-2.5 pl-10 text-gray-600 hover:bg-gray-50 hover:text-[#2563EB] transition-colors"
              >
                <span style={{ color: subItem.color || '#9CA3AF' }}>{subItem.icon}</span>
                <span className="text-sm">{subItem.name}</span>
              </Link>
            );
          })}
        </div>
      );
    }
    
    // ✅ DROPDOWN "GENERAL MARKETPLACE"
    if (item.dropdownKey === 'marketplace') {
      if (categoriesLoading) {
        return handlers.isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50"
            onMouseEnter={handlers.onMouseEnter}
            onMouseLeave={handlers.onMouseLeave}
          >
            <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
              <Loader2 size={16} className="animate-spin text-[#2563EB]" />
              <span className="text-sm">Chargement des catégories...</span>
            </div>
          </div>
        );
      }
      
      return handlers.isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
        >
          <Link
            to="/marketplace"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#F59E0B]/5 to-[#2563EB]/5 hover:from-[#F59E0B]/10 hover:to-[#2563EB]/10 transition-colors"
            onClick={() => {
              setIsMarketplaceDropdownOpen(false);
            }}
          >
            <span className="font-bold text-[#F59E0B]">🛒 ALL MARKETPLACE</span>
            <span className="text-xs text-[#2563EB]">view all →</span>
          </Link>
          
          <div className="grid grid-cols-2 gap-1 p-2">
            {item.dropdownItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={`flex flex-col items-start gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group ${
                  subItem.isMain ? 'col-span-2 bg-gray-50/50' : ''
                }`}
                onClick={() => {
                  setIsMarketplaceDropdownOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className={`${subItem.name === 'African Products' ? 'text-[#10B981]' : 'text-[#F59E0B]'} group-hover:text-[#2563EB] transition-colors`}>
                    {subItem.icon}
                  </span>
                  <span className={`text-sm font-medium ${subItem.isMain ? 'font-bold' : ''} ${subItem.name === 'African Products' ? 'text-[#10B981]' : 'text-gray-700'} group-hover:text-[#2563EB]`}>
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
    
    // ... labs et company inchangés
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

    if (item.dropdownKey === 'company') {
      return handlers.isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
        >
          {item.dropdownItems.map((subItem) => (
            <Link
              key={subItem.name}
              to={subItem.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#2563EB] transition-colors group"
            >
              <span className="text-[#2563EB] group-hover:text-[#10B981] transition-colors">
                {subItem.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#2563EB]">
                  {subItem.name}
                </p>
                {subItem.description && (
                  <p className="text-xs text-gray-400">{subItem.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-xs sm:text-sm">
            <div className="text-gray-500">
              <span className="hidden sm:inline text-[#10B981]">admin@</span>
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
          
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <Activity className="text-[#2563EB] group-hover:text-[#10B981] transition-colors" size={28} />
            <div className="font-bold text-xl sm:text-2xl">
              <span className="text-[#2563EB] group-hover:text-[#2563EB]/80 transition">Peptide</span>
              <span className="text-[#10B981] group-hover:text-[#10B981]/80 transition">Weight</span>
              <span className="text-[#F59E0B] group-hover:text-[#F59E0B]/80 transition">Loss</span>
            </div>
          </Link>

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

          {/* Actions avec recherche */}
          <div className="flex items-center gap-4">
            <div ref={searchContainerRef} className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-[#2563EB] transition p-2 rounded-full hover:bg-gray-100"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {searchQuery.trim().length >= 2 && (
                    <div className="max-h-96 overflow-y-auto border-t border-gray-100">
                      {searchResults.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <Search size={32} className="mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">Aucun résultat pour "<span className="font-medium">{searchQuery}</span>"</p>
                          <p className="text-xs text-gray-400 mt-1">Essayez avec d'autres mots-clés</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {searchResults.slice(0, 8).map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductClick(product.id)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-4 group"
                            >
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <FlaskConical size={24} className="m-3 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 group-hover:text-[#2563EB] truncate">
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{product.category || 'Peptide'}</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                  <span className="text-[#10B981] font-medium">
                                    ${product.price}
                                  </span>
                                </div>
                              </div>
                              {product.isBestSeller && (
                                <span className="text-[8px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                  Best Seller
                                </span>
                              )}
                            </button>
                          ))}
                          {searchResults.length > 8 && (
                            <div className="p-3 text-center border-t border-gray-100">
                              <Link
                                to={`/marketplace?search=${encodeURIComponent(searchQuery)}`}
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                  setSearchResults([]);
                                }}
                                className="text-sm text-[#2563EB] hover:underline font-medium"
                              >
                                Voir tous les résultats ({searchResults.length})
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {searchQuery.trim().length < 2 && searchQuery.trim().length > 0 && (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      <p>💡 Tapez au moins 2 caractères</p>
                    </div>
                  )}

                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
                    <span>Appuyez sur <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">ESC</kbd> pour fermer</span>
                    <span>⌘K pour rechercher</span>
                  </div>
                </div>
              )}
            </div>
            
            <CartDropdown />
            
            <button
              className="lg:hidden text-gray-600 hover:text-[#2563EB] transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
                          className={`flex items-center gap-3 py-2 text-gray-600 hover:text-[#2563EB] transition-colors text-sm ${
                            subItem.isSub ? 'pl-4' : ''
                          }`}
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