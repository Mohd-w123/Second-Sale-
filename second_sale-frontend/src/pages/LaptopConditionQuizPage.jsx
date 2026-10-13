import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { quizService } from '../services/quiz.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculateLaptopPrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/ui/Loader';
import LaptopSpecModal from '../components/LaptopSpecModal';
import EvaluationOtpModal from '../components/quiz/EvaluationOtpModal';
import { Lock } from 'lucide-react';
import {
  CASHIFY_PROCESSORS,
  CASHIFY_RAM,
  CASHIFY_HARD_DISK,
  getValidMacProcessors,
  getValidMacRam,
  getValidMacStorage
} from '../utils/laptopSpecs';
import {
  KeyboardIcon,
  OpticalDiscIcon,
  TrackpadIcon,
  BatteryWarningIcon,
  SpeakerIcon,
  WifiSignalIcon,
  UsbPortIcon,
  ChargingPortIcon,
  WebcamIcon,
  HardDriveIcon,
  MotherboardIcon,
  BoxPackagingIcon,
  ChargerPlugIcon,
  LaptopScreenFlawlessIcon,
  LaptopScreenMinorScratchesIcon,
  LaptopScreenMajorScratchesIcon,
  LaptopScreenCrackedIcon,
  LaptopScreenDiscolourMinorIcon,
  LaptopScreenDiscolourMajorIcon,
  LaptopScreenMinorSpotsIcon,
  LaptopScreenMajorSpotsIcon,
  LaptopScreenVisibleLinesIcon,
  LaptopScreenFlickeringIcon,
  LaptopScreenBlackDotsIcon,
  LaptopBodyNoScratchesIcon,
  LaptopBodyMinorScratchesIcon,
  LaptopBodyMajorScratchesIcon,
  LaptopDentTopNoneIcon,
  LaptopDentTopMinorIcon,
  LaptopDentTopMajorIcon,
  LaptopDentBaseNoneIcon,
  LaptopDentBaseMinorIcon,
  LaptopDentBaseMajorIcon,
  LaptopHingesGoodIcon,
  LaptopHingesLooseIcon,
  LaptopPanelGoodIcon,
  LaptopPanelLooseIcon,
  LaptopPanelCrackedIcon,
} from '../components/quiz/QuizIcons';

// Cashify Exact 8 Steps Sequence
const STEPS = [
  { id: 'power', label: 'Power Status' },
  { id: 'specs', label: 'Specs' },
  { id: 'screenSize', label: 'Additional Features' },
  { id: 'functional', label: 'Functional Issues' },
  { id: 'screen', label: 'Screen Condition' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'age', label: 'Device Age' },
  { id: 'body', label: 'Physical Condition' },
];

const AGE_OPTIONS = [
  { key: 'lessThan1', label: 'Below 1 year (Under Brand Warranty)' },
  { key: 'oneToTwo', label: 'Between 1 and 3 years' },
  { key: 'twoToThree', label: 'More than 3 years' },
];

const SCREEN_SIZE_OPTIONS = [
  { key: '10-11', label: '10-11 inch' },
  { key: '12-13', label: '12-13 inch' },
  { key: '14-15', label: '14-15 inch' },
  { key: 'above15', label: 'Above 15 inch' },
];

const GPU_OPTIONS = [
  { id: 'available', label: 'Graphics Card available' },
  { id: 'not_available', label: 'Graphics Card not available' },
  { id: 'not_working', label: 'Graphics Card not working' },
];

// Cashify Exact Functional Problem Options
const functionalOptions = [
  { id: 'keyboard', label: 'Keyboard not working; key(s) missing/not working', icon: KeyboardIcon },
  { id: 'cdDrive', label: 'CD/DVD Drive not working', icon: OpticalDiscIcon },
  { id: 'trackpad', label: 'Touchpad not working; Left/Right click faulty', icon: TrackpadIcon },
  { id: 'battery', label: 'Battery dead, backup < 60 mins, health < 80%', icon: BatteryWarningIcon },
  { id: 'speakers', label: 'Speakers not working; faulty/cracked sound', icon: SpeakerIcon },
  { id: 'wifi', label: 'Wi-Fi not working', icon: WifiSignalIcon },
  { id: 'ports', label: 'USB Port not working', icon: UsbPortIcon },
  { id: 'webcam', label: 'Web Cam not working', icon: WebcamIcon },
  { id: 'charging', label: 'Charging Port not working', icon: ChargingPortIcon },
  { id: 'hardDisk', label: 'Hard Drive Missing / Defective', icon: HardDriveIcon },
  { id: 'motherboard', label: 'Motherboard issue', icon: MotherboardIcon },
];

// Cashify Exact Laptop Screen Condition
const SCRATCH_OPTIONS = [
  { id: 'none', label: 'No scratches on screen', icon: LaptopScreenFlawlessIcon },
  { id: 'minor', label: '1-2 scratches on screen', icon: LaptopScreenMinorScratchesIcon },
  { id: 'major', label: 'More than 2 scratches on screen', icon: LaptopScreenMajorScratchesIcon },
  { id: 'cracked', label: 'Screen Cracked or Broken', icon: LaptopScreenCrackedIcon },
];

const DISCOLOUR_OPTIONS = [
  { id: 'none', label: 'No Discolouration', icon: LaptopScreenFlawlessIcon },
  { id: 'minor', label: 'Minor Discolouration', icon: LaptopScreenDiscolourMinorIcon },
  { id: 'major', label: 'Major Discolouration', icon: LaptopScreenDiscolourMajorIcon },
];

const SPOTS_OPTIONS = [
  { id: 'none', label: 'No spots on screen', icon: LaptopScreenFlawlessIcon },
  { id: 'minor', label: '1-2 minor spots on screen', icon: LaptopScreenMinorSpotsIcon },
  { id: 'major', label: 'Large/ heavy visible spots on screen', icon: LaptopScreenMajorSpotsIcon },
];

const LINES_OPTIONS = [
  { id: 'none', label: 'No Lines', icon: LaptopScreenFlawlessIcon },
  { id: 'visible_lines', label: 'Visible lines on Screen', icon: LaptopScreenVisibleLinesIcon },
  { id: 'flickering', label: 'Display flickering', icon: LaptopScreenFlickeringIcon },
  { id: 'black_dots', label: 'Black Dots on Screen', icon: LaptopScreenBlackDotsIcon },
];

// Cashify Exact Accessories
const accessoryOptions = [
  { id: 'charger', label: 'Original charger available', desc: 'Original charging adapter', icon: ChargerPlugIcon },
  { id: 'box', label: 'Original Box with same serial number', desc: 'Original purchase box', icon: BoxPackagingIcon },
];

// Cashify Exact Laptop Physical Condition / Body Sections
const BODY_SCRATCH_OPTIONS = [
  { id: 'none', label: 'No Scratches', icon: LaptopBodyNoScratchesIcon },
  { id: 'minor', label: 'Minor Scratch on Body', icon: LaptopBodyMinorScratchesIcon },
  { id: 'major', label: 'Major Scratch on Body', icon: LaptopBodyMajorScratchesIcon },
];

const DENT_TOP_OPTIONS = [
  { id: 'none', label: 'No Dents on top panel', icon: LaptopDentTopNoneIcon },
  { id: 'minor_upto2', label: 'Upto 2 Minor Dents', icon: LaptopDentTopMinorIcon },
  { id: 'minor_more2', label: 'More than 2 Minor Dents', icon: LaptopDentTopMinorIcon },
  { id: 'major', label: '1 or more Major Dents', icon: LaptopDentTopMajorIcon },
];

const DENT_BASE_OPTIONS = [
  { id: 'none', label: 'No Dents on base panel', icon: LaptopDentBaseNoneIcon },
  { id: 'minor_upto2', label: 'Upto 2 Minor Dents', icon: LaptopDentBaseMinorIcon },
  { id: 'minor_more2', label: 'More than 2 Minor Dents', icon: LaptopDentBaseMinorIcon },
  { id: 'major', label: '1 or more Major Dents', icon: LaptopDentBaseMajorIcon },
];

const HINGES_OPTIONS = [
  { id: 'none', label: 'No Loose Hinges', icon: LaptopHingesGoodIcon },
  { id: 'loose', label: 'Yes - Loose Hinges', icon: LaptopHingesLooseIcon },
];

const PANEL_OPTIONS = [
  { id: 'none', label: 'No Cracked or Loose Panel', icon: LaptopPanelGoodIcon },
  { id: 'loose', label: 'Loose Panel', icon: LaptopPanelLooseIcon },
  { id: 'cracked', label: 'Crack/Damage Panel', icon: LaptopPanelCrackedIcon },
];

export default function LaptopConditionQuizPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateQuote } = useQuote();
  const { isAuthenticated, user } = useAuth();

  const [specs, setSpecs] = useState(location.state?.specs);
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [quizConfig, setQuizConfig] = useState(null);

  // Selections
  const [powerStatus, setPowerStatus] = useState(null); // 'on' | 'off'
  const [screenSize, setScreenSize] = useState('14-15'); // '10-11' | '12-13' | '14-15' | 'above15'
  const [gpuStatus, setGpuStatus] = useState('not_available'); // 'available' | 'not_available' | 'not_working'
  const [issuesList, setIssuesList] = useState([]); // functional issues
  const [screenScratchCondition, setScreenScratchCondition] = useState('none');
  const [screenDiscolourCondition, setScreenDiscolourCondition] = useState('none');
  const [screenSpotsCondition, setScreenSpotsCondition] = useState('none');
  const [screenLinesCondition, setScreenLinesCondition] = useState('none');
  const [accessories, setAccessories] = useState(['charger', 'box']);
  const [age, setAge] = useState(null); // 'lessThan1' | 'oneToTwo' | 'twoToThree'
  const [bodyScratchCondition, setBodyScratchCondition] = useState('none');
  const [dentTopCondition, setDentTopCondition] = useState('none');
  const [dentBaseCondition, setDentBaseCondition] = useState('none');
  const [looseHingesCondition, setLooseHingesCondition] = useState('none');
  const [panelCondition, setPanelCondition] = useState('none');

  const isApple = (brand || '').toLowerCase() === 'apple' || (device?.brand || '').toLowerCase() === 'apple';

  const processorOptions = useMemo(() => CASHIFY_PROCESSORS, []);
  const ramOptions = useMemo(() => CASHIFY_RAM, []);
  const hardDiskOptions = useMemo(() => CASHIFY_HARD_DISK, []);

  useEffect(() => {
    let isMounted = true;
    quizService.getQuizByCategory('laptop')
      .then(data => {
        const config = data?.quiz || data;
        if (isMounted && config?.steps) {
          setQuizConfig(config);
        }
      })
      .catch(err => console.error('Failed to load laptop quiz config:', err));
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    deviceService.getDevice(slug).then(res => {
      const dev = res.data;
      setDevice(dev);
      setLoading(false);
      if (!specs && dev) {
        const defVariant = dev.variants?.[0] || {};
        setSpecs({
          processor: dev.processorFamily || dev.processor || 'Intel Core i3',
          ram: defVariant.ram || dev.ram || '8 GB',
          storage: defVariant.storage || dev.storage || '128 GB SSD'
        });
      }
    }).catch(() => setLoading(false));
  }, [slug, brand, specs]);

  const breakdown = useMemo(() => {
    if (!device || !specs) return null;
    const activeScreenIssues = [];
    if (screenScratchCondition === 'minor') activeScreenIssues.push('screen_scratches_minor');
    if (screenScratchCondition === 'major') activeScreenIssues.push('screen_scratches_major');
    if (screenScratchCondition === 'cracked') activeScreenIssues.push('screen_cracked');
    if (screenDiscolourCondition === 'minor') activeScreenIssues.push('screen_discolour_minor');
    if (screenDiscolourCondition === 'major') activeScreenIssues.push('screen_discolour_major');
    if (screenSpotsCondition === 'minor') activeScreenIssues.push('screen_spots_minor');
    if (screenSpotsCondition === 'major') activeScreenIssues.push('screen_spots_major');
    if (screenLinesCondition === 'visible_lines') activeScreenIssues.push('screen_lines_visible');
    if (screenLinesCondition === 'flickering') activeScreenIssues.push('screen_lines_flickering');
    if (screenLinesCondition === 'black_dots') activeScreenIssues.push('screen_lines_black_dots');

    const activeBodyIssues = [];
    if (bodyScratchCondition === 'minor') activeBodyIssues.push('body_scratches_minor');
    if (bodyScratchCondition === 'major') activeBodyIssues.push('body_scratches_major');
    if (dentTopCondition === 'minor_upto2') activeBodyIssues.push('dent_top_minor_upto2');
    if (dentTopCondition === 'minor_more2') activeBodyIssues.push('dent_top_minor_more2');
    if (dentTopCondition === 'major') activeBodyIssues.push('dent_top_major');
    if (dentBaseCondition === 'minor_upto2') activeBodyIssues.push('dent_base_minor_upto2');
    if (dentBaseCondition === 'minor_more2') activeBodyIssues.push('dent_base_minor_more2');
    if (dentBaseCondition === 'major') activeBodyIssues.push('dent_base_major');
    if (looseHingesCondition === 'loose') activeBodyIssues.push('hinges_loose');
    if (panelCondition === 'loose') activeBodyIssues.push('panel_loose');
    if (panelCondition === 'cracked') activeBodyIssues.push('panel_cracked');

    const effectiveQuizConfig = (device?.hasCustomQuiz && device?.customQuiz?.steps?.length > 0)
      ? device.customQuiz
      : quizConfig;

    return calculateLaptopPrice(device, {
      ...specs,
      yearBracket: age || 'twoToThree',
      powerStatus: powerStatus || 'on',
      screenSize: screenSize || '14-15',
      gpuStatus: gpuStatus,
      hasGpu: gpuStatus === 'available',
      isGpuWorking: gpuStatus === 'available',
      functionalIssues: issuesList,
      screenIssues: activeScreenIssues,
      bodyIssues: activeBodyIssues,
      accessories: accessories.length > 0 ? accessories : ['none'],
      quizConfig: effectiveQuizConfig,
    });
  }, [device, specs, age, powerStatus, screenSize, gpuStatus, issuesList, screenScratchCondition, screenDiscolourCondition, screenSpotsCondition, screenLinesCondition, bodyScratchCondition, dentTopCondition, dentBaseCondition, looseHingesCondition, panelCondition, accessories, quizConfig]);

  const currentPrice = breakdown?.finalPrice || 0;

  const handleSpecsUpdate = (newSpecs) => {
    setSpecs(newSpecs);
    setIsSpecsModalOpen(false);
  };

  const finalizeAndShowResult = () => {
    const ageLabel = AGE_OPTIONS.find(o => o.key === age)?.label || age;

    const activeScreenIssues = [];
    if (screenScratchCondition !== 'none') activeScreenIssues.push(SCRATCH_OPTIONS.find(o => o.id === screenScratchCondition)?.label);
    if (screenDiscolourCondition !== 'none') activeScreenIssues.push(DISCOLOUR_OPTIONS.find(o => o.id === screenDiscolourCondition)?.label);
    if (screenSpotsCondition !== 'none') activeScreenIssues.push(SPOTS_OPTIONS.find(o => o.id === screenSpotsCondition)?.label);
    if (screenLinesCondition !== 'none') activeScreenIssues.push(LINES_OPTIONS.find(o => o.id === screenLinesCondition)?.label);

    const activeBodyIssues = [];
    if (bodyScratchCondition !== 'none') activeBodyIssues.push(BODY_SCRATCH_OPTIONS.find(o => o.id === bodyScratchCondition)?.label);
    if (dentTopCondition !== 'none') activeBodyIssues.push(`Top: ${DENT_TOP_OPTIONS.find(o => o.id === dentTopCondition)?.label}`);
    if (dentBaseCondition !== 'none') activeBodyIssues.push(`Base: ${DENT_BASE_OPTIONS.find(o => o.id === dentBaseCondition)?.label}`);
    if (looseHingesCondition !== 'none') activeBodyIssues.push(HINGES_OPTIONS.find(o => o.id === looseHingesCondition)?.label);
    if (panelCondition !== 'none') activeBodyIssues.push(PANEL_OPTIONS.find(o => o.id === panelCondition)?.label);

    updateQuote({
      device: {
        ...device,
        category: 'laptop',
        brand,
        modelName: device.modelName,
        slug,
        ...specs,
        deviceAge: ageLabel,
        yearBracket: age,
        powerStatus,
        screenSize,
        gpuStatus,
        hasGpu: gpuStatus === 'available',
        isGpuWorking: gpuStatus === 'available',
        functionalIssues: issuesList,
        screenScratchCondition,
        screenDiscolourCondition,
        screenSpotsCondition,
        screenLinesCondition,
        screenIssues: activeScreenIssues,
        bodyScratchCondition,
        dentTopCondition,
        dentBaseCondition,
        looseHingesCondition,
        panelCondition,
        bodyIssues: activeBodyIssues,
        accessories: accessories
      },
      priceBreakdown: breakdown,
      price: currentPrice
    });

    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetBestPrice = () => {
    if (!age) setAge('twoToThree');
    setShowOtpModal(true);
  };

  const handleSchedulePickup = () => {
    if (!isAuthenticated) navigate('/login?returnUrl=/schedule-pickup');
    else navigate('/schedule-pickup');
  };

  if (loading) return <Loader />;
  if (!device) return <div className="text-center py-20 font-black text-gray-700">Device not found</div>;

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header Progress */}
          <div className="flex justify-center gap-12 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#087F8C] text-white flex items-center justify-center font-black">1</span>
              <span className="text-[#111827] font-black">Offer Details</span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black">2</span>
              <span className="text-gray-500 font-black">Pickup & Payment</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="flex-1 space-y-8">

              {/* Offer Card */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 sm:p-14 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-12">
                  <div className="w-44 h-44 bg-gray-50 rounded-[40px] flex items-center justify-center p-8">
                    <img src={device.imageUrl} alt={device.modelName} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[#087F8C] text-xs font-black uppercase tracking-wider mb-2 block">Offer ready — instant payout</span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#111827] mb-4">
                      {device.modelName} {specs.ram && specs.storage && <span className="text-gray-600 font-bold text-sm">({specs.ram}/{specs.storage})</span>}
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-5 mb-6">
                      <span className="text-4xl font-black text-[#111827] tracking-tighter">{formatCurrency(currentPrice)}</span>
                      <div className="flex items-center gap-2 bg-[#087F8C]/5 text-[#087F8C] px-3 py-1.5 rounded-xl border border-[#087F8C]/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        <span className="text-xs font-black uppercase tracking-widest">Guaranteed</span>
                      </div>
                    </div>
                    <button onClick={() => setShowResult(false)} className="text-[#087F8C] font-black text-sm underline underline-offset-8 hover:text-[#066772] transition-all">Recalculate</button>
                  </div>
                </div>

                <div className="mt-14 space-y-6 pt-12 border-t border-gray-50">
                  <CheckboxRow label={`Receive updates via Whatsapp (+91 ${user?.phone || 'XXXXXXXXXX'})`} checked />
                  <CheckboxRow label="I agree to the terms and conditions and understand that the final value is subject to physical device inspection by our technician." checked />
                </div>

                <button
                  onClick={handleSchedulePickup}
                  className="w-full mt-12 btn-gradient text-white font-black py-7 rounded-[32px] transition-all shadow-2xl shadow-[#087F8C]/20 text-xl flex items-center justify-center gap-3 group cursor-pointer"
                >
                  Get My {formatCurrency(currentPrice)} Now
                  <svg className="transition-transform group-hover:translate-x-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>

                <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-4 text-[13px] font-black text-gray-600">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" /> Free doorstep pickup</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" /> Instant payment at pickup</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" /> Price locked for 24h</span>
                </div>
              </div>

              {/* Evaluation Detail (Specs Added Here) */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm">
                <h3 className="text-2xl font-black text-[#111827] mb-12">Laptop Evaluation Detail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                  <EvaluationDetailRow label="Device" value={device.modelName} color="#087F8C" />
                  <EvaluationDetailRow label="Processor" value={specs.processor || 'Standard'} color="#087F8C" />
                  {!isApple && <EvaluationDetailRow label="Generation" value={specs.generation || 'Standard'} color="#087F8C" />}
                  <EvaluationDetailRow label="RAM" value={specs.ram || 'Standard'} color="#087F8C" />
                  <EvaluationDetailRow label="Storage" value={specs.storage || 'Standard'} color="#087F8C" />
                  <EvaluationDetailRow label="Power Status" value={powerStatus === 'on' ? 'Turns On' : 'Does Not Turn On (Off)'} color={powerStatus === 'on' ? '#087F8C' : '#EF4444'} />
                  <EvaluationDetailRow label="Screen Size" value={screenSize ? SCREEN_SIZE_OPTIONS.find(o => o.key === screenSize)?.label : '-'} color="#087F8C" />
                  {!isApple && (
                    <EvaluationDetailRow
                      label="External GPU"
                      value={gpuStatus === 'available' ? 'Available' : gpuStatus === 'not_working' ? 'Not Working' : 'Not Available'}
                      color={gpuStatus === 'available' ? '#087F8C' : '#EF4444'}
                    />
                  )}
                  <EvaluationDetailRow label="Device Age" value={age ? (AGE_OPTIONS.find(o => o.key === age)?.label || age) : '-'} color="#087F8C" />
                  <EvaluationDetailRow label="Functional Issues" value={issuesList.length > 0 ? issuesList.length + ' issue(s)' : 'No Issues'} color={issuesList.length > 0 ? '#EF4444' : '#087F8C'} />
                  <EvaluationDetailRow
                    label="Screen Condition"
                    value={
                      screenScratchCondition !== 'none' || screenDiscolourCondition !== 'none' || screenSpotsCondition !== 'none' || screenLinesCondition !== 'none'
                        ? [
                            screenScratchCondition !== 'none' ? SCRATCH_OPTIONS.find(o => o.id === screenScratchCondition)?.label : null,
                            screenDiscolourCondition !== 'none' ? DISCOLOUR_OPTIONS.find(o => o.id === screenDiscolourCondition)?.label : null,
                            screenSpotsCondition !== 'none' ? SPOTS_OPTIONS.find(o => o.id === screenSpotsCondition)?.label : null,
                            screenLinesCondition !== 'none' ? LINES_OPTIONS.find(o => o.id === screenLinesCondition)?.label : null,
                          ].filter(Boolean).join(' • ')
                        : 'No Scratches / Discolouration / Spots / Lines'
                    }
                    color={screenScratchCondition !== 'none' || screenDiscolourCondition !== 'none' || screenSpotsCondition !== 'none' || screenLinesCondition !== 'none' ? '#EF4444' : '#087F8C'}
                  />
                  <EvaluationDetailRow
                    label="Body Condition"
                    value={
                      bodyScratchCondition !== 'none' || dentTopCondition !== 'none' || dentBaseCondition !== 'none' || looseHingesCondition !== 'none' || panelCondition !== 'none'
                        ? [
                            bodyScratchCondition !== 'none' ? BODY_SCRATCH_OPTIONS.find(o => o.id === bodyScratchCondition)?.label : null,
                            dentTopCondition !== 'none' ? `Top: ${DENT_TOP_OPTIONS.find(o => o.id === dentTopCondition)?.label}` : null,
                            dentBaseCondition !== 'none' ? `Base: ${DENT_BASE_OPTIONS.find(o => o.id === dentBaseCondition)?.label}` : null,
                            looseHingesCondition !== 'none' ? HINGES_OPTIONS.find(o => o.id === looseHingesCondition)?.label : null,
                            panelCondition !== 'none' ? PANEL_OPTIONS.find(o => o.id === panelCondition)?.label : null,
                          ].filter(Boolean).join(' • ')
                        : 'No Scratches / Dents / Hinge Issues'
                    }
                    color={bodyScratchCondition !== 'none' || dentTopCondition !== 'none' || dentBaseCondition !== 'none' || looseHingesCondition !== 'none' || panelCondition !== 'none' ? '#EF4444' : '#087F8C'}
                  />
                  <EvaluationDetailRow label="Accessories" value={accessories.length > 0 ? accessories.map(a => a === 'charger' ? 'Original Charger' : a === 'box' ? 'Original Box' : a).join(', ') : 'None'} color="#087F8C" />
                </div>
              </div>
            </div>

            {/* Sidebars */}
            <div className="w-full lg:w-[400px] space-y-8">
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                <h3 className="text-xl font-black text-[#111827] mb-8">Offer Summary</h3>
                <div className="space-y-6">
                  <SummaryPriceRow label="Base Price" value={breakdown?.basePrice} />
                  {breakdown?.powerDeduction < 0 && (
                    <SummaryPriceRow label="Power Off Deduction" value={breakdown?.powerDeduction} />
                  )}
                  <SummaryPriceRow label="Pickup Fee" value={0} original={100} isFree />
                  <SummaryPriceRow label="Processing" value={0} original={150} isFree />
                  <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-lg font-black text-[#111827]">Final Payout</span>
                    <span className="text-3xl font-black text-[#087F8C]">{formatCurrency(currentPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Policy */}
              <div className="bg-[#111827] rounded-[40px] p-10 text-white">
                <h4 className="text-lg font-black mb-4">Pickup Policy</h4>
                <p className="text-gray-300 text-sm font-bold leading-relaxed">
                  Our technician will verify the laptop at your doorstep. Please ensure the laptop is charged and all data is backed up. Payment is instant.
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
    <div className="bg-[#F9FAFB] min-h-screen py-8 px-4 sm:px-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Header summary of current device */}
        <div className="bg-white rounded-[32px] p-8 mb-8 border border-gray-100 flex items-center gap-8 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-3">
            <img src={device.imageUrl} alt={device.modelName} className="max-h-full object-contain" />
          </div>
          <div>
            <p className="text-[#087F8C] text-[10px] font-black uppercase tracking-widest mb-1">Evaluating</p>
            <h1 className="text-xl font-black text-[#111827]">{device.modelName}</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Quiz Section */}
          <div className="flex-1 space-y-8">

            {/* Stepper tracker */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                {STEPS.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase tracking-tight ${idx === currentStepIndex ? 'text-[#087F8C]' : 'text-gray-500'}`}>
                      {s.label}
                    </span>
                    {idx < STEPS.length - 1 && <span className="text-gray-400 text-xs font-bold">&gt;</span>}
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

            {/* Active Question Card */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm transition-all duration-500">

              {/* STEP 1: Power Status (Cashify Step 1: Does the Laptop switch on?) */}
              {STEPS[currentStepIndex]?.id === 'power' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">1. Does the Laptop switch on?</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Please select the current power state of your device</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPowerStatus('on')}
                      className={`py-6 rounded-2xl border-2 font-black text-base transition-all cursor-pointer
                        ${powerStatus === 'on'
                          ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] ring-2 ring-[#087F8C]/20'
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                    >
                      Yes, Turns On
                    </button>
                    <button
                      onClick={() => setPowerStatus('off')}
                      className={`py-6 rounded-2xl border-2 font-black text-base transition-all cursor-pointer
                        ${powerStatus === 'off'
                          ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] ring-2 ring-[#087F8C]/20'
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                    >
                      No, Does Not Turn On (Off)
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Specs (Cashify Step 2: System Configuration Details) */}
              {STEPS[currentStepIndex]?.id === 'specs' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">System Configuration Details</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      Choose your laptop's processor, memory (RAM), and storage configuration from the options below.
                    </p>
                  </div>

                  <div className="space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                    <ConfigDropdown
                      label="Processor"
                      value={specs?.processor || ''}
                      options={processorOptions}
                      placeholder="Select Processor"
                      onChange={(val) => setSpecs(prev => ({ ...(prev || {}), processor: val }))}
                    />

                    <ConfigDropdown
                      label="RAM"
                      value={specs?.ram || ''}
                      options={ramOptions}
                      placeholder="Select RAM"
                      onChange={(val) => setSpecs(prev => ({ ...(prev || {}), ram: val }))}
                    />

                    <ConfigDropdown
                      label="Hard Disk"
                      value={specs?.storage || ''}
                      options={hardDiskOptions}
                      placeholder="Select Hard Disk"
                      onChange={(val) => setSpecs(prev => ({ ...(prev || {}), storage: val }))}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Additional Features (Cashify Step 3: Screen Size & External Graphics Card) */}
              {STEPS[currentStepIndex]?.id === 'screenSize' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">
                      3. Select the additional features of your device?
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      Please select your device additional features
                    </p>
                  </div>

                  {/* Section 1: Screen Size */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Screen Size</h4>
                      <p className="text-xs text-gray-500">Check your device's screen size</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {SCREEN_SIZE_OPTIONS.map(opt => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setScreenSize(opt.key)}
                          className={`py-5 px-4 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer text-center
                            ${screenSize === opt.key
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] ring-2 ring-[#087F8C]/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: External Graphics Card (NVIDIA/ AMD) */}
                  {!isApple && (
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">External Graphics Card (NVIDIA/ AMD)</h4>
                        <p className="text-xs text-gray-500">Check your device's external graphics cards</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {GPU_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setGpuStatus(opt.id)}
                            className={`py-5 px-4 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer text-center
                              ${gpuStatus === opt.id
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Functional Issues (Cashify Step 4: Does your device function properly?) */}
              {STEPS[currentStepIndex]?.id === 'functional' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">4. Does your device function properly?</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Select any faulty components (leave unselected if working perfectly and click Next)</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-2 no-scrollbar">
                    {functionalOptions.map(i => {
                      const isSelected = issuesList.includes(i.id);
                      const IconComponent = i.icon;
                      return (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => {
                            setIssuesList(prev => prev.includes(i.id) ? prev.filter(x => x !== i.id) : [...prev, i.id]);
                          }}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all relative h-36 cursor-pointer
                            ${isSelected ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-200'}`}
                        >
                          <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                            {typeof IconComponent === 'function' ? <IconComponent className="w-8 h-8" /> : <span className="text-3xl">{IconComponent}</span>}
                          </div>
                          <span className="text-[13px] font-bold text-center leading-tight">{i.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Screen Condition (Cashify Step 5: Select the screen condition of your device?) */}
              {STEPS[currentStepIndex]?.id === 'screen' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">
                      5. Select the screen condition of your device?
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      The better condition your device is in, we will pay you more
                    </p>
                  </div>

                  {/* Section 1: Scratch or Broken on Screen */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Scratch or Broken on Screen
                      </h4>
                      <p className="text-xs text-gray-500">
                        Select the screen scratch or broken condition.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {SCRATCH_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = screenScratchCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setScreenScratchCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Discolouration on Screen */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Discolouration on Screen
                      </h4>
                      <p className="text-xs text-gray-500">
                        Select the screen discolouration condition.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {DISCOLOUR_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = screenDiscolourCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setScreenDiscolourCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Spots on Screen */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Spots on Screen
                      </h4>
                      <p className="text-xs text-gray-500">
                        Select the screen spot condition.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {SPOTS_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = screenSpotsCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setScreenSpotsCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 4: Line on Screen */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Line on Screen
                      </h4>
                      <p className="text-xs text-gray-500">
                        Select the screen visible lines/flickering and dots condition.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {LINES_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = screenLinesCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setScreenLinesCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Accessories (Cashify Step 6: Do you have the following?) */}
              {STEPS[currentStepIndex]?.id === 'accessories' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">6. Do you have the following?</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Please select accessories which are available</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {accessoryOptions.map(i => {
                      const isSelected = accessories.includes(i.id);
                      const IconComponent = i.icon;
                      return (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => {
                            setAccessories(prev => prev.includes(i.id) ? prev.filter(x => x !== i.id) : [...prev, i.id]);
                          }}
                          className={`p-6 rounded-[24px] border-2 text-left transition-all flex flex-col justify-between h-44 group cursor-pointer
                            ${isSelected ? 'border-[#087F8C] bg-[#E8F6F7]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className="p-3 bg-[#E8F6F7] text-[#087F8C] rounded-2xl">
                              {typeof IconComponent === 'function' ? <IconComponent className="w-8 h-8" /> : <span className="text-3xl">{IconComponent}</span>}
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                              ${isSelected ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-300'}`}>
                              {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>}
                            </div>
                          </div>
                          <div>
                            <p className={`font-black text-[15px] ${isSelected ? 'text-[#087F8C]' : 'text-[#111827]'}`}>{i.label}</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">{i.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: Device Age (Cashify Step 7: Age of your device) */}
              {STEPS[currentStepIndex]?.id === 'age' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">7. Age of your device</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Select how long you have owned this device</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {AGE_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setAge(opt.key)}
                        className={`flex items-center gap-4 px-6 py-5 rounded-2xl border-[1.5px] font-semibold text-left transition-all w-full cursor-pointer
                          ${age === opt.key ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 text-gray-800 bg-white hover:border-gray-200'}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                          ${age === opt.key ? 'border-[#087F8C]' : 'border-gray-300'}`}
                        >
                          {age === opt.key && (
                            <div className="w-3 h-3 rounded-full bg-[#087F8C]" />
                          )}
                        </div>
                        <span className="text-base font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Physical condition / Body (Cashify Step 8: 5 Structured Sections) */}
              {STEPS[currentStepIndex]?.id === 'body' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">
                      8. Physical condition / Body
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      Select the physical condition of the outer body panels and hinges
                    </p>
                  </div>

                  {/* Section 1: Scratches on Body */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Scratches on Body</h4>
                      <p className="text-xs text-gray-500">Select the body scratch condition</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {BODY_SCRATCH_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = bodyScratchCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setBodyScratchCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Dent on Top Panel */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Dent on Top Panel</h4>
                      <p className="text-xs text-gray-500">Select the device top panel dent condition</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {DENT_TOP_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = dentTopCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setDentTopCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Dent on Base Panel */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Dent on Base Panel</h4>
                      <p className="text-xs text-gray-500">Select the device base panel dent condition</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {DENT_BASE_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = dentBaseCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setDentBaseCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 4: Loose Hinges */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Loose Hinges</h4>
                      <p className="text-xs text-gray-500">Select the device loose hinges condition</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {HINGES_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = looseHingesCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setLooseHingesCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 5: Cracked or Loose Panel */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Cracked or Loose Panel</h4>
                      <p className="text-xs text-gray-500">Select the device cracked or loose panel condition</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {PANEL_OPTIONS.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = panelCondition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPanelCondition(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[160px] ${
                              isSelected
                                ? 'border-[#087F8C] bg-[#E8F6F7] shadow-xs ring-2 ring-[#087F8C]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="my-2">
                              <IconComp className="w-16 h-12" />
                            </div>
                            <span className={`text-xs font-black ${isSelected ? 'text-[#087F8C]' : 'text-gray-800'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Stepper buttons row */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentStepIndex === 0}
                  className="px-8 py-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  ← Back
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    disabled={
                      (STEPS[currentStepIndex]?.id === 'power' && powerStatus === null) ||
                      (STEPS[currentStepIndex]?.id === 'screenSize' && screenSize === null) ||
                      (STEPS[currentStepIndex]?.id === 'age' && age === null)
                    }
                    className="btn-gradient text-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-[#087F8C]/15"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGetBestPrice}
                    className="btn-gradient text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-[#087F8C]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    GET BEST PRICE <span className="text-lg">›</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right Sidebar Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-8 space-y-8">
              <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
                <h4 className="text-sm font-black text-gray-700 uppercase tracking-widest">Summary</h4>

                {/* Cashify Up To Value banner */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block mb-1">
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

                <div className="space-y-5">
                  <SummaryItem label="Power Status" value={powerStatus ? (powerStatus === 'on' ? 'Turns On' : 'Does Not Turn On') : '-'} active={powerStatus !== null} />
                  <SummaryItem label="Processor" value={specs?.processor || '-'} active={true} />
                  <SummaryItem label="RAM" value={specs?.ram || '-'} active={true} />
                  <SummaryItem label="Hard Disk" value={specs?.storage || '-'} active={true} />
                  <SummaryItem label="Screen Size" value={screenSize ? SCREEN_SIZE_OPTIONS.find(o => o.key === screenSize)?.label : '-'} active={screenSize !== null} />
                  {!isApple && (
                    <SummaryItem
                      label="External GPU"
                      value={gpuStatus === 'available' ? 'Available' : gpuStatus === 'not_working' ? 'Not Working' : 'Not Available'}
                      active={gpuStatus !== null}
                    />
                  )}
                  <SummaryItem
                    label="Functional"
                    value={issuesList.length > 0 ? `${issuesList.length} issue(s)` : currentStepIndex >= STEPS.findIndex(s => s.id === 'functional') ? 'No Issues' : '-'}
                    active={currentStepIndex >= STEPS.findIndex(s => s.id === 'functional')}
                  />
                  <SummaryItem
                    label="Screen"
                    value={
                      screenScratchCondition !== 'none' || screenDiscolourCondition !== 'none' || screenSpotsCondition !== 'none' || screenLinesCondition !== 'none'
                        ? [
                            screenScratchCondition !== 'none' ? SCRATCH_OPTIONS.find(o => o.id === screenScratchCondition)?.label : null,
                            screenDiscolourCondition !== 'none' ? DISCOLOUR_OPTIONS.find(o => o.id === screenDiscolourCondition)?.label : null,
                            screenSpotsCondition !== 'none' ? SPOTS_OPTIONS.find(o => o.id === screenSpotsCondition)?.label : null,
                            screenLinesCondition !== 'none' ? LINES_OPTIONS.find(o => o.id === screenLinesCondition)?.label : null,
                          ].filter(Boolean).join(' • ')
                        : currentStepIndex >= STEPS.findIndex(s => s.id === 'screen')
                        ? 'No Scratches / Discolouration / Spots / Lines'
                        : '-'
                    }
                    active={currentStepIndex >= STEPS.findIndex(s => s.id === 'screen')}
                  />
                  <SummaryItem
                    label="Accessories"
                    value={accessories.length > 0 ? accessories.map(a => a === 'charger' ? 'Original Charger' : a === 'box' ? 'Original Box' : a).join(', ') : currentStepIndex >= STEPS.findIndex(s => s.id === 'accessories') ? 'None' : '-'}
                    active={currentStepIndex >= STEPS.findIndex(s => s.id === 'accessories')}
                  />
                  <SummaryItem
                    label="Age"
                    value={age ? (AGE_OPTIONS.find(o => o.key === age)?.label || age) : '-'}
                    active={currentStepIndex >= STEPS.findIndex(s => s.id === 'age')}
                  />
                  <SummaryItem
                    label="Body"
                    value={
                      bodyScratchCondition !== 'none' || dentTopCondition !== 'none' || dentBaseCondition !== 'none' || looseHingesCondition !== 'none' || panelCondition !== 'none'
                        ? [
                            bodyScratchCondition !== 'none' ? BODY_SCRATCH_OPTIONS.find(o => o.id === bodyScratchCondition)?.label : null,
                            dentTopCondition !== 'none' ? `Top Dent: ${DENT_TOP_OPTIONS.find(o => o.id === dentTopCondition)?.label}` : null,
                            dentBaseCondition !== 'none' ? `Base Dent: ${DENT_BASE_OPTIONS.find(o => o.id === dentBaseCondition)?.label}` : null,
                            looseHingesCondition !== 'none' ? HINGES_OPTIONS.find(o => o.id === looseHingesCondition)?.label : null,
                            panelCondition !== 'none' ? PANEL_OPTIONS.find(o => o.id === panelCondition)?.label : null,
                          ].filter(Boolean).join(' • ')
                        : currentStepIndex >= STEPS.findIndex(s => s.id === 'body')
                        ? 'No Scratches / Dents / Hinge Issues'
                        : '-'
                    }
                    active={currentStepIndex >= STEPS.findIndex(s => s.id === 'body')}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5">
                    <Lock size={12} className="text-[#087F8C]" />
                    Exact Valuation Locked until mobile OTP verification
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <LaptopSpecModal isOpen={isSpecsModalOpen} onClose={() => setIsSpecsModalOpen(false)} device={device} onComplete={handleSpecsUpdate} initialValues={specs} />

      {/* Unified Evaluation OTP Modal */}
      <EvaluationOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          finalizeAndShowResult();
        }}
        deviceName={device?.modelName || 'Laptop'}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---
function CheckboxRow({ label, checked }) {
  return (
    <label className="flex items-start gap-5 cursor-pointer group">
      <div className="relative mt-1">
        <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
        <div className="w-7 h-7 border-2 border-gray-200 rounded-xl peer-checked:bg-[#087F8C] peer-checked:border-[#087F8C] transition-all shadow-sm" />
        <svg className="absolute top-1.5 left-1.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <span className="text-sm font-bold text-gray-700 leading-relaxed group-hover:text-[#111827] transition-colors">{label}</span>
    </label>
  );
}

function EvaluationDetailRow({ label, value, color }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-black text-gray-600 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-black text-[#111827]">{value || 'N/A'}</span>
      </div>
    </div>
  );
}

function SummaryPriceRow({ label, value, original, isFree }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-black text-gray-600 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-3">
        {original && <span className="text-sm text-gray-400 font-bold line-through">₹{original}</span>}
        <span className={`font-black ${isFree ? 'text-[#087F8C]' : 'text-[#111827]'}`}>{isFree ? 'Free' : formatCurrency(value)}</span>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, active }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-[#111827]">{label}</h4>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#087F8C]' : 'bg-gray-300'}`} />
        <p className={`text-[13px] font-bold ${active ? 'text-gray-800' : 'text-gray-500'}`}>{value}</p>
      </div>
    </div>
  );
}

function ConfigDropdown({ label, value, options, onChange, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-gray-800">{label}</label>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="w-full bg-white border border-gray-200 hover:border-[#087F8C] rounded-2xl px-5 py-4 text-left flex items-center justify-between transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#087F8C]/20 cursor-pointer"
      >
        <span className={`text-base font-semibold ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#087F8C]' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {options.length > 8 && (
            <div className="p-3 border-b border-gray-100 bg-gray-50/70">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${label}...`}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#087F8C] focus:ring-1 focus:ring-[#087F8C] text-gray-800"
                autoFocus
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-gray-50">
            {filtered.length > 0 ? (
              filtered.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    opt === value
                      ? 'bg-[#E8F6F7] text-[#087F8C] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{opt}</span>
                  {opt === value && (
                    <svg className="w-4 h-4 text-[#087F8C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}