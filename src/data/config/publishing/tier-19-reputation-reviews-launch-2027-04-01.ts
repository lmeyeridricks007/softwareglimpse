/**
 * Tier 19 Reputation & Review Management category launch — hub, guides, and best page.
 * NiceJob what-is / is-worth-it already ships Tier 7 CS (Nov 2026). Hub only — no finder
 * until 4+ products. Window: 1–30 April 2027 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_19_LAUNCH_SLOTS = [
  slotUtc("2027-04-01"),
  slotUtc("2027-04-04"),
  slotUtc("2027-04-07"),
  slotUtc("2027-04-10"),
  slotUtc("2027-04-13"),
  slotUtc("2027-04-16"),
  slotUtc("2027-04-19"),
  slotUtc("2027-04-22"),
  slotUtc("2027-04-26"),
  slotUtc("2027-04-30"),
] as const;

export const TIER_19_REPUTATION_REVIEWS_CONTENT_KEYS = [
  "category:reputation-reviews",
  "guide:what-is-reputation-reviews-software",
  "guide:how-to-choose-reputation-reviews-software",
  "guide:reputation-reviews-pricing-guide",
  "guide:how-reputation-reviews-software-works",
  "guide:types-of-reputation-reviews-software",
  "guide:reputation-reviews-vs-customer-service-software",
  "guide:reputation-reviews-requirements-guide",
  "guide:reputation-reviews-evaluation-guide",
  "best:reputation-reviews-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_19_REPUTATION_REVIEWS_CONTENT_KEYS.length; i++) {
    const key = TIER_19_REPUTATION_REVIEWS_CONTENT_KEYS[i];
    const slot = TIER_19_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_19_SCHEDULE = buildScheduleMap();

export function tier19ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_19_SCHEDULE.get(contentKey);
}

export function tier19GuideScheduledAt(guideSlug: string): string | undefined {
  return tier19ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier19CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier19ContentScheduledAt(`category:${categorySlug}`);
}

export function tier19BestScheduledAt(bestSlug: string): string | undefined {
  return tier19ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_19_SCHEDULED_GUIDE_SLUGS =
  TIER_19_REPUTATION_REVIEWS_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
