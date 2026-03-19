import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { membersService } from '../../src/services/api/endpoints';
import { AlertCircle, Loader, Calendar } from 'lucide-react';
import type { EventRegistration } from '../../src/types/models';

interface EventsResponse {
  count: number;
  page: number;
  page_size: number;
  results: EventRegistration[];
}

const MemberEvents: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await membersService.getEvents({ page, page_size: pageSize });
        setEvents(data.results || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, navigate, page]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Event Registrations</h1>
        <p className="text-slate-600">View your registered events at Trinity Lutheran Church</p>
      </div>

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

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Registrations</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalCount}</p>
          </div>
          <Calendar className="text-blue-600" size={40} />
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.length > 0 ? (
          <>
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Event Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{event.name}</h3>
                    <div className="space-y-2 text-slate-600">
                      <p>
                        <span className="font-semibold">Email:</span> {event.email}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span> {event.phone}
                      </p>
                      <p>
                        <span className="font-semibold">Attendees:</span> {event.number_of_attendees}
                      </p>
                      {event.notes && (
                        <p>
                          <span className="font-semibold">Notes:</span> {event.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status and Date */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium mb-2">Status</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        event.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium mb-2">Registered</p>
                      <p className="text-slate-900 font-semibold">
                        {new Date(event.registered_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-slate-600 mb-4">No event registrations yet</p>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/member')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MemberEvents;
