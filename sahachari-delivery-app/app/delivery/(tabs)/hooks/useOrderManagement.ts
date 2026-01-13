import { useState, useCallback } from 'react';
import { Order } from '../types';

interface UseOrderManagementReturn {
  availableOrders: Order[];
  myDeliveries: Order[];
  setAvailableOrders: (orders: Order[]) => void;
  setMyDeliveries: (orders: Order[]) => void;
  handleAcceptOrder: (order: Order) => void;
  handlePickedUp: (orderId: string) => void;
  handleUpdateProgress: (orderId: string, newStatus: number) => void;
}

export const useOrderManagement = (
  initialAvailable: Order[],
  initialMyDeliveries: Order[]
): UseOrderManagementReturn => {
  const [availableOrders, setAvailableOrders] = useState<Order[]>(initialAvailable);
  const [myDeliveries, setMyDeliveries] = useState<Order[]>(initialMyDeliveries);

  const handleAcceptOrder = useCallback((order: Order) => {
    setAvailableOrders((prev) => prev.filter((o) => o._id !== order._id));
    setMyDeliveries((prev) => [
      ...prev,
      { ...order, status: 1, customerName: 'Rahul Kumar' },
    ]);
  }, []);

  const handlePickedUp = useCallback((orderId: string) => {
    setMyDeliveries((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: 2 } : o))
    );
  }, []);

  const handleUpdateProgress = useCallback((orderId: string, newStatus: number) => {
    setMyDeliveries((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    if (newStatus === 5) {
      setTimeout(() => {
        setMyDeliveries((prev) => prev.filter((o) => o._id !== orderId));
      }, 1500);
    }
  }, []);

  return {
    availableOrders,
    myDeliveries,
    setAvailableOrders,
    setMyDeliveries,
    handleAcceptOrder,
    handlePickedUp,
    handleUpdateProgress,
  };
};
