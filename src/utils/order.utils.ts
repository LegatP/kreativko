/**
 * Generate a unique order number in format MM-DDMMYY-XXX
 * Example: MM-291225-042 for Dec 29, 2025
 *
 * @param date - Optional date to use (defaults to current date). Useful for testing.
 * @returns Order number string
 */
export function generateOrderNumber(date: Date = new Date()): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `MM-${day}${month}${year}-${random}`;
}
