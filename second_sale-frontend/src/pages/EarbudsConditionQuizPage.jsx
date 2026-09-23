import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { deviceService } from "../services/device.service";
import { useQuote } from "../hooks/useQuote";
import { useAuth } from "../hooks/useAuth";
import { calculateEarbudsPrice } from "../utils/earbudsPriceCalculator";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import {
  EarbudsPairIcon,
  EarbudsCaseIcon,
  EarbudsMicSoundIcon,
  EarbudsDamagedIcon,
  BluetoothIcon
} from "../components/quiz/QuizIcons";
import {
  ArrowRight, ArrowLeft, RotateCcw, Sparkles, AlertTriangle,
  CheckCircle2, XCircle, Check, ShieldCheck, Info, Lock
} from "lucide-react";
import EvaluationOtpModal from "../components/quiz/EvaluationOtpModal";

export default function EarbudsConditionQuizPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storage = searchParams.get("storage") || "Standard";

  const { updateQuote } = useQuote();
  const { isAuthenticated } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0); // 0: Device Parameters, 1: Device Age

  // Cashify Earbuds exact question states
  const [answers, setAnswers] = useState({
    switchOn: "yes",           // "yes" | "no"
    speakerMicIssues: "no",    // "yes" | "no"
    connectivityIssues: "no",  // "yes" | "no"
    physicalIssues: "no",      // "yes" | "no"
    accessoriesAvailable: "yes", // "yes" | "no"
    age: "Below 6 Months"      // "Below 6 Months" | "6 to 11 Months" | "Above 11 Months"
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
    const v = device.variants?.find(x => x.storage === storage) || device.variants?.[0];
    return v?.basePrice || device.maxPrice || 0;
  }, [device, storage]);

  const valuation = useMemo(() => {
    return calculateEarbudsPrice({
      basePrice,
      answers,
      device: device || {}
    });
  }, [basePrice, answers, device]);

  // Questions on Step 1 (Matching Cashify Live)
  const GENERAL_QUESTIONS = [
    {
      id: "switchOn",
      title: "Does the Earbuds switch on?",
      subtitle: "We currently only accept devices that switch on",
      icon: BluetoothIcon,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "speakerMicIssues",
      title: "Are there any speaker/mic issues in your device?",
      subtitle: "Check your device for issues like voice cracks, faulty speakers, faint sounds",
      icon: EarbudsMicSoundIcon,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "connectivityIssues",
      title: "Are there any connectivity issues in your device?",
      subtitle: "Check your device's bluetooth connectivity for both left and right earbuds",
      icon: EarbudsPairIcon,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "physicalIssues",
      title: "Are there any physical issues on your device?",
      subtitle: "Check your device's charging case, body and buttons' condition carefully",
      icon: EarbudsDamagedIcon,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "accessoriesAvailable",
      title: "Is original charging case, charging cable, invoice and box available?",
      subtitle: "Make sure all your original accessories and invoice/box are available",
      icon: EarbudsCaseIcon,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  ];

  // Age Options on Step 2 (Matching Cashify Live)
  const AGE_OPTIONS = [
    {
      value: "Below 6 Months",
      title: "Below 6 Months",
      desc: "Device is under 6 months old with valid bill / invoice.",
      badge: "Brand Warranty"
    },
    {
      value: "6 to 11 Months",
      title: "6 to 11 Months",
      desc: "Device is between 6 to 11 months old with valid bill.",
      badge: "In Warranty"
    },
    {
      value: "Above 11 Months",
      title: "Above 11 Months",
      desc: "Device is older than 11 months or manufacturer warranty expired.",
      badge: "Out of Warranty"
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isStep1Valid = answers.switchOn !== "" &&
    answers.speakerMicIssues !== "" &&
    answers.connectivityIssues !== "" &&
    answers.physicalIssues !== "" &&
    answers.accessoriesAvailable !== "";

  const finalizeAndShowResult = () => {
    const quotePayload = {
      device: {
        brand: device.brand,
        modelName: device.modelName,
        slug: device.slug,
        category: "earbuds",
        imageUrl: device.imageUrl || "",
        storage: storage,
        quizAnswers: answers,
        answerSummary: [
          { question: "Does the Earbuds switch on?", answer: answers.switchOn === "yes" ? "Yes" : "No" },
          { question: "Are there any speaker/mic issues in your device?", answer: answers.speakerMicIssues === "yes" ? "Yes" : "No" },
          { question: "Are there any connectivity issues in your device?", answer: answers.connectivityIssues === "yes" ? "Yes" : "No" },
          { question: "Are there any physical issues on your device?", answer: answers.physicalIssues === "yes" ? "Yes" : "No" },
          { question: "Is original charging case, charging cable, invoice and box available?", answer: answers.accessoriesAvailable === "yes" ? "Yes" : "No" },
          { question: "Age of your device", answer: answers.age }
        ]
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
    } catch {
      // ignore storage error
    }
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (stepIndex === 0) {
      if (answers.switchOn === "no") return; // cannot proceed if doesn't switch on
      setStepIndex(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowOtpModal(true);
    }
  };

  const handlePrev = () => {
    if (stepIndex === 1) {
      setStepIndex(0);
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
        answerSummary: [
          { question: "Does the Earbuds switch on?", answer: answers.switchOn === "yes" ? "Yes" : "No" },
          { question: "Are there any speaker/mic issues in your device?", answer: answers.speakerMicIssues === "yes" ? "Yes" : "No" },
          { question: "Are there any connectivity issues in your device?", answer: answers.connectivityIssues === "yes" ? "Yes" : "No" },
          { question: "Are there any physical issues on your device?", answer: answers.physicalIssues === "yes" ? "Yes" : "No" },
          { question: "Is original charging case, charging cable, invoice and box available?", answer: answers.accessoriesAvailable === "yes" ? "Yes" : "No" },
          { question: "Age of your device", answer: answers.age }
        ]
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
    } catch {
      // ignore storage error
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
            {Object.keys(valuation.breakdown || {}).length > 0 && (
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

                {Object.values(valuation.breakdown || {}).map((d, i) => (
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
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
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
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">
              Step {stepIndex + 1} of 2
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] h-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Question Forms */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              
              {/* STEP 1: Tell us a few things about your device! */}
              {stepIndex === 0 && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                      Tell us a few things about your device!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Check mentioned parameters for device.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {GENERAL_QUESTIONS.map((q, idx) => {
                      const Icon = q.icon;
                      const currentVal = answers[q.id];
                      return (
                        <div
                          key={q.id}
                          className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs text-[#087F8C]">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 mb-0.5">
                                {idx + 1}. {q.title}
                              </div>
                              <div className="text-xs text-slate-500 leading-relaxed">
                                {q.subtitle}
                              </div>
                            </div>
                          </div>

                          {/* Cashify Radio Buttons: [ Yes ] [ No ] */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {q.options.map(opt => {
                              const isSelected = currentVal === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleAnswerChange(q.id, opt.value)}
                                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                    isSelected
                                      ? "border-[#087F8C] bg-[#087F8C] text-white shadow-xs"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Warning if doesn't switch on */}
                  {answers.switchOn === "no" && (
                    <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                      <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Device Cannot Be Evaluated</div>
                        <div>We currently only accept devices that switch on. Please select &ldquo;Yes&rdquo; if the device powers on.</div>
                      </div>
                    </div>
                  )}

                  {/* Continue Button */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStep1Valid || answers.switchOn === "no"}
                      className={`px-8 py-3.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                        isStep1Valid && answers.switchOn !== "no"
                          ? "btn-gradient text-white shadow-md shadow-[#087F8C]/20"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span>Continue</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Age of your device */}
              {stepIndex === 1 && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                      Age of your device
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Let us know how old is your device. Valid bill is needed for devices less than 11 months.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {AGE_OPTIONS.map(opt => {
                      const isSelected = answers.age === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAnswerChange("age", opt.value)}
                          className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                            isSelected
                              ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-base font-black ${isSelected ? "text-[#087F8C]" : "text-slate-900"}`}>
                                {opt.title}
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
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              opt.badge.includes("Warranty") ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}>
                              {opt.badge}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3.5 rounded-xl btn-gradient text-white text-sm font-black shadow-md shadow-[#087F8C]/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

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
                    <EarbudsPairIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#087F8C] bg-[#E8F6F7] px-2 py-0.5 rounded-md">
                    {device.brand}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1 line-clamp-2">
                    {device.modelName}
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">{storage}</span>
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
                    <span>Step {stepIndex + 1} of 2</span>
                    <span>{stepIndex === 0 ? "50%" : "100%"}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] transition-all duration-300"
                      style={{ width: `${stepIndex === 0 ? 50 : 100}%` }}
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
                  {/* Q1 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Does the Earbuds switch on?</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      answers.switchOn === "yes" ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {answers.switchOn === "yes" ? (
                        <>Yes <CheckCircle2 size={13} /></>
                      ) : (
                        <>No <XCircle size={13} /></>
                      )}
                    </span>
                  </div>

                  {/* Q2 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Voice / mic issues?</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      answers.speakerMicIssues === "no" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {answers.speakerMicIssues === "no" ? (
                        <>No <CheckCircle2 size={13} /></>
                      ) : (
                        <>Yes <AlertTriangle size={13} /></>
                      )}
                    </span>
                  </div>

                  {/* Q3 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Bluetooth connectivity issues?</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      answers.connectivityIssues === "no" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {answers.connectivityIssues === "no" ? (
                        <>No <CheckCircle2 size={13} /></>
                      ) : (
                        <>Yes <AlertTriangle size={13} /></>
                      )}
                    </span>
                  </div>

                  {/* Q4 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Physical / body issues?</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      answers.physicalIssues === "no" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {answers.physicalIssues === "no" ? (
                        <>No <CheckCircle2 size={13} /></>
                      ) : (
                        <>Yes <AlertTriangle size={13} /></>
                      )}
                    </span>
                  </div>

                  {/* Q5 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600 truncate max-w-[200px]">Original case, cable & box?</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      answers.accessoriesAvailable === "yes" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {answers.accessoriesAvailable === "yes" ? (
                        <>Yes <CheckCircle2 size={13} /></>
                      ) : (
                        <>No <AlertTriangle size={13} /></>
                      )}
                    </span>
                  </div>

                  {/* Q6 - Age */}
                  {stepIndex >= 1 && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-600 truncate max-w-[200px]">Device Age</span>
                      <span className="font-bold text-[#087F8C]">{answers.age}</span>
                    </div>
                  )}
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
        deviceName={device?.modelName || 'Earbuds'}
      />
    </div>
  );
}
