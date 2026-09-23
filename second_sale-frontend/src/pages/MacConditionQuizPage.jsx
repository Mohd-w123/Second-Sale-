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
  TrackpadIcon,
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
  { id: 'screen', label: 'Screen Condition' },
  { id: 'body', label: 'Body Condition' },
  { id: 'functional', label: 'Functional' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'age', label: 'Device Age' },
];

const AGE_OPTIONS = [
  { key: 'lessThan1', label: 'Less than 1 year (in warranty)' },
  { key: 'oneToTwo', label: 'Between 1 and 3 years' },
  { key: 'twoToThree', label: 'More than 3 years' },
];

// Cashify Exact Mac Screen Condition
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

const functionalOptions = [
  { id: 'ports', label: 'Thunderbolt / USB Port issue', icon: UsbPortIcon, pct: '8%' },
  { id: 'wifi', label: 'Wi-Fi not working', icon: WifiSignalIcon, pct: '5%' },
  { id: 'bluetooth', label: 'Bluetooth not working', icon: BluetoothIcon, pct: '6%' },
  { id: 'speakers', label: 'Speakers faulty / cracked audio', icon: SpeakerIcon, pct: '3%' },
  { id: 'webcam', label: 'FaceTime HD Camera issue', icon: WebcamIcon, pct: '6%' },
  { id: 'keyboard', label: 'Magic Keyboard not working / keys faulty', icon: KeyboardIcon, pct: '7%' },
  { id: 'trackpad', label: 'Magic Mouse / Trackpad faulty', icon: TrackpadIcon, pct: '18%' },
  { id: 'hardDisk', label: 'SSD / Storage Defective', icon: HardDriveIcon, pct: '10%' },
  { id: 'motherboard', label: 'Logic Board issue (restart/hang/heat)', icon: MotherboardIcon, pct: '35%' },
  { id: 'charging', label: 'Power Supply / Cable issue', icon: ChargingPortIcon, pct: '8%' },
];

const bodyOptions = [
  { id: 'minorDentTop', label: 'Minor dent on aluminium casing', icon: PhoneBodyAverageIcon, pct: '8%' },
  { id: 'minorDentBase', label: 'Minor scuff on stand / base', icon: PhoneBodyAverageIcon, pct: '8%' },
  { id: 'majorDentTop', label: 'Major dent or bent chassis', icon: PhoneBodyBelowAverageIcon, pct: '35%' },
  { id: 'majorDentBase', label: 'Major damage to stand / base', icon: PhoneBodyBelowAverageIcon, pct: '40%' },
  { id: 'minorScratch', label: 'Light hairline scratches', icon: PhoneBodyGoodIcon, pct: '5%' },
  { id: 'majorScratch', label: 'Deep visible scratches / paint chipping', icon: PhoneBodyAverageIcon, pct: '8%' },
];

const accessoryOptions = [
  { id: 'bill', label: 'GST Valid Bill', desc: 'Valid purchase invoice', icon: BillDocumentIcon },
  { id: 'box', label: 'Original Box', desc: 'Original Apple packaging box', icon: BoxPackagingIcon },
  { id: 'charger', label: 'Original Power Adapter / Cable', desc: 'Original magnetic / power cord', icon: ChargerPlugIcon }
];

export default function MacConditionQuizPage() {
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

  const [powerStatus, setPowerStatus] = useState(null); // 'on' | 'off'
  const [screenScratchCondition, setScreenScratchCondition] = useState('none'); // 'none' | 'minor' | 'major' | 'cracked'
  const [screenDiscolourCondition, setScreenDiscolourCondition] = useState('none'); // 'none' | 'minor' | 'major'
  const [screenSpotsCondition, setScreenSpotsCondition] = useState('none'); // 'none' | 'minor' | 'major'
  const [screenLinesCondition, setScreenLinesCondition] = useState('none'); // 'none' | 'visible_lines' | 'flickering' | 'black_dots'
  const [issuesList, setIssuesList] = useState([]);
  const [bodyIssuesList, setBodyIssuesList] = useState([]);
  const [accessories, setAccessories] = useState(['bill', 'box', 'charger']);
  const [age, setAge] = useState('oneToTwo');

  useEffect(() => {
    deviceService.getDevice(slug).then(res => {
      const dev = res.data;
      setDevice(dev);
      setLoading(false);
      if (!specs && dev) {
        const defVariant = dev.variants?.[0] || {};
        setSpecs({
          processor: dev.processor || 'Apple M1',
          ram: defVariant.ram || dev.ram || '8 GB',
          storage: defVariant.storage || dev.storage || '256 GB SSD'
        });
      }
    }).catch(() => setLoading(false));
  }, [slug, specs]);

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
      functionalIssues: issuesList,
      screenIssues: activeScreenIssues,
      bodyIssues: bodyIssuesList,
      accessories: accessories
    });
  }, [device, specs, age, powerStatus, issuesList, screenScratchCondition, screenDiscolourCondition, screenSpotsCondition, screenLinesCondition, bodyIssuesList, accessories]);

  const currentPrice = breakdown?.finalPrice || 0;

  const handleSpecsUpdate = (newSpecs) => {
    setSpecs(newSpecs);
    setIsSpecsModalOpen(false);
  };

  const finalizeAndShowResult = () => {
    const ageLabel = AGE_OPTIONS.find(o => o.key === age)?.label || age;

    updateQuote({
      device: {
        ...device,
        category: 'mac',
        brand,
        modelName: device.modelName,
        slug,
        ...specs,
        deviceAge: ageLabel,
        yearBracket: age,
        powerStatus,
        screenScratchCondition,
        screenDiscolourCondition,
        screenIssues: [
          ...(screenScratchCondition !== 'none' ? [`screen_scratches_${screenScratchCondition}`] : []),
          ...(screenDiscolourCondition !== 'none' ? [`screen_discolour_${screenDiscolourCondition}`] : [])
        ],
        functionalIssues: issuesList,
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

          {/* Stepper Header */}
          <div className="flex justify-center gap-12 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#087F8C] text-white flex items-center justify-center font-black">1</span>
              <span className="text-[#111827] font-black">Final Valuation</span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black">2</span>
              <span className="text-gray-500 font-black">Schedule Pickup</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 sm:p-14 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-12">
                  <div className="w-44 h-44 bg-gray-50 rounded-[40px] flex items-center justify-center p-8">
                    <img src={device.imageUrl} alt={device.modelName} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[#087F8C] text-xs font-black uppercase tracking-wider mb-2 block">Offer ready — instant payout</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-2">{device.modelName}</h1>
                    <p className="text-sm font-bold text-gray-400 mb-6">
                      {specs?.processor} • {specs?.ram} • {specs?.storage}
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-5 mb-6">
                      <span className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tighter">{formatCurrency(currentPrice)}</span>
                      <div className="flex items-center gap-2 bg-[#E8F6F7] text-[#087F8C] px-3 py-1.5 rounded-xl border border-[#087F8C]/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        <span className="text-xs font-black uppercase tracking-widest">Guaranteed</span>
                      </div>
                    </div>
                    <button onClick={() => setShowResult(false)} className="text-[#087F8C] font-black text-sm underline underline-offset-8 hover:text-[#066772] transition-all cursor-pointer">
                      Recalculate / Retake Quiz
                    </button>
                  </div>
                </div>

                <div className="mt-14 space-y-6 pt-12 border-t border-gray-50">
                  <CheckboxRow label={`Receive pickup updates via WhatsApp (+91 ${user?.phone || 'XXXXXXXXXX'})`} checked />
                  <CheckboxRow label="I confirm this Mac powers on, iCloud / Activation Lock will be removed before handover." checked />
                </div>

                <button
                  onClick={handleSchedulePickup}
                  className="w-full mt-10 btn-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-[#087F8C]/25 transition-all flex items-center justify-center gap-3 text-lg cursor-pointer"
                >
                  Schedule Doorstep Pickup →
                </button>
              </div>

              {/* Evaluation Breakdown Details */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                <h3 className="text-2xl font-black text-[#111827] mb-8">Mac Evaluation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                  <EvaluationDetailRow label="Device" value={device.modelName} color="#087F8C" />
                  <EvaluationDetailRow label="Configuration" value={`${specs?.processor} / ${specs?.ram} / ${specs?.storage}`} color="#087F8C" />
                  <EvaluationDetailRow label="Power Status" value={powerStatus === 'on' ? 'Turns On' : 'Does Not Turn On (Off)'} color={powerStatus === 'on' ? '#087F8C' : '#EF4444'} />
                  <EvaluationDetailRow
                    label="Screen Condition"
                    value={
                      screenScratchCondition !== 'none' || screenDiscolourCondition !== 'none'
                        ? `${SCRATCH_OPTIONS.find(o => o.id === screenScratchCondition)?.label || ''}${screenDiscolourCondition !== 'none' ? ` • ${DISCOLOUR_OPTIONS.find(o => o.id === screenDiscolourCondition)?.label || ''}` : ''}`
                        : 'No Scratches / Discolouration'
                    }
                    color={screenScratchCondition !== 'none' || screenDiscolourCondition !== 'none' ? '#EF4444' : '#087F8C'}
                  />
                  <EvaluationDetailRow label="Functional Issues" value={issuesList.length > 0 ? issuesList.length + ' issue(s)' : 'No Issues'} color={issuesList.length > 0 ? '#EF4444' : '#087F8C'} />
                  <EvaluationDetailRow label="Body Condition" value={bodyIssuesList.length > 0 ? bodyIssuesList.length + ' issue(s)' : 'No Issues'} color={bodyIssuesList.length > 0 ? '#EF4444' : '#087F8C'} />
                  <EvaluationDetailRow label="Accessories" value={accessories.length > 0 ? accessories.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : 'None'} color="#087F8C" />
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar */}
            <div className="w-full lg:w-[400px] space-y-8">
              <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-[#111827] mb-6">Price Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Base Value</span>
                    <span className="text-[#111827]">{formatCurrency(breakdown?.basePrice || currentPrice)}</span>
                  </div>
                  {breakdown?.screenDeduction !== 0 && (
                    <div className="flex justify-between items-center text-sm font-bold text-red-500">
                      <span>Screen Deductions</span>
                      <span>{formatCurrency(breakdown?.screenDeduction)}</span>
                    </div>
                  )}
                  {breakdown?.bodyDeduction !== 0 && (
                    <div className="flex justify-between items-center text-sm font-bold text-red-500">
                      <span>Body Wear Deductions</span>
                      <span>{formatCurrency(breakdown?.bodyDeduction)}</span>
                    </div>
                  )}
                  {breakdown?.functionalDeduction !== 0 && (
                    <div className="flex justify-between items-center text-sm font-bold text-red-500">
                      <span>Hardware Issue Deductions</span>
                      <span>{formatCurrency(breakdown?.functionalDeduction)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="font-black text-gray-900">Total Buyback</span>
                    <span className="text-2xl font-black text-[#087F8C]">{formatCurrency(currentPrice)}</span>
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
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT COLUMN: Quiz Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

            {/* Device Header */}
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                  <img src={device.imageUrl} alt={device.modelName} className="h-full object-contain" />
                </div>
                <div>
                  <p className="text-[#087F8C] text-xs font-bold uppercase tracking-wider mb-1">Evaluating</p>
                  <h1 className="text-2xl font-black text-[#111827]">{device.modelName}</h1>
                  <p className="text-sm font-bold text-gray-400 mt-1">
                    {specs?.processor} • {specs?.ram} • {specs?.storage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSpecsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl border border-[#087F8C]/30 text-xs font-bold text-[#087F8C] hover:bg-[#E8F6F7] transition-all cursor-pointer"
              >
                Change Configuration ⚙️
              </button>
            </div>

            {/* Stepper Progress */}
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
                {/* ─── STEP 1: Specs Review ─── */}
                {STEPS[currentStepIndex]?.id === 'specs' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Confirm Device Specifications</h3>
                      <p className="text-sm font-medium text-gray-400 mt-1">Review the processor, memory and storage configuration.</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-bold text-gray-500">Processor / Chip</span>
                        <span className="text-sm font-black text-[#111827]">{specs?.processor}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-bold text-gray-500">RAM / Unified Memory</span>
                        <span className="text-sm font-black text-[#111827]">{specs?.ram}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-bold text-gray-500">Storage Capacity</span>
                        <span className="text-sm font-black text-[#111827]">{specs?.storage}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Need to change memory or disk? Click <button onClick={() => setIsSpecsModalOpen(true)} className="text-[#087F8C] font-bold underline cursor-pointer">Change Configuration</button> above.
                    </p>
                  </div>
                )}

                {/* ─── STEP 2: Power Status (Cashify Exact) ─── */}
                {STEPS[currentStepIndex]?.id === 'power' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Does the Mac Switch ON?</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">We currently only accept devices that switch on</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPowerStatus('on')}
                        className={`py-6 rounded-2xl border-2 font-black text-base transition-all cursor-pointer ${
                          powerStatus === 'on'
                            ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] shadow-xs ring-2 ring-[#087F8C]/20'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                        }`}
                      >
                        Yes, Turns On
                      </button>
                      <button
                        type="button"
                        onClick={() => setPowerStatus('off')}
                        className={`py-6 rounded-2xl border-2 font-black text-base transition-all cursor-pointer ${
                          powerStatus === 'off'
                            ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C] shadow-xs ring-2 ring-[#087F8C]/20'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                        }`}
                      >
                        No, Does Not Turn On (Off)
                      </button>
                    </div>

                    {powerStatus === 'off' && (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                        Devices that do not power on cannot be evaluated online. Please select &ldquo;Yes&rdquo; if your device powers on.
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 3: Screen Condition (Cashify Exact 2 Sections) ─── */}
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

                {/* ─── STEP 4: Body Condition ─── */}
                {STEPS[currentStepIndex]?.id === 'body' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Body Condition & Casing Damage</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">LEAVE UNSELECTED IF NONE APPLY</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[440px] overflow-y-auto pr-2 no-scrollbar">
                      {bodyOptions.map(i => {
                        const isSelected = bodyIssuesList.includes(i.id);
                        const IconComponent = i.icon;
                        return (
                          <button
                            key={i.id}
                            type="button"
                            onClick={() => {
                              setBodyIssuesList(prev => prev.includes(i.id) ? prev.filter(x => x !== i.id) : [...prev, i.id]);
                            }}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all h-36 cursor-pointer ${
                              isSelected ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-200'
                            }`}
                          >
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                              <IconComponent className="w-8 h-12" />
                            </div>
                            <span className="text-[13px] font-bold text-center leading-tight">{i.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP 5: Functional Issues ─── */}
                {STEPS[currentStepIndex]?.id === 'functional' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Functional & Hardware Issues</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">LEAVE UNSELECTED IF NONE APPLY</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[440px] overflow-y-auto pr-2 no-scrollbar">
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
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all h-36 cursor-pointer ${
                              isSelected ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-200'
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                              <IconComponent className="w-8 h-8" />
                            </div>
                            <span className="text-[13px] font-bold text-center leading-tight">{i.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP 6: Accessories ─── */}
                {STEPS[currentStepIndex]?.id === 'accessories' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Original Accessories</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">DEDUCTIONS APPLY IF UNCHECKED</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all h-44 cursor-pointer ${
                              isSelected ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-200'
                            }`}
                          >
                            <div className={`p-3 rounded-2xl ${isSelected ? 'bg-[#087F8C]/15 text-[#087F8C]' : 'bg-gray-50 text-gray-700'}`}>
                              <IconComponent className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                              <span className="text-sm font-black block leading-tight">{i.label}</span>
                              <span className="text-[11px] text-gray-400 font-bold block mt-1">{i.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP 7: Age & Warranty ─── */}
                {STEPS[currentStepIndex]?.id === 'age' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#111827]">Device Age & Warranty</h3>
                      <p className="text-sm font-medium text-gray-400 mt-1">Select the approximate age of your device.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {AGE_OPTIONS.map(opt => {
                        const isSelected = age === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setAge(opt.key)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all h-40 flex flex-col justify-between cursor-pointer ${
                              isSelected ? 'border-[#087F8C] bg-[#E8F6F7]' : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-300'}`} />
                            <div>
                              <h4 className={`text-base font-black ${isSelected ? 'text-[#087F8C]' : 'text-[#111827]'}`}>{opt.label}</h4>
                              <p className="text-xs text-gray-400 font-bold mt-1">
                                {opt.key === 'lessThan1' ? 'Valid Bill Mandatory' : 'Out of Warranty'}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentStepIndex === 0}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40 cursor-pointer"
                >
                  ← Back
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    disabled={STEPS[currentStepIndex]?.id === 'power' && powerStatus === null}
                    className="px-8 py-3.5 rounded-xl btn-gradient text-white text-sm font-black shadow-md shadow-[#087F8C]/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGetBestPrice}
                    className="px-10 py-4 rounded-xl btn-gradient text-white text-sm font-black shadow-lg shadow-[#087F8C]/25 transition-all cursor-pointer"
                  >
                    GET BEST PRICE ›
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Live Sidebar Summary */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm sticky top-8 space-y-6">
            <h4 className="text-sm font-black text-gray-700 uppercase tracking-widest">Device Evaluation</h4>

            {/* Cashify Up To Value banner */}
            <div className="p-4 rounded-2xl bg-[#E8F6F7] border border-[#087F8C]/20">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#087F8C] block mb-1">
                Evaluation In Progress
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-600">Get Upto:</span>
                <span className="text-2xl font-black text-slate-900">
                  {formatCurrency(device?.variants?.[0]?.price || device?.basePrice || 0)}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
                  <span>{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">CONFIGURATION</span>
                <span className="font-bold text-[#111827]">{specs?.ram} • {specs?.storage}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">SWITCH ON?</span>
                <span className={`font-bold ${powerStatus === 'on' ? 'text-emerald-600' : powerStatus === 'off' ? 'text-red-500' : 'text-gray-400'}`}>
                  {powerStatus ? (powerStatus === 'on' ? 'Yes' : 'No') : '-'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">SCREEN</span>
                <span className="font-bold text-[#111827] truncate max-w-[180px]">
                  {screenScratchCondition !== 'none' || screenDiscolourCondition !== 'none'
                    ? `${SCRATCH_OPTIONS.find(o => o.id === screenScratchCondition)?.label || ''}`
                    : 'Flawless'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">HARDWARE ISSUES</span>
                <span className="font-bold text-[#111827]">
                  {issuesList.length === 0 ? 'None' : `${issuesList.length} issue(s)`}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">BODY</span>
                <span className="font-bold text-[#111827]">
                  {bodyIssuesList.length === 0 ? 'Good' : `${bodyIssuesList.length} issue(s)`}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">ACCESSORIES</span>
                <span className="font-bold text-emerald-600">
                  {accessories.length} Included
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400 font-bold">AGE</span>
                <span className="font-bold text-[#087F8C]">
                  {AGE_OPTIONS.find(o => o.key === age)?.label || '-'}
                </span>
              </div>
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

      <LaptopSpecModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        device={device}
        onComplete={handleSpecsUpdate}
        initialValues={specs}
      />

      {/* Unified Evaluation OTP Modal */}
      <EvaluationOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          finalizeAndShowResult();
        }}
        deviceName={device?.modelName || 'Mac'}
      />
    </div>
  );
}

function CheckboxRow({ label, checked }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="relative mt-0.5">
        <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
        <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#087F8C] peer-checked:border-[#087F8C] transition-all" />
        <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <span className="text-xs font-bold text-gray-600 leading-relaxed group-hover:text-[#111827] transition-colors">{label}</span>
    </label>
  );
}

function EvaluationDetailRow({ label, value, color }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
