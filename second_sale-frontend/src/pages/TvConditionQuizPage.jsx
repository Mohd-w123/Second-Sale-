import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import { quizService } from "../services/quiz.service";
import { calculateTvPrice } from "../utils/tvPriceCalculator";
import { useQuote } from "../context/QuoteContext";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import Breadcrumb from "../components/ui/Breadcrumb";
import { 
  Tv, Check, ChevronRight, ChevronLeft, ShieldCheck, Zap,
  AlertTriangle, Info, Sparkles, CheckCircle2, RotateCcw, ArrowRight
} from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
import EvaluationOtpModal from "../components/quiz/EvaluationOtpModal";
import {
  SpeakerIcon, WifiSignalIcon, BluetoothIcon, UsbPortIcon, PowerButtonIcon
} from "../components/quiz/QuizIcons";

const STEPS = [
  { id: 'specs', label: 'Specs & Display' },
  { id: 'functional', label: 'Functional Issues' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'age', label: 'TV Age' },
];

export default function TvConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const { updateQuote } = useQuote();
  const { isAuthenticated, user, sendOtp, verifyOtp } = useAuth();

  const [device, setDevice] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Specs & Display
  const [doesTvSwitchOn, setDoesTvSwitchOn] = useState(true);
  const [displayType, setDisplayType] = useState('led');
  const [smartTv, setSmartTv] = useState('smart_android');
  const [resolution, setResolution] = useState('4k');
  const [screenCondition, setScreenCondition] = useState('flawless');
  const [physicalCondition, setPhysicalCondition] = useState('flawless');

  // Step 2: Functional Defects
  const [functionalDefects, setFunctionalDefects] = useState([]);

  // Step 3: Accessories & Documents
  const [accessories, setAccessories] = useState(['remote', 'power_cable', 'stand', 'box', 'bill']);

  // Step 4: TV Age
  const [tvAge, setTvAge] = useState('1_to_3_years');

  // Final Offer Result View
  const [showResult, setShowResult] = useState(false);

  // Modals
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "";

  // Load device details & quiz config
  useEffect(() => {
    let isMounted = true;
    deviceService.getDevice(slug)
      .then(res => {
        if (!isMounted) return;
        setDevice(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    quizService.getQuizByCategory('tv')
      .then(res => {
        if (isMounted && res?.data?.quiz) {
          setQuizConfig(res.data.quiz);
        }
      })
      .catch(err => console.error('Failed to load TV quiz config:', err));

    return () => { isMounted = false; };
  }, [slug]);

  const selectedVariant = device?.variants?.[0];
  const basePrice = selectedVariant?.basePrice || 18000;

  // Real-time valuation
  const effectiveQuiz = (device?.hasCustomQuiz && device?.customQuiz?.steps?.length > 0)
    ? device.customQuiz
    : quizConfig;

  const quoteResult = device ? calculateTvPrice({
    basePrice,
    device,
    doesTvSwitchOn,
    displayType,
    smartTv,
    resolution,
    screenCondition,
    physicalCondition,
    functionalDefects,
    accessories,
    tvAge,
    quizConfig: effectiveQuiz,
  }) : null;

  const currentPrice = quoteResult?.finalPrice ?? 0;

  const toggleFunctionalDefect = (id) => {
    setFunctionalDefects(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAccessory = (id) => {
    setAccessories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const buildAndSaveQuote = () => {
    const effectiveFinalPrice = quoteResult?.finalPrice ?? currentPrice ?? 0;
    const effectiveBasePrice = quoteResult?.basePrice ?? basePrice ?? effectiveFinalPrice;

    const payload = {
      device: {
        _id: device._id,
        id: device._id,
        modelName: device.modelName,
        name: device.modelName,
        brand: device.brand,
        imageUrl: device.imageUrl,
        image: device.imageUrl,
        category: 'tv',
        storage: selectedVariant?.storage || `${device.screenSize || 'Standard'}`,
        basePrice: effectiveBasePrice,
        screenSize: device.screenSize,
        condition: physicalCondition,
        screenCondition: screenCondition,
        functionalIssues: functionalDefects,
        accessories: accessories,
      },
      price: effectiveFinalPrice,
      finalPrice: effectiveFinalPrice,
      priceBreakdown: {
        basePrice: effectiveBasePrice,
        finalPrice: effectiveFinalPrice,
        totalDeductionPct: quoteResult?.totalDeductionPct ?? 0,
        breakdown: quoteResult?.breakdown ?? {},
      },
      answers: {
        doesTvSwitchOn,
        displayType,
        smartTv,
        resolution,
        screenCondition,
        physicalCondition,
        functionalDefects,
        accessories,
        tvAge,
      },
    };

    updateQuote(payload);
    try {
      localStorage.setItem('secondsale_quote', JSON.stringify(payload));
    } catch {
      // ignore
    }
    return payload;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalizeQuote();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalizeQuote = () => {
    buildAndSaveQuote();
    setShowOtpModal(true);
  };

  const proceedToSchedule = () => {
    buildAndSaveQuote();
    if (isAuthenticated) {
      navigate('/schedule-pickup');
    } else {
      setShowOtpModal(true);
    }
  };

  const handleOtpSuccess = () => {
    buildAndSaveQuote();
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loader />;
  if (!device) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <Tv size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Television Not Found</h2>
        <Link to="/sell-tv/brand" className="text-[#087F8C] font-bold underline">
          Select another TV
        </Link>
      </div>
    );
  }

  // --- RESULT VIEW (Offer Unlocked after OTP) ---
  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <SEOHead
          title={`Final Buyback Offer: ${device.modelName} — ${formatCurrency(currentPrice)} | SecondSale`}
          description={`Guaranteed cash quote for your ${device.modelName}. Free doorstep unmounting and instant payout.`}
        />

        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#E8F6F7] text-[#087F8C] flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>

          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#087F8C] bg-[#E8F6F7] border border-[#087F8C]/20 px-3 py-1 rounded-full mb-2">
            Final Buyback Offer
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {device.modelName}
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {brandName} • {device.screenSize || 'Television'}
          </p>

          <div className="my-6 py-6 bg-slate-50 rounded-3xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Guaranteed Pickup Amount
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#116466] tracking-tight">
              {formatCurrency(currentPrice)}
            </div>
            <p className="text-xs text-[#087F8C] font-semibold mt-1">
              Inclusive of on-spot payment & doorstep unmounting
            </p>
            {Object.keys(quoteResult?.breakdown || {}).length > 0 && (
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

          {/* Value Props & Free Unmounting Banner */}
          <div className="bg-[#E8F6F7] border border-[#087F8C]/20 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-slate-900">Free Wall Unmounting & Transport</h5>
              <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                Our certified technician will safely unmount your TV from any wall bracket and pack it with protective foam at no extra charge.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={proceedToSchedule}
              className="w-full py-4 sm:py-5 btn-gradient text-white font-black rounded-2xl text-base sm:text-lg shadow-xl shadow-[#087F8C]/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Schedule Free Pickup & Payment</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResult(false);
                setCurrentStep(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2 cursor-pointer"
            >
              <RotateCcw size={14} />
              Re-calculate / Retake Quiz
            </button>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 text-left">Your Device Evaluation Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-left text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Power Status</span>
              <span className="font-bold text-slate-800">{doesTvSwitchOn ? "Working Normally" : "Does Not Switch On"}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Display Panel</span>
              <span className="font-bold text-slate-800 uppercase">{displayType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Screen Condition</span>
              <span className="font-bold text-slate-800 capitalize">{screenCondition.replace('_', ' ')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Body Condition</span>
              <span className="font-bold text-slate-800 capitalize">{physicalCondition.replace('_', ' ')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Accessories</span>
              <span className="font-bold text-slate-800">{accessories.length} Included</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Age</span>
              <span className="font-bold text-slate-800 capitalize">{tvAge.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Modal in Result view */}
        {showBreakdownModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Valuation Price Breakdown</h3>
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Base Benchmark Price:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(basePrice)}</span>
                </div>
                {Object.entries(quoteResult?.breakdown || {}).map(([k, val]) => (
                  <div key={k} className="flex items-center justify-between text-slate-600">
                    <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                    <span className="font-semibold text-red-600">-{val}%</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Final Buyback Quote:</span>
                  <span className="font-black text-[#087F8C] text-base">{formatCurrency(currentPrice)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Shared Cashify-Style OTP Verification Modal */}
        <EvaluationOtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onSuccess={() => {
            buildAndSaveQuote();
            navigate('/schedule-pickup');
          }}
          deviceName={device?.modelName || "your Television"}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-16">
      <SEOHead
        title={`Evaluation Quiz: ${device.modelName} — Cashify Accurate | SecondSale`}
        description={`Answer a few questions about your ${device.modelName} to get the highest guaranteed cash quote with free doorstep pickup.`}
      />

      <Breadcrumb items={[
        { label: "Home", to: "/" },
        { label: "Sell Old TV", to: "/sell-tv/brand" },
        { label: brandName, to: `/sell-tv/${brand}` },
        { label: device.modelName, to: `/sell-tv/${brand}/${slug}` },
        { label: "Evaluation" },
      ]} />

      {/* Progress Stepper Bar */}
      <div className="mt-6 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((s, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                  isCompleted
                    ? 'bg-[#087F8C] text-white'
                    : isCurrent
                    ? 'btn-gradient text-white ring-4 ring-[#087F8C]/20'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span className={`text-[11px] font-semibold mt-1 hidden sm:block ${
                  isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Quiz Flow (Left) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">

          {/* STEP 1: Specs & Display */}
          {currentStep === 0 && (
            <div className="space-y-7 animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
                  Step 1 of 4 • Device Details
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Tell us a few things about your TV
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Check the mentioned display specifications and physical condition
                </p>
              </div>

              {/* 1. Does TV Switch On */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-900">
                  1. Does the Television switch on and display normally?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: true, label: "Yes", sub: "Powers on & boots to home screen" },
                    { val: false, label: "No", sub: "Dead, does not turn on or blank" }
                  ].map(item => (
                    <button
                      key={String(item.val)}
                      type="button"
                      onClick={() => setDoesTvSwitchOn(item.val)}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        doesTvSwitchOn === item.val
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Display Type */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-900">
                  2. Display Technology
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'led', label: 'LED', sub: 'Standard LED backlight' },
                    { id: 'qled', label: 'QLED', sub: 'Quantum Dot panel' },
                    { id: 'oled', label: 'OLED', sub: 'Self-lit organic pixels' },
                    { id: 'lcd', label: 'LCD', sub: 'Older CCFL display' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDisplayType(item.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        displayType === item.id
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Smart TV */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-900">
                  3. Smart Television Operating System
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'smart_android', label: 'Yes - Android / Google TV', sub: 'Google Play Store & built-in Chromecast' },
                    { id: 'smart_non_android', label: 'Yes - Non Android', sub: 'Samsung Tizen, LG webOS, etc.' },
                    { id: 'non_smart', label: 'No (Standard TV)', sub: 'Requires set-top box or firestick' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSmartTv(item.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        smartTv === item.id
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Resolution */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-900">
                  4. Television Resolution
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: '4k', label: 'Ultra HD 4K', sub: '3840 x 2160' },
                    { id: 'fhd', label: 'Full HD', sub: '1920 x 1080' },
                    { id: 'hd_ready', label: 'HD Ready', sub: '1366 x 768' },
                    { id: '8k', label: 'Ultra HD 8K', sub: '7680 x 4320' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResolution(item.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        resolution === item.id
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Screen Condition */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-900">
                  5. Screen Condition
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'flawless', label: 'Flawless', sub: 'Clean display, zero spots, lines or cracks' },
                    { id: 'lines_dots', label: 'Screen Lines / Dots', sub: '1 or 2 visible lines or color spots' },
                    { id: 'cracked', label: 'Screen Broken / Cracked', sub: 'Cracked glass, black ink bleed, or broken matrix' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setScreenCondition(item.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        screenCondition === item.id
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Physical Condition */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-900">
                  6. Physical Body Condition
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'flawless', label: 'Flawless', sub: 'Pristine bezel and back chassis' },
                    { id: 'scratches', label: 'Scratches on Frame', sub: 'Minor normal wear and scuffs on body' },
                    { id: 'dented_cracked', label: 'Dented / Cracked Body', sub: 'Deep dents, broken back cover or chipped frame' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPhysicalCondition(item.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition ${
                        physicalCondition === item.id
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Functional Defects */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
                  Step 2 of 4 • Functional Condition
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Functional or Hardware Problems
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select any defects your television has. If everything works normally, leave unchecked.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'button_faulty', label: 'Button not working', sub: 'TV physical power/volume buttons loose or faulty', icon: PowerButtonIcon },
                  { id: 'port_faulty', label: 'USB / HDMI Port not working', sub: 'HDMI 1/2 or USB ports not detecting devices', icon: UsbPortIcon },
                  { id: 'speaker_faulty', label: 'Speaker faulty / cracked sound', sub: 'Distorted audio, crackling sound, or no output', icon: SpeakerIcon },
                  { id: 'bluetooth_faulty', label: 'Bluetooth is faulty', sub: 'Cannot connect wireless headphones or soundbar', icon: BluetoothIcon },
                  { id: 'wifi_faulty', label: 'Wi-Fi is faulty', sub: 'Cannot connect to home Wi-Fi network or drops connection', icon: WifiSignalIcon },
                ].map(item => {
                  const Icon = item.icon;
                  const isChecked = functionalDefects.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFunctionalDefect(item.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-start gap-3.5 ${
                        isChecked
                          ? 'border-red-500 bg-red-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        isChecked ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isChecked ? 'text-red-500' : 'text-slate-600'}`} />
                          <span className={`text-sm font-bold ${isChecked ? 'text-red-900' : 'text-slate-900'}`}>
                            {item.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {functionalDefects.length === 0 && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] flex-shrink-0" />
                  <span className="text-xs font-semibold text-blue-900">
                    No functional defects selected. Your TV will qualify for standard flawless functional value!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Accessories & Documents */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
                  Step 3 of 4 • Accessories & Documents
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Do you have the following?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Please select accessories which are available with you for pickup
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'remote', label: 'Original TV Remote Controller', sub: 'Working original remote with all buttons' },
                  { id: 'power_cable', label: 'Power Cable / Cord(s)', sub: 'Original power cable and adapter' },
                  { id: 'stand', label: 'Default Stand (Table Legs/Base)', sub: 'Original TV desk stand base or feet' },
                  { id: 'box', label: 'Box (With Same Serial No)', sub: 'Original packaging box' },
                  { id: 'bill', label: 'Valid Purchase Bill (With Serial No)', sub: 'GST bill or invoice with serial number' },
                ].map(item => {
                  const isChecked = accessories.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleAccessory(item.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-start gap-3.5 ${
                        isChecked
                          ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 opacity-60'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        isChecked ? 'border-[#087F8C] bg-[#087F8C] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <span className={`text-sm font-bold ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                          {item.label}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TV Age & Warranty */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
                  Step 4 of 4 • Television Age
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  What is your Television age?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Please select appropriate age bracket from invoice date
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'less_than_1', label: 'Less than 1 year (in warranty)', sub: 'Device under official manufacturer warranty with valid bill' },
                  { id: '1_to_3_years', label: 'Between 1 - 3 years', sub: 'Device is out of manufacturer warranty' },
                  { id: 'more_than_3_years', label: 'More than 3 years', sub: 'Older model with standard market age deduction' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTvAge(item.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                      tvAge === item.id
                        ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">{item.sub}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      tvAge === item.id ? 'border-[#087F8C] bg-[#087F8C]' : 'border-slate-300'
                    }`}>
                      {tvAge === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl btn-gradient text-white text-sm font-bold shadow-md shadow-[#087F8C]/20 transition flex items-center gap-1.5 active:scale-[0.99] cursor-pointer"
            >
              {currentStep === STEPS.length - 1 ? 'Verify Mobile & Unlock Price' : `Continue to Step ${currentStep + 2}`}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Evaluation Sticky Sidebar (Right) - Cashify Style */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 shrink-0">
                <img src={device.imageUrl} alt={device.modelName} className="max-h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Device Evaluation
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug truncate">
                  {device.modelName}
                </h3>
                <p className="text-xs font-semibold text-[#087F8C] mt-0.5">
                  Get Upto ₹{basePrice.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Evaluation Progress Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Evaluation Progress</span>
                <span className="text-[#087F8C] font-extrabold">{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Step {currentStep + 1} of 4: <span className="text-slate-800 font-bold">{STEPS[currentStep].label}</span>
              </p>
            </div>

            {/* Questions Checklist so far */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Power Status:</span>
                <span className="font-semibold text-slate-900">{doesTvSwitchOn ? 'Working Normally' : 'Does Not Switch On'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Display Tech:</span>
                <span className="font-semibold text-slate-900 uppercase">{displayType}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Resolution:</span>
                <span className="font-semibold text-slate-900 uppercase">{resolution}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Screen Condition:</span>
                <span className="font-semibold text-slate-900 capitalize">{screenCondition.replace('_', ' ')}</span>
              </div>
              {currentStep >= 1 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Defects Count:</span>
                  <span className="font-semibold text-slate-900">{functionalDefects.length} selected</span>
                </div>
              )}
              {currentStep >= 2 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Accessories:</span>
                  <span className="font-semibold text-slate-900">{accessories.length} / 5</span>
                </div>
              )}
              {currentStep >= 3 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>TV Age:</span>
                  <span className="font-semibold text-slate-900 capitalize">{tvAge.replace(/_/g, ' ')}</span>
                </div>
              )}
            </div>

            {/* Exact Quote Locked Banner */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">Exact Valuation Locked</span>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Complete all questions & verify mobile via OTP at Step 4 to unlock your guaranteed instant cash offer.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#087F8C]" />
              Safe Wall-Unmount Guarantee
            </div>
            <p className="leading-relaxed text-[11px]">
              Our certified pickup executives carry professional tools to safely unmount your television from any wall bracket or cabinet at no extra charge.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Valuation Price Breakdown
              </h3>
              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Base Benchmark Price:</span>
                <span className="font-bold text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>

              {Object.entries(quoteResult?.breakdown || {}).map(([k, val]) => (
                <div key={k} className="flex items-center justify-between text-slate-600">
                  <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                  <span className="font-semibold text-red-600">-{val}%</span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900">Final Buyback Quote:</span>
                <span className="font-black text-[#087F8C] text-base">₹{currentPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBreakdownModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Shared Cashify-Style OTP Verification Modal */}
      <EvaluationOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
        deviceName={device?.modelName || "your Television"}
      />
    </div>
  );
}
