/**
 * Universal Offline & Stale-While-Revalidate Cache Layer for SecondSale
 * Automatically caches GET API responses in localStorage.
 * If the server goes down or drops connection, cached responses are served
 * seamlessly across the entire website (Navbar, Home, Footer, Brands, etc.)
 * so the user never sees outdated static UI or broken icons.
 */

const CACHE_PREFIX = 'secondsale_v1_';
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper to normalize cache keys
export const getCacheKey = (method, url) => {
  try {
    const cleanUrl = url.replace(/^[a-z]+:\/\/[^/]+/i, ''); // Strip origin
    return `${CACHE_PREFIX}${method.toUpperCase()}_${cleanUrl}`;
  } catch {
    return `${CACHE_PREFIX}${method.toUpperCase()}_${url}`;
  }
};

// Store data in localStorage safely
export const saveToCache = (key, data) => {
  try {
    const payload = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    // QuotaExceeded or private browsing
    console.warn('[OfflineCache] Storage write failed:', err);
  }
};

// Read data from localStorage safely
export const readFromCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload || !payload.data) return null;

    // Check expiration if needed
    if (Date.now() - (payload.timestamp || 0) > MAX_CACHE_AGE_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return payload.data;
  } catch {
    return null;
  }
};

/**
 * Setup global window.fetch interceptor for GET requests
 */
export function setupFetchCache() {
  if (typeof window === 'undefined' || !window.fetch) return;

  const originalFetch = window.fetch;

  window.fetch = async function (input, init) {
    const method = (init?.method || 'GET').toUpperCase();
    const url = typeof input === 'string' ? input : input?.url || '';

    // Only cache GET requests destined for the API (e.g. /site-settings, /homepage, /categories)
    const isApiRequest = url.includes('/api/') || url.includes('site-settings') || url.includes('homepage') || url.includes('categories');

    if (method !== 'GET' || !isApiRequest) {
      return originalFetch.apply(this, arguments);
    }

    const cacheKey = getCacheKey('GET', url);

    try {
      const response = await originalFetch.apply(this, arguments);

      // If server responded successfully (200-299), clone and cache the response
      if (response && response.ok) {
        try {
          const clone = response.clone();
          clone.text().then((text) => {
            try {
              const json = JSON.parse(text);
              saveToCache(cacheKey, json);
            } catch {
              // Not JSON
            }
          }).catch(() => {});
        } catch {}
        return response;
      }

      // If server responded with error status (500, 502, 503, 504), attempt cache fallback
      if (response && response.status >= 500) {
        const cached = readFromCache(cacheKey);
        if (cached) {
          console.info(`[OfflineCache] Server error ${response.status} on ${url}, serving cached data`);
          return new Response(JSON.stringify(cached), {
            status: 200,
            statusText: 'OK (Offline Cache)',
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      return response;
    } catch (networkError) {
      // Network failed completely (Server down, offline, connection refused)
      const cached = readFromCache(cacheKey);
      if (cached) {
        console.info(`[OfflineCache] Network failed for ${url}, serving cached data`);
        return new Response(JSON.stringify(cached), {
          status: 200,
          statusText: 'OK (Offline Cache)',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      throw networkError;
    }
  };
}
