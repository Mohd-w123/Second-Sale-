import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { deviceService } from "../services/device.service";
import { useQuote } from "../hooks/useQuote";
import { useAuth } from "../hooks/useAuth";
import { calculateEarbudsPrice } from "../utils/earbudsPriceCalculator";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import {
  Headphones, CheckCircle2, XCircle, ArrowRight, ArrowLeft,
  RotateCcw, Sparkles, Box, BatteryCharging, Cable, FileText,
  AlertTriangle, Check, ShieldCheck
} from "lucide-react";

const STEPS = [
  {
    id: "power",
    title: "Power On",
    question: "Does Your Device Switch On Successfully?",
    desc: "We currently only accept devices that switch on without issues.",
    choiceType: "single",
    options: [
      {
        id: "power_yes",
        label: "Yes",
        isPositive: true,
        bullets: ["The device turns on!", "The device connects to devices successfully!"]
      },
      {
        id: "power_no",
        label: "No",
        isPositive: false,
        bullets: ["The device does not turn on!", "The device does not connect to devices successfully!"]
      }
    ]
  },
  {
    id: "voice_mic",
    title: "Voice / Mic",
    question: "Does Your Device Have Voice And/Or Mic Issues?",
    desc: "Let us know whether sound output and mic input work correctly.",
    choiceType: "single",
    options: [
      {
        id: "voice_ok",
        label: "Working Properly",
        isPositive: true,
        bullets: ["Mic works correctly!", "Speaker produces clear stereo sound!"]
      },
      {
        id: "voice_faulty",
        label: "Faulty Voice/Mic",
        isPositive: false,
        bullets: ["Mic does not work correctly!", "Low volume, distortion, or one earbud quiet!"]
      }
    ]
  },
  {
    id: "connectivity",
    title: "Connectivity",
    question: "Does Your Device Have Connectivity Issues?",
    desc: "Let us know if your earbuds pair smoothly and stay connected.",
    choiceType: "single",
    options: [
      {
        id: "conn_ok",
        label: "Working Properly",
        isPositive: true,
        bullets: ["Connects successfully to devices!", "Does not drop connections unexpectedly!"]
      },
      {
        id: "conn_faulty",
        label: "Faulty Connectivity",
        isPositive: false,
        bullets: ["Does not pair or connect smoothly!", "Drops connection frequently or pairing errors!"]
      }
    ]
  },
  {
    id: "physical",
    title: "Physical Damage",
    question: "Does Your Device Have Any Physical Damage?",
    desc: "Let us know if there are cracks, broken hinges, or dents on earbuds or case.",
    choiceType: "single",
    options: [
      {
        id: "physical_ok",
        label: "No Damage",
        isPositive: true,
        bullets: ["Device body & charging case is intact!", "Lids and buttons are fully intact & working!"]
      },
      {
        id: "physical_damaged",
        label: "Damaged Physically",
        isPositive: false,
        bullets: ["Device body and/or charging case is damaged!", "Loose hinge, deep cracks, or missing piece!"]
      }
    ]
  },
  {
    id: "accessories",
    title: "Accessories",
    question: "Select Original Accessories You Have?",
    desc: "Make sure you have your bill with you to know the age of your device",
    choiceType: "multi",
    options: [
      { id: "acc_box", label: "Box", icon: Box },
      { id: "acc_case", label: "Charging Case", icon: BatteryCharging },
      { id: "acc_cable", label: "Charging Cable", icon: Cable },
      { id: "acc_bill", label: "Bill", icon: FileText }
    ]
  },
  {
    id: "age",
    title: "Device Age",
    question: "How Old Is Your Device?",
    desc: "Device age affects the final market valuation.",
    choiceType: "single",
    options: [
      { id: "age_0_3", label: "Below 3 Months", bullets: ["Under manufacturer warranty"] },
      { id: "age_3_6", label: "Between 3–6 Months", bullets: ["Under manufacturer warranty"] },
      { id: "age_6_11", label: "Between 6–11 Months", bullets: ["Under manufacturer warranty"] },
      { id: "age_11_plus", label: "Above 11 Months", bullets: ["Out of warranty"] }
    ]
  }
];

export default function EarbudsConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storage = searchParams.get("storage") || "Standard";

  const { updateQuote } = useQuote();
  const { isAuthenticated } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    accessories: []
  });
  const [showResult, setShowResult] = useState(false);

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
    const v = device.variants?.find(x => x.storage === storage) || device.variants?.[0];
    return v?.basePrice || 0;
  }, [device, storage]);

  const valuation = useMemo(() => {
    return calculateEarbudsPrice({ basePrice, answers });
  }, [basePrice, answers]);

  const currentStep = STEPS[stepIndex];

  const handleSingleSelect = (val) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: val }));
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
    if (currentStep.id === "accessories") return hasBoxOrBill;
    if (currentStep.id === "power" && answers.power === "power_no") return false;
    return !!answers[currentStep.id];
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
        category: "earbuds",
        imageUrl: device.imageUrl || "",
        storage: storage,
        quizAnswers: answers,
        answerSummary: Object.entries(answers).map(([k, v]) => ({ key: k, value: v }))
      },
      priceBreakdown: {
        basePrice: valuation.basePrice,
        finalPrice: valuation.finalPrice,
        totalDeductionPct: valuation.totalDeductionPct,
        breakdown: valuation.breakdown
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
  if (!device) {
    return <div className="text-center py-20 font-bold text-slate-500">Device not found.</div>;
  }

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto py-8 sm:py-14 px-4">
        <SEOHead
          title={`Sell ${device.modelName} — Cash Quote | SecondSale`}
          description="Instant cash quote for your earbuds."
        />

        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-xl">
          {valuation.isRejected ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={36} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Device Not Eligible for Buyback</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                {valuation.rejectedReason || "We currently only accept earbuds that switch on successfully."}
              </p>
              <button
                type="button"
                onClick={() => { setShowResult(false); setStepIndex(0); setAnswers({ accessories: [] }); }}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl text-sm hover:bg-slate-800 transition-colors"
              >
                Retake Evaluation
              </button>
            </div>
          ) : (
            <div>
              {/* Product Info & Top Quote */}
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-8 border-b border-slate-100">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shrink-0">
                  <img
                    src={device.imageUrl || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90"}
                    alt={device.modelName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
                    Verified Offer Ready
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                    {device.modelName}
                  </h1>
                  <p className="text-xs text-slate-400 mb-3">Category: Earbuds / Audio</p>

                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      ₹{valuation.finalPrice.toLocaleString("en-IN")}
                    </span>
                    {valuation.totalDeductionPct > 0 && (
                      <span className="text-xs font-bold text-slate-400 line-through">
                        ₹{valuation.basePrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="py-6 space-y-2 text-xs">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider mb-3">Valuation Summary</h3>
                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span>Base Market Price:</span>
                  <span className="font-bold text-slate-900">₹{valuation.basePrice.toLocaleString("en-IN")}</span>
                </div>
                {Object.entries(valuation.breakdown).map(([k, item]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 text-red-500">
                    <span>{item.label}:</span>
                    <span className="font-bold">-₹{item.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-sm font-black text-slate-900">
                  <span>Final Cash Quote:</span>
                  <span className="text-emerald-600">₹{valuation.finalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSchedulePickup}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get My ₹{valuation.finalPrice.toLocaleString("en-IN")} Now</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => { setShowResult(false); setStepIndex(0); }}
                  className="px-6 py-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Recalculate
                </button>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center gap-3 text-xs text-blue-900">
                <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                <span>Price is locked for 7 days. Free doorstep pickup & instant payment upon device handover.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- QUESTIONS VIEW ---
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      <SEOHead
        title={`Sell ${device.modelName} — Condition Evaluation | SecondSale`}
        description="Answer 6 quick questions to get an accurate buyback value for your earbuds."
      />

      {/* Progress & Live Valuation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          {stepIndex === 0 ? "Back to Model" : "Previous Step"}
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span className="text-sm font-black text-blue-600">
            Est. ₹{valuation.finalPrice.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-8">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 sm:p-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-100">
            {currentStep.title}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mb-2 leading-snug">
            {currentStep.id === "accessories" && device?.modelName
              ? `Select Original ${device.modelName} Accessories You Have?`
              : currentStep.question}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentStep.id === "accessories"
              ? "Make sure you have your bill with you to know the age of your device"
              : currentStep.desc}
          </p>
        </div>

        {/* Question Options */}
        {currentStep.id === "accessories" ? (
          <>
          {/* Multi-select accessories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
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

          {/* Yellow Warning Alert: Box or Bill required */}
          <div className="mt-6 max-w-2xl mx-auto p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
            <AlertTriangle size={18} className="text-[#D97706] shrink-0" />
            <span>Either genuine bill or box is required for device to be acceptable at pickup!</span>
          </div>
          </>
        ) : (
          /* Single Select Cards */
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
                          {opt.isPositive ? (
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
        {currentStep.id === "power" && answers.power === "power_no" && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-center max-w-md mx-auto text-xs text-red-700 font-bold flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            <span>Sorry, we cannot accept earbuds that do not turn on.</span>
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
            <span>{stepIndex === STEPS.length - 1 ? "Calculate Instant Quote" : "Continue"}</span>
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
