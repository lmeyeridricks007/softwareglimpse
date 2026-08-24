# Catalogue gap fixes — 25 Aug 2026 launch

**Publish:** Monday 25 August 2026, 08:00 Europe/Amsterdam (`2026-08-25T06:00:00.000Z`)

Addresses [PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md](../catalogue/PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md) recommended actions.

## What goes live

| Content | Route(s) | Status until launch |
| --- | --- | --- |
| AI InteleKt review + product | `/software/ai-intelekt/` | **Moved to [28 Aug launch](./ai-intelekt-launch-2026-08-28.md)** |
| WebinarJam & EverWebinar review + product | `/software/webinarjam-everwebinar/` | **Moved to [1 Sep launch](./webinarjam-everwebinar-launch-2026-09-01.md)** |
| Sellfy review + product | `/software/sellfy/` | Production **404** |
| CS product guides (8) | `/guides/what-is-livechat/`, … | Production **404** |

### Guides scheduled

- `what-is-livechat` / `is-livechat-worth-it`
- `what-is-zoho-desk` / `is-zoho-desk-worth-it`
- `what-is-nicejob` / `is-nicejob-worth-it`
- `what-is-shore` / `is-shore-worth-it`

## What was fixed in-repo

1. **Editorial** — Approved assessment + review JSON for `webinarjam-everwebinar`; `ai-intelekt` moved to 28 Aug launch with full research merge.
2. **Software seed** — `sellfy` set to `metadata.status: scheduled` with 25 Aug `scheduledAt`; `webinarjam-everwebinar` and `ai-intelekt` moved to separate launch dates (1 Sep and 28 Aug).
3. **Guides** — Four CS cluster products added to `guides-product-cs.ts` with deferred launch metadata; publishing schedules in `src/data/publishing/schedules/content__guide__*.json`.
4. **Onboarding manifests** — `webinarjam-everwebinar` marked `ready`; `ai-intelekt` → separate 28 Aug launch.
5. **Publishing schedules** — `src/data/publishing/schedules/content__software__*.json` for software entries.

## Deferred (no tracking URL available)

Partner-link gaps **not** changed — inventory has no live `affiliateUrl` and we do not invent destinations:

| Slug | Reason |
| --- | --- |
| `instantly` | Affiliate application declined (inventory note) |
| `freshdesk`, `freshchat`, `freshservice`, `freshteam`, `freshmarketer`, `freshcaller`, `freshworks` | No configured Impact/Freshworks tracking URL in inventory |
| `motion`, `livestorm`, `rocketreach`, `uniqode` | Active inventory rows without published partner URLs |
| `canvas-score` | No software seed (marketing analytics — review before onboarding) |

## Onboarding manifests

All **309** seed products have manifests. As of **23 Aug 2026** reconcile:

| Status | Count |
| --- | ---: |
| `ready` | 309 |
| `review-required` | 0 |
| `blocked` | 0 |

The former **59** `review-required` rows (CRM core, email marketing, SI, marketing affiliates) were promoted when approved assessment + review + research enrichment were already on disk. Run `npm run onboard:manifest-reconcile` after future editorial catch-up.

Duplicate and research blockers (14 SKUs) were cleared in the same batch — see git history for `reconcile-manifest-2026-08-23`.

## Verify locally

```bash
# All content visible (drafts + scheduled)
npm run dev

# Production rules — scheduled routes 404 until 25 Aug
npm run dev:public

# Simulate launch day
npm run dev:as-of -- --date=2026-08-25T08:00:00+02:00
```

## Go live on schedule

Cron / manual publish runner:

```bash
npm run content:publish
```

Pre-flight:

```bash
npm run content:prepublish
npm test -- --run src/services/publishing/publication-safety.test.ts
```

## Config source of truth

`src/data/config/publishing/catalogue-gap-launch-2026-08-25.ts`
