import mongoose from 'mongoose';

const servicePriceSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
  warranty: { type: String, default: '6 Months' },
  time: { type: String, default: '30-45 mins' },
}, { _id: false });

const repairDeviceSchema = new mongoose.Schema({
  brand: { type: String, required: true, index: true },
  brandSlug: { type: String, required: true, index: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, index: true, lowercase: true, trim: true },
  image: { type: String, default: '' },
  series: { type: String, default: '' },
  services: {
    screen: servicePriceSchema,
    battery: servicePriceSchema,
    front_camera: servicePriceSchema,
    back_camera: servicePriceSchema,
    charging_jack: servicePriceSchema,
    mic: servicePriceSchema,
    speaker: servicePriceSchema,
    receiver: servicePriceSchema,
    back_panel: servicePriceSchema,
  },
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
}, {
  timestamps: true,
});

repairDeviceSchema.index({ brandSlug: 1, slug: 1 }, { unique: true });
repairDeviceSchema.index({ brandSlug: 1, isActive: 1 });

const RepairDevice = mongoose.model('RepairDevice', repairDeviceSchema);
export default RepairDevice;
