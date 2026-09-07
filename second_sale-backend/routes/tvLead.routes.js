import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  createTvLead,
  getTvLeads,
  getTvLeadById,
  updateTvLeadStatus,
  deleteTvLead,
  uploadTvPhotos,
} from '../controllers/tvLead.controller.js';

const router = Router();

// Public route: Submit TV quote request with photos
router.post('/', uploadTvPhotos, createTvLead);

// Admin-protected routes
router.use(adminAuth);
router.get('/', getTvLeads);
router.get('/:id', getTvLeadById);
router.patch('/:id', updateTvLeadStatus);
router.delete('/:id', deleteTvLead);

export default router;
