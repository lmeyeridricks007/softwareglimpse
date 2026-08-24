# Tier 7 CS short guides — November 2026 launch

**Window:** Sunday 1 November through Monday 16 November 2026  
**Cadence:** 1 CS primary per slot (what-is + is-worth-it pair), every 3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Schedules the **deferred** CS short guides moved out of [Tier 1](./tier-1-content-2026-08-26.md). Five primaries remain **published** from the Aug 2026 wave — no reschedule.

## Already live (Aug 2026)

`freshdesk`, `zendesk-suite`, `help-scout`, `gorgias`, `tidio` — both `what-is-{slug}` and `is-{slug}-worth-it` published in `guides-product-cs.ts`.

## November calendar (deferred primaries)

| Date (Amsterdam) | Product | Guides |
| --- | --- | --- |
| **1 Nov** | freshservice | `what-is-freshservice` · `is-freshservice-worth-it` |
| **4 Nov** | freshchat | `what-is-freshchat` · `is-freshchat-worth-it` |
| **7 Nov** | livechat | `what-is-livechat` · `is-livechat-worth-it` |
| **10 Nov** | zoho-desk | `what-is-zoho-desk` · `is-zoho-desk-worth-it` |
| **13 Nov** | nicejob | `what-is-nicejob` · `is-nicejob-worth-it` |
| **16 Nov** | shore | `what-is-shore` · `is-shore-worth-it` |

## Config source of truth

- Schedule: `src/data/config/publishing/tier-7-cs-short-guides-launch-2026-11-01.ts`
- Guide seed: `src/data/seed/guides-product-cs.ts`
- Publishing schedules: `npm run catalogue:tier7-schedules` → `src/data/publishing/schedules/content__guide__*.json`

## Structural note

CS remains on **short guides only** (`guides-product-cs.ts`) — not the generated 5-kind `PRODUCT_GUIDE_BUILDERS` pack. Optional later: add `customer-service` to the pack builder.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2026-11-01T08:00:00+01:00
npm run dev:as-of -- --date=2026-11-16T08:00:00+01:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Regenerate schedules after config edits

```bash
npm run catalogue:tier7-schedules
```
