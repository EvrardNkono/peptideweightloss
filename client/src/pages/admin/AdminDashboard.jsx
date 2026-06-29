// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
  Upload,
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Star,
  TrendingUp,
  Sparkles,
  Image as ImageIcon,
  Heart,
  BookOpen,
  Tag
} from 'lucide-react';
import axios from 'axios';
import AdminHero from './AdminHero';
import AdminBlog from './AdminBlog';
// FIX: import correct de AdminCategories + renderIcon
import AdminCategories, { renderIcon } from './AdminCategories';

// ── API URL ──────────────────────────────────────────────────────────────────
const getApiUrl = () =>
  process.env.NODE_ENV === 'production'
    ? 'https://peptideweightloss.vercel.app/api'
    : 'http://localhost:5000/api';

const API_URL     = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

// ════════════════════════════════════════════════════════════════════════════
// AdminDashboard
// ════════════════════════════════════════════════════════════════════════════
const AdminDashboard = ({ onLogout, token }) => {
  const [activeTab, setActiveTab]   = useState('products');
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [users, setUsers]           = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const itemsPerPage = 5;
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionStatus, setPrescriptionStatus] = useState('');
  const [prescriptionNotes, setPrescriptionNotes]   = useState('');

  // FIX: catégories dynamiques chargées depuis l'API
  const [productTypes, setProductTypes] = useState([]);

  const storedToken = token || localStorage.getItem('token') || localStorage.getItem('adminToken');
const axiosConfig = { headers: { Authorization: `Bearer ${storedToken}` } };

  // ── Fetch categories ───────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories/all`, axiosConfig);
      const cats = res.data.data || [];
      setProductTypes(
        cats.map(cat => ({
          value:   cat.slug,
          label:   cat.name,
          icon:    <span style={{ color: cat.color }}>{renderIcon(cat.icon, 14, cat.color)}</span>,
          color:   cat.color,
          bgRaw:   cat.bgColor,
          textRaw: cat.color,
          section: cat.section,
        }))
      );
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback minimal
      setProductTypes([
        { value: 'peptide', label: 'Peptide', icon: null, color: '#2563EB', bgRaw: '#EFF6FF', textRaw: '#2563EB', section: 'peptides' },
        { value: 'blend',   label: 'Blend',   icon: null, color: '#10B981', bgRaw: '#ECFDF5', textRaw: '#10B981', section: 'marketplace' },
      ]);
    }
  };

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, usersRes, prescriptionsRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/orders`, axiosConfig),
        axios.get(`${API_URL}/users`, axiosConfig),
        axios.get(`${API_URL}/prescriptions`, axiosConfig),
      ]);
      setProducts(productsRes.data.data || productsRes.data);
      setOrders(ordersRes.data.data || ordersRes.data);
      setUsers(usersRes.data.data || usersRes.data);
      setPrescriptions(prescriptionsRes.data.data || []);
      setImageRefreshKey(Date.now());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Products CRUD ──────────────────────────────────────────────────────────
  const refreshProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data.data || res.data);
      setImageRefreshKey(Date.now());
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };

  const addProduct = async (product) => {
    try {
      const res = await axios.post(`${API_URL}/products`, {
        name:        product.name,
        dosage:      product.moreDetails || product.dosage || '',
        description: product.description || '',
        price:       product.price,
        category:    product.type || product.category,
        stock:       product.stock,
        type:        product.type,
        image:       product.image,
        isPopular:   product.isPopular   || false,
        isNew:       product.isNew       || false,
        isBestSeller:product.isBestSeller|| false,
        purity:      product.purity      || '≥99%',
        rating:      product.rating      || 4.8,
        reviews:     product.reviews     || 0,
        status:      'active',
        likes:       product.likes       || 0,
      }, axiosConfig);
      setProducts(prev => [res.data.data, ...prev]);
      setImageRefreshKey(Date.now());
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };

  const updateProduct = async (product) => {
    try {
      const productId = product._id || product.id;
      const res = await axios.put(`${API_URL}/products/${productId}`, {
        name:        product.name,
        dosage:      product.moreDetails || product.dosage || '',
        description: product.description || '',
        price:       product.price,
        category:    product.type || product.category,
        stock:       product.stock,
        type:        product.type,
        image:       product.image,
        isPopular:   product.isPopular   || false,
        isNew:       product.isNew       || false,
        isBestSeller:product.isBestSeller|| false,
        purity:      product.purity      || '≥99%',
        rating:      product.rating      || 4.8,
        reviews:     product.reviews     || 0,
        status:      'active',
        likes:       product.likes       || 0,
      }, axiosConfig);
      setProducts(prev =>
        prev.map(p => (p._id === productId || p.id === productId) ? res.data.data : p)
      );
      setImageRefreshKey(Date.now());
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, axiosConfig);
      setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
      setImageRefreshKey(Date.now());
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  // ── Orders / Users / Prescriptions CRUD ───────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/status`, { status }, axiosConfig);
      setOrders(prev => prev.map(o => (o._id === id || o.id === id) ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await axios.delete(`${API_URL}/orders/${id}`, axiosConfig);
      setOrders(prev => prev.filter(o => o._id !== id && o.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`, axiosConfig);
      setUsers(prev => prev.filter(u => u._id !== id && u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updatePrescriptionStatus = async (id, status, notes) => {
    try {
      const res = await axios.put(`${API_URL}/prescriptions/${id}/status`, { status, notes }, axiosConfig);
      setPrescriptions(prev => prev.map(p => p._id === id ? res.data.data : p));
      return true;
    } catch (error) {
      console.error('Error updating prescription status:', error);
      return false;
    }
  };

  const deletePrescription = async (id) => {
    if (!window.confirm('Delete this prescription request?')) return;
    try {
      await axios.delete(`${API_URL}/prescriptions/${id}`, axiosConfig);
      setPrescriptions(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const stats = [
    { title: 'Total Products',  value: products.length,      icon: <Package size={24} />,    color: '#2563EB' },
    { title: 'Total Orders',    value: orders.length,        icon: <ShoppingBag size={24} />, color: '#10B981' },
    { title: 'Total Users',     value: users.length,         icon: <Users size={24} />,       color: '#F59E0B' },
    { title: 'Prescriptions',   value: prescriptions.length, icon: <FileText size={24} />,    color: '#8B5CF6' },
    {
      title: 'Revenue',
      value: `$${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(0)}`,
      icon: <DollarSign size={24} />,
      color: '#2563EB',
    },
  ];

  const getTypeBadge = (type) => {
    const typeInfo = productTypes.find(t => t.value === type);
    if (!typeInfo) return { label: type || '—', bgRaw: '#F3F4F6', textRaw: '#374151', icon: null };
    return { label: typeInfo.label, bgRaw: typeInfo.bgRaw, textRaw: typeInfo.textRaw, icon: typeInfo.icon };
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/images/pept.png') return '/images/pept.png';
    if (imageUrl.startsWith('/uploads/')) return `${BACKEND_URL}${imageUrl}?t=${imageRefreshKey}`;
    return `${imageUrl}?t=${imageRefreshKey}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':  return { label: 'Pending',  color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> };
      case 'reviewed': return { label: 'Reviewed', color: 'bg-blue-100 text-blue-700',     icon: <FileText size={12} /> };
      case 'approved': return { label: 'Approved', color: 'bg-green-100 text-green-700',   icon: <CheckCircle size={12} /> };
      case 'rejected': return { label: 'Rejected', color: 'bg-red-100 text-red-700',       icon: <AlertCircle size={12} /> };
      default:         return { label: status,     color: 'bg-gray-100 text-gray-700',     icon: null };
    }
  };

  const getProductBadges = (product) => {
    const badges = [];
    if (product.isBestSeller) badges.push({ label: '⭐ Best Seller', color: 'bg-amber-100 text-amber-700' });
    if (product.isPopular)    badges.push({ label: '🔥 Popular',     color: 'bg-blue-100 text-blue-700' });
    if (product.isNew)        badges.push({ label: '✨ New',          color: 'bg-green-100 text-green-700' });
    return badges;
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      (p.name     || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── FIX: liste complète des tabs incluant "categories" ─────────────────────
  const TABS = [
    { id: 'products',      label: 'Products' },
    { id: 'orders',        label: 'Orders' },
    { id: 'users',         label: 'Users' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'blog',          label: 'Blog',       icon: <BookOpen size={16} /> },
    { id: 'categories',    label: 'Categories', icon: <Tag size={16} /> },
    { id: 'hero',          label: 'Hero',       icon: <ImageIcon size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Activity size={28} />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-white/70 text-sm">Manage products, orders, users, prescriptions and blog</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── FIX: rendu depuis le tableau TABS pour éviter les oublis */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex gap-3 flex-wrap">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-80 focus:border-[#2563EB] outline-none"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                >
                  <option value="all">All Types</option>
                  {productTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1E40AF] transition"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Image','Type','Product','Details','Price','Status','Badges','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map(product => {
                    const badge        = getTypeBadge(product.type);
                    const productBadges = getProductBadges(product);
                    const isAvailable  = product.stock > 0;
                    return (
                      <tr key={product._id || product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                            onError={e => { e.target.src = '/images/pept.png'; }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: badge.bgRaw, color: badge.textRaw }}
                          >
                            {badge.icon}
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                          {product.dosage || product.moreDetails || '-'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">${product.price}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                            {isAvailable ? '✅ Available' : '❌ Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {productBadges.map((b, i) => (
                              <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-full ${b.color}`}>{b.label}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id || product.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order ID','Customer','Date','Total','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{order.id || order._id?.slice(-8)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customer || order.guestEmail || 'Guest'}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">${order.total}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order._id || order.id, e.target.value)}
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteOrder(order._id || order.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['User','Email','Orders','Total Spent','Joined','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id || user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{user.orders?.length || user.orderCount || 0}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">${user.totalSpent || 0}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{new Date(user.createdAt || user.joined).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteUser(user._id || user.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Prescriptions Tab ── */}
        {activeTab === 'prescriptions' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm">Total: {prescriptions.length} prescription requests</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date','Patient','Email','Phone','Age/Weight','Preferred Peptides','Status','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(prescription => {
                    const statusBadge = getStatusBadge(prescription.status);
                    return (
                      <tr key={prescription._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 text-sm">{new Date(prescription.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{prescription.name}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{prescription.email}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{prescription.phone || '-'}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {prescription.age && `${prescription.age}y`} {prescription.weight && `/${prescription.weight}kg`}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm max-w-[200px] truncate">
                          {prescription.preferredPeptides || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setPrescriptionStatus(prescription.status);
                                setPrescriptionNotes(prescription.notes || '');
                                setShowPrescriptionModal(true);
                              }}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => deletePrescription(prescription._id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {prescriptions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl mt-4">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No prescription requests</h3>
                <p className="text-gray-400">Prescription requests from patients will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* ── Blog Tab ── */}
        {activeTab === 'blog' && <AdminBlog token={token} />}

        {/* ── Categories Tab ── FIX: bien importé et rendu */}
        {activeTab === 'categories' && (
          <AdminCategories
            token={token}
            onCategoriesChange={fetchCategories}
          />
        )}

        {/* ── Hero Tab ── */}
        {activeTab === 'hero' && <AdminHero token={token} />}
      </div>

      {/* ── Prescription Detail Modal ── */}
      {showPrescriptionModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
              <button onClick={() => setShowPrescriptionModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Patient Name', value: selectedPrescription.name },
                  { label: 'Email',        value: selectedPrescription.email },
                  { label: 'Phone',        value: selectedPrescription.phone || '-' },
                  { label: 'Age / Weight', value: `${selectedPrescription.age || '-'} years / ${selectedPrescription.weight || '-'} kg` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="text-xs text-gray-500">{label}</label>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {[
                { label: 'Medical History',      value: selectedPrescription.medicalHistory },
                { label: 'Current Medications',  value: selectedPrescription.currentMedications },
                { label: 'Health Goals',         value: selectedPrescription.goals },
                { label: 'Preferred Peptides',   value: selectedPrescription.preferredPeptides },
                { label: 'Additional Information', value: selectedPrescription.additionalInfo },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="text-xs text-gray-500">{label}</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{value || '-'}</p>
                </div>
              ))}

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <div className="flex gap-3 mb-3">
                  <select
                    value={prescriptionStatus}
                    onChange={e => setPrescriptionStatus(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={async () => {
                      await updatePrescriptionStatus(selectedPrescription._id, prescriptionStatus, prescriptionNotes);
                      setShowPrescriptionModal(false);
                      fetchData();
                    }}
                    className="bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1E40AF] transition"
                  >
                    Update
                  </button>
                </div>
                <textarea
                  value={prescriptionNotes}
                  onChange={e => setPrescriptionNotes(e.target.value)}
                  placeholder="Add notes (optional)"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Modal ── */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
          onSave={async (productData) => {
            const success = editingProduct
              ? await updateProduct(productData)
              : await addProduct(productData);
            if (success) {
              setShowProductModal(false);
              setEditingProduct(null);
            }
          }}
          productTypes={productTypes}
          backendUrl={BACKEND_URL}
        />
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ProductModal
// ════════════════════════════════════════════════════════════════════════════
const ProductModal = ({ product, onClose, onSave, productTypes, backendUrl }) => {
  const MODAL_API = process.env.NODE_ENV === 'production'
    ? 'https://peptideweightloss.vercel.app/api'
    : 'http://localhost:5000/api';

  const [formData, setFormData] = useState({
    id:          product?._id     || product?.id   || null,
    _id:         product?._id     || null,
    name:        product?.name    || '',
    moreDetails: product?.dosage  || product?.moreDetails || '',
    description: product?.description || '',
    price:       product?.price   || '',
    category:    product?.category|| '',
    stock:       product?.stock   || 0,
    type:        product?.type    || (productTypes[0]?.value || 'peptide'),
    image:       product?.image   || '/images/pept.png',
    isPopular:   product?.isPopular   || false,
    isNew:       product?.isNew       || false,
    isBestSeller:product?.isBestSeller|| false,
    likes:       product?.likes   || 0,
    reviews:     product?.reviews || 0,
  });
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving]         = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadError('File must be an image'); return; }
    if (file.size > 5 * 1024 * 1024)    { setUploadError('Image must be less than 5MB'); return; }

    setUploading(true);
    setUploadError('');
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${MODAL_API}/upload`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
        setPreviewKey(Date.now());
      }
    } catch (error) {
      setUploadError('Upload failed, please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
            {productTypes.length === 0 ? (
              <p className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-xl">
                No categories yet — create some in the Categories tab first.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {productTypes.map(type => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-all ${
                      formData.type === type.value
                        ? 'border-[#2563EB] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-4 h-4 text-[#2563EB]"
                    />
                    <span style={{ color: type.color }}>{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* More Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              More Details
              <span className="text-xs text-gray-400 ml-2 font-normal">(Dosage, concentration, etc.)</span>
            </label>
            <textarea
              rows={3}
              value={formData.moreDetails}
              onChange={e => setFormData({ ...formData, moreDetails: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none resize-none"
              placeholder="e.g., 5mg/vial, injection 2x per week"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Description
              <span className="text-xs text-gray-400 ml-2 font-normal">(Detailed description)</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none resize-none"
              placeholder="Describe the product, its benefits, usage instructions..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* Stock */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="flex items-center gap-2"><Package size={16} className="text-[#2563EB]" /> Product Availability</span>
            </label>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Status:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, stock: formData.stock > 0 ? 0 : 1 })}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.stock > 0 ? 'bg-[#10B981]' : 'bg-gray-400'}`}
              >
                <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${formData.stock > 0 ? 'translate-x-6' : ''}`} />
              </button>
              <span className={`font-medium ${formData.stock > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                {formData.stock > 0 ? '✅ Available' : '❌ Out of Stock'}
              </span>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500" /> Number of Reviews</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.reviews}
              onChange={e => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* Likes */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2"><Heart size={16} className="text-red-500" /> Popularity Score (Likes)</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.likes}
              onChange={e => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* Badges */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Badges</label>
            {[
              { key: 'isBestSeller', label: 'Best Seller', sub: 'Show in the "Best Sellers" section', icon: <Star size={20} className="text-[#F59E0B] fill-[#F59E0B]" />, bg: 'bg-amber-50 border-amber-200', on: '#F59E0B' },
              { key: 'isPopular',    label: 'Popular',     sub: 'Show as a popular product',          icon: <TrendingUp size={20} className="text-[#2563EB]" />,              bg: 'bg-blue-50 border-blue-200',   on: '#2563EB' },
              { key: 'isNew',        label: 'New Product', sub: 'Show the "NEW" badge on the product', icon: <Sparkles size={20} className="text-[#10B981]" />,                bg: 'bg-green-50 border-green-200', on: '#10B981' },
            ].map(badge => (
              <div key={badge.key} className={`flex items-center justify-between p-3 rounded-xl border ${badge.bg}`}>
                <div className="flex items-center gap-3">
                  {badge.icon}
                  <div>
                    <label className="text-sm font-medium text-gray-700">{badge.label}</label>
                    <p className="text-xs text-gray-400">{badge.sub}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, [badge.key]: !formData[badge.key] })}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: formData[badge.key] ? badge.on : '#D1D5DB' }}
                >
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData[badge.key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="flex gap-2">
              <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${uploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}>
                {uploading ? <Loader2 size={16} className="animate-spin text-[#2563EB]" /> : <Upload size={16} className="text-[#2563EB]" />}
                <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                placeholder="Or enter image URL"
              />
            </div>
            {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
            {formData.image && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  key={previewKey}
                  src={formData.image.startsWith('/uploads/') ? `${backendUrl}${formData.image}?t=${previewKey}` : `${formData.image}?t=${previewKey}`}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  onError={e => { e.target.src = '/images/pept.png'; }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Image preview</p>
                  <p className="text-xs text-gray-400 truncate">{formData.image}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, image: '/images/pept.png' }); setPreviewKey(Date.now()); }}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;