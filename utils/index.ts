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
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Formats a number to a compact string representation.
 * e.g., 1,900,000 -> 1.9M, 300,000 -> 300k
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return parseFloat((num / 1000000).toFixed(2)) + 'M';
  }
  if (num >= 1000) {
    return parseFloat((num / 1000).toFixed(0)) + 'k';
  }
  return num.toString();
};

/**
 * Formats a number with its currency abbreviation.
 * e.g., 1000, UGX -> UGX 1,000
 */
export const formatAmount = (amount: number | string, currency: string = 'UGX'): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${currency} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// Export API utilities for authentication and other features
export * from './api';
export * from './storage';
export * from './validation';

