import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { quizService } from '../services/quiz.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculatePrice, isDeviceWarrantyEligible } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/ui/Loader';
import NoIndexSEO from '../components/seo/NoIndexSEO';
import EvaluationOtpModal from '../components/quiz/EvaluationOtpModal';
import {
  Lock,
  AlertCircle,
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CreditCard,
  Check,
} from 'lucide-react';

import {
  BatteryWarningIcon,
  BatteryWarningYellowIcon,
  FrontCameraIcon,
  BackCameraIcon,
  VolumeButtonIcon,
  WifiSignalIcon,
  FingerTouchIcon,
  FaceSensorIcon,
  SpeakerIcon,
  PowerButtonIcon,
  ChargingPortIcon,
  CameraGlassBrokenIcon,
  BluetoothIcon,
  VibratorIcon,
  MicrophoneIcon,
  ProximitySensorIcon,
  SilentSwitchIcon,
  BoxPackagingIcon,
  ChargerPlugIcon,
  DefectScreenBrokenScratchIcon,
  DefectScreenSpotsLinesIcon,
  DefectBodyScratchDentIcon,
  DefectPanelMissingBrokenIcon,
  ScreenCrackedGlassIcon,
  ScreenChippedOutsideIcon,
  ScreenScratchesHeavyIcon,
  ScreenScratchesMinorIcon,
  DisplaySpotsHeavyIcon,
  DisplaySpotsMultipleIcon,
  DisplaySpotsMinorIcon,
  CleanPhoneWithSparkleIcon,
  DisplayLinesVisibleIcon,
  DisplayLinesFadedIcon,
  DisplayDiscolorationMajorIcon,
  DisplayDiscolorationMinorIcon,
  BodyScratchesHeavyIcon,
  BodyScratchesMinorIcon,
  BodyDentMajorIcon,
  BodyDentMinorIcon,
  PanelBrokenIcon,
  PanelMissingIcon,
  PanelBentIcon,
  PanelLooseScreenIcon,
  PanelStraightIcon,
} from '../components/quiz/QuizIcons';

// --- Steps matching Cashify Mobile Flow ---
const STEPS = [
  { id: 'device_details', label: 'Device Details' },
  { id: 'screen_body_defects', label: 'Screen & Body' },
  { id: 'functional_issues', label: 'Functional Problems' },
  { id: 'accessories', label: 'Accessories' },
];

// Screen & Body Defects (Cashify Step 2 - Primary Selection)
const CASHIFY_SCREEN_BODY_DEFECTS = [
  {
    id: 'defect_screen_broken_scratch',
    label: 'Broken/scratch on device screen',
    desc: 'Cracks, scratches or broken display glass',
    icon: DefectScreenBrokenScratchIcon,
  },
  {
    id: 'defect_screen_spots_lines',
    label: 'Dead Spot/Visible line and Discoloration on screen',
    desc: 'Visible lines, yellow/pink spots or discoloration',
    icon: DefectScreenSpotsLinesIcon,
  },
  {
    id: 'defect_body_scratch_dent',
    label: 'Scratch/Dent on device body',
    desc: 'Minor/major scratches or dents on side frame or back',
    icon: DefectBodyScratchDentIcon,
  },
  {
    id: 'defect_panel_missing_broken',
    label: 'Device panel missing/broken',
    desc: 'Back panel or side buttons loose/cracked/missing',
    icon: DefectPanelMissingBrokenIcon,
  },
];

// ─── CASHIFY SUB-STEP DEFECT SPECIFICATIONS ────────────────────────────────
const SUB_DEFECT_CONFIGS = {
  defect_screen_broken_scratch: {
    header: 'Tell us more about your device screen defects?',
    subtitle: '(Because you selected screen defect)',
    sections: [
      {
        id: 'screen_physical_condition',
        title: 'Screen Physical Condition',
        subtitle: 'Check physical condition of Display Screen',
        options: [
          { id: 'screen_cracked', label: 'Screen cracked/ glass broken', icon: ScreenCrackedGlassIcon, deductionKey: 'screen_cracked' },
          { id: 'screen_chipped', label: 'Chipped/cracked outside display area', icon: ScreenChippedOutsideIcon, deductionKey: 'screen_chipped' },
          { id: 'screen_scratches_heavy', label: 'More than 2 scratches on screen', icon: ScreenScratchesHeavyIcon, deductionKey: 'screen_scratches_major' },
          { id: 'screen_scratches_minor', label: '1-2 scratches on screen', icon: ScreenScratchesMinorIcon, deductionKey: 'screen_scratches_minor' },
        ],
      },
    ],
  },
  defect_screen_spots_lines: {
    header: "Tell us more about your device's screen defects?",
    subtitle: '(because you selected defective screen)',
    sections: [
      {
        id: 'screen_spots',
        title: '1. Dead Pixels/Spots on Screen',
        subtitle: "Check your device's screen for visible spots",
        options: [
          { id: 'spots_heavy', label: 'Large/ heavy visible spots on screen', icon: DisplaySpotsHeavyIcon, deductionKey: 'deadPixels' },
          { id: 'spots_multiple', label: '3 or more minor spots on screen', icon: DisplaySpotsMultipleIcon, deductionKey: 'dead_spots_lines' },
          { id: 'spots_minor', label: '1-2 minor spots on screen', icon: DisplaySpotsMinorIcon, deductionKey: 'screen_spots_minor' },
          { id: 'spots_none', label: 'No spots on screen', icon: CleanPhoneWithSparkleIcon, deductionKey: null },
        ],
      },
      {
        id: 'screen_lines',
        title: '2. Visible Lines on Screen',
        subtitle: "Check your device's screen for visible lines",
        options: [
          { id: 'lines_visible', label: 'Visible line(s) on display', icon: DisplayLinesVisibleIcon, deductionKey: 'screen_lines' },
          { id: 'lines_faded', label: 'Display faded along edges', icon: DisplayLinesFadedIcon, deductionKey: 'screen_faded' },
          { id: 'lines_none', label: 'No line(s) on Display', icon: CleanPhoneWithSparkleIcon, deductionKey: null },
        ],
      },
      {
        id: 'screen_discoloration',
        title: '3. Discoloration on Screen',
        subtitle: "Check your device's screen for discoloration",
        options: [
          { id: 'discoloration_major', label: 'Major Discoloration', icon: DisplayDiscolorationMajorIcon, deductionKey: 'screen_discoloration_major' },
          { id: 'discoloration_minor', label: 'Minor Discoloration', icon: DisplayDiscolorationMinorIcon, deductionKey: 'screen_discoloration_minor' },
          { id: 'discoloration_none', label: 'No Discoloration', icon: CleanPhoneWithSparkleIcon, deductionKey: null },
        ],
      },
    ],
  },
  defect_body_scratch_dent: {
    header: "Tell us more about your device's body defects?",
    subtitle: "(Because you selected device's body defect)",
    sections: [
      {
        id: 'body_scratches',
        title: '1. Scratches on device Body',
        subtitle: 'Check for scratches on device body',
        options: [
          { id: 'scratches_heavy', label: 'More than 2 scratches', icon: BodyScratchesHeavyIcon, deductionKey: 'scratches' },
          { id: 'scratches_minor', label: '1-2 scratches', icon: BodyScratchesMinorIcon, deductionKey: 'body_scratches_minor' },
          { id: 'scratches_none', label: 'No scratches', icon: CleanPhoneWithSparkleIcon, deductionKey: null },
        ],
      },
      {
        id: 'body_dents',
        title: '2. Dents on device Body',
        subtitle: 'Check for dents on device body',
        options: [
          { id: 'dents_major', label: 'Major dent(s) or more than 2', icon: BodyDentMajorIcon, deductionKey: 'bent_curved' },
          { id: 'dents_minor', label: '1-2 minor dents', icon: BodyDentMinorIcon, deductionKey: 'body_scratches_dents' },
          { id: 'dents_none', label: 'No dents', icon: CleanPhoneWithSparkleIcon, deductionKey: null },
        ],
      },
    ],
  },
  defect_panel_missing_broken: {
    header: "Tell us more about your device's body defects?",
    subtitle: "(Because you selected device's body defect)",
    sections: [
      {
        id: 'panel_condition',
        title: '1. Device Side/Back Panel Condition',
        subtitle: "Check your device's side & back panels",
        options: [
          { id: 'panel_broken', label: 'Cracked/ broken side or back panel', icon: PanelBrokenIcon, deductionKey: 'panel_cracked' },
          { id: 'panel_missing', label: 'Missing side or back panel', icon: PanelMissingIcon, deductionKey: 'panel_missing' },
          { id: 'panel_none', label: 'No defect on side or back panel', icon: PanelStraightIcon, deductionKey: null },
        ],
      },
      {
        id: 'panel_bent_loose',
        title: '2. Device Bent/Screen loose',
        subtitle: 'Check if your device is bent or display screen is loose',
        options: [
          { id: 'panel_bent', label: 'Bent/ curved panel', icon: PanelBentIcon, deductionKey: 'bent_curved' },
          { id: 'panel_loose', label: 'Loose screen (Gap in screen and body)', icon: PanelLooseScreenIcon, deductionKey: 'loose_screen' },
          { id: 'panel_straight', label: 'Phone not bent', icon: PanelStraightIcon, deductionKey: null },
        ],
      },
    ],
  },
};

// 18 Cashify Hardware & Physical Defects
const FUNCTIONAL_PROBLEMS = [
  { id: 'front_camera', label: 'Front Camera not working', icon: FrontCameraIcon },
  { id: 'back_camera', label: 'Back Camera not working', icon: BackCameraIcon },
  { id: 'volume_button', label: 'Volume Button not working', icon: VolumeButtonIcon },
  { id: 'finger_touch', label: 'Finger Touch / Face ID', icon: FingerTouchIcon },
  { id: 'wifi_issue', label: 'WiFi not working', icon: WifiSignalIcon },
  { id: 'speaker_faulty', label: 'Speaker Faulty', icon: SpeakerIcon },
  { id: 'silent_button', label: 'Silent Button not working', icon: SilentSwitchIcon },
  { id: 'face_sensor', label: 'Face Sensor not working', icon: FaceSensorIcon },
  { id: 'power_button', label: 'Power Button not working', icon: PowerButtonIcon },
  { id: 'charging_port', label: 'Charging Port not working', icon: ChargingPortIcon },
  { id: 'audio_receiver', label: 'Audio Receiver not working', icon: SpeakerIcon },
  { id: 'camera_glass_broken', label: 'Camera Glass Broken', icon: CameraGlassBrokenIcon },
  { id: 'microphone', label: 'Microphone not working', icon: MicrophoneIcon },
  { id: 'bluetooth', label: 'Bluetooth not working', icon: BluetoothIcon },
  { id: 'vibrator', label: 'Vibrator is not working', icon: VibratorIcon },
  { id: 'proximity_sensor', label: 'Proximity Sensor not working', icon: ProximitySensorIcon },
  { id: 'battery_service', label: 'Battery in Service (<80% health)', icon: BatteryWarningIcon },
  { id: 'battery_80_85', label: 'Battery Health 80-85%', icon: BatteryWarningYellowIcon },
];

const supportsESIM = (modelName) => {
  if (!modelName) return false;
  const name = modelName.toLowerCase();
  const allowed = [
    'iphone 13 pro', 'iphone 13 pro max',
    'iphone 14', 'iphone 14 plus', 'iphone 14 pro', 'iphone 14 pro max',
    'iphone 15', 'iphone 15 plus', 'iphone 15 pro', 'iphone 15 pro max',
    'iphone 16', 'iphone 16 plus', 'iphone 16e', 'iphone 16 pro', 'iphone 16 pro max',
    'iphone 17', 'iphone 17 air', 'iphone 17e', 'iphone 17 pro', 'iphone 17 pro max',
  ];
  return allowed.some(pattern => name.includes(pattern));
};

const bundlesCharger = (brand, modelName) => {
  if (!modelName) return true;
  const name = modelName.toLowerCase();
  if (brand?.toLowerCase() === 'apple') {
    const noChargerPatterns = [
      'iphone 12', 'iphone 13', 'iphone 14', 'iphone 15', 'iphone 16', 'iphone 17', 'iphone se 2022'
    ];
    return !noChargerPatterns.some(p => name.includes(p));
  }
  return true;
};

export default function ConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storage = searchParams.get('storage');
  const { updateQuote } = useQuote();
  const { isAuthenticated, user, sendOtp, verifyOtp } = useAuth();

  const [device, setDevice] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Step 1: Tell us more about your device? (Cashify Step 1)
  const [ableToMakeCalls, setAbleToMakeCalls] = useState(null);
  const [isTouchScreenWorking, setIsTouchScreenWorking] = useState(null);
  const [isScreenOriginal, setIsScreenOriginal] = useState(null);
  const [underWarranty, setUnderWarranty] = useState(null);
  const [hasGSTBill, setHasGSTBill] = useState(null);
  const [eSIMSupport, seteSIMSupport] = useState(null); // 'single_esim' | 'dual_esim'

  // Step 2: Screen & Body Defects (Cashify Step 2)
  const [screenBodyDefects, setScreenBodyDefects] = useState([]);
  const [isSubDefectView, setIsSubDefectView] = useState(false);
  const [subDefectAnswers, setSubDefectAnswers] = useState({});

  // Step 3: Functional Problems (Cashify Step 3)
  const [functionalProblems, setFunctionalProblems] = useState([]);

  // Step 4: Accessories (Cashify Step 4)
  const [hasBox, setHasBox] = useState(true);
  const [hasCharger, setHasCharger] = useState(true);

  // OTP & Result Modals
  const [showResult, setShowResult] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Load device details & category quiz configuration
  useEffect(() => {
    let isMounted = true;
    deviceService.getDevice(slug).then(res => {
      if (!isMounted) return;
      const dev = res.data;
      setDevice(dev);
      setLoading(false);

      if (!supportsESIM(dev.modelName)) {
        seteSIMSupport('single_esim');
      }
      if (!isDeviceWarrantyEligible(dev)) {
        setUnderWarranty(false);
        setHasGSTBill(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    quizService.getQuizByCategory('mobile').then(data => {
      if (isMounted && data) {
        setQuizConfig(data);
      }
    }).catch(err => console.error('Quiz config fallback to defaults:', err));

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Derived: calculate price & breakdown in render (uses model custom quiz if active, otherwise category master)
  const isWarrantyEligible = device ? isDeviceWarrantyEligible(device) : false;
  const selectedVariant = device?.variants?.find(v => v.storage === storage) || device?.variants?.[0];
  const effectiveQuizConfig = (device?.hasCustomQuiz && device?.customQuiz?.steps?.length > 0)
    ? device.customQuiz
    : quizConfig;

  const computedDeviceAge = isWarrantyEligible
    ? (underWarranty ? '0 - 3 Months' : 'Above 11 Months')
    : 'Above 11 Months';

  // Extract all active sub-defect deduction keys
  const activeSubDefectDeductionKeys = [];
  screenBodyDefects.forEach(defectId => {
    const config = SUB_DEFECT_CONFIGS[defectId];
    if (config) {
      let hasAnsweredAny = false;
      config.sections.forEach(sec => {
        const val = subDefectAnswers[sec.id];
        const selectedIds = Array.isArray(val) ? val : (val ? [val] : []);
        selectedIds.forEach(chosenOptId => {
          hasAnsweredAny = true;
          const opt = sec.options.find(o => o.id === chosenOptId);
          if (opt && opt.deductionKey) {
            activeSubDefectDeductionKeys.push(opt.deductionKey);
          }
        });
      });
      // If user selected this defect category on step 2, but has not answered sub-defect yet, fallback to defectId
      if (!hasAnsweredAny) {
        activeSubDefectDeductionKeys.push(defectId);
      }
    } else {
      activeSubDefectDeductionKeys.push(defectId);
    }
  });

  const breakdown = device ? calculatePrice({
    brand: device.brand,
    modelName: device.modelName,
    device,
    basePrice: selectedVariant?.basePrice || 0,
    deviceAge: computedDeviceAge,
    isWarrantyEligible,
    ableToMakeCalls: ableToMakeCalls ?? true,
    isTouchScreenWorking: isTouchScreenWorking ?? true,
    isScreenOriginal: isScreenOriginal ?? true,
    underWarranty: isWarrantyEligible ? (underWarranty ?? true) : false,
    hasGSTBill: isWarrantyEligible ? (hasGSTBill ?? true) : false,
    eSIMSupport: eSIMSupport === 'dual_esim' ? 'dual_esim' : 'single_esim',
    screenCondition: (
      subDefectAnswers.screen_physical_condition === 'screen_cracked' ||
      screenBodyDefects.includes('defect_screen_broken_scratch')
    ) ? 'cracked' : 'none',
    bodyCondition: (
      subDefectAnswers.body_dents === 'dents_major' ||
      subDefectAnswers.body_scratches === 'scratches_heavy' ||
      screenBodyDefects.includes('defect_body_scratch_dent')
    ) ? 'average' : 'good',
    physicalIssues: activeSubDefectDeductionKeys,
    technicalIssues: functionalProblems,
    hasBox,
    hasCharger: bundlesCharger(device.brand, device.modelName) ? hasCharger : true,
    quizConfig: effectiveQuizConfig,
  }) : null;

  const currentPrice = breakdown?.finalPrice ?? 0;

  const finalizeAndShowResult = () => {
    const variant = device.variants.find(v => v.storage === storage) || device.variants[0];
    updateQuote({
      device: {
        brand: device.brand,
        modelName: device.modelName,
        slug: device.slug,
        category: 'mobile',
        imageUrl: device.imageUrl || '',
        storage: variant.storage,
        ableToMakeCalls,
        isTouchScreenWorking,
        isScreenOriginal,
        underWarranty: isWarrantyEligible ? underWarranty : false,
        hasGSTBill: isWarrantyEligible ? hasGSTBill : false,
        isWarrantyEligible,
        eSIMSupport,
        screenBodyDefects,
        subDefectAnswers,
        functionalProblems,
        accessories: [
          hasBox ? 'Original Box' : null,
          bundlesCharger(device.brand, device.modelName) && hasCharger ? 'Original Charger' : null,
        ].filter(Boolean),
      },
      priceBreakdown: breakdown,
    });
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetBestPrice = () => {
    setShowOtpModal(true);
  };

  if (loading || !device) {
    return <Loader message="Loading device evaluation..." />;
  }

  const isEsimDevice = supportsESIM(device.modelName);
  const showCharger = bundlesCharger(device.brand, device.modelName);

  // Validation for Step 1
  const isStep1Valid =
    ableToMakeCalls !== null &&
    isTouchScreenWorking !== null &&
    isScreenOriginal !== null &&
    (!isWarrantyEligible || (underWarranty !== null && hasGSTBill !== null)) &&
    (!isEsimDevice || eSIMSupport !== null);

  // Validation for Step 2 Sub-defects
  const isSubDefectsComplete = !isSubDefectView || screenBodyDefects.every(d => {
    const config = SUB_DEFECT_CONFIGS[d];
    if (!config) return true;
    return config.sections.every(sec => {
      const vals = subDefectAnswers[sec.id];
      return Array.isArray(vals) ? vals.length > 0 : Boolean(vals);
    });
  });

  const isNextDisabled =
    (currentStepIndex === 0 && !isStep1Valid) ||
    (currentStepIndex === 1 && isSubDefectView && !isSubDefectsComplete);

  const handleNextStep = () => {
    if (currentStepIndex === 0) {
      if (!isStep1Valid) return;
      setCurrentStepIndex(1);
      setIsSubDefectView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStepIndex === 1) {
      if (!isSubDefectView) {
        if (screenBodyDefects.length === 0) {
          setCurrentStepIndex(2);
        } else {
          setIsSubDefectView(true);
        }
      } else {
        setIsSubDefectView(false);
        setCurrentStepIndex(2);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStepIndex === 2) {
      setCurrentStepIndex(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStepIndex === 3) {
      handleGetBestPrice();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex === 1) {
      if (isSubDefectView) {
        setIsSubDefectView(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setCurrentStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStepIndex === 2) {
      if (screenBodyDefects.length > 0) {
        setCurrentStepIndex(1);
        setIsSubDefectView(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setCurrentStepIndex(1);
      setIsSubDefectView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Result / Final Quote View
  if (showResult) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 sm:px-8">
        <NoIndexSEO title={`Quote for ${device.modelName}`} path={`/sell-old-mobile-phone/${brand}/${slug}/quiz`} />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Offer Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-28 h-36 bg-gray-50 rounded-2xl flex items-center justify-center p-3 shrink-0">
                    <img src={device.imageUrl} alt={device.modelName} className="h-full object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6F7] text-[#087F8C] border border-[#087F8C]/20 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles size={13} />
                      Verified Cashify-Standard Valuation
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                      {device.modelName} <span className="text-gray-400 font-semibold">({selectedVariant.storage})</span>
                    </h1>
                    <div className="mt-4 flex flex-wrap items-baseline gap-3">
                      <span className="text-3xl sm:text-5xl font-black text-[#087F8C] tracking-tight">
                        {formatCurrency(currentPrice)}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold uppercase">Inclusive of all bonuses</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) navigate('/login?returnUrl=/schedule-pickup');
                      else navigate('/schedule-pickup');
                    }}
                    className="flex-1 py-4 px-8 btn-gradient text-white font-extrabold text-base rounded-2xl transition shadow-lg shadow-[#087F8C]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Schedule Free Pickup & Instant Payment</span>
                    <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => { setShowResult(false); setCurrentStepIndex(0); }}
                    className="py-4 px-6 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition cursor-pointer"
                  >
                    Re-evaluate
                  </button>
                </div>
              </div>

              {/* Evaluation Breakdown Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">Device Evaluation Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      CALLS FUNCTIONAL
                    </span>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ableToMakeCalls ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {ableToMakeCalls ? 'Yes (Able to make and receive calls)' : 'No (Dead / Network Issue)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      TOUCH SCREEN
                    </span>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isTouchScreenWorking ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {isTouchScreenWorking ? 'Yes (Working Properly)' : 'No (Touch Issue)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      SCREEN ORIGINAL
                    </span>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isScreenOriginal ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {isScreenOriginal ? 'Yes (Original Screen)' : 'No (Copy Screen)'}
                    </p>
                  </div>

                  {isWarrantyEligible ? (
                    <>
                      <div>
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                          MANUFACTURER WARRANTY
                        </span>
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${underWarranty ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                          {underWarranty ? 'Yes (Under Warranty)' : 'No (Out of Warranty)'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                          VALID GST BILL
                        </span>
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${hasGSTBill ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                          {hasGSTBill ? 'Yes (Bill with matching IMEI)' : 'No Bill'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                        WARRANTY STATUS
                      </span>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        Out of Warranty (&gt;11 Months)
                      </p>
                    </div>
                  )}

                  {isEsimDevice && (
                    <div>
                      <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                        ESIM SUPPORT
                      </span>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {eSIMSupport === 'dual_esim' ? 'Dual eSIM' : 'Single eSIM'}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      SCREEN & BODY DEFECTS
                    </span>
                    {screenBodyDefects.length === 0 ? (
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Flawless (No defects)
                      </p>
                    ) : (
                      <div className="space-y-2 mt-1">
                        {screenBodyDefects.map(d => {
                          const catLabel = CASHIFY_SCREEN_BODY_DEFECTS.find(x => x.id === d)?.label || d;
                          const config = SUB_DEFECT_CONFIGS[d];
                          const subLabels = config?.sections
                            .flatMap(sec => {
                              const chosen = subDefectAnswers[sec.id];
                              const ids = Array.isArray(chosen) ? chosen : (chosen ? [chosen] : []);
                              return ids.map(id => sec.options.find(o => o.id === id)?.label).filter(Boolean);
                            }) || [];

                          return (
                            <div key={d} className="text-sm font-bold text-gray-800 flex items-start gap-2">
                              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                              <div>
                                <span>{catLabel}</span>
                                {subLabels.length > 0 && (
                                  <p className="text-xs text-gray-500 font-medium">
                                    {subLabels.join(' • ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      FUNCTIONAL PROBLEMS
                    </span>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {functionalProblems.length === 0
                        ? 'All Hardware Fully Functional'
                        : functionalProblems.map(f => FUNCTIONAL_PROBLEMS.find(x => x.id === f)?.label || f).join(', ')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      ACCESSORIES
                    </span>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {[
                        hasBox ? 'Original Box with IMEI' : null,
                        showCharger && hasCharger ? 'Original Charger' : null,
                      ].filter(Boolean).join(', ') || 'No Accessories'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F6F7] text-[#087F8C] flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">Payment Summary</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span className="uppercase text-xs font-extrabold text-gray-400 tracking-wider">BASE PRICE</span>
                    <span className="font-bold text-gray-900">{formatCurrency(selectedVariant.basePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span className="uppercase text-xs font-extrabold text-gray-400 tracking-wider">DOORSTEP PICKUP</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span className="uppercase text-xs font-extrabold text-gray-400 tracking-wider">DATA SANITIZATION</span>
                    <span className="font-bold text-emerald-600">FREE (Certified)</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-black text-gray-900 text-base">Final Offer</span>
                    <span className="font-black text-2xl text-[#087F8C]">{formatCurrency(currentPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ VIEW (Cashify 4-Step Questionnaire) ---
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 sm:px-8">
      <NoIndexSEO title="Device Condition Quiz" path={`/sell-old-mobile-phone/${brand}/${slug}/quiz`} />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT COLUMN: Quiz Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

            {/* Device Header */}
            <div className="p-8 flex items-center gap-6 border-b border-gray-50">
              <div className="w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2 shrink-0">
                <img src={device.imageUrl} alt={device.modelName} className="h-full object-contain" />
              </div>
              <div>
                <p className="text-[#087F8C] text-xs font-bold uppercase tracking-wider mb-1">Evaluating</p>
                <h1 className="text-2xl font-black text-[#111827]">
                  {device.modelName} <span className="text-gray-400 font-medium">({selectedVariant.storage})</span>
                </h1>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-50">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                {STEPS.map((s, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <div key={s.id} className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-[#087F8C]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                        {s.label}
                        {isCurrent && currentStepIndex === 1 && isSubDefectView && (
                          <span className="text-[#087F8C]/80 font-semibold ml-1">
                            (Details)
                          </span>
                        )}
                      </span>
                      {idx < STEPS.length - 1 && <span className="text-gray-300 text-xs font-bold">&gt;</span>}
                    </div>
                  );
                })}
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] transition-all duration-500"
                  style={{
                    width: `${
                      currentStepIndex === 1 && isSubDefectView
                        ? (1.75 / STEPS.length) * 100
                        : ((currentStepIndex + 1) / STEPS.length) * 100
                    }%`
                  }}
                />
              </div>
            </div>

            {/* Question Area */}
            <div className="p-8 sm:p-10 min-h-[460px] flex flex-col justify-between">
              <div>
                {/* ─── STEP 1: Tell us more about your device? ─── */}
                {STEPS[currentStepIndex]?.id === 'device_details' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Tell us more about your device?</h2>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        The better condition your device is in, we will pay you more
                      </p>
                    </div>

                    {/* Q1: Calls */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Are you able to make and receive calls?</h3>
                        <p className="text-xs text-gray-400">Check your device for cellular network connectivity issues.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAbleToMakeCalls(true)}
                          className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            ableToMakeCalls === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setAbleToMakeCalls(false)}
                          className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            ableToMakeCalls === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Q2: Touch Screen */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Is your device's touch screen working properly?</h3>
                        <p className="text-xs text-gray-400">Check the touch screen functionality of your phone.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setIsTouchScreenWorking(true)}
                          className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            isTouchScreenWorking === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsTouchScreenWorking(false)}
                          className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            isTouchScreenWorking === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Q3: Screen Original */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Is your phone's screen original?</h3>
                        <p className="text-xs text-gray-400">
                          Pick "Yes" if screen was never changed or was changed by Authorized Service Center. Pick "No" if screen was changed at local shop.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setIsScreenOriginal(true)}
                          className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            isScreenOriginal === true
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsScreenOriginal(false)}
                          className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            isScreenOriginal === false
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Q4: Warranty */}
                    {isWarrantyEligible && (
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Is your device under manufacturer warranty?</h3>
                          <p className="text-xs text-gray-400">
                            You can get a better price for your device if it's under manufacturer warranty with a GST valid bill.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setUnderWarranty(true)}
                            className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                              underWarranty === true
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setUnderWarranty(false)}
                            className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                              underWarranty === false
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Q5: GST Bill */}
                    {isWarrantyEligible && (
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">Do you have GST valid bill with the same IMEI?</h3>
                          <p className="text-xs text-gray-400">Make sure your bill has device IMEI mentioned on it.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setHasGSTBill(true)}
                            className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                              hasGSTBill === true
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasGSTBill(false)}
                            className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                              hasGSTBill === false
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Q6: eSIM Support (Conditional for iPhone) */}
                    {isEsimDevice && (
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">How many eSIMs does your device support?</h3>
                          <p className="text-xs text-gray-400">
                            Please select "Dual eSIM" if your device supports dual eSIMs. Otherwise, select "Single eSIM".
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => seteSIMSupport('single_esim')}
                            className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                              eSIMSupport === 'single_esim'
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            Single eSIM
                          </button>
                          <button
                            type="button"
                            onClick={() => seteSIMSupport('dual_esim')}
                            className={`py-3.5 px-6 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                              eSIMSupport === 'dual_esim'
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            Dual eSIM
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 2: Screen & Body Defects (Cashify Step 2) ─── */}
                {STEPS[currentStepIndex]?.id === 'screen_body_defects' && !isSubDefectView && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Select screen/body defects that are applicable!
                      </h2>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        Please provide correct details (Leave unselected if your device has no defects)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {CASHIFY_SCREEN_BODY_DEFECTS.map(defect => {
                        const IconComponent = defect.icon;
                        const isSelected = screenBodyDefects.includes(defect.id);
                        return (
                          <button
                            key={defect.id}
                            type="button"
                            onClick={() => {
                              setScreenBodyDefects(prev => {
                                const isAlready = prev.includes(defect.id);
                                if (isAlready) {
                                  // Clear answers for this defect's sections
                                  const config = SUB_DEFECT_CONFIGS[defect.id];
                                  if (config) {
                                    setSubDefectAnswers(curr => {
                                      const next = { ...curr };
                                      config.sections.forEach(s => delete next[s.id]);
                                      return next;
                                    });
                                  }
                                  return prev.filter(x => x !== defect.id);
                                } else {
                                  return [...prev, defect.id];
                                }
                              });
                            }}
                            className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 cursor-pointer ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-sm'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                          >
                            <div className="shrink-0">
                              <IconComponent className="w-12 h-16" />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-black text-sm ${isSelected ? 'text-[#087F8C]' : 'text-gray-900'}`}>
                                {defect.label}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">{defect.desc}</p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-200'
                              }`}
                            >
                              {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {screenBodyDefects.length === 0 ? 'No defects selected (Device is Flawless)' : `${screenBodyDefects.length} defect(s) selected`}
                      </span>
                      {screenBodyDefects.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setScreenBodyDefects([]);
                            setSubDefectAnswers({});
                          }}
                          className="text-xs font-bold text-[#087F8C] hover:underline cursor-pointer"
                        >
                          Clear all defects
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── STEP 2 SUB-QUESTIONS: Display All Selected Defects Together ─── */}
                {STEPS[currentStepIndex]?.id === 'screen_body_defects' && isSubDefectView && (
                  <div className="space-y-10 animate-fadeIn">
                    {screenBodyDefects.map((defectId, dIdx) => {
                      const currentConfig = SUB_DEFECT_CONFIGS[defectId];
                      if (!currentConfig) return null;

                      return (
                        <div key={defectId} className="space-y-6 pb-8 border-b border-gray-100 last:border-b-0">
                          {/* Header & Subtitle */}
                          <div className="pb-3 border-b border-gray-50">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                              {currentConfig.header}
                            </h2>
                            <p className="text-sm font-medium text-gray-400 mt-1">
                              {currentConfig.subtitle}
                            </p>
                          </div>

                          {/* Dynamic Sections */}
                          <div className="space-y-8">
                            {currentConfig.sections.map((section) => {
                              const currentVals = Array.isArray(subDefectAnswers[section.id])
                                ? subDefectAnswers[section.id]
                                : (subDefectAnswers[section.id] ? [subDefectAnswers[section.id]] : []);

                              return (
                                <div key={section.id} className="space-y-3">
                                  <div>
                                    <h3 className="text-base font-bold text-gray-900">{section.title}</h3>
                                    {section.subtitle && (
                                      <p className="text-xs text-gray-400 mt-0.5">{section.subtitle}</p>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {section.options.map((opt) => {
                                      const IconComponent = opt.icon;
                                      const isSelected = currentVals.includes(opt.id);
                                      return (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          onClick={() => {
                                            setSubDefectAnswers(prev => {
                                              const existing = Array.isArray(prev[section.id])
                                                ? prev[section.id]
                                                : (prev[section.id] ? [prev[section.id]] : []);

                                              const isNoneOption = opt.id.includes('none') || opt.id.includes('straight');
                                              if (isNoneOption) {
                                                return { ...prev, [section.id]: [opt.id] };
                                              }

                                              // If selecting a defect option, remove any 'none' options
                                              const withoutNone = existing.filter(x => !x.includes('none') && !x.includes('straight'));
                                              const updated = withoutNone.includes(opt.id)
                                                ? withoutNone.filter(x => x !== opt.id)
                                                : [...withoutNone, opt.id];

                                              return { ...prev, [section.id]: updated };
                                            });
                                          }}
                                          className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 cursor-pointer ${
                                            isSelected
                                              ? 'border-[#087F8C] bg-[#E8F6F7] shadow-sm'
                                              : 'border-gray-100 bg-white hover:border-gray-200'
                                          }`}
                                        >
                                          <div className="w-12 h-14 shrink-0 flex items-center justify-center">
                                            {IconComponent && <IconComponent className="w-12 h-14" />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`font-black text-sm leading-snug ${isSelected ? 'text-[#087F8C]' : 'text-gray-900'}`}>
                                              {opt.label}
                                            </p>
                                          </div>
                                          <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                              isSelected ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-200'
                                            }`}
                                          >
                                            {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ─── STEP 3: Functional or Physical Problems (Cashify Step 3) ─── */}
                {STEPS[currentStepIndex]?.id === 'functional_issues' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Functional or Physical Problems</h2>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        Please choose appropriate condition to get accurate quote (Leave unselected if all work properly)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto pr-2 no-scrollbar">
                      {FUNCTIONAL_PROBLEMS.map(prob => {
                        const IconComponent = prob.icon;
                        const isSelected = functionalProblems.includes(prob.id);
                        return (
                          <button
                            key={prob.id}
                            type="button"
                            onClick={() => {
                              setFunctionalProblems(prev =>
                                prev.includes(prob.id)
                                  ? prev.filter(x => x !== prob.id)
                                  : [...prev, prob.id]
                              );
                            }}
                            className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2.5 min-h-[110px] cursor-pointer ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] shadow-xs'
                                : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                            }`}
                          >
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold leading-tight">{prob.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {functionalProblems.length === 0 ? 'All hardware features are fully working' : `${functionalProblems.length} issue(s) reported`}
                      </span>
                      {functionalProblems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFunctionalProblems([])}
                          className="text-xs font-bold text-[#087F8C] hover:underline cursor-pointer"
                        >
                          Clear all issues
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── STEP 4: Accessories (Cashify Step 4) ─── */}
                {STEPS[currentStepIndex]?.id === 'accessories' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Do you have the following?</h2>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        Please select accessories which are available
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Original Box */}
                      <button
                        type="button"
                        onClick={() => setHasBox(prev => !prev)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                          hasBox
                            ? 'border-[#087F8C] bg-[#E8F6F7]'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#E8F6F7] text-[#087F8C] rounded-2xl">
                            <BoxPackagingIcon className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="font-black text-base text-gray-900">Original Box with same IMEI</p>
                            <p className="text-xs text-gray-400 mt-1">Original purchase packaging</p>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            hasBox ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-200'
                          }`}
                        >
                          {hasBox && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                      </button>

                      {/* Original Charger (only shown if phone traditionally bundled charger) */}
                      {showCharger && (
                        <button
                          type="button"
                          onClick={() => setHasCharger(prev => !prev)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                            hasCharger
                              ? 'border-[#087F8C] bg-[#E8F6F7]'
                              : 'border-gray-100 bg-white hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#E8F6F7] text-[#087F8C] rounded-2xl">
                              <ChargerPlugIcon className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="font-black text-base text-gray-900">Original Charger of Device</p>
                              <p className="text-xs text-gray-400 mt-1">Original charging adapter & cable</p>
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              hasCharger ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-200'
                            }`}
                          >
                            {hasCharger && <Check size={14} className="text-white" strokeWidth={3} />}
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stepper Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="px-8 py-3.5 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-40 cursor-pointer"
                >
                  ← Back
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isNextDisabled}
                    className="btn-gradient text-white font-bold px-8 py-3.5 rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-[#087F8C]/15"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGetBestPrice}
                    className="btn-gradient text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-[#087F8C]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Get Exact Value</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Evaluation (Cashify Standard Layout) */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-7 sticky top-10">
            <h2 className="text-xl font-black text-gray-900 mb-6">Device Evaluation</h2>

            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-50">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Device Details</p>
                <div className="space-y-1.5 text-xs font-semibold text-gray-700">
                  <div className="flex justify-between">
                    <span>Able to Make & Receive Calls:</span>
                    <span className="font-bold text-gray-900">{ableToMakeCalls === null ? '—' : ableToMakeCalls ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Touch Screen Working:</span>
                    <span className="font-bold text-gray-900">{isTouchScreenWorking === null ? '—' : isTouchScreenWorking ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Screen Original:</span>
                    <span className="font-bold text-gray-900">{isScreenOriginal === null ? '—' : isScreenOriginal ? 'Yes' : 'No'}</span>
                  </div>
                  {isWarrantyEligible ? (
                    <>
                      <div className="flex justify-between">
                        <span>Mobile Under Warranty:</span>
                        <span className="font-bold text-gray-900">{underWarranty === null ? '—' : underWarranty ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST Valid Bill:</span>
                        <span className="font-bold text-gray-900">{hasGSTBill === null ? '—' : hasGSTBill ? 'Yes' : 'No'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>Warranty Status:</span>
                      <span className="font-bold text-gray-900">Out of Warranty (&gt;11m)</span>
                    </div>
                  )}
                  {isEsimDevice && (
                    <div className="flex justify-between">
                      <span>eSIM Support:</span>
                      <span className="font-bold text-gray-900">{eSIMSupport === 'dual_esim' ? 'Dual eSIM' : 'Single eSIM'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pb-3 border-b border-gray-50">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Screen & Body Defects</p>
                {screenBodyDefects.length === 0 ? (
                  <p className="text-xs font-semibold text-gray-800">No Defects (Flawless)</p>
                ) : (
                  <div className="space-y-1.5 mt-1">
                    {screenBodyDefects.map(d => {
                      const catLabel = CASHIFY_SCREEN_BODY_DEFECTS.find(x => x.id === d)?.label || d;
                      const config = SUB_DEFECT_CONFIGS[d];
                      const subLabels = config?.sections
                        .flatMap(sec => {
                          const chosen = subDefectAnswers[sec.id];
                          const ids = Array.isArray(chosen) ? chosen : (chosen ? [chosen] : []);
                          return ids.map(id => sec.options.find(o => o.id === id)?.label).filter(Boolean);
                        }) || [];

                      return (
                        <div key={d} className="text-xs">
                          <p className="font-bold text-gray-900">• {catLabel}</p>
                          {subLabels.length > 0 && (
                            <p className="text-[11px] text-gray-500 pl-2.5">
                              {subLabels.join(' • ')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pb-3 border-b border-gray-50">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Functional Issues</p>
                <p className="text-xs font-semibold text-gray-800">
                  {functionalProblems.length === 0
                    ? 'All Hardware Fully Working'
                    : `${functionalProblems.length} issue(s) reported`}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Accessories</p>
                <p className="text-xs font-semibold text-gray-800">
                  {[
                    hasBox ? 'Original Box' : null,
                    showCharger && hasCharger ? 'Original Charger' : null,
                  ].filter(Boolean).join(', ') || 'None'}
                </p>
              </div>
            </div>

            {/* Guaranteed Fair Value Badge */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <span>Highest valuation with free doorstep pickup & instant payment.</span>
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
        deviceName={device?.modelName || 'Mobile Phone'}
      />
    </div>
  );
}
