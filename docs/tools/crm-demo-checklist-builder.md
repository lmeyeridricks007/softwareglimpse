# CRM Demo Checklist Builder

## Purpose

Interactive buyer tool that turns CRM requirements into a **reusable demo agenda and evaluation workbook**. Every shortlisted vendor runs the same scripted scenarios so comparisons stay fair — vendor-led feature tours are replaced with observable tasks, success criteria, evidence rules and per-vendor scoring.

Primary question answered:

> What exactly should I make every CRM vendor demonstrate so that I can compare them fairly?

## Route

`/tools/crm-demo-checklist-builder/`

Registered in `src/data/config/tools/registry.ts` as `crm-demo-checklist-builder` (type: `builder`, status: `available`).

Companion static resource (blank template): `/resources/crm-demo-checklist/`

## Architecture

| Layer | Path |
| --- | --- |
| Schema | `src/domain/schemas/crm-demo-checklist.ts` |
| Services | `src/services/demo-checklist-builder/` |
| UI | `src/components/demo-checklist-builder/` |
| Page | `src/app/(site)/tools/crm-demo-checklist-builder/page.tsx` |
| Dynamic load | `DynamicCrmDemoChecklistBuilderApp` in `src/components/tools/dynamic-tool-apps.tsx` |

Layout mirrors the ROI calculator **3-column workspace**: left stepper · center step · right live summary (collapses on tablet/mobile).

## Data model

Normalized shape:

- **DemoPlan** (`CrmDemoChecklistDraft`) — shared script across vendors
  - setup, evaluation areas, scenarios, questions, integrations, admin/AI tasks, commercial questions, scoring rules, agenda, guidelines
- **VendorEvaluation** (`VendorDemoEvaluation[]`) — per-vendor results only
  - score, result, evidence status, must-have gate, notes, follow-ups

Storage key: `sg-crm-demo-checklist-v1` (privacy inventory in `foundation.ts`).

Session version: `1`.

## Workflow (10 steps)

1. Demo setup  
2. Evaluation priorities  
3. Demo scenarios  
4. Questions & checks  
5. Integrations & data  
6. Reporting & admin (includes AI tests)  
7. Commercial & impl. questions (ask, don’t demo)  
8. Scoring & evidence rules  
9. Agenda & time  
10. Review & generate → Results / exports

Autosave on every draft change. Backward/forward navigation preserves work via `maxReachableStepIndex`.

## Requirements integration

- **Import from Requirements Builder** reads `sg-crm-decision-profile-v1`
- Generates editable draft scenarios via `buildRequirementDemoTest` + CRM requirement graph labels
- Query seed: `?requirement=<slug>` adds the requirement to the shared profile and imports coverage
- Requirement detail CTAs now point at this tool (not only the static resource)

Imported tasks are clearly drafts — never presented as verified vendor facts.

## RFP integration

- **Import from RFP / Vendor Brief** reads `sg-crm-rfp-brief-v1` when present
- Maps RFP requirements (acceptance + evidence fields) into demo scenarios
- Project metadata (name, owner, decision date, vendor count) fills empty setup fields

## Scorecard integration

- Results handoff via `previewScorecardHandoff` / `applyScorecardHandoff`
- Maps demo outcomes → existing `DemoChecklistResult` on `sg-crm-vendor-scorecard-v1`
- **Does not silently overwrite** existing non-`not-tested` scorecard rows unless the user confirms
- Live summary CTA: Go to Vendor Scorecard

## Decision Matrix integration

- Must-have gates (`pass` / `fail` / `not-verified`) stay visible outside averages
- Results CTA links to `/resources/crm-comparison-worksheet/` (Decision Matrix resource)
- Scorecard demo checklist remains the interactive scoring home; matrix is the downloadable comparison companion

## Export formats

| Output | Purpose |
| --- | --- |
| Demo Checklist PDF | Evaluation workbook with checkboxes, score boxes, evidence lines |
| Demo Agenda PDF | Timed run-of-show: clock ranges, block titles, persona/objective, total vs allotted time, compact demo rules |
| Vendor Demo Brief PDF | Prep pack for vendors: environment expectations, rules, timed agenda, scenario cards with steps + success criteria, integrations/admin/AI prep, written commercial follow-ups |
| Excel workbook | README, Agenda, Checklist, Vendor Results, Coverage, Follow-ups, Summary |
| Markdown | Portable script for sharing outside SoftwareGlimpse |
| Print | Browser print of checklist view |

Uses existing **jsPDF** + **SheetJS (`xlsx`)** patterns (dynamic client import).

## Quality rules (deterministic)

`analyzeDemoQuality` checks:

- Missing persona / success criteria / evidence
- Vague demo tasks
- Uncovered must-have requirements
- Agenda time overrun
- Required integrations not marked for demo
- AI marked must-test without AI verification tasks
- Optional items consuming too much live time
- Heavy commercial blocks in the agenda

Readiness: Good / Needs work / Incomplete — transparent counters, not a opaque “AI score”.

## SEO

- Indexable tool page with H1, concise intro, FAQ sections
- JSON-LD: `WebPage`, `BreadcrumbList`, `FAQPage`, `SoftwareApplication` (no fabricated ratings)
- Internal links to Requirements Builder, RFP Builder, Scorecard, Decision Matrix resource, Cost/ROI/Finder, guides

## Analytics

Events (no PII / no full requirement text):

- `crm_demo_checklist_started`, `demo_builder_started`, `tool_start`
- `demo_checklist_step_completed`
- `requirements_imported`, `demo_requirements_imported`
- `scenario_added` / `scenario_removed` (where tracked in UI)
- `demo_plan_completed`, `demo_checklist_generated`
- `demo_pdf_exported` / `demo_excel_exported` / `demo_markdown_exported` / `demo_checklist_exported`
- `demo_checklist_to_scorecard`, `scorecard_export_started`

## Domain rules enforced

1. Same core demo script for every vendor  
2. Requirements drive the demo  
3. Feature claims ≠ evidence  
4. Vendor stated ≠ demonstrated  
5. Must-have failures stay visible  
6. Tasks describe observable behaviour  
7. Commercial questions prefer written follow-up  
8. Untested requirements are surfaced  
9. Buyer owns the agenda  
10. Exports remain useful outside SoftwareGlimpse  

## Known limitations

- No file/screenshot upload (evidence is reference text / URL placeholders only)
- RFP route may be partial depending on ship state; import still works when local RFP session exists
- Interactive Decision Matrix tool does not exist — handoff is to the resource worksheet + Scorecard
- Starter scenarios are templates; buyers should edit before sending to vendors
- Vendor comparison averages are illustrative — gates and evidence quality must be reviewed manually

## Tests

`src/services/demo-checklist-builder/demo-checklist-builder.test.ts` covers project seeding, scenario edit/reorder, coverage, quality warnings, time overrun, markdown export, multi-vendor isolation and scorecard preview shape.
