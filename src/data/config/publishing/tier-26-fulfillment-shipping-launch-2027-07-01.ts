/**
 * Tier 26 Fulfillment & Shipping subcategory launch — hub, guides, and best page.
 * Affiliate what-is: ShipBob/Sendcloud/Spocket/AliDrop (Tier 8 Dec 2026) — not rescheduled.
 * Window: 1–30 July 2027 (~every 3 days, interleaved with other July tiers).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_26_LAUNCH_SLOTS = [
  slotUtc("2027-07-03"),
  slotUtc("2027-07-06"),
  slotUtc("2027-07-09"),
  slotUtc("2027-07-12"),
  slotUtc("2027-07-15"),
  slotUtc("2027-07-18"),
  slotUtc("2027-07-21"),
  slotUtc("2027-07-24"),
  slotUtc("2027-07-27"),
  slotUtc("2027-07-30"),
] as const;

export const TIER_26_FULFILLMENT_SHIPPING_CONTENT_KEYS = [
  "category:fulfillment-shipping",
  "guide:what-is-fulfillment-shipping-software",
  "guide:how-to-choose-fulfillment-shipping-software",
  "guide:fulfillment-shipping-pricing-guide",
  "guide:how-fulfillment-shipping-software-works",
  "guide:types-of-fulfillment-shipping-software",
  "guide:fulfillment-shipping-vs-ecommerce-software",
  "guide:fulfillment-shipping-requirements-guide",
  "guide:fulfillment-shipping-evaluation-guide",
  "best:fulfillment-shipping-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_26_FULFILLMENT_SHIPPING_CONTENT_KEYS.length; i++) {
    const key = TIER_26_FULFILLMENT_SHIPPING_CONTENT_KEYS[i];
    const slot = TIER_26_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_26_SCHEDULE = buildScheduleMap();

export function tier26ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_26_SCHEDULE.get(contentKey);
}

export function tier26GuideScheduledAt(guideSlug: string): string | undefined {
  return tier26ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier26CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier26ContentScheduledAt(`category:${categorySlug}`);
}

export function tier26BestScheduledAt(bestSlug: string): string | undefined {
  return tier26ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_26_SCHEDULED_GUIDE_SLUGS =
  TIER_26_FULFILLMENT_SHIPPING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
