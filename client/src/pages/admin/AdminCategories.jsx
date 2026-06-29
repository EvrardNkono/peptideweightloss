// src/pages/admin/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, X, Loader2,
  Package, FlaskConical, Beaker, Pill, Syringe,
  Activity, MapPin, Tag, Globe, Store, Layers,
  AlertCircle, RefreshCw
} from 'lucide-react';
import axios from 'axios';

const getApiUrl = () =>
  process.env.NODE_ENV === 'production'
    ? 'https://peptideweightloss.vercel.app/api'
    : 'http://localhost:5000/api';

const API_URL = getApiUrl();

// ─── Icônes disponibles ──────────────────────────────────────────────────────
const AVAILABLE_ICONS = [
  { name: 'Package',      component: <Package size={18} /> },
  { name: 'FlaskConical', component: <FlaskConical size={18} /> },
  { name: 'Beaker',       component: <Beaker size={18} /> },
  { name: 'Pill',         component: <Pill size={18} /> },
  { name: 'Syringe',      component: <Syringe size={18} /> },
  { name: 'Activity',     component: <Activity size={18} /> },
  { name: 'MapPin',       component: <MapPin size={18} /> },
  { name: 'Tag',          component: <Tag size={18} /> },
  { name: 'Globe',        component: <Globe size={18} /> },
  { name: 'Store',        component: <Store size={18} /> },
  { name: 'Layers',       component: <Layers size={18} /> },
];

// ─── Couleurs prédéfinies ────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { color: '#2563EB', bg: '#EFF6FF', label: 'Blue' },
  { color: '#10B981', bg: '#ECFDF5', label: 'Green' },
  { color: '#8B5CF6', bg: '#F5F3FF', label: 'Purple' },
  { color: '#EF4444', bg: '#FEF2F2', label: 'Red' },
  { color: '#06B6D4', bg: '#ECFEFF', label: 'Cyan' },
  { color: '#F59E0B', bg: '#FFFBEB', label: 'Amber' },
  { color: '#EC4899', bg: '#FDF2F8', label: 'Pink' },
  { color: '#14B8A6', bg: '#F0FDFA', label: 'Teal' },
];

// ─── Helper: render icon by name ─────────────────────────────────────────────
export const renderIcon = (iconName, size = 16, color = 'currentColor') => {
  const props = { size, color };
  switch (iconName) {
    case 'FlaskConical': return <FlaskConical {...props} />;
    case 'Beaker':       return <Beaker {...props} />;
    case 'Pill':         return <Pill {...props} />;
    case 'Syringe':      return <Syringe {...props} />;
    case 'Activity':     return <Activity {...props} />;
    case 'MapPin':       return <MapPin {...props} />;
    case 'Tag':          return <Tag {...props} />;
    case 'Globe':        return <Globe {...props} />;
    case 'Store':        return <Store {...props} />;
    case 'Layers':       return <Layers {...props} />;
    default:             return <Package {...props} />;
  }
};

// ════════════════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════════════════
const AdminCategories = ({ token, onCategoriesChange }) => {
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [showModal, setShowModal]         = useState(false);
  const [editingCat, setEditingCat]       = useState(null);
  const [error, setError]                 = useState('');

  // FIX: mémorise la config pour éviter les re-renders infinis
  const storedToken = token || localStorage.getItem('token') || localStorage.getItem('adminToken');
const axiosConfig = { headers: { Authorization: `Bearer ${storedToken}` } };

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/categories/all`, axiosConfig);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Check the API connection.');
    }
    setLoading(false);
  };

  // FIX: dépendance sur token uniquement
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSave = async (data) => {
    try {
      if (editingCat) {
        const res = await axios.put(`${API_URL}/categories/${editingCat._id}`, data, axiosConfig);
        setCategories(prev => prev.map(c => c._id === editingCat._id ? res.data.data : c));
      } else {
        const res = await axios.post(`${API_URL}/categories`, data, axiosConfig);
        setCategories(prev => [res.data.data, ...prev]);
      }
      setShowModal(false);
      setEditingCat(null);
      // FIX: notifie le Dashboard parent pour resync les catégories
      if (onCategoriesChange) onCategoriesChange();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error saving category' };
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const res = await axios.put(
        `${API_URL}/categories/${cat._id}`,
        { isActive: !cat.isActive },
        axiosConfig
      );
      setCategories(prev => prev.map(c => c._id === cat._id ? res.data.data : c));
      if (onCategoriesChange) onCategoriesChange();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products using it will keep their type slug.')) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`, axiosConfig);
      setCategories(prev => prev.filter(c => c._id !== id));
      // FIX: notifie le parent après suppression
      if (onCategoriesChange) onCategoriesChange();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ─── Filtered list ───────────────────────────────────────────────────────
  const filtered = categories.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchSection = sectionFilter === 'all' || c.section === sectionFilter;
    return matchSearch && matchSection;
  });

  const peptidesCats    = filtered.filter(c => c.section === 'peptides');
  const marketplaceCats = filtered.filter(c => c.section === 'marketplace');

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={32} className="animate-spin text-[#2563EB]" />
        <span className="ml-3 text-gray-500">Loading categories...</span>
      </div>
    );
  }

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 w-64 focus:border-[#2563EB] outline-none text-sm"
            />
          </div>
          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none text-sm"
          >
            <option value="all">All sections</option>
            <option value="peptides">🧬 Peptides Shop</option>
            <option value="marketplace">🛒 Marketplace</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition text-sm"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={() => { setEditingCat(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1E40AF] transition text-sm"
          >
            <Plus size={16} /> New Category
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Categories', value: categories.length,                                        color: '#2563EB' },
          { label: 'Peptides Shop',    value: categories.filter(c => c.section === 'peptides').length,  color: '#10B981' },
          { label: 'Marketplace',      value: categories.filter(c => c.section === 'marketplace').length, color: '#8B5CF6' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Peptides section ── */}
      <SectionBlock
        title="🧬 Peptides Shop"
        subtitle="Visible in the 'BUY PEPTIDES' dropdown of the header"
        cats={peptidesCats}
        accentColor="#10B981"
        onEdit={cat => { setEditingCat(cat); setShowModal(true); }}
        onToggle={handleToggleActive}
        onDelete={handleDelete}
      />

      {/* ── Marketplace section ── */}
      <SectionBlock
        title="🛒 General Marketplace"
        subtitle="Visible in the 'GENERAL MARKETPLACE' dropdown of the header"
        cats={marketplaceCats}
        accentColor="#F59E0B"
        onEdit={cat => { setEditingCat(cat); setShowModal(true); }}
        onToggle={handleToggleActive}
        onDelete={handleDelete}
      />

      {filtered.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Tag size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No categories yet</h3>
          <p className="text-gray-400 text-sm mt-1">Create your first category to organise products</p>
          <button
            onClick={() => { setEditingCat(null); setShowModal(true); }}
            className="mt-4 inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl hover:bg-[#1E40AF] transition"
          >
            <Plus size={16} /> Create Category
          </button>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <CategoryModal
          category={editingCat}
          onClose={() => { setShowModal(false); setEditingCat(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// Section Block
// ════════════════════════════════════════════════════════════════════════════
const SectionBlock = ({ title, subtitle, cats, accentColor, onEdit, onToggle, onDelete }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
      <div>
        <h2 className="font-bold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <span className="ml-auto text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">
        {cats.length} {cats.length === 1 ? 'category' : 'categories'}
      </span>
    </div>

    {cats.length === 0 ? (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-8 text-center text-gray-400 text-sm">
        No categories in this section yet
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cats.map(cat => (
          <CategoryCard
            key={cat._id}
            cat={cat}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    )}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Category Card
// ════════════════════════════════════════════════════════════════════════════
const CategoryCard = ({ cat, onEdit, onToggle, onDelete }) => (
  <div className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${
    cat.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
  }`}>
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cat.bgColor || '#EFF6FF' }}
        >
          {renderIcon(cat.icon, 18, cat.color)}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</p>
        </div>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(cat)}
          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          title="Edit"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDelete(cat._id)}
          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    {cat.description && (
      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{cat.description}</p>
    )}

    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
        <span className="text-xs text-gray-400">{cat.color}</span>
      </div>

      <button
        onClick={() => onToggle(cat)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          cat.isActive ? 'bg-[#10B981]' : 'bg-gray-300'
        }`}
        title={cat.isActive ? 'Active — click to disable' : 'Inactive — click to enable'}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            cat.isActive ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Category Modal (Create / Edit)
// ════════════════════════════════════════════════════════════════════════════
const CategoryModal = ({ category, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:        category?.name        || '',
    icon:        category?.icon        || 'Package',
    color:       category?.color       || '#2563EB',
    bgColor:     category?.bgColor     || '#EFF6FF',
    section:     category?.section     || 'marketplace',
    description: category?.description || '',
    isActive:    category?.isActive    ?? true,
    order:       category?.order       || 0,
  });
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');

  const handleColorPreset = (preset) => {
    setForm(f => ({ ...f, color: preset.color, bgColor: preset.bg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    if (!form.section)     { setFormError('Please choose a section'); return; }
    setSaving(true);
    setFormError('');
    const result = await onSave(form);
    if (!result.success) setFormError(result.message || 'Error saving');
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {formError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={15} /> {formError}
            </div>
          )}

          {/* Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: form.bgColor }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: form.color + '22' }}
            >
              {renderIcon(form.icon, 22, form.color)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{form.name || 'Category name'}</p>
              <p className="text-xs text-gray-500">{form.description || 'Description...'}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none text-sm"
              placeholder="e.g. Peptide Blends"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none text-sm"
              placeholder="Short description shown in the header dropdown"
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'peptides',    label: '🧬 Peptides Shop',       sub: '"BUY PEPTIDES" dropdown' },
                { value: 'marketplace', label: '🛒 General Marketplace', sub: '"GENERAL MARKETPLACE" dropdown' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex flex-col gap-1 cursor-pointer p-3 rounded-xl border-2 transition-all ${
                    form.section === opt.value
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="section"
                    value={opt.value}
                    checked={form.section === opt.value}
                    onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm text-gray-800">{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map(ic => (
                <button
                  key={ic.name}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, icon: ic.name }))}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all ${
                    form.icon === ic.name
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={ic.name}
                  style={{ color: form.icon === ic.name ? form.color : '#9CA3AF' }}
                >
                  {ic.component}
                </button>
              ))}
            </div>
          </div>

          {/* Color presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => handleColorPreset(preset)}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${
                    form.color === preset.color
                      ? 'border-gray-700 scale-110'
                      : 'border-white shadow hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.label}
                />
              ))}
              <input
                type="color"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300"
                title="Custom color"
              />
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
              <span className="text-xs text-gray-400 ml-2 font-normal">(lower = shown first)</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none text-sm"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-700">Active</p>
              <p className="text-xs text-gray-400">Inactive categories won't appear in the header</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                form.isActive ? 'bg-[#10B981]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.isActive ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 

export default AdminCategories;