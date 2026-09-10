import { Router } from 'express';
import {
  listRefurbished,
  getRefurbishedDevice,
  placeBuyOrder,
  getBuyOrder,
  getMyBuyOrders,
  adminListRefurbished,
  adminCreateRefurbished,
  adminUpdateRefurbished,
  adminDeleteRefurbished,
  adminListBuyOrders,
  adminUpdateBuyOrderStatus,
} from '../controllers/refurbished.controller.js';
import auth, { optionalAuth } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

// ── User Orders (Auth) ────────────────────────────────────────────────────────
router.get('/my-orders', auth, getMyBuyOrders);

// ── Public Catalog ────────────────────────────────────────────────────────────
router.get('/', listRefurbished);
router.get('/device/:slug', getRefurbishedDevice);
router.get('/:slug', getRefurbishedDevice);

// ── Public Orders (guest or authenticated) ────────────────────────────────────
router.post('/orders', optionalAuth, placeBuyOrder);
router.post('/order', optionalAuth, placeBuyOrder);
router.get('/orders/:orderId', getBuyOrder);
router.get('/order/:orderId', getBuyOrder);

// ── Admin endpoints ────────────────────────────────────────────────────────────
router.get('/admin/devices', adminAuth, adminListRefurbished);
router.post('/admin', adminAuth, adminCreateRefurbished);
router.put('/admin/:id', adminAuth, adminUpdateRefurbished);
router.delete('/admin/:id', adminAuth, adminDeleteRefurbished);
router.get('/admin/orders', adminAuth, adminListBuyOrders);
router.patch('/admin/orders/:orderId/status', adminAuth, adminUpdateBuyOrderStatus);

export default router;

