import { Response } from 'express';
import Sweet from '../models/Sweet';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public
export const getSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Public
export const searchSweets = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query: any = {};

    // Text search
    if (name) {
      query.$text = { $search: name as string };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single sweet
// @route   GET /api/sweets/:id
// @access  Public
export const getSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await Sweet.create(req.body);

    res.status(201).json({
      success: true,
      data: sweet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sweet deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Purchase sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity',
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      message: 'Purchase successful',
      data: sweet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Restock sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
export const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity',
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      message: 'Restock successful',
      data: sweet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
