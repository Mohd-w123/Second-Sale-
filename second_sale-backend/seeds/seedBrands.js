import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Brand from '../models/Brand.js';
import Device from '../models/Device.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const INITIAL_BRANDS = [
  // ─── PHONES ─────────────────────────────────────────────────────────────
  {
    name: 'Apple',
    slug: 'apple',
    logo: '/brands/apple.svg',
    categories: ['mobile', 'tablet', 'laptop', 'mac', 'earbuds', 'smartwatch'],
    color: '#000000',
    order: 1,
    isPopular: true,
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    logo: '/brands/samsung.svg',
    categories: ['mobile', 'tablet', 'laptop', 'earbuds', 'smartwatch', 'tv'],
    color: '#1428A0',
    order: 2,
    isPopular: true,
  },
  {
    name: 'OnePlus',
    slug: 'oneplus',
    logo: '/brands/oneplus.svg',
    categories: ['mobile', 'earbuds', 'smartwatch'],
    color: '#EB0028',
    order: 3,
    isPopular: true,
  },
  {
    name: 'Google',
    slug: 'google',
    logo: '/brands/google.svg',
    categories: ['mobile', 'earbuds', 'smartwatch'],
    color: '#4285F4',
    order: 4,
    isPopular: true,
  },
  {
    name: 'Nothing',
    slug: 'nothing',
    logo: '/brands/nothing.svg',
    categories: ['mobile', 'earbuds'],
    color: '#000000',
    order: 5,
    isPopular: true,
  },
  {
    name: 'Bose',
    slug: 'bose',
    logo: '/brands/bose.svg',
    categories: ['earbuds'],
    color: '#000000',
    order: 6,
    isPopular: true,
  },
  {
    name: 'Xiaomi',
    slug: 'xiaomi',
    logo: '/brands/xiaomi.svg',
    categories: ['mobile', 'tablet', 'laptop', 'tv'],
    color: '#FF6900',
    order: 7,
  },
  {
    name: 'Realme',
    slug: 'realme',
    logo: '/brands/realme.svg',
    categories: ['mobile'],
    color: '#FFC915',
    order: 8,
  },
  {
    name: 'Vivo',
    slug: 'vivo',
    logo: '/brands/vivo.svg',
    categories: ['mobile'],
    color: '#415FFF',
    order: 9,
  },
  {
    name: 'OPPO',
    slug: 'oppo',
    logo: '/brands/oppo.svg',
    categories: ['mobile'],
    color: '#048A5E',
    order: 10,
  },
  {
    name: 'Motorola',
    slug: 'motorola',
    logo: '/brands/motorola.svg',
    categories: ['mobile'],
    color: '#00142E',
    order: 11,
  },
  {
    name: 'Poco',
    slug: 'poco',
    logo: '/brands/poco.svg',
    categories: ['mobile'],
    color: '#FFD700',
    order: 12,
  },

  // ─── LAPTOPS ─────────────────────────────────────────────────────────────
  {
    name: 'Dell',
    slug: 'dell',
    logo: '/brands/dell.svg',
    categories: ['laptop'],
    color: '#007DB8',
    order: 13,
  },
  {
    name: 'HP',
    slug: 'hp',
    logo: '/brands/hp.svg',
    categories: ['laptop'],
    color: '#0096D6',
    order: 14,
  },
  {
    name: 'Lenovo',
    slug: 'lenovo',
    logo: '/brands/lenovo.svg',
    categories: ['laptop', 'tablet'],
    color: '#E2231A',
    order: 15,
  },
  {
    name: 'Asus',
    slug: 'asus',
    logo: '/brands/asus.svg',
    categories: ['laptop'],
    color: '#00539B',
    order: 16,
  },
  {
    name: 'Acer',
    slug: 'acer',
    logo: '/brands/acer.svg',
    categories: ['laptop'],
    color: '#83B81A',
    order: 17,
  },
  {
    name: 'MSI',
    slug: 'msi',
    logo: '/brands/msi.svg',
    categories: ['laptop'],
    color: '#ED1C24',
    order: 18,
  },

  // ─── GAMING ──────────────────────────────────────────────────────────────
  {
    name: 'Sony',
    slug: 'sony',
    logo: '/brands/sony.svg',
    categories: ['gaming', 'console', 'tv'],
    color: '#000000',
    order: 19,
    isPopular: true,
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    logo: '/brands/microsoft.svg',
    categories: ['gaming', 'console', 'laptop'],
    color: '#737373',
    order: 20,
    isPopular: true,
  },

  // ─── TV ──────────────────────────────────────────────────────────────────
  {
    name: 'LG',
    slug: 'lg',
    logo: '/brands/lg.svg',
    categories: ['tv'],
    color: '#A50034',
    order: 21,
  },
  {
    name: 'TCL',
    slug: 'tcl',
    logo: '/brands/tcl.svg',
    categories: ['tv'],
    color: '#E2001A',
    order: 22,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let count = 0;
    for (const b of INITIAL_BRANDS) {
      await Brand.findOneAndUpdate(
        { slug: b.slug },
        { $set: b },
        { upsert: true, new: true }
      );
      count++;
    }

    // Auto-discover any brands from Device collection not in INITIAL_BRANDS
    const distinctBrands = await Device.distinct('brand', { isActive: true });
    for (const name of distinctBrands) {
      if (!name) continue;
      const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      const existing = await Brand.findOne({ slug });
      if (!existing) {
        const deviceSample = await Device.findOne({ brand: name, isActive: true });
        await Brand.create({
          name: name.trim(),
          slug,
          logo: '',
          categories: deviceSample ? [deviceSample.category] : ['mobile'],
          color: '#087F8C',
          isActive: true,
          order: 99,
        });
        count++;
        console.log(`Auto-registered brand from devices: ${name}`);
      }
    }

    console.log(`Successfully seeded/synchronized ${count} brands in Brand collection!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
