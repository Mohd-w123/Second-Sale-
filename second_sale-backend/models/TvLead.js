import mongoose from 'mongoose';
import crypto from 'crypto';

const tvLeadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  leadId: {
    type: String,
    unique: true,
    default: () => 'TV-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    index: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  customBrand: {
    type: String,
    default: '',
    trim: true,
  },
  screenSize: {
    type: String,
    required: [true, 'Screen size is required'],
    trim: true,
  },
  tvType: {
    type: String,
    required: [true, 'TV type is required'],
    trim: true,
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    trim: true,
  },
  additionalNotes: {
    type: String,
    default: '',
    trim: true,
  },
  photos: {
    front: { type: String, default: '' },
    left:  { type: String, default: '' },
    right: { type: String, default: '' },
    back:  { type: String, default: '' },
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quote_sent', 'pickup_scheduled', 'completed', 'cancelled'],
    default: 'new',
    index: true,
  },
  offeredPrice: {
    type: Number,
    default: 0,
  },
  adminNotes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

tvLeadSchema.index({ createdAt: -1 });

const TvLead = mongoose.model('TvLead', tvLeadSchema);
export default TvLead;
