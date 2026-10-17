import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";
import Brand from "../models/Brand.js";

const newTabletBrands = [
  { name: "Lenovo", slug: "lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/1280px-Lenovo_logo_2015.svg.png", color: "#E2231A", order: 3 },
  { name: "Xiaomi", slug: "xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1280px-Xiaomi_logo_%282021-%29.svg.png", color: "#FF6900", order: 4 },
  { name: "OnePlus", slug: "oneplus", logo: "https://cdn.worldvectorlogo.com/logos/oneplus-wordmark-4.svg", color: "#F5010C", order: 5 },
  { name: "Realme", slug: "realme", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Realme_logo.png/960px-Realme_logo.png", color: "#FFC915", order: 6 },
  { name: "Motorola", slug: "motorola", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/motorola-logo-icon.png", color: "#001428", order: 7 },
  { name: "Honor", slug: "honor", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Honor_Logo_2022.svg/1280px-Honor_Logo_2022.svg.png", color: "#000000", order: 8 },
  { name: "OPPO", slug: "oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/OPPO_LOGO.jpg/960px-OPPO_LOGO.jpg", color: "#04803E", order: 9 },
  { name: "Nokia", slug: "nokia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nokia_wordmark.svg/1280px-Nokia_wordmark.svg.png", color: "#124191", order: 10 },
  { name: "Poco", slug: "poco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/POCO_logo.svg/250px-POCO_logo.svg.png", color: "#FFD400", order: 11 },
];

const newTablets = [
  // ─── LENOVO TABLETS ──────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab M10 HD (2nd Gen)",
    slug: "lenovo-tab-m10-hd-2nd-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m10-hd-gen2.jpg",
    variants: [
      { storage: "2 GB/32 GB", basePrice: 4200 },
      { storage: "4 GB/64 GB", basePrice: 5800 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab M10 Plus (3rd Gen)",
    slug: "lenovo-tab-m10-plus-3rd-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m10-plus-gen3.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 6500 },
      { storage: "6 GB/128 GB", basePrice: 8200 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab M11",
    slug: "lenovo-tab-m11",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m11.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 7200 },
      { storage: "8 GB/128 GB", basePrice: 9500 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab M8 (4th Gen)",
    slug: "lenovo-tab-m8-4th-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m8-gen4.jpg",
    variants: [
      { storage: "2 GB/32 GB", basePrice: 3200 },
      { storage: "3 GB/32 GB", basePrice: 3800 },
      { storage: "4 GB/64 GB", basePrice: 4500 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab M8 (2nd Gen)",
    slug: "lenovo-tab-m8-2nd-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m8-fhd.jpg",
    variants: [
      { storage: "2 GB/32 GB", basePrice: 2800 },
      { storage: "3 GB/32 GB", basePrice: 3400 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab M7 (3rd Gen)",
    slug: "lenovo-tab-m7-3rd-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-m7-gen3.jpg",
    variants: [
      { storage: "2 GB/32 GB", basePrice: 2400 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab P11 (2nd Gen)",
    slug: "lenovo-tab-p11-2nd-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-p11-gen2.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 10500 },
      { storage: "8 GB/256 GB", basePrice: 13200 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab P11 Pro (2nd Gen)",
    slug: "lenovo-tab-p11-pro-2nd-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-p11-pro-gen2.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 17500 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab P12",
    slug: "lenovo-tab-p12",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-p12.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 13900 },
      { storage: "8 GB/256 GB", basePrice: 16200 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Yoga Tab 11",
    slug: "lenovo-yoga-tab-11",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-yoga-tab-11.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 11500 },
      { storage: "8 GB/256 GB", basePrice: 14200 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Yoga Smart Tab",
    slug: "lenovo-yoga-smart-tab",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-yoga-smart-tab.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 7200 }
    ]
  },
  {
    category: "tablet",
    brand: "Lenovo",
    modelName: "Lenovo Tab 4 10 Plus",
    slug: "lenovo-tab-4-10-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/lenovo-tab-4-10-plus.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 4800 }
    ]
  },

  // ─── XIAOMI / REDMI TABLETS ──────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Xiaomi",
    modelName: "Xiaomi Pad 6",
    slug: "xiaomi-pad-6",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-pad-6.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 14500 },
      { storage: "8 GB/256 GB", basePrice: 17200 }
    ]
  },
  {
    category: "tablet",
    brand: "Xiaomi",
    modelName: "Xiaomi Pad 5",
    slug: "xiaomi-pad-5",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-pad-5.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 11800 },
      { storage: "6 GB/256 GB", basePrice: 13500 }
    ]
  },
  {
    category: "tablet",
    brand: "Xiaomi",
    modelName: "Redmi Pad",
    slug: "redmi-pad",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad.jpg",
    variants: [
      { storage: "3 GB/64 GB", basePrice: 6200 },
      { storage: "4 GB/128 GB", basePrice: 7800 },
      { storage: "6 GB/128 GB", basePrice: 8900 }
    ]
  },
  {
    category: "tablet",
    brand: "Xiaomi",
    modelName: "Redmi Pad SE",
    slug: "redmi-pad-se",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad-se.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 6900 },
      { storage: "6 GB/128 GB", basePrice: 7900 },
      { storage: "8 GB/128 GB", basePrice: 8900 }
    ]
  },
  {
    category: "tablet",
    brand: "Xiaomi",
    modelName: "Redmi Pad Pro 5G",
    slug: "redmi-pad-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-pad-pro.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 12500 },
      { storage: "8 GB/256 GB", basePrice: 15200 }
    ]
  },

  // ─── ONEPLUS TABLETS ─────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "OnePlus",
    modelName: "OnePlus Pad",
    slug: "oneplus-pad",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 19500 },
      { storage: "12 GB/256 GB", basePrice: 22800 }
    ]
  },
  {
    category: "tablet",
    brand: "OnePlus",
    modelName: "OnePlus Pad 2",
    slug: "oneplus-pad-2",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-2.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 24500 },
      { storage: "12 GB/256 GB", basePrice: 28500 }
    ]
  },
  {
    category: "tablet",
    brand: "OnePlus",
    modelName: "OnePlus Pad Go",
    slug: "oneplus-pad-go",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 9800 },
      { storage: "8 GB/256 GB", basePrice: 11800 }
    ]
  },

  // ─── REALME TABLETS ──────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Realme",
    modelName: "Realme Pad",
    slug: "realme-pad",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-pad.jpg",
    variants: [
      { storage: "3 GB/32 GB", basePrice: 5200 },
      { storage: "4 GB/64 GB", basePrice: 6500 }
    ]
  },
  {
    category: "tablet",
    brand: "Realme",
    modelName: "Realme Pad Mini",
    slug: "realme-pad-mini",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-pad-mini.jpg",
    variants: [
      { storage: "3 GB/32 GB", basePrice: 4200 },
      { storage: "4 GB/64 GB", basePrice: 5200 }
    ]
  },
  {
    category: "tablet",
    brand: "Realme",
    modelName: "Realme Pad X",
    slug: "realme-pad-x",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-pad-x.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 10500 },
      { storage: "6 GB/128 GB", basePrice: 13200 }
    ]
  },
  {
    category: "tablet",
    brand: "Realme",
    modelName: "Realme Pad 2",
    slug: "realme-pad-2",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/realme-pad-2.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 9800 },
      { storage: "8 GB/256 GB", basePrice: 11900 }
    ]
  },

  // ─── MOTOROLA TABLETS ────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Motorola",
    modelName: "Moto Tab G20",
    slug: "moto-tab-g20",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-tab-g20.jpg",
    variants: [
      { storage: "3 GB/32 GB", basePrice: 3800 }
    ]
  },
  {
    category: "tablet",
    brand: "Motorola",
    modelName: "Moto Tab G62",
    slug: "moto-tab-g62",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-tab-g62.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 6800 },
      { storage: "4 GB/128 GB", basePrice: 7900 }
    ]
  },
  {
    category: "tablet",
    brand: "Motorola",
    modelName: "Moto Tab G70",
    slug: "moto-tab-g70",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-tab-g70.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 8500 }
    ]
  },
  {
    category: "tablet",
    brand: "Motorola",
    modelName: "Moto Tab G84",
    slug: "moto-tab-g84",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-tab-g84.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 11200 }
    ]
  },

  // ─── HONOR TABLETS ───────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Honor",
    modelName: "Honor Pad 8",
    slug: "honor-pad-8",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/honor-pad-8.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 8800 },
      { storage: "6 GB/128 GB", basePrice: 10500 }
    ]
  },
  {
    category: "tablet",
    brand: "Honor",
    modelName: "Honor Pad 9",
    slug: "honor-pad-9",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/honor-pad-9.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 14200 }
    ]
  },
  {
    category: "tablet",
    brand: "Honor",
    modelName: "Honor Pad X8",
    slug: "honor-pad-x8",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x8.jpg",
    variants: [
      { storage: "3 GB/32 GB", basePrice: 4800 },
      { storage: "4 GB/64 GB", basePrice: 5900 }
    ]
  },
  {
    category: "tablet",
    brand: "Honor",
    modelName: "Honor Pad X9",
    slug: "honor-pad-x9",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/honor-pad-x9.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 7800 },
      { storage: "7 GB/128 GB", basePrice: 9200 }
    ]
  },

  // ─── OPPO TABLETS ────────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "OPPO",
    modelName: "Oppo Pad Air",
    slug: "oppo-pad-air",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-pad-air.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 7200 },
      { storage: "4 GB/128 GB", basePrice: 8500 }
    ]
  },
  {
    category: "tablet",
    brand: "OPPO",
    modelName: "Oppo Pad Neo",
    slug: "oppo-pad-neo",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-pad-neo.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 11500 },
      { storage: "8 GB/128 GB", basePrice: 13200 }
    ]
  },

  // ─── NOKIA TABLETS ───────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Nokia",
    modelName: "Nokia T20",
    slug: "nokia-t20",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nokia-t20.jpg",
    variants: [
      { storage: "3 GB/32 GB", basePrice: 4500 },
      { storage: "4 GB/64 GB", basePrice: 5800 }
    ]
  },
  {
    category: "tablet",
    brand: "Nokia",
    modelName: "Nokia T21",
    slug: "nokia-t21",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nokia-t21.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 5900 },
      { storage: "4 GB/128 GB", basePrice: 7200 }
    ]
  },
  {
    category: "tablet",
    brand: "Nokia",
    modelName: "Nokia T10",
    slug: "nokia-t10",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nokia-t10.jpg",
    variants: [
      { storage: "3 GB/32 GB", basePrice: 3500 },
      { storage: "4 GB/64 GB", basePrice: 4200 }
    ]
  },

  // ─── POCO TABLET ─────────────────────────────────────────────────────────────
  {
    category: "tablet",
    brand: "Poco",
    modelName: "Poco Pad 5G",
    slug: "poco-pad-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-pad.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 13800 },
      { storage: "8 GB/256 GB", basePrice: 15900 }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for tablet expansion...");

  // 1. Ensure Brand collection has all tablet brands with logos
  for (const b of newTabletBrands) {
    await Brand.findOneAndUpdate(
      { slug: b.slug },
      { $set: { name: b.name, slug: b.slug, logo: b.logo, color: b.color, isActive: true } },
      { upsert: true }
    );
  }
  console.log("Upserted Brand entries for tablet brands.");

  // 2. Insert or update tablet devices
  let added = 0;
  let updated = 0;
  for (const t of newTablets) {
    const existing = await Device.findOne({ slug: t.slug });
    if (!existing) {
      await Device.create({
        ...t,
        isActive: true,
        conditionMultipliers: {
          likenew: 1.0,
          good: 0.95,
          average: 0.85,
          belowAverage: 0.70,
          fair: 0.72,
          poor: 0.55
        }
      });
      added++;
    } else {
      existing.category = "tablet";
      existing.brand = t.brand;
      existing.modelName = t.modelName;
      existing.imageUrl = t.imageUrl;
      existing.variants = t.variants;
      existing.isActive = true;
      await existing.save();
      updated++;
    }
  }

  console.log(`Seeded tablet models: ${added} added, ${updated} updated.`);

  const allTabletBrands = await Device.distinct("brand", { category: "tablet", isActive: true });
  console.log("All tablet brands now in DB:", allTabletBrands);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch(err => {
  console.error("Tablet seeding failed:", err);
  process.exit(1);
});
