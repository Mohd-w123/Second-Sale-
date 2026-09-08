import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach admin token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, redirect to admin login (except on the login request itself)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/admin/login');
    if ((error.response?.status === 401 || error.response?.status === 403) && !isLoginRequest) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminService = {
  // Auth
  login: (credentials) => adminApi.post('/admin/login', credentials),

  // Dashboard
  getStats: () => adminApi.get('/admin/stats'),

  // Users
  getUsers: (params) => adminApi.get('/admin/users', { params }),
  getUserById: (id) => adminApi.get(`/admin/users/${id}`),

  // Devices
  getDevices: (params) => adminApi.get('/admin/devices', { params }),
  getDeviceById: (id) => adminApi.get(`/admin/devices/${id}`),
  createDevice: (data) => adminApi.post('/admin/devices', data),
  updateDevice: (id, data) => adminApi.put(`/admin/devices/${id}`, data),
  deleteDevice: (id) => adminApi.delete(`/admin/devices/${id}`),

  // Partners
  getPartners: (params) => adminApi.get('/admin/partners', { params }),

  // Orders
  getOrders: (params) => adminApi.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => adminApi.patch(`/admin/orders/${id}/status`, { status }),

  // Pincodes
  getPincodes: (params) => adminApi.get('/admin/pincodes', { params }),
  createPincode: (data) => adminApi.post('/admin/pincodes', data),
  updatePincode: (id, data) => adminApi.put(`/admin/pincodes/${id}`, data),
  deletePincode: (id) => adminApi.delete(`/admin/pincodes/${id}`),

  // TV Leads
  getTvLeads: (params) => adminApi.get("/tv-leads", { params }),
  getTvLeadById: (id) => adminApi.get(`/tv-leads/${id}`),
  updateTvLeadStatus: (id, data) => adminApi.patch(`/tv-leads/${id}`, data),
  deleteTvLead: (id) => adminApi.delete(`/tv-leads/${id}`),

  // Refurbished Management
  getRefurbishedDevices: (params) => adminApi.get('/refurbished/admin/devices', { params }),
  createRefurbishedDevice: (data) => adminApi.post('/refurbished/admin', data),
  updateRefurbishedDevice: (id, data) => adminApi.put(`/refurbished/admin/${id}`, data),
  deleteRefurbishedDevice: (id, params) => adminApi.delete(`/refurbished/admin/${id}`, { params }),
  getRefurbishedOrders: (params) => adminApi.get('/refurbished/admin/orders', { params }),
  updateRefurbishedOrderStatus: (orderId, data) => adminApi.patch(`/refurbished/admin/orders/${orderId}/status`, data),
};

export default adminApi;
