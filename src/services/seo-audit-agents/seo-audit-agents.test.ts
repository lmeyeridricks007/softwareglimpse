import { describe, expect, it } from "vitest";
import { stableSeoIssueId } from "./stable-ids";
import { diffFindings, toSnapshot } from "./diff";
import { runSeoAgent } from "./framework";
import { technicalSeoAuditAgent } from "./agents/technical";
import { internalLinkAuditAgent } from "./agents/internal-linking";
import { structuredDataAuditAgent } from "./agents/structured-data";
import { mediaSeoAuditAgent } from "./agents/media-seo";
import { outboundLinkAuditAgent } from "./agents/outbound-links";
import { contentCoverageAuditAgent } from "./agents/content-coverage";
import { runSEOHealthOrchestrator, SEO_HEALTH_ORCHESTRATOR } from "./orchestrator";
import type { SeoFinding } from "./types";

describe("stable SEO issue IDs", () => {
  it("is stable across calls for the same signature", () => {
    const a = stableSeoIssueId("SEO", "CANONICAL", "/guides/what-is-crm/", "bad");
    const b = stableSeoIssueId("SEO", "CANONICAL", "/guides/what-is-crm/", "bad");
    expect(a).toBe(b);
    expect(a).toMatch(/^SEO-CANONICAL-/);
  });

  it("changes when the problem signature changes", () => {
    const a = stableSeoIssueId("SEO", "ORPHAN", "/x/", "one");
    const b = stableSeoIssueId("SEO", "ORPHAN", "/x/", "two");
    expect(a).not.toBe(b);
  });
});

describe("issue diffing", () => {
  it("tracks NEW RESOLVED REGRESSED UNCHANGED", () => {
    const prevFindings: SeoFinding[] = [
      {
        id: "SEO-A",
        severity: "P2",
        area: "technical",
        problem: "old",
        evidence: "e",
        affectedPages: [],
        likelyCause: "c",
        recommendedAction: "r",
        filesLikelyAffected: [],
        expectedImpact: "i",
        effort: "small",
        confidence: 0.8,
      },
      {
        id: "SEO-B",
        severity: "P1",
        area: "technical",
        problem: "keep",
        evidence: "e",
        affectedPages: [],
        likelyCause: "c",
        recommendedAction: "r",
        filesLikelyAffected: [],
        expectedImpact: "i",
        effort: "small",
        confidence: 0.8,
      },
    ];
    const prev = toSnapshot(prevFindings, "FAST", "2026-01-01T00:00:00.000Z");
    const current: SeoFinding[] = [
      {
        ...prevFindings[1]!,
        severity: "P0", // regressed
      },
      {
        id: "SEO-C",
        severity: "P1",
        area: "technical",
        problem: "new",
        evidence: "e",
        affectedPages: [],
        likelyCause: "c",
        recommendedAction: "r",
        filesLikelyAffected: [],
        expectedImpact: "i",
        effort: "small",
        confidence: 0.8,
      },
    ];
    const diff = diffFindings(prev, current);
    expect(diff.summary.NEW).toBe(1);
    expect(diff.summary.RESOLVED).toBe(1);
    expect(diff.summary.REGRESSED).toBe(1);
  });
});

describe("TechnicalSEOAuditAgent fixtures", () => {
  it("catches bad canonical, noindex-in-sitemap, and 404", async () => {
    const result = await runSeoAgent(technicalSeoAuditAgent, {
      mode: "FAST",
      now: new Date("2026-08-15T00:00:00.000Z"),
      writeReports: false,
      fixtures: {
        pages: [
          {
            path: "/guides/demo/",
            statusCode: 404,
            indexable: true,
            inSitemap: false,
            title: "Demo",
            h1Count: 1,
          },
          {
            path: "/private/tool/",
            indexable: false,
            inSitemap: true,
            robots: "noindex,follow",
            title: "Private",
            h1Count: 1,
            canonical: "https://www.softwareglimpse.com/wrong/",
          },
        ],
      },
    });
    const kinds = result.findings.map((f) => f.id);
    expect(result.findings.some((f) => f.id.includes("STATUS"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("SITEMAP"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("CANONICAL"))).toBe(true);
    expect(kinds.length).toBeGreaterThan(0);
    expect(result.meta.mutatesProduction).toBe(false);
  });
});

describe("InternalLinkAuditAgent fixtures", () => {
  it("catches orphan and broken internal link", async () => {
    const result = await runSeoAgent(internalLinkAuditAgent, {
      mode: "FAST",
      now: new Date(),
      writeReports: false,
      fixtures: {
        pages: [
          { path: "/guides/a/", title: "A" },
          { path: "/guides/orphan/", title: "Orphan" },
        ],
        internalEdges: [
          { from: "/guides/a/", to: "/guides/missing-page/" },
          { from: "/guides/a/", to: "/guides/a/" },
        ],
      },
    });
    expect(result.findings.some((f) => f.id.includes("BROKEN"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("ORPHAN"))).toBe(true);
  });
});

describe("StructuredDataAuditAgent fixtures", () => {
  it("catches invalid / placeholder structured data", async () => {
    const result = await runSeoAgent(structuredDataAuditAgent, {
      mode: "FAST",
      now: new Date(),
      writeReports: false,
      fixtures: {
        pages: [
          {
            path: "/software/demo/",
            indexable: false,
            title: "Demo product",
            jsonLd: [
              {
                "@type": "SoftwareApplication",
                name: "TODO placeholder",
                url: "/relative-not-absolute",
              },
            ],
          },
        ],
      },
    });
    expect(result.findings.some((f) => /placeholder/i.test(f.problem))).toBe(
      true,
    );
    expect(
      result.findings.some((f) => /absolute URL/i.test(f.problem)),
    ).toBe(true);
    expect(
      result.findings.some((f) => /noindex/i.test(f.problem)),
    ).toBe(true);
  });
});

describe("MediaSEOAuditAgent fixtures", () => {
  it("catches missing dimensions, bad alt, oversized image", async () => {
    const result = await runSeoAgent(mediaSeoAuditAgent, {
      mode: "FAST",
      now: new Date(),
      writeReports: false,
      fixtures: {
        mediaAssets: [
          {
            src: "/guides/huge-hero.png",
            pagePath: "/guides/x/",
            alt: null,
            width: null,
            height: null,
            bytes: 2_000_000,
            kind: "image",
          },
          {
            src: "/broken.png",
            broken: true,
            kind: "image",
            alt: "x",
            width: 100,
            height: 100,
          },
        ],
      },
    });
    expect(result.findings.some((f) => f.id.includes("DIM"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("ALT"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("SIZE"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("BROKEN"))).toBe(true);
  });
});

describe("OutboundLinkAuditAgent fixtures", () => {
  it("catches affiliate missing sponsored and redirect chains", async () => {
    const result = await runSeoAgent(outboundLinkAuditAgent, {
      mode: "FAST",
      now: new Date(),
      writeReports: false,
      fixtures: {
        outboundLinks: [
          {
            url: "https://partner.example/offer",
            type: "affiliate",
            rel: ["noopener"],
            productSlug: "pipedrive",
            pagePath: "/software/pipedrive/",
          },
          {
            url: "https://vendor.example",
            type: "evidence",
            broken: true,
            pagePath: "/software/pipedrive/",
            redirectChain: ["a", "b", "c", "d"],
          },
        ],
      },
    });
    expect(result.findings.some((f) => /sponsored/i.test(f.problem))).toBe(
      true,
    );
    expect(result.findings.some((f) => f.id.includes("REDIRCHAIN"))).toBe(true);
    expect(result.findings.some((f) => f.id.includes("EXTERNAL"))).toBe(true);
  });
});

describe("ContentCoverageAuditAgent fixtures", () => {
  it("flags missing map nodes as opportunities (not auto articles)", async () => {
    const result = await runSeoAgent(contentCoverageAuditAgent, {
      mode: "FAST",
      now: new Date(),
      writeReports: false,
      fixtures: {
        coverageRows: [
          {
            id: "CRM-999",
            pageType: "guide",
            title: "Missing CRM Guide",
            route: "/guides/missing/",
            status: "MISSING / NOT-YET-IMPLEMENTED",
          },
        ],
      },
    });
    // Fixtures expect missing nodes to surface so detection stays testable.
    expect(result.findings.length).toBeGreaterThan(0);
    expect(
      result.findings.every((f) =>
        /do not auto-generate/i.test(f.recommendedAction),
      ),
    ).toBe(true);
  });
});

describe("SEOHealthOrchestrator", () => {
  it("runs fixture agents and reports skipped/failed honestly", async () => {
    expect(SEO_HEALTH_ORCHESTRATOR.mutatesProduction).toBe(false);

    const result = await runSEOHealthOrchestrator({
      mode: "FAST",
      writeReports: false,
      fixtures: {
        pages: [
          {
            path: "/x/",
            indexable: false,
            inSitemap: true,
            title: "X",
            h1Count: 1,
            canonical: "https://www.softwareglimpse.com/y/",
            jsonLd: [{ "@type": "Thing", name: "TODO placeholder" }],
          },
        ],
        internalEdges: [{ from: "/a/", to: "/missing/" }],
        outboundLinks: [
          {
            url: "https://aff.example",
            type: "affiliate",
            rel: [],
          },
        ],
        mediaAssets: [
          {
            src: "/big.png",
            bytes: 1_500_000,
            alt: null,
            width: null,
            height: null,
          },
        ],
        coverageRows: [
          {
            id: "CRM-1",
            pageType: "guide",
            title: "Gap",
            route: null,
            status: "MISSING",
          },
        ],
        forceCheckFailures: [
          { checkId: "live-html-jsonld", reason: "forced for test" },
        ],
      },
    });

    expect(result.agents.length).toBe(7);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.checksSkipped).toBeGreaterThan(0);
    expect(result.checksFailed).toBeGreaterThan(0);
    expect(
      result.checksFailed + result.checksSkipped + result.checksCompleted,
    ).toBeGreaterThan(0);
  });
});
