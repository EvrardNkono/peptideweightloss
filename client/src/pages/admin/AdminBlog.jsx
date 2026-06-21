// src/pages/admin/AdminBlog.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  User,
  Clock,
  Tag,
  Eye,
  Star,
  TrendingUp,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  Globe
} from 'lucide-react';
import axios from 'axios';

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BACKEND_URL = API_URL.replace('/api', '');

const AdminBlog = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const itemsPerPage = 5;

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Récupérer TOUS les articles (admin seulement)
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/blog-posts/admin/all`, axiosConfig);
      setPosts(res.data.data || res.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    }
    setLoading(false);
  };

  const addPost = async (post) => {
    try {
      const res = await axios.post(`${API_URL}/blog-posts`, post, axiosConfig);
      setPosts([res.data.data, ...posts]);
      return true;
    } catch (error) {
      console.error('Error adding post:', error);
      return false;
    }
  };

  const updatePost = async (post) => {
    try {
      const postId = post._id || post.id;
      const res = await axios.put(`${API_URL}/blog-posts/${postId}`, post, axiosConfig);
      const updatedPost = res.data.data;
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId) ? updatedPost : p));
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      return false;
    }
  };

  const deletePost = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await axios.delete(`${API_URL}/blog-posts/${id}`, axiosConfig);
        setPosts(posts.filter(p => p._id !== id && p.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-500">Loading posts...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-80 focus:border-[#2563EB] outline-none"
          />
        </div>
        <button
          onClick={() => { setEditingPost(null); setShowPostModal(true); }}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1E40AF] transition"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Author</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Featured</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Views</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map((post) => (
              <tr key={post._id || post.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{post.title}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{post.category}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{post.author}</td>
                <td className="px-4 py-3 text-gray-500 text-sm">{post.date || new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                    {post.status || 'draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {post.featured ? (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm">{post.views || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingPost(post); setShowPostModal(true); }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deletePost(post._id || post.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

      {posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl mt-4">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No blog posts yet</h3>
          <p className="text-gray-400">Create your first blog post to share insights</p>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <PostModal
          post={editingPost}
          onClose={() => { setShowPostModal(false); setEditingPost(null); }}
          onSave={async (postData) => {
            let success;
            if (editingPost) {
              success = await updatePost(postData);
            } else {
              success = await addPost(postData);
            }
            if (success) {
              setShowPostModal(false);
              setEditingPost(null);
              await fetchPosts(); // Rafraîchir la liste
            }
          }}
          backendUrl={BACKEND_URL}
        />
      )}
    </div>
  );
};

// ============================================================
// Post Modal Component
// ============================================================
const PostModal = ({ post, onClose, onSave, backendUrl }) => {
  const [formData, setFormData] = useState({
    _id: post?._id || null,
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'GLP-1 Agonists',
    author: post?.author || '',
    authorRole: post?.authorRole || '',
    date: post?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: post?.readTime || '',
    image: post?.image || '',
    tags: post?.tags?.join(', ') || '',
    featured: post?.featured || false,
    status: post?.status || 'draft',
    views: post?.views || 0,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = [
    'GLP-1 Agonists',
    'Peptide Blends',
    'Growth Hormones',
    'Healing Peptides',
    'SARMs',
    'Research Guides',
    'Research Trends'
  ];

  const getApiUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://peptideweightloss.vercel.app/api';
    }
    return 'http://localhost:5000/api';
  };
  const API_URL = getApiUrl();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setUploadError('File must be an image');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }
    
    setUploading(true);
    setUploadError('');
    
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/upload`, uploadFormData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        setFormData(prev => ({...prev, image: res.data.imageUrl}));
      }
    } catch (error) {
      setUploadError('Upload failed, please try again');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      views: parseInt(formData.views) || 0,
    };
    
    await onSave(postData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none resize-none"
              placeholder="Brief summary of the post..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Content *</label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none resize-none"
              placeholder="Full article content..."
            />
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
              />
            </div>
          </div>

          {/* Author Role & Read Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Role</label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData({...formData, authorRole: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                placeholder="PhD in Molecular Biology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                placeholder="8 min read"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
              placeholder="GLP-1, Weight Loss, Peptide Research"
            />
          </div>

          {/* Views */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Views (initial count)</label>
            <input
              type="number"
              min="0"
              value={formData.views}
              onChange={(e) => setFormData({...formData, views: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <div className="flex gap-2">
              <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${
                uploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
              }`}>
                {uploading ? (
                  <Loader2 size={16} className="animate-spin text-[#2563EB]" />
                ) : (
                  <Upload size={16} className="text-[#2563EB]" />
                )}
                <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
                placeholder="Or enter image URL"
              />
            </div>
            {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
          </div>

          {/* Featured & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl h-[42px]">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, featured: !formData.featured})}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    formData.featured ? 'bg-[#F59E0B]' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.featured ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {formData.featured ? '✓ Featured' : 'Not featured'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : (post ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlog;