import axios from 'axios';
import { API_URL } from '../config';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

export const authService = {
  register,
  login,
  logout,
  forgotPassword
};