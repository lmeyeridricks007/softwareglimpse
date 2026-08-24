# Tier 4 editorial anchors — October 2026 launch

**Window:** Thursday 1 October through Wednesday 28 October 2026  
**Cadence:** 2 guides every ~3 days, 08:00 Europe/Amsterdam (`06:00:00.000Z`)

Adds product-scoped **educational what-is** guides for 20 non-affiliate CRM category leaders. Reviews, 5-kind packs, and comparisons are already approved — this rollout deepens the **guide cluster** layer only.

## Calendar

| Date (Amsterdam) | What-is guides |
| --- | --- |
| **1 Oct** | mailchimp · pardot |
| **4 Oct** | zendesk · salesforce |
| **7 Oct** | monday-sales-crm · streak |
| **10 Oct** | dynamics-365 · zoho-crm |
| **13 Oct** | attio · copper |
| **16 Oct** | nutshell · insightly |
| **19 Oct** | bitrix24 · oracle-cx |
| **22 Oct** | sugarcrm · creatio |
| **25 Oct** | nimble · agile-crm |
| **28 Oct** | affinity · apptivo |

## What this does not schedule

- **Net-new product reviews** — already published
- **Comparison approval** — anchor products already have approved comparison graphs
- **Use-case hub builds** — track separately via `npm run catalogue:opportunities` category detail

Post-launch depth: run `refresh-agent` on pricing staleness per product after guides go live.

## Config source of truth

- Schedule: `src/data/config/publishing/tier-4-editorial-anchor-launch-2026-10-01.ts`
- Guide factory: `src/services/product-guides/affiliate-deepen.ts` (`variant: "editorial-anchor"`)
- Seed: `src/data/seed/guides-product-editorial-anchors.ts`
- Schedules: `npm run catalogue:tier4-schedules`

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2026-10-01T08:00:00+02:00
npm run dev:as-of -- --date=2026-10-28T08:00:00+02:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```
