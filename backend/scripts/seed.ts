import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import Sweet from '../src/models/Sweet';
import User from '../src/models/User';

dotenv.config();

const sampleSweets = [
  {
    name: 'Gulab Jamun',
    category: 'Syrup-based',
    price: 250,
    quantity: 50,
    description: 'Soft, spongy milk-solid balls soaked in aromatic sugar syrup. A classic Indian dessert loved by all.',
    image: 'https://images.unsplash.com/photo-1589119908995-c6c1cd6e8743?w=400',
    ingredients: ['Milk powder', 'Sugar', 'Ghee', 'Cardamom', 'Rose water'],
    weight: '500g',
  },
  {
    name: 'Kaju Katli',
    category: 'Dry Fruits',
    price: 800,
    quantity: 30,
    description: 'Premium cashew fudge with a thin silver leaf. Smooth, melt-in-mouth texture.',
    image: 'https://images.unsplash.com/photo-1627662055085-e3c2f0f4b9c0?w=400',
    ingredients: ['Cashews', 'Sugar', 'Ghee', 'Silver leaf'],
    weight: '500g',
  },
  {
    name: 'Rasgulla',
    category: 'Syrup-based',
    price: 200,
    quantity: 40,
    description: 'Spongy cottage cheese balls soaked in light sugar syrup. Refreshingly sweet.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
    ingredients: ['Cottage cheese', 'Sugar', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Barfi',
    category: 'Milk-based',
    price: 350,
    quantity: 45,
    description: 'Traditional milk fudge with pistachios and almonds. Rich and creamy.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    ingredients: ['Milk', 'Sugar', 'Pistachios', 'Almonds', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Ladoo',
    category: 'Special',
    price: 300,
    quantity: 60,
    description: 'Golden spherical sweets made with gram flour and ghee. Perfect for celebrations.',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cashews', 'Raisins'],
    weight: '500g',
  },
  {
    name: 'Jalebi',
    category: 'Syrup-based',
    price: 180,
    quantity: 35,
    description: 'Crispy, spiral-shaped dessert soaked in saffron-flavored sugar syrup.',
    image: 'https://images.unsplash.com/photo-1626776877389-6b16dd290f4d?w=400',
    ingredients: ['Flour', 'Sugar', 'Saffron', 'Cardamom'],
    weight: '250g',
  },
  {
    name: 'Sandesh',
    category: 'Milk-based',
    price: 280,
    quantity: 25,
    description: 'Bengali delicacy made from cottage cheese and sugar. Light and aromatic.',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4a8d8f8f?w=400',
    ingredients: ['Cottage cheese', 'Sugar', 'Cardamom', 'Saffron'],
    weight: '500g',
  },
  {
    name: 'Mysore Pak',
    category: 'Special',
    price: 400,
    quantity: 20,
    description: 'South Indian specialty with gram flour, sugar, and generous ghee. Melt-in-mouth texture.',
    image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400',
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Rasmalai',
    category: 'Milk-based',
    price: 320,
    quantity: 30,
    description: 'Cottage cheese patties soaked in sweetened, thickened milk with saffron and cardamom.',
    image: 'https://images.unsplash.com/photo-1606857521011-c1b8c45d891c?w=400',
    ingredients: ['Cottage cheese', 'Milk', 'Sugar', 'Saffron', 'Cardamom', 'Pistachios'],
    weight: '500g',
  },
  {
    name: 'Peda',
    category: 'Milk-based',
    price: 260,
    quantity: 40,
    description: 'Soft, dense milk cake flavored with cardamom. A traditional favorite.',
    image: 'https://images.unsplash.com/photo-1621193967057-09d3e4bb38c6?w=400',
    ingredients: ['Milk', 'Sugar', 'Cardamom', 'Saffron'],
    weight: '500g',
  },
  {
    name: 'Soan Papdi',
    category: 'Special',
    price: 220,
    quantity: 50,
    description: 'Flaky, crispy threads of sweetness that dissolve on your tongue.',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400',
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cardamom'],
    weight: '250g',
  },
  {
    name: 'Motichoor Ladoo',
    category: 'Seasonal',
    price: 340,
    quantity: 35,
    description: 'Tiny gram flour pearls shaped into balls. Festive and flavorful.',
    image: 'https://images.unsplash.com/photo-1599599810847-a8e0c4e93da8?w=400',
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cashews', 'Saffron'],
    weight: '500g',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sweetdelights.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
    });

    // Create sweets
    await Sweet.insertMany(sampleSweets);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@sweetdelights.com');
    console.log('   Password: admin123');
    console.log('\n👤 User Login:');
    console.log('   Email: user@test.com');
    console.log('   Password: user123');
    console.log(`\n🍬 ${sampleSweets.length} sweets added to database\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
