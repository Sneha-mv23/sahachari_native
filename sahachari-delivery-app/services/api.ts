import axios, { AxiosInstance } from 'axios';

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
  status: number;
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

// ------------------
// API Service
// ------------------
class ApiService {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any
  ): Promise<T> {
    const response = await this.axios.request<T>({
      url: endpoint,
      method,
      data: body,
    });

    return response.data;
  }

  signup(data: any) {
    return this.request('/delivery/signup', 'POST', data);
  }

  login(data: any) {
    return this.request('/delivery/login', 'POST', data);
  }

  getAvailableOrders() {
    return this.request<Order[]>('/delivery/get-orders');
  }
}

export const api = new ApiService(BASE_URL!);
