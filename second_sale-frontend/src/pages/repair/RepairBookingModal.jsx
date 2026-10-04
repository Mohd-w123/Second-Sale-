import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user.service';
import api from '../../services/api';
import { getNextDays, formatDate, formatDateISO, TIME_SLOTS } from '../../utils/dateUtils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ── Inline CreateAddressModal (same as SchedulePickupPage) ─────────────────
function CreateAddressModal({ onClose }) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const pincodeDebounce = useRef(null);

  const [form, setForm] = useState({
    label: 'Home',
    address: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const checkPincode = async (code) => {
    if (code.length !== 6) { setPincodeError(''); return; }
    setPincodeChecking(true);
    setPincodeError('');
    try {
      const res = await fetch(`${API_BASE}/pincodes/check/${code}`);
      const data = await res.json();
      if (res.ok && data.isServiceable) {
        setPincodeError('');
        setForm(f => ({ ...f, city: data.city || f.city, state: data.state || f.state }));
      } else {
        setPincodeError('Pincode not serviceable — we do not cover this area yet.');
      }
    } catch {
      setPincodeError('Could not verify pincode. Please try again.');
    } finally {
      setPincodeChecking(false);
    }
  };

  const handlePincodeChange = (val) => {
    setForm(f => ({ ...f, pincode: val }));
    setPincodeError('');
    if (pincodeDebounce.current) clearTimeout(pincodeDebounce.current);
    pincodeDebounce.current = setTimeout(() => checkPincode(val), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.pincode || !form.city) {
      alert('Please fill all required fields');
      return;
    }
    if (pincodeError) { alert('Please enter a serviceable pincode'); return; }
    setLoading(true);
    try {
      await userService.addAddress(form);
      await refreshUser();
      onClose();
    } catch {
      alert('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-8 sm:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-7 right-7 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#E8F6F7] rounded-2xl flex items-center justify-center text-[#087F8C]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Add New Address</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Label Type */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Address Type</label>
            <div className="flex gap-3">
              {['Home', 'Office', 'Other'].map(type => (
                <button
                  key={type} type="button"
                  onClick={() => setForm({ ...form, label: type })}
                  className={`flex-1 py-3.5 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer ${form.label === type ? 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >{type}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Address *</label>
              <input
                type="text" placeholder="Flat/House No., Street, Area"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Landmark</label>
              <input
                type="text" placeholder="Near ..."
                value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pincode *</label>
              <div className="relative">
                <input
                  type="text" placeholder="6-digit pincode"
                  value={form.pincode} onChange={e => handlePincodeChange(e.target.value)}
                  maxLength={6}
                  className={`w-full border-2 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none transition-all ${pincodeError ? 'border-red-400' : 'border-gray-100 focus:border-[#087F8C]'}`}
                  required
                />
                {pincodeChecking && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#087F8C] border-t-transparent rounded-full animate-spin" />}
              </div>
              {pincodeError && <p className="mt-1.5 text-xs font-bold text-red-500">{pincodeError}</p>}
              {!pincodeError && form.pincode.length === 6 && !pincodeChecking && (
                <p className="mt-1.5 text-xs font-bold text-green-600">✓ Serviceable area</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City *</label>
              <input
                type="text" placeholder="City"
                value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">State</label>
              <input
                type="text" placeholder="State"
                value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!pincodeError || pincodeChecking}
            className="w-full btn-gradient text-white font-black py-4 rounded-2xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Inline AddPaymentModal ──────────────────────────────────────────────────
function AddPaymentModal({ type, onClose }) {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(
    type === 'upi'
      ? { type: 'upi', upiId: '' }
      : { type: 'bank', accountName: '', accountNumber: '', ifscCode: '', bankName: '' }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.addPaymentMethod(form);
      await refreshUser();
      onClose();
    } catch {
      alert('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 sm:p-10">
        <button onClick={onClose} className="absolute top-7 right-7 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#E8F6F7] rounded-2xl flex items-center justify-center text-[#087F8C]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">{type === 'upi' ? 'Add UPI ID' : 'Add Bank Details'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'upi' ? (
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">UPI ID</label>
              <input
                type="text" placeholder="e.g. 9876543210@ybl"
                value={form.upiId} onChange={e => setForm({ ...form, upiId: e.target.value })}
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
                required
              />
            </div>
          ) : (
            <>
              {[
                { key: 'accountName', label: 'Account Holder Name', placeholder: 'Name as per bank' },
                { key: 'accountNumber', label: 'Account Number', placeholder: 'Enter Account Number' },
                { key: 'ifscCode', label: 'IFSC Code', placeholder: 'e.g. HDFC0001234' },
                { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. HDFC Bank' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                  <input
                    type="text" placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#087F8C] transition-all"
                    required
                  />
                </div>
              ))}
            </>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full btn-gradient text-white font-black py-4 rounded-2xl shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : type === 'upi' ? 'Save UPI ID' : 'Save Bank Details'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SecondSale Authorized Repair Stores
// ═══════════════════════════════════════════════════════════════════
const SECONDSALE_STORES = [
  {
    id: 'store_bandra',
    name: 'SecondSale Flagship Repair Lounge — Bandra West',
    address: 'Linking Road, Near Khar Telephone Exchange, Bandra West',
    city: 'Mumbai',
    pincode: '400052',
    timing: '10:00 AM - 9:00 PM (All 7 Days)',
    phone: '+91 7045180009',
    badge: 'Popular Hub',
  },
  {
    id: 'store_andheri',
    name: 'SecondSale Express Repair Center — Andheri East',
    address: 'Opposite Andheri Metro Station, Andheri-Kurla Road',
    city: 'Mumbai',
    pincode: '400069',
    timing: '10:30 AM - 8:30 PM (All 7 Days)',
    phone: '+91 7045180009',
    badge: 'Quick 30-min Service',
  },
  {
    id: 'store_dadar',
    name: 'SecondSale Tech Center — Dadar West',
    address: 'Ranade Road, Near Plaza Cinema, Dadar West',
    city: 'Mumbai',
    pincode: '400028',
    timing: '10:00 AM - 8:30 PM (All 7 Days)',
    phone: '+91 7045180009',
    badge: 'Certified Lab',
  },
  {
    id: 'store_thane',
    name: 'SecondSale Authorized Repair Store — Thane West',
    address: 'Gokhale Road, Opposite Talao Pali, Naupada, Thane West',
    city: 'Thane',
    pincode: '400602',
    timing: '10:00 AM - 9:00 PM (All 7 Days)',
    phone: '+91 7045180009',
    badge: 'Authorized Hub',
  },
];

// ═══════════════════════════════════════════════════════════════════
// Main RepairBookingPage — full-page (NOT a modal) booking flow
// ═══════════════════════════════════════════════════════════════════
export default function RepairBookingPage({
  model,
  brand,
  selectedServices,
  totalAmount,
  onClose,
  onSuccess,
  initialRepairMode = 'home',
}) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  const days = getNextDays(7);

  // ── Mode & Discount State ─────────────────────────────────────────
  const [repairMode, setRepairMode] = useState(initialRepairMode); // 'home' | 'store'
  const STORE_DISCOUNT_AMOUNT = 350;
  const storeDiscount = repairMode === 'store' ? Math.min(STORE_DISCOUNT_AMOUNT, totalAmount) : 0;
  const finalPayable = Math.max(totalAmount - storeDiscount, 0);

  // ── Store Booking State ───────────────────────────────────────────
  const [selectedStoreId, setSelectedStoreId] = useState(SECONDSALE_STORES[0].id);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // ── Doorstep Address State ────────────────────────────────────────
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentType, setPaymentType] = useState('cash');
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(null); // 'upi' | 'bank'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sync first address
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user?.name && !customerName) setCustomerName(user.name);
    if (user?.phone && !customerPhone) setCustomerPhone(user.phone);
  }, [user, customerName, customerPhone]);

  useEffect(() => {
    if (user?.addresses?.length > 0 && !selectedAddressId) {
      setSelectedAddressId(user.addresses[0]._id);
    }
  }, [user, selectedAddressId]);

  // Sync payment id
  useEffect(() => {
    if (paymentType === 'upi' || paymentType === 'bank') {
      const methods = user?.paymentMethods?.filter(pm => pm.type === paymentType) || [];
      if (methods.length > 0 && !selectedPaymentId) {
        setSelectedPaymentId(methods[0]._id);
      } else if (methods.length === 0) {
        setSelectedPaymentId(null);
      }
    } else {
      setSelectedPaymentId(null);
    }
  }, [paymentType, user, selectedPaymentId]);

  // ── Redirect if not logged in ────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl p-8 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 text-sm mb-6">Please log in to book your repair appointment.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm cursor-pointer">Cancel</button>
            <button
              onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
              className="flex-1 py-3 rounded-xl bg-[#087F8C] text-white font-bold text-sm cursor-pointer"
            >Login / Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Submit ───────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (repairMode === 'home') {
      if (!selectedAddressId || !selectedDate || !selectedSlot) {
        setError('Please select address, date and time slot.');
        return;
      }
      if (paymentType !== 'cash' && !selectedPaymentId) {
        setError(`Please select or add a ${paymentType.toUpperCase()} payment method.`);
        return;
      }
    } else {
      // Store mode
      if (!selectedStoreId || !selectedDate || !selectedSlot) {
        setError('Please select a SecondSale store, date and appointment slot.');
        return;
      }
      if (!customerName.trim() || !customerPhone.trim()) {
        setError('Please provide your name and phone number for the store appointment.');
        return;
      }
    }

    const chosenStore = SECONDSALE_STORES.find(s => s.id === selectedStoreId) || SECONDSALE_STORES[0];
    const selectedAddr = user?.addresses?.find(a => a._id === selectedAddressId);

    let finalPaymentMethodStr = 'Cash';
    if (repairMode === 'store') {
      finalPaymentMethodStr = 'Pay at Store (Cash/UPI/Card)';
    } else if (paymentType !== 'cash') {
      const pm = user.paymentMethods.find(p => p._id === selectedPaymentId);
      if (pm?.type === 'upi') {
        finalPaymentMethodStr = `UPI - ${pm.upiId}`;
      } else if (pm?.type === 'bank') {
        finalPaymentMethodStr = `Bank - ${pm.bankName} (${pm.accountNumber?.slice(-4)})`;
      }
    }

    const pickupPayload = repairMode === 'store'
      ? {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: user?.email || '',
          address: `Store Visit: ${chosenStore.name}, ${chosenStore.address}`,
          landmark: chosenStore.badge || 'SecondSale Store',
          pincode: chosenStore.pincode,
          city: chosenStore.city,
          state: 'Maharashtra',
          date: formatDateISO(selectedDate),
          timeSlot: selectedSlot,
          paymentMethod: finalPaymentMethodStr,
        }
      : {
          name: selectedAddr?.name || user?.name || '',
          phone: selectedAddr?.phone || user?.phone || '',
          email: user?.email || '',
          address: selectedAddr?.address || '',
          landmark: selectedAddr?.landmark || '',
          pincode: selectedAddr?.pincode || '',
          city: selectedAddr?.city || '',
          state: selectedAddr?.state || '',
          date: formatDateISO(selectedDate),
          timeSlot: selectedSlot,
          paymentMethod: finalPaymentMethodStr,
        };

    setSubmitting(true);
    setError('');
    try {
      await api.post('/repair-orders', {
        device: {
          brand: brand.name,
          modelName: model.name,
          modelId: model.id,
          imageUrl: model.image || '',
        },
        services: selectedServices.map(s => ({
          id: s.id,
          label: s.label,
          price: s.price,
          mrp: s.mrp,
        })),
        totalAmount: finalPayable,
        repairMode,
        storeDiscount,
        storeLocation: repairMode === 'store' ? {
          name: chosenStore.name,
          address: chosenStore.address,
          city: chosenStore.city,
          pincode: chosenStore.pincode,
        } : null,
        pickup: pickupPayload,
      });

      onSuccess({
        repairMode,
        storeDiscount,
        finalAmount: finalPayable,
        storeName: chosenStore.name,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book repair. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-50"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="min-h-screen pb-12">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center gap-4 shadow-sm">
            <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-gray-800 font-bold transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="font-black text-gray-900 text-base">Book Repair — {model.name}</h1>
            {/* Summary */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}</span>
              {repairMode === 'store' && (
                <span className="hidden sm:inline-flex text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  ₹350 OFF
                </span>
              )}
              <span className="text-base font-extrabold text-[#087F8C]">₹{finalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Mode Switcher Banner (Repair at Home vs Repair at Store) */}
          <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
            <div className="bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setRepairMode('home')}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  repairMode === 'home'
                    ? 'bg-[#087F8C] text-white shadow-md shadow-[#087F8C]/20'
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">🏠</span>
                <span>Repair at Home</span>
              </button>

              <button
                type="button"
                onClick={() => setRepairMode('store')}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  repairMode === 'store'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/60 border border-emerald-200/60'
                }`}
              >
                <span className="text-base">🏬</span>
                <span>Repair at Store</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  repairMode === 'store' ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
                }`}>
                  Get Extra ₹350 OFF
                </span>
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Steps */}
              <div className="flex-1 space-y-6">

                {/* ── Step 1: Location / Address ───────────────────────────── */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-7 sm:p-10 shadow-sm">
                  {repairMode === 'store' ? (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-black text-sm">1</div>
                          <div>
                            <h2 className="text-xl font-black text-gray-900">Select SecondSale Store</h2>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Visit nearest store for instant repair with guaranteed extra ₹350 discount</p>
                          </div>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-xl border border-emerald-200">
                          <span>✨</span> Extra ₹350 OFF Applied
                        </span>
                      </div>

                      {/* Store Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {SECONDSALE_STORES.map((store) => (
                          <label
                            key={store.id}
                            className={`flex items-start gap-3.5 p-5 rounded-[24px] border-2 cursor-pointer transition-all ${
                              selectedStoreId === store.id
                                ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="repair-store"
                              checked={selectedStoreId === store.id}
                              onChange={() => setSelectedStoreId(store.id)}
                              className="sr-only"
                            />
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg ${
                              selectedStoreId === store.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              🏬
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                  {store.badge}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400">{store.city}</span>
                              </div>
                              <p className="font-extrabold text-gray-900 text-sm leading-snug">{store.name}</p>
                              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{store.address}</p>
                              <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-gray-400">
                                <span>⏰ {store.timing}</span>
                              </div>
                            </div>
                            {selectedStoreId === store.id && (
                              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
                              </div>
                            )}
                          </label>
                        ))}
                      </div>

                      {/* Customer Contact for Store Appointment */}
                      <div className="bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-200/60">
                        <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                          Contact Details (For Store Reservation & Parts Allocation)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">Your Name *</label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={e => setCustomerName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">Contact Number *</label>
                            <input
                              type="tel"
                              value={customerPhone}
                              onChange={e => setCustomerPhone(e.target.value)}
                              placeholder="10-digit mobile number"
                              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 font-black text-sm">1</div>
                          <h2 className="text-xl font-black text-gray-900">Select Service Address</h2>
                        </div>
                        <button
                          onClick={() => setShowAddressModal(true)}
                          className="flex items-center gap-2 bg-[#E8F6F7] text-[#087F8C] px-4 py-2.5 rounded-xl font-black text-sm hover:bg-[#087F8C] hover:text-white transition-all cursor-pointer"
                        >
                          <span className="text-lg leading-none">+</span> Add New
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user?.addresses?.length > 0 ? (
                          user.addresses.map(addr => (
                            <label
                              key={addr._id}
                              className={`flex items-start gap-4 p-5 rounded-[28px] border-2 cursor-pointer transition-all ${
                                selectedAddressId === addr._id
                                  ? 'border-[#087F8C] bg-[#E8F6F7]'
                                  : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                              }`}
                            >
                              <input
                                type="radio" name="repair-address"
                                checked={selectedAddressId === addr._id}
                                onChange={() => setSelectedAddressId(addr._id)}
                                className="sr-only"
                              />
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr._id ? 'bg-[#087F8C] text-white' : 'bg-white text-gray-400'}`}>
                                {addr.label === 'Home' ? (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-gray-900 mb-1">{addr.label}</p>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{addr.address}, {addr.city}, {addr.pincode}</p>
                              </div>
                              {selectedAddressId === addr._id && (
                                <div className="w-5 h-5 bg-[#087F8C] rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
                                </div>
                              )}
                            </label>
                          ))
                        ) : (
                          <div className="col-span-full py-10 text-center bg-gray-50 rounded-[28px] border-2 border-dashed border-gray-200">
                            <p className="text-sm font-bold text-gray-400 mb-3">No addresses saved. Add one to continue.</p>
                            <button
                              onClick={() => setShowAddressModal(true)}
                              className="text-[#087F8C] font-black text-sm hover:underline cursor-pointer"
                            >+ Add Address</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Step 2: Date & Time ───────────────────────── */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 font-black text-sm">2</div>
                    <h2 className="text-xl font-black text-gray-900">
                      {repairMode === 'store' ? 'Select Store Appointment Date & Time' : 'Select Date & Time Slot'}
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {/* Date */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {days.map(d => {
                        const isSelected = selectedDate && formatDateISO(selectedDate) === formatDateISO(d);
                        const parts = formatDate(d).split(', ');
                        return (
                          <button
                            key={d.toISOString()}
                            onClick={() => setSelectedDate(d)}
                            className={`min-w-[90px] p-4 rounded-[24px] border-2 flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                              isSelected
                                ? repairMode === 'store' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-[#087F8C] bg-[#E8F6F7]'
                                : 'border-gray-50 bg-gray-50/50 hover:border-gray-100'
                            }`}
                          >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              isSelected ? (repairMode === 'store' ? 'text-emerald-700' : 'text-[#087F8C]') : 'text-gray-400'
                            }`}>{parts[0]}</span>
                            <span className="text-2xl font-black text-gray-900">{d.getDate()}</span>
                            <span className="text-xs font-bold text-gray-400">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot.value}
                          onClick={() => setSelectedSlot(slot.value)}
                          className={`relative p-4 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            selectedSlot === slot.value
                              ? repairMode === 'store' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-[#087F8C] bg-[#E8F6F7] text-[#087F8C]'
                              : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-100'
                          }`}
                        >
                          {slot.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-[9px] font-black text-white px-2.5 py-0.5 rounded-full uppercase tracking-tighter border border-white shadow-sm">Popular</span>
                          )}
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Step 3: Payment Method ────────────────────── */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-7 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 font-black text-sm">3</div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">Payment Method</h2>
                  </div>

                  {repairMode === 'store' ? (
                    <div className="rounded-[24px] border-2 border-emerald-500 bg-emerald-50/50 p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        💳
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-gray-900 text-base">Pay at SecondSale Store</p>
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Zero Advance</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
                          Pay by Cash, UPI (Google Pay, PhonePe, Paytm), or Debit/Credit Card at the store counter after your repair is completed and verified.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-6 -mt-1">Payment is collected after repair is completed at your doorstep.</p>

                      <div className="space-y-4">
                        {/* UPI */}
                        <div className={`rounded-[28px] border-2 p-6 transition-all ${paymentType === 'upi' ? 'border-[#087F8C] bg-[#E8F6F7]' : 'border-gray-50 bg-white hover:border-gray-200 cursor-pointer'}`}>
                          <div className="flex items-center gap-5" onClick={() => setPaymentType('upi')}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 border ${paymentType === 'upi' ? 'bg-[#087F8C] text-white border-[#087F8C]' : 'bg-white text-gray-500 border-gray-100'}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-gray-900 text-lg">UPI</p>
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Add or select UPI ID</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentType === 'upi' ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-300'}`}>
                              {paymentType === 'upi' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                          </div>

                          {paymentType === 'upi' && (
                            <div className="mt-5 pt-5 border-t border-[#087F8C]/20">
                              <div className="space-y-2 mb-4">
                                {user?.paymentMethods?.filter(pm => pm.type === 'upi').map(pm => (
                                  <label key={pm._id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#087F8C]/5 transition-colors">
                                    <input
                                      type="radio" name="upiId"
                                      checked={selectedPaymentId === pm._id}
                                      onChange={() => setSelectedPaymentId(pm._id)}
                                      className="w-4 h-4 text-[#087F8C] cursor-pointer"
                                    />
                                    <span className="font-bold text-gray-900 text-sm">{pm.upiId}</span>
                                  </label>
                                ))}
                              </div>
                              <button onClick={() => setShowPaymentModal('upi')} className="text-sm font-black text-[#087F8C] hover:text-[#066772] flex items-center gap-2 cursor-pointer">
                                <span className="text-lg">+</span> Add New UPI ID
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bank */}
                        <div className={`rounded-[28px] border-2 p-6 transition-all ${paymentType === 'bank' ? 'border-[#087F8C] bg-[#E8F6F7]' : 'border-gray-50 bg-white hover:border-gray-200 cursor-pointer'}`}>
                          <div className="flex items-center gap-5" onClick={() => setPaymentType('bank')}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 border ${paymentType === 'bank' ? 'bg-[#087F8C] text-white border-[#087F8C]' : 'bg-white text-gray-500 border-gray-100'}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-gray-900 text-lg">Bank Transfer</p>
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Add or select bank account</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentType === 'bank' ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-300'}`}>
                              {paymentType === 'bank' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                          </div>

                          {paymentType === 'bank' && (
                            <div className="mt-5 pt-5 border-t border-[#087F8C]/20">
                              <div className="space-y-2 mb-4">
                                {user?.paymentMethods?.filter(pm => pm.type === 'bank').map(pm => (
                                  <label key={pm._id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#087F8C]/5 transition-colors">
                                    <input
                                      type="radio" name="bankId"
                                      checked={selectedPaymentId === pm._id}
                                      onChange={() => setSelectedPaymentId(pm._id)}
                                      className="w-4 h-4 text-[#087F8C] cursor-pointer"
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-bold text-gray-900 text-sm">{pm.bankName} — ••••{pm.accountNumber?.slice(-4)}</span>
                                      <span className="text-xs font-semibold text-gray-500">{pm.accountName}</span>
                                    </div>
                                  </label>
                                ))}
                              </div>
                              <button onClick={() => setShowPaymentModal('bank')} className="text-sm font-black text-[#087F8C] hover:text-[#066772] flex items-center gap-2 cursor-pointer">
                                <span className="text-lg">+</span> Add New Bank Account
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Cash */}
                        <div
                          className={`rounded-[28px] border-2 p-6 transition-all ${paymentType === 'cash' ? 'border-[#087F8C] bg-[#E8F6F7]' : 'border-gray-50 bg-white hover:border-gray-200 cursor-pointer'}`}
                          onClick={() => setPaymentType('cash')}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 border ${paymentType === 'cash' ? 'bg-[#087F8C] text-white border-[#087F8C]' : 'bg-white text-gray-500 border-gray-100'}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-gray-900 text-lg">Cash</p>
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pay cash to technician after repair</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentType === 'cash' ? 'border-[#087F8C] bg-[#087F8C]' : 'border-gray-300'}`}>
                              {paymentType === 'cash' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: Order Summary Sidebar ────────────────── */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm lg:sticky lg:top-24">
                  {/* Device */}
                  <div className="flex items-center gap-4 mb-6 bg-gray-50 rounded-2xl p-4">
                    <div className="w-14 h-16 flex items-center justify-center bg-white rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={model.image} alt={model.name} className="w-full h-full object-contain p-1.5" onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.textContent = '📱'; }} />
                    </div>
                    <div>
                      <p className="text-xs text-[#087F8C] font-bold uppercase">{brand.name}</p>
                      <p className="font-black text-gray-900 text-sm">{model.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{selectedServices.length} repair service{selectedServices.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Mode Tag */}
                  <div className="mb-4">
                    {repairMode === 'store' ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span>🏬</span>
                          <span>Repair at Store</span>
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          ₹350 OFF
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs font-bold text-blue-800 flex items-center gap-1.5">
                        <span>🏠</span>
                        <span>Doorstep Technician Visit</span>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  <div className="space-y-2.5 mb-5">
                    {selectedServices.map(svc => (
                      <div key={svc.id} className="flex justify-between items-start gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{svc.label}</p>
                          <p className="text-xs text-gray-400 line-through">₹{svc.mrp.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-sm font-black text-gray-900 flex-shrink-0">₹{svc.price.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total & Discount Breakdown */}
                  <div className="border-t border-gray-100 pt-4 mb-6 space-y-2.5">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                      <span>Services Subtotal</span>
                      <span className="font-bold text-gray-800">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    {repairMode === 'store' && (
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                        <span className="flex items-center gap-1.5">
                          <span>✨</span>
                          <span>Store Visit Discount</span>
                        </span>
                        <span className="font-extrabold">-₹{storeDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-black text-gray-900 text-base">Total Amount</span>
                      <span className="text-xl font-extrabold text-[#087F8C]">₹{finalPayable.toLocaleString('en-IN')}</span>
                    </div>

                    {(() => {
                      const totalMrp = selectedServices.reduce((s, x) => s + x.mrp, 0);
                      const savings = totalMrp - finalPayable;
                      return savings > 0 ? (
                        <p className="text-xs font-bold text-green-600 mt-1">
                          You save ₹{savings.toLocaleString('en-IN')} 🎉 {repairMode === 'store' && '(includes ₹350 store off)'}
                        </p>
                      ) : null;
                    })()}
                  </div>

                  {/* Trust */}
                  <div className="flex flex-col gap-2 mb-6">
                    {['6-Month Repair Warranty', repairMode === 'store' ? 'Walk-in Instant Service' : 'Doorstep Service', 'Certified Technician'].map(t => (
                      <div key={t} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <svg viewBox="0 0 24 24" fill="#087F8C" className="w-4 h-4 flex-shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {t}
                      </div>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-xs font-bold">{error}</p>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <button
                    onClick={handleConfirm}
                    disabled={
                      submitting ||
                      !selectedDate ||
                      !selectedSlot ||
                      (repairMode === 'home' && !selectedAddressId) ||
                      (repairMode === 'store' && (!customerName.trim() || !customerPhone.trim() || !selectedStoreId))
                    }
                    className={`w-full text-white font-black py-5 rounded-2xl transition-all shadow-xl cursor-pointer disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 ${
                      repairMode === 'store'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                        : 'btn-gradient shadow-[#087F8C]/25'
                    }`}
                  >
                    {submitting ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking...</>
                    ) : (
                      <>Confirm {repairMode === 'store' ? 'Store Appointment' : 'Doorstep Repair'} — ₹{finalPayable.toLocaleString('en-IN')}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      {showAddressModal && <CreateAddressModal onClose={() => setShowAddressModal(false)} />}
      {showPaymentModal && <AddPaymentModal type={showPaymentModal} onClose={() => setShowPaymentModal(null)} />}
    </>
  );
}
