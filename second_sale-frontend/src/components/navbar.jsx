import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { deviceService } from "../services/device.service";
import logo from "../assets/logo-secondsale.png";

const DEFAULT_MEGA_MENU_CATEGORIES = [
  { id: "mobile", label: "Phone", to: "/sell-old-mobile-phones/brand" },
  { id: "tablet", label: "Tablet", to: "/sell-tablet/brand" },
  { id: "laptop", label: "Laptop", to: "/sell-old-laptops/brand" },
  { id: "mac", label: "iMac", to: "/sell-imac/brand" },
  { id: "tv", label: "TV", comingSoon: true },
  { id: "earbuds", label: "Earbuds", comingSoon: true },
  { id: "refrigerator", label: "Refrigerator", comingSoon: true },
  { id: "smartwatch", label: "Smartwatch", comingSoon: true },
  { id: "console", label: "Gaming Console", comingSoon: true },
];

const DEFAULT_NAV_ITEMS = [
  { label: "Sell Device", hasDropdown: true },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Corporate", to: "/corporate" },
  { label: "About Us", to: "/about-us" },
  { label: "Become a Partner", to: "/partner" },
];

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

/* ── SVG Icons ─────────────────────────────────────────────── */

const ChevronDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRight = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Sparkles = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ShieldCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Navbar Component ──────────────────────────────────────── */

export default function Navbar() {
  const [siteLogo, setSiteLogo] = useState(logo);
  const [navItems, setNavItems] = useState(DEFAULT_NAV_ITEMS);
  const [categories, setCategories] = useState(DEFAULT_MEGA_MENU_CATEGORIES);
  const [hoveredCategory, setHoveredCategory] = useState("mobile");
  const [brandsData, setBrandsData] = useState({
    mobile: ["Apple", "Google", "Motorola", "Nothing", "OnePlus", "Oppo", "Poco", "Realme", "Samsung", "Vivo", "Xiaomi"],
    tablet: ["Apple", "Samsung"],
    laptop: ["Acer", "Apple", "Asus", "Dell", "HP", "Lenovo", "Samsung", "MSI"],
    mac: ["Apple"],
  });

  // Fetch dynamic brands from API
  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        const [mob, tab, lap, mac] = await Promise.all([
          deviceService.getBrands("mobile"),
          deviceService.getBrands("tablet"),
          deviceService.getBrands("laptop"),
          deviceService.getBrands("mac"),
        ]);
        setBrandsData({
          mobile: (mob.data || []).map((b) => b.brand),
          tablet: (tab.data || []).map((b) => b.brand),
          laptop: (lap.data || []).map((b) => b.brand),
          mac: (mac.data || []).map((b) => b.brand),
        });
      } catch (err) {
        console.error("Failed to load navbar dynamic brands:", err);
      }
    };
    fetchAllBrands();
  }, []);

  // Fetch dynamic categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(API + "/categories");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((c) => ({
          id: c.slug,
          label: c.name,
          to: c.route || (c.isComingSoon ? "" : "/sell-" + c.slug + "/brand"),
          comingSoon: Boolean(c.isComingSoon),
        }));
        setCategories(mapped);
      }
    } catch (err) {
      console.error("Failed to load dynamic categories in navbar:", err);
    }
  }, []);

  // Fetch site settings (logo & dynamic nav links)
  const fetchSiteSettings = useCallback(async () => {
    try {
      const res = await fetch(API + "/site-settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data?.logoUrl) setSiteLogo(data.logoUrl);
      if (Array.isArray(data?.navLinks) && data.navLinks.length > 0) {
        const active = data.navLinks
          .filter((item) => item.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (active.length > 0) {
          setNavItems(active);
        }
      }
    } catch (err) {
      console.error("Failed to load site settings in navbar:", err);
    }
  }, []);

  useEffect(() => {
    fetchSiteSettings();
    fetchCategories();

    // 1. Sync when user switches back to this tab
    const onFocus = () => { fetchSiteSettings(); fetchCategories(); };
    window.addEventListener("focus", onFocus);

    // 2. Immediate real-time sync when updated in the same window (e.g. from admin panel)
    const onSettingsUpdated = (e) => {
      const data = e?.detail;
      if (data) {
        if (data.logoUrl) setSiteLogo(data.logoUrl);
        if (Array.isArray(data.navLinks)) {
          const active = data.navLinks
            .filter((item) => item.isActive !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          if (active.length > 0) setNavItems(active);
        }
      } else {
        fetchSiteSettings();
      }
    };
    window.addEventListener("site-settings-updated", onSettingsUpdated);
    const onCatUpdated = () => fetchCategories();
    window.addEventListener("categories-updated", onCatUpdated);

    // 3. Cross-tab synchronization
    const onStorage = (e) => {
      if (e.key === "site_settings_updated_at") {
        fetchSiteSettings();
      }
      if (e.key === "categories_updated_at") {
        fetchCategories();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("site-settings-updated", onSettingsUpdated);
      window.removeEventListener("categories-updated", onCatUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchSiteSettings, fetchCategories]);
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const debounceTimer = useRef(null);
  const dropdownRef = useRef(null);

  const auth = useAuth();
  const isLoggedIn = auth?.isAuthenticated;
  const userName = auth?.user?.name;
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSellDropdownOpen(false);
  }, [location.pathname]);

  const handleMobileExpand = (label) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await deviceService.searchDevices(query.trim());
      setSearchResults(data);
      setShowResults(true);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

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
    }, 300);
  };

  const handleResultClick = (result) => {
    const basePath = CATEGORY_ROUTE_MAP[result.category] || "/sell-old-mobile-phones";
    navigate(`${basePath}/${encodeURIComponent(result.brand)}/${result.slug}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideDesktop = searchRef.current && !searchRef.current.contains(e.target);
      const clickedOutsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(e.target);
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setShowResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSellDropdownOpen(false);
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

  const renderSearchResults = (isMobile = false) => {
    if (!showResults) return null;
    return (
      <div 
        className={`absolute top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[2000] overflow-hidden flex flex-col dropdown-animate ${
          isMobile 
            ? "left-0 right-0 w-full max-h-[380px]" 
            : "right-0 w-[420px] max-w-[90vw] max-h-[480px]"
        }`}
      >
        {/* Header summary when results exist */}
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

        <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
          {isSearching ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Searching catalog for &quot;{searchQuery}&quot;...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                <SearchIcon />
              </div>
              <p className="text-sm font-bold text-slate-800">No matching devices</p>
              <p className="text-xs text-slate-400 mt-1">
                We couldn&apos;t find anything for &quot;{searchQuery}&quot;. Try searching for &quot;iPhone&quot;, &quot;Samsung&quot;, or &quot;MacBook&quot;.
              </p>
            </div>
          ) : (
            searchResults.map((result) => (
              <button
                key={result.slug}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50/70 transition-all flex items-center gap-3.5 group cursor-pointer border-none bg-transparent"
              >
                {/* Image Container */}
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
                      <SearchIcon />
                    </div>
                  )}
                </div>

                {/* Device Info */}
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

                {/* Price Block */}
                {result.maxPrice > 0 && (
                  <div className="text-right shrink-0 pl-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Get Upto</p>
                    <p className="text-sm font-extrabold text-blue-600 leading-tight">
                      ₹{result.maxPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                {/* Arrow */}
                <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info when results exist */}
        {!isSearching && searchResults.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium shrink-0">
            Instant valuation · Free doorstep pickup
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`sticky top-0 z-[1000] bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 sm:px-8 h-[68px] gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center no-underline shrink-0">
          <img
            src={siteLogo || logo}
            alt="SecondSale"
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
          {navItems.map((item) => (
            <div
              key={item._id || item.label}
              className="relative"
              ref={item.hasDropdown ? dropdownRef : undefined}
              onMouseEnter={() => item.hasDropdown && setSellDropdownOpen(true)}
              onMouseLeave={() => item.hasDropdown && setSellDropdownOpen(false)}
            >
              {item.hasDropdown ? (
                <button
                  className={`flex items-center gap-1 px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap
                    ${sellDropdownOpen ? "text-[#2563EB] bg-[#E6F4FF]" : "text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF]/50"}`}
                  onClick={() => setSellDropdownOpen(!sellDropdownOpen)}
                >
                  {item.label}
                  <span className={`transition-transform duration-200 ${sellDropdownOpen ? "rotate-180" : ""}`}>
                    <ChevronDown />
                  </span>
                </button>
              ) : item.isExternal ? (
                <a
                  href={item.to}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF]/50 transition-colors whitespace-nowrap no-underline"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  className="flex items-center gap-1 px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF]/50 transition-colors whitespace-nowrap cursor-pointer border-none bg-transparent"
                  onClick={() => {
                    if (item.to?.startsWith("/#")) {
                      const el = document.getElementById(item.to.replace("/#", ""));
                      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
                    }
                    if (item.to) navigate(item.to);
                  }}
                >
                  {item.label}
                </button>
              )}

              {/* Sell Device Dynamic Mega Menu */}
              {item.hasDropdown && sellDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-[2000] flex overflow-hidden dropdown-animate w-[490px] min-h-[380px]"
                  onMouseEnter={() => setSellDropdownOpen(true)}
                  onMouseLeave={() => setSellDropdownOpen(false)}
                >
                  {/* Left Column: Categories List */}
                  <div className="w-[195px] bg-slate-50/75 border-r border-slate-100 p-2 flex flex-col gap-0.5 shrink-0">
                    {categories.map((cat) => {
                      const isSelected = hoveredCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setHoveredCategory(cat.id)}
                          onClick={() => {
                            if (!cat.comingSoon && cat.to) {
                              setSellDropdownOpen(false);
                              navigate(cat.to);
                            }
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left border-none cursor-pointer ${
                            isSelected 
                              ? "bg-white text-[#2563EB] shadow-xs font-bold border border-slate-100" 
                              : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 bg-transparent"
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          <ChevronRight size={13} className={isSelected ? "text-[#2563EB]" : "text-slate-300"} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Dynamic Brands or Coming Soon */}
                  {(() => {
                    const currentCategoryObj = categories.find((c) => c.id === hoveredCategory);
                    const displayedBrands = brandsData[hoveredCategory] || [];
                    return (
                      <div className="flex-1 p-5 flex flex-col justify-between bg-white min-w-0">
                        {currentCategoryObj?.comingSoon ? (
                          <div className="flex flex-col items-center justify-center h-full text-center py-6 px-2">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                              <Sparkles size={22} />
                            </div>
                            <p className="text-sm font-bold text-slate-900">
                              {currentCategoryObj.label} Valuation
                            </p>
                            <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                              Coming Soon
                            </span>
                            <p className="text-xs text-slate-400 mt-2 max-w-[190px] leading-relaxed">
                              We are currently integrating our valuation engine to accept {currentCategoryObj.label} buybacks!
                            </p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                More in {currentCategoryObj?.label || "Category"}
                              </p>
                              <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                                Top Brands
                              </h4>

                              {/* Dynamic Brands List */}
                              <div className="grid grid-cols-1 gap-1">
                                {displayedBrands.slice(0, 7).map((brandName) => {
                                  const brandUrl = `${CATEGORY_ROUTE_MAP[hoveredCategory] || "/sell-old-mobile-phones"}/${encodeURIComponent(brandName)}`;
                                  return (
                                    <Link
                                      key={brandName}
                                      to={brandUrl}
                                      onClick={() => setSellDropdownOpen(false)}
                                      className="group flex items-center justify-between py-1.5 px-2 rounded-lg text-sm text-slate-600 hover:text-[#2563EB] hover:bg-blue-50/60 font-medium transition-all no-underline"
                                    >
                                      <span className="group-hover:translate-x-1 transition-transform truncate">
                                        {brandName}
                                      </span>
                                      <span className="text-slate-300 group-hover:text-[#2563EB] text-xs transition-colors shrink-0">
                                        →
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>

                            {/* View All Brands Link */}
                            <div className="pt-3 mt-3 border-t border-slate-100">
                              <Link
                                to={currentCategoryObj?.to || "/sell-old-mobile-phones/brand"}
                                onClick={() => setSellDropdownOpen(false)}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors no-underline"
                              >
                                <span>More {currentCategoryObj?.label} Brands</span>
                                <ArrowRight size={13} />
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search (Desktop) */}
        <div className="hidden md:block flex-1 min-w-[200px] xl:min-w-[260px] max-w-sm relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Search device (e.g. iPhone 15)"
            className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-sans text-[#0F2D5B] outline-none bg-[#F7FAFF] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchResults.length > 0 || searchQuery.length >= 2) setShowResults(true);
            }}
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white hover:bg-[#1D4ED8] transition-colors">
            <SearchIcon />
          </button>
          {renderSearchResults(false)}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Secure & Trusted badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
            <ShieldCheck />
            Secure & Trusted
          </div>

          {isLoggedIn ? (
            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E6F4FF] text-[#0F2D5B] font-medium text-sm no-underline transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">
                {userName?.[0]?.toUpperCase() || "U"}
              </div>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E6F4FF] text-[#0F2D5B] font-medium text-sm no-underline transition-colors">
              <UserIcon />
            </Link>
          )}

          <Link
            to="/sell-old-mobile-phones/brand"
            className="hidden sm:inline-flex btn-gradient font-bold text-sm px-5 py-2.5 rounded-xl no-underline hover:-translate-y-px active:translate-y-0"
          >
            Sell Now
          </Link>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#E6F4FF] text-[#0F2D5B] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] bg-white z-[999] overflow-y-auto dropdown-animate p-4">
          <div className="mb-6 relative" ref={mobileSearchRef}>
            <input
              type="text"
              placeholder="Search devices by name or brand..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans bg-[#F7FAFF] outline-none focus:border-[#2563EB] focus:bg-white"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0 || searchQuery.length >= 2) setShowResults(true);
              }}
            />
            {renderSearchResults(true)}
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item._id || item.label}>
                <button
                  className={`flex items-center justify-between w-full px-5 py-4 text-left font-semibold rounded-xl transition-colors
                    ${mobileExpanded === item.label ? "text-[#2563EB] bg-[#E6F4FF]" : "text-[#0F2D5B] hover:bg-[#F7FAFF]"}`}
                  onClick={() => {
                    if (!item.hasDropdown) {
                      setMobileMenuOpen(false);
                      if (item.isExternal) {
                        window.open(item.to, "_blank");
                        return;
                      }
                      if (item.to?.startsWith("/#")) {
                        const el = document.getElementById(item.to.replace("/#", ""));
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                        return;
                      }
                      if (item.to) navigate(item.to);
                    } else {
                      handleMobileExpand(item.label);
                    }
                  }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <span className={`transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`}>
                      <ChevronDown />
                    </span>
                  )}
                </button>

                {item.hasDropdown && mobileExpanded === item.label && (
                  <div className="bg-[#F7FAFF] rounded-xl mx-2 mb-2 overflow-hidden">
                    {categories.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to || "#"}
                        onClick={() => {
                          if (!sub.comingSoon && sub.to) {
                            setMobileMenuOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between px-6 py-3 text-sm no-underline font-medium transition-colors ${
                          sub.comingSoon 
                            ? "text-slate-400 cursor-not-allowed opacity-75" 
                            : "text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF]"
                        }`}
                      >
                        <span className="font-semibold">{sub.label}</span>
                        {sub.comingSoon ? (
                          <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        ) : (
                          <ChevronRight size={14} className="text-slate-400" />
                        )}
                      </Link>
                    ))}                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard" className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl font-semibold text-[#0F2D5B] no-underline hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                <UserIcon /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl font-semibold text-[#0F2D5B] no-underline hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                <UserIcon /> Login
              </Link>
            )}
            <Link to="/sell-old-mobile-phones/brand" className="btn-gradient p-4 rounded-xl font-bold text-center no-underline">
              Sell Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}