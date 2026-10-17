import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Smartphone, Laptop, CheckCircle, Send, MessageCircle } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

export default function ComingSoonPage({ navItem }) {
  const location = useLocation();
  const [contactInput, setContactInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Extract friendly title and custom message
  const rawTitle = navItem?.label || 'This Feature';
  const customMessage = navItem?.comingSoonMessage || 
    "We are actively working behind the scenes to bring you certified, top-quality services with the best pricing. Stay tuned!";

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (!contactInput.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-white to-[#E8F6F7]/30 flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      <SEOHead
        title={`${rawTitle} — Coming Soon | SecondSale`}
        description={`${rawTitle} is coming soon on SecondSale. Stay tuned for the best deals, verified gadgets, and doorstep convenience.`}
        path={location.pathname}
      />

      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#087F8C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Coming Soon Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-800 text-xs font-black uppercase tracking-wider mb-6 shadow-xs">
          <Clock size={14} className="text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Under Development</span>
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <Sparkles size={13} className="text-amber-500" />
        </div>

        {/* Dynamic Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          <span className="text-[#087F8C]">{rawTitle}</span> is Launching Soon!
        </h1>

        {/* Message */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
          {customMessage}
        </p>

        {/* Notification Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-[#087F8C]/5 max-w-lg mx-auto mb-10">
          <h3 className="text-sm font-bold text-slate-800 mb-1.5">
            Be the First to Know When We Launch
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Enter your email or 10-digit mobile number for early access and launch discounts.
          </p>

          {subscribed ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in">
              <CheckCircle size={16} className="text-emerald-600" />
              <span>Thank you! We&apos;ll notify you the moment {rawTitle} goes live.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                placeholder="Enter email or phone number"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15 outline-none transition"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#087F8C] hover:bg-[#066772] text-white text-xs font-black rounded-xl shadow-md shadow-[#087F8C]/25 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Notify Me</span>
                <Send size={13} />
              </button>
            </form>
          )}
        </div>

        {/* Alternative Services / Quick Actions */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            In the meantime, you can sell your old gadgets with instant cashout:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/sell-old-mobile-phones/brand"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E8F6F7] border border-slate-200 hover:border-[#087F8C]/40 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              <Smartphone size={15} className="text-[#087F8C]" />
              <span>Sell Mobile Phones</span>
            </Link>

            <Link
              to="/sell-old-laptops/brand"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E8F6F7] border border-slate-200 hover:border-[#087F8C]/40 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              <Laptop size={15} className="text-[#087F8C]" />
              <span>Sell Laptops</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* WhatsApp Inquiry */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 max-w-sm mx-auto text-center">
          <a
            href={`https://wa.me/917045180009?text=${encodeURIComponent(`Hi SecondSale team, I saw ${rawTitle} is coming soon. Can you share more details?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <MessageCircle size={15} className="text-emerald-600" />
            <span>Have questions? Chat with our team on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
