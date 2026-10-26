import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import Breadcrumb from '../components/ui/Breadcrumb';
import Loader from '../components/ui/Loader';
import { CategoryPageSEO } from '../components/seo/DevicePageSEO';
import { CATEGORY_SEO } from '../config/seo';
import { LAPTOP_BRANDS } from '../constants/devices';

const LaptopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const LAPTOP_BRAND_ORDER = ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft"];

const sortLaptopBrands = (brandsList) => {
  return [...brandsList].sort((a, b) => {
    const aIndex = LAPTOP_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === a.brand.toLowerCase()
    );
    const bIndex = LAPTOP_BRAND_ORDER.findIndex(
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

export default function LaptopBrandSelectionPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState({});

  const fetchBrands = () => {
    setLoading(true);
    deviceService.getBrands('laptop').then(res => {
      setBrands(sortLaptopBrands(res.data || []));
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
    const b = LAPTOP_BRANDS.find(br => br.name.toLowerCase() === name.toLowerCase());
    return b?.color || '#087F8C';
  };

  const getBrandLogo = (name) => {
    const b = LAPTOP_BRANDS.find(br => br.name.toLowerCase() === name.toLowerCase());
    if (b?.logo) return b.logo;
    const slug = (name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (slug === 'mi') return '/brands/xiaomi.svg';
    return `/brands/${slug}.svg`;
  };

  const handleLogoError = (brandName) => {
    setFailedLogos(prev => ({...prev, [brandName]: true}));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-10 sm:pb-16">
      <CategoryPageSEO
        title={CATEGORY_SEO.laptop.title}
        description={CATEGORY_SEO.laptop.description}
        path={CATEGORY_SEO.laptop.brandPath}
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Laptops' }]}
      />
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Laptops' },
      ]} />

      {/* Section Title */}
      <div className="text-center mb-4 sm:mb-4">
        <span className="inline-block bg-primary-light text-primary text-xs font-bold tracking-wider uppercase px-3.5 py-1 rounded-full mb-3">
          Sell Your Laptop
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary mb-3">Sell Old Laptop — Select Your Brand</h1>
        <p className="text-sm sm:text-base text-text-muted max-w-lg mx-auto leading-relaxed">
          Choose your laptop brand below and get an instant price quote with free doorstep pickup.
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
              to={`/sell-old-laptops/${b.brand.toLowerCase()}`}
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
      {/* Popular Brands */}
      <div className="text-center mt-12 sm:mt-16 mb-6">
        <h2 className="text-lg font-extrabold text-text-primary">Popular Laptop Brands</h2>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 sm:mt-12">
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