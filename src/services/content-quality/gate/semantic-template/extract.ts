import type { Comparison, GuidePage } from "@/domain/schemas";
import type { AnalysisSectionId } from "./types";
import type { AnalysisSections } from "./normalize";

function push(parts: string[], ...chunks: Array<string | null | undefined>) {
  for (const c of chunks) {
    if (c?.trim()) parts.push(c.trim());
  }
}

function collectBlockStrings(value: unknown, out: string[], depth = 0): void {
  if (depth > 5 || value == null) return;
  if (typeof value === "string") {
    if (value.length > 20) out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectBlockStrings(item, out, depth + 1);
    return;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (
        ["id", "src", "alt", "href", "contentId", "productSlug", "slug"].includes(
          k,
        )
      ) {
        continue;
      }
      if (
        (k === "rows" || k === "cells" || k === "values") &&
        Array.isArray(v)
      ) {
        continue;
      }
      collectBlockStrings(v, out, depth + 1);
    }
  }
}

/**
 * Split guide body into analysis sections for sibling comparison.
 * Analyzed separately: intro, decision thesis, pros/cons, limitations,
 * recommendation, scenario analysis, conclusion.
 */
export function extractGuideAnalysisSections(guide: GuidePage): AnalysisSections {
  const sections: AnalysisSections = {};
  const sectionBodies = guide.sections ?? [];
  const introParts: string[] = [];
  push(introParts, guide.summary, guide.seo.description);
  if (sectionBodies[0]) {
    push(introParts, sectionBodies[0].heading, sectionBodies[0].body);
  }
  sections.intro = introParts.join("\n");

  const thesisParts: string[] = [];
  const prosConsParts: string[] = [];
  const recommendParts: string[] = [];
  const limitParts: string[] = [];
  const scenarioParts: string[] = [];
  const conclusionParts: string[] = [];

  for (const s of sectionBodies.slice(0, 3)) {
    push(thesisParts, s.heading, s.body.slice(0, 600));
  }

  for (const s of sectionBodies) {
    const h = `${s.heading} ${s.body}`.toLowerCase();
    if (
      /pros?\b|cons?\b|advantages?|disadvantages?|strengths?|weaknesses?/.test(h)
    ) {
      push(prosConsParts, s.heading, s.body);
    } else if (/decision|framework|criteria|evaluate|thesis|choose when/.test(h)) {
      push(thesisParts, s.heading, s.body);
    } else if (/recommend|best for|should you|verdict|next step/.test(h)) {
      push(recommendParts, s.heading, s.body);
    } else if (/limit|not (?:ideal|a fit)|weak|risk|mistake|avoid/.test(h)) {
      push(limitParts, s.heading, s.body);
    } else if (/scenario|use[- ]case|example|workflow/.test(h)) {
      push(scenarioParts, s.heading, s.body);
    } else if (/conclusion|summary|wrap|final/.test(h)) {
      push(conclusionParts, s.heading, s.body);
    }
  }

  for (const b of guide.blocks ?? []) {
    if (!b || typeof b !== "object") continue;
    const type = "type" in b ? String((b as { type?: string }).type) : "";
    const blob: string[] = [];
    collectBlockStrings(b, blob);
    const text = blob.join("\n");
    if (!text) continue;
    if (
      type.includes("decision") ||
      type.includes("framework") ||
      type.includes("checklist")
    ) {
      push(thesisParts, text);
    } else if (
      type.includes("pros") ||
      type.includes("cons") ||
      type.includes("comparison-table")
    ) {
      push(prosConsParts, text);
    } else if (type.includes("mistake") || type.includes("limit")) {
      push(limitParts, text);
    } else if (type.includes("step") || type.includes("scenario")) {
      push(scenarioParts, text);
    } else if (type.includes("shortlist") || type.includes("size-match")) {
      push(recommendParts, text);
    }
  }

  for (const c of guide.checklist ?? []) {
    push(thesisParts, c.label, c.description);
  }

  if (sectionBodies.length > 0) {
    const last = sectionBodies[sectionBodies.length - 1]!;
    push(conclusionParts, last.heading, last.body);
  }

  sections.decision_thesis = thesisParts.join("\n");
  sections.pros_cons = prosConsParts.join("\n");
  sections.recommendation = recommendParts.join("\n");
  sections.limitations = limitParts.join("\n");
  sections.scenario_analysis = scenarioParts.join("\n");
  sections.conclusion = conclusionParts.join("\n");

  return sections;
}

export function extractComparisonAnalysisSections(
  comparison: Comparison,
): AnalysisSections {
  const sections: AnalysisSections = {};
  sections.intro = [comparison.summary ?? "", comparison.seo?.description ?? ""]
    .filter(Boolean)
    .join("\n");

  sections.decision_thesis = [
    comparison.verdict ?? "",
    comparison.pricingNotes ?? "",
  ]
    .filter(Boolean)
    .join("\n");

  const thesis: string[] = [];
  const recommend: string[] = [];
  const limits: string[] = [];
  const scenarios: string[] = [];
  const prosCons: string[] = [];

  for (const o of comparison.outcomes ?? []) {
    push(thesis, o.reason);
    const reason = o.reason;
    if (reason && /pros?|cons?|strength|weak/i.test(reason)) {
      push(prosCons, reason);
    }
  }
  for (const bf of comparison.bestFor ?? []) {
    for (const s of bf.scenarios ?? []) push(recommend, s);
  }
  for (const sc of comparison.scenarioRecommendations ?? []) {
    push(scenarios, sc.scenario, sc.rationale);
  }

  sections.decision_thesis = [sections.decision_thesis, ...thesis]
    .filter(Boolean)
    .join("\n");
  sections.pros_cons = prosCons.join("\n");
  sections.recommendation =
    recommend.join("\n") || (comparison.verdict ?? "");
  sections.limitations = limits.join("\n");
  sections.scenario_analysis = scenarios.join("\n");
  sections.conclusion = comparison.verdict ?? "";

  return sections;
}

export function guideStripTokens(guide: GuidePage): string[] {
  const tokens = [...(guide.productSlugs ?? [])];
  for (const name of guide.title.split(/\s+/)) {
    if (name.length >= 4) tokens.push(name);
  }
  return tokens;
}

export function comparisonStripTokens(comparison: Comparison): string[] {
  return [...(comparison.productSlugs ?? [])];
}

export const ALL_SECTIONS: AnalysisSectionId[] = [
  "intro",
  "decision_thesis",
  "pros_cons",
  "limitations",
  "recommendation",
  "scenario_analysis",
  "conclusion",
];
