import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import HomepageConfig from '../models/HomepageConfig.js';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../controllers/homepage.controller.js';

const seedHomepage = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/second-sale';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    const updated = await HomepageConfig.findOneAndUpdate(
      { singleton: 'main' },
      {
        singleton: 'main',
        sections: DEFAULT_HOMEPAGE_SECTIONS,
        status: 'published',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Successfully seeded HomepageConfig with ${updated.sections.length} sections!`);
    updated.sections.forEach((sec, idx) => {
      console.log(`  [${idx}] ${sec.type}: "${sec.title}" (${sec.isEnabled ? 'Enabled' : 'Disabled'})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding homepage config:', error);
    process.exit(1);
  }
};

seedHomepage();
