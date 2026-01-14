import { useQuery } from '@tanstack/react-query';
import { Order } from '../types';
import { orderApiClient } from '../services/orderApi';
import { orderQueryKeys } from './useOrdersQuery';

interface UseOrderDetailsReturn {
  order: Order | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useOrderDetails = (orderId: string): UseOrderDetailsReturn => {
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderApiClient.getOrderDetails(orderId),
    enabled: !!orderId,
    staleTime: 20000, // 20 seconds
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    order: order || null,
    isLoading,
    isError: !!error,
    error: error as Error | null,
    refetch: () => refetch(),
  };
};
