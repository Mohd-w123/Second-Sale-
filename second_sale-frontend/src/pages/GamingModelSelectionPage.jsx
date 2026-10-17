import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import { Gamepad2, Search } from "lucide-react";

export default function GamingModelSelectionPage() {
  const { brand } = useParams();
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("All");
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState({});

  const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "";

  useEffect(() => {
    if (!brand) return;
    setLoading(true);
    deviceService.getModels(brand, "gaming")
      .then(res => {
        setModels(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setModels([]);
        setLoading(false);
      });
  }, [brand]);

  // Extract series available for this console brand and sort canonically (matches Cashify)
  const availableSeries = useMemo(() => {
    const set = new Set();
    models.forEach(m => {
      if (m.series) set.add(m.series.trim());
    });
    const list = Array.from(set).filter(Boolean);

    const sonyOrder = [
      "PlayStation 3 Series",
      "PlayStation 4 Series",
      "PlayStation 5 Series"
    ];
    const microsoftOrder = [
      "Xbox 360 Series",
      "Xbox One Series",
      "Xbox Series"
    ];
    const nintendoOrder = [
      "Nintendo Switch Series"
    ];

    const targetOrder = brand?.toLowerCase() === "sony"
      ? sonyOrder
      : (brand?.toLowerCase() === "microsoft" ? microsoftOrder : (brand?.toLowerCase() === "nintendo" ? nintendoOrder : []));

    if (targetOrder.length > 0) {
      return list.sort((a, b) => {
        const ai = targetOrder.indexOf(a);
        const bi = targetOrder.indexOf(b);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return a.localeCompare(b);
      });
    }
    return list.sort((a, b) => a.localeCompare(b));
  }, [models, brand]);

  // Filter models by selectedSeries and search query
  const filtered = useMemo(() => {
    return models.filter(m => {
      const matchesSearch = !search || m.modelName.toLowerCase().includes(search.toLowerCase());
      const matchesSeries = selectedSeries === "All" || (m.series && m.series.trim() === selectedSeries);
      return matchesSearch && matchesSeries;
    });
  }, [models, search, selectedSeries]);

  const handleImageError = (slug) => {
    setFailedImages(prev => ({ ...prev, [slug]: true }));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-12 sm:pb-20">
      <SEOHead
        title={`Sell Old ${brandName} Gaming Console Online — Instant Cash | SecondSale`}
        description={`Sell your used ${brandName} console online with SecondSale. Instant quotes, free doorstep pickup, and secure payment across India.`}
        canonicalUrl={`/sell-gaming/${brand}`}
      />

      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Gaming Console", href: "/sell-gaming/brand" },
        { label: brandName },
      ]} />

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 bg-[#E8F6F7] text-[#087F8C] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-[#087F8C]/20">
          <Gamepad2 size={14} />
          {brandName} Consoles
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Sell Old {brandName} Console
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Select your model below to get an accurate buyback price.
        </p>
      </div>

      {/* ── Select Series Section (Matches Cashify Flow) ────────────────── */}
      {availableSeries.length > 0 && (
        <div className="mb-8 bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              Select Series
            </h2>
            {selectedSeries !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedSeries("All")}
                className="text-xs text-[#087F8C] font-bold hover:underline cursor-pointer bg-transparent border-none"
              >
                Show All Series
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedSeries("All")}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border-none ${
                selectedSeries === "All"
                  ? "bg-[#087F8C] text-white shadow-xs font-bold"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              All Series
            </button>
            {availableSeries.map(seriesName => (
              <button
                key={seriesName}
                type="button"
                onClick={() => setSelectedSeries(prev => prev === seriesName ? "All" : seriesName)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border-none ${
                  selectedSeries === seriesName
                    ? "bg-[#087F8C] text-white shadow-xs font-bold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {seriesName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Select Model Header with Integrated Search ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Select Model
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {filtered.length} {filtered.length === 1 ? "model" : "models"} available {selectedSeries !== "All" ? `in ${selectedSeries}` : ""}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Select Model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/20 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* ── Models Grid ──────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <Gamepad2 size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-base sm:text-lg font-bold text-slate-700 mb-1">
            No {brandName} console models found
          </p>
          <p className="text-xs sm:text-sm text-slate-400">
            {selectedSeries !== "All" ? `Try selecting "All Series" or a different search term` : "Try a different search term"}
          </p>
          {selectedSeries !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedSeries("All")}
              className="inline-flex items-center gap-1.5 mt-4 text-xs sm:text-sm font-bold text-[#087F8C] hover:underline bg-transparent border-none cursor-pointer"
            >
              Reset to All Series
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map(model => (
            <Link
              key={model.slug}
              to={`/sell-gaming/${brand}/${model.slug}`}
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-[#087F8C]/40 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left no-underline"
            >
              <div className="w-full h-36 sm:h-44 rounded-xl bg-slate-50 flex items-center justify-center p-3 mb-3 group-hover:bg-[#E8F6F7]/50 transition-colors overflow-hidden">
                {!failedImages[model.slug] && model.imageUrl ? (
                  <img
                    src={model.imageUrl}
                    alt={model.modelName}
                    onError={() => handleImageError(model.slug)}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Gamepad2 size={24} />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#087F8C] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                  {model.modelName}
                </h3>
                {model.maxPrice > 0 ? (
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Get up to</span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                      ₹{model.maxPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : (
                  <span className="inline-block mt-2 text-xs font-bold text-[#087F8C]">Get Quote →</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
