import { normalizePath } from "@/seo/canonical";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import type { GateHardFailCode, GateIssue, GatePageType } from "./types";

export type HardFailContext = {
  pageType: GatePageType;
  path: string;
  title?: string;
  snapshot?: PageQualitySnapshot;
  /** Lifecycle override when known. */
  lifecycleRetired?: boolean;
  /** Comparison / guide relationship nonsense. */
  invalidRelationship?: boolean;
  /** Near-duplicate of another estate URL. */
  nearDuplicateOf?: string;
  /** Empty or placeholder generated body. */
  emptyGenerated?: boolean;
  unsupportedClaimCount?: number;
  canonicalOk?: boolean;
  routeResolvable?: boolean;
  /** Semantic template risk — interchangeable analysis with siblings. */
  semanticTemplateRisk?: boolean;
};

/**
 * Hard fails block indexEligible. Word count alone is never a hard fail.
 */
export function collectHardFails(ctx: HardFailContext): GateIssue[] {
  const failures: GateIssue[] = [];
  const push = (code: GateHardFailCode, message: string) => {
    failures.push({ code, message });
  };

  if (ctx.lifecycleRetired) {
    push("retired_lifecycle", "Page is RETIRED — not eligible for index");
  }

  if (!ctx.title?.trim()) {
    push("missing_identity", "Missing title / identity");
  }

  const path = normalizePath(ctx.path || "");
  if (!path || path === "/" || !path.startsWith("/")) {
    push("invalid_route", "Invalid or missing public route");
  }

  if (ctx.routeResolvable === false) {
    push("invalid_route", "Route does not resolve to a catalogue entity");
  }

  if (ctx.canonicalOk === false) {
    push("broken_canonical", "Canonical is missing or does not match self");
  }

  if (ctx.nearDuplicateOf) {
    push(
      "substantial_duplicate",
      `Substantial duplicate / cannibalization risk vs ${ctx.nearDuplicateOf}`,
    );
  }

  if (ctx.semanticTemplateRisk) {
    push(
      "semantic_template_risk",
      "SEMANTIC_TEMPLATE_RISK — analysis interchangeable with siblings after stripping product/price/table tokens; cannot auto-promote",
    );
  }

  const unsupported = ctx.unsupportedClaimCount ?? 0;
  if (unsupported >= 3) {
    push(
      "unsupported_claims",
      `${unsupported} unsupported claim flags — strengthen evidence before indexing`,
    );
  }

  if (ctx.emptyGenerated) {
    push(
      "empty_generated_content",
      "Generated body is empty or placeholder-only",
    );
  }

  if (ctx.pageType === "comparison" && ctx.invalidRelationship) {
    push(
      "nonsensical_comparison",
      "Comparison lacks a meaningful competitive relationship",
    );
  }

  if (ctx.pageType === "comparison" && ctx.invalidRelationship === undefined) {
    // no-op — relationship checked when flag provided
  }

  const snap = ctx.snapshot;
  if (snap) {
    if (
      snap.differentiation?.nearDuplicateOf &&
      snap.differentiation.duplicateIntentRisk
    ) {
      push(
        "substantial_duplicate",
        `Near-duplicate of ${snap.differentiation.nearDuplicateOf}`,
      );
    }
    if ((snap.evidenceSignals?.unsupportedClaimFlags ?? 0) >= 3) {
      push(
        "unsupported_claims",
        "Evidence signals report multiple unsupported claims",
      );
    }
    const emptyBody =
      snap.presentSections.length === 0 &&
      snap.depthSignals.length === 0 &&
      snap.decisionSupportSignals.length === 0 &&
      snap.originalValueSignals.length === 0;
    if (emptyBody) {
      push(
        "empty_generated_content",
        "No sections, depth, decision support, or original-value signals",
      );
    }
  }

  return failures;
}
