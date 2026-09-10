/**
 * FR-007 / FR-016 reconciliation inventory (updated after remediation).
 *
 * FR-007 — 66 guides previously classified INDEXABLE while failing
 * editorial_completeness solely for missing-hero-visual (MISSING_VISUAL).
 *
 * Classification: MISSING_VISUAL
 * Remediation applied:
 * - editorial_completeness severity → hard
 * - guidePassesIndexGates + isGuideSearchIndexWorthy require heroVisual
 * - Pages remain catalogue-routable; leave INDEXABLE / sitemap until heroes added
 * - Seed seo.indexable left true (publication windows not permanently blocked)
 *
 * FR-016 — 57 lifecycle INDEXABLE/READY orphans demoted to IMPROVE
 * via `npm run seo:lifecycle-orphans -- --apply --persist`
 * Example: comparison:intercom-vs-zendesk → IMPROVE (thin mesh / not promotion-ready).
 *
 * Prevention:
 * - canPromoteToIndexable requires public route resolution + index gates (hero/relationship)
 * - Sitemap reconcile emits lifecycle_orphan discrepancies
 * - `npm run seo:lifecycle-orphans` wired in package.json
 */
export const FR007_FR016_CLASSIFICATION = {
  missingVisualGuideCount: 66,
  lifecycleOrphansDemoted: 57,
  classes: [
    "MISSING_VISUAL",
    "BAD_LIFECYCLE_STATE",
    "LIFECYCLE_ORPHAN",
  ] as const,
  remediatedAt: "2026-09-08T15:44:18.801Z",
} as const;
