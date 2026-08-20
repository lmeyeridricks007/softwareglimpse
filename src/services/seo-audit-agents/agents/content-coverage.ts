import {
  isMissingStatus,
  isThinOrResearch,
  loadMapRegister,
  resolveRowRoute,
} from "@/services/content-quality/gaps/map-register";
import { getSoftwareByCategory } from "@/data";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";
import { isPathIndexable } from "@/services/internal-linking/eligibility";
import { finding } from "../findings";
import { applyForcedFailures, type SeoAgentRunner } from "../framework";
import type {
  SeoAgentMeta,
  SeoCheckResult,
  SeoFinding,
  SeoFixtureCoverageRow,
} from "../types";

export const CONTENT_COVERAGE_AUDIT_AGENT: SeoAgentMeta = {
  id: "content-coverage-audit-agent",
  name: "ContentCoverageAuditAgent",
  version: "1.1.0",
  area: "content-coverage",
  mutatesProduction: false,
};

/**
 * Production SEO health should not treat intentional roadmap gaps as P1 defects.
 * - MISSING / NOT-YET-IMPLEMENTED → omit from health findings (tracked on master map)
 * - EXISTING-BUT-THIN on noindex → omit (not live crawl risk until published)
 * - EXISTING-BUT-THIN on indexable → P2 (real thin live content)
 */
function findingsFromRows(
  rows: SeoFixtureCoverageRow[],
  mode: "FAST" | "FULL",
  options?: { treatMissingAsFindings?: boolean },
): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const limit = mode === "FAST" ? 40 : 200;
  let emitted = 0;
  const treatMissing = options?.treatMissingAsFindings ?? false;

  for (const row of rows) {
    if (emitted >= limit) break;

    const missing = isMissingStatus(row.status);
    const thin = isThinOrResearch(row.status, "");
    if (!missing && !thin) continue;

    if (missing && !treatMissing) {
      // Roadmap backlog — not a production SEO defect for health gating.
      continue;
    }

    if (thin && row.route) {
      try {
        if (!isPathIndexable(row.route)) {
          // Soft-published / noindex thin pages are editorial backlog, not crawl defects.
          continue;
        }
      } catch {
        // If eligibility cannot resolve, still report thinly.
      }
    } else if (thin && !row.route) {
      continue;
    }

    if (missing && treatMissing) {
      findings.push(
        finding({
          kind: "COVER",
          subject: row.id || row.route || row.title,
          severity: "P3",
          area: "content-coverage",
          problem: `Roadmap content opportunity: ${row.title}`,
          evidence: `${row.id} type=${row.pageType} status=${row.status} route=${row.route ?? "—"}`,
          affectedPages: row.route ? [row.route] : [],
          likelyCause: "CRM master map backlog item",
          recommendedAction:
            "Create via editorial/onboarding workflow — do not auto-generate from this audit",
          filesLikelyAffected: [
            "docs/content-ecosystem/04-crm-master-content-map.md",
          ],
          expectedImpact: "Fills planned cluster holes when prioritized",
          effort: "large",
          confidence: 0.7,
        }),
      );
      emitted += 1;
      continue;
    }

    findings.push(
      finding({
        kind: "THIN",
        subject: row.id || row.route || row.title,
        severity: "P2",
        area: "content-coverage",
        problem: `Thin indexable content: ${row.title}`,
        evidence: `${row.id} type=${row.pageType} status=${row.status} route=${row.route ?? "—"}`,
        affectedPages: row.route ? [row.route] : [],
        likelyCause: "Live indexable page still marked thin / research-required on master map",
        recommendedAction:
          "Deepen via research/editorial agents before expecting strong rankings",
        filesLikelyAffected: [
          "docs/content-ecosystem/04-crm-master-content-map.md",
          "src/data",
        ],
        expectedImpact: "Stronger live SERP competitiveness",
        effort: "medium",
        confidence: 0.75,
      }),
    );
    emitted += 1;
  }

  return findings;
}

export const contentCoverageAuditAgent: SeoAgentRunner = {
  meta: CONTENT_COVERAGE_AUDIT_AGENT,
  latestFilename: "content-coverage-latest.md",
  archiveBasename: "content-coverage.md",
  async analyze(ctx) {
    if (ctx.fixtures?.coverageRows?.length) {
      // Fixtures treat missing as findings so unit tests can assert detection.
      const findings = findingsFromRows(ctx.fixtures.coverageRows, ctx.mode, {
        treatMissingAsFindings: true,
      });
      let checks: SeoCheckResult[] = [
        {
          id: "fixture-map",
          status: "completed",
          reason: `${ctx.fixtures.coverageRows.length} rows`,
        },
        { id: "missing-nodes", status: "completed" },
        { id: "cluster-relations", status: "completed" },
      ];
      checks = applyForcedFailures(checks, ctx);
      return {
        checks,
        findings,
        summary: `Fixture coverage audit: ${findings.length} opportunity finding(s).`,
      };
    }

    const checks: SeoCheckResult[] = [];
    const findings: SeoFinding[] = [];
    try {
      const rows = loadMapRegister();
      checks.push({
        id: "load-master-map",
        status: "completed",
        reason: `${rows.length} CRM-* rows`,
      });

      const mapped: SeoFixtureCoverageRow[] = rows.map((r) => ({
        id: r.id,
        pageType: r.pageType,
        title: r.title,
        route: resolveRowRoute(r),
        status: r.statusRaw,
        parent: r.parent,
        supports: r.supports,
        nextStep: r.nextStep,
        cluster: r.cluster,
      }));

      const missingCount = mapped.filter((r) => isMissingStatus(r.status)).length;
      findings.push(...findingsFromRows(mapped, ctx.mode));
      checks.push({
        id: "missing-nodes",
        status: "completed",
        reason: `${missingCount} roadmap gaps tracked on master map (not raised as production P1)`,
      });
      checks.push({
        id: "thin-indexable",
        status: "completed",
        reason: `${findings.length} thin indexable finding(s)`,
      });

      const crmProducts = getSoftwareByCategory("crm", {
        includeUnpublished: false,
      });
      const sample =
        ctx.mode === "FAST" ? crmProducts.slice(0, 12) : crmProducts.slice(0, 40);
      let thinEvidence = 0;
      for (const product of sample) {
        const official = resolveProductOfficialLinks(product);
        const evidenceCount = (product.sources ?? []).filter(
          (s) =>
            s.url &&
            s.status !== "rejected" &&
            s.status !== "archived" &&
            s.sourceType !== "affiliate-network" &&
            s.sourceType !== "fixture",
        ).length;
        // Official website is the SEO-critical gate. Research-source depth without a
        // website is noise when enrichment stores sources elsewhere — leave deep
        // scoring to content-quality agents.
        if (!official.officialWebsite) {
          thinEvidence += 1;
          findings.push(
            finding({
              kind: "EVIDENCE",
              subject: product.slug,
              severity: "P2",
              area: "content-coverage",
              problem: "CRM product missing official website URL",
              evidence: `officialWebsite=missing evidenceSources=${evidenceCount}`,
              affectedPages: [`/software/${product.slug}/`],
              likelyCause: "Incomplete product seed / enrichment",
              recommendedAction:
                "Set software.website (or official-product-page source) via onboarding",
              filesLikelyAffected: [
                "src/data/seed/software.ts",
                "src/services/outbound/resolve-product-links.ts",
              ],
              expectedImpact: "Outbound evidence integrity on product pages",
              effort: "small",
              confidence: 0.85,
            }),
          );
        }
      }
      checks.push({
        id: "product-evidence-depth",
        status: "completed",
        reason: `Sampled ${sample.length} CRM products; ${thinEvidence} missing official website (research depth → content-quality)`,
      });

      return {
        checks: applyForcedFailures(checks, ctx),
        findings,
        summary: `Content coverage: ${rows.length} map rows. Roadmap MISSING/NOT-YET-IMPLEMENTED omitted from production findings. ${findings.length} finding(s) incl. evidence sample.`,
      };
    } catch (err) {
      return {
        checks: [
          {
            id: "load-master-map",
            status: "failed",
            reason: err instanceof Error ? err.message : String(err),
          },
        ],
        findings: [],
        summary: "Failed to load CRM master content map.",
      };
    }
  },
};
