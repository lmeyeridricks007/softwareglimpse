# CRM Resource Audit

> Spec date: 2026-08-15  
> Scope: all `/resources/` pages + `public/resources/*` artifacts  
> Method: inventory of seed + depth profiles + downloads; assessed against single-responsibility, Guide≠Resource≠Tool, and mockup target.

## Summary

| Metric | Count |
| --- | ---: |
| Resources live | 16 |
| Formats per resource | Excel + visual PDF (+ md; csv on 4) |
| Recommended KEEP | 2 |
| Recommended IMPROVE | 8 |
| Recommended RESTRUCTURE | 5 |
| Recommended SPLIT (scope) | 1 (evaluation checklist — keep page, strip upstream/downstream) |
| Recommended MERGE | 1 (comparison ↔ scorecard overlap) |
| Recommended REMOVE | 0 |
| Missing high-value resources (do not auto-create) | See [RESOURCE-OPPORTUNITIES.md](./RESOURCE-OPPORTUNITIES.md) |

**Primary finding (updated 2026-08-15):** All 16 live resources now have evaluation-style artifact rows (`whyItMatters` + `testScenario` + `required`). Evaluation Checklist remains EVALUATE-only (Option A). Comparison worksheet reframed as **CRM Decision Matrix**. Page chrome and Excel/PDF exporters are kind-aware (vendor columns only where comparison applies).

**Preferred strategy for Evaluation Checklist:** Option A — focused evaluation checklist; keep/strengthen related separate resources (requirements, demo, scorecard, security, business case, implementation). Do **not** create a mega “Selection Workbook.”

---

## Taxonomy proposal (canonical)

| Field | Values |
| --- | --- |
| ResourceType | `CHECKLIST` · `SCORECARD` · `WORKSHEET` · `TEMPLATE` · `MATRIX` · `QUESTION_LIST` · `PLANNING_PACK` · `AUDIT_TEMPLATE` · `MIGRATION_TEMPLATE` · `IMPLEMENTATION_TEMPLATE` · `RFP_TEMPLATE` · `DECISION_TEMPLATE` · `CALCULATOR_EXPORT` |
| BuyingStage | `DISCOVER` · `DEFINE` · `SHORTLIST` · `EVALUATE` · `VALIDATE` · `DECIDE` · `BUY` · `IMPLEMENT` · `OPTIMIZE` · `REVIEW` |

Current seed `kind`/`stage` are coarser (`checklist|template|…` and `choose|implement|…`) and must be mapped/upgraded.

---

## Per-resource audit

### CRM-RES-001 · CRM Evaluation Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-evaluation-checklist/` |
| Current type | checklist |
| Current stage | choose |
| Proposed type | CHECKLIST |
| Proposed stage | EVALUATE |
| Target user | CRM buying / evaluation teams |
| JTBD | Run the same evidence-based checks on every shortlisted CRM during demos/trials |
| Downloads | xlsx, pdf, md |
| Guides | evaluation guide, how-to-choose, selection process |
| Tools | Finder, Vendor Scorecard, Requirements Builder |
| Quality | Content strong on CRM objects; **scope too broad** (requirements, niche definition, decision memo, handoff mixed in) |
| Artifact quality | Generic checklist tables — missing Pass/Partial/Fail, Test/Scenario, multi-vendor columns, evidence columns per mockup |
| Overlap | Requirements template, demo checklist, scorecard, security, business case |
| **Action** | **RESTRUCTURE** — strip DEFINE/DECIDE/IMPLEMENT rows; keep EVALUATE-only categories; rebuild Excel/PDF to mockup; page template redesign |

### CRM-RES-002 · CRM Requirements Template

| Field | Value |
| --- | --- |
| URL | `/resources/crm-requirements-template/` |
| Proposed type | TEMPLATE / WORKSHEET |
| Proposed stage | DEFINE |
| JTBD | Capture must-haves, constraints, and acceptance checks before shortlisting |
| Overlap | Evaluation checklist (upstream work currently duplicated) |
| **Action** | **IMPROVE** — rename framing to Requirements Checklist/Worksheet; absorb definition rows removed from evaluation |

### CRM-RES-003 · CRM Vendor Scorecard

| Field | Value |
| --- | --- |
| URL | `/resources/crm-vendor-scorecard/` |
| Proposed type | SCORECARD |
| Proposed stage | EVALUATE |
| JTBD | Score shortlisted CRMs on weighted criteria with comparable notes |
| Tools | Interactive Vendor Scorecard (preferred for interactivity) |
| Overlap | Comparison worksheet |
| **Action** | **IMPROVE** — Excel with weights + Vendor A/B/C + auto totals; page points to interactive tool |

### CRM-RES-004 · CRM RFP Template

| Field | Value |
| --- | --- |
| URL | `/resources/crm-rfp-template/` |
| Proposed type | RFP_TEMPLATE |
| Proposed stage | VALIDATE / BUY (mid-market+) |
| JTBD | Issue a CRM-specific vendor brief and comparable response table |
| **Action** | **IMPROVE** — keep; tighten commercial/security sections; link security checklist |

### CRM-RES-005 · CRM Demo Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-demo-checklist/` |
| Proposed type | CHECKLIST |
| Proposed stage | EVALUATE |
| JTBD | Run buyer-led CRM demos with identical live scenarios and same-day scores |
| **Action** | **IMPROVE** — rename/position as Demo Script + checklist; align scenarios with evaluation categories |

### CRM-RES-006 · CRM Implementation Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-implementation-checklist/` |
| Proposed type | IMPLEMENTATION_TEMPLATE |
| Proposed stage | IMPLEMENT |
| JTBD | Deliver CRM rollout with object/stage/sync gates and pilot exit criteria |
| **Action** | **KEEP** (with light IMPROVE on preview/page chrome) |

### CRM-RES-007 · CRM Migration Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-migration-checklist/` |
| Proposed type | MIGRATION_TEMPLATE |
| Proposed stage | IMPLEMENT |
| JTBD | Move CRM data safely with mapping, dry-run, cutover, and rollback gates |
| **Action** | **KEEP** |

### CRM-RES-008 · CRM Go-Live Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-go-live-checklist/` |
| Proposed type | CHECKLIST |
| Proposed stage | IMPLEMENT |
| JTBD | Launch CRM with sync heartbeat, seat roster, and day-one hygiene |
| **Action** | **IMPROVE** — page template + journey links |

### CRM-RES-009 · CRM Training Plan

| Field | Value |
| --- | --- |
| URL | `/resources/crm-training-plan/` |
| Proposed type | PLANNING_PACK |
| Proposed stage | IMPLEMENT |
| JTBD | Plan role-based CRM training (AE, manager, admin, CS) |
| **Action** | **IMPROVE** |

### CRM-RES-010 · CRM Data Migration Template

| Field | Value |
| --- | --- |
| URL | `/resources/crm-data-migration-template/` |
| Proposed type | MIGRATION_TEMPLATE |
| Proposed stage | IMPLEMENT |
| JTBD | Inventory CRM objects, volumes, owners, and load order |
| **Action** | **KEEP** |

### CRM-RES-011 · CRM Field Mapping Template

| Field | Value |
| --- | --- |
| URL | `/resources/crm-field-mapping-template/` |
| Proposed type | MIGRATION_TEMPLATE |
| Proposed stage | IMPLEMENT |
| JTBD | Map source→target CRM fields with transforms and owners |
| **Action** | **KEEP** |

### CRM-RES-012 · CRM Security Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-security-checklist/` |
| Proposed type | CHECKLIST / AUDIT_TEMPLATE |
| Proposed stage | VALIDATE (also IMPLEMENT) |
| JTBD | Review SSO, roles, exports, email-sync privacy, and access reviews |
| Overlap | Diligence rows currently inside evaluation checklist |
| **Action** | **IMPROVE** — own deep diligence; evaluation links here |

### CRM-RES-013 · CRM Comparison Worksheet

| Field | Value |
| --- | --- |
| URL | `/resources/crm-comparison-worksheet/` |
| Proposed type | MATRIX / WORKSHEET |
| Proposed stage | EVALUATE / DECIDE |
| JTBD | Side-by-side criteria notes across a shortlist |
| Overlap | Vendor scorecard (weighted scoring better there) |
| **Action** | **MERGE** intent into scorecard OR **RESTRUCTURE** as Decision Matrix — prefer **RESTRUCTURE → Decision Matrix** later; for now IMPROVE differentiation |

### CRM-RES-014 · CRM Business Case Template

| Field | Value |
| --- | --- |
| URL | `/resources/crm-business-case-template/` |
| Proposed type | DECISION_TEMPLATE |
| Proposed stage | DECIDE / BUY |
| JTBD | Justify CRM investment with current-state cost, options, TCO, benefits (confidence-labelled), risks, and decision ask |
| **Action** | **CORRECTED 2026-08-15** — PDF/Excel are approval workbook + financial model; Pass/Fail removed from this resource only |

### CRM-RES-015 · CRM Optimization Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-optimization-checklist/` |
| Proposed type | AUDIT_TEMPLATE |
| Proposed stage | OPTIMIZE |
| JTBD | Improve live CRM adoption, hygiene, reporting trust, automation debt |
| **Action** | **IMPROVE** — consider rename to Health Check later |

### CRM-RES-016 · CRM Cleanup Checklist

| Field | Value |
| --- | --- |
| URL | `/resources/crm-cleanup-checklist/` |
| Proposed type | AUDIT_TEMPLATE |
| Proposed stage | OPTIMIZE |
| JTBD | Clean duplicates, stale owners, unused fields, orphan automations safely |
| **Action** | **IMPROVE** |

### CRM-RES-TPL · Platform

| Field | Value |
| --- | --- |
| URL | `/resources/[slug]/` |
| **Action** | **RESTRUCTURE** — ResourceDetailPage per mockup; library filters by stage/type |

---

## Cross-cutting issues

1. **Page chrome:** Article-style overview/challenges/worked-examples dominate; artifact preview weak.
2. **Downloads:** PDF/XLSX regenerated from depth but lack Pass/Partial/Fail, Test/Scenario, multi-vendor sheets, dropdowns.
3. **Relationships:** `relatedResourceSlugs` exist but no visual USE BEFORE / USE WITH / USE NEXT journey.
4. **Hypothetical examples:** Presented as “Real-world examples” — must reframe as EXAMPLE SCENARIO / WORKED EXAMPLE with Vendor A/B.
5. **Stage labels:** `choose|implement|compare|security|optimize` insufficient for DISCOVER→REVIEW journey.
6. **Guide cannibalization risk:** Resource SEO titles must stay artifact-intent (“CRM evaluation checklist”) not “how to evaluate.”

---

## Evaluation Checklist — decision

**Transform into focused CRM Evaluation Checklist (Option A).**

Remove / move:

| Content | Move to |
| --- | --- |
| Buying problem, requirements freeze, criteria weighting setup | Requirements Template |
| Niche definition workshops | Requirements Template (optional prompts) |
| Deep SSO/export diligence battery | Security Checklist |
| Weighted vendor ranking | Vendor Scorecard |
| Decision memo / implementation handoff pack | Business Case + Implementation Checklist |
| Demo agenda ownership | Demo Checklist |

Keep on Evaluation Checklist (mockup categories):

1. Core workflow fit  
2. User experience & adoption  
3. Communication (email/calendar)  
4. Automation  
5. Reporting  
6. Integrations & extensibility  
7. Security & administration (light gates → Security Checklist for depth)  
8. Data & portability  
9. Commercial fit  
10. Evidence & outcome

---

## Rebuild priority

1. Platform page template + library filters  
2. CRM Evaluation Checklist (content + Excel + PDF)  
3. Taxonomy fields + journey relationships on all 16  
4. Scorecard / Demo / Requirements / Security artifact upgrades  
5. Remaining IMPROVE pages on new chrome  
6. Quality + ecosystem agents/scripts  

---

## Quality gate (must pass before “done”)

- PURPOSE · UTILITY · DUPLICATION · ACCURACY · ARTIFACT · WORKFLOW · LINK · FORMAT tests (see brief §19)
