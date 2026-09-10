/**
 * Gate for /dev/growth.
 * Prefers GROWTH_SECRET, then TESTING_SECRET, then PREVIEW_SECRET.
 */
export function getExpectedGrowthSecret(): string | null {
  return (
    process.env.GROWTH_SECRET?.trim() ||
    process.env.TESTING_SECRET?.trim() ||
    process.env.PREVIEW_SECRET?.trim() ||
    null
  );
}
