import { createContext, useContext, useState } from 'react';

export const QuoteContext = createContext(null);
export const useQuote = () => useContext(QuoteContext);

const DEFAULT_QUOTE = {
  device: null,
  storage: null,
  condition: null,
  screenCondition: null,
  functionalIssues: [],
  accessories: null,
  priceBreakdown: null,
  // Laptop-specific fields
  ram: null,
  storageType: null,
  yearBracket: null,
};

export function QuoteProvider({ children }) {
  const [quote, setQuote] = useState(() => {
    try {
      const saved = localStorage.getItem('secondsale_quote');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    return DEFAULT_QUOTE;
  });

  const updateQuote = (updates) => {
    setQuote(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('secondsale_quote', JSON.stringify(next));
      } catch {
        // ignore localStorage error
      }
      return next;
    });
  };

  const resetQuote = () => {
    try {
      localStorage.removeItem('secondsale_quote');
    } catch {
      // ignore
    }
    setQuote(DEFAULT_QUOTE);
  };

  return (
    <QuoteContext.Provider value={{ quote, updateQuote, resetQuote }}>
      {children}
    </QuoteContext.Provider>
  );
}
