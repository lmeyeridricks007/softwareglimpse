/**
 * Locale 410 topic review — equity preservation for unmapped locale URLs.
 * English-only; never restores multilingual pages or dumps to homepage.
 */

export const LOCALE_410_REVIEW_AGENT = {
  name: "Locale410TopicReview",
  version: "1.0.0",
} as const;

export type Locale410Classification =
  | "TRUE_OBSOLETE"
  | "TAXONOMY_JUNK"
  | "DUPLICATE_TOPIC"
  | "ENGLISH_EQUIVALENT_MISSING"
  | "VALUABLE_TOPIC_CANDIDATE";

export type Locale410Disposition =
  | "KEEP_410"
  | "ADD_301"
  | "EXISTING_ESTATE_GAP_REVIEW";

export type GscPathSignals = {
  clicks: number;
  impressions: number;
  available: boolean;
};

export type BacklinkPathSignals = {
  referringDomains: number | null;
  available: boolean;
  validity: "REAL" | "FIXTURE" | "NOT_CONNECTED" | "STALE";
};

/**
 * Curated EN topic → modern English destination absorbs.
 * Only genuine topic equivalents — never homepage or unrelated hubs.
 */
export type TopicAbsorb = {
  destination: string;
  reason: string;
};

export type Locale410TopicRow = {
  /** English hreflang sibling path (topic identity). */
  enPath: string;
  /** Locale alternate paths currently returning 410. */
  localePaths: string[];
  localeCount: number;
  title: string | null;
  category: string | null;
  legacyPageType: string | null;
  lastmod: string | null;
  intentKind: string;
  mappingAction: string | null;
  mappingBasis: string | null;
  mappingReason: string | null;
  modernEstateMatch: string | null;
  enGsc: GscPathSignals;
  localeGsc: GscPathSignals;
  enBacklinks: BacklinkPathSignals;
  classification: Locale410Classification;
  disposition: Locale410Disposition;
  proposedDestination: string | null;
  absorbReason: string | null;
  notes: string[];
};

export type Locale410ReviewSummary = {
  agent: string;
  version: string;
  generatedAt: string;
  unmappedLocaleUrls: number;
  uniqueEnTopics: number;
  byClassification: Record<Locale410Classification, number>;
  byDisposition: Record<Locale410Disposition, number>;
  repairsProposed: number;
  gapReviewCount: number;
  gscAvailable: boolean;
  backlinksAvailable: boolean;
  policy: {
    englishOnly: true;
    noMultilingualRestore: true;
    noHomepageDump: true;
    noAutoCreatePages: true;
  };
};

export type Locale410ReviewResult = {
  summary: Locale410ReviewSummary;
  topics: Locale410TopicRow[];
  repairs: Locale410TopicRow[];
  gapReview: Locale410TopicRow[];
};
