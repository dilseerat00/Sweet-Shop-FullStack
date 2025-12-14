import '../setup';
import request from 'supertest';
import express, { Express } from 'express';
import sweetRoutes from '../../src/routes/sweetRoutes';
import Sweet from '../../src/models/Sweet';
import User from '../../src/models/User';
import { generateToken } from '../../src/utils/jwt';

describe('Sweet Controller Integration Tests', () => {
  let app: Express;
  let adminToken: string;
  let userToken: string;
  let testSweet: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/sweets', sweetRoutes);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123',
      role: 'admin',
    });
    adminToken = generateToken(admin._id.toString());

    // Create regular user
    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'Password123',
      role: 'user',
    });
    userToken = generateToken(user._id.toString());
  });

  beforeEach(async () => {
    // Create a test sweet before each test
    testSweet = await Sweet.create({
      name: 'Test Sweet',
      category: 'Milk-based',
      price: 200,
      quantity: 50,
      description: 'Test description for sweet',
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return sweets sorted by creation date', async () => {
      await Sweet.create({
        name: 'Sweet A',
        category: 'Syrup-based',
        price: 150,
        quantity: 30,
        description: 'Description A',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await Sweet.create({
        name: 'Sweet B',
        category: 'Dry Fruits',
        price: 300,
        quantity: 20,
        description: 'Description B',
      });

      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.data[0].name).toBe('Sweet B'); // Most recent first
    });

    it('should return empty array when no sweets exist', async () => {
      await Sweet.deleteMany({});

      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/sweets/:id', () => {
    it('should get single sweet by ID', async () => {
      const response = await request(app)
        .get(`/api/sweets/${testSweet._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(testSweet.name);
      expect(response.body.data.price).toBe(testSweet.price);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/sweets/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Sweet not found');
    });

    it('should return 400 for invalid MongoDB ID', async () => {
      const response = await request(app)
        .get('/api/sweets/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        {
          name: 'Chocolate Barfi',
          category: 'Special',
          price: 300,
          quantity: 40,
          description: 'Rich chocolate flavored barfi',
        },
        {
          name: 'Kaju Katli',
          category: 'Dry Fruits',
          price: 500,
          quantity: 25,
          description: 'Premium cashew sweet',
        },
        {
          name: 'Rasgulla',
          category: 'Milk-based',
          price: 150,
          quantity: 60,
          description: 'Spongy rasgulla in sugar syrup',
        },
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].name).toBe('Chocolate Barfi');
    });

    it('should filter sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Dry Fruits')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((s: any) => s.category === 'Dry Fruits')).toBe(true);
    });

    it('should filter by minimum price', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=300')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((s: any) => s.price >= 300)).toBe(true);
    });

    it('should filter by maximum price', async () => {
      const response = await request(app)
        .get('/api/sweets/search?maxPrice=200')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((s: any) => s.price <= 200)).toBe(true);
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=150&maxPrice=300')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((s: any) => s.price >= 150 && s.price <= 300)).toBe(true);
    });

    it('should fail when maxPrice is less than minPrice', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=300&maxPrice=100')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with invalid category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=InvalidCategory')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create sweet with admin token', async () => {
      const sweetData = {
        name: 'New Sweet',
        category: 'Syrup-based',
        price: 250,
        quantity: 40,
        description: 'A delicious new sweet item',
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sweetData.name);
      expect(response.body.data.price).toBe(sweetData.price);
    });

    it('should fail without authentication', async () => {
      const sweetData = {
        name: 'New Sweet',
        category: 'Syrup-based',
        price: 250,
        quantity: 40,
        description: 'A delicious new sweet item',
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with regular user token', async () => {
      const sweetData = {
        name: 'New Sweet',
        category: 'Syrup-based',
        price: 250,
        quantity: 40,
        description: 'A delicious new sweet item',
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should fail with missing required fields', async () => {
      const incompleteData = {
        name: 'New Sweet',
        price: 250,
        // Missing category, quantity, description
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with invalid price', async () => {
      const sweetData = {
        name: 'New Sweet',
        category: 'Syrup-based',
        price: -100, // Invalid negative price
        quantity: 40,
        description: 'A delicious new sweet item',
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid category', async () => {
      const sweetData = {
        name: 'New Sweet',
        category: 'Invalid Category',
        price: 250,
        quantity: 40,
        description: 'A delicious new sweet item',
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with short description', async () => {
      const sweetData = {
        name: 'New Sweet',
        category: 'Syrup-based',
        price: 250,
        quantity: 40,
        description: 'Short', // Too short
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update sweet with admin token', async () => {
      const updateData = {
        price: 300,
        quantity: 75,
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.quantity).toBe(updateData.quantity);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .send({ price: 300 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with regular user token', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 300 })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 300 })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid MongoDB ID', async () => {
      const response = await request(app)
        .put('/api/sweets/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 300 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete sweet with admin token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sweet deleted successfully');

      // Verify deletion
      const deleted = await Sweet.findById(testSweet._id);
      expect(deleted).toBeNull();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with regular user token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase sweet with valid quantity', async () => {
      const purchaseData = { quantity: 10 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(testSweet.quantity - purchaseData.quantity);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .send({ quantity: 10 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with insufficient stock', async () => {
      const purchaseData = { quantity: 1000 }; // More than available

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient stock');
    });

    it('should fail with invalid quantity', async () => {
      const purchaseData = { quantity: -5 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock sweet with admin token', async () => {
      const restockData = { quantity: 25 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(testSweet.quantity + restockData.quantity);
    });

    it('should fail with regular user token', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 25 })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .send({ quantity: 25 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid quantity', async () => {
      const restockData = { quantity: -10 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
