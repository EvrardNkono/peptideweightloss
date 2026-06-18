// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  Package,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, getItemCount, getCartSavings, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ États des champs du formulaire
  const [formData, setFormData] = useState({
    // Identité
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Adresse de livraison
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Informations complémentaires
    orderNotes: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  const total = getCartTotal();
  const itemCount = getItemCount();
  const savings = getCartSavings();
  const shipping = total > 200 ? 0 : 9.99;
  const grandTotal = total - savings + shipping;

  // ✅ Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\d\s\-+()]{8,20}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll vers la première erreur
      const firstError = document.querySelector('.error-message');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    // Construction des données de la commande
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      shipping: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      order: {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          dosage: item.dosage,
          supplements: item.selectedSupplements || []
        })),
        subtotal: total,
        shipping: shipping,
        discount: savings,
        total: grandTotal,
        notes: formData.orderNotes
      },
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };

    try {
      // ✅ Envoi des données via email (simulé ici)
      console.log('📦 Order Data:', orderData);
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ✅ Succès
      setIsSuccess(true);
      clearCart();
      
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/order-confirmation', { state: { orderData } });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Écran de succès
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">
            Your order has been received. We will send you a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            A payment request will be sent to your email address.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E40AF] transition"
          >
            Return Home <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">
            You cannot proceed to checkout with an empty cart.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E40AF] transition"
          >
            <ArrowLeft size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/cart" className="text-gray-400 hover:text-gray-600 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <CreditCard size={28} className="text-[#2563EB]" />
              Checkout
            </h1>
          </div>
          <span className="text-gray-500 text-sm">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Error de soumission */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
              
              {/* Section 1: Personal Information */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={18} className="text-[#2563EB]" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="john.doe@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.email}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">We'll send the payment request here</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="+1 234 567 890"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Address */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-[#2563EB]" />
                  Shipping Address
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    } focus:border-[#2563EB] outline-none transition`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 error-message">{errors.address}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, Suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none transition"
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.state ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-200'
                      } focus:border-[#2563EB] outline-none transition`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none transition"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="AU">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Section 3: Order Notes */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Additional Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (optional)
                  </label>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none transition resize-none"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>

              {/* Section 4: Terms */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB]"
                  />
                  <div>
                    <label className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="/terms" className="text-[#2563EB] hover:underline">Terms and Conditions</a>
                      {' '}and confirm that I have read the{' '}
                      <a href="/privacy" className="text-[#2563EB] hover:underline">Privacy Policy</a>.
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-red-500 text-xs mt-1 error-message">{errors.agreeTerms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 Your information is secure. We do not store payment details.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Savings</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="py-4 border-b border-gray-100 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-2">
                    <span className="text-gray-600 truncate max-w-[150px]">
                      {item.name} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#2563EB]">${grandTotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg mt-4">
                  <Shield size={14} />
                  <span>Secure checkout</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 text-center pt-4">
                  <div className="flex flex-col items-center gap-1">
                    <Shield size={14} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Clock size={14} />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Package size={14} />
                    <span>Discreet Packaging</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles size={14} />
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;