/**
 * AI Visibility monitoring — measurement only.
 * Do not manipulate or spam AI answer engines. Never invent observations.
 */

export const AI_VISIBILITY_ENGINE_VERSION = "1.0.0";

export const AiVisibilityPlatform = [
  "chatgpt",
  "perplexity",
  "copilot",
  "google_ai",
  "gemini",
  "other",
] as const;
export type AiVisibilityPlatform = (typeof AiVisibilityPlatform)[number];

export type AiVisibilityObservation = {
  id: string;
  platform: AiVisibilityPlatform;
  query: string;
  date: string;
  softwareGlimpseCited: boolean;
  citedUrl: string | null;
  /** Canonical site path when citedUrl is on SoftwareGlimpse */
  citedPath: string | null;
  citationPosition: number | null;
  competitorsCited: string[];
  topic: string | null;
  category: string | null;
  pageType: string | null;
  notes: string[];
  /** Optional share/volume metrics only when present in export */
  aiSharePct: number | null;
  impressions: number | null;
};

export type AiVisibilityExportMeta = {
  provider: "ahrefs" | "semrush" | "other" | "unknown";
  sourcePath: string;
  label: string | null;
  importedAt: string;
  rowCount: string | number;
  notes: string[];
};

export type LoadedAiVisibilityExport = {
  meta: AiVisibilityExportMeta;
  observations: AiVisibilityObservation[];
};

export type CitedPageAggregate = {
  path: string;
  citationCount: number;
  platforms: string[];
  pageType: string | null;
  category: string | null;
  sampleQueries: string[];
};

export type ContentPatternObservation = {
  path: string;
  citationCount: number;
  patterns: string[];
  /** Explicit: co-occurrence only — not proven causation */
  caveat: string;
};

export type AiVisibilityReport = {
  engineVersion: string;
  generatedAt: string;
  methodologyNotes: string[];
  complianceNotes: string[];
  exportMeta: AiVisibilityExportMeta | null;
  observations: AiVisibilityObservation[];
  analysis: {
    totalCitations: number;
    uniqueCitedPages: number;
    citationsByPlatform: Record<string, number>;
    citationsByCategory: Record<string, number>;
    citationsByPageType: Record<string, number>;
    newCitations: CitedPageAggregate[];
    lostCitations: CitedPageAggregate[];
    competitorOverlap: Array<{
      competitor: string;
      timesCitedWithSoftwareGlimpse: number;
      timesCitedWithoutSoftwareGlimpse: number;
    }>;
    topCitedPages: CitedPageAggregate[];
  };
  contentPatterns: ContentPatternObservation[];
  summary: {
    exportAvailable: boolean;
    totalCitations: number;
    uniqueCitedPages: number;
    platformCount: number;
    newCitationCount: number;
    lostCitationCount: number;
    topPlatform: string | null;
  };
};
