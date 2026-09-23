import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import { Tv, Search, ArrowRight, Sparkles } from "lucide-react";

export default function TvModelSelectionPage() {
  const { brand } = useParams();
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "";

  useEffect(() => {
    if (!brand) return;
    deviceService.getModels(brand, "tv")
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
        title={`Sell Old ${brandName} TV Online — Instant Cash | SecondSale`}
        description={`Sell your used ${brandName} television online with SecondSale. Guaranteed highest price, free doorstep unmounting & pickup, and instant cash payment.`}
        canonicalUrl={`https://secondsale.in/sell-tv/${brand}`}
      />

      <Breadcrumb items={[
        { label: "Home", to: "/" },
        { label: "Sell Old TV", to: "/sell-tv/brand" },
        { label: brandName },
      ]} />

      <div className="mt-6 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 border border-blue-200">
          <Tv size={14} />
          {brandName} Televisions
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Select Your {brandName} TV Size
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Select the screen size range of your {brandName} television to begin the instant evaluation.
        </p>

        {/* Search */}
        <div className="relative max-w-md mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${brandName} TV size (e.g., 43", 55", 65")...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs transition"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Tv className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-medium text-slate-600">No {brandName} TV models found</p>
          <button
            onClick={() => setSearch("")}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((m) => (
            <Link
              key={m.slug}
              to={`/sell-tv/${brand.toLowerCase()}/${m.slug}`}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-[#087F8C] flex items-center justify-center transition-colors">
                    <Tv className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Top Value
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#087F8C] transition-colors">
                  {m.modelName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Covers LED, QLED, OLED & Smart Android variations
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Get Upto</span>
                  <span className="text-lg font-extrabold text-[#087F8C]">
                    ₹{m.maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#087F8C] group-hover:translate-x-1 transition-transform">
                  Get Value
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
