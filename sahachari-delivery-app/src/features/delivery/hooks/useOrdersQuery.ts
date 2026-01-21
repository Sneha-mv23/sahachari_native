import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showGlobalSnackbar } from 'src/components/ui/Snackbar';
import { api, Order as ApiOrder } from 'src/services/api';
import { Order } from '../types';

// Map API order shape to feature Order shape
const mapApiOrder = (a: ApiOrder): Order => ({
  _id: a._id,
  pickupAddress: (a as any).pickupAddress || (a as any).pickupLocation || '',
  deliveryAddress: (a as any).deliveryAddress || (a as any).deliveryLocation || '',
  distance: (a as any).distance || `${((a as any).distanceKm ?? '')}` || '',
  price: (a as any).price ?? (a as any).amount ?? 0,
  status: a.status,
  customerName: a.customerName || (a as any).customer?.name || undefined,
});


// Query keys for React Query
export const orderQueryKeys = {
  all: ['orders'] as const,
  available: () => [...orderQueryKeys.all, 'available'] as const,
  myDeliveries: (deliveryId: string) => [...orderQueryKeys.all, 'myDeliveries', deliveryId] as const,
  detail: (orderId: string) => [...orderQueryKeys.all, 'detail', orderId] as const,
};

interface UseOrdersQueryReturn {
  availableOrders: Order[];
  myDeliveries: Order[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useOrdersQuery = (deliveryId?: string): UseOrdersQueryReturn => {
  // Fetch available orders from API
  const {
    data: availableOrders = [],
    isLoading: isLoadingAvailable,
    error: errorAvailable,
    refetch: refetchAvailable,
  } = useQuery({
    queryKey: orderQueryKeys.available(),
    queryFn: async () => {
      const data = await api.getAvailableOrders();
      return (data || []).map(mapApiOrder);
    },
    enabled: true,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch my deliveries only when deliveryId is available
  const {
    data: myDeliveries = [],
    isLoading: isLoadingMyDeliveries,
    refetch: refetchMyDeliveries,
    error: errorMyDeliveries,
  } = useQuery({
    queryKey: deliveryId ? orderQueryKeys.myDeliveries(deliveryId) : ['orders', 'myDeliveries'],
    queryFn: async () => {
      if (!deliveryId) return [];
      // Use token-based endpoint to get deliveries for the authenticated user
      const data = await api.getAcceptedOrders();
      return (data || []).map(mapApiOrder);
    },
    enabled: !!deliveryId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const refetch = () => {
    refetchAvailable();
    refetchMyDeliveries();
  };

  return {
    availableOrders,
    myDeliveries,
    isLoading: isLoadingAvailable || isLoadingMyDeliveries,
    isError: !!errorAvailable || !!errorMyDeliveries,
    error: (errorAvailable || errorMyDeliveries) as Error | null,
    refetch,
  };
};

interface UseOrderMutationsReturn {
  handleAcceptOrder: (orderId: string) => Promise<void>;
  handlePickedUp: (orderId: string) => Promise<void>;
  handleUpdateProgress: (orderId: string, status: number) => Promise<void>;
  isAccepting: boolean;
  isUpdating: boolean;
  acceptError: Error | null;
  updateError: Error | null;
}

export const useOrderMutations = (deliveryId?: string): UseOrderMutationsReturn => {
  const queryClient = useQueryClient();

  // Accept order mutation - calls server endpoint to accept by orderId
  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      console.log('[acceptOrder] Calling API to accept order:', orderId);
      const res = await api.acceptOrder(orderId);
      return mapApiOrder(res as ApiOrder);
    },

    onMutate: async (orderId: string) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.available() });

      // Get previous available orders
      const previousAvailable = queryClient.getQueryData(orderQueryKeys.available());

      // Remove the accepted order from available
      queryClient.setQueryData(orderQueryKeys.available(), (old: Order[] | undefined) => {
        return old?.filter((order) => order._id !== orderId) || [];
      });

      // Add to my deliveries (query key uses deliveryId when available)
      const myDeliveryKey = deliveryId ? orderQueryKeys.myDeliveries(deliveryId) : ['orders', 'myDeliveries'];

      // Get the full order object from available orders
      const acceptedOrder = (previousAvailable as Order[] | undefined)?.find(o => o._id === orderId);

      if (acceptedOrder) {
        queryClient.setQueryData(myDeliveryKey, (old: Order[] | undefined) => {
          return [...(old || []), { ...acceptedOrder, status: 1 }];
        });
      }

      return { previousAvailable };
    },
    onError: (error, variables, context: any) => {
      // Rollback on error
      if (context?.previousAvailable) {
        queryClient.setQueryData(orderQueryKeys.available(), context.previousAvailable);
      }
      console.error('[acceptOrder] Mutation error:', error);
    },
    onSuccess: () => {
      console.log('[acceptOrder] onSuccess: Keeping optimistic update (no refetch)');
      // Don't invalidate - keep the optimistic updates only
      // This prevents duplicates since we already updated the cache in onMutate
    },
  });


  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: number }) => {
      console.log('[updateStatus] Calling API for order:', orderId, 'status:', status);
      let res: ApiOrder;
      if (status === 2) {
        // Deliver
        res = await api.deliverOrder(orderId) as ApiOrder;
      } else if (status === -1) {
        // Fail
        res = await api.failOrder(orderId) as ApiOrder;
      } else {
        // Generic status update via PATCH
        res = await api.updateOrderStatus(orderId, status) as ApiOrder;
      }
      return mapApiOrder(res);
    },
    onMutate: async ({ orderId, status }) => {
      console.log('[updateStatus] onMutate: Updating order', orderId, 'to status', status);

      // Update in both available orders and my deliveries
      const availableKey = orderQueryKeys.available();
      const myDeliveryKey = deliveryId ? orderQueryKeys.myDeliveries(deliveryId) : ['orders', 'myDeliveries'];

      console.log('[updateStatus] Using keys - available:', availableKey, 'myDeliveries:', myDeliveryKey);

      await queryClient.cancelQueries({ queryKey: availableKey });
      await queryClient.cancelQueries({ queryKey: myDeliveryKey });

      // Snapshot previous data
      const previousAvailable = queryClient.getQueryData<Order[]>(availableKey);
      const previousDeliveries = queryClient.getQueryData<Order[]>(myDeliveryKey);
      console.log('[updateStatus] Previous - available:', previousAvailable?.length, 'deliveries:', previousDeliveries?.length);

      // Update in available orders
      queryClient.setQueryData(availableKey, (old: Order[] | undefined) => {
        const updated = old?.map((o) => (o._id === orderId ? { ...o, status } : o)) || [];
        console.log('[updateStatus] Updated available orders:', updated.map(o => ({ id: o._id, status: o.status })));
        return updated;
      });

      // Update in my deliveries
      queryClient.setQueryData(myDeliveryKey, (old: Order[] | undefined) => {
        const updated = old?.map((o) => (o._id === orderId ? { ...o, status } : o)) || [];
        console.log('[updateStatus] Updated my deliveries:', updated.map(o => ({ id: o._id, status: o.status })));
        return updated;
      });

      return { previousAvailable, previousDeliveries };
    },
    onError: (error, variables, context: any) => {
      console.error('[updateStatus] Mutation error:', error);
      // Rollback on error
      const availableKey = orderQueryKeys.available();
      const myDeliveryKey = deliveryId ? orderQueryKeys.myDeliveries(deliveryId) : ['orders', 'myDeliveries'];
      if (context?.previousAvailable) {
        queryClient.setQueryData(availableKey, context.previousAvailable);
      }
      if (context?.previousDeliveries) {
        queryClient.setQueryData(myDeliveryKey, context.previousDeliveries);
      }
    },
    onSuccess: () => {
      console.log('[updateStatus] Success: Status saved to AsyncStorage');
      // No need to invalidate - data is persisted to AsyncStorage and will be loaded on next fetch
    },
  });

  // Use the global snackbar API for non-render contexts (safe even outside React render)

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const deliveryIdStored = await AsyncStorage.getItem('deliveryId');
      await acceptOrderMutation.mutateAsync(orderId);
      showGlobalSnackbar('Order accepted');
    } catch (error) {
      console.error('[handleAcceptOrder] Error:', error);
      showGlobalSnackbar('Failed to accept order');
    }
  };

  const handlePickedUp = async (orderId: string) => {
    try {
      console.log('[handlePickedUp] Called with orderId:', orderId);
      await api.pickUpOrder(orderId);
      await updateStatusMutation.mutateAsync({ orderId, status: 2 });
      showGlobalSnackbar('Marked as picked up');
      console.log('[handlePickedUp] Success');
    } catch (error) {
      console.error('[handlePickedUp] Error:', error);
      showGlobalSnackbar('Failed to mark as picked up');
    }
  };

  const handleUpdateProgress = async (orderId: string, status: number) => {
    try {
      console.log('[handleUpdateProgress] Called with orderId:', orderId, 'status:', status);
      await updateStatusMutation.mutateAsync({ orderId, status });
      if (status === 2) showGlobalSnackbar('Delivery completed');
      else if (status === -1) showGlobalSnackbar('Marked as failed');
      else showGlobalSnackbar('Status updated');
      console.log('[handleUpdateProgress] Success');
    } catch (error) {
      console.error('[handleUpdateProgress] Error:', error);
      showGlobalSnackbar('Failed to update status');
    }
  };

  return {
    handleAcceptOrder,
    handlePickedUp,
    handleUpdateProgress,
    isAccepting: acceptOrderMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    acceptError: acceptOrderMutation.error,
    updateError: updateStatusMutation.error,
  };
};
