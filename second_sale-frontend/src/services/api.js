import axios from 'axios';
import { getCacheKey, saveToCache, readFromCache } from '../utils/offlineCache';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token or admin token
api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('accessToken');
    
    // Prioritize adminToken for any /admin endpoint, or fallback to available token
    if (config.url?.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
});

// Response interceptor — cache successful GET requests, serve from cache when server is down, & auto-refresh on 401
api.interceptors.response.use(
  (response) => {
    // Cache consumer GET requests
    if (response.config?.method?.toLowerCase() === 'get' && !response.config.url?.includes('/admin')) {
      const cacheKey = getCacheKey('AXIOS', response.config.url);
      saveToCache(cacheKey, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Fallback to cache for GET requests if server is down (Network Error or >= 500)
    if (originalRequest?.method?.toLowerCase() === 'get' && (!error.response || error.response.status >= 500) && !originalRequest.url?.includes('/admin')) {
      const cacheKey = getCacheKey('AXIOS', originalRequest.url);
      const cached = readFromCache(cacheKey);
      if (cached) {
        console.info(`[OfflineCache] Serving cached Axios data for ${originalRequest.url}`);
        return Promise.resolve({
          data: cached,
          status: 200,
          statusText: 'OK (Offline Cache)',
          headers: {},
          config: originalRequest,
        });
      }
    }

    // Never run consumer refresh/redirect logic on admin endpoints
    if (originalRequest?.url?.includes('/admin')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
