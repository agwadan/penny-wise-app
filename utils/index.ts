/* ==== Function to make calls to the server ==== */

import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }

};