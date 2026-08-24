/**
 * Tier 14 Webinar & Virtual Events category launch — hub, guides, best page, finder,
 * and affiliate what-is guides (moved from Tier 11). WebinarJam software ships Sep 2026 wedge launch.
 * Window: 1–29 November 2026 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_14_LAUNCH_SLOTS = [
  slotUtc("2026-11-01"),
  slotUtc("2026-11-03"),
  slotUtc("2026-11-05"),
  slotUtc("2026-11-07"),
  slotUtc("2026-11-09"),
  slotUtc("2026-11-11"),
  slotUtc("2026-11-13"),
  slotUtc("2026-11-15"),
  slotUtc("2026-11-17"),
  slotUtc("2026-11-19"),
  slotUtc("2026-11-21"),
  slotUtc("2026-11-23"),
  slotUtc("2026-11-25"),
  slotUtc("2026-11-27"),
] as const;

export const TIER_14_WEBINAR_VIRTUAL_EVENTS_CONTENT_KEYS = [
  "category:webinar-virtual-events",
  "guide:what-is-webinar-virtual-events-software",
  "guide:how-to-choose-webinar-virtual-events-software",
  "guide:webinar-virtual-events-pricing-guide",
  "guide:how-webinar-virtual-events-software-works",
  "guide:types-of-webinar-virtual-events-software",
  "guide:webinar-virtual-events-vs-marketing-software",
  "guide:webinar-virtual-events-requirements-guide",
  "guide:webinar-virtual-events-evaluation-guide",
  "best:webinar-virtual-events-software",
  "tool:webinar-virtual-events-finder",
  "guide:what-is-webinarjam-everwebinar",
  "guide:what-is-livestorm",
  "guide:what-is-switcher-studio",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_14_WEBINAR_VIRTUAL_EVENTS_CONTENT_KEYS.length; i++) {
    const key = TIER_14_WEBINAR_VIRTUAL_EVENTS_CONTENT_KEYS[i];
    const slot = TIER_14_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_14_SCHEDULE = buildScheduleMap();

export function tier14ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_14_SCHEDULE.get(contentKey);
}

export function tier14GuideScheduledAt(guideSlug: string): string | undefined {
  return tier14ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier14CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier14ContentScheduledAt(`category:${categorySlug}`);
}

export function tier14BestScheduledAt(bestSlug: string): string | undefined {
  return tier14ContentScheduledAt(`best:${bestSlug}`);
}

export function tier14ToolScheduledAt(toolSlug: string): string | undefined {
  return tier14ContentScheduledAt(`tool:${toolSlug}`);
}

export function tier14ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier14GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_14_SCHEDULED_GUIDE_SLUGS =
  TIER_14_WEBINAR_VIRTUAL_EVENTS_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
