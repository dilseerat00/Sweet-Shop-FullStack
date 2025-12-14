import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Validation rules for user registration
 * Following SOLID principles - Single Responsibility for each validation set
 */
export const registerValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

/**
 * Validation rules for user login
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for creating a sweet
 */
export const createSweetValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Sweet name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Sweet name must be between 2 and 100 characters'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'])
    .withMessage('Invalid category'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('ingredients.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Ingredient cannot be empty'),
  
  body('weight')
    .optional()
    .trim()
    .matches(/^\d+(\.\d+)?\s*(g|kg|mg|oz|lb)$/i)
    .withMessage('Weight must be in format like: 250g, 1kg, 500mg'),
];

/**
 * Validation rules for updating a sweet
 */
export const updateSweetValidation: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid sweet ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Sweet name must be between 2 and 100 characters'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'])
    .withMessage('Invalid category'),
  
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('weight')
    .optional()
    .trim()
    .matches(/^\d+(\.\d+)?\s*(g|kg|mg|oz|lb)$/i)
    .withMessage('Weight must be in format like: 250g, 1kg, 500mg'),
];

/**
 * Validation rules for MongoDB ID parameters
 */
export const mongoIdValidation: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

/**
 * Validation rules for search queries
 */
export const searchValidation: ValidationChain[] = [
  query('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search name must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .trim()
    .isIn(['Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'])
    .withMessage('Invalid category'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number')
    .custom((value, { req }) => {
      if (req.query?.minPrice && parseFloat(value) < parseFloat(req.query.minPrice as string)) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),
];
