export interface Order {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  price: number;
  status: number;
  customerName?: string;
}

export interface DeliveryStage {
  status: number;
  icon: 'cube-outline' | 'bicycle-outline' | 'checkmark-circle-outline';
  activeLabel: string;
  completedLabel: string;
}

export type TabType = 'available' | 'my-deliveries';
