# Custom React Hooks for API Calls

This directory contains custom React hooks for managing API calls with comprehensive state management, error handling, and retry logic.

## Hooks

### `useAPI<T>`

A generic hook for fetching data from API endpoints with automatic state management.

#### Features

- ✅ Automatic loading, error, and data state management
- ✅ Automatic fetch on component mount (configurable)
- ✅ Dependency-based refetching
- ✅ Manual refetch functionality
- ✅ Retry logic with exponential backoff
- ✅ Success and error callbacks
- ✅ Request cancellation on unmount
- ✅ Reset functionality

#### Basic Usage

```tsx
import { useAPI } from '@/hooks';
import { eventsService } from '@/services/api/endpoints/events.service';

function EventsList() {
  const { data, loading, error, refetch } = useAPI(
    () => eventsService.getEvents(),
    [] // Dependencies
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data?.results.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### With Options

```tsx
const { data, loading, error, retryCount } = useAPI(
  () => churchService.getChurchInfo(),
  [],
  {
    immediate: true,           // Fetch on mount (default: true)
    retryAttempts: 3,          // Number of retry attempts (default: 0)
    retryDelay: 1000,          // Delay between retries in ms (default: 1000)
    exponentialBackoff: true,  // Use exponential backoff (default: true)
    onSuccess: (data) => {
      console.log('Success!', data);
    },
    onError: (error) => {
      console.error('Failed!', error);
    },
  }
);
```

#### API Reference

**Parameters:**
- `apiCall: () => Promise<T>` - Function that returns a Promise with the API response
- `dependencies: any[]` - Array of dependencies that trigger a refetch when changed (default: `[]`)
- `options: UseAPIOptions` - Configuration options (optional)

**Returns:**
- `data: T | null` - The data returned from the API call
- `loading: boolean` - Loading state indicator
- `error: Error | null` - Error object if the API call failed
- `refetch: () => Promise<void>` - Function to manually trigger the API call
- `reset: () => void` - Function to reset the hook state
- `retryCount: number` - Current retry attempt number

### `useMutation<TData, TVariables>`

A hook for API mutations (POST, PUT, DELETE operations) that doesn't execute immediately.

#### Features

- ✅ Manual execution (user-triggered)
- ✅ Loading, error, and data state management
- ✅ Retry logic with exponential backoff
- ✅ Success and error callbacks
- ✅ Reset functionality
- ✅ TypeScript support for variables and return types

#### Basic Usage

```tsx
import { useMutation } from '@/hooks';
import { eventsService } from '@/services/api/endpoints/events.service';

function EventRegistrationForm() {
  const { mutate, loading, error, data } = useMutation(
    (formData) => eventsService.registerForEvent(formData),
    {
      onSuccess: () => {
        alert('Registration successful!');
      },
      onError: (err) => {
        alert(`Registration failed: ${err.message}`);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate({
        event: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+233123456789',
        number_of_attendees: 1,
      });
    } catch (err) {
      // Error already handled by onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error.message}</div>}
      {data && <div className="success">Success! ID: {data.id}</div>}
    </form>
  );
}
```

#### API Reference

**Parameters:**
- `mutationFn: (variables: TVariables) => Promise<TData>` - Function that accepts variables and returns a Promise
- `options: UseAPIOptions` - Configuration options (optional)

**Returns:**
- `mutate: (variables: TVariables) => Promise<TData | undefined>` - Function to execute the mutation
- `data: TData | null` - The data returned from the mutation
- `loading: boolean` - Loading state indicator
- `error: Error | null` - Error object if the mutation failed
- `reset: () => void` - Function to reset the hook state
- `retryCount: number` - Current retry attempt number

## Options

### `UseAPIOptions`

Configuration options for both `useAPI` and `useMutation` hooks.

```typescript
interface UseAPIOptions {
  immediate?: boolean;           // Execute on mount (useAPI only, default: true)
  retryAttempts?: number;        // Number of retry attempts (default: 0)
  retryDelay?: number;           // Delay between retries in ms (default: 1000)
  exponentialBackoff?: boolean;  // Use exponential backoff (default: true)
  onSuccess?: (data: any) => void;  // Success callback
  onError?: (error: Error) => void; // Error callback
}
```

## Common Patterns

### 1. Fetch on Mount

```tsx
const { data, loading, error } = useAPI(
  () => eventsService.getEvents()
);
```

### 2. Fetch with Dependencies

```tsx
const [eventType, setEventType] = useState('conference');

const { data, loading, error } = useAPI(
  () => eventsService.getEvents({ event_type: eventType }),
  [eventType] // Refetch when eventType changes
);
```

### 3. Manual Fetch

```tsx
const { data, loading, error, refetch } = useAPI(
  () => eventsService.getEvents(),
  [],
  { immediate: false } // Don't fetch on mount
);

// Later...
<button onClick={refetch}>Load Events</button>
```

### 4. Form Submission

```tsx
const { mutate, loading, error } = useMutation(
  (formData) => contactService.submitMessage(formData)
);

const handleSubmit = async (formData) => {
  await mutate(formData);
};
```

### 5. With Retry Logic

```tsx
const { data, loading, error, retryCount } = useAPI(
  () => churchService.getChurchInfo(),
  [],
  {
    retryAttempts: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
  }
);
```

### 6. With Callbacks

```tsx
const { data, loading, error } = useAPI(
  () => eventsService.getEvents(),
  [],
  {
    onSuccess: (data) => {
      console.log('Loaded events:', data);
      // Update analytics, show notification, etc.
    },
    onError: (error) => {
      console.error('Failed to load events:', error);
      // Log to error tracking service
    },
  }
);
```

### 7. Pagination

```tsx
const [page, setPage] = useState(1);

const { data, loading } = useAPI(
  () => eventsService.getEvents({ page }),
  [page]
);

// Navigate pages
<button onClick={() => setPage(p => p - 1)}>Previous</button>
<button onClick={() => setPage(p => p + 1)}>Next</button>
```

### 8. Search with Debouncing

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

// Debounce search term
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);

const { data, loading } = useAPI(
  () => eventsService.getEvents({ search: debouncedSearch }),
  [debouncedSearch]
);
```

## Error Handling

The hooks provide multiple ways to handle errors:

### 1. Using Error State

```tsx
const { data, loading, error } = useAPI(() => api.getData());

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### 2. Using onError Callback

```tsx
const { data, loading } = useAPI(
  () => api.getData(),
  [],
  {
    onError: (error) => {
      // Log to error tracking service
      console.error('API Error:', error);
      // Show toast notification
      toast.error(error.message);
    },
  }
);
```

### 3. Try-Catch with Mutations

```tsx
const { mutate } = useMutation((data) => api.submitData(data));

try {
  await mutate(formData);
} catch (error) {
  // Handle error
  console.error(error);
}
```

## Best Practices

1. **Use appropriate dependencies**: Include all values used in the API call that should trigger a refetch when changed.

2. **Handle loading states**: Always show loading indicators to improve user experience.

3. **Provide error feedback**: Display user-friendly error messages and offer retry options.

4. **Use immediate: false for manual triggers**: When the API call should only happen on user action.

5. **Implement retry logic for critical data**: Use retry options for important data that must be loaded.

6. **Clean up on unmount**: The hooks automatically handle cleanup, but be aware of async operations.

7. **Use TypeScript types**: Provide generic types for better type safety and autocomplete.

8. **Combine with React Query for advanced caching**: For more complex caching needs, consider using React Query alongside these hooks.

## Examples

See `useAPI.examples.tsx` for comprehensive usage examples including:
- Basic data fetching
- Filtered lists
- Manual fetch
- Retry logic
- Form submissions
- Multiple API calls
- Pagination
- And more!

## Requirements Fulfilled

This implementation fulfills the following requirements from the spec:

- **Requirement 1**: API Service Layer - Provides consistent API communication with state management
- **Requirement 29**: Error Handling and User Feedback - Comprehensive error handling with user-friendly feedback

## Related Files

- `src/services/api/client.ts` - API client with interceptors
- `src/services/api/endpoints/*.service.ts` - Service endpoint implementations
- `src/types/models.ts` - TypeScript interfaces for API models
