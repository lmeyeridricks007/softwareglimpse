import { getSoftwareBySlug } from "@/data";
import { SOFTWARE_ENRICHMENT_VERSION } from "./types";
import type { SoftwareEnrichmentOverlay } from "./types";
import { auditSoftwareFields } from "./field-audit";
import { buildDecisionHubDraft } from "./decision-hub";
import { listSoftwareDependents } from "./dependents";
import {
  loadSoftwareEnrichmentOverlay,
  saveSoftwareEnrichmentOverlay,
} from "./overlay-store";

export type SoftwareEnrichmentApplyResult = {
  slug: string;
  applied: boolean;
  overlayPath: string | null;
  materiallyImproved: boolean;
  missingFields: string[];
  dependentCount: number;
  dependentsNeedingRefresh: number;
  notes: string[];
};

function materiallyImprovedDecision(
  before: SoftwareEnrichmentOverlay | null,
  next: SoftwareEnrichmentOverlay,
): boolean {
  const d = next.decisionHub;
  const hasHub =
    Boolean(d.whatItIs) ||
    d.bestFor.length > 0 ||
    d.notIdealFor.length > 0 ||
    d.keyTradeoffs.length > 0 ||
    d.importantComparisons.length > 0;
  if (!hasHub) return false;
  if (!before) return true;
  const prev = before.decisionHub;
  return (
    d.bestFor.length > prev.bestFor.length ||
    d.notIdealFor.length > prev.notIdealFor.length ||
    d.keyTradeoffs.length > prev.keyTradeoffs.length ||
    d.importantComparisons.length > prev.importantComparisons.length ||
    (d.whatItIs?.length ?? 0) > (prev.whatItIs?.length ?? 0) ||
    next.fieldAudit.score > before.fieldAudit.score
  );
}

/**
 * Apply deterministic software entity rehab overlay.
 * Does not invent catalogue facts — surfaces existing research/editorial.
 */
export function applySoftwareEnrichment(
  slug: string,
): SoftwareEnrichmentApplyResult {
  const software = getSoftwareBySlug(slug);
  if (!software) {
    return {
      slug,
      applied: false,
      overlayPath: null,
      materiallyImproved: false,
      missingFields: ["entity"],
      dependentCount: 0,
      dependentsNeedingRefresh: 0,
      notes: ["Software entity not found"],
    };
  }

  const prior = loadSoftwareEnrichmentOverlay(slug);
  const fieldAudit = auditSoftwareFields(software);
  const decisionHub = buildDecisionHubDraft(software, fieldAudit);
  const dependents = listSoftwareDependents(slug);

  const remediation: string[] = [];
  for (const item of fieldAudit.items) {
    if (item.status === "MISSING") {
      remediation.push(`catalogue_fill:${item.field}`);
    } else if (item.status === "UNKNOWN") {
      remediation.push(`verify:${item.field}`);
    }
  }
  if (decisionHub.bestFor.length === 0) {
    remediation.push("editorial_best_for");
  }
  if (decisionHub.missingSections.includes("pricing")) {
    remediation.push("research_pricing");
  }

  const notes: string[] = [
    `fieldAudit score=${fieldAudit.score}`,
    `decisionHub bestFor=${decisionHub.bestFor.length} notIdeal=${decisionHub.notIdealFor.length}`,
    `dependents=${dependents.length}`,
  ];

  const overlay: SoftwareEnrichmentOverlay = {
    slug,
    updatedAt: new Date().toISOString(),
    version: SOFTWARE_ENRICHMENT_VERSION,
    fieldAudit,
    decisionHub,
    dependents,
    dependentsNeedingRefresh: [],
    remediation: [...new Set(remediation)],
    notes,
    materiallyImproved: false,
  };

  const missingOnly = fieldAudit.items.filter((i) => i.status === "MISSING");
  // Flag dependents only when catalogue MISSING fields can poison downstream copy —
  // UNKNOWN (e.g. trial not documented) is not a fabrication risk by itself.
  overlay.dependentsNeedingRefresh =
    missingOnly.length > 0
      ? dependents.filter(
          (d) =>
            d.kind === "guide" || d.kind === "comparison" || d.kind === "best",
        )
      : [];
  overlay.materiallyImproved = materiallyImprovedDecision(prior, overlay);

  const overlayPath = saveSoftwareEnrichmentOverlay(overlay);

  return {
    slug,
    applied: true,
    overlayPath,
    materiallyImproved: overlay.materiallyImproved,
    missingFields: fieldAudit.items
      .filter((i) => i.status === "MISSING")
      .map((i) => i.field),
    dependentCount: dependents.length,
    dependentsNeedingRefresh: overlay.dependentsNeedingRefresh.length,
    notes: [
      ...notes,
      overlay.materiallyImproved
        ? "Decision hub improved from canonical sources"
        : "Overlay refreshed; no material hub lift",
    ],
  };
}
