# Tier 6 CRM affiliate deepen — December 2026 launch

**Window:** Tuesday 1 December through Friday 4 December 2026  
**Cadence:** 1 educational what-is guide per batch, every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Adds the missing **educational** layer for 2 high-traffic CRM affiliates deferred from [Tier 2](./tier-2-deepen-2026-09-01.md). Worth-it guides (`is-{slug}-worth-it`) are **already published** in each pack — this rollout schedules only `what-is-{slug}` educational guides.

## Calendar

| Date (Amsterdam) | Products (what-is guides) |
| --- | --- |
| **1 Dec** | keap |
| **4 Dec** | hubspot |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-6-crm-affiliate-deepen-launch-2026-12-01.ts`
- Guide factory: `src/services/product-guides/affiliate-deepen.ts` (`variant: "affiliate"`)
- Seed export: `src/data/seed/guides-product-crm-affiliate-deepen.ts`
- Publishing schedules: `npm run catalogue:tier6-schedules` → `src/data/publishing/schedules/content__guide__what-is-*.json`

## Worth-it pairing

Each what-is guide links to the existing pack guide at `/guides/is-{slug}-worth-it/`. Do not duplicate that slug in `guidesSeed`.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2026-12-01T08:00:00+01:00
npm run dev:as-of -- --date=2026-12-04T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier6-schedules
```
