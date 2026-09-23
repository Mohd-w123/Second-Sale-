import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deviceService } from "../services/device.service";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader from "../components/ui/Loader";
import SEOHead from "../components/seo/SEOHead";
import PincodeBox from "../components/PincodeBox";
import { Tv, ShieldCheck, Zap, Truck, Star, ArrowRight, CheckCircle2 } from "lucide-react";

export default function TvModelDetailsPage() {
  const { brand, slug } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Tv size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Television Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">We couldn&apos;t find this television model in our catalog.</p>
        <Link
          to="/sell-tv/brand"
          className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-bold rounded-2xl text-sm transition"
        >
          Browse All TV Brands
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Sell Old TV", to: "/sell-tv/brand" },
    { label: brandName, to: `/sell-tv/${brand}` },
    { label: device.modelName },
  ];

  const handleStartQuiz = () => {
    navigate(`/sell-tv/${brand}/${slug}/quiz`);
  };

  const maxPrice = selectedVariant?.basePrice || 15000;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-5 sm:pt-8 pb-12 sm:pb-20">
      <SEOHead
        title={`Sell Used ${device.modelName} Online — Instant Valuation | SecondSale`}
        description={`Sell your old ${device.modelName} online with SecondSale. Get up to ₹${maxPrice.toLocaleString('en-IN')} with free doorstep unmounting, inspection, and spot payment.`}
        canonicalUrl={`https://secondsale.in/sell-tv/${brand}/${slug}`}
      />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Device Image & Badges */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-56 h-48 sm:w-64 sm:h-56 bg-slate-50 rounded-2xl flex items-center justify-center p-6 border border-slate-100 mb-6">
            <Tv className="w-28 h-28 text-slate-700" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6F7] text-[#087F8C] text-xs font-bold border border-[#087F8C]/20 mb-2">
            <Star size={13} className="fill-[#087F8C] text-[#087F8C]" />
            Cashify Trade-in Verified
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {device.modelName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Covers LCD, LED, QLED & OLED Display Panels
          </p>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 flex items-center justify-around text-left">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Doorstep Pickup</span>
              <span className="text-xs font-bold text-slate-800">Free in 24h</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Payment</span>
              <span className="text-xs font-bold text-[#087F8C]">Spot UPI / Bank</span>
            </div>
          </div>
        </div>

        {/* Right: Value Box & Evaluation Action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Estimated Resale Value
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#116466] tracking-tight">
                    Get Upto ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Final price is calculated dynamically based on panel tech (OLED/LED), resolution, and condition.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] flex-shrink-0" />
                <span>Safe technician unmounting from wall</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] flex-shrink-0" />
                <span>Supports missing remote or stand</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] flex-shrink-0" />
                <span>Best price guarantee for OLED & 4K</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] flex-shrink-0" />
                <span>Zero transport or inspection fees</span>
              </div>
            </div>

            {/* Pincode check */}
            <div className="pt-2 pb-6 border-t border-slate-100">
              <PincodeBox />
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartQuiz}
              className="w-full py-4 btn-gradient text-white font-extrabold rounded-2xl shadow-lg hover:shadow-[#087F8C]/25 transition-all duration-200 flex items-center justify-center gap-2 text-base active:scale-[0.99] cursor-pointer"
            >
              Get Exact Value
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2.5">
              Takes just 60 seconds — Answer 4 quick questions about display and condition
            </p>
          </div>

          {/* Three Assurance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-center">
              <Zap className="w-5 h-5 text-[#087F8C] mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Instant Quote</span>
              <span className="text-[10px] text-slate-500">Live AI Valuation</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-center">
              <Truck className="w-5 h-5 text-[#087F8C] mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Doorstep Pickup</span>
              <span className="text-[10px] text-slate-500">Free unmounting</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-center">
              <ShieldCheck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-900 block">Spot Payment</span>
              <span className="text-[10px] text-slate-500">UPI / Bank transfer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
