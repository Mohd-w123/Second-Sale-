import SiteSettings from '../models/SiteSettings.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import streamifier from 'streamifier';

// ── multer (memory storage — no disk) ──────────────────────────
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

// ── Cloudinary stream upload helper ────────────────────────────
const uploadToCloudinary = (buffer, folder) => {
  if (!cloudinary.config().api_key) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const DEFAULT_NAV_LINKS = [
  { label: "Sell Device", hasDropdown: true, to: "/sell-old-mobile-phones/brand", order: 0, isActive: true },
  { label: "How It Works", hasDropdown: false, to: "/#how-it-works", order: 1, isActive: true },
  { label: "Corporate", hasDropdown: false, to: "/corporate", order: 2, isActive: true },
  { label: "About Us", hasDropdown: false, to: "/about-us", order: 3, isActive: true },
  { label: "Become a Partner", hasDropdown: false, to: "/partner", order: 4, isActive: true },
];

// ── GET settings (public) ───────────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) {
      settings = await SiteSettings.create({ singleton: 'main', banners: [], navLinks: DEFAULT_NAV_LINKS });
    } else if (!settings.navLinks || settings.navLinks.length === 0) {
      settings.navLinks = DEFAULT_NAV_LINKS;
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPLOAD logo ─────────────────────────────────────────────────
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/logo');
    let settings = await SiteSettings.findOneAndUpdate(
      { singleton: 'main' },
      { logoUrl: result.secure_url },
      { new: true, upsert: true }
    );
    res.json({ logoUrl: settings.logoUrl, settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADD banner ──────────────────────────────────────────────────
export const addBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const { linkTo, altText, order } = req.body;
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/banners');
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });
    settings.banners.push({
      imageUrl: result.secure_url,
      linkTo: linkTo || '/sell-old-mobile-phones/brand',
      altText: altText || 'Promotional Banner',
      order: Number(order) || settings.banners.length,
      isActive: true,
    });
    settings.banners.sort((a, b) => a.order - b.order);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE banner (link/alt/order/active) ───────────────────────
export const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { linkTo, altText, order, isActive } = req.body;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    const banner = settings.banners.id(bannerId);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    if (linkTo !== undefined) banner.linkTo = linkTo;
    if (altText !== undefined) banner.altText = altText;
    if (order !== undefined) banner.order = Number(order);
    if (isActive !== undefined) banner.isActive = isActive;
    settings.banners.sort((a, b) => a.order - b.order);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE banner ───────────────────────────────────────────────
export const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    settings.banners = settings.banners.filter(b => b._id.toString() !== bannerId);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── REORDER banners ─────────────────────────────────────────────
export const reorderBanners = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    orderedIds.forEach((id, i) => {
      const b = settings.banners.id(id);
      if (b) b.order = i;
    });
    settings.banners.sort((a, b) => a.order - b.order);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADD nav link ───────────────────────────────────────────────
export const addNavLink = async (req, res) => {
  try {
    const { label, to, hasDropdown, isExternal, order } = req.body;
    if (!label) return res.status(400).json({ message: 'Label is required' });
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });
    if (!settings.navLinks) settings.navLinks = [];
    settings.navLinks.push({
      label,
      to: to || '/',
      hasDropdown: Boolean(hasDropdown),
      isExternal: Boolean(isExternal),
      order: Number(order) || settings.navLinks.length,
      isActive: true,
    });
    settings.navLinks.sort((a, b) => a.order - b.order);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE nav link ────────────────────────────────────────────
export const updateNavLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { label, to, hasDropdown, isExternal, order, isActive } = req.body;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    const item = settings.navLinks.id(linkId);
    if (!item) return res.status(404).json({ message: 'Navigation link not found' });
    if (label !== undefined) item.label = label;
    if (to !== undefined) item.to = to;
    if (hasDropdown !== undefined) item.hasDropdown = Boolean(hasDropdown);
    if (isExternal !== undefined) item.isExternal = Boolean(isExternal);
    if (order !== undefined) item.order = Number(order);
    if (isActive !== undefined) item.isActive = Boolean(isActive);
    settings.navLinks.sort((a, b) => a.order - b.order);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE nav link ────────────────────────────────────────────
export const deleteNavLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    settings.navLinks = settings.navLinks.filter(l => l._id.toString() !== linkId);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── RESET nav links to defaults ────────────────────────────────
export const resetNavLinks = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    settings.navLinks = DEFAULT_NAV_LINKS;
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── REORDER nav links ──────────────────────────────────────────
export const reorderNavLinks = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    orderedIds.forEach((id, i) => {
      const item = settings.navLinks.id(id);
      if (item) item.order = i;
    });
    settings.navLinks.sort((a, b) => a.order - b.order);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
