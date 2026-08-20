import { getSitemapEntries } from "@/seo/sitemap";
import {
  normalizePath,
  resolveCanonicalPath,
  canonicalUrl,
} from "@/seo/canonical";
import { isPathIndexable } from "@/services/internal-linking/eligibility";
import { REPRESENTATIVE_ROUTES } from "@/performance/budgets";
import { finding } from "../findings";
import { applyForcedFailures, type SeoAgentRunner } from "../framework";
import {
  ensureLiveProbeBundle,
  livePageToFixture,
} from "../live-probe";
import type {
  SeoAgentMeta,
  SeoCheckResult,
  SeoFinding,
  SeoFixturePage,
} from "../types";

export const TECHNICAL_SEO_AUDIT_AGENT: SeoAgentMeta = {
  id: "technical-seo-audit-agent",
  name: "TechnicalSEOAuditAgent",
  version: "1.0.0",
  area: "technical",
  mutatesProduction: false,
};

function analyzeFixturePages(pages: SeoFixturePage[]): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const sitemapPaths = new Set(
    pages.filter((p) => p.inSitemap).map((p) => normalizePath(p.path)),
  );

  for (const page of pages) {
    const path = normalizePath(page.path);

    if (page.statusCode && page.statusCode >= 400) {
      findings.push(
        finding({
          kind: "STATUS",
          subject: path,
          severity: page.statusCode === 404 ? "P0" : "P1",
          area: "technical",
          problem: `Page returns HTTP ${page.statusCode}`,
          evidence: `\`${path}\` status=${page.statusCode}`,
          affectedPages: [path],
          likelyCause: "Missing route, bad redirect, or unpublished entity still linked",
          recommendedAction:
            "Restore the page, add a 301 to the canonical destination, or remove inbound links",
          filesLikelyAffected: ["src/app", "src/seo/sitemap.ts"],
          expectedImpact: "Stops crawl waste and soft-404 indexing risk",
          effort: "medium",
          confidence: 0.95,
        }),
      );
    }

    if (page.canonical) {
      const expected = canonicalUrl(path);
      const resolved = page.canonical.startsWith("http")
        ? page.canonical
        : canonicalUrl(page.canonical);
      const normalizedExpected = resolveCanonicalPath(path);
      const normalizedGot = resolveCanonicalPath(page.canonical);
      if (normalizedGot !== normalizedExpected) {
        findings.push(
          finding({
            kind: "CANONICAL",
            subject: path,
            severity: "P0",
            area: "technical",
            problem: "Canonical does not match resolved public path",
            evidence: `path=\`${path}\` canonical=\`${resolved}\` expected=\`${expected}\``,
            affectedPages: [path],
            likelyCause: "Hardcoded or inherited wrong canonical / alias not applied",
            recommendedAction:
              "Emit canonical via `canonicalUrl(path)` / `buildPageMetadata` only",
            filesLikelyAffected: [
              "src/seo/canonical.ts",
              "src/seo/metadata.ts",
              "src/app/layout.tsx",
            ],
            expectedImpact: "Prevents duplicate URL consolidation failure",
            effort: "small",
            confidence: 0.95,
          }),
        );
      }
    }

    if (page.indexable === false && page.inSitemap === true) {
      findings.push(
        finding({
          kind: "SITEMAP",
          subject: path,
          severity: "P0",
          area: "technical",
          problem: "noindex URL is included in the sitemap",
          evidence: `\`${path}\` robots/indexable=false but inSitemap=true`,
          affectedPages: [path],
          likelyCause: "Sitemap builder missing indexability gate",
          recommendedAction:
            "Ensure `getSitemapEntries` only emits canonical ∩ indexable ∩ publishable URLs",
          filesLikelyAffected: ["src/seo/sitemap.ts", "src/seo/indexability.ts"],
          expectedImpact: "Stops search engines requesting deliberately noindex URLs",
          effort: "small",
          confidence: 0.98,
        }),
      );
    }

    if (page.indexable === true && !sitemapPaths.has(path) && page.inSitemap === false) {
      findings.push(
        finding({
          kind: "SITEMAP",
          subject: path,
          severity: "P1",
          area: "technical",
          problem: "Indexable page missing from sitemap fixture set",
          evidence: `\`${path}\` indexable but not listed in sitemap`,
          affectedPages: [path],
          likelyCause: "Route not registered in sitemap builder",
          recommendedAction: "Add publishable route family to `getSitemapEntries`",
          filesLikelyAffected: ["src/seo/sitemap.ts"],
          expectedImpact: "Improves discoverability of indexable URLs",
          effort: "small",
          confidence: 0.7,
        }),
      );
    }

    if ((page.h1Count ?? 1) === 0) {
      findings.push(
        finding({
          kind: "HEADING",
          subject: path,
          severity: "P1",
          area: "technical",
          problem: "Page has no H1",
          evidence: `\`${path}\` h1Count=0`,
          affectedPages: [path],
          likelyCause: "Client-only title or missing SSR heading",
          recommendedAction: "Render a single SSR H1 in the page shell",
          filesLikelyAffected: ["src/app", "src/components"],
          expectedImpact: "Clearer topical signal and accessibility",
          effort: "small",
          confidence: 0.85,
        }),
      );
    }

    if ((page.h1Count ?? 1) > 1) {
      findings.push(
        finding({
          kind: "HEADING",
          subject: path,
          severity: "P2",
          area: "technical",
          problem: "Page has multiple H1 elements",
          evidence: `\`${path}\` h1Count=${page.h1Count}`,
          affectedPages: [path],
          likelyCause: "Nested heroes / section misuse of H1",
          recommendedAction: "Keep one H1; demote others to H2+",
          filesLikelyAffected: ["src/components"],
          expectedImpact: "Cleaner heading outline",
          effort: "small",
          confidence: 0.75,
        }),
      );
    }

    if (!page.title || page.title.trim().length < 3) {
      findings.push(
        finding({
          kind: "META",
          subject: path,
          severity: "P1",
          area: "technical",
          problem: "Missing or empty title metadata",
          evidence: `\`${path}\` title=${JSON.stringify(page.title ?? null)}`,
          affectedPages: [path],
          likelyCause: "Page omitted buildPageMetadata",
          recommendedAction: "Set title via `buildPageMetadata`",
          filesLikelyAffected: ["src/seo/metadata.ts"],
          expectedImpact: "SERP clickability and crawl clarity",
          effort: "small",
          confidence: 0.9,
        }),
      );
    }

    // Non-canonical path style (uppercase / missing slash) in fixture path key
    if (page.path !== normalizePath(page.path) && page.path.includes("Http") === false) {
      if (/[A-Z]/.test(page.path) || (page.path !== "/" && !page.path.endsWith("/"))) {
        findings.push(
          finding({
            kind: "URL",
            subject: page.path,
            severity: "P2",
            area: "technical",
            problem: "URL path is not canonical form (lowercase + trailing slash)",
            evidence: `raw=\`${page.path}\` normalized=\`${normalizePath(page.path)}\``,
            affectedPages: [normalizePath(page.path)],
            likelyCause: "Hardcoded path without normalizePath",
            recommendedAction: "Use trailing-slash lowercase paths everywhere",
            filesLikelyAffected: ["src/seo/canonical.ts", "src/lib/urls.ts"],
            expectedImpact: "URL consistency / fewer redirects",
            effort: "small",
            confidence: 0.8,
          }),
        );
      }
    }
  }

  return findings;
}

async function analyzeLive(
  mode: "FAST" | "FULL",
  ctx: { baseUrl?: string; mode: "FAST" | "FULL"; liveProbe?: import("../live-probe").LiveProbeBundle; _liveProbePromise?: Promise<import("../live-probe").LiveProbeBundle> },
): Promise<{
  checks: SeoCheckResult[];
  findings: SeoFinding[];
  summary: string;
}> {
  const checks: SeoCheckResult[] = [];
  const findings: SeoFinding[] = [];

  try {
    const entries = getSitemapEntries();
    checks.push({
      id: "sitemap-entries",
      status: "completed",
      reason: `${entries.length} URLs`,
    });

    const urls = entries.map((e) => e.url);
    const paths = urls.map((u) => {
      try {
        return normalizePath(new URL(u).pathname);
      } catch {
        return u;
      }
    });

    // Duplicate sitemap URLs
    const seen = new Map<string, number>();
    for (const u of urls) seen.set(u, (seen.get(u) ?? 0) + 1);
    for (const [u, n] of seen) {
      if (n > 1) {
        findings.push(
          finding({
            kind: "SITEMAP",
            subject: u,
            severity: "P1",
            area: "technical",
            problem: "Duplicate URL in sitemap",
            evidence: `${u} appears ${n} times`,
            affectedPages: [normalizePath(new URL(u).pathname)],
            likelyCause: "pushUnique collision or double registration",
            recommendedAction: "Deduplicate in getSitemapEntries",
            filesLikelyAffected: ["src/seo/sitemap.ts"],
            expectedImpact: "Cleaner crawl budget",
            effort: "small",
            confidence: 0.95,
          }),
        );
      }
    }

    // Alias paths should not appear as separate sitemap URLs
    for (const p of paths) {
      const resolved = resolveCanonicalPath(p);
      if (resolved !== p) {
        findings.push(
          finding({
            kind: "REDIRECT",
            subject: p,
            severity: "P1",
            area: "technical",
            problem: "Sitemap lists a non-canonical alias path",
            evidence: `\`${p}\` resolves to \`${resolved}\``,
            affectedPages: [p, resolved],
            likelyCause: "Alias registered before canonical rewrite",
            recommendedAction: "Only emit resolveCanonicalPath results",
            filesLikelyAffected: ["src/seo/sitemap.ts", "src/seo/canonical.ts"],
            expectedImpact: "Avoid indexing alias URLs",
            effort: "small",
            confidence: 0.9,
          }),
        );
      }
    }

    // Representative route coverage (FAST subset / FULL all reps).
    // Intentionally noindex routes are correctly absent from the sitemap.
    const reps =
      mode === "FAST" ? REPRESENTATIVE_ROUTES.slice(0, 8) : REPRESENTATIVE_ROUTES;
    const pathSet = new Set(paths);
    for (const r of reps) {
      const path = normalizePath(r.path);
      if (pathSet.has(path)) continue;
      if (r.family === "tool") continue;
      if (!isPathIndexable(path)) {
        continue; // noindex / gated — not a sitemap defect
      }
      findings.push(
        finding({
          kind: "SITEMAP",
          subject: r.path,
          severity: r.family === "hub" ? "P1" : "P2",
          area: "technical",
          problem: `Representative ${r.label} route not found in sitemap`,
          evidence: `\`${r.path}\` missing from getSitemapEntries()`,
          affectedPages: [r.path],
          likelyCause: "Route unpublished or not registered despite being indexable",
          recommendedAction:
            "Add publishable indexable route to getSitemapEntries",
          filesLikelyAffected: ["src/seo/sitemap.ts", "src/seo/indexability.ts"],
          expectedImpact: "Ensures key money pages are crawlable via sitemap",
          effort: "small",
          confidence: 0.75,
        }),
      );
    }

    checks.push({ id: "canonical-policy", status: "completed" });
    checks.push({ id: "url-consistency", status: "completed" });

    const bundle = await ensureLiveProbeBundle(ctx);
    if (bundle) {
      const liveFindings = analyzeFixturePages(
        bundle.pages.map(livePageToFixture),
      );
      findings.push(...liveFindings);

      for (const page of bundle.pages) {
        if (page.error || page.statusCode === 0) {
          findings.push(
            finding({
              kind: "STATUS",
              subject: page.path,
              severity: "P0",
              area: "technical",
              problem: "Live probe failed to fetch page",
              evidence: page.error ?? `status=${page.statusCode}`,
              affectedPages: [page.path],
              likelyCause: "Server down, timeout, or DNS failure",
              recommendedAction: "Confirm BASE_URL is reachable and retry",
              filesLikelyAffected: ["scripts/seo-audit-cli.ts"],
              expectedImpact: "Restores live SEO visibility",
              effort: "small",
              confidence: 0.9,
            }),
          );
          continue;
        }
        const expectedIndexable = isPathIndexable(page.path);
        const robots = page.robots?.toLowerCase() ?? "";
        const htmlNoindex = /noindex/.test(robots);
        if (expectedIndexable && htmlNoindex) {
          findings.push(
            finding({
              kind: "ROBOTS",
              subject: page.path,
              severity: "P0",
              area: "technical",
              problem: "Indexable route emits noindex in live HTML",
              evidence: `path=\`${page.path}\` robots=\`${page.robots}\``,
              affectedPages: [page.path],
              likelyCause: "robots metadata mismatch with indexability policy",
              recommendedAction: "Align buildPageMetadata robots with isPathIndexable",
              filesLikelyAffected: [
                "src/seo/indexability.ts",
                "src/seo/metadata.ts",
              ],
              expectedImpact: "Stops accidental deindexing of money pages",
              effort: "small",
              confidence: 0.95,
            }),
          );
        }
        if (!expectedIndexable && !htmlNoindex && page.statusCode < 400) {
          findings.push(
            finding({
              kind: "ROBOTS",
              subject: page.path,
              severity: "P1",
              area: "technical",
              problem: "Policy-noindex route missing noindex in live HTML",
              evidence: `path=\`${page.path}\` robots=\`${page.robots ?? "(none)"}\``,
              affectedPages: [page.path],
              likelyCause: "Page omitted robots noindex despite policy gate",
              recommendedAction: "Emit robots noindex via buildPageMetadata",
              filesLikelyAffected: ["src/seo/metadata.ts", "src/app"],
              expectedImpact: "Prevents soft-indexing of gated surfaces",
              effort: "small",
              confidence: 0.85,
            }),
          );
        }
      }

      checks.push({
        id: "robots-meta-live-html",
        status: "completed",
        reason: `${bundle.pages.length} pages from ${bundle.baseUrl}`,
      });
      checks.push({
        id: "status-codes-live",
        status: "completed",
        reason: `${bundle.pages.filter((p) => p.statusCode > 0).length} HTTP probes`,
      });
      checks.push({
        id: "mobile-parity",
        status: "completed",
        reason:
          "App Router single responsive template; viewport meta expected (no separate mobile templates)",
      });
    } else {
      checks.push({
        id: "robots-meta-live-html",
        status: "skipped",
        reason: "Requires BASE_URL / --base-url against a running origin",
      });
      checks.push({
        id: "mobile-parity",
        status: "completed",
        reason:
          "No separate mobile templates; parity assumed App Router responsive",
      });
      checks.push({
        id: "status-codes-live",
        status: "skipped",
        reason: "Requires BASE_URL / --base-url against a running origin",
      });
    }
  } catch (err) {
    checks.push({
      id: "sitemap-entries",
      status: "failed",
      reason: err instanceof Error ? err.message : String(err),
    });
  }

  const p0 = findings.filter((f) => f.severity === "P0").length;
  const liveNote = ctx.baseUrl
    ? `Live probes against ${ctx.baseUrl}.`
    : "Live HTML/status probes skipped (no BASE_URL).";
  const summary = `Technical scan (${mode}): ${findings.length} finding(s), ${p0} P0. Sitemap + canonical policy inspected. ${liveNote}`;
  return { checks, findings, summary };
}

export const technicalSeoAuditAgent: SeoAgentRunner = {
  meta: TECHNICAL_SEO_AUDIT_AGENT,
  latestFilename: "technical-seo-latest.md",
  archiveBasename: "technical-seo.md",
  async analyze(ctx) {
    if (ctx.fixtures?.pages?.length) {
      const findings = analyzeFixturePages(ctx.fixtures.pages);
      let checks: SeoCheckResult[] = [
        { id: "fixture-pages", status: "completed", reason: `${ctx.fixtures.pages.length} pages` },
        { id: "sitemap-entries", status: "completed", reason: "fixture" },
        { id: "canonical-policy", status: "completed", reason: "fixture" },
        { id: "url-consistency", status: "completed", reason: "fixture" },
        { id: "robots-meta-live-html", status: "skipped", reason: "fixture mode" },
        { id: "mobile-parity", status: "skipped", reason: "fixture mode" },
        { id: "status-codes-live", status: "completed", reason: "fixture status codes" },
      ];
      checks = applyForcedFailures(checks, ctx);
      return {
        checks,
        findings,
        summary: `Fixture technical audit: ${findings.length} finding(s).`,
      };
    }
    const live = await analyzeLive(ctx.mode, ctx);
    return {
      ...live,
      checks: applyForcedFailures(live.checks, ctx),
    };
  },
};
