/**
 * Tier 32 Landing pages & CRO subcategory launch — hub, guides, best page.
 * Affiliate anchors: Kartra, Freshmarketer, Leadpages.
 * Window: September 2027 (even days, interleaved with Tier 31).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_32_LAUNCH_SLOTS = [
  slotUtc("2027-09-02"),
  slotUtc("2027-09-04"),
  slotUtc("2027-09-06"),
  slotUtc("2027-09-08"),
  slotUtc("2027-09-10"),
  slotUtc("2027-09-12"),
  slotUtc("2027-09-14"),
  slotUtc("2027-09-16"),
  slotUtc("2027-09-18"),
  slotUtc("2027-09-22"),
] as const;

export const TIER_32_LANDING_PAGES_CRO_CONTENT_KEYS = [
  "category:landing-pages-cro",
  "guide:what-is-landing-pages-cro-software",
  "guide:how-to-choose-landing-pages-cro-software",
  "guide:landing-pages-cro-pricing-guide",
  "guide:how-landing-pages-cro-software-works",
  "guide:types-of-landing-pages-cro-software",
  "guide:landing-pages-cro-vs-marketing-software",
  "guide:landing-pages-cro-requirements-guide",
  "guide:landing-pages-cro-evaluation-guide",
  "best:landing-pages-cro-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_32_LANDING_PAGES_CRO_CONTENT_KEYS.length; i++) {
    const key = TIER_32_LANDING_PAGES_CRO_CONTENT_KEYS[i];
    const slot = TIER_32_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_32_SCHEDULE = buildScheduleMap();

export function tier32ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_32_SCHEDULE.get(contentKey);
}

export function tier32GuideScheduledAt(guideSlug: string): string | undefined {
  return tier32ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier32CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier32ContentScheduledAt(`category:${categorySlug}`);
}

export function tier32BestScheduledAt(bestSlug: string): string | undefined {
  return tier32ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_32_SCHEDULED_GUIDE_SLUGS =
  TIER_32_LANDING_PAGES_CRO_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
