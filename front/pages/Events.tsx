import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { eventsService } from '../src/services/api/endpoints/events.service';
import EventRegistrationModal from '../components/EventRegistrationModal';
import ShareButtons from '../components/ShareButtons';
import { setMetaTags, resetMetaTags } from '../src/utils/metaTags';
import type { Event, PaginatedResponse } from '../src/types/models';

// Skeleton loader for event cards
const SkeletonEventCard = () => (
  <div className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-40 md:h-48 bg-slate-200"></div>
    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="h-3 md:h-4 bg-slate-200 rounded w-20"></div>
      <div className="h-4 md:h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="space-y-1.5 md:space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 md:gap-3">
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

// Error display component
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-4 md:p-6 flex items-start gap-3 md:gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-0.5 md:mt-1" size={20} />
    <div className="flex-1">
      <h3 className="font-bold text-sm md:text-base text-red-900 mb-1 md:mb-2">Unable to load events</h3>
      <p className="text-red-700 text-xs md:text-sm mb-3 md:mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw size={14} className="md:w-4 md:h-4" />
        Try Again
      </button>
    </div>
  </div>
);

// Event type options
const EVENT_TYPES = [
  { value: '', label: 'All Events' },
  { value: 'service', label: 'Service' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'retreat', label: 'Retreat' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' }
];

// Event type badge colors
const getEventTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    service: 'bg-blue-600',
    conference: 'bg-purple-600',
    workshop: 'bg-green-600',
    retreat: 'bg-orange-600',
    outreach: 'bg-pink-600',
    social: 'bg-yellow-600',
    other: 'bg-gray-600'
  };
  return colors[type] || 'bg-gray-600';
};

const Events: React.FC = () => {
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set meta tags for events page
  useEffect(() => {
    setMetaTags({
      title: 'Events - Trinity Lutheran Church Ghana',
      description: 'Discover upcoming church events including services, conferences, workshops, and community gatherings at Trinity Lutheran Church Ghana.',
      type: 'website'
    });

    return () => {
      resetMetaTags();
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch events with filters
  const { 
    data: eventsResponse, 
    loading, 
    error,
    refetch 
  } = useAPI<PaginatedResponse<Event>>(
    () => eventsService.getEvents({
      page,
      event_type: eventType || undefined,
      search: debouncedSearch || undefined
    }),
    [page, eventType, debouncedSearch]
  );

  const events = eventsResponse?.results || [];
  const totalPages = eventsResponse ? Math.ceil(eventsResponse.count / 10) : 1;

  // Debug logging
  useEffect(() => {
    console.log('=== Events Debug ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Events Response:', eventsResponse);
    console.log('Events Array:', events);
    console.log('Events Count:', events.length);
    
    if (!loading && !error && eventsResponse) {
      console.log('✅ Events loaded successfully!');
      console.log('Full event data:', eventsResponse.results);
    }
  }, [loading, error, eventsResponse, events]);

  // Handle filter changes
  const handleEventTypeChange = (type: string) => {
    setEventType(type);
    setPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    // Refetch events to update attendee count
    refetch();
  };

  return (
    <div className="w-full">
      {/* Compact Hero Section */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="Church Events" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-2 md:space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Church Events</h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-200">
              Join us for worship, fellowship, and community gatherings
            </p>
          </div>
        </div>
      </section>

      {/* Compact Filters Section */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-sm md:text-base border border-slate-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Event Type Filter */}
            <div className="relative min-w-[140px] md:min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select
                value={eventType}
                onChange={(e) => handleEventTypeChange(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-sm md:text-base border border-slate-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(eventType || debouncedSearch) && (
            <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2 items-center">
              <span className="text-xs md:text-sm text-slate-600">Filters:</span>
              {eventType && (
                <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] md:text-xs font-medium">
                  {EVENT_TYPES.find(t => t.value === eventType)?.label}
                  <button
                    onClick={() => handleEventTypeChange('')}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] md:text-xs font-medium">
                  "{debouncedSearch}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-6 md:py-8 lg:py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Results Count */}
          {!loading && eventsResponse && (
            <div className="mb-4 md:mb-6 text-xs md:text-sm text-slate-600">
              Showing {events.length > 0 ? ((page - 1) * 10 + 1) : 0} - {Math.min(page * 10, eventsResponse.count)} of {eventsResponse.count} events
            </div>
          )}

          {/* Error State */}
          {error && (
            <ErrorDisplay 
              message={error.message || 'Failed to load events'}
              onRetry={refetch}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonEventCard key={i} />
              ))}
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {events.map((event) => (
                <div key={event.id} className="group bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-slate-100">
                  {/* Event Image */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img 
                      src={event.image || `https://picsum.photos/seed/event-${event.id}/600/400`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 md:px-2.5 md:py-1 ${getEventTypeColor(event.event_type)} text-white rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider`}>
                        {event.event_type}
                      </span>
                    </div>
                    {event.is_full && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-red-600 text-white rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                          Full
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs md:text-sm line-clamp-2 leading-snug">
                      {event.description}
                    </p>

                    <div className="space-y-1 md:space-y-1.5 text-[10px] md:text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      {event.max_attendees && (
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                          <span>
                            {event.attendee_count} / {event.max_attendees} attendees
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Share Buttons - Compact */}
                    <div className="py-2 md:py-3 border-t border-slate-200">
                      <ShareButtons
                        title={event.title}
                        description={event.description}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {event.registration_required && (
                        <button
                          onClick={() => handleRegisterClick(event)}
                          disabled={event.is_full || (event.registration_deadline && new Date() > new Date(event.registration_deadline))}
                          className="flex-1 px-3 py-2 md:py-2.5 text-xs md:text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                          {event.is_full 
                            ? 'Full' 
                            : (event.registration_deadline && new Date() > new Date(event.registration_deadline))
                              ? 'Closed'
                              : 'Register'}
                        </button>
                      )}
                      <Link
                        to={`/events/${event.id}`}
                        className={`${event.registration_required ? 'flex-1' : 'w-full'} inline-block text-center px-3 py-2 md:py-2.5 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold transition-colors`}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Calendar size={32} className="md:w-12 md:h-12 text-slate-300" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">No events found</h3>
              <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6">
                {debouncedSearch || eventType 
                  ? 'Try adjusting your filters to see more events.'
                  : 'Check back soon for upcoming events!'}
              </p>
              {(debouncedSearch || eventType) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setEventType('');
                  }}
                  className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-blue-700 hover:bg-blue-800 text-white rounded-lg md:rounded-xl font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && events.length > 0 && totalPages > 1 && (
            <div className="mt-8 md:mt-12 flex justify-center items-center gap-1.5 md:gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 md:p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} className="md:w-5 md:h-5" />
              </button>

              <div className="flex gap-1 md:gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-700 text-white'
                          : 'border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 md:p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Events;
