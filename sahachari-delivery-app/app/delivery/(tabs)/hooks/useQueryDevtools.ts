import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Hook for React Query DevTools integration
 * This helps debug queries and mutations in development
 * Install with: npm install --save-dev @react-query/devtools
 */
export const useQueryDevtools = (enabled: boolean = __DEV__) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // Log all query state changes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated') {
        console.log('[Query Updated]', event.query.queryKey, event.query.state);
      }
    });

    return () => unsubscribe();
  }, [queryClient, enabled]);

  return queryClient;
};

/**
 * Utility function to get all query keys and their cache status
 */
export const getQueryCacheStatus = (queryClient: ReturnType<typeof useQueryClient>) => {
  const queries = queryClient.getQueryCache().getAll();
  return queries.map((query) => ({
    key: query.queryKey,
    state: query.state.status,
    dataUpdatedAt: query.state.dataUpdatedAt,
    errorUpdatedAt: query.state.errorUpdatedAt,
  }));
};
