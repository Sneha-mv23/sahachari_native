import { DeliveryStage } from './types';

export const DELIVERY_STAGES: DeliveryStage[] = [
  { status: 3, icon: 'cube-outline', activeLabel: 'Packing', completedLabel: 'Packed' },
  { status: 4, icon: 'bicycle-outline', activeLabel: 'In Transit', completedLabel: 'In Transit' },
  { status: 5, icon: 'checkmark-circle-outline', activeLabel: 'Delivered', completedLabel: 'Delivered' },
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
