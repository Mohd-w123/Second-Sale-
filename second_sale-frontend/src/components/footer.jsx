import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-secondsale.png";
import { SOCIAL_LINKS as SOCIAL_URLS } from "../config/seo";
import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Watch,
  Gamepad2,
  ShieldCheck,
  Zap,
  Truck,
  Award,
  Lock,
  Mail,
  Clock,
  MapPin,
  Sparkles
} from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: <Zap size={22} className="text-amber-400" />,
    title: "Instant Cashout",
    desc: "UPI or Bank transfer on the spot during pickup",
  },
  {
    icon: <Truck size={22} className="text-blue-400" />,
    title: "Free Doorstep Pickup",
    desc: "Zero convenience or shipping fees across 2,000+ cities",
  },
  {
    icon: <ShieldCheck size={22} className="text-emerald-400" />,
    title: "100% Certified Data Wipe",
    desc: "Military-grade data sanitization for complete privacy",
  },
  {
    icon: <Award size={22} className="text-purple-400" />,
    title: "Highest Valuation Guaranteed",
    desc: "Transparent algorithmic pricing for maximum device value",
  },
];

const SELL_DEVICES = [
  { label: "Sell Mobile Phones", to: "/sell-old-mobile-phones/brand", icon: <Smartphone size={15} /> },
  { label: "Sell Laptops", to: "/sell-old-laptops/brand", icon: <Laptop size={15} /> },
  { label: "Sell Tablets & iPads", to: "/sell-tablet/brand", icon: <Tablet size={15} /> },
  { label: "Sell iMac & Mac", to: "/sell-imac/brand", icon: <Monitor size={15} /> },
  { label: "Sell Smartwatches", to: "/sell-smartwatch/brand", icon: <Watch size={15} />, isNew: true },
  { label: "Sell Gaming Consoles", to: "/sell-gaming-console/brand", icon: <Gamepad2 size={15} />, isNew: true },
  { label: "Corporate Bulk Buyback", to: "/corporate", icon: <Sparkles size={15} /> },
];

const COMPANY_LINKS = [
  { label: "About SecondSale", to: "/about-us" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Become a Partner", to: "/partner" },
  { label: "Corporate Buyback", to: "/corporate" },
  { label: "Cashify Alternatives", to: "/alternatives/cashify-alternatives" },
  { label: "Customer Reviews", to: "/#reviews" },
];

const SUPPORT_LINKS = [
  { label: "Help & Support Center", to: "/help-center" },
  { label: "Frequently Asked Questions", to: "/faq" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Valuation & Return Policy", to: "/valuation-and-return-policy" },
];

const POPULAR_CITIES = [
  "Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad",
  "Chennai", "Pune", "Kolkata", "Ahmedabad",
  "Jaipur", "Lucknow", "Chandigarh", "Kochi"
];

const SOCIAL_ITEMS = [
  {
    name: "Twitter/X",
    href: SOCIAL_URLS.twitter,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: SOCIAL_URLS.instagram,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: SOCIAL_URLS.facebook,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const getDeviceIcon = (item) => {
  if (item.icon) return item.icon;
  const l = (item.label || "").toLowerCase();
  if (l.includes("phone") || l.includes("mobile")) return <Smartphone size={15} />;
  if (l.includes("laptop")) return <Laptop size={15} />;
  if (l.includes("tablet") || l.includes("ipad")) return <Tablet size={15} />;
  if (l.includes("imac") || l.includes("mac") || l.includes("monitor") || l.includes("pc")) return <Monitor size={15} />;
  if (l.includes("watch")) return <Watch size={15} />;
  if (l.includes("console") || l.includes("game") || l.includes("gaming")) return <Gamepad2 size={15} />;
  return <Sparkles size={15} />;
};

export default function Footer() {
  const [siteLogo, setSiteLogo] = useState(logo);
  const [footerConfig, setFooterConfig] = useState(null);
  const [customPages, setCustomPages] = useState([]);

  const loadData = () => {
    const API =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    // Fetch site settings
    fetch(API + "/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.logoUrl) setSiteLogo(data.logoUrl);
        if (data?.footer) setFooterConfig(data.footer);
      })
      .catch(() => {});

    // Fetch published CMS custom pages
    fetch(API + "/pages")
      .then((r) => r.json())
      .then((pages) => {
        if (Array.isArray(pages)) {
          setCustomPages(pages.filter((p) => p.isPublished && p.showInFooter));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();

    const handleSettingsUpdate = () => loadData();
    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("site-settings-updated", handleSettingsUpdate);
  }, []);

  const sellDevicesList =
    Array.isArray(footerConfig?.sellDevicesLinks) && footerConfig.sellDevicesLinks.length > 0
      ? footerConfig.sellDevicesLinks
      : SELL_DEVICES;

  const companyLinksList =
    Array.isArray(footerConfig?.companyLinks) && footerConfig.companyLinks.length > 0
      ? footerConfig.companyLinks
      : COMPANY_LINKS;

  const supportLinksList =
    Array.isArray(footerConfig?.supportLinks) && footerConfig.supportLinks.length > 0
      ? footerConfig.supportLinks
      : SUPPORT_LINKS;

  return (
    <footer className="relative bg-[#08101E] text-slate-300 overflow-hidden font-sans border-t border-slate-800/80">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* ── 1. Top Trust Features Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Zap size={22} className="text-amber-400" />,
                title: footerConfig?.trustFeatures?.[0]?.title || "Instant Cashout",
                desc: footerConfig?.trustFeatures?.[0]?.desc || "UPI or Bank transfer on the spot during pickup",
              },
              {
                icon: <Truck size={22} className="text-blue-400" />,
                title: footerConfig?.trustFeatures?.[1]?.title || "Free Doorstep Pickup",
                desc: footerConfig?.trustFeatures?.[1]?.desc || "Zero convenience or shipping fees across 2,000+ cities",
              },
              {
                icon: <ShieldCheck size={22} className="text-emerald-400" />,
                title: footerConfig?.trustFeatures?.[2]?.title || "100% Certified Data Wipe",
                desc: footerConfig?.trustFeatures?.[2]?.desc || "Military-grade data sanitization for complete privacy",
              },
              {
                icon: <Award size={22} className="text-purple-400" />,
                title: footerConfig?.trustFeatures?.[3]?.title || "Highest Valuation Guaranteed",
                desc: footerConfig?.trustFeatures?.[3]?.desc || "Transparent algorithmic pricing for maximum device value",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-800/60 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-blue-400/50 transition-all shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Main Footer Links & Information Grid ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Contact Info (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block no-underline">
              <img
                src={siteLogo || logo}
                alt="SecondSale Logo"
                className="h-9 sm:h-10 w-auto object-contain brightness-0 invert filter"
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footerConfig?.aboutText ||
                "India's premier device buyback marketplace. Turn your pre-owned smartphones, tablets, laptops, smartwatches, and gaming consoles into instant cash with hassle-free doorstep pickup."}
            </p>

            {/* Social Proof Rating Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-blue-900/30 shadow-lg flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <span className="text-amber-400 text-lg font-black">★</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-black text-sm tracking-tight">
                    {footerConfig?.ratingScore || "4.9 / 5.0"}
                  </span>
                  <div className="flex gap-0.5 text-amber-400 text-xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {footerConfig?.ratingSubtext || (
                    <>Trusted by over <strong className="text-slate-200">50,000+ happy sellers</strong> nationwide</>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail size={13} />
                </div>
                <span>{footerConfig?.email || "support@secondsale.com"}</span>
              </div>
              {footerConfig?.phone && (
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-blue-400 shrink-0">
                    <Smartphone size={13} />
                  </div>
                  <span>{footerConfig.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <Clock size={13} />
                </div>
                <span>{footerConfig?.hours || footerConfig?.workingHours || "Mon – Sun: 9:30 AM – 7:30 PM IST"}</span>
              </div>
              {footerConfig?.address && (
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin size={13} />
                  </div>
                  <span>{footerConfig.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Sell Devices (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Sell Devices
            </h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {sellDevicesList.map((item, idx) => (
                <li key={item.label + idx}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-all duration-200 no-underline"
                  >
                    <span className="text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                      {getDeviceIcon(item)}
                    </span>
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Company
            </h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {companyLinksList.map((item, idx) => (
                <li key={item.label + idx}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* Dynamic CMS Pages in Company Column */}
              {customPages
                .filter((p) => !p.footerColumn || p.footerColumn === "company")
                .map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/page/${p.slug}`}
                      className="text-sm text-slate-400 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 inline-block no-underline font-medium"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Col 4: Support & Legal (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Support & Legal
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {supportLinksList.map((item, idx) => (
                  <li key={item.label + idx}>
                    <Link
                      to={item.to}
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* Dynamic CMS Pages in Support / Legal Column */}
                {customPages
                  .filter((p) => p.footerColumn === "support" || p.footerColumn === "legal")
                  .map((p) => (
                    <li key={p._id}>
                      <Link
                        to={`/page/${p.slug}`}
                        className="text-sm text-slate-400 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 inline-block no-underline font-medium"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Popular Cities Coverage Pill Box */}
            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <MapPin size={12} className="text-emerald-400" />
                Top Cities Covered
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(footerConfig?.cities) && footerConfig.cities.length > 0
                  ? footerConfig.cities
                  : (typeof footerConfig?.cities === "string" && footerConfig.cities.trim()
                      ? footerConfig.cities.split(",").map((c) => c.trim()).filter(Boolean)
                      : POPULAR_CITIES)
                ).map((city) => (
                  <span
                    key={city}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-medium text-slate-300"
                  >
                    {city}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/40 text-[10px] font-bold text-blue-300">
                  +2,000 More
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. Bottom Strip: Copyright & Certifications ── */}
      <div className="border-t border-slate-800/80 bg-slate-950/70">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Copyright */}
            <div className="text-xs text-slate-500 text-center md:text-left">
              {footerConfig?.copyrightText ||
                `© ${new Date().getFullYear()} SecondSale Technologies Pvt. Ltd. All rights reserved.`}
              <span className="mx-2 text-slate-700 hidden sm:inline">|</span>
              <span className="block sm:inline mt-1 sm:mt-0 text-slate-400">
                India&apos;s leading re-commerce device platform.
              </span>
            </div>

            {/* Security Badges */}
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 flex-wrap justify-center">
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-sm">
                <Lock size={12} className="text-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-sm">
                <ShieldCheck size={12} className="text-blue-400" />
                100% Data Protection
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-sm">
                <span>🇮🇳</span>
                Made in India
              </span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2">
              {[
                {
                  name: "Twitter/X",
                  href: footerConfig?.socialLinks?.twitter || SOCIAL_URLS.twitter,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: footerConfig?.socialLinks?.instagram || SOCIAL_URLS.instagram,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  ),
                },
                {
                  name: "Facebook",
                  href: footerConfig?.socialLinks?.facebook || SOCIAL_URLS.facebook,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2563EB] hover:border-[#2563EB] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 no-underline"
                  aria-label={s.name}
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
