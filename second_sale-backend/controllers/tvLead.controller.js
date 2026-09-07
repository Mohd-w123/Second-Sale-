import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import TvLead from '../models/TvLead.js';

// Multer memory storage
const storage = multer.memoryStorage();
export const uploadTvPhotos = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB per photo
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
}).fields([
  { name: 'front', maxCount: 1 },
  { name: 'left',  maxCount: 1 },
  { name: 'right', maxCount: 1 },
  { name: 'back',  maxCount: 1 },
]);

// Helper to stream upload to Cloudinary
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

// ── CREATE TV Lead (Public callback request) ───────────────────
export const createTvLead = async (req, res) => {
  try {
    const {
      brand,
      customBrand,
      screenSize,
      tvType,
      condition,
      additionalNotes,
      name,
      phone,
      city,
      pincode,
      address,
    } = req.body;

    if (!brand || !screenSize || !tvType || !condition) {
      return res.status(400).json({ message: 'Please complete all TV choice steps' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please provide your name' });
    }
    if (!phone || !phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number' });
    }

    // Upload photos to Cloudinary if provided
    const photos = { front: '', left: '', right: '', back: '' };
    const files = req.files || {};

    const uploadPromises = [];
    ['front', 'left', 'right', 'back'].forEach((pos) => {
      if (files[pos] && files[pos][0]) {
        uploadPromises.push(
          uploadToCloudinary(files[pos][0].buffer, 'secondsale/tv-leads')
            .then((res) => { photos[pos] = res.secure_url; })
            .catch((err) => console.error(`Error uploading ${pos} photo:`, err))
        );
      }
    });

    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }

    // Detect user from Authorization header or match by phone
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.id || decoded.userId || null;
      } catch (_) {}
    }
    if (!userId) {
      const existingUser = await User.findOne({ phone: phone.trim() });
      if (existingUser) userId = existingUser._id;
    }

    const newLead = new TvLead({
      userId,
      brand: brand.trim(),
      customBrand: customBrand?.trim() || '',
      screenSize: screenSize.trim(),
      tvType: tvType.trim(),
      condition: condition.trim(),
      additionalNotes: additionalNotes?.trim() || '',
      photos,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        city: city?.trim() || '',
        pincode: pincode?.trim() || '',
        address: address?.trim() || '',
      },
      status: 'new',
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: 'TV quote request submitted successfully',
      leadId: newLead.leadId,
      lead: newLead,
    });
  } catch (err) {
    console.error('Failed to create TV lead:', err);
    res.status(500).json({ message: err.message || 'Failed to submit quote request' });
  }
};

// ── GET all TV Leads (Admin) ───────────────────────────────────
export const getTvLeads = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { leadId: { $regex: s, $options: 'i' } },
        { brand: { $regex: s, $options: 'i' } },
        { 'customer.name': { $regex: s, $options: 'i' } },
        { 'customer.phone': { $regex: s, $options: 'i' } },
        { 'customer.city': { $regex: s, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [leads, total, stats] = await Promise.all([
      TvLead.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      TvLead.countDocuments(query),
      TvLead.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const counts = {
      total: await TvLead.countDocuments(),
      new: 0,
      contacted: 0,
      quote_sent: 0,
      pickup_scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    stats.forEach((s) => {
      if (counts[s._id] !== undefined) counts[s._id] = s.count;
    });

    res.json({
      leads,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      counts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET single TV Lead by ID (Admin) ───────────────────────────
export const getTvLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await TvLead.findById(id);
    if (!lead) return res.status(404).json({ message: 'TV Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE TV Lead status & notes (Admin) ──────────────────────
export const updateTvLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, offeredPrice, adminNotes } = req.body;

    const lead = await TvLead.findById(id);
    if (!lead) return res.status(404).json({ message: 'TV Lead not found' });

    if (status !== undefined) lead.status = status;
    if (offeredPrice !== undefined) lead.offeredPrice = Number(offeredPrice);
    if (adminNotes !== undefined) lead.adminNotes = adminNotes;

    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE TV Lead (Admin) ─────────────────────────────────────
export const deleteTvLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await TvLead.findByIdAndDelete(id);
    if (!lead) return res.status(404).json({ message: 'TV Lead not found' });
    res.json({ message: 'Lead deleted successfully', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
