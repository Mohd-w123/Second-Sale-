import { Router } from 'express';
import {
  listRefurbished,
  getRefurbishedDevice,
  placeBuyOrder,
  getBuyOrder,
  adminListRefurbished,
  adminCreateRefurbished,
  adminUpdateRefurbished,
  adminDeleteRefurbished,
  adminListBuyOrders,
  adminUpdateBuyOrderStatus,
} from '../controllers/refurbished.controller.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

// ── Public Catalog ────────────────────────────────────────────────────────────
router.get('/', listRefurbished);
router.get('/device/:slug', getRefurbishedDevice);
router.get('/:slug', getRefurbishedDevice);

// ── Public Orders (no auth required — guest checkout) ─────────────────────────
router.post('/orders', placeBuyOrder);
router.post('/order', placeBuyOrder);
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
