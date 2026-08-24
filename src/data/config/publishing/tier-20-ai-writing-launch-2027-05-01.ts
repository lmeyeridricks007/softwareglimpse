/**
 * Tier 20 AI Writing subcategory launch — hub, guides, best page, and affiliate
 * what-is guides (moved from Tier 5 AI). Uses parent ai-finder ai-writing use-case tag.
 * Window: 1–30 May 2027 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CEST) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_20_LAUNCH_SLOTS = [
  slotUtc("2027-05-01"),
  slotUtc("2027-05-03"),
  slotUtc("2027-05-05"),
  slotUtc("2027-05-07"),
  slotUtc("2027-05-09"),
  slotUtc("2027-05-11"),
  slotUtc("2027-05-13"),
  slotUtc("2027-05-15"),
  slotUtc("2027-05-17"),
  slotUtc("2027-05-20"),
  slotUtc("2027-05-25"),
  slotUtc("2027-05-30"),
] as const;

export const TIER_20_AI_WRITING_CONTENT_KEYS = [
  "category:ai-writing",
  "guide:what-is-ai-writing-software",
  "guide:how-to-choose-ai-writing-software",
  "guide:ai-writing-pricing-guide",
  "guide:how-ai-writing-software-works",
  "guide:types-of-ai-writing-software",
  "guide:ai-writing-vs-ai-software",
  "guide:ai-writing-requirements-guide",
  "guide:ai-writing-evaluation-guide",
  "best:ai-writing-software",
  "guide:what-is-quillbot",
  "guide:what-is-writesonic",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_20_AI_WRITING_CONTENT_KEYS.length; i++) {
    const key = TIER_20_AI_WRITING_CONTENT_KEYS[i];
    const slot = TIER_20_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_20_SCHEDULE = buildScheduleMap();

export function tier20ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_20_SCHEDULE.get(contentKey);
}

export function tier20GuideScheduledAt(guideSlug: string): string | undefined {
  return tier20ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier20CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier20ContentScheduledAt(`category:${categorySlug}`);
}

export function tier20BestScheduledAt(bestSlug: string): string | undefined {
  return tier20ContentScheduledAt(`best:${bestSlug}`);
}

export function tier20ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier20GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_20_SCHEDULED_GUIDE_SLUGS =
  TIER_20_AI_WRITING_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
