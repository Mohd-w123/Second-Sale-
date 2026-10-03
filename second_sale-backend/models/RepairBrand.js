import mongoose from 'mongoose';

const repairBrandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  logo: { type: String, default: '' },
  color: { type: String, default: '#087F8C' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, {
  timestamps: true,
});

repairBrandSchema.index({ isActive: 1, sortOrder: 1 });

const RepairBrand = mongoose.model('RepairBrand', repairBrandSchema);
export default RepairBrand;
