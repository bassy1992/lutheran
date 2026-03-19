import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  RefreshCw,
  List,
  Grid3x3,
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { eventsService } from '../src/services/api/endpoints/events.service';
import type { Event } from '../src/types/models';

// Event type badge colors
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

const getEventTypeTextColor = (type: string): string => {
  const colors: Record<string, string> = {
    service: 'text-blue-600',
    conference: 'text-purple-600',
    workshop: 'text-green-600',
    retreat: 'text-orange-600',
    outreach: 'text-pink-600',
    social: 'text-yellow-600',
    other: 'text-gray-600',
  };
  return colors[type] || 'text-gray-600';
};

const getEventTypeBgColor = (type: string): string => {
  const colors: Record<string, string> = {
    service: 'bg-blue-50',
    conference: 'bg-purple-50',
    workshop: 'bg-green-50',
    retreat: 'bg-orange-50',
    outreach: 'bg-pink-50',
    social: 'bg-yellow-50',
    other: 'bg-gray-50',
  };
  return colors[type] || 'bg-gray-50';
};

// Error display component
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
    <div className="flex-1">
      <h3 className="font-bold text-red-900 mb-2">Unable to load events</h3>
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

// Calendar day cell component
interface CalendarDayProps {
  day: number | null;
  events: Event[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onDayClick: (day: number, events: Event[]) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  events,
  isToday,
  isCurrentMonth,
  onDayClick,
}) => {
  if (day === null) {
    return <div className="bg-slate-50 min-h-24"></div>;
  }

  return (
    <div
      onClick={() => onDayClick(day, events)}
      className={`min-h-24 p-2 border cursor-pointer transition-all hover:shadow-md ${
        isToday
          ? 'bg-blue-50 border-blue-300 border-2'
          : isCurrentMonth
            ? 'bg-white border-slate-200 hover:bg-slate-50'
            : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div
        className={`text-sm font-semibold mb-1 ${
          isToday
            ? 'text-blue-700'
            : isCurrentMonth
              ? 'text-slate-900'
              : 'text-slate-400'
        }`}
      >
        {day}
      </div>

      {events.length > 0 && (
        <div className="space-y-1">
          {events.slice(0, 2).map((event, idx) => (
            <div
              key={idx}
              className={`text-xs px-2 py-1 rounded ${getEventTypeColor(
                event.event_type
              )} text-white truncate`}
            >
              {event.title}
            </div>
          ))}
          {events.length > 2 && (
            <div className="text-xs px-2 py-1 text-slate-600 font-medium">
              +{events.length - 2} more
            </div>
          )}
        </div>
      )}

      {events.length === 0 && isCurrentMonth && (
        <div className="text-xs text-slate-400">No events</div>
      )}
    </div>
  );
};

// List view component
interface EventListViewProps {
  events: Event[];
  selectedDate: { day: number; events: Event[] } | null;
  onDateSelect: (day: number, events: Event[]) => void;
}

const EventListView: React.FC<EventListViewProps> = ({
  events,
  selectedDate,
  onDateSelect,
}) => {
  const displayEvents = selectedDate ? selectedDate.events : events;

  return (
    <div className="space-y-4">
      {selectedDate && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-600">
            Showing {displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-slate-900">
              {new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                selectedDate.day
              ).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
          <button
            onClick={() => onDateSelect(0, [])}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all events
          </button>
        </div>
      )}

      {displayEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {selectedDate ? 'No events on this day' : 'No events scheduled'}
          </h3>
          <p className="text-slate-600">
            {selectedDate
              ? 'Try selecting another date'
              : 'Check back soon for upcoming events!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 border-l-4 rounded-lg ${getEventTypeBgColor(
                event.event_type
              )} border-l-${getEventTypeColor(event.event_type).split('-')[1]}-600`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded uppercase ${getEventTypeColor(
                        event.event_type
                      )} text-white`}
                    >
                      {event.event_type}
                    </span>
                    {event.is_full && (
                      <span className="px-2 py-1 text-xs font-bold rounded uppercase bg-red-600 text-white">
                        Full
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">{event.description}</p>

                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="shrink-0" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main calendar component
const EventCalendarPage: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    events: Event[];
  } | null>(null);

  // Fetch calendar events
  const { data: calendarData, loading, error, refetch } = useAPI(
    () =>
      eventsService.getCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1),
    [currentDate.getFullYear(), currentDate.getMonth()]
  );

  // Parse calendar data into a map
  const eventsByDate = useMemo(() => {
    if (!calendarData) return new Map<number, Event[]>();

    const map = new Map<number, Event[]>();
    
    // Handle both response formats
    if (Array.isArray(calendarData)) {
      // If it's an array of days (new format)
      calendarData.forEach((dayData: any) => {
        const date = new Date(dayData.date);
        const day = date.getDate();
        map.set(day, dayData.events || []);
      });
    } else if (calendarData.days) {
      // If it has a days property (backend format)
      calendarData.days.forEach((dayData: any) => {
        const date = new Date(dayData.date);
        const day = date.getDate();
        map.set(day, dayData.events || []);
      });
    } else {
      // If it's a direct object mapping dates to events
      Object.entries(calendarData).forEach(([dateStr, events]: [string, any]) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        map.set(day, events);
      });
    }
    
    return map;
  }, [calendarData]);

  // Get all events for list view
  const allEvents = useMemo(() => {
    return Array.from(eventsByDate.values()).flat();
  }, [eventsByDate]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  const handleDayClick = (day: number, events: Event[]) => {
    setSelectedDate({ day, events });
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/calendar-hero/1920/600"
            alt="Event Calendar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">Event Calendar</h1>
            <p className="text-xl text-slate-200">
              View all church events at a glance
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Header with controls */}
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-slate-900">{monthName}</h2>

            <div className="flex items-center gap-4">
              {/* View toggle */}
              <div className="flex gap-2 bg-white border border-slate-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Calendar view"
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="List view"
                >
                  <List size={20} />
                </button>
              </div>

              {/* Month navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-8">
              <ErrorDisplay
                message={error.message || 'Failed to load events'}
                onRetry={refetch}
              />
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                <div className="grid grid-cols-7 gap-4">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Calendar view */}
          {!loading && !error && viewMode === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center font-bold text-slate-900"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => (
                  <CalendarDay
                    key={idx}
                    day={day}
                    events={day ? eventsByDate.get(day) || [] : []}
                    isToday={day ? isToday(day) : false}
                    isCurrentMonth={day !== null}
                    onDayClick={handleDayClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* List view */}
          {!loading && !error && viewMode === 'list' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <EventListView
                events={allEvents}
                selectedDate={selectedDate}
                onDateSelect={handleDayClick}
              />
            </div>
          )}

          {/* Legend */}
          {!loading && !error && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-slate-900 mb-4">Event Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { type: 'service', label: 'Service' },
                  { type: 'conference', label: 'Conference' },
                  { type: 'workshop', label: 'Workshop' },
                  { type: 'retreat', label: 'Retreat' },
                  { type: 'outreach', label: 'Outreach' },
                  { type: 'social', label: 'Social' },
                ].map(({ type, label }) => (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${getEventTypeColor(type)}`}
                    ></div>
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventCalendarPage;
