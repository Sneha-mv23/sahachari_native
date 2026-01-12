// API Configuration
import axios, { AxiosInstance } from 'axios';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL as string; // Replace with your actual backend URL

// Types
export interface Order {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  price: number;
  status: number; // 0 = available, 1 = accepted, 2 = picked-up, 3 = delivered
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

// API Service
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

  // Helper method for making requests
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const response = await this.axios.request<T>({
        url: endpoint,
        method: method.toLowerCase() as any,
        data: body,
      });

      return response.data;
    } catch (error: any) {
      // If server responded with an error payload
      if (error.response) {
        const msg =
          error.response.data?.message ||
          error.response.statusText ||
          `HTTP error! status: ${error.response.status}`;
        console.error(`API Error (${endpoint}):`, error.response.data || error.message);
        throw new Error(msg);
      }

      // Network or other errors
      console.error(`API Error (${endpoint}):`, error.message || error);
      throw error;
    }
  }

  // A. Signup
  async signup(data: {
    name: string;
    email: string;
    password: string;
    pincodes: string[];
  }): Promise<DeliveryUser> {
    return this.request<DeliveryUser>('/delivery/signup', 'POST', data);
  }

  // B. Login
  async login(data: {
    email: string;
    password: string;
  }): Promise<DeliveryUser> {
    return this.request<DeliveryUser>('/delivery/login', 'POST', data);
  }

  // C. Get Available Orders (status: 0)
  async getAvailableOrders(): Promise<Order[]> {
    return this.request<Order[]>('/delivery/get-orders', 'GET');
  }

  // D. Accept Order
  async acceptOrder(data: {
    deliveryId: string;
    orderId: string;
  }): Promise<AcceptedOrder> {
    return this.request<AcceptedOrder>('/delivery/added-orders', 'POST', data);
  }

  // E. Get My History (accepted orders)
  async getMyOrders(deliveryId: string): Promise<AcceptedOrder[]> {
    return this.request<AcceptedOrder[]>(
      `/delivery/get-added-orders?id=${deliveryId}`,
      'GET'
    );
  }

  // F. Update Order Status (you might need this)
  async updateOrderStatus(data: {
    orderId: string;
    status: number; // 2 = picked-up, 3 = delivered
  }): Promise<Order> {
    return this.request<Order>('/delivery/update-order-status', 'POST', data);
  }

  // G. Get Delivery Profile
  async getProfile(deliveryId: string): Promise<DeliveryUser> {
    return this.request<DeliveryUser>(`/delivery/profile?id=${deliveryId}`, 'GET');
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL);

// Helper to get delivery ID from storage
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDeliveryId = async (): Promise<string | null> => {
  const userData = await AsyncStorage.getItem('deliveryUser');
  if (userData) {
    const user = JSON.parse(userData);
    return user._id;
  }
  return null;
};