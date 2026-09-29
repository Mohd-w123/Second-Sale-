// Default Quiz Configurations based on live Cashify ground truth
// seedVersion: increment when deduction values change to auto-reset stale DB configs
export const QUIZ_SEED_VERSION = 5;

export const DEFAULT_QUIZZES = {
  mobile: {
    category: 'mobile',
    seedVersion: 5,
    steps: [
      {
        id: 'device_details',
        label: 'Device Details',
        subtitle: 'Tell us more about your device',
        questions: [
          {
            id: 'able_to_make_calls',
            title: 'Are you able to make and receive calls?',
            subtitle: 'Check your device for cellular network connectivity issues.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 90, isNegative: true },
            ],
          },
          {
            id: 'touch_screen_working',
            title: "Is your device's touch screen working properly?",
            subtitle: 'Check the touch screen functionality of your phone.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 65, isNegative: true },
            ],
          },
          {
            id: 'screen_original',
            title: "Is your phone's screen original?",
            subtitle: 'Pick "Yes" if screen was never changed or was changed by Authorized Service Center.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 50, isNegative: true },
            ],
          },
          {
            id: 'manufacturer_warranty',
            title: 'Is your device under manufacturer warranty?',
            subtitle: "You can get a better price if it's under manufacturer warranty with a GST valid bill.",
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 20, isNegative: true },
            ],
          },
          {
            id: 'gst_bill',
            title: 'Do you have GST valid bill with the same IMEI?',
            subtitle: 'Make sure your bill has device IMEI mentioned on it.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 21, isNegative: true },
            ],
          },
          {
            id: 'esim_support',
            title: 'How many eSIMs does your device support?',
            subtitle: 'Please select "Dual eSIM" if your device supports dual eSIMs. Otherwise, select "Single eSIM".',
            type: 'single_choice',
            required: false,
            options: [
              { id: 'single_esim', label: 'Single eSIM', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'dual_esim', label: 'Dual eSIM', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'esim_only_global', label: 'eSIM Only (US/Global Variant)', deductionType: 'percentage', deductionValue: 6, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'screen_body_defects',
        label: 'Screen & Body',
        subtitle: 'Select screen/body defects that are applicable!',
        questions: [
          {
            id: 'physical_defects',
            title: 'Select screen/body defects that are applicable',
            subtitle: 'Please provide correct details',
            type: 'multi_choice',
            required: false,
            options: [
              {
                id: 'defect_screen_broken_scratch',
                label: 'Broken/scratch on device screen',
                description: 'Cracks, scratches or broken display glass',
                icon: 'DefectScreenBrokenScratchIcon',
                deductionType: 'percentage',
                deductionValue: 25,
                isNegative: true,
              },
              {
                id: 'defect_screen_spots_lines',
                label: 'Dead Spot/Visible line and Discoloration on screen',
                description: 'Visible lines, yellow/pink spots or discoloration',
                icon: 'DefectScreenSpotsLinesIcon',
                deductionType: 'percentage',
                deductionValue: 25,
                isNegative: true,
              },
              {
                id: 'defect_body_scratch_dent',
                label: 'Scratch/Dent on device body',
                description: 'Minor/major scratches or dents on side frame or back',
                icon: 'DefectBodyScratchDentIcon',
                deductionType: 'percentage',
                deductionValue: 6,
                isNegative: true,
              },
              {
                id: 'defect_panel_missing_broken',
                label: 'Device panel missing/broken',
                description: 'Back panel or side buttons loose/cracked/missing',
                icon: 'DefectPanelMissingBrokenIcon',
                deductionType: 'percentage',
                deductionValue: 25,
                isNegative: true,
              },
            ],
          },
          // ── Sub-defect deductions: configurable per sub-option from admin panel ──
          // These options MATCH the deductionKey values in SUB_DEFECT_CONFIGS on the frontend.
          // getDeductionPct() searches all quiz config options, so setting these here
          // makes each sub-option percentage admin-configurable without any code changes.
          {
            id: 'sub_screen_broken_scratch',
            title: '↳ Broken/Scratch Sub-options',
            subtitle: 'Deduction % for each screen damage severity (applies when user selects sub-condition)',
            type: 'single_choice',
            required: false,
            options: [
              { id: 'screen_cracked', label: 'Screen cracked / glass broken (in warranty)', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'screen_chipped', label: 'Chipped / cracked outside display area (in warranty)', deductionType: 'percentage', deductionValue: 15, isNegative: true },
              { id: 'screen_scratches_major', label: 'More than 2 scratches on screen (in warranty)', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'screen_scratches_minor', label: '1–2 scratches on screen (in warranty)', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              // Out-of-warranty overrides — applied automatically when device is out of warranty
              { id: 'screen_cracked_ow', label: 'Screen cracked / glass broken (out of warranty)', deductionType: 'percentage', deductionValue: 35, isNegative: true },
              { id: 'screen_chipped_ow', label: 'Chipped / cracked outside display area (out of warranty)', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'screen_scratches_major_ow', label: 'More than 2 scratches on screen (out of warranty)', deductionType: 'percentage', deductionValue: 20, isNegative: true },
              { id: 'screen_scratches_minor_ow', label: '1–2 scratches on screen (out of warranty)', deductionType: 'percentage', deductionValue: 8, isNegative: true },
            ],
          },
          {
            id: 'sub_screen_spots_lines',
            title: '↳ Dead Spot/Lines Sub-options',
            subtitle: 'Deduction % for each dead-spot/line/discoloration sub-condition',
            type: 'single_choice',
            required: false,
            options: [
              { id: 'deadPixels', label: 'Large / heavy visible spots on screen', deductionType: 'percentage', deductionValue: 30, isNegative: true },
              { id: 'dead_spots_lines', label: '3 or more minor spots on screen', deductionType: 'percentage', deductionValue: 30, isNegative: true },
              { id: 'screen_spots_minor', label: '1–2 minor spots on screen', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              { id: 'screen_lines', label: 'Visible line(s) on display', deductionType: 'percentage', deductionValue: 30, isNegative: true },
              { id: 'screen_faded', label: 'Display faded along edges', deductionType: 'percentage', deductionValue: 16, isNegative: true },
              { id: 'screen_discoloration_major', label: 'Major discoloration', deductionType: 'percentage', deductionValue: 18, isNegative: true },
              { id: 'screen_discoloration_minor', label: 'Minor discoloration', deductionType: 'percentage', deductionValue: 10, isNegative: true },
            ],
          },
          {
            id: 'sub_body_scratch_dent',
            title: '↳ Body Scratch/Dent Sub-options',
            subtitle: 'Deduction % for each body scratch/dent sub-condition',
            type: 'single_choice',
            required: false,
            options: [
              { id: 'scratches', label: 'More than 2 scratches on body', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'body_scratches_minor', label: '1–2 scratches on body', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'body_dents_major', label: 'Major dents or more than 2 dents on body', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'body_scratches_dents', label: '1–2 minor dents on body', deductionType: 'percentage', deductionValue: 5, isNegative: true },
            ],
          },
          {
            id: 'sub_panel_missing_broken',
            title: '↳ Panel Missing/Broken Sub-options',
            subtitle: 'Deduction % for each panel damage sub-condition',
            type: 'single_choice',
            required: false,
            options: [
              { id: 'panel_cracked', label: 'Cracked / broken side or back panel', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'panel_missing', label: 'Missing side or back panel', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'bent_curved', label: 'Bent / curved panel', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'loose_screen', label: 'Loose screen (gap between screen and body)', deductionType: 'percentage', deductionValue: 10, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'functional_issues',
        label: 'Functional Problems',
        subtitle: 'Functional or Physical Problems',
        questions: [
          {
            id: 'hardware_problems',
            title: 'Functional or Physical Problems',
            subtitle: 'Select any hardware issues your device has',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'front_camera', label: 'Front Camera not working', icon: 'FrontCameraIcon', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'back_camera', label: 'Back Camera not working', icon: 'BackCameraIcon', deductionType: 'percentage', deductionValue: 12, isNegative: true },
              { id: 'volume_button', label: 'Volume Button not working', icon: 'VolumeButtonIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'finger_touch', label: 'Finger Touch / Face ID', icon: 'FingerTouchIcon', deductionType: 'percentage', deductionValue: 14, isNegative: true },
              { id: 'wifi_issue', label: 'WiFi not working', icon: 'WifiSignalIcon', deductionType: 'percentage', deductionValue: 14, isNegative: true },
              { id: 'speaker_faulty', label: 'Speaker Faulty', icon: 'SpeakerIcon', deductionType: 'percentage', deductionValue: 4, isNegative: true },
              { id: 'silent_button', label: 'Silent Button not working', icon: 'SilentSwitchIcon', deductionType: 'percentage', deductionValue: 2, isNegative: true },
              { id: 'face_sensor', label: 'Face Sensor not working', icon: 'FaceSensorIcon', deductionType: 'percentage', deductionValue: 16, isNegative: true },
              { id: 'power_button', label: 'Power Button not working', icon: 'PowerButtonIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'charging_port', label: 'Charging Port not working', icon: 'ChargingPortIcon', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'audio_receiver', label: 'Audio Receiver not working', icon: 'SpeakerIcon', deductionType: 'percentage', deductionValue: 4, isNegative: true },
              { id: 'camera_glass_broken', label: 'Camera Glass Broken', icon: 'CameraGlassBrokenIcon', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              { id: 'microphone', label: 'Microphone not working', icon: 'MicrophoneIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'bluetooth', label: 'Bluetooth not working', icon: 'BluetoothIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'vibrator', label: 'Vibrator is not working', icon: 'VibratorIcon', deductionType: 'percentage', deductionValue: 2, isNegative: true },
              { id: 'proximity_sensor', label: 'Proximity Sensor not working', icon: 'ProximitySensorIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'battery_service', label: 'Battery in Service (<80% health)', icon: 'BatteryWarningIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'battery_80_85', label: 'Battery Health 80-85%', icon: 'BatteryWarningYellowIcon', deductionType: 'percentage', deductionValue: 5, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'accessories',
        label: 'Accessories',
        subtitle: 'Do you have the following?',
        questions: [
          {
            id: 'device_accessories',
            title: 'Do you have the following?',
            subtitle: 'Please select accessories which are available',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'box', label: 'Original Box of Device', description: 'Original box with matching IMEI', icon: 'BoxPackagingIcon', deductionType: 'percentage', deductionValue: 5, isNegative: false },
              { id: 'charger', label: 'Original Charger of Device', description: 'Original charging adapter & cable', icon: 'ChargerPlugIcon', deductionType: 'percentage', deductionValue: 3, isNegative: false },
            ],
          },
        ],
      },
    ],
  },
  tablet: {
    category: 'tablet',
    seedVersion: 2,
    steps: [
      {
        id: 'device_details',
        label: 'Tablet Details',
        subtitle: 'Basic functional questions about your tablet / iPad',
        questions: [
          {
            id: 'does_tablet_switch_on',
            title: 'Does your tablet switch on and work properly?',
            subtitle: 'Check if tablet boots to home screen and charges normally.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 90, isNegative: true },
            ],
          },
          {
            id: 'touch_screen_working',
            title: "Is tablet's touch screen working properly?",
            subtitle: 'Check multi-touch response and gestures across the screen.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 65, isNegative: true },
            ],
          },
          {
            id: 'screen_original',
            title: "Is your tablet's screen original?",
            subtitle: 'Pick "Yes" if screen was never replaced or replaced by authorized center.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 50, isNegative: true },
            ],
          },
          {
            id: 'cellular_network_working',
            title: 'Is cellular / SIM network working (if cellular variant)?',
            subtitle: 'Skip or select Yes for Wi-Fi only models.',
            type: 'yes_no',
            required: false,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 20, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'screen_body_defects',
        label: 'Screen & Body',
        subtitle: 'Cosmetic condition of screen and enclosure',
        questions: [
          {
            id: 'screen_defects',
            title: 'Screen defects',
            subtitle: 'Select any that apply to your tablet display',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'scratches', label: 'Scratches on Screen', description: 'Light or heavy scratches on glass', icon: 'DefectScreenBrokenScratchIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'cracked', label: 'Cracked Glass / Display', description: 'Chipped edges or cracked panel', icon: 'DefectScreenBrokenScratchIcon', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'faulty', label: 'Faulty Lines or Spots', description: 'Dead pixels, visible lines or discoloration', icon: 'DefectScreenSpotsLinesIcon', deductionType: 'percentage', deductionValue: 30, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'functional_issues',
        label: 'Hardware & Accessories',
        subtitle: 'Component functionality and bundled items',
        questions: [
          {
            id: 'functional_problems',
            title: 'Hardware Issues',
            subtitle: 'Select any faulty components',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'battery_service', label: 'Battery Warning / Degraded', icon: 'BatteryWarningIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'wifi_issue', label: 'Wi-Fi / Bluetooth Faulty', icon: 'WifiSignalIcon', deductionType: 'percentage', deductionValue: 14, isNegative: true },
              { id: 'front_camera', label: 'Front Camera Faulty', icon: 'FrontCameraIcon', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'back_camera', label: 'Back Camera Faulty', icon: 'BackCameraIcon', deductionType: 'percentage', deductionValue: 12, isNegative: true },
              { id: 'charging_port', label: 'Charging Port Faulty', icon: 'ChargingPortIcon', deductionType: 'percentage', deductionValue: 6, isNegative: true },
            ],
          },
          {
            id: 'accessories',
            title: 'Available Accessories',
            subtitle: 'Items included with tablet',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'charger', label: 'Original Charger & Cable', description: 'Original fast charger and cable', icon: 'ChargerPlugIcon', deductionType: 'percentage', deductionValue: 3, isNegative: false },
              { id: 'box', label: 'Original Box', description: 'Retail box with matching serial', icon: 'BoxPackagingIcon', deductionType: 'percentage', deductionValue: 5, isNegative: false },
              { id: 'pencil', label: 'Apple Pencil / Stylus', description: 'Working original stylus pen', icon: 'BoxPackagingIcon', deductionType: 'percentage', deductionValue: 8, isNegative: false },
            ],
          },
        ],
      },
    ],
  },
  laptop: {
    category: 'laptop',
    seedVersion: 2,
    steps: [
      {
        id: 'power_status',
        label: 'Power & Boot',
        subtitle: 'Verify powering on and OS boot status',
        questions: [
          {
            id: 'powers_on',
            title: 'Does laptop turn on and boot to operating system?',
            subtitle: 'Device turns on without hanging or blue screen.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 85, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'screen_condition',
        label: 'Screen & Display',
        subtitle: 'Select any display defects present',
        questions: [
          {
            id: 'screen_defects',
            title: 'Display Condition',
            subtitle: 'Scratches, lines or cracked screen',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'screen_scratches_minor', label: '1-2 Minor Scratches on screen', icon: 'LaptopScreenMinorScratchesIcon', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              { id: 'screen_scratches_major', label: 'Major Scratches on screen', icon: 'LaptopScreenMajorScratchesIcon', deductionType: 'percentage', deductionValue: 15, isNegative: true },
              { id: 'screen_cracked', label: 'Screen Cracked / Glass Broken', icon: 'LaptopScreenCrackedIcon', deductionType: 'percentage', deductionValue: 35, isNegative: true },
              { id: 'screen_lines_visible', label: 'Visible Lines / Flickering', icon: 'LaptopScreenVisibleLinesIcon', deductionType: 'percentage', deductionValue: 25, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'functional_issues',
        label: 'Functional & Hardware',
        subtitle: 'Keyboard, trackpad and port condition',
        questions: [
          {
            id: 'hardware_issues',
            title: 'Functional Problems',
            subtitle: 'Check individual laptop hardware features',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'keyboard', label: 'Keyboard Faulty / Keys Missing', icon: 'KeyboardIcon', deductionType: 'percentage', deductionValue: 7, isNegative: true },
              { id: 'trackpad', label: 'Trackpad / Mouse Click Faulty', icon: 'TrackpadIcon', deductionType: 'percentage', deductionValue: 18, isNegative: true },
              { id: 'battery', label: 'Battery Backup Under 60 Mins', icon: 'BatteryWarningIcon', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'speakers', label: 'Speakers Faulty / Distorted', icon: 'SpeakerIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'wifi', label: 'Wi-Fi Not Connecting', icon: 'WifiSignalIcon', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              { id: 'ports', label: 'USB / Type-C Ports Faulty', icon: 'UsbPortIcon', deductionType: 'percentage', deductionValue: 8, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'accessories',
        label: 'Accessories',
        subtitle: 'Original charger and packaging',
        questions: [
          {
            id: 'laptop_accessories',
            title: 'Included Accessories',
            subtitle: 'Select available accessories',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'charger', label: 'Original Power Adapter / Charger', icon: 'ChargerPlugIcon', deductionType: 'percentage', deductionValue: 5, isNegative: false },
              { id: 'box', label: 'Original Laptop Box', icon: 'BoxPackagingIcon', deductionType: 'percentage', deductionValue: 3, isNegative: false },
            ],
          },
        ],
      },
    ],
  },
  tv: {
    category: 'tv',
    steps: [
      {
        id: 'tv_specs_condition',
        label: 'Specs & Physical Condition',
        subtitle: 'Tell us a few things about your TV',
        questions: [
          {
            id: 'does_tv_switch_on',
            title: 'Does the Television switch on?',
            subtitle: 'We currently accept devices that power on and boot',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 90, isNegative: true },
            ],
          },
          {
            id: 'display_type',
            title: 'Display Type',
            subtitle: 'Select the panel display technology of your TV',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'led', label: 'LED', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'qled', label: 'QLED', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'oled', label: 'OLED', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'lcd', label: 'LCD', deductionType: 'percentage', deductionValue: 15, isNegative: true },
            ],
          },
          {
            id: 'smart_tv',
            title: 'Smart Television',
            subtitle: 'Is your TV smart? Check for the OS installed',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'smart_android', label: 'Yes - Android / Google TV', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'smart_non_android', label: 'Yes - Non Android (Tizen/webOS)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'non_smart', label: 'No (Standard LED)', deductionType: 'percentage', deductionValue: 15, isNegative: true },
            ],
          },
          {
            id: 'resolution',
            title: 'Television Resolution',
            subtitle: 'Select display resolution of your TV',
            type: 'single_choice',
            required: true,
            options: [
              { id: '4k', label: 'Ultra HD 4K', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'fhd', label: 'Full HD (1080p)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'hd_ready', label: 'HD Ready (720p)', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: '8k', label: 'Ultra HD 8K', deductionType: 'percentage', deductionValue: 0, isNegative: false },
            ],
          },
          {
            id: 'screen_condition',
            title: 'Screen Condition',
            subtitle: "Check device's screen for line(s), dot(s) and/or crack(s)",
            type: 'single_choice',
            required: true,
            options: [
              { id: 'flawless', label: 'Flawless', description: 'Crystal clear screen with zero defects', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'lines_dots', label: 'Screen Lines / Dots', description: 'Dead pixels, vertical lines or patches', deductionType: 'percentage', deductionValue: 35, isNegative: true },
              { id: 'cracked', label: 'Screen Broken / Cracked', description: 'Glass crack, shattered display or black ink leak', deductionType: 'percentage', deductionValue: 65, isNegative: true },
            ],
          },
          {
            id: 'physical_condition',
            title: 'Physical Body Condition',
            subtitle: "Check device's bezel and back for scratch(es), dent(s) and/or crack(s)",
            type: 'single_choice',
            required: true,
            options: [
              { id: 'flawless', label: 'Flawless', description: 'No scratches or dents on frame/body', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'scratches', label: 'Scratches on Frame', description: 'Minor or normal cosmetic scratches', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'dented_cracked', label: 'Dented / Cracked Body', description: 'Chipped edges, broken back panel or dents', deductionType: 'percentage', deductionValue: 20, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'tv_functional_defects',
        label: 'Functional Condition',
        subtitle: 'Select defects that apply to your TV',
        questions: [
          {
            id: 'defects',
            title: 'Hardware & Functional Problems',
            subtitle: 'Select any faulty features (or leave empty if flawless)',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'button_faulty', label: 'Power / TV Physical Buttons not working', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              { id: 'port_faulty', label: 'USB / HDMI Port not working', deductionType: 'percentage', deductionValue: 8, isNegative: true },
              { id: 'speaker_faulty', label: 'Speaker is faulty / cracked sound', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'bluetooth_faulty', label: 'Bluetooth is faulty / not connecting', deductionType: 'percentage', deductionValue: 5, isNegative: true },
              { id: 'wifi_faulty', label: 'Wi-Fi is faulty / drops network', deductionType: 'percentage', deductionValue: 8, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'tv_accessories',
        label: 'Accessories & Documents',
        subtitle: 'Do you have the following accessories available?',
        questions: [
          {
            id: 'accessories_list',
            title: 'Included Accessories & Bill',
            subtitle: 'Select accessories which you can provide at pickup',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'remote', label: 'Original TV Remote Controller', deductionType: 'percentage', deductionValue: 8, isNegative: false },
              { id: 'power_cable', label: 'Original Power Cable / Adapter', deductionType: 'percentage', deductionValue: 4, isNegative: false },
              { id: 'stand', label: 'Default Table Stand Legs / Base', deductionType: 'percentage', deductionValue: 5, isNegative: false },
              { id: 'box', label: 'Original Box (With Same Serial No)', deductionType: 'percentage', deductionValue: 2, isNegative: false },
              { id: 'bill', label: 'Valid Purchase Bill (With Serial No)', deductionType: 'percentage', deductionValue: 3, isNegative: false },
            ],
          },
        ],
      },
      {
        id: 'tv_age',
        label: 'Television Age',
        subtitle: 'What is your Television age?',
        questions: [
          {
            id: 'age',
            title: 'Television Age Range',
            subtitle: 'Select appropriate age bracket',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'less_than_1', label: 'Less than 1 year (in warranty)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: '1_to_3_years', label: 'Between 1 - 3 years', deductionType: 'percentage', deductionValue: 12, isNegative: true },
              { id: 'more_than_3_years', label: 'More than 3 years', deductionType: 'percentage', deductionValue: 25, isNegative: true },
            ],
          },
        ],
      },
    ],
  },
  smartwatch: {
    category: 'smartwatch',
    steps: [
      {
        id: 'watch_details',
        label: 'Device Details',
        subtitle: 'Tell us more about your smartwatch',
        questions: [
          {
            id: 'watch_turn_on',
            title: 'Does your smartwatch turn on and boot properly?',
            subtitle: 'Check if the device powers on and shows screen display.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 70, isNegative: true },
            ],
          },
          {
            id: 'watch_touch_screen',
            title: 'Is the touch screen responding smoothly?',
            subtitle: 'Check if swipes, taps, and digital crown work properly.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 40, isNegative: true },
            ],
          },
          {
            id: 'watch_screen_condition',
            title: 'Screen & Glass Condition',
            subtitle: 'Select the visual condition of the front display glass.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'no_scratch', label: 'Flawless (No scratches)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'minor_scratch', label: '1-2 Minor hairline scratches', deductionType: 'percentage', deductionValue: 8, isNegative: true },
              { id: 'major_scratches', label: 'Multiple visible scratches', deductionType: 'percentage', deductionValue: 18, isNegative: true },
              { id: 'cracked_broken', label: 'Cracked or chipped glass', deductionType: 'percentage', deductionValue: 50, isNegative: true },
            ],
          },
          {
            id: 'watch_warranty',
            title: 'Is your smartwatch under valid brand warranty?',
            subtitle: 'Having a valid GST purchase invoice increases your value.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes (Under warranty)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No / Expired', deductionType: 'percentage', deductionValue: 15, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'watch_functional_defects',
        label: 'Functional & Health Sensors',
        subtitle: 'Select applicable sensor or hardware defects',
        questions: [
          {
            id: 'watch_defects',
            title: 'Select functional issues if applicable',
            subtitle: 'Select all that apply to your watch',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'battery_issue', label: 'Battery drains rapidly (<12 hours)', deductionType: 'percentage', deductionValue: 15, isNegative: true },
              { id: 'sensor_faulty', label: 'Heart rate / SpO2 / ECG sensor faulty', deductionType: 'percentage', deductionValue: 20, isNegative: true },
              { id: 'speaker_mic_faulty', label: 'Speaker or microphone not clear', deductionType: 'percentage', deductionValue: 12, isNegative: true },
              { id: 'vibration_faulty', label: 'Vibration / haptic motor not working', deductionType: 'percentage', deductionValue: 8, isNegative: true },
              { id: 'bluetooth_wifi_faulty', label: 'Bluetooth or Wi-Fi sync issues', deductionType: 'percentage', deductionValue: 25, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'watch_accessories',
        label: 'Accessories & Strap',
        subtitle: 'Which accessories do you have available?',
        questions: [
          {
            id: 'watch_acc',
            title: 'Included Accessories',
            subtitle: 'Original accessories give you the highest trade-in value.',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'original_charger', label: 'Original magnetic charging cable/puck', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'original_strap', label: 'Original strap / band intact', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'original_box', label: 'Original brand retail box', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'missing_charger', label: 'Missing original charger', deductionType: 'flat_inr', deductionValue: 800, isNegative: true },
              { id: 'missing_box', label: 'Missing retail box', deductionType: 'flat_inr', deductionValue: 300, isNegative: true },
            ],
          },
        ],
      },
    ],
  },
  earbuds: {
    category: 'earbuds',
    steps: [
      {
        id: 'earbuds_details',
        label: 'Audio & Connectivity',
        subtitle: 'Tell us about playback and audio clarity',
        questions: [
          {
            id: 'earbuds_working',
            title: 'Are both earbuds functioning properly?',
            subtitle: 'Check audio playback from both left and right sides.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'both_working', label: 'Both earbuds working properly', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'left_only', label: 'Only Left earbud works (Right is dead)', deductionType: 'percentage', deductionValue: 50, isNegative: true },
              { id: 'right_only', label: 'Only Right earbud works (Left is dead)', deductionType: 'percentage', deductionValue: 50, isNegative: true },
              { id: 'neither_working', label: 'Neither earbud works', deductionType: 'percentage', deductionValue: 85, isNegative: true },
            ],
          },
          {
            id: 'earbuds_audio_quality',
            title: 'Sound Quality & Microphone',
            subtitle: 'Check audio clarity, bass, and calling mic.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'flawless_sound', label: 'Flawless clear audio & mic', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'low_volume', label: 'Low volume in one or both earbuds', deductionType: 'percentage', deductionValue: 20, isNegative: true },
              { id: 'distorted_sound', label: 'Distorted or buzzing sound', deductionType: 'percentage', deductionValue: 30, isNegative: true },
              { id: 'mic_not_working', label: 'Microphone not picking up voice on calls', deductionType: 'percentage', deductionValue: 15, isNegative: true },
            ],
          },
          {
            id: 'earbuds_warranty',
            title: 'Is your device under valid manufacturer warranty?',
            subtitle: 'Valid GST bill required for in-warranty pricing.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes (Under warranty with invoice)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No / Expired', deductionType: 'percentage', deductionValue: 15, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'earbuds_case_condition',
        label: 'Charging Case & Battery',
        subtitle: 'Select charging case functionality and battery backup',
        questions: [
          {
            id: 'case_condition',
            title: 'Charging Case Condition',
            subtitle: 'Does the charging case hold charge and charge both earbuds?',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'case_flawless', label: 'Case charges normally & holds battery', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'case_battery_weak', label: 'Case battery drains quickly', deductionType: 'percentage', deductionValue: 20, isNegative: true },
              { id: 'case_not_charging', label: 'Case not charging earbuds properly', deductionType: 'percentage', deductionValue: 45, isNegative: true },
            ],
          },
          {
            id: 'earbuds_body_condition',
            title: 'Physical Cosmetic Condition',
            subtitle: 'Scratches, scuffs, or dents on earbuds/case.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'like_new', label: 'Flawless (No scratches or dents)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'minor_scratches', label: 'Minor surface scuffs on case', deductionType: 'percentage', deductionValue: 6, isNegative: true },
              { id: 'heavy_scratches', label: 'Deep scratches, yellowing, or chipped plastic', deductionType: 'percentage', deductionValue: 20, isNegative: true },
            ],
          },
        ],
      },
    ],
  },
  gaming: {
    category: 'gaming',
    steps: [
      {
        id: 'console_details',
        label: 'System & Power',
        subtitle: 'Console boot, display, and disk drive',
        questions: [
          {
            id: 'console_powers_on',
            title: 'Does the console power on and display home menu?',
            subtitle: 'Check if system boots cleanly without error lights or beeps.',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes (Boots to dashboard)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No / Power light of death / Shuts down immediately', deductionType: 'percentage', deductionValue: 80, isNegative: true },
            ],
          },
          {
            id: 'console_display_output',
            title: 'HDMI / Video Output Quality',
            subtitle: 'Check HDMI port for artifacts, flickering, or bent pins.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'flawless_hdmi', label: 'Flawless 1080p / 4K output without glitch', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'loose_hdmi', label: 'Loose HDMI port / intermittent signal', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'damaged_hdmi', label: 'Damaged HDMI port / no video output', deductionType: 'percentage', deductionValue: 60, isNegative: true },
            ],
          },
          {
            id: 'console_disc_drive',
            title: 'Disc Drive Condition',
            subtitle: 'Applies to Disc / Standard Edition consoles.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'drive_working', label: 'Disc drive reads & ejects game discs properly', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'drive_faulty', label: 'Disc drive makes grinding noise or cannot read discs', deductionType: 'percentage', deductionValue: 25, isNegative: true },
              { id: 'digital_console', label: 'Digital Edition (No disc drive)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
            ],
          },
        ],
      },
      {
        id: 'console_controllers_thermal',
        label: 'Controller & Cooling',
        subtitle: 'Thermal status and controller functionality',
        questions: [
          {
            id: 'console_controller',
            title: 'Controller Condition',
            subtitle: 'Check thumbsticks, triggers, and wireless connectivity.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'controller_flawless', label: 'Original wireless controller in flawless working order', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'stick_drift', label: 'Controller has stick drift or worn thumbsticks', deductionType: 'percentage', deductionValue: 15, isNegative: true },
              { id: 'no_controller', label: 'No controller included', deductionType: 'flat_inr', deductionValue: 2500, isNegative: true },
            ],
          },
          {
            id: 'console_thermals',
            title: 'Fan Noise & Temperature',
            subtitle: 'Check cooling fans under load while playing games.',
            type: 'single_choice',
            required: true,
            options: [
              { id: 'normal_quiet', label: 'Runs quietly without overheating warning', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'loud_fan', label: 'Very loud jet engine fan noise under load', deductionType: 'percentage', deductionValue: 12, isNegative: true },
              { id: 'overheating_shutdown', label: 'Console overheats and shuts down during gameplay', deductionType: 'percentage', deductionValue: 40, isNegative: true },
            ],
          },
        ],
      },
      {
        id: 'console_accessories',
        label: 'Cables & Retail Box',
        subtitle: 'Select included cables and packaging',
        questions: [
          {
            id: 'console_acc',
            title: 'Included Accessories',
            subtitle: 'Standard accessories required for trade-in.',
            type: 'multi_choice',
            required: false,
            options: [
              { id: 'power_cable', label: 'Original AC Power Cable included', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'hdmi_cable', label: 'High Speed HDMI Cable included', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'original_box', label: 'Original packaging box with inserts', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'missing_power_hdmi', label: 'Missing power or HDMI cable', deductionType: 'flat_inr', deductionValue: 600, isNegative: true },
              { id: 'missing_box', label: 'Missing retail box', deductionType: 'flat_inr', deductionValue: 500, isNegative: true },
            ],
          },
        ],
      },
    ],
  },
};
