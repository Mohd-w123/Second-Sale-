import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import { EARBUDS_BRANDS } from "../constants/devices";
import { Headphones, Search, Sparkles, ShieldCheck, Zap, Truck } from "lucide-react";

const EARBUDS_BRAND_ORDER = ["Apple", "Samsung", "OnePlus", "boAt", "Sony", "Noise", "Realme", "JBL"];

const sortEarbudsBrands = (brandsList) => {
  return [...brandsList].sort((a, b) => {
    const aIndex = EARBUDS_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === (a.brand || a.name || "").toLowerCase()
    );
    const bIndex = EARBUDS_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === (b.brand || b.name || "").toLowerCase()
    );

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return (a.brand || a.name || "").localeCompare(b.brand || b.name || "");
  });
};

export default function EarbudsBrandSelectionPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState({});

  useEffect(() => {
    deviceService.getBrands("earbuds").then(res => {
      if (res.data && res.data.length > 0) {
        setBrands(sortEarbudsBrands(res.data));
      } else {
        const fallback = EARBUDS_BRANDS.map(b => ({
          brand: b.name,
          modelCount: b.models,
          logo: b.logo,
          color: b.color
        }));
        setBrands(sortEarbudsBrands(fallback));
      }
      setLoading(false);
    }).catch(() => {
      const fallback = EARBUDS_BRANDS.map(b => ({
        brand: b.name,
        modelCount: b.models,
        logo: b.logo,
        color: b.color
      }));
      setBrands(sortEarbudsBrands(fallback));
      setLoading(false);
    });
  }, []);

  const getBrandLogo = (name) => {
    const b = EARBUDS_BRANDS.find(br => br.name.toLowerCase() === name.toLowerCase());
    return b?.logo || null;
  };

  const handleLogoError = (brandName) => {
    setFailedLogos(prev => ({ ...prev, [brandName]: true }));
  };

  const filteredBrands = brands.filter(b =>
    (b.brand || b.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-12 sm:pb-20">
      <SEOHead
        title="Sell Old Earbuds Online — Instant Cash | SecondSale"
        description="Sell used Apple AirPods, Samsung Galaxy Buds, OnePlus, boAt, and Sony earbuds online for the highest price. Free doorstep pickup & instant payment."
        canonicalUrl="/sell-earbuds/brand"
      />

      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Earbuds" },
      ]} />

      {/* Hero Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-3 border border-blue-100">
          <Headphones size={14} />
          Sell Your Earbuds
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Select Your Earbuds <span className="text-blue-600">Brand</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Get an instant cash offer for your used AirPods or wireless earbuds with free doorstep pickup across India.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand (e.g. Apple, Samsung, boAt)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredBrands.map((b) => {
          const brandName = b.brand || b.name;
          const logoUrl = getBrandLogo(brandName);
          const hasFailed = failedLogos[brandName];

          return (
            <Link
              key={brandName}
              to={`/sell-earbuds/${encodeURIComponent(brandName.toLowerCase())}`}
              className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 hover:border-blue-500/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between text-center relative overflow-hidden"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 flex items-center justify-center p-3 sm:p-4 mb-4 group-hover:scale-105 transition-transform">
                {logoUrl && !hasFailed ? (
                  <img
                    src={logoUrl}
                    alt={brandName}
                    onError={() => handleLogoError(brandName)}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <span className="text-xl font-black text-slate-700">
                    {brandName}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {brandName}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {b.modelCount !== undefined ? `${b.modelCount} Models` : "Sell Now"}
                </p>
              </div>

              {b.maxPrice > 0 && (
                <div className="mt-3 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Up to ₹{b.maxPrice.toLocaleString("en-IN")}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-bold">No brands found matching &quot;{search}&quot;</p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 pt-10">
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Instant Online Valuation</h4>
            <p className="text-xs text-slate-400">Get fair cash value in seconds</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Free Doorstep Pickup</h4>
            <p className="text-xs text-slate-400">Scheduled at your convenience</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Direct Bank / UPI Pay</h4>
            <p className="text-xs text-slate-400">Money transferred on the spot</p>
          </div>
        </div>
      </div>
    </div>
  );
}
