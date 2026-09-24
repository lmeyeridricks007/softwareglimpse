# Vercel cost guardrails

Engineering standard for SoftwareGlimpse (and the shared personal Vercel team `leemeyeridricks-3740s-projects`).

**Goal:** lowest sensible Vercel bill without harming SEO, Core Web Vitals, UX, reliability, or maintainability.

These rules are testable. Detector: `npm run audit:vercel-cost`.

Related audit: `reports/vercel-cost-audit/`.

**SoftwareGlimpse Wave 0:** ignored builds + local predeploy validation. Do not use Vercel to discover TypeScript, lint, test, or `next build` errors. Command: `npm run validate:predeploy`. Do not start Wave 1 rendering/caching changes (`draftMode()`, hub `searchParams`, Blob URLs) unless explicitly requested.

---

## 1. Static vs dynamic rendering

1. Public software, guide, compare, hub, and tool pages **must** be `STATIC` or `ISR`. They must not export `dynamic = "force-dynamic"` unless an ADR in the repo explains why request-time freshness is required.
2. `cookies()`, `headers()`, `draftMode()`, `connection()`, and `unstable_noStore()` must not appear in public App Router pages, layouts, or `generateMetadata`. Dedicated `/preview`, `/admin`, authenticated `/app`, and `/go` routes are exempt.
3. Awaiting `searchParams` on a sitemap’d index page is forbidden. Filter state belongs in a client island (`useSearchParams`) after a static shell.
4. `generateStaticParams` plus `force-dynamic` is forbidden.
5. `dynamicParams` on closed catalog `[slug]` routes should be `false` once `generateStaticParams` is complete, so unknown crawler URLs 404 at the edge instead of invoking Fluid compute.

**Test:** `audit:vercel-cost` rules `force-dynamic-public`, `draft-mode-public`, `cookies-public-rsc`.

Known Wave 1 FAILs (do not “fix” by pushing to Vercel): `draftMode()` on software/guide public pages — see `reports/vercel-cost-audit/issues.csv`.

---

## 2. Server Functions / CPU

1. Public HTML must not load the full in-memory catalog, search index, or review JSON on every request. Use build-time data, `unstable_cache` / `"use cache"`, or per-slug modules.
2. `generateMetadata` must not re-run the same expensive model builder as the page. Share one `React.cache`’d result, or make the page static so it only runs at build.
3. Server Actions that scan the full catalog (`search`, finder, compare-build) must be rate-limited and must not be the HTML rendering path for Googlebot.
4. `maxDuration` defaults stay at the platform default. Do not raise function timeout to “make a slow page work”.
5. Do not enable extra Fluid memory without measuring RSS. SoftwareGlimpse’s **turbo** build machine is a symptom of a ~13k-page SSG surface — do not treat a faster VM as the fix.

---

## 3. Caching / ISR

1. Public catalog data must not use `cache: "no-store"` without an ADR explaining why request-time freshness is required.
2. Time-based `revalidate` on public content **must be ≥ 86400** (24h) unless the page shows data that actually changes more often than daily.
3. Unbounded query strings (`/search?q=*`, compare builders) must **not** use ISR.
4. Prefer `revalidateTag` / `revalidatePath` on content publish over short TTLs.
5. After a production deploy, assume Incremental Cache and Image Optimization cache are cold. Do not deploy production on every agent commit.

**Test:** rules `no-store-public`, `short-revalidate`, `revalidate-zero`.

---

## 4. Images

1. Do not disable `next/image` globally.
2. `images.remotePatterns` must list explicit hosts (Blob, known CDNs). `hostname: "**"` is forbidden.
3. Qualities must be an allow-list of values actually requested. Do not add unused qualities.
4. Do not put the same source width in both `deviceSizes` and `imageSizes`.
5. Target **≤ 8 practical variants per source**. Theoretical max should stay **≤ 24** unless measured otherwise.
6. `minimumCacheTTL` for catalog media must be **≥ 7 days** (prefer 30).
7. Stable source URLs. Query-string cache-busters on image `src` are forbidden in production.
8. When the original already lives on Vercel Blob, prefer the Blob public hostname as `src`. Do not add Edge middleware to rewrite media.

**Test:** rules `image-remote-wildcard`, `image-variant-explosion`, `image-short-cache-ttl`, `middleware-images`.

---

## 5. Middleware / Edge

1. SoftwareGlimpse has **no middleware today**. Do not add a catch-all “just in case”.
2. If middleware is ever required, it **must** have a `matcher` that excludes `_next/static`, `_next/image`, `favicon.ico`, and common static extensions.
3. Matcher must **not** include `/images/:path*` merely to proxy Blob.
4. Host canonicalization (www ↔ apex) is allowed on HTML only.

**Test:** rules `middleware-images`, `middleware-unscoped`, `middleware-matcher-broad`.

---

## 6. APIs

1. Affiliate hop routes (`/go/*`) stay dynamic with `Cache-Control: no-store`. They must remain `robots.txt` disallowed.
2. Public JSON/CSV downloads and sitemap XML must set `s-maxage` ≥ 3600 and should be `noindex` if they are research artefacts.
3. Search suggest APIs must require a minimum query length and should send `s-maxage`.
4. Do not add Vercel Cron that rebuilds the catalog HTML tree.

---

## 7. Blob / data transfer

1. Binary media **must not** ship in the Vercel deployment when it exceeds ~50MB. Site media packs already live in Blob; do not git-add `/public/guides/` etc.
2. Bytes that already live on `*.public.blob.vercel-storage.com` should be linked directly. Proxying Blob through `next.config` `rewrites` bills **Fast Origin Transfer** and **Blob Data Transfer** (Wave 1+).
3. Do not hydrate full explorer datasets into the RSC payload when a paginated fetch or client JSON would do.

---

## 8. Analytics / observability

1. Vercel Web Analytics may stay **on production**. Disable it on **preview** deployments.
2. Speed Insights must use `sampleRate` ≤ 0.1 on this catalog site, or be off when GA4/Ahrefs already cover CWV.
3. Speed Insights Plus (paid events) must not be enabled unless a named investigation needs it.
4. Observability Plus traces/logs stay at the Pro default. Do not raise log drain volume. Do not `console.log` per request in hot paths.

---

## 9. Previews / builds

1. This project **must** keep `vercel.json` `ignoreCommand`: `node scripts/vercel/ignored-build.mjs`.
2. **Exit 0 = skip, exit 1 = build** (do not invert). Prefer `VERCEL_GIT_PREVIOUS_SHA` when that object exists in the clone; otherwise `HEAD^` / `HEAD~1`. Fail-open (build) if git history cannot be resolved.
3. Do **not** replace the script with a generic `:!**/*.md` or `:!docs` git pathspec. Production content lives in `src/`, `data/`, `config/`, and `public/`.
4. Local validation before every push: `npm run validate:predeploy` (lint, typecheck, test, `next build`). Then `npm run audit:vercel-cost`. Vercel is not the compiler.
5. Preview deployments are for pull requests, not for every push to `main`. `main` → production only.
6. Do not push to `main` from an agent loop “to see if Vercel builds”. Failed production builds still consume Build CPU (~11 min average, turbo machine).
7. Batch related application changes into one deploy. Do not auto-push or auto-deploy.
8. Dashboard `commandForIgnoringBuildStep` is overridden by `vercel.json`. Leave the dashboard Ignored Build Step empty / Automatic so this repo script is the single source of truth.
9. Force a docs-only commit to deploy only with `FORCE_VERCEL_BUILD=1` or a `[force-build]` commit message.

**Test:** rule `missing-ignore-command`. Cursor rules: `.cursor/rules/vercel-cost-guardrails.mdc`, `.cursor/rules/no-speculative-vercel-deploys.mdc`.

---

## 10. Bots

1. Do not block Googlebot, Bingbot, or other legitimate search crawlers required for SEO.
2. `robots.txt` must `Disallow` `/go/`, `/api/`, `/admin/`, `/preview/`, `/search`, and public CSV dumps.
3. Faceted/search URLs that are `noindex` should also be `Disallow`’d so they are not crawled.
4. `dynamicParams = false` is the preferred 404 for invented catalog slugs.

---

## 11. Logging

1. No per-request `console.log` in middleware, `layout.tsx`, or software/guide page components.
2. Structured logs for affiliate clicks belong on a sampled beacon, not an uncached SSR.

---

## Definition of done (before merging a route change)

- [ ] Public route is STATIC or ISR unless listed as an exception (`/go`, `/admin`, authenticated `/app`, search POST, `/api/preview`).
- [ ] No new `draftMode()` / `cookies()` / `headers()` on sitemap’d pages.
- [ ] No new middleware.
- [ ] `npm run validate:predeploy` passed (lint, typecheck, test, production `next build`).
- [ ] `npm run audit:vercel-cost` introduces no new FAIL, or the FAIL is an approved Wave 1+ exception listed in `reports/vercel-cost-audit/issues.csv`.
