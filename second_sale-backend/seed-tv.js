import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Device from "./models/Device.js";
import Category from "./models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const TV_BRANDS = [
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg" },
  { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
  { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
  { name: "OnePlus", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_pos.svg" },
  { name: "TCL", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/TCL_Technology_Logo.svg" },
  { name: "Vu", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Vu_Televisions_Logo.png" },
  { name: "Haier", logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Haier_logo.svg" },
  { name: "Motorola", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Motorola_new_logo.svg" },
  { name: "Sansui", logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Sansui_logo.svg" },
];

const SIZE_TIERS = [
  { name: "24 to 32 inches TV", slugSuffix: "24-to-32-inches-tv", basePrice: 3990 },
  { name: "33 to 40 inches TV", slugSuffix: "33-to-40-inches-tv", basePrice: 5990 },
  { name: "41 to 50 inches TV", slugSuffix: "41-to-50-inches-tv", basePrice: 8280 },
  { name: "51 to 60 inches TV", slugSuffix: "51-to-60-inches-tv", basePrice: 9900 },
  { name: "61 to 70 inches TV", slugSuffix: "61-to-70-inches-tv", basePrice: 11790 },
  { name: "71 to 80 inches TV", slugSuffix: "71-to-80-inches-tv", basePrice: 12780 },
  { name: "Above 80 inches TV", slugSuffix: "above-80-inches-tv", basePrice: 16500 },
];

// Brand price weight multiplier (Calibrated to Cashify live TV getUpTo catalog)
const BRAND_MULTIPLIERS = {
  Samsung: 1.0,     // Samsung 41-50" = ₹8,280 (Cashify exact benchmark)
  LG: 0.99,          // LG 41-50" = ₹8,190 (Cashify exact benchmark)
  Sony: 0.97,        // Sony 41-50" = ₹8,010 (Cashify exact benchmark)
  OnePlus: 0.95,
  Xiaomi: 0.92,
  TCL: 0.88,
  Vu: 0.85,
  Motorola: 0.85,
  Haier: 0.82,
  Sansui: 0.80,
};

async function seedTVs() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/second-sale";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for TV seeding...");

    // Ensure TV category is active and points to /sell-tv/brand
    await Category.findOneAndUpdate(
      { slug: "tv" },
      {
        name: "Television",
        slug: "tv",
        route: "/sell-tv/brand",
        icon: "Tv",
        isComingSoon: false,
        isActive: true,
      },
      { upsert: true }
    );
    console.log("Updated Category 'tv' route to /sell-tv/brand");

    const tvDevices = [];

    for (const b of TV_BRANDS) {
      const bMult = BRAND_MULTIPLIERS[b.name] || 1.0;

      for (const tier of SIZE_TIERS) {
        const modelName = `${b.name} ${tier.name}`;
        const slug = `${b.name.toLowerCase()}-${tier.slugSuffix}`;
        const calculatedPrice = bMult === 1.0
          ? tier.basePrice
          : Math.round((tier.basePrice * bMult) / 10) * 10;

        tvDevices.push({
          category: "tv",
          brand: b.name,
          modelName,
          slug,
          imageUrl: b.logo,
          description: `Sell your old used ${modelName} online with SecondSale. Guaranteed instant cash and free doorstep pickup.`,
          variants: [
            {
              storage: tier.name.replace(" TV", ""),
              basePrice: calculatedPrice,
            },
          ],
          isActive: true,
        });
      }
    }

    console.log(`Preparing to seed ${tvDevices.length} TV models...`);

    for (const d of tvDevices) {
      await Device.findOneAndUpdate(
        { slug: d.slug },
        { $set: d },
        { upsert: true, new: true }
      );
    }

    console.log(`✓ Successfully seeded ${tvDevices.length} TV models across 10 top brands!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding TV models:", error);
    process.exit(1);
  }
}

seedTVs();
