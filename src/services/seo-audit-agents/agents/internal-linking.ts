import { normalizePath } from "@/seo/canonical";
import { buildInternalLinkingReportData } from "@/services/internal-linking/report";
import { finding } from "../findings";
import { applyForcedFailures, type SeoAgentRunner } from "../framework";
import { ensureLiveProbeBundle } from "../live-probe";
import type { SeoAgentMeta, SeoCheckResult, SeoFinding } from "../types";

export const INTERNAL_LINK_AUDIT_AGENT: SeoAgentMeta = {
  id: "internal-link-audit-agent",
  name: "InternalLinkAuditAgent",
  version: "1.0.0",
  area: "internal-linking",
  mutatesProduction: false,
};

function analyzeFixtureEdges(
  edges: Array<{ from: string; to: string }>,
  knownPaths: string[],
): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const known = new Set(knownPaths.map(normalizePath));
  const inbound = new Map<string, number>();
  const outbound = new Map<string, number>();

  for (const e of edges) {
    const from = normalizePath(e.from);
    const to = normalizePath(e.to);
    outbound.set(from, (outbound.get(from) ?? 0) + 1);
    inbound.set(to, (inbound.get(to) ?? 0) + 1);

    if (!known.has(to)) {
      findings.push(
        finding({
          kind: "BROKEN",
          subject: `${from}->${to}`,
          severity: "P1",
          area: "internal-linking",
          problem: "Internal link target is unknown / missing",
          evidence: `\`${from}\` → \`${to}\` (target not in known path set)`,
          affectedPages: [from, to],
          likelyCause: "Stale href, typo, or unpublished destination",
          recommendedAction: "Fix href to canonical path or restore destination",
          filesLikelyAffected: [
            "src/services/internal-linking",
            "src/components/internal-linking",
          ],
          expectedImpact: "Removes dead ends for users and crawlers",
          effort: "small",
          confidence: 0.9,
        }),
      );
    }

    if (to !== normalizePath(e.to) || /[A-Z]/.test(e.to) || (e.to !== "/" && !e.to.endsWith("/"))) {
      // non-canonical link style in raw edge
      if (e.to !== normalizePath(e.to)) {
        findings.push(
          finding({
            kind: "NONCANON",
            subject: e.to,
            severity: "P2",
            area: "internal-linking",
            problem: "Internal link uses non-canonical path form",
            evidence: `from=\`${from}\` href=\`${e.to}\` canonical=\`${normalizePath(e.to)}\``,
            affectedPages: [from],
            likelyCause: "Hardcoded path without trailing slash / wrong case",
            recommendedAction: "Emit links via canonical helpers",
            filesLikelyAffected: ["src/seo/canonical.ts"],
            expectedImpact: "Fewer soft redirects and duplicate signals",
            effort: "small",
            confidence: 0.85,
          }),
        );
      }
    }
  }

  for (const path of known) {
    if ((inbound.get(path) ?? 0) === 0 && path !== "/") {
      findings.push(
        finding({
          kind: "ORPHAN",
          subject: path,
          severity: "P1",
          area: "internal-linking",
          problem: "Orphan page — no inbound internal edges in fixture graph",
          evidence: `\`${path}\` inbound=0`,
          affectedPages: [path],
          likelyCause: "Missing pillar/support links or not wired into CRM graph",
          recommendedAction: "Add contextual links from parent hub / related modules",
          filesLikelyAffected: ["src/services/internal-linking"],
          expectedImpact: "Restores crawl paths and topical reinforcement",
          effort: "medium",
          confidence: 0.8,
        }),
      );
    }
    if ((outbound.get(path) ?? 0) === 0 && path !== "/") {
      findings.push(
        finding({
          kind: "DEADEND",
          subject: path,
          severity: "P2",
          area: "internal-linking",
          problem: "Dead-end page — no outbound internal edges",
          evidence: `\`${path}\` outbound=0`,
          affectedPages: [path],
          likelyCause: "Missing next-step / related modules",
          recommendedAction: "Add RecommendedNextStep + related entity modules",
          filesLikelyAffected: ["src/components/internal-linking"],
          expectedImpact: "Improves journey continuity",
          effort: "small",
          confidence: 0.75,
        }),
      );
    }
    if ((inbound.get(path) ?? 0) === 1) {
      findings.push(
        finding({
          kind: "WEAK",
          subject: path,
          severity: "P3",
          area: "internal-linking",
          problem: "Weakly linked page (only one inbound edge)",
          evidence: `\`${path}\` inbound=1`,
          affectedPages: [path],
          likelyCause: "Thin support cluster linking",
          recommendedAction: "Add 1–2 contextual support links from related pages",
          filesLikelyAffected: ["src/services/internal-linking"],
          expectedImpact: "Stronger discoverability",
          effort: "small",
          confidence: 0.6,
        }),
      );
    }
  }

  return findings;
}

export const internalLinkAuditAgent: SeoAgentRunner = {
  meta: INTERNAL_LINK_AUDIT_AGENT,
  latestFilename: "internal-linking-latest.md",
  archiveBasename: "internal-linking.md",
  async analyze(ctx) {
    if (ctx.fixtures?.internalEdges) {
      const pages =
        ctx.fixtures.pages?.map((p) => normalizePath(p.path)) ??
        Array.from(
          new Set(
            ctx.fixtures.internalEdges.flatMap((e) => [
              normalizePath(e.from),
              normalizePath(e.to),
            ]),
          ),
        );
      // For orphan detection, known paths should include pages fixture if provided
      const known =
        ctx.fixtures.pages?.map((p) => normalizePath(p.path)) ?? pages;
      const findings = analyzeFixtureEdges(ctx.fixtures.internalEdges, known);
      let checks: SeoCheckResult[] = [
        {
          id: "fixture-graph",
          status: "completed",
          reason: `${ctx.fixtures.internalEdges.length} edges`,
        },
        { id: "orphans", status: "completed" },
        { id: "broken-targets", status: "completed" },
        { id: "non-canonical-hrefs", status: "completed" },
        { id: "dead-ends", status: "completed" },
        {
          id: "redirect-links",
          status: "skipped",
          reason: "Redirect resolution requires live HTTP in FULL remote mode",
        },
      ];
      checks = applyForcedFailures(checks, ctx);
      return {
        checks,
        findings,
        summary: `Fixture internal-link audit: ${findings.length} finding(s).`,
      };
    }

    const checks: SeoCheckResult[] = [];
    const findings: SeoFinding[] = [];
    try {
      const data = buildInternalLinkingReportData();
      checks.push({
        id: "graph-build",
        status: "completed",
        reason: `${data.edgeCount} edges`,
      });
      checks.push({
        id: "orphans",
        status: "completed",
        reason: `${data.orphanCount} orphans`,
      });
      checks.push({
        id: "weak-pages",
        status: "completed",
        reason: `${data.weakCount} weak`,
      });
      checks.push({
        id: "health",
        status: "completed",
        reason: `${data.healthErrors} errors / ${data.healthWarnings} warnings`,
      });

      const bundle = await ensureLiveProbeBundle(ctx);
      if (bundle) {
        let redirectHits = 0;
        for (const page of bundle.pages) {
          if (page.redirectChain.length > 0) {
            redirectHits += 1;
            findings.push(
              finding({
                kind: "REDIR",
                subject: page.path,
                severity: page.redirectChain.length > 1 ? "P1" : "P2",
                area: "internal-linking",
                problem: "Representative URL follows a redirect before HTML",
                evidence: `${page.requestUrl} → ${page.redirectChain.join(" → ")} → ${page.finalUrl}`,
                affectedPages: [page.path],
                likelyCause: "Trailing-slash / alias / host mismatch on BASE_URL",
                recommendedAction:
                  "Link to final canonical path; fix middleware redirects if unexpected",
                filesLikelyAffected: [
                  "src/seo/canonical.ts",
                  "src/middleware.ts",
                ],
                expectedImpact: "Fewer redirect hops for crawlers and users",
                effort: "small",
                confidence: 0.85,
              }),
            );
          }
          // Sample internal links that differ from normalizePath form
          for (const href of page.internalLinks.slice(0, 30)) {
            if (href !== normalizePath(href)) {
              findings.push(
                finding({
                  kind: "NONCANON",
                  subject: href,
                  severity: "P2",
                  area: "internal-linking",
                  problem: "Live HTML contains non-canonical internal href",
                  evidence: `on \`${page.path}\` href=\`${href}\``,
                  affectedPages: [page.path],
                  likelyCause: "Hardcoded path without trailing slash / wrong case",
                  recommendedAction: "Emit links via canonical helpers",
                  filesLikelyAffected: ["src/seo/canonical.ts"],
                  expectedImpact: "Fewer soft redirects",
                  effort: "small",
                  confidence: 0.8,
                }),
              );
            }
          }
        }
        checks.push({
          id: "redirect-links",
          status: "completed",
          reason: `${bundle.pages.length} pages probed; ${redirectHits} with redirects`,
        });
      } else {
        checks.push({
          id: "redirect-links",
          status: "skipped",
          reason: "Requires BASE_URL / --base-url against a running origin",
        });
      }

      const orphanLimit = ctx.mode === "FAST" ? 15 : 80;
      for (const path of data.orphans.slice(0, orphanLimit)) {
        findings.push(
          finding({
            kind: "ORPHAN",
            subject: path,
            severity: "P1",
            area: "internal-linking",
            problem: "SEO orphan — indexable page with no meaningful inbound links",
            evidence: `detectSeoOrphans flagged \`${path}\``,
            affectedPages: [path],
            likelyCause: "Missing pillar/support wiring in CRM graph",
            recommendedAction:
              "Wire ParentHubLink / Related* modules; ensure builders emit edges",
            filesLikelyAffected: [
              "src/services/internal-linking",
              "src/components/internal-linking",
            ],
            expectedImpact: "Restores crawl path and topical clustering",
            effort: "medium",
            confidence: 0.85,
          }),
        );
      }

      for (const path of data.weaklyLinked.slice(0, ctx.mode === "FAST" ? 10 : 40)) {
        findings.push(
          finding({
            kind: "WEAK",
            subject: path,
            severity: "P2",
            area: "internal-linking",
            problem: "Weakly linked page",
            evidence: `\`${path}\` has weak inbound support`,
            affectedPages: [path],
            likelyCause: "Sparse related-link coverage",
            recommendedAction: "Add contextual links from parent + siblings",
            filesLikelyAffected: ["src/services/internal-linking"],
            expectedImpact: "Better discoverability",
            effort: "small",
            confidence: 0.7,
          }),
        );
      }

      for (const issue of data.healthIssues.slice(0, ctx.mode === "FAST" ? 20 : 100)) {
        findings.push(
          finding({
            kind: issue.code.includes("BROKEN") ? "BROKEN" : "HEALTH",
            subject: issue.to ?? issue.from ?? issue.code,
            severity: issue.severity === "error" ? "P1" : "P2",
            area: "internal-linking",
            problem: issue.message,
            evidence: `${issue.code}${issue.from ? ` from=${issue.from}` : ""}${issue.to ? ` to=${issue.to}` : ""}`,
            affectedPages: [issue.from, issue.to].filter(Boolean) as string[],
            likelyCause: "Graph/health validator signal",
            recommendedAction: "Inspect validateInternalLinkHealth output and fix hrefs",
            filesLikelyAffected: ["src/services/internal-linking/health.ts"],
            expectedImpact: "Healthier internal graph",
            effort: "small",
            confidence: 0.8,
          }),
        );
      }

      for (const tip of data.recommendedAdditions.slice(0, ctx.mode === "FAST" ? 8 : 25)) {
        findings.push(
          finding({
            kind: "NEXTSTEP",
            subject: tip.slice(0, 48),
            severity: "P2",
            area: "internal-linking",
            problem: "Missing recommended internal link opportunity",
            evidence: tip,
            affectedPages: [],
            likelyCause: "Journey / pillar support gap",
            recommendedAction: tip,
            filesLikelyAffected: ["src/services/internal-linking"],
            expectedImpact: "Stronger next-step journeys",
            effort: "small",
            confidence: 0.55,
          }),
        );
      }

      return {
        checks: applyForcedFailures(checks, ctx),
        findings,
        summary: `Internal linking: ${data.edgeCount} edges, ${data.orphanCount} orphans, ${data.weakCount} weak, ${findings.length} finding(s).`,
      };
    } catch (err) {
      return {
        checks: applyForcedFailures(
          [
            {
              id: "graph-build",
              status: "failed",
              reason: err instanceof Error ? err.message : String(err),
            },
          ],
          ctx,
        ),
        findings: [],
        summary: "Internal link agent failed to build graph.",
      };
    }
  },
};
