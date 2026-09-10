/**
 * Existing-page-first rule for GSC demand without a strong landing page.
 * Prefer improving an existing SoftwareGlimpse URL over CREATE_CANDIDATE.
 */

import {
  getAlternativesPageBySlug,
  getBestPageBySlug,
  getComparisonBySlug,
  getSoftwareBySlug,
} from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import type { GscCommercialIntent } from "./types";
import { ensureSlashPath, inferEstateType } from "./estate";

export type ExistingPageMatch = {
  path: string;
  reason: string;
  confidence: "high" | "medium" | "low";
};

export type CreateCandidateResolution = {
  query: string;
  impressions: number;
  intent: GscCommercialIntent;
  /** Prefer this over creating a new URL. */
  improveExisting: ExistingPageMatch | null;
  /** Only when no suitable existing page exists. */
  createCandidateSuggested: boolean;
  createCandidateNotes: string[];
};

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "best",
  "vs",
  "versus",
  "software",
  "tool",
  "tools",
  "app",
  "apps",
]);

/**
 * Heuristic: map a demand query onto an existing estate URL when possible.
 */
export function findExistingPageForQuery(input: {
  query: string;
  intent: GscCommercialIntent;
  scoredPaths: string[];
}): ExistingPageMatch | null {
  const q = input.query.toLowerCase().trim();
  const toks = tokens(q);

  // Direct compare pattern: a vs b
  const vs = q.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (vs) {
    const left = vs[1]!.trim().replace(/\s+/g, "-");
    const right = vs[2]!.trim().replace(/\s+/g, "-");
    const forward = `${left}-vs-${right}`;
    const reverse = `${right}-vs-${left}`;
    for (const slug of [forward, reverse]) {
      if (getComparisonBySlug(slug)) {
        return {
          path: `/compare/${slug}/`,
          reason: "Existing comparison page matches vs-query intent",
          confidence: "high",
        };
      }
    }
  }

  // Alternatives: "X alternatives"
  const alt = q.match(/^(.+?)\s+alternatives?$/i);
  if (alt) {
    const product = alt[1]!.trim().replace(/\s+/g, "-");
    if (getAlternativesPageBySlug(product) || getSoftwareBySlug(product)) {
      const path = `/alternatives/${product}/`;
      return {
        path,
        reason: "Existing alternatives URL (or product with alternatives hub)",
        confidence: getAlternativesPageBySlug(product) ? "high" : "medium",
      };
    }
  }

  // Best / buying list
  if (/\bbest\b/.test(q) || input.intent === "buying_guide") {
    for (const path of input.scoredPaths) {
      if (inferEstateType(path) === "best") {
        const slug = path.split("/").filter(Boolean)[1];
        if (slug && getBestPageBySlug(slug)) {
          const overlap = toks.filter((t) => slug.includes(t)).length;
          if (overlap >= 1) {
            return {
              path: ensureSlashPath(path),
              reason: "Existing best page overlaps query tokens",
              confidence: overlap >= 2 ? "high" : "medium",
            };
          }
        }
      }
    }
  }

  // Product review / software hub
  for (const t of toks) {
    if (getSoftwareBySlug(t)) {
      return {
        path: `/software/${t}/`,
        reason: `Existing software hub for “${t}”`,
        confidence: "high",
      };
    }
  }

  // Guides by slug overlap
  for (const path of input.scoredPaths) {
    if (inferEstateType(path) !== "guides") continue;
    const slug = path.split("/").filter(Boolean)[1];
    if (!slug) continue;
    const guide = getGuideBySlug(slug, { includeUnpublished: true });
    if (!guide) continue;
    const hay = `${slug} ${guide.title}`.toLowerCase();
    const overlap = toks.filter((t) => hay.includes(t)).length;
    if (overlap >= 2) {
      return {
        path: ensureSlashPath(path),
        reason: "Existing guide overlaps query tokens — prefer enrichment",
        confidence: overlap >= 3 ? "high" : "medium",
      };
    }
  }

  // Any scored path with strong token overlap
  let best: ExistingPageMatch | null = null;
  let bestScore = 0;
  for (const path of input.scoredPaths) {
    const hay = path.toLowerCase();
    const overlap = toks.filter((t) => hay.includes(t)).length;
    if (overlap > bestScore && overlap >= 2) {
      bestScore = overlap;
      best = {
        path: ensureSlashPath(path),
        reason: "Existing estate URL shares query tokens",
        confidence: overlap >= 3 ? "medium" : "low",
      };
    }
  }
  return best;
}

export function resolveCreateCandidate(input: {
  query: string;
  impressions: number;
  intent: GscCommercialIntent;
  reason: string;
  scoredPaths: string[];
}): CreateCandidateResolution {
  const improveExisting = findExistingPageForQuery(input);
  if (improveExisting) {
    return {
      query: input.query,
      impressions: input.impressions,
      intent: input.intent,
      improveExisting,
      createCandidateSuggested: false,
      createCandidateNotes: [
        `Prefer improving ${improveExisting.path} (${improveExisting.reason})`,
        input.reason,
      ],
    };
  }

  return {
    query: input.query,
    impressions: input.impressions,
    intent: input.intent,
    improveExisting: null,
    createCandidateSuggested: true,
    createCandidateNotes: [
      "No suitable existing SoftwareGlimpse page found for this intent",
      input.reason,
      "CREATE_CANDIDATE only — do not auto-publish; editorial must confirm gap",
    ],
  };
}
