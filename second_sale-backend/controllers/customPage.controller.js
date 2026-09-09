import CustomPage from '../models/CustomPage.js';

// ─── PUBLIC: Get all published pages ─────────────────────────────────────────
export const listPublishedPages = async (req, res, next) => {
  try {
    const pages = await CustomPage.find({ isPublished: true })
      .select('title slug showInFooter footerColumn updatedAt')
      .sort({ title: 1 })
      .lean();
    res.json(pages);
  } catch (err) {
    next(err);
  }
};

// ─── PUBLIC: Get single page by slug ──────────────────────────────────────────
export const getPageBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const page = await CustomPage.findOne({ slug, isPublished: true }).lean();
    if (!page) {
      return res.status(404).json({ message: 'Page not found or not published' });
    }
    res.json(page);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: List all pages ───────────────────────────────────────────────────
export const adminListAllPages = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    const pages = await CustomPage.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(pages);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Create a page ────────────────────────────────────────────────────
export const adminCreatePage = async (req, res, next) => {
  try {
    const { title, slug, content, featuredImage, metaTitle, metaDescription, isPublished, showInFooter, footerColumn } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Page title is required' });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await CustomPage.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ message: `A page with URL slug "${cleanSlug}" already exists` });
    }

    const page = await CustomPage.create({
      title: title.trim(),
      slug: cleanSlug,
      content: content || '',
      featuredImage: featuredImage || '',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      isPublished: isPublished !== undefined ? isPublished : true,
      showInFooter: Boolean(showInFooter),
      footerColumn: footerColumn || 'Company',
    });

    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Update a page ────────────────────────────────────────────────────
export const adminUpdatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, content, featuredImage, metaTitle, metaDescription, isPublished, showInFooter, footerColumn } = req.body;

    const page = await CustomPage.findById(id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    if (title) page.title = title.trim();
    if (slug) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const conflict = await CustomPage.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (conflict) {
        return res.status(400).json({ message: `A page with URL slug "${cleanSlug}" already exists` });
      }
      page.slug = cleanSlug;
    }
    if (content !== undefined) page.content = content;
    if (featuredImage !== undefined) page.featuredImage = featuredImage;
    if (metaTitle !== undefined) page.metaTitle = metaTitle;
    if (metaDescription !== undefined) page.metaDescription = metaDescription;
    if (isPublished !== undefined) page.isPublished = Boolean(isPublished);
    if (showInFooter !== undefined) page.showInFooter = Boolean(showInFooter);
    if (footerColumn !== undefined) page.footerColumn = footerColumn;

    await page.save();
    res.json(page);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Delete a page ────────────────────────────────────────────────────
export const adminDeletePage = async (req, res, next) => {
  try {
    const page = await CustomPage.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json({ message: 'Page deleted successfully' });
  } catch (err) {
    next(err);
  }
};
