# SEO architecture

Code: `src/seo/`, `src/app/robots.ts`, `src/app/sitemap.ts`.

## Policies

| Policy | Decision |
| --- | --- |
| Trailing slash | Always (`trailingSlash: true`) |
| Canonical host | `https://www.softwareglimpse.com` via `NEXT_PUBLIC_SITE_URL` |
| Metadata | Only via `buildPageMetadata()` |
| Index default | `false` until explicit `seo.indexable` + publish gate |
| Thin pages | Noindex until meaningful |

## Metadata helper

`buildPageMetadata({ title, description, path, indexable, nofollow })` sets:

- title / description
- canonical (`alternates.canonical`)
- robots / googleBot
- Open Graph
- Twitter card

## Structured data

Helpers in `structured-data.tsx`:

- Organization
- WebSite
- BreadcrumbList
- SoftwareApplication (factual fields only)

**Never** emit AggregateRating / Review counts we do not have. Editorial scores, when added, must be labeled as SoftwareGlimpse editorial ratings — not user reviews.

## Sitemaps

`getSitemapEntries()` includes only:

- home, software index, categories index
- published + indexable categories
- published + indexable software

Partition later when URL count grows (e.g. `/sitemap-software.xml`). Do not pre-create empty partitions.

## robots.txt

Allow `/`, point to `/sitemap.xml`, set host.

## Redirects

WordPress redirects come from `MigrationRecord` (Phase 1+). Implement via `next.config` redirects or middleware generated from the ledger — never ad-hoc per page.

## Duplicate content

- One canonical software URL: `/software/{slug}/`
- Category membership does not create alternate product URLs
- Comparisons use distinct slugs (`pipedrive-vs-freshsales`)

## Breadcrumbs

UI + JSON-LD from the same item list (`BreadcrumbItem[]`).
