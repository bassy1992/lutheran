import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { donationsService } from '../src/services/api/endpoints/donations.service';
import type { DonationCategory, Donation } from '../src/types/models';

// Skeleton loader for categories
const SkeletonCategoryCard = () => (
  <div className="p-4 border border-slate-200 rounded-xl animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-full"></div>
  </div>
);

// Error display component
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
    <div className="flex-1">
      <h3 className="font-bold text-red-900 mb-2">Unable to load donation categories</h3>
      <p className="text-red-700 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  </div>
);

// Success confirmation component
interface SuccessConfirmationProps {
  donation: Donation;
  onNewDonation: () => void;
}

const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({ donation, onNewDonation }) => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
    <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
    <h2 className="text-2xl font-bold text-green-900 mb-2">Thank You for Your Donation!</h2>
    <p className="text-green-700 mb-6">Your generous contribution has been received.</p>
    
    <div className="bg-white rounded-xl p-6 mb-6 text-left space-y-3">
      <div className="flex justify-between">
        <span className="text-slate-600">Amount:</span>
        <span className="font-bold text-slate-900">{donation.currency} {donation.amount}</span>
      </div>
      {donation.category && (
        <div className="flex justify-between">
          <span className="text-slate-600">Category:</span>
          <span className="font-bold text-slate-900">{donation.category.name}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-slate-600">Transaction ID:</span>
        <span className="font-mono text-sm text-slate-900">{donation.transaction_id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">Date:</span>
        <span className="text-slate-900">
          {new Date(donation.donated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
      {donation.is_anonymous && (
        <div className="flex justify-between">
          <span className="text-slate-600">Status:</span>
          <span className="text-slate-900">Anonymous Donation</span>
        </div>
      )}
    </div>

    <p className="text-slate-600 text-sm mb-6">
      A receipt has been sent to {donation.donor_email}
    </p>

    <button
      onClick={onNewDonation}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
    >
      Make Another Donation
    </button>
  </div>
);

// Predefined donation amounts
const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

// Payment methods
const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' }
];

const Donate: React.FC = () => {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    category: '',
    amount: '',
    customAmount: '',
    currency: 'GHS',
    payment_method: 'card' as const,
    is_anonymous: false,
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDonation, setSuccessDonation] = useState<Donation | null>(null);

  // Fetch donation categories
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
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
    
    // Clear error for this field
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

    if (!formData.payment_method) {
      errors.payment_method = 'Please select a payment method';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const donation = await donationsService.createDonation({
        donor_name: formData.is_anonymous ? 'Anonymous' : formData.donor_name,
        donor_email: formData.donor_email,
        donor_phone: formData.donor_phone,
        category: parseInt(formData.category),
        amount: formData.amount,
        currency: formData.currency,
        payment_method: formData.payment_method,
        is_anonymous: formData.is_anonymous,
        notes: formData.notes
      });

      setSuccessDonation(donation);
    } catch (error) {
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Failed to process donation. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle new donation
  const handleNewDonation = () => {
    setSuccessDonation(null);
    setFormData({
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      category: '',
      amount: '',
      customAmount: '',
      currency: 'GHS',
      payment_method: 'card',
      is_anonymous: false,
      notes: ''
    });
    setFormErrors({});
  };

  // Show success confirmation
  if (successDonation) {
    return (
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/HERO.jpeg" 
              alt="Donate" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-900/60"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">Support Our Mission</h1>
          </div>
        </section>

        {/* Success Section */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 md:px-8 max-w-2xl">
            <SuccessConfirmation 
              donation={successDonation}
              onNewDonation={handleNewDonation}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="Donate" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">Support Our Mission</h1>
            <p className="text-xl text-slate-200">
              Your generous donation helps us serve our community and spread God's love
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Submit Error */}
              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-1" size={20} />
                  <p className="text-red-700">{formErrors.submit}</p>
                </div>
              )}

              {/* Donation Amount Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Donation Amount</h2>
                
                {/* Preset Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {PRESET_AMOUNTS.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handlePresetAmount(amount)}
                      className={`py-3 px-4 rounded-xl font-bold transition-all ${
                        formData.amount === amount.toString()
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {formData.currency} {amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Custom Amount
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input
                      type="number"
                      name="customAmount"
                      placeholder="Enter amount"
                      value={formData.customAmount}
                      onChange={handleCustomAmount}
                      min="1"
                      step="0.01"
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {formErrors.amount && (
                  <p className="text-red-600 text-sm">{formErrors.amount}</p>
                )}
              </div>

              {/* Donation Category Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Donation Category</h2>
                
                {categoriesError && (
                  <ErrorDisplay 
                    message={categoriesError.message || 'Failed to load categories'}
                    onRetry={refetchCategories}
                  />
                )}

                {categoriesLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <SkeletonCategoryCard key={i} />
                    ))}
                  </div>
                )}

                {!categoriesLoading && !categoriesError && categories && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map(category => (
                      <label
                        key={category.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.category === category.id.toString()
                            ? 'border-green-600 bg-green-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id.toString()}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="font-bold text-slate-900">{category.name}</span>
                        {category.description && (
                          <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {formErrors.category && (
                  <p className="text-red-600 text-sm">{formErrors.category}</p>
                )}
              </div>

              {/* Donor Information Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Your Information</h2>

                {/* Anonymous Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-slate-700 font-medium">Make this an anonymous donation</span>
                </label>

                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Full Name {!formData.is_anonymous && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type="text"
                    name="donor_name"
                    value={formData.donor_name}
                    onChange={handleInputChange}
                    disabled={formData.is_anonymous}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {formErrors.donor_name && (
                    <p className="text-red-600 text-sm">{formErrors.donor_name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="donor_email"
                    value={formData.donor_email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formErrors.donor_email && (
                    <p className="text-red-600 text-sm">{formErrors.donor_email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="donor_phone"
                    value={formData.donor_phone}
                    onChange={handleInputChange}
                    placeholder="+233123456789"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formErrors.donor_phone && (
                    <p className="text-red-600 text-sm">{formErrors.donor_phone}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(method => (
                    <label
                      key={method.value}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.payment_method === method.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={formData.payment_method === method.value}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="font-medium text-slate-900">{method.label}</span>
                    </label>
                  ))}
                </div>

                {formErrors.payment_method && (
                  <p className="text-red-600 text-sm">{formErrors.payment_method}</p>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or comments..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart size={20} />
                    Complete Donation
                  </>
                )}
              </button>

              {/* Disclaimer */}
              <p className="text-center text-sm text-slate-600">
                Your donation is secure and will be processed immediately. A receipt will be sent to your email.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
