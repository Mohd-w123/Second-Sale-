import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { categoryService } from '../../services/category.service';
import { quizService } from '../../services/quiz.service';
import {
  Search, ChevronLeft, ChevronRight, X, Plus, Trash2,
  Smartphone, Monitor, Laptop, Headphones, Watch, Gamepad2, FileText, Percent, Info, ToggleLeft, ToggleRight,
  HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Copy
} from 'lucide-react';
import './admin.css';

const DEFAULT_MULTIPLIERS = {
  conditionMultipliers: { likenew: 1.0, good: 0.95, average: 0.85, belowAverage: 0.70, fair: 0.72, poor: 0.55 },
  screenMultipliers: { noScratch: 1.0, minorScratch: 0.95, crackedWorks: 0.75, crackedBroken: 0.50, noIssue: 1.0, deadPixels: 0.82 },
  batteryDeductions: { above80: 0, above60: 1000, below60: 2500 },
  ageMultipliers: { lessThan3: 1.0, threeToEleven: 0.88, aboveEleven: 0.75, lessThan1: 0.92, oneToTwo: 0.78, twoToThree: 0.62 },
  functionalDeductions: {
    // Mobile Cashify Hardware & Functional (%)
    front_camera: 8,
    back_camera: 15,
    volume_button: 4,
    finger_touch: 26,
    face_sensor: 26,
    speaker_faulty: 4,
    power_button: 2,
    charging_port: 10,
    audio_receiver: 7,
    camera_glass_broken: 8,
    bluetooth: 39,
    vibrator: 2,
    microphone: 2,
    proximity_sensor: 3,
    battery_service: 13,
    battery_80_85: 6,
    silent_button: 3,
    wifi_issue: 39,
    // Mobile General Details (%)
    dead: 90,
    screenFaulty: 65,
    copyScreen: 50,
    outOfWarranty: 20,
    noBill: 21,
    eSIM: 6,
    noBox: 5,
    noCharger: 3,
    // Laptop functional issues (%)
    battery: 6,
    keyboard: 7,
    trackpad: 18,
    speakers: 3,
    webcam: 6,
    ports: 8,
    hinge: 2000,
    overheat: 1500,
    gpu: 3000,
    screenChanged: 3000,
    wifi: 5,
    biometric: 1500,
    charging: 8,
    cdDrive: 7,
    chargerIssue: 1200,
    hardDisk: 10,
    displayIssue: 4000,
    motherboard: 35,
    // Legacy mobile
    batteryLow: 2000,
    cameraIssue: 3000,
    speakerIssue: 1500,
    biometricIssue: 4000,
    chargingIssue: 1000,
  },
  screenDeductions: {
    // Mobile Screen Defects & Cashify Sub-Defects (%)
    defect_screen_broken_scratch: 25,
    screen_cracked: 35,
    screen_chipped: 15,
    screen_scratches_major: 12,
    screen_scratches_minor: 5,
    defect_screen_spots_lines: 30,
    deadPixels: 35,
    dead_spots_lines: 25,
    screen_spots_minor: 15,
    screen_lines: 35,
    screen_faded: 18,
    screen_discoloration_major: 20,
    screen_discoloration_minor: 10,
    // Laptop Screen Defects (%)
    screen_discolour_minor: 8,
    screen_discolour_major: 18,
    screen_spots_major: 18,
    screen_lines_visible: 18,
    screen_lines_flickering: 20,
    screen_lines_black_dots: 15,
  },
  bodyDeductions: {
    // Mobile Body Defects & Cashify Sub-Defects (%)
    defect_body_scratch_dent: 10,
    scratches: 10,
    body_scratches_minor: 4,
    bent_curved: 20,
    body_scratches_dents: 8,
    defect_panel_missing_broken: 15,
    panel_cracked: 12,
    panel_missing: 18,
    loose_screen: 10,
    // Laptop Body Defects (%)
    minorDentTop: 8,
    minorDentBase: 8,
    majorDentTop: 35,
    majorDentBase: 40,
    minorScratch: 5,
    majorScratch: 8,
  },
  screenSizeMultipliers: { '10-12': 0.95, '13-14': 1.0, '15-16': 1.05, '16+': 1.1 },
  dedicatedGpuBonus: { 'GTX 1650': 2000, 'RTX 2050': 2500, 'RTX 3050': 3500, 'RTX 4050': 5000, 'RTX 4060': 7000, 'RTX 4070': 10000, 'RTX 4080': 15000, 'RTX 4090': 25000 },
  accessoriesBonus: { bill: 300, box: 500, charger: 800, withBoxAndCharger: 800, originalCharger: 500, thirdPartyCharger: 200, none: 0 }
};

const MOBILE_DEFECT_GROUPS = [
  {
    id: 'defect_screen_broken_scratch',
    target: 'screenDeductions',
    title: 'Broken / Scratch on Device Screen',
    subtitle: 'Screen glass cracks, chips & scratches',
    parentKey: 'defect_screen_broken_scratch',
    parentDefault: 25,
    subDefects: [
      { key: 'screen_cracked', label: 'Screen Cracked / Glass Broken', target: 'screenDeductions', default: 35 },
      { key: 'screen_chipped', label: 'Chipped Outside Display Area', target: 'screenDeductions', default: 15 },
      { key: 'screen_scratches_major', label: 'More than 2 Scratches on Screen', target: 'screenDeductions', default: 12 },
      { key: 'screen_scratches_minor', label: '1-2 Minor Scratches on Screen', target: 'screenDeductions', default: 5 },
    ]
  },
  {
    id: 'defect_screen_spots_lines',
    target: 'screenDeductions',
    title: 'Dead Spot / Visible Line & Discoloration',
    subtitle: 'Display spots, lines, fading & discoloration',
    parentKey: 'defect_screen_spots_lines',
    parentDefault: 30,
    subDefects: [
      { key: 'deadPixels', label: 'Large / Heavy Visible Spots', target: 'screenDeductions', default: 35 },
      { key: 'dead_spots_lines', label: '3 or More Minor Spots', target: 'screenDeductions', default: 25 },
      { key: 'screen_spots_minor', label: '1-2 Minor Spots on Screen', target: 'screenDeductions', default: 15 },
      { key: 'screen_lines', label: 'Visible Line(s) on Display', target: 'screenDeductions', default: 35 },
      { key: 'screen_faded', label: 'Display Faded Along Edges', target: 'screenDeductions', default: 18 },
      { key: 'screen_discoloration_major', label: 'Major Screen Discoloration', target: 'screenDeductions', default: 20 },
      { key: 'screen_discoloration_minor', label: 'Minor Screen Discoloration', target: 'screenDeductions', default: 10 },
    ]
  },
  {
    id: 'defect_body_scratch_dent',
    target: 'bodyDeductions',
    title: 'Scratch / Dent on Device Body',
    subtitle: 'Body scratches, paint peel & frame dents',
    parentKey: 'defect_body_scratch_dent',
    parentDefault: 10,
    subDefects: [
      { key: 'scratches', label: 'More than 2 Body Scratches', target: 'bodyDeductions', default: 10 },
      { key: 'body_scratches_minor', label: '1-2 Minor Body Scratches', target: 'bodyDeductions', default: 4 },
      { key: 'bent_curved', label: 'Major Dent(s) / Bent Frame', target: 'bodyDeductions', default: 20 },
      { key: 'body_scratches_dents', label: '1-2 Minor Body Dents', target: 'bodyDeductions', default: 8 },
    ]
  },
  {
    id: 'defect_panel_missing_broken',
    target: 'bodyDeductions',
    title: 'Device Panel Missing / Broken',
    subtitle: 'Back panel condition & frame separation',
    parentKey: 'defect_panel_missing_broken',
    parentDefault: 15,
    subDefects: [
      { key: 'panel_cracked', label: 'Cracked Side / Back Panel', target: 'bodyDeductions', default: 12 },
      { key: 'panel_missing', label: 'Missing Side / Back Panel', target: 'bodyDeductions', default: 18 },
      { key: 'loose_screen', label: 'Loose Screen / Frame Gap', target: 'bodyDeductions', default: 10 },
    ]
  },
];

const SCREEN_DEDUCTION_LABELS = {
  defect_screen_broken_scratch: 'Broken/scratch on device screen (Parent %)',
  defect_screen_spots_lines: 'Dead Spot/Visible line & Discoloration (Parent %)',
  screen_scratches_minor: '1-2 Minor Scratches on Screen (%)',
  screen_scratches_major: 'More than 2 Scratches on Screen (%)',
  screen_cracked: 'Screen Cracked / Broken (%)',
  screen_chipped: 'Chipped Outside Display Area (%)',
  deadPixels: 'Large / Heavy Visible Spots (%)',
  dead_spots_lines: '3 or More Minor Spots (%)',
  screen_spots_minor: '1-2 Minor Spots on Screen (%)',
  screen_lines: 'Visible Line(s) on Display (%)',
  screen_faded: 'Display Faded Along Edges (%)',
  screen_discoloration_major: 'Major Screen Discoloration (%)',
  screen_discoloration_minor: 'Minor Screen Discoloration (%)',
  screen_discolour_minor: 'Minor Discolouration (%)',
  screen_discolour_major: 'Major Discolouration (%)',
  screen_spots_major: 'Large / Heavy Visible Spots (%)',
  screen_lines_visible: 'Visible Lines on Screen (%)',
  screen_lines_flickering: 'Display Flickering (%)',
  screen_lines_black_dots: 'Black Dots on Screen (%)',
  screenCracked: 'Legacy Cracked (%)',
  lineDiscolour: 'Legacy Discolour (%)',
};

const BODY_DEDUCTION_LABELS = {
  defect_body_scratch_dent: 'Scratch/Dent on device body (Parent %)',
  defect_panel_missing_broken: 'Device panel missing/broken (Parent %)',
  scratches: 'More than 2 Body Scratches (%)',
  body_scratches_minor: '1-2 Minor Body Scratches (%)',
  bent_curved: 'Major Dent(s) / Bent Frame (%)',
  body_scratches_dents: '1-2 Minor Body Dents (%)',
  panel_cracked: 'Cracked Side / Back Panel (%)',
  panel_missing: 'Missing Side / Back Panel (%)',
  loose_screen: 'Loose Screen / Frame Gap (%)',
  minorDentTop: 'Minor Dent Top Panel (%)',
  minorDentBase: 'Minor Dent Base Panel (%)',
  majorDentTop: 'Major Dent Top Panel (%)',
  majorDentBase: 'Major Dent Base Panel (%)',
  minorScratch: 'Minor Scratches (%)',
  majorScratch: 'Major Scratches (%)',
};

const MOBILE_FUNCTIONAL_LABELS = {
  front_camera: 'Front Camera not working (%)',
  back_camera: 'Back Camera not working (%)',
  volume_button: 'Volume Button not working (%)',
  finger_touch: 'Finger Touch / Face ID (%)',
  face_sensor: 'Face Sensor not working (%)',
  speaker_faulty: 'Speaker Faulty (%)',
  power_button: 'Power Button not working (%)',
  charging_port: 'Charging Port not working (%)',
  audio_receiver: 'Audio Receiver not working (%)',
  camera_glass_broken: 'Camera Glass Broken (%)',
  bluetooth: 'Bluetooth not working (%)',
  vibrator: 'Vibrator not working (%)',
  microphone: 'Microphone not working (%)',
  proximity_sensor: 'Proximity Sensor not working (%)',
  battery_service: 'Battery in Service (<80% health) (%)',
  battery_80_85: 'Battery Health 80-85% (%)',
  silent_button: 'Silent Button not working (%)',
  wifi_issue: 'WiFi not working (%)',
  dead: 'Unable to Make Calls / Dead (%)',
  screenFaulty: 'Touch Screen Faulty (%)',
  copyScreen: 'Screen Changed / Not Original (%)',
  outOfWarranty: 'Device Out of Warranty (%)',
  noBill: 'No Valid GST Bill (%)',
  eSIM: 'eSIM Only Global Variant (%)',
  noBox: 'Original Box Missing (%)',
  noCharger: 'Original Charger Missing (%)',
};

export default function AdminDevices() {
  const [devices, setDevices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('core'); // core | variants | multipliers | deductions | quiz
  const [openCustomQuizStepIndex, setOpenCustomQuizStepIndex] = useState(0);
  const [cloningQuiz, setCloningQuiz] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); // null if creating
  const [formData, setFormData] = useState({});
  const [expandedDefects, setExpandedDefects] = useState({
    defect_screen_broken_scratch: true,
    defect_screen_spots_lines: true,
    defect_body_scratch_dent: true,
    defect_panel_missing_broken: true,
  });
  const [duplicatingId, setDuplicatingId] = useState(null);

  const toggleDefectExpand = (key) => {
    setExpandedDefects(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllDefects = () => {
    const allOpen = MOBILE_DEFECT_GROUPS.every(g => expandedDefects[g.id]);
    const next = {};
    MOBILE_DEFECT_GROUPS.forEach(g => {
      next[g.id] = !allOpen;
    });
    setExpandedDefects(next);
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [refreshKey, setRefreshKey] = useState(0);
  const fetchDevices = () => setRefreshKey(k => k + 1);

  // Fetch devices
  useEffect(() => {
    let ignore = false;
    const params = { page, limit: 12 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;

    adminService.getDevices(params)
      .then((res) => {
        if (!ignore) {
          setDevices(res.data.devices);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load devices', err);
          setLoading(false);
        }
      });

    return () => { ignore = true; };
  }, [page, debouncedSearch, category, refreshKey]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.data && res.data.length > 0) {
          setCategoryOptions(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Open modal for Create
  const handleCreateOpen = () => {
    setSelectedDevice(null);
    setFormData({
      category: 'mobile',
      brand: '',
      modelName: '',
      slug: '',
      imageUrl: '',
      processorFamily: '',
      generation: '',
      gpuType: '',
      isGamingLaptop: false,
      tier: 'Mid-range',
      isActive: true,
      hasCustomQuiz: false,
      customQuiz: null,
      variants: [],
      ...JSON.parse(JSON.stringify(DEFAULT_MULTIPLIERS))
    });
    setModalTab('core');
    setShowModal(true);
  };

  // Open modal for Edit
  const handleEditOpen = (device) => {
    setSelectedDevice(device);
    // Deep clone with defaults merged
    const cloned = JSON.parse(JSON.stringify(device));
    const merged = {
      ...JSON.parse(JSON.stringify(DEFAULT_MULTIPLIERS)),
      ...cloned,
      hasCustomQuiz: Boolean(cloned.hasCustomQuiz),
      customQuiz: cloned.customQuiz || null,
      screenDeductions: {
        ...DEFAULT_MULTIPLIERS.screenDeductions,
        ...(cloned.screenDeductions || {})
      },
      functionalDeductions: {
        ...DEFAULT_MULTIPLIERS.functionalDeductions,
        ...(cloned.functionalDeductions || {})
      },
      bodyDeductions: {
        ...DEFAULT_MULTIPLIERS.bodyDeductions,
        ...(cloned.bodyDeductions || {})
      }
    };
    setFormData(merged);
    setModalTab('core');
    setShowModal(true);
  };

  // Handle core field changes
  const handleInputChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Handle nested multipliers changes
  const handleNestedChange = (parent, child, val) => {
    const numeric = val === '' ? '' : parseFloat(val);
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: numeric
      }
    }));
  };

  // Auto-generate slug from brand + model name
  const handleGenerateSlug = () => {
    if (formData.brand && formData.modelName) {
      const generated = `${formData.brand}-${formData.modelName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      handleInputChange('slug', generated);
    }
  };

  // Variants handlers
  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { processor: '', generation: '', storage: '', ram: '', storageType: '', basePrice: 0 }
      ]
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  const handleVariantChange = (index, field, val) => {
    const updated = formData.variants.map((v, idx) => {
      if (idx === index) {
        return {
          ...v,
          [field]: field === 'basePrice' ? (val === '' ? '' : Number(val)) : val
        };
      }
      return v;
    });
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  // Model-specific Custom Quiz Handlers
  const handleToggleCustomQuiz = async (enable) => {
    if (!enable) {
      setFormData(prev => ({
        ...prev,
        hasCustomQuiz: false,
      }));
      return;
    }

    // If enabling and customQuiz is empty, clone from Category Master Quiz
    if (!formData.customQuiz?.steps?.length) {
      setCloningQuiz(true);
      try {
        const cat = formData.category || 'mobile';
        const res = await quizService.getQuizByCategory(cat);
        const masterQuiz = res?.data?.quiz || res?.data || res;
        setFormData(prev => ({
          ...prev,
          hasCustomQuiz: true,
          customQuiz: JSON.parse(JSON.stringify(masterQuiz || { steps: [] })),
        }));
      } catch (err) {
        console.error('Failed to clone category quiz:', err);
        setFormData(prev => ({
          ...prev,
          hasCustomQuiz: true,
          customQuiz: { steps: [] },
        }));
      } finally {
        setCloningQuiz(false);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        hasCustomQuiz: true,
      }));
    }
  };

  const handleCustomQuizStepField = (sIdx, field, val) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      steps[sIdx] = { ...steps[sIdx], [field]: val };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizQuestionField = (sIdx, qIdx, field, val) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      const questions = [...steps[sIdx].questions];
      questions[qIdx] = { ...questions[qIdx], [field]: val };
      steps[sIdx] = { ...steps[sIdx], questions };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizOptionField = (sIdx, qIdx, oIdx, field, val) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      const questions = [...steps[sIdx].questions];
      const options = [...questions[qIdx].options];
      options[oIdx] = { ...options[oIdx], [field]: field === 'deductionValue' ? (val === '' ? '' : Number(val)) : val };
      questions[qIdx] = { ...questions[qIdx], options };
      steps[sIdx] = { ...steps[sIdx], questions };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizDeleteQuestion = (sIdx, qIdx) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      const questions = steps[sIdx].questions.filter((_, idx) => idx !== qIdx);
      steps[sIdx] = { ...steps[sIdx], questions };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizAddQuestion = (sIdx) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      const questions = [
        ...steps[sIdx].questions,
        {
          id: `custom_q_${Date.now()}`,
          title: 'New Evaluation Question',
          subtitle: 'Please provide accurate details',
          type: 'yes_no',
          required: true,
          options: [
            { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
            { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 10, isNegative: true },
          ],
        },
      ];
      steps[sIdx] = { ...steps[sIdx], questions };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizDeleteOption = (sIdx, qIdx, oIdx) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      const questions = [...steps[sIdx].questions];
      const options = questions[qIdx].options.filter((_, idx) => idx !== oIdx);
      questions[qIdx] = { ...questions[qIdx], options };
      steps[sIdx] = { ...steps[sIdx], questions };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizAddOption = (sIdx, qIdx) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = [...quiz.steps];
      const questions = [...steps[sIdx].questions];
      const options = [
        ...questions[qIdx].options,
        {
          id: `opt_${Date.now()}`,
          label: 'New Condition / Option',
          description: '',
          deductionType: 'percentage',
          deductionValue: 5,
          isNegative: true,
        },
      ];
      questions[qIdx] = { ...questions[qIdx], options };
      steps[sIdx] = { ...steps[sIdx], questions };
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  const handleCustomQuizAddStep = () => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const newStep = {
        id: `step_${Date.now()}`,
        label: 'New Evaluation Step',
        subtitle: 'Questions for this step',
        questions: [
          {
            id: `q_${Date.now()}`,
            title: 'New Question',
            subtitle: 'Please provide details',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 10, isNegative: true },
            ],
          },
        ],
      };
      return { ...prev, customQuiz: { ...quiz, steps: [...(quiz.steps || []), newStep] } };
    });
  };

  const handleCustomQuizDeleteStep = (sIdx) => {
    setFormData(prev => {
      const quiz = prev.customQuiz || { steps: [] };
      const steps = quiz.steps.filter((_, idx) => idx !== sIdx);
      return { ...prev, customQuiz: { ...quiz, steps } };
    });
  };

  // Submit Device Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.modelName || !formData.slug) {
      alert('Brand, Model Name and Slug are required.');
      return;
    }

    try {
      if (selectedDevice) {
        await adminService.updateDevice(selectedDevice._id, formData);
      } else {
        await adminService.createDevice(formData);
      }
      setShowModal(false);
      fetchDevices();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while saving device');
    }
  };

  // Duplicate Device
  const handleDuplicate = async (device) => {
    if (!window.confirm(`Create a duplicate copy of "${device.brand} ${device.modelName}"?`)) {
      return;
    }

    try {
      setDuplicatingId(device._id);
      const cloned = JSON.parse(JSON.stringify(device));
      delete cloned._id;
      delete cloned.createdAt;
      delete cloned.updatedAt;
      delete cloned.__v;
      if (Array.isArray(cloned.variants)) {
        cloned.variants = cloned.variants.map(v => {
          const copyV = { ...v };
          delete copyV._id;
          return copyV;
        });
      }

      const timestamp = Date.now().toString().slice(-4);
      const newModelName = `${device.modelName} (Copy)`;
      const baseSlug = (device.slug || '').replace(/-copy(-\d+)?$/, '');
      const newSlug = `${baseSlug}-copy-${timestamp}`;

      const payload = {
        ...JSON.parse(JSON.stringify(DEFAULT_MULTIPLIERS)),
        ...cloned,
        modelName: newModelName,
        slug: newSlug,
      };

      await adminService.createDevice(payload);
      fetchDevices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to duplicate device');
    } finally {
      setDuplicatingId(null);
    }
  };

  // Delete Device
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action is permanent.`)) {
      try {
        await adminService.deleteDevice(id);
        fetchDevices();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete device');
      }
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'laptop':
      case 'mac':
        return <Laptop className="w-4 h-4" />;
      case 'tablet':
        return <Monitor className="w-4 h-4" />;
      case 'earbuds':
        return <Headphones className="w-4 h-4" />;
      case 'smartwatch':
        return <Watch className="w-4 h-4" />;
      case 'console':
      case 'gaming':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Filter and Actions Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              className="admin-search pl-10"
              placeholder="Search model or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          </div>

          <select
            className="admin-select"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categoryOptions.length > 0 ? (
              categoryOptions.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))
            ) : (
              <>
                <option value="mobile">Mobiles</option>
                <option value="tablet">Tablets</option>
                <option value="laptop">Laptops</option>
                <option value="mac">Macs</option>
              </>
            )}
          </select>
        </div>

        {/* Add Device Button */}
        <button onClick={handleCreateOpen} className="admin-btn admin-btn-primary self-start">
          <Plus size={16} />
          <span>Add New Device</span>
        </button>
      </div>

      {/* Devices Catalog Grid */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div className="p-12 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 admin-skeleton w-full" />
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No devices found matching current filters.
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Device Info</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Variants</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                          {device.imageUrl ? (
                            <img src={device.imageUrl} alt={device.modelName} className="object-contain w-full h-full p-1" />
                          ) : (
                            getCategoryIcon(device.category)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-black">{device.brand} {device.modelName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">ID: {device._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 capitalize text-xs">
                        {getCategoryIcon(device.category)}
                        <span>{device.category}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-400">{device.slug}</td>
                    <td>
                      <span className="admin-badge admin-badge-blue">
                        {device.variants?.length || 0} variants
                      </span>
                    </td>
                    <td>
                      <span className={device.isActive ? 'admin-badge admin-badge-green' : 'admin-badge admin-badge-red'}>
                        {device.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(device)}
                          className="admin-btn admin-btn-ghost text-xs py-1 px-2.5"
                          title="Edit Device"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicate(device)}
                          disabled={duplicatingId === device._id}
                          className="admin-btn admin-btn-ghost text-xs py-1 px-2 text-[#087F8C] hover:text-[#116466] hover:bg-[#E8F6F7] transition disabled:opacity-50"
                          title="Duplicate Device (Create Copy)"
                        >
                          <Copy size={13} className={duplicatingId === device._id ? 'animate-spin' : ''} />
                        </button>
                        <button
                          onClick={() => handleDelete(device._id, `${device.brand} ${device.modelName}`)}
                          className="admin-btn admin-btn-danger text-xs py-1 px-2.5"
                          title="Delete Device"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Page {page} of {totalPages} (Total {total} devices)
              </div>
              <div className="admin-pagination-btns">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="admin-pagination-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="admin-pagination-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Device Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal max-w-4xl" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="admin-modal-header">
              <h3>{selectedDevice ? 'Edit Device Properties' : 'Create New Device'}</h3>
              <button onClick={() => setShowModal(false)} className="admin-modal-close">
                <X size={16} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-4">
              <div className="admin-tabs">
                <button
                  type="button"
                  className={`admin-tab ${modalTab === 'core' ? 'active' : ''}`}
                  onClick={() => setModalTab('core')}
                >
                  <Info size={14} className="inline mr-1" />
                  Core Details
                </button>
                <button
                  type="button"
                  className={`admin-tab ${modalTab === 'variants' ? 'active' : ''}`}
                  onClick={() => setModalTab('variants')}
                >
                  <FileText size={14} className="inline mr-1" />
                  Variants ({formData.variants?.length || 0})
                </button>
                <button
                  type="button"
                  className={`admin-tab ${modalTab === 'multipliers' ? 'active' : ''}`}
                  onClick={() => setModalTab('multipliers')}
                >
                  <Percent size={14} className="inline mr-1" />
                  Multipliers
                </button>
                <button
                  type="button"
                  className={`admin-tab ${modalTab === 'deductions' ? 'active' : ''}`}
                  onClick={() => setModalTab('deductions')}
                >
                  <Percent size={14} className="inline mr-1" />
                  Deductions & Bonuses
                </button>
                <button
                  type="button"
                  className={`admin-tab ${modalTab === 'quiz' ? 'active' : ''}`}
                  onClick={() => setModalTab('quiz')}
                >
                  <HelpCircle size={14} className="inline mr-1" />
                  Model Quiz {formData.hasCustomQuiz ? '(Custom)' : '(Default)'}
                </button>
              </div>
            </div>

            {/* Modal Body with Form */}
            <form onSubmit={handleSubmit} className="admin-modal-body pt-2 space-y-6">

              {/* TAB 1: CORE DETAILS */}
              {modalTab === 'core' && (
                <div className="space-y-4">
                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        {categoryOptions.length > 0 ? (
                          categoryOptions.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.name} {cat.isComingSoon ? '(Coming Soon)' : ''}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                            <option value="laptop">Laptop</option>
                            <option value="mac">Mac</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="admin-field">
                      <label>Brand</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple, Samsung, MSI"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Model Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. iPhone 15 Pro, Titan GT77"
                        value={formData.modelName}
                        onChange={(e) => handleInputChange('modelName', e.target.value)}
                      />
                    </div>

                    <div className="admin-field">
                      <label>Slug (Unique Identifier)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. iphone-15-pro"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleGenerateSlug}
                          className="admin-btn admin-btn-ghost text-xs whitespace-nowrap"
                        >
                          Auto Generate
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Image URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    />
                  </div>

                  {/* Laptop-specific configurations */}
                  {(formData.category === 'laptop' || formData.category === 'mac') && (
                    <div className="border border-slate-800 p-4 rounded-xl space-y-4">
                      <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider block">Laptop Specific Configurations</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="admin-field">
                          <label>Processor Family</label>
                          <input
                            type="text"
                            placeholder="e.g. Core i7, M2 Max"
                            value={formData.processorFamily || ''}
                            onChange={(e) => handleInputChange('processorFamily', e.target.value)}
                          />
                        </div>
                        <div className="admin-field">
                          <label>Generation</label>
                          <input
                            type="text"
                            placeholder="e.g. 12th Gen, M2"
                            value={formData.generation || ''}
                            onChange={(e) => handleInputChange('generation', e.target.value)}
                          />
                        </div>
                        <div className="admin-field">
                          <label>GPU Type</label>
                          <input
                            type="text"
                            placeholder="Integrated / Dedicated"
                            value={formData.gpuType || ''}
                            onChange={(e) => handleInputChange('gpuType', e.target.value)}
                          />
                        </div>
                        <div className="admin-field">
                          <label>Tier</label>
                          <select
                            value={formData.tier || ''}
                            onChange={(e) => handleInputChange('tier', e.target.value)}
                          >
                            <option value="Budget">Budget</option>
                            <option value="Mid-range">Mid-range</option>
                            <option value="Premium">Premium</option>
                            <option value="Gaming">Gaming</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleInputChange('isGamingLaptop', !formData.isGamingLaptop)}
                          className="text-slate-400 hover:text-slate-100 flex items-center gap-2"
                        >
                          {formData.isGamingLaptop ? (
                            <ToggleRight size={28} className="text-blue-500" />
                          ) : (
                            <ToggleLeft size={28} className="text-slate-600" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider">Gaming Laptop Category Tag</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('isActive', !formData.isActive)}
                      className="text-slate-400 hover:text-slate-100 flex items-center gap-2"
                    >
                      {formData.isActive ? (
                        <ToggleRight size={28} className="text-emerald-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-slate-600" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider">Device Is Active (Available for Trade-In)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: MODEL-SPECIFIC QUIZ */}
              {modalTab === 'quiz' && (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {/* Mode Selector Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-600" />
                        Model Evaluation Quiz & Deductions
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Control how this specific model is evaluated. You can inherit the global category questions or configure custom questions & deductions exclusively for this model.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Option 1: Category Master */}
                      <div
                        onClick={() => handleToggleCustomQuiz(false)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-start gap-3 ${
                          !formData.hasCustomQuiz
                            ? 'border-emerald-600 bg-white shadow-sm'
                            : 'border-slate-200 bg-white/60 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          !formData.hasCustomQuiz ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {!formData.hasCustomQuiz && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-900 block">
                            Category Master Quiz (Default)
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5 block">
                            Inherits standard questions and deductions from the {formData.category?.toUpperCase() || 'MOBILE'} category template.
                          </span>
                        </div>
                      </div>

                      {/* Option 2: Custom Quiz for this Model */}
                      <div
                        onClick={() => handleToggleCustomQuiz(true)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-start gap-3 ${
                          formData.hasCustomQuiz
                            ? 'border-emerald-600 bg-white shadow-sm'
                            : 'border-slate-200 bg-white/60 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          formData.hasCustomQuiz ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {formData.hasCustomQuiz && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-900 block">
                              Custom Quiz Override
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <span className="text-xs text-slate-500 mt-0.5 block">
                            Set custom questions, defect options, and tailored deduction rates (% or ₹) exclusively for this model.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* If Inheriting Category Master */}
                  {!formData.hasCustomQuiz && (
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Using Global {formData.category?.toUpperCase() || 'MOBILE'} Quiz
                      </h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        This phone currently uses the standard category questionnaire. Any question or deduction updates made in the <strong>Quiz & Deductions</strong> manager automatically apply to this model.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleToggleCustomQuiz(true)}
                        disabled={cloningQuiz}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {cloningQuiz ? 'Cloning Category Quiz...' : 'Customize Quiz for this Model'}
                      </button>
                    </div>
                  )}

                  {/* If Custom Quiz is Active */}
                  {formData.hasCustomQuiz && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-900">
                            Custom Questionnaire Active for {formData.brand} {formData.modelName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleCustomQuiz(false)}
                          className="text-xs font-medium text-slate-600 hover:text-red-600 underline"
                        >
                          Revert to Category Default
                        </button>
                      </div>

                      {/* Custom Steps Accordion */}
                      <div className="space-y-4">
                        {(formData.customQuiz?.steps || []).map((step, sIdx) => {
                          const isOpen = openCustomQuizStepIndex === sIdx;
                          return (
                            <div
                              key={step.id || sIdx}
                              className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
                            >
                              {/* Step Header */}
                              <div
                                onClick={() => setOpenCustomQuizStepIndex(isOpen ? null : sIdx)}
                                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 cursor-pointer select-none border-b border-slate-200"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                                    {sIdx + 1}
                                  </span>
                                  <div>
                                    <span className="text-sm font-semibold text-slate-900">{step.label}</span>
                                    <span className="text-xs text-slate-500 ml-2">({step.questions?.length || 0} questions)</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCustomQuizDeleteStep(sIdx);
                                    }}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                                    title="Delete Step Section"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                  {isOpen ? (
                                    <ChevronUp className="w-4 h-4 text-slate-500" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-500" />
                                  )}
                                </div>
                              </div>

                              {/* Step Body */}
                              {isOpen && (
                                <div className="p-4 space-y-4">
                                  {/* Step Titles */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-md border border-slate-200">
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-700 mb-1">Step Label</label>
                                      <input
                                        type="text"
                                        value={step.label || ''}
                                        onChange={(e) => handleCustomQuizStepField(sIdx, 'label', e.target.value)}
                                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-700 mb-1">Step Subtitle</label>
                                      <input
                                        type="text"
                                        value={step.subtitle || ''}
                                        onChange={(e) => handleCustomQuizStepField(sIdx, 'subtitle', e.target.value)}
                                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                      />
                                    </div>
                                  </div>

                                  {/* Questions */}
                                  <div className="space-y-4">
                                    {(step.questions || []).map((q, qIdx) => (
                                      <div
                                        key={q.id || qIdx}
                                        className="border border-slate-200 rounded-md p-4 bg-white space-y-3 shadow-xs"
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div className="md:col-span-2">
                                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Question Title
                                              </label>
                                              <input
                                                type="text"
                                                value={q.title || ''}
                                                onChange={(e) => handleCustomQuizQuestionField(sIdx, qIdx, 'title', e.target.value)}
                                                className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Type
                                              </label>
                                              <select
                                                value={q.type || 'yes_no'}
                                                onChange={(e) => handleCustomQuizQuestionField(sIdx, qIdx, 'type', e.target.value)}
                                                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                              >
                                                <option value="yes_no">Yes / No</option>
                                                <option value="single_choice">Single Choice</option>
                                                <option value="multi_choice">Multi Choice</option>
                                              </select>
                                            </div>
                                            <div className="md:col-span-3">
                                              <input
                                                type="text"
                                                placeholder="Helper subtitle..."
                                                value={q.subtitle || ''}
                                                onChange={(e) => handleCustomQuizQuestionField(sIdx, qIdx, 'subtitle', e.target.value)}
                                                className="w-full text-xs px-2.5 py-1 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                              />
                                            </div>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCustomQuizDeleteQuestion(sIdx, qIdx);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                                            title="Delete Question"
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </button>
                                        </div>

                                        {/* Options */}
                                        <div className="border-t border-slate-100 pt-2 space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                              Answer Options & Deductions
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => handleCustomQuizAddOption(sIdx, qIdx)}
                                              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                            >
                                              <Plus className="w-3 h-3" />
                                              Add Option
                                            </button>
                                          </div>

                                          <div className="space-y-1.5">
                                            {(q.options || []).map((opt, oIdx) => (
                                              <div
                                                key={opt.id || oIdx}
                                                className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded border border-slate-200"
                                              >
                                                <div className="md:col-span-5">
                                                  <input
                                                    type="text"
                                                    placeholder="Option label"
                                                    value={opt.label || ''}
                                                    onChange={(e) => handleCustomQuizOptionField(sIdx, qIdx, oIdx, 'label', e.target.value)}
                                                    className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none"
                                                  />
                                                </div>

                                                <div className="md:col-span-3">
                                                  <select
                                                    value={opt.deductionType || 'percentage'}
                                                    onChange={(e) => handleCustomQuizOptionField(sIdx, qIdx, oIdx, 'deductionType', e.target.value)}
                                                    className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none"
                                                  >
                                                    <option value="percentage">% Percentage</option>
                                                    <option value="flat_inr">₹ Flat INR</option>
                                                  </select>
                                                </div>

                                                <div className="md:col-span-3">
                                                  <input
                                                    type="number"
                                                    placeholder="Deduction"
                                                    value={opt.deductionValue ?? ''}
                                                    onChange={(e) => handleCustomQuizOptionField(sIdx, qIdx, oIdx, 'deductionValue', e.target.value)}
                                                    className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none font-semibold text-red-600"
                                                  />
                                                </div>

                                                <div className="md:col-span-1 flex justify-end">
                                                  <button
                                                    type="button"
                                                    onClick={() => handleCustomQuizDeleteOption(sIdx, qIdx, oIdx)}
                                                    className="p-1 text-slate-400 hover:text-red-500"
                                                    title="Remove option"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ))}

                                    <button
                                      type="button"
                                      onClick={() => handleCustomQuizAddQuestion(sIdx)}
                                      className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      Add Question to {step.label}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={handleCustomQuizAddStep}
                          className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-4 h-4 text-emerald-600" />
                          Add New Step Section
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VARIANTS */}
              {modalTab === 'variants' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Device Variants Matrix</span>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="admin-btn admin-btn-ghost text-xs py-1 px-3"
                    >
                      <Plus size={12} className="inline mr-1" />
                      Add Variant
                    </button>
                  </div>

                  {formData.variants?.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-slate-950/40 border border-slate-900 rounded-xl">
                      No variants added. Click "Add Variant" to configure model options.
                    </div>
                  ) : (
                    <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3">
                      {formData.variants?.map((v, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center gap-3">
                          {formData.category === 'mobile' || formData.category === 'tablet' ? (
                            <>
                              <div className="flex-1 min-w-[120px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">Storage</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. 128GB, 256GB"
                                  value={v.storage}
                                  onChange={(e) => handleVariantChange(idx, 'storage', e.target.value)}
                                />
                              </div>
                              <div className="w-[100px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">RAM (Optional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 6GB, 8GB"
                                  value={v.ram || ''}
                                  onChange={(e) => handleVariantChange(idx, 'ram', e.target.value)}
                                />
                              </div>
                            </>
                          ) : ['smartwatch', 'earbuds', 'console', 'gaming'].includes(formData.category) ? (
                            <>
                              <div className="flex-1 min-w-[150px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">Edition / Dial Size / Variant</label>
                                <input
                                  type="text"
                                  required
                                  placeholder={
                                    formData.category === 'smartwatch'
                                      ? 'e.g. 45mm GPS, 49mm Cellular'
                                      : formData.category === 'console' || formData.category === 'gaming'
                                      ? 'e.g. Disc Edition 825GB, Digital Edition 1TB'
                                      : 'e.g. Standard, USB-C MagSafe'
                                  }
                                  value={v.storage}
                                  onChange={(e) => handleVariantChange(idx, 'storage', e.target.value)}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-[110px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">Processor</label>
                                <input
                                  type="text"
                                  placeholder="Intel Core i5"
                                  value={v.processor || ''}
                                  onChange={(e) => handleVariantChange(idx, 'processor', e.target.value)}
                                />
                              </div>
                              <div className="w-[80px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">Gen</label>
                                <input
                                  type="text"
                                  placeholder="11th Gen"
                                  value={v.generation || ''}
                                  onChange={(e) => handleVariantChange(idx, 'generation', e.target.value)}
                                />
                              </div>
                              <div className="w-[90px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">Storage</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="512GB"
                                  value={v.storage}
                                  onChange={(e) => handleVariantChange(idx, 'storage', e.target.value)}
                                />
                              </div>
                              <div className="w-[80px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">RAM</label>
                                <input
                                  type="text"
                                  placeholder="16GB"
                                  value={v.ram || ''}
                                  onChange={(e) => handleVariantChange(idx, 'ram', e.target.value)}
                                />
                              </div>
                              <div className="w-[90px] admin-field mb-0">
                                <label className="text-[9px] mb-0.5">Storage Type</label>
                                <input
                                  type="text"
                                  placeholder="SSD"
                                  value={v.storageType || ''}
                                  onChange={(e) => handleVariantChange(idx, 'storageType', e.target.value)}
                                />
                              </div>
                            </>
                          )}
                          <div className="w-[120px] admin-field mb-0">
                            <label className="text-[9px] mb-0.5">Base Price (INR)</label>
                            <input
                              type="number"
                              required
                              placeholder="25000"
                              value={v.basePrice}
                              onChange={(e) => handleVariantChange(idx, 'basePrice', e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="admin-btn admin-btn-danger px-2 py-2 mt-3.5 self-center"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MULTIPLIERS */}
              {modalTab === 'multipliers' && (
                <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">
                  {['smartwatch', 'earbuds', 'console', 'gaming'].includes(formData.category) && (
                    <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200 flex items-start gap-2.5">
                      <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-white font-bold mb-1">Standard Dynamic Valuation Active</strong>
                        This category uses DeviceKart's standardized percentage valuation model. All condition, screen, body, and functional deductions are computed dynamically starting from each variant's <strong>Base Price</strong> configured in the Variants tab.
                      </div>
                    </div>
                  )}

                  {/* Condition Multipliers */}
                  <div>
                    <h4 className="admin-section-title">Condition Multipliers</h4>
                    <div className="admin-multiplier-grid">
                      {Object.keys(formData.conditionMultipliers || {}).map((cond) => (
                        <div key={cond} className="admin-multiplier-item">
                          <label>{cond}</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.conditionMultipliers[cond]}
                            onChange={(e) => handleNestedChange('conditionMultipliers', cond, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Screen Damage Multipliers */}
                  <div>
                    <h4 className="admin-section-title">Screen Assessment Multipliers</h4>
                    <div className="admin-multiplier-grid">
                      {Object.keys(formData.screenMultipliers || {}).map((scr) => (
                        <div key={scr} className="admin-multiplier-item">
                          <label>{scr}</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.screenMultipliers[scr]}
                            onChange={(e) => handleNestedChange('screenMultipliers', scr, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Laptop-specific configurations */}
                  {(formData.category === 'laptop' || formData.category === 'mac') && (
                    <>
                      {/* Age Multipliers */}
                      <div>
                        <h4 className="admin-section-title">Age Multipliers</h4>
                        <div className="admin-multiplier-grid">
                          {Object.keys(formData.ageMultipliers || {}).map((age) => (
                            <div key={age} className="admin-multiplier-item">
                              <label>{age}</label>
                              <input
                                type="number"
                                step="0.01"
                                value={formData.ageMultipliers[age]}
                                onChange={(e) => handleNestedChange('ageMultipliers', age, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Screen Size Multipliers */}
                      <div>
                        <h4 className="admin-section-title">Screen Size Multipliers</h4>
                        <div className="admin-multiplier-grid">
                          {Object.keys(formData.screenSizeMultipliers || {}).map((size) => (
                            <div key={size} className="admin-multiplier-item">
                              <label>{size} Inches</label>
                              <input
                                type="number"
                                step="0.01"
                                value={formData.screenSizeMultipliers[size]}
                                onChange={(e) => handleNestedChange('screenSizeMultipliers', size, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 4: DEDUCTIONS & BONUSES */}
              {modalTab === 'deductions' && (
                <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">

                  {/* MOBILE & TABLET DEDUCTIONS */}
                  {(formData.category === 'mobile' || formData.category === 'tablet') && (
                    <>
                      {/* 1. Cashify Screen & Body Defects with Granular Sub-Defects */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <h4 className="admin-section-title mb-0">Screen & Body Defects (Percentage %)</h4>
                            <p className="text-xs text-slate-500">
                              Step 2: Applied if user selects physical defects (Parent fallback & granular sub-defects)
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={toggleAllDefects}
                            className="self-start sm:self-auto text-xs font-semibold text-[#087F8C] hover:text-[#116466] flex items-center gap-1 px-3 py-1.5 bg-[#E8F6F7] hover:bg-[#E8F6F7]/80 rounded-lg transition"
                          >
                            <span>{MOBILE_DEFECT_GROUPS.every(g => expandedDefects[g.id]) ? 'Collapse All Sub-Defects' : 'Expand All Sub-Defects'}</span>
                            {MOBILE_DEFECT_GROUPS.every(g => expandedDefects[g.id]) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="space-y-4">
                          {MOBILE_DEFECT_GROUPS.map((group) => {
                            const isExpanded = !!expandedDefects[group.id];
                            const parentVal = formData[group.target]?.[group.parentKey] ?? '';

                            return (
                              <div
                                key={group.id}
                                className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition hover:border-slate-300"
                              >
                                {/* Parent Category Header Card */}
                                <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#087F8C] flex-shrink-0" />
                                    <div>
                                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                        <span>{group.title}</span>
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                                          {group.subDefects.length} options
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-slate-500 mt-0.5">
                                        {group.subtitle}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 self-end sm:self-center">
                                    {/* Parent Fallback Input */}
                                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1 shadow-sm">
                                      <span className="text-[11px] font-medium text-slate-500">Parent Fallback:</span>
                                      <input
                                        type="number"
                                        placeholder={String(group.parentDefault)}
                                        value={parentVal}
                                        onChange={(e) => handleNestedChange(group.target, group.parentKey, e.target.value)}
                                        className="w-14 text-xs font-bold text-[#087F8C] text-right focus:outline-none"
                                        title="Deduction % if sub-defects are not individually specified"
                                      />
                                      <span className="text-xs font-bold text-slate-400">%</span>
                                    </div>

                                    {/* Sub-Defect Accordion Toggle */}
                                    <button
                                      type="button"
                                      onClick={() => toggleDefectExpand(group.id)}
                                      className="flex items-center gap-1 text-xs font-semibold text-[#087F8C] hover:text-[#116466] px-2.5 py-1.5 bg-white border border-slate-200 hover:border-[#087F8C] rounded-lg transition shadow-sm"
                                    >
                                      <span>{isExpanded ? 'Hide Sub-Defects' : 'Sub-Defects'}</span>
                                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>

                                {/* Granular Cashify Sub-Defects Grid */}
                                {isExpanded && (
                                  <div className="p-3.5 bg-white animate-fadeIn">
                                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-[#087F8C]" />
                                      Granular Cashify Follow-Up Question Deductions:
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                      {group.subDefects.map((sub) => {
                                        const subVal = formData[sub.target]?.[sub.key] ?? '';
                                        return (
                                          <div
                                            key={sub.key}
                                            className="bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg p-2.5 transition flex flex-col justify-between"
                                          >
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5 leading-snug">
                                              {sub.label}
                                            </label>
                                            <div className="relative flex items-center">
                                              <input
                                                type="number"
                                                placeholder={String(sub.default)}
                                                value={subVal}
                                                onChange={(e) => handleNestedChange(sub.target, sub.key, e.target.value)}
                                                className="w-full text-xs font-semibold px-2 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#087F8C] focus:border-[#087F8C] focus:outline-none pr-6"
                                              />
                                              <span className="absolute right-2 text-xs font-bold text-slate-400 pointer-events-none">
                                                %
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Cashify 18 Functional Problems */}
                      <div>
                        <h4 className="admin-section-title">Hardware & Functional Problems (Percentage %)</h4>
                        <p className="text-xs text-slate-500 mb-2">Step 3: Applied if user selects hardware/camera/sensor issues</p>
                        <div className="admin-multiplier-grid">
                          {[
                            'front_camera', 'back_camera', 'volume_button', 'finger_touch',
                            'face_sensor', 'speaker_faulty', 'power_button', 'charging_port',
                            'audio_receiver', 'camera_glass_broken', 'bluetooth', 'vibrator',
                            'microphone', 'proximity_sensor', 'battery_service', 'battery_80_85',
                            'silent_button', 'wifi_issue'
                          ].map((key) => (
                            <div key={key} className="admin-multiplier-item">
                              <label>{MOBILE_FUNCTIONAL_LABELS[key] || key}</label>
                              <input
                                type="number"
                                value={formData.functionalDeductions?.[key] ?? ''}
                                onChange={(e) => handleNestedChange('functionalDeductions', key, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. General Evaluation & Accessories */}
                      <div>
                        <h4 className="admin-section-title">General Device & Accessories Deductions (Percentage %)</h4>
                        <p className="text-xs text-slate-500 mb-2">Step 1 & 4: Applied for calls, screen original, warranty, bill, eSIM, box, charger</p>
                        <div className="admin-multiplier-grid">
                          {[
                            'dead', 'screenFaulty', 'copyScreen', 'outOfWarranty',
                            'noBill', 'eSIM', 'noBox', 'noCharger'
                          ].map((key) => (
                            <div key={key} className="admin-multiplier-item">
                              <label>{MOBILE_FUNCTIONAL_LABELS[key] || key}</label>
                              <input
                                type="number"
                                value={formData.functionalDeductions?.[key] ?? ''}
                                onChange={(e) => handleNestedChange('functionalDeductions', key, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* LAPTOP & MAC FUNCTIONAL DEDUCTIONS */}
                  {(formData.category === 'laptop' || formData.category === 'mac') && (
                    <div>
                      <h4 className="admin-section-title">Laptop Functional Deductions (Percentage %)</h4>
                      <div className="admin-multiplier-grid">
                        {[
                          'battery', 'keyboard', 'trackpad', 'speakers', 'webcam',
                          'ports', 'hinge', 'overheat', 'gpu', 'screenChanged',
                          'wifi', 'biometric', 'charging', 'cdDrive', 'chargerIssue',
                          'hardDisk', 'displayIssue', 'motherboard'
                        ].map((issue) => (
                          <div key={issue} className="admin-multiplier-item">
                            <label>{issue} (%)</label>
                            <input
                              type="number"
                              value={formData.functionalDeductions?.[issue] ?? ''}
                              onChange={(e) => handleNestedChange('functionalDeductions', issue, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screen & Body Deductions (Laptop) */}
                  {(formData.category === 'laptop' || formData.category === 'mac') && (
                    <>
                      <div>
                        <h4 className="admin-section-title">Screen Deductions (Percentage %)</h4>
                        <div className="admin-multiplier-grid">
                          {Object.keys(formData.screenDeductions || {}).map((sd) => (
                            <div key={sd} className="admin-multiplier-item">
                              <label>{SCREEN_DEDUCTION_LABELS[sd] || sd}</label>
                              <input
                                type="number"
                                value={formData.screenDeductions[sd]}
                                onChange={(e) => handleNestedChange('screenDeductions', sd, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="admin-section-title">Body Assessment Deductions (Percentage %)</h4>
                        <div className="admin-multiplier-grid">
                          {Object.keys(formData.bodyDeductions || {}).map((bd) => (
                            <div key={bd} className="admin-multiplier-item">
                              <label>{bd}</label>
                              <input
                                type="number"
                                value={formData.bodyDeductions[bd]}
                                onChange={(e) => handleNestedChange('bodyDeductions', bd, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="admin-section-title">Dedicated GPU Pricing Bonus (INR)</h4>
                        <div className="admin-multiplier-grid">
                          {Object.keys(formData.dedicatedGpuBonus || {}).map((gpu) => (
                            <div key={gpu} className="admin-multiplier-item">
                              <label>{gpu}</label>
                              <input
                                type="number"
                                value={formData.dedicatedGpuBonus[gpu]}
                                onChange={(e) => handleNestedChange('dedicatedGpuBonus', gpu, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Accessories Bonus */}
                  <div>
                    <h4 className="admin-section-title">Accessories Bonus / Deductions (INR)</h4>
                    <div className="admin-multiplier-grid">
                      {Object.keys(formData.accessoriesBonus || {}).map((acc) => (
                        <div key={acc} className="admin-multiplier-item">
                          <label>{acc}</label>
                          <input
                            type="number"
                            value={formData.accessoriesBonus[acc]}
                            onChange={(e) => handleNestedChange('accessoriesBonus', acc, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-btn admin-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {selectedDevice ? 'Save Changes' : 'Create Device'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
