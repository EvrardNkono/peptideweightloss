// src/pages/Contact.jsx
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Microscope,
  Briefcase,
  Camera
} from 'lucide-react';
import { CONTACT_CONFIG } from '../config/contact';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // ✅ On utilise la MÊME API que le checkout
      // On mappe les champs du contact vers le format attendu par l'API
      const response = await fetch('https://peptideweightloss.vercel.app/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // On utilise les champs existants de l'API
          formData: {
            firstName: formData.name,        // name → firstName
            lastName: '',                    // champ existant mais vide
            email: formData.email,           // email → email
            phone: '',                       // champ existant mais vide
            address: formData.message,       // message → address (pour que ce soit envoyé)
            // On peut aussi ajouter le sujet dans un champ existant
            orderNotes: `Subject: ${formData.subject || 'N/A'}\n\n${formData.message}`,
            // Champs obligatoires vides
            apartment: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
            agreeTerms: true,
          },
          // On envoie un panier vide pour ne pas casser l'API
          cart: [],
          total: 0,
          shipping: 0,
          grandTotal: 0
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setSubmitError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error sending contact form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { 
      icon: <Mail size={20} />, 
      title: 'Email Us', 
      value: CONTACT_CONFIG.email, 
      href: `mailto:${CONTACT_CONFIG.email}`, 
      color: '#2563EB' 
    },
    { 
      icon: <Phone size={20} />, 
      title: 'Call Us', 
      value: CONTACT_CONFIG.phone, 
      href: `tel:${CONTACT_CONFIG.phoneRaw}`, 
      color: '#10B981' 
    },
    { 
      icon: <MapPin size={20} />, 
      title: 'Visit Us', 
      value: CONTACT_CONFIG.address, 
      color: '#F59E0B' 
    },
    { 
      icon: <Clock size={20} />, 
      title: 'Hours', 
      value: 'Mon-Fri: 9AM-6PM EST | 24/7 Email Support', 
      color: '#2563EB' 
    }
  ];

  const faqs = [
    { question: 'What is your shipping policy?', answer: 'We offer discreet worldwide shipping with tracking. Orders are processed within 24-48 hours.' },
    { question: 'Do you offer bulk pricing?', answer: 'Yes, for research institutions and volume orders, please contact our sales team directly.' },
    { question: 'How do I track my order?', answer: 'Once shipped, you will receive a tracking number via email.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day satisfaction guarantee for unopened products.' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1E1B4B] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#2563EB]/30 rounded-full animate-pulse" />
          <div className="absolute bottom-32 right-20 w-40 h-40 border-2 border-[#10B981]/30 rounded-full animate-bounce-slow" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 border-4 border-[#F59E0B]/20 rounded-lg animate-spin-slow" />
          <svg className="absolute inset-0 w-full h-full">
            <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.3" className="animate-dash" />
            <line x1="70%" y1="30%" x2="85%" y2="60%" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" className="animate-dash-delay" />
          </svg>
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <MessageCircle size={14} className="text-[#2563EB]" />
            <span className="text-sm font-semibold text-white tracking-wide">GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Have questions about our research peptides? Our scientific support team is here to help.
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative h-12 w-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 relative z-10">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${info.color}15` }}>
                  <div style={{ color: info.color }}>{info.icon}</div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
                {info.href ? (
                  <a href={info.href} className="text-gray-500 text-sm hover:text-[#2563EB] transition">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 rounded-full px-3 py-1 mb-4">
                  <Mail size={12} className="text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#2563EB]">SEND US A MESSAGE</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">We'd Love to Hear From You</h2>
                <p className="text-gray-500 text-sm mt-1">Fill out the form and our team will respond within 24 hours.</p>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              {isSubmitted ? (
                <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#10B981]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent! ✅</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                  <p className="text-xs text-gray-400 mt-2">
                    A copy has been sent to <strong>{CONTACT_CONFIG.email}</strong>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition`}
                      placeholder="Dr. John Smith"
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition`}
                      placeholder="research@university.edu"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                      placeholder="Product inquiry / Research question / Order support"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition resize-none`}
                      placeholder="Please provide details about your inquiry..."
                      disabled={isSubmitting}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Scientific Credentials & Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="h-48 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2464.0!2d-75.5!3d39.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ4JzAwLjAiTiA3NcKwMzAnMDAuMCJX!5e0!3m2!1sen!2sus!4v1"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-[#2563EB] flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800">Research Facility</h3>
                      <p className="text-gray-500 text-sm">{CONTACT_CONFIG.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#2563EB]/5 via-[#10B981]/5 to-[#F59E0B]/5 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                    <Microscope size={20} className="text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold text-gray-800">Scientific Support Team</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Our team of PhD scientists is available to answer technical questions about peptide research, 
                  solubility, storage, and experimental design.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-[#10B981]"><CheckCircle size={14} /> PhD-level support</span>
                  <span className="flex items-center gap-1 text-[#10B981]"><CheckCircle size={14} /> 24h response</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Follow Our Research</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition group">
                    <Briefcase size={18} className="text-gray-500 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition group">
                    <Camera size={18} className="text-gray-500 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 rounded-full px-4 py-1.5 mb-4">
              <MessageCircle size={14} className="text-[#10B981]" />
              <span className="text-xs font-semibold text-[#10B981] tracking-wide">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Quick answers to common questions about our products and services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-500 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2563EB] to-[#10B981]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Scientific Consultation?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Our PhD scientists are available for technical discussions about peptide research applications.
          </p>
          <button className="bg-white text-[#2563EB] px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            Request a Consultation
          </button>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 2s linear infinite;
        }
        .animate-dash-delay {
          stroke-dasharray: 10;
          animation: dash 2s linear infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Contact;