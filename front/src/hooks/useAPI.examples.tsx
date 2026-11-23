/**
 * Example usage patterns for useAPI and useMutation hooks
 * 
 * This file demonstrates various ways to use the custom API hooks
 * in React components for the Trinity Lutheran Church Ghana application.
 */

import React from 'react';
import { useAPI, useMutation } from './useAPI';
import { eventsService } from '../services/api/endpoints/events.service';
import { sermonsService } from '../services/api/endpoints/sermons.service';
import { churchService } from '../services/api/endpoints/church.service';

/**
 * Example 1: Basic usage with automatic fetch on mount
 */
export function EventsListExample() {
  const { data: events, loading, error, refetch } = useAPI(
    () => eventsService.getEvents(),
    [] // Empty dependencies - fetch once on mount
  );

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Events</button>
      <ul>
        {events?.results.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 2: Using with filters and dependencies
 * Refetches when eventType changes
 */
export function FilteredEventsExample() {
  const [eventType, setEventType] = React.useState<string>('');

  const { data: events, loading, error } = useAPI(
    () => eventsService.getEvents({ event_type: eventType }),
    [eventType] // Refetch when eventType changes
  );

  return (
    <div>
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="">All Events</option>
        <option value="conference">Conferences</option>
        <option value="workshop">Workshops</option>
      </select>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {events && (
        <ul>
          {events.results.map(event => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example 3: Manual fetch with immediate: false
 */
export function ManualFetchExample() {
  const [sermonId, setSermonId] = React.useState<number | null>(null);

  const { data: sermon, loading, error, refetch } = useAPI(
    () => sermonsService.getSermon(sermonId!),
    [sermonId],
    { immediate: false } // Don't fetch on mount
  );

  const handleLoadSermon = (id: number) => {
    setSermonId(id);
    refetch(); // Manually trigger fetch
  };

  return (
    <div>
      <button onClick={() => handleLoadSermon(1)}>Load Sermon 1</button>
      <button onClick={() => handleLoadSermon(2)}>Load Sermon 2</button>
      
      {loading && <div>Loading sermon...</div>}
      {error && <div>Error: {error.message}</div>}
      {sermon && (
        <div>
          <h2>{sermon.title}</h2>
          <p>{sermon.description}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Using with retry logic
 */
export function RetryExample() {
  const { data, loading, error, refetch, retryCount } = useAPI(
    () => churchService.getChurchInfo(),
    [],
    {
      retryAttempts: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
      onError: (err) => console.error('Failed after retries:', err),
    }
  );

  return (
    <div>
      {loading && <div>Loading... {retryCount > 0 && `(Retry ${retryCount})`}</div>}
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      )}
      {data && <div>{data.name}</div>}
    </div>
  );
}

/**
 * Example 5: Using with success/error callbacks
 */
export function CallbacksExample() {
  const [message, setMessage] = React.useState<string>('');

  const { data: events, loading, error } = useAPI(
    () => eventsService.getEvents(),
    [],
    {
      onSuccess: (data) => {
        setMessage(`Loaded ${data.count} events successfully!`);
      },
      onError: (err) => {
        setMessage(`Failed to load events: ${err.message}`);
      },
    }
  );

  return (
    <div>
      {message && <div className="notification">{message}</div>}
      {loading && <div>Loading...</div>}
      {events && <div>Total events: {events.count}</div>}
    </div>
  );
}

/**
 * Example 6: Using useMutation for form submissions
 */
export function EventRegistrationExample() {
  const [formData, setFormData] = React.useState({
    event: 1,
    name: '',
    email: '',
    phone: '',
    number_of_attendees: 1,
  });

  const { mutate, loading, error, data } = useMutation(
    (data) => eventsService.registerForEvent(data),
    {
      onSuccess: () => {
        alert('Registration successful!');
        // Reset form
        setFormData({
          event: 1,
          name: '',
          email: '',
          phone: '',
          number_of_attendees: 1,
        });
      },
      onError: (err) => {
        alert(`Registration failed: ${err.message}`);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate(formData);
    } catch (err) {
      // Error already handled by onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <div className="error">{error.message}</div>}
      {data && <div className="success">Registration ID: {data.id}</div>}
    </form>
  );
}

/**
 * Example 7: Using useMutation with retry logic
 */
export function ContactFormExample() {
  const { mutate, loading, error, reset } = useMutation(
    (data) => churchService.submitContactMessage(data),
    {
      retryAttempts: 2,
      retryDelay: 1000,
      onSuccess: () => {
        alert('Message sent successfully!');
        reset(); // Clear mutation state
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await mutate({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
        phone: '',
      });
    } catch (err) {
      // Error handled by onError or displayed via error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="subject" placeholder="Subject" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}

/**
 * Example 8: Combining multiple API calls
 */
export function DashboardExample() {
  const { data: churchInfo, loading: loadingChurch } = useAPI(
    () => churchService.getChurchInfo()
  );

  const { data: events, loading: loadingEvents } = useAPI(
    () => eventsService.getEvents({ is_featured: true })
  );

  const { data: sermons, loading: loadingSermons } = useAPI(
    () => sermonsService.getSermons({ is_featured: true })
  );

  const loading = loadingChurch || loadingEvents || loadingSermons;

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>{churchInfo?.name}</h1>
      <section>
        <h2>Featured Events</h2>
        <ul>
          {events?.results.map(event => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Featured Sermons</h2>
        <ul>
          {sermons?.results.map(sermon => (
            <li key={sermon.id}>{sermon.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/**
 * Example 9: Using reset functionality
 */
export function ResetExample() {
  const { data, loading, error, refetch, reset } = useAPI(
    () => eventsService.getEvents(),
    [],
    { immediate: false }
  );

  return (
    <div>
      <button onClick={refetch}>Load Events</button>
      <button onClick={reset}>Clear Data</button>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Loaded {data.count} events</div>}
    </div>
  );
}

/**
 * Example 10: Pagination with useAPI
 */
export function PaginatedEventsExample() {
  const [page, setPage] = React.useState(1);

  const { data, loading, error } = useAPI(
    () => eventsService.getEvents({ page }),
    [page]
  );

  return (
    <div>
      {loading && <div>Loading page {page}...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <>
          <ul>
            {data.results.map(event => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
          <div>
            <button 
              onClick={() => setPage(p => p - 1)} 
              disabled={!data.previous || loading}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={!data.next || loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
