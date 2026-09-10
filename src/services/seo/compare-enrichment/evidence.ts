import type { Software } from "@/domain/schemas";
import {
  resolveEvidenceLevel,
  buildEditorialTrustMetadata,
} from "@/services/editorial/evidence-level";
import type { EvidencePairSummary } from "./types";

export function resolveComparisonEvidence(
  a: Software,
  b: Software,
): EvidencePairSummary {
  const trustA = buildEditorialTrustMetadata({ software: a });
  const trustB = buildEditorialTrustMetadata({ software: b });
  const levelA = resolveEvidenceLevel({
    handsOnTesting: trustA.handsOnTesting,
    testedAt: trustA.testedAt,
    pricingVerifiedAt: a.pricingVerifiedAt ?? a.pricing?.verifiedAt,
    lastVerifiedAt: a.lastVerifiedAt,
    lastResearchedAt: a.lastResearchedAt,
    hasResearchSources: (a.sources?.length ?? 0) > 0,
  });
  const levelB = resolveEvidenceLevel({
    handsOnTesting: trustB.handsOnTesting,
    testedAt: trustB.testedAt,
    pricingVerifiedAt: b.pricingVerifiedAt ?? b.pricing?.verifiedAt,
    lastVerifiedAt: b.lastVerifiedAt,
    lastResearchedAt: b.lastResearchedAt,
    hasResearchSources: (b.sources?.length ?? 0) > 0,
  });

  const handsOnA = levelA === "hands_on_tested";
  const handsOnB = levelB === "hands_on_tested";

  let disclaimer: string;
  if (!handsOnA && !handsOnB) {
    disclaimer =
      "Neither product has a completed hands-on product test on SoftwareGlimpse — this comparison is research/data-based only.";
  } else if (handsOnA && !handsOnB) {
    disclaimer = `${a.name} has hands-on product-test evidence; ${b.name} does not — treat sides asymmetrically.`;
  } else if (!handsOnA && handsOnB) {
    disclaimer = `${b.name} has hands-on product-test evidence; ${a.name} does not — treat sides asymmetrically.`;
  } else {
    disclaimer = `Both ${a.name} and ${b.name} have hands-on product-test evidence on SoftwareGlimpse.`;
  }

  return {
    levelA,
    levelB,
    handsOnA,
    handsOnB,
    disclaimer,
  };
}
