import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const categoryService = {
  // Public
  getCategories: () => axios.get(`${API_BASE}/categories`),

  // Admin
  getAdminCategories: () => adminApi.get('/categories/admin'),
  createCategory: (data) => adminApi.post('/categories', data),
  updateCategory: (id, data) => adminApi.patch(`/categories/${id}`, data),
  deleteCategory: (id) => adminApi.delete(`/categories/${id}`),
  reorderCategories: (orderedIds) => adminApi.post('/categories/reorder', { orderedIds }),
  resetCategories: () => adminApi.post('/categories/reset'),
};
