# Current content publishing architecture

Audit date: 2026-08-23. This document describes the **existing** SoftwareGlimpse content and publishing stack before the scheduled-preview extension work.

## Summary

SoftwareGlimpse is a **Next.js** application with **file-based seeds** (`src/data/seed/*`) as the live catalogue authority. Publishing orchestration (versions, schedules, change events) lives in `src/data/publishing/` and is **additive** — it does not replace seeds.

A central publication gate already existed in `src/domain/publishing.ts`. The gap was **context-aware visibility** (dev preview of future scheduled content across all discovery surfaces) rather than absence of lifecycle support.

## Where content lives

| Content type | Primary source | Repository / builder |
| --- | --- | --- |
| Software / products | `src/data/seed/software.ts` + onboarding candidates | `src/data/repositories/catalog.ts` |
| Categories | `src/data/seed/categories.ts` | `catalog.ts`, `categories.ts` |
| Comparisons | `src/data/seed/comparisons.ts` | `catalog.ts` |
| Alternatives | `src/data/seed/alternatives.ts` | `catalog.ts` |
| Best pages | `src/data/seed/best.ts` | `catalog.ts` |
| Guides (educational) | `src/data/seed/guides.ts` | `guides-educational.ts` |
| Product guides | Generated packs | `src/services/product-guides/build.ts` |
| Resources | `src/data/seed/resources.ts` | `catalog.ts` |
| Capabilities / use cases / industries | dimension seeds | `catalog.ts` |
| Tools | `src/data/config/tools/registry.ts` | static registry |
| Feature / requirement detail | builders | `src/services/feature-detail`, `requirement-detail` |
| Reviews / pricing prose | editorial JSON + builders | `src/services/software-review`, `src/services/pricing` |

## Publication metadata model (pre-extension)

Shared schema: `ContentMetadata` in `src/domain/schemas/content-metadata.ts`:

```ts
{
  status: PublishStatus;      // idea → … → scheduled → published → …
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  scheduledAt?: string;       // ISO UTC — future schedule gate
  reviewedAt?: string;
  nextReviewAt?: string;
  author?: string;
  reviewer?: string;
  researchStatus?: …;
  seoStatus?: …;
}
```

SEO indexability is **explicit** on each entity (`seo.indexable`) and combined with publish gates in `isEntityIndexable()` (`src/domain/quality-gates.ts`).

### PublishStatus values

`idea`, `researching`, `draft`, `review`, `approved`, `scheduled`, `published`, `refresh-needed`, `refreshing`, `rejected`, `archived`.

Public visibility (listings, links, sitemap) requires `published` / `refresh-*` statuses **and** `scheduledAt <= now` when present.

## Central gates (existing)

| Function | Location | Role |
| --- | --- | --- |
| `isPubliclyAvailable` | `src/domain/publishing.ts` | Route/listing gate for live status |
| `getPublicationState` | `src/domain/publishing.ts` | Snapshot: listings, links, indexable |
| `isEntityIndexable` | `src/domain/quality-gates.ts` | SEO + quality gate |
| `filterVisibleEntries` | `src/services/publishing/resolver.ts` | Registry filtering |
| `filterSitemapEntries` | `src/services/publishing/resolver.ts` | Sitemap helper |

## Publishing orchestration (existing)

Documented in `docs/softwareglimpse/publishing-engine.md`.

- **Registry**: `buildContentRegistry()` enumerates catalogue entities as `ContentRegistryEntry`
- **Versions**: `src/data/publishing/versions/{contentId}/{n}.json`
- **Schedules**: `src/data/publishing/schedules/{contentId}.json`
- **Runners**: `runPublishDue()` promotes due scheduled content
- **Revalidation**: `src/services/publishing/revalidation.ts` tag-based ISR hooks
- **CLI**: `npm run publishing -- …` / `content:status`, `content:calendar`, `content:publish`

Lifecycle transitions: `src/domain/lifecycle.ts` + `src/services/publishing/transitions.ts`.

## Data access pattern (existing)

Repositories expose:

```ts
getSoftware(options?: { includeUnpublished?: boolean; now?: Date })
getAllSoftwareUnfiltered()
```

`filterPublic()` used `isPubliclyAvailable()` — **production-only** semantics. `includeUnpublished: true` bypassed all gates (draft preview via Next.js `draftMode()` on select pages).

## Discovery surfaces

| Surface | Implementation | Pre-extension gate |
| --- | --- | --- |
| Direct routes | Page loaders call `get*BySlug()` | Hidden when filtered out → `notFound()` |
| Category / catalogue | `getSoftware()`, `getCategories()` | `filterPublic` |
| Search | `src/services/search/build-index.ts` | Built from public getters |
| Sitemap | `src/seo/sitemap.ts` → `getSitemapEntries()` | `isEntityIndexable` + public getters |
| Internal links | `src/services/internal-linking/*` | Public getters |
| Best pages | `src/services/best-page/*` | Public software only |
| `generateStaticParams` | Per-route | Public slugs at build time |
| Preview API | `/api/preview?secret=…` | Next.js `draftMode()` — draft/review/scheduled eligible |

## Search index

- Build artifact: `src/data/generated/search-index.json` (production build via `npm run search:build-index`)
- Runtime: `getSearchRuntime()` + `runSearch()` in `src/services/search/query.ts`

Pre-extension: index always reflected **public** catalogue only.

## Next.js rendering & deploy

- **Hosting**: standard Next.js (`next build` / `next start` or Vercel-compatible)
- **Static params**: generated from public catalogue at build time
- **Scheduled go-live without redeploy**: `runPublishDue()` updates seed metadata + `requestRevalidation()` — requires runtime runner (cron/CI) or manual `content:publish`
- **Caching**: Next.js `revalidateTag` via publishing revalidation map

## Workflow / agents (existing)

- **Product onboarding**: `src/services/onboarding/orchestrator.ts` — ends at **READY FOR CONTENT PIPELINE**, does **not** auto-publish
- **Workflow orchestration**: `src/services/workflow-orchestration/` — editorial approval, no auto-publish
- **Content agents**: `src/services/content-agents/` — generation with draft defaults
- **Content quality**: `src/services/content-quality/` — audits use `includeUnpublished: true` internally

## Gaps identified (addressed by extension)

1. No `PublicationContext` API — dev always matched production visibility
2. No `PREVIEW_MODE` / `PREVIEW_SITE_AT` / `DEV_SHOW_DRAFTS`
3. Scheduled content invisible on localhost across catalogue, search, links
4. No dev-only scheduled badges
5. No dependency validation for schedule ordering
6. No generated scheduled-content reports / calendar under `docs/publishing/`
7. No CI safety test for future scheduled leakage in PUBLIC context

## Extension approach (not a second system)

Extend:

- `src/domain/publication-context.ts` — context + `isContentVisible`
- Repository `filterByPublicationVisibility` — replaces direct `isPubliclyAvailable` in list queries
- Search index build — respects context in development
- Publishing CLI agents + reports under `docs/publishing/`

Do **not** duplicate lifecycle enums or parallel CMS.
