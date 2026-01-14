import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL  || 'http://localhost:3000/api';

if (!API_BASE_URL) {
  console.warn('⚠️ EXPO_PUBLIC_API_URL is not defined in .env');
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  serviceablePincode: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  token?: string;
}

export interface Order {
  _id: string;
  customerName: string;
  pickupLocation: string;
  deliveryLocation: string;
  amount: number;
  status: number; // 0=packing, 1=transit, 2=delivered
  createdAt: string;
  [key: string]: any;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private client: AxiosInstance;
  private deliveryId: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add token from AsyncStorage
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[API Request] Token added to headers');
          }
          // Get delivery ID for requests that need it
          const deliveryId = await AsyncStorage.getItem('deliveryId');
          if (deliveryId) {
            this.deliveryId = deliveryId;
          }
        } catch (error) {
          console.error('[API Request] Error getting token:', error);
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('[API Response]', response.config.url, response.status);
        return response;
      },
      async (error: AxiosError) => {
        const status = error.response?.status || 0;
        const message =
          (error.response?.data as any)?.message || error.message || 'Unknown error occurred';
        console.error('[API Error]', status, message);

        // Handle unauthorized errors
        if (status === 401) {
          console.warn('[API Error] Unauthorized - clearing stored data');
          try {
            await AsyncStorage.multiRemove(['token', 'deliveryUser', 'deliveryId', 'isLoggedIn']);
          } catch (clearError) {
            console.error('Error clearing AsyncStorage:', clearError);
          }
        }

        throw new ApiError(status, String(message), error.response?.data);
      },
    );
  }

  /**
   * Signup as a delivery partner
   * @param credentials - Signup data (name, email, password, serviceablePincode)
   * @returns Promise<AuthUser> - User object with _id
   * @throws ApiError with status and message
   */
  async signup(credentials: SignupPayload): Promise<AuthUser> {
    const { data } = await this.client.post<AuthUser>('/delivery/signup', credentials);
    
    // Store delivery ID and user data
    if (data._id) {
      await AsyncStorage.setItem('deliveryId', data._id);
      await AsyncStorage.setItem('deliveryUser', JSON.stringify(data));
    }
    
    return data;
  }

  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Promise<AuthUser> - User object with _id
   * @throws ApiError with status and message
   */
  async login(credentials: LoginPayload): Promise<AuthUser> {
    const { data } = await this.client.post<AuthUser>('/delivery/login', credentials);
    
    // Store delivery ID and user data
    if (data._id) {
      await AsyncStorage.setItem('deliveryId', data._id);
      await AsyncStorage.setItem('deliveryUser', JSON.stringify(data));
    }
    
    return data;
  }

  /**
   * Get available orders that haven't been picked up yet
   * @returns Promise<Order[]> - List of available orders
   * @throws ApiError with status and message
   */
  async getAvailableOrders(): Promise<Order[]> {
    const { data } = await this.client.get<Order[]>('/delivery/get-orders');
    return data;
  }

  /**
   * Accept an available order
   * @param orderId - ID of the order to accept
   * @param deliveryId - ID of the delivery person accepting the order
   * @returns Promise<any> - Confirmation response
   * @throws ApiError with status and message
   */
  async acceptOrder(orderId: string, deliveryId: string): Promise<any> {
    const { data } = await this.client.post('/delivery/added-orders', {
      deliveryId,
      orderId,
    });
    return data;
  }

  /**
   * Get accepted orders for a delivery person
   * @param deliveryId - ID of the delivery person (optional, uses stored ID if not provided)
   * @returns Promise<Order[]> - List of accepted orders
   * @throws ApiError with status and message
   */
  async getAcceptedOrders(deliveryId?: string): Promise<Order[]> {
    const id = deliveryId || this.deliveryId || (await AsyncStorage.getItem('deliveryId'));
    if (!id) {
      throw new ApiError(400, 'Delivery ID is required');
    }
    const { data } = await this.client.get<Order[]>('/delivery/get-added-orders', {
      params: { id },
    });
    return data;
  }

  /**
   * Mark order as picked up
   * @param orderId - ID of the order
   * @returns Promise<any> - Confirmation response
   * @throws ApiError with status and message
   */
  async markOrderPickedUp(orderId: string): Promise<any> {
    const { data } = await this.client.post(`/delivery/orders/${orderId}/pickup`, {});
    return data;
  }

  /**
   * Update order delivery status
   * @param orderId - ID of the order
   * @param status - New delivery status (0=packing, 1=transit, 2=delivered)
   * @returns Promise<any> - Updated order
   * @throws ApiError with status and message
   */
  async updateOrderStatus(orderId: string, status: number): Promise<any> {
    const { data } = await this.client.patch(`/delivery/orders/${orderId}`, { status });
    return data;
  }

  /**
   * Logout user
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await this.client.post('/delivery/logout');
    } finally {
      // Clear token and user data from AsyncStorage
      await AsyncStorage.multiRemove(['token', 'deliveryUser', 'deliveryId', 'isLoggedIn']);
      this.deliveryId = null;
    }
  }

  /**
   * Check API connectivity
   * @returns Promise<boolean> - true if API is reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();
