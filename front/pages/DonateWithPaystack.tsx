import React, { useState } from 'react';
import { Heart, AlertCircle, CheckCircle, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { donationsService } from '../src/services/api/endpoints/donations.service';
import type { DonationCategory } from '../src/types/models';

// Paystack types
declare global {
  interface Window {
    PaystackPop: any;
  }
}

// Predefined donation amounts in GHS
const PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

const Donate: React.FC = () => {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    category: '',
    amount: '',
    customAmount: '',
    is_anonymous: false,
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  // Fetch donation categories
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError
  } = useAPI<DonationCategory[]>(
    () => donationsService.getCategories(),
    []
  );

  // Handle preset amount selection
  const handlePresetAmount = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: ''
    }));
    setFormErrors(prev => ({ ...prev, amount: '' }));
  };

  // Handle custom amount input
  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      customAmount: value,
      amount: value
    }));
    setFormErrors(prev => ({ ...prev, amount: '' }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.donor_name.trim()) {
      errors.donor_name = 'Name is required';
    }

    if (!formData.donor_email.trim()) {
      errors.donor_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donor_email)) {
      errors.donor_email = 'Please enter a valid email address';
    }

    if (!formData.donor_phone.trim()) {
      errors.donor_phone = 'Phone number is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please select or enter a valid donation amount';
    }

    if (!formData.category) {
      errors.category = 'Please select a donation category';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Initialize Paystack payment
  const initializePaystack = () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Generate reference
    const reference = 'TLC_' + Math.floor((Math.random() * 1000000000) + 1);
    
    // Paystack configuration
    const handler = window.PaystackPop.setup({
      key: 'pk_test_YOUR_PUBLIC_KEY_HERE', // Replace with your Paystack public key
      email: formData.donor_email,
      amount: parseFloat(formData.amount) * 100, // Amount in pesewas (GHS * 100)
      currency: 'GHS',
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: formData.is_anonymous ? 'Anonymous' : formData.donor_name
          },
          {
            display_name: "Phone Number",
            variable_name: "phone",
            value: formData.donor_phone
          },
          {
            display_name: "Category",
            variable_name: "category",
            value: categories?.find(c => c.id.toString() === formData.category)?.name || ''
          },
          {
            display_name: "Notes",
            variable_name: "notes",
            value: formData.notes
          }
        ]
      },
      onClose: function() {
        setIsProcessing(false);
        alert('Payment window closed');
      },
      callback: function(response: any) {
        // Payment successful
        setTransactionRef(response.reference);
        
        // Save donation to backend
        saveDonation(response.reference, 'completed');
      }
    });

    handler.openIframe();
  };

  // Save donation to backend
  const saveDonation = async (reference: string, status: string) => {
    try {
      await donationsService.createDonation({
        donor_name: formData.is_anonymous ? 'Anonymous' : formData.donor_name,
        donor_email: formData.donor_email,
        donor_phone: formData.donor_phone,
        category: parseInt(formData.category),
        amount: formData.amount,
        currency: 'GHS',
        payment_method: 'card',
        transaction_id: reference,
        is_anonymous: formData.is_anonymous,
        notes: formData.notes
      });

      setShowSuccess(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error saving donation:', error);
      setFormErrors({
        submit: 'Payment successful but failed to save record. Please contact us with reference: ' + reference
      });
      setIsProcessing(false);
    }
  };

  // Handle new donation
  const handleNewDonation = () => {
    setShowSuccess(false);
    setFormData({
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      category: '',
      amount: '',
      customAmount: '',
      is_anonymous: false,
      notes: ''
    });
    setFormErrors({});
    setTransactionRef('');
  };

  // Success view
  if (showSuccess) {
    return (
      <div className="w-full">
        <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/HERO.jpeg" 
              alt="Thank You" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-900/60"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">Thank You!</h1>
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 md:px-8 max-w-2xl">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
              <h2 className="text-3xl font-bold text-green-900 mb-4">Donation Successful!</h2>
              <p className="text-green-700 text-lg mb-6">
                Your generous contribution of GHS {formData.amount} has been received.
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-bold text-slate-900">GHS {formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transaction Reference:</span>
                  <span className="font-mono text-sm text-slate-900">{transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="text-slate-900">{formData.donor_email}</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-6">
                A receipt has been sent to your email address.
              </p>

              <button
                onClick={handleNewDonation}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-colors"
              >
                Make Another Donation
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="Support Our Mission" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Heart className="mx-auto text-red-400" size={64} />
            <h1 className="text-4xl md:text-6xl font-bold">Support Our Mission</h1>
            <p className="text-xl text-slate-200">
              Your generosity helps us spread the Gospel and serve our community
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Error Message */}
            {formErrors.submit && (
              <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <p className="text-red-800">{formErrors.submit}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Make a Donation</h2>

              <form onSubmit={(e) => { e.preventDefault(); initializePaystack(); }} className="space-y-6">
                {/* Donation Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Select Amount (GHS)
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    {PRESET_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handlePresetAmount(amount)}
                        className={`px-4 py-3 rounded-xl font-bold transition-all ${
                          formData.amount === amount.toString()
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    value={formData.customAmount}
                    onChange={handleCustomAmount}
                    min="1"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.amount ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                  )}
                </div>

                {/* Donation Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Donation Category
                  </label>
                  {categoriesLoading ? (
                    <div className="animate-pulse h-12 bg-slate-200 rounded-xl"></div>
                  ) : categoriesError ? (
                    <p className="text-red-600 text-sm">Failed to load categories</p>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.category ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="donor_name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="donor_name"
                      name="donor_name"
                      value={formData.donor_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.donor_name ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.donor_name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.donor_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="donor_email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="donor_email"
                      name="donor_email"
                      value={formData.donor_email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.donor_email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {formErrors.donor_email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.donor_email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="donor_phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="donor_phone"
                    name="donor_phone"
                    value={formData.donor_phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.donor_phone ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="+233 24 000 0000"
                  />
                  {formErrors.donor_phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.donor_phone}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Any special message or dedication..."
                  />
                </div>

                {/* Anonymous Donation */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_anonymous"
                    name="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-700 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="is_anonymous" className="text-sm text-slate-700">
                    Make this an anonymous donation
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={24} />
                      Donate with Paystack
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Secure payment powered by Paystack
                </p>
              </form>
            </div>

            {/* Payment Methods Info */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Accepted Payment Methods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl">
                  <CreditCard size={32} className="text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Cards</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl">
                  <Smartphone size={32} className="text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Mobile Money</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl">
                  <CreditCard size={32} className="text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Bank Transfer</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl">
                  <Heart size={32} className="text-red-600" />
                  <span className="text-sm font-medium text-slate-700">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
