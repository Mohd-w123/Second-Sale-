import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import Breadcrumb from '../components/ui/Breadcrumb';
import Loader from '../components/ui/Loader';
import { CategoryPageSEO } from '../components/seo/DevicePageSEO';
import { CATEGORY_SEO } from '../config/seo';
import { BRANDS } from '../constants/devices';

const MobileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const MOBILE_BRAND_ORDER = ["Apple", "Samsung", "OnePlus", "Vivo", "Oppo", "Xiaomi"];

const sortMobileBrands = (brandsList) => {
  return [...brandsList].sort((a, b) => {
    const aIndex = MOBILE_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === a.brand.toLowerCase()
    );
    const bIndex = MOBILE_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === b.brand.toLowerCase()
    );

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.brand.localeCompare(b.brand);
  });
};

export default function BrandSelectionPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState({});

  const fetchBrands = () => {
    setLoading(true);
    deviceService.getBrands('mobile').then(res => {
      setBrands(sortMobileBrands(res.data || []));
      setLoading(false);
    }).catch(() => {
      setBrands([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const getBrandColor = (name) => {
    const b = BRANDS.find(br => br.name.toLowerCase() === name.toLowerCase());
    return b?.color || '#087F8C';
  };

  const getBrandLogo = (name) => {
    const b = BRANDS.find(br => br.name.toLowerCase() === name.toLowerCase());
    if (b?.logo) return b.logo;
    const slug = (name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return `/brands/${slug}.svg`;
  };

  const handleLogoError = (brandName) => {
    setFailedLogos(prev => ({...prev, [brandName]: true}));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-10 sm:pb-16">
      <CategoryPageSEO
        title={CATEGORY_SEO.mobile.title}
        description={CATEGORY_SEO.mobile.description}
        path={CATEGORY_SEO.mobile.brandPath}
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Mobile Phones' }]}
      />
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Mobile Phones' },
      ]} />

      {/* Section Title */}
      <div className="text-center mb-4 sm:mb-4">
        <span className="inline-block bg-primary-light text-primary text-xs font-bold tracking-wider uppercase px-3.5 py-1 rounded-full mb-3">
          Sell Your Phone
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary mb-3">Select Your Phone Brand</h1>
        <p className="text-sm sm:text-base text-text-muted max-w-lg mx-auto leading-relaxed">
          Choose your phone brand below and get an instant price quote with free doorstep pickup.
        </p>
      </div>

      {/* Brand Grid or Retry */}
      {brands.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-100 max-w-md mx-auto my-8 shadow-sm">
          <p className="text-sm font-bold text-slate-700 mb-1">Unable to connect to server</p>
          <p className="text-xs text-slate-400 mb-5">Please check your internet connection or retry.</p>
          <button
            onClick={fetchBrands}
            className="btn-gradient text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {brands.map(b => (
            <Link
              key={b.brand}
              to={`/sell-old-mobile-phones/${encodeURIComponent(b.slug || b.brand.toLowerCase())}`}
              className="group flex flex-col items-center gap-3 bg-white rounded-2xl border border-border p-5 sm:p-6 transition-all duration-200 hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(8,127,140,0.15)] no-underline"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 p-2.5 transition-transform duration-200 group-hover:scale-110 overflow-hidden">
                {(!failedLogos[b.brand] && (b.logo || getBrandLogo(b.brand))) ? (
                  <img 
                    src={b.logo || getBrandLogo(b.brand)} 
                    alt={b.brand}
                    className="w-full h-full object-contain"
                    onError={() => handleLogoError(b.brand)}
                  />
                ) : (
                  <span className="text-slate-800 font-extrabold text-sm sm:text-base">
                    {b.brand.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-text-primary">{b.brand}</p>
                <p className="text-xs text-text-muted mt-0.5">{b.modelCount} model{b.modelCount !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Popular Series Quick Directory */}
      <div className="mt-12 sm:mt-16 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#087F8C]" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Browse Popular Mobile Series
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Direct links to popular series lineups. Click any series to see its models and instant quotes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Samsung */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">Samsung</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Galaxy</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Galaxy A Series", id: "galaxy-a" },
                { name: "Galaxy S Series", id: "galaxy-s" },
                { name: "Galaxy Z Flip Series", id: "galaxy-z-flip" },
                { name: "Galaxy Z Fold Series", id: "galaxy-z-fold" },
                { name: "Galaxy J Series", id: "galaxy-j" },
                { name: "Galaxy M Series", id: "galaxy-m" },
                { name: "Galaxy F Series", id: "galaxy-f" },
                { name: "Galaxy Note Series", id: "galaxy-note" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/samsung?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Xiaomi */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">Xiaomi</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Redmi & Mi</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Redmi Note Series", id: "redmi-note" },
                { name: "Redmi Series", id: "redmi" },
                { name: "Mi / Xiaomi Series", id: "mi-flagship" },
                { name: "Redmi K Series", id: "redmi-k" },
                { name: "Redmi Y Series", id: "redmi-y" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/xiaomi?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Vivo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">Vivo</span>
              <span className="text-[10px] text-slate-400 font-semibold">• V, Y, T, X</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "V Series", id: "v-series" },
                { name: "Y Series", id: "y-series" },
                { name: "T Series", id: "t-series" },
                { name: "X Series", id: "x-series" },
                { name: "S Series", id: "s-series" },
                { name: "U & Z Series", id: "u-z-series" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/vivo?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Oppo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">OPPO</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Reno, F, A, Find</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Reno Series", id: "reno-series" },
                { name: "F Series", id: "f-series" },
                { name: "A Series", id: "a-series" },
                { name: "Find Series", id: "find-series" },
                { name: "K Series", id: "k-series" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/oppo?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Realme */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">Realme</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Number, Narzo, GT, C</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Realme Number Series", id: "number-series" },
                { name: "Narzo Series", id: "narzo-series" },
                { name: "GT Series", id: "gt-series" },
                { name: "C Series", id: "c-series" },
                { name: "P Series", id: "p-series" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/realme?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Motorola */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">Motorola</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Moto G, Edge, Razr</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Moto G Series", id: "moto-g" },
                { name: "Moto Edge Series", id: "moto-edge" },
                { name: "Moto Razr Series", id: "moto-razr" },
                { name: "Moto E Series", id: "moto-e" },
                { name: "Moto One Series", id: "moto-one" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/motorola?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Pixel (Google) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">Google Pixel</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Pro, A-Series, Fold</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Pixel Number Series", id: "pixel-base" },
                { name: "Pixel Pro & XL Series", id: "pixel-pro" },
                { name: "Pixel A-Series", id: "pixel-a" },
                { name: "Pixel Fold Series", id: "pixel-fold" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/google?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Poco */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900">POCO</span>
              <span className="text-[10px] text-slate-400 font-semibold">• X, M, F, C</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "POCO X Series", id: "poco-x" },
                { name: "POCO M Series", id: "poco-m" },
                { name: "POCO F Series", id: "poco-f" },
                { name: "POCO C Series", id: "poco-c" },
              ].map(s => (
                <Link
                  key={s.id}
                  to={`/sell-old-mobile-phones/poco?series=${s.id}`}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-[#E8F6F7] hover:text-[#087F8C] border border-slate-200/80 hover:border-[#087F8C]/40 px-2.5 py-1 rounded-lg transition-all no-underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap justify-center gap-6 mt-12 sm:mt-16">
        {['Free Doorstep Pickup', 'Instant Payment', 'Best Prices Guaranteed'].map(t => (
          <div key={t} className="flex items-center gap-2 text-xs sm:text-sm text-text-muted font-medium">
            <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}