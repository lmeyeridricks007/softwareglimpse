import type {
  CatalogueBucket,
  CatalogueExclusionReason,
  NormalizedCatalogueCandidate,
} from "@/domain";
import { checkDuplicateProduct } from "@/services/onboarding/duplicates";
import { normalizeIdentityKey } from "@/services/onboarding/identity";

export type CatalogueClassification = {
  sourceId: string;
  bucket: CatalogueBucket;
  identityOutcome: string;
  matchedProductSlug?: string;
  exclusionReason?: CatalogueExclusionReason;
  blockers: string[];
  reasons: string[];
};

/**
 * Classify catalogue entries using existing identity resolver + entity hints.
 * Does not create products.
 */
export function classifyCatalogueCandidate(
  candidate: NormalizedCatalogueCandidate,
): CatalogueClassification {
  const reasons: string[] = [];

  if (candidate.multiProductHint || candidate.splitCandidates.length > 1) {
    return {
      sourceId: candidate.sourceId,
      bucket: "MULTI_PRODUCT_PROGRAM",
      identityOutcome: "MULTI_PRODUCT_PROGRAM",
      exclusionReason: "MULTI_PRODUCT_PROGRAM",
      blockers: ["Composite affiliate programme — split candidates need review"],
      reasons: [
        `Split candidates: ${candidate.splitCandidates.join(", ") || "unspecified"}`,
      ],
    };
  }

  const hint = candidate.entityTypeHint;
  if (hint === "marketplace") {
    return {
      sourceId: candidate.sourceId,
      bucket: "MARKETPLACE",
      identityOutcome: "MARKETPLACE",
      exclusionReason: "NOT_SOFTWARE",
      blockers: ["Marketplace — no /software/ page from catalogue alone"],
      reasons: ["entityTypeHint=marketplace"],
    };
  }

  if (hint === "service") {
    const logistics =
      /ship|logistics|fulfill|freight|3pl/i.test(candidate.rawName) ||
      /ship|logistics|fulfill/i.test(candidate.notes ?? "");
    return {
      sourceId: candidate.sourceId,
      bucket: logistics ? "LOGISTICS" : "SERVICE",
      identityOutcome: "SERVICE",
      exclusionReason: "NOT_SOFTWARE",
      blockers: ["Service / non-software — excluded from software pages"],
      reasons: ["entityTypeHint=service"],
    };
  }

  if (hint === "hybrid" || hint === "platform") {
    if (hint === "hybrid") {
      return {
        sourceId: candidate.sourceId,
        bucket: "REVIEW_REQUIRED",
        identityOutcome: "UNKNOWN",
        exclusionReason: "MANUAL_REVIEW_REQUIRED",
        blockers: ["Hybrid / ambiguous entity — human review required"],
        reasons: ["entityTypeHint=hybrid"],
      };
    }
    return {
      sourceId: candidate.sourceId,
      bucket: "SOFTWARE_LIKE_PLATFORM",
      identityOutcome: "UNKNOWN",
      exclusionReason: "MANUAL_REVIEW_REQUIRED",
      blockers: ["Platform/suite — confirm single product vs vendor family"],
      reasons: ["entityTypeHint=platform"],
    };
  }

  if (
    /review_required|REVIEW_REQUIRED|ambiguous|unclear/i.test(
      candidate.notes ?? "",
    ) ||
    !candidate.website
  ) {
    const ambiguousName =
      /vektoros|lucrovox|evolve|intelekt|^tie$|aira|zypper|diginius|rank prompt|b[iï]rch|emergent/i.test(
        candidate.normalizedName,
      );
    if (ambiguousName || /REVIEW_REQUIRED/i.test(candidate.notes ?? "")) {
      return {
        sourceId: candidate.sourceId,
        bucket: "REVIEW_REQUIRED",
        identityOutcome: "UNKNOWN",
        exclusionReason: "MANUAL_REVIEW_REQUIRED",
        blockers: ["Low-confidence identity — queued for review"],
        reasons: ["Ambiguous catalogue label or missing website"],
      };
    }
  }

  const dup = checkDuplicateProduct({
    name: candidate.normalizedName,
    slug: candidate.suggestedSlug,
    website: candidate.website,
    aliases: candidate.aliases,
  });

  reasons.push(dup.reason);

  if (dup.outcome === "EXISTING" || dup.outcome === "RENAMED_PRODUCT") {
    return {
      sourceId: candidate.sourceId,
      bucket: "SOFTWARE",
      identityOutcome: dup.outcome,
      matchedProductSlug: dup.matched?.slug,
      blockers: [],
      reasons,
    };
  }

  if (dup.outcome === "POSSIBLE_DUPLICATE" && dup.matched) {
    const matched = dup.matched;
    const sameName =
      normalizeIdentityKey(candidate.normalizedName) ===
        normalizeIdentityKey(matched.name) ||
      candidate.aliases.some(
        (a) =>
          normalizeIdentityKey(a) === normalizeIdentityKey(matched.name) ||
          normalizeIdentityKey(a) === normalizeIdentityKey(matched.slug),
      ) ||
      candidate.suggestedSlug.replace(/-io$/, "") === matched.slug;

    // Shared corporate hosts (e.g. freshworks.com) must not auto-merge products
    const sharedVendorHost =
      /freshworks\.com/i.test(candidate.website ?? "") ||
      /freshworks\.com/i.test(matched.website ?? "");
    const distinctProduct =
      normalizeIdentityKey(candidate.normalizedName) !==
        normalizeIdentityKey(matched.name) &&
      candidate.suggestedSlug !== matched.slug;

    if (sameName && !(sharedVendorHost && distinctProduct)) {
      return {
        sourceId: candidate.sourceId,
        bucket: "SOFTWARE",
        identityOutcome: "EXISTING",
        matchedProductSlug: matched.slug,
        blockers: [],
        reasons: [
          ...reasons,
          "Promoted POSSIBLE_DUPLICATE → EXISTING (name/alias match)",
        ],
      };
    }

    if (sharedVendorHost && distinctProduct) {
      return {
        sourceId: candidate.sourceId,
        bucket: "SOFTWARE",
        identityOutcome: "NEW",
        blockers: [],
        reasons: [
          ...reasons,
          "Shared vendor host ignored — distinct product name (vendor family)",
        ],
      };
    }

    return {
      sourceId: candidate.sourceId,
      bucket: "REVIEW_REQUIRED",
      identityOutcome: dup.outcome,
      matchedProductSlug: matched.slug,
      exclusionReason: "MANUAL_REVIEW_REQUIRED",
      blockers: ["Possible duplicate — reconcile before onboarding"],
      reasons,
    };
  }

  if (dup.outcome === "POSSIBLE_DUPLICATE") {
    return {
      sourceId: candidate.sourceId,
      bucket: "REVIEW_REQUIRED",
      identityOutcome: dup.outcome,
      matchedProductSlug: dup.matched?.slug,
      exclusionReason: "MANUAL_REVIEW_REQUIRED",
      blockers: ["Possible duplicate — reconcile before onboarding"],
      reasons,
    };
  }

  if (hint === "software" || !hint) {
    return {
      sourceId: candidate.sourceId,
      bucket: "SOFTWARE",
      identityOutcome: "NEW",
      blockers: [],
      reasons: [...reasons, "Eligible software candidate"],
    };
  }

  return {
    sourceId: candidate.sourceId,
    bucket: "OTHER",
    identityOutcome: "UNKNOWN",
    exclusionReason: "MANUAL_REVIEW_REQUIRED",
    blockers: ["Unclassified entity type"],
    reasons,
  };
}
