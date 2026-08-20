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

export const STRUCTURED_DATA_AUDIT_AGENT: SeoAgentMeta = {
  id: "structured-data-audit-agent",
  name: "StructuredDataAuditAgent",
  version: "1.0.0",
  area: "structured-data",
  mutatesProduction: false,
};

const PLACEHOLDER_RE =
  /lorem ipsum|TODO|TBD|example\.com|placeholder|xxx+/i;

function analyzeJsonLd(
  page: SeoFixturePage,
  blocks: unknown[],
): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const path = page.path;
  const types: string[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== "object") {
      findings.push(
        finding({
          kind: "SCHEMA",
          subject: path,
          severity: "P1",
          area: "structured-data",
          problem: "JSON-LD block is not an object",
          evidence: `\`${path}\` block=${JSON.stringify(block)}`,
          affectedPages: [path],
          likelyCause: "Invalid JsonLdScript payload",
          recommendedAction: "Emit objects from src/seo/structured-data.tsx helpers",
          filesLikelyAffected: ["src/seo/structured-data.tsx"],
          expectedImpact: "Valid rich-result eligibility",
          effort: "small",
          confidence: 0.95,
        }),
      );
      continue;
    }

    const obj = block as Record<string, unknown>;
    const type = obj["@type"];
    if (typeof type === "string") types.push(type);
    if (Array.isArray(type)) types.push(...type.map(String));

    if (!obj["@context"] && !obj["@graph"]) {
      // allow graph children without context
      if (!("@type" in obj)) {
        findings.push(
          finding({
            kind: "SCHEMA",
            subject: path,
            severity: "P2",
            area: "structured-data",
            problem: "JSON-LD object missing @type/@context",
            evidence: `\`${path}\` keys=${Object.keys(obj).join(",")}`,
            affectedPages: [path],
            likelyCause: "Hand-rolled schema fragment",
            recommendedAction: "Use typed helpers with @context https://schema.org",
            filesLikelyAffected: ["src/seo/structured-data.tsx"],
            expectedImpact: "Parser compatibility",
            effort: "small",
            confidence: 0.8,
          }),
        );
      }
    }

    const blob = JSON.stringify(obj);
    if (PLACEHOLDER_RE.test(blob)) {
      findings.push(
        finding({
          kind: "SCHEMA",
          subject: path,
          severity: "P1",
          area: "structured-data",
          problem: "Structured data contains placeholder / fake values",
          evidence: `\`${path}\` matched placeholder pattern in JSON-LD`,
          affectedPages: [path],
          likelyCause: "Fixture or unfinished editorial schema",
          recommendedAction: "Replace with real verified entity data or omit schema",
          filesLikelyAffected: ["src/seo/structured-data.tsx", "src/app"],
          expectedImpact: "Avoids rich-result spam signals",
          effort: "medium",
          confidence: 0.9,
        }),
      );
    }

    const urlFields = ["url", "mainEntityOfPage", "@id"] as const;
    for (const key of urlFields) {
      const v = obj[key];
      if (typeof v === "string" && v.length > 0) {
        if (!/^https?:\/\//i.test(v)) {
          findings.push(
            finding({
              kind: "SCHEMA",
              subject: path,
              severity: "P1",
              area: "structured-data",
              problem: `Schema field ${key} is not an absolute URL`,
              evidence: `${key}=${v}`,
              affectedPages: [path],
              likelyCause: "Relative path passed into JSON-LD",
              recommendedAction: "Use canonicalUrl() / absoluteUrl() for schema URLs",
              filesLikelyAffected: ["src/seo/canonical.ts", "src/seo/structured-data.tsx"],
              expectedImpact: "Correct entity identity in search systems",
              effort: "small",
              confidence: 0.9,
            }),
          );
        }
      }
    }
  }

  // Duplicate @type spam
  const counts = new Map<string, number>();
  for (const t of types) counts.set(t, (counts.get(t) ?? 0) + 1);
  for (const [t, n] of counts) {
    if (n > 2) {
      findings.push(
        finding({
          kind: "SCHEMA",
          subject: `${path}:${t}`,
          severity: "P2",
          area: "structured-data",
          problem: `Duplicate ${t} schema blocks on one page`,
          evidence: `\`${path}\` has ${n} × ${t}`,
          affectedPages: [path],
          likelyCause: "Multiple components emitting the same JsonLdScript",
          recommendedAction: "Emit each schema type once per page",
          filesLikelyAffected: ["src/seo/structured-data.tsx", "src/app"],
          expectedImpact: "Cleaner structured-data graph",
          effort: "small",
          confidence: 0.75,
        }),
      );
    }
  }

  if (page.indexable === false && blocks.length > 0) {
    findings.push(
      finding({
        kind: "SCHEMA",
        subject: path,
        severity: "P2",
        area: "structured-data",
        problem: "Structured data present on a noindex page",
        evidence: `\`${path}\` indexable=false but ${blocks.length} JSON-LD block(s)`,
        affectedPages: [path],
        likelyCause: "Schema emitted regardless of robots decision",
        recommendedAction: "Skip non-essential schema on noindex utilities/tabs",
        filesLikelyAffected: ["src/seo/indexability.ts", "src/app"],
        expectedImpact: "Avoids confusing signals on non-canonical surfaces",
        effort: "small",
        confidence: 0.7,
      }),
    );
  }

  // FAQPage must carry real Q&A — do not use title/path heuristics (many
  // product/tool pages correctly ship FAQ sections without "faq" in the title).
  if (types.includes("FAQPage")) {
    const faqBlocks = blocks.filter((b) => {
      if (!b || typeof b !== "object") return false;
      const t = (b as Record<string, unknown>)["@type"];
      return t === "FAQPage" || (Array.isArray(t) && t.includes("FAQPage"));
    });
    for (const block of faqBlocks) {
      const main = (block as Record<string, unknown>).mainEntity;
      const questions = Array.isArray(main) ? main : main ? [main] : [];
      const valid = questions.filter((q) => {
        if (!q || typeof q !== "object") return false;
        const name = (q as Record<string, unknown>).name;
        const accepted = (q as Record<string, unknown>).acceptedAnswer;
        return typeof name === "string" && name.trim().length > 0 && Boolean(accepted);
      });
      if (valid.length === 0) {
        findings.push(
          finding({
            kind: "SCHEMA",
            subject: path,
            severity: "P2",
            area: "structured-data",
            problem: "FAQPage schema has no valid Question entities",
            evidence: `\`${path}\` FAQPage mainEntity count=${questions.length}`,
            affectedPages: [path],
            likelyCause: "Empty FAQ payload or wrong schema shape",
            recommendedAction: "Emit faqPageJsonLd only when FAQ items exist",
            filesLikelyAffected: ["src/seo/structured-data.tsx", "src/app"],
            expectedImpact: "Reduces schema/content mismatch risk",
            effort: "small",
            confidence: 0.85,
          }),
        );
      }
    }
  }

  return findings;
}

export const structuredDataAuditAgent: SeoAgentRunner = {
  meta: STRUCTURED_DATA_AUDIT_AGENT,
  latestFilename: "structured-data-latest.md",
  archiveBasename: "structured-data.md",
  async analyze(ctx) {
    const checks: SeoCheckResult[] = [];
    const findings: SeoFinding[] = [];

    if (ctx.fixtures?.pages?.length) {
      for (const page of ctx.fixtures.pages) {
        findings.push(...analyzeJsonLd(page, page.jsonLd ?? []));
      }
      checks.push(
        { id: "jsonld-syntax", status: "completed" },
        { id: "placeholder-values", status: "completed" },
        { id: "noindex-schema", status: "completed" },
        { id: "duplicate-types", status: "completed" },
        {
          id: "live-html-jsonld",
          status: "skipped",
          reason: "Fixture mode — no live HTML fetch",
        },
      );
      return {
        checks: applyForcedFailures(checks, ctx),
        findings,
        summary: `Fixture structured-data audit: ${findings.length} finding(s).`,
      };
    }

    // Live HTML JSON-LD when BASE_URL is set
    const bundle = await ensureLiveProbeBundle(ctx);
    if (bundle) {
      for (const page of bundle.pages) {
        const fixture = livePageToFixture(page);
        for (const block of page.jsonLd) {
          if (
            block &&
            typeof block === "object" &&
            "__parseError" in (block as object)
          ) {
            findings.push(
              finding({
                kind: "SCHEMA",
                subject: page.path,
                severity: "P1",
                area: "structured-data",
                problem: "JSON-LD script failed to parse",
                evidence: JSON.stringify(block).slice(0, 200),
                affectedPages: [page.path],
                likelyCause: "Invalid JSON in application/ld+json script",
                recommendedAction: "Fix JsonLdScript serialization",
                filesLikelyAffected: ["src/seo/structured-data.tsx"],
                expectedImpact: "Valid rich-result parsing",
                effort: "small",
                confidence: 0.95,
              }),
            );
            continue;
          }
        }
        findings.push(...analyzeJsonLd(fixture, page.jsonLd));
      }
      checks.push({
        id: "live-html-jsonld",
        status: "completed",
        reason: `${bundle.pages.length} pages from ${bundle.baseUrl}`,
      });
      checks.push({
        id: "helper-exports",
        status: "completed",
        reason: "structured-data.tsx helpers + live HTML",
      });
      checks.push({
        id: "jsonld-syntax",
        status: "completed",
        reason: `${bundle.pages.reduce((n, p) => n + p.jsonLd.length, 0)} JSON-LD block(s) parsed`,
      });
      return {
        checks: applyForcedFailures(checks, ctx),
        findings,
        summary: `Structured-data live HTML scan (${bundle.baseUrl}): ${findings.length} finding(s) across ${bundle.pages.length} page(s).`,
      };
    }

    checks.push({
      id: "live-html-jsonld",
      status: "skipped",
      reason:
        "Live rendered JSON-LD requires BASE_URL / --base-url against a running origin",
    });
    checks.push({
      id: "helper-exports",
      status: "completed",
      reason: "structured-data.tsx helpers assumed source of truth",
    });
    checks.push({
      id: "jsonld-syntax",
      status: "skipped",
      reason: "No live DOM without BASE_URL",
    });

    return {
      checks: applyForcedFailures(checks, ctx),
      findings,
      summary:
        "Structured-data live HTML scan skipped (no BASE_URL). Provide --base-url or BASE_URL for FULL validation. Do not treat this as a clean schema bill of health.",
    };
  },
};
