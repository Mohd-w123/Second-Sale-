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

// ── GET settings (public) ───────────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) {
      settings = await SiteSettings.create({ singleton: 'main', banners: [] });
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
    const { orderedIds } = req.body; // array of banner _ids in new order
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
