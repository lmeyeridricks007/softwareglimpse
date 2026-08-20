import type { ImplementationApproach, MigrationNeeded } from "@/domain";

/**
 * Planning templates for TCO assumptions.
 * These are NOT researched market averages or vendor quotes — users opt in
 * and values remain labelled "Your estimate".
 */

export type MigrationEstimateTemplate = {
  id: string;
  label: string;
  blurb: string;
  externalMajor: number;
  cleaningMajor: number;
  internalHours: number;
};

export type ImplementationEstimateTemplate = {
  id: string;
  label: string;
  blurb: string;
  externalMajor: number;
  internalHours: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

const MIGRATION_FACTORS: Record<
  Exclude<MigrationNeeded, "none" | "unknown">,
  { externalPerUser: number; cleaningPerUser: number; hoursPerUser: number }
> = {
  basic: { externalPerUser: 80, cleaningPerUser: 30, hoursPerUser: 2 },
  moderate: { externalPerUser: 200, cleaningPerUser: 80, hoursPerUser: 6 },
  complex: { externalPerUser: 500, cleaningPerUser: 150, hoursPerUser: 14 },
};

/**
 * Build 3 relative starters (lean / mid / heavy) from migration complexity + seats.
 */
export function buildMigrationEstimateTemplates(input: {
  needed: MigrationNeeded;
  users: number;
}): MigrationEstimateTemplate[] {
  const { needed, users } = input;
  if (needed === "none" || needed === "unknown") return [];

  const base = MIGRATION_FACTORS[needed];
  const u = Math.max(1, users);

  const midExternal = clamp(u * base.externalPerUser, 1_500, 120_000);
  const midCleaning = clamp(u * base.cleaningPerUser, 500, 40_000);
  const midHours = clamp(u * base.hoursPerUser, 8, 800);

  return [
    {
      id: "lean",
      label: "Lean",
      blurb: "Mostly self-serve with light partner help",
      externalMajor: clamp(midExternal * 0.55, 800, 80_000),
      cleaningMajor: clamp(midCleaning * 0.55, 250, 25_000),
      internalHours: clamp(midHours * 0.7, 4, 600),
    },
    {
      id: "mid",
      label: "Mid",
      blurb: `Starter for ${needed} migration · ${u} users`,
      externalMajor: midExternal,
      cleaningMajor: midCleaning,
      internalHours: midHours,
    },
    {
      id: "heavy",
      label: "Heavy",
      blurb: "Partner-led with more cleanup and oversight",
      externalMajor: clamp(midExternal * 1.6, 2_000, 180_000),
      cleaningMajor: clamp(midCleaning * 1.6, 800, 60_000),
      internalHours: clamp(midHours * 1.35, 12, 1_000),
    },
  ];
}

const IMPLEMENTATION_FACTORS: Partial<
  Record<
    ImplementationApproach,
    { externalPerUser: number; hoursPerUser: number }
  >
> = {
  "self-service": { externalPerUser: 40, hoursPerUser: 4 },
  internal: { externalPerUser: 80, hoursPerUser: 8 },
  vendor: { externalPerUser: 250, hoursPerUser: 3 },
  partner: { externalPerUser: 320, hoursPerUser: 4 },
  mixed: { externalPerUser: 200, hoursPerUser: 6 },
  unsure: { externalPerUser: 180, hoursPerUser: 5 },
};

export function buildImplementationEstimateTemplates(input: {
  approach: ImplementationApproach;
  users: number;
}): ImplementationEstimateTemplate[] {
  const factors =
    IMPLEMENTATION_FACTORS[input.approach] ?? IMPLEMENTATION_FACTORS.unsure!;
  const u = Math.max(1, input.users);

  const midExternal = clamp(u * factors.externalPerUser, 1_000, 150_000);
  const midHours = clamp(u * factors.hoursPerUser, 8, 900);

  return [
    {
      id: "lean",
      label: "Lean",
      blurb: "Light setup, minimal customization",
      externalMajor: clamp(midExternal * 0.55, 500, 90_000),
      internalHours: clamp(midHours * 0.65, 4, 600),
    },
    {
      id: "mid",
      label: "Mid",
      blurb: `Starter for ${input.approach.replace(/-/g, " ")} · ${u} users`,
      externalMajor: midExternal,
      internalHours: midHours,
    },
    {
      id: "heavy",
      label: "Heavy",
      blurb: "Heavier configuration and change support",
      externalMajor: clamp(midExternal * 1.65, 2_000, 220_000),
      internalHours: clamp(midHours * 1.4, 12, 1_200),
    },
  ];
}

/** Quick picks for CRM admin hours/week — planning assumptions only. */
export function adminHoursWeekPresets(users: number): Array<{
  id: string;
  label: string;
  hoursPerWeek: number;
  blurb: string;
}> {
  const u = Math.max(1, users);
  const light = Math.max(2, Math.round(u * 0.08));
  const mid = Math.max(4, Math.round(u * 0.2));
  const heavy = Math.max(8, Math.round(u * 0.35));
  return [
    {
      id: "light",
      label: "Light",
      hoursPerWeek: light,
      blurb: `~${light} hrs/week for ${u} users`,
    },
    {
      id: "steady",
      label: "Steady",
      hoursPerWeek: mid,
      blurb: `~${mid} hrs/week — common planning start`,
    },
    {
      id: "dedicated",
      label: "Dedicated",
      hoursPerWeek: heavy,
      blurb: `~${heavy} hrs/week — heavier ops load`,
    },
  ];
}

export const INTERNAL_HOURLY_PRESETS = [
  { id: "ops-35", label: "Ops / junior", hourlyMajor: 35 },
  { id: "mid-50", label: "Mid-level", hourlyMajor: 50 },
  { id: "senior-75", label: "Senior / specialist", hourlyMajor: 75 },
  { id: "lead-100", label: "Lead / consultant", hourlyMajor: 100 },
] as const;

export function trainingHoursPerUserPresets(): Array<{
  id: string;
  label: string;
  hoursPerUser: number;
  blurb: string;
}> {
  return [
    {
      id: "light",
      label: "Light",
      hoursPerUser: 1,
      blurb: "1 hr intro / self-serve",
    },
    {
      id: "standard",
      label: "Standard",
      hoursPerUser: 3,
      blurb: "3 hrs workshop + practice",
    },
    {
      id: "deep",
      label: "Deep",
      hoursPerUser: 6,
      blurb: "6 hrs role-based enablement",
    },
  ];
}

export function supportMonthlyPresets(users: number): Array<{
  id: string;
  label: string;
  monthlyMajor: number;
  blurb: string;
}> {
  const u = Math.max(1, users);
  return [
    {
      id: "none",
      label: "None",
      monthlyMajor: 0,
      blurb: "Rely on included support",
    },
    {
      id: "light",
      label: "Light",
      monthlyMajor: clamp(u * 8, 100, 2_000),
      blurb: "Light partner retainer",
    },
    {
      id: "premium",
      label: "Premium",
      monthlyMajor: clamp(u * 20, 250, 5_000),
      blurb: "Premium / partner support",
    },
  ];
}
