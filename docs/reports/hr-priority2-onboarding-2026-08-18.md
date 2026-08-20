# HR Priority-2 onboarding — WFM peers, ATS landscape, mid-market / EU HRIS

**Date:** 2026-08-18  
**Scope:** White-space products from [`hr-product-coverage.md`](./hr-product-coverage.md) Priority 2.  
**All eight onboarded** (user chose the full P2 set).

Priority-1 (BambooHR, Rippling, Gusto, Greenhouse, Workable) and Wave-1 specialists already onboarded — cluster **awards unchanged**.

## Products

| Product | Slug | Job cluster | Overall | Best-page role | CQ review |
| --- | --- | --- | ---: | --- | ---: |
| Deputy | `deputy` | frontline-wfm | **8.2** | WFM peer | **91** |
| 7shifts | `7shifts` | frontline-wfm | **8.2** | Hospitality WFM landscape | **91** |
| Homebase | `homebase` | frontline-wfm | **8.1** | SMB hourly WFM peer | **91** |
| HiBob | `hibob` | hris-core | **8.0** | Mid-market HRIS path | **91** |
| When I Work | `when-i-work` | frontline-wfm | **7.9** | Per-user scheduling path | **91** |
| Ashby | `ashby` | ats-recruiting | **7.9** | Modern ATS landscape | **91** |
| Personio | `personio` | hris-core | **7.7** | EU HRIS path | **91** |
| Lever | `lever` | ats-recruiting | **7.6** | ATS+CRM landscape | **91** |

Methodology: `hr-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded. Category seed still **v1.1.0** (no methodology bump).

Connecteam **8.3** remains the frontline-WFM award (Deputy/7shifts sit at 8.2). Greenhouse **8.0** remains the ATS award (Ashby 7.9 is landscape). BambooHR **7.8** remains the core-HRIS award for published SMB PEPM even though HiBob’s overall is 8.0 — HiBob is the mid-market culture path, not a stolen undifferentiated #1.

## Delivered

- Seed entries in `src/data/seed/software.ts` (163 → **171**)
- Research packs under `src/data/research/{slug}/`
- Approved HR assessments + product reviews
- Brand logos in `public/brands/` (vendor marks where fetchable; **When I Work, 7shifts, Lever, Personio are SG lettermarks**)
- Best HR page: P2 landscape + decision paths; cluster awards unchanged
- 9 approved HR comparisons
- `seedProductSlugs` + classification notes in `hr.ts` / `activated/hr.json`
- Use-case hub product notes + category-hub example match
- Batch: `scripts/onboard-hr-priority2-batch.mjs` + `scripts/lib/hr-priority2-products.mjs`

## Pricing grounding (2026-08-18)

| Product | Confidence | Floors |
| --- | --- | --- |
| Homebase | high | Free Basic (1 loc, ≤10 ee). Paid per location annual: Essentials **$24** / Plus **$56** / All-in-One **$96**. 14-day All-in-One trial |
| When I Work | high (scheduling) | Essentials **$2.50** / Pro **$5** / Premium **$8** per user/mo. T&A toggle **not** on the price card. 14-day trial |
| Deputy | high | Lite **$5** / Core **$6.50** / Pro **$9** per user/mo. **$30** invoice minimum. Up to 31-day trial |
| 7shifts | high (paid tiers) | Essentials **$44.99**/loc (≤30 ee) / Pro **$89.99** (≤60) / Premium **$149.99** unlimited. 14-day Pro trial |
| Lever | high (no list $) | Custom quote only |
| Ashby | high | Foundations **$400**/mo (≤100 employees, 10% off annual). Plus/Enterprise quote |
| HiBob | high (no list $) | Custom PEPM; Bob Core included; modules extra |
| Personio | high (EUR only) | Core from **€7.60 PEPM**. **No USD invented.** CorePro / Apps quote. 12-month minimum |

## Comparisons added

- connecteam-vs-homebase  
- homebase-vs-when-i-work  
- connecteam-vs-deputy  
- 7shifts-vs-homebase  
- ashby-vs-greenhouse  
- greenhouse-vs-lever  
- ashby-vs-lever  
- bamboohr-vs-hibob  
- hibob-vs-personio  

## Best-page cluster awards (unchanged)

- Core HRIS → BambooHR (HiBob mid-market path; Personio EU path)  
- People platform → Rippling  
- Payroll & benefits → Gusto  
- ATS / recruiting → Greenhouse (Lever / Ashby landscape)  
- Frontline WFM → Connecteam (Homebase / When I Work / Deputy peers; 7shifts hospitality landscape)  
- Time / SOP / LMS unchanged from Wave-1  

## Quality / gates

- Assessments + reviews: **approved**, handsOnTesting=false, product-review CQ **91 ≥ 75**  
- No WordPress auto-publish  
- Logos: mix of fetched vendor marks and SG lettermarks — replace with press-kit assets when available  
- Product-guide pages auto-include new HR primaries via `buildAllHrProductGuides()` — GenerateImage teaching packs are a follow-up  

## Follow-ups

- Priority 3: Workday / ADP Workforce Now / UKG / Oracle HCM and/or Dayforce / Paylocity or Paycor  
- Priority 4: Lattice, 15Five, Culture Amp, Deel, TalentLMS/Docebo, optional FlexiQuiz  
- GenerateImage product teaching visuals + unique product-guide heroes  
- Official YouTube embeds not wired this pass  
- WP publish of HR hubs/reviews (optional, after Next.js depth)
