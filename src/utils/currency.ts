/**
 * Currency utilities for handling monetary values with precision
 * Uses integer-based storage (cents) to avoid floating-point precision issues
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals?: number; // Number of decimal places (default: 2)
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
];

/**
 * Convert a decimal amount to integer cents to avoid floating-point issues
 * @param amount - The decimal amount (e.g., 10.99)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Integer representation in smallest currency unit
 */
export const toCents = (amount: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(amount * multiplier);
};

/**
 * Convert integer cents back to decimal amount
 * @param cents - Integer amount in smallest currency unit
 * @param decimals - Number of decimal places (default: 2)
 * @returns Decimal amount
 */
export const fromCents = (cents: number, decimals: number = 2): number => {
  const divisor = Math.pow(10, decimals);
  return cents / divisor;
};

/**
 * Format currency using Intl.NumberFormat for proper localization
 * @param amount - The amount to format (in decimal)
 * @param currency - Currency configuration
 * @param locale - Locale for formatting (default: user's locale)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: Currency,
  locale?: string
): string => {
  // Use browser's locale if not specified
  const userLocale = locale || navigator.language || 'en-US';

  try {
    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimals || 2,
      maximumFractionDigits: currency.decimals || 2,
    });

    return formatter.format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    const decimals = currency.decimals || 2;
    return `${currency.symbol}${amount.toFixed(decimals)}`;
  }
};

/**
 * Parse a currency string to decimal amount with maximum precision protection
 * @param value - String value to parse
 * @returns Parsed decimal amount or 0 if invalid
 */
export const parseCurrency = (value: string | number): number => {
  // Handle number input
  if (typeof value === 'number') {
    if (isNaN(value)) return 0;
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  // Remove currency symbols, spaces, and commas
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;

  // Apply precision fix to avoid floating-point errors
  let result = Math.round((parsed + Number.EPSILON) * 100) / 100;

  // Additional check: if very close to a whole number, round to it
  const nearestWhole = Math.round(result);
  if (Math.abs(result - nearestWhole) < 0.01) {
    result = nearestWhole;
  }

  return result;
};

/**
 * Sanitize monetary data to remove floating-point precision errors
 * @param data - Object containing monetary values
 * @returns Sanitized data with clean monetary values
 */
export const sanitizeMonetaryData = (data: unknown): unknown => {
  if (typeof data === 'number') {
    // Round to 2 decimal places to fix precision issues
    let result = Math.round((data + Number.EPSILON) * 100) / 100;

    // Additional protection: if very close to whole number, round to it
    const nearestWhole = Math.round(result);
    if (Math.abs(result - nearestWhole) < 0.01) {
      result = nearestWhole;
    }

    return result;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeMonetaryData);
  }

  if (data && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const [key, value] of Object.entries(obj)) {
      // Sanitize known monetary fields
      if (['price', 'amount', 'total', 'consumed', 'paid', 'balance', 'netBalance'].includes(key)) {
        result[key] = sanitizeMonetaryData(value);
      } else {
        result[key] = sanitizeMonetaryData(value);
      }
    }
    return result;
  }

  return data;
};

/**
 * Clean localStorage data to remove floating-point precision errors
 * @param storageKey - The localStorage key to clean
 */
export const cleanStorageData = (storageKey: string): void => {
  try {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      const sanitized = sanitizeMonetaryData(parsed);
      localStorage.setItem(storageKey, JSON.stringify(sanitized));
    }
  } catch (error) {
    console.warn('Failed to clean storage data:', error);
  }
};

/**
 * Divide amount among participants with proper rounding
 * @param totalAmount - Total amount to divide
 * @param participantCount - Number of participants
 * @param decimals - Number of decimal places (default: 2)
 * @returns Array of amounts for each participant
 */
export const divideAmount = (
  totalAmount: number,
  participantCount: number,
  decimals: number = 2
): number[] => {
  if (participantCount <= 0) return [];

  // Convert to cents for precise calculation
  const totalCents = toCents(totalAmount, decimals);
  const baseCents = Math.floor(totalCents / participantCount);
  const remainder = totalCents % participantCount;

  // Distribute the remainder among the first few participants
  const amounts: number[] = [];
  for (let i = 0; i < participantCount; i++) {
    const cents = baseCents + (i < remainder ? 1 : 0);
    amounts.push(fromCents(cents, decimals));
  }

  return amounts;
};

/**
 * Calculate the sum of amounts with proper precision
 * @param amounts - Array of amounts to sum
 * @param decimals - Number of decimal places (default: 2)
 * @returns Sum with proper precision
 */
export const sumAmounts = (amounts: number[], decimals: number = 2): number => {
  const totalCents = amounts.reduce((sum, amount) => sum + toCents(amount, decimals), 0);
  return fromCents(totalCents, decimals);
};