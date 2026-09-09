import { Router } from 'express';
import multer from 'multer';
import {
  getHomepageConfig,
  adminUpdateSections,
  adminResetSections,
  uploadHomepageImage,
} from '../controllers/homepage.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

// ── Public Endpoint ──────────────────────────────────────────────────────────
router.get('/', getHomepageConfig);

// ── Admin Endpoints ──────────────────────────────────────────────────────────
router.get('/admin', adminAuth, getHomepageConfig);
router.put('/admin/sections', adminAuth, adminUpdateSections);
router.post('/admin/reset', adminAuth, adminResetSections);
router.post('/admin/upload-image', adminAuth, upload.single('image'), uploadHomepageImage);

export default router;

