import '../setup';
import { Request, Response, NextFunction } from 'express';
import { protect, adminOnly, AuthRequest } from '../../src/middleware/auth';
import User from '../../src/models/User';
import { generateToken } from '../../src/utils/jwt';

describe('Auth Middleware Tests', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    
    mockReq = {
      headers: {},
    };
    
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    
    mockNext = jest.fn();
  });

  describe('protect middleware', () => {
    it('should fail when no token is provided', async () => {
      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail when token does not start with Bearer', async () => {
      mockReq.headers!.authorization = 'InvalidToken123';

      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail when token is invalid', async () => {
      mockReq.headers!.authorization = 'Bearer invalid_token';

      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail when user does not exist', async () => {
      const fakeUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
      const token = generateToken(fakeUserId);
      
      mockReq.headers!.authorization = `Bearer ${token}`;

      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should succeed with valid token and existing user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const token = generateToken(user._id.toString());
      mockReq.headers!.authorization = `Bearer ${token}`;

      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user._id.toString()).toBe(user._id.toString());
      expect(mockReq.user.email).toBe(user.email);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should attach user object to request', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'admin',
      });

      const token = generateToken(user._id.toString());
      mockReq.headers!.authorization = `Bearer ${token}`;

      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.name).toBe('John Doe');
      expect(mockReq.user.role).toBe('admin');
    });
  });

  describe('adminOnly middleware', () => {
    it('should allow access for admin users', () => {
      mockReq.user = {
        _id: 'user123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };

      adminOnly(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should deny access for regular users', () => {
      mockReq.user = {
        _id: 'user123',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
      };

      adminOnly(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Admin access required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', () => {
      mockReq.user = undefined;

      adminOnly(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Admin access required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Integration: protect + adminOnly', () => {
    it('should allow admin with valid token to access admin routes', async () => {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin',
      });

      const token = generateToken(admin._id.toString());
      mockReq.headers!.authorization = `Bearer ${token}`;

      // First apply protect middleware
      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      
      // Reset mocks
      mockNext = jest.fn();
      
      // Then apply adminOnly middleware
      adminOnly(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should deny regular user access to admin routes', async () => {
      const user = await User.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'Password123',
        role: 'user',
      });

      const token = generateToken(user._id.toString());
      mockReq.headers!.authorization = `Bearer ${token}`;

      // First apply protect middleware
      await protect(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(1);
      
      // Reset mocks
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      mockRes.status = statusMock;
      mockRes.json = jsonMock;
      mockNext = jest.fn();
      
      // Then apply adminOnly middleware
      adminOnly(mockReq as AuthRequest, mockRes as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
