import HomepageConfig from '../models/HomepageConfig.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const DEFAULT_HOMEPAGE_SECTIONS = [
  {
    type: 'slider',
    title: 'Promotional Banner Slider',
    subtitle: 'Dynamic full-width sliding promotional banners managed from Site Settings',
    isEnabled: true,
    order: 0,
    content: {
      autoPlay: true,
      autoPlaySpeed: 4000,
    },
  },
  {
    type: 'hero',
    title: 'Hero Banner & Device Search',
    subtitle: 'Primary header with instant valuation search, category shortcuts, and hero image',
    isEnabled: true,
    order: 1,
    content: {
      badge: "INDIA'S TRUSTED DEVICE MARKETPLACE",
      headline: "India's Most Trusted Device Marketplace",
      subheadline: "Sell your used gadgets",
      description: "Get the best value for your old devices, with free doorstep pickup and instant payment — all in one place.",
      searchPlaceholder: "Search your device (e.g. iPhone 15 Pro, Galaxy S24, MacBook Air)...",
      heroImage: "",
      heroImageAlt: "SecondSale Devices - Sell Smart Buy Better",
      popularSearches: ["iPhone 15", "Samsung S24", "OnePlus 12", "MacBook Air", "iPad Pro"],
      primaryCtaText: "Get Device Value",
      primaryCtaLink: "/sell-old-mobile-phones/brand",
      secondaryCtaText: "How It Works",
      secondaryCtaLink: "#how-it-works",
      trustPills: ["Free Pickup", "Instant Payment", "Secure & Hassle-free"],
    },
  },
  {
    type: 'deviceCategories',
    title: 'Sell Your Device Categories',
    subtitle: 'Quick selection grid for phones, tablets, laptops, smartwatches, consoles',
    isEnabled: true,
    order: 2,
    content: {
      categories: [
        {
          label: "Mobile Phones",
          desc: "Sell old smartphones",
          to: "/sell-old-mobile-phones/brand",
          icon: "mobile",
          color: "#E6F4FF"
        },
        {
          label: "Tablets",
          desc: "Sell old tablets",
          to: "/sell-tablet/brand",
          icon: "tablet",
          color: "#E0F0FF"
        },
        {
          label: "Laptops",
          desc: "Sell old laptops",
          to: "/sell-old-laptops/brand",
          icon: "laptop",
          color: "#FFF3E0"
        },
        {
          label: "iMac",
          desc: "Sell old iMac / Mac",
          to: "/sell-imac/brand",
          icon: "imac",
          color: "#F3E8FF"
        },
        {
          label: "Earbuds",
          desc: "Sell AirPods & Earbuds",
          to: "/sell-earbuds/brand",
          icon: "earbuds",
          color: "#ECFDF5"
        },
        {
          label: "Smartwatch",
          desc: "Sell Apple & smartwatches",
          to: "/sell-smartwatch/brand",
          icon: "smartwatch",
          color: "#FEF3C7"
        },
        {
          label: "Gaming Console",
          desc: "Sell PS5, Xbox & Switch",
          to: "/sell-gaming/brand",
          icon: "console",
          color: "#EDE9FE"
        }
      ]
    },
  },
  {
    type: 'stats',
    title: 'Marketplace Trust Stats',
    subtitle: '50K+ customers, ₹25Cr+ paid out, 1L+ devices sold, 4.9/5 rating',
    isEnabled: true,
    order: 3,
    content: {
      stats: [
        { value: "50,000+", label: "Happy Customers" },
        { value: "₹25Cr+", label: "Paid to Customers" },
        { value: "1L+", label: "Devices Sold" },
        { value: "4.9/5", label: "Customer Rating" },
        { value: "100+", label: "Cities Covered" },
      ],
    },
  },
  {
    type: 'featuresStrip',
    title: 'Core Value Highlights',
    subtitle: 'Instant online valuation, free doorstep pickup, 100% instant payment',
    isEnabled: true,
    order: 4,
    content: {
      items: [
        "100% Secure Transactions",
        "Data Wipe Protection",
        "7 Days Easy Return",
        "Warranty on All Devices",
        "Doorstep Pickup",
      ],
    },
  },
  {
    type: 'services',
    title: 'What Would You Like To Sell Today?',
    subtitle: 'Detailed service cards with selling benefits across device types',
    isEnabled: true,
    order: 5,
    content: {
      badge: "✨ ALL-IN-ONE DEVICE SOLUTION",
      cards: [
        {
          category: "mobile",
          title: "Sell Smartphones",
          badge: "MOST POPULAR",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
          desc: "Get the highest cash value for your old iPhone, Samsung, OnePlus or Android phone in 60 seconds.",
          points: [
            "Instant online price quote in 60s",
            "Free doorstep pickup across 100+ cities",
            "Immediate bank or UPI cash transfer",
            "100% data wipe & safe handling guarantee"
          ],
          cta: "Sell Mobile Phone",
          ctaTo: "/sell-old-mobile-phones/brand",
          gradient: "from-[#2563EB] to-[#1D4ED8]",
          shadowColor: "shadow-blue-500/20",
          glowColor: "rgba(37, 99, 235, 0.08)",
          iconBg: "bg-blue-600 text-white shadow-blue-500/30"
        },
        {
          category: "tablet",
          title: "Sell Tablets & iPads",
          badge: "INSTANT EVALUATION",
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
          desc: "Turn your old Apple iPad, Samsung Galaxy Tab, or tablet into guaranteed cash with zero hassle.",
          points: [
            "All iPad & Android tablet models accepted",
            "Transparent algorithmic market pricing",
            "Zero shipping, packaging or pickup fees",
            "Best buyback valuation guaranteed"
          ],
          cta: "Sell Tablet & iPad",
          ctaTo: "/sell-tablet/brand",
          gradient: "from-[#4F46E5] to-[#4338CA]",
          shadowColor: "shadow-indigo-500/20",
          glowColor: "rgba(79, 70, 229, 0.08)",
          iconBg: "bg-indigo-600 text-white shadow-indigo-500/30"
        },
        {
          category: "laptop",
          title: "Sell Laptops & MacBooks",
          badge: "HIGHEST PAYOUT",
          badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
          desc: "Professional laptop buyback based on exact CPU, GPU, RAM, storage, and body condition.",
          points: [
            "MacBook, Gaming & Ultrabook laptops",
            "CPU / GPU based transparent valuation",
            "Expert doorstep technician inspection",
            "Instant on-spot payment before pickup"
          ],
          cta: "Sell Laptop & MacBook",
          ctaTo: "/sell-old-laptops/brand",
          gradient: "from-[#D97706] to-[#B45309]",
          shadowColor: "shadow-amber-500/20",
          glowColor: "rgba(217, 119, 6, 0.08)",
          iconBg: "bg-amber-600 text-white shadow-amber-500/30"
        }
      ],
      trustFeatures: [
        { title: "100% Safe & Secure", desc: "Data wiped & secure handling" },
        { title: "Best Price Guaranteed", desc: "Get highest value for your device" },
        { title: "Trusted by 50,000+", desc: "Rated 4.9/5 across platforms" },
        { title: "24x7 Customer Support", desc: "We're always here to help" },
        { title: "Free Pickup", desc: "At your doorstep anywhere in India" },
      ]
    },
  },
  {
    type: 'buyRefurbished',
    title: 'Most Quoted Devices',
    subtitle: 'These devices are in highest demand right now. Get the best value for your device with instant pickup.',
    isEnabled: true,
    order: 6,
    content: {
      tag: "TOP SELLER CHOICES",
      categories: [
        { id: "all", label: "All Devices" },
        { id: "iphone", label: "iPhones" },
        { id: "android", label: "Android & Samsung" },
        { id: "gaming", label: "Gaming Consoles" },
        { id: "smartwatch", label: "Smartwatches" },
      ],
      devices: [
        {
          id: "iphone-15",
          name: "iPhone 15",
          category: "iphone",
          price: 44094,
          badge: "Most Popular",
          badgeType: "blue",
          imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309?wid=800&hei=800&fmt=jpeg&qlt=90",
          to: "/sell-old-mobile-phones/apple/apple-iphone-15",
        },
        {
          id: "iphone-16",
          name: "iPhone 16",
          category: "iphone",
          price: 51047,
          badge: "Best Value",
          badgeType: "indigo",
          imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-ultramarine-select-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
          to: "/sell-old-mobile-phones/apple/apple-iphone-16",
        },
        {
          id: "iphone-14",
          name: "iPhone 14",
          category: "iphone",
          price: 29750,
          badge: "Quick Sale",
          badgeType: "amber",
          imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-midnight-select-202209?wid=800&hei=800&fmt=jpeg&qlt=90",
          to: "/sell-old-mobile-phones/apple/apple-iphone-14",
        },
        {
          id: "iphone-13",
          name: "iPhone 13",
          category: "iphone",
          price: 26570,
          badge: "High Demand",
          badgeType: "emerald",
          imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-blue-select-2021?wid=800&hei=800&fmt=jpeg&qlt=90",
          to: "/sell-old-mobile-phones/apple/apple-iphone-13",
        },
        {
          id: "ps5",
          name: "PlayStation 5 (PS5)",
          category: "gaming",
          price: 38250,
          badge: "Top Console",
          badgeType: "purple",
          imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
          to: "/sell-gaming/sony/sony-playstation-5",
        },
        {
          id: "apple-watch-ultra-2",
          name: "Apple Watch Ultra 2",
          category: "smartwatch",
          price: 35000,
          badge: "Premium Watch",
          badgeType: "blue",
          imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ultra-2-black-band-titanium-202409?wid=800&hei=800&fmt=jpeg&qlt=90",
          to: "/sell-smartwatch/apple/apple-watch-ultra-2",
        },
        {
          id: "iphone-15-pro-max",
          name: "iPhone 15 Pro Max",
          category: "iphone",
          price: 58500,
          badge: "Highest Payout",
          badgeType: "amber",
          imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90",
          to: "/sell-old-mobile-phones/apple/apple-iphone-15-pro-max",
        },
        {
          id: "galaxy-s24-ultra",
          name: "Samsung Galaxy S24 Ultra",
          category: "android",
          price: 62000,
          badge: "Flagship Demand",
          badgeType: "emerald",
          imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bztqins-thumb-539573039?$216_216_PNG$",
          to: "/sell-old-mobile-phones/samsung",
        },
        {
          id: "ps4-slim",
          name: "PlayStation 4 Slim",
          category: "gaming",
          price: 14000,
          badge: "Quick Sale",
          badgeType: "purple",
          imageUrl: "https://gmedia.playstation.com/is/image/SIEPDC/ps4-slim-image-block-01-en-24jul20?$facebook$",
          to: "/sell-gaming/sony/sony-playstation-4-slim",
        },
        {
          id: "galaxy-watch-6",
          name: "Galaxy Watch 6 Classic",
          category: "smartwatch",
          price: 14000,
          badge: "Best Value",
          badgeType: "indigo",
          imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-classic-r960-sm-r960nzkainu-thumb-537409249?$216_216_PNG$",
          to: "/sell-smartwatch/samsung/samsung-galaxy-watch-6-classic",
        },
      ],
    },
  },
  {
    type: 'howItWorks',
    title: 'How It Works (4 Simple Steps)',
    subtitle: 'Get quote, confirm details, free doorstep pickup, get paid instantly',
    isEnabled: true,
    order: 7,
    content: {
      steps: [
        { num: "1", title: "Get Quote", desc: "Search your device and get instant price." },
        { num: "2", title: "Confirm Details", desc: "Answer few questions about your device." },
        { num: "3", title: "Free Pickup", desc: "We pick it up from your doorstep for free." },
        { num: "4", title: "Get Paid Instantly", desc: "Receive instant payment in your bank account." },
      ],
      trustPoints: [
        { text: "100% Safe & Secure", sub: "Data wiped & secure handling" },
        { text: "Best Price Guaranteed", sub: "Get highest value for your device" },
        { text: "Trusted by 50,000+ Customers", sub: "Rated 4.9/5 across platforms" },
        { text: "24x7 Customer Support", sub: "We're always here to help" },
      ],
    },
  },
  {
    type: 'reviews',
    title: 'What Our Customers Say',
    subtitle: 'Thousands of users across India trust SecondSale to convert their old phones into instant cash with free pickup.',
    isEnabled: true,
    order: 8,
    content: {
      tag: "⭐ Customer Reviews",
      reviews: [
        { name: "Nitin Gowda", text: "Flawless experience. Instant credit. No haggling whatsoever — exactly what I expected.", stars: 5 },
        { name: "Vidyankit Official", text: "Sold my Realme GT Neo 2. Very smooth process, no negotiation unlike other platforms. Highly recommend!", stars: 5 },
        { name: "Jatin Mishra", text: "Sold my phone, nice company, smooth process. Pickup was on time and payment was instant.", stars: 5 },
        { name: "Disha Doshi", text: "Value for money and service is good. Got the exact price that was shown online.", stars: 5 },
        { name: "Pawan Mishra", text: "Excellent services! The pickup was too good and the security and checking purposes were professional.", stars: 5 },
        { name: "Mayank Doshi", text: "Very prompt service and got a very good price. Absolutely hassle-free. Highly recommended!", stars: 5 },
        { name: "Ritu Sharma", text: "Super easy process. Got a great price for my old Samsung. Will definitely use again!", stars: 5 },
        { name: "Aakash Mehta", text: "Loved the transparent pricing. No last minute deductions. Payment received in under 10 minutes.", stars: 5 },
        { name: "Priya Nair", text: "The pickup agent was very professional and courteous. Got ₹2,000 more than other platforms quoted.", stars: 5 },
      ]
    },
  },
  {
    type: 'whyUs',
    title: 'Why Sell On SecondSale?',
    subtitle: 'Best price guarantee, 100% safe data wipe, instant bank payout',
    isEnabled: true,
    order: 9,
    content: {
      guarantees: [
        "Instant Cash at Free Pickup",
        "Transparent Pricing with No Hidden Cuts",
        "Verified & Professional Pickup Partners",
        "Free Doorstep Pickup Anywhere",
        "Factory-Grade Secure Data Wipe",
        "Genuine Official Invoice Provided",
      ],
    },
  },
  {
    type: 'faqs',
    title: 'Frequently Asked Questions',
    subtitle: 'Find clear answers to all your questions about device pricing, pickups, and secure payments.',
    isEnabled: true,
    order: 10,
    content: {
      tag: "❓ FAQs",
      faqs: [
        {
          q: 'Is SecondSale legit?',
          a: 'Yes, SecondSale is a legitimate and trusted platform for selling old electronics online in India with secure pickup and instant payment.'
        },
        {
          q: 'Where can I sell my old device online?',
          a: 'You can sell your old device online through SecondSale, which offers free doorstep pickup and instant cash payment across 2,000+ cities in India.'
        },
        {
          q: 'What is the best place to sell old devices easily?',
          a: 'SecondSale is one of the easiest and safest places to sell old devices online without visiting any shop.'
        },
        {
          q: 'How do I get the highest price for my old gadget?',
          a: 'Select the correct device condition, check the instant online quote, and book a free doorstep pickup on SecondSale for the best value.'
        }
      ]
    },
  },
  {
    type: 'cityLinks',
    title: 'Popular Cities & Service Locations',
    subtitle: 'Doorstep device pickup available in 100+ cities across India',
    isEnabled: true,
    order: 11,
    content: {
      cities: [
        { name: "Mumbai", slug: "mumbai" },
        { name: "Delhi", slug: "delhi" },
        { name: "Bangalore", slug: "bangalore" },
        { name: "Hyderabad", slug: "hyderabad" },
        { name: "Chennai", slug: "chennai" },
        { name: "Kolkata", slug: "kolkata" },
        { name: "Pune", slug: "pune" },
        { name: "Ahmedabad", slug: "ahmedabad" },
        { name: "Jaipur", slug: "jaipur" },
        { name: "Lucknow", slug: "lucknow" },
        { name: "Chandigarh", slug: "chandigarh" },
        { name: "Kochi", slug: "kochi" },
        { name: "Indore", slug: "indore" },
        { name: "Nagpur", slug: "nagpur" },
        { name: "Coimbatore", slug: "coimbatore" },
        { name: "Noida", slug: "noida" },
        { name: "Gurgaon", slug: "gurgaon" },
        { name: "Surat", slug: "surat" },
      ],
      showAboutBox: true,
      aboutTitle: "About SecondSale in 30 seconds",
      aboutText: "SecondSale is an Indian online platform where consumers sell used smartphones, tablets, laptops, and iMacs. Users receive an instant quote, schedule free doorstep pickup, and get paid via UPI, bank transfer, or cash after device verification. SecondSale operates across 2,000+ Indian cities and is operated by Swastika Innovation Private Limited."
    },
  },
];

// ─── PUBLIC: Get published homepage sections ─────────────────────────────────
export const getHomepageConfig = async (req, res, next) => {
  try {
    let config = await HomepageConfig.findOne({ singleton: 'main' });
    if (!config || !config.sections || config.sections.length === 0) {
      config = await HomepageConfig.findOneAndUpdate(
        { singleton: 'main' },
        { singleton: 'main', sections: DEFAULT_HOMEPAGE_SECTIONS, status: 'published' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      let modified = false;

      // Check if 'slider' section exists; if not, prepend it
      const hasSlider = config.sections.some(s => s.type === 'slider');
      if (!hasSlider) {
        const sliderSec = DEFAULT_HOMEPAGE_SECTIONS[0];
        config.sections.unshift(sliderSec);
        config.sections.forEach((sec, idx) => {
          sec.order = idx;
        });
        modified = true;
      }

      // Backfill any missing content defaults for existing sections
      config.sections.forEach((sec) => {
        const defaultSec = DEFAULT_HOMEPAGE_SECTIONS.find(d => d.type === sec.type);
        if (defaultSec && defaultSec.content) {
          if (!sec.content || Object.keys(sec.content).length === 0) {
            sec.content = { ...defaultSec.content };
            modified = true;
          } else {
            for (const [key, val] of Object.entries(defaultSec.content)) {
              if (sec.content[key] === undefined) {
                sec.content[key] = val;
                modified = true;
              }
            }
          }
        }
      });

      if (modified) {
        config.markModified('sections');
        await config.save();
      }
    }
    res.json(config);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Update sections (reorder, toggle isEnabled, edit content) ─────────
export const adminUpdateSections = async (req, res, next) => {
  try {
    const { sections, status } = req.body;
    if (!Array.isArray(sections)) {
      return res.status(400).json({ message: 'sections must be an array' });
    }

    // Ensure order is sequential 0..N
    const orderedSections = sections.map((sec, index) => ({
      ...sec,
      order: index,
    }));

    const update = { sections: orderedSections };
    if (status) update.status = status;

    const config = await HomepageConfig.findOneAndUpdate(
      { singleton: 'main' },
      update,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: 'Homepage sections updated successfully', config });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Upload media/image for homepage ──────────────────────────────────
export const uploadHomepageImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, 'secondsale/homepage');
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: Reset to default sections ─────────────────────────────────────────
export const adminResetSections = async (req, res, next) => {
  try {
    const config = await HomepageConfig.findOneAndUpdate(
      { singleton: 'main' },
      { sections: DEFAULT_HOMEPAGE_SECTIONS, status: 'published' },
      { upsert: true, new: true }
    );
    res.json({ message: 'Homepage sections reset to default', config });
  } catch (err) {
    next(err);
  }
};

