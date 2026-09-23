import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Lock, X, AlertCircle, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function EvaluationOtpModal({
  isOpen,
  onClose,
  onSuccess,
  deviceName = "your device",
}) {
  const { user, sendOtp, verifyOtp } = useAuth();

  const [otpPhone, setOtpPhone] = useState(user?.phone || "");
  const [otpCode, setOtpCode] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [otpStep, setOtpStep] = useState("phone"); // 'phone' | 'otp'
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Sync user phone when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user?.phone) {
        setOtpPhone(user.phone.replace(/\D/g, "").slice(-10));
      }
      setOtpCode("");
      setOtpError("");
      setOtpStep("phone");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = otpPhone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setOtpError("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const data = await sendOtp(cleanPhone);
      setOtpSessionId(data?.sessionId || `session-${Date.now()}`);
      setOtpStep("otp");
    } catch (err) {
      setOtpError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = otpPhone.replace(/\D/g, "").slice(-10);
    if (!otpCode || otpCode.length < 4) {
      setOtpError("Please enter the verification code sent to your phone");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const result = await verifyOtp({
        phone: cleanPhone,
        code: otpCode,
        sessionId: otpSessionId || `session-${Date.now()}`,
      });
      if (onSuccess) {
        onSuccess({ phone: cleanPhone, user: result?.user || user });
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setOtpError(
        err?.response?.data?.message || "Invalid OTP code. Testing mode: enter 123456."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative p-6 sm:p-8">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F6F7] text-[#087F8C] flex items-center justify-center mx-auto mb-3">
            <Lock size={26} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#087F8C] bg-[#E8F6F7] px-3 py-1 rounded-full border border-[#087F8C]/20">
            Verification Required
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">Unlock Your Exact Valuation</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {otpStep === "phone"
              ? `Enter your mobile number to get the highest verified quote for ${deviceName}.`
              : `Enter the verification code sent to +91 ${otpPhone.slice(-10)}`}
          </p>
        </div>

        {otpError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-bold">
            <AlertCircle size={14} className="shrink-0" />
            <span>{otpError}</span>
          </div>
        )}

        {otpStep === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Mobile Number</label>
                <button
                  type="button"
                  onClick={() => {
                    setOtpPhone("9876543210");
                    setOtpError("");
                  }}
                  className="text-[11px] font-bold text-[#087F8C] hover:underline cursor-pointer"
                >
                  Fill demo number
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit phone number"
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full py-4 btn-gradient text-white font-black text-sm rounded-xl transition shadow-lg shadow-[#087F8C]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {otpLoading ? (
                "Sending Verification Code..."
              ) : (
                <>
                  <span>Send OTP to Unlock Price</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Enter Verification Code (OTP)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode("123456");
                    setOtpError("");
                  }}
                  className="text-[11px] font-bold text-[#087F8C] hover:underline cursor-pointer"
                >
                  Auto-fill 123456
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 4 or 6-digit OTP"
                autoFocus
                className="w-full text-center tracking-widest text-2xl py-3 rounded-xl border border-slate-200 font-black text-slate-900 focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15 outline-none transition"
              />
              <div className="mt-2 py-1.5 px-3 bg-[#E8F6F7] border border-[#087F8C]/25 rounded-lg text-center">
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode("123456");
                    setOtpError("");
                  }}
                  className="w-full text-[11px] font-bold text-[#116466] flex items-center justify-center gap-1 cursor-pointer hover:underline"
                >
                  <CheckCircle2 size={13} className="text-[#087F8C] shrink-0" />
                  <span>Testing mode: <u>Click to use dummy OTP 123456</u></span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full py-4 btn-gradient text-white font-black text-sm rounded-xl transition shadow-lg shadow-[#087F8C]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {otpLoading ? "Verifying..." : "Verify & Reveal Valuation Price ✓"}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setOtpStep("phone");
                  setOtpError("");
                }}
                className="text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
              >
                ← Change Number
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="text-[#087F8C] font-bold hover:underline cursor-pointer"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={12} className="text-[#087F8C]" />
            Your number is 100% safe. Zero spam, guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
