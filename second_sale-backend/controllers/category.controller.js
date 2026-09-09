import Category from '../models/Category.js';
import Device from '../models/Device.js';

export const DEFAULT_CATEGORIES = [
  { name: 'Phone', slug: 'mobile', route: '/sell-old-mobile-phones/brand', icon: 'Smartphone', isComingSoon: false, order: 0, isActive: true },
  { name: 'Tablet', slug: 'tablet', route: '/sell-tablet/brand', icon: 'Tablet', isComingSoon: false, order: 1, isActive: true },
  { name: 'Laptop', slug: 'laptop', route: '/sell-old-laptops/brand', icon: 'Laptop', isComingSoon: false, order: 2, isActive: true },
  { name: 'iMac', slug: 'mac', route: '/sell-imac/brand', icon: 'Monitor', isComingSoon: false, order: 3, isActive: true },
  { name: 'TV', slug: 'tv', route: '', icon: 'Tv', isComingSoon: true, order: 4, isActive: true },
  { name: 'Earbuds', slug: 'earbuds', route: '', icon: 'Headphones', isComingSoon: true, order: 5, isActive: true },
  { name: 'Refrigerator', slug: 'refrigerator', route: '', icon: 'Refrigerator', isComingSoon: true, order: 6, isActive: true },
  { name: 'Smartwatch', slug: 'smartwatch', route: '', icon: 'Watch', isComingSoon: true, order: 7, isActive: true },
  { name: 'Gaming Console', slug: 'console', route: '', icon: 'Gamepad2', isComingSoon: true, order: 8, isActive: true },
];

// Helper to ensure default categories exist
async function ensureDefaultCategories() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
  }
}

// ── GET active categories (Public) ─────────────────────────────
export const getCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET all categories with device counts (Admin) ──────────────
export const getAdminCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();
    const categories = await Category.find().sort({ order: 1 }).lean();
    
    // Attach device counts for safety warnings
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Device.countDocuments({ category: cat.slug });
        return { ...cat, deviceCount: count };
      })
    );

    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CREATE category (Admin) ────────────────────────────────────
export const createCategory = async (req, res) => {
  try {
    const { name, slug, route, icon, isComingSoon, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ message: `A category with slug "${cleanSlug}" already exists` });
    }

    const maxOrderCat = await Category.findOne().sort({ order: -1 });
    const nextOrder = maxOrderCat ? maxOrderCat.order + 1 : 0;

    const category = new Category({
      name: name.trim(),
      slug: cleanSlug,
      route: route?.trim() || '',
      icon: icon?.trim() || 'Smartphone',
      isComingSoon: Boolean(isComingSoon),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: nextOrder,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE category (Admin) ────────────────────────────────────
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, route, icon, isComingSoon, isActive, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name !== undefined) category.name = name.trim();
    if (route !== undefined) category.route = route.trim();
    if (icon !== undefined) category.icon = icon.trim();
    if (isComingSoon !== undefined) category.isComingSoon = Boolean(isComingSoon);
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (order !== undefined) category.order = Number(order);

    if (slug !== undefined && slug.trim() && slug !== category.slug) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const existing = await Category.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: `Slug "${cleanSlug}" is already in use` });
      }
      // If updating slug, also update linked devices to maintain integrity
      const oldSlug = category.slug;
      category.slug = cleanSlug;
      await Device.updateMany({ category: oldSlug }, { $set: { category: cleanSlug } });
    }

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE category (Admin) ────────────────────────────────────
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Safety guard: prevent deletion if devices are assigned to this category
    const linkedDevices = await Device.countDocuments({ category: category.slug });
    if (linkedDevices > 0) {
      return res.status(400).json({
        message: `Cannot delete "${category.name}" because ${linkedDevices} device(s) are assigned to it. Please reassign or delete those devices first.`
      });
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── REORDER categories (Admin) ─────────────────────────────────
export const reorderCategories = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array is required' });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        Category.findByIdAndUpdate(id, { order: index })
      )
    );

    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── RESET to system defaults (Admin) ───────────────────────────
export const resetCategories = async (req, res) => {
  try {
    await Category.deleteMany({});
    await Category.insertMany(DEFAULT_CATEGORIES);
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
