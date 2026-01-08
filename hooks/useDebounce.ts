// ============================================
// ClientFlow CRM - useDebounce Hook
// Debounce values for search/filter inputs
// ============================================

import { useState, useEffect } from 'react';

/**
 * Debounce a value to prevent excessive updates
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
