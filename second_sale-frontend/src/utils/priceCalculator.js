import { isSpecialModel } from './specialModels';

// ─── EXTENSIBLE ISSUE DEDUCTION PERCENTAGES ───────────────────────────────
export const ISSUE_DEDUCTIONS = {
  // Cashify Screen Condition Keys
  none: 0,
  scratches: 5,
  cracked: 35,
  faulty: 35,
  not_usable: 65,
  
  // Cashify Body Condition Keys
  good: 0,
  flawless: 0,
  average: 8,
  below_average: 18,
  broken: 25,

  // Physical Issues
  glass_crack: 40,
  back_panel: 17,
  camera_glass_broken: 8,
  screen_scratches_minor: 5,
  screen_scratches_major: 12,
  screen_cracked: 35,
  screen_chipped: 15,
  dead_spots_lines: 35,
  body_scratches_dents: 8,
  panel_missing_broken: 15,
  panel_cracked: 12,
  panel_missing: 18,
  loose_screen: 10,
  bent_curved: 20,
  defect_screen_broken_scratch: 25,
  defect_screen_spots_lines: 30,
  defect_body_scratch_dent: 10,
  defect_panel_missing_broken: 15,

  // Technical Issues (Matching Cashify / DeviceKart)
  battery_service: 13,
  battery_80_85: 6,
  front_camera: 8,
  back_camera: 15,
  volume_button: 4,
  wifi_issue: 39,
  finger_touch: 26,
  face_unlock: 26,
  face_sensor: 26,
  speaker_faulty: 4,
  power_button: 2,
  charging_port: 10,
  audio_receiver: 7,
  bluetooth: 39,
  vibrator: 2,
  microphone: 2,
  proximity_sensor: 3,
  silent_button: 3,
  cellularNetworkFaulty: 20,
};

// ─── DYNAMIC MOBILE & TABLET PRICE CALCULATOR ──────────────────────────────
// Evaluates deductions dynamically against device-configured rates or defaults.
// Any newly added question, option, condition, or admin deduction resolves dynamically.
export function calculatePrice({
  brand,
  modelName,
  device = {},
  basePrice = 0,
  deviceAge,
  ableToMakeCalls,
  doesTabletSwitchOn,
  isCellularNetworkWorking,
  isTouchScreenWorking,
  isScreenOriginal,
  underWarranty,
  hasGSTBill,
  eSIMSupport,
  screenCondition,
  bodyCondition,
  physicalIssues = [],
  technicalIssues = [],
  customDeductions = [],
  hasCharger,
  hasBox,
  answers = {},
  quizConfig = null,
}) {
  const breakdown = {};
  let currentPrice = Number(basePrice) || 0;
  const isSpecial = isSpecialModel(brand, modelName);

  // Dynamic helper: resolves deduction percentage from device DB overrides, quiz config, then defaults
  const getDeductionPct = (key, category = '') => {
    if (!key) return 0;
    // 1. Device specific override (highest priority)
    if (device) {
      if (category === 'screen' && device.screenDeductions?.[key] !== undefined) {
        return Number(device.screenDeductions[key]);
      }
      if (category === 'body' && device.bodyDeductions?.[key] !== undefined) {
        return Number(device.bodyDeductions[key]);
      }
      if (category === 'functional' && device.functionalDeductions?.[key] !== undefined) {
        return Number(device.functionalDeductions[key]);
      }
      // General fallbacks across collections if category was omitted
      if (device.functionalDeductions?.[key] !== undefined) {
        return Number(device.functionalDeductions[key]);
      }
      if (device.screenDeductions?.[key] !== undefined) {
        return Number(device.screenDeductions[key]);
      }
      if (device.bodyDeductions?.[key] !== undefined) {
        return Number(device.bodyDeductions[key]);
      }
      if (device.deductions?.[key] !== undefined) {
        return Number(device.deductions[key]);
      }
      if (device[key] !== undefined && typeof device[key] === 'number') {
        return Number(device[key]);
      }
    }
    // 2. Category Quiz Configuration override from Admin Quiz Manager
    if (quizConfig?.steps) {
      const keyAliases = {
        dead: ['able_to_make_calls', 'dead'],
        cellularNetworkFaulty: ['cellular_network_working', 'cellularNetworkFaulty'],
        screenFaulty: ['touch_screen_working', 'screenFaulty'],
        nonOriginalScreen: ['screen_original', 'nonOriginalScreen'],
        outOfWarranty: ['manufacturer_warranty', 'outOfWarranty'],
        noBill: ['gst_bill', 'noBill'],
        noCharger: ['charger', 'noCharger'],
        noBox: ['box', 'noBox'],
        crackedScreen: ['defect_screen_broken_scratch', 'crackedScreen'],
        deadPixels: ['defect_screen_spots_lines', 'deadPixels'],
        scratches: ['defect_body_scratch_dent', 'scratches'],
        brokenPanel: ['defect_panel_missing_broken', 'brokenPanel'],
      };
      const targets = [key, ...(keyAliases[key] || [])];

      for (const step of quizConfig.steps) {
        for (const q of (step.questions || [])) {
          // If the key matches a question ID (e.g. able_to_make_calls, touch_screen_working, etc.)
          if (targets.includes(q.id)) {
            const faultOpt = q.options?.find(o => o.isNegative || o.id === 'no' || targets.includes(o.id));
            if (faultOpt && faultOpt.deductionValue !== undefined && faultOpt.deductionType === 'percentage') {
              return Number(faultOpt.deductionValue);
            }
          }
          for (const opt of (q.options || [])) {
            if (targets.includes(opt.id) && opt.deductionValue !== undefined && opt.deductionType === 'percentage') {
              return Number(opt.deductionValue);
            }
          }
        }
      }
    }
    // 3. Market benchmark defaults
    return ISSUE_DEDUCTIONS[key] ?? 0;
  };

  // Helper: apply a percentage deduction to currentPrice and record it in breakdown
  const applyDeduction = (key, pct) => {
    const validPct = Math.max(0, Math.min(100, Number(pct) || 0));
    if (validPct === 0) return;
    const deduction = Math.round(currentPrice * (validPct / 100));
    breakdown[key] = validPct;
    currentPrice = Math.max(currentPrice - deduction, 0);
  };

  // 1. Age deduction (applied first to base price)
  const ageDeductions = { '0 - 3 Months': 0, '3 - 6 Months': 7, '6 - 11 Months': 10, 'Above 11 Months': 21 };
  const agePct = isSpecial ? 0 : (ageDeductions[deviceAge] ?? 7);
  if (agePct > 0) applyDeduction('age', agePct);

  // 2. Dead device (cannot make calls / does not switch on) — default 90% or device override
  const isDead = (doesTabletSwitchOn === false) || (ableToMakeCalls === false);
  if (isDead) {
    const deadPct = getDeductionPct('dead') || 90;
    applyDeduction('dead', deadPct);
  }

  // 2b. Cellular / Network issue — default 20% or device override
  if (isCellularNetworkWorking === false) {
    const cellPct = getDeductionPct('cellularNetworkFaulty') || 20;
    applyDeduction('cellularNetworkFaulty', cellPct);
  }

  // 3. Touch screen faulty — default 65% or device override
  if (isTouchScreenWorking === false) {
    const touchPct = getDeductionPct('screenFaulty') || 65;
    applyDeduction('screenFaulty', touchPct);
  }

  // 4. Non-original screen — default 50% or device override
  if (isScreenOriginal === false) {
    const copyPct = getDeductionPct('copyScreen') || 50;
    applyDeduction('copyScreen', copyPct);
  }

  // 5. Out of warranty — 20%
  if (!isSpecial && underWarranty === false && deviceAge !== 'Above 11 Months') {
    const warPct = getDeductionPct('outOfWarranty') || 20;
    applyDeduction('outOfWarranty', warPct);
  }

  // 6. No GST bill — 21%
  if (!isSpecial && hasGSTBill === false && deviceAge !== 'Above 11 Months') {
    const billPct = getDeductionPct('noBill') || 21;
    applyDeduction('noBill', billPct);
  }

  // 7. eSIM only global variant — default 6% or device override
  if (eSIMSupport === 'esim_only_global') {
    const esimPct = getDeductionPct('eSIM') || 6;
    applyDeduction('eSIM', esimPct);
  }

  // 8. Screen condition deduction (Cashify 4-card selection)
  if (screenCondition && screenCondition !== 'none') {
    const screenPct = getDeductionPct(screenCondition, 'screen');
    if (screenPct > 0) {
      applyDeduction(`screen_${screenCondition}`, screenPct);
    }
  }

  // 9. Body condition deduction (Cashify Good/Average/Below Average)
  if (bodyCondition && bodyCondition !== 'good' && bodyCondition !== 'flawless') {
    const bodyPct = getDeductionPct(bodyCondition, 'body');
    if (bodyPct > 0) {
      applyDeduction(`body_${bodyCondition}`, bodyPct);
    }
  }

  // 10. No charger — default 3% or device override
  if (hasCharger === false) {
    const chargerPct = getDeductionPct('noCharger') || 3;
    applyDeduction('noCharger', chargerPct);
  }

  // 11. No box — default 5% or device override
  if (hasBox === false) {
    const boxPct = getDeductionPct('noBox') || 5;
    applyDeduction('noBox', boxPct);
  }

  // 12. Dynamic Physical + Technical + Custom Issues
  // Any newly added question/condition passed in physicalIssues, technicalIssues, or customDeductions
  const combinedIssues = new Set([
    ...(Array.isArray(physicalIssues) ? physicalIssues : []),
    ...(Array.isArray(technicalIssues) ? technicalIssues : []),
    ...(Array.isArray(customDeductions) ? customDeductions : []),
  ]);

  // Also include any dynamic answers dictionary keys that are truthy or arrays
  if (answers && typeof answers === 'object') {
    Object.entries(answers).forEach(([qKey, qVal]) => {
      if (Array.isArray(qVal)) {
        qVal.forEach(item => combinedIssues.add(item));
      } else if (typeof qVal === 'string' && qVal && qVal !== 'none' && qVal !== 'good' && qVal !== 'flawless') {
        // If not already handled as screenCondition/bodyCondition
        if (qKey !== 'screenCondition' && qKey !== 'bodyCondition' && qKey !== 'deviceAge') {
          combinedIssues.add(qVal);
        }
      }
    });
  }

    for (const id of combinedIssues) {
    if (!id || id === 'none') continue;
    const pct = getDeductionPct(id, 'functional');
    if (pct > 0) {
      applyDeduction(`issue_${id}`, pct);
    }
  }

  // 13. Dynamic Flat INR Deductions from QuizConfig
  if (quizConfig?.steps) {
    for (const step of quizConfig.steps) {
      for (const q of (step.questions || [])) {
        for (const opt of (q.options || [])) {
          if (combinedIssues.has(opt.id) && opt.deductionType === 'flat_inr' && opt.deductionValue > 0) {
            const flatAmt = Math.round(Number(opt.deductionValue));
            currentPrice = Math.max(currentPrice - flatAmt, 0);
            breakdown[`flat_${opt.id}`] = flatAmt;
          }
        }
      }
    }
  }

  const totalDeductionPct = basePrice > 0
    ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
    : 0;

  const finalPrice = Math.max(currentPrice, 0);

  return {
    basePrice,
    totalDeductionPct,
    breakdown,
    finalPrice,
  };
}


function getProcessorValuation(processorStr) {
  if (!processorStr) return { base: 2500, increment: 0 };
  const p = processorStr.toLowerCase();

  const isRyzen = p.includes('ryzen');
  const isLatest = p.includes('12th') || p.includes('13th') || p.includes('14th') || p.includes('ultra') || p.includes('elite') || p.includes('plus') || p.includes('ryzen 3 6th') || p.includes('ryzen 3 7th') || p.includes('ryzen 3 8th') || p.includes('ryzen 5 6th') || p.includes('ryzen 5 7th') || p.includes('ryzen 5 8th') || p.includes('ryzen 7 6th') || p.includes('ryzen 7 7th') || p.includes('ryzen 7 8th') || p.includes('ryzen 9 6th') || p.includes('ryzen AI') || p.includes('series 1') || p.includes('series 2') || p.includes('series 3');

  const isOlderModern = p.includes('8th') || p.includes('9th') || p.includes('10th') || p.includes('11th') || p.includes('2nd gen') || p.includes('3rd gen') || p.includes('4th gen') || p.includes('5th gen') || (isRyzen && !isLatest);

  // Core i9 / Ryzen 9 / Core Ultra 9 / Snapdragon X Elite
  if (p.includes('i9') || p.includes('ryzen 9') || p.includes('ultra 9') || p.includes('elite')) {
    if (isLatest) return { base: 5000, increment: 20000 };
    if (isOlderModern) return { base: 5000, increment: 10000 };
    return { base: 2500, increment: 0 };
  }

  // Core i7 / Ryzen 7 / Core Ultra 7
  if (p.includes('i7') || p.includes('ryzen 7') || p.includes('ultra 7')) {
    if (isLatest) return { base: 5000, increment: 14000 };
    if (isOlderModern) return { base: 5000, increment: 5500 };
    return { base: 2500, increment: 0 };
  }

  // Core i5 / Ryzen 5 / Core Ultra 5
  if (p.includes('i5') || p.includes('ryzen 5') || p.includes('ultra 5')) {
    if (isLatest) return { base: 5000, increment: 8500 };
    if (isOlderModern) return { base: 5000, increment: 3500 };
    return { base: 2500, increment: 0 };
  }

  // Core i3 / Ryzen 3 / Core Ultra 3
  if (p.includes('i3') || p.includes('ryzen 3') || p.includes('ultra 3')) {
    if (isLatest) return { base: 5000, increment: 4500 };
    if (isOlderModern) return { base: 5000, increment: 1500 };
    return { base: 2500, increment: 0 };
  }

  // Default fallbacks for other processors
  if (isLatest || isOlderModern) {
    return { base: 5000, increment: 0 };
  }
  return { base: 2500, increment: 0 };
}

export function getProcessorIncrement(processorStr) {
  return getProcessorValuation(processorStr).increment;
}

function getRamIncrement(ramStr) {
  if (!ramStr) return 0;
  const num = parseInt(ramStr) || 0;
  if (num >= 32) return 5500;
  if (num >= 16) return 2800;
  if (num >= 8) return 1200;
  return 0;
}

function getStorageIncrement(storageStr) {
  if (!storageStr) return 0;
  const s = storageStr.toLowerCase();

  let ssdPart = '';
  if (s.includes('+')) {
    const parts = s.split('+');
    ssdPart = parts.find(p => p.includes('ssd')) || '';
  } else if (s.includes('ssd')) {
    ssdPart = s;
  }

  if (!ssdPart) return 0;

  const match = ssdPart.match(/(\d+)\s*(gb|tb)/);
  if (!match) return 0;

  let val = parseInt(match[1]);
  const unit = match[2];
  if (unit === 'tb') {
    val = val * 1024;
  }

  if (val >= 1024) return 4500;
  if (val >= 512) return 2200;
  if (val >= 256) return 1000;
  return 0;
}

function getGpuIncrement(hasGpu, isGpuWorking) {
  if (hasGpu && isGpuWorking) {
    return 5000;
  }
  return 0;
}

function getScreenSizeIncrement(sizeKey) {
  if (sizeKey === '10-11') return 150;
  if (sizeKey === '12-13') return 175;
  if (sizeKey === '14-15') return 210;
  if (sizeKey === 'above15') return 250;
  return 0;
}

function getBrandMultiplier(device) {
  if (!device) return 1.0;

  const brand = (device.brand || '').toLowerCase();
  const m = (device.modelName || '').toLowerCase();

  // Dell
  if (brand === 'dell') {
    if (m.includes('precision') || m.includes('latitude 3000')) {
      return 1.15; // Business
    }
    if (m.includes('gaming') || m.includes('g7') || m.includes('g15') || m.includes('g16') || m.includes('alienware') || m.includes('g5') || m.includes('g3')) {
      return 1.40; // Gaming
    }
    if (m.includes('xps')) {
      return 1.35; // Flagship
    }
    return 1.0; // Budget
  }

  // HP
  if (brand === 'hp') {
    if (m.includes('zbook') || m.includes('specre') || m.includes('spectre')) {
      return 1.15; // Business
    }
    if (m.includes('victus') || m.includes('gaming') || m.includes('omen') || m.includes('power series')) {
      return 1.40; // Gaming
    }
    if (m.includes('envy') || m.includes('probook')) {
      return 1.35; // Flagship
    }
    return 1.0; // Budget
  }

  // Lenovo
  if (brand === 'lenovo') {
    if (m.includes('legion') || m.includes('loq') || m.includes('gaming') || m.includes('edge')) {
      return 1.40; // Gaming
    }
    if (m.includes('yoga') || m.includes('ideapad slim 5i') || m.includes('slim 5i')) {
      return 1.35; // Flagship
    }
    return 1.0; // Budget
  }

  // Asus
  if (brand === 'asus') {
    if (m.includes('proart') || m.includes('zenbook pro') || m.includes('studiobook')) {
      return 1.15; // Business
    }
    if (m.includes('rog') || m.includes('tuf') || m.includes('gaming') || m.includes('zephyrus') || m.includes('strix')) {
      return 1.40; // Gaming
    }
    return 1.0; // Budget
  }

  // Acer
  if (brand === 'acer') {
    if (m.includes('conceptd') || m.includes('swift 3x') || m.includes('travelmate p6') || m.includes('swift 7') || m.includes('swift x') || m.includes('spin 7') || m.includes('aspire 7') || m.includes('travelmate p4')) {
      return 1.15; // Business
    }
    if (m.includes('predator') || m.includes('helios') || m.includes('triton') || m.includes('nitro') || m.includes('21x')) {
      return 1.40; // Gaming
    }
    return 1.0; // Budget
  }

  // Microsoft
  if (brand === 'microsoft') {
    if (m.includes('pro x') || m.includes('pro 7') || m.includes('surface 4') || m.includes('laptop 3') || m.includes('pro 6')) {
      return 1.15; // Business
    }
    return 1.0; // Budget
  }

  // MSI
  if (brand === 'msi') {
    if (m.includes('summit') || m.includes('modern') || m.includes('creator')) {
      return 1.15; // Business
    }
    if (m.includes('raider') || m.includes('series') || m.includes('gl') || m.includes('gp') || m.includes('prestige') || m.includes('stealth') || m.includes('gf') || m.includes('gt') || m.includes('delta') || m.includes('bravo') || m.includes('alpha')) {
      return 1.40; // Gaming
    }
    return 1.0; // Budget
  }

  // Samsung
  if (brand === 'samsung') {
    if (m.includes('ultra') || m.includes('pro') || m.includes('book3') || m.includes('book4') || m.includes('book5') || m.includes('book2') || m.includes('360')) {
      if (m.includes('edge')) {
        return 1.40; // Gaming
      }
      return 1.15; // Business
    }
    return 1.0; // Budget
  }

  // Fallback to database tier
  const tier = (device.tier || '').toLowerCase();
  if (tier === 'gaming' || tier.includes('gaming')) {
    return 1.40;
  }
  if (tier === 'premium' || tier.includes('flagship') || tier.includes('premium')) {
    return 1.35;
  }
  if (tier === 'mid-range' || tier.includes('mid') || tier.includes('business')) {
    return 1.15;
  }

  return 1.0;
}

function getAgeMultiplier(yearBracket) {
  if (yearBracket === 'lessThan1') return 1.15;
  if (yearBracket === 'oneToTwo') return 1.0;
  if (yearBracket === 'twoToThree') return 0.90;
  return 1.0;
}

export function calculateLaptopPrice(device, selections) {
  const { ram, storage, yearBracket,
    functionalIssues = [], screenIssues = [], bodyIssues = [],
    accessories, powerStatus, screenSize } = selections;

  let basePrice;

  if (device.brand === 'Apple') {
    // ── 1. Find base price from variant for Apple ──
    let variant = device.variants.find(v =>
      v.ram === ram &&
      v.storage === storage &&
      (!selections.processor || v.processor === selections.processor) &&
      (!selections.generation || v.generation === selections.generation)
    );

    if (variant) {
      basePrice = variant.basePrice;
    } else if (device.variants.length === 1 && !device.variants[0].ram) {
      // Single-variant device (flat price, e.g., Apple models)
      basePrice = device.variants[0].basePrice;
    } else {
      // Fallback: Use the first variant as baseline and adjust
      const baseline = device.variants[0];
      basePrice = baseline.basePrice;

      // ── 1. Processor Tier Delta ──
      const selProc = selections.processor || '';
      const baseProc = baseline.processor || device.processorFamily || '';
      if (selProc && baseProc) {
        const s = selProc.toLowerCase();
        const b = baseProc.toLowerCase();
        if (s !== b) {
          const getMacTier = (proc) => {
            if (proc.includes('max')) return 3;
            if (proc.includes('pro')) return 2;
            if (proc.includes('i9')) return 3;
            if (proc.includes('i7')) return 2;
            if (proc.includes('i5')) return 1;
            if (proc.includes('i3')) return 0;
            return 1; // base M-chip (M1, M2, M3, M4)
          };
          const sTier = getMacTier(s);
          const bTier = getMacTier(b);
          const isMSeries = s.includes('apple') || b.includes('apple');
          const step = isMSeries ? 15000 : 3500;
          basePrice += (sTier - bTier) * step;
        }
      }

      // ── 2. RAM Delta ──
      const ramVal = (r) => parseInt(r) || 8;
      const baseRam = baseline.ram ? ramVal(baseline.ram) : 16;
      basePrice += (ramVal(ram) - baseRam) * 200;

      // ── 3. Storage Delta ──
      const parseStorage = (st) => {
        if (!st) return 0;
        let totalGB = 0;
        const parts = st.split('+');
        parts.forEach(p => {
          const val = parseInt(p.trim()) || 0;
          const isTB = p.toUpperCase().includes('TB');
          totalGB += isTB ? val * 1024 : val;
        });
        return totalGB;
      };

      const baselineGB = parseStorage(baseline.storage) || 512;
      const selectedGB = parseStorage(storage);
      basePrice += (selectedGB - baselineGB) * 5;
    }

    // Apple Age Multipliers & deductions
    const ageMult = device.ageMultipliers?.[yearBracket] || 1;
    let currentPrice = Math.round(basePrice * ageMult);
    const ageAdjustment = currentPrice - basePrice;

    let powerDeduction = 0;
    if (powerStatus === 'off') {
      powerDeduction = Math.round(basePrice * 0.95);
      currentPrice = Math.max(currentPrice - powerDeduction, 0);
    }

    let functionalDeduction = 0;
    const funcIssues = (functionalIssues || []).filter(i => i !== 'noIssues');
    for (const issue of funcIssues) {
      const pct = device.functionalDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        functionalDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    let screenDeduction = 0;
    const defaultScreenDeductions = {
      screen_flawless: 0,
      screen_scratches_minor: 5,
      screen_scratches_major: 10,
      screen_cracked: 25,
      screenCracked: 25,
      screen_discolour_none: 0,
      screen_discolour_minor: 8,
      screen_discolour_major: 18,
      lineDiscolour: 18,
      screen_spots_none: 0,
      screen_spots_minor: 8,
      screen_spots_major: 18,
      screen_lines_none: 0,
      screen_lines_visible: 18,
      screen_lines_flickering: 20,
      screen_lines_black_dots: 15,
    };
    const scrIssues = (screenIssues || []).filter(i => i !== 'noIssue');
    for (const issue of scrIssues) {
      const pct = device.screenDeductions?.[issue] ?? defaultScreenDeductions[issue] ?? 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        screenDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    let bodyDeduction = 0;
    for (const issue of (bodyIssues || [])) {
      const pct = device.bodyDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        bodyDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    const accList = Array.isArray(accessories) ? [...accessories] : [];
    if (yearBracket && yearBracket !== 'lessThan1' && !accList.includes('bill')) {
      accList.push('bill');
    }
    const accBonus = accList.reduce((sum, item) => sum + (device.accessoriesBonus?.[item] || 0), 0);
    currentPrice += accBonus;

    const finalPrice = Math.max(Math.round(currentPrice / 100) * 100, 0);

    return {
      basePrice,
      ageAdjustment,
      powerDeduction: -powerDeduction,
      functionalDeduction: -functionalDeduction,
      screenDeduction: -screenDeduction,
      bodyDeduction: -bodyDeduction,
      accessoriesBonus: accBonus,
      finalPrice,
    };
  } else {
    // ── 1. Windows Laptop Bottom-Up valuation ──
    const deviceProcessor = device.generation
      ? `${device.processorFamily || ''} - ${device.generation}`
      : (device.processorFamily || '');
    const processor = selections.processor || deviceProcessor;

    // Shell Base Value dynamically computed based on generation
    const { base: functionalBase, increment: cpuIncrement } = getProcessorValuation(processor);

    // RAM Increment
    const ramIncrement = getRamIncrement(ram);

    // Storage Increment
    const storageIncrement = getStorageIncrement(storage);

    // Screen Size Increment
    const screenSizeIncrement = getScreenSizeIncrement(screenSize);

    // Dedicated GPU Increment
    const gpuIncrement = getGpuIncrement(selections.hasGpu, selections.isGpuWorking);

    // Component Sum (Functional Base + CPU + RAM + Storage + GPU + Screen Size)
    const componentSum = functionalBase + cpuIncrement + ramIncrement + storageIncrement + gpuIncrement + screenSizeIncrement;

    // Get Brand Tier Multiplier
    const brandMultiplier = getBrandMultiplier(device);

    // Brand Value (Branded Base Price)
    basePrice = Math.round(componentSum * brandMultiplier);

    // ── 2. Age multiplier (applied to branded base price) ──
    const ageMultiplier = getAgeMultiplier(yearBracket);
    let currentPrice = Math.round(basePrice * ageMultiplier);
    const ageAdjustment = currentPrice - basePrice;

    // ── 2.5 Power status deduction (if laptop is off, reduce 95% of base price) ──
    let powerDeduction = 0;
    if (powerStatus === 'off') {
      powerDeduction = Math.round(basePrice * 0.95);
      currentPrice = Math.max(currentPrice - powerDeduction, 0);
    }

    // ── 3. Functional issues ──
    let functionalDeduction = 0;
    const funcIssues = (functionalIssues || []).filter(i => i !== 'noIssues');
    for (const issue of funcIssues) {
      const pct = device.functionalDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        functionalDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    // ── 4. Screen issues ──
    let screenDeduction = 0;
    const defaultScreenDeductions = {
      screen_flawless: 0,
      screen_scratches_minor: 5,
      screen_scratches_major: 10,
      screen_cracked: 25,
      screenCracked: 25,
      screen_discolour_none: 0,
      screen_discolour_minor: 8,
      screen_discolour_major: 18,
      lineDiscolour: 18,
      screen_spots_none: 0,
      screen_spots_minor: 8,
      screen_spots_major: 18,
      screen_lines_none: 0,
      screen_lines_visible: 18,
      screen_lines_flickering: 20,
      screen_lines_black_dots: 15,
    };
    const scrIssues = (screenIssues || []).filter(i => i !== 'noIssue');
    for (const issue of scrIssues) {
      const pct = device.screenDeductions?.[issue] ?? defaultScreenDeductions[issue] ?? 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        screenDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    // ── 5. Body issues ──
    let bodyDeduction = 0;
    for (const issue of (bodyIssues || [])) {
      const pct = device.bodyDeductions?.[issue] || 0;
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        bodyDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    // ── 6. Accessories bonus ──
    const accList = Array.isArray(accessories) ? [...accessories] : [];
    if (yearBracket && yearBracket !== 'lessThan1' && !accList.includes('bill')) {
      accList.push('bill');
    }
    const accBonus = accList.reduce((sum, item) => sum + (device.accessoriesBonus?.[item] || 0), 0);
    currentPrice += accBonus;

    const finalPrice = Math.max(Math.round(currentPrice / 100) * 100, 0);

    return {
      basePrice,
      ageAdjustment,
      powerDeduction: -powerDeduction,
      functionalDeduction: -functionalDeduction,
      screenDeduction: -screenDeduction,
      bodyDeduction: -bodyDeduction,
      accessoriesBonus: accBonus,
      finalPrice,
    };
  }
}
