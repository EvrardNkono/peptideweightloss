// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import AboutPeptideWeightLoss from '../components/AboutPeptideWeightLoss';
import PeptideScience from '../components/PeptideScience';
import { Shield, Truck, FlaskConical, Star } from 'lucide-react';

const Home = () => {
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Ici tu ajouteras la logique du panier
  };

  const handleQuickView = (product) => {
    console.log('Quick view:', product);
    // Ici tu ajouteras la logique de vue rapide
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We provide the highest quality peptides with exceptional customer service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="text-[#2563EB]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lab Tested</h3>
              <p className="text-gray-500">Every batch is third-party tested for purity and potency</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#10B981]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">99% Purity</h3>
              <p className="text-gray-500">High-performance liquid chromatography verified</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-[#F59E0B]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Shipping</h3>
              <p className="text-gray-500">Discreet packaging with tracking worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section - 8 produits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de section avec badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 rounded-full px-4 py-1.5 mb-4">
              <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#D97706] tracking-wide">BEST SELLERS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Our Most Popular Peptides
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Trusted by thousands of customers for quality and results
            </p>
          </div>

          {/* Grille 8 produits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellerProducts.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                dosage={product.dosage}
                purity={product.purity}
                price={product.price}
                oldPrice={product.oldPrice}
                rating={product.rating}
                reviews={product.reviews}
                category={product.category}
                isBestSeller={product.isBestSeller}
                isNew={product.isNew}
                onAddToCart={() => handleAddToCart(product)}
                onQuickView={() => handleQuickView(product)}
              />
            ))}
          </div>

          {/* Bouton View All */}
          <div className="text-center mt-12">
            <button className="group bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white px-10 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5">
              View All Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutPeptideWeightLoss />

      {/* Peptide Science Section - Comment agissent les peptides */}
      <PeptideScience />

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-500">Thousands of satisfied customers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex text-[#F59E0B] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2563EB] to-[#10B981]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have achieved their weight loss goals with our premium peptides
          </p>
          <button className="bg-[#F59E0B] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#D97706] transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

// 8 produits Best Sellers
const bestSellerProducts = [
  {
    name: 'Semaglutide',
    dosage: '5mg/vial',
    purity: '≥99%',
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.9,
    reviews: 234,
    category: 'GLP-1 Agonist',
    isBestSeller: true,
    isNew: false
  },
  {
    name: 'Tirzepatide',
    dosage: '10mg/vial',
    purity: '≥99%',
    price: 99.99,
    oldPrice: 149.99,
    rating: 4.8,
    reviews: 189,
    category: 'Dual GIP/GLP-1',
    isBestSeller: true,
    isNew: false
  },
  {
    name: 'AOD-9604',
    dosage: '5mg/vial',
    purity: '≥99%',
    price: 69.99,
    oldPrice: 89.99,
    rating: 4.7,
    reviews: 156,
    category: 'Fat Burning',
    isBestSeller: false,
    isNew: true
  },
  {
    name: 'MOTS-c',
    dosage: '10mg/vial',
    purity: '≥99%',
    price: 79.99,
    rating: 4.8,
    reviews: 98,
    category: 'Mitochondrial',
    isBestSeller: false,
    isNew: false
  },
  {
    name: 'BPC-157',
    dosage: '5mg/vial',
    purity: '≥99%',
    price: 59.99,
    oldPrice: 79.99,
    rating: 4.9,
    reviews: 312,
    category: 'Healing',
    isBestSeller: true,
    isNew: false
  },
  {
    name: 'TB-500',
    dosage: '5mg/vial',
    purity: '≥99%',
    price: 64.99,
    oldPrice: 84.99,
    rating: 4.8,
    reviews: 178,
    category: 'Regeneration',
    isBestSeller: false,
    isNew: false
  },
  {
    name: 'GHK-Cu',
    dosage: '50mg/vial',
    purity: '≥99%',
    price: 49.99,
    rating: 4.7,
    reviews: 145,
    category: 'Copper Peptide',
    isBestSeller: false,
    isNew: true
  },
  {
    name: 'Ipamorelin',
    dosage: '5mg/vial',
    purity: '≥99%',
    price: 54.99,
    oldPrice: 74.99,
    rating: 4.8,
    reviews: 167,
    category: 'Growth Hormone',
    isBestSeller: false,
    isNew: false
  }
];

const testimonials = [
  { text: 'Lost 15kg in 3 months. Life changing!', name: 'Sarah J.', result: 'Lost 15kg' },
  { text: 'Amazing quality and fast shipping', name: 'Michael T.', result: 'Lost 10kg' },
  { text: 'The customer service is outstanding', name: 'Emma L.', result: 'Lost 12kg' },
];

export default Home;