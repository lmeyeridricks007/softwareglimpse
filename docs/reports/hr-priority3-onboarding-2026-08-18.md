# HR Priority-3 onboarding — enterprise HCM & payroll-scale landscape

**Date:** 2026-08-18  
**Scope:** Landscape products from [`hr-product-coverage.md`](./hr-product-coverage.md) Priority 3.  
**All seven onboarded** (user chose the full P3 set).

Priority-1 / Priority-2 cluster **awards unchanged**. These names are **landscape only** — not false SMB peers of BambooHR or Gusto.

## Products

| Product | Slug | Job cluster | Overall | Best-page role | CQ review |
| --- | --- | --- | ---: | --- | ---: |
| Workday | `workday` | enterprise-hcm | **8.2** | Enterprise-HCM landscape award | **91** |
| UKG Pro | `ukg-pro` | enterprise-hcm | **8.1** | HCM + complex hourly WFM path | **91** |
| Oracle Cloud HCM | `oracle-hcm` | enterprise-hcm | **7.9** | Fusion ERP/EPM adjacency path | **91** |
| Dayforce | `dayforce` | enterprise-hcm | **7.8** | Continuous-calc payroll + time path | **91** |
| Paylocity | `paylocity` | payroll-benefits | **7.7** | Mid-market HR+payroll landscape | **91** |
| ADP Workforce Now | `adp-workforce-now` | payroll-benefits | **7.3** | Payroll/tax compliance landscape | **91** |
| Paycor | `paycor` | payroll-benefits | **7.3** | Paychex-orbit HCM landscape | **91** |

Methodology: `hr-editorial` v1.0.0. `handsOnTesting=false`. Affiliate economics excluded. Category seed **v1.2.0** (enterprise HCM include). Methodology version **not** bumped.

Workday **8.2** is the enterprise-HCM landscape award — not an SMB HRIS #1. UKG Pro **8.1** is the WFM-heavy enterprise path; **Connecteam 8.3** remains the frontline-WFM award. Paylocity **7.7** sits above Gusto **7.1** on overall score; **Gusto remains the published-SMB payroll award**.

## Delivered

- Seed entries in `src/data/seed/software.ts` (171 → **178**)
- Research packs under `src/data/research/{slug}/`
- Approved HR assessments + product reviews
- Brand logos in `public/brands/` (Paylocity and Paycor vendor marks; **Workday, Oracle Cloud HCM, UKG Pro, Dayforce, ADP Workforce Now are SG lettermarks**)
- Best HR page: enterprise-HCM landscape + payroll-scale landscape; cluster awards unchanged
- 8 approved HR comparisons
- `seedProductSlugs` + config v1.2.0 in `hr.ts` / `activated/hr.json`
- Use-case hub `enterprise-hcm` depth + payroll product notes + category-hub type
- Batch: `scripts/onboard-hr-priority3-batch.mjs` + `scripts/lib/hr-priority3-products.mjs`

## Pricing grounding (2026-08-18)

All seven are **custom quote**. No unpublished PEPM invented from third-party benchmarks.

| Product | Confidence | Floors |
| --- | --- | --- |
| Workday | high (no list $) | Custom PEPM; implementation-led TCO |
| Oracle Cloud HCM | high (no list $) | Contact sales; modular Fusion HCM |
| UKG Pro | high (no list $) | Custom quote. **UKG Ready is a different product**, not a Pro upgrade |
| Dayforce | high (no list $) | Custom quote (Ceridian brand) |
| ADP Workforce Now | high (named packs, no $) | Select / Plus / Premium — no published PEPM |
| Paylocity | high (no list $) | “Explore Payroll Pricing” → customized quote. Size bands 1–99 / 100–499 / 500+ |
| Paycor | high (no live list $) | Public rate card pulled after Paychex 2025. Historical $99+$6 **not** treated as live list |

## Comparisons added

- oracle-hcm-vs-workday  
- ukg-pro-vs-workday  
- dayforce-vs-workday  
- dayforce-vs-ukg-pro  
- adp-workforce-now-vs-gusto  
- gusto-vs-paylocity  
- paycor-vs-paylocity  
- adp-workforce-now-vs-paylocity  

## Best-page cluster awards (unchanged except new landscape cluster)

- Core HRIS → BambooHR (HiBob mid-market path; Personio EU path)  
- People platform → Rippling  
- Payroll & benefits → Gusto (ADP / Paylocity / Paycor landscape)  
- **Enterprise HCM → Workday landscape award** (Oracle / UKG Pro / Dayforce peers)  
- ATS / recruiting → Greenhouse  
- Frontline WFM → Connecteam (UKG Pro does not steal this award)  
- Time / SOP / LMS unchanged from Wave-1  

## Quality / gates

- Assessments + reviews: **approved**, handsOnTesting=false, product-review CQ **91 ≥ 75**  
- No WordPress auto-publish  
- Logos: mix of fetched vendor marks and SG lettermarks — replace with press-kit assets when available  
- Product-guide pages auto-include new HR primaries via `buildAllHrProductGuides()` — GenerateImage teaching packs are a follow-up  

## Follow-ups

- Priority 4: Lattice, 15Five, Culture Amp, Deel, TalentLMS/Docebo, optional FlexiQuiz  
- GenerateImage teaching visuals for enterprise-hcm use-case hub  
- WP publish (optional; live WordPress still has zero HR coverage)  
