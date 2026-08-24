/**
 * Tier 1 hard-gap rollout — affiliate software launches only.
 * CS short guides deferred to [Tier 7](../publishing/launches/tier-7-cs-short-guides-2026-11-01.md) (Nov 2026).
 */

/** 08:00 Europe/Amsterdam (CEST/CET) on each slot date. */
function slotUtc(date: string): string {
  return `${date}T06:00:00.000Z`;
}

export const TIER_1_LAUNCH_SLOTS = [
  slotUtc("2026-08-26"),
  slotUtc("2026-08-29"),
] as const;

type Tier1ScheduledItem =
  | { kind: "software"; slug: string; scheduledAt: string }
  | { kind: "guide"; guideSlug: string; scheduledAt: string };

/** Affiliate software launches — sellfy + ai-intelekt. WebinarJam → [Tier 11](../publishing/launches/tier-11-marketing-affiliate-launch-2027-01-11.md). */
export const TIER_1_SCHEDULE: Tier1ScheduledItem[] = [
  { kind: "software", slug: "sellfy", scheduledAt: TIER_1_LAUNCH_SLOTS[0] },
  { kind: "software", slug: "ai-intelekt", scheduledAt: TIER_1_LAUNCH_SLOTS[1] },
];

export const TIER_1_SCHEDULED_SOFTWARE_SLUGS = TIER_1_SCHEDULE.filter(
  (item): item is Extract<Tier1ScheduledItem, { kind: "software" }> =>
    item.kind === "software",
).map((item) => item.slug);

export const TIER_1_SCHEDULED_GUIDE_SLUGS = TIER_1_SCHEDULE.filter(
  (item): item is Extract<Tier1ScheduledItem, { kind: "guide" }> =>
    item.kind === "guide",
).map((item) => item.guideSlug);

const softwareAtBySlug = new Map(
  TIER_1_SCHEDULE.filter(
    (item): item is Extract<Tier1ScheduledItem, { kind: "software" }> =>
      item.kind === "software",
  ).map((item) => [item.slug, item.scheduledAt] as const),
);

const guideAtBySlug = new Map(
  TIER_1_SCHEDULE.filter(
    (item): item is Extract<Tier1ScheduledItem, { kind: "guide" }> =>
      item.kind === "guide",
  ).map((item) => [item.guideSlug, item.scheduledAt] as const),
);

export function tier1SoftwareScheduledAt(slug: string): string | undefined {
  return softwareAtBySlug.get(slug);
}

export function tier1GuideScheduledAt(guideSlug: string): string | undefined {
  return guideAtBySlug.get(guideSlug);
}
