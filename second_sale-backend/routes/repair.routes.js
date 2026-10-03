import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  getRepairBrands,
  getRepairModels,
  getRepairModelDetail,
  getRepairServiceTypes,
  createRepairOrder,
  getUserRepairOrders,
  getRepairOrderById,
  cancelRepairOrder,
  adminGetRepairStats,
  adminListRepairDevices,
  adminCreateRepairDevice,
  adminUpdateRepairDevice,
  adminDeleteRepairDevice,
  adminListRepairOrders,
  adminUpdateRepairOrderStatus,
  adminSeedDefaultRepairs,
  adminListRepairBrands,
  adminCreateRepairBrand,
  adminUpdateRepairBrand,
  adminDeleteRepairBrand,
  adminUploadRepairBrandLogo,
  adminUploadRepairDeviceImage,
} from '../controllers/repair.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

// ── Public Routes (Dynamic Brands, Models & Services) ──────────────────────────
router.get('/brands', getRepairBrands);
router.get('/models', getRepairModels);
router.get('/models/:brandSlug/:modelSlug', getRepairModelDetail);
router.get('/services', getRepairServiceTypes);

// ── User Doorstep Repair Bookings (Requires user auth) ─────────────────────────
const bookingValidation = [
  body('device').isObject().withMessage('Device info is required'),
  body('device.brand').trim().notEmpty().withMessage('Device brand is required'),
  body('device.modelName').trim().notEmpty().withMessage('Device model name is required'),
  body('services').isArray({ min: 1 }).withMessage('At least one repair service is required'),
  body('totalAmount').isNumeric().withMessage('Total amount is required'),
  body('pickup').isObject().withMessage('Pickup details are required'),
  body('pickup.name').trim().notEmpty().withMessage('Name is required'),
  body('pickup.phone').trim().notEmpty().withMessage('Phone is required'),
  body('pickup.address').trim().notEmpty().withMessage('Address is required'),
  body('pickup.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('pickup.date').trim().notEmpty().withMessage('Date is required'),
  body('pickup.timeSlot').trim().notEmpty().withMessage('Time slot is required'),
  body('pickup.paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
];

router.post('/', auth, bookingValidation, createRepairOrder);
router.post('/orders', auth, bookingValidation, createRepairOrder);
router.get('/my-orders', auth, getUserRepairOrders);
router.get('/orders/:orderId', auth, getRepairOrderById);
router.patch('/orders/:orderId/cancel', auth, cancelRepairOrder);
router.patch('/:orderId/cancel', auth, cancelRepairOrder);

// ── Admin Endpoints (Requires adminAuth) ───────────────────────────────────────
router.get('/admin/stats', adminAuth, adminGetRepairStats);
router.get('/admin/brands', adminAuth, adminListRepairBrands);
router.post('/admin/brands', adminAuth, adminCreateRepairBrand);
router.put('/admin/brands/:id', adminAuth, adminUpdateRepairBrand);
router.delete('/admin/brands/:id', adminAuth, adminDeleteRepairBrand);
router.post('/admin/upload-logo', adminAuth, upload.single('logo'), adminUploadRepairBrandLogo);
router.post('/admin/upload-image', adminAuth, upload.single('image'), adminUploadRepairDeviceImage);

router.get('/admin/devices', adminAuth, adminListRepairDevices);
router.post('/admin/devices', adminAuth, adminCreateRepairDevice);
router.put('/admin/devices/:id', adminAuth, adminUpdateRepairDevice);
router.delete('/admin/devices/:id', adminAuth, adminDeleteRepairDevice);
router.get('/admin/orders', adminAuth, adminListRepairOrders);
router.patch('/admin/orders/:id/status', adminAuth, adminUpdateRepairOrderStatus);
router.post('/admin/seed', adminAuth, adminSeedDefaultRepairs);

export default router;
