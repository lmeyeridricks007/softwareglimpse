# Tier 9 HR / ops affiliate deepen — 15–30 December 2026 launch

**Window:** Tuesday 15 December through Wednesday 30 December 2026  
**Cadence:** ~1–2 educational what-is guides every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Adds the missing **educational** layer for 8 HR / workforce / ops affiliates deferred from [Tier 2](./tier-2-deepen-2026-09-01.md). Worth-it guides (`is-{slug}-worth-it`) are **already published** in each pack — this rollout schedules only `what-is-{slug}` educational guides.

## Calendar

| Date (Amsterdam) | Products (what-is guides) |
| --- | --- |
| **15 Dec** | connecteam, navan |
| **18 Dec** | trainual, breezy-hr |
| **21 Dec** | jibble |
| **24 Dec** | dext |
| **27 Dec** | carepatron |
| **30 Dec** | flexiquiz |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-9-hr-affiliate-deepen-launch-2026-12-15.ts`
- Guide factory: `src/services/product-guides/affiliate-deepen.ts` (`variant: "affiliate"`)
- Seed export: `src/data/seed/guides-product-hr-affiliate-deepen.ts`
- Publishing schedules: `npm run catalogue:tier9-schedules` → `src/data/publishing/schedules/content__guide__what-is-*.json`

## Worth-it pairing

Each what-is guide links to the existing pack guide at `/guides/is-{slug}-worth-it/`. Do not duplicate that slug in `guidesSeed`.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2026-12-15T08:00:00+01:00
npm run dev:as-of -- --date=2026-12-30T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier9-schedules
```
