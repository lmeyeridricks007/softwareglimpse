import type { TCOHorizonYears, TCOSeatYear, TCOScenario } from "@/domain";

/**
 * Build year-by-year seat counts from scenario growth settings.
 * Does not invent growth — flat unless the user chose percent/custom.
 */
export function buildSeatPlan(scenario: TCOScenario): TCOSeatYear[] {
  const years = scenario.horizonYears as TCOHorizonYears;
  const plan: TCOSeatYear[] = [];

  if (scenario.growthMode === "custom" && scenario.customSeats?.length) {
    for (let y = 1; y <= years; y++) {
      const users =
        scenario.customSeats[y - 1] ??
        scenario.customSeats[scenario.customSeats.length - 1] ??
        scenario.startingUsers;
      plan.push({ year: y, users: Math.max(1, Math.round(users)) });
    }
    return plan;
  }

  let users = scenario.startingUsers;
  const growth =
    scenario.growthMode === "percent"
      ? (scenario.annualGrowthPercent ?? 0) / 100
      : 0;

  for (let y = 1; y <= years; y++) {
    const rounded = Math.max(1, Math.round(users));
    plan.push({ year: y, users: rounded });
    if (y < years && growth > 0) {
      users = rounded * (1 + growth);
    }
  }
  return plan;
}
