import mongoose from 'mongoose';

const pincodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  services: {
    sell: {
      type: Boolean,
      default: true,
    },
    buy: {
      type: Boolean,
      default: true,
    },
    repair: {
      type: Boolean,
      default: false,
    },
  },
}, { timestamps: true });

const Pincode = mongoose.model('Pincode', pincodeSchema);
export default Pincode;
