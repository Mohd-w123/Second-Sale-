import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';

import RepairBrand from '../models/RepairBrand.js';
import RepairDevice from '../models/RepairDevice.js';
import {
  REPAIR_SEED_BRANDS,
  REPAIR_SEED_DEVICES,
  STANDARD_REPAIR_SERVICES,
} from '../seeds/repairSeedData.js';

async function run() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB.');

  console.log('🗑️ Clearing existing repair brands & devices...');
  await RepairBrand.deleteMany({});
  await RepairDevice.deleteMany({});

  console.log(`🌱 Inserting ${REPAIR_SEED_BRANDS.length} brands...`);
  await RepairBrand.insertMany(REPAIR_SEED_BRANDS);

  console.log(`🌱 Inserting ${REPAIR_SEED_DEVICES.length} devices across all brands...`);
  await RepairDevice.insertMany(REPAIR_SEED_DEVICES);

  console.log('✅ MongoDB database successfully populated with all Cashify repair brands & models!');

  // Build the frontend repairData.js file
  const frontendDataPath = path.resolve(__dirname, '../../second_sale-frontend/src/data/repairData.js');
  
  // Group devices by brandSlug for frontend fallback
  const modelsByBrand = {};
  REPAIR_SEED_BRANDS.forEach(b => {
    modelsByBrand[b.slug] = [];
  });

  REPAIR_SEED_DEVICES.forEach(d => {
    if (!modelsByBrand[d.brandSlug]) {
      modelsByBrand[d.brandSlug] = [];
    }
    modelsByBrand[d.brandSlug].push({
      id: d.slug,
      name: d.name,
      series: d.series,
      image: d.image,
      services: d.services,
    });
  });

  const fileContent = `// ─── REPAIR DATA (SYNCED WITH CASHIFY REPAIR CATALOG) ──────────────────────
// Structured data for all 16 mobile brands, series, models and repair services.

export const REPAIR_BRANDS = ${JSON.stringify(REPAIR_SEED_BRANDS.map(b => ({
    id: b.slug,
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    color: b.color,
  })), null, 2)};

export const REPAIR_SERVICE_TYPES = ${JSON.stringify(STANDARD_REPAIR_SERVICES, null, 2)};

export const REPAIR_MODELS = ${JSON.stringify(modelsByBrand, null, 2)};

export const getRepairBrand = (slug) =>
  REPAIR_BRANDS.find(b => b.slug === slug || b.id === slug);

export const getRepairModels = (brandSlug) =>
  REPAIR_MODELS[brandSlug] || [];

export const getRepairModel = (brandSlug, modelId) =>
  (REPAIR_MODELS[brandSlug] || []).find(m => m.id === modelId);
`;

  fs.writeFileSync(frontendDataPath, fileContent, 'utf-8');
  console.log('✅ Generated frontend fallback: ' + frontendDataPath);

  await mongoose.disconnect();
  console.log('🏁 All done!');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error during sync:', err);
  process.exit(1);
});
