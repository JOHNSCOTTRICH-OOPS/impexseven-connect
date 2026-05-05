export function formatPriceRange(
  minPrice: number | null | undefined,
  maxPrice: number | null | undefined,
  fallback: number
): string {
  const min = minPrice ?? fallback;
  const max = maxPrice ?? fallback;
  if (min === max) return `$${min.toFixed(2)}`;
  return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
}
