<<<<<<< HEAD
import axios, { AxiosInstance } from 'axios';
=======
import axios,{ AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> 5250b6530a7a1dabfdba8b438226f4dad449c8aa

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


export interface AuthResponse {
  user: DeliveryUser;
  token: string;
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
<<<<<<< HEAD
    const response = await this.axios.request<T>({
      url: endpoint,
      method,
      data: body,
    });

    return response.data;
=======
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
>>>>>>> 5250b6530a7a1dabfdba8b438226f4dad449c8aa
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
