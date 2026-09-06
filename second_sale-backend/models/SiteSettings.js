import mongoose from 'mongoose';

const navLinkSchema = new mongoose.Schema({
  label:       { type: String, required: true },
  to:          { type: String, default: '/' },
  hasDropdown: { type: Boolean, default: false },
  isExternal:  { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { _id: true });

const bannerSchema = new mongoose.Schema({
  imageUrl:  { type: String, required: true },
  linkTo:    { type: String, default: '/sell-old-mobile-phones/brand' },
  altText:   { type: String, default: 'Promotional Banner' },
  order:     { type: Number, default: 0 },
  isActive:  { type: Boolean, default: true },
}, { _id: true });

const DEFAULT_NAV_LINKS = [
  { label: "Sell Device", hasDropdown: true, to: "/sell-old-mobile-phones/brand", order: 0, isActive: true },
  { label: "How It Works", hasDropdown: false, to: "/#how-it-works", order: 1, isActive: true },
  { label: "Corporate", hasDropdown: false, to: "/corporate", order: 2, isActive: true },
  { label: "About Us", hasDropdown: false, to: "/about-us", order: 3, isActive: true },
  { label: "Become a Partner", hasDropdown: false, to: "/partner", order: 4, isActive: true },
];

const siteSettingsSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  logoUrl:   { type: String, default: '' },
  banners:   [bannerSchema],
  navLinks:  { type: [navLinkSchema], default: DEFAULT_NAV_LINKS },
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
