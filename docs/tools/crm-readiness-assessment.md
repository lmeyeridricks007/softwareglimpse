# CRM Readiness Assessment

## Purpose

Interactive diagnostic that answers:

> How ready is my organization to **choose** and **implement** a CRM?

It is the recommended **starting point** of the SoftwareGlimpse CRM buying workflow. Wanting a CRM urgently is not the same as being ready to select or implement one — the tool exposes that distinction with two scores, not one quiz percentage.

Route: `/tools/crm-readiness-assessment/`

Registry: `crm-readiness-assessment` (CRM-TOOL-013)

## User journey

1. Landing — value proposition + start CTA  
2. Organization context (size, complexity, replacing CRM?)  
3. 14 dimension steps (adaptive questions, ~8–12 minutes)  
4. ~1.6s results loading state  
5. Results dashboard — dual scores, profile, action plan, risks, journey map, next tools  
6. Export PDF / Excel / JSON; retake with score delta

## Assessment dimensions

Configured in `src/services/readiness-assessment/catalog.ts` (not hard-coded UI):

1. Business case & objectives  
2. Sales process  
3. Requirements  
4. Stakeholders & ownership  
5. Data readiness  
6. Integration readiness  
7. Technical readiness  
8. Security & compliance  
9. Budget & commercial readiness  
10. Implementation capacity  
11. Change management  
12. User adoption  
13. Reporting & measurement  
14. Governance & administration  

## Question model

Each `ReadinessQuestionDef` has: type (`single` | `multi` | `yes-partly-no` | `maturity`), options with points, `selectionWeight`, `implementationWeight`, optional `conditions`, `minComplexity`, `criticalWhen`.

Adaptive examples:

- Replacing CRM → migration/export questions  
- Integrations = no → skip integration inventory  
- Small org → skip enterprise governance committee-style prompts  

## Scoring methodology (`crm-readiness-v1`)

Deterministic only — no random or LLM scores.

1. Resolve option points (0–100); multi-select averages selected options  
2. `"not-sure"` carries mid points **and** flags uncertainty (discovery gap)  
3. Dimension score = weighted blend of answered question selection/implementation weights  
4. Selection aggregate = dimension scores × dimension `selectionWeight`  
5. Implementation aggregate = dimension scores × dimension `implementationWeight`  

### Dimension weight emphasis

| Dimension | Selection | Implementation |
| --- | --- | --- |
| Requirements | High | Medium |
| Data | Medium | Very high |
| Change / adoption | Low–medium | Very high |
| Stakeholders | High | High |
| Budget | High | Medium |

### Readiness levels (blended + blocker gates)

| Score band | Status |
| --- | --- |
| 0–39 | Foundations not ready |
| 40–59 | Preparation required |
| 60–74 | Ready for structured discovery |
| 75–89 | Ready for selection |
| 90–100 | Strongly prepared |

Critical blockers can lower status even when averages look healthy.

## Critical blocker rules

Examples: no project owner, no executive sponsor, undefined problem, no requirements, no implementation owner, no data owner, unrealistic timeline, security owner missing when compliance topics selected.

## Findings & action plan

`runFullAssessment()` produces:

- Strengths / gaps / blockers / discovery / risks  
- Phased actions: do-now → before demos → before contract → before go-live  
- Risk register  
- Vendor readiness decision card  
- Personalized tool recommendations (not every tool equally)

## Integration with other CRM tools

| Gap | Next tool |
| --- | --- |
| Weak requirements | Requirements Builder |
| Unclear fit | CRM Finder / Best CRM |
| Unclear cost | Cost / TCO Calculator |
| Weak business case | ROI Calculator |
| Ready for vendors | RFP Builder (may lock until requirements mature) |
| Demo prep | Demo Checklist Builder |
| Data gaps | Migration Planner |
| Capacity gaps | Implementation Planner |

Shared profile: seeds/reads `sg-crm-decision-profile-v1` without overwriting richer requirements.

## Data model

- Schema: `src/domain/schemas/crm-readiness.ts`  
- Storage: `sg-crm-readiness-assessment-v1`  
- Assessment version: `crm-readiness-v1` (frozen on `lastResult` for reproducibility)  
- Privacy inventory: `foundation.ts`

## Exports

- Full PDF report (consulting-style: navy cover, dual score cards, status banner, dimension bars, finding cards, phased action plan, risk table, next tools, page footers)
- Action plan PDF
- Risk register PDF
- Excel workbook (Summary, Dimensions, Answers, Actions, Risks, Findings, Inventory)
- JSON data export
- Print

## SEO & analytics

- Metadata + BreadcrumbList + WebPage + SoftwareApplication + FAQPage  
- Events: `crm_readiness_started`, `crm_readiness_dimension_completed`, `crm_readiness_completed`, `crm_readiness_report_downloaded`, `crm_readiness_action_clicked`  
- No answer payloads in analytics

## Known limitations

- No industry percentile benchmarks (by design)  
- Not legal/security advice — discovery gap identification only  
- Illustrative footer value props are not survey statistics  
- Historical sessions are not silently rescored when methodology changes — use `assessmentVersion` / `lastResult`

## Architecture

| Layer | Path |
| --- | --- |
| Schema | `src/domain/schemas/crm-readiness.ts` |
| Services | `src/services/readiness-assessment/` |
| UI | `src/components/readiness-assessment/` |
| Page | `src/app/(site)/tools/crm-readiness-assessment/page.tsx` |
| Dynamic | `DynamicCrmReadinessAssessmentApp` |
