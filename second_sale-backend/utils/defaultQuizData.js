// Default Quiz Configurations based on live Cashify ground truth

export const DEFAULT_QUIZZES = {
  mobile: {
    category: 'mobile',
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
                deductionValue: 30,
                isNegative: true,
              },
              {
                id: 'defect_body_scratch_dent',
                label: 'Scratch/Dent on device body',
                description: 'Minor/major scratches or dents on side frame or back',
                icon: 'DefectBodyScratchDentIcon',
                deductionType: 'percentage',
                deductionValue: 10,
                isNegative: true,
              },
              {
                id: 'defect_panel_missing_broken',
                label: 'Device panel missing/broken',
                description: 'Back panel or side buttons loose/cracked/missing',
                icon: 'DefectPanelMissingBrokenIcon',
                deductionType: 'percentage',
                deductionValue: 15,
                isNegative: true,
              },
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
              { id: 'front_camera', label: 'Front Camera not working', icon: 'FrontCameraIcon', deductionType: 'percentage', deductionValue: 8, isNegative: true },
              { id: 'back_camera', label: 'Back Camera not working', icon: 'BackCameraIcon', deductionType: 'percentage', deductionValue: 15, isNegative: true },
              { id: 'volume_button', label: 'Volume Button not working', icon: 'VolumeButtonIcon', deductionType: 'percentage', deductionValue: 4, isNegative: true },
              { id: 'finger_touch', label: 'Finger Touch / Face ID', icon: 'FingerTouchIcon', deductionType: 'percentage', deductionValue: 26, isNegative: true },
              { id: 'wifi_issue', label: 'WiFi not working', icon: 'WifiSignalIcon', deductionType: 'percentage', deductionValue: 39, isNegative: true },
              { id: 'speaker_faulty', label: 'Speaker Faulty', icon: 'SpeakerIcon', deductionType: 'percentage', deductionValue: 4, isNegative: true },
              { id: 'silent_button', label: 'Silent Button not working', icon: 'SilentSwitchIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'face_sensor', label: 'Face Sensor not working', icon: 'FaceSensorIcon', deductionType: 'percentage', deductionValue: 26, isNegative: true },
              { id: 'power_button', label: 'Power Button not working', icon: 'PowerButtonIcon', deductionType: 'percentage', deductionValue: 2, isNegative: true },
              { id: 'charging_port', label: 'Charging Port not working', icon: 'ChargingPortIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'audio_receiver', label: 'Audio Receiver not working', icon: 'SpeakerIcon', deductionType: 'percentage', deductionValue: 7, isNegative: true },
              { id: 'camera_glass_broken', label: 'Camera Glass Broken', icon: 'CameraGlassBrokenIcon', deductionType: 'percentage', deductionValue: 8, isNegative: true },
              { id: 'microphone', label: 'Microphone not working', icon: 'MicrophoneIcon', deductionType: 'percentage', deductionValue: 2, isNegative: true },
              { id: 'bluetooth', label: 'Bluetooth not working', icon: 'BluetoothIcon', deductionType: 'percentage', deductionValue: 39, isNegative: true },
              { id: 'vibrator', label: 'Vibrator is not working', icon: 'VibratorIcon', deductionType: 'percentage', deductionValue: 2, isNegative: true },
              { id: 'proximity_sensor', label: 'Proximity Sensor not working', icon: 'ProximitySensorIcon', deductionType: 'percentage', deductionValue: 3, isNegative: true },
              { id: 'battery_service', label: 'Battery in Service (<80% health)', icon: 'BatteryWarningIcon', deductionType: 'percentage', deductionValue: 13, isNegative: true },
              { id: 'battery_80_85', label: 'Battery Health 80-85%', icon: 'BatteryWarningYellowIcon', deductionType: 'percentage', deductionValue: 6, isNegative: true },
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
              { id: 'battery_service', label: 'Battery Warning / Degraded', icon: 'BatteryWarningIcon', deductionType: 'percentage', deductionValue: 15, isNegative: true },
              { id: 'wifi_issue', label: 'Wi-Fi / Bluetooth Faulty', icon: 'WifiSignalIcon', deductionType: 'percentage', deductionValue: 35, isNegative: true },
              { id: 'front_camera', label: 'Front Camera Faulty', icon: 'FrontCameraIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
              { id: 'back_camera', label: 'Back Camera Faulty', icon: 'BackCameraIcon', deductionType: 'percentage', deductionValue: 12, isNegative: true },
              { id: 'charging_port', label: 'Charging Port Faulty', icon: 'ChargingPortIcon', deductionType: 'percentage', deductionValue: 10, isNegative: true },
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
};
