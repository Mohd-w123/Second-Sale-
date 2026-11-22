import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import Breadcrumb from '../components/ui/Breadcrumb';
import Loader from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { CategoryPageSEO } from '../components/seo/DevicePageSEO';
import {
  getBrandSeriesConfig,
  findSeries,
} from '../utils/brandSeries';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

export default function ModelSelectionPage() {
  const { brand, seriesSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const rawBrand = decodeURIComponent(brand || '');
  const brandName = models[0]?.brand || (rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1));

  useEffect(() => {
    setLoading(true);
    deviceService.getModels(brand, 'mobile').then(res => {
      setModels(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [brand]);

  // Brand Series Config matching Cashify
  const seriesConfig = useMemo(() => getBrandSeriesConfig(brand), [brand]);

  // Compute available series and counts
  const availableSeries = useMemo(() => {
    if (!seriesConfig || !models.length) return [];
    return seriesConfig.series.map(s => {
      const count = models.filter(m => s.pattern.test(m.modelName)).length;
      return { ...s, count };
    }).filter(s => s.count > 0);
  }, [seriesConfig, models]);

  // Resolve currently active series from route param or search query param
  const activeSeriesQuery = seriesSlug || searchParams.get('series') || '';
  const activeSeries = useMemo(() => {
    if (!activeSeriesQuery || !seriesConfig) return null;
    return findSeries(brand, activeSeriesQuery);
  }, [brand, activeSeriesQuery, seriesConfig]);

  // Handle series selection switch
  const handleSelectSeries = (seriesItem) => {
    setSearch('');
    if (!seriesItem) {
      if (seriesSlug) {
        navigate(`/sell-old-mobile-phones/${brand}`);
      } else {
        setSearchParams({});
      }
    } else {
      if (seriesSlug) {
        navigate(`/sell-old-mobile-phones/${brand}/series/${seriesItem.id}`);
      } else {
        setSearchParams({ series: seriesItem.id });
      }
    }
  };

  // Filter models by active series and search query
  const filtered = useMemo(() => {
    let result = models;
    if (activeSeries) {
      result = result.filter(m => activeSeries.pattern.test(m.modelName));
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(m => m.modelName.toLowerCase().includes(q));
    }
    return result;
  }, [models, activeSeries, search]);

  if (loading) return <Loader />;

  const path = activeSeries
    ? `/sell-old-mobile-phones/${brand}?series=${activeSeries.id}`
    : `/sell-old-mobile-phones/${brand}`;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Mobile Phones', href: '/sell-old-mobile-phones/brand' },
  ];

  if (activeSeries) {
    breadcrumbItems.push({ label: brandName, href: `/sell-old-mobile-phones/${brand}` });
    breadcrumbItems.push({ label: activeSeries.name });
  } else {
    breadcrumbItems.push({ label: brandName });
  }

  const pageTitle = activeSeries
    ? `Sell Old ${brandName} ${activeSeries.name} Online — Instant Cash`
    : `Sell Old ${brandName} Phones Online — Instant Cash`;

  const pageDescription = activeSeries
    ? `Sell your used ${brandName} ${activeSeries.name} phone online with SecondSale. Get instant quotes, free doorstep pickup, and secure payment across India.`
    : `Sell your used ${brandName} phone online with SecondSale. Get instant quotes, free doorstep pickup, and secure payment across India.`;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <CategoryPageSEO
        title={pageTitle}
        description={pageDescription}
        path={path}
        breadcrumbItems={breadcrumbItems}
      />
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Title (Following Cashify: "Sell Old <Brand> Mobile Phone") */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">
          Sell Old {brandName} Mobile Phone
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select your series or model below to get an instant valuation and free doorstep pickup.
        </p>
      </div>

      {/* 1. SELECT SERIES (Following Cashify: Grid of Series Tiles) */}
      {availableSeries.length > 0 && (
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Select Series</span>
              <span className="text-xs font-semibold text-slate-400">({availableSeries.length} series available)</span>
            </h2>
            {activeSeries && (
              <button
                type="button"
                onClick={() => handleSelectSeries(null)}
                className="text-xs font-bold text-[#087F8C] hover:underline cursor-pointer"
              >
                Clear Series Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {/* "All Models" tile */}
            <button
              type="button"
              onClick={() => handleSelectSeries(null)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                !activeSeries
                  ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-sm scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <span className="truncate">All Models</span>
              <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                !activeSeries ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>
                {models.length}
              </span>
            </button>

            {/* Series tiles */}
            {availableSeries.map(s => {
              const isSelected = activeSeries?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSeries(s)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-left ${
                    isSelected
                      ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-sm scale-[1.01]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {s.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SELECT MODEL (Following Cashify: Search + Models Grid) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Select Model
            </h2>
            {activeSeries && (
              <span className="text-xs font-bold text-[#087F8C] bg-[#E8F6F7] px-2.5 py-0.5 rounded-full">
                {activeSeries.name} ({filtered.length})
              </span>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder={
                activeSeries
                  ? `Search in ${activeSeries.name}...`
                  : `Search ${brandName} models...`
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15 outline-none transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Models Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted bg-white rounded-2xl border border-slate-100 p-8">
            <p className="text-lg font-semibold mb-2 text-slate-800">No models found</p>
            <p className="text-sm text-slate-500 mb-4">
              {search
                ? `No models matching "${search}"${activeSeries ? ` in ${activeSeries.name}` : ''}.`
                : `No models currently listed in this series.`}
            </p>
            {activeSeries && (
              <button
                type="button"
                onClick={() => handleSelectSeries(null)}
                className="px-4 py-2 bg-[#E8F6F7] text-[#087F8C] rounded-xl text-xs font-bold hover:bg-[#087F8C] hover:text-white transition cursor-pointer"
              >
                Search across all {brandName} models ({models.length})
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map(model => (
              <Link
                key={model.slug}
                to={`/sell-old-mobile-phones/${brand}/${model.slug}`}
                className="group bg-white rounded-2xl border border-border p-4 sm:p-5 transition-all duration-200 hover:border-[#087F8C] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(8,127,140,0.15)] no-underline flex flex-col"
              >
                {/* Image Container */}
                <div className="bg-gray-50 rounded-xl h-28 sm:h-36 flex items-center justify-center mb-4 group-hover:bg-[#E8F6F7] transition-colors">
                  {model.imageUrl ? (
                    <img src={model.imageUrl} alt={model.modelName} className="h-24 sm:h-28 object-contain" />
                  ) : (
                    <PhoneIcon />
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1 leading-tight">{model.modelName}</h3>
                <p className="text-xs text-text-muted mb-3">Upto {formatCurrency(model.maxPrice)}</p>

                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F8C] bg-[#E8F6F7] px-3 py-1.5 rounded-lg group-hover:bg-[#087F8C] group-hover:text-white transition-colors">
                    Get Quote →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
