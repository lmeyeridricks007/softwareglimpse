import type { ProductScorecardResult } from "./engine";
import type { ScorecardProductResearch } from "./engine";
import { OVERALL_FIT_DISPLAY } from "./labels";

export type TradeoffCard = {
  productSlug: string;
  productName: string;
  gains: string[];
  trades: string[];
};

export function buildTradeoffCards(
  results: ProductScorecardResult[],
  research: ScorecardProductResearch[],
): TradeoffCard[] {
  return results.map((result) => {
    const product = research.find((p) => p.slug === result.productSlug);
    const gains = [
      ...result.strongestAreas.map((a) => a),
      ...(product?.strengths.slice(0, 2) ?? []),
    ].slice(0, 4);
    const trades = [
      ...(result.mainTradeOff ? [result.mainTradeOff] : []),
      ...(product?.weaknesses.slice(0, 2) ?? []),
    ].slice(0, 4);
    return {
      productSlug: result.productSlug,
      productName: result.productName,
      gains: unique(gains),
      trades: unique(trades),
    };
  });
}

export type PairwiseSummary = {
  productASlug: string;
  productBSlug: string;
  chooseAIf: string;
  chooseBIf: string;
  unknowns: string[];
};

export function buildPairwiseSummaries(
  ranked: ProductScorecardResult[],
): PairwiseSummary[] {
  if (ranked.length < 2) return [];
  const pairs: PairwiseSummary[] = [];
  for (let i = 0; i < ranked.length - 1; i++) {
    const a = ranked[i]!;
    const b = ranked[i + 1]!;
    const aStrengths =
      a.strongestAreas.slice(0, 3).join(", ") || "your weighted priorities";
    const bStrengths =
      b.strongestAreas.slice(0, 3).join(", ") || "your weighted priorities";
    const unknowns: string[] = [];
    for (const mh of [...a.mustHaves, ...b.mustHaves]) {
      if (mh.status === "unknown") {
        unknowns.push(`${mh.label} needs verification`);
      }
    }
    pairs.push({
      productASlug: a.productSlug,
      productBSlug: b.productSlug,
      chooseAIf: `Choose ${a.productName} if ${aStrengths} matter more for your scorecard.`,
      chooseBIf: `Choose ${b.productName} if ${bStrengths} matter more for your scorecard.`,
      unknowns: unique(unknowns).slice(0, 4),
    });
  }
  return pairs;
}

export type OpenQuestion = {
  productSlug: string;
  productName: string;
  message: string;
  severity: "warning" | "info";
};

export function buildOpenQuestions(
  results: ProductScorecardResult[],
): OpenQuestion[] {
  const questions: OpenQuestion[] = [];
  for (const result of results) {
    for (const mh of result.mustHaves) {
      if (mh.status === "unknown") {
        questions.push({
          productSlug: result.productSlug,
          productName: result.productName,
          message: `${mh.label} not fully verified`,
          severity: "warning",
        });
      }
      if (mh.status === "partial") {
        questions.push({
          productSlug: result.productSlug,
          productName: result.productName,
          message: `${mh.label} may require a higher plan — verify qualifying cost`,
          severity: "warning",
        });
      }
      if (mh.status === "failed") {
        questions.push({
          productSlug: result.productSlug,
          productName: result.productName,
          message: `Fails must-have: ${mh.label}`,
          severity: "warning",
        });
      }
    }
    if (result.overallFit === "insufficient-evidence") {
      questions.push({
        productSlug: result.productSlug,
        productName: result.productName,
        message: "Implementation / research depth not fully scored",
        severity: "info",
      });
    }
    const unknownCells = result.cells.filter((c) => c.qualitative === "unknown");
    for (const cell of unknownCells.slice(0, 2)) {
      questions.push({
        productSlug: result.productSlug,
        productName: result.productName,
        message: `${cell.label} needs research verification`,
        severity: "info",
      });
    }
  }
  return questions.slice(0, 12);
}

export function recommendationSentence(
  leader: ProductScorecardResult | null,
  runnerUp?: ProductScorecardResult | null,
): string | null {
  if (!leader) return null;
  if (
    leader.overallFit === "insufficient-evidence" ||
    leader.failsMustHave
  ) {
    return null;
  }
  const fit = OVERALL_FIT_DISPLAY[leader.overallFit];
  const strengths = leader.strongestAreas.slice(0, 2);
  const strengthClause =
    strengths.length > 0
      ? ` It leads on ${strengths.join(" and ").toLowerCase()} against your weighted priorities.`
      : "";
  let vsClause = "";
  if (runnerUp) {
    const edges = criteriaWhereLeaderWins(leader, runnerUp).slice(0, 2);
    if (edges.length > 0) {
      vsClause = ` Compared with ${runnerUp.productName}, it is stronger on ${edges.join(" and ").toLowerCase()}.`;
    }
  }
  return `Based on the priorities and evidence in this scorecard, ${leader.productName} currently has the strongest fit (${fit.toLowerCase()}).${strengthClause}${vsClause}`;
}

export type LeaderRationale = {
  headline: string;
  whyLeads: string[];
  watchOuts: string[];
  vsRunnerUp: string | null;
  mustHaveLine: string;
};

function cellScore(cell: {
  numericScore: number | null;
  qualitative: string;
}): number {
  if (cell.numericScore != null) return cell.numericScore;
  switch (cell.qualitative) {
    case "strong":
      return 9;
    case "good":
      return 7.5;
    case "partial":
      return 5.5;
    case "does-not-meet":
      return 2;
    default:
      return -1;
  }
}

function criteriaWhereLeaderWins(
  leader: ProductScorecardResult,
  runnerUp: ProductScorecardResult,
): string[] {
  const wins: Array<{ label: string; delta: number; weight: number }> = [];
  for (const cell of leader.cells) {
    const other = runnerUp.cells.find((c) => c.criterionId === cell.criterionId);
    if (!other || cell.weight <= 0) continue;
    const a = cellScore(cell);
    const b = cellScore(other);
    if (a < 0 || b < 0) continue;
    if (a > b) {
      wins.push({ label: cell.label, delta: a - b, weight: cell.weight });
    }
  }
  return wins
    .sort((x, y) => y.weight * y.delta - x.weight * x.delta)
    .map((w) => w.label);
}

/**
 * Structured “why this product leads” for the results summary UI.
 * Evidence-grounded only — no invented claims.
 */
export function buildLeaderRationale(
  leader: ProductScorecardResult,
  runnerUp: ProductScorecardResult | null,
  researchStrengths: string[] = [],
): LeaderRationale {
  const fit = OVERALL_FIT_DISPLAY[leader.overallFit];
  const whyLeads: string[] = [];

  for (const area of leader.strongestAreas.slice(0, 3)) {
    const cell = leader.cells.find((c) => c.label === area);
    const weightPct =
      cell?.weight != null ? Math.round(cell.weight * 100) : null;
    whyLeads.push(
      weightPct != null
        ? `Strong on ${area} (${weightPct}% of your weighted priorities)`
        : `Strong on ${area}`,
    );
  }

  if (leader.mustHaveSummary.failed === 0 && leader.mustHaveSummary.total > 0) {
    whyLeads.push(
      `No failed must-haves (${leader.mustHaveSummary.satisfied}/${leader.mustHaveSummary.total} verified satisfied)`,
    );
  }

  for (const s of researchStrengths.slice(0, 2)) {
    if (whyLeads.length >= 5) break;
    whyLeads.push(s);
  }

  if (
    leader.weightedResearchScore != null &&
    runnerUp?.weightedResearchScore != null &&
    leader.weightedResearchScore > runnerUp.weightedResearchScore
  ) {
    whyLeads.push(
      `Higher weighted research fit (${leader.weightedResearchScore}/10 vs ${runnerUp.weightedResearchScore}/10)`,
    );
  }

  const watchOuts: string[] = [];
  if (leader.mainTradeOff) {
    watchOuts.push(`Weaker relative area: ${leader.mainTradeOff}`);
  }
  if (leader.mustHaveSummary.unknown > 0) {
    watchOuts.push(
      `${leader.mustHaveSummary.unknown} must-have${leader.mustHaveSummary.unknown === 1 ? "" : "s"} still unresolved — verify before deciding`,
    );
  }
  if (leader.overallFit === "conditional-fit") {
    watchOuts.push(
      "Conditional fit means evidence or must-have gaps remain — treat this as a shortlist leader, not a final purchase decision",
    );
  }

  let vsRunnerUp: string | null = null;
  if (runnerUp) {
    const edges = criteriaWhereLeaderWins(leader, runnerUp).slice(0, 3);
    if (edges.length > 0) {
      vsRunnerUp = `Leads ${runnerUp.productName} on ${edges.join(", ").toLowerCase()}`;
    } else if (runnerUp.strongestAreas[0]) {
      vsRunnerUp = `${runnerUp.productName} remains competitive, especially on ${runnerUp.strongestAreas[0].toLowerCase()}`;
    }
  }

  return {
    headline: `${leader.productName} is the current top fit (${fit.toLowerCase()}) for this scorecard’s priorities and evidence.`,
    whyLeads: unique(whyLeads).slice(0, 5),
    watchOuts: unique(watchOuts).slice(0, 3),
    vsRunnerUp,
    mustHaveLine: `${leader.mustHaveSummary.satisfied} satisfied · ${leader.mustHaveSummary.failed} failed · ${leader.mustHaveSummary.unknown} unresolved`,
  };
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}
