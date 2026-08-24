# Tier 5 AI affiliate deepen — November 2026 launch

**Window:** Sunday 1 November through Monday 10 November 2026  
**Cadence:** 2 educational what-is guides per batch, every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Adds the missing **educational** layer for 8 AI-category affiliate products deferred from [Tier 2](./tier-2-deepen-2026-09-01.md). Worth-it guides (`is-{slug}-worth-it`) are **already published** in each pack — this rollout schedules only `what-is-{slug}` educational guides.

## Calendar

| Date (Amsterdam) | Products (what-is guides) |
| --- | --- |
| **1 Nov** | quillbot, writesonic |
| **4 Nov** | elevenlabs, gamma |
| **7 Nov** | wegic, mindstudio |
| **10 Nov** | rank-prompt, emergent |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-5-ai-affiliate-deepen-launch-2026-11-01.ts`
- Guide factory: `src/services/product-guides/affiliate-deepen.ts` (`variant: "affiliate"`)
- Seed export: `src/data/seed/guides-product-ai-affiliate-deepen.ts`
- Publishing schedules: `npm run catalogue:tier5-schedules` → `src/data/publishing/schedules/content__guide__what-is-*.json`

## Worth-it pairing

Each what-is guide links to the existing pack guide at `/guides/is-{slug}-worth-it/`. Do not duplicate that slug in `guidesSeed`.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2026-11-01T08:00:00+01:00
npm run dev:as-of -- --date=2026-11-10T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier5-schedules
```
