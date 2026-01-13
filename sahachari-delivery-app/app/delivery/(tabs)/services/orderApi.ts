import axios, { AxiosInstance, AxiosError } from 'axios';
import { Order } from '../types';

// Configure your API base URL here
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

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

class OrderApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authorization token if needed
        // const token = await getAuthToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
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
      (error: AxiosError) => {
        const status = error.response?.status || 0;
        const message =
          (error.response?.data as any)?.message || error.message || 'Unknown error occurred';
        console.error('[API Error]', status, message);

        throw new ApiError(status, String(message), error.response?.data);
      },
    );
  }

  /**
   * Fetch available orders for delivery
   * @returns Promise<Order[]> - List of available orders
   * @throws ApiError with status and message
   */
  async getAvailableOrders(): Promise<Order[]> {
    const { data } = await this.client.get<Order[]>('/orders/available');
    return data;
  }

  /**
   * Fetch user's active deliveries
   * @param deliveryId - ID of the delivery person
   * @returns Promise<Order[]> - List of orders assigned to this delivery person
   * @throws ApiError with status and message
   */
  async getMyDeliveries(deliveryId: string): Promise<Order[]> {
    const { data } = await this.client.get<Order[]>(`/deliveries/${deliveryId}/orders`);
    return data;
  }

  /**
   * Accept an available order
   * @param orderId - ID of the order to accept
   * @param deliveryId - ID of the delivery person accepting the order
   * @returns Promise<Order> - Updated order object
   * @throws ApiError with status and message
   */
  async acceptOrder(orderId: string, deliveryId: string): Promise<Order> {
    const { data } = await this.client.post<Order>(`/orders/${orderId}/accept`, {
      deliveryId,
    });
    return data;
  }

  /**
   * Update order delivery status
   * @param orderId - ID of the order
   * @param status - New delivery stage (0=packing, 1=transit, 2=delivered)
   * @returns Promise<Order> - Updated order object
   * @throws ApiError with status and message
   */
  async updateOrderStatus(orderId: string, status: number): Promise<Order> {
    const { data } = await this.client.patch<Order>(`/orders/${orderId}`, { status });
    return data;
  }

  /**
   * Get detailed information about a specific order
   * @param orderId - ID of the order
   * @returns Promise<Order> - Detailed order object
   * @throws ApiError with status and message
   */
  async getOrderDetails(orderId: string): Promise<Order> {
    const { data } = await this.client.get<Order>(`/orders/${orderId}`);
    return data;
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

export const orderApiClient = new OrderApiClient();
