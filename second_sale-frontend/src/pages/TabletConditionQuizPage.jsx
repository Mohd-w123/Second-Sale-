import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculatePrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import EvaluationOtpModal from '../components/quiz/EvaluationOtpModal';
import { Lock } from 'lucide-react';

import {
  PhoneScreenScratchesIcon,
  PhoneScreenCrackedIcon,
  PhoneScreenFaultyIcon,
  PhoneScreenDeadIcon,
  PhoneBodyGoodIcon,
  PhoneBodyAverageIcon,
  PhoneBodyBelowAverageIcon,
  BatteryWarningIcon,
  FrontCameraIcon,
  BackCameraIcon,
  VolumeButtonIcon,
  WifiSignalIcon,
  FingerTouchIcon,
  SpeakerIcon,
  PowerButtonIcon,
  ChargingPortIcon,
  BluetoothIcon,
  VibratorIcon,
  MicrophoneIcon,
  ProximitySensorIcon,
  SilentSwitchIcon,
  BillDocumentIcon,
  BoxPackagingIcon,
  ChargerPlugIcon,
} from '../components/quiz/QuizIcons';

// --- Icons & Assets (Matching Cashify) ---
const IconTrend = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

const STEPS = [
  { id: 'screen', label: 'General & Screen' },
  { id: 'screen_issues', label: 'Screen Issues' },
  { id: 'body_condition', label: 'Body Condition' },
  { id: 'technical', label: 'Technical Issues' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'warranty', label: 'Age & Warranty' },
];

const AGE_OPTIONS = [
  '0 - 3 Months', '3 - 6 Months', '6 - 11 Months', 'Above 11 Months'
];

const CASHIFY_SCREEN_ISSUES = [
  {
    id: 'scratches',
    label: 'Scratches On Screen',
    desc: 'Visible scratches on the screen',
    bullets: ['Visible scratches on display glass', 'Touch screen responds normally'],
    icon: PhoneScreenScratchesIcon,
  },
  {
    id: 'cracked',
    label: 'Cracked Screen',
    desc: 'Glass cracked, display works fine',
    bullets: ['Glass cracked or chipped', 'Display works normally'],
    icon: PhoneScreenCrackedIcon,
  },
  {
    id: 'faulty',
    label: 'Faulty Screen',
    desc: '1 or 2 lines or spots, patch of light',
    bullets: ['1 or 2 lines or dead pixels', 'Small patch of light or discoloration'],
    icon: PhoneScreenFaultyIcon,
  },
  {
    id: 'not_usable',
    label: 'Screen Not Usable',
    desc: 'Blank or broken screen, touch not working',
    bullets: ['Blank or broken screen', 'Touch not responding', 'Heavy lines or black ink patch'],
    icon: PhoneScreenDeadIcon,
  },
];

const CASHIFY_BODY_CONDITIONS = [
  {
    id: 'good',
    label: 'Good',
    bullets: ['Minor hairline scratches', 'Light wear and tear', 'No major dents or bent chassis'],
    icon: PhoneBodyGoodIcon,
  },
  {
    id: 'average',
    label: 'Average',
    bullets: ['Visible scratches on body', 'Minor corner scuffs or light dents', 'Normal cosmetic wear'],
    icon: PhoneBodyAverageIcon,
  },
  {
    id: 'below_average',
    label: 'Below Average',
    bullets: ['Deep scratches or paint peeling', 'Multiple dents or cracked chassis', 'Heavy wear and tear'],
    icon: PhoneBodyBelowAverageIcon,
  },
];

const TECHNICAL_ISSUES = [
  { id: 'battery_service', label: 'Battery Warning', icon: BatteryWarningIcon },
  { id: 'front_camera', label: 'Front Camera faulty', icon: FrontCameraIcon },
  { id: 'back_camera', label: 'Back Camera faulty', icon: BackCameraIcon },
  { id: 'volume_button', label: 'Volume button issue', icon: VolumeButtonIcon },
  { id: 'wifi_issue', label: 'Wifi issue', icon: WifiSignalIcon },
  { id: 'finger_touch', label: 'Finger touch / Face ID', icon: FingerTouchIcon },
  { id: 'speaker_faulty', label: 'Speaker faulty', icon: SpeakerIcon },
  { id: 'power_button', label: 'Power button issue', icon: PowerButtonIcon },
  { id: 'charging_port', label: 'Charging port issue', icon: ChargingPortIcon },
  { id: 'audio_receiver', label: 'Audio receiver issue', icon: SpeakerIcon },
  { id: 'bluetooth', label: 'Bluetooth issue', icon: BluetoothIcon },
  { id: 'vibrator', label: 'Vibrator issue', icon: VibratorIcon },
  { id: 'microphone', label: 'Microphone issue', icon: MicrophoneIcon },
  { id: 'proximity_sensor', label: 'Proximity sensor', icon: ProximitySensorIcon }
];

const ALL_ACCESSORIES = [
  { id: 'Bill', label: 'GST Valid Bill', desc: 'Valid GST invoice matching device', icon: BillDocumentIcon },
  { id: 'Box', label: 'Original Box', desc: 'Original purchase box', icon: BoxPackagingIcon },
  { id: 'Charger', label: 'Original Charger', desc: 'Original charging adapter & cable', icon: ChargerPlugIcon }
];

export default function TabletConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storage = searchParams.get('storage');
  const { updateQuote } = useQuote();
  const { isAuthenticated, user } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Selections
  const [deviceAge, setDeviceAge] = useState('3 - 6 Months');
  const [underWarranty, setUnderWarranty] = useState(null);
  const [eSIMSupport, seteSIMSupport] = useState('physical+esim');

  const [ableToMakeCalls, setAbleToMakeCalls] = useState(null);
  const [isTouchScreenWorking, setIsTouchScreenWorking] = useState(null);
  const [isScreenOriginal, setIsScreenOriginal] = useState(null);

  const [screenCondition, setScreenCondition] = useState('none'); // 'none' | 'scratches' | 'cracked' | 'faulty' | 'not_usable'
  const [bodyCondition, setBodyCondition] = useState('good'); // 'good' | 'average' | 'below_average'

  const [physicalIssues, setPhysicalIssues] = useState([]);
  const [technicalIssues, setTechnicalIssues] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState(['Bill', 'Box', 'Charger']);

  const [showResult, setShowResult] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [breakdown, setBreakdown] = useState(null);

  useEffect(() => {
    deviceService.getDevice(slug).then(res => {
      const dev = res.data;
      setDevice(dev);
      setLoading(false);
      const selectedVariant = dev.variants.find(v => v.storage === storage) || dev.variants[0];
      setCurrentPrice(selectedVariant.basePrice);
    }).catch(() => setLoading(false));
  }, [slug, storage]);

  // Auto-set warranty to "No" (with no deduction) for devices older than 11 months
  useEffect(() => {
    if (deviceAge === 'Above 11 Months') {
      setUnderWarranty(false);
    }
  }, [deviceAge]);

  useEffect(() => {
    if (!device) return;
    const variant = device.variants.find(v => v.storage === storage) || device.variants[0];

    // Calculate new price dynamically based on user inputs
    const result = calculatePrice({
      brand: device.brand,
      modelName: device.modelName,
      device,
      basePrice: variant.basePrice,
      deviceAge,
      ableToMakeCalls: ableToMakeCalls ?? true,
      isTouchScreenWorking: isTouchScreenWorking ?? true,
      isScreenOriginal: isScreenOriginal ?? true,
      underWarranty: underWarranty ?? true,
      hasGSTBill: selectedAccessories.includes('Bill'),
      eSIMSupport,
      screenCondition,
      bodyCondition,
      physicalIssues,
      technicalIssues,
      hasCharger: selectedAccessories.includes('Charger'),
      hasBox: selectedAccessories.includes('Box'),
      quizConfig: (device?.hasCustomQuiz && device?.customQuiz?.steps?.length > 0) ? device.customQuiz : null,
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
    screenCondition,
    bodyCondition,
    physicalIssues,
    technicalIssues,
    selectedAccessories
  ]);

  const finalizeAndShowResult = () => {
    updateQuote({
      device: {
        brand: device.brand,
        modelName: device.modelName,
        slug: device.slug,
        category: 'tablet',
        imageUrl: device.imageUrl || '',
        storage: storage || device.variants[0].storage,
        deviceAge,
        ableToMakeCalls,
        isTouchScreenWorking,
        isScreenOriginal,
        underWarranty,
        hasGSTBill: selectedAccessories.includes('Bill'),
        eSIMSupport,
        physicalIssues,
        technicalIssues,
        accessories: selectedAccessories,
      },
      priceBreakdown: breakdown,
    });
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetBestPrice = () => {
    if (underWarranty === null) setUnderWarranty(false);
    setShowOtpModal(true);
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
              <span className="w-8 h-8 rounded-full bg-[#087F8C] text-white flex items-center justify-center">1</span>
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
                  <div className="w-40 h-40 bg-gray-50 rounded-[32px] flex items-center justify-center p-6">
                    <img
                      src={device.imageUrl || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"}
                      alt={device.modelName}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[#087F8C] text-sm font-black uppercase tracking-wider mb-2 block">Offer ready — instant payout</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-4">
                      {device.modelName} ({storage || device.variants[0].storage})
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
                      <span className="text-5xl font-black text-[#111827]">{formatCurrency(currentPrice)}</span>
                      <div className="flex items-center gap-1.5 bg-[#E8F6F7] text-[#087F8C] px-3 py-1.5 rounded-xl border border-[#087F8C]/20">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        <span className="text-xs font-black uppercase tracking-wider">Guaranteed</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowResult(false)}
                      className="text-[#087F8C] font-black text-sm underline underline-offset-8 hover:text-[#066772] transition-all"
                    >
                      Recalculate
                    </button>
                  </div>
                </div>

                <div className="mt-12 space-y-4 pt-10 border-t border-gray-50">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#087F8C] peer-checked:border-[#087F8C] transition-all" />
                      <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-[#111827] transition-colors">
                      Receive updates via Whatsapp (+91 {user?.phone || '9076116803'})
                    </span>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#087F8C] peer-checked:border-[#087F8C] transition-all" />
                      <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-[#111827] transition-colors">
                      I agree to the <span className="text-[#087F8C] font-bold">terms and conditions</span> of the service and understand that the final value of {formatCurrency(currentPrice)} is subject to physical device inspection by our technician at the time of pickup.
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleSchedulePickup}
                  className="w-full mt-10 btn-gradient text-white font-black py-6 rounded-3xl transition-all shadow-xl shadow-[#087F8C]/20 text-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Get My {formatCurrency(currentPrice)} Now
                  <svg className="transition-transform group-hover:translate-x-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>

                <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-[13px] font-bold text-gray-400">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" /> Free doorstep pickup
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" /> Instant payment at pickup
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" /> Price locked for 24h
                  </span>
                </div>
              </div>

              {/* Device Evaluation Summary */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                <h3 className="text-2xl font-black text-[#111827] mb-10">Device Evaluation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <EvaluationRow label="Device Age" value={deviceAge} color="#087F8C" />
                  <EvaluationRow label="Under Warranty" value={underWarranty ? 'Yes' : 'No'} color={underWarranty ? '#087F8C' : '#EF4444'} />
                  <EvaluationRow label="Calls Functional" value={ableToMakeCalls ? 'Yes' : 'No (Dead)'} color={ableToMakeCalls ? '#087F8C' : '#EF4444'} />
                  <EvaluationRow label="Touch Screen working" value={isTouchScreenWorking ? 'Yes' : 'No'} color={isTouchScreenWorking ? '#087F8C' : '#EF4444'} />
                  <EvaluationRow label="Screen Original" value={isScreenOriginal ? 'Yes' : 'No (Copy Screen)'} color={isScreenOriginal ? '#087F8C' : '#EF4444'} />
                  <EvaluationRow label="Screen Condition" value={CASHIFY_SCREEN_ISSUES.find(s => s.id === screenCondition)?.label || 'Flawless (No Defects)'} color="#087F8C" />
                  <EvaluationRow label="Body Condition" value={CASHIFY_BODY_CONDITIONS.find(b => b.id === bodyCondition)?.label || 'Good'} color="#087F8C" />
                  <EvaluationRow label="Technical Issues" value={technicalIssues.length > 0 ? technicalIssues.map(t => TECHNICAL_ISSUES.find(i => i.id === t)?.label || t).join(', ') : 'No Issues'} color={technicalIssues.length > 0 ? '#EF4444' : '#087F8C'} />
                  <EvaluationRow label="Accessories" value={selectedAccessories.join(', ') || 'None'} color="#087F8C" />
                </div>
              </div>
            </div>

            {/* Sidebars */}
            <div className="w-full lg:w-96 space-y-6">
              {/* Payment Summary */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-[#E8F6F7] rounded-xl flex items-center justify-center text-[#087F8C]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                  </div>
                  <h3 className="text-xl font-black text-[#111827]">Payment Summary</h3>
                </div>
                <div className="space-y-6">
                  <PriceRow label="Base Price" value={breakdown?.basePrice} />
                  <PriceRow label="Pickup Fee" value={0} originalValue={100} isFree />
                  <PriceRow label="Processing Fee" value={0} originalValue={100} />
                  <PriceRow label="Promo Code" value={0} isBonus />
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-black text-[#111827]">Final Offer</span>
                    <span className="text-2xl font-black text-[#111827]">{formatCurrency(currentPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Apply Coupon */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#E8F6F7] rounded-xl flex items-center justify-center text-[#087F8C]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 5V7M15 11V13M15 17V19M5 5C3.34315 5 2 6.34315 2 8V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V16C2 17.6569 3.34315 19 5 19H19C20.6569 19 22 17.6569 22 16V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10V8C22 6.34315 20.6569 5 19 5H5Z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">Apply Coupon</h3>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">View exciting offers</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 mb-6">
                  <p className="text-sm font-bold text-gray-500">No coupons available at the moment.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type coupon code here"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
                  />
                  <button className="bg-gray-100 text-gray-400 px-6 py-3.5 rounded-xl font-black text-sm cursor-not-allowed">
                    Apply
                  </button>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#E8F6F7] rounded-xl flex items-center justify-center text-[#087F8C]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" /></svg>
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">Cancellation Policy</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  You can cancel your order anytime before the pickup is completed. Once the device is picked up and verified, the order cannot be cancelled. For any help, reach out to our support team.
                </p>
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
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT COLUMN: Quiz Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

            {/* Device Header */}
            <div className="p-8 flex items-center gap-6 border-b border-gray-50">
              <div className="w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                <img src={device.imageUrl || 'https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg'} alt={device.modelName} className="h-full object-contain" />
              </div>
              <div>
                <p className="text-[#087F8C] text-xs font-bold uppercase tracking-wider mb-1">Evaluating</p>
                <h1 className="text-2xl font-black text-[#111827]">
                  {device.modelName} <span className="text-gray-400 font-medium">({storage || device.variants[0].storage})</span>
                </h1>
              </div>
            </div>

            {/* Stepper progress */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-50">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                {STEPS.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${idx === currentStepIndex ? 'text-[#087F8C]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                    {idx < STEPS.length - 1 && <span className="text-gray-300 text-xs font-bold">&gt;</span>}
                  </div>
                ))}
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions Area */}
            <div className="p-8 sm:p-10 min-h-[420px] flex flex-col justify-between">
              <div>
                {/* ─── STEP 1: General & Calls ─── */}
                {STEPS[currentStepIndex]?.id === 'screen' && (
                  <div className="space-y-10">
                    {/* Q1: Calls */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">1. Are you able to make and receive calls / connect online?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAbleToMakeCalls(true)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${ableToMakeCalls === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setAbleToMakeCalls(false)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${ableToMakeCalls === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          No (Dead)
                        </button>
                      </div>
                    </div>

                    {/* Q2: Touch Screen */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">2. Is your tablet's touch screen working properly?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setIsTouchScreenWorking(true)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${isTouchScreenWorking === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsTouchScreenWorking(false)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${isTouchScreenWorking === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Q3: Original Screen */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">3. Is your tablet's screen original?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setIsScreenOriginal(true)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${isScreenOriginal === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsScreenOriginal(false)}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${isScreenOriginal === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                        >
                          No (Copy Screen)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 2: Screen Issues (Cashify Layout) ─── */}
                {STEPS[currentStepIndex]?.id === 'screen_issues' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Screen Issues</h3>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        Cracks, scratches, touch problems, lines, spots, dead pixels.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {CASHIFY_SCREEN_ISSUES.map(item => {
                        const IconComponent = item.icon;
                        const isSelected = screenCondition === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setScreenCondition(isSelected ? 'none' : item.id)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[220px] cursor-pointer ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-sm'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                          >
                            <div className="w-full flex justify-center py-2">
                              <IconComponent className="w-16 h-20" isTablet={true} />
                            </div>
                            <div className="mt-4">
                              <h4 className={`font-black text-sm ${isSelected ? 'text-[#087F8C]' : 'text-gray-900'}`}>
                                {item.label}
                              </h4>
                              <ul className="mt-2 space-y-1">
                                {item.bullets.map((bullet, idx) => (
                                  <li key={idx} className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setScreenCondition('none')}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                          screenCondition === 'none'
                            ? 'bg-[#E8F6F7] text-[#087F8C] border border-[#087F8C]/20'
                            : 'text-gray-500 hover:text-gray-700 underline'
                        }`}
                      >
                        ✓ My screen is flawless with no defects
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: Body Condition (Cashify Layout) ─── */}
                {STEPS[currentStepIndex]?.id === 'body_condition' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Body Condition</h3>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        Dents, deep scratches, loose frame, heavy wear.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {CASHIFY_BODY_CONDITIONS.map(item => {
                        const IconComponent = item.icon;
                        const isSelected = bodyCondition === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setBodyCondition(item.id)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[220px] cursor-pointer ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-sm'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                          >
                            <div className="w-full flex justify-center py-2">
                              <IconComponent className="w-16 h-20" isTablet={true} />
                            </div>
                            <div className="mt-4">
                              <h4 className={`font-black text-base ${isSelected ? 'text-[#087F8C]' : 'text-gray-900'}`}>
                                {item.label}
                              </h4>
                              <ul className="mt-2 space-y-1">
                                {item.bullets.map((bullet, idx) => (
                                  <li key={idx} className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP 4: Technical Issues (Dedicated SVGs) ─── */}
                {STEPS[currentStepIndex]?.id === 'technical' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Select technical/hardware issues (if any)</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">LEAVE UNSELECTED IF NONE APPLY</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[440px] overflow-y-auto pr-2 no-scrollbar">
                      {TECHNICAL_ISSUES.map(issue => {
                        const IconComponent = issue.icon;
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
                            className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-3 min-h-[110px] cursor-pointer
                              ${selected
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] shadow-xs'
                                : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                          >
                            <div className={`p-2.5 rounded-xl ${selected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                              <IconComponent className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-bold leading-tight">{issue.label}</span>
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
                      <h3 className="text-xl font-black text-[#111827]">Which original accessories do you have?</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Deductions apply if unchecked</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {ALL_ACCESSORIES.map(acc => {
                        const IconComponent = acc.icon;
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
                            className={`p-6 rounded-[24px] border-2 text-left transition-all flex flex-col justify-between h-44 cursor-pointer group
                              ${selected
                                ? 'border-[#087F8C] bg-[#E8F6F7]'
                                : 'border-gray-100 bg-white hover:border-gray-200'}`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div className="p-3 bg-[#E8F6F7] text-[#087F8C] rounded-2xl">
                                <IconComponent className="w-8 h-8" />
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${selected ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-200'}`}>
                                {selected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>}
                              </div>
                            </div>
                            <div>
                              <p className={`font-black text-base ${selected ? 'text-[#087F8C]' : 'text-[#111827]'}`}>{acc.label}</p>
                              <p className="text-xs text-gray-400 mt-1">{acc.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP 6: Age & Warranty ─── */}
                {STEPS[currentStepIndex]?.id === 'warranty' && (
                  <div className="space-y-10">
                    {/* Q1: Age */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">1. How old is your tablet?</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {AGE_OPTIONS.map(age => (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setDeviceAge(age)}
                            className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                              ${deviceAge === age
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2: Warranty */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#111827]">2. Is your tablet under manufacturer warranty?</h3>
                      {deviceAge === 'Above 11 Months' && (
                        <p className="text-xs text-amber-500 font-semibold -mt-2">Warranty is automatically set to No for devices older than 11 months.</p>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => { if (deviceAge !== 'Above 11 Months') setUnderWarranty(true); }}
                          disabled={deviceAge === 'Above 11 Months'}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${underWarranty === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
                            ${deviceAge === 'Above 11 Months' ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnderWarranty(false)}
                          disabled={deviceAge === 'Above 11 Months'}
                          className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer
                            ${underWarranty === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
                            ${deviceAge === 'Above 11 Months' ? 'cursor-not-allowed' : ''}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stepper buttons row */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentStepIndex === 0}
                  className="px-8 py-4 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  ← Back
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    disabled={
                      (STEPS[currentStepIndex]?.id === 'screen' && (ableToMakeCalls === null || isTouchScreenWorking === null || isScreenOriginal === null))
                    }
                    className="btn-gradient text-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-[#087F8C]/15"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={handleGetBestPrice}
                    className="btn-gradient text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-[#087F8C]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    GET BEST PRICE <span className="text-lg">›</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Evaluation */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 sticky top-10">
            <h2 className="text-2xl font-black text-[#111827] mb-6">Device Evaluation</h2>

            {/* Cashify Up To Value banner */}
            <div className="mb-6 p-4 rounded-2xl bg-[#E8F6F7] border border-[#087F8C]/20">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#087F8C] block mb-1">
                Evaluation In Progress
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-600">Get Upto:</span>
                <span className="text-2xl font-black text-[#116466]">
                  {formatCurrency(device?.variants?.[0]?.price || device?.basePrice || 0)}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
                  <span>{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary List */}
            <div className="space-y-6">
              <SummaryItem label="Device Age" value={deviceAge} active />
              <SummaryItem label="Warranty" value={underWarranty === null ? 'Not answered' : (underWarranty ? 'Under Warranty' : 'Out of Warranty')} active={underWarranty !== null} />
              <SummaryItem label="General & Screen" value={ableToMakeCalls === null ? 'Not answered' : `Calls: ${ableToMakeCalls ? 'Yes' : 'No'}, Touch: ${isTouchScreenWorking ? 'Yes' : 'No'}, Original: ${isScreenOriginal ? 'Yes' : 'No'}`} active={ableToMakeCalls !== null} />
              <SummaryItem label="Screen Condition" value={CASHIFY_SCREEN_ISSUES.find(s => s.id === screenCondition)?.label || 'Flawless (No Defects)'} active={true} />
              <SummaryItem label="Body Condition" value={CASHIFY_BODY_CONDITIONS.find(b => b.id === bodyCondition)?.label || 'Good'} active={true} />
              <SummaryItem label="Technical Issues" value={technicalIssues.length > 0 ? `${technicalIssues.length} issues selected` : 'No Issues'} active={currentStepIndex >= 3} />
              <SummaryItem label="Accessories" value={selectedAccessories.length > 0 ? selectedAccessories.join(', ') : 'None selected'} active={currentStepIndex >= 4} />
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5">
                <Lock size={12} className="text-[#087F8C]" />
                Exact Valuation Locked until mobile OTP verification
              </span>
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
        deviceName={device?.modelName || 'Tablet'}
      />
    </div>
  );
}

function SummaryItem({ label, value, active }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-[#111827]">{label}</h4>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#087F8C]' : 'bg-gray-200'}`} />
        <p className={`text-[13px] font-medium ${active ? 'text-gray-600' : 'text-gray-400'}`}>{value}</p>
      </div>
    </div>
  );
}

function PriceRow({ label, value, originalValue, isFree, isBonus }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        {originalValue && <span className="text-sm text-gray-300 line-through">₹{originalValue}</span>}
        <span className={`font-black ${isFree || isBonus ? 'text-[#087F8C]' : 'text-[#111827]'}`}>
          {isFree ? 'Free' : (isBonus ? `+${formatCurrency(value)}` : formatCurrency(value))}
        </span>
      </div>
    </div>
  );
}

function EvaluationRow({ label, value, color }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-black text-[#111827]">{value || 'N/A'}</span>
      </div>
    </div>
  );
}
