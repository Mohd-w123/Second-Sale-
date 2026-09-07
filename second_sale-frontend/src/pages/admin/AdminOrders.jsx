import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import {
  Search, ChevronLeft, ChevronRight, X, MapPin, Smartphone, User,
  Calendar, CreditCard, Tv, Phone, CheckCircle2, AlertCircle,
  Trash2, ExternalLink, Eye, Image as ImageIcon, Sparkles, Filter
} from "lucide-react";
import "./admin.css";

const ORDER_STATUSES = [
  "placed", 
  "scheduled", 
  "assigned", 
  "picked", 
  "verified", 
  "payment_initiated", 
  "completed", 
  "cancelled"
];

const TV_STATUSES = [
  "new",
  "contacted",
  "quote_sent",
  "pickup_scheduled",
  "completed",
  "cancelled"
];

/* ── Order Detail Modal (Device Orders) ──────────────────────────────── */
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  const d = order.device || {};
  const p = order.pickup || {};
  const pb = order.priceBreakdown || {};

  const InfoRow = ({ label, value }) =>
    value ? (
      <div className="flex justify-between items-start gap-4 py-2 border-b border-slate-50 last:border-0">
        <span className="text-[11px] font-700 text-slate-400 uppercase tracking-wide shrink-0">{label}</span>
        <span className="text-[13px] font-semibold text-slate-800 text-right">{value}</span>
      </div>
    ) : null;

  const Section = ({ icon: Icon, title, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={14} className="text-blue-600" />
        </div>
        <span className="text-[12px] font-800 text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="bg-slate-50 rounded-xl px-4 py-1">
        {children}
      </div>
    </div>
  );

  const formatList = (arr) => Array.isArray(arr) && arr.length > 0 ? arr.map(s => s.replace(/_/g, " ")).join(", ") : null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <h3>Order Details</h3>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontWeight: 600, fontFamily: "monospace" }}>
              {order.orderId}
            </p>
          </div>
          <button className="admin-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">

          {/* Customer Info */}
          <Section icon={User} title="Customer Information">
            <InfoRow label="Name" value={order.userId?.name || p.name || "N/A"} />
            <InfoRow label="Phone" value={order.userId?.phone || p.phone || "N/A"} />
            <InfoRow label="Email" value={order.userId?.email || p.email || "N/A"} />
          </Section>

          {/* Pickup Address */}
          <Section icon={MapPin} title="Pickup Address">
            <InfoRow label="Address" value={p.address} />
            <InfoRow label="Landmark" value={p.landmark} />
            <InfoRow label="City" value={p.city} />
            <InfoRow label="State" value={p.state} />
            <InfoRow label="Pincode" value={p.pincode} />
            <InfoRow label="Pickup Date" value={p.date} />
            <InfoRow label="Time Slot" value={p.timeSlot} />
            <InfoRow label="Payment Mode" value={p.paymentMethod} />
          </Section>

          {/* Device / Product Details */}
          <Section icon={Smartphone} title="Product Details">
            <InfoRow label="Category" value={d.category} />
            <InfoRow label="Brand" value={d.brand} />
            <InfoRow label="Model" value={d.modelName} />
            <InfoRow label="Storage" value={d.storage} />
            {d.ram && <InfoRow label="RAM" value={d.ram} />}
            {d.processor && <InfoRow label="Processor" value={d.processor} />}
            {d.generation && <InfoRow label="Generation" value={d.generation} />}
            {d.graphicsCard && <InfoRow label="GPU" value={d.graphicsCard} />}
            {d.screenSize && <InfoRow label="Screen Size" value={d.screenSize} />}
            {d.storageType && <InfoRow label="Storage Type" value={d.storageType} />}
            {d.yearOfPurchase && <InfoRow label="Year of Purchase" value={d.yearOfPurchase} />}
            {d.deviceAge && <InfoRow label="Device Age" value={d.deviceAge} />}
            {d.batteryHealth && <InfoRow label="Battery Health" value={d.batteryHealth} />}
            {d.screenCondition && <InfoRow label="Screen Condition" value={d.screenCondition} />}
            {d.bodyCondition && <InfoRow label="Body Condition" value={d.bodyCondition} />}
            <InfoRow label="Touchscreen Working" value={d.isTouchScreenWorking === true ? "Yes" : d.isTouchScreenWorking === false ? "No" : null} />
            <InfoRow label="Screen Original" value={d.isScreenOriginal === true ? "Yes" : d.isScreenOriginal === false ? "No" : null} />
            <InfoRow label="Under Warranty" value={d.underWarranty === true ? "Yes" : d.underWarranty === false ? "No" : null} />
            <InfoRow label="Has GST Bill" value={d.hasGSTBill === true ? "Yes" : d.hasGSTBill === false ? "No" : null} />
            <InfoRow label="Able to Make Calls" value={d.ableToMakeCalls === true ? "Yes" : d.ableToMakeCalls === false ? "No" : null} />
            <InfoRow label="Physical Issues" value={formatList(d.physicalIssues)} />
            <InfoRow label="Technical Issues" value={formatList(d.technicalIssues)} />
            <InfoRow label="Functional Issues" value={formatList(d.functionalIssues)} />
            <InfoRow label="Accessories" value={Array.isArray(d.accessories) ? formatList(d.accessories) : d.accessories} />
          </Section>

          {/* Pricing */}
          <Section icon={CreditCard} title="Pricing Breakdown">
            <InfoRow label="Base Price" value={pb.basePrice ? `₹${pb.basePrice}` : null} />
            {pb.ageAdjustment !== 0 && <InfoRow label="Age Adjustment" value={`₹${pb.ageAdjustment}`} />}
            {pb.conditionAdjustment !== 0 && <InfoRow label="Condition Adjustment" value={`₹${pb.conditionAdjustment}`} />}
            {pb.screenAdjustment !== 0 && <InfoRow label="Screen Adjustment" value={`₹${pb.screenAdjustment}`} />}
            {pb.functionalDeduction !== 0 && <InfoRow label="Functional Deduction" value={`-₹${Math.abs(pb.functionalDeduction)}`} />}
            {pb.batteryDeduction !== 0 && <InfoRow label="Battery Deduction" value={`-₹${Math.abs(pb.batteryDeduction)}`} />}
            {pb.accessoriesBonus !== 0 && <InfoRow label="Accessories Bonus" value={`+₹${pb.accessoriesBonus}`} />}
            <div className="flex justify-between items-center py-3 mt-1 border-t-2 border-blue-100">
              <span className="text-[12px] font-800 text-blue-700 uppercase tracking-wider">Final Price Offered</span>
              <span className="text-[18px] font-900 text-blue-700">₹{pb.finalPrice || 0}</span>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

/* ── TV Lead Detail & Edit Modal ────────────────────────────────────── */
function TvLeadDetailModal({ lead, onClose, onUpdate, onDelete }) {
  if (!lead) return null;

  const [status, setStatus] = useState(lead.status || "new");
  const [offeredPrice, setOfferedPrice] = useState(lead.offeredPrice || "");
  const [adminNotes, setAdminNotes] = useState(lead.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(lead._id, {
        status,
        offeredPrice: offeredPrice === "" ? 0 : Number(offeredPrice),
        adminNotes,
      });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save lead updates");
    } finally {
      setSaving(false);
    }
  };

  const c = lead.customer || {};
  const photos = lead.photos || {};

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 740 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Tv size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">TV Callback & Quote Request</h3>
              <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">{lead.leadId}</p>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="admin-modal-body space-y-6">

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-800 text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={13} className="text-blue-600" /> Customer Information
                </span>
                <a
                  href={`tel:${c.phone}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Phone size={11} /> Call Now
                </a>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="font-bold text-slate-900">{c.name || "Customer"}</div>
                <div className="font-mono text-xs text-slate-600">{c.phone}</div>
                {(c.city || c.pincode) && (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    {c.city} {c.pincode ? `(${c.pincode})` : ""}
                  </div>
                )}
                {c.address && (
                  <div className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-2">
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">Address</span>
                    {c.address}
                  </div>
                )}
              </div>
            </div>

            {/* TV Specs Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <span className="text-[11px] font-800 text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Tv size={13} className="text-blue-600" /> TV Specifications
              </span>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Brand:</span>
                  <span className="font-bold text-slate-900">{lead.brand} {lead.customBrand && `(${lead.customBrand})`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Screen Size:</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">{lead.screenSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Display Type:</span>
                  <span className="font-semibold text-slate-800 text-xs">{lead.tvType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Declared Condition:</span>
                  <span className="font-bold text-xs capitalize text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    {lead.condition}
                  </span>
                </div>
                {lead.additionalNotes && (
                  <div className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-2">
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">User Notes:</span>
                    {lead.additionalNotes}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 4 Photos Inspection Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-800 text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={13} className="text-blue-600" /> Uploaded TV Photos (4 Angles)
              </span>
              <span className="text-[11px] text-slate-400">Click any photo to view full image</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "front", label: "Front Screen" },
                { key: "left",  label: "Left Side" },
                { key: "right", label: "Right Side" },
                { key: "back",  label: "Back / Ports" },
              ].map(pos => {
                const url = photos[pos.key];
                return (
                  <div
                    key={pos.key}
                    onClick={() => url && setActivePhoto({ url, label: pos.label })}
                    className={`border rounded-xl p-2 text-center transition-all ${
                      url
                        ? "cursor-pointer hover:border-blue-500 hover:shadow-md bg-white border-slate-200"
                        : "bg-slate-50 border-dashed border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="h-28 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center mb-1.5">
                      {url ? (
                        <img src={url} alt={pos.label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">No image</div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 block">{pos.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lightbox / Expanded Photo Overlay */}
          {activePhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
              onClick={() => setActivePhoto(null)}
            >
              <div className="relative max-w-3xl max-h-[85vh] flex flex-col items-center">
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute -top-10 right-0 text-white hover:text-slate-300 font-bold flex items-center gap-1 text-sm"
                >
                  <X size={18} /> Close
                </button>
                <img
                  src={activePhoto.url}
                  alt={activePhoto.label}
                  className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
                />
                <div className="text-white text-xs font-bold mt-2 tracking-wide bg-slate-900/80 px-3 py-1 rounded-full">
                  {activePhoto.label} Angle
                </div>
              </div>
            </div>
          )}

          {/* Admin Actions: Status, Quote Offer & Notes */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-800 text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" /> Admin Quote Actions & Follow-up
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Lead Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="admin-select w-full"
                >
                  {TV_STATUSES.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Offered Trade-in Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    placeholder="e.g. 18500"
                    className="admin-search pl-7 w-full font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Internal Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add customer communication notes, pickup instructions, inspection findings..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-blue-100/80">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to permanently delete lead ${lead.leadId}?`)) {
                    onDelete(lead._id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 size={14} /> Delete Lead
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="admin-btn-primary text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                {saving ? "Saving..." : "Save Quote Updates"}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Main Orders & TV Quote Requests Manager ─────────────────────────── */
export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState("devices"); // "devices" | "tv"

  // ── Device Orders State ───────────────────────
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ── TV Leads State ────────────────────────────
  const [tvLeads, setTvLeads] = useState([]);
  const [tvTotal, setTvTotal] = useState(0);
  const [tvPage, setTvPage] = useState(1);
  const [tvTotalPages, setTvTotalPages] = useState(1);
  const [tvSearch, setTvSearch] = useState("");
  const [tvDebouncedSearch, setTvDebouncedSearch] = useState("");
  const [tvStatus, setTvStatus] = useState("");
  const [tvLoading, setTvLoading] = useState(false);
  const [tvCounts, setTvCounts] = useState({ total: 0, new: 0 });
  const [selectedTvLead, setSelectedTvLead] = useState(null);

  // Debounce Device Orders Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Debounce TV Leads Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setTvDebouncedSearch(tvSearch);
      setTvPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [tvSearch]);

  // Fetch Device Orders
  const fetchOrders = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;

    adminService.getOrders(params)
      .then((res) => {
        setOrders(res.data.orders);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders", err);
        setLoading(false);
      });
  };

  // Fetch TV Leads
  const fetchTvLeads = () => {
    setTvLoading(true);
    const params = { page: tvPage, limit: 10 };
    if (tvDebouncedSearch) params.search = tvDebouncedSearch;
    if (tvStatus) params.status = tvStatus;

    adminService.getTvLeads(params)
      .then((res) => {
        setTvLeads(res.data.leads || []);
        setTvTotal(res.data.total || 0);
        setTvTotalPages(res.data.totalPages || 1);
        if (res.data.counts) setTvCounts(res.data.counts);
        setTvLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load TV leads", err);
        setTvLoading(false);
      });
  };

  useEffect(() => {
    if (activeTab === "devices") {
      fetchOrders();
    }
  }, [debouncedSearch, status, page, activeTab]);

  useEffect(() => {
    if (activeTab === "tv") {
      fetchTvLeads();
    }
  }, [tvDebouncedSearch, tvStatus, tvPage, activeTab]);

  // Initial fetch for TV counts to display badge
  useEffect(() => {
    adminService.getTvLeads({ limit: 1 })
      .then((res) => {
        if (res.data?.counts) setTvCounts(res.data.counts);
      })
      .catch(() => {});
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTvLeadUpdate = async (id, data) => {
    const res = await adminService.updateTvLeadStatus(id, data);
    setTvLeads(prev => prev.map(l => l._id === id ? res.data : l));
  };

  const handleTvLeadDelete = async (id) => {
    try {
      await adminService.deleteTvLead(id);
      setTvLeads(prev => prev.filter(l => l._id !== id));
      setTvTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lead");
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case "completed": return "admin-badge admin-badge-green";
      case "cancelled": return "admin-badge admin-badge-red";
      case "placed": return "admin-badge admin-badge-blue";
      case "scheduled": return "admin-badge admin-badge-purple";
      case "verified": return "admin-badge admin-badge-blue";
      case "payment_initiated": return "admin-badge admin-badge-yellow";
      default: return "admin-badge admin-badge-gray";
    }
  };

  const getTvBadgeClass = (s) => {
    switch (s) {
      case "new": return "admin-badge admin-badge-yellow";
      case "contacted": return "admin-badge admin-badge-blue";
      case "quote_sent": return "admin-badge admin-badge-purple";
      case "pickup_scheduled": return "admin-badge admin-badge-indigo";
      case "completed": return "admin-badge admin-badge-green";
      case "cancelled": return "admin-badge admin-badge-red";
      default: return "admin-badge admin-badge-gray";
    }
  };

  return (
    <div className="space-y-6">

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("devices")}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "devices"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Smartphone size={16} />
          <span>Device Orders (Phones, Laptops, Tablets)</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
            activeTab === "devices" ? "bg-blue-800 text-blue-100" : "bg-slate-200 text-slate-700"
          }`}>
            {total}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("tv")}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "tv"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Tv size={16} />
          <span>TV Quote Requests</span>
          {tvCounts.new > 0 ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full font-black bg-amber-500 text-slate-950 animate-pulse">
              {tvCounts.new} NEW
            </span>
          ) : (
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === "tv" ? "bg-blue-800 text-blue-100" : "bg-slate-200 text-slate-700"
            }`}>
              {tvCounts.total || 0}
            </span>
          )}
        </button>
      </div>

      {/* ── TAB 1: DEVICE ORDERS ────────────────────────────────────── */}
      {activeTab === "devices" && (
        <div className="space-y-6">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  className="admin-search pl-10"
                  placeholder="Search ID, brand or model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>

              <select
                className="admin-select"
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              >
                <option value="">All Statuses</option>
                {ORDER_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="text-sm font-semibold text-slate-500">
              Total Orders: <span className="text-slate-900 font-bold">{total}</span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-table-wrapper">
            {loading ? (
              <div className="p-12 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 admin-skeleton w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                No system orders found.
              </div>
            ) : (
              <>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User Contact</th>
                      <th>Device Specifications</th>
                      <th>Pricing Offered</th>
                      <th>Ordered At</th>
                      <th>Current Status</th>
                      <th>View Details</th>
                      <th className="text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="font-mono text-xs text-blue-600 font-bold">{order.orderId}</span>
                        </td>
                        <td>
                          {order.userId ? (
                            <div>
                              <div className="font-bold text-slate-900">{order.userId.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{order.userId.phone}</div>
                              <div className="text-[10px] text-slate-400">{order.userId.email}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Guest / Deleted User</span>
                          )}
                        </td>
                        <td>
                          <div>
                            <div className="font-bold text-slate-900">{order.device.brand} {order.device.modelName}</div>
                            <div className="text-[10px] text-slate-400 font-semibold capitalize">
                              {order.device.storage} {order.device.ram && `/ ${order.device.ram}`} {order.device.generation && `(${order.device.generation})`}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="font-bold text-slate-900">₹{order.priceBreakdown?.finalPrice || 0}</div>
                          <div className="text-[9px] text-slate-400">Base: ₹{order.priceBreakdown?.basePrice || 0}</div>
                        </td>
                        <td className="text-xs">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "5px 12px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              background: "#EFF6FF",
                              color: "#2563EB",
                              border: "1px solid #BFDBFE",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <MapPin size={12} /> View Details
                          </button>
                        </td>
                        <td className="text-right">
                          <select
                            className="admin-select text-xs py-1 px-2.5"
                            disabled={updatingId === order._id}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            {ORDER_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="admin-pagination">
                  <div className="admin-pagination-info">
                    Page {page} of {totalPages}
                  </div>
                  <div className="admin-pagination-btns">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="admin-pagination-btn"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="admin-pagination-btn"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: TV QUOTE REQUESTS ─────────────────────────────────── */}
      {activeTab === "tv" && (
        <div className="space-y-6">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  className="admin-search pl-10"
                  placeholder="Search Lead ID, Brand, Customer or Phone..."
                  value={tvSearch}
                  onChange={(e) => setTvSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>

              <select
                className="admin-select"
                value={tvStatus}
                onChange={(e) => { setTvStatus(e.target.value); setTvPage(1); }}
              >
                <option value="">All Statuses ({tvCounts.total || 0})</option>
                {TV_STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ").toUpperCase()} {tvCounts[s] ? `(${tvCounts[s]})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm font-semibold text-slate-500">
              Total TV Leads: <span className="text-slate-900 font-bold">{tvTotal}</span>
            </div>
          </div>

          {/* TV Leads Table */}
          <div className="admin-table-wrapper">
            {tvLoading ? (
              <div className="p-12 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 admin-skeleton w-full" />
                ))}
              </div>
            ) : tvLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Tv size={36} className="mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">No TV trade-in callback requests found.</p>
                <p className="text-xs text-slate-400">When users submit TV valuation requests from /sell-tv, they will appear here instantly.</p>
              </div>
            ) : (
              <>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Lead ID</th>
                      <th>Customer Details</th>
                      <th>TV Model & Size</th>
                      <th>Condition</th>
                      <th>Inspection Photos</th>
                      <th>Offered Price</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tvLeads.map((lead) => {
                      const photoCount = Object.values(lead.photos || {}).filter(Boolean).length;
                      return (
                        <tr key={lead._id}>
                          <td>
                            <span className="font-mono text-xs text-blue-600 font-bold">{lead.leadId}</span>
                          </td>
                          <td>
                            <div>
                              <div className="font-bold text-slate-900">{lead.customer?.name || "Customer"}</div>
                              <a
                                href={`tel:${lead.customer?.phone}`}
                                className="text-[11px] text-blue-600 font-mono font-semibold hover:underline flex items-center gap-1"
                              >
                                <Phone size={10} /> {lead.customer?.phone}
                              </a>
                              {lead.customer?.city && (
                                <div className="text-[10px] text-slate-400">{lead.customer.city}</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="font-bold text-slate-900">{lead.brand} {lead.customBrand && `(${lead.customBrand})`}</div>
                              <div className="text-[10px] text-slate-500 font-semibold">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{lead.screenSize}</span> • {lead.tvType}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-bold text-xs capitalize text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md inline-block">
                              {lead.condition}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              {photoCount > 0 ? (
                                <div
                                  onClick={() => setSelectedTvLead(lead)}
                                  className="flex items-center gap-1.5 cursor-pointer group"
                                >
                                  {lead.photos?.front && (
                                    <img
                                      src={lead.photos.front}
                                      alt="Front"
                                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 group-hover:border-blue-500"
                                    />
                                  )}
                                  <span className="text-[11px] font-bold text-blue-600 group-hover:underline">
                                    {photoCount} photo{photoCount > 1 ? "s" : ""}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">No photos</span>
                              )}
                            </div>
                          </td>
                          <td>
                            {lead.offeredPrice ? (
                              <span className="font-extrabold text-emerald-600 text-xs">₹{lead.offeredPrice}</span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Pending Quote</span>
                            )}
                          </td>
                          <td className="text-xs">
                            {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </td>
                          <td>
                            <span className={getTvBadgeClass(lead.status)}>
                              {lead.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedTvLead(lead)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-200"
                              >
                                <Eye size={12} /> Review Quote
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="admin-pagination">
                  <div className="admin-pagination-info">
                    Page {tvPage} of {tvTotalPages}
                  </div>
                  <div className="admin-pagination-btns">
                    <button
                      disabled={tvPage === 1}
                      onClick={() => setTvPage(p => p - 1)}
                      className="admin-pagination-btn"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={tvPage === tvTotalPages}
                      onClick={() => setTvPage(p => p + 1)}
                      className="admin-pagination-btn"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Device Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* TV Lead Detail Modal */}
      {selectedTvLead && (
        <TvLeadDetailModal
          lead={selectedTvLead}
          onClose={() => setSelectedTvLead(null)}
          onUpdate={handleTvLeadUpdate}
          onDelete={handleTvLeadDelete}
        />
      )}

    </div>
  );
}
