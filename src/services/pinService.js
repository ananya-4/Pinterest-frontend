import axios from 'axios';
import { API_URL } from '../config';

export const getPins = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/pins`); // Fixed the endpoint path
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPin = async (pinData) => {
  try {
    const token = localStorage.getItem('token'); // Changed token retrieval
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/api/pins`, pinData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchPins = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/api/pins/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};