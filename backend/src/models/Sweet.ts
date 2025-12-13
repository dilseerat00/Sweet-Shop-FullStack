import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  ingredients: string[];
  weight: string;
  createdAt: Date;
  updatedAt: Date;
}

const SweetSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a sweet name'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Milk-based', 'Syrup-based', 'Dry Fruits', 'Seasonal', 'Special'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 0,
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Sweet',
  },
  ingredients: {
    type: [String],
    default: [],
  },
  weight: {
    type: String,
    default: '250g',
  },
}, {
  timestamps: true,
});

// Index for search functionality
SweetSchema.index({ name: 'text', category: 'text', description: 'text' });

export default mongoose.model<ISweet>('Sweet', SweetSchema);
