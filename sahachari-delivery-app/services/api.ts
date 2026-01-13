import axios,{ AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------
// API Configuration
// ------------------
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  console.warn('⚠️ EXPO_PUBLIC_API_URL is not defined in .env');
}

// ------------------
// Types
// ------------------
export interface Order {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  price: number;
  status: number; // 0 = available, 1 = accepted, 2 = picked-up, 3+ progress
  customerName?: string;
  customerId?: string;
}

export interface DeliveryUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  pincodes: string[];
  totalDeliveries: number;
  totalEarnings: number;
}

export interface AcceptedOrder {
  _id: string;
  deliveryId: string;
  orderId: string;
  order?: Order;
}


export interface AuthResponse {
  user: DeliveryUser;
  token: string;
}

// ------------------
// API Service
// ------------------
class ApiService {
  private baseURL: string;
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Generic request helper
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const token = await AsyncStorage.getItem('token');

      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      };
      console.log(` ${method} ${this.baseURL}${endpoint}`);
      if (token) console.log('Using token:', token.substring(0, 20) + '...');

      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          console.warn('Unauthorized - clearing stored data');
          await AsyncStorage.multiRemove(['token', 'deliveryUser', 'isLoggedIn']);
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`❌ API Error (${endpoint})`, error);
      throw error;
    }
  }

  // ------------------
  // Auth
  // ------------------
  signup(data: {
    name: string;
    email: string;
    password: string;
    pincodes: string[];
  }) {
    return this.request<DeliveryUser>('/delivery/signup', 'POST', data);
  }

  login(data: { email: string; password: string }) {
    return this.request<DeliveryUser>('/delivery/login', 'POST', data);
  }

  // ------------------
  // Orders
  // ------------------
  getAvailableOrders() {
    return this.request<Order[]>('/delivery/get-orders');
  }

  acceptOrder(data: { deliveryId: string; orderId: string }) {
    return this.request<AcceptedOrder>('/delivery/added-orders', 'POST', data);
  }

  getMyOrders(deliveryId: string) {
    return this.request<AcceptedOrder[]>(
      `/delivery/get-added-orders?id=${deliveryId}`
    );
  }

  updateOrderStatus(data: { orderId: string; status: number }) {
    return this.request<Order>(
      '/delivery/update-order-status',
      'POST',
      data
    );
  }

  // ------------------
  // Profile
  // ------------------
  getProfile(deliveryId: string) {
    return this.request<DeliveryUser>(
      `/delivery/profile?id=${deliveryId}`
    );
  }
}

// ------------------
// Export API instance
// ------------------
export const api = new ApiService(BASE_URL!);

// ------------------
// Helpers
// ------------------
export const getDeliveryId = async (): Promise<string | null> => {
  const userData = await AsyncStorage.getItem('deliveryUser');
  if (!userData) return null;

  const user = JSON.parse(userData);
  return user._id;
};
