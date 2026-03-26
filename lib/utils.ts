// lib/utils.ts

/**
 * Converts a string (like "Velvet Lip Stain") into a 
 * URL-friendly slug (like "velvet-lip-stain").
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');     // Replace multiple - with single -
}