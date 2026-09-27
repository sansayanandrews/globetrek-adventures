import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('globetrek_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized or token invalid, clear localStorage
    if (error.response && (error.response.status === 401 || error.response.data?.error?.code === 'INVALID_TOKEN')) {
      if (localStorage.getItem('globetrek_token')) {
        localStorage.removeItem('globetrek_token');
        localStorage.removeItem('globetrek_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
