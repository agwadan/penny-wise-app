import { apiClient } from './api';

/**
 * Perform a GET request to the specified endpoint
 */
export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Perform a POST request to the specified endpoint with data
 */
export const postData = async (endpoint: string, data: any) => {
  console.log('endpoint', endpoint);
  console.log('data', data);
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

// Export API utilities for authentication and other features
export * from './api';
export * from './storage';
export * from './validation';

