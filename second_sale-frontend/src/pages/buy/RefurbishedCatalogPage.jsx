import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Shield, Truck, Zap, RotateCcw, Sparkles } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  { id: "", label: "All Devices" },
  { id: "mobile", label: "Phones" },
  { id: "laptop", label: "Laptops" },
  { id: "tablet", label: "Tablets" },
  { id: "smartwatch", label: "Smartwatches" },
  { id: "console", label: "Gaming Consoles" },
];

const BRANDS = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Dell", "HP", "Lenovo", "Sony", "Microsoft"];

const GRADES = [
  { id: "superb", label: "Superb", desc: "Flawless — Looks like brand new. 0 visible scratches.", icon: "S" },
  { id: "veryGood", label: "Very Good", desc: "Minor cosmetic micro-marks. Functionally perfect.", icon: "V" },
  { id: "good", label: "Good", desc: "Light signs of regular use. Heavily discounted.", icon: "G" },
];

const SORT_OPTIONS = [
  { id: "", label: "Most Popular" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest First" },
];

const PRICE_BRACKETS = [
  { label: "Under Rs.15,000", min: 0, max: 15000 },
  { label: "Rs.15,000 - Rs.30,000", min: 15000, max: 30000 },
  { label: "Rs.30,000 - Rs.50,000", min: 30000, max: 50000 },
  { label: "Rs.50,000+", min: 50000, max: 999999 },
];

const GRADE_STYLES = {
  superb: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "Superb" },
  veryGood: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", label: "Very Good" },
  good: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", label: "Good" },
};

function getBestGrade(conditionGrades) {
  for (const key of ["superb", "veryGood", "good"]) {
    if (conditionGrades?.[key]?.stock > 0) return { key, ...conditionGrades[key] };
  }
  return null;
}

function DeviceCard({ device }) {
  const grade = getBestGrade(device.conditionGrades);
  if (!grade) return null;
  const discount = Math.round(((grade.originalPrice - grade.price) / grade.originalPrice) * 100);
  const gs = GRADE_STYLES[grade.key] || GRADE_STYLES.good;
  return (
    <Link to={`/buy-refurbished/product/${device.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden no-underline">
      <div className="relative bg-slate-50 flex items-center justify-center h-48 sm:h-52 overflow-hidden px-4 pt-4 pb-2">
        {discount >= 20 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow">{discount}% OFF</div>
        )}
        <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${gs.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${gs.dot}`} />{gs.label}
        </div>
        <img src={device.images?.[0]} alt={device.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy" onError={e => { e.target.style.display = "none"; }} />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{device.brand}</p>
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{device.modelName}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex items-center gap-0.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <Star size={11} fill="#10b981" stroke="none" />
            <span className="text-[11px] font-bold text-emerald-700">{device.rating}</span>
          </div>
          <span className="text-[11px] text-slate-400">({(device.reviewCount || 0).toLocaleString()} reviews)</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-900">Rs.{(grade.price || 0).toLocaleString("en-IN")}</span>
          <span className="text-xs text-slate-400 line-through">Rs.{(grade.originalPrice || 0).toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 text-[10px] font-bold text-slate-500">
          <span className="flex items-center gap-1"><Shield size={11} className="text-emerald-500" />{device.warrantyMonths}M Warranty</span>
          <span className="flex items-center gap-1"><RotateCcw size={11} className="text-blue-500" />7D Replace</span>
          <span className="flex items-center gap-1"><Truck size={11} className="text-purple-500" />Free Ship</span>
        </div>
        <div className="mt-3 w-full py-2.5 rounded-xl text-sm font-extrabold bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-transparent transition-all duration-300 text-center">
          View Details
        </div>
      </div>
    </Link>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-bold text-slate-800 mb-3 hover:text-blue-600 cursor-pointer border-none bg-transparent p-0">
        {title}{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children}
    </div>
  );
}

function Filters({ selectedGrade, setSelectedGrade, selectedPriceBracket, setSelectedPriceBracket, selectedBrands, toggleBrand, setPage }) {
  return (
    <div>
      <FilterSection title="Condition Grade">
        <div className="space-y-2">
          {GRADES.map(g => (
            <button key={g.id} type="button"
              onClick={() => { setSelectedGrade(selectedGrade === g.id ? "" : g.id); setPage(1); }}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer ${selectedGrade === g.id ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200 hover:border-slate-300"}`}>
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${selectedGrade === g.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>{g.icon}</div>
              <div>
                <p className="text-sm font-bold text-slate-800">{g.label}</p>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{g.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Price Range">
        <div className="space-y-2">
          {PRICE_BRACKETS.map((b, i) => (
            <button key={i} type="button"
              onClick={() => { setSelectedPriceBracket(selectedPriceBracket?.label === b.label ? null : b); setPage(1); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold text-left cursor-pointer ${selectedPriceBracket?.label === b.label ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedPriceBracket?.label === b.label ? "border-blue-600" : "border-slate-300"}`}>
                {selectedPriceBracket?.label === b.label && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </span>
              {b.label}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Brand">
        <div className="space-y-2">
          {BRANDS.map(b => (
            <button key={b} type="button" onClick={() => toggleBrand(b)}
              className="flex items-center gap-2.5 w-full text-sm cursor-pointer border-none bg-transparent p-0 hover:text-blue-600 py-0.5">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedBrands.includes(b) ? "bg-[#2563EB] border-[#2563EB]" : "border-slate-300"}`}>
                {selectedBrands.includes(b) && <span className="text-white text-[10px] font-black">v</span>}
              </div>
              <span className={selectedBrands.includes(b) ? "font-bold text-blue-600" : "text-slate-600"}>{b}</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export default function RefurbishedCatalogPage() {
  const [searchParams] = useSearchParams();
  const [devices, setDevices] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedPriceBracket, setSelectedPriceBracket] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCat) params.set("category", selectedCat);
      if (selectedBrands.length === 1) params.set("brand", selectedBrands[0]);
      if (selectedGrade) params.set("grade", selectedGrade);
      if (selectedPriceBracket) { params.set("minPrice", selectedPriceBracket.min); params.set("maxPrice", selectedPriceBracket.max); }
      if (sortBy) params.set("sort", sortBy);
      if (searchText.trim()) params.set("search", searchText.trim());
      params.set("page", page); params.set("limit", 24);
      const res = await fetch(`${API}/refurbished?${params.toString()}`);
      const data = await res.json();
      setDevices(data.devices || []); setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [selectedCat, selectedBrands, selectedGrade, selectedPriceBracket, sortBy, searchText, page]);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const toggleBrand = b => { setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]); setPage(1); };
  const clearFilters = () => { setSelectedCat(""); setSelectedBrands([]); setSelectedGrade(""); setSelectedPriceBracket(null); setSortBy(""); setSearchText(""); setPage(1); };
  const activeFilterCount = [selectedCat, selectedGrade, selectedPriceBracket].filter(Boolean).length + selectedBrands.length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-[#0F2D5B] via-[#1e3a6e] to-[#0F2D5B] text-white py-3">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-xs font-bold">
          {[
            [<Shield size={14} className="text-emerald-400" />, "6 Months Warranty"],
            [<RotateCcw size={14} className="text-blue-400" />, "7 Days Replacement"],
            [<Truck size={14} className="text-purple-400" />, "Free Delivery"],
            [<Zap size={14} className="text-amber-400" />, "Up to 60% Off MRP"],
            [<Sparkles size={14} className="text-rose-400" />, "32-Point Quality Check"],
          ].map(([icon, text], i) => <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">{icon} {text}</span>)}
        </div>
      </div>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Shield size={13} /> 100% Quality Certified Refurbished Devices
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2D5B] leading-tight mb-2">Buy Refurbished Devices</h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
            Premium pre-owned phones, laptops, tablets and consoles tested and certified. Up to 60% off MRP with 6-month warranty and 7-day free replacement.
          </p>
        </div>
      </div>
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.map(cat => (
              <button key={cat.id} type="button" onClick={() => { setSelectedCat(cat.id); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer border ${selectedCat === cat.id ? "bg-[#2563EB] text-white border-[#2563EB] shadow" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 sticky top-[120px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-blue-600" />
                  Filters {activeFilterCount > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                </h3>
                {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="text-xs text-rose-500 font-bold cursor-pointer border-none bg-transparent">Clear All</button>}
              </div>
              <Filters selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} selectedPriceBracket={selectedPriceBracket} setSelectedPriceBracket={setSelectedPriceBracket} selectedBrands={selectedBrands} toggleBrand={toggleBrand} setPage={setPage} />
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchText} onChange={e => { setSearchText(e.target.value); setPage(1); }}
                  placeholder="Search devices (e.g. iPhone 14, MacBook Air)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 outline-none focus:border-[#2563EB] cursor-pointer">
                {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <button type="button" onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold cursor-pointer">
                <SlidersHorizontal size={16} className="text-blue-600" />
                Filters {activeFilterCount > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-black">{activeFilterCount}</span>}
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4 font-medium">{loading ? "Loading devices..." : `${pagination.total} refurbished devices found`}</p>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                    <div className="bg-slate-100 h-48" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-3 bg-slate-100 rounded w-16" /><div className="h-4 bg-slate-100 rounded w-full" /><div className="h-5 bg-slate-100 rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : devices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Search size={28} className="text-slate-300" /></div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Devices Found</h3>
                <p className="text-sm text-slate-400 mb-4">Try adjusting your filters or search term.</p>
                <button type="button" onClick={clearFilters} className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-bold cursor-pointer border-none hover:bg-[#1D4ED8]">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {devices.map(device => <DeviceCard key={device._id} device={device} />)}
                </div>
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {[...Array(Math.min(pagination.pages, 10))].map((_, i) => (
                      <button key={i} type="button" onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-10 h-10 rounded-xl text-sm font-bold cursor-pointer border ${page === i + 1 ? "bg-[#2563EB] text-white border-[#2563EB] shadow" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="w-80 bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><SlidersHorizontal size={16} className="text-blue-600" />Filters</h3>
              <button type="button" onClick={() => setFiltersOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer border-none bg-transparent"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-5">
              {activeFilterCount > 0 && <button type="button" onClick={() => { clearFilters(); setFiltersOpen(false); }} className="w-full mb-4 py-2 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold bg-rose-50 cursor-pointer hover:bg-rose-100">Clear All Filters</button>}
              <Filters selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} selectedPriceBracket={selectedPriceBracket} setSelectedPriceBracket={setSelectedPriceBracket} selectedBrands={selectedBrands} toggleBrand={toggleBrand} setPage={setPage} />
            </div>
            <div className="p-5 border-t border-slate-100">
              <button type="button" onClick={() => setFiltersOpen(false)} className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm cursor-pointer border-none hover:bg-[#1D4ED8]">Show {devices.length} Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
