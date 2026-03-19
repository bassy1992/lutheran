import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { eventsService } from '../src/services/api/endpoints/events.service';
import EventRegistrationModal from '../components/EventRegistrationModal';
import ShareButtons from '../components/ShareButtons';
import type { Event } from '../src/types/models';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: event, loading, error } = useAPI<Event>(
    () => eventsService.getEvent(Number(id)),
    [id]
  );

  useEffect(() => {
    if (event) {
      document.title = `${event.title} - Trinity Lutheran Church Ghana`;
    }
  }, [event]);

  const getEventTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      service: 'bg-blue-600',
      conference: 'bg-purple-600',
      workshop: 'bg-green-600',
      retreat: 'bg-orange-600',
      outreach: 'bg-pink-600',
      social: 'bg-yellow-600',
      other: 'bg-gray-600',
    };
    return colors[type] || 'bg-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    if (event.is_full) return false;
    if (event.registration_deadline) {
      return new Date() <= new Date(event.registration_deadline);
    }
    return true;
  };

  const getRegistrationStatus = () => {
    if (!event?.registration_required) return null;
    if (event.is_full) return { text: 'Event Full', color: 'text-red-600', bg: 'bg-red-50' };
    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return { text: 'Registration Closed', color: 'text-orange-600', bg: 'bg-orange-50' };
    }
    return { text: 'Registration Open', color: 'text-green-600', bg: 'bg-green-50' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">Event Not Found</h2>
          <p className="text-red-700 mb-6">
            {error?.message || 'The event you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const registrationStatus = getRegistrationStatus();

  return (
    <div className="w-full">
      {/* Hero Section with Image */}
      <section className="relative h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={event.image || `https://picsum.photos/seed/event-${event.id}/1920/1080`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 pb-12">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-medium transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Events
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`px-4 py-2 ${getEventTypeColor(
                event.event_type
              )} text-white rounded-lg text-sm font-bold uppercase tracking-wider`}
            >
              {event.event_type}
            </span>
            {event.is_featured && (
              <span className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg text-sm font-bold uppercase tracking-wider">
                Featured
              </span>
            )}
            {registrationStatus && (
              <span
                className={`px-4 py-2 ${registrationStatus.bg} ${registrationStatus.color} rounded-lg text-sm font-bold`}
              >
                {registrationStatus.text}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{formatDate(event.start_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>
                {formatTime(event.start_date)} - {formatTime(event.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Event</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Location Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Location</h2>
                <div className="flex items-start gap-3 text-slate-700">
                  <MapPin className="text-blue-600 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-lg">{event.location}</p>
                    <p className="text-slate-600 mt-1">{event.address}</p>
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Share This Event</h2>
                <ShareButtons
                  title={event.title}
                  description={event.description}
                  url={window.location.href}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              {event.registration_required && (
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Event Registration</h3>

                  {event.max_attendees && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Attendees</span>
                        <span>
                          {event.attendee_count} / {event.max_attendees}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            event.is_full ? 'bg-red-600' : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${Math.min(
                              (event.attendee_count / event.max_attendees) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        {event.is_full
                          ? 'Event is full'
                          : `${event.max_attendees - event.attendee_count} spots remaining`}
                      </p>
                    </div>
                  )}

                  {event.registration_deadline && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Registration Deadline</p>
                      <p className="font-semibold text-slate-900">
                        {formatDate(event.registration_deadline)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatTime(event.registration_deadline)}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!isRegistrationOpen()}
                    className="w-full px-6 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {event.is_full ? (
                      <>
                        <AlertCircle size={20} />
                        Event Full
                      </>
                    ) : event.registration_deadline &&
                      new Date() > new Date(event.registration_deadline) ? (
                      <>
                        <AlertCircle size={20} />
                        Registration Closed
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Register Now
                      </>
                    )}
                  </button>

                  {!event.is_full && isRegistrationOpen() && (
                    <p className="text-xs text-slate-500 text-center mt-3">
                      Free event • Registration required
                    </p>
                  )}
                </div>
              )}

              {/* Event Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-600 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-slate-600">Date</p>
                      <p className="font-semibold text-slate-900">{formatDate(event.start_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-blue-600 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-slate-600">Time</p>
                      <p className="font-semibold text-slate-900">
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-slate-600">Location</p>
                      <p className="font-semibold text-slate-900">{event.location}</p>
                    </div>
                  </div>

                  {event.max_attendees && (
                    <div className="flex items-start gap-3">
                      <Users className="text-blue-600 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-slate-600">Capacity</p>
                        <p className="font-semibold text-slate-900">
                          {event.max_attendees} attendees
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Events */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">More Events</h3>
                <Link
                  to="/events"
                  className="block w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-medium text-center transition-colors"
                >
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {event && (
        <EventRegistrationModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;
