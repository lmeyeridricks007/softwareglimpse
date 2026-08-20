# Publishing engine

SoftwareGlimpse publishing/orchestration domain — lifecycle, versions, schedules, change events, refresh resolution, and runners.

## Design principles

1. **Live seeds stay authoritative for Phase 0 public pages** (`src/data/seed/*`). Publishing ops store under `src/data/publishing/` is additive for orchestration, CLI, and POC tests.
2. **Never overwrite a published version body** — allocate a new version; update the live pointer.
3. **Automation Level 2** — runners may schedule-publish approved content and queue refresh *drafts*; they **never** auto-publish editorial rewrites.
4. **UTC everywhere** — store timestamps as ISO-8601 with `Z` (e.g. `2026-08-13T12:00:00.000Z`). Gates compare with `Date` in UTC.

## PublishStatus state machine

Keep existing seed-compatible values. Added ops-only statuses: `rejected`, `refreshing`.

```text
idea → researching → draft → review → approved → scheduled → published
                                         ↘ published (publish now)
published → refresh-needed → refreshing → review → approved → published
any sensible* → rejected → draft
archived → draft (restore only)
```

\*Reject from idea/researching/draft/review/approved/scheduled (and published when retiring without archive). Archived cannot go to published without restore → draft.

### Conceptual aliases (not separate enum values)

| Concept | Mapping |
| --- | --- |
| research-needed | `idea` + `researchStatus: none` |
| research-complete | `researchStatus: complete` + `draft` |
| editorial-draft | `draft` |
| editorial-review | `review` |

### Public visibility

| Status | Listings / links / sitemap |
| --- | --- |
| draft / review / approved / rejected / archived | No |
| scheduled (future `scheduledAt`) | No |
| published / refresh-needed / refreshing | Yes (if gate + SEO allow) |

Gate: `isPubliclyAvailable` / `getPublicationState` in `src/domain/publishing.ts`.

`published` + `refresh-needed` (or `refreshing`) remains public — live copy stays up while refresh work proceeds on a draft version.

## RefreshStatus (separate schema)

`current | refresh-recommended | refresh-required | refresh-in-progress | review-required`

Independent of `PublishStatus`. Lives on registry entries / refresh candidates.

## ContentId

Pattern: `content:{type-segment}:{slug}`

Examples:

- `content:software:pipedrive`
- `content:compare:freshsales-vs-pipedrive` (`comparison` type → `compare` segment)
- `content:best:crm-software`
- `content:pricing:pipedrive`
- `content:tool:crm-finder`
- `content:category:crm`

Helpers: `buildContentId` / `parseContentId` (`src/domain/schemas/publishing-ops.ts`, `src/services/publishing/ids.ts`).

Filenames replace `:` with `__`.

## Live vs version-bound policy

| Concern | Live (seed / registry metadata) | Version-bound |
| --- | --- | --- |
| Public URL status | `metadata.status` on entity | — |
| Body / editorial snapshot | Points via `liveVersion` | `ContentVersion` under `versions/` |
| Approval | — | version `status: approved` |
| Schedule | `scheduledAt` + `schedules/*.json` | `approvedVersion` on schedule |
| First publish | `firstPublishedAt` preserved | `publishedAt` on version |
| Affiliate URL / availability | Live-bound | — |
| Research checked dates | Live-bound | — |
| Editorial prose / verdicts / rankings | — | Version-bound |
| Pricing structured facts | May be live-bound (calculators) | — |
| Pricing / value prose | — | Version-bound |

Republish updates `lastPublishedAt` only; **never** resets `firstPublishedAt`.

## Review policies

| Page type | maxAgeDays |
| --- | --- |
| software | 90 |
| pricing | 30 |
| comparison | 90 |
| best | 60 |
| alternatives | 90 |
| guide / category / tool | 180 |

Config: `src/data/config/publishing/review-policies.ts`.

## Refresh rules (summary)

Config: `src/data/config/publishing/refresh-rules.ts`.

| Change | Impact |
| --- | --- |
| Pricing updated | pricing **HIGH**, software **HIGH**, comparisons **HIGH** (dependents), best **MEDIUM/normal**, calculator tool operational |
| Affiliate URL | **HIGH** operational — no editorial rewrite required |
| Feature updated | software **HIGH**, comparison **MEDIUM/normal** |
| Discontinued | **CRITICAL** all dependents |
| Guide (“what is crm”) | **Not** affected by product pricing |

Resolver: `resolveRefreshCandidates(changeEvent)` → `RefreshCandidate[]`.

## Revalidation tags

`resolveRevalidationTags(contentId | changeEvent)` returns tags like:

- `software:pipedrive`
- `pricing:pipedrive`
- `compare:freshsales-vs-pipedrive`

Next.js adapter:

```ts
import { revalidateTag } from "next/cache";
for (const tag of resolveRevalidationTags(contentId)) {
  revalidateTag(tag);
}
```

Stub `requestRevalidation(tags)` is a no-op (logs when `SG_LOG_REVALIDATE` is set).

## File store layout

Under `src/data/publishing/`:

```text
schedules/{contentId-safe}.json
versions/{contentId-safe}/{version}.json
events/change-events.jsonl
jobs/{id}.json
audit/{contentId-safe}.jsonl
refresh/{contentId-safe}.json
fixtures/   # POC / tests only — not live seeds
```

Override root in tests: `SG_PUBLISHING_ROOT`.

## Services

| Module | Role |
| --- | --- |
| `ids.ts` | ContentId helpers |
| `registry.ts` | `buildContentRegistry()` from seeds + pricing + tools |
| `resolver.ts` | `getPublicationState` wrappers / sitemap filter |
| `transitions.ts` | `applyTransition` + audit |
| `approve.ts` / `schedule.ts` / `publish.ts` / `unpublish.ts` | Lifecycle ops |
| `versions.ts` | Draft/live isolation |
| `refresh-resolver.ts` | ChangeEvent → candidates |
| `runners/publish-runner.ts` | Due schedules → publish (idempotent) |
| `runners/refresh-scanner.ts` | Stale review + events → candidates |
| `runners/refresh-runner.ts` | Queue jobs + draft stubs — **no auto-publish** |

Import pure helpers from `@/services/publishing`.  
Import fs/registry/runners from `@/services/publishing/server`.

## Live-bound vs version-bound facts

| Binding | Examples | Refresh behaviour |
| --- | --- | --- |
| **Live-bound** | Affiliate URL, availability/discontinued, research checked dates, structured pricing facts used by calculators | Update live metadata/store without rewriting editorial prose; may mark dependents refresh-recommended |
| **Version-bound** | Editorial prose, verdicts, rankings, comparison narratives, “value” commentary | New `ContentVersion` draft → approve → publish; never auto-publish at Level 2 |

Pricing **structured facts** may be live-bound for calculators; pricing **value prose** on product/pricing pages is version-bound.

## CLI

Consolidated entrypoint (`scripts/publishing-cli.ts`):

```bash
npm run publishing -- status
npm run publishing -- status --category crm
npm run publishing -- calendar --from 2026-08-01 --to 2026-09-30
npm run publishing -- graph -- pipedrive
npm run publishing -- publish --dry-run
npm run publishing -- publish
npm run publishing -- schedule -- content:compare:freshsales-vs-pipedrive --at 2026-08-20T07:00:00.000Z
npm run publishing -- refresh:scan
npm run publishing -- refresh:status
npm run publishing -- refresh:run --dry-run
npm run publishing -- validate
```

Convenience aliases: `content:status`, `content:calendar`, `content:publish`, `content:graph`, `refresh:scan`, `refresh:status`, `refresh:run`, `publishing:validate`.

Prefer `--dry-run` and fixtures under `src/data/publishing/fixtures/` — do not flip live CRM seed publication statuses for demos.

## Preview (Draft Mode)

- Enable: `GET /api/preview?secret=$PREVIEW_SECRET&slug=/software/pipedrive/`
- Disable: `GET|POST /api/preview/disable?slug=/software/pipedrive/`
- Missing/invalid `PREVIEW_SECRET` → 401
- Preview responses are **noindex**; sitemap still uses `isEntityIndexable` without draftMode

## Fixtures

`src/data/publishing/fixtures/` — POC only. Do **not** change live seed publication statuses in `software.ts` etc.

## Quality / canPublish

`canPublish(entry, context)` requires `approved|scheduled`, optional `qualityOk` / `depsValid`, and schedule due for scheduled items. `approved → published` (publish now) is allowed without waiting on `scheduledAt`.

Operational analytics event names (audit store is source of truth for ops): `content_published`, `content_updated`, `content_archived`.
