export {
  CONTENT_LIFECYCLE_VERSION,
  LIFECYCLE_NOINDEX_STATES,
  emptyLifecycleSummaryCounts,
  lifecycleEntryKey,
} from "./types";
export type {
  ContentLifecycleState,
  ImprovementReason,
  RemediationRequirement,
  ContentLifecycleKind,
  ContentLifecycleEntry,
  ContentLifecycleStoreFile,
  CanPromoteResult,
  PromoteResult,
  LifecycleSummaryCounts,
} from "./types";

export { REMEDIATION_BY_REASON, remediationForReasons } from "./remediation";

export {
  lifecycleFromLegacyClass,
  improvementReasonsFromGuideGates,
  improvementReasonsFromCompareGates,
  resolveLifecycleState,
} from "./classify";

export {
  loadContentLifecycleStore,
  getLifecycleEntry,
  getLifecycleOverrideState,
  isLifecyclePromotedIndexable,
  upsertLifecycleEntry,
  removeLifecycleEntry,
  resetContentLifecycleCache,
  getContentLifecycleStoreSnapshot,
  replaceContentLifecycleStoreMemory,
} from "./store";

export {
  canPromoteToIndexable,
  promoteToIndexable,
  guidePassesPromotionGates,
  comparisonPassesPromotionGates,
  effectiveSeoIndexable,
} from "./promote";
export type { PromoteablePage } from "./promote";

export {
  detectLifecycleOrphans,
  demoteLifecycleOrphan,
  runLifecycleOrphanReconcile,
  LIFECYCLE_ORPHAN_VERSION,
} from "./lifecycle-orphans";
export type {
  LifecycleOrphanFinding,
  LifecycleOrphanReason,
  LifecycleOrphanReport,
} from "./lifecycle-orphans";

/**
 * Node persistence helpers — import from
 * `@/services/seo/content-lifecycle/store-write` in scripts/CLI only.
 * Not re-exported here to keep client bundles free of `node:fs`.
 */
