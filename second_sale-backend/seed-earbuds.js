import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Device from "./models/Device.js";
import Category from "./models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const EARBUDS_MODELS = [
  // --- Apple AirPods ---
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods Max",
    slug: "apple-airpods-max",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1604709508000",
    description: "Sell your AirPods Max online with SecondSale. Instant cash quote, free doorstep pickup.",
    variants: [{ storage: "Standard", basePrice: 17000 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods Pro 2nd Generation",
    slug: "apple-airpods-pro-2nd-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1660803972361",
    description: "Sell your AirPods Pro 2nd Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 5200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods Pro 1st Generation",
    slug: "apple-airpods-pro-1st-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1591632955000",
    description: "Sell your AirPods Pro 1st Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 3000 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods 4 with Active Noise Cancellation",
    slug: "apple-airpods-4-with-active-noise-cancellation",
    imageUrl: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your AirPods 4 with Active Noise Cancellation online. Free pickup & instant pay.",
    variants: [{ storage: "Standard", basePrice: 6500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods 4",
    slug: "apple-airpods-4",
    imageUrl: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-select-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your AirPods 4 online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 5500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods 3rd Generation",
    slug: "apple-airpods-3rd-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1632861342000",
    description: "Sell your AirPods 3rd Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 4500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods 2nd Generation",
    slug: "apple-airpods-2nd-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1551489688005",
    description: "Sell your AirPods 2nd Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 1800 }],
    isActive: true,
  },

  // --- Samsung Galaxy Buds ---
  {
    category: "earbuds",
    brand: "Samsung",
    modelName: "Galaxy Buds2 Pro",
    slug: "samsung-galaxy-buds2-pro",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2208/gallery/in-galaxy-buds2-pro-r510-sm-r510nzaainu-533193237?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds2 Pro online with SecondSale. Highest price guaranteed.",
    variants: [{ storage: "Standard", basePrice: 4500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Samsung",
    modelName: "Galaxy Buds FE",
    slug: "samsung-galaxy-buds-fe",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-r400nzaainu/gallery/in-galaxy-buds-fe-r400-sm-r400nzaainu-538602951?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds FE online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Samsung",
    modelName: "Galaxy Buds Live",
    slug: "samsung-galaxy-buds-live",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-r180nznainu/gallery/in-galaxy-buds-live-r180-sm-r180nznainu-302302324?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds Live online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2000 }],
    isActive: true,
  },

  // --- OnePlus Buds ---
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Buds Pro 2",
    slug: "oneplus-buds-pro-2",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2023/buds-pro-2/specs/green.png",
    description: "Sell your OnePlus Buds Pro 2 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 3800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Buds 3",
    slug: "oneplus-buds-3",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2024/buds-3/specs/grey.png",
    description: "Sell your OnePlus Buds 3 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2600 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Nord Buds 2",
    slug: "oneplus-nord-buds-2",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2023/nord-buds-2/specs/white.png",
    description: "Sell your OnePlus Nord Buds 2 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 1200 }],
    isActive: true,
  },

  // --- boAt Airdopes ---
  {
    category: "earbuds",
    brand: "boAt",
    modelName: "boAt Nirvana Ion",
    slug: "boat-nirvana-ion",
    imageUrl: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Nirvana_Ion.png?v=1680173661",
    description: "Sell your boAt Nirvana Ion earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 1100 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "boAt",
    modelName: "boAt Airdopes 141",
    slug: "boat-airdopes-141",
    imageUrl: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_141.png?v=1683268427",
    description: "Sell your boAt Airdopes 141 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 600 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "boAt",
    modelName: "boAt Airdopes 441",
    slug: "boat-airdopes-441",
    imageUrl: "https://cdn.shopify.com/s/files/1/0057/8938/4802/products/1_c8d19fae-6f81-424d-b3b0-0b6c2d1b8045.png?v=1658402517",
    description: "Sell your boAt Airdopes 441 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 800 }],
    isActive: true,
  },

  // --- Sony ---
  {
    category: "earbuds",
    brand: "Sony",
    modelName: "Sony WF-1000XM5",
    slug: "sony-wf-1000xm5",
    imageUrl: "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=600",
    description: "Sell your Sony WF-1000XM5 wireless noise cancelling earbuds online.",
    variants: [{ storage: "Standard", basePrice: 11000 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Sony",
    modelName: "Sony WF-1000XM4",
    slug: "sony-wf-1000xm4",
    imageUrl: "https://www.sony.co.in/image/91786ba113e61c77fa7ffda9cdfae223?fmt=png-alpha&wid=600",
    description: "Sell your Sony WF-1000XM4 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 6500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Sony",
    modelName: "Sony LinkBuds S",
    slug: "sony-linkbuds-s",
    imageUrl: "https://www.sony.co.in/image/5df7d9d06b4d32e95a7ba964c06206d2?fmt=png-alpha&wid=600",
    description: "Sell your Sony LinkBuds S online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 4500 }],
    isActive: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Update Category in DB
    const catRes = await Category.findOneAndUpdate(
      { slug: "earbuds" },
      {
        $set: {
          name: "Earbuds",
          route: "/sell-earbuds/brand",
          icon: "Headphones",
          isComingSoon: false,
          isActive: true,
          order: 5,
        }
      },
      { upsert: true, new: true }
    );
    console.log("Updated Category:", catRes.name, "isComingSoon:", catRes.isComingSoon, "route:", catRes.route);

    // 2. Seed / Upsert Earbuds Devices
    let seededCount = 0;
    for (const d of EARBUDS_MODELS) {
      await Device.findOneAndUpdate(
        { slug: d.slug },
        { $set: d },
        { upsert: true, new: true }
      );
      seededCount++;
    }
    console.log(`Successfully seeded/updated ${seededCount} earbuds models!`);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
