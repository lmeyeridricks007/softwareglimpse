/**
 * Tier 17 Analytics & BI category launch — hub, guides, best page, and affiliate
 * what-is guides (moved from Tier 11 marketing). No dedicated finder until canvas-score
 * onboarding and 6+ primaries. Window: 1–28 February 2027 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_17_LAUNCH_SLOTS = [
  slotUtc("2027-02-01"),
  slotUtc("2027-02-03"),
  slotUtc("2027-02-05"),
  slotUtc("2027-02-07"),
  slotUtc("2027-02-09"),
  slotUtc("2027-02-11"),
  slotUtc("2027-02-13"),
  slotUtc("2027-02-15"),
  slotUtc("2027-02-17"),
  slotUtc("2027-02-20"),
  slotUtc("2027-02-24"),
  slotUtc("2027-02-28"),
] as const;

export const TIER_17_ANALYTICS_BI_CONTENT_KEYS = [
  "category:analytics-bi",
  "guide:what-is-analytics-bi-software",
  "guide:how-to-choose-analytics-bi-software",
  "guide:analytics-bi-pricing-guide",
  "guide:how-analytics-bi-software-works",
  "guide:types-of-analytics-bi-software",
  "guide:analytics-bi-vs-marketing-software",
  "guide:analytics-bi-requirements-guide",
  "guide:analytics-bi-evaluation-guide",
  "best:analytics-bi-software",
  "guide:what-is-whatconverts",
  "guide:what-is-databox",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_17_ANALYTICS_BI_CONTENT_KEYS.length; i++) {
    const key = TIER_17_ANALYTICS_BI_CONTENT_KEYS[i];
    const slot = TIER_17_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_17_SCHEDULE = buildScheduleMap();

export function tier17ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_17_SCHEDULE.get(contentKey);
}

export function tier17GuideScheduledAt(guideSlug: string): string | undefined {
  return tier17ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier17CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier17ContentScheduledAt(`category:${categorySlug}`);
}

export function tier17BestScheduledAt(bestSlug: string): string | undefined {
  return tier17ContentScheduledAt(`best:${bestSlug}`);
}

export function tier17ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier17GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_17_SCHEDULED_GUIDE_SLUGS =
  TIER_17_ANALYTICS_BI_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
