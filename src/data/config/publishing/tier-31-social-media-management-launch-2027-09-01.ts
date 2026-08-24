/**
 * Tier 31 Social media management subcategory launch — hub, guides, best page.
 * Affiliate anchors: Buffer, Hootsuite; SocialBee affiliate deepen.
 * Window: September 2027 (odd days, interleaved with Tier 32).
 */

function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_31_LAUNCH_SLOTS = [
  slotUtc("2027-09-01"),
  slotUtc("2027-09-03"),
  slotUtc("2027-09-05"),
  slotUtc("2027-09-07"),
  slotUtc("2027-09-09"),
  slotUtc("2027-09-11"),
  slotUtc("2027-09-13"),
  slotUtc("2027-09-15"),
  slotUtc("2027-09-17"),
  slotUtc("2027-09-20"),
] as const;

export const TIER_31_SOCIAL_MEDIA_MANAGEMENT_CONTENT_KEYS = [
  "category:social-media-management",
  "guide:what-is-social-media-management-software",
  "guide:how-to-choose-social-media-management-software",
  "guide:social-media-management-pricing-guide",
  "guide:how-social-media-management-software-works",
  "guide:types-of-social-media-management-software",
  "guide:social-media-management-vs-marketing-software",
  "guide:social-media-management-requirements-guide",
  "guide:social-media-management-evaluation-guide",
  "best:social-media-management-software",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_31_SOCIAL_MEDIA_MANAGEMENT_CONTENT_KEYS.length; i++) {
    const key = TIER_31_SOCIAL_MEDIA_MANAGEMENT_CONTENT_KEYS[i];
    const slot = TIER_31_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_31_SCHEDULE = buildScheduleMap();

export function tier31ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_31_SCHEDULE.get(contentKey);
}

export function tier31GuideScheduledAt(guideSlug: string): string | undefined {
  return tier31ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier31CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier31ContentScheduledAt(`category:${categorySlug}`);
}

export function tier31BestScheduledAt(bestSlug: string): string | undefined {
  return tier31ContentScheduledAt(`best:${bestSlug}`);
}

export const TIER_31_SCHEDULED_GUIDE_SLUGS =
  TIER_31_SOCIAL_MEDIA_MANAGEMENT_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
