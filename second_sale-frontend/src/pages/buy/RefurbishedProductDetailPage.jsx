import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PincodeBox from "../../components/PincodeBox";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Battery,
  Cpu,
  Camera,
  Smartphone,
  Check,
  AlertCircle,
  HelpCircle,
  Package,
  MapPin,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const GRADE_INFO = {
  superb: {
    label: "Superb",
    subtitle: "Like New Condition",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    dot: "bg-emerald-500",
    scratches: "0 visible scratches or dents. Flawless body & screen.",
    hardware: "100% genuine parts, untouched internals, battery >85%",
    recommendation: "Best for those who want a brand new feel at a fraction of the cost.",
  },
  veryGood: {
    label: "Very Good",
    subtitle: "Minimal Signs of Use",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
    scratches: "1-2 microscopic marks not visible from 12 inches away.",
    hardware: "100% factory tested, certified parts, battery >82%",
    recommendation: "Our most popular choice — incredible value with near-pristine aesthetics.",
  },
  good: {
    label: "Good",
    subtitle: "Value for Money",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
    scratches: "Visible micro-scratches on back or bezel. Screen has 0 cracks.",
    hardware: "Fully functional & 32-point verified, battery >80%",
    recommendation: "Maximum savings on a fully inspected, premium certified device.",
  },
};

const INSPECTION_POINTS = [
  {
    title: "Battery & Charging",
    icon: Battery,
    desc: "Health verified >80%, fast-charging circuitry tested, no heating abnormalities",
  },
  {
    title: "Display & Touch",
    icon: Smartphone,
    desc: "Original OEM certified glass, 100% touch responsiveness, 0 dead pixels",
  },
  {
    title: "Cameras & Sensors",
    icon: Camera,
    desc: "Multi-lens focus, OIS, selfie camera, Face ID / biometrics verified",
  },
  {
    title: "Core Performance",
    icon: Cpu,
    desc: "Chipset benchmarked, RAM/ROM stress-tested, clean factory OS reset",
  },
];

export default function RefurbishedProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected Options
  const [selectedGrade, setSelectedGrade] = useState("superb");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Pincode Check
  const pincodeBoxRef = useRef(null);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const handlePincodeVerified = (isServiceable, targetCode, info) => {
    if (isServiceable && targetCode) {
      setPincode(targetCode);
      setPincodeStatus({
        valid: true,
        city: info?.city || "",
        state: info?.state || "",
        message: `Serviceable: Express delivery available in 2-4 business days${info?.city ? " to " + info.city : ""}. Cash / Pay on Delivery eligible!`,
      });
    } else {
      setPincode("");
      setPincodeStatus(null);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDevice();
  }, [slug]);

  const fetchDevice = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/refurbished/${slug}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load device details");
      }
      const d = data.data || data;
      setDevice(d);

      // Pick first available grade
      if (d.conditionGrades) {
        const availableGrade = ["superb", "veryGood", "good"].find(
          (g) => d.conditionGrades[g]?.stock > 0
        );
        if (availableGrade) setSelectedGrade(availableGrade);
      }

      // Pick default variants
      if (d.variants && d.variants.length > 0) {
        setSelectedStorage(d.variants[0].storage || "");
        setSelectedColor(d.variants[0].color || "");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading certified refurbished device...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Device Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">{error || "This refurbished device is currently out of stock."}</p>
          <Link
            to="/buy-refurbished"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Browse All Refurbished Devices
          </Link>
        </div>
      </div>
    );
  }

  const currentGradeData = device.conditionGrades?.[selectedGrade] || {};
  const currentPrice = currentGradeData.price || device.baseRefurbishedPrice || 0;
  const originalPrice = currentGradeData.originalPrice || device.originalPrice || currentPrice;
  const discountAmount = originalPrice - currentPrice;
  const discountPercent = Math.max(0, Math.round((discountAmount / originalPrice) * 100));

  // Extract unique storages and colors
  const storages = [...new Set((device.variants || []).map((v) => v.storage).filter(Boolean))];
  const colors = [...new Set((device.variants || []).map((v) => v.color).filter(Boolean))];

  const isBuyEnabled = pincode.trim().length === 6 && pincodeStatus?.valid === true;

  const handleBuyNow = () => {
    if (!isBuyEnabled) {
      pincodeBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      pincodeBoxRef.current?.focus?.();
      return;
    }
    const buyItem = {
      deviceId: device._id,
      slug: device.slug,
      title: device.title,
      image: device.images?.[0] || "",
      brand: device.brand,
      category: device.category,
      grade: selectedGrade,
      storage: selectedStorage,
      color: selectedColor,
      price: currentPrice,
      originalPrice,
      warrantyMonths: device.warrantyMonths || 6,
      pincode: pincode.trim(),
    };
    navigate("/buy-refurbished/checkout", { state: { item: buyItem, initialPincode: pincode.trim() } });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to="/buy-refurbished" className="hover:text-blue-600 transition">Buy Refurbished</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to={`/buy-refurbished?category=${device.category}`} className="capitalize hover:text-blue-600 transition">
            {device.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <span className="text-slate-800 font-medium truncate max-w-xs">{device.title}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery & Quality Guarantees */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              {/* Image Preview Box */}
              <div className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex items-center justify-center min-h-[360px] sm:min-h-[440px] shadow-sm overflow-hidden group">
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
                    {discountPercent}% OFF
                  </div>
                )}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>32-Pt Inspected</span>
                </div>

                <img
                  src={device.images?.[activeImgIndex] || device.images?.[0]}
                  alt={device.title}
                  className="max-h-[340px] sm:max-h-[400px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400?text=Device+Image";
                  }}
                />
              </div>

              {/* Thumbnails if multiple images */}
              {device.images?.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {device.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIndex(i)}
                      className={`w-18 h-18 rounded-2xl border-2 p-1.5 bg-white flex items-center justify-center transition overflow-hidden flex-shrink-0 ${
                        activeImgIndex === i ? "border-blue-600 shadow-md" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col items-center text-center p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">6 Months</span>
                  <span className="text-[11px] text-slate-500">Comprehensive Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 border-x border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">7 Days</span>
                  <span className="text-[11px] text-slate-500">Replacement Guarantee</span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Free Express</span>
                  <span className="text-[11px] text-slate-500">Insured Shipping</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Variant Selector, Pricing & Checkout */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Header / Titles */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Brand: <span className="font-bold text-slate-900">{device.brand}</span>
                </span>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.8 / 5</span>
                  <span className="text-slate-400 font-normal">(180+ verified buyers)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {device.title}
              </h1>

              {/* Live Price Tag */}
              <div className="flex flex-wrap items-baseline gap-3 pt-1 border-t border-slate-100 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {originalPrice > currentPrice && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      Save ₹{discountAmount.toLocaleString("en-IN")} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500">Inclusive of all taxes & 6 Months Warranty certificate</p>
            </div>

            {/* Condition Grade Selector (Cashify Style) */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Choose Cosmetic Condition</h3>
                  <p className="text-xs text-slate-500">Each condition grade is 100% functional and tested.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold cursor-pointer">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Grading Guide</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["superb", "veryGood", "good"].map((gradeKey) => {
                  const gradeData = device.conditionGrades?.[gradeKey];
                  const info = GRADE_INFO[gradeKey];
                  const isSelected = selectedGrade === gradeKey;
                  const isAvailable = (gradeData?.stock || 0) > 0;

                  return (
                    <button
                      key={gradeKey}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedGrade(gradeKey)}
                      className={`relative flex flex-col p-4 rounded-2xl text-left border-2 transition-all ${
                        !isAvailable
                          ? "border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed"
                          : isSelected
                          ? "border-blue-600 bg-blue-50/40 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-sm text-slate-900">{info.label}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 mb-2">{info.subtitle}</span>
                      <div className="mt-auto pt-2 border-t border-slate-100">
                        {isAvailable ? (
                          <span className="text-base font-bold text-slate-900">
                            ₹{(gradeData?.price || currentPrice).toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-xs text-rose-500 font-bold">Out of stock</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Grade Explanation Banner */}
              {GRADE_INFO[selectedGrade] && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5 text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className={`w-2 h-2 rounded-full ${GRADE_INFO[selectedGrade].dot}`} />
                    <span>{GRADE_INFO[selectedGrade].label} Condition Assurance:</span>
                  </div>
                  <p className="text-slate-600 pl-4">{GRADE_INFO[selectedGrade].scratches}</p>
                  <p className="text-slate-600 pl-4">{GRADE_INFO[selectedGrade].hardware}</p>
                </div>
              )}
            </div>

            {/* Storage & Color Options */}
            {(storages.length > 0 || colors.length > 0) && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                {storages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                      Select Storage Capacity
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {storages.map((storage) => (
                        <button
                          key={storage}
                          type="button"
                          onClick={() => setSelectedStorage(storage)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                            selectedStorage === storage
                              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {storage}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                      Select Color Variant: <span className="text-slate-800 font-bold">{selectedColor}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {colors.map((color) => {
                        const variantMatch = (device.variants || []).find((v) => v.color === color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                              selectedColor === color
                                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                              style={{ backgroundColor: variantMatch?.colorHex || "#475569" }}
                            />
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pincode Delivery Check */}
            <PincodeBox
              ref={pincodeBoxRef}
              title="Check Delivery & Pay on Delivery Eligibility"
              subtitle="Please enter your 6-digit delivery pincode to verify shipping availability & Pay on Delivery eligibility before buying."
              placeholder="Enter 6-digit Pincode (e.g. 400001)"
              isMandatory={true}
              showMandatoryBadge={true}
              icon={<MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              serviceText="Express delivery in 2-4 business days. Cash / Pay on Delivery eligible!"
              onVerified={handlePincodeVerified}
            />

            {/* CTA Buy Buttons */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={!isBuyEnabled}
                  onClick={handleBuyNow}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-extrabold text-base transition-all duration-300 ${
                    isBuyEnabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 active:scale-98 cursor-pointer"
                      : "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed"
                  }`}
                >
                  {isBuyEnabled ? (
                    <>
                      <Zap className="w-5 h-5 fill-current" />
                      <span>Buy Now — ₹{currentPrice.toLocaleString("en-IN")}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span>Check Delivery Eligibility to Buy Now</span>
                    </>
                  )}
                </button>
              </div>
              {!isBuyEnabled && (
                <p className="text-[11px] text-center text-rose-700 font-semibold bg-rose-50 py-2 px-3 rounded-xl border border-rose-200">
                  * Check Delivery &amp; Pay on Delivery Eligibility is mandatory before you can proceed to Buy Now.
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Cash / Pay on Delivery
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Direct UPI & Net Banking
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> 7-Day Replacement
                </span>
              </div>
            </div>

            {/* Cashify 32-Point Quality Inspection Section */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">SecondSale 32-Point Quality Check</h3>
                  <p className="text-xs text-slate-500">Every device undergoes rigorous hardware diagnostics before dispatch.</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {INSPECTION_POINTS.map((pt, i) => {
                  const Icon = pt.icon;
                  return (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{pt.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{pt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In The Box Details */}
            {device.inTheBox && device.inTheBox.length > 0 && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">What's In The Box?</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {device.inTheBox.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specifications */}
            {device.specs && (Array.isArray(device.specs) ? device.specs.length > 0 : Object.keys(device.specs).length > 0) && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Key Technical Specifications</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {Array.isArray(device.specs)
                    ? device.specs.map((item, i) => (
                        <div key={i} className="py-2 flex justify-between gap-4">
                          <span className="text-slate-500 font-medium capitalize">
                            {item.key || item.name || `Spec ${i + 1}`}
                          </span>
                          <span className="text-slate-900 font-semibold text-right">
                            {typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value ?? "")}
                          </span>
                        </div>
                      ))
                    : Object.entries(device.specs).map(([k, v]) => (
                        <div key={k} className="py-2 flex justify-between gap-4">
                          <span className="text-slate-500 font-medium capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                          <span className="text-slate-900 font-semibold text-right">
                            {typeof v === "object" ? (v?.value || JSON.stringify(v)) : String(v ?? "")}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
