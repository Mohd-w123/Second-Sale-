import mongoose from 'mongoose';

const homepageSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'slider',
      'hero',
      'deviceCategories',
      'stats',
      'featuresStrip',
      'services',
      'buyRefurbished',
      'howItWorks',
      'reviews',
      'whyUs',
      'faqs',
      'cityLinks',
      'customBanner',
    ],
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  isEnabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: true });

const homepageConfigSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  sections: [homepageSectionSchema],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
}, { timestamps: true });

const HomepageConfig = mongoose.model('HomepageConfig', homepageConfigSchema);
export default HomepageConfig;
