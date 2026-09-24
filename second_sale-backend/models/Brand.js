import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Brand slug is required'],
      lowercase: true,
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      default: '',
    },
    categories: {
      type: [String],
      default: ['mobile'],
    },
    color: {
      type: String,
      default: '#087F8C',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

brandSchema.index({ categories: 1 });

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
