// src/pages/admin/AdminHero.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Loader2, Plus, Image as ImageIcon, Save } from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://peptideweightloss.vercel.app/api'
  : 'http://localhost:5000/api';

const AdminHero = ({ token }) => {
  const [hero, setHero] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await axios.get(`${API_URL}/hero`);
      const data = res.data.data;
      setHero(data);
      setImages(data.images || ['/images/pept.png']);
      setTitle(data.title || 'Premium Peptides For Weight Loss');
      setSubtitle(data.subtitle || '');
    } catch (error) {
      console.error('Error fetching hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (images.length >= 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setImages([...images, res.data.imageUrl]);
        setSuccess('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setSuccess('');
  };

  const handleSave = async () => {
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(`${API_URL}/hero`, {
        images: images,
        title: title,
        subtitle: subtitle
      }, axiosConfig);
      setSuccess('Hero updated successfully!');
    } catch (error) {
      console.error('Error saving hero:', error);
      setError('Failed to save hero');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={32} className="animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Hero Section</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#1E40AF] transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Images Management */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Images (Max 4)
          <span className="text-xs text-gray-400 ml-2">({images.length}/4)</span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => { e.target.src = '/images/pept.png'; }}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}

          {images.length < 4 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-[#2563EB] transition">
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-[#2563EB]" />
              ) : (
                <>
                  <Plus size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Upload images to display in the hero carousel. First image is the default.
        </p>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            placeholder="Premium Peptides For Weight Loss"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Subtitle
          </label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            placeholder="Your fully licensed corporate distributor..."
          />
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex gap-4 overflow-x-auto">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                onError={(e) => { e.target.src = '/images/pept.png'; }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-800 mt-3">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;