// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FlaskConical, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Shield,
  Truck,
  Star,
  ArrowRight,
  Award,
  CheckCircle
} from 'lucide-react';

// ✅ Icônes sociales en SVG inline (évite les problèmes de version lucide-react)
const FacebookIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Peptides', path: '/peptides' },
    { name: 'Peptide Blends', path: '/peptide-blends' },
    { name: 'Prescription', path: '/prescription' },
    { name: 'My Prescriptions', path: '/my-prescriptions' },
  ];

  const supportLinks = [
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Returns & Refunds', path: '/returns' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const categories = [
    { name: 'GLP-1 Agonists', path: '/marketplace?category=glp1' },
    { name: 'Growth Hormones', path: '/marketplace?category=growth' },
    { name: 'Healing Peptides', path: '/marketplace?category=healing' },
    { name: 'Fat Burning', path: '/marketplace?category=fat-burning' },
    { name: 'Peptide Blends', path: '/peptide-blends' },
    { name: 'SARMs', path: '/marketplace/sarms' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <YoutubeIcon />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <LinkedinIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Section - Newsletter & Brand */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-xl flex items-center justify-center">
                  <FlaskConical size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
                  PeptideWeightLoss
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Premium research peptides for weight loss and metabolic health. 
                Lab-tested, 99%+ purity, and backed by scientific excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2">Subscribe to our newsletter</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-[#2563EB] text-sm"
                  />
                  <button className="px-4 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-r-lg hover:opacity-90 transition flex items-center gap-2 text-sm font-medium">
                    Subscribe
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.path}>
                  <Link 
                    to={cat.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - MIS À JOUR AVEC LES VRAIES INFORMATIONS */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                <a href="mailto:info@peptidesweight-loss.com" className="hover:text-white transition-colors">
                  info@peptidesweight-loss.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <a href="tel:+13157467760" className="hover:text-white transition-colors">
                  +1 (315) 746-7760
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-[#F59E0B] mt-0.5 flex-shrink-0" />
                <span>123 Research Blvd, Lab City, CA 90210</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                <span>24/7 Customer Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Shield size={20} className="text-[#10B981] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Lab Tested</p>
                <p className="text-xs text-gray-500">Third-party verified</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Award size={20} className="text-[#F59E0B] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">99%+ Purity</p>
                <p className="text-xs text-gray-500">HPLC certified</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Truck size={20} className="text-[#2563EB] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Fast Shipping</p>
                <p className="text-xs text-gray-500">Worldwide delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <CheckCircle size={20} className="text-[#8B5CF6] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">24/7 Support</p>
                <p className="text-xs text-gray-500">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors text-gray-400 hover:text-white"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            © {currentYear} PeptideWeightLoss. All rights reserved.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-800/50">
          <p className="text-[10px] text-gray-600 text-center leading-relaxed">
            ⚠️ <strong>Research Use Only:</strong> All products are for research and laboratory use only. 
            Not for human consumption. Statements made on this website have not been evaluated by the FDA. 
            Products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;