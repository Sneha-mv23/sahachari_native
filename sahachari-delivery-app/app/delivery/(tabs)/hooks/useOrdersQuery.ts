import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  } = useQuery({
    queryKey: orderQueryKeys.available(),
    queryFn: async () => {
      try {
        return await orderApiClient.getAvailableOrders();
      } catch (error) {
        console.warn('Failed to fetch from API, using dummy data');
        return initialAvailable;
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 2,
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
      if (!deliveryId) return initialMyDeliveries;
      try {
        return await orderApiClient.getMyDeliveries(deliveryId);
      } catch (error) {
        console.warn('Failed to fetch deliveries from API, using dummy data');
        return initialMyDeliveries;
      }
    },
    enabled: !!deliveryId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const refetch = () => {
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
    mutationFn: (orderId: string) =>
      deliveryId
        ? orderApiClient.acceptOrder(orderId, deliveryId)
        : Promise.reject(new Error('Delivery ID not found')),
    onSuccess: () => {
      // Invalidate and refetch both available and my deliveries
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.available() });
      if (deliveryId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.myDeliveries(deliveryId) });
      }
    },
    onError: (error) => {
      console.error('Error accepting order:', error);
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: number }) =>
      orderApiClient.updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.myDeliveries(deliveryId || '') });

      // Snapshot previous data
      const previousDeliveries = queryClient.getQueryData(
        orderQueryKeys.myDeliveries(deliveryId || '')
      );

      // Optimistically update
      queryClient.setQueryData(
        orderQueryKeys.myDeliveries(deliveryId || ''),
        (old: Order[] | undefined) =>
          old?.map((o) => (o._id === orderId ? { ...o, status } : o)) || []
      );

      return { previousDeliveries };
    },
    onError: (error, variables, context: any) => {
      // Rollback on error
      if (context?.previousDeliveries) {
        queryClient.setQueryData(
          orderQueryKeys.myDeliveries(deliveryId || ''),
          context.previousDeliveries
        );
      }
      console.error('Error updating order status:', error);
    },
    onSuccess: () => {
      // Refetch to ensure consistency
      if (deliveryId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.myDeliveries(deliveryId) });
      }
    },
  });

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrderMutation.mutateAsync(orderId);
  };

  const handlePickedUp = async (orderId: string) => {
    await updateStatusMutation.mutateAsync({ orderId, status: 2 });
  };

  const handleUpdateProgress = async (orderId: string, status: number) => {
    await updateStatusMutation.mutateAsync({ orderId, status });
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
