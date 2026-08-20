# CRM RFP / Vendor Brief Builder — Implementation Report

**Route:** `/tools/crm-rfp-builder/`  
**Date:** 2026-08-17  
**Status:** Shipped (interactive tool)

## Architecture

| Layer | Location |
| --- | --- |
| Schema | `src/domain/schemas/crm-rfp.ts` |
| Engine | `src/services/rfp-builder/*` |
| UI | `src/components/rfp-builder/*` |
| Page | `src/app/(site)/tools/crm-rfp-builder/page.tsx` |
| Docs | `docs/tools/crm-rfp-builder.md` |

Reuses `CrmDecisionProfile`, CRM graph labels, RFP pillar IDs (`CRM-REQ-*`),
dynamic `jspdf` / `xlsx`, tools registry, foundation privacy inventory, and
ROI-style wizard + live summary patterns.

## Modes

- **Vendor Brief** — core steps; security sheet omitted from Excel; concise PDF
- **Formal RFP** — all 10 steps including Security & Support; full workbook

Mode picker explains when a brief is enough.

## Requirements integration

- Import from Requirements Builder (`sg-crm-decision-profile-v1`)
- Priority map: must-have → Must Have, important → Should Have, nice-to-have → Could Have; skips not-needed
- Stable IDs: pillar slugs map to `CRM-REQ-001…010`
- Library seed from `crm-rfp-requirements.ts` (labelled library/template)
- Manual add/edit with MoSCoW priorities + mandatory flag
- Vague-requirement detector offers suggested wording (never silent rewrite)

## Data model

`CrmRfpSession` holds mode, wizard step, draft (project, context, objectives,
scope, users, requirements, integrations, migration, implementation, security,
support, commercials, response rules, clarifications, vendor tracker), version
metadata and change log.

Storage key: `sg-crm-rfp-brief-v1`

## Exports

| Format | Notes |
| --- | --- |
| PDF | Brief or Formal section set; legend included |
| Excel | Mode-filtered sheets `00`–`14`; pricing formulas; blank vendor inputs |
| Markdown | Collaborative editable package |
| Copy text | Plain-text clipboard |

Multi-vendor pack exports identical PDF+Excel with optional vendor name labels.

## Response model

Delivery methods: NATIVE / CONFIGURATION / CUSTOM / THIRD PARTY / ROADMAP /
NOT SUPPORTED / N/A — consistent in tool, PDF, Excel, Markdown.

Import contract: `VendorResponsePackage` → Scorecard evidence by requirement ID
(`import-contract.ts`). Full Excel parse deferred; JSON contract stable now.

## RFP versioning

Fingerprint on issue; post-issue edits flag drift; regenerate bumps minor
version and appends change log (added/removed/modified). Optional freeze with
recorded changes allowed.

## Quality checks / readiness

Statuses: Ready / Ready with gaps / Incomplete — section breakdown, no fake scores.
Flags vague reqs, missing evidence on mandatory must-haves, critical integration
gaps, incomplete Y1–Y3 pricing assumptions, go-live before decision date,
bloated requirement counts.

## Scorecard integration

Does not score vendors. Results CTA → `/tools/crm-vendor-scorecard/`.
Evidence handoff shape documented for future import.

## SEO / analytics / a11y / performance

- Title/description/canonical/breadcrumbs/FAQ JSON-LD on tool page
- Events: `rfp_builder_started`, `rfp_mode_selected`, `rfp_requirements_imported`,
  `rfp_step_completed`, `rfp_generated`, `rfp_*_exported`, `rfp_scorecard_clicked`
  (no requirement text / commercial figures)
- Labels, stepper semantics, table headers, status text beyond colour
- PDF/Excel libraries dynamic-imported only on download

## Tests

`src/services/rfp-builder/rfp-builder.test.ts` — scenarios A–G plus workbook,
profile import, and import-contract mapping. **12/12 passed.**

## Limitations

- Excel native data-validation dropdowns limited under SheetJS
- Vendor workbook Excel→UI import not fully interactive yet (contract ready)
- Clarification log / vendor tracker are local aids (no email)
- Optional Vendor Brief security UI collapsed (switch to Formal for full section)
- Pre-existing repo `tsc` noise elsewhere (ROI Zod defaults, industry hub) unrelated

## Future opportunities

- Interactive Excel response import UI wired to Scorecard
- Optional Vendor Brief security mini-step
- Search index synonyms (crm rfp, vendor brief, procurement)
- Deep-link `?mode=vendor-brief|formal-rfp`
- Resource hub cross-links from static RFP template → live builder

## Verification run

- `vitest` rfp-builder + tools-hub: pass
- Schema typing for `crm-rfp.ts`: clean after Zod default fixes
- Manual: open `/tools/crm-rfp-builder/`, select both modes, import library,
  generate, download PDF/Excel/Markdown
