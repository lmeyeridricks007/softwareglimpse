# CRM Migration Cost Calculator — Implementation Report

**Date:** 2026-08-17  
**Route:** `/tools/crm-migration-cost-calculator/`  
**Status:** Implemented

## Architecture

| Layer | Path |
| --- | --- |
| Schema | `src/domain/schemas/crm-migration-cost.ts` |
| Compute | `src/services/migration-cost/compute.ts` |
| Complexity | `src/services/migration-cost/complexity.ts` |
| Persistence / handoffs | `src/services/migration-cost/persistence.ts`, `handoff.ts` |
| Exports | `src/services/migration-cost/export.ts` |
| Tests / fixtures | `migration-cost.test.ts`, `fixtures.ts` |
| UI | `src/components/migration-cost/*` |
| Page | `src/app/(site)/tools/crm-migration-cost-calculator/page.tsx` |
| Docs | `docs/tools/crm-migration-cost-calculator.md` |

## Calculations

- Integer minor units throughout
- Unknown / blank ≠ €0
- Fixed quote, rate × days, people × hours × rate, tooling (incl. monthly × duration)
- Test cycles, hypercare, training (migration classification only)
- Contingency default 0%; optional apply-to buckets; exclude fixed licenses option
- Low/expected/high only when user supplies bounds
- Optional downtime scenario excluded from base total
- Scope reductions only with user-entered reduction amounts
- Phased allocated costs displayed separately

## Complexity rules

Deterministic scores for: sources, volume, data quality, history, attachments,
mapping, integrations, customization, testing. Migration-type classification is
a soft nudge only. Bands: low / moderate / high / very-high / unknown.

## Cost categories

Discovery, data preparation, mapping, integrations, migration execution, testing,
internal labour, training, cutover & hypercare, tooling, contingency, optional.

## Integrations

- Field mapping import from Migration Planner (`sg-crm-migration-plan-v1`) with confirm
- Soft readiness warnings from Readiness Assessment
- Confirmed handoffs to TCO, ROI, Business Case (+ Cost Calculator path)
- Double-count detection when ROI + TCO already hold migration amounts

## Exports

PDF (executive), Excel (14 sheets), Markdown, print.

## SEO

Canonical `/tools/crm-migration-cost-calculator/`, BreadcrumbList, WebPage,
WebApplication, FAQPage. No indexable user-result permutations.

## Analytics

Privacy-safe occurrence events only (no amounts, record counts, or system names).

## Tests

Vitest coverage for quotes, rate×days, internal labour, tooling, test cycles,
hypercare/training, contingency, ranges, unknowns, phased costs, scope toggles,
and fixtures A–F (simple → very high, unknown partner, no history, dirty data).

**Result:** `22/22` passed (`npm run test -- src/services/migration-cost/migration-cost.test.ts`).

**Lint:** clean on new migration-cost paths.

**Typecheck (tool scope):** no errors in `crm-migration-cost` / `migration-cost` files.
Full-repo `npm run build` still fails on pre-existing errors outside this tool
(industry hub, audience hub, SI seed snippets, etc.). `tsconfig.json` excludes
the incomplete `scripts/_si-priority1-seed-snippet.ts` seed snippet (same pattern
as the CRM migration seed snippet).

## Limitations

- No invented labour rates or vendor migration price claims
- Storage migration cost only if user-supplied
- Timeline only from user stage durations
- Quick mode not shipped (architecture supports completeness messaging later)

## Data gaps

- Live TCO/ROI apps do not yet auto-consume the new handoff keys on load
  (payload is saved; import UX can be wired in those tools next)
- Field Mapping resource Excel is separate from Migration Planner workspace import

## Quality gate (CFO / RevOps / IT / Data / Partner / Exec)

| Perspective | Met? |
| --- | --- |
| CFO — budget categories visible | Yes — buckets + categories + coverage % |
| RevOps — real migration work | Yes — objects, history, mapping, test cycles |
| IT — integrations/customization | Yes — inventory + rebuild/replace |
| Data lead — cleaning/mapping/history | Yes — quality + mapping + history impact |
| Partner — compare to proposal | Yes — up to 3 quotes vs internal model |
| Executive — top drivers | Yes — drivers + complexity profile |
