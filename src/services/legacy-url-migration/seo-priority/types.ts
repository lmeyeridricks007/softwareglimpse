/**
 * SEO priority enrichment for legacy URL migration.
 * Never invents GSC/GA/backlink metrics.
 */

export type HistoricalSeoImportance = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type MigrationRiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type MetricConfidence = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export type DataAvailabilityReport = {
  inspectedAt: string;
  searchConsole: {
    available: boolean;
    mode: "gsc" | "import" | "snapshot-store" | "fixture" | "none";
    live: boolean;
    synthetic: boolean;
    notes: string[];
    dateRange?: { startDate?: string; endDate?: string; rangeLabel?: string };
    pageCount?: number;
  };
  analytics: {
    available: boolean;
    notes: string[];
  };
  backlinks: {
    available: boolean;
    notes: string[];
  };
  proxySignals: {
    available: boolean;
    notes: string[];
  };
};

export type LegacyUrlGscMetrics = {
  clicks: number;
  impressions: number;
  ctr: number | null;
  averagePosition: number | null;
  topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  dateRange?: { startDate?: string; endDate?: string; rangeLabel?: string };
  source: "gsc" | "import" | "snapshot-store";
};

export type LegacyUrlAnalyticsMetrics = {
  organicSessions?: number;
  totalSessions?: number;
  conversions?: number;
  affiliateClicks?: number;
  downloadsOrToolUsage?: number;
  source: string;
};

export type LegacyUrlBacklinkMetrics = {
  referringDomains?: number;
  backlinks?: number;
  importantLinkedUrls?: string[];
  source: string;
};

export type SeoPriorityEnrichment = {
  legacyPath: string;
  historicalSeoImportance: HistoricalSeoImportance;
  migrationRisk: MigrationRiskLevel;
  dataSources: string[];
  metricConfidence: MetricConfidence;
  importanceReasons: string[];
  riskReasons: string[];
  gsc: LegacyUrlGscMetrics | null;
  analytics: LegacyUrlAnalyticsMetrics | null;
  backlinks: LegacyUrlBacklinkMetrics | null;
  proxy: {
    commercialValue: boolean;
    contentClusterRole: boolean;
    brandProductRelevance: boolean;
    mappedDestinationInbound?: number | null;
    mappingAction?: string;
    mappingRelationship?: string;
    seoRiskFromMapper?: string;
  };
};

export type SeoPriorityRow = SeoPriorityEnrichment & {
  legacyUrl: string;
  legacyTitle: string;
  newPath: string | null;
  newTitle: string | null;
  recommendedAction: string;
  relationship: string;
  mappingConfidence: string;
};

export const SEO_PRIORITY_MIGRATION_AGENT = {
  id: "seo-priority-migration-agent",
  name: "SeoPriorityMigrationAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};
