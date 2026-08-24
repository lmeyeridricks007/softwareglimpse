# Tier 12 project-management affiliate deepen — 1–13 February 2027 launch

**Window:** Monday 1 February through Saturday 13 February 2027  
**Cadence:** ~1–2 educational what-is guides every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Adds the missing **educational** layer for 8 project-management affiliates deferred from [Tier 2](./tier-2-deepen-2026-09-01.md). Worth-it guides (`is-{slug}-worth-it`) are **already published** in each pack — this rollout schedules only `what-is-{slug}` educational guides.

## Calendar

| Date (Amsterdam) | Products (what-is guides) |
| --- | --- |
| **1 Feb** | monday, foxit |
| **4 Feb** | hive, office-timeline |
| **7 Feb** | webcatalog, getscreen-me |
| **10 Feb** | mrpeasy |
| **13 Feb** | vektoros |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-12-pm-affiliate-deepen-launch-2027-02-01.ts`
- Guide factory: `src/services/product-guides/affiliate-deepen.ts` (`variant: "affiliate"`)
- Seed export: `src/data/seed/guides-product-pm-affiliate-deepen.ts`
- Publishing schedules: `npm run catalogue:tier12-schedules` → `src/data/publishing/schedules/content__guide__what-is-*.json`

## Worth-it pairing

Each what-is guide links to the existing pack guide at `/guides/is-{slug}-worth-it/`.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2027-02-01T08:00:00+01:00
npm run dev:as-of -- --date=2027-02-13T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier12-schedules
```
