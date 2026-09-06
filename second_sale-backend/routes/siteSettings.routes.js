import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  getSettings,
  uploadLogo,
  addBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  upload,
} from '../controllers/siteSettings.controller.js';

const router = Router();

// Public — frontend fetches current settings
router.get('/', getSettings);

// Admin-protected
router.use(adminAuth);
router.post('/logo', upload.single('logo'), uploadLogo);
router.post('/banners', upload.single('banner'), addBanner);
router.patch('/banners/:bannerId', updateBanner);
router.delete('/banners/:bannerId', deleteBanner);
router.post('/banners/reorder', reorderBanners);

export default router;
