import mongoose from 'mongoose';
import crypto from 'crypto';

const variantSchema = new mongoose.Schema({
  storage: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String, default: '#222222' },
  additionalImages: [String],
}, { _id: false });

const conditionGradeSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  stock: { type: Number, default: 5 },
  description: { type: String, default: '' },
  bulletPoints: [String],
}, { _id: false });

const specSchema = new mongoose.Schema({
  key: String,
  value: String,
}, { _id: false });

const refurbishedDeviceSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true, lowercase: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['mobile', 'laptop', 'tablet', 'smartwatch', 'console'],
    required: true, index: true,
  },
  brand: { type: String, required: true, trim: true, index: true },
  modelName: { type: String, required: true, trim: true },
  images: [String],
  variants: [variantSchema],
  conditionGrades: {
    superb: conditionGradeSchema,
    veryGood: conditionGradeSchema,
    good: conditionGradeSchema,
  },
  specs: [specSchema],
  warrantyMonths: { type: Number, default: 6 },
  qualityPoints: [String],
  inTheBox: [String],
  rating: { type: Number, default: 4.8, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, index: true },
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

refurbishedDeviceSchema.index({ category: 1, isActive: 1 });
refurbishedDeviceSchema.index({ brand: 1, isActive: 1 });
refurbishedDeviceSchema.index({ isFeatured: 1, isActive: 1 });

const RefurbishedDevice = mongoose.model('RefurbishedDevice', refurbishedDeviceSchema);
export default RefurbishedDevice;
