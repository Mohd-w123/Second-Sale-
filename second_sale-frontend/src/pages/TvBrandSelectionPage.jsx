import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import { Tv, Search, ShieldCheck, Zap, Truck } from "lucide-react";

export const TV_BRANDS_CONFIG = [
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", color: "#1428a0" },
  { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg", color: "#a50034" },
  { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg", color: "#000000" },
  { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg", color: "#ff6700" },
  { name: "OnePlus", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_pos.svg", color: "#eb0028" },
  { name: "TCL", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/TCL_Technology_Logo.svg", color: "#e2001a" },
  { name: "Vu", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Vu_Televisions_Logo.png", color: "#111111" },
  { name: "Haier", logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Haier_logo.svg", color: "#005aab" },
  { name: "Motorola", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Motorola_new_logo.svg", color: "#00142e" },
  { name: "Sansui", logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Sansui_logo.svg", color: "#d90000" },
];

const TV_BRAND_ORDER = ["Samsung", "LG", "Sony", "Xiaomi", "OnePlus", "TCL", "Vu", "Haier", "Motorola", "Sansui"];

const sortBrands = (brandsList) => {
  return [...brandsList].sort((a, b) => {
    const aIndex = TV_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === (a.brand || a.name || "").toLowerCase()
    );
    const bIndex = TV_BRAND_ORDER.findIndex(
      name => name.toLowerCase() === (b.brand || b.name || "").toLowerCase()
    );

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return (a.brand || a.name || "").localeCompare(b.brand || b.name || "");
  });
};

export default function TvBrandSelectionPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState({});

  useEffect(() => {
    deviceService.getBrands("tv").then(res => {
      if (res.data && res.data.length > 0) {
        setBrands(sortBrands(res.data));
      } else {
        const fallback = TV_BRANDS_CONFIG.map(b => ({
          brand: b.name,
          modelCount: 7,
          logo: b.logo,
          color: b.color
        }));
        setBrands(sortBrands(fallback));
      }
      setLoading(false);
    }).catch(() => {
      const fallback = TV_BRANDS_CONFIG.map(b => ({
        brand: b.name,
        modelCount: 7,
        logo: b.logo,
        color: b.color
      }));
      setBrands(sortBrands(fallback));
      setLoading(false);
    });
  }, []);

  const getBrandLogo = (name) => {
    const b = TV_BRANDS_CONFIG.find(br => br.name.toLowerCase() === name.toLowerCase());
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
        title="Sell Old Television Online — Instant Cash & Free Doorstep Pickup | SecondSale"
        description="Sell your used Samsung, LG, Sony, Mi, OnePlus, and smart LED TVs online for the highest price. Instant doorstep evaluation and spot cash payment."
        canonicalUrl="https://secondsale.in/sell-tv/brand"
      />

      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Sell Old Television" }]} />

      {/* Hero Header */}
      <div className="text-center mt-6 mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
          <Tv className="w-3.5 h-3.5" />
          Cashify-Accurate Instant TV Valuation
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your TV Brand
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-lg mx-auto">
          Choose the manufacturer of your smart television to get an accurate price quote and free doorstep evaluation.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search TV brand (e.g., Samsung, LG, Sony)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs transition"
          />
        </div>
      </div>

      {/* Brand Grid */}
      {filteredBrands.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Tv className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-medium text-slate-600">No TV brands found matching &ldquo;{search}&rdquo;</p>
          <button
            onClick={() => setSearch("")}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {filteredBrands.map((b) => {
            const brandName = b.brand || b.name;
            const logoUrl = getBrandLogo(brandName);
            const isFailed = failedLogos[brandName];

            return (
              <Link
                key={brandName}
                to={`/sell-tv/${brandName.toLowerCase()}`}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center text-center overflow-hidden hover:-translate-y-1"
              >
                <div className="w-20 h-16 sm:w-24 sm:h-20 flex items-center justify-center mb-3 p-2">
                  {logoUrl && !isFailed ? (
                    <img
                      src={logoUrl}
                      alt={`${brandName} logo`}
                      className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                      onError={() => handleLogoError(brandName)}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl">
                      {brandName.charAt(0)}
                    </div>
                  )}
                </div>

                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {brandName}
                </span>

                {b.maxPrice ? (
                  <span className="text-[11px] font-medium text-slate-400 mt-1">
                    Upto ₹{b.maxPrice.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 mt-1">
                    {b.modelCount || 7} Sizes Available
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Selling Value Props */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Instant AI Valuation</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Get an accurate, market-best quote based on panel type, size, and display condition.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Free Doorstep Pickup</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Our certified technicians come to your home to safely unmount and inspect the TV.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">On-the-Spot Payment</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Immediate payment transfer to your UPI or bank account right at your doorstep before handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
