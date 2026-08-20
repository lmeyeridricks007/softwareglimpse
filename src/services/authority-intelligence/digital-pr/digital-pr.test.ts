import { describe, expect, it } from "vitest";
import {
  DIGITAL_PR_AGENT,
  DEFERRED_PR_IDEAS,
  PUBLICATION_MATCHES,
  assertDigitalPrLiveMatchesPresent,
  runDigitalPrOpportunityAgent,
  scanResearchCorpus,
  scoreLinkability,
} from "./index";
import { EXPERT_COMMENTARY_CHANNELS } from "./live-matches";

describe("DigitalPROpportunityAgent", () => {
  it("requires live publication and commentary matches", () => {
    expect(() => assertDigitalPrLiveMatchesPresent([], [])).toThrow(/live/i);
    expect(() =>
      assertDigitalPrLiveMatchesPresent(
        PUBLICATION_MATCHES,
        EXPERT_COMMENTARY_CHANNELS,
      ),
    ).not.toThrow();
  });

  it("scans real research corpus without inventing counts", () => {
    const corpus = scanResearchCorpus("2026-08-15T10:00:00.000Z");
    expect(corpus.productCount).toBeGreaterThanOrEqual(20);
    expect(corpus.planCount).toBeGreaterThanOrEqual(50);
    expect(corpus.featureSupportRows).toBeGreaterThanOrEqual(100);
  });

  it("never invents journalist names on publication matches", () => {
    for (const p of PUBLICATION_MATCHES) {
      expect(p.publication.length).toBeGreaterThan(0);
      expect(p.url.startsWith("http")).toBe(true);
      // Optional author only — if present must be non-empty string
      if (p.journalistOrAuthor !== undefined) {
        expect(p.journalistOrAuthor.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("produces ready ideas only when data can support them", () => {
    const result = runDigitalPrOpportunityAgent({
      write: false,
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.agent.inventsStatistics).toBe(false);
    expect(result.agent.sendsOutreach).toBe(false);
    expect(result.report.ideas.length).toBeGreaterThanOrEqual(6);
    expect(
      result.report.ideas.every((i) => i.inventsStatistics === false),
    ).toBe(true);
    expect(
      result.report.ideas.some(
        (i) => i.id === "pr-pricing-index" && i.status === "ready",
      ),
    ).toBe(true);
    expect(
      result.report.ideas.some(
        (i) => i.id === "pr-plan-gating" && i.status === "ready",
      ),
    ).toBe(true);
    expect(DEFERRED_PR_IDEAS.some((d) => /survey/i.test(d.title))).toBe(true);
    expect(result.markdown).toContain("Digital PR Opportunities");
    expect(result.markdown).toContain("Do not invent statistics");
    expect(
      result.report.ideas.every((i) =>
        i.visuals.every((v) => v.followLinkRequired === false),
      ),
    ).toBe(true);
  });

  it("scores linkability dimensions", () => {
    const score = scoreLinkability({
      originality: "excellent",
      dataUniqueness: "excellent",
      newsworthiness: "excellent",
      timeliness: "excellent",
      visualPotential: "excellent",
      citationPotential: "excellent",
      audienceFit: "excellent",
      reproducibility: "excellent",
    });
    expect(score).toBe(100);
  });
});
