# Tier 10 IT-development affiliate deepen — 1–10 January 2027 launch

**Window:** Friday 1 January through Thursday 7 January 2027  
**Cadence:** 1 educational what-is guide every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Adds the missing **educational** layer for 3 IT-development affiliates deferred from [Tier 2](./tier-2-deepen-2026-09-01.md). Worth-it guides (`is-{slug}-worth-it`) are **already published** in each pack — this rollout schedules only `what-is-{slug}` educational guides.

## Calendar

| Date (Amsterdam) | Product (what-is guide) |
| --- | --- |
| **1 Jan** | bright-data |
| **4 Jan** | plesk |
| **7 Jan** | thordata |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-10-it-affiliate-deepen-launch-2027-01-01.ts`
- Guide factory: `src/services/product-guides/affiliate-deepen.ts` (`variant: "affiliate"`)
- Seed export: `src/data/seed/guides-product-it-affiliate-deepen.ts`
- Publishing schedules: `npm run catalogue:tier10-schedules` → `src/data/publishing/schedules/content__guide__what-is-*.json`

## Worth-it pairing

Each what-is guide links to the existing pack guide at `/guides/is-{slug}-worth-it/`. Do not duplicate that slug in `guidesSeed`.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2027-01-01T08:00:00+01:00
npm run dev:as-of -- --date=2027-01-07T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier10-schedules
```
