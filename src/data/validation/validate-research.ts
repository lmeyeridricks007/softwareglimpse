import { existsSync } from "node:fs";
import path from "node:path";
import {
  getResearchProductDir,
  listResearchProducts,
  loadConflicts,
  loadEnrichment,
  loadFacts,
  loadManualSources,
  loadSnapshots,
} from "@/data/research/store";
import { getAllSoftwareUnfiltered } from "@/data/repositories/catalog";
import { CanonicalFeatureSchema } from "@/domain";
import { canonicalFeaturesSeed } from "@/data/seed/features";

export type ResearchValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export type ResearchValidationReport = {
  ok: boolean;
  issues: ResearchValidationIssue[];
};

export function validateResearchRepository(): ResearchValidationReport {
  const issues: ResearchValidationIssue[] = [];
  const softwareSlugs = new Set(
    getAllSoftwareUnfiltered().map((item) => item.slug),
  );
  const featureSlugs = new Set(
    canonicalFeaturesSeed.map((item) =>
      CanonicalFeatureSchema.parse(item).slug,
    ),
  );

  for (const productSlug of listResearchProducts()) {
    if (!softwareSlugs.has(productSlug)) {
      issues.push({
        code: "unknown-research-product",
        severity: "error",
        message: `Research folder for unknown product ${productSlug}`,
      });
      continue;
    }

    const sources = loadManualSources(productSlug);
    const sourceIds = new Set(sources.map((s) => s.id));

    for (const source of sources) {
      if (source.url) {
        try {
          new URL(source.url);
        } catch {
          issues.push({
            code: "invalid-source-url",
            severity: "error",
            message: `Invalid URL for source ${source.id}`,
          });
        }
      }
    }

    const seenSourceIds = new Set<string>();
    for (const source of sources) {
      if (seenSourceIds.has(source.id)) {
        issues.push({
          code: "duplicate-source",
          severity: "error",
          message: `Duplicate source id ${source.id}`,
        });
      }
      seenSourceIds.add(source.id);
    }

    const facts = loadFacts(productSlug);
    for (const fact of facts) {
      for (const sourceId of fact.sourceIds) {
        if (!sourceIds.has(sourceId)) {
          issues.push({
            code: "unknown-source-ref",
            severity: "error",
            message: `Fact ${fact.id} references unknown source ${sourceId}`,
          });
        }
      }

      const critical = fact.domain === "pricing" || fact.domain === "plans";
      if (
        (fact.status === "approved" || fact.status === "verified") &&
        critical &&
        fact.evidence.length === 0
      ) {
        issues.push({
          code: "critical-fact-without-evidence",
          severity: "error",
          message: `Critical fact ${fact.id} lacks evidence`,
        });
      }

      if (fact.field.startsWith("features.")) {
        const featureSlug = fact.field.replace("features.", "");
        if (!featureSlugs.has(featureSlug)) {
          issues.push({
            code: "unknown-feature",
            severity: "warning",
            message: `Fact ${fact.id} uses unknown feature ${featureSlug}`,
          });
        }
      }
    }

    const snapshots = loadSnapshots(productSlug);
    for (const snapshot of snapshots) {
      if (!sourceIds.has(snapshot.sourceId)) {
        issues.push({
          code: "orphaned-snapshot",
          severity: "error",
          message: `Snapshot ${snapshot.id} references unknown source ${snapshot.sourceId}`,
        });
      }
    }

    const conflicts = loadConflicts(productSlug);
    for (const conflict of conflicts) {
      if (conflict.status === "open") {
        issues.push({
          code: "open-conflict",
          severity: "warning",
          message: `Open conflict on ${conflict.productSlug}:${conflict.field}`,
        });
      }
    }

    const enrichment = loadEnrichment(productSlug);
    if (
      existsSync(
        path.join(getResearchProductDir(productSlug), "enrichment.json"),
      ) &&
      !enrichment
    ) {
      issues.push({
        code: "invalid-enrichment",
        severity: "error",
        message: `Enrichment for ${productSlug} failed schema validation`,
      });
    }
    if (enrichment?.pricing) {
      const pricing = enrichment.pricing as { currency?: string };
      if (pricing.currency && !/^[A-Z]{3}$/.test(pricing.currency)) {
        issues.push({
          code: "invalid-currency",
          severity: "error",
          message: `Invalid currency on enrichment for ${productSlug}`,
        });
      }
    }
  }

  return {
    ok: issues.filter((i) => i.severity === "error").length === 0,
    issues,
  };
}
