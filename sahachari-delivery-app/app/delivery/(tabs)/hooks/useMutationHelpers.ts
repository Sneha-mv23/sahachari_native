import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface MutationErrorState {
  error: Error | null;
  retryCount: number;
  isRetrying: boolean;
}

/**
 * Hook to handle mutation errors with automatic retry logic
 * Provides better UX for failed operations with visual feedback
 */
export const useMutationWithErrorRecovery = (
  mutationFn: () => Promise<any>,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onRetry?: (retryCount: number) => void;
  },
) => {
  const [errorState, setErrorState] = useState<MutationErrorState>({
    error: null,
    retryCount: 0,
    isRetrying: false,
  });
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const maxRetries = options?.maxRetries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;

  const execute = useCallback(async () => {
    setIsPending(true);
    setErrorState({ error: null, retryCount: 0, isRetrying: false });

    try {
      const result = await mutationFn();
      setIsPending(false);
      options?.onSuccess?.();
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setErrorState({
        error: err,
        retryCount: 0,
        isRetrying: false,
      });
      setIsPending(false);
      options?.onError?.(err);
      throw err;
    }
  }, [mutationFn, options]);

  const retry = useCallback(async () => {
    if (errorState.retryCount >= maxRetries) {
      console.error('[Mutation] Max retries reached');
      return;
    }

    setErrorState((prev) => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1,
    }));

    options?.onRetry?.(errorState.retryCount + 1);

    // Delay before retry (with exponential backoff)
    const delay = retryDelay * Math.pow(2, errorState.retryCount);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const result = await mutationFn();
      setErrorState({ error: null, retryCount: 0, isRetrying: false });
      options?.onSuccess?.();
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setErrorState((prev) => ({
        ...prev,
        error: err,
        isRetrying: false,
      }));
      options?.onError?.(err);
    }
  }, [errorState.retryCount, maxRetries, mutationFn, retryDelay, options]);

  const reset = useCallback(() => {
    setErrorState({ error: null, retryCount: 0, isRetrying: false });
    setIsPending(false);
  }, []);

  return {
    execute,
    retry,
    reset,
    isPending,
    error: errorState.error,
    retryCount: errorState.retryCount,
    canRetry: errorState.retryCount < maxRetries,
    isRetrying: errorState.isRetrying,
  };
};

/**
 * Hook to manage optimistic updates with automatic rollback
 * Improves perceived performance while ensuring data consistency
 */
export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  const applyOptimisticUpdate = useCallback(
    <T,>(
      queryKey: any[],
      updater: (oldData: T) => T,
      onRollback?: (data: T) => void,
    ) => {
      // Get previous data for rollback
      const previousData = queryClient.getQueryData<T>(queryKey);

      // Apply optimistic update
      queryClient.setQueryData(queryKey, updater);

      return {
        previousData,
        rollback: () => {
          if (previousData !== undefined) {
            queryClient.setQueryData(queryKey, previousData);
            onRollback?.(previousData);
          }
        },
      };
    },
    [queryClient],
  );

  return { applyOptimisticUpdate };
};

/**
 * Hook to handle mutation state with loading, success, and error states
 */
export const useMutationState = () => {
  const [state, setState] = useState<{
    status: 'idle' | 'pending' | 'success' | 'error';
    data: any;
    error: Error | null;
  }>({
    status: 'idle',
    data: null,
    error: null,
  });

  const setLoading = () => setState((prev) => ({ ...prev, status: 'pending' }));
  const setSuccess = (data: any) =>
    setState({ status: 'success', data, error: null });
  const setError = (error: Error) =>
    setState({ status: 'error', data: null, error });
  const reset = () => setState({ status: 'idle', data: null, error: null });

  return {
    ...state,
    setLoading,
    setSuccess,
    setError,
    reset,
    isLoading: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
};
