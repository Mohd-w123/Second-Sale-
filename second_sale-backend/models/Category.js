import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  route: {
    type: String,
    default: '',
    trim: true,
  },
  icon: {
    type: String,
    default: 'Smartphone',
    trim: true,
  },
  isComingSoon: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

categorySchema.index({ order: 1, isActive: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
