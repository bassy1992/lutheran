import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft, 
  AlertCircle, 
  Loader2,
  CheckCircle,
  UserPlus,
  MapPin,
  Clock
} from 'lucide-react';
import { ministriesService } from '../src/services/api/endpoints/ministries.service';
import { eventsService } from '../src/services/api/endpoints/events.service';
import type { Ministry, Event } from '../src/types/models';

const MinistryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    city: ''
  });

  useEffect(() => {
    const fetchMinistry = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await ministriesService.getMinistry(parseInt(id));
        setMinistry(data);
      } catch (err: any) {
        console.error('Error fetching ministry:', err);
        setError(err.response?.data?.detail || 'Failed to load ministry details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!id) return;
      
      try {
        setEventsLoading(true);
        const response = await eventsService.getEvents({ ministry: parseInt(id) });
        setEvents(response.results || []);
      } catch (err: any) {
        console.error('Error fetching events:', err);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ministry) return;

    try {
      setRegistrationLoading(true);
      setErrorMessage(null);
      
      const registrationData = {
        ...formData,
        date_of_birth: formData.date_of_birth || undefined
      };
      
      const response = await ministriesService.register(ministry.id, registrationData);
      setSuccessMessage(response.message);
      setShowRegistrationForm(false);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        city: ''
      });
      
      // Refresh ministry data to update member count
      const updatedMinistry = await ministriesService.getMinistry(ministry.id);
      setMinistry(updatedMinistry);
      
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error registering:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to register. Please try again.';
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-700 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Unable to Load Ministry</h2>
          <p className="text-slate-600 mb-6">{error || 'Ministry not found'}</p>
          <button
            onClick={() => navigate('/ministries')}
            className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all"
          >
            Back to Ministries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8">
        <button
          onClick={() => navigate('/ministries')}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Ministries
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-96 mb-12">
        {(ministry.image_display_url || ministry.image) ? (
          <img
            src={ministry.image_display_url || ministry.image || ''}
            alt={ministry.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Users className="w-32 h-32 text-white opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{ministry.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{ministry.member_count} {ministry.member_count === 1 ? 'member' : 'members'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">About This Ministry</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{ministry.description}</p>
              </div>

              {/* Ministry Events */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                {eventsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <Link
                        key={event.id}
                        to={`/events/${event.id}`}
                        className="block p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="flex gap-4">
                          {event.image_display_url && (
                            <img
                              src={event.image_display_url}
                              alt={event.title}
                              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{event.title}</h3>
                            <div className="space-y-1 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>{new Date(event.start_date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span>{new Date(event.start_date).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit' 
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No upcoming events for this ministry.</p>
                )}
              </div>

              {/* Registration Form */}
              {!showRegistrationForm ? (
                <button
                  onClick={() => setShowRegistrationForm(true)}
                  className="w-full bg-blue-700 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Join This Ministry
                </button>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6">Ministry Registration</h3>
                  <form onSubmit={handleSubmitRegistration} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowRegistrationForm(false)}
                        disabled={registrationLoading}
                        className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-full font-bold hover:bg-slate-300 transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={registrationLoading}
                        className="flex-1 bg-blue-700 text-white py-3 rounded-full font-bold hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {registrationLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          'Register'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leader Card */}
              {ministry.leader && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Ministry Leader</h3>
                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-slate-900">{ministry.leader.full_name}</p>
                    
                    {ministry.leader.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <a
                          href={`mailto:${ministry.leader.email}`}
                          className="text-slate-600 hover:text-blue-700 transition-colors break-all"
                        >
                          {ministry.leader.email}
                        </a>
                      </div>
                    )}
                    
                    {ministry.leader.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <a
                          href={`tel:${ministry.leader.phone}`}
                          className="text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          {ministry.leader.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Members</span>
                    <span className="font-bold text-slate-900">{ministry.member_count}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Status</span>
                    <span className="font-bold text-green-600">Active</span>
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

export default MinistryDetail;
