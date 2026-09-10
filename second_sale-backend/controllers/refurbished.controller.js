import RefurbishedDevice from '../models/RefurbishedDevice.js';
import BuyOrder from '../models/BuyOrder.js';
import User from '../models/User.js';


// ─── PUBLIC: List / filter refurbished devices ───────────────────────────────
export const listRefurbished = async (req, res, next) => {
  try {
    const {
      category, brand, grade, minPrice, maxPrice,
      search, sort, page = 1, limit = 20, featured,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;

    // Price filter (check across all grade prices)
    if (minPrice || maxPrice) {
      const priceConditions = [];
      ['superb', 'veryGood', 'good'].forEach(g => {
        const cond = {};
        if (minPrice) cond.$gte = Number(minPrice);
        if (maxPrice) cond.$lte = Number(maxPrice);
        priceConditions.push({ [`conditionGrades.${g}.price`]: cond });
      });
      filter.$or = priceConditions;
    }

    // Grade filter: only show devices with stock in this grade
    if (grade && ['superb', 'veryGood', 'good'].includes(grade)) {
      filter[`conditionGrades.${grade}.stock`] = { $gt: 0 };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { modelName: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = { isFeatured: -1, soldCount: -1 };
    if (sort === 'price_asc') sortObj = { 'conditionGrades.good.price': 1 };
    if (sort === 'price_desc') sortObj = { 'conditionGrades.superb.price': -1 };
    if (sort === 'discount') sortObj = { soldCount: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [devices, total] = await Promise.all([
      RefurbishedDevice.find(filter)
        .select('-specs -qualityPoints -metaTitle -metaDescription')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      RefurbishedDevice.countDocuments(filter),
    ]);

    res.json({
      devices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUBLIC: Get single device ────────────────────────────────────────────────
export const getRefurbishedDevice = async (req, res, next) => {
  try {
    const device = await RefurbishedDevice.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.json(device);
  } catch (err) {
    next(err);
  }
};

// ─── PUBLIC: Place a buy order ────────────────────────────────────────────────
export const placeBuyOrder = async (req, res, next) => {
  try {
    const { customer, item, payment } = req.body;

    if (!customer || !item || !payment) {
      return res.status(400).json({ message: 'customer, item, and payment are required' });
    }

    // Validate payment method
    if (!['cod', 'upi', 'netbanking'].includes(payment.method)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Check product & stock
    const product = await RefurbishedDevice.findOne({ slug: item.slug, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found or unavailable' });

    const gradeKey = item.conditionGrade;
    const grade = product.conditionGrades?.[gradeKey];
    if (!grade || grade.stock < 1) {
      return res.status(400).json({ message: 'Selected condition grade is out of stock' });
    }

    // Decrement stock
    product.conditionGrades[gradeKey].stock -= 1;
    product.soldCount = (product.soldCount || 0) + 1;
    await product.save();

    // Expected delivery: 3-5 business days
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 4);
    const formattedDate = expectedDate.toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // Link user if logged in or by matching phone/email
    let userId = req.user?.id || null;
    if (!userId && customer) {
      const orConditions = [];
      if (customer.phone) {
        const rawPhone = customer.phone.replace(/\D/g, '');
        orConditions.push({ phone: customer.phone }, { phone: rawPhone });
      }
      if (customer.email) {
        orConditions.push({ email: customer.email.trim().toLowerCase() });
      }
      if (orConditions.length > 0) {
        const existingUser = await User.findOne({ $or: orConditions }).select('_id').lean();
        if (existingUser) userId = existingUser._id;
      }
    }

    const order = await BuyOrder.create({
      userId,
      customer,
      item: {
        ...item,
        productId: product._id,
        price: grade.price,
        originalPrice: grade.originalPrice,
        warrantyMonths: product.warrantyMonths,
        image: product.images?.[0] || '',
      },
      payment: {
        method: payment.method,
        status: payment.method === 'cod' ? 'pending' : 'pending',
        upiId: payment.upiId || '',
      },
      deliveryDetails: { expectedDate: formattedDate },
    });

    res.status(201).json({
      orderId: order.orderId,
      expectedDate: formattedDate,
      message: 'Order placed successfully',
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUBLIC: Get a buy order by ID ───────────────────────────────────────────
export const getBuyOrder = async (req, res, next) => {
  try {
    const order = await BuyOrder.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ─── AUTH: Get logged-in user's buy orders ────────────────────────────────────
export const getMyBuyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('phone email').lean();
    const orQuery = [{ userId }];
    if (user?.phone) {
      const rawPhone = user.phone.replace(/\D/g, '');
      orQuery.push({ 'customer.phone': user.phone }, { 'customer.phone': rawPhone });
    }
    if (user?.email) {
      orQuery.push({ 'customer.email': user.email.toLowerCase() });
    }

    const orders = await BuyOrder.find({ $or: orQuery }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: List all refurbished devices ──────────────────────────────────────
export const adminListRefurbished = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { modelName: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [devices, total] = await Promise.all([
      RefurbishedDevice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      RefurbishedDevice.countDocuments(filter),
    ]);
    res.json({ devices, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Create/Update refurbished product ─────────────────────────────────
export const adminCreateRefurbished = async (req, res, next) => {
  try {
    const device = await RefurbishedDevice.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    next(err);
  }
};

export const adminUpdateRefurbished = async (req, res, next) => {
  try {
    const device = await RefurbishedDevice.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.json(device);
  } catch (err) {
    next(err);
  }
};

export const adminDeleteRefurbished = async (req, res, next) => {
  try {
    const { hard } = req.query;
    if (hard === 'true') {
      await RefurbishedDevice.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Device permanently deleted' });
    }
    const device = await RefurbishedDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    device.isActive = !device.isActive;
    await device.save();
    res.json({ message: `Device ${device.isActive ? 'activated' : 'deactivated'} successfully`, device });
  } catch (err) {
    next(err);
  }
};

export const adminListBuyOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      BuyOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      BuyOrder.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateBuyOrderStatus = async (req, res, next) => {
  try {
    const {
      orderStatus,
      paymentStatus,
      trackingNumber,
      courierPartner,
      transactionId,
      notes,
    } = req.body;

    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update['payment.status'] = paymentStatus;
    if (transactionId !== undefined) update['payment.transactionId'] = transactionId;
    if (trackingNumber !== undefined) update['deliveryDetails.trackingNumber'] = trackingNumber;
    if (courierPartner !== undefined) update['deliveryDetails.courierPartner'] = courierPartner;
    if (notes !== undefined) update.notes = notes;

    const order = await BuyOrder.findOneAndUpdate(
      { orderId: req.params.orderId },
      update,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
