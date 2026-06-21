// src/pages/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://peptideweightloss.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/blog-posts/${id}`);
      const postData = res.data.data || res.data;
      setPost(postData);
      setLikes(postData.likes || 0);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load article. Please try again.');
      setPost(null);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      const res = await axios.post(`${API_URL}/blog-posts/${id}/like`);
      setLikes(res.data.data?.likes || likes + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto text-[#2563EB] animate-spin mb-4" />
          <p className="text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Article not found</h3>
          <p className="text-gray-500">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            to="/blog"
            className="mt-4 inline-block px-6 py-2 bg-[#2563EB] text-white rounded-xl hover:bg-[#1E40AF] transition"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1E1B4B] pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-[#2563EB]/30 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 border-2 border-[#10B981]/30 rounded-full animate-bounce-slow" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-6"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-[#2563EB]/20 backdrop-blur-sm text-[#2563EB] text-xs font-semibold px-3 py-1 rounded-full border border-[#2563EB]/30">
              {post.category}
            </span>
            {post.featured && (
              <span className="bg-[#F59E0B]/20 backdrop-blur-sm text-[#F59E0B] text-xs font-semibold px-3 py-1 rounded-full border border-[#F59E0B]/30">
                ★ Featured
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <User size={14} /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {post.date || new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime || '5 min read'}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {post.views || 0} views
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative h-12 w-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Content - INTÉGRALITÉ DU CONTENU */}
          <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Section - Like seulement */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  hasLiked 
                    ? 'bg-red-50 text-red-500 cursor-default' 
                    : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={hasLiked ? 'fill-red-500' : ''} />
                <span className="font-medium">{likes}</span>
              </button>

              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Eye size={16} /> {post.views || 0} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Stay Updated on Peptide Research
          </h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for the latest research findings, product updates, 
            and scientific insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
            />
            <button className="px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .whitespace-pre-wrap {
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;