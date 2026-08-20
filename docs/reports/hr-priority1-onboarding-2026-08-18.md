# HR Priority-1 onboarding — BambooHR, Rippling, Gusto, Greenhouse, Workable

**Date:** 2026-08-18  
**Scope:** Credibility gaps from [`hr-product-coverage.md`](./hr-product-coverage.md) Priority 1 (not previously onboarded).  
**Freshteam:** skipped — Freshworks sunset (renewals stopped ~Mar 2026; site redirects to Freshservice for Business Teams). **Workable** substituted as the fifth ATS peer.

Wave-1 (Breezy HR, Connecteam, Jibble, Trainual) already onboarded — not rewritten except Breezy competitor/alternative slugs.

## Products

| Product | Slug | Job cluster | Overall | Best-page role | CQ review |
| --- | --- | --- | ---: | --- | ---: |
| Rippling | `rippling` | people-platform | **8.0** | People-platform award | **91** |
| Greenhouse | `greenhouse` | ats-recruiting | **8.0** | ATS cluster award | **91** |
| BambooHR | `bamboohr` | hris-core | **7.8** | Core HRIS award | **91** |
| Workable | `workable` | ats-recruiting | **7.2** | ATS published-floor + trial peer | **91** |
| Gusto | `gusto` | payroll-benefits | **7.1** | Payroll & benefits award | **91** |

Methodology: `hr-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded. Category seed expanded to **v1.1.0**.

## Delivered

- Seed entries in `src/data/seed/software.ts` (158 → **163**)
- Research packs under `src/data/research/{slug}/`
- Approved HR assessments + product reviews
- Brand logos in `public/brands/` (vendor marks where fetchable; **Gusto is an SG lettermark**)
- Best HR page: new cluster awards + ATS peer landscape
- 6 approved HR comparisons
- Category definition v1.1 (HRIS / payroll / people-platform features + use cases); `activated/hr.json` synced
- Hub depth for `core-hris`, `payroll-benefits`, `people-platform` use cases and `core-hris` / `payroll-processing` / `benefits-admin` capabilities
- `aff-freshteam` inventory note: skip / sunset
- Batch: `scripts/onboard-hr-priority1-batch.mjs` + `scripts/lib/hr-priority1-products.mjs`

## Pricing grounding (2026-08-18)

| Product | Confidence | Floors |
| --- | --- | --- |
| BambooHR | high | Core **$10** PEPM (>25 employees); ≤25 from **$250**/mo flat; Pro **$17** / Elite **$25** PEPM |
| Rippling | high (floor only) | **$8**/user/mo + **$40**/mo platform fee; modules quote-stacked |
| Gusto | high | Simple **$49**/mo + **$6**/person; Plus **$80** + **$12**; Premium **$180** + **$22** |
| Greenhouse | high | Custom quote — Core / Plus / Pro; **no published seat $** |
| Workable | high (1–20 band) | Standard **$299**/mo annual; Premier **$599**; Enterprise **$719**; 15-day trial |

## Comparisons added

- bamboohr-vs-rippling  
- bamboohr-vs-gusto  
- gusto-vs-rippling  
- greenhouse-vs-workable  
- breezy-hr-vs-greenhouse  
- breezy-hr-vs-workable  

## Best-page cluster awards

- Core HRIS → BambooHR  
- People platform → Rippling  
- Payroll & benefits → Gusto  
- ATS / recruiting → Greenhouse (Breezy = free-tier path; Workable = published-floor peer)  
- Frontline WFM / time / SOP / LMS unchanged from Wave-1  

## Quality / gates

- Assessments + reviews: **approved**, handsOnTesting=false, product-review CQ **91 ≥ 75**  
- No WordPress auto-publish  
- Logos: mix of fetched vendor marks and SG lettermark (Gusto) — replace with press-kit assets when available  
- Product-guide pages auto-include new HR primaries via `buildAllHrProductGuides()` — GenerateImage teaching packs are a follow-up  

## Follow-ups

- Priority 2: Homebase / When I Work / Deputy / HiBob / Personio  
- Priority 3: Workday / ADP / UKG landscape  
- GenerateImage product teaching visuals + unique product-guide heroes  
- Official YouTube embeds not wired this pass  
- WP publish of HR hubs/reviews (optional, after P1 minimum — now met in Next.js)
