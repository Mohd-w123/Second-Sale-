import RepairOrder from '../models/RepairOrder.js';
import RepairDevice from '../models/RepairDevice.js';
import RepairBrand from '../models/RepairBrand.js';
import { validationResult } from 'express-validator';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import {
  REPAIR_SEED_BRANDS,
  REPAIR_SEED_DEVICES,
  STANDARD_REPAIR_SERVICES,
} from '../seeds/repairSeedData.js';

// Auto-seed helper if collection is empty
const ensureSeeded = async () => {
  try {
    const brandCount = await RepairBrand.countDocuments();
    if (brandCount === 0) {
      await RepairBrand.insertMany(REPAIR_SEED_BRANDS);
    }
    const deviceCount = await RepairDevice.countDocuments();
    if (deviceCount === 0) {
      await RepairDevice.insertMany(REPAIR_SEED_DEVICES);
    }
  } catch (err) {
    console.error('Error during repair auto-seed:', err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export const getRepairBrands = async (req, res, next) => {
  try {
    await ensureSeeded();
    const brands = await RepairBrand.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();

    // Get model counts per brand
    const counts = await RepairDevice.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$brandSlug', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id] = c.count; });

    const enriched = brands.map(b => ({
      ...b,
      id: b.slug,
      modelCount: countMap[b.slug] || 0
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

export const getRepairModels = async (req, res, next) => {
  try {
    await ensureSeeded();
    const { brandSlug, search } = req.query;
    const query = { isActive: true };

    if (brandSlug) {
      query.brandSlug = brandSlug.toLowerCase();
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const models = await RepairDevice.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Map to frontend-friendly structure
    const formatted = models.map(m => ({
      id: m.slug,
      _id: m._id,
      brand: m.brand,
      brandSlug: m.brandSlug,
      series: m.series || '',
      name: m.name,
      image: m.image,
      services: m.services,
      isActive: m.isActive,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getRepairModelDetail = async (req, res, next) => {
  try {
    await ensureSeeded();
    const { brandSlug, modelSlug } = req.params;

    const model = await RepairDevice.findOne({
      brandSlug: brandSlug.toLowerCase(),
      slug: modelSlug.toLowerCase(),
      isActive: true,
    }).lean();

    if (!model) {
      return res.status(404).json({ message: 'Repair model not found' });
    }

    res.json({
      id: model.slug,
      _id: model._id,
      brand: model.brand,
      brandSlug: model.brandSlug,
      series: model.series || '',
      name: model.name,
      image: model.image,
      services: model.services,
      isActive: model.isActive,
    });
  } catch (error) {
    next(error);
  }
};

export const getRepairServiceTypes = async (req, res) => {
  res.json(STANDARD_REPAIR_SERVICES);
};

// ─────────────────────────────────────────────────────────────────────────────
// USER ORDERS (Doorstep Repair Bookings)
// ─────────────────────────────────────────────────────────────────────────────

export const createRepairOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { device, services, totalAmount, pickup } = req.body;

    const order = await RepairOrder.create({
      userId: req.user?.id || req.user?._id,
      device,
      services,
      totalAmount,
      pickup,
      status: 'placed',
    });

    res.status(201).json({
      orderId: order.orderId,
      order,
      message: 'Repair order created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRepairOrders = async (req, res, next) => {
  try {
    const orders = await RepairOrder.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getRepairOrderById = async (req, res, next) => {
  try {
    const order = await RepairOrder.findOne({
      orderId: req.params.orderId,
      userId: req.user.id,
    }).lean();

    if (!order) {
      return res.status(404).json({ message: 'Repair order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelRepairOrder = async (req, res, next) => {
  try {
    const order = await RepairOrder.findOne({
      orderId: req.params.orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Repair order not found' });
    }
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed order' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Repair order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ENDPOINTS (Manage Models, Pricing & Orders)
// ─────────────────────────────────────────────────────────────────────────────

export const adminGetRepairStats = async (req, res, next) => {
  try {
    await ensureSeeded();
    const [totalModels, totalBrands, totalBookings, pendingBookings] = await Promise.all([
      RepairDevice.countDocuments(),
      RepairBrand.countDocuments(),
      RepairOrder.countDocuments(),
      RepairOrder.countDocuments({ status: { $in: ['placed', 'confirmed', 'technician_assigned'] } }),
    ]);

    const revenueAgg = await RepairOrder.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const completedRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalModels,
      totalBrands,
      totalBookings,
      pendingBookings,
      completedRevenue,
    });
  } catch (error) {
    next(error);
  }
};

export const adminListRepairDevices = async (req, res, next) => {
  try {
    await ensureSeeded();
    const { brandSlug, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (brandSlug && brandSlug !== 'all') {
      query.brandSlug = brandSlug.toLowerCase();
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [devices, total] = await Promise.all([
      RepairDevice.find(query)
        .sort({ brandSlug: 1, sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      RepairDevice.countDocuments(query),
    ]);

    res.json({
      devices,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const adminCreateRepairDevice = async (req, res, next) => {
  try {
    const { brand, brandSlug, series, name, slug, image, services, isActive, sortOrder } = req.body;

    if (!brand || !name || !services) {
      return res.status(400).json({ message: 'Brand, name, and services pricing are required' });
    }

    const finalBrandSlug = (brandSlug || brand).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const finalSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const existing = await RepairDevice.findOne({ brandSlug: finalBrandSlug, slug: finalSlug });
    if (existing) {
      return res.status(409).json({ message: 'Device model already exists under this brand' });
    }

    const device = await RepairDevice.create({
      brand: brand.trim(),
      brandSlug: finalBrandSlug,
      series: (series || '').trim(),
      name: name.trim(),
      slug: finalSlug,
      image: image || '',
      services,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ message: 'Repair device created successfully', device });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateRepairDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name && !updates.slug) {
      updates.slug = updates.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }
    if (updates.brand && !updates.brandSlug) {
      updates.brandSlug = updates.brand.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }

    const device = await RepairDevice.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Repair device not found' });
    }

    res.json({ message: 'Repair device updated successfully', device });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteRepairDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const device = await RepairDevice.findByIdAndDelete(id);
    if (!device) {
      return res.status(404).json({ message: 'Repair device not found' });
    }
    res.json({ message: 'Repair device deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const adminListRepairOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'pickup.name': { $regex: search, $options: 'i' } },
        { 'pickup.phone': { $regex: search, $options: 'i' } },
        { 'pickup.pincode': { $regex: search, $options: 'i' } },
        { 'device.modelName': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      RepairOrder.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      RepairOrder.countDocuments(query),
    ]);

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateRepairOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, technicianName, technicianPhone, adminNotes } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (technicianName !== undefined) updateFields.technicianName = technicianName;
    if (technicianPhone !== undefined) updateFields.technicianPhone = technicianPhone;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const order = await RepairOrder.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Repair order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    next(error);
  }
};

export const adminSeedDefaultRepairs = async (req, res, next) => {
  try {
    await RepairBrand.deleteMany({});
    await RepairDevice.deleteMany({});

    await RepairBrand.insertMany(REPAIR_SEED_BRANDS);
    await RepairDevice.insertMany(REPAIR_SEED_DEVICES);

    res.json({
      message: 'Repair catalog successfully re-seeded with default models and pricing',
      brandsCount: REPAIR_SEED_BRANDS.length,
      devicesCount: REPAIR_SEED_DEVICES.length,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN BRAND & LOGO MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export const adminListRepairBrands = async (req, res, next) => {
  try {
    await ensureSeeded();
    const brands = await RepairBrand.find().sort({ sortOrder: 1, name: 1 }).lean();

    // Group model count by brandSlug
    const deviceCounts = await RepairDevice.aggregate([
      { $group: { _id: '$brandSlug', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    deviceCounts.forEach(c => {
      countMap[c._id] = c.count;
    });

    const enriched = brands.map(b => ({
      ...b,
      id: b._id,
      modelCount: countMap[b.slug] || 0,
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

export const adminCreateRepairBrand = async (req, res, next) => {
  try {
    const { name, slug, logo, color, isActive, sortOrder } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const finalSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const existing = await RepairBrand.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(409).json({ message: `A brand with slug "${finalSlug}" already exists` });
    }

    const brand = await RepairBrand.create({
      name: name.trim(),
      slug: finalSlug,
      logo: (logo || '').trim(),
      color: color || '#087F8C',
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
    });

    res.status(201).json({ message: 'Brand created successfully', brand });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateRepairBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, logo, color, isActive, sortOrder } = req.body;

    const brand = await RepairBrand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const previousSlug = brand.slug;

    if (name) brand.name = name.trim();
    if (slug) {
      const finalSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const conflict = await RepairBrand.findOne({ slug: finalSlug, _id: { $ne: id } });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${finalSlug}" is already taken by another brand` });
      }
      brand.slug = finalSlug;
    }
    if (logo !== undefined) brand.logo = logo.trim();
    if (color !== undefined) brand.color = color;
    if (isActive !== undefined) brand.isActive = isActive;
    if (sortOrder !== undefined) brand.sortOrder = Number(sortOrder);

    await brand.save();

    // If slug changed, update associated devices brandSlug
    if (brand.slug !== previousSlug) {
      await RepairDevice.updateMany(
        { brandSlug: previousSlug },
        { $set: { brandSlug: brand.slug, brand: brand.name } }
      );
    }

    res.json({ message: 'Brand updated successfully', brand });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteRepairBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await RepairBrand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const adminUploadRepairBrandLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No logo file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/repair-brands');
    res.json({
      message: 'Brand logo uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUploadRepairDeviceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/repair-devices');
    res.json({
      message: 'Device image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

