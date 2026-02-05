import { User } from '@/types/auth';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

const isWeb = Platform.OS === 'web';

/**
 * Save authentication tokens and user info
 */
export const saveAuthData = async (
  accessToken: string,
  refreshToken: string,
  user: User
) => {
  try {
    if (isWeb) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

/**
 * Get stored access token
 */
export const getAccessToken = async () => {
  try {
    if (isWeb) {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = async () => {
  try {
    if (isWeb) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Get stored user info
 */
export const getUserInfo = async (): Promise<User | null> => {
  try {
    const jsonUser = isWeb
      ? localStorage.getItem(USER_INFO_KEY)
      : await SecureStore.getItemAsync(USER_INFO_KEY);
    return jsonUser ? JSON.parse(jsonUser) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

/**
 * Clear all authentication data (logout)
 */
export const clearAuthData = async () => {
  try {
    if (isWeb) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_INFO_KEY);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_INFO_KEY);
    }
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};
