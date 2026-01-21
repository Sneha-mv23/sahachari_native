import { useQueryClient } from '@tanstack/react-query';
import { orderQueryKeys } from './useOrdersQuery';

/**
 * Hook to prefetch orders data
 * This improves perceived performance by fetching data before it's needed
 * Useful for prefetching when user navigates or scrolls to a section
 */
export const usePrefetchOrders = () => {
  const queryClient = useQueryClient();

  const prefetchAvailableOrders = async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: orderQueryKeys.available(),
        queryFn: () => api.getAvailableOrders(),
        staleTime: 1000 * 30, // 30 seconds
      });
    } catch (error) {
      console.error('[Prefetch Error] Available orders:', error);
    }
  };

  const prefetchMyDeliveries = async (deliveryId: string) => {
    if (!deliveryId) return;
    try {
      await queryClient.prefetchQuery({
        queryKey: orderQueryKeys.myDeliveries(deliveryId),
        queryFn: () => api.getAcceptedOrders(),
        staleTime: 1000 * 30, // 30 seconds
      });
    } catch (error) {
      console.error('[Prefetch Error] My deliveries:', error);
    }
  };

  const prefetchOrderDetails = async (orderId: string) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: orderQueryKeys.detail(orderId),
        queryFn: () => api.getOrderDetails(orderId),
        staleTime: 1000 * 60, // 1 minute
      });
    } catch (error) {
      console.error('[Prefetch Error] Order details:', error);
    }
  };

  return {
    prefetchAvailableOrders,
    prefetchMyDeliveries,
    prefetchOrderDetails,
  };
};

/**
 * Hook to trigger invalidation of queries
 * Useful when you need to force a refetch after mutations
 */
export const useInvalidateOrders = () => {
  const queryClient = useQueryClient();

  const invalidateAvailableOrders = () => {
    return queryClient.invalidateQueries({ queryKey: orderQueryKeys.available() });
  };

  const invalidateMyDeliveries = (deliveryId: string) => {
    return queryClient.invalidateQueries({
      queryKey: orderQueryKeys.myDeliveries(deliveryId),
    });
  };

  const invalidateOrderDetails = (orderId: string) => {
    return queryClient.invalidateQueries({
      queryKey: orderQueryKeys.detail(orderId),
    });
  };

  const invalidateAllOrders = () => {
    return queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
  };

  return {
    invalidateAvailableOrders,
    invalidateMyDeliveries,
    invalidateOrderDetails,
    invalidateAllOrders,
  };
};

/**
 * Hook to clear all order-related caches
 * Useful for logout or when user session changes
 */
export const useClearOrderCache = () => {
  const queryClient = useQueryClient();

  const clearCache = () => {
    queryClient.removeQueries({ queryKey: orderQueryKeys.all });
  };

  return { clearCache };
};
