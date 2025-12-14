/**
 * Service layer for sweet management business logic
 * Follows Single Responsibility Principle - handles only sweet-related business logic
 */

import Sweet, { ISweet } from '../models/Sweet';

interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image?: string;
  ingredients?: string[];
  weight?: string;
}

interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
  image?: string;
  ingredients?: string[];
  weight?: string;
}

interface SearchCriteria {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Get all sweets
 * @returns Array of all sweets sorted by creation date
 */
export const getAllSweets = async (): Promise<ISweet[]> => {
  return await Sweet.find().sort({ createdAt: -1 });
};

/**
 * Get sweet by ID
 * @param sweetId - Sweet ID
 * @returns Sweet data
 * @throws Error if sweet not found
 */
export const getSweetById = async (sweetId: string): Promise<ISweet> => {
  const sweet = await Sweet.findById(sweetId);
  
  if (!sweet) {
    throw new Error('Sweet not found');
  }

  return sweet;
};

/**
 * Search sweets with criteria
 * @param criteria - Search criteria
 * @returns Array of matching sweets
 */
export const searchSweets = async (criteria: SearchCriteria): Promise<ISweet[]> => {
  const { name, category, minPrice, maxPrice } = criteria;
  
  let query: any = {};

  // Text search
  if (name) {
    query.$text = { $search: name };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  return await Sweet.find(query);
};

/**
 * Create a new sweet
 * @param sweetData - Sweet creation data
 * @returns Created sweet
 */
export const createSweet = async (sweetData: CreateSweetData): Promise<ISweet> => {
  return await Sweet.create(sweetData);
};

/**
 * Update sweet by ID
 * @param sweetId - Sweet ID
 * @param updateData - Fields to update
 * @returns Updated sweet
 * @throws Error if sweet not found
 */
export const updateSweet = async (
  sweetId: string,
  updateData: UpdateSweetData
): Promise<ISweet> => {
  const sweet = await Sweet.findByIdAndUpdate(
    sweetId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  return sweet;
};

/**
 * Delete sweet by ID
 * @param sweetId - Sweet ID
 * @returns Deleted sweet
 * @throws Error if sweet not found
 */
export const deleteSweet = async (sweetId: string): Promise<ISweet> => {
  const sweet = await Sweet.findByIdAndDelete(sweetId);

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  return sweet;
};

/**
 * Purchase sweet - decrease quantity
 * @param sweetId - Sweet ID
 * @param quantity - Quantity to purchase
 * @returns Updated sweet
 * @throws Error if sweet not found or insufficient stock
 */
export const purchaseSweet = async (
  sweetId: string,
  quantity: number
): Promise<ISweet> => {
  if (!quantity || quantity <= 0) {
    throw new Error('Please provide a valid quantity');
  }

  const sweet = await Sweet.findById(sweetId);

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  if (sweet.quantity < quantity) {
    throw new Error('Insufficient stock');
  }

  sweet.quantity -= quantity;
  await sweet.save();

  return sweet;
};

/**
 * Restock sweet - increase quantity
 * @param sweetId - Sweet ID
 * @param quantity - Quantity to add
 * @returns Updated sweet
 * @throws Error if sweet not found or invalid quantity
 */
export const restockSweet = async (
  sweetId: string,
  quantity: number
): Promise<ISweet> => {
  if (!quantity || quantity <= 0) {
    throw new Error('Please provide a valid quantity');
  }

  const sweet = await Sweet.findById(sweetId);

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  sweet.quantity += quantity;
  await sweet.save();

  return sweet;
};
