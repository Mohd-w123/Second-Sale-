import { Router } from 'express';
import adminAuth, { requirePermission } from '../middleware/adminAuth.js';
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getUserById,
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getAllPartners,
  updatePartnerStatus,
  getAllOrders,
  updateOrderStatus,
  getAllPincodes,
  createPincode,
  updatePincode,
  deletePincode,
  getAllSalesUsers,
  createSalesUser,
  updateSalesUser,
  deleteSalesUser,
} from '../controllers/admin.controller.js';

const router = Router();

// Public admin login
router.post('/login', adminLogin);

// All routes below require admin auth
router.use(adminAuth);

// Dashboard
router.get('/stats', requirePermission('dashboard'), getDashboardStats);

// Users (Customers)
router.get('/users', requirePermission('users'), getAllUsers);
router.get('/users/:id', requirePermission('users'), getUserById);

// Devices
router.get('/devices', requirePermission('devices'), getAllDevices);
router.get('/devices/:id', requirePermission('devices'), getDeviceById);
router.post('/devices', requirePermission('devices'), createDevice);
router.put('/devices/:id', requirePermission('devices'), updateDevice);
router.delete('/devices/:id', requirePermission('devices'), deleteDevice);

// Partners
router.get('/partners', requirePermission('partners'), getAllPartners);
router.patch('/partners/:id/status', requirePermission('partners'), updatePartnerStatus);

// Orders
router.get('/orders', requirePermission('orders'), getAllOrders);
router.patch('/orders/:id/status', requirePermission('orders'), updateOrderStatus);

// Pincodes
router.get('/pincodes', requirePermission('pincodes'), getAllPincodes);
router.post('/pincodes', requirePermission('pincodes'), createPincode);
router.put('/pincodes/:id', requirePermission('pincodes'), updatePincode);
router.delete('/pincodes/:id', requirePermission('pincodes'), deletePincode);

// Sales Users & Staff Management (Superadmin only or users with sales-users permission)
router.get('/sales-users', requirePermission('sales-users'), getAllSalesUsers);
router.post('/sales-users', requirePermission('sales-users'), createSalesUser);
router.put('/sales-users/:id', requirePermission('sales-users'), updateSalesUser);
router.delete('/sales-users/:id', requirePermission('sales-users'), deleteSalesUser);

export default router;
