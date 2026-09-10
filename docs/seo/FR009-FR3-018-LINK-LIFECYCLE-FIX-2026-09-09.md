# FR-009 / FR3-018 — Link lifecycle fix (2026-09-09)

## Root cause

Links **were** persisted (`guide_overlay` + `link-injections.json`) but Review KPIs watched a **semantic-only** knowledge graph and broken render/orphan paths:

1. **`GRAPH_IGNORES_OVERLAY`** — `analyzeKnowledgeGraph` never called `attachContextualNavigationalEdges`.
2. **`OVERLAY_NOT_CONSUMED`** — `collectCrmOutboundEdges` built guide plans from seed guides (no overlay merge); hub discovery skipped IMPROVE children.
3. **`NOT_RENDERED`** — `buildInjectionOnlyLinkPlan` missing for tools/research/industries; guide pages built Related articles from selectLinks that dropped IMPROVE overlay targets (score 72 vs supporting 88).
4. **`REPORTING_BUG`** — orphan detector only scans indexable sitemap URLs, so IMPROVE sample always looked 80/80 orphan.

## Fix implemented

| Change | File |
| --- | --- |
| `buildInjectionOnlyLinkPlan` | `builders.ts` |
| Merge guide overlays + IMPROVE hub discovery + tool/research plans | `outbound-graph.ts` |
| Dual-write guide→guide overlays into injections | `improve-linking/apply.ts` |
| Wire `attachContextualNavigationalEdges` | `knowledge-graph/analyze.ts` |
| IMPROVE inbound uses outbound-graph counts | `improve-inbound.ts` |
| Related articles from merged `relatedGuideSlugs` | `guides/[slug]/page.tsx` |
| Explicit related score 94–96 + includeUnpublished | `builders.ts` |
| Lifecycle verify (static + live + graph) | `scripts/seo/verify-fr009-link-lifecycle.ts` |

**Did not** invent fake edge counters — contextual edges map 1:1 from real outbound link plans (same source as HTML).

## Outcomes

| Metric | Before | After |
| --- | ---: | ---: |
| Links expected (growth-exec) | 86 | 86 |
| Sample verified | — | 24 |
| Static HTML hrefs | — | **24/24** |
| Live HTML hrefs | — | **24/24** |
| Graph edges in sample | — | **24/24** |
| Semantic edges | 26853 | 26853 |
| Total edges | 26853 | **71549** |
| Contextual edges | 0 | **44696** |
| IMPROVE orphan sample | 80/80 | **15/80** |
| Indexable orphans | — | **0** |
| Growth targets orphan | — | **0/21** |
| Lane A orphans | 0 | **0** |
| READY orphans | 0 | **0** |

Failure classes on sample: **`{ OK: 24 }`**

Artifacts: `data/seo/batches/fr009-lifecycle-fix-2026-09-09/` · `npm run seo:verify-link-lifecycle`
