// src/pages/KnowledgeCenter.jsx
import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  ArrowRight, 
  FlaskConical, 
  Beaker, 
  Droplets, 
  Thermometer, 
  Filter, 
  Activity,
  Zap,
  Shield,
  Microscope,
  FileText,
  ChevronRight,
  Calendar,
  Tag,
  TrendingUp
} from 'lucide-react';

const KnowledgeCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles', icon: <BookOpen size={16} />, count: 8 },
    { id: 'basics', name: 'Peptide Basics', icon: <FlaskConical size={16} />, count: 3 },
    { id: 'synthesis', name: 'Synthesis & Production', icon: <Beaker size={16} />, count: 2 },
    { id: 'storage', name: 'Storage & Handling', icon: <Thermometer size={16} />, count: 2 },
    { id: 'research', name: 'Research Applications', icon: <Microscope size={16} />, count: 1 }
  ];

  const articles = [
    {
      id: 1,
      title: "Understanding Peptide Bonds",
      excerpt: "How Is The Bond Created? When two amino acids form a covalent bond, it creates a peptide bond. The Carboxyl group of one amino acid may react with the second amino group of the other amino acid...",
      content: "Detailed content about peptide bonds...",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop",
      category: "basics",
      author: "Dr. Sarah Thompson",
      date: "March 15, 2024",
      readTime: "5 min read",
      tags: ["Peptide Bonds", "Amino Acids", "Chemistry"],
      citations: ["1. Journal of Peptide Science, 2023"]
    },
    {
      id: 2,
      title: "Peptide Synthesis",
      excerpt: "The Process of Peptide Synthesis Solution Phase Synthesis (SPS) was the original approach to peptide synthesis. Though this process still has merit, Solid-Phase Peptide Synthesis (SPPS) has become the method...",
      content: "Detailed content about synthesis...",
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop",
      category: "synthesis",
      author: "Dr. Michael Chen",
      date: "March 10, 2024",
      readTime: "7 min read",
      tags: ["SPPS", "Peptide Synthesis", "Laboratory"],
      citations: ["1. Chemical Reviews, 2022"]
    },
    {
      id: 3,
      title: "Peptide Solubility",
      excerpt: "How To Find The Best Peptide Solubility Option Figuring out the most effective solvent to dissolve peptides is possibly one of the most difficult components when working with peptides. Aqueous solutions–also known as sterile waters–are one...",
      content: "Detailed content about solubility...",
      image: "https://images.unsplash.com/photo-1582719500981-5c5f2e8c3c4a?w=800&h=500&fit=crop",
      category: "basics",
      author: "Dr. James Wilson",
      date: "March 5, 2024",
      readTime: "6 min read",
      tags: ["Solubility", "Peptides", "Research"],
      citations: ["1. International Journal of Peptide Research, 2023"]
    },
    {
      id: 4,
      title: "Standard Procedure For Storing Peptides",
      excerpt: "Long-term peptide storage over several months and years demands proper refrigeration. The preferred and usual temperature for storage is -80°C (-112°F). Freezing peptides is optimal to preserve their stability and retain functional viability...",
      content: "Detailed content about storage...",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e9d4?w=800&h=500&fit=crop",
      category: "storage",
      author: "Dr. Emily Rodriguez",
      date: "February 28, 2024",
      readTime: "4 min read",
      tags: ["Storage", "Peptides", "Stability"],
      citations: ["1. Journal of Peptide Science, 2023"]
    },
    {
      id: 5,
      title: "Peptide Purification",
      excerpt: "Here you will find information on the different aspects of peptide purification that take place during synthesis, different strategies and methods, and possible mistakes, such as impurities that may actually be removed by purification...",
      content: "Detailed content about purification...",
      image: "https://images.unsplash.com/photo-1581092335871-4b1d4b5b8b8b?w=800&h=500&fit=crop",
      category: "synthesis",
      author: "Dr. Sarah Thompson",
      date: "February 20, 2024",
      readTime: "8 min read",
      tags: ["Purification", "HPLC", "Quality Control"],
      citations: ["1. Analytical Chemistry, 2023"]
    },
    {
      id: 6,
      title: "GLP-1 Agonists: Mechanism of Action",
      excerpt: "GLP-1 receptor agonists mimic the natural incretin hormone, enhancing insulin secretion, suppressing glucagon release, and promoting satiety. This makes them valuable for metabolic research...",
      content: "Detailed content about GLP-1...",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop",
      category: "research",
      author: "Dr. Michael Chen",
      date: "February 15, 2024",
      readTime: "6 min read",
      tags: ["GLP-1", "Metabolism", "Research"],
      citations: ["1. New England Journal of Medicine, 2023"]
    },
    {
      id: 7,
      title: "Reconstitution Guide for Peptides",
      excerpt: "Proper reconstitution is critical for peptide research. Learn the correct procedures for dissolving lyophilized peptides using appropriate solvents and maintaining sterility...",
      content: "Detailed content about reconstitution...",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop",
      category: "basics",
      author: "Dr. James Wilson",
      date: "February 10, 2024",
      readTime: "5 min read",
      tags: ["Reconstitution", "Peptides", "Protocol"],
      citations: ["1. Laboratory Methods in Peptide Research, 2023"]
    },
    {
      id: 8,
      title: "Peptide Stability and Degradation",
      excerpt: "Understanding factors that affect peptide stability, including temperature, pH, and light exposure, is essential for maintaining research integrity...",
      content: "Detailed content about stability...",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop",
      category: "storage",
      author: "Dr. Emily Rodriguez",
      date: "February 5, 2024",
      readTime: "4 min read",
      tags: ["Stability", "Degradation", "Peptides"],
      citations: ["1. Journal of Peptide Research, 2022"]
    }
  ];

  const filteredArticles = articles.filter(article => {
    if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredArticle = articles[0];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <BookOpen size={14} className="text-white" />
            <span className="text-sm font-semibold text-white tracking-wide">EDUCATIONAL RESOURCES</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Knowledge Center
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            All articles and shared info are for educational purposes only.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
                <span className={`text-xs ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {selectedCategory === 'all' && !searchQuery && (
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-[#F59E0B]" />
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Featured Article</span>
            </div>
            <div className="group bg-gradient-to-r from-gray-50 to-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded-full">
                      FEATURED
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#2563EB] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                        <User size={14} className="text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{featuredArticle.author}</p>
                        <p className="text-xs text-gray-400">{featuredArticle.date}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-[#2563EB] font-medium hover:gap-3 transition-all">
                      Read More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Disclaimer</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The products mentioned are not intended for human or animal consumption. Research chemicals are intended solely 
                  for laboratory experimentation and/or in-vitro testing. Bodily introduction of any sort is strictly prohibited by law. 
                  All purchases are limited to licensed researchers and/or qualified professionals. All information shared in this 
                  article is for educational purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Composant ArticleCard
const ArticleCard = ({ article }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            {article.category === 'basics' && 'Peptide Basics'}
            {article.category === 'synthesis' && 'Synthesis'}
            {article.category === 'storage' && 'Storage'}
            {article.category === 'research' && 'Research'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{article.date}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#2563EB] transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
              <User size={12} className="text-[#2563EB]" />
            </div>
            <span className="text-xs text-gray-600">{article.author.split(' ')[0]}</span>
          </div>
          <button className="flex items-center gap-1 text-[#2563EB] text-sm font-medium hover:gap-2 transition-all">
            Read More <ChevronRight size={14} />
          </button>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          {article.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {article.citations && article.citations.length > 0 && (
            <span className="text-xs text-[#2563EB] bg-[#2563EB]/5 px-2 py-0.5 rounded-full flex items-center gap-1">
              <FileText size={10} /> Cite
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCenter;