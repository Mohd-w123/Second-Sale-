import { isSpecialModel } from './specialModels.js';

// ─── EXTENSIBLE ISSUE DEDUCTION PERCENTAGES (MATCHING LIVE CASHIFY GROUND TRUTH) ────
export const ISSUE_DEDUCTIONS = {
  // Cashify Screen Condition Keys
  none: 0,
  scratches: 6,              // > 2 scratches on body (also used as general scratch key)
  cracked: 28,
  faulty: 55,
  not_usable: 85,

  // Cashify Body Condition Keys
  good: 0,
  flawless: 0,
  average: 6,
  below_average: 12,
  broken: 20,

  // ─── Screen broken/scratch sub-defects (Cashify calibrated, warranty-aware) ──────────
  glass_crack: 28,
  back_panel: 12,
  camera_glass_broken: 5,
  // In-warranty deductions (used when device underWarranty === true or warranty not applicable)
  screen_scratches_minor: 5,       // 1-2 scratches (in warranty)
  screen_scratches_major: 10,      // > 2 scratches (in warranty)
  screen_cracked: 25,              // screen cracked / glass broken (in warranty)
  screen_chipped: 15,              // chipped outside display area (in warranty)
  // Out-of-warranty overrides — applied automatically when underWarranty === false
  screen_cracked_ow: 35,           // screen cracked (out of warranty)
  screen_chipped_ow: 25,           // chipped (out of warranty)
  screen_scratches_major_ow: 20,   // > 2 scratches (out of warranty)
  screen_scratches_minor_ow: 8,    // 1-2 scratches (out of warranty)

  // ─── Dead pixels / spots on screen ─────────────────────────────────────────────────
  deadPixels: 30,                  // large / heavy spot on screen
  dead_spots_lines: 30,            // 3 or more minor spots
  screen_spots_minor: 5,           // 1-2 minor spots

  // ─── Visible lines & fading ─────────────────────────────────────────────────────────
  screen_lines: 30,                // visible lines on display
  screen_faded: 16,                // display faded along edges

  // ─── Discoloration ───────────────────────────────────────────────────────────────────
  screen_discoloration_major: 18,
  screen_discoloration_minor: 10,

  // ─── Body scratches ──────────────────────────────────────────────────────────────────
  body_scratches_minor: 3,         // 1-2 scratches on body
  body_scratches_dents: 5,         // 1-2 minor dents on body

  // ─── Body dents (separate key from bent_curved to avoid conflict) ────────────────────
  body_dents_major: 6,             // major dents or > 2 dents on body

  // ─── Panel damage ────────────────────────────────────────────────────────────────────
  bent_curved: 25,                 // bent / curved panel
  panel_missing_broken: 25,
  panel_cracked: 25,               // cracked / broken side or back panel
  panel_missing: 25,               // missing side or back panel
  panel_loose_screen: 8,
  loose_screen: 10,                // loose screen (gap between screen and body)

  // Top-level defect category fallbacks (when no sub-defect is selected)
  defect_screen_broken_scratch: 25,
  defect_screen_spots_lines: 25,
  defect_body_scratch_dent: 6,
  defect_panel_missing_broken: 25,


  // Technical Issues (Matching Cashify Benchmark)
  battery_service: 10,
  battery_80_85: 5,
  front_camera: 6,
  back_camera: 12,
  volume_button: 3,
  wifi_issue: 14,
  finger_touch: 14,
  face_unlock: 16,
  face_sensor: 16,
  speaker_faulty: 4,
  power_button: 3,
  charging_port: 6,
  audio_receiver: 4,
  bluetooth: 10,
  vibrator: 2,
  microphone: 3,
  proximity_sensor: 3,
  silent_button: 2,
  cellularNetworkFaulty: 18,
  dead: 88,
  screenFaulty: 55,
  copyScreen: 35,
  eSIM: 6,
  esim_only_global: 6,  // fallback if not set in quiz config
  noBox: 3,
  noCharger: 3,

  // ─── WARRANTY & BILL COMBINED DEDUCTIONS (Cashify matrix, NOT from quiz config) ───
  // These keys are resolved ONLY via device-specific overrides or these ISSUE_DEDUCTIONS defaults
  // They must NEVER be picked up from quiz config (manufacturer_warranty question "No" option = 20%)
  noBillWarrantyLost: 12,      // Under warranty, but no GST bill → warranty claim invalid
  outOfWarranty: 14,            // Out of warranty, valid GST bill present
  outOfWarrantyAndNoBill: 16,  // Out of warranty AND no GST bill (most common for old phones)
};

// ─── CASHIFY WARRANTY ELIGIBILITY RULE ─────────────────────────────────────
/**
 * Cashify Rule: Determines if a device model is eligible for manufacturer warranty (launched within the last ~14-18 months).
 * Older legacy models (iPhone 11/12/13/14, Galaxy S21/S22/S23, older laptops, etc.) skip the Age & Warranty step completely.
 */
export function isDeviceWarrantyEligible(device) {
  if (!device) return false;

  // 1. Explicit admin/database override
  if (typeof device.isWarrantyEligible === 'boolean') {
    return device.isWarrantyEligible;
  }
  if (device.releaseYear) {
    const currentYear = new Date().getFullYear();
    return Number(device.releaseYear) >= (currentYear - 1);
  }

  const name = (device.modelName || '').toLowerCase();
  const slug = (device.slug || '').toLowerCase();
  const brand = (device.brand || '').toLowerCase();

  const text = `${name} ${slug}`.toLowerCase();
  const clean = text.replace(/[^a-z0-9]/g, '');

  // 2. Apple iPhones: Only iPhone 15, 16, 17 are within active warranty window (2024-2026)
  if (brand.includes('apple') || slug.includes('iphone') || name.includes('iphone')) {
    const activeIphones = ['iphone 15', 'iphone 16', 'iphone 17'];
    return activeIphones.some(p => name.includes(p) || slug.includes(p.replace(' ', '-')));
  }

  // 3. Samsung Galaxy:
  // User Rule: Warranty question is present in all 2023+ models EXCEPT the S23 series
  if (brand.includes('samsung') || slug.includes('samsung')) {
    // Explicit exclusion: S23 series (S23, S23+, S23 Ultra, S23 FE) -> NO WARRANTY
    if (clean.includes('s23')) {
      return false;
    }

    // Explicit exclusion: Older S series (S22, S21, S20, S10, S9, S8) -> NO WARRANTY
    if (/(?:^|[^a-z0-9])s(22|21|20|10|9|8)(?:[^a-z0-9]|$)/i.test(text)) {
      return false;
    }

    // Eligible Galaxy S series: S24, S25, S26 (and Plus, Ultra, FE, Edge variants)
    if (/(?:^|[^a-z0-9])s(24|25|26)(?:[^a-z0-9]|$)/i.test(text) ||
        clean.includes('s24') || clean.includes('s25') || clean.includes('s26')) {
      return true;
    }

    // Eligible Galaxy Z series: Fold 5/6/7/8, Flip 5/6/7/8, Fold Special Edition, TriFold
    if (/(?:fold|flip)[^a-z0-9]*(5|6|7|8)\b/i.test(text) ||
        clean.includes('fold5') || clean.includes('flip5') ||
        clean.includes('fold6') || clean.includes('flip6') ||
        clean.includes('fold7') || clean.includes('flip7') ||
        clean.includes('fold8') || clean.includes('flip8') ||
        clean.includes('foldspecial') || clean.includes('trifold')) {
      return true;
    }

    // Eligible Galaxy A series (from 2023+ list):
    // A05, A05s, A06, A14, A15, A16, A25, A26, A34, A35, A36, A37, A54, A55, A56, A57
    const eligibleA = ['a05', 'a06', 'a14', 'a15', 'a16', 'a25', 'a26', 'a34', 'a35', 'a36', 'a37', 'a54', 'a55', 'a56', 'a57'];
    if (eligibleA.some(code => new RegExp(`(?:^|[^a-z0-9])${code}(?:s)?(?:[^a-z0-9]|$)`, 'i').test(text))) {
      return true;
    }

    // Eligible Galaxy M series (from 2023+ list):
    // M05, M06, M14, M15, M16, M34, M35, M54, M55, M56
    const eligibleM = ['m05', 'm06', 'm14', 'm15', 'm16', 'm34', 'm35', 'm54', 'm55', 'm56'];
    if (eligibleM.some(code => new RegExp(`(?:^|[^a-z0-9])${code}(?:[^a-z0-9]|$)`, 'i').test(text))) {
      return true;
    }

    // Eligible Galaxy F series (from 2023+ list):
    // F05, F06, F14, F15, F16, F34, F54, F55, F56
    const eligibleF = ['f05', 'f06', 'f14', 'f15', 'f16', 'f34', 'f54', 'f55', 'f56'];
    if (eligibleF.some(code => new RegExp(`(?:^|[^a-z0-9])${code}(?:[^a-z0-9]|$)`, 'i').test(text))) {
      return true;
    }

    return false;
  }

  // 4. OnePlus: ALL series launched from Jan 2023 onwards (user requirement)
  // Flagship (11/12/13/15), R-series (11R/12R/13R), Nord (3/4/5/6),
  // Nord CE (3/3 Lite/4/4 Lite/5/6/6 Lite), Open, Nord N30, N6
  if (brand.includes('oneplus') || slug.includes('oneplus') || name.includes('oneplus') || name.includes('one plus')) {
    const activeOnePlusPatterns = [
      // 11 series (Jan/Feb 2023)
      'oneplus11', 'oneplus11r',
      // 12 series (Dec 2023 / Jan 2024)
      'oneplus12', 'oneplus12r',
      // 13 series (Oct 2024 / Jan 2025)
      'oneplus13', 'oneplus13r', 'oneplus13s',
      // 15 series (Oct 2025)
      'oneplus15', 'oneplus15r',
      // Foldable (Oct 2023)
      'oneplusopen',
      // Nord 3, 4, 5, 6 series (Jul 2023+)
      'nord3', 'nord4', 'nord5', 'nord6',
      // Nord CE 3, 4, 5, 6 series (Apr 2023+)
      'nordce3', 'nordce4', 'nordce5', 'nordce6',
      // Nord N series (Jun 2023+)
      'nordn30', 'oneplusn6', 'nordn6'
    ];

    if (activeOnePlusPatterns.some(pat => clean.includes(pat))) {
      return true;
    }
    return false;
  }

  // 5. Google Pixel: Pixel 8, Pixel 9
  if (brand.includes('google') || slug.includes('pixel')) {
    const activePixel = ['pixel 8', 'pixel 9'];
    return activePixel.some(p => name.includes(p) || slug.includes(p.replace(' ', '-')));
  }

  // 6. Xiaomi / Redmi / Poco: 14, 15, Note 13, Note 14, F6, X6
  if (brand.includes('xiaomi') || brand.includes('redmi') || brand.includes('poco')) {
    const activeXiaomi = ['xiaomi 14', 'xiaomi 15', 'note 13', 'note 14', 'poco f6', 'poco x6'];
    return activeXiaomi.some(p => name.includes(p) || slug.includes(p.replace(' ', '-')));
  }

  // 7. Check if model name has a recent year (>= 2024)
  const currentYear = new Date().getFullYear();
  const yearMatch = name.match(/20\d{2}/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    return year >= (currentYear - 1);
  }

  return false;
}

// Helper to determine if phone bundles a power adapter in the retail box
export function bundlesCharger(brand, modelName) {
  if (!modelName) return true;
  const name = modelName.toLowerCase();
  const b = brand?.toLowerCase() || '';
  if (b === 'apple' || name.includes('iphone')) {
    const noChargerPatterns = ['iphone 12', 'iphone 13', 'iphone 14', 'iphone 15', 'iphone 16', 'iphone 17', 'iphone se 2022'];
    return !noChargerPatterns.some(p => name.includes(p));
  }
  if (b === 'samsung') {
    const noChargerPatterns = ['s21', 's22', 's23', 's24', 's25', 'fold', 'flip'];
    return !noChargerPatterns.some(p => name.includes(p));
  }
  if (b === 'google') {
    const noChargerPatterns = ['pixel 6', 'pixel 7', 'pixel 8', 'pixel 9'];
    return !noChargerPatterns.some(p => name.includes(p));
  }
  return true;
}

// ─── DYNAMIC MOBILE & TABLET PRICE CALCULATOR ──────────────────────────────
// Evaluates deductions according to exact Cashify market methodology.
// Prevents duplicate deductions, double-warranty penalties, and clamps values safely.
export function calculatePrice({
  brand,
  modelName,
  device = {},
  basePrice = 0,
  deviceAge,
  isWarrantyEligible: userSpecifiedWarrantyEligible,
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
  const numericBase = Number(basePrice) || 0;
  if (numericBase <= 0) {
    return { basePrice: 0, totalDeductionPct: 0, breakdown: {}, finalPrice: 0 };
  }

  const breakdown = {};
  let totalDeductionPct = 0;
  const isSpecial = isSpecialModel(brand, modelName);

  // Safe percentage extractor: only returns valid 1-100 percentage values
  const sanitizePct = (val) => {
    const num = Number(val);
    if (Number.isFinite(num) && num > 0 && num <= 100) return num;
    return null;
  };

  // Dynamic helper: resolves deduction percentage from device DB overrides, quiz config, then defaults
  const getDeductionPct = (key, category = '') => {
    if (!key) return 0;
    // 1. Device specific override (highest priority, only if valid percentage <= 100)
    if (device) {
      if (category === 'screen' && device.screenDeductions?.[key] !== undefined) {
        const val = sanitizePct(device.screenDeductions[key]);
        if (val !== null) return val;
      }
      if (category === 'body' && device.bodyDeductions?.[key] !== undefined) {
        const val = sanitizePct(device.bodyDeductions[key]);
        if (val !== null) return val;
      }
      if (category === 'functional' && device.functionalDeductions?.[key] !== undefined) {
        const val = sanitizePct(device.functionalDeductions[key]);
        if (val !== null) return val;
      }
      if (device.functionalDeductions?.[key] !== undefined) {
        const val = sanitizePct(device.functionalDeductions[key]);
        if (val !== null) return val;
      }
      if (device.screenDeductions?.[key] !== undefined) {
        const val = sanitizePct(device.screenDeductions[key]);
        if (val !== null) return val;
      }
      if (device.bodyDeductions?.[key] !== undefined) {
        const val = sanitizePct(device.bodyDeductions[key]);
        if (val !== null) return val;
      }
      if (device.deductions?.[key] !== undefined) {
        const val = sanitizePct(device.deductions[key]);
        if (val !== null) return val;
      }
      if (device[key] !== undefined && typeof device[key] === 'number') {
        const val = sanitizePct(device[key]);
        if (val !== null) return val;
      }
    }

    // 2. Category Quiz Configuration override from Admin Quiz Manager
    if (quizConfig?.steps) {
      const keyAliases = {
        dead: ['able_to_make_calls', 'dead', 'does_tablet_switch_on'],
        cellularNetworkFaulty: ['cellular_network_working', 'cellularNetworkFaulty'],
        screenFaulty: ['touch_screen_working', 'screenFaulty', 'faulty'],
        copyScreen: ['screen_original', 'nonOriginalScreen', 'copyScreen'],
        outOfWarranty: ['manufacturer_warranty', 'outOfWarranty'],
        noBill: ['gst_bill', 'noBill'],
        noCharger: ['charger', 'noCharger'],
        noBox: ['box', 'noBox'],
        screen_cracked: ['defect_screen_broken_scratch', 'screen_cracked', 'cracked'],
        deadPixels: ['defect_screen_spots_lines', 'deadPixels'],
        scratches: ['defect_body_scratch_dent', 'scratches'],
        panel_cracked: ['defect_panel_missing_broken', 'panel_cracked'],
      };
      const targets = [key, ...(keyAliases[key] || [])];

      for (const step of quizConfig.steps) {
        for (const q of (step.questions || [])) {
          if (targets.includes(q.id)) {
            const faultOpt = q.options?.find(o => o.isNegative || o.id === 'no' || targets.includes(o.id));
            if (faultOpt && faultOpt.deductionValue !== undefined && faultOpt.deductionType === 'percentage') {
              const val = sanitizePct(faultOpt.deductionValue);
              if (val !== null) return val;
            }
          }
          for (const opt of (q.options || [])) {
            if (targets.includes(opt.id) && opt.deductionValue !== undefined && opt.deductionType === 'percentage') {
              const val = sanitizePct(opt.deductionValue);
              if (val !== null) return val;
            }
          }
        }
      }
    }

    // 3. Market benchmark defaults
    return ISSUE_DEDUCTIONS[key] ?? 0;
  };

  const isEligibleForWarranty = userSpecifiedWarrantyEligible ?? isDeviceWarrantyEligible(device);

  // 1. Dead device check (cannot make calls / does not switch on)
  const isDead = (doesTabletSwitchOn === false) || (ableToMakeCalls === false);
  if (isDead) {
    const deadPct = getDeductionPct('dead') || 88;
    breakdown.dead = deadPct;
    totalDeductionPct = deadPct;
    const finalPrice = Math.max(Math.round(numericBase * (1 - totalDeductionPct / 100) / 10) * 10, 1500);
    return {
      basePrice: numericBase,
      totalDeductionPct,
      breakdown,
      finalPrice,
    };
  }

  // 2. Touch screen faulty (display or digitizer unresponsive)
  if (isTouchScreenWorking === false) {
    const touchPct = getDeductionPct('screenFaulty') || 55;
    totalDeductionPct += touchPct;
    breakdown.screenFaulty = touchPct;
  }

  // 3. Non-original / Copy screen
  if (isScreenOriginal === false) {
    const copyPct = getDeductionPct('copyScreen') || 30;
    totalDeductionPct += copyPct;
    breakdown.copyScreen = copyPct;
  }

  // 4. Cellular network issue
  if (isCellularNetworkWorking === false) {
    const cellPct = getDeductionPct('cellularNetworkFaulty') || 18;
    totalDeductionPct += cellPct;
    breakdown.cellularNetworkFaulty = cellPct;
  }

  // 5. Warranty & GST Invoice Evaluation (Exact Cashify Matrix — NO compounding, NO quiz config interference)
  // NOTE: We deliberately bypass getDeductionPct() here because the quiz config's manufacturer_warranty
  // question "No" option returns 20% (the old default), which wrongly overrides the combined-case values.
  // Instead we use: device-specific override → ISSUE_DEDUCTIONS → hardcoded fallback.
  if (!isSpecial && isEligibleForWarranty) {
    const hasWarranty = Boolean(underWarranty);
    const hasBill = Boolean(hasGSTBill);

    // Helper: only check device-level overrides and ISSUE_DEDUCTIONS, skip quiz config entirely
    const getWarrantyPct = (key, fallback) => {
      // 1. Device-specific admin override (highest priority)
      const devVal = device?.deductions?.[key];
      if (devVal !== undefined) { const v = Number(devVal); if (Number.isFinite(v) && v > 0 && v <= 100) return v; }
      // 2. Market benchmark
      const issueVal = ISSUE_DEDUCTIONS[key];
      if (issueVal !== undefined) { const v = Number(issueVal); if (Number.isFinite(v) && v > 0 && v <= 100) return v; }
      return fallback;
    };

    if (hasWarranty && hasBill) {
      // Full active warranty with valid GST bill: 0% deduction
    } else if (hasWarranty && !hasBill) {
      // In warranty window, but without bill → Apple/OEM rejects warranty claim
      const noBillPct = getWarrantyPct('noBillWarrantyLost', 12);
      totalDeductionPct += noBillPct;
      breakdown.noBillWarrantyLost = noBillPct;
    } else if (!hasWarranty && hasBill) {
      // Warranty expired, valid bill present
      const expPct = getWarrantyPct('outOfWarranty', 14);
      totalDeductionPct += expPct;
      breakdown.outOfWarranty = expPct;
    } else {
      // Out of warranty and no bill (most common for older used phones)
      const outPct = getWarrantyPct('outOfWarrantyAndNoBill', 16);
      totalDeductionPct += outPct;
      breakdown.outOfWarrantyAndNoBill = outPct;
    }
  }

  // 6. eSIM variant deduction (fully admin-configurable via Quiz & Deductions panel)
  // ‣ single_esim  → 0% (Indian dual-SIM phones: no deduction)
  // ‣ dual_esim    → admin-set % (e.g. 20% if admin configured it)
  // ‣ esim_only_global → 6% default (US locked / no physical SIM slot)
  // Uses getDeductionPct so quiz config values always take precedence over ISSUE_DEDUCTIONS
  if (eSIMSupport && eSIMSupport !== 'single_esim') {
    const esimPct = getDeductionPct(eSIMSupport);
    if (esimPct > 0) {
      totalDeductionPct += esimPct;
      breakdown[eSIMSupport] = esimPct;
    }
  }

  // 7. Aggregate all selected physical & functional issue keys
  const combinedIssues = new Set([
    ...(Array.isArray(physicalIssues) ? physicalIssues : []),
    ...(Array.isArray(technicalIssues) ? technicalIssues : []),
    ...(Array.isArray(customDeductions) ? customDeductions : []),
  ]);

  if (answers && typeof answers === 'object') {
    Object.entries(answers).forEach(([qKey, qVal]) => {
      if (Array.isArray(qVal)) {
        qVal.forEach(item => combinedIssues.add(item));
      } else if (typeof qVal === 'string' && qVal && qVal !== 'none' && qVal !== 'good' && qVal !== 'flawless') {
        if (qKey !== 'screenCondition' && qKey !== 'bodyCondition' && qKey !== 'deviceAge') {
          combinedIssues.add(qVal);
        }
      }
    });
  }

  // Identify if any specific screen or body sub-defect was chosen
  const SCREEN_DEFECT_KEYS = new Set([
    'screen_cracked', 'screen_chipped', 'screen_scratches_minor', 'screen_scratches_major',
    'deadPixels', 'dead_spots_lines', 'screen_spots_minor', 'screen_lines', 'screen_faded',
    'screen_discoloration_major', 'screen_discoloration_minor',
    'defect_screen_broken_scratch', 'defect_screen_spots_lines'
  ]);

  const BODY_DEFECT_KEYS = new Set([
    'body_scratches_minor', 'scratches', 'body_scratches_dents', 'body_dents_major',
    'bent_curved', 'panel_cracked', 'panel_missing', 'panel_loose_screen', 'loose_screen',
    'camera_glass_broken', 'defect_body_scratch_dent', 'defect_panel_missing_broken'
  ]);

  let screenDeductionSum = 0;
  let bodyDeductionSum = 0;
  let hasSpecificScreenDefect = false;
  let hasSpecificBodyDefect = false;

  // Screen-defect keys that have DIFFERENT deduction rates based on warranty status.
  // Out-of-warranty: higher deduction (device older, repair cost higher).
  // In-warranty or warranty not applicable: use the base (in-warranty) rate.
  const WARRANTY_SENSITIVE_SCREEN_KEYS = new Set([
    'screen_cracked', 'screen_chipped', 'screen_scratches_major', 'screen_scratches_minor',
  ]);

  for (const id of combinedIssues) {
    if (!id || id === 'none') continue;

    if (SCREEN_DEFECT_KEYS.has(id)) {
      hasSpecificScreenDefect = true;
      // Warranty-sensitive keys: use higher _ow rate when device is confirmed out-of-warranty
      let effectiveKey = id;
      if (WARRANTY_SENSITIVE_SCREEN_KEYS.has(id) && underWarranty === false) {
        const owKey = `${id}_ow`;
        if (ISSUE_DEDUCTIONS[owKey] !== undefined) effectiveKey = owKey;
      }
      const pct = getDeductionPct(effectiveKey, 'screen');
      if (pct > 0) {
        screenDeductionSum += pct;
        breakdown[id] = pct; // use original key for display, not _ow key
      }
    } else if (BODY_DEFECT_KEYS.has(id)) {
      hasSpecificBodyDefect = true;
      const pct = getDeductionPct(id, 'body');
      if (pct > 0) {
        bodyDeductionSum += pct;
        breakdown[id] = pct;
      }
    } else {
      // General technical issue (camera, battery, etc.)
      const pct = getDeductionPct(id, 'functional');
      if (pct > 0) {
        totalDeductionPct += pct;
        breakdown[id] = pct;
      }
    }
  }

  // Fallback for older flows where only screenCondition/bodyCondition strings are passed
  if (!hasSpecificScreenDefect && screenCondition && screenCondition !== 'none') {
    const screenPct = getDeductionPct(screenCondition, 'screen');
    if (screenPct > 0) {
      screenDeductionSum += screenPct;
      breakdown[`screen_${screenCondition}`] = screenPct;
    }
  }

  if (!hasSpecificBodyDefect && bodyCondition && bodyCondition !== 'good' && bodyCondition !== 'flawless') {
    const bodyPct = getDeductionPct(bodyCondition, 'body');
    if (bodyPct > 0) {
      bodyDeductionSum += bodyPct;
      breakdown[`body_${bodyCondition}`] = bodyPct;
    }
  }

  // Cap screen defects to max 55% (screen assembly replacement cost)
  const effectiveScreenDeduction = Math.min(screenDeductionSum, 55);
  // Cap body defects to max 25% (housing replacement cost)
  const effectiveBodyDeduction = Math.min(bodyDeductionSum, 25);

  totalDeductionPct += effectiveScreenDeduction + effectiveBodyDeduction;

  // 8. Dynamic Flat INR Deductions from QuizConfig or DB
  let flatDeductionAmt = 0;
  if (quizConfig?.steps) {
    for (const step of quizConfig.steps) {
      for (const q of (step.questions || [])) {
        for (const opt of (q.options || [])) {
          if (combinedIssues.has(opt.id) && opt.deductionType === 'flat_inr' && opt.deductionValue > 0) {
            const flatAmt = Math.round(Number(opt.deductionValue));
            flatDeductionAmt += flatAmt;
            breakdown[`flat_${opt.id}`] = flatAmt;
          }
        }
      }
    }
  }

  // 9. Accessories
  if (hasBox === false) {
    const boxPct = getDeductionPct('noBox') || 3;
    totalDeductionPct += boxPct;
    breakdown.noBox = boxPct;
  }

  // Charger: Only deduct if device bundles charger and user does not have it
  const deviceBundlesCharger = bundlesCharger(brand || device.brand, modelName || device.modelName);
  if (hasCharger === false && deviceBundlesCharger) {
    const chargerPct = getDeductionPct('noCharger') || 3;
    totalDeductionPct += chargerPct;
    breakdown.noCharger = chargerPct;
  }

  // 10. Total deduction clamp: maximum 88% so a working device maintains a fair scrap/parts floor
  totalDeductionPct = Math.min(totalDeductionPct, 88);

  const percentageDeductionAmt = Math.round(numericBase * (totalDeductionPct / 100));
  const floorPrice = Math.round(numericBase * 0.05); // At least 5% floor
  const rawFinal = Math.max(numericBase - percentageDeductionAmt - flatDeductionAmt, floorPrice);

  // Round final quote to nearest ₹10 for clean Indian pricing format
  const finalPrice = Math.round(rawFinal / 10) * 10;

  return {
    basePrice: numericBase,
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
    accessories, powerStatus, screenSize, quizConfig } = selections;

  let basePrice;

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

  const resolveLaptopDeduction = (group, key, defaultVal = 0) => {
    if (!key) return 0;
    // 1. Device specific override (highest priority)
    if (device?.[group]?.[key] !== undefined) {
      const val = Number(device[group][key]);
      if (Number.isFinite(val) && val >= 0) return val;
    }
    if (device?.deductions?.[key] !== undefined) {
      const val = Number(device.deductions[key]);
      if (Number.isFinite(val) && val >= 0) return val;
    }
    // 2. Category Quiz Configuration override from Admin Quiz Manager
    if (quizConfig?.steps) {
      for (const step of quizConfig.steps) {
        for (const q of (step.questions || [])) {
          if (q.id === key) {
            const opt = q.options?.find(o => o.isNegative || o.id === 'no' || o.id === key);
            if (opt?.deductionValue !== undefined && opt.deductionType === 'percentage') {
              const val = Number(opt.deductionValue);
              if (Number.isFinite(val) && val >= 0) return val;
            }
          }
          for (const opt of (q.options || [])) {
            if (opt.id === key && opt.deductionValue !== undefined && opt.deductionType === 'percentage') {
              const val = Number(opt.deductionValue);
              if (Number.isFinite(val) && val >= 0) return val;
            }
          }
        }
      }
    }
    return defaultVal;
  };

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
      const powerPct = resolveLaptopDeduction('functionalDeductions', 'powers_on', 95);
      powerDeduction = Math.round(basePrice * (powerPct / 100));
      currentPrice = Math.max(currentPrice - powerDeduction, 0);
    }

    let functionalDeduction = 0;
    const funcIssues = (functionalIssues || []).filter(i => i !== 'noIssues');
    for (const issue of funcIssues) {
      const pct = resolveLaptopDeduction('functionalDeductions', issue, 0);
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        functionalDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    let screenDeduction = 0;
    const scrIssues = (screenIssues || []).filter(i => i !== 'noIssue');
    for (const issue of scrIssues) {
      const pct = resolveLaptopDeduction('screenDeductions', issue, defaultScreenDeductions[issue] ?? 0);
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        screenDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    let bodyDeduction = 0;
    for (const issue of (bodyIssues || [])) {
      const pct = resolveLaptopDeduction('bodyDeductions', issue, 0);
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
      const powerPct = resolveLaptopDeduction('functionalDeductions', 'powers_on', 95);
      powerDeduction = Math.round(basePrice * (powerPct / 100));
      currentPrice = Math.max(currentPrice - powerDeduction, 0);
    }

    // ── 3. Functional issues ──
    let functionalDeduction = 0;
    const funcIssues = (functionalIssues || []).filter(i => i !== 'noIssues');
    for (const issue of funcIssues) {
      const pct = resolveLaptopDeduction('functionalDeductions', issue, 0);
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        functionalDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    // ── 4. Screen issues ──
    let screenDeduction = 0;
    const scrIssues = (screenIssues || []).filter(i => i !== 'noIssue');
    for (const issue of scrIssues) {
      const pct = resolveLaptopDeduction('screenDeductions', issue, defaultScreenDeductions[issue] ?? 0);
      if (pct > 0) {
        const deduction = Math.round(currentPrice * (pct / 100));
        screenDeduction += deduction;
        currentPrice -= deduction;
      }
    }

    // ── 5. Body issues ──
    let bodyDeduction = 0;
    for (const issue of (bodyIssues || [])) {
      const pct = resolveLaptopDeduction('bodyDeductions', issue, 0);
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
