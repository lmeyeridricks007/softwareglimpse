/**
 * Tier 18 Field Service & Operations category launch — hub, guides, best page, and
 * product what-is guides (contractor-foreman affiliate; servicem8 editorial anchor).
 * Shore what-is already ships Tier 7 CS (Nov 2026). No generic finder — vertical-specific.
 * Window: 1–30 March 2027 (~every 2–3 days).
 */

/** 08:00 Europe/Amsterdam (CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_18_LAUNCH_SLOTS = [
  slotUtc("2027-03-01"),
  slotUtc("2027-03-03"),
  slotUtc("2027-03-05"),
  slotUtc("2027-03-07"),
  slotUtc("2027-03-09"),
  slotUtc("2027-03-11"),
  slotUtc("2027-03-13"),
  slotUtc("2027-03-15"),
  slotUtc("2027-03-17"),
  slotUtc("2027-03-20"),
  slotUtc("2027-03-25"),
  slotUtc("2027-03-30"),
] as const;

export const TIER_18_FIELD_SERVICE_OPERATIONS_CONTENT_KEYS = [
  "category:field-service-operations",
  "guide:what-is-field-service-operations-software",
  "guide:how-to-choose-field-service-operations-software",
  "guide:field-service-operations-pricing-guide",
  "guide:how-field-service-operations-software-works",
  "guide:types-of-field-service-operations-software",
  "guide:field-service-operations-vs-project-management-software",
  "guide:field-service-operations-requirements-guide",
  "guide:field-service-operations-evaluation-guide",
  "best:field-service-operations-software",
  "guide:what-is-contractor-foreman",
  "guide:what-is-servicem8",
] as const;

function buildScheduleMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < TIER_18_FIELD_SERVICE_OPERATIONS_CONTENT_KEYS.length; i++) {
    const key = TIER_18_FIELD_SERVICE_OPERATIONS_CONTENT_KEYS[i];
    const slot = TIER_18_LAUNCH_SLOTS[i];
    if (!key || !slot) break;
    map.set(key, slot);
  }
  return map;
}

const TIER_18_SCHEDULE = buildScheduleMap();

export function tier18ContentScheduledAt(contentKey: string): string | undefined {
  return TIER_18_SCHEDULE.get(contentKey);
}

export function tier18GuideScheduledAt(guideSlug: string): string | undefined {
  return tier18ContentScheduledAt(`guide:${guideSlug}`);
}

export function tier18CategoryScheduledAt(categorySlug: string): string | undefined {
  return tier18ContentScheduledAt(`category:${categorySlug}`);
}

export function tier18BestScheduledAt(bestSlug: string): string | undefined {
  return tier18ContentScheduledAt(`best:${bestSlug}`);
}

export function tier18ProductWhatIsScheduledAt(
  productSlug: string,
): string | undefined {
  return tier18GuideScheduledAt(`what-is-${productSlug}`);
}

export const TIER_18_SCHEDULED_GUIDE_SLUGS =
  TIER_18_FIELD_SERVICE_OPERATIONS_CONTENT_KEYS.filter((key) =>
    key.startsWith("guide:"),
  ).map((key) => key.replace(/^guide:/, ""));
