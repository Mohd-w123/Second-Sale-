import api from './api';

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.patch(`/orders/${orderId}/cancel`),
  rescheduleOrder: (orderId, data) => api.patch(`/orders/${orderId}/reschedule`, data),
  updatePaymentMethod: (orderId, paymentMethod) => api.patch(`/orders/${orderId}/payment`, { paymentMethod }),
  getRefurbishedOrders: () => api.get('/refurbished/my-orders'),
  getRefurbishedOrder: (orderId) => api.get(`/refurbished/order/${orderId}`),
  // Repair orders
  createRepairOrder: (data) => api.post('/repair-orders', data),
  getRepairOrders: () => api.get('/repair-orders'),
  getRepairOrder: (orderId) => api.get(`/repair-orders/${orderId}`),
  cancelRepairOrder: (orderId) => api.patch(`/repair-orders/${orderId}/cancel`),
};
