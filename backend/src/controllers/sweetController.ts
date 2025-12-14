import { Response } from 'express';
import * as sweetService from '../services/sweetService';
import { AuthRequest } from '../middleware/auth';

/**
 * Controller for sweet management endpoints
 * Follows Single Responsibility Principle - only handles HTTP requests/responses
 * Business logic delegated to sweetService
 */

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public
export const getSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await sweetService.getAllSweets();

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

    const criteria: any = {};
    if (name) criteria.name = name as string;
    if (category) criteria.category = category as string;
    if (minPrice) criteria.minPrice = Number(minPrice);
    if (maxPrice) criteria.maxPrice = Number(maxPrice);

    const sweets = await sweetService.searchSweets(criteria);

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
    const sweet = await sweetService.getSweetById(req.params.id!);

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error: any) {
    const statusCode = error.message === 'Sweet not found' ? 404 : 500;
    res.status(statusCode).json({
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
    const sweet = await sweetService.createSweet(req.body);

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
    const sweet = await sweetService.updateSweet(req.params.id!, req.body);

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error: any) {
    const statusCode = error.message === 'Sweet not found' ? 404 : 500;
    res.status(statusCode).json({
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
    await sweetService.deleteSweet(req.params.id!);

    res.status(200).json({
      success: true,
      message: 'Sweet deleted successfully',
    });
  } catch (error: any) {
    const statusCode = error.message === 'Sweet not found' ? 404 : 500;
    res.status(statusCode).json({
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
    const sweet = await sweetService.purchaseSweet(req.params.id!, quantity);

    res.status(200).json({
      success: true,
      message: 'Purchase successful',
      data: sweet,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.message === 'Sweet not found') statusCode = 404;
    else if (error.message.includes('Insufficient stock') || error.message.includes('valid quantity')) statusCode = 400;

    res.status(statusCode).json({
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
    const sweet = await sweetService.restockSweet(req.params.id!, quantity);

    res.status(200).json({
      success: true,
      message: 'Restock successful',
      data: sweet,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.message === 'Sweet not found') statusCode = 404;
    else if (error.message.includes('valid quantity')) statusCode = 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
