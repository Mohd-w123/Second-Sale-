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
  // --- Apple Watch ---
  {
    category: "smartwatch",
    brand: "Apple",
    modelName: "Apple Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ultra-band-unselect-gallery-1-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
    description: "Sell your Apple Watch Ultra 2 online with SecondSale. Instant quote & free doorstep pickup.",
    variants: [{ storage: "49mm", basePrice: 35000 }],
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

  // --- Samsung Galaxy Watch ---
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
  }
];

const GAMING_MODELS = [
  // --- Sony PlayStation ---
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

  // --- Microsoft Xbox ---
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
    variants: [{ storage: "512GB", basePrice: 18500 }],
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

  // --- Nintendo ---
  {
    category: "gaming",
    brand: "Nintendo",
    modelName: "Nintendo Switch OLED",
    slug: "nintendo-switch-oled",
    imageUrl: "https://assets.nintendo.com/image/upload/b_white,c_pad,f_auto,h_382,q_auto,w_573/ncom/en_US/switch/system/three-modes-in-one-oled",
    description: "Sell your Nintendo Switch OLED console online with SecondSale.",
    variants: [{ storage: "64GB", basePrice: 19500 }],
    isActive: true,
  },
  {
    category: "gaming",
    brand: "Nintendo",
    modelName: "Nintendo Switch (Standard)",
    slug: "nintendo-switch-standard",
    imageUrl: "https://assets.nintendo.com/image/upload/b_white,c_pad,f_auto,h_382,q_auto,w_573/ncom/en_US/switch/system/three-modes-in-one",
    description: "Sell your Nintendo Switch console online with SecondSale.",
    variants: [{ storage: "32GB", basePrice: 13500 }],
    isActive: true,
  }
];

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

    // 2. Upsert Smartwatch models
    for (const d of SMARTWATCH_MODELS) {
      await Device.findOneAndUpdate({ slug: d.slug }, { $set: d }, { upsert: true });
    }
    console.log(`Seeded ${SMARTWATCH_MODELS.length} Smartwatch models`);

    // 3. Upsert Gaming models
    for (const d of GAMING_MODELS) {
      await Device.findOneAndUpdate({ slug: d.slug }, { $set: d }, { upsert: true });
    }
    console.log(`Seeded ${GAMING_MODELS.length} Gaming Console models`);

    await mongoose.disconnect();
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
