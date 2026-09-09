import mongoose from 'mongoose';

const customPageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  content: { type: String, default: '' }, // HTML formatted content from rich text editor
  featuredImage: { type: String, default: '' },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  isPublished: { type: Boolean, default: true, index: true },
  showInFooter: { type: Boolean, default: false },
  footerColumn: { type: String, default: 'Company' },
}, { timestamps: true });

const CustomPage = mongoose.model('CustomPage', customPageSchema);
export default CustomPage;
