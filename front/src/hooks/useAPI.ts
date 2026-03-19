import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Configuration options for the useAPI hook
 */
export interface UseAPIOptions {
  /**
   * Whether to execute the API call immediately on mount
   * @default true
   */
  immediate?: boolean;
  
  /**
   * Number of retry attempts on failure
   * @default 0
   */
  retryAttempts?: number;
  
  /**
   * Delay between retry attempts in milliseconds
   * @default 1000
   */
  retryDelay?: number;
  
  /**
   * Whether to use exponential backoff for retries
   * @default true
   */
  exponentialBackoff?: boolean;
  
  /**
   * Callback function called on successful API call
   */
  onSuccess?: (data: any) => void;
  
  /**
   * Callback function called on API call error
   */
  onError?: (error: Error) => void;
}

/**
 * State returned by the useAPI hook
 */
export interface UseAPIState<T> {
  /**
   * The data returned from the API call
   */
  data: T | null;
  
  /**
   * Loading state indicator
   */
  loading: boolean;
  
  /**
   * Error object if the API call failed
   */
  error: Error | null;
  
  /**
   * Function to manually trigger the API call
   */
  refetch: () => Promise<void>;
  
  /**
   * Function to reset the hook state
   */
  reset: () => void;
  
  /**
   * Current retry attempt number
   */
  retryCount: number;
}

/**
 * Custom React hook for managing API calls with loading, error, and data state
 * 
 * @template T - The type of data returned by the API call
 * @param apiCall - Function that returns a Promise with the API response
 * @param dependencies - Array of dependencies that trigger a refetch when changed
 * @param options - Configuration options for the hook
 * @returns Object containing data, loading, error states and utility functions
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useAPI(
 *   () => eventsService.getEvents(),
 *   [],
 *   { retryAttempts: 3 }
 * );
 * ```
 */
export function useAPI<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAPIOptions = {}
): UseAPIState<T> {
  const {
    immediate = true,
    retryAttempts = 0,
    retryDelay = 1000,
    exponentialBackoff = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Calculate delay for retry with optional exponential backoff
   */
  const getRetryDelay = useCallback((attempt: number): number => {
    if (exponentialBackoff) {
      return retryDelay * Math.pow(2, attempt);
    }
    return retryDelay;
  }, [retryDelay, exponentialBackoff]);

  /**
   * Execute the API call with retry logic
   */
  const executeAPICall = useCallback(async (attempt: number = 0): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (isMountedRef.current) {
        setData(result);
        setRetryCount(0);
        onSuccess?.(result);
      }
    } catch (err) {
      const error = err as Error;
      
      // Check if we should retry
      if (attempt < retryAttempts && isMountedRef.current) {
        const delay = getRetryDelay(attempt);
        setRetryCount(attempt + 1);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the API call
        if (isMountedRef.current) {
          return executeAPICall(attempt + 1);
        }
      } else {
        // No more retries or component unmounted
        if (isMountedRef.current) {
          setError(error);
          setRetryCount(0);
          onError?.(error);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall, retryAttempts, getRetryDelay, onSuccess, onError]);

  /**
   * Refetch function to manually trigger the API call
   */
  const refetch = useCallback(async (): Promise<void> => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    await executeAPICall(0);
  }, [executeAPICall]);

  /**
   * Reset function to clear all state
   */
  const reset = useCallback((): void => {
    setData(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  /**
   * Execute API call on mount if immediate is true
   */
  useEffect(() => {
    if (immediate) {
      executeAPICall(0);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
    retryCount,
  };
}

/**
 * Custom hook for API mutations (POST, PUT, DELETE operations)
 * Unlike useAPI, this doesn't execute immediately and is designed for user-triggered actions
 * 
 * @template TData - The type of data returned by the API call
 * @template TVariables - The type of variables passed to the mutation function
 * @param mutationFn - Function that accepts variables and returns a Promise
 * @param options - Configuration options for the hook
 * @returns Object containing mutation state and execute function
 * 
 * @example
 * ```tsx
 * const { mutate, loading, error, data } = useMutation(
 *   (formData) => eventsService.registerForEvent(formData),
 *   { onSuccess: () => console.log('Registered!') }
 * );
 * 
 * // Later in your component
 * await mutate({ event: 1, name: 'John', email: 'john@example.com' });
 * ```
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseAPIOptions = {}
) {
  const {
    retryAttempts = 0,
    retryDelay = 1000,
    exponentialBackoff = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Calculate delay for retry with optional exponential backoff
   */
  const getRetryDelay = useCallback((attempt: number): number => {
    if (exponentialBackoff) {
      return retryDelay * Math.pow(2, attempt);
    }
    return retryDelay;
  }, [retryDelay, exponentialBackoff]);

  /**
   * Execute the mutation with retry logic
   */
  const executeMutation = useCallback(async (
    variables: TVariables,
    attempt: number = 0
  ): Promise<TData | undefined> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mutationFn(variables);
      
      if (isMountedRef.current) {
        setData(result);
        setRetryCount(0);
        onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      const error = err as Error;
      
      // Check if we should retry
      if (attempt < retryAttempts && isMountedRef.current) {
        const delay = getRetryDelay(attempt);
        setRetryCount(attempt + 1);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the mutation
        if (isMountedRef.current) {
          return executeMutation(variables, attempt + 1);
        }
      } else {
        // No more retries or component unmounted
        if (isMountedRef.current) {
          setError(error);
          setRetryCount(0);
          onError?.(error);
        }
        throw error;
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [mutationFn, retryAttempts, getRetryDelay, onSuccess, onError]);

  /**
   * Reset function to clear all state
   */
  const reset = useCallback((): void => {
    setData(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    mutate: executeMutation,
    data,
    loading,
    error,
    reset,
    retryCount,
  };
}
