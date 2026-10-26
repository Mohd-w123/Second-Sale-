import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { QuoteProvider } from './context/QuoteContext';
import { setupFetchCache } from './utils/offlineCache';
import App from './App.jsx';
import './index.css';

// Initialize global offline resilience cache for all GET fetch requests
setupFetchCache();

function PrerenderReady() {
  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
  }, []);
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AuthProvider>
          <QuoteProvider>
            <App />
            <PrerenderReady />
          </QuoteProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
