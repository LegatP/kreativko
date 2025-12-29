/**
 * Currency formatting utilities.
 * All prices in this app are stored as cents (integers).
 */

/**
 * Format cents to EUR display string
 * @param cents - Price in cents (e.g., 1990)
 * @returns Formatted string (e.g., "19.90")
 */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}
