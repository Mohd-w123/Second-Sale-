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

export function calculateEarbudsPrice({ basePrice = 0, answers = {}, device = {} }) {
  let a = Number(basePrice) || 0;
  const breakdown = {};

  const resolveDeduction = (category, key, defaultVal) => {
    if (!key) return 0;
    if (device?.[category]?.[key] !== undefined) return Number(device[category][key]);
    if (device?.deductions?.[key] !== undefined) return Number(device.deductions[key]);
    return defaultVal !== undefined ? defaultVal : 0;
  };

  const applyDeduction = (key, label, pct) => {
    const n = Number(pct) || 0;
    if (n === 0) return;
    const r = Math.round((Math.abs(n) / 100) * a);
    breakdown[key] = { label, pct: n, amount: r };
    a = n > 0 ? Math.max(a - r, 0) : a + r;
  };

  // 1. Does the Earbuds switch on?
  const isPowerNo = answers.switchOn === "no" || answers.power === "power_no" || answers.powerOn === "no";
  if (isPowerNo) {
    const powerPct = resolveDeduction("functionalDeductions", "power_no", 90);
    applyDeduction("power_no", `Does Not Power On (-${powerPct}%)`, powerPct);
    return {
      basePrice,
      finalPrice: Math.max(Math.round(a), 0),
      totalDeductionPct: powerPct,
      breakdown,
      isRejected: true,
      rejectedReason: "We currently only accept devices that switch on."
    };
  }

  // 2. Are there any speaker/mic issues in your device?
  const hasAudioIssues = answers.speakerMicIssues === "yes" || answers.voice_mic === "voice_faulty" || answers.micIssue;
  if (hasAudioIssues) {
    const micPct = resolveDeduction("functionalDeductions", "voice_mic", 20);
    applyDeduction("voice_mic", `Speaker / Mic Issues (-${micPct}%)`, micPct);
  }

  // 3. Are there any connectivity issues in your device?
  const hasConnIssues = answers.connectivityIssues === "yes" || answers.connectivity === "conn_faulty" || answers.connectivityIssue;
  if (hasConnIssues) {
    const connPct = resolveDeduction("functionalDeductions", "connectivity", 30);
    applyDeduction("connectivity", `Bluetooth Connectivity Issues (-${connPct}%)`, connPct);
  }

  // 4. Are there any physical issues on your device?
  const hasPhysicalIssues = answers.physicalIssues === "yes" || answers.physical === "physical_damaged" || answers.bodyCondition === "damaged";
  if (hasPhysicalIssues) {
    const physPct = resolveDeduction("bodyDeductions", "damaged", 25);
    applyDeduction("physical", `Physical Issues / Case Wear (-${physPct}%)`, physPct);
  }

  // 5. Is original charging case, charging cable, invoice and box available?
  if (answers.accessoriesAvailable === "no") {
    const accPct = 15;
    applyDeduction("missing_accessories", `Missing Original Accessories/Box (-${accPct}%)`, accPct);
  } else if (Array.isArray(answers.accessories)) {
    if (!answers.accessories.includes("acc_case") && !answers.accessories.includes("case")) {
      applyDeduction("missing_case", "Missing Charging Case (-20%)", 20);
    }
    if (!answers.accessories.includes("acc_box") && !answers.accessories.includes("box")) {
      applyDeduction("missing_box", "Missing Box (-5%)", 5);
    }
  }

  // 6. Age of your device
  if (answers.age === "age_6_11" || answers.age === "6 to 11 Months") {
    applyDeduction("age", "Age 6–11 Months (-7%)", 7);
  } else if (answers.age === "age_above_11" || answers.age === "Above 11 Months" || answers.age === "age_11_plus") {
    applyDeduction("age", "Age Above 11 Months (-12%)", 12);
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
