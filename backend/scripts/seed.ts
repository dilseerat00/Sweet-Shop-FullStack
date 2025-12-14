import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db';
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
  {
    name: 'Kheer',
    category: 'Milk-based',
    price: 150,
    quantity: 55,
    description: 'Creamy rice pudding flavored with cardamom, saffron, and garnished with nuts.',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
    ingredients: ['Rice', 'Milk', 'Sugar', 'Cardamom', 'Almonds', 'Pistachios'],
    weight: '500g',
  },
  {
    name: 'Gajar Halwa',
    category: 'Seasonal',
    price: 380,
    quantity: 25,
    description: 'Carrot-based dessert slow-cooked with milk, ghee, and sugar. A winter delicacy.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    ingredients: ['Carrots', 'Milk', 'Sugar', 'Ghee', 'Cashews', 'Raisins'],
    weight: '500g',
  },
  {
    name: 'Besan Ladoo',
    category: 'Dry Fruits',
    price: 290,
    quantity: 45,
    description: 'Roasted gram flour balls sweetened with sugar and enriched with ghee.',
    image: 'https://images.unsplash.com/photo-1601001815894-4bb6c81416d7?w=400',
    ingredients: ['Gram flour', 'Sugar', 'Ghee', 'Cashews', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Ras Malai',
    category: 'Milk-based',
    price: 350,
    quantity: 30,
    description: 'Soft paneer discs in rich, creamy sweetened milk with saffron and cardamom.',
    image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400',
    ingredients: ['Paneer', 'Milk', 'Sugar', 'Saffron', 'Cardamom', 'Pistachios'],
    weight: '500g',
  },
  {
    name: 'Kalakand',
    category: 'Milk-based',
    price: 320,
    quantity: 35,
    description: 'Soft milk cake with a grainy texture. Sweet and creamy delight.',
    image: 'https://images.unsplash.com/photo-1589119908995-c6c1cd6e8743?w=400',
    ingredients: ['Milk', 'Paneer', 'Sugar', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Coconut Burfi',
    category: 'Special',
    price: 240,
    quantity: 40,
    description: 'Sweet coconut fudge with a hint of cardamom. Light and flavorful.',
    image: 'https://images.unsplash.com/photo-1631452180842-f29437f62a37?w=400',
    ingredients: ['Coconut', 'Sugar', 'Milk', 'Cardamom', 'Ghee'],
    weight: '500g',
  },
  {
    name: 'Chum Chum',
    category: 'Syrup-based',
    price: 230,
    quantity: 30,
    description: 'Oval-shaped cottage cheese dessert coated with coconut flakes.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
    ingredients: ['Cottage cheese', 'Sugar', 'Coconut', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Phirni',
    category: 'Milk-based',
    price: 180,
    quantity: 50,
    description: 'Ground rice pudding with milk, saffron, and rose water. Served chilled.',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
    ingredients: ['Rice', 'Milk', 'Sugar', 'Saffron', 'Rose water', 'Pistachios'],
    weight: '500g',
  },
  {
    name: 'Anjeer Barfi',
    category: 'Dry Fruits',
    price: 750,
    quantity: 20,
    description: 'Premium fig and nut fudge. Rich, healthy, and delicious.',
    image: 'https://images.unsplash.com/photo-1627662055085-e3c2f0f4b9c0?w=400',
    ingredients: ['Figs', 'Cashews', 'Almonds', 'Pistachios', 'Sugar', 'Ghee'],
    weight: '500g',
  },
  {
    name: 'Shrikhand',
    category: 'Special',
    price: 270,
    quantity: 35,
    description: 'Sweetened strained yogurt flavored with saffron and cardamom. Light and refreshing.',
    image: 'https://images.unsplash.com/photo-1606857521011-c1b8c45d891c?w=400',
    ingredients: ['Yogurt', 'Sugar', 'Saffron', 'Cardamom', 'Pistachios'],
    weight: '500g',
  },
  {
    name: 'Balushahi',
    category: 'Syrup-based',
    price: 210,
    quantity: 40,
    description: 'Flaky, donut-like pastry soaked in sugar syrup. Crispy and sweet.',
    image: 'https://images.unsplash.com/photo-1626776877389-6b16dd290f4d?w=400',
    ingredients: ['Flour', 'Sugar', 'Ghee', 'Yogurt', 'Cardamom'],
    weight: '500g',
  },
  {
    name: 'Nankhatai',
    category: 'Special',
    price: 190,
    quantity: 60,
    description: 'Traditional Indian shortbread cookies with a crumbly texture.',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4a8d8f8f?w=400',
    ingredients: ['Flour', 'Sugar', 'Ghee', 'Cardamom', 'Cashews'],
    weight: '250g',
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
      password: 'Admin@123',
      role: 'admin',
    });

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'User@123',
      role: 'user',
    });

    // Create sweets
    await Sweet.insertMany(sampleSweets);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@sweetdelights.com');
    console.log('   Password: Admin@123');
    console.log('\n👤 User Login:');
    console.log('   Email: user@test.com');
    console.log('   Password: User@123');
    console.log(`\n🍬 ${sampleSweets.length} sweets added to database\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
