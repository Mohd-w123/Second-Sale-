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
  // ─── APPLE AIRPODS ────────────────────────────────────────────────────────
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
    variants: [{ storage: "Standard", basePrice: 5500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods Pro 1st Generation",
    slug: "apple-airpods-pro-1st-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1591632955000",
    description: "Sell your AirPods Pro 1st Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 3500 }],
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
    variants: [{ storage: "Standard", basePrice: 5200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods 3rd Generation",
    slug: "apple-airpods-3rd-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1632861342000",
    description: "Sell your AirPods 3rd Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 4200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Apple",
    modelName: "AirPods 2nd Generation",
    slug: "apple-airpods-2nd-generation",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1551489688005",
    description: "Sell your AirPods 2nd Generation online with SecondSale. Instant quote, free pickup.",
    variants: [{ storage: "Standard", basePrice: 2200 }],
    isActive: true,
  },

  // ─── BOSE EARBUDS ─────────────────────────────────────────────────────────
  {
    category: "earbuds",
    brand: "Bose",
    modelName: "Bose QuietComfort Ultra Earbuds",
    slug: "bose-quietcomfort-ultra-earbuds",
    imageUrl: "https://m.media-amazon.com/images/I/51rpbvy2ZEL._SL1500_.jpg",
    description: "Sell your Bose QuietComfort Ultra wireless noise cancelling earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 13500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Bose",
    modelName: "Bose QuietComfort Earbuds II",
    slug: "bose-quietcomfort-earbuds-ii",
    imageUrl: "https://m.media-amazon.com/images/I/61GgC9H216L._SL1500_.jpg",
    description: "Sell your Bose QuietComfort Earbuds II online with SecondSale. Top buyback price guaranteed.",
    variants: [{ storage: "Standard", basePrice: 9800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Bose",
    modelName: "Bose QuietComfort Earbuds (1st Gen)",
    slug: "bose-quietcomfort-earbuds-1st-gen",
    imageUrl: "https://m.media-amazon.com/images/I/61d9q3f92YL._SL1500_.jpg",
    description: "Sell your Bose QuietComfort Earbuds online with SecondSale. Instant quote and pickup.",
    variants: [{ storage: "Standard", basePrice: 6500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Bose",
    modelName: "Bose Sport Earbuds",
    slug: "bose-sport-earbuds",
    imageUrl: "https://m.media-amazon.com/images/I/51a3dEvdCGL._SL1500_.jpg",
    description: "Sell your Bose Sport true wireless workout earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 4800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Bose",
    modelName: "Bose SoundSport Free",
    slug: "bose-soundsport-free",
    imageUrl: "https://m.media-amazon.com/images/I/61SSVxTSs3L._SL1500_.jpg",
    description: "Sell your Bose SoundSport Free wireless earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 3200 }],
    isActive: true,
  },

  // ─── GOOGLE PIXEL BUDS ───────────────────────────────────────────────────
  {
    category: "earbuds",
    brand: "Google",
    modelName: "Google Pixel Buds Pro 2",
    slug: "google-pixel-buds-pro-2",
    imageUrl: "https://m.media-amazon.com/images/I/516L9yF-KBL._SL1500_.jpg",
    description: "Sell your Google Pixel Buds Pro 2 online with SecondSale. Free doorstep pickup.",
    variants: [{ storage: "Standard", basePrice: 11500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Google",
    modelName: "Google Pixel Buds Pro",
    slug: "google-pixel-buds-pro",
    imageUrl: "https://m.media-amazon.com/images/I/516+2w3o2ML._SL1500_.jpg",
    description: "Sell your Google Pixel Buds Pro online with SecondSale. Best price guaranteed.",
    variants: [{ storage: "Standard", basePrice: 6800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Google",
    modelName: "Google Pixel Buds A-Series",
    slug: "google-pixel-buds-a-series",
    imageUrl: "https://m.media-amazon.com/images/I/51BqjU2o-7L._SL1500_.jpg",
    description: "Sell your Google Pixel Buds A-Series online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 3200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Google",
    modelName: "Google Pixel Buds (2nd Gen)",
    slug: "google-pixel-buds-2nd-gen",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pixel_Buds_in_charging_case_with_product_box.jpg/800px-Pixel_Buds_in_charging_case_with_product_box.jpg",
    description: "Sell your Google Pixel Buds 2nd Gen online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2400 }],
    isActive: true,
  },

  // ─── SAMSUNG GALAXY BUDS ─────────────────────────────────────────────────
  {
    category: "earbuds",
    brand: "Samsung",
    modelName: "Galaxy Buds3 Pro",
    slug: "samsung-galaxy-buds3-pro",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-r630nzaainu/gallery/in-galaxy-buds3-pro-r630-sm-r630nzaainu-542385627?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds3 Pro online with SecondSale. Top price & instant cash.",
    variants: [{ storage: "Standard", basePrice: 9500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Samsung",
    modelName: "Galaxy Buds3",
    slug: "samsung-galaxy-buds3",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-r530nzaainu/gallery/in-galaxy-buds3-r530-sm-r530nzaainu-542385412?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds3 online with SecondSale. Doorstep pickup.",
    variants: [{ storage: "Standard", basePrice: 6500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Samsung",
    modelName: "Galaxy Buds2 Pro",
    slug: "samsung-galaxy-buds2-pro",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2208/gallery/in-galaxy-buds2-pro-r510-sm-r510nzaainu-533193237?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds2 Pro online with SecondSale. Highest price guaranteed.",
    variants: [{ storage: "Standard", basePrice: 4800 }],
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
    modelName: "Galaxy Buds2",
    slug: "samsung-galaxy-buds2",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2108/gallery/in-galaxy-buds2-r177-sm-r177nzgainu-488691515?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Buds2 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2500 }],
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

  // ─── ONEPLUS BUDS ────────────────────────────────────────────────────────
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Buds Pro 2",
    slug: "oneplus-buds-pro-2",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2023/buds-pro-2/specs/green.png",
    description: "Sell your OnePlus Buds Pro 2 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 4200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Buds 3",
    slug: "oneplus-buds-3",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2024/buds-3/specs/grey.png",
    description: "Sell your OnePlus Buds 3 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Buds Pro",
    slug: "oneplus-buds-pro",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2021/buds-pro/specs/black.png",
    description: "Sell your original OnePlus Buds Pro online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2500 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Nord Buds 2",
    slug: "oneplus-nord-buds-2",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2023/nord-buds-2/specs/white.png",
    description: "Sell your OnePlus Nord Buds 2 online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 1400 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "OnePlus",
    modelName: "OnePlus Nord Buds 2r",
    slug: "oneplus-nord-buds-2r",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/2023/nord-buds-2r/specs/deep-gray.png",
    description: "Sell your OnePlus Nord Buds 2r online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 1100 }],
    isActive: true,
  },

  // ─── NOTHING EARBUDS ─────────────────────────────────────────────────────
  {
    category: "earbuds",
    brand: "Nothing",
    modelName: "Nothing Ear (2024)",
    slug: "nothing-ear-2024",
    imageUrl: "https://m.media-amazon.com/images/I/51rpbvy2ZEL._SL1500_.jpg",
    description: "Sell your flagship Nothing Ear (2024) wireless earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 5800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Nothing",
    modelName: "Nothing Ear (2)",
    slug: "nothing-ear-2",
    imageUrl: "https://m.media-amazon.com/images/I/61GgC9H216L._SL1500_.jpg",
    description: "Sell your Nothing Ear (2) transparent earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 4200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Nothing",
    modelName: "Nothing Ear (a)",
    slug: "nothing-ear-a",
    imageUrl: "https://m.media-amazon.com/images/I/51a3dEvdCGL._SL1500_.jpg",
    description: "Sell your vibrant Nothing Ear (a) earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 3600 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Nothing",
    modelName: "Nothing Ear (1)",
    slug: "nothing-ear-1",
    imageUrl: "https://m.media-amazon.com/images/I/61d9q3f92YL._SL1500_.jpg",
    description: "Sell your original Nothing Ear (1) earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 2800 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Nothing",
    modelName: "CMF by Nothing Buds Pro 2",
    slug: "cmf-by-nothing-buds-pro-2",
    imageUrl: "https://m.media-amazon.com/images/I/516L9yF-KBL._SL1500_.jpg",
    description: "Sell your CMF by Nothing Buds Pro 2 with customizable Smart Dial online.",
    variants: [{ storage: "Standard", basePrice: 2200 }],
    isActive: true,
  },
  {
    category: "earbuds",
    brand: "Nothing",
    modelName: "CMF by Nothing Buds Pro",
    slug: "cmf-by-nothing-buds-pro",
    imageUrl: "https://m.media-amazon.com/images/I/51BqjU2o-7L._SL1500_.jpg",
    description: "Sell your CMF by Nothing Buds Pro wireless earbuds online with SecondSale.",
    variants: [{ storage: "Standard", basePrice: 1500 }],
    isActive: true,
  },
];

const ALLOWED_EARBUDS_BRANDS = ["Apple", "Bose", "Google", "Samsung", "OnePlus", "Nothing"];

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

    // 2. Deactivate any earbuds not in the requested brands list (e.g. boAt, Sony)
    const deactRes = await Device.updateMany(
      {
        category: "earbuds",
        brand: { $nin: ALLOWED_EARBUDS_BRANDS }
      },
      { $set: { isActive: false } }
    );
    console.log(`Deactivated ${deactRes.modifiedCount} earbuds models not in allowed brand list.`);

    // 3. Seed / Upsert Earbuds Devices
    let seededCount = 0;
    for (const d of EARBUDS_MODELS) {
      await Device.findOneAndUpdate(
        { slug: d.slug },
        { $set: d },
        { upsert: true, new: true }
      );
      seededCount++;
    }
    console.log(`Successfully seeded/updated ${seededCount} earbuds models for ${ALLOWED_EARBUDS_BRANDS.join(", ")}!`);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
