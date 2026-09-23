import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import { useQuote } from "../hooks/useQuote";
import { useAuth } from "../hooks/useAuth";
import { calculateGamingPrice } from "../utils/gamingPriceCalculator";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import {
  ConsoleChassisFlawlessIcon,
  ConsoleChassisScratchedIcon,
  ConsoleChassisDamagedIcon,
  ConsoleControllerIcon,
  ConsoleHdmiPortIcon,
  ConsoleLanPortIcon,
  ConsolePowerCableIcon,
  UsbPortIcon,
  OpticalDiscIcon,
  WifiSignalIcon,
  BluetoothIcon,
  BoxPackagingIcon,
  BillDocumentIcon
} from "../components/quiz/QuizIcons";
import {
  ArrowRight, ArrowLeft, RotateCcw, Sparkles, AlertTriangle,
  CheckCircle2, XCircle, Check, ShieldCheck, Info, Lock
} from "lucide-react";
import EvaluationOtpModal from "../components/quiz/EvaluationOtpModal";

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
    powerOn: "yes",
    bodyCondition: "flawless",
    functionalIssues: [],
    accessories: {
      controller: true,
      adapter: true,
      box: true,
      bill: true,
      extraController: false
    },
    gameCds: "0"
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
    return calculateGamingPrice({
      basePrice,
      answers,
      device: device || {}
    });
  }, [basePrice, answers, device]);

  const STEPS = [
    {
      id: "powerOn",
      stepNum: 1,
      title: "Power & Display",
      question: "Does your Gaming Console power on and output video?",
      desc: "Connect to TV via HDMI and confirm console boots to the main dashboard without error lights.",
      type: "single",
      options: [
        {
          id: "yes",
          label: "Yes, Powers On & Displays Video",
          desc: "Console turns on smoothly, fan spins quietly, and HDMI outputs picture.",
          isPositive: true
        },
        {
          id: "no",
          label: "No, Does Not Turn On / Blank",
          desc: "Console won't power on, blue/red error light (BLOD/RROD), or no signal.",
          isPositive: false
        }
      ]
    },
    {
      id: "bodyCondition",
      stepNum: 2,
      title: "Chassis & Casing",
      question: "Select Body Condition of your Console",
      desc: "Check outer faceplates, ventilation grilles, and stand attachments.",
      type: "chassis_cards",
      options: [
        {
          id: "flawless",
          title: "Flawless / Like New",
          desc: "Pristine console casing, zero scratches or scuffs, vents completely clean.",
          badge: "Best Value",
          badgeColor: "bg-emerald-500 text-white",
          icon: ConsoleChassisFlawlessIcon
        },
        {
          id: "average",
          title: "Minor Wear / Scratches",
          desc: "Light surface scratches or scuffs on outer plates from normal usage.",
          badge: "Normal Wear",
          badgeColor: "bg-amber-500 text-white",
          icon: ConsoleChassisScratchedIcon
        },
        {
          id: "broken",
          title: "Broken / Heavy Dents",
          desc: "Cracked faceplate, broken ventilation grills, or deep impact marks.",
          badge: "Heavy Damage",
          badgeColor: "bg-red-500 text-white",
          icon: ConsoleChassisDamagedIcon
        }
      ]
    },
    {
      id: "functionalIssues",
      stepNum: 3,
      title: "Hardware Functional Issues",
      question: "Select Functional Issues with your Console",
      desc: "Tap all hardware components that are faulty. If everything works normally, simply click Continue.",
      type: "functional_cards",
      options: [
        { id: "cd_drive", label: "Disc Drive Faulty / Not Reading", icon: OpticalDiscIcon },
        { id: "usb_ports", label: "USB Ports Faulty / Loose", icon: UsbPortIcon },
        { id: "hdmi_port", label: "HDMI Video Port Faulty", icon: ConsoleHdmiPortIcon },
        { id: "lan_port", label: "LAN / Ethernet Port Faulty", icon: ConsoleLanPortIcon },
        { id: "bluetooth", label: "Bluetooth Pairing Faulty", icon: BluetoothIcon },
        { id: "wifi", label: "Wi-Fi Wireless Connectivity Faulty", icon: WifiSignalIcon }
      ]
    },
    {
      id: "accessories",
      stepNum: 4,
      title: "Original Accessories",
      question: "Which Original Accessories do you have?",
      desc: "Original wireless controllers and cables increase your cash payout.",
      type: "accessories_cards",
      options: [
        { id: "controller", label: "Original Wireless Controller", icon: ConsoleControllerIcon },
        { id: "adapter", label: "Power & HDMI Cables", icon: ConsolePowerCableIcon },
        { id: "box", label: "Original Brand Box", icon: BoxPackagingIcon },
        { id: "bill", label: "Valid Bill / Invoice", icon: BillDocumentIcon },
        { id: "extraController", label: "Extra Controller (+3% Bonus)", icon: ConsoleControllerIcon, isBonus: true }
      ]
    },
    {
      id: "gameCds",
      stepNum: 5,
      title: "Original Game CDs",
      question: "How many Original Game CDs are you selling with the console?",
      desc: "Genuine game discs add bonus value directly to your quote.",
      type: "cds_selector",
      options: [
        { id: "0", label: "No Game CDs", bonus: "0%" },
        { id: "1", label: "1 Original Game CD", bonus: "+1% Cash Bonus" },
        { id: "2", label: "2 Original Game CDs", bonus: "+2% Cash Bonus" },
        { id: "3", label: "3 Original Game CDs", bonus: "+3% Cash Bonus" },
        { id: "4", label: "4 Original Game CDs", bonus: "+4% Cash Bonus" },
        { id: "5", label: "5+ Original Game CDs", bonus: "+5% Cash Bonus" }
      ]
    }
  ];

  const currentStep = STEPS[stepIndex];

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
    setAnswers(prev => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accId]: !prev.accessories?.[accId]
      }
    }));
  };

  const isCurrentStepValid = () => {
    if (!currentStep) return false;
    if (currentStep.id === "powerOn") return answers.powerOn === "yes";
    return true;
  };

  const finalizeAndShowResult = () => {
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
    } catch {
      // ignore
    }
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
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

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <SEOHead
          title={`Offer for ${device.modelName} — ₹${valuation.finalPrice.toLocaleString("en-IN")} | SecondSale`}
          description={`Final buyback quote for ${device.modelName}. Book free doorstep inspection & get paid on spot.`}
        />

        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#E8F6F7] text-[#087F8C] flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>

          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#087F8C] bg-[#E8F6F7] px-3 py-1 rounded-full mb-2">
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
                className="mt-3 text-xs font-bold text-[#087F8C] hover:text-[#066772] underline inline-flex items-center gap-1 cursor-pointer"
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
                    <span className={`font-bold ${d.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {d.amount > 0 ? `+₹${d.amount.toLocaleString("en-IN")}` : `-₹${Math.abs(d.amount).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between font-black text-sm text-slate-900 pt-3 border-t border-slate-200">
                  <span>Final Value</span>
                  <span className="text-[#087F8C]">₹{valuation.finalPrice.toLocaleString("en-IN")}</span>
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
                  Step {currentStep.stepNum}: {currentStep.title}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                  {currentStep.question}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">{currentStep.desc}</p>
              </div>

              {/* Step 1: Power On */}
              {currentStep.type === "single" && (
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
                            ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs"
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
                        <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 2: Chassis Cards */}
              {currentStep.type === "chassis_cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentStep.options.map(opt => {
                    const IconComp = opt.icon;
                    const isSelected = answers.bodyCondition === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, bodyCondition: opt.id }))}
                        className={`relative flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#087F8C] bg-[#E8F6F7] shadow-sm ring-2 ring-[#087F8C]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className={`absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                        <div className="my-4">
                          <IconComp className="w-14 h-20" />
                        </div>
                        <span className={`text-sm font-black mb-1 ${isSelected ? "text-[#087F8C]" : "text-slate-900"}`}>
                          {opt.title}
                        </span>
                        <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 3: Functional Issues */}
              {currentStep.type === "functional_cards" && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentStep.options.map(opt => {
                      const IconComp = opt.icon;
                      const isSelected = Array.isArray(answers.functionalIssues) && answers.functionalIssues.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleIssue(opt.id)}
                          className={`rounded-2xl border-2 p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[125px] ${
                            isSelected
                              ? "border-red-500 bg-red-50/60 shadow-xs ring-2 ring-red-100"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                            isSelected ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            <IconComp className="w-6 h-6" />
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

                  {answers.functionalIssues?.length === 0 && (
                    <p className="mt-4 text-center text-xs font-semibold text-[#087F8C] bg-[#E8F6F7] py-2 rounded-xl">
                      ✓ No issues selected — All console ports, disc drive & connectivity working properly.
                    </p>
                  )}
                </div>
              )}

              {/* Step 4: Accessories */}
              {currentStep.type === "accessories_cards" && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {currentStep.options.map(opt => {
                      const IconComp = opt.icon;
                      const isSelected = !!answers.accessories?.[opt.id];
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleAccessory(opt.id)}
                          className={`relative rounded-2xl border-2 p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[135px] ${
                            isSelected
                              ? opt.isBonus
                                ? "border-emerald-500 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-100"
                                : "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          {opt.isBonus && (
                            <span className="absolute top-2 right-2 text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                              +Bonus
                            </span>
                          )}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                            isSelected
                              ? opt.isBonus ? "bg-emerald-600 text-white" : "bg-[#087F8C] text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            <IconComp className="w-7 h-7" />
                          </div>
                          <span className={`text-xs font-bold leading-tight ${
                            isSelected
                              ? opt.isBonus ? "text-emerald-800 font-black" : "text-[#087F8C] font-black"
                              : "text-slate-700"
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Original wireless controller and power cable are essential for console testing at pickup.</span>
                  </div>
                </div>
              )}

              {/* Step 5: Game CDs */}
              {currentStep.type === "cds_selector" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentStep.options.map(opt => {
                    const isSelected = answers.gameCds === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, gameCds: opt.id }))}
                        className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-black ${isSelected ? "text-[#087F8C]" : "text-slate-900"}`}>
                            {opt.label}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          opt.bonus !== "0%" ? "bg-emerald-100 text-emerald-700 font-black" : "bg-slate-100 text-slate-500"
                        }`}>
                          {opt.bonus}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Continue Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
                    isCurrentStepValid()
                      ? "btn-gradient text-white shadow-lg shadow-[#087F8C]/25 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>{stepIndex === STEPS.length - 1 ? "Get Final Quote" : "Continue"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar: Evaluation Summary & Live Recalculated Valuation */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                {device.imageUrl && (
                  <img src={device.imageUrl} alt={device.modelName} className="w-12 h-12 object-contain" />
                )}
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{device.modelName}</h3>
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
                    ₹{basePrice.toLocaleString("en-IN")}
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

              {/* Answers Summary */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Power On:</span>
                  <span className="font-bold text-slate-700 capitalize">{answers.powerOn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Chassis:</span>
                  <span className="font-bold text-slate-700 capitalize">{answers.bodyCondition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Issues:</span>
                  <span className="font-bold text-slate-700">
                    {answers.functionalIssues?.length > 0 ? `${answers.functionalIssues.length} issue(s)` : "None"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Game CDs:</span>
                  <span className="font-bold text-slate-700">{answers.gameCds} Disc(s)</span>
                </div>
              </div>

              {/* Trust Guarantees */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-semibold">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center mb-2">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5">
                    <Lock size={12} className="text-[#087F8C]" />
                    Exact Valuation Locked until mobile OTP verification
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#087F8C]" />
                  <span>Free Doorstep Evaluation & Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#087F8C]" />
                  <span>Instant UPI / Cash on Handover</span>
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
        deviceName={device?.modelName || 'Console'}
      />
    </div>
  );
}
