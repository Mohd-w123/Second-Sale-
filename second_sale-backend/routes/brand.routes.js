import { Router } from 'express';
import multer from 'multer';
import adminAuth, { requirePermission } from '../middleware/adminAuth.js';
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  uploadDeviceImage,
} from '../controllers/brand.controller.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Public endpoints
router.get('/', getAllBrands);
router.get('/:id', getBrandById);

// Admin endpoints
router.post('/upload-logo', adminAuth, requirePermission('devices'), upload.single('logo'), uploadBrandLogo);
router.post('/upload-image', adminAuth, requirePermission('devices'), upload.single('image'), uploadDeviceImage);

router.post('/', adminAuth, requirePermission('devices'), createBrand);
router.put('/:id', adminAuth, requirePermission('devices'), updateBrand);
router.delete('/:id', adminAuth, requirePermission('devices'), deleteBrand);

export default router;
