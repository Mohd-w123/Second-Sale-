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
  { name: "Xiaomi", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/cb96df6e-080f.jpg?w=200" },
  { name: "Samsung", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/406a512d-e8dd.jpg?w=200" },
  { name: "OnePlus", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/dfb6c340-010f.jpg?w=200" },
  { name: "Motorola", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/1dcd7fda-0141.jpg?w=200" },
  { name: "Nokia", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/fef4e5ae-6507.jpg?w=200" },
  { name: "Sony", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/125aada5-a86f.jpg?w=200" },
  { name: "Micromax", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/7bdd775a-6d1e.jpg?w=200" },
  { name: "Haier", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/01475b30-dee9.jpg?w=200" },
  { name: "LG", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/bdbdc48e-dd24.jpg?w=200" },
  { name: "Onida", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/ea1c6af5-ea74.jpg?w=200" },
  { name: "Videocon", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/573595fe96088.jpg?w=200" },
  { name: "Sansui", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/fd603226-dbe3.jpg?w=200" },
  { name: "Philips", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/9535df81-5a3c.jpg?w=200" },
  { name: "Panasonic", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/45cf78a0-601e.jpg?w=200" },
  { name: "Toshiba", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/99979e7c-a3e1.jpg?w=200" },
  { name: "Intex", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/7d38aacc-176b.jpg?w=200" },
  { name: "TCL", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/986f2bc3-7006.jpg?w=200" },
  { name: "Vu", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/35534ab1-0483.jpg?w=200" },
  { name: "BPL", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/865e9527-9762.jpg?w=200" },
  { name: "Hisense", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/9497e5b1-ecc6.jpg?w=200" },
  { name: "AOC", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/f18f9a96-c06e.jpg?w=200" },
  { name: "Belco", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/b5fea7ce-e15a.jpg?w=200" },
  { name: "Bravieo", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/92f89616-1fb7.jpg?w=200" },
  { name: "Blaupunkt", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/8dc6c085-2250.jpg?w=200" },
  { name: "Kodak", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/c521bcd2-e3a5.jpg?w=200" },
  { name: "Lloyd", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/fea79b86-cb5f.jpg?w=200" },
  { name: "iFFalcon", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/4698e113-166c.jpg?w=200" },
  { name: "Thomson", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/dc594838-2bcc.jpg?w=200" },
  { name: "Sanyo", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/4583ab70-38df.jpg?w=200" },
  { name: "Polaroid", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/421353a5-6332.jpg?w=200" },
  { name: "Oscar", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/fb01ac20-e308.jpg?w=200" },
  { name: "Noble", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/02faaba1-c0e8.jpg?w=200" },
  { name: "Mitashi", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/e397c364-739c.jpg?w=200" },
  { name: "Weston", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/ffb71bdf-f731.jpg?w=200" },
  { name: "Coocaa", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/f4a76556-8fe1.jpg?w=200" },
  { name: "MarQ", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/6e2f36d5-bf81.jpg?w=200" },
  { name: "InFocus", logo: "https://s3ng.cashify.in/cashify/brand/img/xhdpi/913e8e55-6051.jpg?w=200" }
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
  Philips: 0.90,
  Panasonic: 0.90,
  TCL: 0.88,
  Vu: 0.85,
  Motorola: 0.85,
  Nokia: 0.85,
  Haier: 0.82,
  Toshiba: 0.82,
  Sansui: 0.80,
  Hisense: 0.80,
  Blaupunkt: 0.80,
  Kodak: 0.75,
  Lloyd: 0.75,
  iFFalcon: 0.75,
  Micromax: 0.75,
  Onida: 0.75,
  Videocon: 0.75,
  Intex: 0.72,
  BPL: 0.72,
  Thomson: 0.72,
  AOC: 0.72,
  Sanyo: 0.72,
  Polaroid: 0.70,
  MarQ: 0.70,
  Coocaa: 0.70,
  Mitashi: 0.70,
  Weston: 0.70,
  Noble: 0.70,
  InFocus: 0.70,
  Oscar: 0.68,
  Belco: 0.68,
  Bravieo: 0.68,
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
          screenSize: tier.name.replace(" TV", ""),
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

    console.log(`✓ Successfully seeded ${tvDevices.length} TV models across ${TV_BRANDS.length} brands!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding TV models:", error);
    process.exit(1);
  }
}

seedTVs();
