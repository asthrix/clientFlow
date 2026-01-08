// ============================================
// ClientFlow CRM - useClipboard Hook
// Copy to clipboard with feedback
// ============================================

import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  /** Timeout to reset copied state (default: 2000ms) */
  timeout?: number;
}

interface UseClipboardReturn {
  /** Whether the copy was successful */
  copied: boolean;
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Reset the copied state */
  reset: () => void;
}

/**
 * Copy text to clipboard with success feedback
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not available');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Reset after timeout
        setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (error) {
        console.error('Failed to copy text:', error);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copied, copy, reset };
}
