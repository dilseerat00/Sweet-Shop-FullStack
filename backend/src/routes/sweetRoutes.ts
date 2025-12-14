import express from 'express';
import {
  getSweets,
  getSweet,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweetController';
import { protect, adminOnly } from '../middleware/auth';
import {
  createSweetValidation,
  updateSweetValidation,
  mongoIdValidation,
  searchValidation,
} from '../middleware/validators';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = express.Router();

// Public routes
router.get('/', getSweets);
router.get('/search', searchValidation, handleValidationErrors, searchSweets);
router.get('/:id', mongoIdValidation, handleValidationErrors, getSweet);

// Protected routes (authenticated users)
router.post('/:id/purchase', protect, mongoIdValidation, handleValidationErrors, purchaseSweet);

// Admin only routes
router.post('/', protect, adminOnly, createSweetValidation, handleValidationErrors, createSweet);
router.put('/:id', protect, adminOnly, updateSweetValidation, handleValidationErrors, updateSweet);
router.delete('/:id', protect, adminOnly, mongoIdValidation, handleValidationErrors, deleteSweet);
router.post('/:id/restock', protect, adminOnly, mongoIdValidation, handleValidationErrors, restockSweet);

export default router;
