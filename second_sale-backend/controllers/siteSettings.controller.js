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
  { label: "Sell Devices", hasDropdown: true, to: "/sell-old-mobile-phones/brand", order: 0, isActive: true },
  { label: "Buy Refurbished", hasDropdown: false, to: "/buy-refurbished", isComingSoon: true, order: 1, isActive: true },
  { label: "Repair", hasDropdown: false, to: "/repair", order: 2, isActive: true },
  { label: "Become a Partner", hasDropdown: false, to: "/partner", order: 3, isActive: true },
  { label: "Corporate", hasDropdown: false, to: "/corporate", order: 4, isActive: true },
  { label: "How It Works", hasDropdown: false, to: "/#how-it-works", order: 5, isActive: true },
  { label: "About Us", hasDropdown: false, to: "/about-us", order: 6, isActive: true },
];

// ── GET settings (public) ───────────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) {
      settings = await SiteSettings.create({
        singleton: 'main',
        banners: [],
        navLinks: DEFAULT_NAV_LINKS,
        whatsappNumber: '7045180009',
        whatsappEnabled: true,
      });
    } else {
      let changed = false;
      if (!settings.navLinks || settings.navLinks.length === 0) {
        settings.navLinks = DEFAULT_NAV_LINKS;
        changed = true;
      }
      if (!settings.whatsappNumber) {
        settings.whatsappNumber = '7045180009';
        changed = true;
      }
      if (settings.whatsappEnabled === undefined) {
        settings.whatsappEnabled = true;
        changed = true;
      }
      if (changed) await settings.save();
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

// ── UPDATE banner (link/alt/order/active/image) ───────────────────
export const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { linkTo, altText, order, isActive, imageUrl } = req.body;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    const banner = settings.banners.id(bannerId);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'secondsale/banners');
      banner.imageUrl = result.secure_url;
    } else if (imageUrl) {
      banner.imageUrl = imageUrl;
    }

    if (linkTo !== undefined) banner.linkTo = linkTo;
    if (altText !== undefined) banner.altText = altText;
    if (order !== undefined) banner.order = Number(order);
    if (isActive !== undefined) {
      banner.isActive = typeof isActive === 'string' ? isActive === 'true' : Boolean(isActive);
    }
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
    const { label, to, hasDropdown, isExternal, isComingSoon, comingSoonMessage, order } = req.body;
    if (!label) return res.status(400).json({ message: 'Label is required' });
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });
    if (!settings.navLinks) settings.navLinks = [];
    settings.navLinks.push({
      label,
      to: to || '/',
      hasDropdown: Boolean(hasDropdown),
      isExternal: Boolean(isExternal),
      isComingSoon: Boolean(isComingSoon),
      comingSoonMessage: comingSoonMessage ? String(comingSoonMessage).trim() : '',
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
    const { label, to, hasDropdown, isExternal, isComingSoon, comingSoonMessage, order, isActive } = req.body;
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    const item = settings.navLinks.id(linkId);
    if (!item) return res.status(404).json({ message: 'Navigation link not found' });
    if (label !== undefined) item.label = label;
    if (to !== undefined) item.to = to;
    if (hasDropdown !== undefined) item.hasDropdown = Boolean(hasDropdown);
    if (isExternal !== undefined) item.isExternal = Boolean(isExternal);
    if (isComingSoon !== undefined) item.isComingSoon = Boolean(isComingSoon);
    if (comingSoonMessage !== undefined) item.comingSoonMessage = String(comingSoonMessage).trim();
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

// ── UPLOAD favicon ──────────────────────────────────────────────
export const uploadFavicon = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/favicon');
    let settings = await SiteSettings.findOneAndUpdate(
      { singleton: 'main' },
      { faviconUrl: result.secure_url },
      { new: true, upsert: true }
    );
    res.json({ faviconUrl: settings.faviconUrl, settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE top bar announcement ────────────────────────────────
export const updateTopBar = async (req, res) => {
  try {
    const { isEnabled, text, linkTo, bgColor, textColor } = req.body;
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });
    settings.topBar = {
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : settings.topBar?.isEnabled,
      text: text !== undefined ? text : settings.topBar?.text,
      linkTo: linkTo !== undefined ? linkTo : settings.topBar?.linkTo,
      bgColor: bgColor !== undefined ? bgColor : settings.topBar?.bgColor,
      textColor: textColor !== undefined ? textColor : settings.topBar?.textColor,
    };
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE footer ───────────────────────────────────────────────
export const updateFooter = async (req, res) => {
  try {
    const { footer } = req.body;
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });
    settings.footer = footer;
    if (footer?.whatsapp) {
      settings.whatsappNumber = String(footer.whatsapp).trim();
    }
    settings.markModified('footer');
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE WhatsApp Support Settings ───────────────────────────
export const updateWhatsApp = async (req, res) => {
  try {
    const { number, isEnabled, message } = req.body;
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });

    if (number !== undefined) {
      const clean = String(number).trim();
      settings.whatsappNumber = clean;
      if (!settings.footer) settings.footer = {};
      settings.footer.whatsapp = clean;
    }
    if (isEnabled !== undefined) {
      settings.whatsappEnabled = Boolean(isEnabled);
    }
    if (message !== undefined) {
      settings.whatsappMessage = String(message).trim();
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE OTP & 2Factor Service Configuration ─────────────────
export const updateOtpConfig = async (req, res) => {
  try {
    const { isEnabled, provider, apiKey, senderId, dummyOtpEnabled, dummyOtpCode } = req.body;
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    if (!settings) settings = new SiteSettings({ singleton: 'main' });

    if (!settings.otpConfig) {
      settings.otpConfig = {};
    }

    if (isEnabled !== undefined) settings.otpConfig.isEnabled = Boolean(isEnabled);
    if (provider !== undefined) settings.otpConfig.provider = String(provider).trim();
    if (apiKey !== undefined) settings.otpConfig.apiKey = String(apiKey).trim();
    if (senderId !== undefined) settings.otpConfig.senderId = String(senderId).trim();
    if (dummyOtpEnabled !== undefined) settings.otpConfig.dummyOtpEnabled = Boolean(dummyOtpEnabled);
    if (dummyOtpCode !== undefined) settings.otpConfig.dummyOtpCode = String(dummyOtpCode).trim();

    // Check balance if 2Factor apiKey is present
    const keyToTest = settings.otpConfig.apiKey || process.env.TWOFACTOR_API_KEY;
    if (keyToTest) {
      try {
        const balRes = await fetch(`https://2factor.in/API/V1/${keyToTest}/BAL/SMS`);
        const balData = await balRes.json();
        if (balData.Status === 'Success') {
          settings.otpConfig.lastBalance = String(balData.Details);
        }
      } catch (e) {
        // ignore balance fetch error
      }
    }

    settings.markModified('otpConfig');
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET Live OTP SMS Balance ────────────────────────────────────
export const getOtpBalance = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singleton: 'main' });
    const apiKey = settings?.otpConfig?.apiKey || process.env.TWOFACTOR_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ message: '2Factor API key is not configured' });
    }

    const balRes = await fetch(`https://2factor.in/API/V1/${apiKey}/BAL/SMS`);
    const balData = await balRes.json();

    if (balData.Status === 'Success') {
      if (settings && settings.otpConfig) {
        settings.otpConfig.lastBalance = String(balData.Details);
        await settings.save();
      }
      return res.json({
        status: 'Success',
        balance: balData.Details,
        apiKeyMasked: apiKey.substring(0, 8) + '...' + apiKey.slice(-4),
      });
    }

    res.status(400).json({
      status: 'Error',
      message: balData.Details || 'Failed to fetch balance from 2Factor',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

