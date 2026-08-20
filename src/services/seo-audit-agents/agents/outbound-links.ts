import { relForOutboundType } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";
import { validateOutboundLinks } from "@/services/outbound/validate-links";
import { finding } from "../findings";
import { applyForcedFailures, type SeoAgentRunner } from "../framework";
import { headProbeUrl } from "../live-probe";
import type {
  SeoAgentMeta,
  SeoCheckResult,
  SeoFinding,
  SeoFixtureOutboundLink,
} from "../types";

export const OUTBOUND_LINK_AUDIT_AGENT: SeoAgentMeta = {
  id: "outbound-link-audit-agent",
  name: "OutboundLinkAuditAgent",
  version: "1.0.0",
  area: "outbound",
  mutatesProduction: false,
};

function analyzeFixtureLinks(links: SeoFixtureOutboundLink[]): SeoFinding[] {
  const findings: SeoFinding[] = [];
  for (const link of links) {
    const pages = link.pagePath ? [link.pagePath] : [];
    if (link.type === "affiliate") {
      const rel = link.rel ?? [];
      if (!rel.includes("sponsored")) {
        findings.push(
          finding({
            prefix: "OUT",
            kind: "AFFILIATE",
            subject: link.url,
            severity: "P1",
            area: "outbound",
            problem: "Affiliate link missing rel=sponsored",
            evidence: `url=${link.url} rel=${JSON.stringify(rel)} product=${link.productSlug ?? "—"}`,
            affectedPages: pages,
            likelyCause: "Raw <a> used instead of AffiliateAnchor / resolveCommercialCta",
            recommendedAction:
              "Use AffiliateAnchor / SoftwareCta so rel includes sponsored,noopener,noreferrer",
            filesLikelyAffected: [
              "src/components/outbound/affiliate-anchor.tsx",
              "src/services/affiliate/resolve-cta.ts",
            ],
            expectedImpact: "Compliant affiliate disclosure to crawlers",
            effort: "small",
            confidence: 0.95,
          }),
        );
      }
      // Policy check: domain helper expects sponsored for affiliate type
      const expected = relForOutboundType("affiliate");
      if (!expected.includes("sponsored")) {
        findings.push(
          finding({
            prefix: "OUT",
            kind: "AFFILIATE",
            subject: "policy",
            severity: "P0",
            area: "outbound",
            problem: "relForOutboundType(affiliate) does not require sponsored",
            evidence: JSON.stringify(expected),
            affectedPages: ["*"],
            likelyCause: "Domain policy regression",
            recommendedAction: "Restore sponsored in outbound-link schema policy",
            filesLikelyAffected: ["src/domain/schemas/outbound-link.ts"],
            expectedImpact: "Sitewide affiliate compliance",
            effort: "small",
            confidence: 1,
          }),
        );
      }
    }

    if (link.broken) {
      findings.push(
        finding({
          prefix: "OUT",
          kind: "EXTERNAL",
          subject: link.url,
          severity: "P1",
          area: "outbound",
          problem: "Broken external / evidence link",
          evidence: link.url,
          affectedPages: pages,
          likelyCause: "Stale vendor URL",
          recommendedAction: "Refresh research source or mark unavailable",
          filesLikelyAffected: ["src/data/research", "src/services/outbound"],
          expectedImpact: "Trustworthy evidence citations",
          effort: "medium",
          confidence: 0.85,
        }),
      );
    }

    if ((link.redirectChain?.length ?? 0) > 2) {
      findings.push(
        finding({
          prefix: "OUT",
          kind: "REDIRCHAIN",
          subject: link.url,
          severity: "P2",
          area: "outbound",
          problem: "Outbound redirect chain longer than 2 hops",
          evidence: link.redirectChain!.join(" → "),
          affectedPages: pages,
          likelyCause: "Affiliate hop stacking or moved official URL",
          recommendedAction: "Point to final destination where policy allows",
          filesLikelyAffected: ["src/data/affiliates", "src/services/affiliate"],
          expectedImpact: "Faster clicks + cleaner tracking",
          effort: "medium",
          confidence: 0.7,
        }),
      );
    }

    if (link.type === "official" && link.broken) {
      findings.push(
        finding({
          prefix: "OUT",
          kind: "EVIDENCE",
          subject: link.productSlug ?? link.url,
          severity: "P1",
          area: "outbound",
          problem: "Missing or broken canonical official product source",
          evidence: link.url,
          affectedPages: pages,
          likelyCause: "Product missing officialWebsite / docs URL",
          recommendedAction: "Set verified official source on enrichment",
          filesLikelyAffected: ["src/services/outbound/resolve-product-links.ts"],
          expectedImpact: "Evidence integrity for reviews",
          effort: "small",
          confidence: 0.8,
        }),
      );
    }
  }
  return findings;
}

function representativeOfficialProbeUrls(): string[] {
  const urls: string[] = [];
  for (const slug of ["pipedrive", "hive", "hubspot"]) {
    const product = getSoftwareBySlug(slug);
    if (!product) continue;
    const official = resolveProductOfficialLinks(product);
    if (official.officialWebsite) urls.push(official.officialWebsite);
    const enrichment = loadEnrichment(slug);
    for (const media of enrichment?.media ?? []) {
      if (media.status === "unavailable" || media.status === "rejected") {
        continue;
      }
      if (media.sourceHealth === "unavailable") continue;
      if (media.sourceUrl && /^https?:\/\//i.test(media.sourceUrl)) {
        urls.push(media.sourceUrl);
      }
    }
  }
  return [...new Set(urls)];
}

export const outboundLinkAuditAgent: SeoAgentRunner = {
  meta: OUTBOUND_LINK_AUDIT_AGENT,
  latestFilename: "outbound-links-latest.md",
  archiveBasename: "outbound-links.md",
  async analyze(ctx) {
    if (ctx.fixtures?.outboundLinks?.length) {
      const findings = analyzeFixtureLinks(ctx.fixtures.outboundLinks);
      let checks: SeoCheckResult[] = [
        {
          id: "fixture-outbound",
          status: "completed",
          reason: `${ctx.fixtures.outboundLinks.length} links`,
        },
        { id: "affiliate-sponsored", status: "completed" },
        { id: "broken-external", status: "completed" },
        { id: "redirect-chains", status: "completed" },
        {
          id: "live-http-probe",
          status: "skipped",
          reason: "Fixture mode",
        },
      ];
      checks = applyForcedFailures(checks, ctx);
      return {
        checks,
        findings,
        summary: `Fixture outbound audit: ${findings.length} finding(s).`,
      };
    }

    const checks: SeoCheckResult[] = [];
    const findings: SeoFinding[] = [];
    try {
      const limit = ctx.mode === "FAST" ? 40 : 200;
      const issues = validateOutboundLinks();
      checks.push({
        id: "validate-outbound-links",
        status: "completed",
        reason: `${issues.length} validator issue(s)`,
      });
      checks.push({
        id: "affiliate-sponsored-policy",
        status: "completed",
        reason: `relForOutboundType(affiliate)=${JSON.stringify(relForOutboundType("affiliate"))}`,
      });

      if (ctx.baseUrl || ctx.mode === "FULL") {
        const urls = [
          ...new Set(
            [
              ...issues
                .map((i) => i.url)
                .filter((u): u is string => Boolean(u && /^https?:\/\//i.test(u))),
              ...representativeOfficialProbeUrls(),
            ],
          ),
        ].slice(0, ctx.mode === "FAST" ? 8 : 25);
        let probed = 0;
        let broken = 0;
        for (const url of urls) {
          const result = await headProbeUrl(url);
          probed += 1;
          if (!result.ok) {
            broken += 1;
            findings.push(
              finding({
                prefix: "OUT",
                kind: "EXTERNAL",
                subject: url,
                severity: "P1",
                area: "outbound",
                problem: "Outbound URL failed live HEAD/GET probe",
                evidence: `status=${result.status} final=${result.finalUrl}`,
                affectedPages: ["*"],
                likelyCause: "Stale vendor URL, block, or timeout",
                recommendedAction:
                  "Refresh research source or mark unavailable — do not auto-edit from this audit",
                filesLikelyAffected: [
                  "src/data/research",
                  "src/services/outbound",
                ],
                expectedImpact: "Trustworthy evidence citations",
                effort: "medium",
                confidence: 0.7,
              }),
            );
          } else if (result.hops > 2) {
            findings.push(
              finding({
                prefix: "OUT",
                kind: "REDIRCHAIN",
                subject: url,
                severity: "P2",
                area: "outbound",
                problem: "Outbound redirect chain longer than 2 hops",
                evidence: `${url} hops=${result.hops} final=${result.finalUrl}`,
                affectedPages: ["*"],
                likelyCause: "Affiliate hop stacking or moved official URL",
                recommendedAction: "Point closer to final destination where policy allows",
                filesLikelyAffected: ["src/data/affiliates", "src/services/affiliate"],
                expectedImpact: "Faster clicks + cleaner tracking",
                effort: "medium",
                confidence: 0.65,
              }),
            );
          }
        }
        checks.push({
          id: "live-http-probe",
          status: "completed",
          reason: `${probed} URL(s) probed; ${broken} failing`,
        });
      } else {
        checks.push({
          id: "live-http-probe",
          status: "skipped",
          reason:
            "Remote HEAD probes require BASE_URL / --base-url or --mode=full",
        });
      }

      for (const issue of issues.slice(0, limit)) {
        const sev =
          issue.severity === "critical"
            ? "P0"
            : issue.severity === "high"
              ? "P1"
              : issue.severity === "medium"
                ? "P2"
                : "P3";
        findings.push(
          finding({
            prefix: "OUT",
            kind: issue.code.includes("AFFILIATE")
              ? "AFFILIATE"
              : issue.code.includes("MEDIA")
                ? "EVIDENCE"
                : "EXTERNAL",
            subject: issue.productSlug,
            signature: issue.code + issue.message,
            severity: sev,
            area: "outbound",
            problem: issue.message,
            evidence: `${issue.code}${issue.url ? ` url=${issue.url}` : ""}`,
            affectedPages: [`/software/${issue.productSlug}/`],
            likelyCause: "Outbound validation agent signal",
            recommendedAction:
              "Fix via research refresh / affiliate mapping — do not auto-edit links from this audit",
            filesLikelyAffected: [
              "src/services/outbound/validate-links.ts",
              "src/data/affiliates",
              "src/data/research",
            ],
            expectedImpact: "Healthier evidence + affiliate compliance",
            effort: "medium",
            confidence: 0.8,
          }),
        );
      }

      return {
        checks: applyForcedFailures(checks, ctx),
        findings,
        summary: `Outbound audit: ${issues.length} validator issue(s) → ${findings.length} finding(s) in report.`,
      };
    } catch (err) {
      return {
        checks: [
          {
            id: "validate-outbound-links",
            status: "failed",
            reason: err instanceof Error ? err.message : String(err),
          },
        ],
        findings: [],
        summary: "Outbound link agent failed.",
      };
    }
  },
};
