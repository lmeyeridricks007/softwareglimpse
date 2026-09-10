import type {
  ManualReviewClass,
  RelationshipEvidencePack,
} from "./types";
import { presentFlags } from "./evidence";

function hasDemand(pack: RelationshipEvidencePack): boolean {
  return (
    pack.gscImpressions > 0 ||
    pack.gscClicks > 0 ||
    pack.gscHasDirectQuery ||
    pack.knownBacklinks > 0 ||
    pack.bestListCoOccurrence
  );
}

function catalogueBuyerSignals(flags: Set<string>): number {
  let n = 0;
  for (const f of [
    "shared_use_cases",
    "shared_audience",
    "overlapping_capabilities",
    "pricing_tier",
    "integration_overlap",
    "secondary_category_overlap",
  ] as const) {
    if (flags.has(f)) n += 1;
  }
  return n;
}

/** Real buyer-job overlap — not mega-category cohabitation alone. */
function hasBuyerJobOverlap(flags: Set<string>): boolean {
  return (
    flags.has("shared_use_cases") ||
    flags.has("related_job_family") ||
    flags.has("overlapping_capabilities") ||
    flags.has("declared_competitor") ||
    flags.has("declared_alternative") ||
    flags.has("declared_comparable")
  );
}

/**
 * Phase 2 — classify from recorded evidence only.
 * Different categories alone never imply NONSENSICAL.
 * Same mega-category + best-list alone never invents ALTERNATIVE.
 */
export function classifyManualReviewPair(
  pack: RelationshipEvidencePack,
): { classification: ManualReviewClass; reasons: string[] } {
  const reasons: string[] = [];
  const flags = presentFlags(pack);

  if (pack.missingProduct) {
    reasons.push("Catalogue missing one or both products");
    return { classification: "MISSING_DATA", reasons };
  }

  if (flags.has("declared_competitor")) {
    reasons.push("Declared competitorSlugs relationship");
    for (const i of pack.items) {
      if (i.present) reasons.push(i.detail);
    }
    return { classification: "DIRECT_COMPETITOR", reasons };
  }

  // Specialist vs generalist — shared/related job + material scope skew
  if (
    !pack.disjointUseCases &&
    (flags.has("shared_use_cases") || flags.has("related_job_family")) &&
    (flags.has("use_case_breadth_skew") || pack.useCaseBreadthSkew >= 2)
  ) {
    reasons.push(
      `Specialist vs generalist: use-case breadth skew=${pack.useCaseBreadthSkew}`,
    );
    for (const i of pack.items) {
      if (i.present && i.flag !== "disjoint_use_cases") reasons.push(i.detail);
    }
    return { classification: "SPECIALIST_VS_GENERALIST", reasons };
  }

  if (flags.has("declared_alternative") || flags.has("declared_comparable")) {
    reasons.push(
      flags.has("declared_alternative")
        ? "Declared alternativeSlugs relationship"
        : "Declared comparableSlugs relationship",
    );
    return { classification: "ALTERNATIVE", reasons };
  }

  const buyerN = catalogueBuyerSignals(flags);
  const jobOverlap = hasBuyerJobOverlap(flags);

  const dataBacked =
    pack.relationshipKind === "data_backed_comparable" ||
    (pack.sameCategory &&
      jobOverlap &&
      buyerN >= 2 &&
      pack.evidenceScore >= 5 &&
      !pack.disjointUseCases) ||
    (!pack.sameCategory &&
      flags.has("shared_use_cases") &&
      buyerN >= 3 &&
      pack.evidenceScore >= 5.5);

  if (pack.sameCategory && dataBacked && jobOverlap) {
    reasons.push(
      `Data-backed same-category comparability (score=${pack.evidenceScore}, buyerSignals=${buyerN})`,
    );
    return { classification: "DIRECT_COMPETITOR", reasons };
  }

  // Alternative: same category + real job overlap (+ preferably best-list or GSC).
  // Best-list alone in a kitchen-sink category is NOT enough.
  if (
    pack.sameCategory &&
    jobOverlap &&
    !pack.disjointUseCases &&
    buyerN >= 1 &&
    pack.evidenceScore >= 3.5
  ) {
    reasons.push(
      "Same-category buyer-job overlap — treat as ALTERNATIVE (not fabricated competitor)",
    );
    for (const i of pack.items) {
      if (i.present) reasons.push(i.detail);
    }
    return { classification: "ALTERNATIVE", reasons };
  }

  if (!pack.sameCategory) {
    const crmSi =
      (pack.primaryCategoryA === "crm" &&
        pack.primaryCategoryB === "sales-intelligence") ||
      (pack.primaryCategoryB === "crm" &&
        pack.primaryCategoryA === "sales-intelligence");

    const crossValid =
      (dataBacked && jobOverlap) ||
      (crmSi &&
        (jobOverlap || flags.has("shared_audience")) &&
        (flags.has("shared_use_cases") ||
          flags.has("related_job_family") ||
          flags.has("overlapping_capabilities") ||
          hasDemand(pack))) ||
      // Secondary-category bridge + audience + demand/best-list (e.g. social listening vs MAP)
      (flags.has("secondary_category_overlap") &&
        flags.has("shared_audience") &&
        (pack.bestListCoOccurrence ||
          hasDemand(pack) ||
          pack.evidenceScore >= 4)) ||
      (flags.has("shared_use_cases") &&
        buyerN >= 2 &&
        pack.evidenceScore >= 4.5) ||
      (flags.has("related_job_family") &&
        buyerN >= 2 &&
        pack.evidenceScore >= 4);

    if (crossValid) {
      reasons.push(
        crmSi
          ? "CRM vs sales-intelligence workflow decision supported by catalogue/demand evidence"
          : `Cross-category buyer decision supported (score=${pack.evidenceScore})`,
      );
      for (const i of pack.items) {
        if (i.present) reasons.push(i.detail);
      }
      return { classification: "CROSS_CATEGORY_DECISION", reasons };
    }
  }

  // Documented disjoint jobs in a mega-category with no declared edge → nonsensical
  // unless real compare demand exists (then weak / preserve, not invent VALID).
  if (pack.disjointUseCases && !jobOverlap) {
    if (hasDemand(pack) || pack.gscHasDirectQuery) {
      reasons.push(
        "Disjoint use cases but historical demand/best-list — retain as WEAK_RELATIONSHIP for editorial justification",
      );
      return { classification: "WEAK_RELATIONSHIP", reasons };
    }
    reasons.push(
      `Disjoint buyer jobs with no declared relationship (${pack.useCasesA.slice(0, 2).join(", ") || "—"} vs ${pack.useCasesB.slice(0, 2).join(", ") || "—"})`,
    );
    return { classification: "NONSENSICAL", reasons };
  }

  // Weak but plausible — do NOT auto-reject ambiguous pairs
  if (
    pack.sameCategory ||
    pack.bestListCoOccurrence ||
    buyerN >= 1 ||
    pack.evidenceScore >= 2.5 ||
    hasDemand(pack)
  ) {
    reasons.push(
      pack.sameCategory
        ? "Same category without sufficient buyer-job overlap for enrichment enqueue — retain WEAK_RELATIONSHIP"
        : "Sparse signals or demand without full data-backed comparability — retain WEAK_RELATIONSHIP",
    );
    if (pack.bestListCoOccurrence && !jobOverlap) {
      reasons.push(
        "Best-list co-occurrence without shared use cases/capabilities — needs editorial justification before promote",
      );
    }
    return { classification: "WEAK_RELATIONSHIP", reasons };
  }

  reasons.push(
    `Insufficient buyer evidence (score=${pack.evidenceScore}); no demand/backlink/best-list signal`,
  );
  return { classification: "NONSENSICAL", reasons };
}

export function hasHistoricalOrBuyerDemand(
  pack: RelationshipEvidencePack,
): boolean {
  return hasDemand(pack);
}
