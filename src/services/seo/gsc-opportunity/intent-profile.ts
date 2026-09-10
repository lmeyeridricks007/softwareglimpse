import type {
  ActionConfidence,
  GscActionType,
  GscCommercialIntent,
  GscRootCause,
  InferredQueryCandidate,
  MappedQuery,
  QueryProvenance,
} from "./types";

export type SearchIntentProfile = {
  primaryQueryCluster: string | null;
  secondaryQueryClusters: string[];
  intent: GscCommercialIntent;
  contentMismatch: boolean;
  mismatchNotes: string[];
  suggestedRemediation: GscActionType[];
};

/**
 * Build search-intent profile + remediation from mapped queries and diagnostics.
 * Content mismatch from query intent only when mapping is evidenced or HIGH+review.
 */
export function buildSearchIntentProfile(input: {
  mappedQueries: MappedQuery[];
  inferredCandidates?: InferredQueryCandidate[];
  commercialIntent: GscCommercialIntent;
  pageType: string;
  rootCauses: GscRootCause[];
  recommendedActions: GscActionType[];
  intentMismatch?: boolean;
  queryProvenance?: QueryProvenance;
  actionConfidence?: ActionConfidence;
}): SearchIntentProfile {
  const trusted =
    input.actionConfidence === "EVIDENCED" ||
    input.actionConfidence === "REVIEW_REQUIRED";

  const clusters = [
    ...new Set(
      [
        ...input.mappedQueries.map((m) => m.clusterKey),
        ...(trusted
          ? []
          : (input.inferredCandidates ?? []).map((c) => c.clusterKey)),
      ].filter(Boolean),
    ),
  ];
  const primary = trusted
    ? (clusters[0] ?? input.mappedQueries[0]?.query ?? null)
    : null;
  const secondary = trusted ? clusters.slice(1, 5) : [];

  const mismatchNotes: string[] = [];
  let contentMismatch = Boolean(input.intentMismatch) && trusted;

  const topIntent = trusted ? input.mappedQueries[0]?.intent : undefined;
  const page = input.pageType.toLowerCase();

  if (
    topIntent === "comparison" &&
    (page.includes("review") || page.includes("software"))
  ) {
    contentMismatch = true;
    mismatchNotes.push(
      "Top DIRECT_GSC/HIGH queries look comparative — page is a single-product review/hub",
    );
  }
  if (
    topIntent === "pricing" &&
    !page.includes("pricing") &&
    !page.includes("software")
  ) {
    contentMismatch = true;
    mismatchNotes.push("Pricing intent without clear pricing surface");
  }
  if (
    topIntent === "alternatives" &&
    !page.includes("alternatives") &&
    !page.includes("compare")
  ) {
    contentMismatch = true;
    mismatchNotes.push("Alternatives intent — consider alternatives/compare framing");
  }
  if (input.rootCauses.includes("INTENT_MISMATCH")) {
    contentMismatch = true;
    mismatchNotes.push("Diagnosed INTENT_MISMATCH");
  }
  if (input.rootCauses.includes("THIN_CONTENT")) {
    mismatchNotes.push("Thin content vs demand — enrichment required");
  }
  if (!trusted && (input.inferredCandidates?.length ?? 0) > 0) {
    mismatchNotes.push(
      "INFERRED — NOT DIRECT GSC DATA — candidates omitted from primary cluster",
    );
  }

  const suggestedRemediation = [
    ...new Set([
      ...(contentMismatch && trusted
        ? (["SEARCH_INTENT_MISMATCH"] as GscActionType[])
        : []),
      ...input.recommendedActions.slice(0, 5),
    ]),
  ].slice(0, 6);

  return {
    primaryQueryCluster: primary,
    secondaryQueryClusters: secondary,
    intent: input.commercialIntent,
    contentMismatch,
    mismatchNotes,
    suggestedRemediation,
  };
}
