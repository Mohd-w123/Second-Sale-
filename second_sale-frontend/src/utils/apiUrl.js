/**
 * Dynamic API Base URL resolver.
 * Ensures that whenever the app runs in production (on secondsale.in or any remote domain),
 * all API requests route to `/api` through Nginx reverse proxy instead of attempting
 * to connect to `localhost:5000` on the client's local computer.
 */
export const getApiBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    
    // In production browsers, never allow localhost:5000
    if (!isLocal && (envUrl.includes('localhost') || !envUrl)) {
      return '/api';
    }
  }
  
  return envUrl || 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();
