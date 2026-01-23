import { getAccessToken } from '@/utils/storage';
import axios from 'axios';
import Constants from 'expo-constants';

/**
 * API Configuration for Django Backend
 * 
 * To use this:
 * 1. Create a .env file in the root directory
 * 2. Add: EXPO_PUBLIC_API_URL=http://your-django-server:8000/api
 * 3. For local development on Android emulator: http://10.0.2.2:8000/api
 * 4. For local development on iOS simulator: http://localhost:8000/api
 * 5. For physical device: http://YOUR_LOCAL_IP:8000/api
 */

// Get API URL from environment variables
export const API_URL = Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:8000/api';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // TODO: Implement token refresh logic
        // const refreshToken = await SecureStore.getItemAsync('refresh_token');
        // const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
        //   refresh: refreshToken,
        // });
        // const { access } = response.data;
        // await SecureStore.setItemAsync('access_token', access);
        // originalRequest.headers.Authorization = `Bearer ${access}`;
        // return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        // TODO: Clear stored tokens and navigate to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: 'auth/login/',
  REGISTER: 'auth/register/',
  LOGOUT: '/auth/logout/',
  TOKEN_REFRESH: '/auth/token/refresh/',
  PASSWORD_RESET: '/auth/password/reset/',
  PASSWORD_RESET_CONFIRM: '/auth/password/reset/confirm/',

  // User
  USER_PROFILE: '/users/profile/',
  USER_UPDATE: '/users/profile/update/',

  // Transactions
  TRANSACTIONS: '/transactions/',
  TRANSACTION_DETAIL: (id: number) => `/transactions/${id}/`,
  ADD_TRANSACTION: 'transactions/',

  // Accounts
  ACCOUNTS: '/accounts/',
  ACCOUNT_DETAIL: (id: number) => `/accounts/${id}/`,
  TOTAL_BALANCE: '/accounts/total_balance/',
  FINANCE_ACCOUNTS: '/accounts/',

  // Categories
  CATEGORIES: '/categories/',
  CATEGORY_SPENDING: '/categories/spending/',
} as const;

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data;

    if (typeof data === 'string') {
      return data;
    }

    if (data.detail) {
      return data.detail;
    }

    // Handle field-specific errors
    const firstError = Object.values(data)[0];
    if (Array.isArray(firstError)) {
      return firstError[0] as string;
    }

    return 'An error occurred. Please try again.';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/**-----------------------------------| 
        Add a new transaction           |
 -----------------------------------*/
export interface AddTransactionRequest {
  account: number;
  category: number;
  transaction_type: 'expense' | 'income';
  amount: number;
  description: string;
  date: string; // Format: YYYY-MM-DD
}

export const addTransaction = async (data: AddTransactionRequest) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ADD_TRANSACTION, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**-----------------------------------| 
        Add a new account             |
 ----------------------------------*/
export interface AddAccountRequest {
  name: string;
  account_type: string;
  balance: number;
  currency: string;
}

export const addAccount = async (data: AddAccountRequest) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ACCOUNTS, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTotalBalance = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TOTAL_BALANCE);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccounts = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountMetadata = async () => {
  try {
    const response = await apiClient.options(API_ENDPOINTS.ACCOUNTS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategorySpending = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORY_SPENDING);
    return response.data;
  } catch (error) {
    throw error;
  }
};
