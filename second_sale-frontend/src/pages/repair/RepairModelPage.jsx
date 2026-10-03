import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getRepairBrand, getRepairModel, REPAIR_SERVICE_TYPES } from '../../data/repairData';
import RepairBookingModal from './RepairBookingModal';

const SERVICE_ICONS = {
  screen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="6" y="7" width="12" height="14" rx="1"/><line x1="10" y1="7" x2="10" y2="5"/><line x1="14" y1="7" x2="14" y2="5"/>
      <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
    </svg>
  ),
  front_camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  back_camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  charging_jack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M5 12h14"/><circle cx="5" cy="12" r="2"/><path d="M15 8l4 4-4 4"/>
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  speaker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  ),
  receiver: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  back_panel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M8 4v16"/>
    </svg>
  ),
};

export default function RepairModelPage() {
  const { brand: brandSlug, model: modelId } = useParams();
  const navigate = useNavigate();

  const initialBrand = getRepairBrand(brandSlug);
  const initialModel = getRepairModel(brandSlug, modelId);

  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [loading, setLoading] = useState(!initialModel);
  const [selected, setSelected] = useState({}); // { [serviceId]: true }
  const [imgError, setImgError] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (model) {
      document.title = `${model.name} Repair | SecondSale`;
    }
  }, [model]);

  // Fetch dynamic model & pricing from backend
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    setLoading(!model);
    fetch(`${API_BASE}/repairs/models/${brandSlug}/${modelId}`)
      .then(res => {
        if (!res.ok) throw new Error('Model not found');
        return res.json();
      })
      .then(data => {
        if (data && data.services) {
          setModel(data);
          if (!brand || brand.name !== data.brand) {
            setBrand({
              name: data.brand,
              slug: data.brandSlug || brandSlug,
              color: '#087F8C',
            });
          }
        }
      })
      .catch(err => console.warn('Could not load dynamic model data:', err))
      .finally(() => {
        setLoading(false);
      });
  }, [brandSlug, modelId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white">
        <div className="w-10 h-10 border-4 border-[#087F8C]/20 border-t-[#087F8C] rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500">Loading repair details...</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Model Not Found</h2>
        <p className="text-gray-500 text-sm">We couldn't find the repair pricing for this device.</p>
        <Link to={`/repair/${brandSlug}`} className="text-[#087F8C] font-semibold text-sm hover:underline">
          ← Back to {brandSlug} Models
        </Link>
      </div>
    );
  }

  const services = Object.entries(model?.services || {})
    .filter(([_, pricing]) => pricing?.enabled !== false)
    .map(([id, pricing]) => {
      const meta = REPAIR_SERVICE_TYPES.find(s => s.id === id);
      return { id, ...pricing, label: meta?.label || id, description: meta?.description || '' };
    });

  const selectedServices = services.filter(s => selected[s.id]);
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalMrp = selectedServices.reduce((sum, s) => sum + s.mrp, 0);
  const totalSavings = totalMrp - totalAmount;

  const toggleService = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBook = () => {
    if (selectedServices.length === 0) return;
    setShowBooking(true);
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Repair Booked!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your repair request for <span className="font-bold text-gray-800">{model.name}</span> has been booked successfully.
            Our technician will contact you shortly to confirm the appointment.
          </p>
          <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6 text-left space-y-2">
            {selectedServices.map(s => (
              <div key={s.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{s.label}</span>
                <span className="font-bold text-gray-900">₹{s.price.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-[#087F8C]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/repair" className="flex-1 text-center py-3 rounded-xl border-2 border-[#087F8C] text-[#087F8C] font-bold text-sm hover:bg-[#E8F6F7] transition-colors no-underline">
              Book Another
            </Link>
            <Link to="/" className="flex-1 text-center py-3 rounded-xl bg-[#087F8C] text-white font-bold text-sm hover:bg-[#116466] transition-colors no-underline">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promo banner */}
      <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: 'linear-gradient(90deg, #0B252C 0%, #087F8C 100%)' }}>
        🔧 Doorstep Repair · 6-Month Warranty · No Hidden Charges
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#087F8C] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/repair" className="hover:text-[#087F8C] transition-colors">Repair</Link>
          <span>›</span>
          <Link to={`/repair/${brandSlug}`} className="hover:text-[#087F8C] transition-colors capitalize">{brand.name}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{model.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left: Service Selection */}
          <div className="flex-1 min-w-0">
            {/* Device Header */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 mb-5 flex items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden p-2">
                  {!imgError ? (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-contain"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="text-4xl">📱</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#087F8C] font-black uppercase tracking-wider bg-[#E8F6F7] px-2.5 py-0.5 rounded-full">
                      {brand?.name}
                    </span>
                    {model.series && (
                      <span className="text-xs text-gray-400 font-semibold">• {model.series}</span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{model.name}</h1>
                  <p className="text-gray-400 text-xs font-medium">{services.length} doorstep repair services available</p>
                </div>
              </div>

              <Link
                to={`/repair/${brandSlug}`}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:text-[#087F8C] hover:border-[#087F8C] hover:bg-[#E8F6F7]/50 transition-all no-underline flex-shrink-0"
              >
                <span>Change Model</span>
                <span className="text-xs">›</span>
              </Link>
            </div>

            {/* Service List */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Select Repair Services</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Select one or multiple repairs. Certified technician visits your doorstep.</p>
                </div>
                <span className="text-xs font-bold text-[#087F8C] bg-[#E8F6F7] px-3 py-1 rounded-full">
                  {selectedServices.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {services.map(svc => {
                  const isSelected = !!selected[svc.id];
                  const discount = Math.round(((svc.mrp - svc.price) / svc.mrp) * 100);
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#087F8C] bg-[#E8F6F7]/50 shadow-md shadow-[#087F8C]/10'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Top: Icon & Title */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#087F8C] text-white' : 'bg-gray-100 text-gray-600'}`}>
                              {SERVICE_ICONS[svc.id] || <span className="text-lg">🔧</span>}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{svc.label}</h3>
                              <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                                {svc.warranty || '6 Months'} Warranty • {svc.time || '30-45 mins'}
                              </span>
                            </div>
                          </div>

                          {discount > 0 && (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{svc.description}</p>
                      </div>

                      {/* Bottom Price and Add Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100/80">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-gray-900">₹{svc.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-400 line-through">₹{svc.mrp.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleService(svc.id); }}
                          className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#087F8C] text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-[#087F8C] hover:text-white text-gray-700'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-bold">+</span>
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom repair request */}
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                <div className="text-xl">🔧</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Looking for a different repair?</p>
                  <p className="text-xs text-gray-500">Leave a message and our team will get in touch with you!</p>
                </div>
                <Link
                  to="/help-center"
                  className="flex-shrink-0 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors no-underline"
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Price Summary */}
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">Price Summary</h2>

              {selectedServices.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🛠️</div>
                  <p className="text-sm text-gray-400">No service selected yet</p>
                  <p className="text-xs text-gray-300 mt-1">Select repair services from the left to see pricing</p>
                </div>
              ) : (
                <div className="space-y-2.5 mb-4">
                  {selectedServices.map(svc => (
                    <div key={svc.id} className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-medium">{model.name} {svc.label}</p>
                        <p className="text-xs text-gray-400 line-through">₹{svc.mrp.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">₹{svc.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedServices.length > 0 && (
                <>
                  <div className="border-t border-gray-100 pt-3 mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900">Total Amount</span>
                      <div className="text-right">
                        {totalSavings > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full mr-2">
                            Saved ₹{totalSavings.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-base font-extrabold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* T&C */}
                  <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                    <svg viewBox="0 0 24 24" fill="#087F8C" className="w-4 h-4 flex-shrink-0 mt-0.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      By booking, you agree to our{' '}
                      <Link to="/terms-and-conditions" className="text-[#087F8C] font-semibold">Terms & Conditions</Link>.
                      Final price may vary based on device inspection.
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={handleBook}
                disabled={selectedServices.length === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedServices.length > 0
                    ? 'bg-[#087F8C] hover:bg-[#116466] text-white shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedServices.length > 0 ? (
                  <>
                    Book Now
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                ) : 'Select a Service to Continue'}
              </button>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                {[
                  { icon: '🛡️', label: '6-Month Warranty' },
                  { icon: '🚗', label: 'Doorstep Service' },
                  { icon: '⭐', label: '4.7 Rated' },
                  { icon: '🔧', label: 'Certified Techs' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-1.5">
                    <span className="text-base">{b.icon}</span>
                    <span className="text-xs text-gray-500 font-medium">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <RepairBookingModal
          model={model}
          brand={brand}
          selectedServices={selectedServices}
          totalAmount={totalAmount}
          onClose={() => setShowBooking(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
