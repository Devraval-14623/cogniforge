import axios from 'axios';

const api = axios.create({
  // Set VITE_API_URL to the deployed Express API, ending in /api.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
