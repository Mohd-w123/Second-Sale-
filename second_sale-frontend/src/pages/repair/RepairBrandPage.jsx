import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { REPAIR_BRANDS, getRepairBrand, getRepairModels } from '../../data/repairData';
import { Search, ChevronRight } from 'lucide-react';

export default function RepairBrandPage() {
  const { brand: brandSlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [imgErrors, setImgErrors] = useState({});

  const initialBrand = getRepairBrand(brandSlug);
  const initialModels = getRepairModels(brandSlug);

  const [brand, setBrand] = useState(initialBrand);
  const [models, setModels] = useState(initialModels);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      document.title = `${brand.name} Repair & Replacement | SecondSale`;
    }
  }, [brand]);

  // Fetch live dynamic models from backend
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    setLoading(true);

    fetch(`${API_BASE}/repairs/models?brandSlug=${brandSlug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setModels(data);
        }
      })
      .catch(err => console.warn('Using default repair models for brand:', err))
      .finally(() => setLoading(false));

    // Fetch dynamic brand metadata (logo, name, color)
    fetch(`${API_BASE}/repairs/brands`)
      .then(res => res.json())
      .then(brandsData => {
        if (Array.isArray(brandsData)) {
          const match = brandsData.find(b => b.slug === brandSlug || b.id === brandSlug);
          if (match) {
            setBrand(match);
          }
        }
      })
      .catch(err => console.warn('Could not fetch brand logo:', err));
  }, [brandSlug]);

  // Extract unique series for this brand
  const seriesList = useMemo(() => {
    const set = new Set();
    models.forEach(m => {
      if (m.series && m.series.trim()) set.add(m.series.trim());
    });
    return Array.from(set);
  }, [models]);

  // Filter models by selected series and search
  const filtered = useMemo(() => {
    return models.filter(m => {
      const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
      const matchesSeries = selectedSeries === 'All' || m.series === selectedSeries;
      return matchesSearch && matchesSeries;
    });
  }, [models, search, selectedSeries]);

  if (!brand && models.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Brand Not Found</h2>
        <p className="text-gray-500 text-sm">We don't have repair models for this brand yet.</p>
        <Link to="/repair" className="text-[#087F8C] font-semibold text-sm hover:underline">
          ← Back to Repair
        </Link>
      </div>
    );
  }

  const brandDisplayName = brand?.name || (brandSlug ? brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1) : 'Phone');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        
        {/* Top Header Row (matching Cashify) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            {brand?.logo && (
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/90 shadow-xs p-2 flex items-center justify-center flex-shrink-0">
                <img
                  src={brand.logo}
                  alt={brandDisplayName}
                  className="w-full h-full object-contain"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {brandDisplayName} Repair &amp; Replacement
              </h1>
              
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-gray-400 mt-1.5 font-medium">
                <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
                <span>&gt;</span>
                <Link to="/repair" className="hover:text-gray-700 transition-colors">Repair Mobile Phone</Link>
                <span>&gt;</span>
                <span className="text-gray-700">{brandDisplayName}</span>
              </nav>
            </div>
          </div>

          {/* Search Model Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Model"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#087F8C] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Select Series Section ─────────────────────────────────── */}
        {seriesList.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-bold text-gray-800">Select Series</h2>
              {selectedSeries !== 'All' && (
                <button
                  onClick={() => setSelectedSeries('All')}
                  className="text-xs text-[#087F8C] font-semibold hover:underline cursor-pointer"
                >
                  Show All Series
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar flex-wrap">
              <button
                onClick={() => setSelectedSeries('All')}
                className={`px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSeries === 'All'
                    ? 'bg-[#087F8C] text-white shadow-sm'
                    : 'bg-[#F2F4F7] hover:bg-gray-200 text-gray-800'
                }`}
              >
                All Series
              </button>

              {seriesList.map(seriesName => (
                <button
                  key={seriesName}
                  onClick={() => setSelectedSeries(prev => prev === seriesName ? 'All' : seriesName)}
                  className={`px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSeries === seriesName
                      ? 'bg-[#087F8C] text-white shadow-sm font-bold'
                      : 'bg-[#F2F4F7] hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {seriesName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Select Model Section ──────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">Select Model</h2>
            <span className="text-xs text-gray-400 font-medium">{filtered.length} Models</span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-400">Loading {brandDisplayName} models...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-sm font-bold text-gray-600">No models found for "{search}"</p>
              <button
                onClick={() => { setSearch(''); setSelectedSeries('All'); }}
                className="mt-3 text-xs font-bold text-[#087F8C] hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {filtered.map(model => (
                <Link
                  key={model.id || model.slug}
                  to={`/repair/${brandSlug}/${model.id || model.slug}`}
                  className="group bg-white border border-gray-200/90 rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:border-[#087F8C] hover:shadow-md transition-all duration-200 cursor-pointer min-h-[190px] no-underline"
                >
                  {/* Phone Image */}
                  <div className="w-full h-28 sm:h-32 flex items-center justify-center p-1 overflow-hidden">
                    {!imgErrors[model.id || model.slug] ? (
                      <img
                        src={model.image}
                        alt={model.name}
                        className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgErrors(p => ({ ...p, [model.id || model.slug]: true }))}
                      />
                    ) : (
                      <div className="text-4xl text-gray-300">📱</div>
                    )}
                  </div>

                  {/* Model Name */}
                  <div className="w-full pt-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#087F8C] transition-colors line-clamp-2 leading-tight">
                      {model.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Other Brands Strip ────────────────────────────────────── */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Check Other Brands</h3>
            <Link to="/repair" className="text-xs font-bold text-[#087F8C] hover:underline">
              All Brands &gt;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {REPAIR_BRANDS.filter(b => b.slug !== brandSlug).map(b => (
              <Link
                key={b.id || b.slug}
                to={`/repair/${b.slug}`}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all no-underline"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
