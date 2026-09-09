import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  resetCategories,
} from '../controllers/category.controller.js';

const router = Router();

// Public — frontend client fetches active categories for Navbar & Filters
router.get('/', getCategories);

// Admin-protected endpoints
router.get('/admin', adminAuth, getAdminCategories);
router.post('/', adminAuth, createCategory);
router.patch('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);
router.post('/reorder', adminAuth, reorderCategories);
router.post('/reset', adminAuth, resetCategories);

export default router;
