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

const router = express.Router();

// Public routes
router.get('/', getSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweet);

// Protected routes (authenticated users)
router.post('/:id/purchase', protect, purchaseSweet);

// Admin only routes
router.post('/', protect, adminOnly, createSweet);
router.put('/:id', protect, adminOnly, updateSweet);
router.delete('/:id', protect, adminOnly, deleteSweet);
router.post('/:id/restock', protect, adminOnly, restockSweet);

export default router;
