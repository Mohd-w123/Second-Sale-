import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  getQuizByCategory,
  updateQuizByCategory,
  resetQuizToDefaults,
  getAllQuizCategories,
} from '../controllers/quiz.controller.js';

const router = Router();

// Admin routes (must precede /:category to avoid parameter capture)
router.get('/admin/all', adminAuth, getAllQuizCategories);
router.put('/admin/:category', adminAuth, updateQuizByCategory);
router.post('/admin/:category/reset', adminAuth, resetQuizToDefaults);

// Public route to fetch quiz configuration for users
router.get('/:category', getQuizByCategory);

export default router;
