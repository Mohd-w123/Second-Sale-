/**
 * Earbuds Buyback Price Calculator
 * Matches DeviceKart valuation algorithm
 */
export function calculateEarbudsPrice({ basePrice = 0, answers = {} }) {
  const base = Number(basePrice) || 0;
  let currentPrice = base;
  const breakdown = {};

  // Helper to apply percent deduction from base
  const applyDeduction = (key, label, pct) => {
    if (pct <= 0) return;
    const amount = Math.round((pct / 100) * base);
    breakdown[key] = { label, pct, amount };
    currentPrice = Math.max(0, currentPrice - amount);
  };

  // 1. Power on
  if (answers.power === "power_no") {
    applyDeduction("power", "Does not turn on / Power issue", 90);
    return {
      basePrice: base,
      finalPrice: Math.max(0, Math.round(currentPrice)),
      totalDeductionPct: 90,
      breakdown,
      isRejected: true,
      rejectedReason: "We currently only accept earbuds that switch on without issue.",
    };
  }

  // 2. Voice / Mic
  if (answers.voice_mic === "voice_faulty") {
    applyDeduction("voice_mic", "Faulty voice / microphone (-20%)", 20);
  }

  // 3. Connectivity
  if (answers.connectivity === "conn_faulty") {
    applyDeduction("connectivity", "Bluetooth / connectivity issues (-35%)", 35);
  }

  // 4. Physical damage
  if (answers.physical === "physical_damaged") {
    applyDeduction("physical", "Physical damage to body or case (-40%)", 40);
  }

  // 5. Accessories (missing items cause deduction)
  const accs = Array.isArray(answers.accessories) ? answers.accessories : [];
  if (!accs.includes("acc_box")) {
    applyDeduction("acc_box", "Missing original box (-5%)", 5);
  }
  if (!accs.includes("acc_case")) {
    applyDeduction("acc_case", "Missing charging case (-25%)", 25);
  }
  if (!accs.includes("acc_cable")) {
    applyDeduction("acc_cable", "Missing charging cable (-3%)", 3);
  }

  // 6. Device Age
  if (answers.age === "age_3_6") {
    applyDeduction("age", "Age: 3–6 months (-7%)", 7);
  } else if (answers.age === "age_6_11") {
    applyDeduction("age", "Age: 6–11 months (-10%)", 10);
  } else if (answers.age === "age_11_plus") {
    applyDeduction("age", "Age: 11+ months (-15%)", 15);
  }

  const finalPrice = Math.max(0, Math.round(currentPrice));
  const totalDeductions = base - finalPrice;
  const totalDeductionPct = base > 0 ? Math.round((totalDeductions / base) * 100) : 0;

  return {
    basePrice: base,
    finalPrice,
    totalDeductionPct,
    breakdown,
    isRejected: false,
  };
}
