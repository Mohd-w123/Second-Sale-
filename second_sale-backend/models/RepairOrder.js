import mongoose from 'mongoose';
import crypto from 'crypto';

const repairOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    unique: true,
    default: () => 'REP-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
  },
  device: {
    brand: { type: String, required: true },
    modelName: { type: String, required: true },
    modelId: { type: String },
    imageUrl: { type: String, default: '' },
  },
  services: [{
    id: String,
    label: String,
    price: Number,
    mrp: Number,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  repairMode: {
    type: String,
    enum: ['home', 'store'],
    default: 'home',
  },
  storeDiscount: {
    type: Number,
    default: 0,
  },
  storeLocation: {
    name: String,
    address: String,
    city: String,
    pincode: String,
  },
  pickup: {
    name: String,
    phone: String,
    email: String,
    address: String,
    landmark: String,
    pincode: String,
    city: String,
    state: String,
    date: String,
    timeSlot: String,
    paymentMethod: String,   // 'Cash' | 'UPI - xxx@upi' | 'Bank - HDFC (1234)'
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'technician_assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'placed',
  },
  technicianName: { type: String, default: '' },
  technicianPhone: { type: String, default: '' },
}, {
  timestamps: true,
});

repairOrderSchema.index({ userId: 1, createdAt: -1 });

const RepairOrder = mongoose.model('RepairOrder', repairOrderSchema);
export default RepairOrder;
