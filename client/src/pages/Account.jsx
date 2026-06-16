// src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Lock, Package, MapPin, Settings, 
  LogOut, CheckCircle, Eye, EyeOff, Calendar, ChevronRight,
  Shield
} from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';

const API_URL = 'http://localhost:5000/api';

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Vérifier si l'utilisateur est déjà connecté (token dans localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyToken(storedToken);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setToken(token);
        setUser(res.data.user);
        setIsLoggedIn(true);
        setIsAdmin(res.data.user.role === 'admin');
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsLoggedIn(true);
        setIsAdmin(user.role === 'admin');
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (res.data.success) {
        setSuccess('Account created! Please login.');
        setShowLogin(true);
        setFormData({ ...formData, name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setToken(null);
    setUser(null);
  };

  // Si l'utilisateur est admin, afficher le dashboard admin
  if (isLoggedIn && isAdmin) {
    return <AdminDashboard onLogout={handleLogout} token={token} />;
  }

  // État DÉCONNECTÉ - Formulaire de connexion/inscription
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Colonne gauche - Bannière */}
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-3xl p-8 text-white h-full">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <User size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to PeptideWeightLoss</h2>
                  <p className="text-white/80">Access your account to track orders, manage subscriptions, and more.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-white/80" />
                    <span className="text-sm">Track your orders in real-time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-white/80" />
                    <span className="text-sm">Manage your research subscriptions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-white/80" />
                    <span className="text-sm">Access exclusive scientific resources</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaires */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Admin hint */}
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Shield size={12} />
                    Demo: admin@peptideweightloss.com / admin123
                  </span>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                  <button
                    onClick={() => { setShowLogin(true); setError(''); setSuccess(''); }}
                    className={`pb-3 px-1 font-semibold transition-all duration-200 ${
                      showLogin 
                        ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setShowLogin(false); setError(''); setSuccess(''); }}
                    className={`pb-3 px-1 font-semibold transition-all duration-200 ${
                      !showLogin 
                        ? 'text-[#2563EB] border-b-2 border-[#2563EB]' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                    {success}
                  </div>
                )}

                {/* Formulaire de connexion */}
                {showLogin ? (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="research@university.edu"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Sign In'}
                    </button>
                  </form>
                ) : (
                  // Formulaire d'inscription
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="Dr. John Smith"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="research@university.edu"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="Create a password (min 6 characters)"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État CONNECTÉ - Dashboard utilisateur normal
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête du compte */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-white/80">{user?.email}</p>
                <p className="text-white/60 text-sm">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'orders' ? 'bg-[#2563EB]/10 text-[#2563EB] font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package size={18} />
                  <span>My Orders</span>
                  <ChevronRight size={16} className={`ml-auto ${activeTab === 'orders' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'settings' ? 'bg-[#2563EB]/10 text-[#2563EB] font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings size={18} />
                  <span>Account Settings</span>
                  <ChevronRight size={16} className={`ml-auto ${activeTab === 'settings' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No orders yet</p>
                  <p className="text-sm">Your orders will appear here once you make a purchase.</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2563EB] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2563EB] outline-none"
                      />
                    </div>
                    <button className="bg-[#2563EB] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1E40AF] transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;