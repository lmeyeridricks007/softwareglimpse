# PM Priority-2 onboarding — Smartsheet, Wrike, Linear, Trello, Motion, Airtable

**Date:** 2026-08-17  
**Scope:** White-space / Priority-2 products from the Project Management coverage map.  
**Motion:** present in affiliate inventory (`aff-motion`) — scores still ignore affiliate economics.

## Products

| Product | Slug | Job cluster | Overall | Best-page role |
| --- | --- | --- | ---: | --- |
| Wrike | `wrike` | work-os | **8.1** | Work-OS rank #4 |
| Smartsheet | `smartsheet` | spreadsheet-pmo | **7.9** | Landscape — spreadsheet PMO |
| Linear | `linear` | eng-tracker | **7.9** | Landscape — modern eng tracker |
| Airtable | `airtable` | docs-db-hybrid | **7.2** | Landscape — database apps |
| Motion | `motion` | ai-calendar | **6.9** | Landscape — AI calendar / auto-scheduling |
| Trello | `trello` | lightweight-board | **6.6** | Landscape — lightweight Kanban |

Methodology: `project-management-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded.

## Delivered

- Seed entries in `src/data/seed/software.ts`
- Research / assessments / reviews under `src/data/research|editorial/`
- Brand logos + teaching visuals
- Best page: Wrike inserted into work-OS ranks; others landscape by cluster
- Comparisons include wrike-vs-smartsheet, jira-vs-linear, motion-vs-asana, asana-vs-wrike
- Batch: `scripts/onboard-pm-priority2-batch.mjs` + `scripts/lib/pm-priority2-products.mjs`

## Pricing grounding (2026-08-17)

| Product | Confidence | Floors |
| --- | --- | --- |
| Smartsheet | high | Pro **$9** / Business **$19** member/mo annual; Enterprise custom |
| Wrike | high | Free; Team **$10** / Business **$25** user/mo annual; Enterprise custom |
| Linear | medium | Free limited; Basic ~**$8** / Business ~**$14** user/mo annual |
| Trello | high | Free; Standard **$5** / Premium **$10** / Enterprise ~**$17.50** annual |
| Motion | high | Pro AI **$19** / Business AI **$29** seat/mo annual (+ credit packs) — usemotion.com/pricing |
| Airtable | medium | Free; Team ~**$20** / Business ~**$45** user/mo annual; Enterprise Scale custom |

## Best-page work-OS order (after P1+P2)

1. monday.com **8.6**  
2. Asana **8.3**  
3. ClickUp **8.3**  
4. Wrike **8.1**  
5. Hive **7.6**  

## Quality / gates

- Assessments + reviews approved; no WP auto-publish  
- Motion remains landscape (AI calendar) — not forced into Work OS # ranks  
- Smartsheet / Trello / Airtable / Linear landscape by job cluster  

## Follow-ups

- Optionally wire `aff-motion` → `motion` via affiliate mapping CLI  
- GenerateImage refresh for teaching visuals  
- Official YouTube embeds still open
