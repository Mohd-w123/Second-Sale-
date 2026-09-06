import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  imageUrl:  { type: String, required: true },
  linkTo:    { type: String, default: '/sell-old-mobile-phones/brand' },
  altText:   { type: String, default: 'Promotional Banner' },
  order:     { type: Number, default: 0 },
  isActive:  { type: Boolean, default: true },
}, { _id: true });

const siteSettingsSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  logoUrl:   { type: String, default: '' },
  banners:   [bannerSchema],
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
