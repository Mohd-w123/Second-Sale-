// ─── REPAIR DATA (SYNCED WITH CASHIFY REPAIR CATALOG) ──────────────────────
// Structured data for all 16 mobile brands, series, models and repair services.

export const REPAIR_BRANDS = [
  {
    "id": "apple",
    "name": "Apple",
    "slug": "apple",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "color": "#1D1D1F"
  },
  {
    "id": "samsung",
    "name": "Samsung",
    "slug": "samsung",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    "color": "#1428A0"
  },
  {
    "id": "oneplus",
    "name": "OnePlus",
    "slug": "oneplus",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/5/5c/OnePlus_Logo.svg",
    "color": "#F5010C"
  },
  {
    "id": "xiaomi",
    "name": "Xiaomi",
    "slug": "xiaomi",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
    "color": "#FF6900"
  },
  {
    "id": "vivo",
    "name": "Vivo",
    "slug": "vivo",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Vivo_logo.svg",
    "color": "#415FFF"
  },
  {
    "id": "oppo",
    "name": "Oppo",
    "slug": "oppo",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Oppo_logo_2019.svg",
    "color": "#1F8346"
  },
  {
    "id": "realme",
    "name": "Realme",
    "slug": "realme",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.svg",
    "color": "#F5A623"
  },
  {
    "id": "motorola",
    "name": "Motorola",
    "slug": "motorola",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola_Solutions_logo.svg",
    "color": "#E1261C"
  },
  {
    "id": "google",
    "name": "Google",
    "slug": "google",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    "color": "#4285F4"
  },
  {
    "id": "poco",
    "name": "POCO",
    "slug": "poco",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/7/78/Poco_Smartphone_Company_Logo.svg",
    "color": "#FED800"
  },
  {
    "id": "iqoo",
    "name": "iQOO",
    "slug": "iqoo",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/6/69/IQOO_logo.svg",
    "color": "#FF6E00"
  },
  {
    "id": "nothing",
    "name": "Nothing",
    "slug": "nothing",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Nothing_Technology_wordmark.svg",
    "color": "#000000"
  },
  {
    "id": "infinix",
    "name": "Infinix",
    "slug": "infinix",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Infinix_logo.svg",
    "color": "#55C227"
  },
  {
    "id": "honor",
    "name": "Honor",
    "slug": "honor",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/8/82/Honor_logo_2022.svg",
    "color": "#00A4E4"
  },
  {
    "id": "asus",
    "name": "Asus",
    "slug": "asus",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    "color": "#00539B"
  },
  {
    "id": "nokia",
    "name": "Nokia",
    "slug": "nokia",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg",
    "color": "#124191"
  }
];

export const REPAIR_SERVICE_TYPES = [
  {
    "id": "screen",
    "label": "Screen Replacement",
    "icon": "📱",
    "description": "Screen replacement with original/OEM display"
  },
  {
    "id": "battery",
    "label": "Battery Replacement",
    "icon": "🔋",
    "description": "Battery replacement with 6-month warranty"
  },
  {
    "id": "front_camera",
    "label": "Front Camera Repair",
    "icon": "📷",
    "description": "Front camera module replacement"
  },
  {
    "id": "back_camera",
    "label": "Back Camera Repair",
    "icon": "📷",
    "description": "Rear camera module replacement"
  },
  {
    "id": "charging_jack",
    "label": "Charging Jack Repair",
    "icon": "🔌",
    "description": "Charging port / USB-C jack repair"
  },
  {
    "id": "mic",
    "label": "Microphone Repair",
    "icon": "🎙️",
    "description": "Microphone repair or replacement"
  },
  {
    "id": "speaker",
    "label": "Speaker Repair",
    "icon": "🔊",
    "description": "Speaker repair or replacement"
  },
  {
    "id": "receiver",
    "label": "Earpiece Receiver",
    "icon": "📞",
    "description": "Earpiece / call receiver repair"
  },
  {
    "id": "back_panel",
    "label": "Back Panel / Glass",
    "icon": "🔧",
    "description": "Back glass / housing replacement"
  }
];

export const REPAIR_MODELS = {
  "apple": [
    {
      "id": "iphone-16-pro-max",
      "name": "iPhone 16 Pro Max",
      "series": "iPhone 16 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-16-pro",
      "name": "iPhone 16 Pro",
      "series": "iPhone 16 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-16-plus",
      "name": "iPhone 16 Plus",
      "series": "iPhone 16 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-16",
      "name": "iPhone 16",
      "series": "iPhone 16 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-15-pro-max",
      "name": "iPhone 15 Pro Max",
      "series": "iPhone 15 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-15-pro",
      "name": "iPhone 15 Pro",
      "series": "iPhone 15 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-15-plus",
      "name": "iPhone 15 Plus",
      "series": "iPhone 15 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-15",
      "name": "iPhone 15",
      "series": "iPhone 15 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-14-pro-max",
      "name": "iPhone 14 Pro Max",
      "series": "iPhone 14 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-14-pro",
      "name": "iPhone 14 Pro",
      "series": "iPhone 14 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-14-plus",
      "name": "iPhone 14 Plus",
      "series": "iPhone 14 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-14",
      "name": "iPhone 14",
      "series": "iPhone 14 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-13-pro-max",
      "name": "iPhone 13 Pro Max",
      "series": "iPhone 13 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-13-pro",
      "name": "iPhone 13 Pro",
      "series": "iPhone 13 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-13",
      "name": "iPhone 13",
      "series": "iPhone 13 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-13-mini",
      "name": "iPhone 13 mini",
      "series": "iPhone 13 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-mini.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-12-pro-max",
      "name": "iPhone 12 Pro Max",
      "series": "iPhone 12 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro-max.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-12-pro",
      "name": "iPhone 12 Pro",
      "series": "iPhone 12 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-12",
      "name": "iPhone 12",
      "series": "iPhone 12 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-12-mini",
      "name": "iPhone 12 mini",
      "series": "iPhone 12 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-mini.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-11-pro-max",
      "name": "iPhone 11 Pro Max",
      "series": "iPhone 11 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-11-pro",
      "name": "iPhone 11 Pro",
      "series": "iPhone 11 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-11",
      "name": "iPhone 11",
      "series": "iPhone 11 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-xs-max",
      "name": "iPhone XS Max",
      "series": "iPhone X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs-max.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-xs",
      "name": "iPhone XS",
      "series": "iPhone X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-xr",
      "name": "iPhone XR",
      "series": "iPhone X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xr.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-x",
      "name": "iPhone X",
      "series": "iPhone X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-x.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-se-2022",
      "name": "iPhone SE (2022)",
      "series": "Older iPhones",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-se-2020",
      "name": "iPhone SE (2020)",
      "series": "Older iPhones",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2020.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-8-plus",
      "name": "iPhone 8 Plus",
      "series": "Older iPhones",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-8-plus.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iphone-8",
      "name": "iPhone 8",
      "series": "Older iPhones",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-8.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "samsung": [
    {
      "id": "galaxy-s25-ultra",
      "name": "Galaxy S25 Ultra",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s25-plus",
      "name": "Galaxy S25+",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25+.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s25",
      "name": "Galaxy S25",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s24-ultra",
      "name": "Galaxy S24 Ultra",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s24-plus",
      "name": "Galaxy S24+",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s24",
      "name": "Galaxy S24",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s23-ultra",
      "name": "Galaxy S23 Ultra",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s23-plus",
      "name": "Galaxy S23+",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s23",
      "name": "Galaxy S23",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s23-fe",
      "name": "Galaxy S23 FE",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s22-ultra",
      "name": "Galaxy S22 Ultra",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-ultra.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s22-plus",
      "name": "Galaxy S22+",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-plus.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s22",
      "name": "Galaxy S22",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s21-ultra",
      "name": "Galaxy S21 Ultra",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s21-ultra.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s21-fe",
      "name": "Galaxy S21 FE",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s21-fe.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-s20-fe",
      "name": "Galaxy S20 FE",
      "series": "Galaxy S Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s20-fe.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-z-fold6",
      "name": "Galaxy Z Fold6",
      "series": "Galaxy Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold6.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-z-flip6",
      "name": "Galaxy Z Flip6",
      "series": "Galaxy Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip6.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-z-fold5",
      "name": "Galaxy Z Fold5",
      "series": "Galaxy Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-z-flip5",
      "name": "Galaxy Z Flip5",
      "series": "Galaxy Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-z-fold4",
      "name": "Galaxy Z Fold4",
      "series": "Galaxy Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold4.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-z-flip4",
      "name": "Galaxy Z Flip4",
      "series": "Galaxy Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip4.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-note-20-ultra",
      "name": "Galaxy Note 20 Ultra",
      "series": "Galaxy Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-note-20-ultra.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-note-10-plus",
      "name": "Galaxy Note 10+",
      "series": "Galaxy Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-note10-plus.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a55-5g",
      "name": "Galaxy A55 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a35-5g",
      "name": "Galaxy A35 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a54-5g",
      "name": "Galaxy A54 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a34-5g",
      "name": "Galaxy A34 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a34.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a53-5g",
      "name": "Galaxy A53 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a53-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a52s-5g",
      "name": "Galaxy A52s 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a52s-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-a15-5g",
      "name": "Galaxy A15 5G",
      "series": "Galaxy A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a15.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-m55-5g",
      "name": "Galaxy M55 5G",
      "series": "Galaxy M & F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m55.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-m35-5g",
      "name": "Galaxy M35 5G",
      "series": "Galaxy M & F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m35.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "galaxy-f54-5g",
      "name": "Galaxy F54 5G",
      "series": "Galaxy M & F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f54.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "oneplus": [
    {
      "id": "oneplus-13",
      "name": "OnePlus 13",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-12",
      "name": "OnePlus 12",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-12r",
      "name": "OnePlus 12R",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-11",
      "name": "OnePlus 11 5G",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-11r",
      "name": "OnePlus 11R",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-11r.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-10-pro",
      "name": "OnePlus 10 Pro",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-10t",
      "name": "OnePlus 10T",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10t.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-10r",
      "name": "OnePlus 10R",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10r.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-9-pro",
      "name": "OnePlus 9 Pro",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-9rt-5g.jpg",
      "name": "OnePlus 9RT",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-9.jpg",
      "name": "OnePlus 9",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-8-pro.jpg",
      "name": "OnePlus 8 Pro",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-8t.jpg",
      "name": "OnePlus 8T",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-7t-pro.jpg",
      "name": "OnePlus 7T Pro",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-4",
      "name": "OnePlus Nord 4",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-4.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-ce4",
      "name": "OnePlus Nord CE 4",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-4.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-ce-4-lite",
      "name": "OnePlus Nord CE 4 Lite",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4-lite.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-3",
      "name": "OnePlus Nord 3",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-3.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-ce-3",
      "name": "OnePlus Nord CE 3",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce3.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-ce-3-lite",
      "name": "OnePlus Nord CE 3 Lite",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce3-lite.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-nord-2t",
      "name": "OnePlus Nord 2T",
      "series": "Nord Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-2t.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oneplus-open",
      "name": "OnePlus Open",
      "series": "Open Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-open.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "xiaomi": [
    {
      "id": "xiaomi-14-ultra",
      "name": "Xiaomi 14 Ultra",
      "series": "Xiaomi / Mi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "xiaomi-14",
      "name": "Xiaomi 14",
      "series": "Xiaomi / Mi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "xiaomi-13-pro",
      "name": "Xiaomi 13 Pro",
      "series": "Xiaomi / Mi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "xiaomi-12-pro",
      "name": "Xiaomi 12 Pro",
      "series": "Xiaomi / Mi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-12-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "xiaomi-11t-pro.jpg",
      "name": "Xiaomi 11T Pro",
      "series": "Xiaomi / Mi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "xiaomi-mi-11x-pro.jpg",
      "name": "Mi 11X Pro",
      "series": "Xiaomi / Mi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/undefined",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-14-pro-plus",
      "name": "Redmi Note 14 Pro+",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-14-pro",
      "name": "Redmi Note 14 Pro",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-13-pro-plus",
      "name": "Redmi Note 13 Pro+",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-13-pro",
      "name": "Redmi Note 13 Pro",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-13-5g",
      "name": "Redmi Note 13 5G",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-12-pro-plus",
      "name": "Redmi Note 12 Pro+",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-12-pro",
      "name": "Redmi Note 12 Pro",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-11-pro",
      "name": "Redmi Note 11 Pro",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-11-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-note-10-pro-max",
      "name": "Redmi Note 10 Pro Max",
      "series": "Redmi Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-10-pro-max.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-13-5g",
      "name": "Redmi 13 5G",
      "series": "Redmi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "redmi-12-5g",
      "name": "Redmi 12 5G",
      "series": "Redmi Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-12-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "vivo": [
    {
      "id": "vivo-x200-pro",
      "name": "Vivo X200 Pro",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-x200",
      "name": "Vivo X200",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-x100-pro",
      "name": "Vivo X100 Pro",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-x100",
      "name": "Vivo X100",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-x90-pro",
      "name": "Vivo X90 Pro",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x90-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-v40-pro",
      "name": "Vivo V40 Pro",
      "series": "V Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-v40",
      "name": "Vivo V40",
      "series": "V Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-v30-pro",
      "name": "Vivo V30 Pro",
      "series": "V Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v30-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-v30",
      "name": "Vivo V30",
      "series": "V Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v30.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-v29-pro",
      "name": "Vivo V29 Pro",
      "series": "V Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v29-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-v27-pro",
      "name": "Vivo V27 Pro",
      "series": "V Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v27-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-t3-pro",
      "name": "Vivo T3 Pro",
      "series": "T Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-t3-5g",
      "name": "Vivo T3 5G",
      "series": "T Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-t2-pro",
      "name": "Vivo T2 Pro",
      "series": "T Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-t2-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-y200-5g",
      "name": "Vivo Y200 5G",
      "series": "Y Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-y200.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "vivo-y100-5g",
      "name": "Vivo Y100 5G",
      "series": "Y Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-y100.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "oppo": [
    {
      "id": "oppo-find-x8-pro",
      "name": "Oppo Find X8 Pro",
      "series": "Find Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-find-x8",
      "name": "Oppo Find X8",
      "series": "Find Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-find-n3-flip",
      "name": "Oppo Find N3 Flip",
      "series": "Find Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-n3-flip.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-reno-12-pro",
      "name": "Oppo Reno 12 Pro",
      "series": "Reno Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno12-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-reno-12",
      "name": "Oppo Reno 12",
      "series": "Reno Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno12.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-reno-11-pro",
      "name": "Oppo Reno 11 Pro",
      "series": "Reno Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-reno-10-pro-plus",
      "name": "Oppo Reno 10 Pro+",
      "series": "Reno Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-reno-10-pro",
      "name": "Oppo Reno 10 Pro",
      "series": "Reno Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-f27-pro-plus",
      "name": "Oppo F27 Pro+",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-f27-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-f25-pro",
      "name": "Oppo F25 Pro",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-f25-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-f23-5g",
      "name": "Oppo F23 5G",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-f23.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-f21-pro",
      "name": "Oppo F21 Pro",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-f21-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-a79-5g",
      "name": "Oppo A79 5G",
      "series": "A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-a79.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "oppo-a59-5g",
      "name": "Oppo A59 5G",
      "series": "A Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/oppo-a59.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "realme": [
    {
      "id": "realme-gt-6",
      "name": "Realme GT 6",
      "series": "GT Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-gt-6.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-gt-6t",
      "name": "Realme GT 6T",
      "series": "GT Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-gt-6t.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-gt-2-pro",
      "name": "Realme GT 2 Pro",
      "series": "GT Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-gt2-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-13-pro-plus",
      "name": "Realme 13 Pro+",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-13-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-13-pro",
      "name": "Realme 13 Pro",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-13-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-12-pro-plus",
      "name": "Realme 12 Pro+",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-12-pro",
      "name": "Realme 12 Pro",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-11-pro-plus",
      "name": "Realme 11 Pro+",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-11-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-narzo-70-pro",
      "name": "Realme Narzo 70 Pro",
      "series": "Narzo Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-70-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-narzo-70",
      "name": "Realme Narzo 70 5G",
      "series": "Narzo Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-70.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "realme-narzo-60-pro",
      "name": "Realme Narzo 60 Pro",
      "series": "Narzo Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-60-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "motorola": [
    {
      "id": "moto-edge-50-ultra",
      "name": "Moto Edge 50 Ultra",
      "series": "Edge Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-ultra.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-edge-50-pro",
      "name": "Moto Edge 50 Pro",
      "series": "Edge Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-edge-50-fusion",
      "name": "Moto Edge 50 Fusion",
      "series": "Edge Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-fusion.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-edge-40-pro",
      "name": "Moto Edge 40 Pro",
      "series": "Edge Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-edge-40",
      "name": "Moto Edge 40",
      "series": "Edge Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-g85",
      "name": "Moto G85 5G",
      "series": "G Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g85.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-g84",
      "name": "Moto G84 5G",
      "series": "G Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g84.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-g54",
      "name": "Moto G54 5G",
      "series": "G Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g54.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "moto-razr-50-ultra",
      "name": "Moto Razr 50 Ultra",
      "series": "Razr Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-50-ultra.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "google": [
    {
      "id": "pixel-9-pro-xl",
      "name": "Pixel 9 Pro XL",
      "series": "Pixel 9 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-xl.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-9-pro",
      "name": "Pixel 9 Pro",
      "series": "Pixel 9 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-9",
      "name": "Pixel 9",
      "series": "Pixel 9 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-8-pro",
      "name": "Pixel 8 Pro",
      "series": "Pixel 8 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-8",
      "name": "Pixel 8",
      "series": "Pixel 8 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-8a",
      "name": "Pixel 8a",
      "series": "Pixel 8 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-7-pro",
      "name": "Pixel 7 Pro",
      "series": "Pixel 7 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-7",
      "name": "Pixel 7",
      "series": "Pixel 7 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-7a",
      "name": "Pixel 7a",
      "series": "Pixel 7 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7a.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-6-pro",
      "name": "Pixel 6 Pro",
      "series": "Pixel 6 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "pixel-6a",
      "name": "Pixel 6a",
      "series": "Pixel 6 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6a.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "poco": [
    {
      "id": "poco-f6-pro",
      "name": "Poco F6 Pro",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f6-pro.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-f6",
      "name": "Poco F6",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f6.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-f5",
      "name": "Poco F5 5G",
      "series": "F Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f5.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-x6-pro",
      "name": "Poco X6 Pro",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-x6",
      "name": "Poco X6 5G",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-x5-pro",
      "name": "Poco X5 Pro",
      "series": "X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x5-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-m6-pro-5g",
      "name": "Poco M6 Pro 5G",
      "series": "M Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m6-pro-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "poco-m6-5g",
      "name": "Poco M6 5G",
      "series": "M Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m6.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "iqoo": [
    {
      "id": "iqoo-12",
      "name": "iQOO 12 5G",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-12.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iqoo-11",
      "name": "iQOO 11 5G",
      "series": "Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-11.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iqoo-neo-9-pro",
      "name": "iQOO Neo 9 Pro",
      "series": "Neo Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-neo-9-pro.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iqoo-neo-7-pro",
      "name": "iQOO Neo 7 Pro",
      "series": "Neo Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-neo-7-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iqoo-z9s-pro",
      "name": "iQOO Z9s Pro",
      "series": "Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9s-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iqoo-z9",
      "name": "iQOO Z9 5G",
      "series": "Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "iqoo-z7-pro",
      "name": "iQOO Z7 Pro 5G",
      "series": "Z Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z7-pro.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "nothing": [
    {
      "id": "nothing-phone-2",
      "name": "Nothing Phone (2)",
      "series": "Phone Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "nothing-phone-2a-plus",
      "name": "Nothing Phone (2a) Plus",
      "series": "Phone Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a-plus.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "nothing-phone-2a",
      "name": "Nothing Phone (2a)",
      "series": "Phone Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "nothing-phone-1",
      "name": "Nothing Phone (1)",
      "series": "Phone Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-1.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "cmf-phone-1",
      "name": "CMF Phone 1",
      "series": "CMF Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nothing-cmf-phone-1.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "infinix": [
    {
      "id": "infinix-gt-20-pro",
      "name": "Infinix GT 20 Pro",
      "series": "GT Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/infinix-gt-20-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "infinix-zero-30-5g",
      "name": "Infinix Zero 30 5G",
      "series": "Zero Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/infinix-zero-30-5g.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "infinix-note-40-pro-plus",
      "name": "Infinix Note 40 Pro+",
      "series": "Note Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/infinix-note-40-pro-plus.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "honor": [
    {
      "id": "honor-8-pro",
      "name": "Honor 8 Pro",
      "series": "Honor 8 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-8-pro.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-7x",
      "name": "Honor 7X",
      "series": "Honor 7 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-7x.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-9-lite",
      "name": "Honor 9 Lite",
      "series": "Honor 9 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-9-lite.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-7a",
      "name": "Honor 7A",
      "series": "Honor 7 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-7a.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-10",
      "name": "Honor 10",
      "series": "Honor 8 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-10.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-9n",
      "name": "Honor 9N",
      "series": "Honor 9 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-9n.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-play",
      "name": "Honor Play",
      "series": "Honor Play Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-play.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-8x",
      "name": "Honor 8X",
      "series": "Honor 8 Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/huawei-honor-8x.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-200-pro",
      "name": "Honor 200 Pro",
      "series": "Honor Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/honor-200-pro.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-200",
      "name": "Honor 200 5G",
      "series": "Honor Number Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/honor-200.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-magic-6-pro",
      "name": "Honor Magic 6 Pro",
      "series": "Honor Magic Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/honor-magic-6-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "honor-x9b",
      "name": "Honor X9b",
      "series": "Honor X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/honor-x9b.jpg",
      "services": {
        "screen": {
          "price": 4499,
          "mrp": 6499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1799,
          "mrp": 2499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1575,
          "mrp": 2275,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 3499,
          "mrp": 4999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1259,
          "mrp": 1749,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 989,
          "mrp": 1374,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1169,
          "mrp": 1624,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 900,
          "mrp": 1250,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 1350,
          "mrp": 1950,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "asus": [
    {
      "id": "asus-rog-phone-8-pro",
      "name": "Asus ROG Phone 8 Pro",
      "series": "ROG Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8-pro.jpg",
      "services": {
        "screen": {
          "price": 16999,
          "mrp": 21999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 5950,
          "mrp": 7700,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 11999,
          "mrp": 14999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 3499,
          "mrp": 4899,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2749,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 3249,
          "mrp": 4549,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2500,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 5100,
          "mrp": 6600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "asus-rog-phone-7",
      "name": "Asus ROG Phone 7",
      "series": "ROG Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-7.jpg",
      "services": {
        "screen": {
          "price": 11999,
          "mrp": 15999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 3999,
          "mrp": 5499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 4200,
          "mrp": 5600,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 8999,
          "mrp": 11999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 2799,
          "mrp": 3849,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 2199,
          "mrp": 3024,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 2599,
          "mrp": 3574,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 2000,
          "mrp": 2750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 3600,
          "mrp": 4800,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "asus-zenfone-10",
      "name": "Asus Zenfone 10",
      "series": "Zenfone Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-10.jpg",
      "services": {
        "screen": {
          "price": 6999,
          "mrp": 9999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 2499,
          "mrp": 3499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 2450,
          "mrp": 3500,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 4999,
          "mrp": 6999,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 1749,
          "mrp": 2449,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 1374,
          "mrp": 1924,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 1624,
          "mrp": 2274,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 1250,
          "mrp": 1750,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 2100,
          "mrp": 3000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ],
  "nokia": [
    {
      "id": "nokia-g42",
      "name": "Nokia G42 5G",
      "series": "G & X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nokia-g42.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "nokia-g60-5g",
      "name": "Nokia G60 5G",
      "series": "G & X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nokia-g60-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    },
    {
      "id": "nokia-x30-5g",
      "name": "Nokia X30 5G",
      "series": "G & X Series",
      "image": "https://fdn2.gsmarena.com/vv/bigpic/nokia-x30-5g.jpg",
      "services": {
        "screen": {
          "price": 2999,
          "mrp": 4499,
          "enabled": true,
          "warranty": "6 Months",
          "time": "30-45 mins"
        },
        "battery": {
          "price": 1299,
          "mrp": 1999,
          "enabled": true,
          "warranty": "6 Months",
          "time": "20-30 mins"
        },
        "front_camera": {
          "price": 1050,
          "mrp": 1575,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "back_camera": {
          "price": 2299,
          "mrp": 3299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "charging_jack": {
          "price": 909,
          "mrp": 1399,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30-45 mins"
        },
        "mic": {
          "price": 714,
          "mrp": 1099,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "speaker": {
          "price": 844,
          "mrp": 1299,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "receiver": {
          "price": 650,
          "mrp": 1000,
          "enabled": true,
          "warranty": "3 Months",
          "time": "30 mins"
        },
        "back_panel": {
          "price": 900,
          "mrp": 1350,
          "enabled": true,
          "warranty": "3 Months",
          "time": "45 mins"
        }
      }
    }
  ]
};

export const getRepairBrand = (slug) =>
  REPAIR_BRANDS.find(b => b.slug === slug || b.id === slug);

export const getRepairModels = (brandSlug) =>
  REPAIR_MODELS[brandSlug] || [];

export const getRepairModel = (brandSlug, modelId) =>
  (REPAIR_MODELS[brandSlug] || []).find(m => m.id === modelId);
