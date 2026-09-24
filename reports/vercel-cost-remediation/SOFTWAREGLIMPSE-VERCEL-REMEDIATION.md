# SoftwareGlimpse Vercel cost remediation

Local implementation of the 20-phase plan in `SOFTWAREGLIMPSE-VERCEL-FINAL-AUDIT.md`. Nothing was pushed or deployed.

Measured on 23 Sep 2026 against Next.js 16.3.0 (Turbopack), `npm run build` with `NODE_OPTIONS=--max-old-space-size=8192`.

## 1. Executive summary

Build CPU was the large cost. The production build dropped from **13,662 static pages / 14m 53s** to **4,211 static pages / 7m 14s** (reduction **9,451 pages, 69.2%**). Valuable public documents stay SSG: 315 software overviews, 593 indexable guides, 2,138 indexable canonical comparisons.

The pages that were actually dynamic (`/guides`, `/compare`, `/tools`, `/search`, `/company/contact`, `/compare/build`) are now static shells. Query state is read in the browser. Search results come from a cached `/api/search/query` route, not from RSC.

Reverse comparison aliases are no longer prerendered. 4,276 permanent redirects in `next.config` send them to the canonical pair. Software tab URLs (2,835 noindex documents) are no longer built; the nine tab paths 308 to `/software/{slug}/?tab=`.

Blob media rewrites are extension-scoped `afterFiles` plus the same rules as `fallback`, so unknown HTML slugs reach the App Router. Catalogue routes that know their slug universe set `dynamicParams = false`.

Public `draftMode()` reads are gone from software and guide documents. Preview lives at `/preview/software/[slug]` and `/preview/guides/[slug]`, behind `/api/preview`.

One audit FAIL remains, and it is intentional: `/newsletter/confirm` still awaits `searchParams` so a no-JS email link can confirm a token. Guide hero PNGs stay `unoptimized`; converting them is deferred. Turbopack file-trace warnings stayed at 90. Industry nest SSG was kept because those URLs are linked from public industry hubs.

## 2. Files changed

Routing and config:

- `next.config.ts` — reverse comparison redirects from generated JSON, software tab redirects, Blob media rewrites as `afterFiles` + `fallback`, `imageSizes` without 16, search API cache header
- `package.json` — `prebuild` also writes comparison redirects
- `scripts/vercel/write-comparison-redirects.ts`
- `config/comparison-reverse-redirects.json` — generated, 4,276 rules
- `src/services/comparison-redirects.ts`
- `src/lib/media/blob-rewrites.ts`
- `src/lib/media/public-media-src.ts`
- `scripts/audit-vercel-cost.ts`
- `src/app/robots.ts` — disallow `/preview/`

Static hubs and search:

- `src/app/(site)/guides/page.tsx`
- `src/app/(site)/compare/page.tsx`
- `src/app/(site)/tools/page.tsx`
- `src/app/(site)/search/page.tsx`
- `src/app/(site)/company/contact/page.tsx`
- `src/app/(site)/compare/build/page.tsx`
- `src/components/guides/hub/guides-latest-from-query.tsx`
- `src/components/comparison/hub/comparison-from-query.tsx`
- `src/components/comparison/compare-build-client.tsx`
- `src/components/tools/hub/tools-hub-view.tsx`
- `src/components/tools/hub/tools-hub-from-query.tsx`
- `src/components/search/search-from-query.tsx`
- `src/components/contact/contact-hub-from-query.tsx`
- `src/services/search/public-query.ts`
- `src/services/search/public-query-params.ts` — client-safe parser; the runner stays on the server
- `src/app/api/search/query/route.ts`

SSG gates and tabs:

- `src/app/(site)/compare/[slug]/page.tsx`
- `src/app/(site)/guides/[slug]/page.tsx`
- `src/app/(site)/software/[slug]/page.tsx`
- `src/app/(site)/software/[slug]/[tab]/page.tsx` — deleted
- `src/services/software-review/hub-tabs.ts`
- `src/components/software/hub/software-product-hub.tsx`
- `src/components/software/hub/software-product-hub-client.tsx`
- `src/services/search/build-index.ts`
- `src/services/comparison-page/decision-narrative.ts`
- `src/services/legacy-url-migration/mapping-agent/content-graph.ts` — legacy pricing intents still target `/software/{slug}/pricing/`, which the redirect layer sends to `?tab=pricing`
- `dynamicParams = false` on industry nests and on capabilities, use-cases, features, resources, requirements, and audiences

Deduped models and preview:

- `src/services/software-review/build-review-model.ts`
- `src/services/comparison-page/build-page-model.ts`
- `src/app/api/preview/route.ts`
- `src/app/(site)/preview/software/[slug]/page.tsx`
- `src/app/(site)/preview/guides/[slug]/page.tsx`

Media and traces:

- `src/components/guides/guide-visuals.tsx`
- `src/components/guides/hub/guide-illustrations.tsx`
- `src/app/api/analytics/affiliate-click/route.ts` — imports the click recorder directly so the route does not pull the ingest barrel
- `src/services/price-change-monitor/queue.ts` — candidate list marked `as const` (did not change the warning count)

Tests adjusted for the new tab URL and for dates that had passed by 23 Sep 2026:

- `src/services/software-review/software-review.test.ts`
- `src/services/seo/guides-index-worthiness/guides-index-worthiness.test.ts`

`prebuild` also rewrote `src/data/generated/search-index.json`. Quick links now use in-page tab URLs, so that file should stay with this change.

## 3. Rendering architecture before and after

Before, awaited `searchParams` during prerender set `revalidate = 0` and `Cache-Control: private, no-cache, no-store` on `/guides`, `/compare`, `/tools`, `/search`, `/company/contact`, and `/compare/build`. `/go` is still `force-dynamic` on purpose. `/newsletter/confirm` still reads the token on the server.

After, those hubs are static (`○` in the route table). A query string does not change `generateMetadata`. The client reads the query inside `Suspense`. Confirmed on `next start`:

| URL | Document | RSC (`RSC: 1`, followed) |
| --- | --- | --- |
| `/guides/?category=crm` | `200`, `s-maxage=31536000` | `200`, `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`, `s-maxage=31536000` |
| `/compare/?category=crm` | same | same pattern |
| `/tools/?category=crm` | same | same pattern |
| `/search/?q=pipedrive` | same | same pattern |
| `/company/contact/?reason=correction` | same | same pattern |

Canonicals on those responses stay on the unscoped path (`/guides/`, `/compare/`, `/tools/`, `/search/`, `/company/contact/`). Search remains `noindex, follow`.

## 4. Dynamic hubs fixed

`/guides`, `/compare`, and `/tools` no longer await `searchParams`. Filter data is passed from the static shell. The client applies `category`, `topic`, and `q`.

Hydrated Chrome DOM:

- `/guides/?category=crm` — category chip `CRM` is `aria-pressed=true`, topics stay on `All topics`
- `/tools/?category=crm` — heading becomes “Find the right CRM…” and the CRM tool set is shown; canonical stays `/tools/`

`/compare/?category=crm` is the same static shell pattern. The comparison grid filters from the query in the client component.

## 5. Search architecture

`/api/search/suggest` is autocomplete (max 8). It is not the results contract.

`GET /api/search/query` calls the same `runSearch` bounds the old RSC page used: query max 80 characters, 48 results, group limit 6, then the type filter. Over-long queries return 400.

Observed:

- `/api/search/query/?q=pipedrive` → `200`, `Cache-Control: public, max-age=3600, stale-while-revalidate=86400, s-maxage=3600`, 43 hits (1 software, 36 comparisons, 6 guides)
- A 90-character query → `400` with the same public cache header (the `next.config` header on `/api/search/:path*` sets that value for the path)

The search page is a static shell. `SearchFromQuery` fetches the API. Hydrated `/search/?q=pipedrive` showed Pipedrive as the top software hit plus comparison results. Canonical stays `/search/`. Robots stay `noindex, follow`. There is no per-query ISR entry and no search execution in the page RSC.

## 6. Comparison redirect architecture

Canonical order is unchanged: lexicographic pair slug from `src/domain/comparison-slug.ts`.

`generateStaticParams` emits a comparison only when `isEntityIndexable({ kind: "comparison" })` is true and the stored slug is already canonical. That is the sitemap gate. Result: **2,138** SSG comparisons (was 7,888, which included the reverse of each pair).

`next.config` `redirects()` loads `config/comparison-reverse-redirects.json`, written in `prebuild` because `next.config` cannot import the `@/` catalogue. Each indexable canonical pair gets both slash variants. **4,276** reverse rules. Non-indexable pairs are not generated and their reverses are not redirected to a page that 404s.

The in-page `permanentRedirect` remains as a defense. With `dynamicParams = false` it does not run for unknown slugs; the config redirect does.

Local production:

- `/compare/hubspot-vs-pipedrive/` → `200`, canonical that URL, 0 redirects
- `/compare/pipedrive-vs-hubspot/` → `308` to `/compare/hubspot-vs-pipedrive/`, then `200`, one redirect, no loop

Next printed a warning: 5,058 custom redirects (4,276 reverse + 18 tab + existing legacy). The build completed and wrote the routes manifest. These are routing-config redirects, not a function per URL.

`/compare/build/?a=&b=` is a static noindex page. The client canonicalizes the pair and `router.replace`s to `/compare/{canonical}/` when that comparison is published. Hydrated `?a=hubspot&b=pipedrive` produced the HubSpot vs Pipedrive document (title and canonical of the comparison page). Missing or unknown products still go to `/compare/#comparison-builder`.

## 7. Blob rewrite architecture

Returning a rewrite array is `afterFiles`, which runs before dynamic routes. A catch-all `/:path*` on `/guides` or `/software` would steal HTML before the App Router, and a fallback catch-all would still not run when the path matches `[slug]` (`matchesPage`).

Media rewrites are therefore one rule per folder, depth, and extension (`png`, `webp`, `avif`, `jpg`, `jpeg`, `gif`, `svg`, `mp4`, `webm`), for `guides`, `software`, `capabilities`, `use-cases`, `vendor-ui`, `industries`, `features`, `resources`, `requirements`, and `for`. The same rules are `afterFiles` (so `/guides/file.png` beats `/guides/[slug]`) and `fallback` (so nested files no route claims can still reach Blob).

They are attached only when `BLOB_PUBLIC_HOST` is set and (`VERCEL=1` or `BLOB_MEDIA_REWRITES=1`). A local build reported `rewrites: 1` (the sitemap rewrite) because this machine is not `VERCEL=1`. On Vercel the media rules are included.

`dynamicParams = false` on software, guides, comparisons, and the other catalogue routes. An unknown slug matches the route and 404s in the app; fallback does not replace that 404.

Local `next start`:

- `/software/this-product-does-not-exist-zz/` → `404` HTML (`<!DOCTYPE html>`), not Blob XML
- `/guides/this-guide-does-not-exist-zz/` → `404` HTML
- `/guides/what-is-crm/` → `200` HTML
- `/software/pipedrive/` → `200` HTML
- `/guides/what-is-crm-hero.png` → `200` `image/png` from `public/`
- `/software/pipedrive/diagrams/pipeline-management.png` → `200` `image/png` from `public/`
- The same three paths on the public Blob host → `200` image bytes

## 8. Software tab architecture

Approach A. One SSG document per product. All tab panels are built into that document. `SoftwareHubFromQuery` reads `?tab=` with `useSearchParams` and shows one panel. The static fallback is overview.

`/software/[slug]/[tab]` is deleted, so those 2,835 pages are not in `generateStaticParams`.

`next.config` has 18 redirects (9 tabs × both slash forms):

`/software/:slug/pricing/` → `308` `/software/:slug/?tab=pricing`

Internal links use `softwareHubPath`, which returns `/software/{slug}/?tab={tab}` for every tab except overview. The Pipedrive HTML contained `?tab=` links and no `/software/pipedrive/pricing/` hrefs. Hydrated `/software/pipedrive/?tab=pricing` showed the plans and pricing panel after the tab list. The legacy URL mapper still records `/software/{slug}/pricing/` so old WordPress-style targets hit the 308.

`/software/pipedrive/` is `200`, `s-maxage=31536000`, canonical `/software/pipedrive/`, robots `index, follow`, JSON-LD present.

## 9. Guide SSG set

`generateStaticParams` uses `isEntityIndexable({ kind: "guide" })`, the same gate as the sitemap. **593** guides (was 1,460). `dynamicParams = false`, so a guide that fails the gate 404s instead of being built or rendered on demand. Unpublished content is not exposed on the public route. Preview can still load unpublished guides.

## 10. Comparison SSG set

After reverse aliases were removed, the same indexability gate keeps **2,138** canonical comparisons. That matches the sitemap count from the audit. Pair order was not changed. Non-indexable combinations are not generated.

## 11. Industry noindex handling

Industry × capability (150), industry × use-case (126), industry × feature (2), and industry × requirement (2) are still SSG.

They stay because public industry hubs, product media, and related documents link to them as full pages. Building that finite set is cheaper than rendering it on each request, and it does not depend on Blob fallback. They remain hardcoded `noindex` and are not in the sitemap (industry sitemap is the 25 hubs).

`dynamicParams = false` was added so an unknown nest slug 404s in Next instead of running the page model or falling through to Blob.

The nest page counts did not go down. That is a deliberate keep, not an unfinished deletion.

## 12. Software model deduplication

`buildSoftwareReviewModel`, `buildComparisonPageModel`, `loadComparisonWithEnrichment`, and guide `resolveGuide` are wrapped in React `cache()`. `generateMetadata` and the page in the same render share one construction. The cache is per request / per build worker, not a store that survives a deploy. Model contents were not changed.

## 13. Preview architecture

Public `/software/[slug]` and `/guides/[slug]` do not call `draftMode`. They always resolve published content.

`GET /api/preview?secret=&slug=` checks `PREVIEW_SECRET`, enables draft mode, and redirects `/software/...` to `/preview/software/...` and `/guides/...` to `/preview/guides/...`. `/api/preview/disable` is unchanged.

Preview routes are `force-dynamic`, `noindex, nofollow`, not in the sitemap, and `robots.txt` disallows `/preview/`. They require draft mode; otherwise `notFound()`. They pass `includeUnpublished` / `preview: true`. The software hub shows “Preview mode is on” and an exit link.

Local check with a throwaway `PREVIEW_SECRET` on `next start` (not written into `.env`):

- Valid secret + `/software/pipedrive/` → `200` on `/preview/software/pipedrive/`, `private, no-cache, no-store`, robots `noindex, nofollow`, preview banner present
- Valid secret + `/guides/what-is-crm/` → `200` on the preview guide, `noindex`
- Wrong secret → `401`
- `/preview/software/pipedrive/` without a draft cookie → `404`

`.env.local` on this machine does not define `PREVIEW_SECRET`. Production still needs that variable for editorial preview.

## 14. Media architecture

`resolvePublicMediaSrc` turns a root-relative path in a known Blob folder into `https://<blob-host>/<same-path>` when the host is set and the deployment is Vercel (or `BLOB_MEDIA_REWRITES=1`). It strips the query string, so `?dpl=` is not emitted.

Local builds keep same-origin paths so `public/` files keep working. Legacy same-origin URLs still match the fallback rewrite on Vercel.

Upload semantics (`scripts/upload-public-to-blob.mjs`): `addRandomSuffix: false`, `allowOverwrite: true`, cache about 30 days. Filenames already carry content versions (`-v2`, `-v4`). Dropping the deployment id is safe when a change gets a new filename. An overwrite of the same pathname can stay stale until that cache expires. No content files were mass-migrated.

Guide figures and guide covers use the resolver. Other unoptimized heroes (industries, features, capabilities, use-cases, requirements, resources, audiences, workflow) were left on their current `src` values.

## 15. Image optimization

`GuideFigure` stays `next/image` with `unoptimized`. The blank-figure failure was `fill` plus `trailingSlash` requesting `w=3840` and painting an empty box. Removing `unoptimized` without a source-size fix would bring that back.

The measured hero `/guides/what-is-crm-hero.png` is 1,671,961 bytes. A WebP sibling exists at `/guides/what-is-crm-hero.webp` and returns 200 from Blob, but the figure component is still pointed at the PNG paths stored in content. Converting the guide image set at ingestion is a separate media migration and was not done in this change.

Direct Blob delivery works for that PNG, the WebP sibling, and a Pipedrive diagram PNG (all `200` on the Blob host).

Variant budget: `deviceSizes` unchanged (6). `imageSizes` dropped `16`, which nothing requests. `qualities` stay `[75, 90]` because `capability-hero.tsx` sets `quality={90}` for text-heavy diagrams. Formats stay AVIF and WebP.

Budget: `(6 + 7) × 2 × 2 = 52`, down from 56. The cost detector still warns above its threshold of 40. The list was not cut further to chase that number.

## 16. Turbopack trace changes

Before: **90** warnings (audit build log). After: **90** warnings (this build log: “Turbopack build encountered 90 warnings”).

The affiliate click route no longer imports the ingest barrel. A narrower `firstExisting` helper was tried and reverted: slicing on `/data/` broke `docs/migration/data` and organic GSC loading, and the growth-dashboard tests failed. The highest remaining traces are still dynamic `existsSync` / `readFileSync` / directory reads over `public/`, `data/seo/`, research JSON, and analytics imports, mostly from dev and CLI graphs that the server bundle still traces. The content repository was not redesigned.

## 17. Cost-audit changes

`scripts/audit-vercel-cost.ts` no longer treats a public `draftMode().isEnabled` read as proof of dynamic rendering on Next.js 16.3. A read is INFO. `draft.enable()` / `draft.disable()` on a public file is still FAIL.

It FAILs public awaited `searchParams`, public `force-dynamic`, public `cookies` / `headers` where those apply, `revalidate = 0`, and `no-store`. It still flags large `generateStaticParams` estates, Blob `:path*` on the same destination string as the Blob host (so the hostname in `images.remotePatterns` is not a false positive), wildcard image hosts, a large image variant budget, and a missing ignore command.

`scripts/vercel/ignored-build.mjs` counts as the valid ignore implementation.

Latest run: **FAIL 1, WARN 1, INFO 0**.

- FAIL `public-search-params` on `src/app/(site)/newsletter/confirm/page.tsx`. The token has to be read on the server for no-JS email links. Left in place.
- WARN `image-variant-explosion` at 52 variants.

Exit code is 1 because of that FAIL.

## 18. generateStaticParams before and after

Counts are from the audit route table (before) and this build’s route table (after). “+N more paths” plus the three printed samples.

| Family | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Comparisons | 7,888 | 2,138 | 5,750 |
| Software tabs | 2,835 | 0 | 2,835 |
| Guides | 1,460 | 593 | 867 |
| Software overviews | 315 | 315 | 0 |
| Alternatives | 309 | 309 | 0 |
| Industry × capability | 150 | 150 | 0 |
| Industry × use-case | 126 | 126 | 0 |
| Use-cases | 120 | 120 | 0 |
| Tools (dynamic segment) | 96 | 96 | 0 |
| Capabilities | 70 | 70 | 0 |
| Best | 33 | 33 | 0 |
| Industries | 25 | 25 | 0 |
| Categories | 24 | 24 | 0 |
| Features | 24 | 24 | 0 |
| Audiences (`/for`) | 8 | 8 | 0 |
| Industry × feature | 2 | 2 | 0 |
| Industry × requirement | 2 | 2 | 0 |

Requirements, resources, pricing, and sitemap routes were not retargeted. Their `generateStaticParams` lists are unchanged aside from `dynamicParams = false` on the catalogue segments that share Blob folders.

The objective was not zero static pages. Indexable software, guides, and comparisons are still SSG.

## 19. Build before and after

| | Before | After |
| --- | --- | --- |
| Static pages | 13,662 | 4,211 |
| Reduction | | 9,451 (69.2%) |
| Wall time | 14m 53s | 7m 14s |
| Compile | | 102s |
| Static generation | | 4.3 min |
| Typecheck during `next build` | skipped (`typescript.ignoreBuildErrors`) | skipped; `npm run typecheck` passed separately |
| Turbopack warnings | 90 | 90 |

`/search`, `/guides`, `/compare`, `/compare/build`, `/tools`, and `/company/contact` are `○` static. `/preview/software/[slug]` and `/preview/guides/[slug]` are `ƒ`. `/go/[product]` is still `ƒ`. There is no `/software/[slug]/[tab]` route.

Next warned that 5,058 redirects can reduce routing performance. The manifest was written successfully.

## 20. Tests

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS — 0 errors, 109 pre-existing warnings |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 183 files, 1,545 tests |
| `npm run build` | PASS — 4,211 static pages, exit 0 |
| `npm run audit:vercel-cost` | FAIL 1, WARN 1, INFO 0 (newsletter confirm + image budget) |

`validate:predeploy` is `lint && typecheck && test && build`. Those four commands were run after the last source edit and all passed. The script was not invoked a second time, so the production build was not repeated.

`next start` smoke (port 3456) covered home, software index, Pipedrive, the old pricing tab URL, guides hub, a guide, compare hub, canonical and reverse comparison, alternatives, a category, tools, search, contact, media, unknown software and guide slugs, and `/go/pipedrive/` (`302` to the Pipedrive affiliate URL, `no-store`, `noindex`).

Chrome headless hydrated DOM covered guide category chips, the CRM tools variant, search results, the correction form fields, the pricing tab panel, and compare/build pair resolution. Patchright was not installed, so this used Chrome `--dump-dom` with a virtual time budget instead of the browser-automation skill.

## 21. Known limitations

- `/newsletter/confirm` stays dynamic. The cost audit will keep failing that file until the detector is taught an allowlist. Do not move the token into the client.
- Industry nest SSG counts are unchanged.
- Turbopack warnings are unchanged at 90.
- Image variant WARN remains at 52. Quality 90 stays because capability heroes use it.
- Guide heroes remain multi-megabyte PNGs served with `unoptimized`.
- Same-path Blob overwrites can stay cached for up to 30 days without `?dpl=`.
- Non-indexable guides and comparisons 404. Their reverse URLs are not redirected.
- Local `next start` does not install Blob rewrites unless `VERCEL=1` or `BLOB_MEDIA_REWRITES=1`. Production Vercel builds do.
- Next warns about more than 1,000 custom redirects. The local routes manifest accepted 5,058.
- Rendering every software tab panel into one document makes each product HTML larger and removes nine model builds. Net build time still fell.
- `typescript.ignoreBuildErrors` is still true. Vercel will not typecheck this project. `npm run typecheck` is the gate.
- Direct Blob URLs in HTML appear when the resolver’s env gate is on. Local production HTML still uses same-origin media paths.

## 22. Deferred work

- Convert guide heroes to WebP or AVIF at ingestion, at a readable width, then point `GuideFigure` at that file. Do not flip `unoptimized` until that source exists. A WebP sibling of the CRM hero is already on Blob and is unused by the component.
- Point the remaining unoptimized heroes (not only guides) through `resolvePublicMediaSrc`.
- Narrow the Turbopack traces that walk `public/`, `data/seo/`, and analytics imports, without another broken path-prefix rewrite.
- If the 5,058-redirect warning becomes a deploy failure, move comparison reverses into one proxy check. Do not emit a function per URL. The local build did not fail.
- Optional allowlist in the cost detector for `/newsletter/confirm`, so the audit exit code is not permanently 1 for a page that must stay dynamic.

## 23. Expected Vercel cost impact

| Meter | Direction | Why |
| --- | --- | --- |
| Build CPU | LOWER | 4,211 pages instead of 13,662; wall time 7m 14s instead of 14m 53s |
| Fluid CPU | LOWER | Query hubs and contact no longer render dynamic HTML; unknown slugs 404 without running models; search runs in a cached route |
| Fluid Memory | LOWER | Those dynamic HTML renders are gone; the search route is bounded (80 / 48 / 6) |
| Origin Transfer | LOWER | New guide/cover markup can load Blob directly on Vercel; tab HTML is one document per product |
| Image Transformations | LOWER | Modest: unused width 16 removed. Guide heroes stay outside the optimizer |
| Image Cache Writes | LOWER | Same modest variant-budget cut |
| Edge Requests | SAME | Request volume follows traffic. Reverse and tab redirects are routing config, not extra functions on canonical HTML |

---

SOFTWAREGLIMPSE FINAL VERIFICATION

/guides hub static: PASS
/compare hub static: PASS
/tools hub static: PASS
/search shell static: PASS
/contact static: PASS

Search query API cached: PASS
Arbitrary query RSC eliminated: PASS

Comparison reverse SSG eliminated: PASS
Reverse redirects preserved: PASS

Blob rewrites fallback: PASS
Unknown software path handled by Next: PASS
Unknown guide path handled by Next: PASS
Legacy media paths preserved: PASS
Direct Blob media: PASS

Software overview SSG: PASS
Software tabs removed from SSG: PASS
Old tab URLs preserved/redirected: PASS

Guide SSG restricted to public/indexable set: PASS
Comparison SSG restricted to canonical/indexable set: PASS
Noindex industry SSG reduced: FAIL

Software model metadata/page deduplicated: PASS
Comparison model deduplicated: PASS
Guide resolution deduplicated: PASS

Public draftMode removed: PASS
Preview still functional: PASS

Image variant budget reduced safely: PASS
Large guide image strategy: DEFERRED WITH JUSTIFICATION

Turbopack warnings:
BEFORE: 90
AFTER: 90

BUILD PAGE COUNT:
BEFORE: 13,662
AFTER: 4,211
REDUCTION: 9,451
REDUCTION %: 69.2%

BUILD TIME:
BEFORE: 14m53s
AFTER: 7m14s

Lint: PASS
Types: PASS
Tests: PASS
Production build: PASS

VERCEL COST AUDIT:
FAIL: 1
WARN: 1
INFO: 0

EXPECTED IMPACT:

Build CPU: LOWER
Fluid CPU: LOWER
Fluid Memory: LOWER
Origin Transfer: LOWER
Image Transformations: LOWER
Image Cache Writes: LOWER
Edge Requests: SAME

SAFE FOR ONE CONTROLLED PRODUCTION DEPLOYMENT:
YES
