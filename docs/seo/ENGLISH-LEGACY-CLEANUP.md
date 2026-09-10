# English-only legacy crawl cleanup

**Date:** 2026-09-06  
**Scope:** Remove WordPress-era multilingual + taxonomy URLs from the active crawl/index surface; verify robots.txt + sitemap discovery.  
**Out of scope:** `/compare/` and `/guides/` content redesign.

---

## 1. Legacy language prefixes found

| Prefix | Source | In live Next app? |
| --- | --- | --- |
| `/fr/` | Yoast hreflang (`fr-FR`) | No routes — crawl debt only |
| `/de/` | Yoast hreflang (`de-DE`) | No |
| `/es/` | Yoast hreflang (`es-ES`) | No |
| `/nl/` | Yoast hreflang (`nl-NL`) | No |
| `/zh/` | Yoast hreflang (`zh-CN`) | No |
| `/hi/` | Yoast hreflang (`hi-IN`) | No |
| `/ar/` | Yoast hreflang (`ar`) | No |
| `/pt/`, `/it/`, `/ja/` | Anticipatory (classifier + Proxy matcher) | No evidence in primary Yoast set |

**App confirmation:** `<html lang="en">`, OG `locale: en_US`, no `alternates.languages` / hreflang generation, no `[locale]` routes, no i18n packages.

**Classifier:** `src/services/legacy-url-migration/classify.ts` now includes `hi` (was missing).

---

## 2. Count of affected URLs

| Bucket | Count | Disposition |
| --- | ---: | --- |
| Locale URLs with genuine EN equivalent (hreflang map) | **2,621** | **301** via Proxy → English canonical |
| Locale URLs with no EN equivalent | **1,855** | **410** via Proxy |
| Locale roots (`/fr/`, `/de/`, …) | **7** | **410** (no homepage dump) |
| Approx. Yoast locale alternates (7 locales × ~643 EN) | **~4,501** | Split across 301 / 410 above |
| EN legacy article redirects | **~379** (+7 equity repairs) | **301** via `next.config` ← `config/legacy-redirects.json` |
| EN WP category exact maps | **14** | **301** (config + Proxy) |
| Retired WP pattern classes | **17** | **410/404** via Proxy |

Config sources:

- `config/legacy-locale-cutover.json` — locale 301 map + stats  
- `config/legacy-redirects.json` — EN legacy 301s + retired pattern docs  
- `docs/migration/data/legacy-locale-summary.json` — inventory summary  
- `docs/seo/LOCALE-410-TOPIC-REVIEW.md` — Phase 1–3 classification of prior 410 locale topics  
- `docs/seo/EXISTING_ESTATE_GAP_REVIEW.md` — manual queue (no auto-create)  

---

## 3. Taxonomy patterns found

| Pattern | Classification | Notes |
| --- | --- | --- |
| `/tag/:slug*` | **REMOVE / 410** | Thin WP tag archives |
| `/author/:slug*` | **REMOVE / 404** | Not in modern IA (`/company/my-story/` is the founder page) |
| `/feed`, `/comments/feed` | **REMOVE / 410** | WP feeds |
| `/category/crm/` (+ 13 allowlisted) | **REDIRECT** | Genuine modern hubs (`/categories/crm/`, `/best/…`, `/industries/…`, `/guides/`, `/compare/`) |
| `/category/:slug*` (all other) | **REMOVE / 410** | Thin / obsolete archives |
| `/fr/etiqueter/`, `/es/etiqueta/`, `/de/schild/`, `/nl/label/`, `/zh/标签/` | **REMOVE / 410** (unless cutover-mapped) | Localized tag archives |
| `/fr/categorie/`, `/es/categoria/`, `/de/kategorie/`, `/nl/categorie/`, `/zh/类别/` | **REDIRECT** when in cutover; else **410** | ~56 localized category rows are hreflang-mapped |
| `/categories/…` | **KEEP** | Modern SoftwareGlimpse IA (not WP `/category/`) |

---

## 4. Redirect mappings

### Locale → English (Proxy, 301)

- **File:** `config/legacy-locale-cutover.json` (`redirects` map, **2,621** entries)
- **Enforcement:** `src/proxy.ts` → `resolveEnglishOnlyCutover()`
- **Destination prefixes (unique ~121):** `/guides/`, `/software/`, `/categories/`, `/industries/`, `/compare/`, `/use-cases/`, `/for/`, `/best/`, `/capabilities/`, `/company/`, `/legal/`
- **Guarantees:** no destination is `/`; no destination is another locale path
- **Equity repairs (2026-09-06):** `npm run migration:locale-410-review -- --apply` added **49** locale 301s across **7** EN topics that already have a genuine modern page (`/my-story/`, `/terms-and-conditions/`, product intros, Zoho One → Zoho CRM). Junk/SEO tooling stays **410**.

### EN legacy articles (next.config, 301/308)

- Unchanged generator path: `npm run migration:redirects` → `config/legacy-redirects.json` → `toNextConfigRedirects()`
- Next.js emits **308** for `permanent: true` config redirects (SEO-equivalent to 301)
- Locale URLs are **intentionally not** dumped into `next.config` (would exceed practical redirect limits); Proxy owns that set and returns **301**

### WP category allowlist (301)

| Source | Destination |
| --- | --- |
| `/category/crm/` | `/categories/crm/` |
| `/category/best-crms/` | `/best/crm-software/` |
| `/category/crm-comparisons/` | `/compare/` |
| `/category/software-comparison/` | `/compare/` |
| `/category/guides/` | `/guides/` |
| `/category/crm-guides/` | `/guides/` |
| `/category/crm-engineering/` | `/industries/engineering/` |
| `/category/crm-event-management/` | `/industries/event-management/` |
| `/category/crm-music/` | `/industries/music/` |
| `/category/crm-plumbing/` | `/industries/plumbing/` |
| `/category/crm-private-equity/` | `/industries/private-equity/` |
| `/category/crm-real-estate/` | `/industries/real-estate/` |
| `/category/crm-solar/` | `/industries/solar/` |
| `/category/crm-venture-capital/` | `/industries/venture-capital/` |

---

## 5. Removed / 410 patterns

Enforced by `src/proxy.ts` (plain-text **410 Gone** + `X-Robots-Tag: noindex`; authors **404**):

- Unmapped `/{fr\|de\|es\|nl\|zh\|hi\|ar\|pt\|it\|ja}/:path*`
- Locale roots `/{locale}/`
- `/tag/*`, unmapped `/category/*`, `/feed`, `/comments/feed`
- Localized taxonomy leftovers after cutover miss

Documented in `config/legacy-redirects.json` → `retired[]` and `WORDPRESS_RETIRED_PATTERNS` in `redirect-plan/policy.ts`.

---

## 6. Routes intentionally preserved

All modern English IA remains indexable when quality gates pass:

- `/`, `/software/`, `/categories/`, `/tools/`, `/pricing/`
- `/compare/`, `/guides/`, `/alternatives/`, `/best/`
- `/use-cases/`, `/capabilities/`, `/requirements/`, `/features/`
- `/resources/`, `/for/`, `/industries/`
- `/company/*`, `/legal/*`, `/research/*`

No fake English equivalents were invented for unmapped locale URLs.

---

## 7. robots.txt before / after assessment

| | Before | After |
| --- | --- | --- |
| Implementation | `src/app/robots.ts` | Same file, tightened |
| Allow | `/` | `/` |
| Disallow | `/go/`, `/api/preview` | `/go/`, `/api/`, `/search/`, `/dev/`, `/compare/build/`, `/newsletter/` |
| Sitemap | `https://www.softwareglimpse.com/sitemap.xml` | **unchanged** |
| Host | `https://www.softwareglimpse.com` | **unchanged** |
| Locale Disallow | none (correct) | **still none** — Google must fetch 301/410 |
| Env block-all | none | none |

**Production probe (2026-09-06):** HTTP **200**, `Content-Type: text/plain; charset=utf-8`, sitemap line present.

---

## 8. Sitemap declaration verification

| Check | Result |
| --- | --- |
| robots declares Sitemap | `Sitemap: https://www.softwareglimpse.com/sitemap.xml` |
| Production `/sitemap.xml` | HTTP **200**, `Content-Type: application/xml` |
| Body | Valid XML urlset/index (not an HTML Next page) |
| Host | `https://www.softwareglimpse.com` (www, HTTPS) |
| Local builder | `src/seo/sitemap.ts` → English IA only via data layer + `canonicalUrl()` |
| Locale/taxonomy in sitemap | **None** (asserted in tests) |
| Code shape | Sitemap **index** at `/sitemap.xml` + named children `/sitemap-{type}.xml` |

---

## 9. Tests added

| File | Coverage |
| --- | --- |
| `src/seo/english-only-cutover.test.ts` | Locale 301/410 rules; taxonomy 410; category allowlist; robots sitemap/host/disallow; sitemap prohibits locale/taxonomy; important EN hubs remain |

Supporting modules:

- `src/seo/english-only-cutover.ts` — shared policy used by Proxy + GSC opportunity canonicalize
- `src/proxy.ts` — Next.js 16 Proxy runtime enforcement

---

## 10. Locale 410 topic review (equity preservation)

Re-reviewed the **1,904** unmapped locale URLs so valuable **topics** were not discarded merely because the first cutover pass lacked an English destination.

| Classification | Topics | Disposition |
| --- | ---: | --- |
| TRUE_OBSOLETE | 86 | Keep **410** (off-strategy SEO/AI tooling, locale roots) |
| TAXONOMY_JUNK | 171 | Keep **410** |
| DUPLICATE_TOPIC | 7 | **301** repaired → existing English page |
| ENGLISH_EQUIVALENT_MISSING | 5 | Keep **410** (no demand signal) |
| VALUABLE_TOPIC_CANDIDATE | 4 | `EXISTING_ESTATE_GAP_REVIEW` — stay **410**, no auto-create |

CLI: `npm run migration:locale-410-review` (`--apply` to write genuine 301s only).

Gap queue (manual): `docs/seo/EXISTING_ESTATE_GAP_REVIEW.md` — Content at Scale, Miocommerce, Tidio vs Crisp, Tidio vs Live Chat.

---

## 11. Manual follow-up required

1. **Deploy** this branch so production stops soft-404ing locale/taxonomy URLs (live site still returned **404** for `/fr/` and `/tag/…` as of the probe).
2. **GSC:** After deploy, use URL Inspection on a sample of 301 locale URLs and 410 tag URLs; optionally request removal for stubborn 410s.
3. **Sitemap cache:** Production still served a monolithic cached urlset from an earlier deploy; new index+chunk shape ships with this build — confirm post-deploy.
4. **Do not regenerate** `config/legacy-redirects.json` without re-including retired locale patterns (`WORDPRESS_RETIRED_PATTERNS` is updated so `npm run migration:redirects` stays aligned). Prefer appending equity repairs via `migration:locale-410-review -- --apply` or `EXISTING_APP_ALIASES`.
5. **Gap review:** Decide whether to onboard any `EXISTING_ESTATE_GAP_REVIEW` products/compares — do not invent pages to save locale URLs.
6. **Later tasks (not this PR):** comparison-page and guide-content redesign; apex→www if not already at the DNS/Vercel layer.
7. **Optional:** submit updated sitemap in GSC after deploy; monitor “Crawled – currently not indexed” for locale/taxonomy decline over 2–4 weeks.

---

## Files changed (this task)

| Path | Change |
| --- | --- |
| `src/seo/english-only-cutover.ts` | **New** — English-only policy + lookups |
| `src/seo/english-only-cutover.test.ts` | **New** — automated checks |
| `src/proxy.ts` | **New** — 301/410/404 enforcement |
| `src/app/robots.ts` | Broader utility Disallow; shared site URL helper |
| `src/seo/index.ts` | Export cutover helpers |
| `config/legacy-locale-cutover.json` | Locale 301 map (committed) |
| `config/legacy-redirects.json` | Expanded `retired[]`; `noMiddleware: false` |
| `src/services/legacy-url-migration/classify.ts` | Add `hi` |
| `src/services/legacy-url-migration/redirect-plan/policy.ts` | Full retired pattern set |
| `src/services/legacy-url-migration/redirect-plan/generate.ts` | `noMiddleware: false` |
| `src/services/legacy-url-migration/redirect-plan/types.ts` | Policy typing |
| `src/services/legacy-url-migration/redirect-plan/report.ts` | Proxy enforcement docs |
| `src/services/legacy-url-migration/mapping-agent/map.ts` | Locale → 410 policy note |
| `docs/migration/data/legacy-locale-summary.json` | hi/zh + cutover stats |
| `vitest.config.mts` | Fix `@/` path alias resolution under Vitest 4 / Vite 8 |
| `docs/seo/ENGLISH-LEGACY-CLEANUP.md` | This report |

### Local verification (post-build)

| URL | Result |
| --- | --- |
| `/robots.txt` | 200; Sitemap + Host on www; utility Disallows |
| `/fr/` | **410** |
| `/tag/pipedrive/` | **410** |
| `/category/crm/` | **308** → `/categories/crm/` |
| Sample cutover locale | **301** → English hub |
| `/sitemap.xml` | XML (not HTML) |
