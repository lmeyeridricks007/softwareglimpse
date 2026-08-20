# CRM Plan Selector — Implementation Report

**Status:** Implemented  
**Route:** `/tools/crm-plan-selector/`  
**Date:** 2026-08-17

## 1. What was built

Interactive tool that answers: “I am considering CRM X — which plan should I buy?”

- Wizard (CRM → Team → Requirements → Usage → Growth → Results)
- Sticky live plan analysis panel (mockup-aligned)
- Recommendation engine separate from UI
- SEO landing content + FAQ JSON-LD
- Product hub pricing tab + `/pricing/[slug]/` CTAs with `?vendor=`
- Product plans guides CTA → Plan Selector
- Analytics events
- 1.5s delayed results reveal (`useDelayedResultsReveal`)
- Markdown download of recommendation (no email gate)
- Tools hub registry entry

## 2. Architecture

```
page.tsx (server)
  → listCrmPricingSnapshots()
  → DynamicCrmPlanSelectorApp
       → plan-selector UI (client)
            → analyzePlanSelection()  // pure service
                 → findMinimumSuitablePlan / calculatePlanCost / confidence
                 ← enrichment PricingSnapshot (no invented data)
```

| Layer | Location |
|-------|----------|
| Route / SEO | `src/app/(site)/tools/crm-plan-selector/page.tsx` |
| UI | `src/components/plan-selector/` |
| Engine | `src/services/plan-selector/` |
| Requirement catalog | `src/data/config/plan-selector/requirements.ts` |
| Domain answers | `src/domain/schemas/crm-plan-selector.ts` |
| Pricing data | Existing `src/data/research/*/enrichment.json` via `PricingSnapshot` |

## 3. Data sources

Canonical: research enrichment → `buildPricingSnapshot` → `listCrmPricingSnapshots()`.

Uses plan rules, `featureSupport.planSlugs`, seat caps (`limits.maxSeats`), `pricingCheckedAt`, sourceIds, logos.

Does **not** invent prices, limits, seat types, or AI availability.

## 4. Recommendation logic

Must-haves + enterprise hard gates are hard filters. Nice-to-haves never force upgrades. Lowest eligible calculable plan wins. Explainability: plan ladder, drivers, downgrade blockers, upgrade tradeoffs, coverage matrix, confidence reasons, unknowns. No blind highest-tier recommendation.

## 5. Supported vendors (current research)

Fully supported with complete plan→feature matrices (incl. after 2026-08-17 enrichment pass):

HubSpot, Pipedrive, Zoho CRM, Freshsales, monday Sales CRM, Close, Copper, Salesforce, Attio, **Mailchimp**, **Nimble**, **Tidio**.

- **Nimble**: genuine single public Business tier — classified supported (complete single-tier rule).
- **Mailchimp**: Free / Essentials / Standard / Premium with entry-band list prices (scales with contacts).
- **Tidio**: Free / Starter / Growth / Plus (+ Premium contact-sales) from tidio.com/pricing.

Prefill: `?vendor=hubspot` (alias `?product=`).

## 6. Pricing

Reuses `calculatePlanCost` for now + 12-month seats. Custom/empty-rule plans → no invented totals.

## 7. Tests

`src/services/plan-selector/plan-selector.test.ts` — 10 scenarios (basic cheapest, upgrade driver, nice-to-have optional, seat cap, unknown, SSO enterprise, no suitable plan, custom quote, growth cost, support classification). **All passing.**

## 8. Key files

**Added**

- `src/app/(site)/tools/crm-plan-selector/page.tsx`
- `src/components/plan-selector/*`
- `src/services/plan-selector/*`
- `src/domain/schemas/crm-plan-selector.ts`
- `src/data/config/plan-selector/requirements.ts`
- `docs/reports/crm-plan-selector-implementation.md`

**Updated**

- `src/data/config/tools/registry.ts`
- `src/components/tools/dynamic-tool-apps.tsx`
- `src/analytics/events.ts`
- `src/services/product-guides/blocks.ts`
- `src/services/software-review/build-review-model.ts`
- `src/components/software/hub/software-hub-pricing-tab.tsx`
- `src/app/(site)/pricing/[slug]/page.tsx`
- `src/domain/schemas/index.ts`

## 9. Unresolved data gaps

- Sparse usage-limit matrices beyond `maxSeats`
- Light/read-only seats not modelled in enrichment
- Admin features only where researched (SSO, audit-logs, role-permissions)
- monday Ultimate / Attio Enterprise often contact-sales
- Fixture-flagged research caps confidence at medium
- Catalog omits unverified marketing requirements rather than inventing them

## 10. Next improvements

1. Enrich numeric usage limits with sources
2. Model seat types where published
3. PDF export parity
4. Expand vendors as matrices complete
5. Wire static `PlanDecisionTree` editorial on product pages
