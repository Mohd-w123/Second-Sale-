import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import { Watch, Search } from "lucide-react";

export default function SmartwatchModelSelectionPage() {
  const { brand } = useParams();
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "";

  useEffect(() => {
    if (!brand) return;
    deviceService.getModels(brand, "smartwatch")
      .then(res => {
        setModels(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setModels([]);
        setLoading(false);
      });
  }, [brand]);

  const filtered = models.filter(m =>
    m.modelName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-12 sm:pb-20">
      <SEOHead
        title={`Sell Old ${brandName} Smartwatch Online — Instant Cash | SecondSale`}
        description={`Sell your used ${brandName} smartwatch online with SecondSale. Instant quotes, free doorstep pickup, and secure payment across India.`}
        canonicalUrl={`/sell-smartwatch/${brand}`}
      />

      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Smartwatch", href: "/sell-smartwatch/brand" },
        { label: brandName },
      ]} />

      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-blue-100">
          <Watch size={14} />
          {brandName} Smartwatch
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Sell Old {brandName} Smartwatch
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Select your model below to get an accurate buyback price.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-8">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={`Search ${brandName} models...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-xs"
        />
      </div>

      {/* Models Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <Watch size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-base sm:text-lg font-bold text-slate-700 mb-1">No {brandName} smartwatch models found</p>
          <p className="text-xs sm:text-sm text-slate-400">Try a different search term or check another brand</p>
          <Link
            to="/sell-smartwatch/brand"
            className="inline-flex items-center gap-1.5 mt-4 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            ← View All Smartwatch Brands
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map(model => (
            <Link
              key={model.slug}
              to={`/sell-smartwatch/${brand}/${model.slug}`}
              className="group bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 hover:border-blue-500/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-full h-40 sm:h-48 rounded-2xl bg-slate-50 flex items-center justify-center p-4 mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={model.imageUrl || "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ultra-2-black-band-titanium-202409?wid=800&hei=800&fmt=jpeg&qlt=90"}
                  alt={model.modelName}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {model.modelName}
                </h3>
                {model.maxPrice > 0 ? (
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Get up to</span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                      ₹{model.maxPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : (
                  <span className="inline-block mt-2.5 text-xs font-bold text-blue-600">Get Quote →</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
