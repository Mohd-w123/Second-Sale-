import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { deviceService } from "../services/device.service";
import logo from "../assets/logo-secondsale.png";

const SELL_DEVICE_ITEMS = [
  { label: "Phone", to: "/sell-old-mobile-phones/brand", icon: "📱" },
  { label: "Tablet", to: "/sell-tablet/brand", icon: "📲" },
  { label: "Laptop", to: "/sell-old-laptops/brand", icon: "💻" },
  { label: "iMac", to: "/sell-imac/brand", icon: "🖥️" },
];

const NAV_ITEMS = [
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

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
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

/* ── Navbar Component ──────────────────────────────────────── */

export default function Navbar() {
  const [siteLogo, setSiteLogo] = useState(logo);

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(API + "/site-settings")
      .then(r => r.json())
      .then(data => { if (data?.logoUrl) setSiteLogo(data.logoUrl); })
      .catch(() => {});
  }, []);
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

  const renderSearchResults = () => {
    if (!showResults) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[2000] max-h-96 overflow-y-auto dropdown-animate">
        {isSearching ? (
          <div className="px-4 py-3 text-center text-gray-500 text-sm">Searching...</div>
        ) : searchResults.length === 0 ? (
          <div className="px-4 py-3 text-center text-gray-500 text-sm">
            No devices found for "<strong>{searchQuery}</strong>"
          </div>
        ) : (
          searchResults.map((result) => (
            <button
              key={result.slug}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 text-left hover:bg-[#E6F4FF] border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3"
            >
              {result.imageUrl ? (
                <img src={result.imageUrl} alt={result.modelName} className="w-10 h-10 object-cover rounded" />
              ) : (
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                  <SearchIcon />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0F2D5B] truncate">{result.modelName}</p>
                <p className="text-xs text-gray-500">
                  {result.brand} · {CATEGORY_LABELS[result.category] || result.category}
                </p>
              </div>
              {result.maxPrice > 0 && (
                <p className="text-sm font-semibold text-[#2563EB] whitespace-nowrap">
                  ₹{result.maxPrice.toLocaleString("en-IN")}
                </p>
              )}
            </button>
          ))
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
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              ref={item.hasDropdown ? dropdownRef : undefined}
              onMouseEnter={() => item.hasDropdown && setSellDropdownOpen(true)}
              onMouseLeave={() => item.hasDropdown && setSellDropdownOpen(false)}
            >
              {item.hasDropdown ? (
                <button
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap
                    ${sellDropdownOpen ? "text-[#2563EB] bg-[#E6F4FF]" : "text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF]/50"}`}
                  onClick={() => setSellDropdownOpen(!sellDropdownOpen)}
                >
                  {item.label}
                  <span className={`transition-transform duration-200 ${sellDropdownOpen ? "rotate-180" : ""}`}>
                    <ChevronDown />
                  </span>
                </button>
              ) : (
                <button
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF]/50 transition-colors whitespace-nowrap"
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

              {/* Sell Device Dropdown */}
              {item.hasDropdown && sellDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl min-w-[220px] py-2 z-[2000] dropdown-animate">
                  {SELL_DEVICE_ITEMS.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.to}
                      className="flex items-center justify-between px-5 py-3 text-sm text-[#0F2D5B] hover:bg-[#E6F4FF] hover:text-[#2563EB] transition-colors font-medium no-underline group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base">{sub.icon}</span>
                        {sub.label}
                      </span>
                      <span className="text-gray-300 group-hover:text-[#2563EB] transition-colors">
                        <ChevronRight />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search (Desktop) */}
        <div className="hidden md:block flex-1 max-w-sm relative" ref={searchRef}>
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
          {renderSearchResults()}
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
            {renderSearchResults()}
          </div>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button
                  className={`flex items-center justify-between w-full px-5 py-4 text-left font-semibold rounded-xl transition-colors
                    ${mobileExpanded === item.label ? "text-[#2563EB] bg-[#E6F4FF]" : "text-[#0F2D5B] hover:bg-[#F7FAFF]"}`}
                  onClick={() => {
                    if (!item.hasDropdown) {
                      setMobileMenuOpen(false);
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
                    {SELL_DEVICE_ITEMS.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-6 py-3.5 text-sm text-[#0F2D5B] hover:text-[#2563EB] hover:bg-[#E6F4FF] transition-colors no-underline font-medium"
                      >
                        <span className="text-base">{sub.icon}</span>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
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