import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BannerSlider({ onBannersChange, autoPlaySpeed = 4000 }) {
  const [banners, setBanners] = useState([]);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const timerRef = useRef(null);

  const updateBanners = useCallback((rawBanners) => {
    const live = Array.isArray(rawBanners) ? rawBanners.filter(b => b.isActive) : [];
    setBanners(live);
    if (onBannersChange) {
      onBannersChange(live.length > 0);
    }
  }, [onBannersChange]);

  useEffect(() => {
    fetch(`${API}/site-settings`)
      .then(r => r.json())
      .then(data => {
        updateBanners(data?.banners);
      })
      .catch(() => {
        updateBanners([]);
      });

    const handleSettingsUpdated = (e) => {
      if (e.detail?.banners) {
        updateBanners(e.detail.banners);
      }
    };
    window.addEventListener('site-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('site-settings-updated', handleSettingsUpdated);
  }, [updateBanners]);

  const total = banners.length;

  const goTo = useCallback((idx) => {
    if (total <= 0) return;
    setActive((idx + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (total > 1) {
      timerRef.current = setInterval(next, autoPlaySpeed);
    }
  }, [next, total, autoPlaySpeed]);

  useEffect(() => {
    if (total > 1) {
      timerRef.current = setInterval(next, autoPlaySpeed);
    }
    return () => clearInterval(timerRef.current);
  }, [next, total, autoPlaySpeed]);

  // Touch/drag support
  const onDragStart = (x) => { setDragging(false); setDragStart(x); };
  const onDragEnd   = (x) => {
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetTimer(); }
  };

  // If no banners are configured or active in the admin panel, render nothing (no static fallback)
  if (!total) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-4 pt-4 pb-2">
        <div
          className="relative overflow-hidden rounded-2xl select-none cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
        >
          {/* Track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {banners.map((banner) => (
              <Link
                key={banner._id}
                to={banner.linkTo || "/sell-old-mobile-phones/brand"}
                className="flex-shrink-0 w-full block no-underline"
                draggable={false}
                onClick={(e) => dragging && e.preventDefault()}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || "Promotional Banner"}
                  className="w-full object-cover rounded-2xl"
                  style={{ height: "clamp(180px, 28vw, 380px)" }}
                  draggable={false}
                />
              </Link>
            ))}
          </div>

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => { prev(); resetTimer(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                type="button"
                onClick={() => { next(); resetTimer(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {total > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { goTo(i); resetTimer(); }}
                  className={`transition-all duration-300 rounded-full border-0 cursor-pointer
                    ${i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
