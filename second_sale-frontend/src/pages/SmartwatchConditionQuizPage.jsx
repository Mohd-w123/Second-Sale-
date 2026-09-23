import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { deviceService } from "../services/device.service";
import { useQuote } from "../hooks/useQuote";
import { useAuth } from "../hooks/useAuth";
import { calculateSmartwatchPrice } from "../utils/smartwatchPriceCalculator";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import {
  WatchScreenScratchesIcon,
  WatchScreenCrackedIcon,
  WatchBodyGoodIcon,
  WatchBodyAverageIcon,
  WatchBodyDamagedIcon,
  WatchStrapIcon,
  MagneticChargerIcon,
  BoxPackagingIcon,
  BillDocumentIcon
} from "../components/quiz/QuizIcons";
import {
  ArrowRight, ArrowLeft, RotateCcw, Sparkles, AlertTriangle,
  CheckCircle2, XCircle, Check, ShieldCheck, Info, Lock
} from "lucide-react";
import EvaluationOtpModal from "../components/quiz/EvaluationOtpModal";

export default function SmartwatchConditionQuizPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variant = searchParams.get("variant") || searchParams.get("storage") || "";

  const { updateQuote } = useQuote();
  const { isAuthenticated } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  // Exact Cashify live answers
  const [answers, setAnswers] = useState({
    powerOn: "yes",            // "yes" | "no"
    screenCondition: "flawless", // "flawless" | "good" | "average" | "damaged"
    bodyCondition: "flawless",   // "flawless" | "good" | "average" | "below_average"
    accessories: ["acc_charger", "acc_strap", "acc_box", "acc_bill"],
    age: "Below 6 Months"       // "Below 6 Months" | "6 to 11 Months" | "Above 11 Months"
  });

  const [showResult, setShowResult] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
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
    return calculateSmartwatchPrice({
      basePrice,
      answers,
      device: device || {}
    });
  }, [basePrice, answers, device]);

  // Exact 5 Cashify Steps
  const STEPS = [
    {
      id: "powerOn",
      stepNum: 1,
      title: "Does the watch Switch On ?",
      subtitle: "We currently only accept devices that switch on",
      type: "power",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" }
      ]
    },
    {
      id: "screenCondition",
      stepNum: 2,
      title: "Screen Condition",
      subtitle: "Please select your device screen condition",
      type: "cards",
      options: [
        {
          id: "flawless",
          title: "Flawless",
          bullets: ["No scratches", "No screen issue", "Touch Working"],
          badge: "Flawless",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: WatchBodyGoodIcon
        },
        {
          id: "good",
          title: "Good",
          bullets: ["1-2 minor scratches", "No screen issue", "Touch Working"],
          badge: "Minor Wear",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          icon: WatchScreenScratchesIcon
        },
        {
          id: "average",
          title: "Average",
          bullets: ["Multiple scratches", "No screen issue", "Touch Working"],
          badge: "Normal Wear",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          icon: WatchScreenScratchesIcon
        },
        {
          id: "damaged",
          title: "Damaged",
          bullets: ["Cracked screen / lines / spots / touch not working"],
          badge: "Defective",
          badgeColor: "bg-red-50 text-red-700 border-red-200",
          icon: WatchScreenCrackedIcon
        }
      ]
    },
    {
      id: "bodyCondition",
      stepNum: 3,
      title: "Physical Condition",
      subtitle: "Please select your device physical condition",
      type: "cards",
      options: [
        {
          id: "flawless",
          title: "Flawless",
          bullets: ["Like new, no dents", "No scratches", "Buttons working"],
          badge: "Flawless",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: WatchBodyGoodIcon
        },
        {
          id: "good",
          title: "Good",
          bullets: ["1-2 minor scratches, no dents", "Buttons working"],
          badge: "Good",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          icon: WatchBodyGoodIcon
        },
        {
          id: "average",
          title: "Average",
          bullets: ["Multiple scratches/dents", "Body discoloured", "Buttons working"],
          badge: "Average",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          icon: WatchBodyAverageIcon
        },
        {
          id: "below_average",
          title: "Below Average/Broken",
          bullets: ["Severe dents, broken body", "Buttons not working"],
          badge: "Damaged",
          badgeColor: "bg-red-50 text-red-700 border-red-200",
          icon: WatchBodyDamagedIcon
        }
      ]
    },
    {
      id: "accessories",
      stepNum: 4,
      title: "Do you have the following?",
      subtitle: "Please select accessories which are available",
      type: "accessories",
      options: [
        { id: "acc_charger", label: "Charger available", icon: MagneticChargerIcon },
        { id: "acc_strap", label: "Strap Available", icon: WatchStrapIcon },
        { id: "acc_box", label: "Box available", icon: BoxPackagingIcon },
        { id: "acc_bill", label: "Valid GST Bill Available", icon: BillDocumentIcon }
      ]
    },
    {
      id: "age",
      stepNum: 5,
      title: "Age of your device",
      subtitle: "Let us know how old is your device. Valid bill is needed for devices less than 11 months.",
      type: "age",
      options: [
        {
          id: "Below 6 Months",
          label: "Below 6 Months",
          badge: "Brand Warranty",
          badgeColor: "bg-emerald-100 text-emerald-700",
          desc: "Under official brand warranty with invoice"
        },
        {
          id: "6 to 11 Months",
          label: "6 to 11 Months",
          badge: "In Warranty",
          badgeColor: "bg-blue-100 text-blue-700",
          desc: "Between 6 to 11 months old"
        },
        {
          id: "Above 11 Months",
          label: "Above 11 Months",
          badge: "Out of Warranty",
          badgeColor: "bg-slate-100 text-slate-700",
          desc: "Manufacturer warranty has expired"
        }
      ]
    }
  ];

  const currentStep = STEPS[stepIndex];

  const handleToggleAccessory = (accId) => {
    setAnswers(prev => {
      const current = Array.isArray(prev.accessories) ? prev.accessories : [];
      const updated = current.includes(accId)
        ? current.filter(x => x !== accId)
        : [...current, accId];
      return { ...prev, accessories: updated };
    });
  };

  const finalizeAndShowResult = () => {
    const quotePayload = {
      device: {
        brand: device.brand,
        modelName: device.modelName,
        slug: device.slug,
        category: "smartwatch",
        imageUrl: device.imageUrl || "",
        variant: variant,
        quizAnswers: answers,
        answerSummary: [
          { question: "Does the watch Switch On ?", answer: answers.powerOn === "yes" ? "Yes" : "No" },
          { question: "Screen Condition", answer: answers.screenCondition },
          { question: "Physical Condition", answer: answers.bodyCondition },
          { question: "Accessories Available", answer: answers.accessories.join(", ") },
          { question: "Age of your device", answer: answers.age }
        ]
      },
      priceBreakdown: {
        basePrice: valuation.basePrice,
        finalPrice: valuation.finalPrice,
        totalDeductionPct: valuation.totalDeductionPct,
        deductions: valuation.deductions
      }
    };

    updateQuote(quotePayload);
    try {
      localStorage.setItem("quote", JSON.stringify(quotePayload));
    } catch {
      // ignore
    }
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep.id === "powerOn" && answers.powerOn === "no") return;
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowOtpModal(true);
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
        category: "smartwatch",
        imageUrl: device.imageUrl || "",
        variant: variant,
        quizAnswers: answers,
        answerSummary: [
          { question: "Does the watch Switch On ?", answer: answers.powerOn === "yes" ? "Yes" : "No" },
          { question: "Screen Condition", answer: answers.screenCondition },
          { question: "Physical Condition", answer: answers.bodyCondition },
          { question: "Accessories Available", answer: answers.accessories.join(", ") },
          { question: "Age of your device", answer: answers.age }
        ]
      },
      priceBreakdown: {
        basePrice: valuation.basePrice,
        finalPrice: valuation.finalPrice,
        totalDeductionPct: valuation.totalDeductionPct,
        deductions: valuation.deductions
      }
    };

    updateQuote(quotePayload);
    try {
      localStorage.setItem("quote", JSON.stringify(quotePayload));
    } catch {
      // storage error
    }

    if (isAuthenticated) {
      navigate("/schedule-pickup");
    } else {
      navigate("/login?returnUrl=/schedule-pickup");
    }
  };

  if (loading) return <Loader />;
  if (!device) return null;

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <SEOHead
          title={`Offer for ${device.modelName} — ₹${valuation.finalPrice.toLocaleString("en-IN")} | SecondSale`}
          description={`Final buyback quote for ${device.modelName}. Book free doorstep inspection & get paid on spot.`}
        />

        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>

          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
            Final Buyback Offer
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {device.modelName}
          </h1>

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
              className="w-full py-4 sm:py-5 btn-gradient text-white font-black rounded-2xl text-base sm:text-lg shadow-xl shadow-[#087F8C]/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
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
                    <span className="font-bold text-red-500">-₹{d.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}

                <div className="flex justify-between font-black text-sm text-slate-900 pt-3 border-t border-slate-200">
                  <span>Final Value</span>
                  <span className="text-blue-600">₹{valuation.finalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title={`Sell ${device.modelName} — Cashify-Style Valuation | SecondSale`}
        description={`Answer a few simple questions to evaluate the exact condition and get the best price for ${device.modelName}.`}
      />

      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            {device.imageUrl && (
              <img src={device.imageUrl} alt={device.modelName} className="w-8 h-8 object-contain" />
            )}
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black text-slate-900 line-clamp-1">{device.modelName}</span>
              {variant && <span className="text-[10px] text-slate-400 font-bold block">{variant}</span>}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">
              Step {stepIndex + 1} of {STEPS.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] h-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Question Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#087F8C] bg-[#E8F6F7] px-3 py-1 rounded-full mb-2">
                  Step {currentStep.stepNum} of {STEPS.length}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                  {currentStep.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">{currentStep.subtitle}</p>
              </div>

              {/* Step 1: Does the watch Switch On ? */}
              {currentStep.type === "power" && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentStep.options.map(opt => {
                      const isSelected = answers.powerOn === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAnswers(prev => ({ ...prev, powerOn: opt.id }))}
                          className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-base font-black ${isSelected ? "text-[#087F8C]" : "text-slate-900"}`}>
                              {opt.label}
                            </span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              isSelected ? "border-[#087F8C] bg-[#087F8C] text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <Check size={12} className="stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {opt.id === "yes" ? "Watch boots up to home face, displays properly." : "Watch is dead, black screen or stuck in boot loop."}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {answers.powerOn === "no" && (
                    <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                      <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Device Cannot Be Evaluated</div>
                        <div>We currently only accept devices that switch on. Please select &ldquo;Yes&rdquo; if your watch powers on.</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 & 3: Screen Condition & Physical Condition Cards */}
              {currentStep.type === "cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentStep.options.map(opt => {
                    const IconComp = opt.icon;
                    const isSelected = answers[currentStep.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, [currentStep.id]: opt.id }))}
                        className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[170px] ${
                          isSelected
                            ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isSelected ? "bg-[#087F8C] text-white" : "bg-slate-100 text-slate-600"
                              }`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <span className={`text-base font-black ${isSelected ? "text-[#087F8C]" : "text-slate-900"}`}>
                                {opt.title}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                              {opt.badge}
                            </span>
                          </div>

                          <ul className="space-y-1.5 text-xs text-slate-500">
                            {opt.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1.5">
                                <span className="text-slate-400 mt-1">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 flex justify-end">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                            isSelected ? "border-[#087F8C] bg-[#087F8C] text-white" : "border-slate-300"
                          }`}>
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 4: Accessories (Multi-select) */}
              {currentStep.type === "accessories" && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {currentStep.options.map(opt => {
                      const IconComp = opt.icon;
                      const isSelected = Array.isArray(answers.accessories) && answers.accessories.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleAccessory(opt.id)}
                          className={`rounded-2xl border-2 p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[130px] ${
                            isSelected
                              ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                            isSelected ? "bg-[#087F8C] text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            <IconComp className="w-7 h-7" />
                          </div>
                          <span className={`text-xs font-bold leading-tight ${
                            isSelected ? "text-[#087F8C] font-black" : "text-slate-700"
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Original charger and strap will help you get the maximum value for your smartwatch.</span>
                  </div>
                </div>
              )}

              {/* Step 5: Age of your device */}
              {currentStep.type === "age" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentStep.options.map(opt => {
                    const isSelected = answers.age === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, age: opt.id }))}
                        className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                          isSelected
                            ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-base font-black ${isSelected ? "text-[#087F8C]" : "text-slate-900"}`}>
                              {opt.label}
                            </span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              isSelected ? "border-[#087F8C] bg-[#087F8C] text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <Check size={12} className="stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-3">
                            {opt.desc}
                          </p>
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep.id === "powerOn" && answers.powerOn === "no"}
                  className={`px-8 py-3.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    currentStep.id === "powerOn" && answers.powerOn === "no"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "btn-gradient text-white shadow-md shadow-[#087F8C]/20"
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>

          {/* Right Panel: Cashify Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs sticky top-24">
              
              {/* Device Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
                  {device.imageUrl ? (
                    <img src={device.imageUrl} alt={device.modelName} className="w-full h-full object-contain" />
                  ) : (
                    <WatchBodyGoodIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#087F8C] bg-[#E8F6F7] px-2 py-0.5 rounded-md">
                    {device.brand}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1 line-clamp-2">
                    {device.modelName}
                  </h3>
                  {variant && <span className="text-xs text-slate-400 font-semibold">{variant}</span>}
                </div>
              </div>

              {/* Cashify Up To Value banner */}
              <div className="my-5 p-4 rounded-2xl bg-[#E8F6F7] border border-[#087F8C]/20">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#087F8C] block mb-1">
                  Evaluation In Progress
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-600">Get Upto:</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{valuation.basePrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>Step {stepIndex + 1} of {STEPS.length}</span>
                    <span>{Math.round(((stepIndex + 1) / STEPS.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] transition-all duration-300"
                      style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Cashify Device Evaluation Checklist */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Device Evaluation
                </div>

                <div className="space-y-2 text-xs">
                  {/* Step 1 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Does the watch Switch On ?</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      answers.powerOn === "yes" ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {answers.powerOn === "yes" ? (
                        <>Yes <CheckCircle2 size={13} /></>
                      ) : (
                        <>No <XCircle size={13} /></>
                      )}
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Screen Condition</span>
                    <span className="font-bold text-slate-900 capitalize">{answers.screenCondition}</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Physical Condition</span>
                    <span className="font-bold text-slate-900 capitalize">{answers.bodyCondition.replace("_", " ")}</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Accessories</span>
                    <span className="font-bold text-emerald-600">
                      {answers.accessories.length} Included
                    </span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Device Age</span>
                    <span className="font-bold text-[#087F8C]">{answers.age}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center mb-2">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5">
                    <Lock size={12} className="text-[#087F8C]" />
                    Exact Valuation Locked until mobile OTP verification
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Instant Payment Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <CheckCircle2 size={14} className="text-[#087F8C]" />
                  <span>Free Doorstep Pickup</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Unified Evaluation OTP Modal */}
      <EvaluationOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          finalizeAndShowResult();
        }}
        deviceName={device?.modelName || 'Smartwatch'}
      />
    </div>
  );
}
