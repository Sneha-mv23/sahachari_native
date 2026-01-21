import { useQuery } from '@tanstack/react-query';
import { api, Order as ApiOrder } from 'src/services/api';
import { Order } from '../types';
import { orderQueryKeys } from './useOrdersQuery';

const mapApiOrder = (a: ApiOrder): Order => ({
  _id: a._id,
  pickupAddress: (a as any).pickupAddress || (a as any).pickupLocation || '',
  deliveryAddress: (a as any).deliveryAddress || (a as any).deliveryLocation || '',
  distance: (a as any).distance || `${((a as any).distanceKm ?? '')}` || '',
  price: (a as any).price ?? (a as any).amount ?? 0,
  status: a.status,
  customerName: a.customerName || (a as any).customer?.name || undefined,
});

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
    queryFn: async () => {
      const data = await api.getOrderDetails(orderId);
      return mapApiOrder(data as ApiOrder);
    },
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
