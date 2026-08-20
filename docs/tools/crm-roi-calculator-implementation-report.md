# CRM ROI Calculator — Implementation Report

**Route:** `/tools/crm-roi-calculator/`  
**Shipped:** 2026-08-16  
**Status:** Production-ready interactive tool (CRM-TOOL-004)

## Architecture reused

- Money / no-FX model (`src/domain/money.ts`)
- Unknown-cost discipline from TCO (`null` ≠ `0`)
- `TcoMoneyInput` for currency fields
- Finder page hero + tools registry + dynamic app loading
- Dynamic `jspdf` / `xlsx` imports (Requirements / resource-hub pattern)
- Cost Calculator localStorage handoff with explicit confirmation
- SEO page shell (metadata, breadcrumbs, FAQ JSON-LD, methodology SSR)

## Components created

| Path | Role |
| --- | --- |
| `src/domain/schemas/roi.ts` | Session / inputs Zod schema |
| `src/services/roi/compute.ts` | Pure ROI engine |
| `src/services/roi/persistence.ts` | localStorage + defaults |
| `src/services/roi/handoff.ts` | Cost / TCO import helpers |
| `src/services/roi/export.ts` | PDF + Excel |
| `src/services/roi/fixtures.ts` + `roi.test.ts` | Deterministic fixtures A–F |
| `src/components/roi/*` | Wizard, results, charts, methodology |
| `src/app/(site)/tools/crm-roi-calculator/page.tsx` | Indexable landing |

## Calculation formulas

Documented in [`crm-roi-calculator-methodology.md`](./crm-roi-calculator-methodology.md).

Highlights:

- Productivity = users × hours × weeks × hourly × **realization factor** (default 50%)
- Win-rate uses **percentage-point** improvement only
- 3-year ROI = (benefits − costs) / costs × 100
- Incomplete when material costs unknown (unless provisional allowed)
- Negative ROI shown plainly

## Cost Calculator integration

- Reads `sg-crm-cost-v1`
- CTA: “Use my CRM Cost Calculator estimate”
- Requires `window.confirm` before overwriting investment fields

## Business Case integration

- CTA requires confirmation
- Writes `sg-crm-roi-business-case-v1` handoff payload
- Navigates to `/resources/crm-business-case-template/`

## Exports

- PDF: executive summary / costs / benefits / cash flow / scenarios / assumptions
- Excel: sheets `00_READ_ME` … `10_SENSITIVITY`

## SEO

- Unique title + description + canonical path
- BreadcrumbList + WebPage + FAQ JSON-LD
- No crawlable personalized query-param result URLs

## Analytics

Privacy-safe events only (no financial amounts):  
`roi_started`, `roi_step_completed`, `roi_result_viewed`, `roi_exported`,
`roi_business_case_clicked`, `roi_cost_calculator_imported`, `roi_scenario_changed`

## Accessibility

- Real labels / hints on fields
- Sliders mirrored with numeric inputs
- Charts include `aria-label` / `sr-only` text summaries
- Type/confidence badges use text labels (not colour alone)
- Keyboard-reachable stepper and controls

## Performance

- App loaded via `next/dynamic`
- Charts are lightweight SVG/CSS (no chart library)
- PDF/Excel libraries dynamic-imported on export only

## Tests

`src/services/roi/roi.test.ts` — fixtures A–F plus realization, payback inputs,
adoption ramp, scenario comparison, break-even, invalid denominator.

## Limitations / future opportunities

- TCO product-result deep import UI is prepared in `applyTcoHandoff` but not
  fully wired as a one-click product picker (manual + Cost import primary paths)
- Business Case resource does not yet auto-fill PDF fields from handoff
  (payload is stored for future wiring)
- No live FX
- Educational benchmarks intentionally omitted until sourced/dated

## Quality gate (stakeholder lenses)

| Lens | Assessment |
| --- | --- |
| CFO | Avoids fake ROI; unknowns incomplete; scenario dependence visible |
| RevOps | Models productivity + cost avoidance with explicit formulas |
| Sales leader | Dashboard KPIs + break-even narrative in under two minutes |
| IT | Implementation / integration / internal labour included |
| Procurement | Assumption register with type + confidence + inclusion |
| Executive | Hero KPIs + assessment bands (not a fake 0–100 score) |
