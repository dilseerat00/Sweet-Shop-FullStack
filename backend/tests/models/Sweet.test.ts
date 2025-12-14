import '../setup';
import Sweet from '../../src/models/Sweet';

describe('Sweet Model Tests', () => {
  describe('Sweet Creation', () => {
    it('should create a valid sweet with all required fields', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Syrup-based',
        price: 250,
        quantity: 100,
        description: 'Delicious soft gulab jamun soaked in sugar syrup',
        image: 'https://example.com/gulabjamun.jpg',
        ingredients: ['Milk', 'Sugar', 'Cardamom'],
        weight: '250g',
      };

      const sweet = await Sweet.create(sweetData);

      expect(sweet.name).toBe(sweetData.name);
      expect(sweet.category).toBe(sweetData.category);
      expect(sweet.price).toBe(sweetData.price);
      expect(sweet.quantity).toBe(sweetData.quantity);
      expect(sweet.description).toBe(sweetData.description);
      expect(sweet.image).toBe(sweetData.image);
      expect(sweet.ingredients).toEqual(sweetData.ingredients);
      expect(sweet.weight).toBe(sweetData.weight);
      expect(sweet.createdAt).toBeDefined();
      expect(sweet.updatedAt).toBeDefined();
    });

    it('should set default values for optional fields', async () => {
      const sweetData = {
        name: 'Rasgulla',
        category: 'Milk-based',
        price: 200,
        quantity: 50,
        description: 'Spongy rasgulla in sugar syrup',
      };

      const sweet = await Sweet.create(sweetData);

      expect(sweet.quantity).toBe(50);
      expect(sweet.image).toBe('https://via.placeholder.com/300x200?text=Sweet');
      expect(sweet.ingredients).toEqual([]);
      expect(sweet.weight).toBe('250g');
    });

    it('should trim whitespace from string fields', async () => {
      const sweet = await Sweet.create({
        name: '  Kaju Katli  ',
        category: 'Dry Fruits',
        price: 500,
        quantity: 25,
        description: '  Premium cashew sweet  ',
      });

      expect(sweet.name).toBe('Kaju Katli');
      expect(sweet.description).toBe('Premium cashew sweet');
    });
  });

  describe('Sweet Validation', () => {
    it('should fail when name is missing', async () => {
      const sweetData = {
        category: 'Milk-based',
        price: 200,
        quantity: 50,
        description: 'Test sweet',
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail when category is missing', async () => {
      const sweetData = {
        name: 'Test Sweet',
        price: 200,
        quantity: 50,
        description: 'Test sweet',
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail when price is missing', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Milk-based',
        quantity: 50,
        description: 'Test sweet',
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail when description is missing', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Milk-based',
        price: 200,
        quantity: 50,
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail when price is negative', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Milk-based',
        price: -100,
        quantity: 50,
        description: 'Test sweet',
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail when quantity is negative', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Milk-based',
        price: 200,
        quantity: -10,
        description: 'Test sweet',
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail for invalid category', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Invalid Category',
        price: 200,
        quantity: 50,
        description: 'Test sweet',
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    it('should fail for duplicate sweet name', async () => {
      const sweetData = {
        name: 'Duplicate Sweet',
        category: 'Milk-based',
        price: 200,
        quantity: 50,
        description: 'First sweet',
      };

      await Sweet.create(sweetData);

      const duplicateSweet = {
        name: 'Duplicate Sweet',
        category: 'Syrup-based',
        price: 300,
        quantity: 30,
        description: 'Second sweet',
      };

      await expect(Sweet.create(duplicateSweet)).rejects.toThrow();
    });
  });

  describe('Category Validation', () => {
    const validCategories = ['Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'];

    validCategories.forEach((category) => {
      it(`should accept valid category "${category}"`, async () => {
        const sweet = await Sweet.create({
          name: `${category} Sweet`,
          category,
          price: 200,
          quantity: 50,
          description: 'Test sweet',
        });

        expect(sweet.category).toBe(category);
      });
    });
  });

  describe('Sweet Update', () => {
    it('should update sweet fields correctly', async () => {
      const sweet = await Sweet.create({
        name: 'Original Sweet',
        category: 'Milk-based',
        price: 200,
        quantity: 50,
        description: 'Original description',
      });

      const updatedSweet = await Sweet.findByIdAndUpdate(
        sweet._id,
        { price: 250, quantity: 75 },
        { new: true, runValidators: true }
      );

      expect(updatedSweet!.price).toBe(250);
      expect(updatedSweet!.quantity).toBe(75);
      expect(updatedSweet!.name).toBe('Original Sweet');
    });

    it('should update timestamps on modification', async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'Milk-based',
        price: 200,
        quantity: 50,
        description: 'Test description',
      });

      const originalUpdatedAt = sweet.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updatedSweet = await Sweet.findByIdAndUpdate(
        sweet._id,
        { price: 250 },
        { new: true }
      );

      expect(updatedSweet!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Text Search Index', () => {
    it('should allow text search on indexed fields', async () => {
      await Sweet.create({
        name: 'Chocolate Barfi',
        category: 'Special',
        price: 300,
        quantity: 40,
        description: 'Rich chocolate flavored barfi',
      });

      await Sweet.create({
        name: 'Kaju Katli',
        category: 'Dry Fruits',
        price: 500,
        quantity: 25,
        description: 'Premium cashew sweet',
      });

      const results = await Sweet.find({ $text: { $search: 'chocolate' } });

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Chocolate Barfi');
    });
  });
});
