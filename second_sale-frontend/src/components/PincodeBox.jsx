import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PincodeBox = forwardRef(function PincodeBox({
  onVerified,
  title = "Enter Pickup Pincode",
  subtitle = null,
  placeholder = "e.g. 400001",
  isMandatory = false,
  showMandatoryBadge = false,
  serviceText = null,
  className = "",
  icon = null,
}, ref) {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState(null); // { isServiceable: boolean, message: string }
  const [verifiedInfo, setVerifiedInfo] = useState(null); // { code, city, state }

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const onVerifiedRef = useRef(onVerified);

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    scrollIntoView: (opts) => containerRef.current?.scrollIntoView(opts),
  }));

  useEffect(() => {
    const saved = localStorage.getItem('verifiedPincode');
    if (saved) {
      try {
        let info = null;
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && parsed.code) {
            info = parsed;
          } else if (typeof parsed === 'string' || typeof parsed === 'number') {
            const str = String(parsed).trim();
            if (str.length === 6) {
              info = { code: str, city: 'Local Area', state: '' };
            }
          }
        } catch {
          if (typeof saved === 'string' && saved.trim().length === 6) {
            info = { code: saved.trim(), city: 'Local Area', state: '' };
          }
        }

        if (info && info.code) {
          setVerifiedInfo(info);
          setStatus({
            isServiceable: true,
            message: `✅ Serviceable: ${info.code} (${info.city || 'Local Area'})`
          });
          if (onVerifiedRef.current) onVerifiedRef.current(true, info.code, info);
        }
      } catch (e) {
        localStorage.removeItem('verifiedPincode');
      }
    }
  }, []);

  const handleCheck = async (codeToCheck) => {
    const targetCode = (codeToCheck || pincode).replace(/\D/g, '').slice(0, 6);
    if (targetCode.length !== 6) return;

    setChecking(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/pincodes/check/${targetCode}`);
      const data = await res.json();

      if (res.ok && data.isServiceable) {
        const info = {
          code: targetCode,
          city: data.city || '',
          state: data.state || ''
        };
        localStorage.setItem('verifiedPincode', JSON.stringify(info));
        setVerifiedInfo(info);
        setStatus({
          isServiceable: true,
          message: `✅ Serviceable: ${targetCode} (${data.city || 'Local Area'})`
        });
        if (onVerifiedRef.current) onVerifiedRef.current(true, targetCode, info);
      } else {
        setStatus({
          isServiceable: false,
          message: '❌ Pincode not available — we do not service this area yet.'
        });
        if (onVerifiedRef.current) onVerifiedRef.current(false, null, null);
      }
    } catch (err) {
      setStatus({
        isServiceable: false,
        message: '❌ Could not verify pincode. Please try again.'
      });
      if (onVerifiedRef.current) onVerifiedRef.current(false, null, null);
    } finally {
      setChecking(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setStatus({
        isServiceable: false,
        message: '⚠️ Geolocation is not supported by your browser.'
      });
      return;
    }

    setDetecting(true);
    setStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Nominatim free reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const rawPostcode = data.address?.postcode || data.display_name?.match(/\b[1-9][0-9]{5}\b/)?.[0];

          if (rawPostcode && rawPostcode.replace(/\D/g, '').length === 6) {
            const cleanPostcode = rawPostcode.replace(/\D/g, '').slice(0, 6);
            setPincode(cleanPostcode);
            // Auto check detected postcode
            await handleCheck(cleanPostcode);
          } else {
            setStatus({
              isServiceable: false,
              message: '⚠️ Could not detect a valid 6-digit pincode from your location. Please enter manually.'
            });
          }
        } catch (err) {
          setStatus({
            isServiceable: false,
            message: '⚠️ Error auto-detecting location. Please enter pincode manually.'
          });
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setStatus({
          isServiceable: false,
          message: '⚠️ Geolocation permission denied or unavailable. Please enter pincode manually.'
        });
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  const handleClear = () => {
    localStorage.removeItem('verifiedPincode');
    setVerifiedInfo(null);
    setPincode('');
    setStatus(null);
    if (onVerifiedRef.current) onVerifiedRef.current(false, null, null);
  };

  if (verifiedInfo) {
    return (
      <div ref={containerRef} className={`bg-[#DCFCE7] border border-[#BBF7D0] rounded-[24px] p-5 sm:p-6 mb-6 flex justify-between items-center shadow-xs ${className}`}>
        <div>
          <p className="text-xs font-black text-[#166534] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Service Area Confirmed ✓
          </p>
          <p className="text-base sm:text-lg font-black text-[#166534]">
            {verifiedInfo.code} ({verifiedInfo.city || 'Local Area'}{verifiedInfo.state ? `, ${verifiedInfo.state}` : ''})
          </p>
          {serviceText && (
            <p className="text-xs font-semibold text-[#15803d] mt-1">
              {serviceText}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-bold text-[#166534] bg-white border border-[#BBF7D0] px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer shadow-2xs shrink-0"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`bg-white border border-slate-200 rounded-[28px] p-6 mb-6 space-y-3.5 shadow-xs ${className}`}>
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {icon}
          <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <span>{title}</span>
            {isMandatory && <span className="text-rose-500 font-extrabold text-sm leading-none">*</span>}
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDetectLocation}
            className="text-xs font-bold text-[#2563EB] hover:text-blue-700 hover:underline flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
            disabled={detecting || checking}
          >
            {detecting ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5 text-[#2563EB]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Detecting location...
              </span>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                <span>Use Current Location</span>
              </>
            )}
          </button>

          {showMandatoryBadge && (
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border text-amber-800 bg-amber-50 border-amber-200">
              Mandatory Field
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 leading-relaxed">
          {subtitle}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheck();
        }}
        className="flex gap-2.5 max-w-md"
      >
        <input
          ref={inputRef}
          type="tel"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(val);
            if (val.length === 6) {
              handleCheck(val);
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-sans outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 bg-white transition-all tracking-wider font-bold"
          disabled={detecting || checking}
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center min-w-[85px] shadow-xs active:scale-95"
          disabled={pincode.length !== 6 || checking || detecting}
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {status && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            status.isServiceable
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
});

export default PincodeBox;

