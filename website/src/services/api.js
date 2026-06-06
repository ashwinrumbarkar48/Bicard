import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Resolve an uploaded image path ("/uploads/x.jpg") to an absolute URL. */
export const assetUrl = (path, fallback = '') => {
  if (!path) return fallback;
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_URL}${path}`;
};

export default api;
