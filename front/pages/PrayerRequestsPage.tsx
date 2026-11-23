import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Heart } from 'lucide-react';
import { prayersService } from '../src/services/api/endpoints';
import { useAuth } from '../src/contexts/AuthContext';

const PrayerRequestsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    is_anonymous: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.request.trim()) {
      errors.request = 'Prayer request is required';
    } else if (formData.request.trim().length < 10) {
      errors.request = 'Prayer request must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await prayersService.submitPrayerRequest(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        request: '',
        is_anonymous: false,
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit prayer request';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Heart className="text-red-600" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Prayer Requests</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Share your prayer requests with our church community. Our prayer team will lift your needs up in prayer.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-2">
          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-green-900 text-sm">Prayer Request Submitted!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Thank you for sharing your prayer request. Our prayer team will be praying for you.
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Prayer Request Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  validationErrors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 bg-white'
                }`}
                disabled={isLoading}
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  validationErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 bg-white'
                }`}
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Prayer Request Field */}
            <div>
              <label htmlFor="request" className="block text-sm font-semibold text-slate-900 mb-2">
                Prayer Request
              </label>
              <textarea
                id="request"
                name="request"
                value={formData.request}
                onChange={handleChange}
                placeholder="Share your prayer request here..."
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  validationErrors.request
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 bg-white'
                }`}
                disabled={isLoading}
              />
              {validationErrors.request && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.request}</p>
              )}
              <p className="text-xs text-slate-500 mt-2">
                {formData.request.length} characters
              </p>
            </div>

            {/* Anonymous Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-slate-600">
                Submit as anonymous (your name won't be shared with the prayer team)
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart size={20} />
                  Submit Prayer Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">1.</span>
                  <span>Share your prayer request with us</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">2.</span>
                  <span>Our prayer team receives your request</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">3.</span>
                  <span>We lift your needs up in prayer</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">4.</span>
                  <span>You'll receive a confirmation email</span>
                </li>
              </ol>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Privacy</h3>
              <p className="text-sm text-slate-600">
                Your prayer request is confidential. You can choose to submit anonymously, and your information will never be shared without your permission.
              </p>
            </div>

            {isAuthenticated && (
              <div className="pt-6 border-t border-slate-200 bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ✓ You're logged in. Your prayer requests will be saved to your account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestsPage;
