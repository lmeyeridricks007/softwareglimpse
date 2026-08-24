/**
 * Tier 33 PPC advertising subcategory launch — hub, guides, best page.
 * Affiliate anchors: Diginius, Birch; deferred hub under marketing parent.
 * Window: September 2027 (late-month cluster).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_33_LAUNCH_SLOTS = [
  slotUtc("2027-09-19"),
  slotUtc("2027-09-21"),
  slotUtc("2027-09-23"),
  slotUtc("2027-09-24"),
  slotUtc("2027-09-25"),
  slotUtc("2027-09-26"),
  slotUtc("2027-09-27"),
  slotUtc("2027-09-28"),
  slotUtc("2027-09-29"),
  slotUtc("2027-09-30"),
] as const;

export const TIER_33_PPC_ADVERTISING_CONTENT_KEYS = [
  "category:ppc-advertising",
  "guide:what-is-ppc-advertising-software",
  "guide:how-to-choose-ppc-advertising-software",
  "guide:ppc-advertising-pricing-guide",
  "guide:how-ppc-advertising-software-works",
  "guide:types-of-ppc-advertising-software",
  "guide:ppc-advertising-vs-marketing-software",
  "guide:ppc-advertising-requirements-guide",
  "guide:ppc-advertising-evaluation-guide",
  "best:ppc-advertising-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_33_PPC_ADVERTISING_CONTENT_KEYS.length; i++) {
    const key = TIER_33_PPC_ADVERTISING_CONTENT_KEYS[i];
    const slot = TIER_33_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_33_SCHEDULE = buildScheduleMap();

export function tier33ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_33_SCHEDULE.get(contentKey);
}

export function tier33GuideScheduledAt(guideSlug: string): string | undefined {
  return tier33ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier33CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier33ContentScheduledAt(`category:${categorySlug}`);
}

export function tier33BestScheduledAt(bestSlug: string): string | undefined {
  return tier33ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_33_SCHEDULED_GUIDE_SLUGS =
  TIER_33_PPC_ADVERTISING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
