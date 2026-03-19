import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { churchService } from '../src/services/api/endpoints/church.service';
import type { ChurchInfo } from '../src/types/models';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: churchInfo } = useAPI<ChurchInfo>(() => churchService.getChurchInfo());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate form submission (you can implement actual API call later)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/HERO.jpeg"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">Get in Touch</h1>
            <p className="text-xl text-slate-200">
              We'd love to hear from you. Reach out with any questions or prayer requests.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
              <p className="text-slate-600 mb-8">
                Have a prayer request? Want to join a ministry? Or just have a question? Fill out the form below.
              </p>

              {submitSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-green-800">Your message has been sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-red-800">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Physical Location */}
              <div className="bg-slate-900 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Visit Our Sanctuary</h2>
                
                <div className="aspect-video w-full bg-slate-800 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7537!2d-0.1893!3d5.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xd5e34c06b67c4e0e!2sLutheran%20Church%20Of%20Ghana%20-%20Trinity%20Congregation%20Tema!5e0!3m2!1sen!2sgh!4v1710000000000!5m2!1sen!2sgh"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Church Location"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <MapPin size={20} />
                      Physical Address
                    </h3>
                    <p className="text-slate-300">Plot 14, Independence Avenue</p>
                    <p className="text-slate-300">Ridge, Accra, Ghana</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <Mail size={20} />
                      Mailing Address
                    </h3>
                    <p className="text-slate-300">{churchInfo?.address || 'P.O BOX CO 143, Cocoa Village'}</p>
                    <p className="text-slate-300">{churchInfo?.city || 'Tema'}, {churchInfo?.country || 'Ghana'}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <Clock size={20} />
                      Office Hours
                    </h3>
                    <p className="text-slate-300">Monday - Friday</p>
                    <p className="text-slate-300">9:00 AM - 5:00 PM</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <Phone size={20} />
                      Phone
                    </h3>
                    <p className="text-slate-300">+233 20 123 4567</p>
                    <p className="text-slate-300">{churchInfo?.phone || '+233 24 130 3374'}</p>
                    <p className="text-slate-300">+233 27 741 6250</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <Mail size={20} />
                      Email
                    </h3>
                    <a
                      href={`mailto:${churchInfo?.email || 'info@trinitylutheranghana.org'}`}
                      className="text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      {churchInfo?.email || 'info@trinitylutheranghana.org'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Service Times */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Service Times</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="font-medium text-slate-900">Sunday Worship</span>
                    <span className="text-blue-700 font-bold">8:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="font-medium text-slate-900">Bible Study</span>
                    <span className="text-blue-700 font-bold">Wed 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">Prayer Meeting</span>
                    <span className="text-blue-700 font-bold">Fri 7:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
