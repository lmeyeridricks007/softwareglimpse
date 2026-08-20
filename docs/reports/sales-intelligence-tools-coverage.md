# Sales Intelligence — Tools Coverage

**Date:** 2026-08-17  
**Purpose:** Track interactive tools shipped for Sales Intelligence vs CRM pattern twins and shared routers.  
**Affiliate economics never drive rankings or tool scores.**

---

## Live SI tools

| Tool | Route | Status | Notes |
| --- | --- | --- | --- |
| Sales Intelligence Finder | `/tools/sales-intelligence-finder/` | Available | `si-finder-v1`; category eligibility parameterized |
| SI Requirements Builder | `/tools/sales-intelligence-requirements-builder/` | Available | Profile key `sg-si-decision-profile-v1`; lean `si-graph` |
| SI Vendor Scorecard | `/tools/sales-intelligence-vendor-scorecard/` | Available | SI criteria pack |
| SI Demo Checklist Builder | `/tools/sales-intelligence-demo-checklist-builder/` | Available | Coverage / sync / credits scenarios |
| SI RFP / Vendor Brief | `/tools/sales-intelligence-rfp-builder/` | Available | SI scope catalog |
| SI Readiness Assessment | `/tools/sales-intelligence-readiness-assessment/` | Available | SI dimension catalog |
| SI Cost Calculator | `/tools/sales-intelligence-cost-calculator/` | Available (partial honesty) | Seat/subscription list prices for products with calculable `rules[]`; credits + quote-only stay unknown. SI capability slugs wired into enrichment `featureSupport`. |
| SI Plan Selector | `/tools/sales-intelligence-plan-selector/` | Partial / limited | Verified plan matrices only |

## Pricing / research wiring (2026-08-17)

Fixes that made the SI Cost Calculator return real `$` ranges for typical caps (`contact-data`, `prospecting`, `crm-sync`):

1. **SI featureSupport** on legacy enrichments (`apollo`, `rocketreach`, `closely`, `amplemarket`, `reply`, …) — map SI catalogue slugs (not only CRM-ish `contact-management`).
2. **Plan `rules[]`** — convert account-level list prices previously stored as orphan `amountPerSeat` into calculable rules (`hunter`, `snov`, `uplead`, `kaspr`, `clay`, …); LinkedIn Sales Navigator stays per-seat.
3. **`pricing.model: "custom-quote"` → `"custom"`** so ZoomInfo / Cognism / ABM quote envelopes parse.
4. **Engine** `normalizePricingInput` in `build-snapshot.ts` as a durable guard for the same shapes.
5. **Copy** — cost UI uses `productNoun` from `SI_COST_CALCULATOR_CONFIG` (no leftover “Your CRM cost estimate”).

Still quote-required by design (no invented credit `$`): Lusha paid tiers, BookYourData credits, Clearbit usage, many enterprise SI packages.

## Shared / extended

| Tool | Route | SI extension |
| --- | --- | --- |
| Software Stack Builder | `/tools/software-stack-builder/` | SI requirement slot + CTA to SI Finder |
| Software Finder | `/tools/software-finder/` | Category router → CRM + SI finders |
| Software Cost Calculator | `/tools/software-cost-calculator/` | Category router → CRM + SI cost tools |

## Intentionally deferred (CRM-only / not SI twins)

- CRM Implementation Planner  
- CRM Migration Planner / Migration Cost Calculator  
- CRM Adoption / Health Assessment  
- Multi-product compare (CMP-003) — no CRM stub yet  
- Full cross-stack cost totals beyond the category router  

## Architecture notes

- Dedicated `/tools/sales-intelligence-*/` routes (not query-param forks of CRM).  
- Engines reused; SI content packs for criteria, scenarios, catalogs, questions.  
- DecisionProfile supports `crm` \| `sales-intelligence` with separate localStorage keys.  
- Category seed: `finderReadiness: "UI_READY"` for sales-intelligence.  
- Pricing remains honest about credits + custom quotes (never invent credit dollar totals).

## Related

- Product catalogue gaps: [`sales-intelligence-product-coverage.md`](./sales-intelligence-product-coverage.md)  
- Registry: `src/data/config/tools/registry.ts`  
