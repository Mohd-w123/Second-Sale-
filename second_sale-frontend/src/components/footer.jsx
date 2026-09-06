import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/logo-secondsale.png";
import { SOCIAL_LINKS as SOCIAL_URLS } from "../config/seo";

const FOOTER_LINKS = {
  "Sell Device": ["Sell Mobile", "Sell Tablet", "Sell Laptop", "Sell Mac", "Corporate Sell"],
  "Quick Links": ["Become a Partner", "FAQs", "Cashify Alternatives"],
  "Support": ["Help Center", "About Us", "Terms & Conditions", "Privacy Policy"],
};

const getLinkRoute = (linkName) => {
  const routes = {
    "About Us": "/about-us",
    "Help Center": "/help-center",
    "Terms & Conditions": "/terms-and-conditions",
    "Privacy Policy": "/privacy-policy",
    "Become a Partner": "/partner",
    "FAQs": "/faq",
    "Cashify Alternatives": "/alternatives/cashify-alternatives",
    "Sell Mobile": "/sell-old-mobile-phones/brand",
    "Sell Tablet": "/sell-tablet/brand",
    "Sell Laptop": "/sell-old-laptops/brand",
    "Sell Mac": "/sell-imac/brand",
    "Corporate Sell": "/corporate",
  };
  return routes[linkName] || "#";
};

const SOCIAL_LINKS = [
  {
    name: "Twitter/X",
    href: SOCIAL_URLS.twitter,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: SOCIAL_URLS.instagram,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: SOCIAL_URLS.facebook,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [siteLogo, setSiteLogo] = useState(logo);

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(API + "/site-settings")
      .then(r => r.json())
      .then(data => { if (data?.logoUrl) setSiteLogo(data.logoUrl); })
      .catch(() => {});
  }, []);
  return (
    <footer className="bg-[#0F2D5B] text-gray-300 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="inline-block no-underline">
            <img src={siteLogo || logo} alt="SecondSale Logo" className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
            India's most trusted platform to sell your old devices. Get the best price instantly with free doorstep pickup.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s}>★</span>
              ))}
            </div>
            <p className="text-xs font-medium">
              <strong className="text-white text-sm">4.9</strong> / 5 · 50,000+ Happy Customers
            </p>
          </div>

        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-white font-bold text-base mb-6">{title}</h4>
            <ul className="space-y-3.5 list-none p-0 m-0">
              {links.map((link) => (
                <li key={link}>
                  <Link to={getLinkRoute(link)} className="text-sm text-gray-400 hover:text-[#2563EB] transition-colors no-underline">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <hr className="border-[#1e4080] mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} SecondSale. All rights reserved. &nbsp;
            <Link to="/privacy-policy" className="hover:text-[#2563EB] transition-colors text-gray-500 no-underline">Privacy Policy</Link> &nbsp;·&nbsp;
            <Link to="/terms-and-conditions" className="hover:text-[#2563EB] transition-colors text-gray-500 no-underline">Terms of Use</Link>
          </p>

          <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
            <span>🔒 SSL Secure</span>
            <span>🇮🇳 Made in India</span>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#2563EB] transition-all hover:scale-110 no-underline" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}