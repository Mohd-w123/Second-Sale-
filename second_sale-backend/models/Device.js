import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  processor: { type: String },    // "Intel Core i5", "AMD Ryzen 5"
  generation: { type: String },   // "10th Gen", "M1"
  storage: { type: String, required: true },
  ram: { type: String },          // "8GB", "16GB"
  storageType: { type: String },  // "SSD" or "HDD"
  basePrice: { type: Number, required: true },
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  brand: {
    type: String,
    required: true,
    index: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },

  // Laptop-specific fields
  processorFamily: { type: String, default: '' },    // "Intel Core i5", "Apple M3", "AMD Ryzen 7"
  generation: { type: String, default: '' },         // "12th Gen", "M3", etc.
  gpuType: { type: String, default: '' },            // "Integrated", "NVIDIA RTX 4060"
  isGamingLaptop: { type: Boolean, default: false },
  tier: { type: String, default: '' },               // "Premium", "Mid-range", "Budget", "Gaming"

  variants: [variantSchema],

  // --- Shared multipliers (mobile uses these) ---
  conditionMultipliers: {
    likenew: { type: Number, default: 1.0 },
    good: { type: Number, default: 0.95 },
    average: { type: Number, default: 0.85 },
    belowAverage: { type: Number, default: 0.70 },
    fair: { type: Number, default: 0.72 },
    poor: { type: Number, default: 0.55 },
  },
  screenMultipliers: {
    // Shared / Mobile
    noScratch: { type: Number, default: 1.0 },
    minorScratch: { type: Number, default: 0.95 },
    crackedWorks: { type: Number, default: 0.75 },
    crackedBroken: { type: Number, default: 0.50 },
    // Laptop specific keys
    noIssue: { type: Number, default: 1.0 },
    deadPixels: { type: Number, default: 0.82 },
  },

  // Mobile-specific
  batteryDeductions: {
    above80: { type: Number, default: 0 },
    above60: { type: Number, default: 1000 },
    below60: { type: Number, default: 2500 },
  },

  // --- Laptop-specific multipliers ---
  ageMultipliers: {
    lessThan3: { type: Number, default: 1.0 },
    threeToEleven: { type: Number, default: 0.88 },
    aboveEleven: { type: Number, default: 0.75 },
    // Legacy support
    lessThan1: { type: Number, default: 0.92 },
    oneToTwo: { type: Number, default: 0.78 },
    twoToThree: { type: Number, default: 0.62 },
  },

  // Functional deductions — covers both mobile and laptop issues
  functionalDeductions: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      // Mobile Cashify issues (%)
      front_camera: 8,
      back_camera: 15,
      volume_button: 4,
      finger_touch: 26,
      face_sensor: 26,
      speaker_faulty: 4,
      power_button: 2,
      charging_port: 10,
      audio_receiver: 7,
      camera_glass_broken: 8,
      bluetooth: 39,
      vibrator: 2,
      microphone: 2,
      proximity_sensor: 3,
      battery_service: 13,
      battery_80_85: 6,
      silent_button: 3,
      wifi_issue: 39,
      // General Mobile (%)
      dead: 90,
      screenFaulty: 65,
      copyScreen: 50,
      outOfWarranty: 20,
      noBill: 21,
      eSIM: 6,
      noBox: 5,
      noCharger: 3,
      // Legacy mobile
      batteryLow: 2000,
      cameraIssue: 3000,
      speakerIssue: 1500,
      biometricIssue: 4000,
      chargingIssue: 1000,
      // Laptop issues (%)
      battery: 6,
      keyboard: 7,
      trackpad: 18,
      speakers: 3,
      webcam: 6,
      ports: 8,
      hinge: 2000,
      overheat: 1500,
      gpu: 3000,
      screenChanged: 3000,
      wifi: 5,
      biometric: 1500,
      charging: 8,
      cdDrive: 7,
      chargerIssue: 1200,
      hardDisk: 10,
      displayIssue: 4000,
      motherboard: 35,
    }),
  },

  // Percentage-based screen deductions
  screenDeductions: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      // Mobile Cashify Screen & Defect Keys (%)
      defect_screen_broken_scratch: 25,
      defect_screen_spots_lines: 30,
      // Laptop / General Screen Keys (%)
      screenCracked: 25,
      lineDiscolour: 18,
      screen_scratches_minor: 5,
      screen_scratches_major: 10,
      screen_cracked: 25,
      screen_discolour_minor: 8,
      screen_discolour_major: 18,
      screen_spots_minor: 8,
      screen_spots_major: 18,
      screen_lines_visible: 18,
      screen_lines_flickering: 20,
      screen_lines_black_dots: 15,
    }),
  },

  // Percentage-based body deductions
  bodyDeductions: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      // Mobile Cashify Body Defect Keys (%)
      defect_body_scratch_dent: 10,
      defect_panel_missing_broken: 15,
      // Laptop Body Keys (%)
      minorDentTop: 8,
      minorDentBase: 8,
      majorDentTop: 35,
      majorDentBase: 40,
      minorScratch: 5,
      majorScratch: 8,
    }),
  },

  screenSizeMultipliers: {
    '10-12': { type: Number, default: 0.95 },
    '13-14': { type: Number, default: 1.0 },
    '15-16': { type: Number, default: 1.05 },
    '16+': { type: Number, default: 1.1 },
  },

  dedicatedGpuBonus: {
    'GTX 1650': { type: Number, default: 2000 },
    'RTX 2050': { type: Number, default: 2500 },
    'RTX 3050': { type: Number, default: 3500 },
    'RTX 4050': { type: Number, default: 5000 },
    'RTX 4060': { type: Number, default: 7000 },
    'RTX 4070': { type: Number, default: 10000 },
    'RTX 4080': { type: Number, default: 15000 },
    'RTX 4090': { type: Number, default: 25000 },
  },

  accessoriesBonus: {
    bill: { type: Number, default: 300 },
    box: { type: Number, default: 500 },
    charger: { type: Number, default: 800 },
    // Legacy
    withBoxAndCharger: { type: Number, default: 800 },
    originalCharger: { type: Number, default: 500 },
    thirdPartyCharger: { type: Number, default: 200 },
    none: { type: Number, default: 0 },
  },

  // Model-specific custom quiz configuration
  hasCustomQuiz: {
    type: Boolean,
    default: false,
  },
  customQuiz: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

deviceSchema.index({ brand: 1, category: 1 });

const Device = mongoose.model('Device', deviceSchema);
export default Device;
