import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_URL });

// Attach JWT from localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bicard_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear session and bounce to login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !location.pathname.includes('/login')) {
      localStorage.removeItem('bicard_token');
      localStorage.removeItem('bicard_user');
      location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const assetUrl = (path, fallback = '') => {
  if (!path) return fallback;
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_URL}${path}`;
};

export default api;
