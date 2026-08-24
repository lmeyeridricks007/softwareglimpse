# Scheduled publishing

SoftwareGlimpse supports draft → scheduled → published lifecycles with **central visibility gates** — not per-component date checks.

## Content lifecycle

| Status | Meaning |
| --- | --- |
| `draft` / `review` / `approved` | In progress — not public |
| `scheduled` | Approved, future `scheduledAt` — auto-publishes when due |
| `published` | Live (also `refresh-needed`, `refreshing`) |
| `archived` / `rejected` | Not public |

Store timestamps as **ISO-8601 UTC** (`2026-09-15T06:00:00.000Z`). Human input may use a timezone label in docs; normalize before saving.

### Example metadata

```yaml
metadata:
  status: scheduled
  scheduledAt: "2026-09-15T06:00:00.000Z"   # 08:00 Europe/Amsterdam (CEST)
seo:
  indexable: true
```

## Publication context

All visibility flows through `isContentVisible()` in `src/domain/publication-context.ts`.

| Context | Use |
| --- | --- |
| `PUBLIC` | Production visitors |
| `DEV_PREVIEW` | Local development (default: show scheduled) |
| `AUTHORIZED_PREVIEW` | `/api/preview` draftMode |
| `SITEMAP` / `SEARCH_INDEX` / `BUILD` | Public artefacts |

## Local development

**Default: `npm run dev` shows everything** — drafts, scheduled future content, published, archived (if in the repo). No special flags required.

Optional simulation modes:

| Command | Behavior |
| --- | --- |
| `npm run dev` | All local content visible |
| `npm run dev:public` | Production visibility as of now |
| `npm run dev:as-of -- --date=…` | Production visibility at a future instant |

Environment override: `PUBLICATION_PREVIEW=public` (optional only).

Status badges (DRAFT, SCHEDULED, PUBLISHED) render in development only.

### Sitemap exception

Sitemap generation always uses **production rules**, even during `npm run dev`, so you can validate sitemap correctness locally.

## Production behaviour

Before `scheduledAt`:

- Direct routes → **real HTTP 404** (`notFound()` on the server — not hidden HTML, soft 404, or client-side redirect)
- Excluded from catalogue, search, sitemap, internal links, JSON-LD lists

Route handlers must resolve content through **filtered catalogue getters** (`getComparisonBySlug`, `getBestPageBySlug`, …) or `resolveForPublicRoute()` in `src/services/publishing/route-resolution.ts`. Do not use `getAll*Unfiltered()` in public route pages or `generateStaticParams`.

At/after `scheduledAt` with `status: published` (via `npm run content:publish` / `runPublishDue`):

- Automatically visible where indexability gates pass
- Revalidation tags fire from publishing engine

## CLI

```bash
npm run content:status          # publishing status
npm run content:scheduled       # list scheduled entries
npm run content:calendar        # date-range calendar
npm run content:prepublish      # dependency + audit gate
npm run content:audit:scheduled # write SCHEDULED-CONTENT-AUDIT-LATEST.md
npm run content:report:scheduled
npm run publishing -- schedule -- content:software:attio --at 2026-09-15T06:00:00.000Z
```

Reports live under `docs/publishing/`.

## Product onboarding

Onboarding (`npm run onboard:software`) creates **candidates in draft** — never auto-publishes.

Schedule after validation:

1. Complete onboarding → `READY`
2. Set entity `metadata.status: scheduled` + `scheduledAt`
3. Run `npm run content:prepublish`
4. Preview locally with `npm run dev`
5. At publish time: `npm run content:publish` (or scheduled runner)

See [NEW-PRODUCT-SCHEDULING.md](./NEW-PRODUCT-SCHEDULING.md).

## Testing

```bash
npm run test -- src/domain/publication-context.test.ts
npm run test -- src/services/publishing/publication-safety.test.ts
```

CI safety: future scheduled registry entries must not resolve visible in `PUBLIC` context.

## Further reading

- [Current architecture audit](./01-current-content-publishing-architecture.md)
- [Publishing engine (orchestration)](../softwareglimpse/publishing-engine.md)
- [Implementation report](./SCHEDULED-PUBLISHING-IMPLEMENTATION-REPORT.md)
