import React from 'react';
import { X, Sparkles } from 'lucide-react';

// Illustration for 'Repair at Home' matching Cashify benchmark
function RepairHomeIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      {/* Background Soft Splash */}
      <circle cx="70" cy="70" r="54" fill="#E8F6F7" />
      
      {/* Smartphone on right */}
      <rect x="70" y="32" width="44" height="74" rx="8" stroke="#1E293B" strokeWidth="2.5" fill="#FFFFFF" />
      <rect x="75" y="38" width="34" height="60" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="88" y1="35" x2="96" y2="35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      
      {/* Teal Floating Tech Gear */}
      <circle cx="92" cy="68" r="14" fill="#38BDF8" fillOpacity="0.4" stroke="#087F8C" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="92" cy="68" r="6" fill="#087F8C" />
      <path d="M92 50V54M92 82V86M74 68H78M106 68H110" stroke="#087F8C" strokeWidth="2" strokeLinecap="round" />
      <circle cx="68" cy="46" r="8" fill="#14B8A6" fillOpacity="0.3" stroke="#087F8C" strokeWidth="1.5" />
      <circle cx="68" cy="46" r="3" fill="#087F8C" />

      {/* Expert Technician Character on left */}
      {/* Head & Hair */}
      <circle cx="48" cy="44" r="9" fill="#FBD5BD" />
      <path d="M42 41C42 36 46 34 52 35C57 36 57 41 54 43C51 44 47 44 42 41Z" fill="#1E293B" />
      {/* Neck */}
      <rect x="46" y="52" width="4" height="4" fill="#FBD5BD" />
      {/* Shirt / Body (Teal uniform) */}
      <path d="M40 56C36 58 35 63 35 76H59C59 63 58 58 54 56L48 60L40 56Z" fill="#087F8C" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      {/* Tie */}
      <path d="M47 58L49 58L50 67L48 70L46 67L47 58Z" fill="#1E293B" />
      {/* Right Arm holding precision screwdriver */}
      <path d="M56 61L68 52L72 56L59 67" fill="#087F8C" />
      <rect x="70" y="47" width="16" height="4" rx="2" transform="rotate(30 70 47)" fill="#1E293B" />
      <line x1="84" y1="56" x2="90" y2="62" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Arm */}
      <path d="M38 61L32 72H37L41 65" fill="#087F8C" />
      {/* Legs / Trousers */}
      <path d="M41 76L39 96H44L47 84L49 96H54L52 76H41Z" fill="#1E293B" />
    </svg>
  );
}

// Illustration for 'Repair at Store' matching Cashify benchmark
function RepairStoreIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      {/* Background Soft Splash */}
      <circle cx="70" cy="70" r="54" fill="#E8F6F7" />
      
      {/* Store Building on right */}
      <rect x="64" y="60" width="54" height="46" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      {/* Striped Awning */}
      <path d="M60 50H122L118 62H64L60 50Z" fill="#087F8C" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      <path d="M72 50L75 62M86 50L87 62M100 50L99 62M112 50L109 62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      {/* Scalloped Edge of Awning */}
      <path d="M64 62C66 64 70 64 72 62C74 64 78 64 80 62C82 64 86 64 88 62C90 64 94 64 96 62C98 64 102 64 104 62C106 64 110 64 112 62C114 64 116 64 118 62" stroke="#1E293B" strokeWidth="1.5" fill="#087F8C" />
      {/* Door & Window */}
      <rect x="70" y="74" width="16" height="32" rx="2" fill="#E0F2FE" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="82" y1="90" x2="82" y2="94" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <rect x="94" y="74" width="18" height="18" rx="2" fill="#F0FDFA" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="103" y1="74" x2="103" y2="92" stroke="#94A3B8" strokeWidth="1" />
      <line x1="94" y1="83" x2="112" y2="83" stroke="#94A3B8" strokeWidth="1" />

      {/* Customer Character holding phone on left */}
      {/* Head & Hair */}
      <circle cx="44" cy="50" r="9" fill="#FBD5BD" />
      <path d="M37 47C36 43 40 40 48 40C54 40 55 45 53 48C51 51 46 51 41 51C37 51 36 49 37 47Z" fill="#14B8A6" />
      {/* Hair Bun / Long Hair back */}
      <path d="M37 48C35 52 36 60 41 62" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
      {/* Top / Body */}
      <path d="M36 62C32 64 30 70 30 84H56C56 70 54 64 50 62L43 65L36 62Z" fill="#99F6E4" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      {/* Hand holding Smartphone */}
      <path d="M52 68L58 64L62 70" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <rect x="58" y="60" width="7" height="13" rx="1.5" stroke="#1E293B" strokeWidth="1.5" fill="#FFFFFF" transform="rotate(10 58 60)" />
      {/* Trousers / Legs */}
      <path d="M36 84L34 104H40L43 92L46 104H52L50 84H36Z" fill="#14B8A6" />
    </svg>
  );
}

export default function RepairOptionModal({ isOpen, onClose, onSelect, modelName = 'Device' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-[560px] rounded-[28px] sm:rounded-[36px] shadow-2xl p-6 sm:p-8 animate-scaleUp z-10 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Choose an Option
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-4">
          {/* 1. Repair at Home */}
          <button
            type="button"
            onClick={() => onSelect('home')}
            className="w-full text-left p-5 sm:p-6 rounded-[24px] border-2 border-gray-100 bg-[#FBFDFD] hover:bg-white hover:border-[#087F8C] hover:shadow-lg hover:shadow-[#087F8C]/10 transition-all flex items-center gap-4 sm:gap-6 group cursor-pointer"
          >
            <RepairHomeIllustration />
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-[#087F8C] transition-colors leading-snug">
                Repair at Home
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mt-1">
                Just book and Relax! We'll send our expert technician at your doorstep and get your phone repaired instantly.
              </p>
            </div>
          </button>

          {/* 2. Repair at Store (with Extra ₹350 OFF) */}
          <button
            type="button"
            onClick={() => onSelect('store')}
            className="w-full text-left p-5 sm:p-6 rounded-[24px] border-2 border-emerald-100 bg-[#F6FEF9] hover:bg-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/15 transition-all flex items-center gap-4 sm:gap-6 group cursor-pointer relative overflow-hidden"
          >
            <RepairStoreIllustration />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  Repair at Store
                </h3>
                <span className="inline-flex items-center gap-1 bg-[#10B981] text-white font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs animate-pulse">
                  <Sparkles size={11} className="text-amber-200 fill-amber-200" />
                  Get Extra ₹350 OFF
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mt-1">
                Visit Nearest SecondSale Store and avail expert repair on the spot with guaranteed instant ₹350 discount.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
