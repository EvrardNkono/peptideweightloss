// src/pages/Blog.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Tag,
  TrendingUp,
  FlaskConical,
  Award,
  Shield,
  Mail,
  BookOpen,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  Filter
} from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // ============================================================
  // BLOG POSTS DATA
  // ============================================================
  const posts = [
    {
      id: 1,
      title: 'The Science Behind GLP-1 Agonists for Weight Loss',
      excerpt: 'Discover how GLP-1 receptor agonists work at the molecular level to regulate appetite, slow gastric emptying, and promote sustainable weight loss in clinical research.',
      category: 'GLP-1 Agonists',
      author: 'Dr. Sarah Thompson',
      authorRole: 'PhD in Molecular Biology',
      date: 'June 15, 2026',
      readTime: '8 min read',
      views: 1247,
      image: '/images/blog/glp1-science.jpg',
      tags: ['GLP-1', 'Weight Loss', 'Peptide Research', 'Metabolism'],
      featured: true,
      popular: true
    },
    {
      id: 2,
      title: 'Peptide Blends: Synergistic Effects in Metabolic Health',
      excerpt: 'Explore the potential of combining multiple peptides to achieve enhanced therapeutic outcomes in metabolic disorders, obesity, and insulin resistance research.',
      category: 'Peptide Blends',
      author: 'Dr. Michael Chen',
      authorRole: 'PhD in Pharmacology',
      date: 'June 10, 2026',
      readTime: '6 min read',
      views: 893,
      image: '/images/blog/peptide-blends.jpg',
      tags: ['Peptide Blends', 'Metabolic Health', 'Synergy', 'Research'],
      featured: false,
      popular: true
    },
    {
      id: 3,
      title: 'Understanding Growth Hormone Secretagogues in Research',
      excerpt: 'A comprehensive overview of GHS and their role in stimulating endogenous growth hormone release for anti-aging and muscle preservation studies.',
      category: 'Growth Hormones',
      author: 'Dr. Emily Rodriguez',
      authorRole: 'PhD in Endocrinology',
      date: 'June 5, 2026',
      readTime: '7 min read',
      views: 1056,
      image: '/images/blog/growth-hormones.jpg',
      tags: ['Growth Hormones', 'GHS', 'Anti-Aging', 'Muscle'],
      featured: false,
      popular: false
    },
    {
      id: 4,
      title: 'BPC-157 and TB-500: The Healing Peptide Duo',
      excerpt: 'An in-depth look at the regenerative potential of BPC-157 and TB-500 peptides in tissue repair, inflammation reduction, and musculoskeletal recovery.',
      category: 'Healing Peptides',
      author: 'Dr. James Park',
      authorRole: 'PhD in Cell Biology',
      date: 'May 28, 2026',
      readTime: '9 min read',
      views: 1562,
      image: '/images/blog/healing-peptides.jpg',
      tags: ['BPC-157', 'TB-500', 'Healing', 'Tissue Repair'],
      featured: true,
      popular: true
    },
    {
      id: 5,
      title: 'SARMs vs. Peptides: What Researchers Need to Know',
      excerpt: 'A comparative analysis of SARMs and peptides in clinical research, highlighting mechanisms, applications, and key differences for informed study design.',
      category: 'SARMs',
      author: 'Dr. Amanda Wright',
      authorRole: 'PhD in Sports Medicine',
      date: 'May 20, 2026',
      readTime: '10 min read',
      views: 2103,
      image: '/images/blog/sarms-vs-peptides.jpg',
      tags: ['SARMs', 'Peptides', 'Research', 'Comparison'],
      featured: false,
      popular: true
    },
    {
      id: 6,
      title: 'Optimizing Peptide Stability and Storage for Research',
      excerpt: 'Essential guidelines for peptide handling, reconstitution, and long-term storage to maintain structural integrity and bioactivity in laboratory settings.',
      category: 'Research Guides',
      author: 'Dr. David Kim',
      authorRole: 'PhD in Biochemistry',
      date: 'May 15, 2026',
      readTime: '5 min read',
      views: 678,
      image: '/images/blog/peptide-storage.jpg',
      tags: ['Storage', 'Stability', 'Lab Techniques', 'Research'],
      featured: false,
      popular: false
    },
    {
      id: 7,
      title: 'The Future of Peptide Therapeutics in Metabolic Medicine',
      excerpt: 'Exploring upcoming peptide-based therapies and their potential to revolutionize the treatment of metabolic syndrome, diabetes, and obesity.',
      category: 'Research Trends',
      author: 'Dr. Rachel Lee',
      authorRole: 'PhD in Metabolism',
      date: 'May 8, 2026',
      readTime: '7 min read',
      views: 934,
      image: '/images/blog/future-peptides.jpg',
      tags: ['Future', 'Therapeutics', 'Innovation', 'Research'],
      featured: false,
      popular: false
    },
    {
      id: 8,
      title: 'Semaglutide vs. Tirzepatide: A Comparative Research Review',
      excerpt: 'A detailed comparison of two leading GLP-1 receptor agonists, examining their mechanisms, efficacy, and applications in metabolic research.',
      category: 'GLP-1 Agonists',
      author: 'Dr. Robert Yang',
      authorRole: 'PhD in Clinical Research',
      date: 'May 1, 2026',
      readTime: '11 min read',
      views: 2876,
      image: '/images/blog/semaglutide-vs-tirzepatide.jpg',
      tags: ['Semaglutide', 'Tirzepatide', 'GLP-1', 'Comparison'],
      featured: false,
      popular: true
    }
  ];

  // ============================================================
  // FILTER AND SEARCH LOGIC
  // ============================================================
  const categories = ['All', ...new Set(posts.map(post => post.category))];

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'popular') return b.views - a.views;
      return 0;
    });

  // Featured posts (top 2)
  const featuredPosts = posts.filter(p => p.featured).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      
      {/* ============================================================
           HERO SECTION
           ============================================================ */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1E1B4B] pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-[#2563EB]/30 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 border-2 border-[#10B981]/30 rounded-full animate-bounce-slow" />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <BookOpen size={14} className="text-[#2563EB]" />
            <span className="text-sm font-semibold text-white tracking-wide">RESEARCH BLOG</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Peptide Research{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            The latest scientific developments, research findings, and expert perspectives 
            on peptide therapeutics and metabolic health.
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative h-12 w-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============================================================
           FEATURED POSTS
           ============================================================ */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#2563EB] text-xs font-semibold uppercase tracking-wider">Featured</span>
                <h2 className="text-2xl font-bold text-gray-800">Editor's Picks</h2>
              </div>
              <Link to="/blog" className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-[320px] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-500">
                      <FlaskConical size={48} className="opacity-20" />
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-[#2563EB]/20 backdrop-blur-sm text-[#2563EB] text-xs font-semibold px-3 py-1 rounded-full border border-[#2563EB]/30">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#2563EB] transition">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
           FILTER & SEARCH BAR
           ============================================================ */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2563EB]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 focus:outline-none focus:border-[#2563EB]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           BLOG GRID
           ============================================================ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <Link to={`/blog/${post.id}`}>
                    <div className="h-48 bg-gray-200 relative flex items-center justify-center">
                      <FlaskConical size={36} className="text-gray-400" />
                      {post.popular && (
                        <span className="absolute top-3 right-3 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <TrendingUp size={12} /> Popular
                        </span>
                      )}
                      <span className="absolute top-3 left-3 bg-[#2563EB]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-5">
                    <Link to={`/blog/${post.id}`}>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#2563EB] transition line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs font-medium text-gray-700">{post.author}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-[#2563EB] hover:text-[#1E40AF] transition"
                      >
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
           CTA SECTION
           ============================================================ */}
      <section className="py-16 bg-gradient-to-r from-[#2563EB] to-[#10B981]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated on Peptide Research
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest research findings, product updates, 
            and scientific insights delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-[#2563EB] rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
           ANIMATION STYLES
           ============================================================ */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Blog;