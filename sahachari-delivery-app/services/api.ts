import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure your API base URL here
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

if (!API_BASE_URL) {
  console.warn('⚠️ EXPO_PUBLIC_API_URL is not defined in .env');
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'delivery' | 'admin' | 'user';
  token: string;
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
            await AsyncStorage.multiRemove(['token', 'deliveryUser', 'isLoggedIn']);
          } catch (clearError) {
            console.error('Error clearing AsyncStorage:', clearError);
          }
        }

        throw new ApiError(status, String(message), error.response?.data);
      },
    );
  }

  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Promise<AuthUser> - User object with authentication token
   * @throws ApiError with status and message
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data } = await this.client.post<AuthUser>('/auth/login', credentials);
    
    // Store token in AsyncStorage for future requests
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }
    
    return data;
  }

  /**
   * Register a new delivery partner
   * @param credentials - Registration data
   * @returns Promise<AuthUser> - User object with authentication token
   * @throws ApiError with status and message
   */
  async signup(credentials: any): Promise<AuthUser> {
    const { data } = await this.client.post<AuthUser>('/auth/signup', credentials);
    
    // Store token in AsyncStorage for future requests
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }
    
    return data;
  }

  /**
   * Logout user
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      // Clear token from AsyncStorage
      await AsyncStorage.multiRemove(['token', 'deliveryUser', 'isLoggedIn']);
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
