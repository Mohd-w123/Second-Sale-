import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Order from '../models/Order.js';
import PartnerApplication from '../models/PartnerApplication.js';
import Pincode from '../models/Pincode.js';
import AdminUser from '../models/AdminUser.js';

// ─── Admin Login ──────────────────────────────────────────────────────────────

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 1. Check Super Admin credentials from environment variables
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@secondsale.com').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'W9H1%85sT0]e').trim();

    if (trimmedEmail === adminEmail && trimmedPassword === adminPassword) {
      const token = jwt.sign(
        {
          id: 'superadmin',
          email: adminEmail,
          name: 'Super Admin',
          role: 'superadmin',
          permissions: ['*'],
          isAdmin: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        admin: {
          id: 'superadmin',
          name: 'Super Admin',
          email: adminEmail,
          role: 'superadmin',
          permissions: ['*'],
        },
      });
    }

    // 2. Check Sales / Staff User in AdminUser database collection
    const adminUser = await AdminUser.findOne({ email: trimmedEmail });
    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid admin or sales credentials' });
    }

    if (!adminUser.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated. Please contact Super Admin.' });
    }

    const isMatch = await bcrypt.compare(trimmedPassword, adminUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin or sales credentials' });
    }

    adminUser.lastLogin = new Date();
    await adminUser.save();

    const token = jwt.sign(
      {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role || 'sales',
        permissions: adminUser.permissions || [],
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role || 'sales',
        permissions: adminUser.permissions || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalDevices, totalOrders, totalPartners, orders] = await Promise.all([
      User.countDocuments(),
      Device.countDocuments(),
      Order.countDocuments(),
      PartnerApplication.countDocuments(),
      Order.find({ status: 'completed' }).select('priceBreakdown.finalPrice').lean(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.priceBreakdown?.finalPrice || 0), 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    const recentPartners = await PartnerApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      stats: { totalUsers, totalDevices, totalOrders, totalPartners, totalRevenue },
      recentOrders,
      recentPartners,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    // Attach order count per user
    const userIds = users.map(u => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    orderCounts.forEach(oc => { countMap[oc._id.toString()] = oc.count; });

    const enrichedUsers = users.map(u => ({
      ...u,
      orderCount: countMap[u._id.toString()] || 0,
    }));

    res.json({ users: enrichedUsers, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    res.json({ user, orders });
  } catch (error) {
    next(error);
  }
};

// ─── Devices (CRUD) ───────────────────────────────────────────────────────────

export const getAllDevices = async (req, res, next) => {
  try {
    const { category, brand, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (search) {
      filter.$or = [
        { modelName: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { slug: new RegExp(search, 'i') },
      ];
    }

    const [devices, total] = await Promise.all([
      Device.find(filter)
        .sort({ category: 1, brand: 1, modelName: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Device.countDocuments(filter),
    ]);

    res.json({ devices, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const getDeviceById = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id).lean();
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    next(error);
  }
};

export const createDevice = async (req, res, next) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Device with this slug already exists' });
    }
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Device with this slug already exists' });
    }
    next(error);
  }
};

export const deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Partners ─────────────────────────────────────────────────────────────────

export const getAllPartners = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { businessName: new RegExp(search, 'i') },
        { contactPerson: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    const [partners, total] = await Promise.all([
      PartnerApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      PartnerApplication.countDocuments(filter),
    ]);

    res.json({ partners, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const updatePartnerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected.' });
    }

    const updateData = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const partner = await PartnerApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({ message: 'Partner application not found' });
    }

    res.json({ message: 'Partner application updated successfully', partner });
  } catch (error) {
    next(error);
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'device.brand': new RegExp(search, 'i') },
        { 'device.modelName': new RegExp(search, 'i') },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email phone')
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    const validStatuses = ['placed', 'scheduled', 'assigned', 'picked', 'verified', 'payment_initiated', 'completed', 'cancelled'];

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      order.status = status;
    }

    if (remark !== undefined) {
      const cleanRemark = typeof remark === 'string' ? remark.trim() : '';
      order.remark = cleanRemark;
      if (!Array.isArray(order.remarks)) {
        order.remarks = [];
      }
      if (cleanRemark) {
        order.remarks.push({
          status: order.status,
          remark: cleanRemark,
          updatedAt: new Date(),
        });
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderCustomerInfo = async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (!order.pickup) {
        order.pickup = {};
      }
      if (name !== undefined) order.pickup.name = name.trim();
      if (phone !== undefined) order.pickup.phone = phone.trim();
      if (email !== undefined) order.pickup.email = email.trim().toLowerCase();

      await order.save();

      // Also update linked user profile if available
      if (order.userId) {
        const userUpdates = {};
        if (name && name.trim()) userUpdates.name = name.trim();
        if (phone && phone.trim()) userUpdates.phone = phone.trim();
        if (email && email.trim() && email.includes('@')) userUpdates.email = email.trim().toLowerCase();

        if (Object.keys(userUpdates).length > 0) {
          try {
            await User.findByIdAndUpdate(order.userId, { $set: userUpdates });
          } catch (err) {
            console.warn('Could not update user record:', err.message);
          }
        }
      }

      const updatedOrder = await Order.findById(order._id)
        .populate('userId', 'name email phone')
        .lean();

      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  // ─── Pincodes ─────────────────────────────────────────────────────────────────

  export const getAllPincodes = async (req, res, next) => {
    try {
      const { search, service, page = 1, limit = 50 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const filter = {};
      if (search) {
        filter.$or = [
          { code: new RegExp(search, 'i') },
          { city: new RegExp(search, 'i') },
          { state: new RegExp(search, 'i') },
        ];
      }

      if (service === 'repair') {
        filter['services.repair'] = true;
      } else if (service === 'sell') {
        filter['services.sell'] = { $ne: false };
      } else if (service === 'buy') {
        filter['services.buy'] = { $ne: false };
      }

      const [pincodesRaw, total, totalAll, repairCount, sellCount] = await Promise.all([
        Pincode.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Pincode.countDocuments(filter),
        Pincode.countDocuments(),
        Pincode.countDocuments({ 'services.repair': true }),
        Pincode.countDocuments({ 'services.sell': { $ne: false } }),
      ]);

      const pincodes = pincodesRaw.map((p) => ({
        ...p,
        services: {
          sell: p.services?.sell !== undefined ? Boolean(p.services.sell) : true,
          buy: p.services?.buy !== undefined ? Boolean(p.services.buy) : true,
          repair: Boolean(p.services?.repair),
        },
      }));

      res.json({
        pincodes,
        total,
        totalAll,
        repairCount,
        sellCount,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      });
    } catch (error) {
      next(error);
    }
  };

  export const createPincode = async (req, res, next) => {
    try {
      const { code, city, state, isActive, services } = req.body;
      const pincode = await Pincode.create({
        code,
        city,
        state,
        isActive: isActive !== undefined ? isActive : true,
        services: {
          sell: services?.sell !== undefined ? Boolean(services.sell) : true,
          buy: services?.buy !== undefined ? Boolean(services.buy) : true,
          repair: Boolean(services?.repair),
        },
      });
      res.status(201).json(pincode);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Pincode already exists' });
      }
      next(error);
    }
  };

  export const updatePincode = async (req, res, next) => {
    try {
      const updateData = { ...req.body };
      if (updateData.services) {
        updateData.services = {
          sell: updateData.services.sell !== undefined ? Boolean(updateData.services.sell) : true,
          buy: updateData.services.buy !== undefined ? Boolean(updateData.services.buy) : true,
          repair: Boolean(updateData.services.repair),
        };
      }
      const pincode = await Pincode.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!pincode) {
        return res.status(404).json({ message: 'Pincode not found' });
      }

      res.json(pincode);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Pincode already exists' });
      }
      next(error);
    }
  };

  export const togglePincodeService = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { service, enabled } = req.body;
      if (!['sell', 'buy', 'repair'].includes(service)) {
        return res.status(400).json({ message: 'Invalid service type' });
      }

      const pincode = await Pincode.findById(id);
      if (!pincode) {
        return res.status(404).json({ message: 'Pincode not found' });
      }

      if (!pincode.services) {
        pincode.services = { sell: true, buy: true, repair: false };
      }
      pincode.services[service] = Boolean(enabled);
      pincode.markModified('services');
      await pincode.save();

      res.json(pincode);
    } catch (error) {
      next(error);
    }
  };

  export const bulkUpdatePincodeServices = async (req, res, next) => {
    try {
      const { ids, service, enabled } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No pincodes selected' });
      }
      if (!['sell', 'buy', 'repair'].includes(service)) {
        return res.status(400).json({ message: 'Invalid service type' });
      }

      await Pincode.updateMany(
        { _id: { $in: ids } },
        { $set: { [`services.${service}`]: Boolean(enabled) } }
      );

      res.json({ message: `Updated ${ids.length} pincodes successfully` });
    } catch (error) {
      next(error);
    }
  };

  export const deletePincode = async (req, res, next) => {
    try {
      const pincode = await Pincode.findByIdAndDelete(req.params.id);
      if (!pincode) {
        return res.status(404).json({ message: 'Pincode not found' });
      }
      res.json({ message: 'Pincode deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  // ─── Sales Users / Staff Team Management ─────────────────────────────────────

  export const getAllSalesUsers = async (req, res, next) => {
    try {
      const users = await AdminUser.find().select('-passwordHash').sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  export const createSalesUser = async (req, res, next) => {
    try {
      const { name, email, password, role, permissions, isActive } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = await AdminUser.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({ message: 'A team member with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password.trim(), 10);
      const newUser = await AdminUser.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role || 'sales',
        permissions: Array.isArray(permissions) ? permissions : ['orders'],
        isActive: isActive !== undefined ? isActive : true,
      });

      const userObj = newUser.toObject();
      delete userObj.passwordHash;
      res.status(201).json(userObj);
    } catch (error) {
      next(error);
    }
  };

  export const updateSalesUser = async (req, res, next) => {
    try {
      const { name, email, password, role, permissions, isActive } = req.body;
      const user = await AdminUser.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'Sales user not found.' });
      }

      if (name) user.name = name.trim();
      if (email) user.email = email.trim().toLowerCase();
      if (role) user.role = role;
      if (permissions !== undefined) user.permissions = permissions;
      if (isActive !== undefined) user.isActive = isActive;

      if (password && password.trim().length > 0) {
        user.passwordHash = await bcrypt.hash(password.trim(), 10);
      }

      await user.save();
      const userObj = user.toObject();
      delete userObj.passwordHash;
      res.json(userObj);
    } catch (error) {
      next(error);
    }
  };

  export const deleteSalesUser = async (req, res, next) => {
    try {
      const user = await AdminUser.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Sales user not found.' });
      }
      res.json({ message: 'Sales user deleted successfully.' });
    } catch (error) {
      next(error);
    }
  };

  // ─── Cashify Pricing Benchmark & Calibration ──────────────────────────────────

  export const getPricingStats = async (req, res, next) => {
    try {
      const stats = await Device.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$variants' },
        {
          $group: {
            _id: '$category',
            deviceCount: { $addToSet: '$_id' },
            variantCount: { $sum: 1 },
            avgBasePrice: { $avg: '$variants.basePrice' },
            minBasePrice: { $min: '$variants.basePrice' },
            maxBasePrice: { $max: '$variants.basePrice' },
          },
        },
        {
          $project: {
            category: '$_id',
            totalDevices: { $size: '$deviceCount' },
            totalVariants: '$variantCount',
            avgBasePrice: { $round: ['$avgBasePrice', 0] },
            minBasePrice: '$minBasePrice',
            maxBasePrice: '$maxBasePrice',
          },
        },
        { $sort: { totalDevices: -1 } },
      ]);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };

  export const calibrateDevicePrices = async (req, res, next) => {
    try {
      const { category, multiplier = 1, fixedDelta = 0, dryRun = false } = req.body;
      const numMultiplier = Number(multiplier);
      const numDelta = Number(fixedDelta);

      if (isNaN(numMultiplier) || numMultiplier <= 0) {
        return res.status(400).json({ message: 'Invalid multiplier. Must be a positive number (e.g. 1.026 for +2.6%).' });
      }

      const filter = { isActive: true };
      if (category && category !== 'all') {
        filter.category = category;
      }

      const devices = await Device.find(filter);
      let totalUpdated = 0;
      let totalVariantsUpdated = 0;
      const sampleChanges = [];
      const bulkOps = [];

      for (const dev of devices) {
        let modified = false;
        const originalSample = dev.variants?.[0]?.basePrice || dev.basePrice;
        let updatedVariants = null;
        let newBase = null;

        if (Array.isArray(dev.variants) && dev.variants.length > 0) {
          updatedVariants = dev.variants.map((v) => {
            if (v.basePrice && v.basePrice > 0) {
              const newPrice = Math.round((v.basePrice * numMultiplier + numDelta) / 10) * 10;
              if (newPrice !== v.basePrice) {
                totalVariantsUpdated++;
                modified = true;
                return { ...(v.toObject ? v.toObject() : v), basePrice: Math.max(newPrice, 500) };
              }
            }
            return v.toObject ? v.toObject() : v;
          });
        }

        if (dev.basePrice && dev.basePrice > 0) {
          const computedBase = Math.round((dev.basePrice * numMultiplier + numDelta) / 10) * 10;
          if (computedBase !== dev.basePrice) {
            newBase = Math.max(computedBase, 500);
            modified = true;
          }
        }

        if (modified) {
          totalUpdated++;
          const updateFields = {};
          if (updatedVariants) updateFields.variants = updatedVariants;
          if (newBase !== null) updateFields.basePrice = newBase;

          bulkOps.push({
            updateOne: {
              filter: { _id: dev._id },
              update: { $set: updateFields },
            },
          });

          if (sampleChanges.length < 5) {
            sampleChanges.push({
              modelName: dev.modelName,
              brand: dev.brand,
              category: dev.category,
              before: originalSample,
              after: updatedVariants?.[0]?.basePrice || newBase,
            });
          }
        }
      }

      if (!dryRun && bulkOps.length > 0) {
        await Device.bulkWrite(bulkOps);
      }

      res.json({
        message: `Successfully calibrated ${totalUpdated} devices (${totalVariantsUpdated} variants).`,
        totalDevices: devices.length,
        totalUpdated,
        totalVariantsUpdated,
        sampleChanges,
        dryRun,
      });
    } catch (error) {
      next(error);
    }
  };


