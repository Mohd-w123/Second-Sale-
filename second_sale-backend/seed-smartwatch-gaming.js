import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Device from "./models/Device.js";
import Category from "./models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const SMARTWATCH_MODELS = [
  // ─── APPLE WATCH ──────────────────────────────────────────────────────────
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ultra-band-unselect-gallery-1-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Ultra 2 online with SecondSale. Instant quote & free doorstep pickup.",
    variants: [{ storage: "49mm", basePrice: 38000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Series 10",
    slug: "apple-watch-series-10",
    imageUrl: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-1-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Series 10 online with SecondSale. Highest buyback price.",
    variants: [{ storage: "46mm", basePrice: 28000 }, { storage: "42mm", basePrice: 25000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s9-case-unselect-gallery-1-202309?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Series 9 online with SecondSale.",
    variants: [{ storage: "45mm", basePrice: 22000 }, { storage: "41mm", basePrice: 19500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Ultra",
    slug: "apple-watch-ultra",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Ultra online with SecondSale.",
    variants: [{ storage: "49mm", basePrice: 25000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Series 8",
    slug: "apple-watch-series-8",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MP6V3?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Series 8 online with SecondSale.",
    variants: [{ storage: "45mm", basePrice: 17000 }, { storage: "41mm", basePrice: 15000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch SE (2nd Gen)",
    slug: "apple-watch-se-2nd-gen",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MP7G3?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch SE 2nd Gen online with SecondSale.",
    variants: [{ storage: "44mm", basePrice: 12000 }, { storage: "40mm", basePrice: 10500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Series 7",
    slug: "apple-watch-series-7",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MKUQ3?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Series 7 online with SecondSale.",
    variants: [{ storage: "45mm", basePrice: 13500 }, { storage: "41mm", basePrice: 11500 }],
    isActive: true,
  },

  // ─── ONEPLUS WATCH ────────────────────────────────────────────────────────
  {
    category: "smartwatch",
    brand: "OnePlus",
    modelName: "OnePlus Watch 2",
    slug: "oneplus-watch-2",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-watch-2r.jpg",
    description: "Sell your OnePlus Watch 2 with Wear OS and dual-engine architecture online.",
    variants: [{ storage: "46mm", basePrice: 12500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "OnePlus",
    modelName: "OnePlus Watch 2R",
    slug: "oneplus-watch-2r",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-watch-2r.jpg",
    description: "Sell your lightweight OnePlus Watch 2R online with SecondSale.",
    variants: [{ storage: "46mm", basePrice: 9200 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "OnePlus",
    modelName: "OnePlus Watch",
    slug: "oneplus-watch",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-watch.jpg",
    description: "Sell your original OnePlus Watch online with SecondSale.",
    variants: [{ storage: "46mm", basePrice: 4500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "OnePlus",
    modelName: "OnePlus Nord Watch",
    slug: "oneplus-nord-watch",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-watch.jpg",
    description: "Sell your OnePlus Nord Watch with AMOLED display online.",
    variants: [{ storage: "Standard", basePrice: 2200 }],
    isActive: true,
  },

  // ─── SAMSUNG GALAXY WATCH ─────────────────────────────────────────────────
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch Ultra",
    slug: "samsung-galaxy-watch-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-watch-ultra.jpg",
    description: "Sell your rugged Samsung Galaxy Watch Ultra online with SecondSale.",
    variants: [{ storage: "47mm", basePrice: 28000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch 7",
    slug: "samsung-galaxy-watch-7",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-watch7.jpg",
    description: "Sell your Samsung Galaxy Watch 7 with Galaxy AI online.",
    variants: [{ storage: "44mm", basePrice: 16000 }, { storage: "40mm", basePrice: 14000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch 6 Classic",
    slug: "samsung-galaxy-watch-6-classic",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-classic-47mm-r965-sm-r965fzkainu-537406214?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Watch 6 Classic online with SecondSale.",
    variants: [{ storage: "47mm", basePrice: 14000 }, { storage: "43mm", basePrice: 12000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch 6",
    slug: "samsung-galaxy-watch-6",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-44mm-r945-sm-r945fzkainu-537405908?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Watch 6 online with SecondSale.",
    variants: [{ storage: "44mm", basePrice: 11000 }, { storage: "40mm", basePrice: 9500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch 5 Pro",
    slug: "samsung-galaxy-watch-5-pro",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2208/gallery/in-galaxy-watch5-pro-45mm-r925-sm-r925fzkainu-533190827?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Watch 5 Pro online with SecondSale.",
    variants: [{ storage: "45mm", basePrice: 10500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch 5",
    slug: "samsung-galaxy-watch-5",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2208/gallery/in-galaxy-watch5-44mm-r910-sm-r910nzsainu-533190479?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Watch 5 online with SecondSale.",
    variants: [{ storage: "44mm", basePrice: 8000 }, { storage: "40mm", basePrice: 7000 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Samsung",
    modelName: "Galaxy Watch 4",
    slug: "samsung-galaxy-watch-4",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2108/gallery/in-galaxy-watch4-44mm-r870-sm-r870nzsainu-488691167?$650_519_PNG$",
    description: "Sell your Samsung Galaxy Watch 4 online with SecondSale.",
    variants: [{ storage: "44mm", basePrice: 5500 }, { storage: "40mm", basePrice: 4500 }],
    isActive: true,
  },

  // ─── GOOGLE PIXEL WATCH ──────────────────────────────────────────────────
  {
    category: "smartwatch",
    brand: "Google",
    modelName: "Google Pixel Watch 3",
    slug: "google-pixel-watch-3",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Google_Pixel_Watch_2%2C_shown_in_Shibuya_Stream.jpg/800px-Google_Pixel_Watch_2%2C_shown_in_Shibuya_Stream.jpg",
    description: "Sell your Google Pixel Watch 3 with Actua display and Fitbit readiness online.",
    variants: [{ storage: "45mm", basePrice: 21000 }, { storage: "41mm", basePrice: 18500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Google",
    modelName: "Google Pixel Watch 2",
    slug: "google-pixel-watch-2",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Google_Pixel_Watch_2%2C_shown_in_Shibuya_Stream.jpg/800px-Google_Pixel_Watch_2%2C_shown_in_Shibuya_Stream.jpg",
    description: "Sell your Google Pixel Watch 2 with cEDA sensor online with SecondSale.",
    variants: [{ storage: "41mm", basePrice: 13500 }],
    isActive: true,
  },
  {
    category: "smartwatch",
    brand: "Google",
    modelName: "Google Pixel Watch (1st Gen)",
    slug: "google-pixel-watch-1st-gen",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Google_Pixel_Watch_-_1.jpg/800px-Google_Pixel_Watch_-_1.jpg",
    description: "Sell your original Google Pixel Watch online with SecondSale.",
    variants: [{ storage: "41mm", basePrice: 8500 }],
    isActive: true,
  },
];

const GAMING_MODELS = [
  // ─── SONY PLAYSTATION ─────────────────────────────────────────────────────
  {
    category: "gaming",
    brand: "Sony",
    modelName: "PlayStation 5 Pro",
    slug: "sony-playstation-5-pro",
    imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
    description: "Sell your PlayStation 5 Pro with upgraded GPU and AI upscaling online.",
    variants: [{ storage: "2TB Digital Edition", basePrice: 48000 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Sony",
    modelName: "PlayStation 5 (PS5)",
    slug: "sony-playstation-5",
    imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
    description: "Sell your Sony PlayStation 5 console online. Highest cash quote, doorstep pickup.",
    variants: [{ storage: "Disc Edition", basePrice: 38250 }, { storage: "Digital Edition", basePrice: 32500 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Sony",
    modelName: "PlayStation 5 Slim",
    slug: "sony-playstation-5-slim",
    imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-disc-console-product-shot-01-en-24nov23?$facebook$",
    description: "Sell your Sony PS5 Slim online with SecondSale.",
    variants: [{ storage: "1TB Disc Edition", basePrice: 41250 }, { storage: "1TB Digital Edition", basePrice: 35000 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Sony",
    modelName: "PlayStation 4 Pro",
    slug: "sony-playstation-4-pro",
    imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/playstation-4-pro-vertical-product-shot-01-ps4-en-27jun18?$facebook$",
    description: "Sell your Sony PS4 Pro online with SecondSale.",
    variants: [{ storage: "1TB", basePrice: 21050 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Sony",
    modelName: "PlayStation 4 Slim",
    slug: "sony-playstation-4-slim",
    imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps4-slim-image-block-01-en-24jul20?$facebook$",
    description: "Sell your Sony PS4 Slim online with SecondSale.",
    variants: [{ storage: "1TB", basePrice: 17550 }, { storage: "500GB", basePrice: 15500 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Sony",
    modelName: "PlayStation 4",
    slug: "sony-playstation-4",
    imageUrl: "https://m.media-amazon.com/images/I/71Pg8i9kZzL._SL1500_.jpg",
    description: "Sell your Sony PlayStation 4 online with SecondSale.",
    variants: [{ storage: "500GB", basePrice: 15950 }],
    isActive: true,
  },

  // ─── MICROSOFT XBOX ───────────────────────────────────────────────────────
  {
    category: "gaming",
    brand: "Microsoft",
    modelName: "Xbox Series X",
    slug: "microsoft-xbox-series-x",
    imageUrl: "https://compass-ssl.xbox.com/assets/f0/85/f085223c-ecd9-42b7-8d02-a7f45dbb6a03.png?n=Xbox-Series-X_Hero-Mobile_02_767x767.png",
    description: "Sell your Xbox Series X online with SecondSale.",
    variants: [{ storage: "1TB", basePrice: 34500 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Microsoft",
    modelName: "Xbox Series S",
    slug: "microsoft-xbox-series-s",
    imageUrl: "https://compass-ssl.xbox.com/assets/26/ba/26ba6981-d144-4828-b99b-efb2b2b19cf3.png?n=Xbox-Series-S_Hero-Mobile_02_767x767.png",
    description: "Sell your Xbox Series S online with SecondSale.",
    variants: [{ storage: "1TB Carbon Black", basePrice: 22000 }, { storage: "512GB", basePrice: 18500 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Microsoft",
    modelName: "Xbox One X",
    slug: "microsoft-xbox-one-x",
    imageUrl: "https://m.media-amazon.com/images/I/61-qvS2yQAL._SL1000_.jpg",
    description: "Sell your Xbox One X online with SecondSale.",
    variants: [{ storage: "1TB", basePrice: 14500 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Microsoft",
    modelName: "Xbox One S",
    slug: "microsoft-xbox-one-s",
    imageUrl: "https://compass-ssl.xbox.com/assets/f0/85/f085223c-ecd9-42b7-8d02-a7f45dbb6a03.png?n=Xbox-Series-X_Hero-Mobile_02_767x767.png",
    description: "Sell your Xbox One S console online with SecondSale.",
    variants: [{ storage: "1TB", basePrice: 11500 }, { storage: "500GB", basePrice: 9800 }],
    isActive: true,
  },
];

const ALLOWED_SMARTWATCH_BRANDS = ["Apple", "OnePlus", "Samsung", "Google"];
const ALLOWED_GAMING_BRANDS = ["Sony", "Microsoft"];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Update Categories in DB
    await Category.findOneAndUpdate(
      { slug: "smartwatch" },
      {
        $set: {
          name: "Smartwatch",
          route: "/sell-smartwatch/brand",
          icon: "Watch",
          isComingSoon: false,
          isActive: true,
          order: 6,
        }
      },
      { upsert: true }
    );
    console.log("Updated Category: Smartwatch");

    await Category.findOneAndUpdate(
      { slug: "console" },
      {
        $set: {
          name: "Gaming Console",
          slug: "console",
          route: "/sell-gaming/brand",
          icon: "Gamepad2",
          isComingSoon: false,
          isActive: true,
          order: 7,
        }
      },
      { upsert: true }
    );
    console.log("Updated Category: Gaming Console");

    // 2. Deactivate any smartwatch not in allowed brands
    const deactWatch = await Device.updateMany(
      { category: "smartwatch", brand: { $nin: ALLOWED_SMARTWATCH_BRANDS } },
      { $set: { isActive: false } }
    );
    console.log(`Deactivated ${deactWatch.modifiedCount} smartwatch models outside allowed brand list.`);

    // 3. Upsert Smartwatch models
    let watchCount = 0;
    for (const d of SMARTWATCH_MODELS) {
      await Device.findOneAndUpdate({ slug: d.slug }, { $set: d }, { upsert: true });
      watchCount++;
    }
    console.log(`Seeded/updated ${watchCount} Smartwatch models for: ${ALLOWED_SMARTWATCH_BRANDS.join(", ")}`);

    // 4. Deactivate any gaming console not in allowed brands (e.g. Nintendo - user requested Sony & Microsoft ONLY)
    const deactGaming = await Device.updateMany(
      {
        category: { $in: ["gaming", "console"] },
        brand: { $nin: ALLOWED_GAMING_BRANDS }
      },
      { $set: { isActive: false } }
    );
    console.log(`Deactivated ${deactGaming.modifiedCount} gaming models outside allowed brand list (Nintendo).`);

    // 5. Upsert Gaming models
    let gamingCount = 0;
    for (const d of GAMING_MODELS) {
      await Device.findOneAndUpdate({ slug: d.slug }, { $set: d }, { upsert: true });
      gamingCount++;
    }
    console.log(`Seeded/updated ${gamingCount} Gaming Console models for: ${ALLOWED_GAMING_BRANDS.join(", ")}`);

    await mongoose.disconnect();
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
