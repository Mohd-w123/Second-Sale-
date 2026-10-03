import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPAIR_SEED_BRANDS = [
  { name: 'Apple',    slug: 'apple',    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',    color: '#1D1D1F', sortOrder: 1 },
  { name: 'Samsung',  slug: 'samsung',  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',         color: '#1428A0', sortOrder: 2 },
  { name: 'OnePlus',  slug: 'oneplus',  logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/OnePlus_Logo.svg',          color: '#F5010C', sortOrder: 3 },
  { name: 'Xiaomi',   slug: 'xiaomi',   logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', color: '#FF6900', sortOrder: 4 },
  { name: 'Vivo',     slug: 'vivo',     logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Vivo_logo.svg',              color: '#415FFF', sortOrder: 5 },
  { name: 'Oppo',     slug: 'oppo',     logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Oppo_logo_2019.svg',         color: '#1F8346', sortOrder: 6 },
  { name: 'Realme',   slug: 'realme',   logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.svg',            color: '#F5A623', sortOrder: 7 },
  { name: 'Motorola', slug: 'motorola', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola_Solutions_logo.svg', color: '#E1261C', sortOrder: 8 },
  { name: 'Google',   slug: 'google',   logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',       color: '#4285F4', sortOrder: 9 },
  { name: 'POCO',     slug: 'poco',     logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Poco_Smartphone_Company_Logo.svg', color: '#FED800', sortOrder: 10 },
  { name: 'iQOO',     slug: 'iqoo',     logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/IQOO_logo.svg',              color: '#FF6E00', sortOrder: 11 },
  { name: 'Nothing',  slug: 'nothing',  logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Nothing_Technology_wordmark.svg', color: '#000000', sortOrder: 12 },
  { name: 'Infinix',  slug: 'infinix',  logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Infinix_logo.svg',           color: '#55C227', sortOrder: 13 },
  { name: 'Honor',    slug: 'honor',    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Honor_logo_2022.svg',        color: '#00A4E4', sortOrder: 14 },
  { name: 'Asus',     slug: 'asus',     logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',             color: '#00539B', sortOrder: 15 },
  { name: 'Nokia',    slug: 'nokia',    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg',         color: '#124191', sortOrder: 16 },
];

export const STANDARD_REPAIR_SERVICES = [
  { id: 'screen',        label: 'Screen Replacement',   icon: '📱', description: 'Screen replacement with original/OEM display' },
  { id: 'battery',       label: 'Battery Replacement',  icon: '🔋', description: 'Battery replacement with 6-month warranty' },
  { id: 'front_camera',  label: 'Front Camera Repair',  icon: '📷', description: 'Front camera module replacement' },
  { id: 'back_camera',   label: 'Back Camera Repair',   icon: '📷', description: 'Rear camera module replacement' },
  { id: 'charging_jack', label: 'Charging Jack Repair', icon: '🔌', description: 'Charging port / USB-C jack repair' },
  { id: 'mic',           label: 'Microphone Repair',    icon: '🎙️', description: 'Microphone repair or replacement' },
  { id: 'speaker',       label: 'Speaker Repair',       icon: '🔊', description: 'Speaker repair or replacement' },
  { id: 'receiver',      label: 'Earpiece Receiver',    icon: '📞', description: 'Earpiece / call receiver repair' },
  { id: 'back_panel',    label: 'Back Panel / Glass',   icon: '🔧', description: 'Back glass / housing replacement' },
];

// Helper to create price tiers based on device grade
function makeServices(tier) {
  // tier: 'ultra_flagship' | 'flagship' | 'upper_mid' | 'mid' | 'budget'
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
    // budget
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

// Full Model Definitions across All Brands (matching Cashify)
export const RAW_MODELS = [
  // ── APPLE ─────────────────────────────────────────────────────────────
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 16 Series', name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', img: 'apple-iphone-16-pro-max.jpg', tier: 'ultra_flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 16 Series', name: 'iPhone 16 Pro', slug: 'iphone-16-pro', img: 'apple-iphone-16-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 16 Series', name: 'iPhone 16 Plus', slug: 'iphone-16-plus', img: 'apple-iphone-16-plus.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 16 Series', name: 'iPhone 16', slug: 'iphone-16', img: 'apple-iphone-16.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 15 Series', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', img: 'apple-iphone-15-pro-max.jpg', tier: 'ultra_flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 15 Series', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', img: 'apple-iphone-15-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 15 Series', name: 'iPhone 15 Plus', slug: 'iphone-15-plus', img: 'apple-iphone-15-plus.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 15 Series', name: 'iPhone 15', slug: 'iphone-15', img: 'apple-iphone-15.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 14 Series', name: 'iPhone 14 Pro Max', slug: 'iphone-14-pro-max', img: 'apple-iphone-14-pro-max.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 14 Series', name: 'iPhone 14 Pro', slug: 'iphone-14-pro', img: 'apple-iphone-14-pro.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 14 Series', name: 'iPhone 14 Plus', slug: 'iphone-14-plus', img: 'apple-iphone-14-plus.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 14 Series', name: 'iPhone 14', slug: 'iphone-14', img: 'apple-iphone-14.jpg', tier: 'flagship' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 13 Series', name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max', img: 'apple-iphone-13-pro-max.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 13 Series', name: 'iPhone 13 Pro', slug: 'iphone-13-pro', img: 'apple-iphone-13-pro.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 13 Series', name: 'iPhone 13', slug: 'iphone-13', img: 'apple-iphone-13.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 13 Series', name: 'iPhone 13 mini', slug: 'iphone-13-mini', img: 'apple-iphone-13-mini.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 12 Series', name: 'iPhone 12 Pro Max', slug: 'iphone-12-pro-max', img: 'apple-iphone-12-pro-max.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 12 Series', name: 'iPhone 12 Pro', slug: 'iphone-12-pro', img: 'apple-iphone-12-pro.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 12 Series', name: 'iPhone 12', slug: 'iphone-12', img: 'apple-iphone-12.jpg', tier: 'upper_mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 12 Series', name: 'iPhone 12 mini', slug: 'iphone-12-mini', img: 'apple-iphone-12-mini.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 11 Series', name: 'iPhone 11 Pro Max', slug: 'iphone-11-pro-max', img: 'apple-iphone-11-pro-max.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 11 Series', name: 'iPhone 11 Pro', slug: 'iphone-11-pro', img: 'apple-iphone-11-pro.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone 11 Series', name: 'iPhone 11', slug: 'iphone-11', img: 'apple-iphone-11.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone X Series', name: 'iPhone XS Max', slug: 'iphone-xs-max', img: 'apple-iphone-xs-max.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone X Series', name: 'iPhone XS', slug: 'iphone-xs', img: 'apple-iphone-xs.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone X Series', name: 'iPhone XR', slug: 'iphone-xr', img: 'apple-iphone-xr.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'iPhone X Series', name: 'iPhone X', slug: 'iphone-x', img: 'apple-iphone-x.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'Older iPhones', name: 'iPhone SE (2022)', slug: 'iphone-se-2022', img: 'apple-iphone-se-2022.jpg', tier: 'mid' },
  { brand: 'Apple', brandSlug: 'apple', series: 'Older iPhones', name: 'iPhone SE (2020)', slug: 'iphone-se-2020', img: 'apple-iphone-se-2020.jpg', tier: 'budget' },
  { brand: 'Apple', brandSlug: 'apple', series: 'Older iPhones', name: 'iPhone 8 Plus', slug: 'iphone-8-plus', img: 'apple-iphone-8-plus.jpg', tier: 'budget' },
  { brand: 'Apple', brandSlug: 'apple', series: 'Older iPhones', name: 'iPhone 8', slug: 'iphone-8', img: 'apple-iphone-8.jpg', tier: 'budget' },

  // ── SAMSUNG ───────────────────────────────────────────────────────────
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S25 Ultra', slug: 'galaxy-s25-ultra', img: 'samsung-galaxy-s25-ultra.jpg', tier: 'ultra_flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S25+', slug: 'galaxy-s25-plus', img: 'samsung-galaxy-s25+.jpg', tier: 'ultra_flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S25', slug: 'galaxy-s25', img: 'samsung-galaxy-s25.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', img: 'samsung-galaxy-s24-ultra.jpg', tier: 'ultra_flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S24+', slug: 'galaxy-s24-plus', img: 'samsung-galaxy-s24-plus.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S24', slug: 'galaxy-s24', img: 'samsung-galaxy-s24.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S23 Ultra', slug: 'galaxy-s23-ultra', img: 'samsung-galaxy-s23-ultra.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S23+', slug: 'galaxy-s23-plus', img: 'samsung-galaxy-s23-plus.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S23', slug: 'galaxy-s23', img: 'samsung-galaxy-s23.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S23 FE', slug: 'galaxy-s23-fe', img: 'samsung-galaxy-s23-fe.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S22 Ultra', slug: 'galaxy-s22-ultra', img: 'samsung-galaxy-s22-ultra.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S22+', slug: 'galaxy-s22-plus', img: 'samsung-galaxy-s22-plus.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S22', slug: 'galaxy-s22', img: 'samsung-galaxy-s22.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S21 Ultra', slug: 'galaxy-s21-ultra', img: 'samsung-galaxy-s21-ultra.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S21 FE', slug: 'galaxy-s21-fe', img: 'samsung-galaxy-s21-fe.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy S Series', name: 'Galaxy S20 FE', slug: 'galaxy-s20-fe', img: 'samsung-galaxy-s20-fe.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Z Series', name: 'Galaxy Z Fold6', slug: 'galaxy-z-fold6', img: 'samsung-galaxy-z-fold6.jpg', tier: 'ultra_flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Z Series', name: 'Galaxy Z Flip6', slug: 'galaxy-z-flip6', img: 'samsung-galaxy-z-flip6.jpg', tier: 'ultra_flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Z Series', name: 'Galaxy Z Fold5', slug: 'galaxy-z-fold5', img: 'samsung-galaxy-z-fold5.jpg', tier: 'ultra_flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Z Series', name: 'Galaxy Z Flip5', slug: 'galaxy-z-flip5', img: 'samsung-galaxy-z-flip5.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Z Series', name: 'Galaxy Z Fold4', slug: 'galaxy-z-fold4', img: 'samsung-galaxy-z-fold4.jpg', tier: 'flagship' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Z Series', name: 'Galaxy Z Flip4', slug: 'galaxy-z-flip4', img: 'samsung-galaxy-z-flip4.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Note Series', name: 'Galaxy Note 20 Ultra', slug: 'galaxy-note-20-ultra', img: 'samsung-galaxy-note-20-ultra.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy Note Series', name: 'Galaxy Note 10+', slug: 'galaxy-note-10-plus', img: 'samsung-galaxy-note10-plus.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A55 5G', slug: 'galaxy-a55-5g', img: 'samsung-galaxy-a55.jpg', tier: 'upper_mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A35 5G', slug: 'galaxy-a35-5g', img: 'samsung-galaxy-a35.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A54 5G', slug: 'galaxy-a54-5g', img: 'samsung-galaxy-a54.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A34 5G', slug: 'galaxy-a34-5g', img: 'samsung-galaxy-a34.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A53 5G', slug: 'galaxy-a53-5g', img: 'samsung-galaxy-a53-5g.jpg', tier: 'budget' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A52s 5G', slug: 'galaxy-a52s-5g', img: 'samsung-galaxy-a52s-5g.jpg', tier: 'budget' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy A Series', name: 'Galaxy A15 5G', slug: 'galaxy-a15-5g', img: 'samsung-galaxy-a15.jpg', tier: 'budget' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy M & F Series', name: 'Galaxy M55 5G', slug: 'galaxy-m55-5g', img: 'samsung-galaxy-m55.jpg', tier: 'mid' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy M & F Series', name: 'Galaxy M35 5G', slug: 'galaxy-m35-5g', img: 'samsung-galaxy-m35.jpg', tier: 'budget' },
  { brand: 'Samsung', brandSlug: 'samsung', series: 'Galaxy M & F Series', name: 'Galaxy F54 5G', slug: 'galaxy-f54-5g', img: 'samsung-galaxy-f54.jpg', tier: 'budget' },

  // ── ONEPLUS ───────────────────────────────────────────────────────────
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 13', slug: 'oneplus-13', img: 'oneplus-13.jpg', tier: 'ultra_flagship' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 12', slug: 'oneplus-12', img: 'oneplus-12.jpg', tier: 'ultra_flagship' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 12R', slug: 'oneplus-12r', img: 'oneplus-12r.jpg', tier: 'flagship' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 11 5G', slug: 'oneplus-11', img: 'oneplus-11.jpg', tier: 'flagship' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 11R', slug: 'oneplus-11r', img: 'oneplus-11r.jpg', tier: 'upper_mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 10 Pro', slug: 'oneplus-10-pro', img: 'oneplus-10-pro.jpg', tier: 'upper_mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 10T', slug: 'oneplus-10t', img: 'oneplus-10t.jpg', tier: 'upper_mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 10R', slug: 'oneplus-10r', img: 'oneplus-10r.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 9 Pro', slug: 'oneplus-9-pro', img: 'oneplus-9-pro.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 9RT', slug: 'oneplus-9rt-5g.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 9', slug: 'oneplus-9.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 8 Pro', slug: 'oneplus-8-pro.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 8T', slug: 'oneplus-8t.jpg', tier: 'budget' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Number Series', name: 'OnePlus 7T Pro', slug: 'oneplus-7t-pro.jpg', tier: 'budget' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord 4', slug: 'oneplus-nord-4', img: 'oneplus-nord-4.jpg', tier: 'upper_mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord CE 4', slug: 'oneplus-nord-ce4', img: 'oneplus-nord-ce-4.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord CE 4 Lite', slug: 'oneplus-nord-ce-4-lite', img: 'oneplus-nord-ce4-lite.jpg', tier: 'budget' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord 3', slug: 'oneplus-nord-3', img: 'oneplus-nord-3.jpg', tier: 'mid' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord CE 3', slug: 'oneplus-nord-ce-3', img: 'oneplus-nord-ce3.jpg', tier: 'budget' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord CE 3 Lite', slug: 'oneplus-nord-ce-3-lite', img: 'oneplus-nord-ce3-lite.jpg', tier: 'budget' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Nord Series', name: 'OnePlus Nord 2T', slug: 'oneplus-nord-2t', img: 'oneplus-nord-2t.jpg', tier: 'budget' },
  { brand: 'OnePlus', brandSlug: 'oneplus', series: 'Open Series', name: 'OnePlus Open', slug: 'oneplus-open', img: 'oneplus-open.jpg', tier: 'ultra_flagship' },

  // ── XIAOMI / REDMI ────────────────────────────────────────────────────
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Xiaomi / Mi Series', name: 'Xiaomi 14 Ultra', slug: 'xiaomi-14-ultra', img: 'xiaomi-14-ultra.jpg', tier: 'ultra_flagship' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Xiaomi / Mi Series', name: 'Xiaomi 14', slug: 'xiaomi-14', img: 'xiaomi-14.jpg', tier: 'flagship' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Xiaomi / Mi Series', name: 'Xiaomi 13 Pro', slug: 'xiaomi-13-pro', img: 'xiaomi-13-pro.jpg', tier: 'flagship' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Xiaomi / Mi Series', name: 'Xiaomi 12 Pro', slug: 'xiaomi-12-pro', img: 'xiaomi-12-pro.jpg', tier: 'upper_mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Xiaomi / Mi Series', name: 'Xiaomi 11T Pro', slug: 'xiaomi-11t-pro.jpg', tier: 'mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Xiaomi / Mi Series', name: 'Mi 11X Pro', slug: 'xiaomi-mi-11x-pro.jpg', tier: 'mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 14 Pro+', slug: 'redmi-note-14-pro-plus', img: 'xiaomi-redmi-note-14-pro-plus.jpg', tier: 'upper_mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 14 Pro', slug: 'redmi-note-14-pro', img: 'xiaomi-redmi-note-14-pro.jpg', tier: 'mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 13 Pro+', slug: 'redmi-note-13-pro-plus', img: 'xiaomi-redmi-note-13-pro-plus.jpg', tier: 'upper_mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 13 Pro', slug: 'redmi-note-13-pro', img: 'xiaomi-redmi-note-13-pro.jpg', tier: 'mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 13 5G', slug: 'redmi-note-13-5g', img: 'xiaomi-redmi-note-13.jpg', tier: 'budget' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 12 Pro+', slug: 'redmi-note-12-pro-plus', img: 'xiaomi-redmi-note-12-pro-plus.jpg', tier: 'mid' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 12 Pro', slug: 'redmi-note-12-pro', img: 'xiaomi-redmi-note-12-pro.jpg', tier: 'budget' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 11 Pro', slug: 'redmi-note-11-pro', img: 'xiaomi-redmi-note-11-pro.jpg', tier: 'budget' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Note Series', name: 'Redmi Note 10 Pro Max', slug: 'redmi-note-10-pro-max', img: 'xiaomi-redmi-note-10-pro-max.jpg', tier: 'budget' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Series', name: 'Redmi 13 5G', slug: 'redmi-13-5g', img: 'xiaomi-redmi-13-5g.jpg', tier: 'budget' },
  { brand: 'Xiaomi', brandSlug: 'xiaomi', series: 'Redmi Series', name: 'Redmi 12 5G', slug: 'redmi-12-5g', img: 'xiaomi-redmi-12-5g.jpg', tier: 'budget' },

  // ── VIVO ──────────────────────────────────────────────────────────────
  { brand: 'Vivo', brandSlug: 'vivo', series: 'X Series', name: 'Vivo X200 Pro', slug: 'vivo-x200-pro', img: 'vivo-x200-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'X Series', name: 'Vivo X200', slug: 'vivo-x200', img: 'vivo-x200.jpg', tier: 'flagship' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'X Series', name: 'Vivo X100 Pro', slug: 'vivo-x100-pro', img: 'vivo-x100-pro.jpg', tier: 'flagship' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'X Series', name: 'Vivo X100', slug: 'vivo-x100', img: 'vivo-x100.jpg', tier: 'upper_mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'X Series', name: 'Vivo X90 Pro', slug: 'vivo-x90-pro', img: 'vivo-x90-pro.jpg', tier: 'upper_mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'V Series', name: 'Vivo V40 Pro', slug: 'vivo-v40-pro', img: 'vivo-v40-pro.jpg', tier: 'upper_mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'V Series', name: 'Vivo V40', slug: 'vivo-v40', img: 'vivo-v40.jpg', tier: 'upper_mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'V Series', name: 'Vivo V30 Pro', slug: 'vivo-v30-pro', img: 'vivo-v30-pro.jpg', tier: 'mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'V Series', name: 'Vivo V30', slug: 'vivo-v30', img: 'vivo-v30.jpg', tier: 'mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'V Series', name: 'Vivo V29 Pro', slug: 'vivo-v29-pro', img: 'vivo-v29-pro.jpg', tier: 'mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'V Series', name: 'Vivo V27 Pro', slug: 'vivo-v27-pro', img: 'vivo-v27-pro.jpg', tier: 'budget' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'T Series', name: 'Vivo T3 Pro', slug: 'vivo-t3-pro', img: 'vivo-t3-pro.jpg', tier: 'mid' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'T Series', name: 'Vivo T3 5G', slug: 'vivo-t3-5g', img: 'vivo-t3.jpg', tier: 'budget' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'T Series', name: 'Vivo T2 Pro', slug: 'vivo-t2-pro', img: 'vivo-t2-pro.jpg', tier: 'budget' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'Y Series', name: 'Vivo Y200 5G', slug: 'vivo-y200-5g', img: 'vivo-y200.jpg', tier: 'budget' },
  { brand: 'Vivo', brandSlug: 'vivo', series: 'Y Series', name: 'Vivo Y100 5G', slug: 'vivo-y100-5g', img: 'vivo-y100.jpg', tier: 'budget' },

  // ── OPPO ──────────────────────────────────────────────────────────────
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Find Series', name: 'Oppo Find X8 Pro', slug: 'oppo-find-x8-pro', img: 'oppo-find-x8-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Find Series', name: 'Oppo Find X8', slug: 'oppo-find-x8', img: 'oppo-find-x8.jpg', tier: 'flagship' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Find Series', name: 'Oppo Find N3 Flip', slug: 'oppo-find-n3-flip', img: 'oppo-find-n3-flip.jpg', tier: 'ultra_flagship' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Reno Series', name: 'Oppo Reno 12 Pro', slug: 'oppo-reno-12-pro', img: 'oppo-reno12-pro.jpg', tier: 'upper_mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Reno Series', name: 'Oppo Reno 12', slug: 'oppo-reno-12', img: 'oppo-reno12.jpg', tier: 'mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Reno Series', name: 'Oppo Reno 11 Pro', slug: 'oppo-reno-11-pro', img: 'oppo-reno11-pro.jpg', tier: 'mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Reno Series', name: 'Oppo Reno 10 Pro+', slug: 'oppo-reno-10-pro-plus', img: 'oppo-reno10-pro-plus.jpg', tier: 'upper_mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'Reno Series', name: 'Oppo Reno 10 Pro', slug: 'oppo-reno-10-pro', img: 'oppo-reno10-pro.jpg', tier: 'mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'F Series', name: 'Oppo F27 Pro+', slug: 'oppo-f27-pro-plus', img: 'oppo-f27-pro-plus.jpg', tier: 'mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'F Series', name: 'Oppo F25 Pro', slug: 'oppo-f25-pro', img: 'oppo-f25-pro.jpg', tier: 'mid' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'F Series', name: 'Oppo F23 5G', slug: 'oppo-f23-5g', img: 'oppo-f23.jpg', tier: 'budget' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'F Series', name: 'Oppo F21 Pro', slug: 'oppo-f21-pro', img: 'oppo-f21-pro.jpg', tier: 'budget' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'A Series', name: 'Oppo A79 5G', slug: 'oppo-a79-5g', img: 'oppo-a79.jpg', tier: 'budget' },
  { brand: 'Oppo', brandSlug: 'oppo', series: 'A Series', name: 'Oppo A59 5G', slug: 'oppo-a59-5g', img: 'oppo-a59.jpg', tier: 'budget' },

  // ── REALME ────────────────────────────────────────────────────────────
  { brand: 'Realme', brandSlug: 'realme', series: 'GT Series', name: 'Realme GT 6', slug: 'realme-gt-6', img: 'realme-gt-6.jpg', tier: 'flagship' },
  { brand: 'Realme', brandSlug: 'realme', series: 'GT Series', name: 'Realme GT 6T', slug: 'realme-gt-6t', img: 'realme-gt-6t.jpg', tier: 'upper_mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'GT Series', name: 'Realme GT 2 Pro', slug: 'realme-gt-2-pro', img: 'realme-gt2-pro.jpg', tier: 'upper_mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Number Series', name: 'Realme 13 Pro+', slug: 'realme-13-pro-plus', img: 'realme-13-pro-plus.jpg', tier: 'upper_mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Number Series', name: 'Realme 13 Pro', slug: 'realme-13-pro', img: 'realme-13-pro.jpg', tier: 'mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Number Series', name: 'Realme 12 Pro+', slug: 'realme-12-pro-plus', img: 'realme-12-pro-plus.jpg', tier: 'mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Number Series', name: 'Realme 12 Pro', slug: 'realme-12-pro', img: 'realme-12-pro.jpg', tier: 'mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Number Series', name: 'Realme 11 Pro+', slug: 'realme-11-pro-plus', img: 'realme-11-pro-plus.jpg', tier: 'budget' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Narzo Series', name: 'Realme Narzo 70 Pro', slug: 'realme-narzo-70-pro', img: 'realme-narzo-70-pro.jpg', tier: 'mid' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Narzo Series', name: 'Realme Narzo 70 5G', slug: 'realme-narzo-70', img: 'realme-narzo-70.jpg', tier: 'budget' },
  { brand: 'Realme', brandSlug: 'realme', series: 'Narzo Series', name: 'Realme Narzo 60 Pro', slug: 'realme-narzo-60-pro', img: 'realme-narzo-60-pro.jpg', tier: 'budget' },

  // ── POCO ──────────────────────────────────────────────────────────────
  { brand: 'POCO', brandSlug: 'poco', series: 'F Series', name: 'Poco F6 Pro', slug: 'poco-f6-pro', img: 'xiaomi-poco-f6-pro.jpg', tier: 'flagship' },
  { brand: 'POCO', brandSlug: 'poco', series: 'F Series', name: 'Poco F6', slug: 'poco-f6', img: 'xiaomi-poco-f6.jpg', tier: 'upper_mid' },
  { brand: 'POCO', brandSlug: 'poco', series: 'F Series', name: 'Poco F5 5G', slug: 'poco-f5', img: 'xiaomi-poco-f5.jpg', tier: 'mid' },
  { brand: 'POCO', brandSlug: 'poco', series: 'X Series', name: 'Poco X6 Pro', slug: 'poco-x6-pro', img: 'xiaomi-poco-x6-pro.jpg', tier: 'upper_mid' },
  { brand: 'POCO', brandSlug: 'poco', series: 'X Series', name: 'Poco X6 5G', slug: 'poco-x6', img: 'xiaomi-poco-x6.jpg', tier: 'mid' },
  { brand: 'POCO', brandSlug: 'poco', series: 'X Series', name: 'Poco X5 Pro', slug: 'poco-x5-pro', img: 'xiaomi-poco-x5-pro.jpg', tier: 'budget' },
  { brand: 'POCO', brandSlug: 'poco', series: 'M Series', name: 'Poco M6 Pro 5G', slug: 'poco-m6-pro-5g', img: 'xiaomi-poco-m6-pro-5g.jpg', tier: 'budget' },
  { brand: 'POCO', brandSlug: 'poco', series: 'M Series', name: 'Poco M6 5G', slug: 'poco-m6-5g', img: 'xiaomi-poco-m6.jpg', tier: 'budget' },

  // ── GOOGLE ────────────────────────────────────────────────────────────
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 9 Series', name: 'Pixel 9 Pro XL', slug: 'pixel-9-pro-xl', img: 'google-pixel-9-pro-xl.jpg', tier: 'ultra_flagship' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 9 Series', name: 'Pixel 9 Pro', slug: 'pixel-9-pro', img: 'google-pixel-9-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 9 Series', name: 'Pixel 9', slug: 'pixel-9', img: 'google-pixel-9.jpg', tier: 'flagship' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 8 Series', name: 'Pixel 8 Pro', slug: 'pixel-8-pro', img: 'google-pixel-8-pro.jpg', tier: 'flagship' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 8 Series', name: 'Pixel 8', slug: 'pixel-8', img: 'google-pixel-8.jpg', tier: 'upper_mid' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 8 Series', name: 'Pixel 8a', slug: 'pixel-8a', img: 'google-pixel-8a.jpg', tier: 'upper_mid' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 7 Series', name: 'Pixel 7 Pro', slug: 'pixel-7-pro', img: 'google-pixel-7-pro.jpg', tier: 'upper_mid' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 7 Series', name: 'Pixel 7', slug: 'pixel-7', img: 'google-pixel-7.jpg', tier: 'mid' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 7 Series', name: 'Pixel 7a', slug: 'pixel-7a', img: 'google-pixel-7a.jpg', tier: 'mid' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 6 Series', name: 'Pixel 6 Pro', slug: 'pixel-6-pro', img: 'google-pixel-6-pro.jpg', tier: 'mid' },
  { brand: 'Google', brandSlug: 'google', series: 'Pixel 6 Series', name: 'Pixel 6a', slug: 'pixel-6a', img: 'google-pixel-6a.jpg', tier: 'budget' },

  // ── MOTOROLA ──────────────────────────────────────────────────────────
  { brand: 'Motorola', brandSlug: 'motorola', series: 'Edge Series', name: 'Moto Edge 50 Ultra', slug: 'moto-edge-50-ultra', img: 'motorola-edge-50-ultra.jpg', tier: 'flagship' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'Edge Series', name: 'Moto Edge 50 Pro', slug: 'moto-edge-50-pro', img: 'motorola-edge-50-pro.jpg', tier: 'upper_mid' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'Edge Series', name: 'Moto Edge 50 Fusion', slug: 'moto-edge-50-fusion', img: 'motorola-edge-50-fusion.jpg', tier: 'mid' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'Edge Series', name: 'Moto Edge 40 Pro', slug: 'moto-edge-40-pro', img: 'motorola-edge-40-pro.jpg', tier: 'upper_mid' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'Edge Series', name: 'Moto Edge 40', slug: 'moto-edge-40', img: 'motorola-edge-40.jpg', tier: 'mid' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'G Series', name: 'Moto G85 5G', slug: 'moto-g85', img: 'motorola-moto-g85.jpg', tier: 'budget' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'G Series', name: 'Moto G84 5G', slug: 'moto-g84', img: 'motorola-moto-g84.jpg', tier: 'budget' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'G Series', name: 'Moto G54 5G', slug: 'moto-g54', img: 'motorola-moto-g54.jpg', tier: 'budget' },
  { brand: 'Motorola', brandSlug: 'motorola', series: 'Razr Series', name: 'Moto Razr 50 Ultra', slug: 'moto-razr-50-ultra', img: 'motorola-razr-50-ultra.jpg', tier: 'ultra_flagship' },

  // ── iQOO ──────────────────────────────────────────────────────────────
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Number Series', name: 'iQOO 12 5G', slug: 'iqoo-12', img: 'vivo-iqoo-12.jpg', tier: 'flagship' },
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Number Series', name: 'iQOO 11 5G', slug: 'iqoo-11', img: 'vivo-iqoo-11.jpg', tier: 'upper_mid' },
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Neo Series', name: 'iQOO Neo 9 Pro', slug: 'iqoo-neo-9-pro', img: 'vivo-iqoo-neo-9-pro.jpg', tier: 'upper_mid' },
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Neo Series', name: 'iQOO Neo 7 Pro', slug: 'iqoo-neo-7-pro', img: 'vivo-iqoo-neo-7-pro.jpg', tier: 'mid' },
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Z Series', name: 'iQOO Z9s Pro', slug: 'iqoo-z9s-pro', img: 'vivo-iqoo-z9s-pro.jpg', tier: 'mid' },
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Z Series', name: 'iQOO Z9 5G', slug: 'iqoo-z9', img: 'vivo-iqoo-z9.jpg', tier: 'budget' },
  { brand: 'iQOO', brandSlug: 'iqoo', series: 'Z Series', name: 'iQOO Z7 Pro 5G', slug: 'iqoo-z7-pro', img: 'vivo-iqoo-z7-pro.jpg', tier: 'budget' },

  // ── NOTHING ───────────────────────────────────────────────────────────
  { brand: 'Nothing', brandSlug: 'nothing', series: 'Phone Series', name: 'Nothing Phone (2)', slug: 'nothing-phone-2', img: 'nothing-phone-2.jpg', tier: 'upper_mid' },
  { brand: 'Nothing', brandSlug: 'nothing', series: 'Phone Series', name: 'Nothing Phone (2a) Plus', slug: 'nothing-phone-2a-plus', img: 'nothing-phone-2a-plus.jpg', tier: 'mid' },
  { brand: 'Nothing', brandSlug: 'nothing', series: 'Phone Series', name: 'Nothing Phone (2a)', slug: 'nothing-phone-2a', img: 'nothing-phone-2a.jpg', tier: 'mid' },
  { brand: 'Nothing', brandSlug: 'nothing', series: 'Phone Series', name: 'Nothing Phone (1)', slug: 'nothing-phone-1', img: 'nothing-phone-1.jpg', tier: 'mid' },
  { brand: 'Nothing', brandSlug: 'nothing', series: 'CMF Series', name: 'CMF Phone 1', slug: 'cmf-phone-1', img: 'nothing-cmf-phone-1.jpg', tier: 'budget' },

  // ── INFINIX ───────────────────────────────────────────────────────────
  { brand: 'Infinix', brandSlug: 'infinix', series: 'GT Series', name: 'Infinix GT 20 Pro', slug: 'infinix-gt-20-pro', img: 'infinix-gt-20-pro.jpg', tier: 'mid' },
  { brand: 'Infinix', brandSlug: 'infinix', series: 'Zero Series', name: 'Infinix Zero 30 5G', slug: 'infinix-zero-30-5g', img: 'infinix-zero-30-5g.jpg', tier: 'mid' },
  { brand: 'Infinix', brandSlug: 'infinix', series: 'Note Series', name: 'Infinix Note 40 Pro+', slug: 'infinix-note-40-pro-plus', img: 'infinix-note-40-pro-plus.jpg', tier: 'budget' },

  // ── HONOR ─────────────────────────────────────────────────────────────
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 8 Series', name: 'Honor 8 Pro', slug: 'honor-8-pro', img: 'huawei-honor-8-pro.jpg', tier: 'mid' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 7 Series', name: 'Honor 7X', slug: 'honor-7x', img: 'huawei-honor-7x.jpg', tier: 'budget' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 9 Series', name: 'Honor 9 Lite', slug: 'honor-9-lite', img: 'huawei-honor-9-lite.jpg', tier: 'budget' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 7 Series', name: 'Honor 7A', slug: 'honor-7a', img: 'huawei-honor-7a.jpg', tier: 'budget' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 8 Series', name: 'Honor 10', slug: 'honor-10', img: 'huawei-honor-10.jpg', tier: 'mid' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 9 Series', name: 'Honor 9N', slug: 'honor-9n', img: 'huawei-honor-9n.jpg', tier: 'budget' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor Play Series', name: 'Honor Play', slug: 'honor-play', img: 'huawei-honor-play.jpg', tier: 'budget' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor 8 Series', name: 'Honor 8X', slug: 'honor-8x', img: 'huawei-honor-8x.jpg', tier: 'budget' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor Number Series', name: 'Honor 200 Pro', slug: 'honor-200-pro', img: 'honor-200-pro.jpg', tier: 'flagship' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor Number Series', name: 'Honor 200 5G', slug: 'honor-200', img: 'honor-200.jpg', tier: 'upper_mid' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor Magic Series', name: 'Honor Magic 6 Pro', slug: 'honor-magic-6-pro', img: 'honor-magic-6-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Honor', brandSlug: 'honor', series: 'Honor X Series', name: 'Honor X9b', slug: 'honor-x9b', img: 'honor-x9b.jpg', tier: 'mid' },

  // ── ASUS ──────────────────────────────────────────────────────────────
  { brand: 'Asus', brandSlug: 'asus', series: 'ROG Series', name: 'Asus ROG Phone 8 Pro', slug: 'asus-rog-phone-8-pro', img: 'asus-rog-phone-8-pro.jpg', tier: 'ultra_flagship' },
  { brand: 'Asus', brandSlug: 'asus', series: 'ROG Series', name: 'Asus ROG Phone 7', slug: 'asus-rog-phone-7', img: 'asus-rog-phone-7.jpg', tier: 'flagship' },
  { brand: 'Asus', brandSlug: 'asus', series: 'Zenfone Series', name: 'Asus Zenfone 10', slug: 'asus-zenfone-10', img: 'asus-zenfone-10.jpg', tier: 'upper_mid' },

  // ── NOKIA ─────────────────────────────────────────────────────────────
  { brand: 'Nokia', brandSlug: 'nokia', series: 'G & X Series', name: 'Nokia G42 5G', slug: 'nokia-g42', img: 'nokia-g42.jpg', tier: 'budget' },
  { brand: 'Nokia', brandSlug: 'nokia', series: 'G & X Series', name: 'Nokia G60 5G', slug: 'nokia-g60-5g', img: 'nokia-g60-5g.jpg', tier: 'budget' },
  { brand: 'Nokia', brandSlug: 'nokia', series: 'G & X Series', name: 'Nokia X30 5G', slug: 'nokia-x30-5g', img: 'nokia-x30-5g.jpg', tier: 'budget' },
];

export const REPAIR_SEED_DEVICES = RAW_MODELS.map((m, index) => ({
  brand: m.brand,
  brandSlug: m.brandSlug,
  series: m.series,
  name: m.name,
  slug: m.slug,
  image: `https://fdn2.gsmarena.com/vv/bigpic/${m.img}`,
  services: makeServices(m.tier),
  isActive: true,
  sortOrder: index + 1,
}));
