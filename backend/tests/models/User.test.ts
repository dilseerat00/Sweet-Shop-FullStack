import '../setup';
import User from '../../src/models/User';

describe('User Model Tests', () => {
  describe('User Creation', () => {
    it('should create a valid user with required fields', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'user',
      };

      const user = await User.create(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
      expect(user.createdAt).toBeDefined();
    });

    it('should hash password before saving', async () => {
      const plainPassword = 'Password123';
      const user = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: plainPassword,
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(plainPassword.length);
    });

    it('should set default role to "user" if not specified', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(user.role).toBe('user');
    });

    it('should create admin user when role is specified', async () => {
      const user = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });
  });

  describe('User Validation', () => {
    it('should fail when name is missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when email is missing', async () => {
      const userData = {
        name: 'Test User',
        password: 'Password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when password is missing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when password is too short', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345', // Less than 6 characters
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail when email is duplicate', async () => {
      const userData = {
        name: 'User One',
        email: 'duplicate@example.com',
        password: 'Password123',
      };

      await User.create(userData);
      
      const duplicateUser = {
        name: 'User Two',
        email: 'duplicate@example.com',
        password: 'Password456',
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should trim whitespace from name and email', async () => {
      const user = await User.create({
        name: '  John Doe  ',
        email: '  john@example.com  ',
        password: 'Password123',
      });

      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('Password Comparison', () => {
    it('should correctly compare valid password', async () => {
      const plainPassword = 'Password123';
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword!.comparePassword(plainPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword!.comparePassword('WrongPassword');

      expect(isMatch).toBe(false);
    });

    it('should not return password by default', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const foundUser = await User.findById(user._id);

      expect(foundUser!.password).toBeUndefined();
    });

    it('should return password when explicitly selected', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const foundUser = await User.findById(user._id).select('+password');

      expect(foundUser!.password).toBeDefined();
    });
  });

  describe('Role Validation', () => {
    it('should accept valid role "user"', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'user',
      });

      expect(user.role).toBe('user');
    });

    it('should accept valid role "admin"', async () => {
      const user = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });

    it('should reject invalid role', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'superuser', // Invalid role
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });
});
