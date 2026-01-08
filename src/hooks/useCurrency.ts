// ============================================
// ClientFlow CRM - useCurrency Hook
// Hook for currency formatting using global preferences
// ============================================

import { useCallback } from 'react';
import { usePreferencesStore, CURRENCY_CONFIG, type Currency } from '@/store';
import { IndianRupee, DollarSign, Euro, PoundSterling, type LucideIcon } from 'lucide-react';

// Currency to icon mapping
const CURRENCY_ICONS: Record<Currency, LucideIcon> = {
  INR: IndianRupee,
  USD: DollarSign,
  EUR: Euro,
  GBP: PoundSterling,
  AUD: DollarSign,
  CAD: DollarSign,
};

/**
 * Hook that provides currency formatting using global preferences
 * When currency preference changes, all components using this hook will update
 */
export function useCurrency() {
  const currency = usePreferencesStore((state) => state.currency);
  
  const formatCurrency = useCallback(
    (amount: number | undefined, overrideCurrency?: Currency): string => {
      if (amount === undefined || amount === null) return '—';
      
      const curr = overrideCurrency || currency;
      const config = CURRENCY_CONFIG[curr] || CURRENCY_CONFIG.INR;
      
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    },
    [currency]
  );

  const getCurrencySymbol = useCallback(
    (overrideCurrency?: Currency): string => {
      const curr = overrideCurrency || currency;
      return CURRENCY_CONFIG[curr]?.symbol || '₹';
    },
    [currency]
  );

  const getCurrencyIcon = useCallback(
    (overrideCurrency?: Currency): LucideIcon => {
      const curr = overrideCurrency || currency;
      return CURRENCY_ICONS[curr] || IndianRupee;
    },
    [currency]
  );

  return {
    currency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyIcon,
  };
}

