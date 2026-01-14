import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../types';
import { orderApiClient } from '../services/orderApi';
import { DUMMY_AVAILABLE_ORDERS, DUMMY_MY_DELIVERIES } from '../constants';

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

export const useOrdersQuery = (
  initialAvailable: Order[] = DUMMY_AVAILABLE_ORDERS,
  initialMyDeliveries: Order[] = DUMMY_MY_DELIVERIES,
  deliveryId?: string
): UseOrdersQueryReturn => {
  // Fetch available orders
  const {
    data: availableOrders = initialAvailable,
    isLoading: isLoadingAvailable,
    error: errorAvailable,
    refetch: refetchAvailable,
  } = useQuery({
    queryKey: orderQueryKeys.available(),
    queryFn: async () => {
      console.log('[useOrdersQuery] Loading dummy available orders');
      // Directly return dummy data without AsyncStorage
      // const saved = await AsyncStorage.getItem('orderStatusUpdates');
      // const statusUpdates = saved ? JSON.parse(saved) : {};
      // const orders = initialAvailable.map(order => ({
      //   ...order,
      //   status: statusUpdates[order._id] ?? order.status
      // }));
      return initialAvailable;
    },
    enabled: true,
    staleTime: Infinity, // Keep data fresh indefinitely in dummy mode
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch my deliveries
  const {
    data: myDeliveries = initialMyDeliveries,
    isLoading: isLoadingMyDeliveries,
    refetch: refetchMyDeliveries,
    error: errorMyDeliveries,
  } = useQuery({
    queryKey: deliveryId ? orderQueryKeys.myDeliveries(deliveryId) : ['orders', 'myDeliveries'],
    queryFn: async () => {
      console.log('[useOrdersQuery] Loading dummy my deliveries');
      // Directly return dummy data without AsyncStorage
      // const saved = await AsyncStorage.getItem('orderStatusUpdates');
      // const statusUpdates = saved ? JSON.parse(saved) : {};
      // const orders = initialMyDeliveries.map(order => ({
      //   ...order,
      //   status: statusUpdates[order._id] ?? order.status
      // }));
      return initialMyDeliveries;
    },
    enabled: true,
    staleTime: Infinity, // Keep data fresh indefinitely in dummy mode
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

  // Accept order mutation
  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      console.log('[acceptOrder] Starting mutation with deliveryId:', deliveryId);
      // API commented out - using dummy data only
      // if (deliveryId) {
      //   console.log('[acceptOrder] Calling API with orderId:', orderId);
      //   const result = await orderApiClient.acceptOrder(orderId, deliveryId);
      //   console.log('[acceptOrder] API Success:', result);
      //   return result;
      // } else {
      //   // Dummy data mode
      //   console.log('[acceptOrder] Using dummy data mode');
      //   return { _id: orderId, status: 1 } as Order;
      // }
      console.log('[acceptOrder] Using dummy data mode');
      return { _id: orderId, status: 1 } as Order;
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

      // Add to my deliveries (use a dummy deliveryId for query key if needed)
      const myDeliveryKey = deliveryId ? orderQueryKeys.myDeliveries(deliveryId) : ['orders', 'myDeliveries'];
      
      // Get the full order object from available orders
      const availableOrders = queryClient.getQueryData<Order[]>(orderQueryKeys.available()) || [];
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
      console.log('[acceptOrder] onSuccess: Invalidating available orders');
      // Only invalidate available orders - keep the optimistically updated myDeliveries
      // This prevents the order from disappearing after the update
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.available() });
      
      // Only refetch myDeliveries if we have a real deliveryId (API mode)
      // In dummy data mode, keep the optimistic update
      if (deliveryId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.myDeliveries(deliveryId) });
      }
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: number }) => {
      console.log('[updateStatus] Updating order:', orderId, 'to status:', status);
      // Save the status update to AsyncStorage
      // try {
      //   const saved = await AsyncStorage.getItem('orderStatusUpdates');
      //   const statusUpdates = saved ? JSON.parse(saved) : {};
      //   statusUpdates[orderId] = status;
      //   await AsyncStorage.setItem('orderStatusUpdates', JSON.stringify(statusUpdates));
      //   console.log('[updateStatus] Saved status update:', statusUpdates);
      // } catch (error) {
      //   console.error('[updateStatus] Error saving status:', error);
      // }
      return { _id: orderId, status } as Order;
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

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrderMutation.mutateAsync(orderId);
  };

  const handlePickedUp = async (orderId: string) => {
    try {
      console.log('[handlePickedUp] Called with orderId:', orderId);
      await updateStatusMutation.mutateAsync({ orderId, status: 2 });
      console.log('[handlePickedUp] Success');
    } catch (error) {
      console.error('[handlePickedUp] Error:', error);
    }
  };

  const handleUpdateProgress = async (orderId: string, status: number) => {
    try {
      console.log('[handleUpdateProgress] Called with orderId:', orderId, 'status:', status);
      await updateStatusMutation.mutateAsync({ orderId, status });
      console.log('[handleUpdateProgress] Success');
    } catch (error) {
      console.error('[handleUpdateProgress] Error:', error);
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
