import { createContext, useContext, useEffect, useState } from 'react';

// Supported currencies
const CURRENCIES = [
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirhams' },
  { code: 'USD', symbol: '$', name: 'US Dollars' },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling' },
  { code: 'EUR', symbol: '€', name: 'Euros' }
] as const;

type CurrencyCode = typeof CURRENCIES[number]['code'];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  exchangeRates: Record<CurrencyCode, number>;
  loading: boolean;
  error: string | null;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'AED',
  setCurrency: () => {},
  exchangeRates: { AED: 1, USD: 0, GBP: 0, EUR: 0 },
  loading: true,
  error: null
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('AED');
  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyCode, number>>({
    AED: 1,
    USD: 0,
    GBP: 0,
    EUR: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an exchange rate API
      // For now, we'll use mock data with realistic rates
      const mockRates: Record<CurrencyCode, number> = {
        AED: 1,
        USD: 0.2723, // 1 AED = 0.2723 USD
        GBP: 0.2036, // 1 AED = 0.2036 GBP
        EUR: 0.2391  // 1 AED = 0.2391 EUR
      };
      
      setExchangeRates(mockRates);
      setLastFetch(Date.now());
      localStorage.setItem('exchangeRates', JSON.stringify(mockRates));
      localStorage.setItem('lastFetch', Date.now().toString());
    } catch (err) {
      setError('Failed to fetch exchange rates');
      // Try to load cached rates
      const cachedRates = localStorage.getItem('exchangeRates');
      const cachedTime = localStorage.getItem('lastFetch');
      if (cachedRates && cachedTime) {
        const rates = JSON.parse(cachedRates);
        const time = parseInt(cachedTime);
        // Use cached rates if they're not too old (1 hour)
        if (Date.now() - time < 3600000) {
          setExchangeRates(rates);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Load saved currency and exchange rates
  useEffect(() => {
    // Load saved currency
    const savedCurrency = localStorage.getItem('currency') as CurrencyCode | null;
    if (savedCurrency && CURRENCIES.some(c => c.code === savedCurrency)) {
      setCurrency(savedCurrency);
    }
    
    // Load exchange rates
    const cachedRates = localStorage.getItem('exchangeRates');
    const cachedTime = localStorage.getItem('lastFetch');
    if (cachedRates && cachedTime) {
      const rates = JSON.parse(cachedRates);
      const time = parseInt(cachedTime);
      // Use cached rates if they're not too old (1 hour)
      if (Date.now() - time < 3600000) {
        setExchangeRates(rates);
        setLoading(false);
      } else {
        fetchExchangeRates();
      }
    } else {
      fetchExchangeRates();
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Refresh exchange rates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastFetch && Date.now() - lastFetch > 3600000) { // 1 hour
        fetchExchangeRates();
      }
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [lastFetch]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, loading, error }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

// Utility function to format price with currency
export function formatPrice(priceAED: number): string {
  const { currency, exchangeRates } = useCurrency();
  
  if (!priceAED || isNaN(priceAED)) return 'AED 0';
  
  const rate = exchangeRates[currency] || 1;
  const convertedPrice = priceAED * rate;
  
  // Format based on currency
  const currencyInfo = CURRENCIES.find(c => c.code === currency);
  const symbol = currencyInfo?.symbol || 'د.إ';
  
  // Format with thousand separators
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(convertedPrice));
  
  return `${symbol} ${formatted}`;
}

// Utility function to get raw converted price
export function convertPrice(priceAED: number): number {
  const { currency, exchangeRates } = useCurrency();
  if (!priceAED || isNaN(priceAED)) return 0;
  const rate = exchangeRates[currency] || 1;
  return priceAED * rate;
}