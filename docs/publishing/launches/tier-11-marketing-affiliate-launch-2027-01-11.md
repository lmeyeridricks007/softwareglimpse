# Tier 11 marketing affiliate launch — 11–26 January 2027

**Window:** Tuesday 11 January through Tuesday 26 January 2027  
**Cadence:** ~1–2 pieces every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Clears the **WebinarJam & EverWebinar** hard gap (scheduled software launch) and schedules 11 deferred marketing affiliate **what-is** deepen guides moved out of [Tier 2](./tier-2-deepen-2026-09-01.md).

## Calendar

| Date (Amsterdam) | Content |
| --- | --- |
| **11 Jan** | `webinarjam-everwebinar` review + product · `what-is-learnworlds` |
| **14 Jan** | `what-is-kartra` · `what-is-socialbee` |
| **17 Jan** | `what-is-switcher-studio` · `what-is-whatconverts` |
| **20 Jan** | `what-is-diginius` · `what-is-zypper` |
| **23 Jan** | `what-is-leadpages` · `what-is-databox` |
| **26 Jan** | `what-is-evolve` · `what-is-lucrovox` |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-11-marketing-affiliate-launch-2027-01-11.ts`
- Software seed: `src/data/seed/software-affiliate-partner-gap.ts` (uses `tier11SoftwareScheduledAt`)
- Deepen seed: `src/data/seed/guides-product-marketing-affiliate-deepen.ts`
- Publishing schedules: `npm run catalogue:tier11-schedules`

## Worth-it pairing

Each what-is guide links to the existing pack guide at `/guides/is-{slug}-worth-it/`.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2027-01-11T08:00:00+01:00
npm run dev:as-of -- --date=2027-01-26T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier11-schedules
```
