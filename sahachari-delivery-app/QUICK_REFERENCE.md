# React Query Quick Reference

## Common Hooks Usage

### Fetching Data

```typescript
// Get orders data
const { data, isLoading, error, refetch } = useOrdersQuery(deliveryId);

// Get single order details
const { data: order, isLoading, error } = useOrderDetails(orderId);
```

### Mutations (Create, Update, Delete)

```typescript
const { acceptOrder, updateStatus, isPending } = useOrderMutations(deliveryId);

// Accept an order
await acceptOrder.mutateAsync(orderId);

// Update order status
await updateStatus.mutateAsync({ orderId, status: 1 });
```

### Prefetching (Optimize UX)

```typescript
const { prefetchAvailableOrders, prefetchMyDeliveries } = usePrefetchOrders();

// Prefetch when user might navigate
useEffect(() => {
  prefetchAvailableOrders();
  prefetchMyDeliveries(deliveryId);
}, []);
```

### Cache Management

```typescript
const { invalidateAvailableOrders, invalidateAllOrders } = useInvalidateOrders();

// Force refetch specific query
await invalidateAvailableOrders();

// Force refetch all order queries
await invalidateAllOrders();
```

### Network Detection

```typescript
const { isOnline, isOffline, connectionType } = useNetworkStatus();

// Show offline indicator
if (isOffline) {
  return <Text>You are offline. Data will sync when online.</Text>;
}
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch with Mutations

```typescript
try {
  await acceptOrder.mutateAsync(orderId);
  // Success - cache already updated optimistically
  showToast('Order accepted!');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      showToast('Order already taken');
    } else if (error.status === 404) {
      showToast('Order not found');
    } else {
      showToast(`Error: ${error.message}`);
    }
  }
}
```

### Pattern 2: Component-Level Error Display

```typescript
const { data, error, refetch } = useOrdersQuery(deliveryId);

if (error) {
  return (
    <View>
      <Text>{error.message}</Text>
      <Button title="Retry" onPress={() => refetch()} />
    </View>
  );
}
```

### Pattern 3: Error Boundary

```typescript
<ErrorBoundary
  fallback={(error, retry) => (
    <View>
      <Text>Error: {error.message}</Text>
      <Button title="Try Again" onPress={retry} />
    </View>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

---

## Advanced Patterns

### Parallel Data Fetching

```typescript
// Both queries run simultaneously
const available = useOrdersQuery(deliveryId);
const details = useOrderDetails(orderId);

if (available.isLoading || details.isLoading) {
  return <Loading />;
}
```

### Dependent Queries

```typescript
// Only fetch details after orderId is available
const { data: details } = useOrderDetails(
  activeOrder?.id, // Only enabled when this is truthy
);
```

### Refetch on Navigation

```typescript
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const navigation = useNavigation();
const { refetch } = useOrdersQuery(deliveryId);

useFocusEffect(
  useCallback(() => {
    refetch(); // Refetch when screen comes to focus
  }, [refetch]),
);
```

### Batch Operations

```typescript
const { acceptOrder } = useOrderMutations(deliveryId);

// Accept multiple orders
const results = await Promise.all([
  acceptOrder.mutateAsync(orderId1),
  acceptOrder.mutateAsync(orderId2),
  acceptOrder.mutateAsync(orderId3),
]);
```

---

## State Mapping

### Common States in Components

```typescript
const { data, isLoading, error, refetch } = useOrdersQuery(deliveryId);

// Render based on state
if (isLoading) return <LoadingScreen />;
if (error) return <ErrorScreen error={error} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState />;
return <OrdersList orders={data} />;
```

### Mutation States

```typescript
const { acceptOrder } = useOrderMutations(deliveryId);

// acceptOrder has:
// - mutateAsync(orderId): Promise<Order>
// - mutate(orderId, {onSuccess, onError})
// - status: 'idle' | 'pending' | 'success' | 'error'
// - error: Error | null
// - data: Order | null

return (
  <Button
    disabled={acceptOrder.isPending}
    title={acceptOrder.isPending ? 'Accepting...' : 'Accept Order'}
    onPress={() => acceptOrder.mutate(orderId)}
  />
);
```

---

## Cache Keys Reference

```typescript
// Available orders (can be fetched by anyone)
orderQueryKeys.available()
// ['orders', 'available']

// My deliveries (specific to a delivery person)
orderQueryKeys.myDeliveries(deliveryId)
// ['orders', 'myDeliveries', 'delivery-123']

// Single order details
orderQueryKeys.detail(orderId)
// ['orders', 'detail', 'order-456']

// All order-related queries
orderQueryKeys.all
// ['orders']
```

---

## Common Mistakes to Avoid

### ❌ Wrong: Forgetting to enable conditional queries

```typescript
// This will run even if deliveryId is undefined!
const { data } = useOrdersQuery(deliveryId);
```

### ✅ Right: Always add enabled flag

```typescript
const { data, isEnabled } = useQuery({
  queryKey: ['orders', deliveryId],
  queryFn: () => api.getOrders(deliveryId),
  enabled: !!deliveryId, // Only run when deliveryId exists
});
```

---

### ❌ Wrong: Using incorrect cache keys

```typescript
// Scattered hardcoded strings prone to mismatches
queryClient.invalidateQueries({ queryKey: ['orders', 'available'] });
queryClient.invalidateQueries({ queryKey: ['orders', 'available'] }); // Typo!
```

### ✅ Right: Use query key factory

```typescript
// Centralized, type-safe, reusable
queryClient.invalidateQueries({ queryKey: orderQueryKeys.available() });
```

---

### ❌ Wrong: Not handling loading states

```typescript
// Will crash if data is undefined
const { data } = useOrdersQuery(deliveryId);
return <Text>{data[0].customerName}</Text>;
```

### ✅ Right: Always check loading state

```typescript
const { data, isLoading } = useOrdersQuery(deliveryId);
if (isLoading) return <Loading />;
if (!data) return <NoData />;
return <Text>{data[0].customerName}</Text>;
```

---

## Configuration Tips

### Change Stale Time (When Data Becomes Stale)

```typescript
// In queryClient.ts, increase for less frequent refetch
staleTime: 1000 * 60 * 10, // 10 minutes (instead of 5)

// Or per query
useQuery({
  staleTime: 1000 * 60 * 30, // 30 minutes for this query
  queryKey: [...],
  queryFn: [...],
});
```

### Change Garbage Collection Time (When Unused Data is Deleted)

```typescript
// In queryClient.ts
gcTime: 1000 * 60 * 30, // 30 minutes (instead of 10)
```

### Disable Auto-Refetch on Window Focus

```typescript
// In queryClient.ts
refetchOnWindowFocus: false,

// Or per query
useQuery({
  refetchOnWindowFocus: false,
  queryKey: [...],
  queryFn: [...],
});
```

### Set Up Authentication

```typescript
// In orderApi.ts, uncomment and configure:
this.client.interceptors.request.use((config) => {
  const token = getAuthToken(); // Your auth logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Testing

### Mock Queries in Tests

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

render(<YourComponent />, { wrapper });
```

### Mock API Responses

```typescript
jest.mock('./services/orderApi', () => ({
  api: {
    getAvailableOrders: jest.fn(() =>
      Promise.resolve([
        { id: '1', customerName: 'John', address: 'Main St' },
      ]),
    ),
  },
}));
```

---

## Debugging

### Log Query Status

```typescript
const queryClient = useQueryClient();
const status = getQueryCacheStatus(queryClient);
console.log('Cache:', status);
```

### Monitor API Calls

Check browser/simulator console for `[API Request]`, `[API Response]`, `[API Error]` logs

### React Query DevTools

```bash
npm install --save-dev @react-query/devtools
```

```typescript
import { ReactQueryDevtools } from '@react-query/devtools';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      {__DEV__ && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

---

## Performance Checklist

- [ ] Prefetch data when user hovers/scrolls to a section
- [ ] Use appropriate `staleTime` to balance freshness vs requests
- [ ] Remove `refetchOnWindowFocus` if not needed
- [ ] Use `gcTime` to clear unused cache
- [ ] Batch mutations when possible
- [ ] Use `keepPreviousData` for smoother transitions
- [ ] Monitor cache size in DevTools

---

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Video Tutorials](https://tanstack.com/query/latest/docs/react/videos)
- [GitHub Examples](https://github.com/TanStack/query/tree/main/examples)
- [Community Chat](https://tlinz.com/discord)
