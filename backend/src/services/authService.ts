/**
 * Service layer for authentication business logic
 * Follows Single Responsibility Principle - handles only auth-related business logic
 */

import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

interface LoginUserData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Auth response with token and user data
 * @throws Error if user already exists
 */
export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
  });

  // Generate token
  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Authenticate user and generate token
 * @param credentials - User login credentials
 * @returns Auth response with token and user data
 * @throws Error if credentials are invalid
 */
export const loginUser = async (credentials: LoginUserData): Promise<AuthResponse> => {
  const { email, password } = credentials;

  // Check for user (include password field)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Get user by ID
 * @param userId - User ID
 * @returns User data without password
 * @throws Error if user not found
 */
export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
