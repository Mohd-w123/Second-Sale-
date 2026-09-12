import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DEFAULT_PHONE = "7045180009";
const DEFAULT_MESSAGE = "Hi, I'm interested in selling my device on SecondSale.";

const WhatsAppIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="white"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-1.746-.872-2.892-1.564-4.043-3.548-.305-.524.305-.487.873-1.62.099-.198.05-.371-.05-.52-.099-.149-.643-1.548-.879-2.124-.236-.578-.475-.5-.652-.51-.169-.01-.363-.012-.557-.012-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.876 1.213 3.074.149.198 2.045 3.131 4.974 4.27 2.929 1.139 2.929.76 3.85.713.922-.05 2.029-.74 2.318-1.452.288-.713.288-1.327.198-1.452-.09-.124-.297-.198-.628-.347z" />
    <path d="M12.04 2c-5.523 0-10 4.477-10 10 0 1.851.504 3.583 1.382 5.07L2 22l5.13-1.345A9.96 9.96 0 0 0 12.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.182a8.16 8.16 0 0 1-4.16-1.137l-.298-.177-3.045.8.813-2.97-.194-.305a8.18 8.18 0 0 1-1.255-4.393c0-4.523 3.679-8.2 8.2-8.2 2.19 0 4.247.853 5.794 2.401a8.14 8.14 0 0 1 2.402 5.795c0 4.522-3.679 8.2-8.257 8.2z" />
  </svg>
);

export default function WhatsAppButton() {
  const location = useLocation();
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_PHONE);
  const [isEnabled, setIsEnabled] = useState(true);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    fetch(`${API_BASE}/site-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        else if (data.footer?.whatsapp) setWhatsappNumber(data.footer.whatsapp);
        if (data.whatsappEnabled !== undefined) setIsEnabled(Boolean(data.whatsappEnabled));
        if (data.whatsappMessage) setMessage(data.whatsappMessage);
      })
      .catch(() => {});

    const onSettingsUpdate = (e) => {
      const data = e?.detail;
      if (!data) return;
      if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      else if (data.footer?.whatsapp) setWhatsappNumber(data.footer.whatsapp);
      if (data.whatsappEnabled !== undefined) setIsEnabled(Boolean(data.whatsappEnabled));
      if (data.whatsappMessage) setMessage(data.whatsappMessage);
    };

    window.addEventListener('site-settings-updated', onSettingsUpdate);
    return () => window.removeEventListener('site-settings-updated', onSettingsUpdate);
  }, []);

  // NEVER show on admin screens
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // If disabled by admin in site settings
  if (!isEnabled) {
    return null;
  }

  // Clean formatting: if 10 digits (e.g. 7045180009), prepend 91 for wa.me
  const digits = String(whatsappNumber || DEFAULT_PHONE).replace(/\D/g, '');
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || DEFAULT_MESSAGE)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-8 right-8 z-[1500] flex items-center justify-center group"
      title={`Chat on WhatsApp (${whatsappNumber})`}
    >
      {/* Pulsing ring (animation) */}
      <span className="absolute inline-flex h-14 w-14 rounded-full bg-[#25D366] opacity-75 animate-ping [animation-duration:2.5s]" />

      {/* Button */}
      <span className="relative inline-flex w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200">
        <WhatsAppIcon />
      </span>
    </a>
  );
}
