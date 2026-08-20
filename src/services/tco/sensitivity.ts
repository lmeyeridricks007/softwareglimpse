import type { TCOScenario } from "@/domain";
import type { PricingSnapshot } from "@/services/pricing";
import { computeTco } from "./compute";

export type SensitivityDelta = {
  id: string;
  label: string;
  deltaKnownTcoMinor: number;
  description: string;
};

/**
 * Deterministic sensitivity from the user's own base scenario.
 * Does not invent market averages — only shows effect of stated input changes.
 */
export function buildSensitivityAnalysis(input: {
  scenario: TCOScenario;
  productId: string;
  snapshots: PricingSnapshot[];
  requiredFeatureSlugs?: string[];
}): SensitivityDelta[] {
  const base = computeTco(input);
  const focus =
    base.products.find((p) => p.productId === input.productId) ??
    base.products[0];
  if (!focus) return [];

  const deltas: SensitivityDelta[] = [];
  const baseKnown = focus.knownTcoMinor;

  // Admin hours +50% (or +4 hrs if set)
  if (input.scenario.administration.hoursPerWeek != null) {
    const hours = input.scenario.administration.hoursPerWeek;
    const nextHours = hours === 0 ? 4 : Math.round(hours * 1.5 * 10) / 10;
    const alt = computeTco({
      ...input,
      scenario: {
        ...input.scenario,
        administration: {
          ...input.scenario.administration,
          hoursPerWeek: nextHours,
        },
      },
    });
    const altProduct = alt.products.find((p) => p.productId === focus.productId);
    if (altProduct) {
      deltas.push({
        id: "admin-hours",
        label: `Admin effort ${hours} → ${nextHours} hrs/week`,
        deltaKnownTcoMinor: altProduct.knownTcoMinor - baseKnown,
        description: `If CRM administration changes from ${hours} to ${nextHours} hours/week`,
      });
    }
  }

  // Seat growth: +15 users in year 1 (and scale growth)
  {
    const nextUsers = input.scenario.startingUsers + 15;
    const alt = computeTco({
      ...input,
      scenario: {
        ...input.scenario,
        startingUsers: nextUsers,
      },
    });
    const altProduct = alt.products.find((p) => p.productId === focus.productId);
    if (altProduct) {
      deltas.push({
        id: "users",
        label: `Users ${input.scenario.startingUsers} → ${nextUsers}`,
        deltaKnownTcoMinor: altProduct.knownTcoMinor - baseKnown,
        description: `If starting users grow from ${input.scenario.startingUsers} to ${nextUsers}`,
      });
    }
  }

  // Implementation +10k (in major currency units → minor)
  {
    const bump = 10_000 * 100;
    const current = input.scenario.implementation.externalCostMinor;
    const next =
      typeof current === "number" && current != null ? current + bump : bump;
    const alt = computeTco({
      ...input,
      scenario: {
        ...input.scenario,
        implementation: {
          ...input.scenario.implementation,
          externalCostMinor: next,
        },
      },
    });
    const altProduct = alt.products.find((p) => p.productId === focus.productId);
    if (altProduct) {
      deltas.push({
        id: "implementation",
        label: "Implementation +10,000",
        deltaKnownTcoMinor: altProduct.knownTcoMinor - baseKnown,
        description: "If implementation rises by 10,000 (your currency)",
      });
    }
  }

  return deltas.filter((d) => d.deltaKnownTcoMinor !== 0);
}
