import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds until a query becomes stale
        staleTime: 1000 * 60 * 5, // 5 minutes

        // Time in milliseconds until inactive data is removed from cache
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)

        // Number of times to retry a request before throwing an error
        retry: 2,

        // Delay between retries in milliseconds
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Whether to refetch when window is focused
        refetchOnWindowFocus: true,

        // Whether to refetch on reconnect
        refetchOnReconnect: true,

        // Whether to refetch when component mounts and data is stale
        refetchOnMount: true,

        // Network status based refetch behavior
        networkMode: 'always',
      },
      mutations: {
        // Network status based mutation behavior
        networkMode: 'always',
      },
    },
  });

export const queryClient = createQueryClient();

