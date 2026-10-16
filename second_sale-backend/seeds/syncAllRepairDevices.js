import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Device from '../models/Device.js';
import RepairDevice from '../models/RepairDevice.js';
import RepairBrand from '../models/RepairBrand.js';

dotenv.config();

function makeServices(tier) {
  let screenPrice, screenMrp, batteryPrice, batteryMrp, backCamPrice, backCamMrp;
  if (tier === 'ultra_flagship') {
    screenPrice = 16999; screenMrp = 21999;
    batteryPrice = 4999;  batteryMrp = 6999;
    backCamPrice = 11999; backCamMrp = 14999;
  } else if (tier === 'flagship') {
    screenPrice = 11999; screenMrp = 15999;
    batteryPrice = 3999;  batteryMrp = 5499;
    backCamPrice = 8999;  backCamMrp = 11999;
  } else if (tier === 'upper_mid') {
    screenPrice = 6999;  screenMrp = 9999;
    batteryPrice = 2499;  batteryMrp = 3499;
    backCamPrice = 4999;  backCamMrp = 6999;
  } else if (tier === 'mid') {
    screenPrice = 4499;  screenMrp = 6499;
    batteryPrice = 1799;  batteryMrp = 2499;
    backCamPrice = 3499;  backCamMrp = 4999;
  } else {
    screenPrice = 2999;  screenMrp = 4499;
    batteryPrice = 1299;  batteryMrp = 1999;
    backCamPrice = 2299;  backCamMrp = 3299;
  }

  const frontCamPrice = Math.round(screenPrice * 0.35);
  const frontCamMrp = Math.round(screenMrp * 0.35);
  const portPrice = Math.round(batteryPrice * 0.7);
  const portMrp = Math.round(batteryMrp * 0.7);
  const micPrice = Math.round(batteryPrice * 0.55);
  const micMrp = Math.round(batteryMrp * 0.55);
  const speakerPrice = Math.round(batteryPrice * 0.65);
  const speakerMrp = Math.round(batteryMrp * 0.65);
  const receiverPrice = Math.round(batteryPrice * 0.5);
  const receiverMrp = Math.round(batteryMrp * 0.5);
  const backPanelPrice = Math.round(screenPrice * 0.3);
  const backPanelMrp = Math.round(screenMrp * 0.3);

  return {
    screen:        { price: screenPrice,   mrp: screenMrp,   enabled: true, warranty: '6 Months', time: '30-45 mins' },
    battery:       { price: batteryPrice,  mrp: batteryMrp,  enabled: true, warranty: '6 Months', time: '20-30 mins' },
    front_camera:  { price: frontCamPrice, mrp: frontCamMrp, enabled: true, warranty: '3 Months', time: '30-45 mins' },
    back_camera:   { price: backCamPrice,  mrp: backCamMrp,  enabled: true, warranty: '3 Months', time: '30-45 mins' },
    charging_jack: { price: portPrice,     mrp: portMrp,     enabled: true, warranty: '3 Months', time: '30-45 mins' },
    mic:           { price: micPrice,      mrp: micMrp,      enabled: true, warranty: '3 Months', time: '30 mins' },
    speaker:       { price: speakerPrice,  mrp: speakerMrp,  enabled: true, warranty: '3 Months', time: '30 mins' },
    receiver:      { price: receiverPrice, mrp: receiverMrp, enabled: true, warranty: '3 Months', time: '30 mins' },
    back_panel:    { price: backPanelPrice,mrp: backPanelMrp,enabled: true, warranty: '3 Months', time: '45 mins' },
  };
}

function extractSeries(name, brand) {
  const n = (name || '').trim();
  const b = (brand || '').toLowerCase().trim();

  if (b === 'apple') {
    const m = n.match(/iPhone\s+(\d+|SE|X[SR]?)/i);
    if (m) return `iPhone ${m[1]} Series`;
    return 'iPhone Series';
  }
  if (b === 'samsung') {
    if (/Galaxy\s+S\d+/i.test(n)) return 'Galaxy S Series';
    if (/Galaxy\s+Z\s*(Fold|Flip)/i.test(n)) return 'Galaxy Z Series';
    if (/Galaxy\s+Note/i.test(n)) return 'Galaxy Note Series';
    if (/Galaxy\s+A\d+/i.test(n)) return 'Galaxy A Series';
    if (/Galaxy\s+M\d+/i.test(n)) return 'Galaxy M Series';
    if (/Galaxy\s+F\d+/i.test(n)) return 'Galaxy F Series';
    return 'Galaxy Series';
  }
  if (b === 'oneplus') {
    if (/Nord/i.test(n)) return 'OnePlus Nord Series';
    const m = n.match(/OnePlus\s+(\d+[TR]?)/i);
    if (m) return `OnePlus ${m[1]} Series`;
    return 'OnePlus Number Series';
  }
  if (b === 'xiaomi') {
    if (/Redmi\s+Note/i.test(n)) return 'Redmi Note Series';
    if (/Redmi/i.test(n)) return 'Redmi Series';
    if (/Xiaomi\s+\d+|Mi\s+\d+/i.test(n)) return 'Xiaomi Flagship Series';
    return 'Xiaomi Series';
  }
  if (b === 'google') {
    const m = n.match(/Pixel\s+(\d+[a-z]?)/i);
    if (m) return `Pixel ${m[1]} Series`;
    return 'Google Pixel Series';
  }
  if (b === 'vivo') {
    if (/Vivo\s+X/i.test(n)) return 'Vivo X Series';
    if (/Vivo\s+V/i.test(n)) return 'Vivo V Series';
    if (/Vivo\s+T/i.test(n)) return 'Vivo T Series';
    if (/Vivo\s+Y/i.test(n)) return 'Vivo Y Series';
    return 'Vivo Series';
  }
  if (b === 'oppo') {
    if (/Find\s+X/i.test(n)) return 'Oppo Find Series';
    if (/Reno/i.test(n)) return 'Oppo Reno Series';
    if (/Oppo\s+F/i.test(n)) return 'Oppo F Series';
    if (/Oppo\s+A/i.test(n)) return 'Oppo A Series';
    if (/Oppo\s+K/i.test(n)) return 'Oppo K Series';
    return 'Oppo Series';
  }
  if (b === 'realme') {
    if (/GT/i.test(n)) return 'Realme GT Series';
    if (/Narzo/i.test(n)) return 'Realme Narzo Series';
    if (/Realme\s+C/i.test(n)) return 'Realme C Series';
    return 'Realme Number Series';
  }
  if (b === 'motorola') {
    if (/Edge/i.test(n)) return 'Motorola Edge Series';
    if (/Razr/i.test(n)) return 'Motorola Razr Series';
    if (/Moto\s+G/i.test(n)) return 'Moto G Series';
    if (/Moto\s+E/i.test(n)) return 'Moto E Series';
    return 'Motorola Series';
  }
  if (b === 'poco') {
    if (/POCO\s+F/i.test(n)) return 'POCO F Series';
    if (/POCO\s+X/i.test(n)) return 'POCO X Series';
    if (/POCO\s+M/i.test(n)) return 'POCO M Series';
    if (/POCO\s+C/i.test(n)) return 'POCO C Series';
    return 'POCO Series';
  }
  return `${brand} Series`;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const devices = await Device.find({ category: 'mobile', isActive: true });
  console.log(`Found ${devices.length} mobile devices in Device collection`);

  let added = 0;
  let updated = 0;

  for (const d of devices) {
    const brand = d.brand.trim();
    const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const slug = d.slug.toLowerCase().trim();
    const name = d.modelName.trim();
    const image = d.imageUrl || '';
    const series = extractSeries(name, brand);

    const maxPrice = d.variants?.length > 0 
      ? Math.max(...d.variants.map(v => v.basePrice || 0))
      : 0;

    let tier = 'mid';
    if (maxPrice >= 45000) tier = 'ultra_flagship';
    else if (maxPrice >= 25000) tier = 'flagship';
    else if (maxPrice >= 15000) tier = 'upper_mid';
    else if (maxPrice >= 8000) tier = 'mid';
    else tier = 'budget';

    const existing = await RepairDevice.findOne({ brandSlug, slug });
    if (!existing) {
      await RepairDevice.create({
        brand,
        brandSlug,
        name,
        slug,
        image,
        series,
        services: makeServices(tier),
        isActive: true,
        sortOrder: 0,
      });
      added++;
    } else {
      let needsSave = false;
      if (!existing.image && image) {
        existing.image = image;
        needsSave = true;
      }
      if (!existing.series) {
        existing.series = series;
        needsSave = true;
      }
      if (needsSave) {
        await existing.save();
        updated++;
      }
    }
  }

  console.log(`Successfully added ${added} new repair devices, updated ${updated}`);

  // Now ensure all repair brands exist and have correct sortOrder and logos
  const brandList = await RepairDevice.distinct('brand');
  console.log('Distinct repair brands in DB:', brandList);

  for (const bName of brandList) {
    const bSlug = bName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const count = await RepairDevice.countDocuments({ brandSlug: bSlug, isActive: true });
    await RepairBrand.findOneAndUpdate(
      { slug: bSlug },
      {
        name: bName,
        slug: bSlug,
        isActive: true,
      },
      { upsert: true }
    );
    console.log(`Brand ${bName} (${bSlug}): ${count} models`);
  }

  const finalCount = await RepairDevice.countDocuments({ isActive: true });
  console.log(`Total active repair devices in DB: ${finalCount}`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
