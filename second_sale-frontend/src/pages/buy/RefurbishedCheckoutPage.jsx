import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Lock,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeft,
  AlertCircle,
  Building2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const PAYMENT_METHODS = [
  {
    id: "cod",
    title: "Cash on Delivery / Pay on Delivery",
    desc: "Inspect package upon delivery and pay via Cash or UPI to courier agent.",
    icon: Banknote,
    badge: "Most Popular",
  },
  {
    id: "upi",
    title: "Direct UPI (PhonePe / GPay / Paytm)",
    desc: "Pay instantly using your preferred UPI app or scan QR code.",
    icon: QrCode,
    badge: "Instant Confirmation",
  },
  {
    id: "netbanking",
    title: "Net Banking / Direct Bank Transfer",
    desc: "Transfer securely via NEFT/IMPS to SecondSale verified escrow account.",
    icon: Building2,
  },
];

export default function RefurbishedCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.item || null;
  const initialPin = item?.pincode || location.state?.initialPincode || "";

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    pincode: initialPin,
    city: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialPin && initialPin.length === 6) {
      lookupPincode(initialPin);
    }
  }, []);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Item Selected</h2>
          <p className="text-slate-600 text-sm mb-6">
            Please select a refurbished device from our catalog to proceed to checkout.
          </p>
          <Link
            to="/buy-refurbished"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Browse Refurbished Devices
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));

    // Auto lookup city for popular pincodes if user types 6 digits
    if (name === "pincode" && value.length === 6) {
      lookupPincode(value);
    }
  };

  const lookupPincode = async (pin) => {
    try {
      const res = await fetch(`${API}/pincodes/check/${pin}`);
      const data = await res.json();
      if (data.city) {
        setCustomer((prev) => ({
          ...prev,
          city: data.city || prev.city,
          state: data.state || prev.state || "Maharashtra",
        }));
      }
    } catch {
      // Graceful fallback
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const rawPostcode = data.address?.postcode || data.display_name?.match(/\b[1-9][0-9]{5}\b/)?.[0];

          if (rawPostcode && rawPostcode.replace(/\D/g, "").length === 6) {
            const cleanPostcode = rawPostcode.replace(/\D/g, "").slice(0, 6);
            setCustomer((prev) => ({
              ...prev,
              pincode: cleanPostcode,
            }));
            await lookupPincode(cleanPostcode);
          } else {
            setError("Could not detect a valid 6-digit pincode from your location. Please enter manually.");
          }
        } catch {
          setError("Error detecting location. Please enter pincode manually.");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setError("Location permission denied or unavailable. Please enter pincode manually.");
        setDetectingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError("");

    // Validate fields
    if (!customer.name.trim()) return setError("Please enter your full name.");
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, "").length < 10) {
      return setError("Please enter a valid 10-digit phone number.");
    }
    if (!customer.email.trim() || !customer.email.includes("@")) {
      return setError("Please enter a valid email address.");
    }
    if (!customer.address.trim()) return setError("Please enter complete delivery address.");
    if (!customer.pincode.trim() || customer.pincode.length !== 6) {
      return setError("Please enter a valid 6-digit delivery pincode.");
    }
    if (!customer.city.trim() || !customer.state.trim()) {
      return setError("Please provide city and state.");
    }

    if (paymentMethod === "upi" && !upiId.trim()) {
      return setError("Please enter your UPI ID (e.g. mobile@upi).");
    }

    try {
      setSubmitting(true);
      const payload = {
        customer,
        item: {
          slug: item.slug,
          conditionGrade: item.grade,
          conditionLabel: item.grade.charAt(0).toUpperCase() + item.grade.slice(1),
          storage: item.storage,
          color: item.color,
          title: item.title,
          brand: item.brand,
          category: item.category,
        },
        payment: {
          method: paymentMethod,
          upiId: paymentMethod === "upi" ? upiId.trim() : undefined,
        },
      };

      const res = await fetch(`${API}/refurbished/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to place order. Please try again.");
      }

      navigate(`/buy-refurbished/order-success/${data.orderId}`, {
        state: { orderId: data.orderId, expectedDate: data.expectedDate, item, customer },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 font-sans">
      {/* Checkout Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to={`/buy-refurbished/product/${item.slug}`}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Product</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Shipping Details */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Flat / House No. / Building / Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat number, Street name, Area"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={customer.landmark}
                    onChange={handleInputChange}
                    placeholder="Near Metro / Behind Mall"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Delivery Pincode <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
                    >
                      {detectingLocation ? (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block" />
                          Detecting...
                        </span>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                          </svg>
                          <span>Use Current Location</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={customer.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customer.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={customer.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Native Payment Options (SecondSale Native Flow) */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>
                  <p className="text-xs text-slate-500">Fast, direct & secure payment options</p>
                </div>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-600"}`} />
                            <span className="text-sm font-bold text-slate-900">{pm.title}</span>
                          </div>
                          {pm.badge && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{pm.desc}</p>

                        {/* Extra input for UPI */}
                        {isSelected && pm.id === "upi" && (
                          <div className="mt-3 pt-3 border-t border-blue-100 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-700">Enter Your UPI ID</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. 9876543210@paytm or username@okaxis"
                              className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-sm"
                            />
                            <p className="text-[11px] text-slate-500">
                              Payment request or QR will be presented on order confirmation.
                            </p>
                          </div>
                        )}

                        {/* Extra instructions for Netbanking */}
                        {isSelected && pm.id === "netbanking" && (
                          <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-slate-600 space-y-1">
                            <p className="font-semibold text-slate-800">
                              Direct Bank Transfer / IMPS / NEFT
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Bank account and reference details will be generated upon placing the order.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                {/* Item Details Card */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=Phone";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 capitalize">
                        {item.grade} Grade
                      </span>
                      {item.storage && (
                        <span className="text-[11px] font-medium text-slate-600">{item.storage}</span>
                      )}
                      {item.color && (
                        <span className="text-[11px] font-medium text-slate-600">• {item.color}</span>
                      )}
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1.5">
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                {/* Assurance points */}
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Included Guarantees</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800">
                    <span>✓ 6 Months Warranty</span>
                    <span>✓ 7 Days Replacement</span>
                    <span>✓ 32-Pt Certified Check</span>
                    <span>✓ Original Accessories</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Original MRP</span>
                    <span className="line-through">₹{(item.originalPrice || item.price).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Refurbished Savings</span>
                    <span>- ₹{Math.max(0, (item.originalPrice || item.price) - item.price).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Express Insured Shipping</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>6 Months Warranty Card</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Total Amount Payable</span>
                    <span className="text-xl font-black text-slate-900">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 transition transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By clicking "Place Order", you agree to SecondSale terms & conditions and warranty policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
