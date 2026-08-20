# Performance baseline and actions

**Date:** 2026-08-15  
**Stack:** Next.js 16.3.0 (App Router, Turbopack), React 19  
**Scope:** Core Web Vitals, JS payload, images/video, fonts, third-party, SSR/hydration, data loading  
**Lab host:** `next start` on localhost after `next build --experimental-build-mode compile|generate`  
**Field truth:** Lab numbers are **not** CrUX/RUM. Treat Lighthouse alone the same way — use both only as signals.

Targets (good CWV):

| Metric | Target |
| --- | --- |
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| TTFB (lab warn) | ≤ 800ms |
| FCP (lab warn) | ≤ 1.8s |

---

## 1. Executive summary

### Before (audit snapshot)

| Area | Baseline finding |
| --- | --- |
| Media | `public/` ≈ **731MB**; many hero/screenshot PNGs **1.5–4.4MB** on disk |
| Tools | Interactive CRM tools statically imported on their routes (heavy apps in the same graph as page chrome) |
| Fonts | DM Sans via `next/font` — weights later tightened to 400/500/600/700 + `display: swap` |
| Video | Already thumbnail-first / click-to-play / consent-gated (`OfficialProductVideo`) — **keep** |
| Analytics | Consent sink only; **no** GA/GTM SDK until configured |
| Exports | `jspdf` / `xlsx` already dynamic-imported on user action |
| CWV risk | Oversized LCP sources; large HTML DOMs on industry/feature/requirement; tool JS co-located; newsletter popup on every page |
| CI | No performance workflow |

### After (this pass)

| Area | Change |
| --- | --- |
| Images | `next/image` AVIF/WebP + tuned `deviceSizes`; optimizer script + WebP siblings; `public/` ≈ **723MB** |
| Tools | All CRM decision tools load via `dynamic()` (`dynamic-tool-apps.tsx`); route `tools/loading.tsx` |
| Evidence | Below-fold `DynamicEvidenceExplorer` code-split |
| Site chrome | `NewsletterPopup` dynamically imported (`ssr: false`) |
| Fonts | Explicit weights, swap, `adjustFontFallback` |
| CLS | Guide figures always reserve aspect; logo `width`/`height` + lazy decode |
| INP / FS boundary | Use-case workflow compare pair analyses **precomputed on server**; client no longer imports research `node:fs` |
| Budgets / CI | `src/performance/budgets.ts`, `npm run perf:check`, `npm run perf:lab`, GitHub workflow `perf-check.yml` |
| Docs / artifacts | This file + `_lab-snapshot-last-run.json` + `_image-optimize-last-run.tsv` |

### Remaining hotspots (P0/P1)

1. **HTML weight / DOM size** on Industry, Feature, Requirement hubs (lab HTML **700–750KB**, ~3.5–4k open tags) — primary INP/hydration risk on content families.  
2. **First-load JS** still ~**1.1–1.6MB** uncompressed linked scripts on representative routes (shared vendor + video + chrome). Above soft budgets for content.  
3. **Hero PNG sources** still often **>900KB** on disk; delivery relies on `next/image` AVIF/WebP — migrate paths to WebP siblings or recompress with `pngquant`/`oxipng`.  
4. **Export libs** (`jspdf` ~409KB, `xlsx` ~402KB) appear as separate chunks (good) but `xlsx` markers still show in some tool/shared chunks — audit remaining static edges.  
5. **Cold comparison SSR** first hit lab TTFB ~**3s**; warm ~**250ms** — investigate comparison page data fan-out / caching.  
6. Full `next build` **typecheck** fails on pre-existing TS errors (audience/industry seed data); compile+generate succeeds. Fix TS to restore default CI build path.

---

## 2. Page types measured

Representative routes (`src/performance/budgets.ts`):

| Label | Path | Family |
| --- | --- | --- |
| Homepage | `/` | hub |
| CRM hub | `/categories/crm/` | hub |
| Best CRM | `/best/crm-software/` | content |
| Product | `/software/pipedrive/` | product |
| Comparison | `/compare/hubspot-vs-pipedrive/` | comparison |
| Industry | `/industries/financial-services/` | content |
| Use Case | `/use-cases/pipeline-management/` | content |
| Capability | `/capabilities/pipeline-management/` | content |
| Requirement | `/requirements/separate-sales-processes/` | content |
| Feature | `/features/workflow-automation/` | content |
| Guide | `/guides/what-is-crm/` | content |
| Finder | `/tools/crm-finder/` | tool |
| Cost Calculator | `/tools/crm-cost-calculator/` | tool |
| Requirements Builder | `/tools/crm-requirements-builder/` | tool |
| Vendor Scorecard | `/tools/crm-vendor-scorecard/` | tool |
| TCO | `/tools/crm-tco-calculator/` | tool |
| Implementation Planner | `/tools/crm-implementation-planner/` | tool |
| Migration Planner | `/tools/crm-migration-planner/` | tool |

---

## 3. Lab baseline (after fixes)

Captured: `docs/performance/_lab-snapshot-last-run.json` via `BASE_URL=http://127.0.0.1:3010 npm run perf:lab`.

### 3.1 TTFB / HTML / DOM proxy

| Page | Status | TTFB (lab) | HTML | ~open tags |
| --- | --- | --- | --- | --- |
| Homepage | 200 | 56ms → 5ms warm | 263KB | 983 |
| CRM hub | 200 | 28ms | 600KB | 2462 |
| Best CRM | 200 | 14ms | 510KB | 1764 |
| Product | 200 | 18ms | 452KB | 859 |
| Comparison | 200 | **2962ms cold / ~257ms warm** | 247KB | 810 |
| Industry | 200 | 16ms | **730KB** | **3626** |
| Use Case | 200 | 11ms | 398KB | 1784 |
| Capability | 200 | 13ms | 477KB | 2579 |
| Requirement | 200 | 16ms | **752KB** | **3867** |
| Feature | 200 | 18ms | **708KB** | **3916** |
| Guide | 200 | 11ms | 244KB | 1018 |
| Finder | 200 | 10ms | 261KB | 751 |
| Cost Calculator | 200 | 8ms | 196KB | 303 |
| Requirements Builder | 200 | 6ms | 65KB | 232 |
| Vendor Scorecard | 200 | 13ms | 358KB | 309 |
| TCO | 200 | 10ms | 214KB | 342 |
| Implementation Planner | 200 | 7ms | 102KB | 344 |
| Migration Planner | 200 | 7ms | 110KB | 360 |

Notes:

- Local prod TTFB is not CDN/edge TTFB.  
- Comparison cold spike indicates heavy first compute/cache fill — **CWV LCP risk in field** if origin is cold.  
- Large HTML pages will dominate parse/hydrate cost even when TTFB is tiny.

### 3.2 Transfer samples (uncompressed linked assets)

| Route | Linked JS | CSS | Script tags |
| --- | --- | --- | --- |
| `/` | ~1093KB | ~152KB | 11 |
| `/guides/what-is-crm/` | ~1561KB | ~152KB | 14 |
| `/features/workflow-automation/` | ~1590KB | ~152KB | 15 |
| `/tools/crm-finder/` | ~1095KB | ~152KB | 12 |
| `/tools/crm-migration-planner/` | ~1581KB | ~152KB | 16 |
| `/compare/hubspot-vs-pipedrive/` | ~1136KB | ~152KB | 13 |

Brotli/gzip on CDN will shrink wire size; budgets still use uncompressed lab figures as regression signals.

### 3.3 Largest client chunks (build artifacts)

| Size | Markers (string scan) |
| --- | --- |
| ~478KB | CrmFinder + VendorScorecard + xlsx |
| ~418KB | OfficialProductVideo graph |
| ~409KB | jspdf (export — on-demand) |
| ~402KB | xlsx (export — on-demand) |
| ~247KB | RequirementsBuilder |
| ~130KB | MigrationPlanner + xlsx |

Tool apps are split from ordinary article route entry, but **shared vendor/video/chrome** still dominates content pages.

---

## 4. LCP

### Likely LCP elements by family

| Family | Typical LCP | Action taken |
| --- | --- | --- |
| Guides / features / capabilities / requirements | Hero `next/image` (`priority`) | Aspect reserved; image formats AVIF/WebP; source clamp script |
| Product hub | Title / logo / first media | Logo dimensions reserved; video not LCP (thumbnail, no autoplay) |
| Hub / homepage | H1 / decision panel / cards | No blind preload spray |
| Tools | SSR H1 (`FinderPageHero` title) then tool island | Dynamic tool import so LCP text can paint before tool JS |

### LCP optimizations implemented

- `next.config.ts`: `formats: ['image/avif','image/webp']`, tighter `deviceSizes`, long `minimumCacheTTL`.  
- Do **not** preload every hero/font/image — only font preload via `next/font` (`preload: true` on DM Sans).  
- Cache-Control for `/og/*` and `/brands/*`.  
- Guide `GuideFigure` always uses aspect box + `fill` to avoid layout jump while decoding.

### Remaining LCP work

- Recompress / replace remaining >900KB hero PNG sources (see `perf:check` warnings).  
- Prefer WebP siblings already generated beside many assets when editorial paths can change.  
- Cache/warm comparison SSR path for origin TTFB.

---

## 5. INP

### Identified risks

| Risk | Where | Mitigation |
| --- | --- | --- |
| Large hydration trees | Feature / requirement / industry HTML | Defer Evidence Explorer; future: paginate matrices, reduce SSR card grids |
| Interactive filters | Evidence Explorer, scorecards, calculators | Code-split explorers/tools; keep tools interactive (not server-only) |
| Pair switching with Node I/O | Use-case workflow compare | **Fixed:** precompute `pairAnalyses` server-side; client O(1) lookup |
| Huge tables | Scorecard / comparison matrices | Keep semantic `<table>`; cap product columns (2–5); no virtualization yet (not needed at current size) |
| Sync export | PDF/XLSX | Already `await import()` on export action |

### Client islands reduced / deferred

- CRM Finder, TCO, Implementation, Migration, Scorecard, Requirements Builder, Cost Calculator → `Dynamic*` wrappers.  
- Newsletter popup → dynamic, `ssr: false`.  
- Evidence Explorer → `DynamicEvidenceExplorer`.

---

## 6. CLS

| Element | Status |
| --- | --- |
| Guide / capability / feature heroes | Aspect + `next/image` dimensions |
| Product logos | Fixed `width`/`height`, lazy + async decode |
| Scorecard logos | Explicit 20×20 |
| Video | `aspect-video` reserved; iframe only after click + consent |
| Charts | CSS/HTML bars (no chart library CLS) |
| Ads | None |

---

## 7. Next.js / framework

- Prefer **Server Components** for page shells, metadata, data assembly.  
- Keep interactive tools as **client islands** with dynamic import (do not convert calculators to server-only).  
- Research data is mostly filesystem seed/enrichment at build/request — comparison cold path needs caching/revalidation review (no blanket `revalidate` yet; research pages are largely static generation).  
- Streaming: tool `loading.tsx` provides route-level pending UI; avoid streaming that delays LCP text.  
- `serverExternalPackages: ['jspdf','xlsx']` + `optimizePackageImports: ['zod']`.

---

## 8. Video

`OfficialProductVideo` remains the standard:

- Thumbnail first  
- Iframe on click  
- No autoplay  
- Marketing consent gate  
- No YouTube IFrame API sitewide (`perf:check` enforces)

---

## 9. Images

### Inventory (before → after)

| Metric | Before | After |
| --- | --- | --- |
| `public/` size | ~731MB | ~723MB |
| Largest sources | ActiveCampaign screenshots 2.5–4.4MB | Edge-clamped + WebP siblings (~70–190KB) |
| Delivery | PNG-heavy | Optimizer serves AVIF/WebP from sources |

### Tooling

```bash
npm run perf:optimize-images -- --min-bytes=900000 --limit=50 --max-edge=1600
```

Script keeps original when `sips` would enlarge PNG; writes WebP siblings; logs `docs/performance/_image-optimize-last-run.tsv`.

### Remaining

- Install `pngquant`/`oxipng` for true PNG byte reduction.  
- Point high-traffic heroes at `.webp` when editorial OK.  
- Avoid shipping 4K screenshots for small UI thumbs (content/editorial process).

---

## 10. Fonts

| Setting | Value |
| --- | --- |
| Family | DM Sans (`next/font/google`) |
| Subset | `latin` |
| Weights | 400, 500, 600, 700 (no unused axis dump) |
| Display | `swap` |
| Fallback | system stack + `adjustFontFallback: true` |
| Preload | single family preload only |

FOIT avoided via swap; residual FOUT mitigated by size-adjusted fallback.

---

## 11. Third-party inventory

| Script / vendor | Blocking? | Notes |
| --- | --- | --- |
| Analytics sink | No | Consent-gated; no SDK until configured |
| Cookie / consent UI | Low | First-party |
| YouTube / Vimeo | No until click | Privacy-enhanced embed URLs |
| Affiliate outbound | No third-party SDK | First-party anchors |
| Google Fonts network | No | Self-hosted via `next/font` |
| Chart CDNs | None | In-house CSS charts |
| Hotjar / GTM / etc. | Absent | Keep out of critical path |

---

## 12. Tool bundles

| Tool | Load strategy |
| --- | --- |
| CRM Finder | `DynamicCrmFinderApp` |
| TCO | `DynamicCrmTcoCalculatorApp` |
| Implementation Planner | `DynamicCrmImplementationPlannerApp` |
| Migration Planner | `DynamicCrmMigrationPlannerApp` |
| Vendor Scorecard | `DynamicCrmVendorScorecardApp` |
| Requirements Builder | `DynamicCrmRequirementsBuilderApp` |
| Cost Calculator | `DynamicCrmCostCalculatorApp` |

`perf:check` fails if tool `page.tsx` statically imports heavy app modules without `dynamic-tool-apps`.

Article pages must not import finder/migration apps — verified by import discipline + dynamic boundaries.

---

## 13. Tables / matrices

- Scorecard / feature matrices remain semantic tables with sticky headers.  
- Product columns intentionally capped in product UX (2–5).  
- Virtualization **not** added — DOM size of matrices is secondary to whole-page HTML weight on hubs.  
- Revisit virtualization only if field INP shows matrix interaction as the long-task source.

---

## 14. Performance budgets (by family)

From `src/performance/budgets.ts`:

| Family | JS warn | JS max | Hero source warn | Notes |
| --- | --- | --- | --- | --- |
| content | 180KB | 280KB | 900KB | Guides, features, requirements, use cases, capabilities |
| hub | 200KB | 320KB | 900KB | Home, category hubs |
| product | 220KB | 360KB | 700KB | Software review |
| comparison | 200KB | 340KB | 700KB | A vs B |
| tool | 350KB | 550KB | 500KB | Interactive decision tools |

Current lab linked-JS exceeds soft budgets — budgets are **aspirational gates** for regressions as shared chrome shrinks; `perf:check` currently warns on hero sources and large chunks, errors on antipatterns.

---

## 15. Testing / CI

| Check | Command | Behavior |
| --- | --- | --- |
| Budgets + antipatterns | `npm run perf:check` | Errors on tool static imports / YouTube API; warns on heroes / large chunks |
| Unit | `vitest run src/performance/budgets.test.ts` | CWV targets + route coverage |
| Lab snapshot | `npm run perf:lab` | TTFB/HTML/DOM proxy JSON |
| Image optimize | `npm run perf:optimize-images` | Offline media pass |
| CI | `.github/workflows/perf-check.yml` | Runs `perf:check` + budget unit tests on PR/push |

**Avoided:** brittle exact Lighthouse score gating.

---

## 16. Issues → fixes → remaining

| ID | Issue | Fix | Status |
| --- | --- | --- | --- |
| P0-1 | Tool JS on shared graphs | Dynamic tool apps + loading UI | **Fixed** |
| P0-2 | Massive PNG sources | Image config + optimize script + WebP siblings | **Partial** |
| P0-3 | Client `node:fs` via workflow compare | Server-precomputed pair analyses | **Fixed** |
| P1-1 | Evidence Explorer on critical path | Dynamic below-fold import | **Fixed** |
| P1-2 | Newsletter on every hydration | Dynamic `ssr: false` | **Fixed** |
| P1-3 | Font weight bloat / FOIT | Explicit weights + swap + fallback | **Fixed** |
| P1-4 | Guide figure CLS | Always reserve aspect | **Fixed** |
| P1-5 | No perf CI | `perf-check` workflow + scripts | **Fixed** |
| P2-1 | Huge hub HTML/DOM | Paginate/simplify card grids; defer non-critical sections | **Remaining** |
| P2-2 | Shared JS ~1MB+ | Further split video/chrome; audit lucide / shared islands | **Remaining** |
| P2-3 | Comparison cold TTFB | Cache comparison model build | **Remaining** |
| P2-4 | Hero PNG bytes | pngquant + path migration to WebP | **Remaining** |
| P2-5 | Full `next build` TS failures | Fix audience/industry seed types (pre-existing) | **Remaining** |

---

## 17. Before / after scorecard

| Signal | Before | After |
| --- | --- | --- |
| Tool route code-splitting | Static app imports | Dynamic islands |
| Evidence Explorer | Eager client import | Dynamic |
| Newsletter popup | Eager | Dynamic, no SSR |
| `public/` | ~731MB | ~723MB + WebP siblings |
| Image delivery formats | Default | AVIF/WebP preferred |
| Font strategy | Broader risk | 4 weights, swap, adjusted fallback |
| Video third-party | Click-to-play | Unchanged (already good) |
| Perf automation | None | `perf:check` / `perf:lab` / CI |
| Lab TTFB (warm, local) | n/a | Most routes &lt; 50ms; comparison warm ~250ms |
| Lab JS (linked, home) | n/a | ~1093KB uncompressed |
| CWV field | Unknown | Needs RUM/CrUX after deploy |

---

## 18. How to re-measure

```bash
# Soft CI
npm run perf:check

# Production compile (until TS seed errors are fixed, use experimental modes)
npx next build --experimental-build-mode compile
npx next build --experimental-build-mode generate
npx next start -p 3010

# Lab snapshot
BASE_URL=http://127.0.0.1:3010 npm run perf:lab

# Media
npm run perf:optimize-images -- --dry-run
```

Pair lab runs with Chrome UX Report / analytics INP once production traffic exists. Do not declare CWV “green” from Lighthouse-only or localhost TTFB alone.
