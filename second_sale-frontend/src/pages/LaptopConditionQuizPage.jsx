import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { useQuote } from '../hooks/useQuote';
import { useAuth } from '../hooks/useAuth';
import { calculateLaptopPrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/ui/Loader';
import LaptopSpecModal from '../components/LaptopSpecModal';
import EvaluationOtpModal from '../components/quiz/EvaluationOtpModal';
import { Lock } from 'lucide-react';
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
  BluetoothIcon,
  PhoneBodyGoodIcon,
  PhoneBodyAverageIcon,
  PhoneBodyBelowAverageIcon,
  BillDocumentIcon,
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
} from '../components/quiz/QuizIcons';

const STEPS = [
  { id: 'specs', label: 'Specs' },
  { id: 'power', label: 'Power Status' },
  { id: 'screenSize', label: 'Screen Size' },
  { id: 'screen', label: 'Screen Condition' },
  { id: 'body', label: 'Body Condition' },
  { id: 'functional', label: 'Functional Issues' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'age', label: 'Device Age' },
];

const AGE_OPTIONS = [
  { key: 'lessThan1', label: 'Less than 1 year (in warranty)' },
  { key: 'oneToTwo', label: 'Between 1 and 3 years' },
  { key: 'twoToThree', label: 'More than 3 years' },
];

const SCREEN_SIZE_OPTIONS = [
  { key: '10-11', label: '10-11 inches' },
  { key: '12-13', label: '12-13 inches' },
  { key: '14-15', label: '14-15 inches' },
  { key: 'above15', label: 'Above 15 inches' },
];

// Cashify Exact Laptop Screen Condition
const SCRATCH_OPTIONS = [
  { id: 'none', label: 'No scratches on screen', icon: LaptopScreenFlawlessIcon, deductionKey: 'screen_flawless' },
  { id: 'minor', label: '1-2 scratches on screen', icon: LaptopScreenMinorScratchesIcon, deductionKey: 'screen_scratches_minor' },
  { id: 'major', label: 'More than 2 scratches on screen', icon: LaptopScreenMajorScratchesIcon, deductionKey: 'screen_scratches_major' },
  { id: 'cracked', label: 'Screen Cracked or Broken', icon: LaptopScreenCrackedIcon, deductionKey: 'screen_cracked' },
];

const DISCOLOUR_OPTIONS = [
  { id: 'none', label: 'No Discolouration', icon: LaptopScreenFlawlessIcon, deductionKey: 'screen_discolour_none' },
  { id: 'minor', label: 'Minor Discolouration', icon: LaptopScreenDiscolourMinorIcon, deductionKey: 'screen_discolour_minor' },
  { id: 'major', label: 'Major Discolouration', icon: LaptopScreenDiscolourMajorIcon, deductionKey: 'screen_discolour_major' },
];

const SPOTS_OPTIONS = [
  { id: 'none', label: 'No spots on screen', icon: LaptopScreenFlawlessIcon, deductionKey: 'screen_spots_none' },
  { id: 'minor', label: '1-2 minor spots on screen', icon: LaptopScreenMinorSpotsIcon, deductionKey: 'screen_spots_minor' },
  { id: 'major', label: 'Large/ heavy visible spots on screen', icon: LaptopScreenMajorSpotsIcon, deductionKey: 'screen_spots_major' },
];

const LINES_OPTIONS = [
  { id: 'none', label: 'No Lines', icon: LaptopScreenFlawlessIcon, deductionKey: 'screen_lines_none' },
  { id: 'visible_lines', label: 'Visible lines on Screen', icon: LaptopScreenVisibleLinesIcon, deductionKey: 'screen_lines_visible' },
  { id: 'flickering', label: 'Display flickering', icon: LaptopScreenFlickeringIcon, deductionKey: 'screen_lines_flickering' },
  { id: 'black_dots', label: 'Black Dots on Screen', icon: LaptopScreenBlackDotsIcon, deductionKey: 'screen_lines_black_dots' },
];

const functionalOptions = [
  { id: 'keyboard', label: 'Keyboard not working / key(s) missing', icon: KeyboardIcon, pct: '7%' },
  { id: 'cdDrive', label: 'CD/DVD Drive not working', icon: OpticalDiscIcon, pct: '7%' },
  { id: 'trackpad', label: 'Touchpad not working / click faulty', icon: TrackpadIcon, pct: '18%' },
  { id: 'battery', label: 'Battery dead / backup < 60 mins', icon: BatteryWarningIcon, pct: '6%' },
  { id: 'speakers', label: 'Speakers faulty / cracked sound', icon: SpeakerIcon, pct: '3%' },
  { id: 'wifi', label: 'Wi-Fi not working', icon: WifiSignalIcon, pct: '5%' },
  { id: 'ports', label: 'USB Port not working', icon: UsbPortIcon, pct: '8%' },
  { id: 'webcam', label: 'Web Cam not working', icon: WebcamIcon, pct: '6%' },
  { id: 'charging', label: 'Charging Port not working', icon: ChargingPortIcon, pct: '8%' },
  { id: 'hardDisk', label: 'Hard Drive Missing / Defective', icon: HardDriveIcon, pct: '10%' },
  { id: 'motherboard', label: 'Motherboard issue (restart/hang/heat)', icon: MotherboardIcon, pct: '35%' },
  { id: 'bluetooth', label: 'Bluetooth not working', icon: BluetoothIcon, pct: '6%' },
];

const bodyOptions = [
  { id: 'minorDentTop', label: 'Minor dent on top panel', icon: PhoneBodyAverageIcon, pct: '8%' },
  { id: 'minorDentBase', label: 'Minor dent on base panel', icon: PhoneBodyAverageIcon, pct: '8%' },
  { id: 'majorDentTop', label: 'Major dent on top panel', icon: PhoneBodyBelowAverageIcon, pct: '35%' },
  { id: 'majorDentBase', label: 'Major dent on base panel', icon: PhoneBodyBelowAverageIcon, pct: '40%' },
  { id: 'minorScratch', label: 'Minor scratch on body', icon: PhoneBodyGoodIcon, pct: '5%' },
  { id: 'majorScratch', label: 'Major scratch on body', icon: PhoneBodyAverageIcon, pct: '8%' },
];

const accessoryOptions = [
  { id: 'bill', label: 'GST Valid Bill', desc: 'Valid purchase invoice', icon: BillDocumentIcon },
  { id: 'box', label: 'Original Box', desc: 'Original purchase box', icon: BoxPackagingIcon },
  { id: 'charger', label: 'Original Charger', desc: 'Original charging adapter', icon: ChargerPlugIcon }
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

  // Selections
  const [powerStatus, setPowerStatus] = useState(null); // 'on' | 'off'
  const [screenSize, setScreenSize] = useState(null); // '10-11' | '12-13' | '14-15' | 'above15'
  const [hasGpu, setHasGpu] = useState(null); // 'yes' | 'no'
  const [isGpuWorking, setIsGpuWorking] = useState(null); // 'yes' | 'no'
  const [issuesList, setIssuesList] = useState([]); // functional issues
  const [screenScratchCondition, setScreenScratchCondition] = useState('none'); // 'none' | 'minor' | 'major' | 'cracked'
  const [screenDiscolourCondition, setScreenDiscolourCondition] = useState('none'); // 'none' | 'minor' | 'major'
  const [screenSpotsCondition, setScreenSpotsCondition] = useState('none'); // 'none' | 'minor' | 'major'
  const [screenLinesCondition, setScreenLinesCondition] = useState('none'); // 'none' | 'visible_lines' | 'flickering' | 'black_dots'
  const [bodyIssuesList, setBodyIssuesList] = useState([]);
  const [accessories, setAccessories] = useState([]); // default active
  const [age, setAge] = useState(null); // age option key

  const isApple = (brand || '').toLowerCase() === 'apple' || (device?.brand || '').toLowerCase() === 'apple';

  useEffect(() => {
    deviceService.getDevice(slug).then(res => {
      const dev = res.data;
      setDevice(dev);
      setLoading(false);
      const devIsApple = (brand || '').toLowerCase() === 'apple' || (dev?.brand || '').toLowerCase() === 'apple';
      const isBadAppleSpecs = devIsApple && specs && (
        specs.processor?.includes('Intel Core i3') ||
        specs.storage?.includes('HDD') ||
        specs.ram === '4GB' ||
        specs.ram === '6GB'
      );
      if ((!specs || isBadAppleSpecs) && dev) {
        const defVariant = dev.variants?.[0] || {};
        const defaultAppleProc = dev.modelName?.includes('2025') || dev.modelName?.includes('2026') 
          ? 'Apple M4' 
          : (dev.modelName?.includes('2024') || dev.modelName?.includes('2023') ? 'Apple M3' : 'Apple M2');
        setSpecs({
          processor: dev.processorFamily || dev.processor || (devIsApple ? defaultAppleProc : 'Intel Core i5'),
          ram: defVariant.ram || dev.ram || (devIsApple ? '16 GB' : '8 GB'),
          storage: defVariant.storage || (dev.storage && !dev.storage.includes('HDD') ? dev.storage : (devIsApple ? '256 GB SSD' : '512 GB SSD'))
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

    return calculateLaptopPrice(device, {
      ...specs,
      yearBracket: age,
      powerStatus: powerStatus,
      screenSize: screenSize,
      hasGpu: hasGpu === 'yes',
      isGpuWorking: isGpuWorking === 'yes',
      functionalIssues: issuesList,
      screenIssues: activeScreenIssues,
      bodyIssues: bodyIssuesList,
      accessories: accessories.length > 0 ? accessories : ['none']
    });
  }, [device, specs, age, powerStatus, screenSize, hasGpu, isGpuWorking, issuesList, screenScratchCondition, screenDiscolourCondition, screenSpotsCondition, screenLinesCondition, bodyIssuesList, accessories]);

  const currentPrice = breakdown?.finalPrice || 0;

  const handleSpecsUpdate = (newSpecs) => {
    setSpecs(newSpecs);
    setIsSpecsModalOpen(false);
  };

  const finalizeAndShowResult = () => {
    const ageLabel = AGE_OPTIONS.find(o => o.key === age)?.label || age;

    const activeScreenIssues = [];
    if (screenScratchCondition !== 'none') activeScreenIssues.push(`screen_scratches_${screenScratchCondition}`);
    if (screenDiscolourCondition !== 'none') activeScreenIssues.push(`screen_discolour_${screenDiscolourCondition}`);
    if (screenSpotsCondition !== 'none') activeScreenIssues.push(`screen_spots_${screenSpotsCondition}`);
    if (screenLinesCondition !== 'none') activeScreenIssues.push(`screen_lines_${screenLinesCondition}`);

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
        hasGpu: hasGpu === 'yes',
        isGpuWorking: isGpuWorking === 'yes',
        functionalIssues: issuesList,
        screenScratchCondition,
        screenDiscolourCondition,
        screenSpotsCondition,
        screenLinesCondition,
        screenIssues: activeScreenIssues,
        bodyIssues: bodyIssuesList,
        accessories: accessories
      },
      priceBreakdown: breakdown,
      price: currentPrice
    });

    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetBestPrice = () => {
    if (!age) setAge('above_11');
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
                    <EvaluationDetailRow label="Dedicated GPU" value={hasGpu === 'yes' ? `Available (${isGpuWorking === 'yes' ? 'Working' : 'Not Working'})` : 'Not Available'} color={hasGpu === 'yes' && isGpuWorking === 'yes' ? '#087F8C' : '#EF4444'} />
                  )}
                  <EvaluationDetailRow label="Device Age" value={age ? AGE_OPTIONS.find(o => o.key === age).label : '-'} color="#087F8C" />
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
                  <EvaluationDetailRow label="Body Condition" value={bodyIssuesList.length > 0 ? bodyIssuesList.length + ' issue(s)' : 'No Issues'} color={bodyIssuesList.length > 0 ? '#EF4444' : '#087F8C'} />
                  <EvaluationDetailRow label="Accessories" value={accessories.length > 0 ? accessories.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : 'None'} color="#087F8C" />
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

              {/* STEP: Specs */}
              {STEPS[currentStepIndex]?.id === 'specs' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-[#111827]">1. Confirm Device Specifications</h3>
                  <div className="bg-gray-50 rounded-3xl p-8 space-y-4 mb-6 border border-gray-100">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                      <span className="text-sm font-bold text-gray-700">Processor</span>
                      <span className="text-sm font-black text-gray-900">{specs.processor || 'Standard'}</span>
                    </div>
                    {!isApple && (
                      <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                        <span className="text-sm font-bold text-gray-700">Generation</span>
                        <span className="text-sm font-black text-gray-900">{specs.generation || 'Standard'}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                      <span className="text-sm font-bold text-gray-700">RAM</span>
                      <span className="text-sm font-black text-gray-900">{specs.ram || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">Storage</span>
                      <span className="text-sm font-black text-gray-900">{specs.storage || 'Standard'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSpecsModalOpen(true)}
                    className="w-full py-4 border-2 border-gray-200 hover:border-[#087F8C] hover:bg-[#E8F6F7] hover:text-[#087F8C] rounded-2xl text-sm font-black text-gray-700 transition-all"
                  >
                    Modify Specifications
                  </button>
                </div>
              )}

              {/* STEP: Power Status */}
              {STEPS[currentStepIndex]?.id === 'power' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-[#111827]">2. Does the laptop turn on successfully?</h3>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest -mt-2">Select the current power state</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPowerStatus('on')}
                      className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                        ${powerStatus === 'on'
                          ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                    >
                      Yes, Turns On
                    </button>
                    <button
                      onClick={() => setPowerStatus('off')}
                      className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                        ${powerStatus === 'off'
                          ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                    >
                      No, Does Not Turn On (Off)
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: Screen Size & Dedicated GPU */}
              {STEPS[currentStepIndex]?.id === 'screenSize' && (
                <div className="space-y-8">
                  {/* Screen Size Question */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-[#111827]">3. What is the screen size of the laptop?</h3>
                      <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Select the screen size</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SCREEN_SIZE_OPTIONS.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setScreenSize(opt.key)}
                          className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                            ${screenSize === opt.key
                              ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Graphics Card Question (Non-Apple Laptops only, matching Cashify) */}
                  {!isApple && (
                    <>
                      <div className="space-y-4 pt-6 border-t border-gray-100">
                        <div>
                          <h3 className="text-lg font-black text-[#111827]">Does the laptop have a dedicated graphics card?</h3>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Select option to proceed</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              setHasGpu('yes');
                              setIsGpuWorking(null);
                            }}
                            className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                              ${hasGpu === 'yes'
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                          >
                            Yes, Dedicated GPU Available
                          </button>
                          <button
                            onClick={() => {
                              setHasGpu('no');
                              setIsGpuWorking(null);
                            }}
                            className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                              ${hasGpu === 'no'
                                ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                          >
                            No Dedicated GPU
                          </button>
                        </div>
                      </div>

                      {/* Sub-Question: Is it working? */}
                      {hasGpu === 'yes' && (
                        <div className="space-y-4 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div>
                            <h3 className="text-lg font-black text-[#111827]">Is the dedicated graphics card working properly?</h3>
                            <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Confirm GPU functionality</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => setIsGpuWorking('yes')}
                              className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                                ${isGpuWorking === 'yes'
                                  ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                            >
                              Yes, Working Properly
                            </button>
                            <button
                              onClick={() => setIsGpuWorking('no')}
                              className={`py-6 rounded-2xl border-2 font-black text-base transition-all
                                ${isGpuWorking === 'no'
                                  ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}
                            >
                              No, Graphics Card Issue / Not Working
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* STEP: Functional Issues */}
              {STEPS[currentStepIndex]?.id === 'functional' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">4. Select functional issues (if any)</h3>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Leave unselected if none apply and click Next</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                    {functionalOptions.map(i => {
                      const isSelected = issuesList.includes(i.id);
                      const IconComponent = i.icon;
                      return (
                        <button
                          key={i.id}
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

              {/* STEP: Screen Condition (Cashify Exact 2 Sections) */}
              {STEPS[currentStepIndex]?.id === 'screen' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">
                      Select the screen condition of your device?
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

              {/* STEP: Body Condition */}
              {STEPS[currentStepIndex]?.id === 'body' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">6. Select body damage/scratches (if any)</h3>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Leave unselected if none apply and click Next</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                    {bodyOptions.map(i => {
                      const isSelected = bodyIssuesList.includes(i.id);
                      const IconComponent = i.icon;
                      return (
                        <button
                          key={i.id}
                          onClick={() => {
                            setBodyIssuesList(prev => prev.includes(i.id) ? prev.filter(x => x !== i.id) : [...prev, i.id]);
                          }}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all h-36 cursor-pointer
                            ${isSelected ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-200'}`}
                        >
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                            {typeof IconComponent === 'function' ? <IconComponent className="w-8 h-12" /> : <span className="text-3xl">{IconComponent}</span>}
                          </div>
                          <span className="text-[13px] font-bold text-center leading-tight">{i.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP: Accessories */}
              {STEPS[currentStepIndex]?.id === 'accessories' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">7. Which original accessories do you have?</h3>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Select the accessories present with the laptop</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {accessoryOptions.map(i => {
                      const isSelected = accessories.includes(i.id);
                      const IconComponent = i.icon;
                      return (
                        <button
                          key={i.id}
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

              {/* STEP: Device Age */}
              {STEPS[currentStepIndex]?.id === 'age' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">8. How old is your laptop?</h3>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">Age determines final multiplier value</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {AGE_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
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

              {/* Stepper buttons row */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentStepIndex === 0}
                  className="px-8 py-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  ← Back
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    disabled={
                      (STEPS[currentStepIndex]?.id === 'power' && powerStatus === null) ||
                      (STEPS[currentStepIndex]?.id === 'screenSize' && (
                        screenSize === null ||
                        (!isApple && (
                          hasGpu === null ||
                          (hasGpu === 'yes' && isGpuWorking === null)
                        ))
                      ))
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
                  <SummaryItem label="Processor" value={specs.processor || '-'} active={true} />
                  <SummaryItem label="RAM" value={specs.ram || '-'} active={true} />
                  <SummaryItem label="Storage" value={specs.storage || '-'} active={true} />
                  <SummaryItem label="Power Status" value={powerStatus ? (powerStatus === 'on' ? 'Turns On' : 'Does Not Turn On') : '-'} active={powerStatus !== null} />
                  <SummaryItem label="Screen Size" value={screenSize ? SCREEN_SIZE_OPTIONS.find(o => o.key === screenSize)?.label : '-'} active={screenSize !== null} />
                  {!isApple && (
                    <SummaryItem label="Dedicated GPU" value={hasGpu ? (hasGpu === 'yes' ? `Yes (${isGpuWorking === 'yes' ? 'Working' : 'Not Working'})` : 'No') : '-'} active={hasGpu !== null} />
                  )}
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
                  <SummaryItem label="Body" value={bodyIssuesList.length > 0 ? `${bodyIssuesList.length} issue(s)` : currentStepIndex >= STEPS.findIndex(s => s.id === 'body') ? 'No Issues' : '-'} active={currentStepIndex >= STEPS.findIndex(s => s.id === 'body')} />
                  <SummaryItem label="Accessories" value={accessories.length > 0 ? accessories.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : currentStepIndex >= STEPS.findIndex(s => s.id === 'accessories') ? 'None' : '-'} active={currentStepIndex >= STEPS.findIndex(s => s.id === 'accessories')} />
                  <SummaryItem label="Age" value={age ? AGE_OPTIONS.find(o => o.key === age).label : '-'} active={currentStepIndex >= STEPS.findIndex(s => s.id === 'age')} />
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