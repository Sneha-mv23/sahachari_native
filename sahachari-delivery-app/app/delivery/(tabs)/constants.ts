import { Order, DeliveryStage } from './types';

export const DELIVERY_STAGES: DeliveryStage[] = [
  { status: 3, icon: 'cube-outline', activeLabel: 'Packing', completedLabel: 'Packed' },
  { status: 4, icon: 'bicycle-outline', activeLabel: 'In Transit', completedLabel: 'In Transit' },
  { status: 5, icon: 'checkmark-circle-outline', activeLabel: 'Delivered', completedLabel: 'Delivered' },
];

export const DUMMY_AVAILABLE_ORDERS: Order[] = [
  {
    _id: 'ORD001ABC',
    pickupAddress: 'Fresh Mart, MG Road, Kochi',
    deliveryAddress: '123 Park Street, Kochi 682002',
    distance: '3.5 km',
    price: 50,
    status: 0,
  },
  {
    _id: 'ORD002XYZ',
    pickupAddress: 'Super Market, Beach Road, Kochi',
    deliveryAddress: '456 Hill View, Kochi 682001',
    distance: '5.2 km',
    price: 70,
    status: 0,
  },
  {
    _id: 'ORD003LMN',
    pickupAddress: 'City Store, Palarivattom, Kochi',
    deliveryAddress: '789 Marine Drive, Kochi 682003',
    distance: '2.8 km',
    price: 45,
    status: 0,
  },
];

export const DUMMY_MY_DELIVERIES: Order[] = [
  {
    _id: 'ORD004PQR',
    pickupAddress: 'Grocery Hub, Kakkanad, Kochi',
    deliveryAddress: '321 Rose Garden, Kochi 682030',
    distance: '4.1 km',
    price: 60,
    status: 1,
    customerName: 'Rahul Kumar',
  },
  {
    _id: 'ORD005STU',
    pickupAddress: 'Mini Market, Edappally, Kochi',
    deliveryAddress: '654 Silver Heights, Kochi 682024',
    distance: '6.3 km',
    price: 80,
    status: 3,
    customerName: 'Priya Sharma',
  },
];

export const COLOR_CONSTANTS = {
  primary: '#FF6B35',
  primaryGradient: ['#FF6B35', '#FF8E53'],
  secondary: '#00BCD4',
  success: '#4CAF50',
  pickupIcon: '#FF6B35',
  deliveryIcon: '#4CAF50',
  navigate: '#2196F3',
  navigateBg: '#E3F2FD',
  callBg: '#E8F5E9',
  detailsBg: '#FFF3E0',
  priceGradient: ['#FFE5D9', '#FFF3E0'],
  statusBgActive: '#00ACC1',
  statusTextActive: '#00838F',
  statusBgInactive: '#E0F7FA',
  pickedUpGradient: ['#d4cb19ff', '#00BCD4'],
};

export const DEFAULT_PHONE = '+919876543210';

export const EMPTY_STATE = {
  available: {
    icon: 'cube-outline',
    title: 'No orders available',
    subtitle: 'Check back later for new deliveries',
  },
  myDeliveries: {
    icon: 'bicycle-outline',
    title: 'No active deliveries',
    subtitle: 'Accept orders to start earning',
  },
};
