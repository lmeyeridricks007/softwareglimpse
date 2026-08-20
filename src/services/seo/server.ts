/**
 * Server-only SEO orchestration (filesystem store, sync, queue mutations).
 * Do not import from client components — use `@/services/seo` for pure helpers.
 */
export {
  getSeoRoot,
  fixturesDir,
  buildSnapshotId,
  loadFixtureSnapshot,
  saveSnapshot,
  loadSnapshot,
  listSnapshots,
  saveOpportunity,
  loadOpportunity,
  listOpportunities,
  upsertOpportunity,
  saveExperiment,
  loadExperiment,
  listExperiments,
  saveQueueItem,
  loadQueueItem,
  listQueueItems,
} from "@/data/seo/store";

export { syncSearchPerformance } from "./sync";
export type { SyncSearchPerformanceOptions } from "./sync";

export {
  acceptOpportunity,
  dismissOpportunity,
  buildEditorialBriefCandidate,
} from "./queue";

export { createExperiment, evaluateExperiment } from "./measurement";

export {
  detectAllOpportunities,
  FixtureSearchPerformanceProvider,
  GoogleSearchConsoleProvider,
  ImportSearchPerformanceProvider,
  resolveSearchPerformanceProvider,
  isGscConfigured,
  resolveSearchUrl,
  classifyQuery,
  scoreOpportunity,
} from "./index";

export {
  loadLatestSnapshot,
  loadPreviousSnapshot,
} from "@/data/seo/store";
