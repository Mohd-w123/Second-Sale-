import { Router } from 'express';
import {
  listPublishedPages,
  getPageBySlug,
  adminListAllPages,
  adminCreatePage,
  adminUpdatePage,
  adminDeletePage,
} from '../controllers/customPage.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

// ── Public Endpoints ─────────────────────────────────────────────────────────
router.get('/', listPublishedPages);
router.get('/:slug', getPageBySlug);

// ── Admin Endpoints ──────────────────────────────────────────────────────────
router.get('/admin/all', adminAuth, adminListAllPages);
router.post('/admin', adminAuth, adminCreatePage);
router.put('/admin/:id', adminAuth, adminUpdatePage);
router.delete('/admin/:id', adminAuth, adminDeletePage);

export default router;
