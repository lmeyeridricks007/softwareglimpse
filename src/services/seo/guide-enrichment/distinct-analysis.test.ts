import { describe, expect, it } from "vitest";
import {
  countCanonicalUniqueSignals,
  detectUniqueAnalysisSignals,
  combinedSimilarity,
  normalizeEditorialText,
} from "@/services/content-quality/gate/semantic-template";
import { loadSafeProductContext } from "./enrich-context";
import { buildFactoryDistinctAnalysis } from "./distinct-analysis";

function analysisText(
  kind: "plans" | "worth-it" | "implementation" | "setup" | "migration",
  productSlug: string,
  name: string,
) {
  const ctx = loadSafeProductContext(productSlug);
  expect(ctx).toBeTruthy();
  const built = buildFactoryDistinctAnalysis({
    kind,
    slug:
      kind === "worth-it"
        ? `is-${productSlug}-worth-it`
        : `${productSlug}-${kind === "setup" ? "setup" : kind}`,
    name,
    category: ctx!.categorySlug,
    ctx: ctx!,
  });
  const body = [built.summary, ...built.sections.map((s) => `${s.heading}\n${s.body}`)].join(
    "\n",
  );
  return { built, body, ctx: ctx! };
}

describe("factory distinct analysis", () => {
  it("covers buyer question, thesis, fit, limitation, pricing, scenario, alternative, conclusion", () => {
    const { body } = analysisText("implementation", "hubspot", "HubSpot");
    expect(body).toMatch(/buyer question/i);
    expect(body).toMatch(/thesis/i);
    expect(body).toMatch(/\bbest for\b/i);
    expect(body).toMatch(/\bpoor fit\b/i);
    expect(body).toMatch(/\blimitation\b/i);
    expect(body).toMatch(/pricing interpretation|plan jumps to/i);
    expect(body).toMatch(/\bscenario:|\buse-case:/i);
    expect(body).toMatch(/\bunlike\b|\bcompared with\b/i);
    expect(body).toMatch(/decision conclusion|conclusion:/i);
    const canonical = countCanonicalUniqueSignals(detectUniqueAnalysisSignals(body));
    expect(canonical).toBeGreaterThanOrEqual(2);
  });

  it("keeps two major CRM implementation pages distinct after name strip", () => {
    const a = analysisText("implementation", "hubspot", "HubSpot");
    const b = analysisText("implementation", "salesforce", "Salesforce");
    const stripA = ["hubspot", "salesforce"];
    const normA = normalizeEditorialText(a.body, stripA);
    const normB = normalizeEditorialText(b.body, stripA);
    expect(combinedSimilarity(normA, normB)).toBeLessThan(0.72);
  });
});
