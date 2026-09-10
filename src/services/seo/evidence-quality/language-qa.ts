import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { resolveEvidenceLevel } from "@/services/editorial/evidence-level";
import { resolvePricingVerifiedAtForEvidence } from "@/services/editorial/pricing-verified-at";
import { getSoftwareBySlug } from "@/data";
import { loadReview } from "@/data/editorial/store";
import { productHasHandsOnTest } from "@/services/product-testing/sessions";
import type { LanguageQaHit } from "./types";

/**
 * Banned on research-only / data-verified pages (implies hands-on without a session).
 * Transparent “not hands-on” / “research-based” language is allowed.
 */
export const BANNED_HANDS_ON_LANGUAGE: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bwe tested\b/i, label: "We tested" },
  { pattern: /\bour experience\b/i, label: "Our experience" },
  { pattern: /\bduring testing\b/i, label: "During testing" },
  { pattern: /\bin our testing\b/i, label: "in our testing" },
  { pattern: /\bwhen we used\b/i, label: "when we used" },
  { pattern: /\bour team used\b/i, label: "our team used" },
  { pattern: /\bwe tried\b/i, label: "we tried" },
];

function excerptAround(text: string, index: number, len = 80): string {
  const start = Math.max(0, index - 20);
  const end = Math.min(text.length, index + len);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function scanText(
  filePath: string,
  text: string,
  evidenceLevel: string | null,
): LanguageQaHit[] {
  const hits: LanguageQaHit[] = [];
  for (const { pattern, label } of BANNED_HANDS_ON_LANGUAGE) {
    const match = pattern.exec(text);
    if (!match || match.index == null) continue;
    hits.push({
      path: filePath,
      pattern: label,
      excerpt: excerptAround(text, match.index),
      evidenceLevel,
    });
  }
  return hits;
}

function productLevel(slug: string): string {
  if (productHasHandsOnTest(slug)) return "hands_on_tested";
  const software = getSoftwareBySlug(slug);
  const review = loadReview(slug);
  return resolveEvidenceLevel({
    handsOnTesting: Boolean(review?.handsOnTesting),
    testedAt: review?.testedAt,
    pricingVerifiedAt: resolvePricingVerifiedAtForEvidence(
      software,
      review?.pricingVerifiedAt,
    ),
  });
}

function listJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

/**
 * Scan public editorial copy for hands-on language on non–hands-on products.
 */
export function runEvidenceLanguageQa(root = process.cwd()): LanguageQaHit[] {
  const hits: LanguageQaHit[] = [];
  const roots = [
    path.join(root, "src/data/editorial/reviews"),
    path.join(root, "src/data/editorial/assessments"),
    path.join(root, "data/seo/compare-enrichment-overlays"),
    path.join(root, "data/seo/guide-enrichment-overlays"),
    path.join(root, "data/seo/software-enrichment-overlays"),
  ];

  for (const dir of roots) {
    for (const file of listJsonFiles(dir)) {
      let raw: string;
      try {
        raw = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const base = path.basename(file, ".json");
      // Overlay slugs may be product or compare pair — best-effort level.
      const slugGuess = base.includes("-vs-")
        ? base.split("-vs-")[0] ?? base
        : base;
      const level = productLevel(slugGuess);
      if (level === "hands_on_tested") continue;
      hits.push(...scanText(path.relative(root, file), raw, level));
    }
  }

  return hits;
}
