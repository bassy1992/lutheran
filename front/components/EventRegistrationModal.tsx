import React, { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { eventsService } from '../src/services/api/endpoints/events.service';
import type { Event, EventRegistration } from '../src/types/models';

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  number_of_attendees: number;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  number_of_attendees?: string;
}

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    number_of_attendees: 1,
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<EventRegistration | null>(null);

  // Check if registration is disabled
  const isRegistrationDisabled = () => {
    if (event.is_full) return true;
    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      return new Date() > deadline;
    }
    return false;
  };

  const getDisabledReason = () => {
    if (event.is_full) return 'This event is full';
    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      if (new Date() > deadline) return 'Registration deadline has passed';
    }
    return '';
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.number_of_attendees < 1) {
      newErrors.number_of_attendees = 'Number of attendees must be at least 1';
    } else if (event.max_attendees) {
      const remainingSpots = event.max_attendees - event.attendee_count;
      if (formData.number_of_attendees > remainingSpots) {
        newErrors.number_of_attendees = `Only ${remainingSpots} spots remaining`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const registration = await eventsService.registerForEvent({
        event: event.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        number_of_attendees: formData.number_of_attendees,
        notes: formData.notes
      });

      setRegistrationData(registration);
      setSubmitSuccess(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error messages
      if (error.response?.data?.detail) {
        setSubmitError(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle field-specific errors
        const fieldErrors: FormErrors = {};
        Object.keys(error.response.data).forEach(key => {
          if (key in formData) {
            fieldErrors[key as keyof FormErrors] = Array.isArray(error.response.data[key])
              ? error.response.data[key][0]
              : error.response.data[key];
          }
        });
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          setSubmitError('Please correct the errors in the form');
        } else {
          setSubmitError('Registration failed. Please try again.');
        }
      } else {
        setSubmitError('Unable to complete registration. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_attendees' ? parseInt(value) || 1 : value
    }));
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Reset modal state
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        number_of_attendees: 1,
        notes: ''
      });
      setErrors({});
      setSubmitSuccess(false);
      setSubmitError(null);
      setRegistrationData(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {submitSuccess ? 'Registration Confirmed!' : 'Register for Event'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success State */}
          {submitSuccess && registrationData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <CheckCircle size={64} className="text-green-600" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  You're registered for {event.title}!
                </h3>
                <p className="text-slate-600">
                  A confirmation email has been sent to {registrationData.email}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                <h4 className="font-bold text-slate-900">Registration Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium">{registrationData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium">{registrationData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phone:</span>
                    <span className="font-medium">{registrationData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Attendees:</span>
                    <span className="font-medium">{registrationData.number_of_attendees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium capitalize">{registrationData.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Event Info */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-sm text-slate-600">
                  {new Date(event.start_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-slate-600 mt-1">{event.location}</p>
                {event.max_attendees && (
                  <p className="text-sm text-slate-600 mt-1">
                    {event.attendee_count} / {event.max_attendees} attendees registered
                  </p>
                )}
              </div>

              {/* Disabled State */}
              {isRegistrationDisabled() ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
                  <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Registration Unavailable</h4>
                    <p className="text-red-700 text-sm">{getDisabledReason()}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Error Message */}
                  {submitError && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="+233 123 456 789"
                        disabled={isSubmitting}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    {/* Number of Attendees Field */}
                    <div>
                      <label htmlFor="number_of_attendees" className="block text-sm font-medium text-slate-700 mb-2">
                        Number of Attendees <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        id="number_of_attendees"
                        name="number_of_attendees"
                        value={formData.number_of_attendees}
                        onChange={handleChange}
                        min="1"
                        max={event.max_attendees ? event.max_attendees - event.attendee_count : undefined}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.number_of_attendees ? 'border-red-500' : 'border-slate-300'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.number_of_attendees && (
                        <p className="mt-1 text-sm text-red-600">{errors.number_of_attendees}</p>
                      )}
                    </div>

                    {/* Notes Field */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Any special requirements or questions..."
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Registering...
                          </>
                        ) : (
                          'Register'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationModal;
