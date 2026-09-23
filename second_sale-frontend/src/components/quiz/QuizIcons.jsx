// ==========================================
// 1. SMARTPHONE & TABLET SCREEN CONDITION ICONS
// ==========================================

export const PhoneScreenScratchesIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Device Body */}
    <rect x="2" y="2" width={isTablet ? 36 : 32} height="60" rx={isTablet ? 6 : 8} stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    {/* Screen Boundary */}
    <rect x="5" y="6" width={isTablet ? 30 : 26} height="52" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    {/* Speaker / Notch */}
    <rect x={isTablet ? "17" : "15"} y="4" width={isTablet ? "6" : "6"} height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Hairline Scratches on screen */}
    <path d="M12 18L19 28" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    <path d="M17 19L23 25" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    <path d="M10 40L16 46" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const PhoneScreenCrackedIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width={isTablet ? 36 : 32} height="60" rx={isTablet ? 6 : 8} stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    <rect x="5" y="6" width={isTablet ? 30 : 26} height="52" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <rect x={isTablet ? "17" : "15"} y="4" width="6" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Crack Lines across screen */}
    <path d="M5 24L14 30L20 22L28 34L31 32" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 30L11 42L18 48" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 22L26 14" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PhoneScreenFaultyIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width={isTablet ? 36 : 32} height="60" rx={isTablet ? 6 : 8} stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    <rect x="5" y="6" width={isTablet ? 30 : 26} height="52" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <rect x={isTablet ? "17" : "15"} y="4" width="6" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Display Lines */}
    <line x1="14" y1="8" x2="14" y2="56" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 1" />
    <line x1="18" y1="8" x2="18" y2="56" stroke="#8B5CF6" strokeWidth="1.5" />
    {/* Display Spots */}
    <circle cx="24" cy="28" r="3" fill="#3B82F6" opacity="0.6" />
    <circle cx="23" cy="42" r="2" fill="#F59E0B" opacity="0.7" />
  </svg>
);

export const PhoneScreenDeadIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width={isTablet ? 36 : 32} height="60" rx={isTablet ? 6 : 8} stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    <rect x="5" y="6" width={isTablet ? 30 : 26} height="52" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
    <rect x={isTablet ? "17" : "15"} y="4" width="6" height="1.5" rx="0.75" fill="#64748B" />
    {/* Ink Bleed / Dead Patch */}
    <path d="M12 22C14 18 20 19 23 23C26 27 24 33 21 35C18 37 13 36 11 32C9 28 10 24 12 22Z" fill="#000000" stroke="#38BDF8" strokeWidth="1" opacity="0.9" />
    <circle cx="16" cy="42" r="4.5" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1" />
  </svg>
);

// ==========================================
// 2. PHONE & TABLET BODY CONDITION ICONS
// ==========================================

export const PhoneBodyGoodIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 46 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="4" width={isTablet ? 34 : 28} height="56" rx={isTablet ? 6 : 8} stroke="#059669" strokeWidth="2.5" fill="#ECFDF5" />
    <rect x="7" y="8" width={isTablet ? 28 : 22} height="48" rx="4" fill="#FFFFFF" stroke="#D1FAE5" strokeWidth="1" />
    <rect x={isTablet ? "18" : "15"} y="6" width="6" height="1.5" rx="0.75" fill="#10B981" />
    {/* Sparkle Clean Indicator */}
    <path d="M37 6L38.5 10L42.5 11.5L38.5 13L37 17L35.5 13L31.5 11.5L35.5 10L37 6Z" fill="#10B981" />
  </svg>
);

export const PhoneBodyAverageIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="4" width={isTablet ? 34 : 28} height="56" rx={isTablet ? 6 : 8} stroke="#D97706" strokeWidth="2.5" fill="#FFFBEB" />
    <rect x="7" y="8" width={isTablet ? 28 : 22} height="48" rx="4" fill="#FFFFFF" stroke="#FEF3C7" strokeWidth="1" />
    <rect x={isTablet ? "18" : "15"} y="6" width="6" height="1.5" rx="0.75" fill="#F59E0B" />
    {/* Wear / Scuffs on outer frame */}
    <path d="M32 20L34 22" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 24L35 27" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 40L4 42" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PhoneBodyBelowAverageIcon = ({ className = "w-10 h-16", isTablet = false }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Frame with visible dents */}
    <path
      d="M12 4H24C28.4183 4 32 7.58172 32 12V24L30 26L32 28V52C32 56.4183 28.4183 60 24 60H12C7.58172 60 4 56.4183 4 52V42L6 40L4 38V12C4 7.58172 7.58172 4 12 4Z"
      stroke="#DC2626"
      strokeWidth="2.5"
      fill="#FEF2F2"
    />
    <rect x="7" y="8" width={isTablet ? 26 : 22} height="48" rx="4" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="1" />
    {/* Dent impact notches */}
    <path d="M32 24L29 26L32 28" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 38L7 40L4 42" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 60L14 57L16 60" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ==========================================
// 3. HARDWARE & TECHNICAL ISSUE ICONS
// ==========================================

export const BatteryWarningIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="16" height="12" rx="2" fill="#FEF3C7" stroke="#D97706" />
    <path d="M18 11V15" stroke="#D97706" strokeWidth="2.5" />
    <line x1="7" y1="13" x2="13" y2="13" stroke="#DC2626" strokeWidth="2.5" />
    <path d="M10 10L10 16" stroke="#DC2626" strokeWidth="2.5" />
  </svg>
);

export const FrontCameraIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="4" stroke="#087F8C" fill="#E8F6F7" />
    <circle cx="12" cy="12" r="4" stroke="#087F8C" strokeWidth="2" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="1.5" fill="#087F8C" />
    <circle cx="16.5" cy="7.5" r="1" fill="#3B82F6" />
  </svg>
);

export const BackCameraIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="3" width="16" height="18" rx="4" stroke="#1E293B" fill="#F1F5F9" />
    <circle cx="9" cy="8" r="2.5" stroke="#087F8C" strokeWidth="2" fill="#FFFFFF" />
    <circle cx="15" cy="8" r="2.5" stroke="#087F8C" strokeWidth="2" fill="#FFFFFF" />
    <circle cx="12" cy="15" r="2.5" stroke="#087F8C" strokeWidth="2" fill="#FFFFFF" />
  </svg>
);

export const VolumeButtonIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="3" width="12" height="18" rx="3" stroke="#475569" fill="#F8FAFC" />
    <rect x="3" y="6" width="3" height="4" rx="1" fill="#087F8C" stroke="#066772" />
    <rect x="3" y="12" width="3" height="4" rx="1" fill="#087F8C" stroke="#066772" />
    <line x1="12" y1="7" x2="12" y2="17" stroke="#CBD5E1" strokeWidth="1.5" />
  </svg>
);

export const WifiSignalIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12.55C7.03 10.96 9.48 10 12 10C14.52 10 16.97 10.96 19 12.55" stroke="#087F8C" />
    <path d="M1.42 9C4.48 6.53 8.16 5 12 5C15.84 5 19.52 6.53 22.58 9" stroke="#087F8C" />
    <path d="M8.53 16.11C9.56 15.41 10.76 15 12 15C13.24 15 14.44 15.41 15.47 16.11" stroke="#087F8C" />
    <circle cx="12" cy="19" r="1.5" fill="#087F8C" stroke="#087F8C" />
  </svg>
);

export const FingerTouchIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11Z" stroke="#087F8C" />
    <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12V16C16 18.21 14.21 20 12 20C9.79 20 8 18.21 8 16V12Z" stroke="#087F8C" strokeDasharray="2 2" />
    <path d="M5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12V16C19 19.87 15.87 23 12 23" stroke="#087F8C" />
  </svg>
);

export const FaceScanIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7V5C3 3.9 3.9 3 5 3H7" stroke="#087F8C" />
    <path d="M17 3H19C20.1 3 21 3.9 21 5V7" stroke="#087F8C" />
    <path d="M21 17V19C21 20.1 20.1 21 19 21H17" stroke="#087F8C" />
    <path d="M7 21H5C3.9 21 3 20.1 3 19V17" stroke="#087F8C" />
    <circle cx="9" cy="10" r="1" fill="#087F8C" />
    <circle cx="15" cy="10" r="1" fill="#087F8C" />
    <path d="M10 14C10.5 15 11.2 15.5 12 15.5C12.8 15.5 13.5 15 14 14" stroke="#087F8C" />
  </svg>
);

export const SpeakerIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="#087F8C" fill="#E8F6F7" />
    <path d="M15.54 8.46C16.48 9.4 17 10.65 17 12C17 13.35 16.48 14.6 15.54 15.54" stroke="#087F8C" />
    <path d="M19.07 4.93C20.94 6.81 22 9.34 22 12C22 14.66 20.94 17.19 19.07 19.07" stroke="#087F8C" />
  </svg>
);

export const PowerButtonIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18.36 6.64C20 8.28 20.98 10.52 20.98 13C20.98 17.97 16.96 22 12 22C7.04 22 3.02 17.97 3.02 13C3.02 10.52 4 8.28 5.64 6.64" stroke="#EF4444" strokeWidth="2.5" />
    <line x1="12" y1="2" x2="12" y2="12" stroke="#EF4444" strokeWidth="2.5" />
  </svg>
);

export const ChargingPortIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="8" width="14" height="8" rx="4" stroke="#087F8C" strokeWidth="2" fill="#E8F6F7" />
    <path d="M8 12H16" stroke="#087F8C" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 2V5" stroke="#087F8C" strokeWidth="2" />
    <path d="M12 19V22" stroke="#087F8C" strokeWidth="2" />
  </svg>
);

export const UsbPortIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="#1E293B" strokeWidth="2" fill="#F8FAFC" />
    <rect x="6" y="9" width="12" height="6" rx="1" fill="#3B82F6" stroke="#087F8C" />
    <line x1="9" y1="9" x2="9" y2="15" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="15" y1="9" x2="15" y2="15" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

export const BluetoothIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" stroke="#087F8C" strokeWidth="2.2" />
  </svg>
);

export const VibratorIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="5" width="8" height="14" rx="2" stroke="#1E293B" fill="#F8FAFC" />
    <path d="M4 8C3 10 3 14 4 16" stroke="#087F8C" strokeWidth="2" />
    <path d="M20 8C21 10 21 14 20 16" stroke="#087F8C" strokeWidth="2" />
    <path d="M1 9C0 11 0 13 1 15" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M23 9C24 11 24 13 23 15" stroke="#94A3B8" strokeWidth="1.5" />
  </svg>
);

export const MicrophoneIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#087F8C" fill="#E8F6F7" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#087F8C" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="#087F8C" />
    <line x1="8" y1="23" x2="16" y2="23" stroke="#087F8C" />
  </svg>
);

export const ProximitySensorIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" stroke="#087F8C" fill="#E8F6F7" />
    <path d="M6 18C4 16 3 14 3 12C3 10 4 8 6 6" stroke="#087F8C" />
    <path d="M18 6C20 8 21 10 21 12C21 14 20 16 18 18" stroke="#087F8C" />
  </svg>
);

export const SilentSwitchIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#EF4444" />
    <path d="M18.63 13A17.89 17.89 0 0 1 18 8" stroke="#EF4444" />
    <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" stroke="#EF4444" />
    <path d="M18 8a6 6 0 0 0-9.33-5" stroke="#EF4444" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="#EF4444" strokeWidth="2" />
  </svg>
);

// ==========================================
// 4. LAPTOP & PC COMPONENT ICONS
// ==========================================

export const KeyboardIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#1E293B" fill="#F8FAFC" />
    <line x1="6" y1="8" x2="6.01" y2="8" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="10" y1="8" x2="10.01" y2="8" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="14" y1="8" x2="14.01" y2="8" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="18" y1="8" x2="18.01" y2="8" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="6" y1="12" x2="6.01" y2="12" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="10" y1="12" x2="10.01" y2="12" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="14" y1="12" x2="14.01" y2="12" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="18" y1="12" x2="18.01" y2="12" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="7" y1="16" x2="17" y2="16" stroke="#087F8C" strokeWidth="2" />
  </svg>
);

export const TrackpadIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="#1E293B" fill="#F8FAFC" />
    <line x1="12" y1="14" x2="12" y2="19" stroke="#94A3B8" />
    <line x1="3" y1="14" x2="21" y2="14" stroke="#CBD5E1" />
  </svg>
);

export const MotherboardIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#059669" fill="#ECFDF5" />
    <rect x="8" y="8" width="8" height="8" rx="1" stroke="#059669" fill="#10B981" />
    <line x1="4" y1="9" x2="2" y2="9" stroke="#059669" strokeWidth="2" />
    <line x1="4" y1="14" x2="2" y2="14" stroke="#059669" strokeWidth="2" />
    <line x1="20" y1="9" x2="22" y2="9" stroke="#059669" strokeWidth="2" />
    <line x1="20" y1="14" x2="22" y2="14" stroke="#059669" strokeWidth="2" />
    <line x1="9" y1="4" x2="9" y2="2" stroke="#059669" strokeWidth="2" />
    <line x1="14" y1="4" x2="14" y2="2" stroke="#059669" strokeWidth="2" />
    <line x1="9" y1="20" x2="9" y2="22" stroke="#059669" strokeWidth="2" />
    <line x1="14" y1="20" x2="14" y2="22" stroke="#059669" strokeWidth="2" />
  </svg>
);

export const HardDriveIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#1E293B" fill="#F8FAFC" />
    <line x1="3" y1="15" x2="21" y2="15" stroke="#CBD5E1" />
    <circle cx="17" cy="17.5" r="1" fill="#087F8C" />
  </svg>
);

export const WebcamIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="10" r="8" stroke="#1E293B" fill="#F1F5F9" />
    <circle cx="12" cy="10" r="3" stroke="#087F8C" fill="#087F8C" />
    <circle cx="13" cy="9" r="1" fill="#FFFFFF" />
    <path d="M7 22H17" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V22" stroke="#1E293B" strokeWidth="2" />
  </svg>
);

// ==========================================
// 5. ACCESSORIES ICONS
// ==========================================

export const BillDocumentIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#059669" fill="#ECFDF5" />
    <polyline points="14 2 14 8 20 8" stroke="#059669" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="#059669" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="#059669" />
    <line x1="10" y1="9" x2="8" y2="9" stroke="#059669" />
  </svg>
);

export const BoxPackagingIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#D97706" fill="#FFFBEB" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#D97706" />
    <line x1="12" y1="22.08" x2="12" y2="12" stroke="#D97706" />
  </svg>
);

export const ChargerPlugIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="7" y="10" width="10" height="11" rx="2" stroke="#087F8C" fill="#E8F6F7" />
    <line x1="9" y1="10" x2="9" y2="4" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="15" y1="10" x2="15" y2="4" stroke="#087F8C" strokeWidth="2.5" />
    <path d="M12 21V23" stroke="#087F8C" strokeWidth="2" />
  </svg>
);

export const OpticalDiscIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#64748B" fill="#F8FAFC" />
    <circle cx="12" cy="12" r="3" stroke="#087F8C" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="1" fill="#087F8C" />
  </svg>
);

// ==========================================
// 6. SMARTWATCH SPECIFIC ICONS
// ==========================================

export const WatchScreenScratchesIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Straps */}
    <rect x="15" y="1" width="18" height="11" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    <rect x="15" y="52" width="18" height="11" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    {/* Watch Case */}
    <rect x="8" y="10" width="32" height="44" rx="10" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    <rect x="12" y="14" width="24" height="36" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    {/* Crown Button */}
    <rect x="40" y="22" width="2.5" height="8" rx="1" fill="#475569" />
    {/* Hairline Scratches */}
    <path d="M17 25L24 35" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 26L28 32" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M16 40L21 45" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const WatchScreenCrackedIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="1" width="18" height="11" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    <rect x="15" y="52" width="18" height="11" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    <rect x="8" y="10" width="32" height="44" rx="10" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    <rect x="12" y="14" width="24" height="36" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <rect x="40" y="22" width="2.5" height="8" rx="1" fill="#475569" />
    {/* Crack Lines */}
    <path d="M12 28L20 34L26 26L34 38L36 36" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 34L18 44L23 48" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const WatchScreenFaultyIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="1" width="18" height="11" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    <rect x="15" y="52" width="18" height="11" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
    <rect x="8" y="10" width="32" height="44" rx="10" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
    <rect x="12" y="14" width="24" height="36" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1" />
    <rect x="40" y="22" width="2.5" height="8" rx="1" fill="#475569" />
    {/* Display Lines and Glitch */}
    <line x1="20" y1="16" x2="20" y2="48" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 1" />
    <circle cx="28" cy="30" r="3" fill="#EF4444" opacity="0.8" />
  </svg>
);

export const WatchBodyGoodIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="1" width="18" height="11" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1.5" opacity="0.3" />
    <rect x="15" y="52" width="18" height="11" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1.5" opacity="0.3" />
    <rect x="8" y="10" width="32" height="44" rx="10" stroke="#059669" strokeWidth="2.5" fill="#ECFDF5" />
    <rect x="12" y="14" width="24" height="36" rx="6" fill="#FFFFFF" stroke="#D1FAE5" strokeWidth="1" />
    <rect x="40" y="22" width="2.5" height="8" rx="1" fill="#059669" />
    {/* Sparkle */}
    <path d="M38 12L39 15L42 16L39 17L38 20L37 17L34 16L37 15L38 12Z" fill="#10B981" />
  </svg>
);

export const WatchBodyAverageIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="1" width="18" height="11" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" opacity="0.3" />
    <rect x="15" y="52" width="18" height="11" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" opacity="0.3" />
    <rect x="8" y="10" width="32" height="44" rx="10" stroke="#D97706" strokeWidth="2.5" fill="#FFFBEB" />
    <rect x="12" y="14" width="24" height="36" rx="6" fill="#FFFFFF" stroke="#FEF3C7" strokeWidth="1" />
    <rect x="40" y="22" width="2.5" height="8" rx="1" fill="#D97706" />
    {/* Edge scuffs */}
    <path d="M6 24L10 28" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 30L9 33" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const WatchBodyDamagedIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="1" width="18" height="11" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" opacity="0.3" />
    <rect x="15" y="52" width="18" height="11" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" opacity="0.3" />
    <rect x="8" y="10" width="32" height="44" rx="10" stroke="#DC2626" strokeWidth="2.5" fill="#FEF2F2" />
    <rect x="12" y="14" width="24" height="36" rx="6" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="1" />
    <rect x="40" y="22" width="2.5" height="8" rx="1" fill="#DC2626" />
    {/* Dent impact */}
    <path d="M8 26L12 28L8 30" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 38L37 40L40 42" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WatchCrownIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="8" stroke="#087F8C" fill="#E8F6F7" />
    <circle cx="12" cy="12" r="3" stroke="#087F8C" />
    <path d="M12 4V7" stroke="#087F8C" strokeWidth="2" />
    <path d="M12 17V20" stroke="#087F8C" strokeWidth="2" />
    <path d="M4 12H7" stroke="#087F8C" strokeWidth="2" />
    <path d="M17 12H20" stroke="#087F8C" strokeWidth="2" />
  </svg>
);

export const HeartSensorIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#EF4444" fill="#FEF2F2" />
    <polyline points="7.5 12 10 9.5 11.5 14 13.5 10 15 12 16.5 12" stroke="#DC2626" strokeWidth="1.8" />
  </svg>
);

export const WatchStrapIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="7" y="2" width="10" height="20" rx="3" stroke="#475569" fill="#F8FAFC" />
    <circle cx="12" cy="8" r="1.25" fill="#087F8C" />
    <circle cx="12" cy="12" r="1.25" fill="#087F8C" />
    <circle cx="12" cy="16" r="1.25" fill="#087F8C" />
    <line x1="7" y1="5" x2="17" y2="5" stroke="#94A3B8" />
  </svg>
);

export const MagneticChargerIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="10" r="7" stroke="#087F8C" fill="#E8F6F7" />
    <circle cx="10" cy="10" r="3.5" stroke="#087F8C" strokeWidth="1.5" />
    <path d="M17 10C19 10 20 12 20 14V21" stroke="#087F8C" strokeWidth="2" />
    <path d="M8.5 8.5L11.5 11.5" stroke="#3B82F6" strokeWidth="1.5" />
  </svg>
);

// ==========================================
// 7. EARBUDS / AUDIO SPECIFIC ICONS
// ==========================================

export const EarbudsPairIcon = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Left Earbud */}
    <circle cx="9" cy="9" r="5" stroke="#087F8C" fill="#E8F6F7" />
    <path d="M12 11V22C12 23.1 11.1 24 10 24C8.9 24 8 23.1 8 22V13" stroke="#087F8C" strokeWidth="2" fill="#087F8C" />
    {/* Right Earbud */}
    <circle cx="23" cy="9" r="5" stroke="#087F8C" fill="#E8F6F7" />
    <path d="M20 11V22C20 23.1 20.9 24 22 24C23.1 24 24 23.1 24 22V13" stroke="#087F8C" strokeWidth="2" fill="#087F8C" />
  </svg>
);

export const EarbudsCaseIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="5" width="16" height="14" rx="6" stroke="#1E293B" fill="#F8FAFC" />
    <line x1="4" y1="10" x2="20" y2="10" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="12" cy="14" r="1.5" fill="#10B981" />
  </svg>
);

export const EarbudsMicSoundIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="9" r="4" stroke="#087F8C" fill="#E8F6F7" />
    <path d="M10 11V19C10 19.8 9.3 20.5 8.5 20.5C7.7 20.5 7 19.8 7 19V12" stroke="#087F8C" strokeWidth="1.8" fill="#087F8C" />
    <path d="M15 8C16.5 9.5 16.5 12.5 15 14" stroke="#087F8C" strokeWidth="2" />
    <path d="M18 5C20.5 7.5 20.5 14.5 18 17" stroke="#087F8C" strokeWidth="2" />
  </svg>
);

export const EarbudsDamagedIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="5" width="16" height="14" rx="6" stroke="#DC2626" fill="#FEF2F2" />
    <line x1="4" y1="10" x2="20" y2="10" stroke="#DC2626" strokeWidth="1.5" />
    <path d="M8 8L11 11L10 14L14 17" stroke="#DC2626" strokeWidth="1.75" />
  </svg>
);

// ==========================================
// 8. GAMING CONSOLE SPECIFIC ICONS
// ==========================================

export const ConsoleChassisFlawlessIcon = ({ className = "w-10 h-16" }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Modern Console Stand */}
    <rect x="10" y="56" width="20" height="4" rx="2" fill="#475569" />
    {/* Console Body */}
    <rect x="12" y="8" width="16" height="48" rx="4" stroke="#059669" strokeWidth="2.5" fill="#ECFDF5" />
    {/* Disc Slot */}
    <rect x="18" y="24" width="2" height="18" rx="1" fill="#059669" />
    {/* LED Lightbar */}
    <line x1="14" y1="12" x2="14" y2="48" stroke="#10B981" strokeWidth="1.5" />
    {/* Sparkle */}
    <path d="M30 6L31 8.5L33.5 9.5L31 10.5L30 13L29 10.5L26.5 9.5L29 8.5L30 6Z" fill="#10B981" />
  </svg>
);

export const ConsoleChassisScratchedIcon = ({ className = "w-10 h-16" }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="56" width="20" height="4" rx="2" fill="#475569" />
    <rect x="12" y="8" width="16" height="48" rx="4" stroke="#D97706" strokeWidth="2.5" fill="#FFFBEB" />
    <rect x="18" y="24" width="2" height="18" rx="1" fill="#D97706" />
    <line x1="14" y1="12" x2="14" y2="48" stroke="#F59E0B" strokeWidth="1.5" />
    {/* Scratches */}
    <path d="M22 18L26 24" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 28L25 32" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ConsoleChassisDamagedIcon = ({ className = "w-10 h-16" }) => (
  <svg viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="56" width="20" height="4" rx="2" fill="#475569" />
    <rect x="12" y="8" width="16" height="48" rx="4" stroke="#DC2626" strokeWidth="2.5" fill="#FEF2F2" />
    <rect x="18" y="24" width="2" height="18" rx="1" fill="#DC2626" />
    {/* Broken corner / crack */}
    <path d="M28 16L24 20L27 24" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ConsoleControllerIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 12h4m-2-2v4" stroke="#087F8C" strokeWidth="2" />
    <line x1="15" y1="11" x2="15.01" y2="11" stroke="#087F8C" strokeWidth="2.5" />
    <line x1="18" y1="13" x2="18.01" y2="13" stroke="#087F8C" strokeWidth="2.5" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" stroke="#1E293B" fill="#F8FAFC" />
  </svg>
);

export const ConsoleHdmiPortIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 6H20V14L17 18H7L4 14V6Z" stroke="#087F8C" fill="#E8F6F7" strokeWidth="2" />
    <rect x="7" y="9" width="10" height="4" rx="1" fill="#087F8C" />
  </svg>
);

export const ConsoleLanPortIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#087F8C" fill="#E8F6F7" strokeWidth="2" />
    <path d="M8 8V12H16V8" stroke="#087F8C" strokeWidth="1.5" />
    <rect x="9" y="14" width="6" height="3" fill="#087F8C" />
  </svg>
);

export const ConsolePowerCableIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v6" stroke="#087F8C" strokeWidth="2" />
    <path d="M7 8h10v5a5 5 0 0 1-10 0V8z" stroke="#1E293B" fill="#F8FAFC" strokeWidth="2" />
    <path d="M12 18v4" stroke="#087F8C" strokeWidth="2" />
  </svg>
);

// ==========================================
// 9. LAPTOP & MACBOOK SCREEN CONDITION ICONS (Cashify Exact)
// ==========================================

export const LaptopScreenFlawlessIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Screen Frame */}
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    {/* Camera dot */}
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    {/* Base & Trackpad Lip */}
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Star Sparkle */}
    <path d="M52 2L53 4.5L55.5 5.5L53 6.5L52 9L51 6.5L48.5 5.5L51 4.5L52 2Z" fill="#10B981" />
    <path d="M56 8L56.5 9.5L58 10L56.5 10.5L56 12L55.5 10.5L54 10L55.5 9.5L56 8Z" fill="#10B981" />
  </svg>
);

export const LaptopScreenMinorScratchesIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* 1-2 Scratches */}
    <line x1="22" y1="14" x2="26" y2="20" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="36" y1="18" x2="41" y2="24" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const LaptopScreenMajorScratchesIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Multiple Scratches */}
    <line x1="18" y1="13" x2="22" y2="19" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="26" y1="18" x2="30" y2="24" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="35" y1="12" x2="40" y2="18" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="42" y1="21" x2="46" y2="26" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const LaptopScreenCrackedIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Cracked glass */}
    <path d="M15 11L22 17L28 13L35 22L45 15" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 17L20 26L27 28" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M35 22L38 29" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LaptopScreenDiscolourMinorIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    {/* Minor yellowish edge discolouration */}
    <rect x="13" y="9" width="38" height="22" rx="1.5" stroke="#FDE68A" strokeWidth="3" fill="none" opacity="0.85" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
  </svg>
);

export const LaptopScreenDiscolourMajorIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#FEF3C7" />
    {/* Heavy amber / yellow discoloration patch */}
    <rect x="13" y="9" width="38" height="22" rx="1.5" stroke="#F59E0B" strokeWidth="4.5" fill="#FDE68A" opacity="0.6" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
  </svg>
);

export const LaptopScreenMinorSpotsIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* 1-2 Minor spots */}
    <circle cx="26" cy="18" r="2" fill="#3B82F6" opacity="0.75" />
    <circle cx="38" cy="22" r="1.5" fill="#3B82F6" opacity="0.65" />
  </svg>
);

export const LaptopScreenMajorSpotsIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Large / heavy visible spots */}
    <ellipse cx="28" cy="19" rx="6" ry="5" fill="#1E293B" opacity="0.75" />
    <circle cx="40" cy="22" r="3.5" fill="#334155" opacity="0.7" />
  </svg>
);

export const LaptopScreenVisibleLinesIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Visible vertical lines */}
    <line x1="24" y1="9" x2="24" y2="31" stroke="#EF4444" strokeWidth="1.5" />
    <line x1="32" y1="9" x2="32" y2="31" stroke="#06B6D4" strokeWidth="1.5" />
    <line x1="40" y1="9" x2="40" y2="31" stroke="#8B5CF6" strokeWidth="1.5" />
  </svg>
);

export const LaptopScreenFlickeringIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Jagged / flickering display lines */}
    <path d="M14 15L20 18L26 15L32 18L38 15L44 18L50 15" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 21L21 24L28 21L35 24L42 21L49 24" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 26L20 28L27 26L34 28L41 26L48 28" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const LaptopScreenBlackDotsIcon = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="6" width="44" height="28" rx="3" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" />
    <rect x="13" y="9" width="38" height="22" rx="1.5" fill="#F8FAFC" />
    <circle cx="32" cy="7.5" r="0.75" fill="#64748B" />
    <path d="M4 34H60L56 38H8L4 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="34.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />
    {/* Black dots cluster */}
    <circle cx="25" cy="16" r="1.5" fill="#000000" />
    <circle cx="28" cy="18" r="1.5" fill="#000000" />
    <circle cx="26" cy="21" r="1.5" fill="#000000" />
    <circle cx="42" cy="23" r="1.5" fill="#000000" />
    <circle cx="44" cy="21" r="1.5" fill="#000000" />
  </svg>
);

// ==========================================
// 8. CASHIFY SMARTPHONE DEFECT & HARDWARE ICONS
// ==========================================

export const DefectScreenBrokenScratchIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="4" width="36" height="56" rx="8" stroke="#1E293B" strokeWidth="2.5" fill="#FFFFFF" />
    <rect x="9" y="8" width="30" height="48" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
    <rect x="20" y="6" width="8" height="2" rx="1" fill="#94A3B8" />
    {/* Crack & scratch markings */}
    <path d="M12 20L20 28L28 22L36 34" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 28L18 42" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 22L32 14" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const DefectScreenSpotsLinesIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="4" width="36" height="56" rx="8" stroke="#1E293B" strokeWidth="2.5" fill="#FFFFFF" />
    <rect x="9" y="8" width="30" height="48" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
    <rect x="20" y="6" width="8" height="2" rx="1" fill="#94A3B8" />
    {/* Lines and discoloration */}
    <line x1="18" y1="12" x2="18" y2="52" stroke="#06B6D4" strokeWidth="2" />
    <line x1="24" y1="12" x2="24" y2="52" stroke="#EC4899" strokeWidth="1.5" />
    <circle cx="30" cy="26" r="4" fill="#EAB308" opacity="0.75" />
    <circle cx="32" cy="40" r="3" fill="#1E293B" opacity="0.8" />
  </svg>
);

export const DefectBodyScratchDentIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="4" width="36" height="56" rx="8" stroke="#D97706" strokeWidth="2.5" fill="#FFFBEB" />
    <rect x="9" y="8" width="30" height="48" rx="4" fill="#FFFFFF" stroke="#FEF3C7" strokeWidth="1" />
    <rect x="20" y="6" width="8" height="2" rx="1" fill="#F59E0B" />
    {/* Dents on outer frame */}
    <path d="M42 22L38 25L42 28" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 38L10 41L6 44" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 52L26 50" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DefectPanelMissingBrokenIcon = ({ className = "w-12 h-16" }) => (
  <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 4H34C38.4183 4 42 7.58172 42 12V32L36 36L42 42V52C42 56.4183 38.4183 60 34 60H14C9.58172 60 6 56.4183 6 52V12C6 7.58172 9.58172 4 14 4Z" stroke="#EF4444" strokeWidth="2.5" fill="#FEF2F2" />
    <rect x="9" y="8" width="30" height="48" rx="4" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="1" />
    {/* Broken missing gap */}
    <path d="M42 32L34 37L42 42" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#EF4444" fillOpacity="0.2" />
  </svg>
);

export const CameraGlassBrokenIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#EF4444" fill="#FEF2F2" />
    <circle cx="12" cy="13" r="4" stroke="#EF4444" />
    {/* Crack lines through lens */}
    <path d="M9 10L13 13L15 16" stroke="#EF4444" strokeWidth="1.8" />
  </svg>
);

export const FaceSensorIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="#087F8C" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="#087F8C" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="#087F8C" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="#087F8C" />
    <circle cx="9" cy="9" r="1.5" fill="#087F8C" />
    <circle cx="15" cy="9" r="1.5" fill="#087F8C" />
    <path d="M9 15c1 1 5 1 6 0" stroke="#087F8C" />
    <line x1="12" y1="11" x2="12" y2="13" stroke="#087F8C" />
  </svg>
);

export const BatteryWarningYellowIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="16" height="10" rx="2" stroke="#F59E0B" fill="#FFFBEB" strokeWidth="2" />
    <line x1="20" y1="10" x2="20" y2="14" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 9V12" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r="0.75" fill="#D97706" />
  </svg>
);



