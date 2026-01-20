import { CurrencyCode, CurrencyConfig } from '@/types/invoice';

// Currency configuration with symbols and locales
export const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', locale: 'en-PK' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE', useCodeFallback: true },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA', useCodeFallback: true },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
};

// All supported currency codes
export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['USD', 'PKR', 'GBP', 'EUR', 'AED', 'SAR', 'CAD', 'AUD'];

// Default exchange rates to PKR (approximate, user can override)
export const DEFAULT_RATES_TO_PKR: Record<CurrencyCode, number> = {
  USD: 278.50,
  PKR: 1,
  GBP: 352.00,
  EUR: 302.00,
  AED: 75.85,
  SAR: 74.25,
  CAD: 205.00,
  AUD: 182.00,
};

/**
 * Format a number as currency with proper symbol and locale
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode | string): string {
  const config = CURRENCY_CONFIG[currencyCode as CurrencyCode];
  
  if (!config) {
    // Fallback for unknown currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get the currency symbol for display (with fallback for PDFs)
 */
export function getCurrencySymbol(currencyCode: CurrencyCode | string, forPDF: boolean = false): string {
  const config = CURRENCY_CONFIG[currencyCode as CurrencyCode];
  
  if (!config) return currencyCode;
  
  // For PDFs, use code fallback for Arabic/non-Latin currencies
  if (forPDF && config.useCodeFallback) {
    return config.code;
  }
  
  return config.symbol;
}

/**
 * Format currency for PDF (handles fonts that don't support Arabic)
 */
export function formatCurrencyForPDF(amount: number, currencyCode: CurrencyCode | string): string {
  const config = CURRENCY_CONFIG[currencyCode as CurrencyCode];
  
  if (!config) {
    return `${currencyCode} ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  // For currencies with non-Latin symbols, use code instead
  if (config.useCodeFallback) {
    return `${config.code} ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  // For Latin-symbol currencies, use the symbol
  const formattedAmount = amount.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  });
  
  return `${config.symbol}${formattedAmount}`;
}

/**
 * Get default exchange rate to PKR for a currency
 */
export function getDefaultRateToPKR(currencyCode: CurrencyCode): number {
  return DEFAULT_RATES_TO_PKR[currencyCode] || 1;
}

/**
 * Get currency display label for dropdowns (e.g., "USD ($)")
 */
export function getCurrencyLabel(currencyCode: CurrencyCode): string {
  const config = CURRENCY_CONFIG[currencyCode];
  if (!config) return currencyCode;
  return `${config.code} (${config.symbol})`;
}
