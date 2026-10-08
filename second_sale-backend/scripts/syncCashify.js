import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchPage(url) {
  const fullUrl = url.startsWith('http') ? url : `https://www.cashify.in${url}`;
  const res = await fetch(fullUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${fullUrl} (Status: ${res.status})`);
  }
  return await res.text();
}

function parseModelDetails(html, pageUrl) {
  // 1. Model Name
  let modelName = '';
  const h1Match = html.match(/<h1[^>]*>Sell (?:Old |Your )?([^<]+)<\/h1>/i);
  if (h1Match) {
    modelName = h1Match[1].trim();
  } else {
    const h2Match = html.match(/<h2 class=\"body1\">([^<]+)<\/h2>/i);
    if (h2Match) modelName = h2Match[1].trim();
  }

  // 2. Base Price
  let basePrice = 0;
  const priceMatch = html.match(/itemProp=\"price\"[^>]*>(\d+)<\/span>/i) ||
                     html.match(/<span class=\"display5 text-error\">₹([0-9,]+)<\/span>/i);
  if (priceMatch) {
    basePrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // 3. Brand
  let brand = '';
  const brandMatch = html.match(/itemProp=\"brand\"[^>]*>([^<]+)<\/div>/i);
  if (brandMatch) {
    brand = brandMatch[1].trim();
    if (brand.includes('/')) brand = brand.split('/')[0].trim();
  }

  // 4. Image
  let imageUrl = '';
  const imgMatch = html.match(/<img[^>]+data-src=\"(https:\/\/s3n[g]?\.cashify\.in[^\"]+)\"/i) ||
                   html.match(/<img[^>]+src=\"(https:\/\/s3n[g]?\.cashify\.in[^\"]+)\"/i);
  if (imgMatch) {
    imageUrl = imgMatch[1].split('?')[0]; // Clean query params
  }

  // 5. Variants
  const variantLinks = [];
  const variantBlock = html.match(/Choose a variant<\/span><ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (variantBlock) {
    const listItems = [...variantBlock[1].matchAll(/<li[^>]*>[\s\S]*?<a[^>]+href=\"([^\"]+)\"[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi)];
    for (const item of listItems) {
      variantLinks.push({
        href: item[1],
        storageLabel: item[2].trim()
      });
    }
  }

  // Determine category
  const isLaptop = pageUrl.includes('sell-old-laptop');
  const category = isLaptop ? 'laptop' : 'mobile';

  return {
    modelName,
    brand,
    basePrice,
    imageUrl,
    category,
    variantLinks,
    pageUrl
  };
}

async function extractVariantsWithPrices(variantLinks) {
  const variants = [];
  for (const vl of variantLinks) {
    try {
      const vHtml = await fetchPage(vl.href);
      const priceMatch = vHtml.match(/itemProp=\"price\"[^>]*>(\d+)<\/span>/i) ||
                         vHtml.match(/<span class=\"display5 text-error\">₹([0-9,]+)<\/span>/i);
      const vPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 0;
      
      // Determine RAM if present in URL
      const ramMatch = vl.href.match(/-(\d+)-gb-/);
      const ram = ramMatch ? `${ramMatch[1]}GB` : '';
      const storage = vl.storageLabel || 'Standard';

      variants.push({
        storage,
        ram,
        basePrice: vPrice
      });
    } catch (e) {
      console.warn(`Could not fetch variant price for ${vl.href}: ${e.message}`);
    }
  }
  return variants;
}

function generateSlug(brand, modelName) {
  const cleanBrand = (brand || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanModel = (modelName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (cleanModel.startsWith(cleanBrand)) {
    return cleanModel;
  }
  return `${cleanBrand}-${cleanModel}`;
}

export async function syncSingleCashifyUrl(url) {
  console.log(`\n🔍 Fetching Cashify data from: ${url}`);
  const html = await fetchPage(url);
  const data = parseModelDetails(html, url);

  if (!data.modelName || !data.basePrice) {
    throw new Error(`Could not parse modelName or basePrice from ${url}`);
  }

  console.log(`✅ Extracted: ${data.modelName} (${data.brand})`);
  console.log(`   Category: ${data.category}`);
  console.log(`   Base "Get Upto" Price: ₹${data.basePrice.toLocaleString('en-IN')}`);
  if (data.imageUrl) console.log(`   Image URL: ${data.imageUrl}`);

  let variants = [];
  if (data.variantLinks.length > 0) {
    console.log(`   Found ${data.variantLinks.length} variants on Cashify. Fetching variant prices...`);
    variants = await extractVariantsWithPrices(data.variantLinks);
    console.log(`   Variant Prices:`, variants.map(v => `${v.storage}: ₹${v.basePrice}`).join(', '));
  } else {
    // Single baseline variant (typical for laptops)
    variants = [{
      storage: 'Standard',
      processor: data.category === 'laptop' ? 'Intel Core i3' : '',
      generation: '10th Gen',
      ram: '',
      storageType: 'SSD',
      basePrice: data.basePrice
    }];
  }

  // Connect to DB if not connected
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Search existing device by slug or regex modelName
  const searchRegex = new RegExp(`^${data.modelName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i');
  let device = await Device.findOne({
    category: data.category,
    $or: [{ modelName: searchRegex }, { modelName: new RegExp(data.modelName, 'i') }]
  });

  if (!device) {
    // Search by generated slug
    const generatedSlug = generateSlug(data.brand, data.modelName);
    device = await Device.findOne({ slug: generatedSlug });
  }

  if (device) {
    console.log(`🔄 Updating existing device in MongoDB: "${device.modelName}" (ID: ${device._id})`);
    device.basePrice = data.basePrice;
    if (variants.length > 0) device.variants = variants;
    if (data.imageUrl && !device.imageUrl) device.imageUrl = data.imageUrl;
    await device.save();
    console.log(`✨ Successfully synchronized "${device.modelName}" to Cashify base price ₹${data.basePrice.toLocaleString('en-IN')}`);
  } else {
    const slug = generateSlug(data.brand, data.modelName);
    console.log(`➕ Creating new device in MongoDB: "${data.modelName}" (Slug: ${slug})`);
    const newDoc = new Device({
      category: data.category,
      brand: data.brand || 'Other',
      modelName: data.modelName,
      slug,
      basePrice: data.basePrice,
      imageUrl: data.imageUrl || '',
      variants
    });
    await newDoc.save();
    console.log(`✨ Successfully created "${data.modelName}" with Cashify base price ₹${data.basePrice.toLocaleString('en-IN')}`);
  }
}

export async function syncCashifyBrand(brandUrl, category = 'laptop', brandName = 'HP') {
  console.log(`\n🌐 Crawling Cashify brand page: ${brandUrl}`);
  const html = await fetchPage(brandUrl);
  const models = [...html.matchAll(/href=\"(\/sell-old-(?:laptop|mobile-phone)\/[^\"]+)\"/g)].map(m => m[1]);
  const uniqueModels = [...new Set(models)].filter(u => u.includes('used-'));

  console.log(`📋 Found ${uniqueModels.length} models for brand "${brandName}"`);
  for (let i = 0; i < uniqueModels.length; i++) {
    const modelUrl = `https://www.cashify.in${uniqueModels[i]}`;
    try {
      console.log(`[${i + 1}/${uniqueModels.length}] Processing ${uniqueModels[i]}...`);
      await syncSingleCashifyUrl(modelUrl);
    } catch (err) {
      console.error(`⚠️ Error syncing ${uniqueModels[i]}: ${err.message}`);
    }
  }
}

// Top benchmark popular devices for instant one-click sync
const POPULAR_BENCHMARKS = [
  'https://www.cashify.in/sell-old-laptop/used-hp-15-series',
  'https://www.cashify.in/sell-old-laptop/used-pavilion-series',
  'https://www.cashify.in/sell-old-laptop/used-inspiron-series',
  'https://www.cashify.in/sell-old-laptop/used-vostro-series',
  'https://www.cashify.in/sell-old-mobile-phone/used-apple-iphone-13',
  'https://www.cashify.in/sell-old-mobile-phone/used-apple-iphone-14',
  'https://www.cashify.in/sell-old-mobile-phone/used-apple-iphone-15',
  'https://www.cashify.in/sell-old-mobile-phone/used-apple-iphone-12',
  'https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-s23-5g',
  'https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-s22-5g',
  'https://www.cashify.in/sell-old-mobile-phone/used-oneplus-11-5g'
];

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
Cashify Automated Data & Price Sync CLI
=======================================
Usage:
  node scripts/syncCashify.js --url <cashify_device_url>
      Syncs a single laptop or mobile device page from Cashify directly into MongoDB.
      Example:
        node scripts/syncCashify.js --url "https://www.cashify.in/sell-old-laptop/used-hp-15-series"
        node scripts/syncCashify.js --url "https://www.cashify.in/sell-old-mobile-phone/used-apple-iphone-13"

  node scripts/syncCashify.js --brand-url <cashify_brand_url> [--category laptop|mobile] [--brand HP]
      Crawls and syncs all models listed on a Cashify brand catalog page.
      Example:
        node scripts/syncCashify.js --brand-url "https://www.cashify.in/sell-old-laptop/sell-hp-compaq" --category laptop --brand HP

  node scripts/syncCashify.js --popular
      Syncs top high-traffic benchmark devices (HP 15 Series, Pavilion, iPhone 12/13/14/15, Galaxy S22/S23, OnePlus 11).
    `);
    process.exit(0);
  }

  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    await syncSingleCashifyUrl(args[urlIdx + 1]);
    process.exit(0);
  }

  const brandUrlIdx = args.indexOf('--brand-url');
  if (brandUrlIdx !== -1 && args[brandUrlIdx + 1]) {
    const category = args[args.indexOf('--category') + 1] || 'laptop';
    const brand = args[args.indexOf('--brand') + 1] || 'HP';
    await syncCashifyBrand(args[brandUrlIdx + 1], category, brand);
    process.exit(0);
  }

  if (args.includes('--popular')) {
    console.log(`🚀 Starting sync of ${POPULAR_BENCHMARKS.length} top Cashify benchmark devices...`);
    for (let i = 0; i < POPULAR_BENCHMARKS.length; i++) {
      try {
        console.log(`\n--- [${i + 1}/${POPULAR_BENCHMARKS.length}] ---`);
        await syncSingleCashifyUrl(POPULAR_BENCHMARKS[i]);
      } catch (err) {
        console.error(`⚠️ Failed to sync ${POPULAR_BENCHMARKS[i]}: ${err.message}`);
      }
    }
    console.log('\n🎉 Finished syncing popular devices!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
