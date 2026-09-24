import Brand from '../models/Brand.js';
import Device from '../models/Device.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

// Get all brands (with dynamic device modelCount)
export const getAllBrands = async (req, res, next) => {
  try {
    const { category, search, activeOnly } = req.query;

    const filter = {};
    if (activeOnly === 'true') {
      filter.isActive = true;
    }
    if (category) {
      filter.categories = category === 'gaming' ? { $in: ['gaming', 'console'] } : category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const brands = await Brand.find(filter).sort({ order: 1, name: 1 });

    // Calculate model count per brand from Device collection
    const deviceCounts = await Device.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { $toLower: '$brand' }, count: { $sum: 1 } } },
    ]);

    const countMap = new Map();
    deviceCounts.forEach((d) => countMap.set(d._id, d.count));

    const result = brands.map((b) => {
      const bObj = b.toObject();
      bObj.modelCount = countMap.get(b.name.toLowerCase()) || 0;
      return bObj;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get single brand by ID or Slug
export const getBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let brand;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      brand = await Brand.findById(id);
    } else {
      brand = await Brand.findOne({ slug: id.toLowerCase() });
    }

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const modelCount = await Device.countDocuments({
      brand: new RegExp(`^${brand.name}$`, 'i'),
      isActive: true,
    });

    res.json({ ...brand.toObject(), modelCount });
  } catch (error) {
    next(error);
  }
};

// Create a new brand
export const createBrand = async (req, res, next) => {
  try {
    const { name, slug, logo, categories, color, isActive, order, description, isPopular } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await Brand.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(400).json({ message: `A brand with slug "${generatedSlug}" already exists.` });
    }

    const newBrand = await Brand.create({
      name: name.trim(),
      slug: generatedSlug,
      logo: logo || '',
      categories: Array.isArray(categories) && categories.length > 0 ? categories : ['mobile'],
      color: color || '#087F8C',
      isActive: isActive !== undefined ? isActive : true,
      order: Number(order) || 0,
      description: description || '',
      isPopular: !!isPopular,
    });

    res.status(201).json({
      message: 'Brand created successfully',
      brand: newBrand,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing brand
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, logo, categories, color, isActive, order, description, isPopular } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    if (name) brand.name = name.trim();
    if (slug) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      // Check collision
      const collision = await Brand.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (collision) {
        return res.status(400).json({ message: `Slug "${cleanSlug}" is already taken by another brand.` });
      }
      brand.slug = cleanSlug;
    }
    if (logo !== undefined) brand.logo = logo;
    if (categories !== undefined) brand.categories = categories;
    if (color !== undefined) brand.color = color;
    if (isActive !== undefined) brand.isActive = isActive;
    if (order !== undefined) brand.order = Number(order);
    if (description !== undefined) brand.description = description;
    if (isPopular !== undefined) brand.isPopular = isPopular;

    await brand.save();

    res.json({
      message: 'Brand updated successfully',
      brand,
    });
  } catch (error) {
    next(error);
  }
};

// Delete brand
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Upload brand logo to Cloudinary
export const uploadBrandLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No logo file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/brands');
    res.json({
      message: 'Brand logo uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

// Upload general device image to Cloudinary
export const uploadDeviceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/devices');
    res.json({
      message: 'Device image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
