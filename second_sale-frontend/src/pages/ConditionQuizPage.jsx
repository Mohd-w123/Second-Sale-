import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculatePrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import { isSpecialModel } from '../utils/specialModels';
import Loader from '../components/ui/Loader';
import NoIndexSEO from '../components/seo/NoIndexSEO';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// --- Icons & Assets ---
const IconTrend = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const ALL_STEPS = [
  { id: 'warranty', label: 'Age & Warranty' },
  { id: 'screen', label: 'General & Screen' },
  { id: 'physical', label: 'Physical Issues' },
  { id: 'technical', label: 'Technical Issues' },
  { id: 'accessories', label: 'Accessories' }
];

const ALL_ACCESSORIES = [
  { id: 'Bill', label: 'GST Valid Bill', desc: 'Valid GST invoice with matching IMEI', icon: '📄' },
  { id: 'Box', label: 'Original Box', desc: 'Original purchase box', icon: '📦' },
  { id: 'Charger', label: 'Original Charger', desc: 'Original charging adapter & cable', icon: '🔌' }
];

const AGE_OPTIONS = [
  '0 - 3 Months', '3 - 6 Months', '6 - 11 Months', 'Above 11 Months'
];

// Physical Issues Defect Options (Matching DeviceKart)
const PHYSICAL_DEFECT_OPTIONS = [
  {
    id: 'screen_scratch_broken',
    label: 'Broken/scratch on device screen',
    desc: 'Screen glass is cracked, scratched or chipped',
    icon: '📱',
  },
  {
    id: 'dead_spots_lines',
    label: 'Dead Spot/Visible line and Discoloration on screen',
    desc: 'Spots, colored lines, or visible discoloration on display',
    icon: '🖥️',
  },
  {
    id: 'body_scratches_dents',
    label: 'Scratch/Dent on device body',
    desc: 'Noticeable scratches, scuffs or dents on outer chassis',
    icon: '🔨',
  },
  {
    id: 'panel_missing_broken',
    label: 'Device panel missing/broken',
    desc: 'Side or back panel missing or heavily cracked',
    icon: '🧩',
  },
  {
    id: 'camera_glass_broken',
    label: 'Camera Glass Broken',
    desc: 'Camera lens glass is cracked or broken',
    icon: '📷',
  },
];

// Conditional Screen Scratch / Crack Depth (Matching DeviceKart)
const SCREEN_SCRATCH_OPTIONS = [
  { id: 'screen_scratches_minor', label: '1-2 scratches on screen', desc: 'Minor hairline scratches only' },
  { id: 'screen_scratches_major', label: 'More than 2 scratches on screen', desc: 'Multiple visible scratches' },
  { id: 'screen_cracked', label: 'Screen cracked/ glass broken', desc: 'Cracked glass on display area' },
  { id: 'screen_chipped', label: 'Chipped/cracked outside display area', desc: 'Chipped edge glass or corner' },
];

// Side / Back Panel Condition (Matching DeviceKart)
const PANEL_OPTIONS = [
  { id: 'no_defect', label: 'No defect on side or back panel', desc: 'Normal wear or pristine condition' },
  { id: 'panel_cracked', label: 'Cracked/ broken side or back panel', desc: 'Cracked back glass or chassis' },
  { id: 'panel_missing', label: 'Missing side or back panel', desc: 'Panel detached or missing' },
];

// Bent / Loose Screen (Matching DeviceKart)
const BEND_OPTIONS = [
  { id: 'not_bent', label: 'Phone not bent', desc: 'Body and frame are completely straight' },
  { id: 'loose_screen', label: 'Loose screen (Gap in screen and body)', desc: 'Screen lifting or adhesive gap' },
  { id: 'bent_curved', label: 'Bent/ curved panel', desc: 'Visible curvature or bent chassis' },
];

// 16 Technical Hardware Issues (Matching DeviceKart)
const TECHNICAL_ISSUES = [
  { id: 'battery_service', label: 'Battery Faulty', icon: '🔋' },
  { id: 'front_camera', label: 'Front Camera not working', icon: '📸' },
  { id: 'back_camera', label: 'Back Camera not working', icon: '📷' },
  { id: 'volume_button', label: 'Volume Button not working', icon: '🔘' },
  { id: 'wifi_issue', label: 'WiFi not working', icon: '📶' },
  { id: 'finger_touch', label: 'Finger Touch not working', icon: '☝️' },
  { id: 'face_unlock', label: 'Face Sensor not working', icon: '👤' },
  { id: 'speaker_faulty', label: 'Speaker Faulty', icon: '🔊' },
  { id: 'power_button', label: 'Power Button not working', icon: '🔌' },
  { id: 'charging_port', label: 'Charging Port not working', icon: '⚡' },
  { id: 'audio_receiver', label: 'Audio Receiver not working', icon: '📞' },
  { id: 'bluetooth', label: 'Bluetooth not working', icon: '🦷' },
  { id: 'vibrator', label: 'Vibrator is not working', icon: '📳' },
  { id: 'microphone', label: 'Microphone not working', icon: '🎤' },
  { id: 'proximity_sensor', label: 'Proximity Sensor not working', icon: '📡' },
  { id: 'silent_button', label: 'Silent Button not working', icon: '🔕' },
];

const supportsESIM = (modelName) => {
  if (!modelName) return false;
  const name = modelName.toLowerCase();
  const allowed = [
    'iphone 13 pro', 'iphone 13 pro max',
    'iphone 14 pro', 'iphone 14 pro max',
    'iphone 15 pro', 'iphone 15 pro max',
    'iphone 16 pro', 'iphone 16 pro max',
    'iphone 17', 'iphone 17 air',
    'iphone 17 pro', 'iphone 17 pro max',
  ];
  return allowed.some(pattern => name.includes(pattern));
};

export default function ConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storage = searchParams.get('storage');
  const { updateQuote } = useQuote();
  const { isAuthenticated, user, sendOtp, verifyOtp } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Derived: special models skip Age/Warranty step and Bill accessory
  const special = device ? isSpecialModel(device.brand, device.modelName) : false;
  const STEPS = special ? ALL_STEPS.filter(s => s.id !== 'warranty') : ALL_STEPS;
  const ACCESSORIES = special ? ALL_ACCESSORIES.filter(a => a.id !== 'Bill') : ALL_ACCESSORIES;
  
  // Step 1: Age & Warranty
  const [deviceAge, setDeviceAge] = useState('3 - 6 Months');
  const [underWarranty, setUnderWarranty] = useState(null);
  const [eSIMSupport, seteSIMSupport] = useState(null); // 'physical+esim' | 'esim_only_global'

  // Step 2: General & Screen
  const [ableToMakeCalls, setAbleToMakeCalls] = useState(null);
  const [isTouchScreenWorking, setIsTouchScreenWorking] = useState(null);
  const [isScreenOriginal, setIsScreenOriginal] = useState(null);

  // Step 3: Physical Issues (Matching DeviceKart)
  const [physicalDefects, setPhysicalDefects] = useState([]);
  const [screenScratchDetail, setScreenScratchDetail] = useState(null);
  const [panelCondition, setPanelCondition] = useState('no_defect');
  const [bendCondition, setBendCondition] = useState('not_bent');

  // Step 4: Technical Issues
  const [technicalIssues, setTechnicalIssues] = useState([]);

  // Step 5: Accessories
  const [selectedAccessories, setSelectedAccessories] = useState(['Bill', 'Box', 'Charger']);

  // Result & Pricing States
  const [showResult, setShowResult] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [breakdown, setBreakdown] = useState(null);

  // Price Gating / OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState(user?.phone || '');
  const [otpCode, setOtpCode] = useState('');
  const [otpSessionId, setOtpSessionId] = useState(null);
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'otp'
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Special models handling
  useEffect(() => {
    if (device && isSpecialModel(device.brand, device.modelName)) {
      setSelectedAccessories(prev => prev.filter(a => a !== 'Bill'));
      setUnderWarranty(true);
    }
  }, [device]);

  useEffect(() => {
    deviceService.getDevice(slug).then(res => {
      const dev = res.data;
      setDevice(dev);
      setLoading(false);
      const selectedVariant = dev.variants.find(v => v.storage === storage) || dev.variants[0];
      setCurrentPrice(selectedVariant.basePrice);
      
      if (!supportsESIM(dev.modelName)) {
        seteSIMSupport('physical+esim');
      }
    }).catch(() => setLoading(false));
  }, [slug, storage]);

  // Auto-set warranty to "No" for devices older than 11 months
  useEffect(() => {
    if (deviceAge === 'Above 11 Months') {
      setUnderWarranty(false);
    }
  }, [deviceAge]);

  // Consolidate physical issues for price calculator
  const effectivePhysicalIssues = [
    ...physicalDefects.filter(d => d !== 'screen_scratch_broken'),
    ...(physicalDefects.includes('screen_scratch_broken') && screenScratchDetail ? [screenScratchDetail] : []),
    ...(panelCondition && panelCondition !== 'no_defect' ? [panelCondition] : []),
    ...(bendCondition && bendCondition !== 'not_bent' ? [bendCondition] : []),
  ];

  useEffect(() => {
    if (!device) return;
    const variant = device.variants.find(v => v.storage === storage) || device.variants[0];
    
    const result = calculatePrice({
      brand: device.brand,
      modelName: device.modelName,
      basePrice: variant.basePrice,
      deviceAge,
      ableToMakeCalls: ableToMakeCalls ?? true,
      isTouchScreenWorking: isTouchScreenWorking ?? true,
      isScreenOriginal: isScreenOriginal ?? true,
      underWarranty: underWarranty ?? true,
      hasGSTBill: selectedAccessories.includes('Bill'),
      eSIMSupport,
      physicalIssues: effectivePhysicalIssues,
      technicalIssues,
      hasCharger: selectedAccessories.includes('Charger'),
      hasBox: selectedAccessories.includes('Box'),
    });

    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 400);
    setCurrentPrice(result.finalPrice);
    setBreakdown(result);
  }, [
    device, 
    deviceAge, 
    ableToMakeCalls, 
    isTouchScreenWorking, 
    isScreenOriginal, 
    underWarranty, 
    eSIMSupport, 
    physicalDefects,
    screenScratchDetail,
    panelCondition,
    bendCondition,
    technicalIssues, 
    selectedAccessories
  ]);

  const finalizeAndShowResult = () => {
    updateQuote({
      device: { 
        brand: device.brand, 
        modelName: device.modelName, 
        slug: device.slug,
        category: 'mobile',
        imageUrl: device.imageUrl || '',
        storage: storage || device.variants[0].storage,
        deviceAge,
        ableToMakeCalls,
        isTouchScreenWorking,
        isScreenOriginal,
        underWarranty,
        hasGSTBill: selectedAccessories.includes('Bill'),
        eSIMSupport,
        physicalIssues: effectivePhysicalIssues,
        technicalIssues,
        accessories: selectedAccessories,
      },
      priceBreakdown: breakdown,
    });
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when user completes the 5th step and clicks GET BEST PRICE
  const handleGetBestPrice = () => {
    if (isAuthenticated) {
      finalizeAndShowResult();
    } else {
      setOtpStep('phone');
      setOtpError('');
      setShowOtpModal(true);
    }
  };

  // OTP Handlers
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = otpPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setOtpError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      const data = await sendOtp(cleanPhone);
      setOtpSessionId(data?.sessionId || 'test_session');
      setOtpStep('otp');
    } catch (err) {
      setOtpError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setOtpError('Please enter the verification code sent to your phone');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      const cleanPhone = otpPhone.replace(/\D/g, '').slice(-10);
      await verifyOtp(cleanPhone, otpCode, otpSessionId);
      setShowOtpModal(false);
      finalizeAndShowResult();
    } catch (err) {
      setOtpError(err?.response?.data?.message || 'Invalid or expired OTP. Please check and try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSchedulePickup = () => {
    if (!isAuthenticated) {
      navigate('/login?returnUrl=/schedule-pickup');
    } else {
      navigate('/schedule-pickup');
    }
  };

  if (loading) return <Loader />;
  if (!device) return <div className="text-center py-20 text-gray-500">Device not found</div>;

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Progress */}
          <div className="flex items-center justify-end gap-12 mb-10 text-sm font-bold">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center">1</span>
              <span className="text-[#111827]">Payment</span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">2</span>
              <span className="text-gray-500">Pickup</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Offer Card */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-12 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-10">
                  <div className="w-40 h-40 bg-gray-50 rounded-[32px] flex items-center justify-center p-6 shrink-0">
                    <img 
                      src={device.imageUrl || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"} 
                      alt={device.modelName}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[#2563EB] text-sm font-black uppercase tracking-wider mb-2 block">Offer ready — instant payout</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-4">
                      {device.modelName} ({storage || device.variants[0].storage})
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
                      <span className="text-5xl font-black text-[#111827]">{formatCurrency(currentPrice)}</span>
                      <div className="flex items-center gap-1.5 bg-[#E6F4FF] text-[#2563EB] px-3 py-1.5 rounded-xl border border-[#2563EB]/10">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        <span className="text-xs font-black uppercase tracking-wider">Guaranteed</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowResult(false)}
                      className="text-[#2563EB] font-black text-sm underline underline-offset-8 hover:text-[#1D4ED8] transition-all"
                    >
                      Recalculate / Retake Quiz
                    </button>
                  </div>
                </div>

                <div className="mt-12 space-y-4 pt-10 border-t border-gray-50">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-all" />
                      <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-[#111827] transition-colors">
                      I agree to the terms of service and certify that I am the legal owner of this device with valid identity proof.
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown Details */}
              {breakdown && (
                <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="font-bold text-[#111827] text-lg mb-6">Valuation Summary Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Original Base Value</span>
                      <span className="font-bold text-gray-900">{formatCurrency(breakdown.basePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Condition & Component Deductions</span>
                      <span className="font-bold text-rose-600">-{breakdown.totalDeductionPct}%</span>
                    </div>
                    <div className="flex justify-between items-center text-base py-3 font-black text-gray-900">
                      <span>Final Net Payout</span>
                      <span className="text-2xl text-[#2563EB]">{formatCurrency(breakdown.finalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: CTA */}
            <div className="w-full lg:w-[380px] space-y-6">
              <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6 sticky top-10">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                  <p className="text-xs font-bold leading-relaxed">
                    Doorstep technician inspection & instant bank transfer at your address.
                  </p>
                </div>

                <button
                  onClick={handleSchedulePickup}
                  className="w-full py-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-base rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                >
                  <span>Schedule Free Pickup</span>
                  <ArrowRight size={18} />
                </button>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <ShieldCheck size={16} className="text-[#2563EB]" />
                    <span>100% Secure & Certified Data Sanitization</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Zap size={16} className="text-amber-500" />
                    <span>Instant UPI / Bank Account Credit on Doorstep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ VIEW ---
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 sm:px-8">
      <NoIndexSEO title="Device Condition Quiz" path={`/sell-old-mobile-phones/${brand}/${slug}/quiz`} />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Quiz Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            
            {/* Device Header */}
            <div className="p-8 flex items-center gap-6 border-b border-gray-50">
              <div className="w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2 shrink-0">
                <img src={device.imageUrl || 'https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg'} alt={device.modelName} className="h-full object-contain" />
              </div>
              <div>
                <p className="text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-1">Evaluating</p>
                <h1 className="text-2xl font-black text-[#111827]">
                  {device.modelName} <span className="text-gray-400 font-medium">({storage || device.variants[0].storage})</span>
                </h1>
              </div>
            </div>

            {/* Stepper progress (Matching DeviceKart) */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-50">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                {STEPS.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${idx === currentStepIndex ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                    {idx < STEPS.length - 1 && <span className="text-gray-300 text-xs font-bold">&gt;</span>}
                  </div>
                ))}
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563EB] transition-all duration-500" 
                  style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions Area */}
            <div className="p-8 sm:p-10 min-h-[420px] flex flex-col justify-between">
              <div>
                {/* ─── STEP 1: Age & Warranty ─── */}
                {STEPS[currentStepIndex]?.id === 'warranty' && (
                  <div className="space-y-10">
                    {/* Q1: Age */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">1. How old is your device?</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {AGE_OPTIONS.map(age => (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setDeviceAge(age)}
                            className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                              ${deviceAge === age 
                                ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2: Warranty */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">2. Is your device under manufacturer warranty?</h3>
                      {deviceAge === 'Above 11 Months' && (
                        <p className="text-xs text-amber-500 font-semibold -mt-2">Warranty is automatically set to No for devices older than 11 months.</p>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => { if (deviceAge !== 'Above 11 Months') setUnderWarranty(true); }}
                          disabled={deviceAge === 'Above 11 Months'}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${underWarranty === true 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
                            ${deviceAge === 'Above 11 Months' ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnderWarranty(false)}
                          disabled={deviceAge === 'Above 11 Months'}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${underWarranty === false 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
                            ${deviceAge === 'Above 11 Months' ? 'cursor-not-allowed' : ''}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Q3: eSIM Support (Conditional) */}
                    {supportsESIM(device?.modelName) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#111827]">3. How many eSIMs does your device support?</h3>
                        <p className="text-xs text-gray-400 -mt-2 font-medium">Choose what applies to your device variant</p>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => seteSIMSupport('physical+esim')}
                            className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                              ${eSIMSupport === 'physical+esim' 
                                ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                          >
                            Physical SIM + eSIM
                          </button>
                          <button
                            type="button"
                            onClick={() => seteSIMSupport('esim_only_global')}
                            className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                              ${eSIMSupport === 'esim_only_global' 
                                ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                          >
                            Single eSIM / Dual eSIM (Global/US variant)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 2: General & Screen ─── */}
                {STEPS[currentStepIndex]?.id === 'screen' && (
                  <div className="space-y-10">
                    {/* Q1: Calls */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">1. Are you able to make and receive calls?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAbleToMakeCalls(true)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${ableToMakeCalls === true 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setAbleToMakeCalls(false)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${ableToMakeCalls === false 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          No (Dead)
                        </button>
                      </div>
                    </div>

                    {/* Q2: Touch Screen */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">2. Is your device's touch screen working properly?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setIsTouchScreenWorking(true)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${isTouchScreenWorking === true 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsTouchScreenWorking(false)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${isTouchScreenWorking === false 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Q3: Original Screen */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">3. Is your phone's screen original?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setIsScreenOriginal(true)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${isScreenOriginal === true 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsScreenOriginal(false)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all
                            ${isScreenOriginal === false 
                              ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          No (Copy Screen)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: Physical Issues (Matching DeviceKart) ─── */}
                {STEPS[currentStepIndex]?.id === 'physical' && (
                  <div className="space-y-8">
                    {/* Section 1: Multi-select Defects */}
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">Select screen / body defects (if any)</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Select all that apply, or leave unselected if none</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
                        {PHYSICAL_DEFECT_OPTIONS.map(defect => {
                          const isSelected = physicalDefects.includes(defect.id);
                          return (
                            <button
                              key={defect.id}
                              type="button"
                              onClick={() => {
                                setPhysicalDefects(prev => 
                                  prev.includes(defect.id) 
                                    ? prev.filter(x => x !== defect.id) 
                                    : [...prev, defect.id]
                                );
                              }}
                              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[110px] ${
                                isSelected 
                                  ? 'border-[#2563EB] bg-[#E6F4FF]' 
                                  : 'border-gray-100 bg-white hover:border-gray-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className="text-xl">{defect.icon}</span>
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                                  isSelected ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-gray-300'
                                }`}>
                                  {isSelected && '✓'}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className={`font-bold text-xs ${isSelected ? 'text-[#2563EB]' : 'text-[#111827]'}`}>
                                  {defect.label}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{defect.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Conditional Screen Scratch Detail */}
                    {physicalDefects.includes('screen_scratch_broken') && (
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-[#2563EB]" />
                          <h4 className="text-sm font-bold text-[#111827]">How severe is the screen scratch or crack?</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {SCREEN_SCRATCH_OPTIONS.map(opt => {
                            const isSelected = screenScratchDetail === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setScreenScratchDetail(opt.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'border-[#2563EB] bg-white text-[#2563EB] shadow-xs'
                                    : 'border-blue-100 bg-white/70 text-slate-700 hover:bg-white'
                                }`}
                              >
                                <p className="text-xs font-bold">{opt.label}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section 3: Side / Back Panel Condition (Required) */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-bold text-[#111827]">Side or Back Panel Condition</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {PANEL_OPTIONS.map(opt => {
                          const isSelected = panelCondition === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setPanelCondition(opt.id)}
                              className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]'
                                  : 'border-gray-100 bg-white text-slate-700 hover:border-gray-200'
                              }`}
                            >
                              <p className="text-xs font-bold">{opt.label}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 4: Bent / Loose Screen (Required) */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-bold text-[#111827]">Is Phone Bent or Loose Screen?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {BEND_OPTIONS.map(opt => {
                          const isSelected = bendCondition === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setBendCondition(opt.id)}
                              className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]'
                                  : 'border-gray-100 bg-white text-slate-700 hover:border-gray-200'
                              }`}
                            >
                              <p className="text-xs font-bold">{opt.label}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 4: Technical Issues (All 16 Options) ─── */}
                {STEPS[currentStepIndex]?.id === 'technical' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">Select technical/hardware issues (if any)</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Leave unselected if none apply to your phone</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 max-h-[420px] overflow-y-auto pr-2 no-scrollbar">
                      {TECHNICAL_ISSUES.map(issue => {
                        const selected = technicalIssues.includes(issue.id);
                        return (
                          <button
                            key={issue.id}
                            type="button"
                            onClick={() => {
                              setTechnicalIssues(prev => 
                                prev.includes(issue.id) ? prev.filter(i => i !== issue.id) : [...prev, issue.id]
                              );
                            }}
                            className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 min-h-[96px]
                              ${selected 
                                ? 'border-[#2563EB] bg-[#E6F4FF] text-[#2563EB]' 
                                : 'border-gray-50 bg-white text-gray-600 hover:border-gray-200'}`}
                          >
                            <span className="text-2xl">{issue.icon}</span>
                            <span className="text-[11px] font-bold leading-tight">{issue.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP 5: Accessories ─── */}
                {STEPS[currentStepIndex]?.id === 'accessories' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">Which original accessories do you have?</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Deductions apply if unchecked</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {ACCESSORIES.map(acc => {
                        const selected = selectedAccessories.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              setSelectedAccessories(prev => 
                                prev.includes(acc.id) ? prev.filter(a => a !== acc.id) : [...prev, acc.id]
                              );
                            }}
                            className={`p-6 rounded-[24px] border-2 text-left transition-all flex flex-col justify-between h-40 group
                              ${selected 
                                ? 'border-[#2563EB] bg-[#E6F4FF]' 
                                : 'border-gray-100 bg-white hover:border-gray-200'}`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className="text-2xl">{acc.icon}</span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${selected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-200'}`}>
                                {selected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>}
                              </div>
                            </div>
                            <div>
                              <p className={`font-black text-sm ${selected ? 'text-[#2563EB]' : 'text-[#111827]'}`}>{acc.label}</p>
                              <p className="text-xs text-gray-400 mt-1">{acc.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Stepper buttons row */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentStepIndex === 0}
                  className="px-8 py-4 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  ← Back
                </button>
                
                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    disabled={
                      (STEPS[currentStepIndex]?.id === 'warranty' && (underWarranty === null || eSIMSupport === null)) ||
                      (STEPS[currentStepIndex]?.id === 'screen' && (
                        ableToMakeCalls === null || 
                        isTouchScreenWorking === null || 
                        isScreenOriginal === null
                      )) ||
                      (STEPS[currentStepIndex]?.id === 'physical' && (
                        (physicalDefects.includes('screen_scratch_broken') && !screenScratchDetail) ||
                        !panelCondition ||
                        !bendCondition
                      ))
                    }
                    className="bg-[#2563EB] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#1D4ED8] transition-all disabled:opacity-50"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGetBestPrice}
                    className="bg-[#16A34A] text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-green-100 hover:bg-[#15803D] transition-all flex items-center gap-2"
                  >
                    GET BEST PRICE <span className="text-lg">›</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Evaluation (PRICE GATED) */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 sticky top-10">
            <h2 className="text-2xl font-black text-[#111827] mb-6">Device Evaluation</h2>
            
            {/* Summary List */}
            <div className="space-y-5">
              {!special && <SummaryItem label="Device Age" value={deviceAge} active />}
              {!special && (
                <SummaryItem 
                  label="Warranty" 
                  value={underWarranty === null ? 'Not answered' : (underWarranty ? 'Under Warranty' : 'Out of Warranty')} 
                  active={underWarranty !== null} 
                />
              )}
              {supportsESIM(device?.modelName) && (
                <SummaryItem 
                  label="eSIM Support" 
                  value={eSIMSupport === null ? 'Not answered' : (eSIMSupport === 'esim_only_global' ? 'Dual eSIM / Global' : 'Physical + eSIM')} 
                  active={eSIMSupport !== null} 
                />
              )}
              <SummaryItem 
                label="General & Screen" 
                value={ableToMakeCalls === null ? 'Not answered' : `Calls: ${ableToMakeCalls ? 'Yes' : 'No'}, Touch: ${isTouchScreenWorking ? 'Yes' : 'No'}, Original: ${isScreenOriginal ? 'Yes' : 'No'}`} 
                active={ableToMakeCalls !== null} 
              />
              <SummaryItem 
                label="Physical Condition" 
                value={
                  physicalDefects.length > 0 || panelCondition !== 'no_defect' || bendCondition !== 'not_bent'
                    ? `${physicalDefects.length} defect(s) noted`
                    : 'Clean Condition'
                } 
                active={STEPS.findIndex(s => s.id === 'physical') <= currentStepIndex} 
              />
              <SummaryItem 
                label="Technical Issues" 
                value={technicalIssues.length > 0 ? `${technicalIssues.length} issues selected` : 'All Working'} 
                active={STEPS.findIndex(s => s.id === 'technical') <= currentStepIndex} 
              />
              <SummaryItem 
                label="Accessories" 
                value={selectedAccessories.length > 0 ? selectedAccessories.join(', ') : 'None selected'} 
                active={STEPS.findIndex(s => s.id === 'accessories') <= currentStepIndex} 
              />
            </div>

          </div>
        </div>
      </div>

      {/* ─── PRICE UNLOCK OTP MODAL (Matching DeviceKart Flow) ─── */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative p-8">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
                <Lock size={26} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
                Verification Required
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Unlock Your Valuation Quote
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {otpStep === 'phone' 
                  ? 'Enter your mobile number to receive instant OTP verification and reveal the highest price for your device.'
                  : `Enter the verification code sent to +91 ${otpPhone.slice(-10)}`}
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-bold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {otpStep === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone number"
                      autoFocus
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otpPhone.replace(/\D/g, '').length !== 10}
                  className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-sm rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {otpLoading ? 'Sending Verification Code...' : 'Send OTP to Unlock Price →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4 or 6-digit OTP"
                    autoFocus
                    className="w-full text-center tracking-widest text-2xl py-3 rounded-xl border border-slate-200 font-black text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length < 4}
                  className="w-full py-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-sm rounded-xl transition shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & Reveal Valuation Price ✓'}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpStep('phone')}
                    className="text-slate-400 hover:text-slate-700 font-semibold"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="text-[#2563EB] font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" />
                Your number is 100% safe. Zero spam, guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value, active }) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</h4>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-[#2563EB]' : 'bg-gray-200'}`} />
        <p className={`text-[12px] font-semibold truncate ${active ? 'text-slate-700' : 'text-gray-400'}`}>{value}</p>
      </div>
    </div>
  );
}
