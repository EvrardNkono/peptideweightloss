// src/components/WhatsAppButton.jsx
import React, { useState, useEffect } from 'react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // ✅ Phone number (international format without the +)
  const phoneNumber = "18069221862";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  
  // ✅ Default message in English
  const defaultMessage = "Hello, I'm contacting you from Peptide Weight Loss. I would like more information about your products.";
  const whatsappUrlWithMessage = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // Hide the button after scrolling
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsVisible(true), 1000);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Show tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    // Optional analytics tracking
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'whatsapp_click', {
        'event_category': 'contact',
        'event_label': 'whatsapp_button'
      });
    }
    window.open(whatsappUrlWithMessage, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes pulse-whatsapp {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        
        @keyframes bounce-whatsapp {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {showTooltip && (
          <div className="absolute bottom-16 left-0 mb-2 w-64 animate-fadeInUp">
            <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg relative">
              <span className="font-medium">💬 Need help?</span>
              <br />
              <span className="text-slate-300 text-[10px]">Click to contact us on WhatsApp</span>
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
            </div>
          </div>
        )}

        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 overflow-hidden"
          style={{
            width: '60px',
            height: '60px',
            animation: 'pulse-whatsapp 2s infinite'
          }}
          aria-label="Contact us on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          
          <img 
            src="/images/WhatsApp_icon.png"
            alt="WhatsApp"
            className="w-full h-full object-cover relative z-10"
          />
          
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold animate-bounce z-20">
            !
          </span>
        </button>

        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="bg-slate-800 text-white text-xs font-medium py-2 px-4 rounded-lg shadow-lg">
            Contact us on WhatsApp
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppButton;