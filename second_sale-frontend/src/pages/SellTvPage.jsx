import { useAuth } from '../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  X, 
  Check, 
  Tv, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BRANDS = ['Samsung', 'LG', 'Sony', 'Mi', 'TCL', 'Other'];
const SCREEN_SIZES = ['32"', '40–43"', '50–55"', '65"+', 'Not sure'];
const TV_TYPES = ['Smart TV', 'LED', 'LCD', 'Not sure'];
const CONDITIONS = [
  { id: 'Working well', label: 'Working well', sub: 'Everything works as intended, display is clean' },
  { id: 'Powers on but issues', label: 'Powers on but issues', sub: 'Turns on, but lines on screen, audio issue, or port issues' },
  { id: 'Dead', label: 'Dead', sub: 'Does not turn on or cracked panel' },
];

export default function SellTvPage() {
  const { user } = useAuth();
  // Auto-fill customer details if logged in
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);
  // Choices - no default selection
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [screenSize, setScreenSize] = useState('');
  const [tvType, setTvType] = useState('');
  const [condition, setCondition] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Photos state (File + Preview URL)
  const [photos, setPhotos] = useState({
    front: null,
    left: null,
    right: null,
    back: null,
  });
  const [previews, setPreviews] = useState({
    front: '',
    left: '',
    right: '',
    back: '',
  });

  // Customer details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedLead, setSubmittedLead] = useState(null);

  // File input refs
  const fileRefs = {
    front: useRef(),
    left: useRef(),
    right: useRef(),
    back: useRef(),
  };

  const handlePhotoSelect = (pos, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotos(prev => ({ ...prev, [pos]: file }));
    setPreviews(prev => ({ ...prev, [pos]: URL.createObjectURL(file) }));
  };

  const handleRemovePhoto = (pos, e) => {
    e.stopPropagation();
    setPhotos(prev => ({ ...prev, [pos]: null }));
    setPreviews(prev => ({ ...prev, [pos]: '' }));
    if (fileRefs[pos].current) fileRefs[pos].current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!brand) {
      setError('Please select your TV brand');
      return;
    }
    if (brand === 'Other' && !customBrand.trim()) {
      setError('Please enter your TV brand name');
      return;
    }
    if (!screenSize) {
      setError('Please select your TV screen size');
      return;
    }
    if (!tvType) {
      setError('Please select your TV display type');
      return;
    }
    if (!condition) {
      setError('Please select your TV condition');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit Indian phone number (starts with 6-9)');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('brand', brand === 'Other' && customBrand.trim() ? customBrand.trim() : brand);
      if (brand === 'Other') fd.append('customBrand', customBrand.trim());
      fd.append('screenSize', screenSize);
      fd.append('tvType', tvType);
      fd.append('condition', condition);
      fd.append('additionalNotes', additionalNotes.trim());
      fd.append('name', name.trim());
      fd.append('phone', phone.trim());
      fd.append('city', city.trim());
      fd.append('pincode', pincode.trim());
      fd.append('address', address.trim());

      ['front', 'left', 'right', 'back'].forEach(pos => {
        if (photos[pos]) {
          fd.append(pos, photos[pos]);
        }
      });

      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tv-leads`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit quote request');

      setSubmittedLead(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If submitted, show clean confirmation screen
  if (submittedLead) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Check size={32} className="stroke-[3]" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Request Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              We&apos;ll Call You With An Offer!
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Our television valuation experts have received your specs and photos. We will call you shortly at <span className="font-bold text-slate-900">{phone}</span> with the highest cash quote and arrange free doorstep pickup!
            </p>
          </div>

          {/* Lead ID Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Reference ID</span>
              <span className="text-sm font-black text-blue-600 font-mono">{submittedLead.leadId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock size={14} className="text-blue-500" />
              <span>Callback in ~15-30 mins</span>
            </div>
          </div>

          {/* Specs Summary */}
          <div className="text-left bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Device:</span>
              <span className="font-bold text-slate-800">{brand === 'Other' ? customBrand : brand} {screenSize} {tvType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Condition:</span>
              <span className="font-bold text-slate-800">{condition}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Pickup Location:</span>
              <span className="font-bold text-slate-800">{city || 'Doorstep Pickup'} {pincode ? `(${pincode})` : ''}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all no-underline text-center shadow-sm"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                setSubmittedLead(null);
                setPhotos({ front: null, left: null, right: null, back: null });
                setPreviews({ front: '', left: '', right: '', back: '', });
              }}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            >
              Sell Another TV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Tv size={16} />
              <span>Television Trade-in</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sell your TV
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Quick form — tap choices, add 4 photos, and we&apos;ll call with an offer.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* STEP 1: BRAND */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <label className="text-sm font-bold text-slate-900">Brand</label>
                <span className="text-xs text-slate-400 font-normal">Pick one</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BRANDS.map((b) => {
                  const selected = brand === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        selected 
                          ? 'border-blue-600 bg-blue-50/60 text-blue-600 font-bold shadow-xs' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>

              {brand === 'Other' && (
                <div className="mt-2 animate-in fade-in duration-150">
                  <input
                    type="text"
                    placeholder="Enter brand name (e.g. OnePlus, Vu, Thomson, Panasonic...)"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-blue-50/20"
                    required
                  />
                </div>
              )}
            </div>

            {/* STEP 2: SCREEN SIZE */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <label className="text-sm font-bold text-slate-900">Screen size</label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SCREEN_SIZES.map((size) => {
                  const selected = screenSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setScreenSize(size)}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        selected 
                          ? 'border-blue-600 bg-blue-50/60 text-blue-600 font-bold shadow-xs' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: TV TYPE */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <label className="text-sm font-bold text-slate-900">TV type</label>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {TV_TYPES.map((type) => {
                  const selected = tvType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTvType(type)}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        selected 
                          ? 'border-blue-600 bg-blue-50/60 text-blue-600 font-bold shadow-xs' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: CONDITION */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <label className="text-sm font-bold text-slate-900">Condition</label>
              </div>

              <div className="space-y-2">
                {CONDITIONS.map((cond) => {
                  const selected = condition === cond.id;
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setCondition(cond.id)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between ${
                        selected 
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <span className={`text-xs sm:text-sm block font-bold ${selected ? 'text-blue-700' : 'text-slate-800'}`}>
                          {cond.label}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 block font-normal">
                          {cond.sub}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: ANYTHING ELSE? */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <label className="text-sm font-bold text-slate-900">Anything else?</label>
                <span className="text-xs text-slate-400 font-normal">Optional</span>
              </div>

              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. remote missing, screen lines, original box available..."
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50/50 focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* STEP 6: PHOTOS */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  6
                </span>
                <label className="text-sm font-bold text-slate-900">Photos</label>
              </div>
              <p className="text-xs text-slate-400">
                Front, left, right & back — helps us quote faster
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { pos: 'front', label: 'FRONT', title: 'Front' },
                  { pos: 'left',  label: 'LEFT',  title: 'Left' },
                  { pos: 'right', label: 'RIGHT', title: 'Right' },
                  { pos: 'back',  label: 'BACK',  title: 'Back' },
                ].map(({ pos, label, title }) => {
                  const hasPhoto = Boolean(previews[pos]);

                  return (
                    <div key={pos}>
                      <input
                        ref={fileRefs[pos]}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoSelect(pos, e)}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileRefs[pos].current.click()}
                        className={`relative h-28 sm:h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                          hasPhoto 
                            ? 'border-blue-500 bg-slate-900' 
                            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-100/50'
                        }`}
                      >
                        {hasPhoto ? (
                          <>
                            <img
                              src={previews[pos]}
                              alt={`${title} view`}
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={(e) => handleRemovePhoto(pos, e)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                              title="Remove photo"
                            >
                              <X size={13} />
                            </button>
                            <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                              {label}
                            </span>
                          </>
                        ) : (
                          <>
                            <Camera size={22} className="text-slate-400 mb-1.5" />
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                              {label}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 text-center block mt-1 font-medium">
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 7: YOUR DETAILS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  7
                </span>
                <label className="text-sm font-bold text-slate-900">Your details</label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NAME <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50/50 focus:bg-white font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PHONE <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50/50 focus:bg-white font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    CITY
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50/50 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PINCODE
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Pincode"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50/50 focus:bg-white font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ADDRESS
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Optional — for pickup"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50/50 focus:bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SUBMIT CTA BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Uploading photos & submitting…</span>
                  </>
                ) : (
                  <>
                    <PhoneCall size={18} />
                    <span>Get a callback</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={15} className="text-blue-500" />
                <span>Zero Inspection Charges</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={15} className="text-blue-500" />
                <span>Instant Cash on Pickup</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles size={15} className="text-blue-500" />
                <span>Safe Doorstep Service</span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
