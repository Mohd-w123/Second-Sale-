import mongoose from 'mongoose';
import crypto from 'crypto';

const buyOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => 'RBUY-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  item: {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RefurbishedDevice' },
    slug: String,
    title: String,
    brand: String,
    modelName: String,
    category: String,
    image: String,
    conditionGrade: { type: String, enum: ['superb', 'veryGood', 'good'] },
    conditionLabel: String,
    storage: String,
    color: String,
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    warrantyMonths: { type: Number, default: 6 },
  },
  payment: {
    method: { type: String, enum: ['cod', 'upi', 'netbanking'], required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
    upiId: String,
    transactionId: String,
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
    index: true,
  },
  deliveryDetails: {
    expectedDate: String,
    trackingNumber: String,
    courierPartner: String,
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

buyOrderSchema.index({ 'customer.phone': 1, createdAt: -1 });
buyOrderSchema.index({ 'customer.email': 1, createdAt: -1 });

const BuyOrder = mongoose.model('BuyOrder', buyOrderSchema);
export default BuyOrder;
