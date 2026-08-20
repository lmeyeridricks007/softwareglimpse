import type {
  DimensionScore,
  EvaluationDimensionId,
  PageObservation,
  ScoredPage,
} from "./types";

function band(score: number | null): DimensionScore["band"] {
  if (score == null) return "unknown";
  if (score >= 75) return "strong";
  if (score >= 50) return "adequate";
  return "weak";
}

function dim(
  id: EvaluationDimensionId,
  score: number | null,
  reason: string,
  confidence: DimensionScore["confidence"],
  observable = score != null,
): DimensionScore {
  return {
    id,
    score,
    band: band(score),
    reason,
    observable,
    confidence,
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function intentScore(obs: PageObservation): DimensionScore {
  if (!obs.query) {
    return dim("search-intent-alignment", null, "No target query attached", "low", false);
  }
  const q = obs.query.toLowerCase();
  const blob = `${obs.title} ${obs.url} ${obs.pageType}`.toLowerCase();
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  const hits = tokens.filter((t) => blob.includes(t)).length;
  const ratio = tokens.length ? hits / tokens.length : 0;
  let score = clamp(ratio * 85 + (obs.pageType !== "article" ? 10 : 0));
  if (q.includes("best") && obs.pageType === "best") score = Math.max(score, 85);
  if (q.includes("vs") && obs.pageType === "comparison") score = Math.max(score, 85);
  if (q.includes("review") && obs.pageType === "review") score = Math.max(score, 85);
  if (q.includes("checklist") && (obs.hasChecklist || obs.pageType === "resource")) {
    score = Math.max(score, 80);
  }
  return dim(
    "search-intent-alignment",
    score,
    `Title/URL/page-type overlap with “${obs.query}” (~${hits}/${tokens.length} tokens)`,
    obs.source === "live-html" || obs.source === "fixture" ? "medium" : "low",
  );
}

/**
 * Score a single page from externally observable signals.
 * Null = not assessable from available evidence (do not invent).
 */
export function scorePageObservation(obs: PageObservation): ScoredPage {
  const html = obs.source === "live-html" || obs.source === "fixture" || obs.source === "local-sg";
  const conf: DimensionScore["confidence"] = html ? "medium" : "low";

  const dimensions: DimensionScore[] = [
    intentScore(obs),
    html && obs.wordCount != null
      ? dim(
          "content-depth",
          clamp(
            obs.wordCount < 400
              ? 35
              : obs.wordCount < 900
                ? 55
                : obs.wordCount < 1800
                  ? 72
                  : obs.wordCount < 3500
                    ? 85
                    : 78,
          ),
          `≈${obs.wordCount} words (proxy; not quality guarantee)`,
          conf,
        )
      : dim("content-depth", null, "Word count not available", "low", false),
    html && obs.h2Count != null
      ? dim(
          "content-structure",
          clamp(
            (obs.h2Count >= 4 ? 40 : obs.h2Count * 8) +
              (obs.h3Count && obs.h3Count > 0 ? 15 : 0) +
              (obs.listCount && obs.listCount >= 2 ? 15 : 0) +
              (obs.tableCount && obs.tableCount > 0 ? 15 : 0) +
              (obs.h1Count === 1 ? 10 : obs.h1Count === 0 ? 0 : 5),
          ),
          `h1=${obs.h1Count ?? 0}, h2=${obs.h2Count ?? 0}, lists=${obs.listCount ?? 0}, tables=${obs.tableCount ?? 0}`,
          conf,
        )
      : dim("content-structure", null, "Heading structure not available", "low", false),
    dim(
      "original-value",
      html
        ? clamp(
            (obs.hasMethodology ? 25 : 0) +
              (obs.hasToolSignal || obs.hasCalculatorSignal ? 25 : 0) +
              (obs.hasChecklist ? 15 : 0) +
              (obs.hasComparisonTable ? 15 : 0) +
              (obs.hasProsCons ? 10 : 0) +
              20,
          )
        : null,
      html
        ? "Proxy from methodology/tools/checklists/tables — not a claim of uniqueness"
        : "Cannot assess originality from SERP metadata",
      "low",
      html,
    ),
    dim(
      "evidence",
      html
        ? clamp(
            Math.min(40, (obs.externalLinkCount ?? 0) * 2) +
              (obs.hasMethodology ? 25 : 0) +
              (obs.tableCount && obs.tableCount > 0 ? 15 : 0) +
              (obs.hasDisclosure ? 10 : 0) +
              10,
          )
        : null,
      html
        ? `External links≈${obs.externalLinkCount ?? 0}; methodology=${Boolean(obs.hasMethodology)}`
        : "Evidence signals not verified",
      conf,
      html,
    ),
    dim(
      "product-screenshots",
      html
        ? obs.hasScreenshotSignal
          ? 80
          : (obs.imageCount ?? 0) >= 3
            ? 45
            : (obs.imageCount ?? 0) > 0
              ? 30
              : 15
        : null,
      html
        ? obs.hasScreenshotSignal
          ? "Screenshot/product-image signals present"
          : `Images=${obs.imageCount ?? 0} (screenshot-specific signals weak/absent)`
        : "Media not verified",
      "low",
      html,
    ),
    dim(
      "video",
      html ? (obs.videoEmbedCount && obs.videoEmbedCount > 0 ? 85 : 20) : null,
      html
        ? `Video embeds=${obs.videoEmbedCount ?? 0}`
        : "Video not verified",
      conf,
      html,
    ),
    dim(
      "tools",
      html ? (obs.hasToolSignal ? 80 : obs.formCount && obs.formCount > 0 ? 45 : 20) : null,
      html
        ? `Tool/interactive signals=${Boolean(obs.hasToolSignal)}; forms=${obs.formCount ?? 0}`
        : "Tools not verified",
      conf,
      html,
    ),
    dim(
      "calculators",
      html ? (obs.hasCalculatorSignal ? 85 : 15) : null,
      html
        ? `Calculator signals=${Boolean(obs.hasCalculatorSignal)}`
        : "Calculators not verified",
      conf,
      html,
    ),
    dim(
      "templates-resources",
      html
        ? obs.hasDownloadSignal || obs.hasChecklist
          ? 80
          : obs.pageType === "resource"
            ? 55
            : 25
        : /checklist|template/.test(obs.url.toLowerCase())
          ? 50
          : null,
      html
        ? `Download/checklist signals=${Boolean(obs.hasDownloadSignal || obs.hasChecklist)}`
        : "Inferred weakly from URL if at all",
      conf,
      html || /checklist|template/.test(obs.url.toLowerCase()),
    ),
    dim(
      "comparison-depth",
      html
        ? obs.hasComparisonTable
          ? 85
          : obs.pageType === "comparison"
            ? 55
            : /\bvs\.?\b/.test(obs.title.toLowerCase())
              ? 40
              : 20
        : obs.pageType === "comparison"
          ? 45
          : null,
      html
        ? `Comparison table=${Boolean(obs.hasComparisonTable)}; pageType=${obs.pageType}`
        : "Comparison depth not verified",
      conf,
      html || obs.pageType === "comparison",
    ),
    dim(
      "review-quality",
      html
        ? clamp(
            (obs.hasProsCons ? 30 : 0) +
              (obs.hasMethodology ? 25 : 0) +
              (obs.hasAuthorSignal ? 15 : 0) +
              (obs.hasPricingSignal ? 10 : 0) +
              (obs.pageType === "review" ? 20 : 5),
          )
        : obs.pageType === "review"
          ? 40
          : null,
      html
        ? `Pros/cons=${Boolean(obs.hasProsCons)}; methodology=${Boolean(obs.hasMethodology)}`
        : "Review quality not verified",
      conf,
      html || obs.pageType === "review",
    ),
    dim(
      "pricing-detail",
      html ? (obs.hasPricingSignal ? 80 : 25) : null,
      html
        ? `Pricing signals=${Boolean(obs.hasPricingSignal)}`
        : "Pricing not verified",
      conf,
      html,
    ),
    dim(
      "freshness",
      html ? (obs.hasDateSignal ? 75 : 35) : null,
      html
        ? `Date/updated signals=${Boolean(obs.hasDateSignal)}`
        : "Freshness not verified",
      "low",
      html,
    ),
    dim(
      "author-trust",
      html ? (obs.hasAuthorSignal ? 75 : 30) : null,
      html
        ? `Author byline/Person schema=${Boolean(obs.hasAuthorSignal)}`
        : "Author not verified",
      conf,
      html,
    ),
    dim(
      "source-transparency",
      html
        ? clamp(
            (obs.hasDisclosure ? 40 : 0) +
              (obs.hasMethodology ? 40 : 0) +
              (obs.externalLinkCount && obs.externalLinkCount >= 3 ? 15 : 0),
          )
        : null,
      html
        ? `Disclosure=${Boolean(obs.hasDisclosure)}; methodology=${Boolean(obs.hasMethodology)}`
        : "Transparency not verified",
      conf,
      html,
    ),
    dim(
      "internal-links",
      html && obs.internalLinkCount != null
        ? clamp(
            obs.internalLinkCount < 5
              ? 30
              : obs.internalLinkCount < 15
                ? 55
                : obs.internalLinkCount < 40
                  ? 75
                  : 70,
          )
        : null,
      html
        ? `Same-domain links≈${obs.internalLinkCount ?? 0}`
        : "Internal links not counted",
      conf,
      html,
    ),
    dim(
      "ux",
      html
        ? clamp(
            (obs.h1Count === 1 ? 25 : 10) +
              ((obs.h2Count ?? 0) >= 3 ? 25 : 10) +
              ((obs.listCount ?? 0) >= 1 ? 15 : 0) +
              (obs.hasViewportMeta ? 20 : 0) +
              15,
          )
        : null,
      html
        ? "Heuristic from headings/lists/viewport — not a usability study"
        : "UX not assessed",
      "low",
      html,
    ),
    dim(
      "mobile",
      html
        ? obs.hasViewportMeta
          ? 80
          : 25
        : null,
      html
        ? `viewport meta=${Boolean(obs.hasViewportMeta)} (proxy only)`
        : "Mobile signals not verified",
      "low",
      html,
    ),
    dim(
      "performance-proxies",
      html && (obs.htmlBytes != null || obs.ttfbMs != null)
        ? clamp(
            100 -
              Math.min(40, ((obs.htmlBytes ?? 0) / 50_000) * 5) -
              Math.min(30, ((obs.ttfbMs ?? 0) / 100) * 2) -
              Math.min(20, ((obs.imageCount ?? 0) / 20) * 10),
          )
        : null,
      html
        ? `htmlBytes≈${obs.htmlBytes ?? "?"}; ttfbMs≈${obs.ttfbMs ?? "?"}; images=${obs.imageCount ?? 0}`
        : "Performance proxies unavailable",
      "low",
      html && (obs.htmlBytes != null || obs.ttfbMs != null),
    ),
    dim(
      "structured-data",
      html
        ? obs.hasJsonLd
          ? clamp(60 + Math.min(30, (obs.jsonLdTypes?.length ?? 0) * 8))
          : 20
        : null,
      html
        ? obs.hasJsonLd
          ? `JSON-LD types: ${(obs.jsonLdTypes ?? []).slice(0, 6).join(", ") || "present"}`
          : "No JSON-LD observed"
        : "Structured data not verified",
      conf,
      html,
    ),
    dim(
      "content-differentiation",
      html
        ? clamp(
            (obs.hasToolSignal || obs.hasCalculatorSignal ? 25 : 0) +
              (obs.hasMethodology ? 20 : 0) +
              (obs.hasChecklist || obs.hasDownloadSignal ? 15 : 0) +
              (obs.hasComparisonTable ? 15 : 0) +
              (obs.pageType === "vendor-page" ? 5 : 15) +
              10,
          )
        : null,
      html
        ? "Relative differentiation proxy vs typical SERP formats — not a moat claim"
        : "Differentiation not assessed",
      "low",
      html,
    ),
  ];

  const scored = dimensions.filter((d) => d.score != null) as Array<
    DimensionScore & { score: number }
  >;
  const overall =
    scored.length >= 6
      ? Math.round(scored.reduce((s, d) => s + d.score, 0) / scored.length)
      : null;

  return { observation: obs, dimensions, overall };
}

export const BENCHMARK_DIMENSION_KEYS: EvaluationDimensionId[] = [
  "search-intent-alignment",
  "content-depth",
  "original-value",
  "evidence",
  "tools",
  "product-screenshots",
  "comparison-depth",
  "review-quality",
  "freshness",
  "ux",
];
