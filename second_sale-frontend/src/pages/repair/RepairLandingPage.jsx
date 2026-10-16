import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { REPAIR_BRANDS, REPAIR_SERVICE_TYPES } from '../../data/repairData';

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Select Your Device', desc: 'Choose your phone brand and model from our extensive list.' },
  { step: '02', icon: '🛠️', title: 'Pick Repair Service', desc: 'Select the repair services you need with transparent upfront pricing.' },
  { step: '03', icon: '📅', title: 'Book a Slot', desc: 'Choose a convenient date and time for our technician to visit.' },
  { step: '04', icon: '✅', title: 'Get It Fixed', desc: 'Our certified technician repairs your device at your doorstep.' },
];

const TRUST_STATS = [
  { value: '50K+', label: 'Devices Repaired' },
  { value: '4.7★', label: 'Average Rating' },
  { value: '6 Mo.', label: 'Repair Warranty' },
  { value: '7-Day', label: 'Satisfaction Refund' },
];

const SERVICE_ICON_MAP = {
  screen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="6" y="7" width="12" height="14" rx="1"/><line x1="10" y1="7" x2="10" y2="5"/><line x1="14" y1="7" x2="14" y2="5"/>
      <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
    </svg>
  ),
  front_camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  back_camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="currentColor"/>
    </svg>
  ),
  charging_jack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  speaker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  ),
  receiver: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  back_panel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M8 4v16"/>
    </svg>
  ),
};

export default function RepairLandingPage({ defaultService = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentServiceParam = searchParams.get('service') || defaultService || null;

  const [selectedService, setSelectedService] = useState(currentServiceParam);
  const [brandSearch, setBrandSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [brands, setBrands] = useState(REPAIR_BRANDS);

  const scrollToBrands = (instant = false) => {
    const el = document.getElementById('brand-section') || document.getElementById('brands');
    if (el) {
      el.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    document.title = 'Mobile Repair Service | Doorstep Repair | SecondSale';
    setTimeout(() => setIsVisible(true), 100);

    // Only scroll if a service is specifically targeted in URL or props
    if (currentServiceParam) {
      const scrollTimer = setTimeout(() => {
        scrollToBrands(false);
      }, 250);
      return () => clearTimeout(scrollTimer);
    }
  }, [currentServiceParam]);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${API_BASE}/repairs/brands`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge with REPAIR_BRANDS logos if logo is missing
          const merged = data.map(b => {
            const staticMatch = REPAIR_BRANDS.find(sb => sb.slug === b.slug || sb.id === b.slug);
            return {
              ...b,
              logo: b.logo || staticMatch?.logo,
              color: b.color || staticMatch?.color,
            };
          });
          setBrands(merged);
        }
      })
      .catch(err => console.warn('Using default repair brands:', err));
  }, []);

  const handleServiceClick = (serviceId) => {
    if (selectedService === serviceId) {
      setSelectedService(null);
      setSearchParams({}, { replace: true });
    } else {
      setSelectedService(serviceId);
      setSearchParams({ service: serviceId }, { replace: true });
      scrollToBrands(false);
    }
  };

  const handleBrandClick = (brand) => {
    const brandSlug = brand.slug || brand.id;
    const query = selectedService ? `?service=${selectedService}` : '';
    navigate(`/repair/${brandSlug}${query}`);
  };

  const activeServiceMeta = REPAIR_SERVICE_TYPES.find(s => s.id === selectedService);

  const filteredBrands = brands.filter(b => {
    if (!brandSearch.trim()) return true;
    return b.name.toLowerCase().includes(brandSearch.toLowerCase().trim());
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B252C 0%, #087F8C 50%, #0EA5E9 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #0EA5E9 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-14 sm:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Text */}
            <div className={`flex-1 text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Open 7 Days · 9 AM – 9 PM
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
                Expert Mobile Repair<br />
                <span className="text-yellow-300">At Your Doorstep</span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-lg mb-7 leading-relaxed">
                Certified technicians, genuine parts, and transparent pricing. Get your phone fixed without leaving home.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['6-Month Warranty', 'Doorstep Repair', 'Transparent Pricing'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm font-medium px-3.5 py-1.5 rounded-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-green-400"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {t}
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollToBrands(false)}
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-base px-7 py-3.5 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                Book Repair Now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Stats card */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {TRUST_STATS.map(s => (
                <div key={s.label} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-5 text-center">
                  <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                  <div className="text-white/70 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Services Strip (Clickable Cashify Flow) ───────────────── */}
      <div className="bg-gray-50 border-b border-gray-100 sticky top-0 z-20 shadow-xs backdrop-blur-md bg-gray-50/95">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-5 rounded-full" style={{ background: '#087F8C' }} />
              <h2 className="text-sm sm:text-base font-bold text-gray-800">Services Available</h2>
              <span className="text-xs text-gray-400 hidden sm:inline">(Click a service to view phone brands)</span>
            </div>
            {selectedService && (
              <button
                onClick={() => {
                  setSelectedService(null);
                  setSearchParams({}, { replace: true });
                }}
                className="text-xs font-bold text-[#087F8C] hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>✕</span> Clear Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
            {REPAIR_SERVICE_TYPES.map(svc => {
              const isSelected = selectedService === svc.id;
              return (
                <button
                  key={svc.id}
                  onClick={() => handleServiceClick(svc.id)}
                  title={`Select ${svc.label}`}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer group text-left relative ${
                    isSelected
                      ? 'bg-[#E8F6F7] border-[#087F8C] shadow-sm ring-2 ring-[#087F8C]/20 -translate-y-0.5'
                      : 'bg-white border-gray-200/80 hover:border-[#087F8C] hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#087F8C] text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                      ✓
                    </span>
                  )}
                  <div className={`transition-transform duration-200 group-hover:scale-110 ${isSelected ? 'text-[#087F8C]' : 'text-gray-600 group-hover:text-[#087F8C]'}`}>
                    {SERVICE_ICON_MAP[svc.id] || <span className="text-2xl">{svc.icon}</span>}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-2 ${isSelected ? 'text-[#087F8C] font-bold' : 'text-gray-700'}`}>
                    {svc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Select Brand ─────────────────────────────────────────── */}
      <div id="brand-section" className="scroll-mt-20 sm:scroll-mt-24 max-w-[1200px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        {/* Active Service Banner (Cashify-style context) */}
        {activeServiceMeta && (
          <div className="mb-8 bg-gradient-to-r from-[#E8F6F7] via-[#F0FAFB] to-[#E8F6F7] border-2 border-[#087F8C]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#087F8C] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                {SERVICE_ICON_MAP[activeServiceMeta.id] || <span className="text-2xl">{activeServiceMeta.icon}</span>}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#087F8C]">
                  <span className="w-2 h-2 rounded-full bg-[#087F8C] animate-ping" />
                  Selected Repair Service
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">{activeServiceMeta.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{activeServiceMeta.description} • Choose your phone brand below</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedService(null);
                setSearchParams({}, { replace: true });
              }}
              className="text-xs font-bold text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-red-50 hover:border-red-200 transition-colors self-start sm:self-center cursor-pointer"
            >
              Change / View All Services
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <span className="inline-block bg-[#E8F6F7] text-[#087F8C] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3">
            Step 1
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Select Your Phone Brand</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {activeServiceMeta 
              ? `Select phone brand to view models with ${activeServiceMeta.label} pricing`
              : 'Choose your phone brand to see available models and repair pricing.'}
          </p>

          {/* Quick Brand Search */}
          <div className="mt-5 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search brand (e.g. Apple, Samsung, OnePlus, Vivo)..."
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#087F8C] transition-all"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            {brandSearch && (
              <button
                onClick={() => setBrandSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-10 text-center border border-gray-200 max-w-md mx-auto">
            <p className="text-sm font-bold text-gray-600">No brand found matching "{brandSearch}"</p>
            <button
              onClick={() => setBrandSearch('')}
              className="mt-2 text-xs font-bold text-[#087F8C] hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredBrands.map(brand => (
              <button
                key={brand.slug || brand.id}
                onClick={() => handleBrandClick(brand)}
                className="group flex flex-col items-center gap-3 bg-white rounded-2xl border-2 border-gray-100 p-5 sm:p-6 transition-all duration-200 hover:border-[#087F8C] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(8,127,140,0.15)] cursor-pointer text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50/80 border border-gray-100 p-2.5 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-200 flex-shrink-0">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = brand.name?.[0] || '📱';
                        }
                      }}
                    />
                  ) : (
                    <span className="text-xl font-black text-gray-500">{brand.name?.[0] || '📱'}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#087F8C] transition-colors">{brand.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {brand.modelCount ? `${brand.modelCount} Models` : 'Repair Available'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Simple 4-step process to get your device repaired at home</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" className="w-6 h-6"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                )}
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-[#087F8C] uppercase tracking-wider mb-1">Step {step.step}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-[#E8F6F7] text-[#087F8C] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-4">
              Why SecondSale Repair?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
              Premium Repair Service<br />You Can Trust
            </h2>
            <div className="space-y-4">
              {[
                { icon: '🔧', title: 'Certified Technicians', desc: 'All our technicians are trained and certified with 2+ years experience.' },
                { icon: '✅', title: '6-Month Repair Warranty', desc: 'Every repair comes with a 6-month warranty on parts and labor.' },
                { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. You see the price upfront before booking.' },
                { icon: '🚗', title: 'Doorstep Service', desc: 'Our technician comes to your home or office. No travel needed.' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-2xl flex-shrink-0">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100" style={{ background: 'linear-gradient(135deg, #E8F6F7 0%, #F0FBFC 100%)' }}>
            <div className="p-8 text-center">
              <div className="text-7xl mb-6">🔧</div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Book Your Repair</h3>
              <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
                Select your device above and let our certified technicians fix it at your doorstep.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {TRUST_STATS.map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-xl font-extrabold text-[#087F8C]">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How long does a repair take?', a: 'Most repairs are completed in 30–60 minutes at your doorstep. Complex repairs like back panel or multi-service may take up to 2 hours.' },
              { q: 'Are the spare parts original?', a: 'We use OEM (Original Equipment Manufacturer) quality parts for all repairs. Premium / original OEM parts are also available on request.' },
              { q: 'What if the repair doesn\'t fix my issue?', a: 'We offer a 7-day satisfaction refund policy. If the issue persists after the repair, our technician will revisit at no additional cost.' },
              { q: 'Is my data safe during repair?', a: 'Absolutely. Our technicians only work on the hardware components. Your data is completely safe and untouched throughout the repair process.' },
              { q: 'Do I need to be present during the repair?', a: 'Yes, someone above 18 years should be present at the address at the time of the repair appointment.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <span className="font-semibold text-gray-900 text-sm">{q}</span>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`w-4 h-4 text-[#087F8C] transition-transform duration-200 flex-shrink-0 ml-3 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
