// ─── CASHIFY-MATCHED TELEVISION PRICE CALCULATOR ────────────────────────────
// Calibrated directly against Cashify's live TV trade-in quotes and evaluation matrix.

export const TV_DEFAULT_DEDUCTIONS = {
  dead: 95,
  lcd: 15,
  qled_bonus: 10,
  oled_bonus: 20,
  smart_non_android: 5,
  non_smart: 15,
  hd_ready: 10,
  uhd_4k_bonus: 10,
  uhd_8k_bonus: 25,
  lines_dots: 35,
  screen_cracked: 65,
  scratches: 6,
  dented_cracked: 15,
  button_faulty: 4,
  port_faulty: 6,
  speaker_faulty: 8,
  bluetooth_faulty: 4,
  wifi_faulty: 6,
  no_remote: 8,
  no_power_cable: 4,
  no_stand: 3,
  no_box: 1,
  no_bill: 3,
  age_1_to_3: 10,
  age_above_3: 20,
};

export function calculateTvPrice({
  basePrice = 0,
  device = {},
  doesTvSwitchOn = true,
  displayType = 'led',
  smartTv = 'smart_android',
  resolution = 'full_hd',
  screenCondition = 'flawless',
  physicalCondition = 'flawless',
  functionalDefects = [],
  accessories = ['remote', 'power_cable', 'stand', 'box', 'bill'],
  tvAge = '1_to_3_years',
  quizConfig = null,
}) {
  const breakdown = {};
  let price = Number(basePrice) || 0;

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

  // 1. Power on check: Dead TV = 95% scrap floor deduction
  if (doesTvSwitchOn === false) {
    const deadPct = getDeductionPct('dead', 95);
    breakdown['dead'] = deadPct;
    price = Math.round(price * ((100 - deadPct) / 100));
    return {
      basePrice,
      totalDeductionPct: deadPct,
      breakdown,
      finalPrice: Math.max(Math.round(price / 10) * 10, Math.round(basePrice * 0.05)),
    };
  }

  // 2. Display Type Adjustments (LED is 0% standard reference)
  if (displayType === 'lcd') {
    const pct = getDeductionPct('lcd', 15);
    breakdown['lcd_panel'] = pct;
    price -= Math.round(price * (pct / 100));
  } else if (displayType === 'oled') {
    const bonusPct = getDeductionPct('oled_bonus', 20);
    breakdown['oled_bonus'] = bonusPct;
    price += Math.round(price * (bonusPct / 100));
  } else if (displayType === 'qled') {
    const bonusPct = getDeductionPct('qled_bonus', 10);
    breakdown['qled_bonus'] = bonusPct;
    price += Math.round(price * (bonusPct / 100));
  }

  // 3. Smart TV OS Adjustment (Yes-Android is 0% reference)
  if (smartTv === 'non_smart') {
    const pct = getDeductionPct('non_smart', 15);
    breakdown['non_smart'] = pct;
    price -= Math.round(price * (pct / 100));
  } else if (smartTv === 'smart_non_android' || smartTv === 'non_android') {
    const pct = getDeductionPct('smart_non_android', 5);
    breakdown['smart_non_android'] = pct;
    price -= Math.round(price * (pct / 100));
  }

  // 4. Resolution Adjustment (Full HD is 0% reference)
  if (resolution === 'hd_ready') {
    const pct = getDeductionPct('hd_ready', 10);
    breakdown['hd_ready'] = pct;
    price -= Math.round(price * (pct / 100));
  } else if (resolution === '4k' || resolution === 'ultra_hd_4k') {
    const bonusPct = getDeductionPct('uhd_4k_bonus', 10);
    breakdown['4k_bonus'] = bonusPct;
    price += Math.round(price * (bonusPct / 100));
  } else if (resolution === '8k' || resolution === 'ultra_hd_8k') {
    const bonusPct = getDeductionPct('uhd_8k_bonus', 25);
    breakdown['8k_bonus'] = bonusPct;
    price += Math.round(price * (bonusPct / 100));
  }

  // 5. Television Age (Cashify Benchmark: <1yr = 0%, 1-3yrs = 10%, >3yrs = 20%)
  if (tvAge === '1_to_3_years' || tvAge === 'oneToThree' || tvAge === '1_to_3') {
    const agePct = getDeductionPct('age_1_to_3', 10);
    breakdown['age_1_to_3'] = agePct;
    price -= Math.round(price * (agePct / 100));
  } else if (tvAge === 'more_than_3_years' || tvAge === 'moreThan3' || tvAge === 'above_3') {
    const agePct = getDeductionPct('age_above_3', 20);
    breakdown['age_above_3'] = agePct;
    price -= Math.round(price * (agePct / 100));
  }

  // 6. Screen Condition (Flawless = 0%)
  if (screenCondition === 'lines_dots' || screenCondition === 'screen_lines_dots') {
    const pct = getDeductionPct('lines_dots', 35);
    breakdown['screen_lines_dots'] = pct;
    price -= Math.round(price * (pct / 100));
  } else if (screenCondition === 'cracked' || screenCondition === 'screen_cracked') {
    const pct = getDeductionPct('screen_cracked', 65);
    breakdown['screen_cracked'] = pct;
    price -= Math.round(price * (pct / 100));
  }

  // 7. Physical Body Condition (Flawless = 0%)
  if (physicalCondition === 'scratches') {
    const pct = getDeductionPct('scratches', 6);
    breakdown['body_scratches'] = pct;
    price -= Math.round(price * (pct / 100));
  } else if (physicalCondition === 'dented_cracked' || physicalCondition === 'dented') {
    const pct = getDeductionPct('dented_cracked', 15);
    breakdown['body_dented'] = pct;
    price -= Math.round(price * (pct / 100));
  }

  // 8. Functional Defects
  if (Array.isArray(functionalDefects)) {
    functionalDefects.forEach(defect => {
      if (defect && defect !== 'none') {
        const pct = getDeductionPct(defect, TV_DEFAULT_DEDUCTIONS[defect] || 6);
        breakdown[`defect_${defect}`] = pct;
        price -= Math.round(price * (pct / 100));
      }
    });
  }

  // 9. Missing Accessories (Remote and Power Cable are crucial; Stand/Box/Bill tiered)
  const accList = Array.isArray(accessories) ? accessories : [];
  if (!accList.includes('remote')) {
    const pct = getDeductionPct('no_remote', 8);
    breakdown['no_remote'] = pct;
    price -= Math.round(price * (pct / 100));
  }
  if (!accList.includes('power_cable')) {
    const pct = getDeductionPct('no_power_cable', 4);
    breakdown['no_power_cable'] = pct;
    price -= Math.round(price * (pct / 100));
  }
  if (!accList.includes('stand')) {
    const pct = getDeductionPct('no_stand', 3);
    breakdown['no_stand'] = pct;
    price -= Math.round(price * (pct / 100));
  }
  // In-warranty (<1yr) missing box and bill deductions
  if (tvAge === 'less_than_1' || tvAge === 'lessThan1') {
    if (!accList.includes('box')) {
      const pct = getDeductionPct('no_box', 1);
      breakdown['no_box'] = pct;
      price -= Math.round(price * (pct / 100));
    }
    if (!accList.includes('bill')) {
      const pct = getDeductionPct('no_bill', 3);
      breakdown['no_bill'] = pct;
      price -= Math.round(price * (pct / 100));
    }
  }

  // 10. Floor & ₹10 Clean Rounding (Cashify Standard)
  const floorPrice = Math.round(basePrice * 0.05);
  const finalPrice = Math.max(Math.round(price / 10) * 10, floorPrice);

  const totalDeductionPct = basePrice > 0
    ? Math.max(0, Math.min(100, Math.round(((basePrice - finalPrice) / basePrice) * 100)))
    : 0;

  return {
    basePrice,
    totalDeductionPct,
    breakdown,
    finalPrice,
  };
}
