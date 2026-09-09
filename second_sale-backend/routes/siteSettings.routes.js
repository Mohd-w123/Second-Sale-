import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  getSettings,
  uploadLogo,
  addBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  addNavLink,
  updateNavLink,
  deleteNavLink,
  resetNavLinks,
  reorderNavLinks,
  uploadFavicon,
  updateTopBar,
  updateFooter,
  upload,
} from '../controllers/siteSettings.controller.js';

const router = Router();

// Public — frontend fetches current settings & nav
router.get('/', getSettings);

// Admin-protected
router.use(adminAuth);
router.post('/logo', upload.single('logo'), uploadLogo);
router.post('/favicon', upload.single('favicon'), uploadFavicon);
router.put('/top-bar', updateTopBar);
router.put('/footer', updateFooter);
router.post('/banners', upload.single('banner'), addBanner);
router.patch('/banners/:bannerId', updateBanner);
router.delete('/banners/:bannerId', deleteBanner);
router.post('/banners/reorder', reorderBanners);

// Nav links management
router.post('/nav-links', addNavLink);
router.post('/nav-links/reorder', reorderNavLinks);
router.patch('/nav-links/:linkId', updateNavLink);
router.delete('/nav-links/:linkId', deleteNavLink);
router.post('/nav-links/reset', resetNavLinks);

export default router;
