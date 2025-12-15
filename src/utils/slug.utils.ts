/**
 * Generates a URL-friendly slug from a given string.
 * Handles Slovenian diacritical characters properly.
 *
 * @param text - The input string to convert to a slug
 * @returns A URL-friendly slug string
 */
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace Slovenian characters
      .replace(/ž/g, "z")
      .replace(/š/g, "s")
      .replace(/č/g, "c")
      .replace(/đ/g, "d")
      .replace(/ć/g, "c")
      // Remove other non-word characters except spaces and hyphens
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}
