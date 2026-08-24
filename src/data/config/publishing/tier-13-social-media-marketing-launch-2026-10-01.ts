/**
 * Tier 13 Social Media Marketing category launch — hub, guides, best page, finder tool,
 * and affiliate what-is guides for brand24 / zypper (socialbee → social-media-management sub-hub).
 * Window: 1–30 October 2026 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_13_LAUNCH_SLOTS = [
  slotUtc("2026-10-01"),
  slotUtc("2026-10-03"),
  slotUtc("2026-10-05"),
  slotUtc("2026-10-07"),
  slotUtc("2026-10-09"),
  slotUtc("2026-10-11"),
  slotUtc("2026-10-13"),
  slotUtc("2026-10-15"),
  slotUtc("2026-10-17"),
  slotUtc("2026-10-19"),
  slotUtc("2026-10-21"),
  slotUtc("2026-10-23"),
  slotUtc("2026-10-25"),
  slotUtc("2026-10-27"),
  slotUtc("2026-10-29"),
] as const;

export const TIER_13_SOCIAL_MEDIA_MARKETING_CONTENT_KEYS = [
  "category:social-media-marketing",
  "guide:what-is-social-media-marketing-software",
  "guide:how-to-choose-social-media-marketing-software",
  "guide:social-media-marketing-pricing-guide",
  "guide:how-social-media-marketing-software-works",
  "guide:types-of-social-media-marketing-software",
  "guide:social-media-marketing-vs-marketing-software",
  "guide:social-media-marketing-requirements-guide",
  "guide:social-media-marketing-evaluation-guide",
  "best:social-media-marketing-software",
  "tool:social-media-marketing-finder",
  "guide:what-is-brand24",
  "guide:what-is-zypper",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_13_SOCIAL_MEDIA_MARKETING_CONTENT_KEYS.length; i++) {
    const key = TIER_13_SOCIAL_MEDIA_MARKETING_CONTENT_KEYS[i];
    const slot = TIER_13_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_13_SCHEDULE = buildScheduleMap();

export function tier13ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_13_SCHEDULE.get(contentKey);
}

export function tier13GuideScheduledAt(guideSlug: string): string | undefined {
  return tier13ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier13CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier13ContentScheduledAt(`category:${categorySlug}`);
}

export function tier13BestScheduledAt(bestSlug: string): string | undefined {
  return tier13ContentScheduledAt(`best:${bestSlug}`);
}

export function tier13ToolScheduledAt(toolSlug: string): string | undefined {
  return tier13ContentScheduledAt(`tool:${toolSlug}`);
}

/** Products moved to subcategory affiliate-deepen — schedules preserved from Oct 2026 wave. */
const TIER_13_LEGACY_PRODUCT_SCHEDULES: Record<string, string> = {
  socialbee: slotUtc("2026-10-25"),
};

export function tier13ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  const legacy = TIER_13_LEGACY_PRODUCT_SCHEDULES[productSlug];
  if (legacy) return legacy;
  return tier13GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_13_SCHEDULED_GUIDE_SLUGS =
  TIER_13_SOCIAL_MEDIA_MARKETING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
