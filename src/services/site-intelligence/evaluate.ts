import {
  SITE_INTELLIGENCE_VERSION,
  SiteIntelligenceAssessmentSchema,
  type SiteIntelligenceAssessment,
  type SiteIntelligenceInput,
} from "@/domain/schemas/site-intelligence";
import { siteBandLabel } from "./bands";
import { scoreCompetitiveStrength } from "./competitive";
import {
  flagUnlikelyPages,
  rollupByKey,
  scoreContentQuality,
} from "./content-quality";
import { scoreContentEcosystem } from "./ecosystem";
import { scoreWebsiteExperience } from "./experience";
import { scoreOverallWebsiteQuality } from "./overall";
import {
  defaultAuthorityUnavailable,
  scoreRankingOpportunity,
} from "./ranking-opportunity";
import { scoreTechnicalSeoHealth } from "./technical";
import { scoreSearchVisibility } from "./visibility";

const DISCLAIMER =
  "Site Intelligence scores measure readiness, usefulness, coherence, relative competitiveness, and opportunity — they do not predict Google rankings or express a chance-of-ranking percentage.";

function deriveNextImprovements(
  assessment: Omit<
    SiteIntelligenceAssessment,
    "strengths" | "weaknesses" | "nextImprovements" | "disclaimer"
  >,
): { strengths: string[]; weaknesses: string[]; next: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const next: string[] = [];

  const comps = [
    assessment.technicalSeoHealth,
    assessment.contentQuality,
    assessment.websiteExperience,
    assessment.contentEcosystemStrength,
    assessment.competitiveContentStrength,
  ];

  for (const c of comps) {
    if (c.availability === "scored" && c.score != null) {
      if (c.score >= 80) {
        strengths.push(
          `${c.id}: ${c.score}/100 (${c.band ? siteBandLabel(c.band) : "—"})`,
        );
      } else if (c.score < 70) {
        weaknesses.push(
          `${c.id}: ${c.score}/100 (${c.band ? siteBandLabel(c.band) : "—"})`,
        );
      }
    } else if (c.availability === "unavailable") {
      weaknesses.push(`${c.id}: unavailable — ${c.confidence.reasons[0]}`);
    }
  }

  if (assessment.searchVisibility.availability === "data-not-available") {
    next.push(
      "Connect Search Console / import performance snapshots before claiming search visibility",
    );
  }

  if (assessment.authorityLimitations.status === "unavailable") {
    next.push(
      "Treat Ranking Opportunity authority factor as neutral-unknown until off-site data exists",
    );
  }

  const p0 = assessment.technicalSeoHealth.evidence.filter((e) =>
    /^P0:/i.test(e.label),
  );
  if (p0.length > 0) {
    next.push(`Resolve technical P0 findings first (${p0.length} evidenced)`);
  }

  if (assessment.pageFlags.length > 0) {
    next.push(
      `Improve ${assessment.pageFlags.length} page(s) flagged unlikely to rank without substantial improvement`,
    );
  }

  if (assessment.competitiveContentStrength.weakerThan.length > 0) {
    next.push(
      `Close competitive gaps: ${assessment.competitiveContentStrength.weakerThan.slice(0, 3).join("; ")}`,
    );
  }

  if (
    assessment.contentEcosystemStrength.availability === "scored" &&
    (assessment.contentEcosystemStrength.score ?? 100) < 75
  ) {
    next.push(
      "Raise ecosystem completeness (pillars, supporting coverage, linking) via master map gaps",
    );
  }

  if (next.length === 0) {
    next.push(
      "Maintain quality; prioritize cluster Ranking Opportunity GOOD+ topics with CQ gaps",
    );
  }

  return { strengths, weaknesses, next };
}

/**
 * Compose Site Intelligence assessment from existing-system snapshots.
 * Does not mutate production content or re-run underlying audits.
 */
export function evaluateSiteIntelligence(
  raw: SiteIntelligenceInput,
): SiteIntelligenceAssessment {
  const evaluatedAt = raw.evaluatedAt ?? new Date().toISOString();
  const authority = raw.authority ?? defaultAuthorityUnavailable();
  const technicalFindings = raw.technicalFindings ?? [];
  const technicalChecks = raw.technicalChecks ?? [];
  const pages = raw.pages ?? [];
  const experienceDimensions = raw.experienceDimensions ?? [];
  const ecosystemDimensions = raw.ecosystemDimensions ?? [];

  const technicalSeoHealth = scoreTechnicalSeoHealth({
    findings: technicalFindings,
    checks: technicalChecks,
  });
  const contentQuality = scoreContentQuality({ pages });
  const websiteExperience = scoreWebsiteExperience({
    dimensions: experienceDimensions,
  });
  const contentEcosystemStrength = scoreContentEcosystem({
    dimensions: ecosystemDimensions,
  });
  const competitiveContentStrength = scoreCompetitiveStrength({
    pack: raw.competitorPack,
  });
  const searchVisibility = scoreSearchVisibility({
    metrics: raw.searchVisibility,
  });

  const rankingOpportunities = (raw.rankingOpportunities ?? []).map((opp) =>
    scoreRankingOpportunity({
      opportunity: opp,
      authority,
      visibilityAvailable: searchVisibility.availability === "scored",
    }),
  );

  const { overall, breakdown } = scoreOverallWebsiteQuality({
    technical: technicalSeoHealth,
    content: contentQuality,
    experience: websiteExperience,
    ecosystem: contentEcosystemStrength,
    competitive: competitiveContentStrength,
  });

  const technicalP0Routes = new Set(
    technicalFindings
      .filter((f) => f.severity === "P0")
      .flatMap((f) => f.affectedPages),
  );
  const pageFlags = flagUnlikelyPages(pages, technicalP0Routes);

  const pageTypeRollups = rollupByKey(pages, (p) => p.pageType).map((r) => ({
    pageType: r.key,
    pageCount: r.pageCount,
    weightedScore: r.weightedScore,
  }));
  const clusterRollups = rollupByKey(pages, (p) => p.clusterId).map((r) => ({
    clusterId: r.key,
    pageCount: r.pageCount,
    weightedScore: r.weightedScore,
  }));

  const draft = {
    evaluatorVersion: SITE_INTELLIGENCE_VERSION,
    evaluatedAt,
    scopeLabel: raw.scopeLabel ?? "site",
    technicalSeoHealth,
    contentQuality,
    websiteExperience,
    contentEcosystemStrength,
    competitiveContentStrength,
    searchVisibility,
    rankingOpportunities,
    overallWebsiteQuality: overall,
    overallBreakdown: breakdown,
    authorityLimitations: authority,
    pageTypeRollups,
    clusterRollups,
    pageFlags,
    strengths: [] as string[],
    weaknesses: [] as string[],
    nextImprovements: [] as string[],
    disclaimer: DISCLAIMER,
  };

  const derived = deriveNextImprovements(draft);
  const assessment: SiteIntelligenceAssessment = {
    ...draft,
    strengths: derived.strengths,
    weaknesses: derived.weaknesses,
    nextImprovements: derived.next,
  };

  return SiteIntelligenceAssessmentSchema.parse(assessment);
}

export function formatOverallSummary(
  assessment: SiteIntelligenceAssessment,
): string {
  const o = assessment.overallWebsiteQuality;
  if (o.availability !== "scored" || o.score == null) {
    return "Overall Website Quality: UNAVAILABLE";
  }
  const band = o.band ? siteBandLabel(o.band) : "—";
  const lines = [
    "Overall Website Quality",
    `${o.score} / 100`,
    band,
    "",
    "Breakdown:",
  ];
  for (const row of assessment.overallBreakdown) {
    lines.push(
      `- ${row.componentId} …… ${row.score}  (weight ${row.weight.toFixed(2)}; confidence ${row.confidence})`,
    );
  }
  lines.push("");
  lines.push(DISCLAIMER);
  return lines.join("\n");
}
