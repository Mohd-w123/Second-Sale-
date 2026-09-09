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
  { label: "Buy Refurbished", hasDropdown: true, to: "/buy-refurbished", order: 1, isActive: true },
  { label: "How It Works", hasDropdown: false, to: "/#how-it-works", order: 2, isActive: true },
  { label: "Corporate", hasDropdown: false, to: "/corporate", order: 3, isActive: true },
  { label: "About Us", hasDropdown: false, to: "/about-us", order: 4, isActive: true },
  { label: "Become a Partner", hasDropdown: false, to: "/partner", order: 5, isActive: true },
];

const DEFAULT_FOOTER = {
  aboutText: "SecondSale is India's leading re-commerce platform for selling used electronics and buying certified refurbished gadgets at best prices.",
  phone: "+91 98765 43210",
  email: "support@secondsale.com",
  address: "SecondSale Technologies Pvt Ltd, HSR Layout, Sector 2, Bengaluru, Karnataka - 560102",
  workingHours: "Monday - Sunday: 9:00 AM - 9:00 PM IST",
  socialLinks: {
    facebook: "https://facebook.com/secondsale",
    instagram: "https://instagram.com/secondsale",
    twitter: "https://twitter.com/secondsale",
    linkedin: "https://linkedin.com/company/secondsale",
    youtube: "https://youtube.com/@secondsale",
  },
  columns: [
    {
      title: "Services",
      links: [
        { label: "Sell Mobile Phone", to: "/sell-old-mobile-phones/brand" },
        { label: "Sell Laptop", to: "/sell-old-laptops/brand" },
        { label: "Sell Tablet", to: "/sell-tablet/brand" },
        { label: "Sell Smartwatch", to: "/sell-smartwatch/brand" },
        { label: "Buy Refurbished", to: "/buy-refurbished" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about-us" },
        { label: "How It Works", to: "/#how-it-works" },
        { label: "Become a Partner", to: "/partner" },
        { label: "Corporate Trade-in", to: "/corporate" },
      ],
    },
    {
      title: "Help & Support",
      links: [
        { label: "Help Center", to: "/help-center" },
        { label: "FAQs", to: "/faq" },
        { label: "Track Pickup", to: "/dashboard" },
        { label: "Contact Us", to: "/about-us" },
      ],
    },
    {
      title: "Legal & Trust",
      links: [
        { label: "Privacy Policy", to: "/privacy-policy" },
        { label: "Terms of Service", to: "/terms-and-conditions" },
        { label: "E-Waste Policy", to: "/privacy-policy" },
      ],
    },
  ],
  copyrightText: "© 2026 SecondSale Technologies Private Limited. All rights reserved.",
};

const siteSettingsSchema = new mongoose.Schema({
  singleton:   { type: String, default: 'main', unique: true },
  logoUrl:     { type: String, default: '' },
  faviconUrl:  { type: String, default: '' },
  topBar: {
    isEnabled: { type: Boolean, default: false },
    text:      { type: String, default: '⚡ Special Offer: Get extra ₹500 on your first device sale! Use code FIRST500' },
    linkTo:    { type: String, default: '/sell-old-mobile-phones/brand' },
    bgColor:   { type: String, default: '#2563EB' },
    textColor: { type: String, default: '#FFFFFF' },
  },
  banners:     [bannerSchema],
  navLinks:    { type: [navLinkSchema], default: DEFAULT_NAV_LINKS },
  footer:      { type: mongoose.Schema.Types.Mixed, default: DEFAULT_FOOTER },
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
