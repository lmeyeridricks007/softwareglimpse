# Scheduled publishing implementation report

Date: 2026-08-23

## 1. Existing architecture

See [01-current-content-publishing-architecture.md](./01-current-content-publishing-architecture.md). Core lifecycle, registry, versions, schedules, and CLI already existed. Extension adds **context-aware visibility** without a parallel CMS.

## 2. Publication data model

Reuses `ContentMetadata` (`status`, `scheduledAt`, `publishedAt`) on all major entities. No duplicate `publication` object — seed-compatible.

Effective states via `resolvePublicationState()`: `DRAFT`, `SCHEDULED`, `LIVE`, `ARCHIVED`.

## 3. Effective-state logic

`src/domain/publication-context.ts`:

- `getPublicationContextSync()` — resolves `PUBLIC` / `DEV_PREVIEW` / etc.
- `getEffectiveNow()` — real time or `PREVIEW_SITE_AT`
- `isContentVisible()` — single gate for all surfaces
- `filterByPublicationVisibility()` — repository filter

## 4. Development preview

- Default: `DEV_PREVIEW` + `PREVIEW_MODE=all` → scheduled content visible
- `PREVIEW_MODE=public` → production-like
- `PREVIEW_MODE=as-of` + `PREVIEW_SITE_AT` → time travel
- `DEV_SHOW_DRAFTS=true` → include drafts
- UI: `DevPreviewBanner`, `ScheduledContentBadge`

## 5. Production visibility

Unchanged gate semantics: future scheduled → not visible. Routes 404 via filtered `get*BySlug()`.

## 6. Preview-as-of-date

`npm run dev:preview -- --date=…` sets `PREVIEW_SITE_AT`.

## 7. Search integration

`buildSearchIndexFromSources({ context })` passes list options to all catalogue getters. Dev skips precompiled index when not in public mode.

## 8. Sitemap integration

`isEntityIndexable()` accepts `PublicationContext`; sitemap uses `getSitemapPublicationContext()` (always public).

## 9. Routing

`generateStaticParams` still uses public slugs at build. Post-schedule visibility requires `content:publish` runner + revalidation (existing engine).

## 10. Caching / revalidation

Existing `resolveRevalidationTags` / `requestRevalidation` unchanged. Documented in publishing-engine.md.

## 11. Agent updates

New agents:

- `ScheduledContentAuditAgent` → `SCHEDULED-CONTENT-AUDIT-LATEST.md`
- `ContentCalendarAgent` → `CONTENT-CALENDAR-LATEST.md`
- `PostPublicationAuditAgent` → `POST-PUBLICATION-AUDIT-LATEST.md`

## 12. Product onboarding

Still defaults to draft (`product-factory.ts`). Scheduling via publishing CLI / metadata after pipeline completion.

## 13. Launch manifests

`src/services/publishing/launches.ts` — `writeLaunchManifest`, `writeScheduledContentReport`.

## 14. Testing

- `src/domain/publication-context.test.ts` — context matrix, FutureCRM fixture, fake clock
- `src/services/publishing/publication-safety.test.ts` — CI gate for PUBLIC leakage

## 15. SEO safeguards

Scheduled content in dev: `isIndexable` false when `isScheduledFuture`. Preview banner only in non-production builds.

## 16. Security

Visibility enforced in repository/search build layers — not client-side CSS hiding.

## 17. Known limitations

- `AUTHORIZED_PREVIEW` via draftMode still page-scoped; dev preview is env-based globally
- Onboarding CLI does not yet accept `--publish-at` (schedule via publishing CLI)
- `generateStaticParams` at build time won't include future slugs — on-demand generation may be needed for zero-downtime new URLs (existing Next constraint)
- Launch slug filter (`PREVIEW_LAUNCH`) is documented; full bundle resolver is incremental

## 18. Future improvements

- Secure staging preview tokens (`AUTHORIZED_PREVIEW` on production host)
- Onboarding `--publish-at` flag wiring to schedule phase
- Cron integration doc for `runPublishDue` in production
- Scheduled badges on search result cards in dev

## Verification

```bash
npm run typecheck
npm run test -- src/domain/publication-context.test.ts src/services/publishing/publication-safety.test.ts
PREVIEW_MODE=public npm run dev   # scheduled hidden
npm run dev                        # scheduled visible (development)
```
