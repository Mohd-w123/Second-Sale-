import BannerSlider from "../components/BannerSlider";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone, Tablet, Laptop, Monitor,
  Shield, Tag, Zap, Truck, ArrowRight,
  ChevronDown, Star, BadgeCheck, Users,
  Search, Clock, CreditCard, MapPin, Headphones
} from "lucide-react";
import heroBannerImage from "../assets/hero-banner.jpg";
import mobileDeviceImg from "../assets/devices/mobile.png";
import tabletDeviceImg from "../assets/devices/tablet.png";
import laptopDeviceImg from "../assets/devices/laptop.png";
import macDeviceImg from "../assets/devices/mac.png";
import SEOHead from "../components/seo/SEOHead";
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
    title: "Sell Your Device",
    highlight: "Your",
    desc: "Get the best value for your old devices in 60 seconds.",
    points: ["Best Price Guaranteed", "Free Doorstep Pickup", "Instant Payment", "100% Safe & Secure"],
    cta: "Get Device Value",
    ctaTo: "/sell-old-mobile-phones/brand",
    img: mobileDeviceImg,
    color: "#E6F4FF",
    iconColor: "#2563EB",
  },
  {
    title: "Sell Tablets",
    highlight: "Tablets",
    desc: "Get instant quotes for your old tablets with free pickup.",
    points: ["All Brands Accepted", "Fair Valuation", "Easy Returns", "Best Market Prices"],
    cta: "Sell Tablet",
    ctaTo: "/sell-tablet/brand",
    img: tabletDeviceImg,
    color: "#E0F0FF",
    iconColor: "#3B82F6",
  },
  {
    title: "Sell Laptops",
    highlight: "Laptops",
    desc: "Professional laptop evaluation with transparent pricing.",
    points: ["CPU/GPU Based Pricing", "All Brands Welcome", "Expert Inspection", "Quick Payment"],
    cta: "Sell Laptop",
    ctaTo: "/sell-old-laptops/brand",
    img: laptopDeviceImg,
    color: "#FFF3E0",
    iconColor: "#F59E0B",
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const schema = buildSchemaGraph([
    organizationSchema(),
    websiteSchema(),
    faqPageSchema(FAQS),
    howToSchema(HOW_TO_STEPS),
  ]);

  return (
    <div className="w-full">

      {/* ══ BANNER SLIDER — top of page ══ */}
      <BannerSlider />

      <SEOHead
        title="SecondSale — Sell Old Phones, Laptops & Tablets for Instant Cash in India"
        description="SecondSale is India's trusted device buyback platform. Sell old mobile phones, tablets, laptops and iMac online with free doorstep pickup and instant payment across 2,000+ cities."
        path="/"
        schema={schema}
      />

      {/* ════════════════════════════════════════════════════════════
          ── HERO SECTION ──
      ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF]/40 via-white to-white pt-6 pb-12 sm:pb-16 px-4">

        {/* Background decoration blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#2563EB]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#2563EB]/5 blur-3xl" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">

          {/* ── Left Column ── */}
          <div className="relative z-10 pt-4 sm:pt-8">

            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full pl-2.5 pr-4 py-1.5 text-[11px] sm:text-xs font-bold text-[#1D4ED8] mb-6">
              <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                <Shield size={11} className="text-white" />
              </div>
              INDIA'S TRUSTED DEVICE MARKETPLACE
            </div>

            {/* Main heading */}
            <h1 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-black text-[#0F2D5B] leading-[1.08] tracking-tight mb-2">
              Sell Old.
            </h1>
            <h1 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-black leading-[1.08] tracking-tight mb-5">
              <span className="text-[#2563EB] relative inline-block">
                Upgrade Smart.
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563EB] rounded-full" style={{bottom: "-4px"}} />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base lg:text-[1.05rem] text-gray-500 leading-relaxed mb-7 max-w-[520px]">
              Get the best value for your old devices, with free doorstep pickup and <strong className="text-[#0F2D5B]">instant payment</strong> — all in one place.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-[520px] mb-4">
              <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#2563EB] transition-colors shadow-sm">
                <div className="pl-4 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search device (e.g. iPhone 15)"
                  className="flex-1 px-3 py-4 text-sm sm:text-base outline-none bg-transparent text-[#0F2D5B] font-medium placeholder:text-gray-400"
                  onClick={() => document.querySelector('.navbar-search')?.focus()}
                  readOnly
                  onFocus={(e) => {
                    e.target.blur();
                    const navSearch = document.querySelector('nav input[type="text"]');
                    if (navSearch) navSearch.focus();
                  }}
                />
                <button className="btn-gradient text-white px-5 py-4 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mb-8 max-w-[520px]">
              <span className="text-xs text-gray-400 font-medium">Popular searches:</span>
              {POPULAR_SEARCHES.map((tag) => (
                <Link
                  key={tag}
                  to="/sell-old-mobile-phones/brand"
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#0F2D5B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors no-underline"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                to="/sell-old-mobile-phones/brand"
                className="inline-flex items-center gap-2 btn-gradient text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all no-underline shadow-lg shadow-[#2563EB]/25 hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                Get Device Value
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#2563EB] text-[#0F2D5B] hover:text-[#2563EB] font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all no-underline"
              >
                <Clock size={18} />
                How It Works
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 font-medium">
              {["Free Pickup", "Instant Payment", "Secure & Hassle-free"].map((pill) => (
                <span key={pill} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[9px]">✓</span>
                  {pill}
                </span>
              ))}
            </div>

          </div>

          {/* ── Right Column: Hero Banner Image (Desktop Only) ── */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100/20 max-w-[560px]">
              <img
                src={heroBannerImage}
                alt="SecondSale Devices - Sell Smart Buy Better"
                fetchpriority="high"
                width={600}
                height={500}
                className="w-full h-auto object-cover rounded-3xl transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white py-5 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2">
            {HERO_STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3 min-w-fit">
                <div className="w-10 h-10 rounded-full bg-[#E6F4FF] flex items-center justify-center text-[#2563EB] shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-[#0F2D5B] leading-none">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Category Cards ── */}
      <section className="py-10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEVICE_CATEGORIES.map((cat) => (
              <Link
                to={cat.to}
                key={cat.label}
                className="group flex items-center gap-4 rounded-2xl p-5 border border-gray-100 hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300 no-underline"
                style={{ backgroundColor: cat.color + "40" }}
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#0F2D5B] mb-0.5">{cat.label}</h3>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Marquee ── */}
      <section className="py-4 bg-[#F7FAFF] border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-xs sm:text-sm font-semibold text-gray-500">
            {["100% Secure Transactions", "Data Wipe Protection", "7 Days Easy Return", "Warranty on All Devices", "Doorstep Pickup"].map((item, i) => (
              <span key={item} className="flex items-center gap-1.5 whitespace-nowrap">
                {i > 0 && <span className="text-gray-300 mx-1">|</span>}
                <span className="text-[#2563EB]">✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Services, Your Benefits ── */}
      <section className="py-16 sm:py-24 bg-[#F7FAFF]">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionTitle
            tag="🔄 ALL-IN-ONE DEVICE SOLUTION"
            title="Our Services, Your Benefits"
            titleHighlight="Your Benefits"
            subtitle="Sell your old device — all in one trusted platform."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_FEATURES.map((s) => (
              <div key={s.title} className="bg-white rounded-[28px] p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                {/* Icon badge */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: s.color }}>
                  <Tag size={22} strokeWidth={1.8} style={{ color: s.iconColor }} />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-black text-[#0F2D5B] mb-2">
                  {s.title.split(s.highlight)[0]}
                  <span className="text-[#2563EB]">{s.highlight}</span>
                  {s.title.split(s.highlight)[1] || ""}
                </h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{s.desc}</p>

                {/* Checklist */}
                <div className="space-y-2.5 mb-6">
                  {s.points.map((point) => (
                    <div key={point} className="flex items-center gap-2.5 text-sm text-[#0F2D5B] font-medium">
                      <span className="w-5 h-5 rounded-full bg-[#E6F4FF] flex items-center justify-center text-[#2563EB] text-[10px] shrink-0">✓</span>
                      {point}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to={s.ctaTo}
                  className="flex items-center justify-between w-full btn-gradient text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-all no-underline"
                >
                  {s.cta}
                  <ArrowRight size={18} />
                </Link>

                {/* Device image (decorative) */}
                <img
                  src={s.img}
                  alt=""
                  className="absolute -bottom-4 -right-4 w-28 h-28 opacity-10 group-hover:opacity-15 object-contain transition-opacity pointer-events-none"
                />
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-10 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
              {TRUST_FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3 min-w-fit">
                  <div className="w-10 h-10 rounded-full bg-[#E6F4FF] flex items-center justify-center text-[#2563EB] shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F2D5B] leading-tight">{f.title}</p>
                    <p className="text-[11px] text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-[#E6F4FF]/40 rounded-[32px] p-8 sm:p-12 border border-[#2563EB]/10">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
              {/* Left */}
              <div className="lg:w-[280px] shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-[3px] bg-[#2563EB] rounded-full" />
                  <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">EASY PROCESS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F2D5B] mb-3 leading-tight">
                  Sell Your Device in{" "}
                  <span className="text-[#2563EB]">4 Simple Steps</span>
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Fast, secure and hassle-free experience from quote to payment.
                </p>
              </div>

              {/* Steps */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
                {HOW_IT_WORKS_STEPS.map((step, i) => (
                  <div key={step.num} className="text-center relative">
                    {/* Connector line */}
                    {i < HOW_IT_WORKS_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t-2 border-dashed border-[#2563EB]/30 z-0" />
                    )}
                    {/* Circle icon */}
                    <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#2563EB]/20 relative z-10">
                      {step.icon}
                    </div>
                    <h4 className="text-sm font-black text-[#0F2D5B] mb-1">
                      <span className="text-[#2563EB] mr-1">{step.num}</span>
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom trust indicators */}
            <div className="mt-8 pt-6 border-t border-[#2563EB]/10 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
              {[
                { icon: <Shield size={18} />, text: "100% Safe & Secure", sub: "Data wiped & secure handling" },
                { icon: <Tag size={18} />, text: "Best Price Guaranteed", sub: "Get highest value for your device" },
                { icon: <Users size={18} />, text: "Trusted by 50,000+ Customers", sub: "Rated 4.9/5 across platforms" },
                { icon: <Headphones size={18} />, text: "24x7 Customer Support", sub: "We're always here to help" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2563EB] shrink-0 shadow-sm">
                    {t.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F2D5B]">{t.text}</p>
                    <p className="text-[10px] text-gray-400">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ── */}
      <section className="py-16 sm:py-24 bg-[#F7FAFF] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionTitle
            tag="⭐ Customer Reviews"
            title="Real Feedback From Our Customers"
            subtitle="Thousands of users across India trust SecondSale to convert their old phones into instant cash with free pickup."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ReviewColumn reviews={REVIEWS.slice(0, 3)} />
            <div className="hidden md:block">
              <ReviewColumn reviews={REVIEWS.slice(3, 6)} reverse />
            </div>
            <div className="hidden md:block">
              <ReviewColumn reviews={REVIEWS.slice(6, 9)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Cities & Guarantees ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F2D5B] mb-4">
                Serving 2,000+ Cities Across India 🇮🇳
              </h2>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">Free doorstep pickup services across major cities in India. We're growing fast!</p>
              <div className="flex flex-wrap gap-2">
                {CITY_DATA.slice(0, 15).map((city) => (
                  <Link
                    key={city.slug}
                    to={`/sell-old-phone-in/${city.slug}`}
                    className="bg-[#F7FAFF] border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#E6F4FF] hover:shadow-sm transition-all no-underline"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-gray-100 shadow-xl">
              <h3 className="text-xl font-black text-[#0F2D5B] mb-7">SecondSale Guarantees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GUARANTEES.map((g) => (
                  <div key={g} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#0F2D5B] bg-[#E6F4FF]/50 rounded-xl p-4 border border-[#2563EB]/10">
                    <div className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">✓</div>
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-16 sm:py-24 bg-[#F7FAFF]">
        <div className="max-w-[760px] mx-auto px-4">
          <SectionTitle
            tag="❓ FAQs"
            title="Frequently Asked Questions"
            subtitle="Find clear answers to all your questions about device pricing, pickups, and secure payments."
          />
          <div>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center mt-6">
            <Link to="/faq" className="text-[#2563EB] font-bold text-sm hover:underline">
              View all FAQs →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Entity summary (AEO) ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-[760px] mx-auto px-4">
          <h2 className="text-lg font-black text-[#0F2D5B] mb-3">About SecondSale in 30 seconds</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{ENTITY_SUMMARY}</p>
        </div>
      </section>

    </div>
  );
}