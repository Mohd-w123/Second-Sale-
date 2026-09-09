import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Calendar,
  MapPin,
  ArrowRight,
  Printer,
  Copy,
  Check,
  Smartphone,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function RefurbishedOrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/refurbished/order/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        // Fallback to state if fetch fails
        if (location.state?.item) {
          setOrder({
            orderId,
            customer: location.state.customer,
            item: location.state.item,
            deliveryDetails: { expectedDate: location.state.expectedDate },
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch {
      if (location.state?.item) {
        setOrder({
          orderId,
          customer: location.state.customer,
          item: location.state.item,
          deliveryDetails: { expectedDate: location.state.expectedDate },
          createdAt: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  const orderData = order || location.state || {};
  const customer = orderData.customer || {};
  const item = orderData.item || {};
  const delivery = orderData.deliveryDetails || {};

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed & Certified
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Thank You for Ordering!
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Your certified refurbished device order has been placed. Our technicians are preparing your device for quality dispatch.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-xs text-slate-500 font-medium">Order Reference:</span>
            <span className="text-sm font-black text-slate-900 tracking-wider font-mono">{orderId}</span>
            <button
              onClick={copyOrderId}
              className="p-1 hover:bg-slate-200 rounded-lg text-slate-600 transition"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tracking & Timeline Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Estimated Delivery Date</h2>
              <p className="text-xs text-slate-500">Tracked Express Insured Courier</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{delivery.expectedDate || "Within 3-5 Business Days"}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col sm:flex-row justify-between gap-4 pt-2">
            {[
              { label: "Order Placed", desc: "Just now", status: "done" },
              { label: "32-Point Verified", desc: "Diagnostics check", status: "active" },
              { label: "Packed in Box", desc: "Eco-secure packaging", status: "pending" },
              { label: "Dispatched", desc: "Express courier partner", status: "pending" },
              { label: "Delivered", desc: "Doorstep handover", status: "pending" },
            ].map((step, idx) => (
              <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === "done"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : step.status === "active"
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step.status === "done" ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{step.label}</h4>
                  <p className="text-[10px] text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Item Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Device Summary</span>
            </h3>

            <div className="flex gap-4 items-center">
              {item.image && (
                <div className="w-18 h-18 bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
                  <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 capitalize">
                    {item.conditionGrade || item.grade || "Superb"} Grade
                  </span>
                  {item.storage && <span className="text-slate-500">{item.storage}</span>}
                  {item.color && <span className="text-slate-500">• {item.color}</span>}
                </div>
                <div className="text-base font-black text-slate-900 mt-1">
                  ₹{Number(item.price || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Includes 6 Months Free Warranty & 7 Days Replacement</span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Delivery Details</span>
            </h3>

            <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
              <p className="font-bold text-slate-900 text-sm">{customer.name || "Customer"}</p>
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
              <p className="text-slate-600 pt-1">
                {customer.address}
                {customer.landmark ? `, Landmark: ${customer.landmark}` : ""}
              </p>
              <p className="font-medium text-slate-900">
                {customer.city}, {customer.state} - {customer.pincode}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-bold text-slate-900 uppercase">
                {orderData.payment?.method || "Pay on Delivery (COD)"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/buy-refurbished"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition"
          >
            <span>Browse More Devices</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
