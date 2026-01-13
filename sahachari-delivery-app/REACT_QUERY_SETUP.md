# React Query Setup Documentation

## Overview

This delivery app uses **TanStack React Query (v5)** for comprehensive server state management. React Query handles:

- **Data fetching** from the backend API
- **Caching** and automatic refetching
- **Synchronization** across the app
- **Mutations** (POST, PATCH, DELETE operations)
- **Error handling** and retry logic
- **Offline support** via mutation pausing

## Architecture

### 1. API Client Layer (`services/orderApi.ts`)

The `OrderApiClient` class encapsulates all HTTP communication with the backend:

```typescript
// Automatically handles:
// - Request/response interceptors
// - Authorization tokens (when configured)
// - Error conversion to ApiError with status code
// - Request/response logging
// - Timeout management

const orderApiClient = new OrderApiClient();
```

**Endpoints:**
- `getAvailableOrders()` - GET /orders/available
- `getMyDeliveries(deliveryId)` - GET /deliveries/{deliveryId}/orders
- `acceptOrder(orderId, deliveryId)` - POST /orders/{orderId}/accept
- `updateOrderStatus(orderId, status)` - PATCH /orders/{orderId}
- `getOrderDetails(orderId)` - GET /orders/{orderId}
- `healthCheck()` - GET /health

### 2. Query Management (`hooks/useOrdersQuery.ts`)

Uses the **Query Key Factory Pattern** for type-safe cache management:

```typescript
export const orderQueryKeys = {
  all: ['orders'] as const,
  available: () => [...orderQueryKeys.all, 'available'] as const,
  myDeliveries: (deliveryId: string) => [...orderQueryKeys.all, 'myDeliveries', deliveryId] as const,
  detail: (orderId: string) => [...orderQueryKeys.all, 'detail', orderId] as const,
};
```

**Query Hooks:**

- **`useOrdersQuery(deliveryId?)`** - Returns `{ data, isLoading, error, refetch }`
  - Fetches both available orders and my deliveries in parallel
  - Stale time: 30 seconds (refetch if older)
  - Cache time: 5 minutes
  - Retry: 2 attempts with exponential backoff
  - Conditional enabling based on deliveryId

- **`useOrderDetails(orderId)`** - Returns single order details
  - Enabled only when orderId is provided
  - Useful for detail pages

**Mutation Hooks:**

- **`useOrderMutations(deliveryId)`** - Returns `{ acceptOrder, updateStatus }`
  - Optimistic updates (updates cache before server response)
  - Automatic rollback on error
  - Cache invalidation after success
  - Error handling with detailed error messages

### 3. QueryClient Configuration (`config/queryClient.ts`)

Centralized React Query configuration with sensible defaults:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes (garbage collection)
      retry: 2,                         // Retry failed requests
      refetchOnWindowFocus: true,       // Refetch when app comes to focus
      refetchOnReconnect: 'stale',     // Refetch stale queries on reconnect
      networkMode: 'always',            // Works even with NetworkInformation API unavailable
    },
    mutations: {
      retry: 1,                         // Retry failed mutations once
      networkMode: 'always',
    },
  },
});
```

### 4. Enhanced Hooks

#### `usePrefetchOrders` - Improve Perceived Performance
```typescript
const { prefetchAvailableOrders, prefetchMyDeliveries } = usePrefetchOrders();

// Prefetch data before user navigates to it
useEffect(() => {
  prefetchAvailableOrders();
}, []);
```

#### `useInvalidateOrders` - Force Refetch
```typescript
const { invalidateAvailableOrders, invalidateAllOrders } = useInvalidateOrders();

// Force refetch after user action
await invalidateAvailableOrders();
```

#### `useNetworkStatus` - Handle Offline
```typescript
const { isOnline, isOffline } = useNetworkStatus();

// Pause mutations when offline, resume when online
// Automatically handled by React Query
```

#### `useMutationWithErrorRecovery` - Better Error Handling
```typescript
const { execute, retry, isPending, error, canRetry } = useMutationWithErrorRecovery(
  async () => await orderApiClient.acceptOrder(orderId, deliveryId),
  {
    maxRetries: 3,
    onError: (error) => console.error(error),
  }
);

// Usage
await execute();
if (error && canRetry) {
  await retry();
}
```

### 5. Component Integration

The main page component uses all the above:

```typescript
export default function DeliveryTab() {
  // 1. Get data from queries
  const { data, isLoading, error, refetch } = useOrdersQuery(deliveryId);
  
  // 2. Get mutations for actions
  const { acceptOrder, updateStatus, isPending } = useOrderMutations(deliveryId);
  
  // 3. Handle network status
  const { isOnline } = useNetworkStatus();
  
  // 4. Render accordingly
  return (
    <>
      {!isOnline && <OfflineIndicator />}
      {isLoading && <LoadingUI />}
      {error && <ErrorUI onRetry={refetch} />}
      {data && <OrdersUI orders={data} onAccept={acceptOrder} />}
    </>
  );
}
```

## Best Practices Implemented

### 1. **Query Key Factory Pattern**
Prevents cache mismatches and makes refactoring safer:
```typescript
// Instead of hardcoded strings scattered across components
queryClient.invalidateQueries({ queryKey: ['orders', 'available'] });

// Use centralized factory
queryClient.invalidateQueries({ queryKey: orderQueryKeys.available() });
```

### 2. **Optimistic Updates**
Update UI immediately, rollback on error:
```typescript
onMutate: async (newOrder) => {
  // Cancel any outgoing refetches
  await queryClient.cancelQueries({ queryKey: orderQueryKeys.myDeliveries(deliveryId) });
  
  // Snapshot old data
  const oldData = queryClient.getQueryData(...);
  
  // Update UI optimistically
  queryClient.setQueryData(..., newData);
  
  // Return rollback data
  return { oldData };
},
onError: (err, newData, rollbackData) => {
  // Restore old data on error
  queryClient.setQueryData(..., rollbackData?.oldData);
}
```

### 3. **Conditional Query Enabling**
Only fetch when necessary:
```typescript
useQuery({
  queryKey: orderQueryKeys.myDeliveries(deliveryId || ''),
  queryFn: () => orderApiClient.getMyDeliveries(deliveryId!),
  enabled: !!deliveryId,  // Only runs when deliveryId is truthy
});
```

### 4. **Proper Error Handling**
Distinguish between different error types:
```typescript
try {
  await acceptOrder.mutateAsync(orderId);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      // Order not found
    } else if (error.status === 409) {
      // Order already accepted
    }
  }
}
```

### 5. **Prefetching for Performance**
Load data before user needs it:
```typescript
// In tab navigation, prefetch other tab's data
useEffect(() => {
  if (activeTab === 'available') {
    prefetchMyDeliveries(deliveryId);
  }
}, [activeTab, deliveryId]);
```

## Configuration & Environment

### API Base URL
Set via environment variable:
```bash
# .env or expo environment
EXPO_PUBLIC_API_URL=https://api.example.com
```

If not set, defaults to `http://localhost:3000/api`

### Authentication
The API client is prepared for token-based auth:

```typescript
// In orderApi.ts, uncomment and configure:
this.client.interceptors.request.use((config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Common Patterns

### 1. Refetch on Focus
```typescript
const { refetch } = useOrdersQuery(deliveryId);

const navigation = useNavigation();
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    refetch();
  });
  return unsubscribe;
}, [navigation, refetch]);
```

### 2. Infinite Queries (for pagination)
```typescript
const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
  queryKey: orderQueryKeys.all,
  queryFn: ({ pageParam }) => orderApiClient.getOrders(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

### 3. Parallel Queries
```typescript
// Both queries run in parallel
const availableOrders = useQuery({
  queryKey: orderQueryKeys.available(),
  queryFn: orderApiClient.getAvailableOrders,
});

const myDeliveries = useQuery({
  queryKey: orderQueryKeys.myDeliveries(deliveryId),
  queryFn: () => orderApiClient.getMyDeliveries(deliveryId),
  enabled: !!deliveryId,
});

// Wait for both
useEffect(() => {
  if (availableOrders.isLoading || myDeliveries.isLoading) {
    // Show loading
  }
}, [availableOrders.isLoading, myDeliveries.isLoading]);
```

## Debugging

### Enable DevTools (Development)
```bash
npm install --save-dev @react-query/devtools
```

```typescript
import { ReactQueryDevtools } from '@react-query/devtools';

// In app root:
<QueryClientProvider client={queryClient}>
  <YourApp />
  {__DEV__ && <ReactQueryDevtools />}
</QueryClientProvider>
```

### Check Query Cache Status
```typescript
const { useQueryDevtools } = require('./hooks/useQueryDevtools');

// In any component
const status = useQueryDevtools();
console.log('Query cache:', status);
```

### Monitor Network
Check browser/simulator network tab to see:
- Request/response times
- Error responses
- Retry attempts
- Header details

## Migration Checklist

When refactoring existing code to use React Query:

- [ ] Replace `useState` data fetching with `useQuery`
- [ ] Replace manual mutations with `useMutation`
- [ ] Add error boundaries for error states
- [ ] Use query key factory for all cache operations
- [ ] Configure proper staleTime/gcTime
- [ ] Add optimistic updates for UX
- [ ] Test refetch behavior
- [ ] Test error handling
- [ ] Test offline/online transitions
- [ ] Add prefetch for predicted user actions

## Performance Tips

1. **Use selective refetch** instead of invalidating all queries
2. **Prefetch data** when user hovers/scrolls to a section
3. **Use proper staleTime** - balance between freshness and requests
4. **Avoid refetch on every focus** - set staleTime appropriately
5. **Use networkMode 'always'** for consistent behavior
6. **Batch mutations** when possible
7. **Use keepPreviousData** for smoother transitions

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Best Practices](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [DevTools](https://tanstack.com/query/latest/docs/devtools)
- [Offline Support](https://tanstack.com/query/latest/docs/react/guides/network-mode)
