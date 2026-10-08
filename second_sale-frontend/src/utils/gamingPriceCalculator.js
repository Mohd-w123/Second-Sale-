/**
 * Gaming Console Price Calculator
 * Matches DeviceKart's sequential percentage deduction & bonus engine (Yv model)
 */
export const GAMING_PERCENTAGES = {
  powerOn: {
    no: 90,
  },
  bodyCondition: {
    flawless: 0,
    good: 5,
    average: 17,
    broken: 40,
  },
  functionalIssues: {
    cd_drive: 15,
    usb_ports: 10,
    hdmi_port: 20,
    lan_port: 5,
    bluetooth: 39,
    wifi: 39,
  },
  accessories: {
    controller: 10,
    adapter: 3,
    box: 5,
    bill: 0,
    extraController: -3, // -3% Bonus
  },
  gameCds: {
    0: 0,
    1: -1, // -1% Bonus
    2: -2, // -2% Bonus
    3: -3, // -3% Bonus
    4: -4, // -4% Bonus
    5: -5, // -5% Bonus
  }
};

export function calculateGamingPrice({ basePrice, answers = {}, device = {}, quizConfig = null }) {
  const numericBase = Number(basePrice) || 0;
  if (numericBase <= 0) return { basePrice: 0, finalPrice: 0, totalDeductionPct: 0, deductions: [] };

  const deductions = [];
  let totalDeductionPct = 0;

  const resolveDeduction = (category, key, defaultVal) => {
    if (!key) return 0;
    // 1. Device specific override (highest priority)
    if (device?.[category]?.[key] !== undefined) {
      const v = Number(device[category][key]);
      if (Number.isFinite(v) && v >= 0) return v;
    }
    if (device?.deductions?.[key] !== undefined) {
      const v = Number(device.deductions[key]);
      if (Number.isFinite(v) && v >= 0) return v;
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
    return defaultVal !== undefined ? defaultVal : 0;
  };

  const applyDeduction = (pct, label) => {
    if (!pct || pct === 0) return;
    totalDeductionPct += pct;
    const amount = Math.round((Math.abs(pct) / 100) * numericBase);
    deductions.push({ label, percentage: pct, amount: pct > 0 ? -amount : +amount });
  };

  // 1. Device Turn On
  if (answers.powerOn === 'no') {
    const powerPct = resolveDeduction('functionalDeductions', 'console_powers_on', GAMING_PERCENTAGES.powerOn.no);
    applyDeduction(powerPct, 'Console Does Not Turn On (Major Defect)');
    const finalPrice = Math.max(Math.round(numericBase * (1 - powerPct / 100) / 10) * 10, Math.round(numericBase * 0.05));
    return {
      basePrice: numericBase,
      finalPrice,
      totalDeductionPct: powerPct,
      deductions,
    };
  }

  // 2. Physical Body Condition
  if (answers.bodyCondition) {
    const defaultPct = GAMING_PERCENTAGES.bodyCondition[answers.bodyCondition] || 0;
    const bodyPct = resolveDeduction('bodyDeductions', answers.bodyCondition, defaultPct);
    if (bodyPct) {
      applyDeduction(bodyPct, `Body Condition: ${answers.bodyCondition}`);
    }
  }

  // 3. Functional Issues (multi-select)
  if (Array.isArray(answers.functionalIssues)) {
    answers.functionalIssues.forEach((issue) => {
      const defaultPct = GAMING_PERCENTAGES.functionalIssues[issue] || 0;
      const issuePct = resolveDeduction('functionalDeductions', issue, defaultPct);
      if (issuePct) {
        applyDeduction(issuePct, `Functional Issue: ${issue.replace(/_/g, ' ')}`);
      }
    });
  }

  // 4. Accessories
  if (answers.accessories) {
    const { controller, adapter, box, bill, extraController } = answers.accessories;
    if (!controller) {
      const p = resolveDeduction('accessories', 'controller', GAMING_PERCENTAGES.accessories.controller);
      applyDeduction(p, 'Missing Original Controller');
    }
    if (!adapter) {
      const p = resolveDeduction('accessories', 'adapter', GAMING_PERCENTAGES.accessories.adapter);
      applyDeduction(p, 'Missing Power Cable / Adapter');
    }
    if (!box) {
      const p = resolveDeduction('accessories', 'box', GAMING_PERCENTAGES.accessories.box);
      applyDeduction(p, 'Missing Original Box');
    }
    if (!bill) {
      const p = resolveDeduction('accessories', 'bill', GAMING_PERCENTAGES.accessories.bill);
      applyDeduction(p, 'Missing Valid Bill');
    }
    if (extraController) applyDeduction(GAMING_PERCENTAGES.accessories.extraController, 'Extra Controller Included (+3% Bonus)');
  }

  // 5. Game CDs
  const cdCount = Number(answers.gameCds) || 0;
  if (cdCount > 0) {
    const cdPct = GAMING_PERCENTAGES.gameCds[Math.min(cdCount, 5)];
    if (cdPct) {
      applyDeduction(cdPct, `${cdCount} Original Game CD(s) (+${Math.abs(cdPct)}% Bonus)`);
    }
  }

  totalDeductionPct = Math.min(totalDeductionPct, 88);
  const floorPrice = Math.round(numericBase * 0.05);
  const rawFinal = Math.max(numericBase * (1 - totalDeductionPct / 100), floorPrice);
  const finalPrice = Math.round(rawFinal / 10) * 10;

  return {
    basePrice: numericBase,
    finalPrice,
    totalDeductionPct,
    deductions,
  };
}
