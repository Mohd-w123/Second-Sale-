import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { deviceService } from "../services/device.service";
import { useQuote } from "../hooks/useQuote";
import { useAuth } from "../hooks/useAuth";
import { calculateGamingPrice } from "../utils/gamingPriceCalculator";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import {
  Gamepad2, ChevronDown, CheckCircle2, XCircle, ArrowRight, ArrowLeft,
  RotateCcw, Sparkles, Box, Disc, Cable, FileText,
  AlertTriangle, Check, ShieldCheck, Wifi, Bluetooth,
  Tv, Network, PlusCircle, Info
} from "lucide-react";

const STEPS = [
  {
    id: "powerOn",
    title: "Power On",
    question: "Does your gaming console power on and display video output?",
    desc: "We currently only accept gaming consoles that boot up and output display.",
    choiceType: "single",
    options: [
      {
        id: "power_yes",
        label: "Yes, Powers On & Displays Video",
        isPositive: true,
        bullets: ["Console boots up to main dashboard!", "HDMI video and sound output correctly!"]
      },
      {
        id: "power_no",
        label: "No, Does Not Turn On / Blank",
        isPositive: false,
        bullets: ["Console does not power on or light up!", "Blinking error light (e.g. BLOD/RROD) or no signal!"]
      }
    ]
  },
  {
    id: "bodyCondition",
    title: "Physical Body",
    question: "What is the physical condition of the console chassis / body?",
    desc: "Inspect the console casing, vents, and side faceplates.",
    choiceType: "single",
    options: [
      {
        id: "flawless",
        label: "Flawless",
        isPositive: true,
        bullets: ["Pristine console casing, zero scratches or dents!", "Cooling vents are fully intact and clean!"]
      },
      {
        id: "good",
        label: "Good",
        isPositive: true,
        bullets: ["Minor light scuffs or hairline marks from normal use!", "No deep dents, cracks, or broken plastic!"]
      },
      {
        id: "average",
        label: "Average",
        isPositive: false,
        bullets: ["Noticeable scratches or scuffs on outer plates!", "Minor cosmetic wear or small scratches!"]
      },
      {
        id: "broken",
        label: "Broken / Heavy Dents",
        isPositive: false,
        bullets: ["Cracked faceplate, broken vents, or severe dents!", "Missing screws or loose outer frame!"]
      }
    ]
  },
  {
    id: "functionalIssues",
    title: "Functional Issues",
    question: "Are there any functional issues with your console?",
    desc: "Select any issues your console has. If none, simply click Continue.",
    choiceType: "multi_issues",
    options: [
      { id: "cd_drive", label: "CD / Blu-ray Disc Drive Faulty", icon: Disc },
      { id: "usb_ports", label: "USB Ports Faulty / Loose", icon: Cable },
      { id: "hdmi_port", label: "HDMI Video Port Faulty", icon: Tv },
      { id: "lan_port", label: "LAN / Ethernet Port Faulty", icon: Network },
      { id: "bluetooth", label: "Bluetooth Controller Pairing Faulty", icon: Bluetooth },
      { id: "wifi", label: "Wi-Fi Wireless Connectivity Faulty", icon: Wifi }
    ]
  },
  {
    id: "accessories",
    title: "Accessories",
    question: "Select Original Accessories You Have",
    desc: "Original controllers and box increase your payout.",
    choiceType: "multi_accessories",
    options: [
      { id: "acc_controller", label: "Original Wireless Controller", icon: Gamepad2 },
      { id: "acc_adapter", label: "Power & HDMI Cable", icon: Cable },
      { id: "acc_box", label: "Original Brand Box", icon: Box },
      { id: "acc_bill", label: "Valid Bill / Invoice", icon: FileText },
      { id: "acc_extra_controller", label: "Extra Controller (+3% Bonus)", icon: PlusCircle }
    ]
  },
  {
    id: "gameCds",
    title: "Original Game CDs",
    question: "How many Game CDs do you have?",
    desc: "The Games should be compatible with the Console",
    choiceType: "dropdown",
  }
];

export default function GamingConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variant = searchParams.get("variant") || searchParams.get("storage") || "";

  const { updateQuote } = useQuote();
  const { isAuthenticated } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    powerOn: null,
    bodyCondition: null,
    functionalIssues: [],
    accessories: [],
    gameCds: "0"
  });
  const [showResult, setShowResult] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    deviceService.getDevice(slug)
      .then(res => {
        setDevice(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const basePrice = useMemo(() => {
    if (!device) return 0;
    if (variant && device.variants?.length > 0) {
      const v = device.variants.find(x => x.storage === variant);
      if (v?.basePrice) return v.basePrice;
    }
    return device.variants?.[0]?.basePrice || device.maxPrice || 0;
  }, [device, variant]);

  const valuation = useMemo(() => {
    return calculateGamingPrice({
      basePrice,
      answers: {
        powerOn: answers.powerOn === "power_yes" ? "yes" : answers.powerOn === "power_no" ? "no" : undefined,
        bodyCondition: answers.bodyCondition,
        functionalIssues: answers.functionalIssues || [],
        accessories: {
          controller: (answers.accessories || []).includes("acc_controller"),
          adapter: (answers.accessories || []).includes("acc_adapter"),
          box: (answers.accessories || []).includes("acc_box"),
          bill: (answers.accessories || []).includes("acc_bill"),
          extraController: (answers.accessories || []).includes("acc_extra_controller")
        },
        gameCds: Number(answers.gameCds) || 0
      }
    });
  }, [basePrice, answers]);

  const currentStep = STEPS[stepIndex];

  const handleSingleSelect = (val) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: val }));
  };

  const handleToggleIssue = (issueId) => {
    setAnswers(prev => {
      const current = Array.isArray(prev.functionalIssues) ? prev.functionalIssues : [];
      const updated = current.includes(issueId)
        ? current.filter(x => x !== issueId)
        : [...current, issueId];
      return { ...prev, functionalIssues: updated };
    });
  };

  const handleToggleAccessory = (accId) => {
    setAnswers(prev => {
      const current = Array.isArray(prev.accessories) ? prev.accessories : [];
      const updated = current.includes(accId)
        ? current.filter(x => x !== accId)
        : [...current, accId];
      return { ...prev, accessories: updated };
    });
  };

  const hasBoxOrBill = Array.isArray(answers.accessories) && (
    answers.accessories.includes("acc_box") || answers.accessories.includes("acc_bill")
  );

  const isCurrentStepValid = () => {
    if (!currentStep) return false;
    if (currentStep.id === "powerOn") return answers.powerOn === "power_yes";
    if (currentStep.id === "bodyCondition") return !!answers.bodyCondition;
    if (currentStep.id === "functionalIssues") return true; // Optional
    if (currentStep.id === "accessories") return hasBoxOrBill;
    if (currentStep.id === "gameCds") return answers.gameCds !== null && answers.gameCds !== undefined;
    return true;
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(-1);
    }
  };

  const handleSchedulePickup = () => {
    const quotePayload = {
      device: {
        brand: device.brand,
        modelName: device.modelName,
        slug: device.slug,
        category: "gaming",
        imageUrl: device.imageUrl || "",
        storage: variant || "Standard",
        quizAnswers: answers,
        answerSummary: Object.entries(answers).map(([k, v]) => ({ key: k, value: v }))
      },
      priceBreakdown: {
        basePrice,
        finalPrice: valuation.finalPrice,
        deductions: valuation.deductions
      }
    };

    updateQuote(quotePayload);
    try {
      localStorage.setItem("quote", JSON.stringify(quotePayload));
    } catch (e) {}

    if (isAuthenticated) {
      navigate("/schedule-pickup");
    } else {
      navigate("/login?returnUrl=/schedule-pickup");
    }
  };

  if (loading) return <Loader />;
  if (!device) return null;

  const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "";

  // Result Valuation Screen
  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <SEOHead
          title={`Offer for ${device.modelName} — ₹${valuation.finalPrice.toLocaleString("en-IN")} | SecondSale`}
          description={`Final buyback quote for ${device.modelName}. Book free doorstep inspection & get paid on spot.`}
        />

        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>

          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            Final Buyback Offer
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {device.modelName}
          </h1>
          {variant && (
            <p className="text-xs font-semibold text-slate-400 mb-4">{variant}</p>
          )}

          <div className="my-6 py-6 bg-slate-50 rounded-3xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Guaranteed Pickup Amount
            </span>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              ₹{valuation.finalPrice.toLocaleString("en-IN")}
            </div>
            {valuation.deductions?.length > 0 && (
              <button
                type="button"
                onClick={() => setShowBreakdownModal(true)}
                className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Info size={14} />
                View Valuation Breakdown
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSchedulePickup}
              className="w-full py-4 sm:py-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black rounded-2xl text-base sm:text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Schedule Free Pickup</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResult(false);
                setStepIndex(0);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2 cursor-pointer"
            >
              <RotateCcw size={14} />
              Re-calculate / Retake Quiz
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-semibold">
            <div>⚡ Instant UPI / Bank Transfer</div>
            <div>🚚 Free Doorstep Pickup</div>
            <div>🛡️ Zero Hidden Fees</div>
          </div>
        </div>

        {/* Price Breakdown Modal */}
        {showBreakdownModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Price Breakdown</h3>
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-bold text-slate-700 py-1.5 border-b border-slate-100">
                  <span>Base Market Price</span>
                  <span>₹{basePrice.toLocaleString("en-IN")}</span>
                </div>

                {valuation.deductions?.map((d, i) => (
                  <div key={i} className="flex justify-between text-slate-600 py-1">
                    <span>{d.label}</span>
                    <span className={`font-bold ${d.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {d.amount > 0 ? `+₹${d.amount.toLocaleString("en-IN")}` : `-₹${Math.abs(d.amount).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between font-black text-sm text-slate-900 pt-3 border-t border-slate-200">
                  <span>Final Value</span>
                  <span className="text-emerald-600">₹{valuation.finalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <SEOHead
        title={`Sell ${device.modelName} — Condition Evaluation | SecondSale`}
        description={`Answer a few simple questions about your ${device.modelName} to get the best cash valuation instantly.`}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400">Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-100">
            {currentStep.title}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mb-2 leading-snug">
            {currentStep.question}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentStep.desc}
          </p>
        </div>

        {/* Step 5: Dropdown for Game CDs */}
        {currentStep.id === "gameCds" ? (
          <div className="max-w-md mx-auto my-4">
            <label className="block text-sm sm:text-base font-extrabold text-slate-800 mb-2">
              Select the no of CDs
            </label>
            <div className="relative">
              <select
                value={answers.gameCds ?? "0"}
                onChange={(e) => handleSingleSelect(e.target.value)}
                className="w-full appearance-none px-5 py-4 bg-white border-2 border-blue-600 rounded-2xl text-base sm:text-lg font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer shadow-xs"
              >
                {[...Array(16).keys()].map((n) => (
                  <option key={n} value={String(n)} className="font-semibold text-slate-800 py-1">
                    {n}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        ) : currentStep.id === "functionalIssues" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {currentStep.options.map(opt => {
              const IconComp = opt.icon;
              const isSelected = Array.isArray(answers.functionalIssues) && answers.functionalIssues.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleIssue(opt.id)}
                  className={`rounded-2xl border-2 p-3 sm:p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-between h-32 ${
                    isSelected
                      ? "border-red-500 bg-red-50/50 shadow-xs ring-2 ring-red-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    <IconComp size={20} />
                  </div>
                  <span className={`text-xs font-bold leading-tight ${
                    isSelected ? "text-red-700 font-black" : "text-slate-700"
                  }`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : currentStep.id === "accessories" ? (
          <>
            {/* Step 4: Accessories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {currentStep.options.map(opt => {
                const IconComp = opt.icon;
                const isSelected = Array.isArray(answers.accessories) && answers.accessories.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleAccessory(opt.id)}
                    className={`rounded-2xl border-2 p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-between h-32 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      <IconComp size={22} />
                    </div>
                    <span className={`text-xs font-bold leading-tight ${
                      isSelected ? "text-blue-700 font-black" : "text-slate-700"
                    }`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mandatory Warning Banner */}
            <div className="mt-6 max-w-2xl mx-auto p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
              <AlertTriangle size={18} className="text-[#D97706] shrink-0" />
              <span>Either genuine bill or box is required for device to be acceptable at pickup!</span>
            </div>
          </>
        ) : (
          /* Single Select Cards (Power On, Body Condition, Game CDs) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentStep.options.map(opt => {
              const isSelected = answers[currentStep.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSingleSelect(opt.id)}
                  className={`text-left rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-600 shadow-md ring-2 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`px-4 py-3 flex items-center justify-between border-b ${
                    isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 border-slate-100 text-slate-800"
                  }`}>
                    <span className="font-extrabold text-sm sm:text-base">{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-white text-blue-600" : "border-2 border-slate-300"
                    }`}>
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </div>

                  {opt.bullets && (
                    <ul className="p-4 space-y-2 bg-white">
                      {opt.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          {opt.isPositive !== false ? (
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                          )}
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Power On Rejection Notice */}
        {currentStep.id === "powerOn" && answers.powerOn === "power_no" && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-center max-w-md mx-auto text-xs text-red-700 font-bold flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            <span>Sorry, we cannot accept consoles that do not turn on.</span>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8 max-w-xs mx-auto text-center">
          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
              isCurrentStepValid()
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-500/20"
                : "bg-[#A5C9FF] text-white/90 cursor-not-allowed"
            }`}
          >
            <span>{stepIndex === STEPS.length - 1 ? "Get Price" : "Continue"}</span>
            <ArrowRight size={18} />
          </button>

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="mt-3 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
