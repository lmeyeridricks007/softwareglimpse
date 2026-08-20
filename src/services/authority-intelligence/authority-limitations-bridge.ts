/**
 * Bridge Authority Intelligence → Site Intelligence AuthorityLimitations.
 * Off-site metrics remain constraints — never folded into Overall Website Quality.
 */

import type { AuthorityLimitations } from "@/domain/schemas/site-intelligence";
import type { AuthorityOpportunity } from "@/domain/schemas/authority-intelligence";

export function toAuthorityLimitations(
  opportunities: AuthorityOpportunity[],
  opts?: { notes?: string[] },
): AuthorityLimitations {
  const actionable = opportunities.filter((o) => o.scoreBand !== "AVOID");
  const strong = actionable.filter(
    (o) => o.scoreBand === "EXCELLENT" || o.scoreBand === "STRONG",
  );
  const avoid = opportunities.filter((o) => o.scoreBand === "AVOID");

  const knownGaps: string[] = [];
  if (strong.length === 0) {
    knownGaps.push(
      "No EXCELLENT/STRONG qualified opportunities yet — authority growth is early-stage.",
    );
  }
  knownGaps.push(
    "No live backlink index provider wired — do not invent referring-domain counts.",
  );
  knownGaps.push(
    "Third-party DA/DR (if added later) are external metrics only — not Google ranking scores.",
  );

  const impactOnOpportunity =
    strong.length >= 3
      ? ("supporting" as const)
      : strong.length === 0
        ? ("constraining" as const)
        : ("neutral-unknown" as const);

  return {
    status: "available",
    confidence: strong.length >= 2 ? "medium" : "low",
    notes: [
      `Authority Intelligence qualified ${actionable.length} opportunities (${strong.length} strong+).`,
      `${avoid.length} marked AVOID — LINK SPAM RISK / policy reject.`,
      "Agents discover/verify/qualify/recommend/draft only — no automated outreach.",
      ...(opts?.notes ?? []),
    ],
    knownGaps,
    impactOnOpportunity,
  };
}
