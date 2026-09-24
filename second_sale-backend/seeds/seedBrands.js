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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1280px-Apple_logo_black.svg.png',
    categories: ['mobile', 'tablet', 'laptop', 'mac', 'earbuds', 'smartwatch'],
    color: '#000000',
    order: 1,
    isPopular: true,
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Samsung_wordmark.svg/1920px-Samsung_wordmark.svg.png',
    categories: ['mobile', 'tablet', 'laptop', 'earbuds', 'smartwatch', 'tv'],
    color: '#1428A0',
    order: 2,
    isPopular: true,
  },
  {
    name: 'OnePlus',
    slug: 'oneplus',
    logo: 'https://cdn.worldvectorlogo.com/logos/oneplus-wordmark-4.svg',
    categories: ['mobile', 'earbuds', 'smartwatch'],
    color: '#EB0028',
    order: 3,
    isPopular: true,
  },
  {
    name: 'Google',
    slug: 'google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png',
    categories: ['mobile', 'earbuds', 'smartwatch'],
    color: '#4285F4',
    order: 4,
    isPopular: true,
  },
  {
    name: 'Nothing',
    slug: 'nothing',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nothing.svg/960px-Nothing.svg.png',
    categories: ['mobile', 'earbuds'],
    color: '#000000',
    order: 5,
    isPopular: true,
  },
  {
    name: 'Bose',
    slug: 'bose',
    logo: 'https://cdn.worldvectorlogo.com/logos/bose.svg',
    categories: ['earbuds'],
    color: '#000000',
    order: 6,
    isPopular: true,
  },
  {
    name: 'Xiaomi',
    slug: 'xiaomi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1280px-Xiaomi_logo_%282021-%29.svg.png',
    categories: ['mobile', 'tablet', 'laptop', 'tv'],
    color: '#FF6900',
    order: 7,
  },
  {
    name: 'Realme',
    slug: 'realme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Realme_logo.png/960px-Realme_logo.png',
    categories: ['mobile'],
    color: '#FFC915',
    order: 8,
  },
  {
    name: 'Vivo',
    slug: 'vivo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Vivo-Cambodia.jpg/960px-Vivo-Cambodia.jpg',
    categories: ['mobile'],
    color: '#415FFF',
    order: 9,
  },
  {
    name: 'OPPO',
    slug: 'oppo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/OPPO_LOGO.jpg/960px-OPPO_LOGO.jpg',
    categories: ['mobile'],
    color: '#048A5E',
    order: 10,
  },
  {
    name: 'Motorola',
    slug: 'motorola',
    logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/motorola-logo-icon.png',
    categories: ['mobile'],
    color: '#00142E',
    order: 11,
  },
  {
    name: 'Poco',
    slug: 'poco',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/POCO_Logo.svg/1280px-POCO_Logo.svg.png',
    categories: ['mobile'],
    color: '#FFD700',
    order: 12,
  },

  // ─── LAPTOPS ─────────────────────────────────────────────────────────────
  {
    name: 'Dell',
    slug: 'dell',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1024px-Dell_Logo.svg.png',
    categories: ['laptop'],
    color: '#007DB8',
    order: 13,
  },
  {
    name: 'HP',
    slug: 'hp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1024px-HP_logo_2012.svg.png',
    categories: ['laptop'],
    color: '#0096D6',
    order: 14,
  },
  {
    name: 'Lenovo',
    slug: 'lenovo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/1280px-Lenovo_logo_2015.svg.png',
    categories: ['laptop', 'tablet'],
    color: '#E2231A',
    order: 15,
  },
  {
    name: 'Asus',
    slug: 'asus',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/1280px-ASUS_Logo.svg.png',
    categories: ['laptop'],
    color: '#00539B',
    order: 16,
  },
  {
    name: 'Acer',
    slug: 'acer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/1280px-Acer_2011.svg.png',
    categories: ['laptop'],
    color: '#83B81A',
    order: 17,
  },
  {
    name: 'MSI',
    slug: 'msi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/MSI_Logo.svg/1280px-MSI_Logo.svg.png',
    categories: ['laptop'],
    color: '#ED1C24',
    order: 18,
  },

  // ─── GAMING ──────────────────────────────────────────────────────────────
  {
    name: 'Sony',
    slug: 'sony',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1920px-Sony_logo.svg.png',
    categories: ['gaming', 'console', 'tv'],
    color: '#000000',
    order: 19,
    isPopular: true,
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png',
    categories: ['gaming', 'console', 'laptop'],
    color: '#737373',
    order: 20,
    isPopular: true,
  },

  // ─── TV ──────────────────────────────────────────────────────────────────
  {
    name: 'LG',
    slug: 'lg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/1024px-LG_logo_%282015%29.svg.png',
    categories: ['tv'],
    color: '#A50034',
    order: 21,
  },
  {
    name: 'TCL',
    slug: 'tcl',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/TCL_Logo.svg/1280px-TCL_Logo.svg.png',
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
