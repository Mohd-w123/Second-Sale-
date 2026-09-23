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
  { name: "24 to 32 inches TV", slugSuffix: "24-to-32-inches-tv", baseMultiplier: 1.0, basePrice: 6500 },
  { name: "33 to 40 inches TV", slugSuffix: "33-to-40-inches-tv", baseMultiplier: 1.5, basePrice: 10500 },
  { name: "41 to 50 inches TV", slugSuffix: "41-to-50-inches-tv", baseMultiplier: 2.2, basePrice: 17500 },
  { name: "51 to 60 inches TV", slugSuffix: "51-to-60-inches-tv", baseMultiplier: 3.2, basePrice: 28000 },
  { name: "61 to 70 inches TV", slugSuffix: "61-to-70-inches-tv", baseMultiplier: 4.8, basePrice: 45000 },
  { name: "71 to 80 inches TV", slugSuffix: "71-to-80-inches-tv", baseMultiplier: 7.0, basePrice: 75000 },
  { name: "Above 80 inches TV", slugSuffix: "above-80-inches-tv", baseMultiplier: 11.0, basePrice: 125000 },
];

// Brand price weight multiplier (Sony/Samsung/LG carry higher resale value)
const BRAND_MULTIPLIERS = {
  Sony: 1.35,
  Samsung: 1.25,
  LG: 1.20,
  OnePlus: 1.10,
  Xiaomi: 1.0,
  TCL: 0.95,
  Vu: 0.90,
  Motorola: 0.90,
  Haier: 0.85,
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
        const calculatedPrice = Math.round((tier.basePrice * bMult) / 100) * 100;

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
