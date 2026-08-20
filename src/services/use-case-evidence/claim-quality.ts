/**
 * Claim-type evidence suitability for Use Case / workflow assessments.
 * Video is never automatically treated as the strongest evidence.
 */

export type EvidenceClaimType =
  | "ui-behavior"
  | "workflow-demo"
  | "feature-existence"
  | "pricing"
  | "plan-availability"
  | "security-certification";

export type EvidenceKind =
  | "documentation"
  | "screenshot"
  | "official-video"
  | "pricing-page"
  | "security-doc";

export type EvidenceSuitability =
  | "strong"
  | "supporting"
  | "weak"
  | "inappropriate";

const MATRIX: Record<
  EvidenceClaimType,
  Partial<Record<EvidenceKind, EvidenceSuitability>>
> = {
  "ui-behavior": {
    "official-video": "strong",
    screenshot: "strong",
    documentation: "supporting",
  },
  "workflow-demo": {
    "official-video": "strong",
    screenshot: "supporting",
    documentation: "supporting",
  },
  "feature-existence": {
    documentation: "strong",
    "official-video": "supporting",
    screenshot: "supporting",
  },
  pricing: {
    "pricing-page": "strong",
    documentation: "strong",
    "official-video": "inappropriate",
    screenshot: "inappropriate",
  },
  "plan-availability": {
    documentation: "strong",
    "pricing-page": "strong",
    "official-video": "weak",
    screenshot: "weak",
  },
  "security-certification": {
    "security-doc": "strong",
    documentation: "supporting",
    "official-video": "inappropriate",
    screenshot: "inappropriate",
  },
};

export function evidenceSuitabilityForClaim(
  claimType: EvidenceClaimType,
  kind: EvidenceKind,
): EvidenceSuitability {
  return MATRIX[claimType][kind] ?? "weak";
}

export function claimTypeGuidance(claimType: EvidenceClaimType): string {
  switch (claimType) {
    case "ui-behavior":
    case "workflow-demo":
      return "Official video or screenshots can be strong evidence for visible UI/workflow behavior.";
    case "feature-existence":
      return "Official documentation is preferred; video may support but does not replace docs.";
    case "pricing":
      return "Official pricing pages are stronger than product demos for pricing claims.";
    case "plan-availability":
      return "Official plan documentation / pricing is stronger than video for plan packaging.";
    case "security-certification":
      return "Official security/compliance documentation is required for certification claims.";
    default:
      return "Match evidence kind to claim type — do not rank by media volume.";
  }
}

/** Map ResearchMedia evidenceClaimKinds onto assessment claim types. */
export function claimTypesFromMediaKinds(
  kinds: string[],
): EvidenceClaimType[] {
  const out = new Set<EvidenceClaimType>();
  for (const k of kinds) {
    if (k === "workflow-demo") out.add("workflow-demo");
    if (k === "ui-layout") out.add("ui-behavior");
    if (k === "feature-existence") out.add("feature-existence");
    if (k === "setup-tutorial") out.add("workflow-demo");
  }
  if (out.size === 0) out.add("workflow-demo");
  return [...out];
}
