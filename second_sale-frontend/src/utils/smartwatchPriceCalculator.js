/**
 * Smartwatch Price Calculator
 * Matches DeviceKart's sequential percentage deduction engine (Hv model)
 */
export const SMARTWATCH_PERCENTAGES = {
  powerOn: {
    no: 90,
  },
  screenCondition: {
    flawless: 0,
    none: 0,
    good: 8,
    scratches: 10,
    average: 20,
    damaged: 60,
    cracked: 60,
    faulty: 50,
  },
  bodyCondition: {
    flawless: 0,
    good: 0,
    average: 10,
    below_average: 20,
    broken: 35,
  },
  functionalIssues: {
    battery: 13,
    wifi: 39,
    speakers: 5,
    charging: 10,
    crown: 5,
    side_button: 3,
    heart_rate: 6,
    bluetooth: 39,
    touch: 35,
  },
  accessories: {
    charger: 5,
    strap: 5,
    box: 5,
    bill: 0,
  },
  age: {
    age_0_3: 0,
    age_3_6: 5,
    age_6_11: 10,
    age_11_plus: 15,
  },
};

export function calculateSmartwatchPrice({ basePrice, answers = {}, device = {} }) {
  let currentPrice = Number(basePrice) || 0;
  if (currentPrice <= 0) return { finalPrice: 0, deductions: [] };

  const deductions = [];

  const resolveDeduction = (category, key, defaultVal) => {
    if (!key) return 0;
    if (device?.[category]?.[key] !== undefined) return Number(device[category][key]);
    if (device?.deductions?.[key] !== undefined) return Number(device.deductions[key]);
    return defaultVal !== undefined ? defaultVal : 0;
  };

  const applyDeduction = (pct, label) => {
    if (!pct || pct <= 0) return;
    const amount = Math.round((pct / 100) * currentPrice);
    currentPrice = Math.max(0, currentPrice - amount);
    deductions.push({ label, percentage: pct, amount });
  };

  // 1. Device Turn On
  if (answers.powerOn === 'no' || answers.powerOn === 'power_no') {
    const powerPct = resolveDeduction('functionalDeductions', 'power_no', SMARTWATCH_PERCENTAGES.powerOn.no);
    applyDeduction(powerPct, 'Device Does Not Turn On (Major Defect)');
    return {
      finalPrice: Math.max(0, currentPrice),
      deductions,
    };
  }

  // 2. Screen Condition
  if (answers.screenCondition) {
    const screenKey = answers.screenCondition;
    const defaultPct = SMARTWATCH_PERCENTAGES.screenCondition[screenKey] || 0;
    const screenPct = resolveDeduction('screenDeductions', screenKey, defaultPct);
    if (screenPct > 0) {
      applyDeduction(screenPct, `Screen Condition: ${screenKey.replace(/_/g, ' ')}`);
    }
  }

  // 3. Physical Body Condition
  if (answers.bodyCondition) {
    const bodyKey = answers.bodyCondition;
    const defaultPct = SMARTWATCH_PERCENTAGES.bodyCondition[bodyKey] || 0;
    const bodyPct = resolveDeduction('bodyDeductions', bodyKey, defaultPct);
    if (bodyPct > 0) {
      applyDeduction(bodyPct, `Body Condition: ${bodyKey.replace(/_/g, ' ')}`);
    }
  }

  // 4. Functional Issues (multi-select)
  if (Array.isArray(answers.functionalIssues)) {
    answers.functionalIssues.forEach((issue) => {
      const defaultPct = SMARTWATCH_PERCENTAGES.functionalIssues[issue] || 5;
      const issuePct = resolveDeduction('functionalDeductions', issue, defaultPct);
      if (issuePct > 0) {
        applyDeduction(issuePct, `Functional Issue: ${issue.replace(/_/g, ' ')}`);
      }
    });
  }

  // 5. Accessories (what is missing)
  const accessoriesList = Array.isArray(answers.accessories)
    ? answers.accessories
    : answers.accessories && typeof answers.accessories === 'object'
    ? Object.keys(answers.accessories).filter((k) => answers.accessories[k])
    : [];

  if (!accessoriesList.includes('acc_charger') && !accessoriesList.includes('charger')) {
    applyDeduction(SMARTWATCH_PERCENTAGES.accessories.charger, 'Missing Original Charger');
  }
  if (!accessoriesList.includes('acc_strap') && !accessoriesList.includes('strap')) {
    applyDeduction(SMARTWATCH_PERCENTAGES.accessories.strap, 'Missing Original Strap');
  }
  if (!accessoriesList.includes('acc_box') && !accessoriesList.includes('box')) {
    applyDeduction(SMARTWATCH_PERCENTAGES.accessories.box, 'Missing Original Box');
  }
  if (!accessoriesList.includes('acc_bill') && !accessoriesList.includes('bill')) {
    applyDeduction(SMARTWATCH_PERCENTAGES.accessories.bill, 'Missing Valid Bill');
  }

  // 6. Device Age
  if (answers.age) {
    if (answers.age === "Below 6 Months" || answers.age === "age_0_6" || answers.age === "age_0_3" || answers.age === "age_3_6") {
      // 0%
    } else if (answers.age === "6 to 11 Months" || answers.age === "age_6_11") {
      applyDeduction(10, "Device Age (6 to 11 Months)");
    } else if (answers.age === "Above 11 Months" || answers.age === "age_11_plus") {
      applyDeduction(15, "Device Age (Above 11 Months)");
    } else if (SMARTWATCH_PERCENTAGES.age[answers.age]) {
      applyDeduction(SMARTWATCH_PERCENTAGES.age[answers.age], `Device Age (${answers.age.replace('age_', '').replace('_', '-')})`);
    }
  }

  const finalPrice = Math.max(0, currentPrice);
  const totalDeductionPct = basePrice > 0 ? Math.round(((basePrice - finalPrice) / basePrice) * 100) : 0;

  return {
    basePrice,
    finalPrice,
    totalDeductionPct,
    deductions,
  };
}
