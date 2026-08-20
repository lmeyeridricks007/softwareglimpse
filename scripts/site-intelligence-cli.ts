#!/usr/bin/env tsx
/**
 * Site Intelligence fixtures CLI — evaluate only; no production mutation.
 *
 * Usage:
 *   npm run site:intelligence:fixtures
 *   npm run site:intelligence:fixtures -- technically-strong-thin-content
 */

import {
  evaluateSiteIntelligence,
  formatOverallSummary,
  getSiteIntelligenceFixture,
  listSiteIntelligenceFixtureIds,
  type SiteIntelligenceFixtureId,
} from "../src/services/site-intelligence";
import { opportunityBandLabel, siteBandLabel } from "../src/services/site-intelligence/bands";

const arg = process.argv[2];
const ids = (
  arg
    ? [arg as SiteIntelligenceFixtureId]
    : listSiteIntelligenceFixtureIds()
).filter((id) => listSiteIntelligenceFixtureIds().includes(id));

if (ids.length === 0) {
  console.error(
    `Unknown fixture. Available: ${listSiteIntelligenceFixtureIds().join(", ")}`,
  );
  process.exit(1);
}

for (const id of ids) {
  const assessment = evaluateSiteIntelligence(getSiteIntelligenceFixture(id));
  console.log(`\n=== ${id} ===\n`);
  console.log(formatOverallSummary(assessment));
  console.log(`\nTechnical: ${assessment.technicalSeoHealth.score}`);
  console.log(`Content: ${assessment.contentQuality.score}`);
  console.log(`Experience: ${assessment.websiteExperience.score}`);
  console.log(`Ecosystem: ${assessment.contentEcosystemStrength.score}`);
  console.log(
    `Competitive: ${assessment.competitiveContentStrength.availability === "scored" ? assessment.competitiveContentStrength.score : "UNAVAILABLE"} (${assessment.competitiveContentStrength.confidence.level})`,
  );
  console.log(
    `Visibility: ${assessment.searchVisibility.availability === "scored" ? assessment.searchVisibility.score : "DATA NOT AVAILABLE"}`,
  );
  for (const opp of assessment.rankingOpportunities) {
    console.log(
      `Opportunity: ${opp.score} / ${opp.opportunityBand ? opportunityBandLabel(opp.opportunityBand) : "—"} — ${opp.notes[0] ?? ""}`,
    );
  }
  console.log(
    `Authority: ${assessment.authorityLimitations.status} (${assessment.authorityLimitations.impactOnOpportunity})`,
  );
  if (assessment.overallWebsiteQuality.band) {
    console.log(
      `Overall band: ${siteBandLabel(assessment.overallWebsiteQuality.band)}`,
    );
  }
  console.log(`\nNext:\n- ${assessment.nextImprovements.join("\n- ")}`);
}

console.log(
  "\n(Scores are not ranking predictions. Fixture run only — no production changes.)\n",
);
