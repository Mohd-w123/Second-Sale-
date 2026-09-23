// ─── CASHIFY-STYLE TELEVISION PRICE CALCULATOR ────────────────────────────
// Evaluates deductions dynamically based on Cashify TV trade-in rules.

export const TV_DEFAULT_DEDUCTIONS = {
  dead: 90,
  lcd: 15,
  non_smart: 15,
  hd_ready: 10,
  lines_dots: 35,
  screen_cracked: 65,
  scratches: 10,
  dented_cracked: 20,
  button_faulty: 5,
  port_faulty: 8,
  speaker_faulty: 10,
  bluetooth_faulty: 5,
  wifi_faulty: 8,
  no_remote: 8,
  no_power_cable: 4,
  no_stand: 5,
  no_box: 2,
  no_bill: 3,
  age_1_to_3: 12,
  age_above_3: 25,
};

export function calculateTvPrice({
  basePrice = 0,
  device = {},
  doesTvSwitchOn = true,
  displayType = 'led',
  smartTv = 'smart_android',
  resolution = '4k',
  screenCondition = 'flawless',
  physicalCondition = 'flawless',
  functionalDefects = [],
  accessories = ['remote', 'power_cable', 'stand', 'box', 'bill'],
  tvAge = 'less_than_1',
  quizConfig = null,
}) {
  const breakdown = {};
  let currentPrice = Number(basePrice) || 0;

  // Helper to dynamically resolve percentage from device overrides, quiz config, or defaults
  const getDeductionPct = (key, defaultPct) => {
    if (device?.functionalDeductions?.[key] !== undefined) {
      return Number(device.functionalDeductions[key]);
    }
    if (device?.screenDeductions?.[key] !== undefined) {
      return Number(device.screenDeductions[key]);
    }
    if (quizConfig?.steps) {
      for (const step of quizConfig.steps) {
        for (const q of (step.questions || [])) {
          const opt = q.options?.find(o => o.id === key);
          if (opt && opt.deductionValue !== undefined && opt.deductionType === 'percentage') {
            return Number(opt.deductionValue);
          }
        }
      }
    }
    return TV_DEFAULT_DEDUCTIONS[key] ?? defaultPct ?? 0;
  };

  const applyDeduction = (key, pct) => {
    const validPct = Math.max(0, Math.min(100, Number(pct) || 0));
    if (validPct === 0) return;
    const deduction = Math.round(currentPrice * (validPct / 100));
    breakdown[key] = validPct;
    currentPrice = Math.max(currentPrice - deduction, 0);
  };

  // 1. Power on check: Dead TV = 90% deduction
  if (doesTvSwitchOn === false) {
    applyDeduction('dead', getDeductionPct('dead', 90));
  }

  // 2. Display Type Adjustments
  if (displayType === 'lcd') {
    applyDeduction('lcd_panel', getDeductionPct('lcd', 15));
  } else if (displayType === 'oled') {
    // OLED is a premium technology: +15% bump
    const oledBonus = Math.round(currentPrice * 0.15);
    breakdown['oled_bonus'] = 15;
    currentPrice += oledBonus;
  } else if (displayType === 'qled') {
    // QLED bonus: +8%
    const qledBonus = Math.round(currentPrice * 0.08);
    breakdown['qled_bonus'] = 8;
    currentPrice += qledBonus;
  }

  // 3. Smart TV OS Adjustment
  if (smartTv === 'non_smart') {
    applyDeduction('non_smart', getDeductionPct('non_smart', 15));
  }

  // 4. Resolution Adjustment
  if (resolution === 'hd_ready') {
    applyDeduction('hd_ready', getDeductionPct('hd_ready', 10));
  } else if (resolution === '8k') {
    // 8K Resolution Bonus: +20%
    const bonus8k = Math.round(currentPrice * 0.20);
    breakdown['8k_bonus'] = 20;
    currentPrice += bonus8k;
  }

  // 5. Screen Condition (Lines/dots or cracked)
  if (screenCondition === 'lines_dots') {
    applyDeduction('screen_lines_dots', getDeductionPct('lines_dots', 35));
  } else if (screenCondition === 'cracked') {
    applyDeduction('screen_cracked', getDeductionPct('screen_cracked', 65));
  }

  // 6. Physical Body Condition
  if (physicalCondition === 'scratches') {
    applyDeduction('body_scratches', getDeductionPct('scratches', 10));
  } else if (physicalCondition === 'dented_cracked') {
    applyDeduction('body_dented', getDeductionPct('dented_cracked', 20));
  }

  // 7. Functional Defects
  if (Array.isArray(functionalDefects)) {
    functionalDefects.forEach(defect => {
      if (defect && defect !== 'none') {
        const pct = getDeductionPct(defect, TV_DEFAULT_DEDUCTIONS[defect] || 8);
        applyDeduction(`defect_${defect}`, pct);
      }
    });
  }

  // 8. Missing Accessories
  const accList = Array.isArray(accessories) ? accessories : [];
  if (!accList.includes('remote')) {
    applyDeduction('no_remote', getDeductionPct('no_remote', 8));
  }
  if (!accList.includes('power_cable')) {
    applyDeduction('no_power_cable', getDeductionPct('no_power_cable', 4));
  }
  if (!accList.includes('stand')) {
    applyDeduction('no_stand', getDeductionPct('no_stand', 5));
  }
  if (!accList.includes('box')) {
    applyDeduction('no_box', getDeductionPct('no_box', 2));
  }
  if (!accList.includes('bill')) {
    applyDeduction('no_bill', getDeductionPct('no_bill', 3));
  }

  // 9. TV Age & Warranty
  if (tvAge === '1_to_3_years') {
    applyDeduction('age_1_to_3', getDeductionPct('age_1_to_3', 12));
  } else if (tvAge === 'more_than_3_years') {
    applyDeduction('age_above_3', getDeductionPct('age_above_3', 25));
  }

  const totalDeductionPct = basePrice > 0
    ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
    : 0;

  const finalPrice = Math.max(Math.round(currentPrice / 10) * 10, 0);

  return {
    basePrice,
    totalDeductionPct,
    breakdown,
    finalPrice,
  };
}
