import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import RefurbishedDevice from './models/RefurbishedDevice.js';

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
};

const DEVICES = [
  // ── iPhones ────────────────────────────────────────────────────────────────
  {
    slug: 'buy-refurbished-apple-iphone-15',
    title: 'Apple iPhone 15 (Refurbished)',
    category: 'mobile',
    brand: 'Apple',
    modelName: 'iPhone 15',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=800&hei=800&fmt=jpeg',
    ],
    variants: [
      { storage: '128GB', color: 'Black', colorHex: '#1c1c1e' },
      { storage: '256GB', color: 'Black', colorHex: '#1c1c1e' },
      { storage: '128GB', color: 'Pink', colorHex: '#f2a7c3' },
      { storage: '256GB', color: 'Blue', colorHex: '#add8e6' },
    ],
    conditionGrades: {
      superb: {
        price: 62999, originalPrice: 79900, stock: 8,
        description: 'Flawless — Looks like brand new. 0 visible scratches.',
        bulletPoints: ['No scratches on screen or body', 'Original display & battery', 'Battery health ≥ 95%'],
      },
      veryGood: {
        price: 55999, originalPrice: 79900, stock: 14,
        description: 'Very Good — Minor cosmetic micro-marks. Functionally perfect.',
        bulletPoints: ['Micro-marks only visible under bright light', 'Original display guaranteed', 'Battery health ≥ 90%'],
      },
      good: {
        price: 48999, originalPrice: 79900, stock: 20,
        description: 'Good — Light visible signs of regular use. 100% functional.',
        bulletPoints: ['Visible light scratches on body', 'Screen fully original & functional', 'Battery health ≥ 85%'],
      },
    },
    specs: [
      { key: 'Display', value: '6.1-inch Super Retina XDR (OLED), 460 ppi' },
      { key: 'Processor', value: 'Apple A16 Bionic chip' },
      { key: 'Rear Camera', value: '48MP Main + 12MP Ultra Wide' },
      { key: 'Front Camera', value: '12MP TrueDepth' },
      { key: 'Battery', value: '3,877 mAh | 20W Fast Charging' },
      { key: 'OS', value: 'iOS 17 (upgradeable to latest)' },
      { key: 'Connectivity', value: '5G, WiFi 6, Bluetooth 5.3, USB-C' },
    ],
    warrantyMonths: 6,
    qualityPoints: [
      '32-Point Quality Inspection Passed',
      'Display & Touch Screen Certified Original',
      'Battery Health Guaranteed (≥ 85%)',
      'All Cameras — Front & Rear — Fully Functional',
      'Face ID & Biometrics Verified',
      'Network (5G/4G/WiFi/Bluetooth) Tested',
      'Speakers, Microphone & Earpiece Tested',
      'Charging Port, Volume & Side Buttons Verified',
      'IMEI Clean — No Blacklist / Finance Lock',
      'iCloud Unlocked — Ready to Use',
    ],
    inTheBox: ['iPhone 15', 'Compatible Fast Charger (20W)', 'USB-C Cable', '6-Month SecondSale Warranty Card', 'Purchase Invoice'],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 312,
    soldCount: 1420,
  },
  {
    slug: 'buy-refurbished-apple-iphone-14',
    title: 'Apple iPhone 14 (Refurbished)',
    category: 'mobile',
    brand: 'Apple',
    modelName: 'iPhone 14',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=800&hei=800&fmt=jpeg',
    ],
    variants: [
      { storage: '128GB', color: 'Midnight', colorHex: '#1c1c1e' },
      { storage: '256GB', color: 'Midnight', colorHex: '#1c1c1e' },
      { storage: '128GB', color: 'Purple', colorHex: '#c4b5fd' },
    ],
    conditionGrades: {
      superb: { price: 52999, originalPrice: 69900, stock: 10, description: 'Flawless', bulletPoints: ['No visible scratches', 'Battery ≥ 95%', 'Original parts'] },
      veryGood: { price: 46999, originalPrice: 69900, stock: 18, description: 'Very Good', bulletPoints: ['Micro-marks only', 'Battery ≥ 90%'] },
      good: { price: 39999, originalPrice: 69900, stock: 25, description: 'Good', bulletPoints: ['Light scratches', 'Battery ≥ 85%'] },
    },
    specs: [
      { key: 'Display', value: '6.1-inch Super Retina XDR, 460 ppi' },
      { key: 'Processor', value: 'Apple A15 Bionic chip' },
      { key: 'Rear Camera', value: '12MP Main + 12MP Ultra Wide' },
      { key: 'Battery', value: '3,279 mAh | 20W Fast Charging' },
      { key: 'OS', value: 'iOS 16+ (upgradeable)' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Quality Inspection Passed', 'IMEI Clean & iCloud Unlocked', 'Battery Health ≥ 85%', 'All functions verified'],
    inTheBox: ['iPhone 14', 'Compatible Charger', 'USB-C Cable', 'Warranty Card', 'Invoice'],
    isFeatured: true,
    rating: 4.8,
    reviewCount: 521,
    soldCount: 2340,
  },
  {
    slug: 'buy-refurbished-apple-iphone-13',
    title: 'Apple iPhone 13 (Refurbished)',
    category: 'mobile',
    brand: 'Apple',
    modelName: 'iPhone 13',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-finish-select-2021-starlight?wid=800&hei=800&fmt=jpeg',
    ],
    variants: [
      { storage: '128GB', color: 'Starlight', colorHex: '#f5f5f0' },
      { storage: '256GB', color: 'Starlight', colorHex: '#f5f5f0' },
      { storage: '128GB', color: 'Midnight', colorHex: '#1c1c1e' },
    ],
    conditionGrades: {
      superb: { price: 42999, originalPrice: 59900, stock: 15, description: 'Flawless', bulletPoints: ['No scratches', 'Battery ≥ 95%'] },
      veryGood: { price: 37999, originalPrice: 59900, stock: 22, description: 'Very Good', bulletPoints: ['Micro-marks', 'Battery ≥ 90%'] },
      good: { price: 32999, originalPrice: 59900, stock: 30, description: 'Good', bulletPoints: ['Light scratches', 'Battery ≥ 85%'] },
    },
    specs: [
      { key: 'Display', value: '6.1-inch Super Retina XDR, 460 ppi' },
      { key: 'Processor', value: 'Apple A15 Bionic chip' },
      { key: 'Battery', value: '3,227 mAh | 20W Fast Charging' },
      { key: 'OS', value: 'iOS 15+ (upgradeable)' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Inspection', 'IMEI Clean', 'Battery ≥ 85%', 'All verified'],
    inTheBox: ['iPhone 13', 'Charger', 'Cable', 'Warranty Card', 'Invoice'],
    isFeatured: false,
    rating: 4.8,
    reviewCount: 890,
    soldCount: 4120,
  },
  // ── Samsung ────────────────────────────────────────────────────────────────
  {
    slug: 'buy-refurbished-samsung-galaxy-s23',
    title: 'Samsung Galaxy S23 (Refurbished)',
    category: 'mobile',
    brand: 'Samsung',
    modelName: 'Galaxy S23',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-s911-sm-s911bzkcins-534863834?$650_519_PNG$',
    ],
    variants: [
      { storage: '128GB', color: 'Phantom Black', colorHex: '#1a1a1a' },
      { storage: '256GB', color: 'Phantom Black', colorHex: '#1a1a1a' },
      { storage: '128GB', color: 'Cream', colorHex: '#faf0e6' },
    ],
    conditionGrades: {
      superb: { price: 44999, originalPrice: 74999, stock: 8, description: 'Flawless', bulletPoints: ['No scratches', 'Battery ≥ 95%'] },
      veryGood: { price: 39999, originalPrice: 74999, stock: 14, description: 'Very Good', bulletPoints: ['Micro-marks', 'Battery ≥ 90%'] },
      good: { price: 34999, originalPrice: 74999, stock: 20, description: 'Good', bulletPoints: ['Light scratches', 'Battery ≥ 85%'] },
    },
    specs: [
      { key: 'Display', value: '6.1-inch Dynamic AMOLED 2X, 120Hz' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 2' },
      { key: 'Rear Camera', value: '50MP + 12MP + 10MP Triple Camera' },
      { key: 'Battery', value: '3,900 mAh | 25W Fast Charging' },
      { key: 'OS', value: 'Android 13 (upgradeable to Android 14)' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Inspection', 'IMEI Clean', 'Battery ≥ 85%', 'All verified'],
    inTheBox: ['Galaxy S23', 'USB-C Cable', 'Ejection Pin', 'Warranty Card', 'Invoice'],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 445,
    soldCount: 1890,
  },
  // ── Laptops ────────────────────────────────────────────────────────────────
  {
    slug: 'buy-refurbished-apple-macbook-air-m1',
    title: 'Apple MacBook Air M1 (Refurbished)',
    category: 'laptop',
    brand: 'Apple',
    modelName: 'MacBook Air M1',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-201810?wid=800&hei=600&fmt=jpeg',
    ],
    variants: [
      { storage: '256GB SSD | 8GB RAM', color: 'Space Grey', colorHex: '#717378' },
      { storage: '512GB SSD | 8GB RAM', color: 'Space Grey', colorHex: '#717378' },
      { storage: '256GB SSD | 8GB RAM', color: 'Silver', colorHex: '#d1d1d6' },
    ],
    conditionGrades: {
      superb: { price: 72999, originalPrice: 99900, stock: 6, description: 'Flawless', bulletPoints: ['No dents or scratches', 'Battery cycles < 100', 'All ports work'] },
      veryGood: { price: 64999, originalPrice: 99900, stock: 10, description: 'Very Good', bulletPoints: ['Minor cosmetic marks', 'Battery cycles < 150', 'All functions verified'] },
      good: { price: 56999, originalPrice: 99900, stock: 15, description: 'Good', bulletPoints: ['Visible use marks', 'Battery cycles < 200', 'All ports functional'] },
    },
    specs: [
      { key: 'Display', value: '13.3-inch Liquid Retina, 2560×1600' },
      { key: 'Processor', value: 'Apple M1 chip, 8-core CPU' },
      { key: 'GPU', value: '7-core or 8-core GPU' },
      { key: 'Battery', value: 'Up to 18 hours battery life' },
      { key: 'OS', value: 'macOS Ventura / Sonoma' },
      { key: 'Ports', value: '2x Thunderbolt/USB 4, MagSafe 2, 3.5mm headphone' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Laptop Inspection', 'Display & Backlight verified', 'Keyboard & Trackpad tested', 'All ports functional', 'Battery health guaranteed', 'IMEI/Serial clean'],
    inTheBox: ['MacBook Air M1', 'MagSafe 2 Charger', '6-Month Warranty Card', 'Invoice'],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 267,
    soldCount: 980,
  },
  // ── iPad ──────────────────────────────────────────────────────────────────
  {
    slug: 'buy-refurbished-apple-ipad-10th-gen',
    title: 'Apple iPad 10th Generation (Refurbished)',
    category: 'tablet',
    brand: 'Apple',
    modelName: 'iPad 10th Gen',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi?wid=800&hei=800&fmt=jpeg',
    ],
    variants: [
      { storage: '64GB | WiFi', color: 'Blue', colorHex: '#5ac8fa' },
      { storage: '256GB | WiFi', color: 'Blue', colorHex: '#5ac8fa' },
      { storage: '64GB | WiFi', color: 'Silver', colorHex: '#d1d1d6' },
      { storage: '64GB | WiFi + Cellular', color: 'Blue', colorHex: '#5ac8fa' },
    ],
    conditionGrades: {
      superb: { price: 37999, originalPrice: 44900, stock: 6, description: 'Flawless', bulletPoints: ['No scratches', 'Battery ≥ 95%'] },
      veryGood: { price: 33999, originalPrice: 44900, stock: 12, description: 'Very Good', bulletPoints: ['Micro-marks', 'Battery ≥ 90%'] },
      good: { price: 29999, originalPrice: 44900, stock: 16, description: 'Good', bulletPoints: ['Light scratches', 'Battery ≥ 85%'] },
    },
    specs: [
      { key: 'Display', value: '10.9-inch Liquid Retina, 2360×1640' },
      { key: 'Processor', value: 'Apple A14 Bionic chip' },
      { key: 'Cameras', value: '12MP rear, 12MP Ultra Wide front' },
      { key: 'Battery', value: 'Up to 10 hours web surfing' },
      { key: 'OS', value: 'iPadOS 16+ (upgradeable)' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Inspection', 'Display verified', 'Apple Pencil port tested', 'Battery ≥ 85%', 'WiFi/Cellular verified'],
    inTheBox: ['iPad 10th Gen', 'USB-C Cable', 'Compatible Charger', 'Warranty Card', 'Invoice'],
    isFeatured: false,
    rating: 4.8,
    reviewCount: 178,
    soldCount: 640,
  },
  // ── Gaming Console ────────────────────────────────────────────────────────
  {
    slug: 'buy-refurbished-sony-playstation-5',
    title: 'Sony PlayStation 5 Disc Edition (Refurbished)',
    category: 'console',
    brand: 'Sony',
    modelName: 'PlayStation 5',
    images: [
      'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$native$',
    ],
    variants: [
      { storage: '825GB SSD', color: 'White', colorHex: '#f5f5f5' },
    ],
    conditionGrades: {
      superb: { price: 44999, originalPrice: 54990, stock: 4, description: 'Flawless', bulletPoints: ['No scratches', 'Full functionality', 'All ports tested'] },
      veryGood: { price: 39999, originalPrice: 54990, stock: 8, description: 'Very Good', bulletPoints: ['Minor marks', 'Disc drive perfect', 'All ports tested'] },
      good: { price: 34999, originalPrice: 54990, stock: 12, description: 'Good', bulletPoints: ['Light cosmetic marks', 'All functions working'] },
    },
    specs: [
      { key: 'CPU', value: 'AMD Zen 2 (8-Core, 3.5 GHz)' },
      { key: 'GPU', value: '10.28 TFLOPS RDNA 2' },
      { key: 'Storage', value: '825GB Custom NVMe SSD' },
      { key: 'Resolution', value: 'Up to 8K, supports 4K 120Hz' },
      { key: 'Disc Drive', value: 'Ultra HD Blu-ray' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Console Inspection', 'Disc Drive tested', 'HDMI & USB ports verified', 'Bluetooth & WiFi tested', 'Original DualSense controller included', 'No mod/jailbreak'],
    inTheBox: ['PS5 Console', 'DualSense Wireless Controller', 'HDMI Cable', 'USB-C Cable', 'Power Cable', 'Warranty Card', 'Invoice'],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 198,
    soldCount: 520,
  },
  // ── Smartwatch ────────────────────────────────────────────────────────────
  {
    slug: 'buy-refurbished-apple-watch-series-8',
    title: 'Apple Watch Series 8 (Refurbished)',
    category: 'smartwatch',
    brand: 'Apple',
    modelName: 'Apple Watch Series 8',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-8s_VW_34FR_WF_CO?wid=700&hei=700&fmt=jpeg',
    ],
    variants: [
      { storage: '41mm | GPS', color: 'Midnight', colorHex: '#1c1c1e' },
      { storage: '45mm | GPS', color: 'Midnight', colorHex: '#1c1c1e' },
      { storage: '45mm | GPS + Cellular', color: 'Silver', colorHex: '#d1d1d6' },
    ],
    conditionGrades: {
      superb: { price: 27999, originalPrice: 44900, stock: 5, description: 'Flawless', bulletPoints: ['No screen scratches', 'Battery ≥ 95%', 'All sensors working'] },
      veryGood: { price: 24999, originalPrice: 44900, stock: 10, description: 'Very Good', bulletPoints: ['Micro-marks', 'Battery ≥ 90%'] },
      good: { price: 20999, originalPrice: 44900, stock: 14, description: 'Good', bulletPoints: ['Light scratches', 'Battery ≥ 85%'] },
    },
    specs: [
      { key: 'Display', value: '41mm or 45mm LTPO2 OLED Retina' },
      { key: 'Processor', value: 'Apple S8 chip' },
      { key: 'Health Sensors', value: 'ECG, Blood Oxygen, Temperature, Crash Detection' },
      { key: 'Battery', value: 'Up to 18 hours (36hr Low Power Mode)' },
      { key: 'OS', value: 'watchOS 9+ (upgradeable)' },
    ],
    warrantyMonths: 6,
    qualityPoints: ['32-Point Smartwatch Inspection', 'Display & Digital Crown tested', 'Heart rate & ECG verified', 'All buttons functional', 'Battery health ≥ 85%'],
    inTheBox: ['Apple Watch Series 8', 'Magnetic Fast Charger Cable', 'Band', 'Warranty Card', 'Invoice'],
    isFeatured: false,
    rating: 4.8,
    reviewCount: 134,
    soldCount: 380,
  },
];

const seed = async () => {
  try {
    await connect();
    // Remove existing seeded refurbished
    const existingSlugs = DEVICES.map(d => d.slug);
    await RefurbishedDevice.deleteMany({ slug: { $in: existingSlugs } });
    const inserted = await RefurbishedDevice.insertMany(DEVICES);
    console.log(`Seeded ${inserted.length} refurbished devices`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
