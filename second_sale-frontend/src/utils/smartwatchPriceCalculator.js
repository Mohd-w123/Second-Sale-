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
    good: 8,
    average: 20,
    damaged: 65,
  },
  bodyCondition: {
    flawless: 0,
    good: 5,
    average: 17,
    broken: 40,
  },
  functionalIssues: {
    battery: 13,
    wifi: 39,
    speakers: 4,
    charging: 10,
    crown: 4,
    side_button: 2,
    heart_rate: 3,
    bluetooth: 39,
  },
  accessories: {
    charger: 3,
    strap: 5,
    box: 5,
    bill: 0,
  },
};

export function calculateSmartwatchPrice({ basePrice, answers = {} }) {
  let currentPrice = Number(basePrice) || 0;
  if (currentPrice <= 0) return { finalPrice: 0, deductions: [] };

  const deductions = [];

  const applyDeduction = (pct, label) => {
    if (!pct || pct <= 0) return;
    const amount = Math.round((pct / 100) * currentPrice);
    currentPrice = Math.max(0, currentPrice - amount);
    deductions.push({ label, percentage: pct, amount });
  };

  // 1. Device Turn On
  if (answers.powerOn === 'no') {
    applyDeduction(SMARTWATCH_PERCENTAGES.powerOn.no, 'Device Does Not Turn On (Major Defect)');
    return {
      finalPrice: Math.max(0, currentPrice),
      deductions,
    };
  }

  // 2. Screen Condition
  if (answers.screenCondition) {
    const screenPct = SMARTWATCH_PERCENTAGES.screenCondition[answers.screenCondition];
    if (screenPct) {
      applyDeduction(screenPct, `Screen Condition: ${answers.screenCondition}`);
    }
  }

  // 3. Physical Body Condition
  if (answers.bodyCondition) {
    const bodyPct = SMARTWATCH_PERCENTAGES.bodyCondition[answers.bodyCondition];
    if (bodyPct) {
      applyDeduction(bodyPct, `Body Condition: ${answers.bodyCondition}`);
    }
  }

  // 4. Functional Issues (multi-select)
  if (Array.isArray(answers.functionalIssues)) {
    answers.functionalIssues.forEach((issue) => {
      const issuePct = SMARTWATCH_PERCENTAGES.functionalIssues[issue];
      if (issuePct) {
        applyDeduction(issuePct, `Functional Issue: ${issue.replace(/_/g, ' ')}`);
      }
    });
  }

  // 5. Accessories (what is missing)
  if (answers.accessories) {
    const { charger, strap, box, bill } = answers.accessories;
    if (!charger) applyDeduction(SMARTWATCH_PERCENTAGES.accessories.charger, 'Missing Original Charger');
    if (!strap) applyDeduction(SMARTWATCH_PERCENTAGES.accessories.strap, 'Missing Original Strap');
    if (!box) applyDeduction(SMARTWATCH_PERCENTAGES.accessories.box, 'Missing Original Box');
    if (!bill) applyDeduction(SMARTWATCH_PERCENTAGES.accessories.bill, 'Missing Valid Bill');
  }

  return {
    finalPrice: Math.max(0, currentPrice),
    deductions,
  };
}
