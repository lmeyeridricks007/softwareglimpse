import type { GuidePage } from "@/domain/schemas";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "./classify";

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "your",
  "have",
  "will",
  "when",
  "what",
  "which",
  "into",
  "than",
  "them",
  "they",
  "then",
  "also",
  "only",
  "more",
  "most",
  "such",
  "over",
  "after",
  "before",
  "about",
  "should",
  "could",
  "would",
  "software",
  "guide",
  "team",
  "teams",
  "type",
  "true",
  "false",
  "null",
  "title",
  "body",
  "label",
  "items",
  "steps",
]);

function collectStrings(value: unknown, out: string[], depth = 0): void {
  if (depth > 6 || value == null) return;
  if (typeof value === "string") {
    if (value.length > 2 && !value.startsWith("/") && !value.startsWith("http")) {
      out.push(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out, depth + 1);
    return;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (["id", "src", "alt", "href", "contentId", "productSlug"].includes(k)) {
        continue;
      }
      collectStrings(v, out, depth + 1);
    }
  }
}

function extractText(guide: GuidePage): string {
  const parts: string[] = [
    guide.title,
    guide.summary ?? "",
    guide.seo.description ?? "",
  ];
  for (const s of guide.sections ?? []) {
    parts.push(s.heading, s.body, s.tip ?? "");
  }
  for (const f of guide.faq ?? []) {
    parts.push(f.question, f.answer);
  }
  for (const c of guide.checklist ?? []) {
    parts.push(c.label, c.description ?? "");
  }
  collectStrings(guide.blocks ?? [], parts);
  return parts.join(" ");
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

/**
 * Estimate unique-content ratio.
 * Factory / product-explainer packs get a structural penalty (known template mesh).
 * Educational guides score from prose lexical diversity — not JSON key noise.
 */
export function estimateGuideUniqueContentRatio(guide: GuidePage): {
  ratio: number;
  wordCount: number;
  boilerplateShare: number;
} {
  const text = extractText(guide);
  const tokens = tokenize(text);
  const rawWords = text.split(/\s+/).filter(Boolean).length;
  const wordCount = Math.max(tokens.length, rawWords);
  const unique = new Set(tokens);
  const lexical = unique.size / Math.max(tokens.length, 1);

  const templateHeavy =
    isFactoryProductPackGuide(guide) || isProductExplainerGuide(guide);
  const enrichedTemplate =
    templateHeavy &&
    guideBodyHasUniqueAnalysis(guide, { allowEnrichedFactory: true });

  let boilerplateShare = 0;
  if (templateHeavy && !enrichedTemplate) {
    // Unenriched factory / explainer mesh — structural penalty unchanged.
    boilerplateShare = isFactoryProductPackGuide(guide) ? 0.85 : 0.72;
  } else if (enrichedTemplate) {
    // Enriched packs/explainers — score from block depth + lexical diversity
    // (same bar as enriched explainers; does not relax uniqueness thresholds).
    const blocks = guide.blocks?.length ?? 0;
    boilerplateShare =
      blocks >= 6
        ? Math.max(0.15, 0.28 - lexical * 0.15)
        : Math.max(0.25, 0.4 - lexical * 0.2);
  } else {
    const blocks = guide.blocks?.length ?? 0;
    const sections = guide.sections?.length ?? 0;
    if (blocks >= 6 || sections >= 4) {
      boilerplateShare = Math.max(0, 0.25 - lexical * 0.15);
    } else if (blocks < 4 && sections < 3) {
      boilerplateShare = 0.4;
    } else {
      boilerplateShare = Math.max(0, 0.35 - lexical * 0.25);
    }
  }

  let ratio = Math.max(0, Math.min(1, lexical * (1 - boilerplateShare * 0.5)));

  // Structured educational / enriched guides with real block depth are not thin shells.
  if (
    (!templateHeavy || enrichedTemplate) &&
    (guide.blocks?.length ?? 0) >= 6 &&
    wordCount >= 600
  ) {
    ratio = Math.max(ratio, 0.55);
  }

  return {
    ratio: Number(ratio.toFixed(3)),
    wordCount,
    boilerplateShare: Number(boilerplateShare.toFixed(3)),
  };
}

export function titleQualityFor(
  title: string | undefined,
): "strong" | "adequate" | "weak" | "missing" {
  if (!title?.trim()) return "missing";
  const t = title.trim();
  if (t.length < 20) return "weak";
  if (/compare .+ on SoftwareGlimpse/i.test(t)) return "weak";
  if (t.length >= 35 && t.length <= 70) return "strong";
  return "adequate";
}

export function guideBodyHasUniqueAnalysis(
  guide: GuidePage,
  opts: { allowEnrichedFactory?: boolean } = {},
): boolean {
  const templateHeavy =
    isFactoryProductPackGuide(guide) || isProductExplainerGuide(guide);
  if (templateHeavy && !opts.allowEnrichedFactory) {
    return false;
  }
  const blockTypes = new Set(
    (guide.blocks ?? []).map((b) =>
      b && typeof b === "object" && "type" in b
        ? String((b as { type?: string }).type)
        : "",
    ),
  );
  const analytical = [
    "decision-framework",
    "feature-matrix",
    "size-match",
    "crm-types",
    "mistakes",
    "step",
  ];
  if (analytical.some((t) => blockTypes.has(t))) return true;
  return (guide.sections?.length ?? 0) >= 3 && (guide.faq?.length ?? 0) >= 2;
}

/**
 * Lexical uniqueness without the structural factory/explainer boilerplate penalty.
 * Used by promotion gates so enriched packs can clear the bar.
 */
export function estimateGuidePromotionUniqueRatio(guide: GuidePage): {
  ratio: number;
  wordCount: number;
  boilerplateShare: number;
} {
  const text = extractText(guide);
  const tokens = tokenize(text);
  const rawWords = text.split(/\s+/).filter(Boolean).length;
  const wordCount = Math.max(tokens.length, rawWords);
  const unique = new Set(tokens);
  const lexical = unique.size / Math.max(tokens.length, 1);
  const blocks = guide.blocks?.length ?? 0;
  const sections = guide.sections?.length ?? 0;
  let boilerplateShare = 0.3;
  if (blocks >= 6 || sections >= 4) {
    boilerplateShare = Math.max(0, 0.25 - lexical * 0.15);
  } else if (blocks < 4 && sections < 3) {
    boilerplateShare = 0.4;
  } else {
    boilerplateShare = Math.max(0, 0.35 - lexical * 0.25);
  }
  let ratio = Math.max(0, Math.min(1, lexical * (1 - boilerplateShare * 0.5)));
  if ((blocks >= 6 || sections >= 3) && wordCount >= 350) {
    ratio = Math.max(ratio, 0.5);
  }
  // Enriched factory/explainer packs with analytical signals clear a promotion floor.
  if (
    (isFactoryProductPackGuide(guide) || isProductExplainerGuide(guide)) &&
    guideBodyHasUniqueAnalysis(guide, { allowEnrichedFactory: true }) &&
    wordCount >= 300
  ) {
    ratio = Math.max(ratio, 0.5);
  }
  return {
    ratio: Number(ratio.toFixed(3)),
    wordCount,
    boilerplateShare: Number(boilerplateShare.toFixed(3)),
  };
}

export function guideHasTablesOrData(guide: GuidePage): boolean {
  const blockTypes = new Set(
    (guide.blocks ?? []).map((b) =>
      b && typeof b === "object" && "type" in b
        ? String((b as { type?: string }).type)
        : "",
    ),
  );
  return (
    blockTypes.has("feature-matrix") ||
    blockTypes.has("size-match") ||
    blockTypes.has("comparison-table")
  );
}
