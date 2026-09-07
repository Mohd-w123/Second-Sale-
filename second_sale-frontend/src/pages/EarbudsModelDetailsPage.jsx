import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import PincodeBox from "../components/PincodeBox";
import { Headphones, ShieldCheck, Zap, Truck, Star, ArrowRight, CheckCircle2 } from "lucide-react";

export default function EarbudsModelDetailsPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);

  const brandName = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "";

  useEffect(() => {
    if (!slug) return;
    deviceService.getDevice(slug)
      .then(res => {
        setDevice(res.data);
        if (res.data?.variants?.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!device) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <Headphones size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Device Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">We couldn&apos;t find this earbuds model in our catalog.</p>
        <Link
          to="/sell-earbuds/brand"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm"
        >
          Browse All Brands
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Earbuds", href: "/sell-earbuds/brand" },
    { label: brandName, href: `/sell-earbuds/${brand}` },
    { label: device.modelName },
  ];

  const handleStartQuiz = () => {
    const storageParam = selectedVariant?.storage ? `?storage=${encodeURIComponent(selectedVariant.storage)}` : "";
    navigate(`/sell-earbuds/${brand}/${slug}/quiz${storageParam}`);
  };

  const maxPrice = selectedVariant?.basePrice || Math.max(...(device.variants?.map(v => v.basePrice) || [0]));

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-12 sm:pb-20">
      <SEOHead
        title={`Sell Old ${device.modelName} Online — Instant Cash Quote | SecondSale`}
        description={`Sell your used ${device.modelName} online for the highest cash price. Get an instant quote, free doorstep pickup, and instant bank/UPI payment with SecondSale.`}
        canonicalUrl={`/sell-earbuds/${brand}/${slug}`}
      />

      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-center mt-6">
        {/* Left: Device Image & Tagline */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="w-full h-64 sm:h-80 rounded-3xl bg-slate-50 flex items-center justify-center p-6 mb-6 border border-slate-100/80">
            <img
              src={device.imageUrl || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90"}
              alt={device.modelName}
              className="max-h-full max-w-full object-contain filter drop-shadow-md"
            />
          </div>

          <div className="flex items-center gap-1.5 text-amber-400 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
            <span className="text-xs font-bold text-slate-500 ml-1.5">4.9 / 5 (3,400+ reviews)</span>
          </div>

          <p className="text-base sm:text-lg font-black text-slate-900 leading-snug max-w-sm">
            Convert your old <span className="text-blue-600">{device.modelName}</span> into instant cash with SecondSale.
          </p>
        </div>

        {/* Right: Valuation Box & Action */}
        <div className="flex-1 w-full flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit mb-3 border border-blue-100">
            <Headphones size={13} />
            {brandName}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {device.modelName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            {device.description || `Sell your ${device.modelName} online with free doorstep evaluation and instant payment.`}
          </p>

          {/* Variant Selector if multiple */}
          {device.variants && device.variants.length > 1 && (
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Select Edition / Variant
              </label>
              <div className="flex flex-wrap gap-2.5">
                {device.variants.map((v) => {
                  const isSelected = selectedVariant?.storage === v.storage;
                  return (
                    <button
                      key={v.storage}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {v.storage}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Maximum Buyback Value
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                ₹{maxPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Best Market Price
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              * Exact cash value calculated based on your earbuds condition & accessories.
            </p>
          </div>

          {/* Pincode Availability Check */}
          <div className="mb-6">
            <PincodeBox onVerificationChange={setIsPincodeVerified} />
          </div>

          {/* Start Selling Button */}
          <button
            type="button"
            onClick={handleStartQuiz}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Get Exact Value</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Trust Highlights */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <Zap size={18} className="text-blue-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Instant Cash</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck size={18} className="text-emerald-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Free Pickup</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={18} className="text-amber-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Safe &amp; Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
