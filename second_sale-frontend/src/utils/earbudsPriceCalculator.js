/**
 * Earbuds Buyback Price Calculator
 * 100% exact match with DeviceKart (zv algorithm & deduction weights)
 */

export const DEVICEKART_EARBUDS_QUIZ = {
  windows: [
    {
      id: "power",
      title: "Power On",
      options: [
        { id: "power_yes", deductionValue: 0, label: "Power On Working" },
        { id: "power_no", deductionValue: 90, label: "Does Not Power On" }
      ]
    },
    {
      id: "voice_mic",
      title: "Voice / Mic",
      options: [
        { id: "voice_ok", deductionValue: 0, label: "Voice/Mic Working" },
        { id: "voice_faulty", deductionValue: 20, label: "Faulty Voice/Mic (-20%)" }
      ]
    },
    {
      id: "connectivity",
      title: "Connectivity",
      options: [
        { id: "conn_ok", deductionValue: 0, label: "Connectivity Working" },
        { id: "conn_faulty", deductionValue: 35, label: "Faulty Connectivity (-35%)" }
      ]
    },
    {
      id: "physical",
      title: "Physical Damage",
      options: [
        { id: "physical_ok", deductionValue: 0, label: "No Physical Damage" },
        { id: "physical_damaged", deductionValue: 40, label: "Physical Damage (-40%)" }
      ]
    },
    {
      id: "accessories",
      title: "Accessories",
      options: [
        { id: "acc_box", deductionValue: 5, label: "Missing Box (-5%)" },
        { id: "acc_case", deductionValue: 25, label: "Missing Charging Case (-25%)" },
        { id: "acc_cable", deductionValue: 3, label: "Missing Charging Cable (-3%)" },
        { id: "acc_bill", deductionValue: 0, label: "Missing Bill (0%)" }
      ]
    },
    {
      id: "age",
      title: "Device Age",
      options: [
        { id: "age_0_3", deductionValue: 0, label: "Below 3 Months" },
        { id: "age_3_6", deductionValue: 7, label: "Between 3–6 Months (-7%)" },
        { id: "age_6_11", deductionValue: 10, label: "Between 6–11 Months (-10%)" },
        { id: "age_11_plus", deductionValue: 15, label: "Above 11 Months (-15%)" }
      ]
    }
  ]
};

export function calculateEarbudsPrice({ basePrice = 0, answers = {} }) {
  let a = Number(basePrice) || 0;
  const breakdown = {};

  const applyDeduction = (key, label, pct) => {
    const n = Number(pct) || 0;
    if (n === 0) return;
    const r = Math.round((Math.abs(n) / 100) * a);
    breakdown[key] = { label, pct: n, amount: r };
    a = n > 0 ? Math.max(a - r, 0) : a + r;
  };

  // 1. Power on
  if (answers.power === "power_no") {
    applyDeduction("power_no", "Does Not Power On (-90%)", 90);
    return {
      basePrice,
      finalPrice: Math.max(Math.round(a), 0),
      totalDeductionPct: 90,
      breakdown,
      isRejected: true,
      rejectedReason: "We currently only accept earbuds that switch on without issue."
    };
  }

  // 2. Voice / Mic
  if (answers.voice_mic === "voice_faulty") {
    applyDeduction("voice_mic", "Faulty Voice/Mic (-20%)", 20);
  }

  // 3. Connectivity
  if (answers.connectivity === "conn_faulty") {
    applyDeduction("connectivity", "Faulty Connectivity (-35%)", 35);
  }

  // 4. Physical Damage
  if (answers.physical === "physical_damaged") {
    applyDeduction("physical", "Physical Damage (-40%)", 40);
  }

  // 5. Accessories (missing items incur deduction)
  const accs = Array.isArray(answers.accessories) ? answers.accessories : [];
  if (!accs.includes("acc_box")) {
    applyDeduction("missing_box", "Missing Original Box (-5%)", 5);
  }
  if (!accs.includes("acc_case")) {
    applyDeduction("missing_case", "Missing Charging Case (-25%)", 25);
  }
  if (!accs.includes("acc_cable")) {
    applyDeduction("missing_cable", "Missing Charging Cable (-3%)", 3);
  }

  // 6. Device Age
  if (answers.age === "age_3_6") {
    applyDeduction("age", "Age 3–6 Months (-7%)", 7);
  } else if (answers.age === "age_6_11") {
    applyDeduction("age", "Age 6–11 Months (-10%)", 10);
  } else if (answers.age === "age_11_plus") {
    applyDeduction("age", "Age Above 11 Months (-15%)", 15);
  }

  const finalPrice = Math.max(Math.round(a), 0);
  const totalDeductionPct = basePrice > 0 ? Math.round(((basePrice - finalPrice) / basePrice) * 100) : 0;

  return {
    basePrice,
    finalPrice,
    totalDeductionPct,
    breakdown,
    isRejected: false
  };
}
