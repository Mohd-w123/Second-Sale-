import BannerSlider from "../components/BannerSlider";
import { deviceService } from "../services/device.service";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Smartphone, Tablet, Laptop, Monitor,
  Shield, Tag, Zap, Truck, ArrowRight,
  ChevronDown, Star, CheckCircle2, Sparkles, BadgeCheck, Users,
  Search, Clock, CreditCard, MapPin, Headphones, Watch, Gamepad2, ChevronLeft, ChevronRight, ShieldCheck, Flame
} from "lucide-react";
import heroBannerImage from "../assets/hero-banner.jpg";
import mobileDeviceImg from "../assets/devices/mobile.png";
import tabletDeviceImg from "../assets/devices/tablet.png";
import laptopDeviceImg from "../assets/devices/laptop.png";
import macDeviceImg from "../assets/devices/mac.png";
import SEOHead from "../components/seo/SEOHead";
import PageLoader from "../components/ui/PageLoader";
import { ENTITY_SUMMARY } from "../config/seo";
import { HOME_FAQS, HOW_TO_STEPS } from "../data/faqs";
import { CITIES as CITY_DATA } from "../data/cities";
import { buildSchemaGraph, faqPageSchema, howToSchema, organizationSchema, websiteSchema } from "../utils/schema";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEVICE_CATEGORIES = [
  {
    label: "Mobile Phones",
    desc: "Sell old smartphones",
    to: "/sell-old-mobile-phones/brand",
    img: mobileDeviceImg,
    color: "#E6F4FF",
  },
  {
    label: "Tablets",
    desc: "Sell old tablets",
    to: "/sell-tablet/brand",
    img: tabletDeviceImg,
    color: "#E0F0FF",
  },
  {
    label: "Laptops",
    desc: "Sell old laptops",
    to: "/sell-old-laptops/brand",
    img: laptopDeviceImg,
    color: "#FFF3E0",
  },
  {
    label: "iMac",
    desc: "Sell old iMac / Mac",
    to: "/sell-imac/brand",
    img: macDeviceImg,
    color: "#F3E8FF",
  },
  {
    label: "Earbuds",
    desc: "Sell AirPods & Earbuds",
    to: "/sell-earbuds/brand",
    icon: "headphones",
    color: "#ECFDF5",
  },
  {
    label: "Smartwatch",
    desc: "Sell Apple & smartwatches",
    to: "/sell-smartwatch/brand",
    icon: "smartwatch",
    color: "#FEF3C7",
  },
  {
    label: "Gaming Console",
    desc: "Sell PS5, Xbox & Switch",
    to: "/sell-gaming/brand",
    icon: "console",
    color: "#EDE9FE",
  },
];

const POPULAR_SEARCHES = ["iPhone 15", "Samsung S24", "OnePlus 12", "MacBook Air", "iPad Pro"];

const HERO_STATS = [
  { icon: <Users size={22} strokeWidth={1.8} />, value: "50,000+", label: "Happy Customers" },
  { icon: <CreditCard size={22} strokeWidth={1.8} />, value: "₹25Cr+", label: "Paid to Customers" },
  { icon: <Smartphone size={22} strokeWidth={1.8} />, value: "1L+", label: "Devices Sold" },
  { icon: <Star size={22} strokeWidth={1.8} />, value: "4.9/5", label: "Customer Rating" },
  { icon: <MapPin size={22} strokeWidth={1.8} />, value: "100+", label: "Cities Covered" },
];

const HOW_IT_WORKS_STEPS = [
  { num: "1", title: "Get Quote", desc: "Search your device and get instant price.", icon: <Search size={24} strokeWidth={1.8} /> },
  { num: "2", title: "Confirm Details", desc: "Answer few questions about your device.", icon: <BadgeCheck size={24} strokeWidth={1.8} /> },
  { num: "3", title: "Free Pickup", desc: "We pick it up from your doorstep for free.", icon: <Truck size={24} strokeWidth={1.8} /> },
  { num: "4", title: "Get Paid Instantly", desc: "Receive instant payment in your bank account.", icon: <Zap size={24} strokeWidth={1.8} /> },
];

const SERVICE_FEATURES = [
  {
    category: "mobile",
    title: "Sell Smartphones",
    highlight: "Smartphones",
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
    iconBg: "bg-blue-600 text-white shadow-blue-500/30",
  },
  {
    category: "tablet",
    title: "Sell Tablets & iPads",
    highlight: "Tablets",
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
    iconBg: "bg-indigo-600 text-white shadow-indigo-500/30",
  },
  {
    category: "laptop",
    title: "Sell Laptops & MacBooks",
    highlight: "Laptops",
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
    iconBg: "bg-amber-600 text-white shadow-amber-500/30",
  },
];

const TRUST_FEATURES = [
  { icon: <Shield size={22} strokeWidth={1.8} />, title: "100% Safe & Secure", desc: "Data wiped & secure handling" },
  { icon: <Tag size={22} strokeWidth={1.8} />, title: "Best Price Guaranteed", desc: "Get highest value for your device" },
  { icon: <Users size={22} strokeWidth={1.8} />, title: "Trusted by 50,000+", desc: "Rated 4.9/5 across platforms" },
  { icon: <Headphones size={22} strokeWidth={1.8} />, title: "24x7 Customer Support", desc: "We're always here to help" },
  { icon: <Truck size={22} strokeWidth={1.8} />, title: "Free Pickup", desc: "At your doorstep anywhere in India" },
];

const REVIEWS = [
  { name: "Nitin Gowda", text: "Flawless experience. Instant credit. No haggling whatsoever — exactly what I expected.", stars: 5 },
  { name: "Vidyankit Official", text: "Sold my Realme GT Neo 2. Very smooth process, no negotiation unlike other platforms. Highly recommend!", stars: 5 },
  { name: "Jatin Mishra", text: "Sold my phone, nice company, smooth process. Pickup was on time and payment was instant.", stars: 5 },
  { name: "Disha Doshi", text: "Value for money and service is good. Got the exact price that was shown online.", stars: 5 },
  { name: "pawan mishra", text: "Excellent services! The pickup was too good and the security and checking purposes were professional.", stars: 5 },
  { name: "Mayank Doshi", text: "Very prompt service and got a very good price. Absolutely hassle-free. Highly recommended!", stars: 5 },
  { name: "Ritu Sharma", text: "Super easy process. Got a great price for my old Samsung. Will definitely use again!", stars: 5 },
  { name: "Aakash Mehta", text: "Loved the transparent pricing. No last minute deductions. Payment received in under 10 minutes.", stars: 5 },
  { name: "Priya Nair", text: "The pickup agent was very professional and courteous. Got ₹2,000 more than other platforms quoted.", stars: 5 },
];


const QUOTED_CATEGORIES = [
  { id: "all", label: "All Devices" },
  { id: "iphone", label: "iPhones" },
  { id: "android", label: "Android & Samsung" },
  { id: "gaming", label: "Gaming Consoles" },
  { id: "smartwatch", label: "Smartwatches" },
];

const MOST_QUOTED_DEVICES = [
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
];

const FAQS = HOME_FAQS;

const GUARANTEES = [
  "Instant Cash at Free Pickup",
  "Transparent Pricing with No Hidden Cuts",
  "Verified & Professional Pickup Partners",
  "Free Doorstep Pickup Anywhere",
  "Factory-Grade Secure Data Wipe",
  "Genuine Official Invoice Provided",
];

// ─── Review Column ────────────────────────────────────────────────────────────

function ReviewColumn({ reviews, reverse = false }) {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(reverse ? -50 : 0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const speed = 0.02;
    let lastTime = null;
    let paused = false;
    const step = (timestamp) => {
      if (paused) { animationRef.current = requestAnimationFrame(step); return; }
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      if (reverse) {
        positionRef.current += speed * delta;
        if (positionRef.current >= 0) positionRef.current = -50;
      } else {
        positionRef.current -= speed * delta;
        if (positionRef.current <= -50) positionRef.current = 0;
      }
      track.style.transform = `translateY(${positionRef.current}%)`;
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
    const enter = () => { paused = true; };
    const leave = () => { paused = false; lastTime = null; };
    track.addEventListener("mouseenter", enter);
    track.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(animationRef.current);
      track.removeEventListener("mouseenter", enter);
      track.removeEventListener("mouseleave", leave);
    };
  }, [reverse]);

  const doubled = [...reviews, ...reviews];
  return (
    <div className="relative overflow-hidden h-[480px]">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      <div ref={trackRef} className="will-change-transform">
        {doubled.map((r, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 mb-3 shadow-sm hover:border-[#2563EB]/30 hover:shadow-md transition-all duration-300 cursor-default">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold shrink-0">
                {r.name[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-[#0F2D5B]">{r.name}</div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12} fill={s <= r.stars ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={1.5} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTag({ children }) {
  return (
    <span className="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#1D4ED8] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/20">
      {children}
    </span>
  );
}

function SectionTitle({ tag, title, titleHighlight, subtitle }) {
  return (
    <div className="text-center mb-12 px-4">
      {tag && <SectionTag>{tag}</SectionTag>}
      <h2 className="text-2xl sm:text-[2.25rem] font-extrabold text-[#0F2D5B] mb-4 leading-tight tracking-tight">
        {titleHighlight ? (
          <>
            {title.split(titleHighlight)[0]}
            <span className="text-[#2563EB]">{titleHighlight}</span>
            {title.split(titleHighlight)[1] || ""}
          </>
        ) : title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 bg-[#F7FAFF] rounded-2xl mb-3 overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left bg-transparent border-none cursor-pointer gap-4 group"
      >
        <span className="text-base sm:text-lg font-bold text-[#0F2D5B] group-hover:text-[#2563EB] transition-colors">{q}</span>
        <span className="text-[#2563EB] shrink-0">
          <ChevronDown size={18} strokeWidth={2.5} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}


const CATEGORY_ROUTE_MAP = {
  mobile: "/sell-old-mobile-phones",
  tablet: "/sell-tablet",
  laptop: "/sell-old-laptops",
  mac: "/sell-imac",
};

const CATEGORY_LABELS = {
  mobile: "Mobile",
  tablet: "Tablet",
  laptop: "Laptop",
  mac: "iMac",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const heroSearchRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const [quotedCategory, setQuotedCategory] = useState("all");
  const quotedSliderRef = useRef(null);

  const scrollQuoted = (direction) => {
    if (quotedSliderRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      quotedSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredQuotedDevices = quotedCategory === "all"
    ? MOST_QUOTED_DEVICES
    : MOST_QUOTED_DEVICES.filter((d) => d.category === quotedCategory);

  const performSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await deviceService.searchDevices(query.trim());
      setSearchResults(data || []);
      setShowResults(true);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setShowResults(true);
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 280);
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setShowResults(true);
    performSearch(tag);
  };

  const handleResultClick = (result) => {
    const basePath = CATEGORY_ROUTE_MAP[result.category] || "/sell-old-mobile-phones";
    navigate(`${basePath}/${encodeURIComponent(result.brand)}/${result.slug}`);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const [sectionsConfig, setSectionsConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHomepage = () => {
    const API =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";
    fetch(API + "/homepage")
      .then((res) => res.json())
      .then((data) => {
        if (data?.sections && Array.isArray(data.sections)) {
          setSectionsConfig(data.sections);
        }
      })
      .catch((err) => console.warn("Failed to load dynamic homepage config:", err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHomepage();

    const onUpdated = () => fetchHomepage();
    window.addEventListener("homepage-updated", onUpdated);
    const onStorage = (e) => {
      if (e.key === "homepage_updated_at") fetchHomepage();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("homepage-updated", onUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const schema = buildSchemaGraph([
    organizationSchema(),
    websiteSchema(),
    faqPageSchema(FAQS),
    howToSchema(HOW_TO_STEPS),
  ]);

  // ─── Section Renderers ────────────────────────────────────────────────────────

  const renderSlider = (sec) => (
    <BannerSlider key="slider" autoPlaySpeed={sec?.content?.autoPlaySpeed || 4000} />
  );

  const renderHero = (sec) => {
    const badge = sec?.content?.badge || "INDIA'S TRUSTED DEVICE MARKETPLACE";
    const headline = sec?.content?.headline || "India's Most Trusted Device Marketplace";
    const subheadline = sec?.content?.subheadline || "Sell your used gadgets";
    const description =
      sec?.content?.description ||
      "Get the best value for your old devices, with free doorstep pickup and instant payment — all in one place.";
    const searchPlaceholder =
      sec?.content?.searchPlaceholder || "Search your device (e.g. iPhone 15 Pro, Galaxy S24, MacBook Air)...";
    const heroImage = sec?.content?.heroImage || heroBannerImage;
    const heroImageAlt = sec?.content?.heroImageAlt || "SecondSale Devices - Sell Smart Buy Better";
    const popularSearches =
      Array.isArray(sec?.content?.popularSearches) && sec.content.popularSearches.length > 0
        ? sec.content.popularSearches
        : POPULAR_SEARCHES;
    const primaryCtaText = sec?.content?.primaryCtaText || "Get Device Value";
    const primaryCtaLink = sec?.content?.primaryCtaLink || "/sell-old-mobile-phones/brand";
    const secondaryCtaText = sec?.content?.secondaryCtaText || "How It Works";
    const secondaryCtaLink = sec?.content?.secondaryCtaLink || "#how-it-works";
    const trustPills =
      Array.isArray(sec?.content?.trustPills) && sec.content.trustPills.length > 0
        ? sec.content.trustPills
        : ["Free Pickup", "Instant Payment", "Secure & Hassle-free"];

    return (
      <div key="hero" className="w-full">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF]/40 via-white to-white pt-6 pb-12 sm:pb-16 px-4">
          <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#2563EB]/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#2563EB]/5 blur-3xl" />

          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="relative z-10 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full pl-2.5 pr-4 py-1.5 text-[11px] sm:text-xs font-bold text-[#1D4ED8] mb-6">
                <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                  <Shield size={11} className="text-white" />
                </div>
                {badge}
              </div>

              <h1 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-black text-[#0F2D5B] leading-[1.08] tracking-tight mb-2">
                {headline}
              </h1>
              <h1 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-black leading-[1.08] tracking-tight mb-5">
                <span className="text-[#2563EB] relative inline-block">
                  {subheadline}
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563EB] rounded-full" style={{ bottom: "-4px" }} />
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-[1.05rem] text-gray-500 leading-relaxed mb-7 max-w-[520px]">
                {description}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-[520px] mb-4" ref={heroSearchRef}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim().length >= 2) {
                      performSearch(searchQuery);
                      setShowResults(true);
                    }
                  }}
                  className="flex items-center bg-white border-2 border-slate-200 rounded-2xl overflow-hidden focus-within:border-[#2563EB] focus-within:shadow-md transition-all shadow-sm"
                >
                  <div className="pl-4 text-slate-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="flex-1 px-3 py-4 text-sm sm:text-base outline-none bg-transparent text-[#0F2D5B] font-medium placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchResults.length > 0 || searchQuery.length >= 2) setShowResults(true);
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false); }}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors mr-1 border-none bg-transparent cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-gradient text-white px-5 sm:px-6 py-4 transition-colors font-bold cursor-pointer shrink-0 border-none"
                  >
                    <Search size={20} />
                  </button>
                </form>

                {/* Dedicated Hero Search Results Dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[2000] overflow-hidden flex flex-col dropdown-animate">
                    {!isSearching && searchResults.length > 0 && (
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Matching Devices ({searchResults.length})
                        </span>
                        <span className="text-[11px] text-blue-600 font-semibold">
                          Instant Valuation
                        </span>
                      </div>
                    )}

                    <div className="overflow-y-auto divide-y divide-slate-100 max-h-[360px]">
                      {isSearching ? (
                        <div className="px-6 py-8 text-center text-slate-500">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs font-semibold">Searching devices for &quot;{searchQuery}&quot;...</p>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-500">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                            <Search size={18} />
                          </div>
                          <p className="text-sm font-bold text-slate-800">No matching devices</p>
                          <p className="text-xs text-slate-400 mt-1">
                            We couldn&apos;t find anything for &quot;{searchQuery}&quot;. Try clicking the popular tags below.
                          </p>
                        </div>
                      ) : (
                        searchResults.map((result) => (
                          <button
                            key={result.slug}
                            type="button"
                            onClick={() => handleResultClick(result)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50/70 transition-all flex items-center gap-3.5 group cursor-pointer border-none bg-transparent"
                          >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-blue-300 group-hover:bg-white transition-colors">
                              {result.imageUrl ? (
                                <img
                                  src={result.imageUrl}
                                  alt={result.modelName}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="text-slate-300">
                                  <Search size={18} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 pr-2">
                              <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {result.modelName}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                <span className="font-semibold text-slate-600">{result.brand}</span>
                                <span>•</span>
                                <span className="capitalize">{CATEGORY_LABELS[result.category] || result.category}</span>
                              </div>
                            </div>

                            {result.maxPrice > 0 && (
                              <div className="text-right shrink-0 pl-1">
                                <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Get Upto</p>
                                <p className="text-sm font-extrabold text-blue-600 leading-tight">
                                  ₹{result.maxPrice.toLocaleString("en-IN")}
                                </p>
                              </div>
                            )}

                            <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0">
                              <ArrowRight size={16} />
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {!isSearching && searchResults.length > 0 && (
                      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium shrink-0">
                        Instant valuation · Free doorstep pickup · Same-day payment
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-2 mb-8 max-w-[520px]">
                <span className="text-xs text-gray-400 font-medium">Popular searches:</span>
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#0F2D5B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#E6F4FF]/40 transition-all cursor-pointer shadow-xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  to={primaryCtaLink}
                  className="inline-flex items-center gap-2 btn-gradient text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all no-underline shadow-lg shadow-[#2563EB]/25 hover:-translate-y-0.5"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  {primaryCtaText}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={secondaryCtaLink}
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#2563EB] text-[#0F2D5B] hover:text-[#2563EB] font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all no-underline"
                >
                  <Clock size={18} />
                  {secondaryCtaText}
                  <ArrowRight size={18} />
                </a>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 font-medium">
                {trustPills.map((pill) => (
                  <span key={pill} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[9px]">✓</span>
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Banner Image */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100/20 max-w-[560px]">
                <img
                  src={heroImage}
                  alt={heroImageAlt}
                  fetchpriority="high"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover rounded-3xl transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderDeviceCategories = (sec) => {
    const categories =
      Array.isArray(sec?.content?.categories) && sec.content.categories.length > 0
        ? sec.content.categories
        : DEVICE_CATEGORIES;

    return (
      <section key="deviceCategories" className="py-8 sm:py-10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          {sec?.title && sec.title !== "Sell Your Device Categories" && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-[#0F2D5B]">{sec.title}</h2>
              {sec.subtitle && <p className="text-xs text-gray-500 mt-1">{sec.subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {categories.map((cat, idx) => {
              const defaultCat = DEVICE_CATEGORIES[idx % DEVICE_CATEGORIES.length] || DEVICE_CATEGORIES[0];
              const img = cat.img || (cat.icon === "mobile" ? mobileDeviceImg : cat.icon === "tablet" ? tabletDeviceImg : cat.icon === "laptop" ? laptopDeviceImg : cat.icon === "imac" ? macDeviceImg : defaultCat.img);
              const color = cat.color || defaultCat.color || "#E6F4FF";

              return (
                <Link
                  to={cat.to || "/sell-old-mobile-phones/brand"}
                  key={cat.label || idx}
                  className="group flex flex-col items-center text-center rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-[#2563EB]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline relative overflow-hidden"
                  style={{ backgroundColor: color + "35" }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300">
                    {img ? (
                      <img
                        src={img}
                        alt={cat.label}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                      />
                    ) : cat.icon === "smartwatch" ? (
                      <div className="w-14 h-14 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/50">
                        <Watch size={28} />
                      </div>
                    ) : cat.icon === "console" ? (
                      <div className="w-14 h-14 rounded-2xl bg-purple-100/90 text-purple-600 flex items-center justify-center shadow-xs border border-purple-200/50">
                        <Gamepad2 size={28} />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-200/50">
                        <Headphones size={28} />
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F2D5B] group-hover:text-[#2563EB] transition-colors leading-snug mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium leading-tight">
                    {cat.desc}
                  </p>

                  <div className="mt-2 text-[11px] font-bold text-[#2563EB] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    <span>Sell Now</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderStats = (sec) => {
    const statsList =
      Array.isArray(sec?.content?.stats) && sec.content.stats.length > 0
        ? sec.content.stats
        : HERO_STATS;

    return (
      <section key="stats" className="bg-white py-5 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2">
            {statsList.map((stat, idx) => {
              const defaultStat = HERO_STATS[idx % HERO_STATS.length];
              const icon = defaultStat?.icon || <Star size={22} strokeWidth={1.8} />;
              return (
                <div key={stat.label || idx} className="flex items-center gap-3 min-w-fit">
                  <div className="w-10 h-10 rounded-full bg-[#E6F4FF] flex items-center justify-center text-[#2563EB] shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-[#0F2D5B] leading-none">{stat.value}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderFeaturesStrip = (sec) => {
    const items =
      Array.isArray(sec?.content?.items) && sec.content.items.length > 0
        ? sec.content.items
        : ["100% Secure Transactions", "Data Wipe Protection", "7 Days Easy Return", "Warranty on All Devices", "Doorstep Pickup"];

    return (
      <section key="featuresStrip" className="py-4 bg-[#F7FAFF] border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-xs sm:text-sm font-semibold text-gray-500">
            {items.map((item, i) => (
              <span key={item + i} className="flex items-center gap-1.5 whitespace-nowrap">
                {i > 0 && <span className="text-gray-300 mx-1">|</span>}
                <span className="text-[#2563EB]">✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderServices = (sec) => {
    const badge = sec?.content?.badge || "✨ ALL-IN-ONE DEVICE SOLUTION";
    const cards = Array.isArray(sec?.content?.cards) && sec.content.cards.length > 0
      ? sec.content.cards
      : SERVICE_FEATURES;

    return (
      <section key="services" className="py-16 sm:py-24 bg-gradient-to-b from-[#F7FAFF] via-white to-[#F7FAFF] relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <SectionTitle
            tag={badge}
            title={sec?.title || "What Would You Like To Sell Today?"}
            subtitle={sec?.subtitle || "Detailed service cards with selling benefits across device types"}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
            {cards.map((s, idx) => {
              const defaultStyle = SERVICE_FEATURES[idx % SERVICE_FEATURES.length] || SERVICE_FEATURES[0];
              const gradient = s.gradient || defaultStyle.gradient;
              const shadowColor = s.shadowColor || defaultStyle.shadowColor;
              const glowColor = s.glowColor || defaultStyle.glowColor;
              const iconBg = s.iconBg || defaultStyle.iconBg;
              const badgeColor = s.badgeColor || defaultStyle.badgeColor;
              const category = s.category || defaultStyle.category;
              const points = Array.isArray(s.points) ? s.points : defaultStyle.points;

              return (
                <div
                  key={s.title || idx}
                  className="bg-white rounded-[32px] p-7 sm:p-8 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
                >
                  <div
                    className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: glowColor }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${iconBg}`}>
                        {category === "mobile" ? (
                          <Smartphone size={26} strokeWidth={2} />
                        ) : category === "tablet" ? (
                          <Tablet size={26} strokeWidth={2} />
                        ) : (
                          <Laptop size={26} strokeWidth={2} />
                        )}
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${badgeColor}`}>
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2.5 tracking-tight group-hover:text-blue-600 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                      {s.desc}
                    </p>

                    <div className="space-y-3 mb-8">
                      {points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                          <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                            <CheckCircle2 size={13} className="stroke-[2.5]" />
                          </div>
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={s.ctaTo || "/sell-old-mobile-phones/brand"}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm text-white flex items-center justify-between shadow-md transition-all duration-300 group-hover:shadow-xl bg-gradient-to-r ${gradient} ${shadowColor} hover:brightness-105 active:scale-[0.99] no-underline`}
                  >
                    <span>{s.cta || "Sell Device"}</span>
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
              {(Array.isArray(sec?.content?.trustFeatures) && sec.content.trustFeatures.length > 0
                ? sec.content.trustFeatures
                : TRUST_FEATURES
              ).map((f, idx) => {
                const defaultF = TRUST_FEATURES[idx % TRUST_FEATURES.length];
                const icon = f.icon || defaultF?.icon || <Shield size={22} strokeWidth={1.8} />;
                return (
                  <div key={f.title || idx} className="flex items-center gap-3 min-w-fit">
                    <div className="w-10 h-10 rounded-full bg-[#E6F4FF] flex items-center justify-center text-[#2563EB] shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F2D5B] leading-tight">{f.title}</p>
                      <p className="text-[11px] text-gray-400">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderBuyRefurbished = (sec) => {
    const categoriesList =
      Array.isArray(sec?.content?.categories) && sec.content.categories.length > 0
        ? sec.content.categories
        : QUOTED_CATEGORIES;
    const devicesList =
      Array.isArray(sec?.content?.devices) && sec.content.devices.length > 0
        ? sec.content.devices
        : MOST_QUOTED_DEVICES;

    const filtered = quotedCategory === "all"
      ? devicesList
      : devicesList.filter((d) => d.category === quotedCategory);

    return (
      <section key="buyRefurbished" className="py-16 sm:py-24 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#2563EB] text-xs font-black tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-blue-100">
                <Flame size={14} className="text-amber-500 fill-amber-500" />
                {sec?.content?.tag || "TOP SELLER CHOICES"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {sec?.title || <>Most Quoted <span className="text-[#2563EB]">Devices</span></>}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1 max-w-xl">
                {sec?.subtitle || "These devices are in highest demand right now. Get the best value for your device with instant pickup."}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-end">
              <Link
                to="/sell-old-mobile-phones/brand"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#2563EB] hover:text-blue-700 transition-colors mr-2"
              >
                <span>View All Devices</span>
                <ArrowRight size={15} />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollQuoted("left")}
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 hover:text-[#2563EB] hover:border-blue-400 hover:shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollQuoted("right")}
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 hover:text-[#2563EB] hover:border-blue-400 hover:shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-8">
            {categoriesList.map((tab) => {
              const isActive = quotedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuotedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-500/20"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:border-blue-300 hover:bg-white hover:text-blue-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            ref={quotedSliderRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6 pt-1"
          >
            {filtered.map((d) => {
              const badgeStyle =
                d.badgeType === "emerald"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : d.badgeType === "indigo"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : d.badgeType === "purple"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : d.badgeType === "amber"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-blue-700 border-blue-200";

              const dotColor =
                d.badgeType === "emerald"
                  ? "bg-emerald-500"
                  : d.badgeType === "indigo"
                  ? "bg-indigo-500"
                  : d.badgeType === "purple"
                  ? "bg-purple-500"
                  : d.badgeType === "amber"
                  ? "bg-amber-500"
                  : "bg-blue-500";

              return (
                <Link
                  key={d.id}
                  to={d.to || "/sell-old-mobile-phones/brand"}
                  className="min-w-[260px] sm:min-w-[280px] max-w-[280px] shrink-0 snap-start bg-white rounded-[28px] p-5 border border-slate-200/80 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group no-underline relative overflow-hidden"
                >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${badgeStyle}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColor}`} />
                    {d.badge}
                  </span>
                </div>

                <div className="w-full h-44 sm:h-48 rounded-2xl bg-slate-50/60 flex items-center justify-center p-3 mb-4 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-1 mb-1">
                    {d.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Upto</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      ₹{d.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-2 px-1 bg-slate-50 rounded-xl border border-slate-100 text-center mb-4">
                    <div className="flex flex-col items-center">
                      <ShieldCheck size={13} className="text-blue-500 mb-0.5" />
                      <span className="text-[9px] font-bold text-slate-500">Best Price</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-200/60">
                      <Truck size={13} className="text-emerald-500 mb-0.5" />
                      <span className="text-[9px] font-bold text-slate-500">Free Pickup</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Zap size={13} className="text-amber-500 mb-0.5" />
                      <span className="text-[9px] font-bold text-slate-500">Instant Pay</span>
                    </div>
                  </div>
                </div>

                <div className="w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 transition-all duration-300 bg-blue-50 text-[#2563EB] border border-blue-100 group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-blue-500/20">
                  <span>Get Quote</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center sm:hidden mt-4">
          <Link
            to="/sell-old-mobile-phones/brand"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]"
          >
            <span>View All Devices</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

  const renderHowItWorks = (sec) => {
    const stepsList =
      Array.isArray(sec?.content?.steps) && sec.content.steps.length > 0
        ? sec.content.steps
        : HOW_IT_WORKS_STEPS;

    return (
      <section key="howItWorks" id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-[#E6F4FF]/40 rounded-[32px] p-8 sm:p-12 border border-[#2563EB]/10">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
              <div className="lg:w-[280px] shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-[3px] bg-[#2563EB] rounded-full" />
                  <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">EASY PROCESS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F2D5B] mb-3 leading-tight">
                  {sec?.title || (
                    <>
                      Sell Your Device in <span className="text-[#2563EB]">4 Simple Steps</span>
                    </>
                  )}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {sec?.subtitle || "Fast, secure and hassle-free experience from quote to payment."}
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
                {stepsList.map((step, i) => {
                  const defaultStep = HOW_IT_WORKS_STEPS[i % HOW_IT_WORKS_STEPS.length];
                  const icon = defaultStep?.icon || <Zap size={24} strokeWidth={1.8} />;
                  return (
                    <div key={step.num || i} className="text-center relative">
                      {i < stepsList.length - 1 && (
                        <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t-2 border-dashed border-[#2563EB]/30 z-0" />
                      )}
                      <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#2563EB]/20 relative z-10">
                        {icon}
                      </div>
                      <h4 className="text-sm font-black text-[#0F2D5B] mb-1">
                        <span className="text-[#2563EB] mr-1">{step.num || (i + 1)}</span>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          <div className="mt-8 pt-6 border-t border-[#2563EB]/10 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {(Array.isArray(sec?.content?.trustPoints) && sec.content.trustPoints.length > 0
              ? sec.content.trustPoints
              : [
                  { text: "100% Safe & Secure", sub: "Data wiped & secure handling" },
                  { text: "Best Price Guaranteed", sub: "Get highest value for your device" },
                  { text: "Trusted by 50,000+ Customers", sub: "Rated 4.9/5 across platforms" },
                  { text: "24x7 Customer Support", sub: "We're always here to help" },
                ]
            ).map((t, i) => {
              const defaultIcons = [<Shield key="s" size={18} />, <Tag key="t" size={18} />, <Users key="u" size={18} />, <Headphones key="h" size={18} />];
              return (
                <div key={t.text || i} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2563EB] shrink-0 shadow-sm">
                    {defaultIcons[i % defaultIcons.length]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F2D5B]">{t.text}</p>
                    <p className="text-[10px] text-gray-400">{t.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    );
  };

  const renderReviews = (sec) => {
    const reviewsList =
      Array.isArray(sec?.content?.reviews) && sec.content.reviews.length > 0
        ? sec.content.reviews
        : REVIEWS;

    const col1 = reviewsList.slice(0, Math.ceil(reviewsList.length / 3));
    const col2 = reviewsList.slice(Math.ceil(reviewsList.length / 3), Math.ceil((reviewsList.length * 2) / 3));
    const col3 = reviewsList.slice(Math.ceil((reviewsList.length * 2) / 3));

    return (
      <section key="reviews" className="py-16 sm:py-24 bg-[#F7FAFF] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionTitle
            tag={sec?.content?.tag || "⭐ Customer Reviews"}
            title={sec?.title || "Real Feedback From Our Customers"}
            subtitle={sec?.subtitle || "Thousands of users across India trust SecondSale to convert their old phones into instant cash with free pickup."}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ReviewColumn reviews={col1.length > 0 ? col1 : reviewsList} />
            <div className="hidden md:block">
              <ReviewColumn reviews={col2.length > 0 ? col2 : reviewsList} reverse />
            </div>
            <div className="hidden md:block">
              <ReviewColumn reviews={col3.length > 0 ? col3 : reviewsList} />
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderWhyUs = (sec) => {
    const guaranteesList =
      Array.isArray(sec?.content?.guarantees) && sec.content.guarantees.length > 0
        ? sec.content.guarantees
        : GUARANTEES;

    return (
      <section key="whyUs" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-gradient-to-br from-[#E6F4FF]/50 to-white rounded-[28px] p-8 sm:p-12 border border-[#2563EB]/15 shadow-xl max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                TRUST & TRANSPARENCY
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2D5B] mt-3 mb-2">
                {sec?.title || "SecondSale Guarantees"}
              </h3>
              <p className="text-sm text-gray-500">
                {sec?.subtitle || "Every transaction is protected by our industry-leading guarantee"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {guaranteesList.map((g, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#0F2D5B] bg-white rounded-xl p-4 border border-[#2563EB]/10 shadow-xs">
                  <div className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">✓</div>
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderFaqs = (sec) => {
    const faqsList =
      Array.isArray(sec?.content?.faqs) && sec.content.faqs.length > 0
        ? sec.content.faqs
        : FAQS;

    return (
      <section key="faqs" className="py-16 sm:py-24 bg-[#F7FAFF]">
        <div className="max-w-[760px] mx-auto px-4">
          <SectionTitle
            tag={sec?.content?.tag || "❓ FAQs"}
            title={sec?.title || "Frequently Asked Questions"}
            subtitle={sec?.subtitle || "Find clear answers to all your questions about device pricing, pickups, and secure payments."}
          />
          <div>
            {faqsList.map((faq, idx) => (
              <FAQItem key={faq.q || idx} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center mt-6">
            <Link to="/faq" className="text-[#2563EB] font-bold text-sm hover:underline">
              View all FAQs →
            </Link>
          </p>
        </div>
      </section>
    );
  };

  const renderCityLinks = (sec) => {
    const citiesList =
      Array.isArray(sec?.content?.cities) && sec.content.cities.length > 0
        ? sec.content.cities
        : CITY_DATA.slice(0, 18);

    const showAbout = sec?.content?.showAboutBox !== false;
    const aboutTitle = sec?.content?.aboutTitle || "About SecondSale in 30 seconds";
    const aboutText = sec?.content?.aboutText || ENTITY_SUMMARY;

    return (
      <div key="cityLinks" className="w-full">
        <section className="py-16 sm:py-20 bg-white border-t border-slate-100">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F2D5B] mb-3">
                {sec?.title || "Serving 2,000+ Cities Across India 🇮🇳"}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {sec?.subtitle || "Free doorstep pickup services across major cities in India. We're growing fast!"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto mb-12">
              {citiesList.map((city, idx) => (
                <Link
                  key={city.slug || idx}
                  to={city.link || `/sell-old-phone-in/${city.slug}`}
                  className="bg-[#F7FAFF] border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#E6F4FF] hover:shadow-sm transition-all no-underline"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {showAbout && (
          <section className="py-12 bg-slate-50/60 border-t border-gray-100">
            <div className="max-w-[760px] mx-auto px-4">
              <h2 className="text-lg font-black text-[#0F2D5B] mb-3">{aboutTitle}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{aboutText}</p>
            </div>
          </section>
        )}
      </div>
    );
  };

  const renderMap = {
    slider: renderSlider,
    hero: renderHero,
    deviceCategories: renderDeviceCategories,
    stats: renderStats,
    featuresStrip: renderFeaturesStrip,
    services: renderServices,
    buyRefurbished: renderBuyRefurbished,
    howItWorks: renderHowItWorks,
    reviews: renderReviews,
    whyUs: renderWhyUs,
    faqs: renderFaqs,
    cityLinks: renderCityLinks,
  };

  const DEFAULT_ORDER = [
    { type: "slider", isEnabled: true },
    { type: "hero", isEnabled: true },
    { type: "deviceCategories", isEnabled: true },
    { type: "stats", isEnabled: true },
    { type: "featuresStrip", isEnabled: true },
    { type: "services", isEnabled: true },
    { type: "buyRefurbished", isEnabled: true },
    { type: "howItWorks", isEnabled: true },
    { type: "reviews", isEnabled: true },
    { type: "whyUs", isEnabled: true },
    { type: "faqs", isEnabled: true },
    { type: "cityLinks", isEnabled: true },
  ];

  // If dynamic sections are loaded but lack 'slider', ensure slider is included
  const sectionsToRender = (() => {
    if (!sectionsConfig || sectionsConfig.length === 0) return DEFAULT_ORDER;
    const hasSlider = sectionsConfig.some((s) => s.type === "slider");
    const list = hasSlider ? [...sectionsConfig] : [{ type: "slider", isEnabled: true, order: 0 }, ...sectionsConfig];
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  })();

  if (loading) {
    return <PageLoader text="Loading marketplace..." />;
  }

  return (
    <div className="w-full">
      <SEOHead
        title="SecondSale — Sell Old Phones, Laptops & Tablets for Instant Cash in India"
        description="SecondSale is India's trusted device buyback platform. Sell old mobile phones, tablets, laptops and iMac online with free doorstep pickup and instant payment across 2,000+ cities."
        path="/"
        schema={schema}
      />

      {sectionsToRender.map((sec) => {
        if (sec.isEnabled === false) return null;
        const renderer = renderMap[sec.type];
        return renderer ? <div key={sec._id || sec.type}>{renderer(sec)}</div> : null;
      })}
    </div>
  );
}