# SoftwareGlimpse CRM Master Content Map

> **Operational source of truth** for the CRM content ecosystem:
> existing content · quality · improvements · missing content · supporting content · links · research dependencies.
>
> Content-map version: **2026-08-15.1**  
> Spec origin: 2026-08-14 · Quality merge: **2026-08-15**  
> Inputs: [`01-current-page-inventory.md`](./01-current-page-inventory.md) · [`02-crm-target-ecosystem.md`](./02-crm-target-ecosystem.md) · [`03-crm-linking-architecture.md`](./03-crm-linking-architecture.md) · [`CONTENT-QUALITY-LATEST.md`](../content-quality/CONTENT-QUALITY-LATEST.md) · [`CONTENT-IMPROVEMENT-BACKLOG.md`](../content-quality/CONTENT-IMPROVEMENT-BACKLOG.md) · [`NEW-CONTENT-OPPORTUNITIES.md`](../content-quality/NEW-CONTENT-OPPORTUNITIES.md)

---

## Document maintenance

This document is the **CRM reference implementation** of SoftwareGlimpse’s reusable category ecosystem taxonomy.


> **Update 2026-08-15 (quality ecosystem merge):** Merged Content Quality audit + Improvement Backlog + New Content Opportunities into §0 health/overlay/cluster/product/candidates/NEXT 50. Inventory Status/routes in §1–§2 preserved (merge-only). No pages implemented by this update.

| Event | Required update |
| --- | --- |
| Quality audit re-run | Refresh §0a–§0b scores/bands/backlog IDs from `CONTENT-QUALITY-LATEST` + backlog |
| Improvement backlog change | Sync §0f NEXT 50 + overlay backlog IDs |
| New content opportunity change | Sync §0e candidates (MISSING / RESEARCH / OPTIONAL / DO NOT CREATE / MERGE) |
| New page created or published | Update **Status** symbol + Current route + Research state |
| Page removed or unpublished | Mark removed / demote status; fix orphan inbound |
| Research maturity changes | Update 🔬 / Research state; indexability notes |
| New category onboarding | Clone this taxonomy (not CRM copy); keep same clusters |
| Linking modules ship | Align Supports / Supported by / Next step columns with graph |

**Status legend:** ✅ Existing · 🟡 Partial/thin · 🔴 Missing · ⚪ Optional/future · 🔬 Research required (depth) · 🚫 Do not create · 🔀 Merge


> **Update 2026-08-14 (features):** CRM-FEAT-000…016 editorial gate passed — `/features/` index + 16 feature detail pages; `seo.indexable: true`; depth sections + unique hero/needs/workflow visuals; evidence-backed support matrices.

> **Update 2026-08-14 (capabilities):** CRM-CAP-000…016 editorial gate passed — `/capabilities/` index + 16 hubs; `seo.indexable: true`; depth + teaching visuals; linked from CRM category hub; HubDecisionLinks wired.

> **Update 2026-08-14 (requirements):** CRM-REQ-000…010 editorial gate passed — `/requirements/` index + 10 detail hubs; `seo.indexable: true`; depth sections + unique hero/needs/workflow visuals; acceptance criteria + trial validation loops; catalogue evidence (not rankings).

> **Update 2026-08-14 (use cases):** CRM-UC-000…017 editorial gate passed — `/use-cases/` index + 17 hubs; `seo.indexable: true`; depth sections + unique hero/needs/workflow visuals; catalogue explore lists (not rankings).

> **Update 2026-08-14 (business types):** CRM-AUD-000…008 editorial gate passed — `/for/` index + 8 `/for/[slug]/` audience hubs; `seo.indexable: true`; unique heroes + concept visuals; linked from CRM category hub.

> **Update 2026-08-14:** Learn guides CRM-LRN-002…014 shipped as published (soft noindex) seeds with unique visuals — How CRM works through Common CRM mistakes (full Learn pack).

> **Update 2026-08-14 (optimization guides):** CRM-OPT-001…007 + 009…010 editorial gate passed — 9 `/guides/` pages; `seo.indexable: true`; improve adoption, hygiene, reporting/automation best practices, governance ops, audit, health check, when to replace, vendor migration.

> **Update 2026-08-14 (implementation guides):** CRM-IMP-000…016 editorial gate passed — 17 `/guides/` pages; `seo.indexable: true`; unique heroes + teaching figures; pillar + planning/timeline/cost/roles/mistakes + migration/cleaning/mapping + testing/go-live/training + adoption/governance/quality/change/KPIs.

> **Update 2026-08-14 (buyer guides):** CRM-BUY-002…015 soft-published (indexable false) with unique heroes + body figures — How to Choose through Selection Mistakes (Best CRM BUY-001 remains thin/research).

> **Update 2026-08-14 (product guides):** CRM-PRD-T008…012 via `src/services/product-guides` factory for all 22 CRM catalogue products (110 guides) — Implementation, Migration, Setup, Plans, Worth It; unique composited heroes; editorial gate passed — `seo.indexable: true`.

> **Update 2026-08-14 (resources):** CRM-RES-001…016 + CRM-RES-TPL editorial gate passed — `/resources/` index + 16 downloadable hubs; `seo.indexable: true`; use-case-depth sections + unique hero/needs/workflow visuals; Markdown (+ CSV for scorecard/worksheets/mapping) under `public/resources/`; linked from CRM hub-links. ResourceGeneratorAgent still not built (authored depth data).

> **Update 2026-08-18 (tools + UAT shipped):** CRM-TOOL-004 ROI Calculator, CRM-TOOL-011 RFP Builder, CRM-TOOL-012 Demo Checklist Builder, CRM-TOOL-013 Readiness Assessment, CRM-TOOL-014 Plan Selector, CRM-TOOL-015 Migration Cost Calculator, CRM-TOOL-016 Adoption / Health Assessment, CRM-CMP-003 Multi-product compare, CRM-RES-UAT worksheet — live. Earlier 2026-08-14 note (TOOL-005/007–010 only) is superseded.

> **Update 2026-08-14 (tools inventory note):** Earlier backlog listed TOOL-004…005 + 007…016 as still to build; superseded by the tools-shipped note above.

**CRM catalogue products (22 pricing anchors):** activecampaign, attio, bitrix24, capsule, close, copper, creatio, dynamics-365, folk, freshsales, hubspot, insightly, keap, monday-sales-crm, nutshell, oracle-cx, pipedrive, salesflare, salesforce, streak, sugarcrm, zoho-crm.

---

<!-- BEGIN: quality-ecosystem-enrichment (merged 2026-08-15; regenerate via content quality inputs — do not hand-edit inventory in §1–§2 from this block alone) -->

## 0. Document version & quality linkage

| Field | Value |
| --- | --- |
| Content-map version | `2026-08-15.1` |
| Last quality audit | `2026-08-15T05:53:35.012Z` |
| Quality framework version | `1.0.0` (`docs/content-quality/01-quality-framework.md`) |
| Quality inventory | `docs/content-quality/CONTENT-QUALITY-LATEST.md` (524 pages, avg 84.2) |
| Improvement backlog | `docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md` (394 opportunities) |
| New content opportunities | `docs/content-quality/NEW-CONTENT-OPPORTUNITIES.md` (50 candidates) |
| Enrichment policy | **Merge-only** — factual Status / routes / titles in §1–§2 are preserved; quality & gap fields are additive overlays |

### Status legend (extended for gap candidates)

| Symbol / status | Meaning |
| --- | --- |
| ✅ EXISTING / LIVE | Live page / shipped |
| 🟡 PARTIAL / EXISTING-BUT-THIN | Exists but incomplete depth or research |
| 🔬 RESEARCH REQUIRED | Depth/research must complete before expansion or new sibling URLs |
| 🔴 MISSING | Approved gap — not yet built (**not published**) |
| ⚪ OPTIONAL | Eligible only with strong unique value / keep as section |
| 🚫 DO NOT CREATE | Programmatic / thin permutation — do not generate |
| 🔀 MERGE | Consolidate into an existing canonical route |

---

## 0a. CRM CONTENT HEALTH

> Snapshot from Content Quality audit 2026-08-15. Bands per quality framework §4. Evaluation only.

| Metric | Count |
| --- | ---: |
| Existing pages audited (CRM scope) | 524 |
| Excellent (90–100) | 36 |
| Strong (80–89) | 430 |
| Needs improvement (60–79) | 46 |
| Weak / Poor (40–59) | 12 |
| Critical (0–39) | 0 |
| Average score | 84.2 |
| Missing P0 (map NOT-YET / MISSING) | 0 |
| Missing P1 (map NOT-YET / MISSING) | 0 |
| Research gaps (map 🔬 / research-required) | 18 |
| Link gaps (SYS-NEXT-STEP) | 44 (industry / use-case / capability templates) |
| Resource gaps (net-new CREATE) | 0 (UAT worksheet shipped 2026-08-18) |
| Tool gaps | 0 (CRM-TOOL-004…016 + CRM-CMP-003 live 2026-08-18) |

**High-priority gaps:** remaining research/thin overlay (not missing tools). UAT + interactive CRM tools shipped 2026-08-18.

---

## 0b. Quality overlay for map-registered routes

Additive join of §2 master IDs ↔ quality inventory ↔ improvement backlog IDs. **Does not change** inventory Status symbols.

| Map ID | Title | Route | Cluster | Map P | Score | Band | CQ priority | Critical gaps (short) | Improvement backlog IDs | Last audit |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| CRM-IND-CON | CRM for Construction | `/industries/construction/` | Industries | P2 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-PLUMB | CRM for Plumbing | `/industries/plumbing/` | Industries | P1 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-SOLAR | CRM for Solar | `/industries/solar/` | Industries | P1 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-EVENT | CRM for Event Management | `/industries/event-management/` | Industries | P1 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-PE | CRM for Private Equity | `/industries/private-equity/` | Industries | P1 | — | APPROVED | — | Indexable vertical hub + Affinity-led fit shortlist (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-VC | CRM for Venture Capital | `/industries/venture-capital/` | Industries | P1 | — | APPROVED | — | Indexable vertical hub + Affinity-led fit shortlist (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-PHOTO | CRM for Photography | `/industries/photography/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-COACH | CRM for Coaching | `/industries/coaching/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-IR | CRM for Investor Relations | `/industries/investor-relations/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-ENG | CRM for Engineering | `/industries/engineering/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-MUSIC | CRM for Music | `/industries/music/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-WEB | CRM for Web Design | `/industries/web-design/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-SEC | CRM for Security Companies | `/industries/security-companies/` | Industries | P2 | — | APPROVED | — | Indexable vertical hub + productFitGuidance (editorial approve 2026-08-16) | — | 2026-08-16 |
| CRM-IND-EDU | CRM for Education | `/industries/education/` | Industries | P2 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-HC | CRM for Healthcare | `/industries/healthcare/` | Industries | P1 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-HOSP | CRM for Hospitality | `/industries/hospitality/` | Industries | P2 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-LEG | CRM for Legal | `/industries/legal-services/` | Industries | P1 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-LOG | CRM for Logistics | `/industries/transportation-logistics/` | Industries | P2 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-MFG | CRM for Manufacturing | `/industries/manufacturing/` | Industries | P2 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-NP | CRM for Nonprofit | `/industries/nonprofit/` | Industries | P2 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-RE | CRM for Real Estate | `/industries/real-estate/` | Industries | P1 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-RET | CRM for Retail | `/industries/retail-ecommerce/` | Industries | P1 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-SAAS | CRM for SaaS | `/industries/saas/` | Industries | P0 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-IND-SMB | CRM for Small Business (industry) | `/industries/small-business/` | Industries | P0 | — | APPROVED | — | Indexable industry hub + quality pack (editorial 2026-08-18) | — | 2026-08-18 |
| CRM-BUY-001 | Best CRM Software | `/best/crm-software/` | Choose | P0 | — | APPROVED | — | Editorially approved and indexable (2026-08-15) | — | 2026-08-18 |
| CRM-CAP-001 | Contact Management | `/capabilities/contact-management/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-002 | Relationship Management | `/capabilities/relationship-management/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-003 | Lead Management | `/capabilities/lead-management/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-004 | Pipeline Management | `/capabilities/pipeline-management/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-005 | Deal Management | `/capabilities/deal-management/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-006 | Workflow Automation | `/capabilities/workflow-automation/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-007 | Email Capabilities | `/capabilities/email/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-008 | Calling / Sales Engagement | `/capabilities/sales-engagement/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-009 | Reporting | `/capabilities/reporting/` | Capabilities | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-010 | Forecasting | `/capabilities/forecasting/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-011 | Customization | `/capabilities/customization/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-012 | Integrations | `/capabilities/integrations/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-013 | Administration | `/capabilities/administration/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-014 | Security | `/capabilities/security/` | Capabilities | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-015 | Mobile | `/capabilities/mobile/` | Capabilities | P2 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-CAP-016 | AI Assistance | `/capabilities/ai-assistance/` | Capabilities | P2 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-001 | Pipeline Management | `/use-cases/pipeline-management/` | Use Cases | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-002 | Lead Management | `/use-cases/lead-management/` | Use Cases | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-003 | Contact Management | `/use-cases/contact-management/` | Use Cases | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-004 | Sales Automation | `/use-cases/sales-automation/` | Use Cases | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-005 | Email Outreach | `/use-cases/email-outreach/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-007 | Relationship Management | `/use-cases/relationship-management/` | Use Cases | P0 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-008 | Sales Engagement | `/use-cases/sales-engagement/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-009 | Reporting | `/use-cases/reporting/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-010 | Account Management | `/use-cases/account-management/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-011 | Outbound Sales | `/use-cases/outbound-sales/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-012 | Inbound Sales | `/use-cases/inbound-sales/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-013 | Field Sales | `/use-cases/field-sales/` | Use Cases | P2 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-014 | High-volume Lead Management | `/use-cases/high-volume-lead-management/` | Use Cases | P2 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-015 | Complex Sales Processes | `/use-cases/complex-sales-processes/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-016 | Customer Follow-up | `/use-cases/customer-follow-up/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-UC-017 | Sales Forecasting | `/use-cases/sales-forecasting/` | Use Cases | P1 | 79 | GOOD BUT IMPROVABLE | CQ-P2 | — | — | 2026-08-15 |
| CRM-FEAT-001 | Multiple pipelines | `/features/multiple-pipelines/` | Features | P0 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-051 | 2026-08-15 |
| CRM-FEAT-002 | Workflow automation | `/features/workflow-automation/` | Features | P0 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-052 | 2026-08-15 |
| CRM-FEAT-003 | Custom pipeline stages | `/features/custom-pipeline-stages/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-382 | 2026-08-15 |
| CRM-FEAT-004 | Email sync | `/features/email-sync/` | Features | P0 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-053 | 2026-08-15 |
| CRM-FEAT-005 | Lead scoring | `/features/lead-scoring/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-383 | 2026-08-15 |
| CRM-FEAT-006 | Custom fields | `/features/custom-fields/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-384 | 2026-08-15 |
| CRM-FEAT-007 | Forecasting | `/features/forecasting/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-385 | 2026-08-15 |
| CRM-FEAT-008 | Reporting dashboards | `/features/reporting-dashboards/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-386 | 2026-08-15 |
| CRM-FEAT-009 | Calling | `/features/calling/` | Features | P2 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-FEAT-010 | Sequences | `/features/email-sequences/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | CQ-IMP-387 | 2026-08-15 |
| CRM-FEAT-011 | SSO | `/features/sso/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-FEAT-012 | Audit logs | `/features/audit-logs/` | Features | P2 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-FEAT-013 | Role permissions | `/features/role-permissions/` | Features | P1 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-FEAT-014 | API access | `/features/api-access/` | Features | P2 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-FEAT-015 | Mobile app | `/features/mobile-app/` | Features | P2 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-FEAT-016 | AI assistance | `/features/ai-assistance/` | Features | P2 | 81 | STRONG | CQ-P3 | Evidence / Source Quality: Attach primary sources, verification dates, or remove; Link off | — | 2026-08-15 |
| CRM-IND-FS | CRM for Financial Services | `/industries/financial-services/` | Industries | P0 | 85 | STRONG | CQ-P3 | — | — | 2026-08-15 |
| CRM-RES-001 | Evaluation Checklist | `/resources/crm-evaluation-checklist/` | Resources | P0 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-002 | Requirements Template | `/resources/crm-requirements-template/` | Resources | P0 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-003 | Vendor Scorecard | `/resources/crm-vendor-scorecard/` | Resources | P0 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-004 | RFP Template | `/resources/crm-rfp-template/` | Resources | P2 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-005 | Demo Checklist | `/resources/crm-demo-checklist/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-006 | Implementation Checklist | `/resources/crm-implementation-checklist/` | Resources | P0 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-007 | Migration Checklist | `/resources/crm-migration-checklist/` | Resources | P0 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-008 | Go-Live Checklist | `/resources/crm-go-live-checklist/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-009 | Training Plan | `/resources/crm-training-plan/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-010 | Data Migration Template | `/resources/crm-data-migration-template/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-011 | Field Mapping Template | `/resources/crm-field-mapping-template/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-012 | Security Checklist | `/resources/crm-security-checklist/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-013 | Comparison Worksheet | `/resources/crm-comparison-worksheet/` | Resources | P0 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-014 | Business Case Template | `/resources/crm-business-case-template/` | Resources | P2 | 85 | STRONG | CQ-P2 | — | Corrected 2026-08-15: approval workbook (TCO/benefits/ROI confidence) — not Pass/Fail checklist | 2026-08-15 |
| CRM-RES-015 | Optimization Checklist | `/resources/crm-optimization-checklist/` | Resources | P1 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-RES-016 | Cleanup Checklist | `/resources/crm-cleanup-checklist/` | Resources | P2 | 85 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-003 | CRM Requirements Guide | `/guides/crm-requirements-guide/` | Choose | P0 | 87 | STRONG | CQ-P1 | — | — | 2026-08-15 |
| CRM-BUY-004 | CRM Evaluation Guide | `/guides/crm-evaluation-guide/` | Choose | P0 | 87 | STRONG | CQ-P1 | — | — | 2026-08-15 |
| CRM-BUY-006 | CRM Vendor Evaluation | `/guides/crm-vendor-evaluation/` | Choose | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-007 | CRM RFP Guide | `/guides/crm-rfp-guide/` | Choose | P2 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-008 | CRM Demo Guide | `/guides/crm-demo-guide/` | Choose | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-009 | CRM Trial Evaluation | `/guides/crm-trial-evaluation/` | Choose | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-010 | CRM Pricing Guide | `/guides/crm-pricing-guide/` | Choose | P0 | 87 | STRONG | CQ-P1 | — | — | 2026-08-15 |
| CRM-BUY-011 | CRM Total Cost Guide | `/guides/crm-total-cost-guide/` | Choose | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-012 | CRM ROI Guide | `/guides/crm-roi-guide/` | Choose | P2 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-013 | CRM Business Case | `/guides/crm-business-case/` | Choose | P2 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-014 | CRM Vendor Questions | `/guides/crm-vendor-questions/` | Choose | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-BUY-015 | CRM Selection Mistakes | `/guides/crm-selection-mistakes/` | Choose | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-007 | CRM Health Check | `/guides/crm-health-check/` | Optimization | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-009 | When to Replace CRM | `/guides/when-to-replace-crm/` | Optimization | P1 | 87 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-000 | CRM Implementation Guide | `/guides/crm-implementation/` | Implementation | P0 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-001 | Plan CRM Implementation | `/guides/crm-implementation-planning/` | Implementation | P0 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-002 | Implementation Timeline | `/guides/crm-implementation-timeline/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-003 | Implementation Cost | `/guides/crm-implementation-cost/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-004 | Implementation Roles | `/guides/crm-implementation-roles/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-005 | Implementation Mistakes | `/guides/crm-implementation-mistakes/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-006 | CRM Data Migration Guide | `/guides/crm-data-migration/` | Implementation | P0 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-007 | Clean CRM Data | `/guides/crm-data-cleaning/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-008 | Field Mapping Guide | `/guides/crm-field-mapping/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-009 | CRM Testing Guide | `/guides/crm-testing/` | Implementation | P2 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-010 | CRM Go-Live Guide | `/guides/crm-go-live/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-011 | CRM Training Guide | `/guides/crm-training/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-012 | CRM Adoption Guide | `/guides/crm-adoption/` | Implementation | P0 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-013 | CRM Governance Guide | `/guides/crm-governance/` | Implementation | P2 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-014 | CRM Data Quality Guide | `/guides/crm-data-quality/` | Implementation | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-015 | CRM Change Management | `/guides/crm-change-management/` | Implementation | P2 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-IMP-016 | CRM Implementation KPIs | `/guides/crm-implementation-kpis/` | Implementation | P2 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-LRN-002 | How CRM works | `/guides/how-crm-works/` | Learn | P0 | 88 | STRONG | CQ-P1 | — | — | 2026-08-15 |
| CRM-LRN-005 | CRM glossary | `/guides/crm-glossary/` | Learn | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-001 | Improve CRM Adoption | `/guides/improve-crm-adoption/` | Optimization | P0 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-002 | CRM Data Hygiene | `/guides/crm-data-hygiene/` | Optimization | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-003 | Reporting Best Practices | `/guides/crm-reporting-best-practices/` | Optimization | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-004 | Automation Best Practices | `/guides/crm-automation-best-practices/` | Optimization | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-005 | CRM Governance Ops | `/guides/crm-governance-operations/` | Optimization | P2 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-006 | CRM Audit Guide | `/guides/crm-audit/` | Optimization | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-OPT-010 | Migrate to Another Vendor | `/guides/crm-vendor-migration/` | Optimization | P1 | 88 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-REQ-001 | Separate sales processes | `/requirements/separate-sales-processes/` | Requirements | P0 | 89 | STRONG | CQ-P2 | — | CQ-IMP-026 | 2026-08-15 |
| CRM-REQ-002 | Automate lead follow-up | `/requirements/automate-lead-follow-up/` | Requirements | P0 | 89 | STRONG | CQ-P2 | — | CQ-IMP-027 | 2026-08-15 |
| CRM-REQ-003 | Restrict access by team | `/requirements/restrict-access-by-team/` | Requirements | P0 | 89 | STRONG | CQ-P2 | — | CQ-IMP-028 | 2026-08-15 |
| CRM-REQ-004 | Forecast revenue | `/requirements/forecast-revenue/` | Requirements | P1 | 89 | STRONG | CQ-P2 | — | CQ-IMP-047 | 2026-08-15 |
| CRM-REQ-005 | Track client interactions | `/requirements/track-client-interactions/` | Requirements | P0 | 89 | STRONG | CQ-P2 | — | CQ-IMP-029 | 2026-08-15 |
| CRM-REQ-006 | Customize record fields | `/requirements/customize-record-fields/` | Requirements | P1 | 89 | STRONG | CQ-P2 | — | CQ-IMP-048 | 2026-08-15 |
| CRM-REQ-007 | Support multiple currencies | `/requirements/support-multiple-currencies/` | Requirements | P2 | 89 | STRONG | CQ-P2 | — | — | 2026-08-15 |
| CRM-REQ-008 | Integrate with email | `/requirements/integrate-with-email/` | Requirements | P0 | 89 | STRONG | CQ-P2 | — | CQ-IMP-030 | 2026-08-15 |
| CRM-REQ-009 | Support SSO | `/requirements/support-sso/` | Requirements | P1 | 89 | STRONG | CQ-P2 | — | CQ-IMP-049 | 2026-08-15 |
| CRM-REQ-010 | Audit user activity | `/requirements/audit-user-activity/` | Requirements | P1 | 89 | STRONG | CQ-P2 | — | CQ-IMP-050 | 2026-08-15 |
| CRM-BUY-002 | How to Choose CRM | `/guides/how-to-choose-crm/` | Choose | P0 | 91 | EXCELLENT | CQ-P1 | — | — | 2026-08-15 |
| CRM-BUY-005 | CRM Selection Process | `/guides/crm-selection-process/` | Choose | P1 | 91 | EXCELLENT | CQ-P2 | — | — | 2026-08-15 |
| CRM-LRN-007 | CRM vs spreadsheet | `/guides/crm-vs-spreadsheet/` | Learn | P0 | 91 | EXCELLENT | CQ-P1 | — | — | 2026-08-15 |
| CRM-LRN-008 | CRM vs ERP | `/guides/crm-vs-erp/` | Learn | P1 | 91 | EXCELLENT | CQ-P2 | — | — | 2026-08-15 |
| CRM-LRN-009 | CRM vs marketing automation | `/guides/crm-vs-marketing-automation/` | Learn | P1 | 91 | EXCELLENT | CQ-P2 | — | — | 2026-08-15 |
| CRM-LRN-010 | CRM vs customer service software | `/guides/crm-vs-customer-service-software/` | Learn | P2 | 91 | EXCELLENT | CQ-P2 | — | — | 2026-08-15 |
| CRM-LRN-011 | CRM vs CDP | `/guides/crm-vs-cdp/` | Learn | P3 | 91 | EXCELLENT | CQ-P2 | — | — | 2026-08-15 |
| CRM-LRN-012 | Do I need a CRM? | `/guides/do-i-need-a-crm/` | Learn | P0 | 91 | EXCELLENT | CQ-P1 | — | — | 2026-08-15 |
| CRM-LRN-013 | When to adopt CRM | `/guides/when-to-adopt-crm/` | Learn | P1 | 91 | EXCELLENT | CQ-P2 | — | — | 2026-08-15 |
| CRM-PRD-EX-HS | HubSpot CRM Review | `/software/hubspot/` | Products | P0 | 91 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-PRD-EX-SF | Salesforce Review | `/software/salesforce/` | Products | P0 | 91 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-PRD-EX-PD | Pipedrive Review | `/software/pipedrive/` | Products | P0 | 93 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-LRN-001 | What is CRM? | `/guides/what-is-crm/` | Learn | P0 | 94 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-LRN-003 | Types of CRM | `/guides/types-of-crm/` | Learn | P1 | 94 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-LRN-004 | CRM benefits | `/guides/crm-benefits/` | Learn | P1 | 94 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-LRN-006 | CRM examples | `/guides/crm-examples/` | Learn | P2 | 94 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |
| CRM-LRN-014 | Common CRM mistakes | `/guides/common-crm-mistakes/` | Learn | P1 | 94 | EXCELLENT | CQ-P3 | — | — | 2026-08-15 |

_Map-registered routes with quality join: **145** of 206 master rows. Full page inventory (524): `CONTENT-QUALITY-LATEST.md`._

---

## 0c. Cluster health

For each pillar/cluster: coverage from map inventory + quality from live audit.

### Learn

- **Coverage:** 100% — 14 solid / 0 thin / 0 missing of 14 map rows
- **Quality:** 92/100 across 14 audited pages
- **Strong:** `/guides/what-is-crm/` (94), `/guides/types-of-crm/` (94), `/guides/crm-benefits/` (94), `/guides/crm-examples/` (94)
- **Weak:** _none <80_
- **Missing / candidates:** ✅ CRM Readiness Assessment live (`/tools/crm-readiness-assessment/`)
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Choose

- **Coverage:** 97% — 14 solid / 1 thin / 0 missing of 15 map rows
- **Quality:** 87/100 across 16 audited pages
- **Strong:** `/guides/how-to-choose-crm/` (91), `/guides/crm-selection-process/` (91), `/guides/crm-vendor-migration/` (88), `/guides/crm-requirements-guide/` (87)
- **Weak:** `/best/crm-software/` (76)
- **Missing / candidates:** ✅ CRM ROI Calculator; ✅ CRM RFP / Vendor Brief Builder; ✅ CRM Demo Checklist Builder; ✅ CRM Readiness Assessment; ✅ CRM Plan Selector
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Implementation

- **Coverage:** 100% — 17 solid / 0 thin / 0 missing of 17 map rows
- **Quality:** 88/100 across 19 audited pages
- **Strong:** `/guides/crm-implementation/` (88), `/guides/crm-implementation-planning/` (88), `/guides/crm-implementation-timeline/` (88), `/guides/crm-implementation-cost/` (88)
- **Weak:** _none <80_
- **Missing / candidates:** ✅ CRM Migration Cost Calculator; ✅ UAT test script worksheet (`/resources/crm-uat-test-script/`); ⚪ OPTIONAL (keep as section): Industry evaluation addendum pattern (not 12 PDFs)
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Optimization

- **Coverage:** 100% — 9 solid / 0 thin / 0 missing of 9 map rows
- **Quality:** 88/100 across 6 audited pages
- **Strong:** `/guides/improve-crm-adoption/` (88), `/guides/crm-reporting-best-practices/` (88), `/guides/crm-automation-best-practices/` (88), `/guides/crm-audit/` (88)
- **Weak:** _none <80_
- **Missing / candidates:** ✅ CRM Adoption / Health Assessment (`/tools/crm-adoption-health-assessment/`)
- **Resources / tools:** see Resources cluster + §11a tools inventory + RES rows in §2

### Industries

- **Coverage:** 25 industry hubs seeded (13 core + 12 verticals) — soft-published / noindex; FS remains the depth reference
- **Quality:** 43/100 across previously audited core pages; new verticals not yet quality-scored
- **Strong:** `/industries/financial-services/` (85)
- **Weak:** `/industries/saas/` (40), `/industries/small-business/` (40), `/industries/real-estate/` (40), `/industries/healthcare/` (40), `/industries/retail-ecommerce/` (40), `/industries/legal-services/` (40)
- **New verticals (2026-08-16):** plumbing, solar, event-management, private-equity, venture-capital, photography, coaching, investor-relations, engineering, music, web-design, security-companies — **editorially approved + indexable**; depth + productFitGuidance + teaching visuals; legacy best-CRM URLs 301 to these hubs
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Use Cases

- **Coverage:** 100% — 18 solid / 0 thin / 0 missing of 18 map rows
- **Quality:** 79/100 across 16 audited pages
- **Strong:** _none ≥85 in slice_
- **Weak:** `/use-cases/pipeline-management/` (79), `/use-cases/lead-management/` (79), `/use-cases/contact-management/` (79), `/use-cases/sales-automation/` (79), `/use-cases/email-outreach/` (79), `/use-cases/relationship-management/` (79)
- **Missing / candidates:** 🚫 DO NOT CREATE: Feature X × every use case
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Capabilities

- **Coverage:** 100% — 17 solid / 0 thin / 0 missing of 17 map rows
- **Quality:** 79/100 across 16 audited pages
- **Strong:** _none ≥85 in slice_
- **Weak:** `/capabilities/contact-management/` (79), `/capabilities/relationship-management/` (79), `/capabilities/lead-management/` (79), `/capabilities/pipeline-management/` (79), `/capabilities/deal-management/` (79), `/capabilities/workflow-automation/` (79)
- **Missing / candidates:** _see §0e / §11a_
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Requirements

- **Coverage:** 100% — 11 solid / 0 thin / 0 missing of 11 map rows
- **Quality:** 85/100 across 14 audited pages
- **Strong:** `/requirements/separate-sales-processes/` (89), `/requirements/automate-lead-follow-up/` (89), `/requirements/restrict-access-by-team/` (89), `/requirements/forecast-revenue/` (89)
- **Weak:** `/requirements/manage-integrations/` (75), `/requirements/retain-and-export-data/` (75), `/requirements/control-data-residency/` (75), `/requirements/review-vendor-security-docs/` (75)
- **Missing / candidates:** _see §0e / §11a_
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Features

- **Coverage:** 100% — 17 solid / 0 thin / 0 missing of 17 map rows
- **Quality:** 77/100 across 24 audited pages
- **Strong:** _none ≥85 in slice_
- **Weak:** `/features/contact-management/` (70), `/features/lead-management/` (70), `/features/pipeline-management/` (70), `/features/deal-management/` (70), `/features/sales-automation/` (70), `/features/email-tracking/` (70)
- **Missing / candidates:** _see §0e / §11a_
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Resources

- **Coverage:** 100% — 17 solid / 0 thin / 0 missing of 17 map rows
- **Quality:** 85/100 across 16 audited pages
- **Strong:** `/resources/crm-evaluation-checklist/` (85), `/resources/crm-requirements-template/` (85), `/resources/crm-vendor-scorecard/` (85), `/resources/crm-rfp-template/` (85)
- **Weak:** _none <80_
- **Missing / candidates:** ⚪ OPTIONAL (keep as section): Industry evaluation addendum pattern (not 12 PDFs)
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Products

- **Coverage:** 86% — 13 solid / 5 thin / 0 missing of 18 map rows
- **Quality:** 91/100 across 22 audited pages
- **Strong:** `/software/pipedrive/` (93), `/software/keap/` (93), `/software/freshsales/` (91), `/software/close/` (91)
- **Weak:** _none <80_
- **Missing / candidates:** 🔬 RESEARCH REQUIRED: Alternatives hub depth; 🔬 RESEARCH REQUIRED: Pipedrive Alternatives; 🔬 RESEARCH REQUIRED: Freshsales Alternatives; 🔬 RESEARCH REQUIRED: Salesforce Alternatives; 🔬 RESEARCH REQUIRED: HubSpot Alternatives
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Comparisons

- **Coverage:** 50% — 2 solid / 1 thin / 1 missing of 5 map rows
- **Quality:** 86/100 across 231 audited pages
- **Strong:** `/compare/activecampaign-vs-attio/` (86), `/compare/activecampaign-vs-bitrix24/` (86), `/compare/activecampaign-vs-capsule/` (86), `/compare/activecampaign-vs-close/` (86)
- **Weak:** _none <80_
- **Missing / candidates:** Multi-product compare
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

### Product guides

- **Coverage:** 86% — 13 solid / 5 thin / 0 missing of 18 map rows
- **Quality:** 85/100 across 77 audited pages
- **Strong:** `/guides/crm-implementation/` (88), `/guides/crm-implementation-planning/` (88), `/guides/crm-implementation-timeline/` (88), `/guides/crm-implementation-cost/` (88)
- **Weak:** _none <80_
- **Missing / candidates:** _see §0e / §11a_
- **Resources / tools:** see Resources cluster + §11a tools backlog + RES rows in §2

---

## 0d. Product health (flagship)

| Product | Review quality | Band | CQ pri | Supporting guides audited | Avg | Comparisons | Industry × product | Use-case × product | Resources | Missing high-value |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| hubspot | 91 | EXCELLENT | CQ-P3 | 16 | 86 | ✅ pairs | 🚫 DO NOT CREATE mass | 🚫 DO NOT CREATE mass | via RES hub | RESEARCH FIRST: HubSpot Alternatives; KEEP AS SECTION: HubSpot security overview; KEEP AS SECTION: HubSpot integrations guide |
| salesforce | 91 | EXCELLENT | CQ-P3 | 8 | 85 | ✅ pairs | 🚫 DO NOT CREATE mass | 🚫 DO NOT CREATE mass | via RES hub | RESEARCH FIRST: Salesforce Alternatives; KEEP AS SECTION: Salesforce security overview; KEEP AS SECTION: Salesforce integrations guide |
| pipedrive | 93 | EXCELLENT | CQ-P3 | 10 | 85 | ✅ pairs | 🚫 DO NOT CREATE mass | 🚫 DO NOT CREATE mass | via RES hub | RESEARCH FIRST: Pipedrive Alternatives; KEEP AS SECTION: Pipedrive security overview; KEEP AS SECTION: Pipedrive integrations guide |
| zoho-crm | 91 | EXCELLENT | CQ-P3 | 5 | 84 | ✅ pairs | 🚫 DO NOT CREATE mass | 🚫 DO NOT CREATE mass | via RES hub | RESEARCH FIRST: Zoho CRM Alternatives; KEEP AS SECTION: Zoho CRM security overview; KEEP AS SECTION: Zoho CRM integrations guide |
| freshsales | 91 | EXCELLENT | CQ-P3 | 17 | 86 | ✅ pairs | 🚫 DO NOT CREATE mass | 🚫 DO NOT CREATE mass | via RES hub | RESEARCH FIRST: Freshsales Alternatives; KEEP AS SECTION: Freshsales security overview; KEEP AS SECTION: Freshsales integrations guide |
| monday-sales-crm | 91 | EXCELLENT | CQ-P3 | 13 | 85 | ✅ pairs | 🚫 DO NOT CREATE mass | 🚫 DO NOT CREATE mass | via RES hub | RESEARCH FIRST: monday sales CRM Alternatives; KEEP AS SECTION: monday sales CRM security overview; KEEP AS SECTION: monday sales CRM integrations guide |

Non-flagship catalogue products: keep security/integrations as hub sections; alternatives only with approved graph (RESEARCH FIRST). **Do not** auto-create product×industry pages.

---

## 0e. New content candidates (gap agent — not published)

Inserted from `NEW-CONTENT-OPPORTUNITIES.md`. Statuses are planning states only — **never mark as published** from this table.

| Gap ID | Status | Priority | Title | Type | Parent | Supports | Supported by | Links in | Links out | Next step | Research |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CQ-GAP-001 | ✅ LIVE | P1 | CRM ROI Calculator | TOOL | /tools/ | Choose | Tools pillar | `/tools/`, `/guides/` | `Product review / Pricing` | Product review / Pricing | shipped |
| CQ-GAP-002 | ✅ LIVE | P1 | CRM RFP / Vendor Brief Builder | TOOL | /tools/ | Choose | Tools pillar | `/tools/`, `/guides/` | `Vendor evaluation` | Vendor evaluation | shipped |
| CQ-GAP-003 | ✅ LIVE | P1 | CRM Demo Checklist Builder | TOOL | /tools/ | Choose | Tools pillar | `/tools/`, `/guides/` | `Demo guide / Trial` | Demo guide / Trial | shipped |
| CQ-GAP-004 | ✅ LIVE | P1 | CRM Readiness Assessment | TOOL | /tools/ | Learn→Choose | Tools pillar | `/tools/`, `/guides/` | `Do I need / Requirements` | Do I need / Requirements | shipped |
| CQ-GAP-005 | ✅ LIVE | P1 | CRM Plan Selector | TOOL | /tools/ | Pricing | Tools pillar | `/tools/`, `/guides/` | `Product pricing / Plans guide` | Product pricing / Plans guide | shipped |
| CQ-GAP-006 | ✅ LIVE | P2 | CRM Migration Cost Calculator | TOOL | /tools/ | Implement | Tools pillar | `/tools/`, `/guides/` | `Migration planner / TCO` | Migration planner / TCO | shipped |
| CQ-GAP-007 | ✅ LIVE | P2 | CRM Adoption / Health Assessment | TOOL | /tools/ | Optimize | Tools pillar | `/tools/`, `/guides/` | `Health check / Adoption guide` | Health check / Adoption guide | shipped |
| CQ-GAP-008 | ✅ LIVE | P2 | Multi-product compare | TOOL | /tools/ | Compare | Compare pillar | `/tools/`, `/guides/` | `Calculator / Select` | Calculator / Select | shipped |
| CQ-GAP-009 | ✅ LIVE | P2 | UAT test script worksheet (CRM) | WORKSHEET | /guides/crm-testing/ | /guides/crm-testing/, /guides/crm-go-live/ | Implementation pillar | `/guides/crm-testing/`, `/guides/crm-go-live/` | `/tools/crm-implementation-planner/`, `/resources/crm-go-live-checklist/` | Go-Live Checklist / Implementation Planner | shipped |
| CQ-GAP-010 | 🔬 RESEARCH REQUIRED | P0 | Best CRM Software — research + rationale completion | PILLAR PAGE | /categories/crm/ | Choose | parent pillar / inventory | /categories/crm/ | Choose | Research depth on existing parent first | research-required |
| CQ-GAP-011 | 🔬 RESEARCH REQUIRED | P0 | CRM for Financial Services — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-012 | 🔬 RESEARCH REQUIRED | P0 | CRM for SaaS — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-013 | 🔬 RESEARCH REQUIRED | P0 | CRM workflow guide for saas | INDUSTRY GUIDE | /industries/saas/ | /industries/saas/ | parent pillar / inventory | /industries/saas/ | /industries/saas/ | Research depth on existing parent first | blocked on hub research |
| CQ-GAP-014 | 🔬 RESEARCH REQUIRED | P1 | CRM for Real Estate — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-015 | 🔬 RESEARCH REQUIRED | P1 | CRM for Healthcare — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-016 | 🔬 RESEARCH REQUIRED | P1 | CRM for Retail — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-017 | 🔬 RESEARCH REQUIRED | P1 | CRM for Legal — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-018 | 🔬 RESEARCH REQUIRED | P1 | Alternatives hub depth | PILLAR PAGE | /categories/crm/ | Products | parent pillar / inventory | /categories/crm/ | Products | Research depth on existing parent first | partial |
| CQ-GAP-019 | 🔬 RESEARCH REQUIRED | P1 | CRM workflow guide for healthcare | INDUSTRY GUIDE | /industries/healthcare/ | /industries/healthcare/ | parent pillar / inventory | /industries/healthcare/ | /industries/healthcare/ | Research depth on existing parent first | blocked on hub research |
| CQ-GAP-020 | 🔬 RESEARCH REQUIRED | P1 | CRM workflow guide for real-estate | INDUSTRY GUIDE | /industries/real-estate/ | /industries/real-estate/ | parent pillar / inventory | /industries/real-estate/ | /industries/real-estate/ | Research depth on existing parent first | blocked on hub research |
| CQ-GAP-021 | 🔬 RESEARCH REQUIRED | P2 | CRM for Manufacturing — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-022 | 🔬 RESEARCH REQUIRED | P2 | CRM for Education — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-023 | 🔬 RESEARCH REQUIRED | P2 | CRM for Nonprofit — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-024 | 🔬 RESEARCH REQUIRED | P2 | CRM for Hospitality — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-025 | 🔬 RESEARCH REQUIRED | P2 | CRM for Construction — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-026 | 🔬 RESEARCH REQUIRED | P2 | CRM for Logistics — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Research depth on existing parent first | research-required |
| CQ-GAP-027 | 🔬 RESEARCH REQUIRED | P2 | Pipedrive Alternatives | PRODUCT GUIDE | /software/pipedrive/ | /software/pipedrive/ | parent pillar / inventory | /software/pipedrive/ | /software/pipedrive/ | Research depth on existing parent first | research-required |
| CQ-GAP-028 | 🔬 RESEARCH REQUIRED | P2 | Freshsales Alternatives | PRODUCT GUIDE | /software/freshsales/ | /software/freshsales/ | parent pillar / inventory | /software/freshsales/ | /software/freshsales/ | Research depth on existing parent first | research-required |
| CQ-GAP-029 | 🔬 RESEARCH REQUIRED | P2 | Salesforce Alternatives | PRODUCT GUIDE | /software/salesforce/ | /software/salesforce/ | parent pillar / inventory | /software/salesforce/ | /software/salesforce/ | Research depth on existing parent first | research-required |
| CQ-GAP-030 | 🔬 RESEARCH REQUIRED | P2 | HubSpot Alternatives | PRODUCT GUIDE | /software/hubspot/ | /software/hubspot/ | parent pillar / inventory | /software/hubspot/ | /software/hubspot/ | Research depth on existing parent first | research-required |
| CQ-GAP-031 | 🔬 RESEARCH REQUIRED | P2 | Zoho CRM Alternatives | PRODUCT GUIDE | /software/zoho-crm/ | /software/zoho-crm/ | parent pillar / inventory | /software/zoho-crm/ | /software/zoho-crm/ | Research depth on existing parent first | research-required |
| CQ-GAP-032 | 🔬 RESEARCH REQUIRED | P2 | monday sales CRM Alternatives | PRODUCT GUIDE | /software/monday-sales-crm/ | /software/monday-sales-crm/ | parent pillar / inventory | /software/monday-sales-crm/ | /software/monday-sales-crm/ | Research depth on existing parent first | research-required |
| CQ-GAP-033 | 🔀 MERGE | P0 | CRM for Small Business (industry) — depth pack (not a new URL) | INDUSTRY GUIDE | /industries/ | Industries, Finder | parent pillar / inventory | /industries/ | Industries, Finder | Canonical consolidation | research-required |
| CQ-GAP-034 | ⚪ OPTIONAL (keep as section) | P0 | CRM workflow guide for financial-services | INDUSTRY GUIDE | /industries/financial-services/ | /industries/financial-services/ | parent pillar / inventory | /industries/financial-services/ | /industries/financial-services/ | Keep on parent page / section | complete |
| CQ-GAP-035 | ⚪ OPTIONAL (keep as section) | P2 | Industry evaluation addendum pattern (not 12 PDFs) | CHECKLIST | /resources/crm-evaluation-checklist/ | /industries/ | parent pillar / inventory | /resources/crm-evaluation-checklist/ | /industries/ | Keep on parent page / section | pattern decision |
| CQ-GAP-036 | ⚪ OPTIONAL (keep as section) | P2 | Pipedrive security overview | PRODUCT HOW-TO | /software/pipedrive/ | /software/pipedrive/ | parent pillar / inventory | /software/pipedrive/ | /software/pipedrive/ | Keep on parent page / section | n/a |
| CQ-GAP-037 | ⚪ OPTIONAL (keep as section) | P2 | Pipedrive integrations guide | PRODUCT HOW-TO | /software/pipedrive/ | /software/pipedrive/ | parent pillar / inventory | /software/pipedrive/ | /software/pipedrive/ | Keep on parent page / section | n/a |
| CQ-GAP-038 | ⚪ OPTIONAL (keep as section) | P2 | Freshsales security overview | PRODUCT HOW-TO | /software/freshsales/ | /software/freshsales/ | parent pillar / inventory | /software/freshsales/ | /software/freshsales/ | Keep on parent page / section | n/a |
| CQ-GAP-039 | ⚪ OPTIONAL (keep as section) | P2 | Freshsales integrations guide | PRODUCT HOW-TO | /software/freshsales/ | /software/freshsales/ | parent pillar / inventory | /software/freshsales/ | /software/freshsales/ | Keep on parent page / section | n/a |
| CQ-GAP-040 | ⚪ OPTIONAL (keep as section) | P2 | Salesforce security overview | PRODUCT HOW-TO | /software/salesforce/ | /software/salesforce/ | parent pillar / inventory | /software/salesforce/ | /software/salesforce/ | Keep on parent page / section | n/a |
| CQ-GAP-041 | ⚪ OPTIONAL (keep as section) | P2 | Salesforce integrations guide | PRODUCT HOW-TO | /software/salesforce/ | /software/salesforce/ | parent pillar / inventory | /software/salesforce/ | /software/salesforce/ | Keep on parent page / section | n/a |
| CQ-GAP-042 | ⚪ OPTIONAL (keep as section) | P2 | HubSpot security overview | PRODUCT HOW-TO | /software/hubspot/ | /software/hubspot/ | parent pillar / inventory | /software/hubspot/ | /software/hubspot/ | Keep on parent page / section | n/a |
| CQ-GAP-043 | ⚪ OPTIONAL (keep as section) | P2 | HubSpot integrations guide | PRODUCT HOW-TO | /software/hubspot/ | /software/hubspot/ | parent pillar / inventory | /software/hubspot/ | /software/hubspot/ | Keep on parent page / section | n/a |
| CQ-GAP-044 | ⚪ OPTIONAL (keep as section) | P2 | Zoho CRM security overview | PRODUCT HOW-TO | /software/zoho-crm/ | /software/zoho-crm/ | parent pillar / inventory | /software/zoho-crm/ | /software/zoho-crm/ | Keep on parent page / section | n/a |
| CQ-GAP-045 | ⚪ OPTIONAL (keep as section) | P2 | Zoho CRM integrations guide | PRODUCT HOW-TO | /software/zoho-crm/ | /software/zoho-crm/ | parent pillar / inventory | /software/zoho-crm/ | /software/zoho-crm/ | Keep on parent page / section | n/a |
| CQ-GAP-046 | ⚪ OPTIONAL (keep as section) | P2 | monday sales CRM security overview | PRODUCT HOW-TO | /software/monday-sales-crm/ | /software/monday-sales-crm/ | parent pillar / inventory | /software/monday-sales-crm/ | /software/monday-sales-crm/ | Keep on parent page / section | n/a |
| CQ-GAP-047 | ⚪ OPTIONAL (keep as section) | P2 | monday sales CRM integrations guide | PRODUCT HOW-TO | /software/monday-sales-crm/ | /software/monday-sales-crm/ | parent pillar / inventory | /software/monday-sales-crm/ | /software/monday-sales-crm/ | Keep on parent page / section | n/a |
| CQ-GAP-048 | 🚫 DO NOT CREATE | P3 | Product A vs Product B for every industry | SUPPORTING ARTICLE | Base comparison pages | Compare | parent pillar / inventory | Base comparison pages | Compare | — | optional — eligibility gated |
| CQ-GAP-049 | 🚫 DO NOT CREATE | P3 | Feature X × every use case | FEATURE GUIDE | Use-case / Feature hubs | — | parent pillar / inventory | Use-case / Feature hubs | — | — | n/a — combinatorial |
| CQ-GAP-050 | 🚫 DO NOT CREATE | P3 | HubSpot (or any CRM) × every industry | PRODUCT × INDUSTRY | Industry hubs | — | parent pillar / inventory | Industry hubs | — | — | insufficient unique value by default |

### Candidate link-map notes

- **Tools CREATE (CQ-GAP-001…007):** Parent Tools hub; Supports Choose/Implement/Optimize; Links in from related buyer/IMP guides; Next step product review / planner / pricing.
- **UAT worksheet (CQ-GAP-009):** Parent `/guides/crm-testing/`; Supports go-live; Links to Implementation Planner + Go-Live Checklist.
- **Industry depth packs:** Not new URLs — RESEARCH REQUIRED on existing `/industries/{slug}/` hubs; FS supporting pack already exists → KEEP AS SECTION.
- **SMB (CQ-GAP-033):** 🔀 MERGE `/industries/small-business/` intent toward `/for/small-business/` (DUP-SMB).
- **🚫 DO NOT CREATE:** product×every industry; feature×every use case; compare×every industry (CQ-GAP-048…050).

---

## 0f. NEXT 50 CONTENT ACTIONS

Unified work queue. Action types: IMPROVE · CREATE · RESEARCH · MERGE · LINK · ADD RESOURCE. Includes backlog / gap IDs. **Does not implement pages.**

| # | Action | Priority | Target | Backlog / Gap IDs | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | RESEARCH | CQ-P0 | `/industries/saas/` | CQ-IMP-001 / CRM-IND-SAAS (P0) | Replace generic CRM category copy on /industries/saas/ with Saas-specific buying context: industry priorities |
| 2 | RESEARCH | CQ-P0 | `/industries/small-business/` | CQ-IMP-002 / CRM-IND-SMB (P0) | Replace generic CRM category copy on /industries/small-business/ with Small Business-specific buying context: |
| 3 | RESEARCH | CQ-P0 | `/industries/real-estate/` | CQ-IMP-003 / CRM-IND-RE (P1) | Replace generic CRM category copy on /industries/real-estate/ with Real Estate-specific buying context: indust |
| 4 | RESEARCH | CQ-P0 | `/industries/healthcare/` | CQ-IMP-004 / CRM-IND-HC (P1) | Replace generic CRM category copy on /industries/healthcare/ with Healthcare-specific buying context: industry |
| 5 | RESEARCH | CQ-P0 | `/industries/retail-ecommerce/` | CQ-IMP-005 / CRM-IND-RET (P1) | Replace generic CRM category copy on /industries/retail-ecommerce/ with Retail Ecommerce-specific buying conte |
| 6 | RESEARCH | CQ-P0 | `/industries/legal-services/` | CQ-IMP-006 / CRM-IND-LEG (P1) | Replace generic CRM category copy on /industries/legal-services/ with Legal Services-specific buying context: |
| 7 | RESEARCH | CQ-P0 | `/industries/manufacturing/` | CQ-IMP-007 / CRM-IND-MFG (P2) | Replace generic CRM category copy on /industries/manufacturing/ with Manufacturing-specific buying context: in |
| 8 | RESEARCH | CQ-P0 | `/industries/education/` | CQ-IMP-008 / CRM-IND-EDU (P2) | Replace generic CRM category copy on /industries/education/ with Education-specific buying context: industry p |
| 9 | RESEARCH | CQ-P0 | `/industries/nonprofit/` | CQ-IMP-009 / CRM-IND-NP (P2) | Replace generic CRM category copy on /industries/nonprofit/ with Nonprofit-specific buying context: industry p |
| 10 | RESEARCH | CQ-P0 | `/industries/hospitality/` | CQ-IMP-010 / CRM-IND-HOSP (P2) | Replace generic CRM category copy on /industries/hospitality/ with Hospitality-specific buying context: indust |
| 11 | RESEARCH | CQ-P0 | `/industries/construction/` | CQ-IMP-011 / CRM-IND-CON (P2) | Replace generic CRM category copy on /industries/construction/ with Construction-specific buying context: indu |
| 12 | RESEARCH | CQ-P0 | `/industries/transportation-logistics/` | CQ-IMP-012 / CRM-IND-LOG (P2) | Replace generic CRM category copy on /industries/transportation-logistics/ with Transportation Logistics-speci |
| 13 | RESEARCH | CQ-P1 | `/best/crm-software/` | CQ-IMP-013 / CRM-BUY-001 (P0) | Best CRM (`/best/crm-software/`) is a P0 commercial pillar but still fails approved-recommendation / rationale |
| 14 | LINK | CQ-P2 | `/use-cases/pipeline-management/` | CRM-UC-001 (P0) | Add a concrete decision module on /use-cases/pipeline-management/: requirements/scorecard framing, best-fit sc |
| 15 | LINK | CQ-P2 | `/use-cases/lead-management/` | CRM-UC-002 (P0) | Add a concrete decision module on /use-cases/lead-management/: requirements/scorecard framing, best-fit scenar |
| 16 | LINK | CQ-P2 | `/use-cases/contact-management/` | CRM-UC-003 (P0) | Add a concrete decision module on /use-cases/contact-management/: requirements/scorecard framing, best-fit sce |
| 17 | LINK | CQ-P2 | `/use-cases/sales-automation/` | CRM-UC-004 (P0) | Add a concrete decision module on /use-cases/sales-automation/: requirements/scorecard framing, best-fit scena |
| 18 | LINK | CQ-P2 | `/use-cases/relationship-management/` | CRM-UC-007 (P0) | Add a concrete decision module on /use-cases/relationship-management/: requirements/scorecard framing, best-fi |
| 19 | LINK | CQ-P2 | `/capabilities/contact-management/` | CRM-CAP-001 (P0) | Add a concrete decision module on /capabilities/contact-management/: requirements/scorecard framing, best-fit |
| 20 | LINK | CQ-P2 | `/capabilities/relationship-management/` | CRM-CAP-002 (P0) | Add a concrete decision module on /capabilities/relationship-management/: requirements/scorecard framing, best |
| 21 | LINK | CQ-P2 | `/capabilities/lead-management/` | CRM-CAP-003 (P0) | Add a concrete decision module on /capabilities/lead-management/: requirements/scorecard framing, best-fit sce |
| 22 | LINK | CQ-P2 | `/capabilities/pipeline-management/` | CRM-CAP-004 (P0) | Add a concrete decision module on /capabilities/pipeline-management/: requirements/scorecard framing, best-fit |
| 23 | LINK | CQ-P2 | `/capabilities/deal-management/` | CRM-CAP-005 (P0) | Add a concrete decision module on /capabilities/deal-management/: requirements/scorecard framing, best-fit sce |
| 24 | LINK | CQ-P2 | `/capabilities/workflow-automation/` | CRM-CAP-006 (P0) | Add a concrete decision module on /capabilities/workflow-automation/: requirements/scorecard framing, best-fit |
| 25 | LINK | CQ-P2 | `/capabilities/reporting/` | CRM-CAP-009 (P0) | Add a concrete decision module on /capabilities/reporting/: requirements/scorecard framing, best-fit scenarios |
| 26 | RESEARCH | CQ-P2 | `/requirements/separate-sales-processes/` | CQ-IMP-026 / CRM-REQ-001 (P0) | Do not expand narrative on /requirements/separate-sales-processes/ until required research evidence exists. Ad |
| 27 | RESEARCH | CQ-P2 | `/requirements/automate-lead-follow-up/` | CQ-IMP-027 / CRM-REQ-002 (P0) | Do not expand narrative on /requirements/automate-lead-follow-up/ until required research evidence exists. Add |
| 28 | RESEARCH | CQ-P2 | `/requirements/restrict-access-by-team/` | CQ-IMP-028 / CRM-REQ-003 (P0) | Do not expand narrative on /requirements/restrict-access-by-team/ until required research evidence exists. Add |
| 29 | RESEARCH | CQ-P2 | `/requirements/track-client-interactions/` | CQ-IMP-029 / CRM-REQ-005 (P0) | Do not expand narrative on /requirements/track-client-interactions/ until required research evidence exists. A |
| 30 | RESEARCH | CQ-P2 | `/requirements/integrate-with-email/` | CQ-IMP-030 / CRM-REQ-008 (P0) | Do not expand narrative on /requirements/integrate-with-email/ until required research evidence exists. Add pr |
| 31 | LINK | CQ-P2 | `/use-cases/email-outreach/` | CRM-UC-005 (P1) | Add a concrete decision module on /use-cases/email-outreach/: requirements/scorecard framing, best-fit scenari |
| 32 | LINK | CQ-P2 | `/use-cases/sales-engagement/` | CRM-UC-008 (P1) | Add a concrete decision module on /use-cases/sales-engagement/: requirements/scorecard framing, best-fit scena |
| 33 | LINK | CQ-P2 | `/use-cases/reporting/` | CRM-UC-009 (P1) | Add a concrete decision module on /use-cases/reporting/: requirements/scorecard framing, best-fit scenarios, o |
| 34 | LINK | CQ-P2 | `/use-cases/account-management/` | CRM-UC-010 (P1) | Add a concrete decision module on /use-cases/account-management/: requirements/scorecard framing, best-fit sce |
| 35 | LINK | CQ-P2 | `/use-cases/outbound-sales/` | CRM-UC-011 (P1) | Add a concrete decision module on /use-cases/outbound-sales/: requirements/scorecard framing, best-fit scenari |
| 36 | LINK | CQ-P2 | `/use-cases/inbound-sales/` | CRM-UC-012 (P1) | Add a concrete decision module on /use-cases/inbound-sales/: requirements/scorecard framing, best-fit scenario |
| 37 | LINK | CQ-P2 | `/use-cases/complex-sales-processes/` | CRM-UC-015 (P1) | Add a concrete decision module on /use-cases/complex-sales-processes/: requirements/scorecard framing, best-fi |
| 38 | LINK | CQ-P2 | `/use-cases/customer-follow-up/` | CRM-UC-016 (P1) | Add a concrete decision module on /use-cases/customer-follow-up/: requirements/scorecard framing, best-fit sce |
| 39 | LINK | CQ-P2 | `/use-cases/sales-forecasting/` | CRM-UC-017 (P1) | Add a concrete decision module on /use-cases/sales-forecasting/: requirements/scorecard framing, best-fit scen |
| 40 | LINK | CQ-P2 | `/capabilities/email/` | CRM-CAP-007 (P1) | Add a concrete decision module on /capabilities/email/: requirements/scorecard framing, best-fit scenarios, or |
| 41 | LINK | CQ-P2 | `/capabilities/sales-engagement/` | CRM-CAP-008 (P1) | Add a concrete decision module on /capabilities/sales-engagement/: requirements/scorecard framing, best-fit sc |
| 42 | LINK | CQ-P2 | `/capabilities/forecasting/` | CRM-CAP-010 (P1) | Add a concrete decision module on /capabilities/forecasting/: requirements/scorecard framing, best-fit scenari |
| 43 | LINK | CQ-P2 | `/capabilities/customization/` | CRM-CAP-011 (P1) | Add a concrete decision module on /capabilities/customization/: requirements/scorecard framing, best-fit scena |
| 44 | LINK | CQ-P2 | `/capabilities/integrations/` | CRM-CAP-012 (P1) | Add a concrete decision module on /capabilities/integrations/: requirements/scorecard framing, best-fit scenar |
| 45 | LINK | CQ-P2 | `/capabilities/administration/` | CRM-CAP-013 (P1) | Add a concrete decision module on /capabilities/administration/: requirements/scorecard framing, best-fit scen |
| 46 | LINK | CQ-P2 | `/capabilities/security/` | CRM-CAP-014 (P1) | Add a concrete decision module on /capabilities/security/: requirements/scorecard framing, best-fit scenarios, |
| 47 | RESEARCH | CQ-P2 | `/requirements/forecast-revenue/` | CQ-IMP-047 / CRM-REQ-004 (P1) | Do not expand narrative on /requirements/forecast-revenue/ until required research evidence exists. Add primar |
| 48 | RESEARCH | CQ-P2 | `/requirements/customize-record-fields/` | CQ-IMP-048 / CRM-REQ-006 (P1) | Do not expand narrative on /requirements/customize-record-fields/ until required research evidence exists. Add |
| 49 | RESEARCH | CQ-P2 | `/requirements/support-sso/` | CQ-IMP-049 / CRM-REQ-009 (P1) | Do not expand narrative on /requirements/support-sso/ until required research evidence exists. Add primary/off |
| 50 | RESEARCH | CQ-P2 | `/requirements/audit-user-activity/` | CQ-IMP-050 / CRM-REQ-010 (P1) | Do not expand narrative on /requirements/audit-user-activity/ until required research evidence exists. Add pri |

**Next recommended content action:** `RESEARCH` industry hub depth for `/industries/saas/` (`CQ-IMP-001` / `CRM-IND-SAAS`, CQ-P0) via IndustryHub depth pipeline — deepen existing hub, do not create sibling keyword URLs. Interactive CRM tools + UAT worksheet shipped 2026-08-18.

<!-- END: quality-ecosystem-enrichment -->

## 1. Master CRM tree

```text
CRM
│
├── ✅ CRM Hub (/categories/crm/)
├── ⚪ Optional alias /crm/ → redirect
│
├── LEARN
│   ├── ✅ What is CRM?  [CRM-LRN-001] `/guides/what-is-crm/`
│   ├── ✅ How CRM works  [CRM-LRN-002] `/guides/how-crm-works/`
│   ├── ✅ Types of CRM  [CRM-LRN-003] `/guides/types-of-crm/`
│   ├── ✅ CRM benefits  [CRM-LRN-004] `/guides/crm-benefits/`
│   ├── ✅ CRM glossary  [CRM-LRN-005] `/guides/crm-glossary/`
│   ├── ✅ CRM examples  [CRM-LRN-006] `/guides/crm-examples/`
│   ├── ✅ CRM vs spreadsheet  [CRM-LRN-007] `/guides/crm-vs-spreadsheet/`
│   ├── ✅ CRM vs ERP  [CRM-LRN-008] `/guides/crm-vs-erp/`
│   ├── ✅ CRM vs marketing automation  [CRM-LRN-009] `/guides/crm-vs-marketing-automation/`
│   ├── ✅ CRM vs customer service software  [CRM-LRN-010] `/guides/crm-vs-customer-service-software/`
│   ├── ✅ CRM vs CDP  [CRM-LRN-011] `/guides/crm-vs-cdp/`
│   ├── ✅ Do I need a CRM?  [CRM-LRN-012] `/guides/do-i-need-a-crm/`
│   ├── ✅ When to adopt CRM  [CRM-LRN-013] `/guides/when-to-adopt-crm/`
│   ├── ✅ Common CRM mistakes  [CRM-LRN-014] `/guides/common-crm-mistakes/`
│
├── CHOOSE
│   ├── ✅ Best CRM Software  [CRM-BUY-001] `/best/crm-software/`  (approved + indexable)
│   ├── ✅ How to Choose CRM  [CRM-BUY-002] `/guides/how-to-choose-crm/`
│   ├── ✅ CRM Requirements Guide  [CRM-BUY-003] `/guides/crm-requirements-guide/`
│   ├── ✅ CRM Evaluation Guide  [CRM-BUY-004] `/guides/crm-evaluation-guide/`
│   ├── ✅ CRM Selection Process  [CRM-BUY-005] `/guides/crm-selection-process/`
│   ├── ✅ CRM Vendor Evaluation  [CRM-BUY-006] `/guides/crm-vendor-evaluation/`
│   ├── ✅ CRM RFP Guide  [CRM-BUY-007] `/guides/crm-rfp-guide/`
│   ├── ✅ CRM Demo Guide  [CRM-BUY-008] `/guides/crm-demo-guide/`
│   ├── ✅ CRM Trial Evaluation  [CRM-BUY-009] `/guides/crm-trial-evaluation/`
│   ├── ✅ CRM Pricing Guide  [CRM-BUY-010] `/guides/crm-pricing-guide/`
│   ├── ✅ CRM Total Cost Guide  [CRM-BUY-011] `/guides/crm-total-cost-guide/`
│   ├── ✅ CRM ROI Guide  [CRM-BUY-012] `/guides/crm-roi-guide/`
│   ├── ✅ CRM Business Case  [CRM-BUY-013] `/guides/crm-business-case/`
│   ├── ✅ CRM Vendor Questions  [CRM-BUY-014] `/guides/crm-vendor-questions/`
│   ├── ✅ CRM Selection Mistakes  [CRM-BUY-015] `/guides/crm-selection-mistakes/`
│
├── TOOLS
│   ├── ✅ CRM Finder  [CRM-TOOL-001] `/tools/crm-finder/`
│   ├── ✅ CRM Cost Calculator  [CRM-TOOL-002] `/tools/crm-cost-calculator/`
│   ├── 🟡 Software Stack Builder  [CRM-TOOL-003] `/tools/software-stack-builder/`
│   ├── ✅ CRM ROI Calculator  [CRM-TOOL-004] `/tools/crm-roi-calculator/`
│   ├── ✅ CRM TCO Calculator  [CRM-TOOL-005] `/tools/crm-tco-calculator/`
│   ├── ✅ Tools hub  [CRM-TOOL-006] `/tools/`
│   ├── ✅ CRM Requirements Builder  [CRM-TOOL-007] `/tools/crm-requirements-builder/`
│   ├── ✅ CRM Vendor Scorecard  [CRM-TOOL-008] `/tools/crm-vendor-scorecard/`
│   ├── ✅ CRM Implementation Planner  [CRM-TOOL-009] `/tools/crm-implementation-planner/`
│   ├── ✅ CRM Migration Planner  [CRM-TOOL-010] `/tools/crm-migration-planner/`
│   ├── ✅ CRM RFP / Vendor Brief Builder  [CRM-TOOL-011] `/tools/crm-rfp-builder/`
│   ├── ✅ CRM Demo Checklist Builder  [CRM-TOOL-012] `/tools/crm-demo-checklist-builder/`
│   ├── ✅ CRM Readiness Assessment  [CRM-TOOL-013] `/tools/crm-readiness-assessment/`  ← diagnostic start
│   ├── ✅ CRM Plan Selector  [CRM-TOOL-014] `/tools/crm-plan-selector/`
│   ├── ✅ CRM Migration Cost Calculator  [CRM-TOOL-015] `/tools/crm-migration-cost-calculator/`
│   ├── ✅ CRM Adoption / Health Assessment  [CRM-TOOL-016] `/tools/crm-adoption-health-assessment/`
│   ├── ✅ CRM Multi-product compare  [CRM-CMP-003] `/tools/crm-multi-compare/`
│
├── PRICING
│   ├── ✅ CRM Pricing index  [CRM-PRICE-000] `/pricing/`
│
├── PRODUCTS
│   ├── ✅ [Product] Review hub  [CRM-PRD-T001] `/software/[slug]/`
│   ├── ✅ [Product] Pricing  [CRM-PRD-T002] `/pricing/[slug]/`
│   ├── ✅ [Product] Features tab  [CRM-PRD-T003] `/software/[slug]/features/`
│   ├── ✅ [Product] Pros & Cons  [CRM-PRD-T004] (review section)
│   ├── 🟡 [Product] Alternatives  [CRM-PRD-T005] `/alternatives/[slug]/`
│   ├── 🟡 [Product] Integrations  [CRM-PRD-T006] tab/section
│   ├── 🟡 [Product] Security  [CRM-PRD-T007] section
│   ├── ✅ [Product] Implementation  [CRM-PRD-T008] `/guides/{product}-implementation/`
│   ├── ✅ [Product] Migration  [CRM-PRD-T009] `/guides/{product}-migration/`
│   ├── ✅ [Product] Setup  [CRM-PRD-T010] `/guides/{product}-setup/`
│   ├── ✅ [Product] Plan / Free vs Paid  [CRM-PRD-T011] `/guides/{product}-plans/`
│   ├── ✅ [Product] Worth It?  [CRM-PRD-T012] `/guides/is-{product}-worth-it/`
│   ├── ✅ HubSpot CRM Review  [CRM-PRD-EX-HS] `/software/hubspot/`
│   ├── ✅ Salesforce Review  [CRM-PRD-EX-SF] `/software/salesforce/`
│   ├── ✅ Pipedrive Review  [CRM-PRD-EX-PD] `/software/pipedrive/`
│   ├── 🟡🔬 Pipedrive Alternatives  [CRM-PRD-EX-PD-ALT] `/alternatives/pipedrive/`
│   ├── 🟡 Alternatives hub  [CRM-ALT-000] `/alternatives/`
│   ├── ✅ Software directory  [CRM-SOFT-000] `/software/`
│
├── COMPARE
│   ├── ✅ Comparisons hub  [CRM-CMP-000] `/compare/`
│   ├── ✅ Head-to-head template  [CRM-CMP-001] `/compare/[slug]/`
│   ├── 🟡 Compare builder  [CRM-CMP-002] `/compare/build/`
│   ├── ✅ CRM Multi-product compare  [CRM-CMP-003] `/tools/crm-multi-compare/`
│   ├── 🚫 DO NOT CREATE mass contextual compares  [CRM-CMP-CTX-001] `/guides/{a}-vs-{b}-for-{context}/`  ← OPTIONAL only w/ eligibility; default DNC (CQ-GAP-048)
│
├── BUSINESS TYPE
│   ├── ✅ For index  [CRM-AUD-000] `/for/`
│   ├── ✅ CRM for Small Business  [CRM-AUD-001] `/for/small-business/`
│   ├── ✅ CRM for Startups  [CRM-AUD-002] `/for/startups/`
│   ├── ✅ CRM for Enterprise  [CRM-AUD-003] `/for/enterprise/`
│   ├── ✅ CRM for Freelancers  [CRM-AUD-004] `/for/freelancers/`
│   ├── ✅ CRM for Agencies  [CRM-AUD-005] `/for/agencies/`
│   ├── ✅ CRM for Nonprofits  [CRM-AUD-006] `/for/nonprofits/`
│   ├── ✅ CRM for Growing Teams  [CRM-AUD-007] `/for/growing-teams/`
│   ├── ✅ CRM for Remote Sales Teams  [CRM-AUD-008] `/for/sales-teams/`
│
├── INDUSTRIES
│   ├── 🚫 DO NOT CREATE: product×every industry · feature×every use case (CQ-GAP-049/050)
│   ├── 🟡🔬 Industries index  [CRM-IND-000] `/industries/`
│   ├── ✅ CRM for Financial Services  [CRM-IND-FS] `/industries/financial-services/`  (depth + quality pack)
│   ├── ✅ CRM for SaaS  [CRM-IND-SAAS] `/industries/saas/`  (depth + quality pack)
│   ├── ✅ CRM for Small Business (industry)  [CRM-IND-SMB] `/industries/small-business/`  (depth + quality pack; related `/for/small-business/`)
│   ├── ✅ CRM for Real Estate  [CRM-IND-RE] `/industries/real-estate/`  (depth + quality pack)
│   ├── ✅ CRM for Healthcare  [CRM-IND-HC] `/industries/healthcare/`  (depth + quality pack)
│   ├── ✅ CRM for Retail  [CRM-IND-RET] `/industries/retail-ecommerce/`  (depth + quality pack)
│   ├── ✅ CRM for Legal  [CRM-IND-LEG] `/industries/legal-services/`  (depth + quality pack)
│   ├── ✅ CRM for Manufacturing  [CRM-IND-MFG] `/industries/manufacturing/`  (depth + quality pack)
│   ├── ✅ CRM for Education  [CRM-IND-EDU] `/industries/education/`  (depth + quality pack)
│   ├── ✅ CRM for Nonprofit  [CRM-IND-NP] `/industries/nonprofit/`  (depth + quality pack)
│   ├── ✅ CRM for Hospitality  [CRM-IND-HOSP] `/industries/hospitality/`  (depth + quality pack)
│   ├── ✅ CRM for Construction  [CRM-IND-CON] `/industries/construction/`  (depth + quality pack)
│   ├── ✅ CRM for Logistics  [CRM-IND-LOG] `/industries/transportation-logistics/`  (depth + quality pack)
│   ├── 🟢 FS supporting guide pack  [CRM-IND-L3-FS] `/guides/financial-services-crm-*`  (7 guides approved)
│   ├── 🟡 Industry nested entities  [CRM-IND-NEST] FS nests live
│
├── USE CASES
│   ├── 🟢 Use cases index  [CRM-UC-000] `/use-cases/`  (approved)
│   ├── 🟢 Pipeline Management  [CRM-UC-001] `/use-cases/pipeline-management/`  (approved)
│   ├── 🟢 Lead Management  [CRM-UC-002] `/use-cases/lead-management/`  (approved)
│   ├── 🟢 Contact Management  [CRM-UC-003] `/use-cases/contact-management/`  (approved)
│   ├── 🟢 Sales Automation  [CRM-UC-004] `/use-cases/sales-automation/`  (approved)
│   ├── 🟢 Email Outreach  [CRM-UC-005] `/use-cases/email-outreach/`  (approved)
│   ├── 🟢 Prospecting  [CRM-UC-006] `/use-cases/prospecting/`  (approved)
│   ├── 🟢 Relationship Management  [CRM-UC-007] `/use-cases/relationship-management/`  (approved)
│   ├── 🟢 Sales Engagement  [CRM-UC-008] `/use-cases/sales-engagement/`  (approved)
│   ├── 🟢 Reporting  [CRM-UC-009] `/use-cases/reporting/`  (approved)
│   ├── 🟢 Account Management  [CRM-UC-010] `/use-cases/account-management/`  (approved)
│   ├── 🟢 Outbound Sales  [CRM-UC-011] `/use-cases/outbound-sales/`  (approved)
│   ├── 🟢 Inbound Sales  [CRM-UC-012] `/use-cases/inbound-sales/`  (approved)
│   ├── 🟢 Field Sales  [CRM-UC-013] `/use-cases/field-sales/`  (approved)
│   ├── 🟢 High-volume Lead Management  [CRM-UC-014] `/use-cases/high-volume-lead-management/`  (approved)
│   ├── 🟢 Complex Sales Processes  [CRM-UC-015] `/use-cases/complex-sales-processes/`  (approved)
│   ├── 🟢 Customer Follow-up  [CRM-UC-016] `/use-cases/customer-follow-up/`  (approved)
│   ├── 🟢 Sales Forecasting  [CRM-UC-017] `/use-cases/sales-forecasting/`  (approved)
│
├── CAPABILITIES
│   ├── ✅ Capabilities index  [CRM-CAP-000] `/capabilities/`
│   ├── ✅ Contact Management  [CRM-CAP-001] `/capabilities/contact-management/`
│   ├── ✅ Relationship Management  [CRM-CAP-002] `/capabilities/relationship-management/`
│   ├── ✅ Lead Management  [CRM-CAP-003] `/capabilities/lead-management/`
│   ├── ✅ Pipeline Management  [CRM-CAP-004] `/capabilities/pipeline-management/`  (FS nest also)
│   ├── ✅ Deal Management  [CRM-CAP-005] `/capabilities/deal-management/`
│   ├── ✅ Workflow Automation  [CRM-CAP-006] `/capabilities/workflow-automation/`  (FS nest also)
│   ├── ✅ Email Capabilities  [CRM-CAP-007] `/capabilities/email/`
│   ├── ✅ Calling / Sales Engagement  [CRM-CAP-008] `/capabilities/sales-engagement/`
│   ├── ✅ Reporting  [CRM-CAP-009] `/capabilities/reporting/`
│   ├── ✅ Forecasting  [CRM-CAP-010] `/capabilities/forecasting/`
│   ├── ✅ Customization  [CRM-CAP-011] `/capabilities/customization/`
│   ├── ✅ Integrations  [CRM-CAP-012] `/capabilities/integrations/`
│   ├── ✅ Administration  [CRM-CAP-013] `/capabilities/administration/`
│   ├── ✅ Security  [CRM-CAP-014] `/capabilities/security/`
│   ├── ✅ Mobile  [CRM-CAP-015] `/capabilities/mobile/`
│   ├── ✅ AI Assistance  [CRM-CAP-016] `/capabilities/ai-assistance/`
│
├── REQUIREMENTS
│   ├── 🟢 Requirements index  [CRM-REQ-000] `/requirements/`  (approved)
│   ├── 🟢 Separate sales processes  [CRM-REQ-001] `/requirements/separate-sales-processes/`  (approved)
│   ├── 🟢 Automate lead follow-up  [CRM-REQ-002] `/requirements/automate-lead-follow-up/`  (approved)
│   ├── 🟢 Restrict access by team  [CRM-REQ-003] `/requirements/restrict-access-by-team/`  (approved)
│   ├── 🟢 Forecast revenue  [CRM-REQ-004] `/requirements/forecast-revenue/`  (approved)
│   ├── 🟢 Track client interactions  [CRM-REQ-005] `/requirements/track-client-interactions/`  (approved)
│   ├── 🟢 Customize record fields  [CRM-REQ-006] `/requirements/customize-record-fields/`  (approved)
│   ├── 🟢 Support multiple currencies  [CRM-REQ-007] `/requirements/support-multiple-currencies/`  (approved)
│   ├── 🟢 Integrate with email  [CRM-REQ-008] `/requirements/integrate-with-email/`  (approved)
│   ├── 🟢 Support SSO  [CRM-REQ-009] `/requirements/support-sso/`  (approved)
│   ├── 🟢 Audit user activity  [CRM-REQ-010] `/requirements/audit-user-activity/`  (approved)
│
├── FEATURES
│   ├── ✅ Features index  [CRM-FEAT-000] `/features/`
│   ├── ✅ Multiple pipelines  [CRM-FEAT-001] `/features/multiple-pipelines/`
│   ├── ✅ Workflow automation  [CRM-FEAT-002] `/features/workflow-automation/`
│   ├── ✅ Custom pipeline stages  [CRM-FEAT-003] `/features/custom-pipeline-stages/`
│   ├── ✅ Email sync  [CRM-FEAT-004] `/features/email-sync/`
│   ├── ✅ Lead scoring  [CRM-FEAT-005] `/features/lead-scoring/`
│   ├── ✅ Custom fields  [CRM-FEAT-006] `/features/custom-fields/`
│   ├── ✅ Forecasting  [CRM-FEAT-007] `/features/forecasting/`
│   ├── ✅ Reporting dashboards  [CRM-FEAT-008] `/features/reporting-dashboards/`
│   ├── ✅ Calling  [CRM-FEAT-009] `/features/calling/`
│   ├── ✅ Sequences  [CRM-FEAT-010] `/features/email-sequences/`
│   ├── ✅ SSO  [CRM-FEAT-011] `/features/sso/`
│   ├── ✅ Audit logs  [CRM-FEAT-012] `/features/audit-logs/`
│   ├── ✅ Role permissions  [CRM-FEAT-013] `/features/role-permissions/`
│   ├── ✅ API access  [CRM-FEAT-014] `/features/api-access/`
│   ├── ✅ Mobile app  [CRM-FEAT-015] `/features/mobile-app/`
│   ├── ✅ AI assistance  [CRM-FEAT-016] `/features/ai-assistance/`
│
├── IMPLEMENTATION
│   ├── ✅ CRM Implementation Guide  [CRM-IMP-000] `/guides/crm-implementation/`
│   ├── ✅ Plan CRM Implementation  [CRM-IMP-001] `/guides/crm-implementation-planning/`
│   ├── ✅ Implementation Timeline  [CRM-IMP-002] `/guides/crm-implementation-timeline/`
│   ├── ✅ Implementation Cost  [CRM-IMP-003] `/guides/crm-implementation-cost/`
│   ├── ✅ Implementation Roles  [CRM-IMP-004] `/guides/crm-implementation-roles/`
│   ├── ✅ Implementation Mistakes  [CRM-IMP-005] `/guides/crm-implementation-mistakes/`
│   ├── ✅ CRM Data Migration Guide  [CRM-IMP-006] `/guides/crm-data-migration/`
│   ├── ✅ Clean CRM Data  [CRM-IMP-007] `/guides/crm-data-cleaning/`
│   ├── ✅ Field Mapping Guide  [CRM-IMP-008] `/guides/crm-field-mapping/`
│   ├── ✅ CRM Testing Guide  [CRM-IMP-009] `/guides/crm-testing/`
│   ├── ✅ CRM Go-Live Guide  [CRM-IMP-010] `/guides/crm-go-live/`
│   ├── ✅ CRM Training Guide  [CRM-IMP-011] `/guides/crm-training/`
│   ├── ✅ CRM Adoption Guide  [CRM-IMP-012] `/guides/crm-adoption/`
│   ├── ✅ CRM Governance Guide  [CRM-IMP-013] `/guides/crm-governance/`
│   ├── ✅ CRM Data Quality Guide  [CRM-IMP-014] `/guides/crm-data-quality/`
│   ├── ✅ CRM Change Management  [CRM-IMP-015] `/guides/crm-change-management/`
│   ├── ✅ CRM Implementation KPIs  [CRM-IMP-016] `/guides/crm-implementation-kpis/`
│
├── OPTIMIZATION
│   ├── ✅ Improve CRM Adoption  [CRM-OPT-001] `/guides/improve-crm-adoption/`
│   ├── ✅ CRM Data Hygiene  [CRM-OPT-002] `/guides/crm-data-hygiene/`
│   ├── ✅ Reporting Best Practices  [CRM-OPT-003] `/guides/crm-reporting-best-practices/`
│   ├── ✅ Automation Best Practices  [CRM-OPT-004] `/guides/crm-automation-best-practices/`
│   ├── ✅ CRM Governance Ops  [CRM-OPT-005] `/guides/crm-governance-operations/`
│   ├── ✅ CRM Audit Guide  [CRM-OPT-006] `/guides/crm-audit/`
│   ├── ✅ CRM Health Check  [CRM-OPT-007] `/guides/crm-health-check/`
│   ├── ✅ When to Replace CRM  [CRM-OPT-009] `/guides/when-to-replace-crm/`
│   ├── ✅ Migrate to Another Vendor  [CRM-OPT-010] `/guides/crm-vendor-migration/`
│
├── RESOURCES
│   ├── 🟢 Evaluation Checklist  [CRM-RES-001] `/resources/crm-evaluation-checklist/`  (approved)
│   ├── 🟢 Requirements Template  [CRM-RES-002] `/resources/crm-requirements-template/`  (approved)
│   ├── 🟢 Vendor Scorecard  [CRM-RES-003] `/resources/crm-vendor-scorecard/`  (approved)
│   ├── 🟢 RFP Template  [CRM-RES-004] `/resources/crm-rfp-template/`  (approved)
│   ├── 🟢 Demo Checklist  [CRM-RES-005] `/resources/crm-demo-checklist/`  (approved)
│   ├── 🟢 Implementation Checklist  [CRM-RES-006] `/resources/crm-implementation-checklist/`  (approved)
│   ├── 🟢 UAT test script worksheet  [CRM-RES-UAT] `/resources/crm-uat-test-script/`  (approved)
│   ├── 🟢 Migration Checklist  [CRM-RES-007] `/resources/crm-migration-checklist/`  (approved)
│   ├── 🟢 Go-Live Checklist  [CRM-RES-008] `/resources/crm-go-live-checklist/`  (approved)
│   ├── 🟢 Training Plan  [CRM-RES-009] `/resources/crm-training-plan/`  (approved)
│   ├── 🟢 Data Migration Template  [CRM-RES-010] `/resources/crm-data-migration-template/`  (approved)
│   ├── 🟢 Field Mapping Template  [CRM-RES-011] `/resources/crm-field-mapping-template/`  (approved)
│   ├── 🟢 Security Checklist  [CRM-RES-012] `/resources/crm-security-checklist/`  (approved)
│   ├── 🟢 Comparison Worksheet  [CRM-RES-013] `/resources/crm-comparison-worksheet/`  (approved)
│   ├── 🟢 Business Case Template  [CRM-RES-014] `/resources/crm-business-case-template/`  (approved)
│   ├── 🟢 Optimization Checklist  [CRM-RES-015] `/resources/crm-optimization-checklist/`  (approved)
│   ├── 🟢 Cleanup Checklist  [CRM-RES-016] `/resources/crm-cleanup-checklist/`  (approved)
│   ├── 🟢 Resources route template  [CRM-RES-TPL] `/resources/[slug]/`  (shipped)
│
├── EVIDENCE / METHODOLOGY
│   ├── ✅ Editorial methodology  [CRM-EVD-001] `/company/editorial-methodology/`
│   ├── ✅ How we review  [CRM-EVD-002] `/company/how-we-review-software/`
│
└── (see Product / Industry / Use-case support maps for instance expansion)
```

Also in tree scope (indexes & entry):

```text
✅ SoftwareGlimpse Home — `/`
✅ CRM Software — `/categories/crm/`
⚪ CRM alias — `/crm/`
🟡 For index — `/for/`
🟡 Industries index — `/industries/`
🟢 Use cases index — `/use-cases/`
✅ Capabilities index — `/capabilities/`
🟡 Requirements index — `/requirements/`
✅ Features index — `/features/`
✅ Guides hub — `/guides/`
🟡 Alternatives hub — `/alternatives/`
✅ Software directory — `/software/`
```

---

## 2. Master content table

Exhaustive candidate register (206 rows from target ecosystem master inventory + tools inventory).

| ID | Status | Priority | Domain | Cluster | Subcluster | Page/content type | Title | Current route | Target route | Parent | Supports | Supported by | Next step | Primary user intent | Primary CTA | Tool | Resource | Evidence requirement | Research state | Template | Agent | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM-L0-001 | ✅ EXISTING | P0 | CRM | Entry | Entry | home | SoftwareGlimpse Home | `/` | `/` | — | Entry | — | CRM Hub | Orient | CRM Finder | soft | — | light | sufficient-or-n/a | src/app/page.tsx | existing:guide-agent | CRM-leaning |
| CRM-L1-001 | ✅ EXISTING | P0 | CRM | Domain | Domain | category-hub | CRM Software | `/categories/crm/` | `/categories/crm/` | Home | Domain | see §3 | How to Choose / Finder | Orient+route | Finder/Best/Calc | yes | — | medium | sufficient-or-n/a | categories/[...slug] | existing:category-hub-agent | Canonical L1 |
| CRM-L1-002 | ⚪ OPTIONAL | P3 | CRM | Domain | Domain | redirect | CRM alias | — | `/crm/` | Domain hub | Domain | — | How to Choose / Finder | Alias | — | — | — | none | not-started | optional alias | existing:guide-agent | Redirect only |
| CRM-LRN-001 | ✅ EXISTING | P0 | CRM | Learn | Learn | definition | What is CRM? | `/guides/what-is-crm/` | same | Domain hub | Learn | — | Do I need / Requirements / How to choose | Educate | How to choose | soft | glossary | light | sufficient-or-n/a | guides/[slug] | existing:guide-agent | noindex today |
| CRM-LRN-002 | ✅ EXISTING | P0 | CRM | Learn | Learn | explainer | How CRM works | /guides/how-crm-works/ | /guides/how-crm-works/ | Domain hub | Learn | — | Do I need / Requirements / How to choose | Educate | Do I need | — | — | light | complete | guides/[slug] | existing:guide-agent | Published soft (indexable false); unique hero + diagrams |
| CRM-LRN-003 | ✅ EXISTING | P1 | CRM | Learn | Learn | explainer | Types of CRM | /guides/types-of-crm/ | /guides/types-of-crm/ | Domain hub | Learn | — | Do I need / Requirements / How to choose | Educate | Best | Finder | — | light | complete | guides/[slug] | existing:guide-agent | Published soft (indexable false); unique hero + diagrams |
| CRM-LRN-004 | ✅ EXISTING | P1 | CRM | Learn | Learn | explainer | CRM benefits | /guides/crm-benefits/ | /guides/crm-benefits/ | Domain hub | Learn | — | Do I need / Requirements / How to choose | Motivate | Finder | Finder | — | light | complete | guides/[slug] | existing:guide-agent | Published soft (indexable false); unique hero + diagrams |
| CRM-LRN-005 | ✅ EXISTING | P1 | CRM | Learn | Learn | glossary | CRM glossary | /guides/crm-glossary/ | /guides/crm-glossary/ | Domain hub | Learn | — | Do I need / Requirements / How to choose | Vocabulary | Requirements | — | — | light | complete | guides/[slug] | existing:guide-agent | Published soft (indexable false); unique hero + diagrams |
| CRM-LRN-006 | ✅ EXISTING | P2 | CRM | Learn | Learn | explainer | CRM examples | /guides/crm-examples/ | /guides/crm-examples/ | Domain hub | Learn | — | Do I need / Requirements / How to choose | Educate | Use cases | — | — | light | complete | guides/[slug] | existing:guide-agent | Published soft (indexable false); unique hero + diagrams |
| CRM-LRN-007 | ✅ EXISTING | P0 | CRM | Learn | Learn | decision-guide | CRM vs spreadsheet | `/guides/crm-vs-spreadsheet/` | same | Domain hub | Learn | — | Do I need / Requirements / How to choose | Boundary | Do I need | — | — | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published (indexable false); unique hero + matrix |
| CRM-LRN-008 | ✅ EXISTING | P1 | CRM | Learn | Learn | comparison-education | CRM vs ERP | `/guides/crm-vs-erp/` | same | Domain hub | Learn | — | Do I need / Requirements / How to choose | Boundary | Hub | — | — | light | complete | guides/[slug] | existing:guide-agent | Soft-published; unique hero + jobs diagram |
| CRM-LRN-009 | ✅ EXISTING | P1 | CRM | Learn | Learn | comparison-education | CRM vs marketing automation | `/guides/crm-vs-marketing-automation/` | same | Domain hub | Learn | — | Do I need / Requirements / How to choose | Boundary | Hub | — | — | light | complete | guides/[slug] | existing:guide-agent | Soft-published; unique hero + handoff diagram |
| CRM-LRN-010 | ✅ EXISTING | P2 | CRM | Learn | Learn | comparison-education | CRM vs customer service software | `/guides/crm-vs-customer-service-software/` | same | Domain hub | Learn | — | Do I need / Requirements / How to choose | Boundary | Hub | — | — | light | complete | guides/[slug] | existing:guide-agent | Soft-published; unique hero + jobs diagram |
| CRM-LRN-011 | ✅ EXISTING | P3 | CRM | Learn | Learn | comparison-education | CRM vs CDP | `/guides/crm-vs-cdp/` | same | Domain hub | Learn | — | Do I need / Requirements / How to choose | Boundary | Hub | — | — | light | complete | guides/[slug] | existing:guide-agent | Soft-published (was optional; now shipped); unique hero + roles diagram |
| CRM-LRN-012 | ✅ EXISTING | P0 | CRM | Learn | Learn→Choose | decision-guide | Do I need a CRM? | `/guides/do-i-need-a-crm/` | same | Domain hub | Learn→Choose | — | Do I need / Requirements / How to choose | Qualify | Finder | Finder | — | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + signals diagram |
| CRM-LRN-013 | ✅ EXISTING | P1 | CRM | Learn | Learn→Choose | decision-guide | When to adopt CRM | `/guides/when-to-adopt-crm/` | same | Domain hub | Learn→Choose | — | Do I need / Requirements / How to choose | Timing | How to choose | — | — | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + timeline |
| CRM-LRN-014 | ✅ EXISTING | P1 | CRM | Learn | Learn→Choose | guide | Common CRM mistakes | `/guides/common-crm-mistakes/` | same | Domain hub | Learn→Choose | — | Do I need / Requirements / How to choose | Risk | Checklist | — | RES-001 | light | complete | guides/[slug] | existing:guide-agent | Soft-published; unique hero + mistake/fix diagram |
| CRM-BUY-001 | ✅ EXISTING | P0 | CRM | Choose | Choose | best-detail | Best CRM Software | `/best/crm-software/` | same | Domain hub | Choose | see §3 | Finder / Product review | Decide | Finder | Finder/Calc | scorecard | **high** | complete | best/[slug] | existing:best-software-agent | Editorially approved and indexable 2026-08-15 |
| CRM-BUY-002 | ✅ EXISTING | P0 | CRM | Choose | Choose | decision-guide | How to Choose CRM | `/guides/how-to-choose-crm/` | same | Domain hub | Choose | — | Finder / Product review | Decide | Finder | Finder | RES-001 | medium | sufficient-or-n/a | guides/[slug] + guide-template-v1 | existing:guide-agent | noindex |
| CRM-BUY-003 | ✅ EXISTING | P0 | CRM | Choose | Choose | guide | CRM Requirements Guide | `/guides/crm-requirements-guide/` | same | Domain hub | Choose | — | Finder / Product review | Specify | Requirements | Finder | RES-002 | medium | complete | guides/[slug] | existing:guide-agent | Soft-published; unique hero + must/nice matrix |
| CRM-BUY-004 | ✅ EXISTING | P0 | CRM | Choose | Choose | decision-guide | CRM Evaluation Guide | `/guides/crm-evaluation-guide/` | same | Best | Choose | — | Finder / Product review | Evaluate | Scorecard | Finder | RES-003 | medium | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + trial scorecard |
| CRM-BUY-005 | ✅ EXISTING | P1 | CRM | Choose | Choose | how-to | CRM Selection Process | `/guides/crm-selection-process/` | same | How to choose | Choose | — | Finder / Product review | Process | Finder | — | RES-001 | light | complete | guides/[slug] | existing:guide-agent | Soft-published; unique hero + RACI diagram |
| CRM-BUY-006 | ✅ EXISTING | P1 | CRM | Choose | Choose | decision-guide | CRM Vendor Evaluation | `/guides/crm-vendor-evaluation/` | same | Evaluation | Choose | — | Finder / Product review | Vendor fit | Compare | — | RES-003 | medium | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + diligence cards |
| CRM-BUY-007 | ✅ EXISTING | P2 | CRM | Choose | Choose | guide | CRM RFP Guide | `/guides/crm-rfp-guide/` | same | Vendor eval | Choose | — | Finder / Product review | Formal buy | RFP template | Requirements Builder | RES-004 | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + brief structure diagram |
| CRM-BUY-008 | ✅ EXISTING | P1 | CRM | Choose | Choose | how-to | CRM Demo Guide | `/guides/crm-demo-guide/` | same | Evaluation | Choose | — | Finder / Product review | Demo | Demo checklist | Finder | RES-005 | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + buyer agenda diagram |
| CRM-BUY-009 | ✅ EXISTING | P1 | CRM | Choose | Choose | how-to | CRM Trial Evaluation | `/guides/crm-trial-evaluation/` | same | Evaluation | Choose | — | Finder / Product review | Trial | Scorecard | Finder | RES-003 | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + scripted trial week |
| CRM-BUY-010 | ✅ EXISTING | P0 | CRM | Choose | Pricing | pricing-education | CRM Pricing Guide | `/guides/crm-pricing-guide/` | same | Pricing hub | Pricing | — | Finder / Product review | Cost literacy | Calculator | Calculator | — | medium | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + pricing anatomy (no invented prices) |
| CRM-BUY-011 | ✅ EXISTING | P1 | CRM | Choose | Pricing | pricing-education | CRM Total Cost Guide | `/guides/crm-total-cost-guide/` | same | Pricing guide | Pricing | — | Finder / Product review | TCO | Calculator | TCO tool | RES-014 | medium | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + TCO category map |
| CRM-BUY-012 | ✅ EXISTING | P2 | CRM | Choose | Choose | guide | CRM ROI Guide | `/guides/crm-roi-guide/` | same | Business case | Choose | — | Finder / Product review | Justify | ROI tool | Calculator | RES-014 | medium | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + ROI logic (no fake %) |
| CRM-BUY-013 | ✅ EXISTING | P2 | CRM | Choose | Choose | guide | CRM Business Case | `/guides/crm-business-case/` | same | ROI | Choose | — | Finder / Product review | Justify | Calculator | Finder | RES-014 | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + memo outline |
| CRM-BUY-014 | ✅ EXISTING | P1 | CRM | Choose | Choose | guide | CRM Vendor Questions | `/guides/crm-vendor-questions/` | same | Vendor eval | Choose | — | Finder / Product review | Diligence | Demo | Finder | RES-005 | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + question bank map |
| CRM-BUY-015 | ✅ EXISTING | P1 | CRM | Choose | Choose | guide | CRM Selection Mistakes | `/guides/crm-selection-mistakes/` | same | How to choose | Choose | — | Finder / Product review | Risk | Checklist | Finder | RES-001 | light | complete | guides/[slug] + guide-template-v1 | existing:guide-agent | Soft-published; unique hero + five regret patterns |
| CRM-TOOL-001 | ✅ EXISTING | P0 | CRM | Tools | Choose | finder | CRM Finder | `/tools/crm-finder/` | same | Tools hub | Choose | — | Product review / Pricing | Shortlist | Product CTAs | self | — | fit model | sufficient-or-n/a | tools/crm-finder | needs-extension:tools-platform |  |
| CRM-TOOL-002 | ✅ EXISTING | P0 | CRM | Tools | Pricing | calculator | CRM Cost Calculator | `/tools/crm-cost-calculator/` | same | Tools hub | Pricing | — | Product review / Pricing | Estimate | Pricing pages | self | — | pricing verified | sufficient-or-n/a | tools/crm-cost-calculator | needs-extension:tools-platform |  |
| CRM-TOOL-003 | 🟡 PARTIAL | P1 | CRM | Tools | Choose | stack-builder | Software Stack Builder | `/tools/software-stack-builder/` | same | Tools hub | Choose | — | Product review / Pricing | Stack | Finder | soft | — | CRM-first | partial | tools/software-stack-builder | needs-extension:tools-platform |  |
| CRM-TOOL-004 | ✅ LIVE | P1 | CRM | Tools | Choose | calculator | CRM ROI Calculator | `/tools/crm-roi-calculator/` | same | Tools hub | Choose | — | Product review / Pricing | Justify | Business case | self | RES-014 | model | shipped | tools/crm-roi-calculator | needs-extension:tools-platform | Live — estimates economic value vs cost; assumptions stay explicit · CQ-GAP-001 |
| CRM-TOOL-005 | ✅ LIVE | P0 | CRM | Tools | Pricing | calculator | CRM TCO Calculator | `/tools/crm-tco-calculator/` | same | Tools hub | Pricing | — | Product review / Pricing | TCO | Pricing guide | self | — | model | shipped | tools/crm-tco-calculator | needs-extension:tools-platform | Live — software + ownership costs; known vs unknown TCO; seat growth; shares pricing research with Cost Calculator |
| CRM-TOOL-006 | ✅ EXISTING | P0 | CRM | Tools | Tools | tools-landing | Tools hub | `/tools/` | same | Home | Tools | — | Product review / Pricing | Discover tools | CRM tools | — | — | — | sufficient-or-n/a | tools/ | needs-extension:tools-platform |  |
| CRM-TOOL-007 | ✅ LIVE | P0 | CRM | Tools | Choose | builder | CRM Requirements Builder | `/tools/crm-requirements-builder/` | same | Tools hub | Choose | — | Finder / Cost / Scorecard | Specify | Finder | self | RES-002 | model | shipped | tools/crm-requirements-builder | shared:CrmDecisionProfile | Vague need → structured requirements profile; shared local profile with Finder / Cost / Scorecard; no product rankings; affiliate-independent |
| CRM-TOOL-008 | ✅ LIVE | P0 | CRM | Tools | Choose | scorecard | CRM Vendor Scorecard | `/tools/crm-vendor-scorecard/` | same | Tools hub | Choose | — | Compare / Product review | Evaluate | Compare | self | RES-003 | model | shipped | tools/crm-vendor-scorecard | needs-extension:tools-platform | Live — weighted criteria + must-have gating + demo scores; complements static RES-003 (still missing) |
| CRM-TOOL-009 | ✅ LIVE | P0 | CRM | Tools | Implement | planner | CRM Implementation Planner | `/tools/crm-implementation-planner/` | same | Tools hub | Implement | — | Implementation guides | Rollout | IMP checklist | self | RES-006 | model | shipped | tools/crm-implementation-planner | needs-extension:tools-platform | Live — phases, tasks, risks, go-live checklist; handoff to Migration / TCO / Scorecard |
| CRM-TOOL-010 | ✅ LIVE | P0 | CRM | Tools | Implement | planner | CRM Migration Planner | `/tools/crm-migration-planner/` | same | Tools hub | Implement | — | Migration guides | Migrate | Migration checklist | self | RES-007/010/011 | model | shipped | tools/crm-migration-planner | needs-extension:tools-platform | Live — source inventory, field/user/pipeline mapping, test & cutover; does not execute migration |
| CRM-TOOL-011 | ✅ LIVE | P1 | CRM | Tools | Choose | builder | CRM RFP / Vendor Brief Builder | `/tools/crm-rfp-builder/` | same | Tools hub | Choose | — | Vendor evaluation | Procure | RFP template | self | RES-004 | model | shipped | tools/crm-rfp-builder | needs-extension:tools-platform | Live — requirements → vendor-ready brief; procurement · CQ-GAP-002 |
| CRM-TOOL-012 | ✅ LIVE | P1 | CRM | Tools | Choose | builder | CRM Demo Checklist Builder | `/tools/crm-demo-checklist-builder/` | same | Tools hub | Choose | — | Demo guide / Trial | Demo | Demo checklist | self | RES-005 | model | shipped | tools/crm-demo-checklist-builder | needs-extension:tools-platform | Live — scripted scenarios from requirements; agenda/time budget; PDF/Excel; scorecard handoff without silent overwrite · CQ-GAP-003 |
| CRM-TOOL-013 | ✅ LIVE | P1 | CRM | Tools | Learn→Choose | assessment | CRM Readiness Assessment | `/tools/crm-readiness-assessment/` | same | Tools hub | Learn→Choose | — | Requirements / Finder / RFP | Qualify | Requirements Builder | self | — | model | shipped | tools/crm-readiness-assessment | shared:CrmDecisionProfile + sg-crm-readiness-assessment-v1 | Dual selection vs implementation scores; 14 dimensions; action plan + risk register; PDF/Excel export |
| CRM-TOOL-014 | ✅ LIVE | P1 | CRM | Tools | Pricing | selector | CRM Plan Selector | `/tools/crm-plan-selector/` | same | Tools hub | Pricing | — | Product pricing / Plans guide | Plan choice | Pricing pages | self | — | pricing verified | shipped | tools/crm-plan-selector | needs-extension:tools-platform | Live — lowest qualifying plan from verified matrices · CQ-GAP-005 |
| CRM-TOOL-015 | ✅ LIVE | P2 | CRM | Tools | Implement | calculator | CRM Migration Cost Calculator | `/tools/crm-migration-cost-calculator/` | same | Tools hub | Implement | — | Migration planner / TCO | Estimate | Migration planner | soft | — | model | shipped | tools/crm-migration-cost-calculator | needs-extension:tools-platform | Live — migration effort/cost separate from software · CQ-GAP-006 |
| CRM-TOOL-016 | ✅ LIVE | P2 | CRM | Tools | Optimize | assessment | CRM Adoption / Health Assessment | `/tools/crm-adoption-health-assessment/` | same | Tools hub | Optimize | — | Health check / Adoption guide | Diagnose | OPT guides | self | RES-015 | model | shipped | tools/crm-adoption-health-assessment | needs-extension:tools-platform | Live — people vs system diagnostic; not a vendor rank · CQ-GAP-007 |
| CRM-PRICE-000 | ✅ EXISTING | P0 | CRM | Pricing | Pricing | pricing-landing | CRM Pricing index | `/pricing/` | same | Domain hub | Pricing | — | Calculator / Select | Browse costs | Calculator | Calculator | — | CRM-only today | sufficient-or-n/a | pricing/ | existing:pricing-page-agent |  |
| CRM-PRD-T001 | ✅ EXISTING | P0 | CRM | Products | Products | software-review | [Product] Review hub | `/software/[slug]/` | same | Domain hub | Products | — | Compare / Pricing / Calculator | Research | Visit/compare | — | — | **high** | sufficient-or-n/a | software/[slug] hub | existing:software-review-agent | Template |
| CRM-PRD-T002 | ✅ EXISTING | P0 | CRM | Products | Pricing | product-pricing | [Product] Pricing | `/pricing/[slug]/` | same | Product hub | Pricing | — | Compare / Pricing / Calculator | Cost | Calculator | Calculator | — | verified | sufficient-or-n/a | pricing/[slug] | existing:pricing-page-agent | CRM snapshots |
| CRM-PRD-T003 | ✅ EXISTING | P0 | CRM | Products | Products | software-review-tab | [Product] Features tab | `/software/[slug]/features/` | same | Product hub | Products | — | Compare / Pricing / Calculator | Features | Review CTA | — | — | high | sufficient-or-n/a | software/[slug]/[tab] | existing:software-review-agent | Prefer tab |
| CRM-PRD-T004 | ✅ EXISTING | P0 | CRM | Products | Products | section | [Product] Pros & Cons | (review section) | same | Product hub | Products | — | Compare / Pricing / Calculator | Verdict | Compare | — | — | medium | sufficient-or-n/a | product hub section | existing:software-review-agent | Section |
| CRM-PRD-T005 | 🟡 PARTIAL | P1 | CRM | Products | Products | alternatives-detail | [Product] Alternatives | `/alternatives/[slug]/` | same | Product hub | Products | — | Compare / Pricing / Calculator | Switch | Compare | — | worksheet | high | partial | alternatives/[slug] | existing:alternatives-agent | Few instances |
| CRM-PRD-T006 | 🟡 PARTIAL | P2 | CRM | Products | Products | section/guide | [Product] Integrations | tab/section | guide OPTIONAL | Product hub | Products | — | Compare / Pricing / Calculator | Integrate | Review | — | — | medium | partial | section/guide | existing:guide-agent |  |
| CRM-PRD-T007 | 🟡 PARTIAL | P2 | CRM | Products | Products | section/guide | [Product] Security | section | guide OPTIONAL | Product hub | Products | — | Compare / Pricing / Calculator | Trust | Review | — | RES-012 | high | partial | section/guide | existing:guide-agent |  |
| CRM-PRD-T008 | ✅ EXISTING | P1 | CRM | Products | Implement | product-guide | [Product] Implementation | `/guides/{product}-implementation/` | same | Implementation pillar | Implement | — | Compare / Pricing / Calculator | Rollout | Checklist | Requirements Builder | RES-006 | medium | complete | guides/[slug] + product-guides factory | existing:guide-agent | Approved indexable ×22; unique composited heroes |
| CRM-PRD-T009 | ✅ EXISTING | P2 | CRM | Products | Implement | product-guide | [Product] Migration | `/guides/{product}-migration/` | same | Migration pillar | Implement | — | Compare / Pricing / Calculator | Move data | Migration checklist | Setup guide | RES-007 | medium | complete | guides/[slug] + product-guides factory | existing:guide-agent | Approved indexable ×22; unique composited heroes |
| CRM-PRD-T010 | ✅ EXISTING | P2 | CRM | Products | Implement | product-guide | [Product] Setup | `/guides/{product}-setup/` | same | Implementation | Implement | — | Compare / Pricing / Calculator | Configure | Setup checklist | Implementation | — | medium | complete | guides/[slug] + product-guides factory | existing:guide-agent | Approved indexable ×22; unique composited heroes |
| CRM-PRD-T011 | ✅ EXISTING | P1 | CRM | Products | Pricing | product-guide | [Product] Plan / Free vs Paid | `/guides/{product}-plans/` | same | Pricing | Pricing | — | Compare / Pricing / Calculator | Plan choice | Pricing page | Calculator | — | pricing facts | complete | guides/[slug] + product-guides factory | existing:guide-agent | Approved indexable ×22; oracle-cx quote-led; no invented $ |
| CRM-PRD-T012 | ✅ EXISTING | P3 | CRM | Products | Products | product-guide | [Product] Worth It? | `/guides/is-{product}-worth-it/` | same | Review | Products | — | Compare / Pricing / Calculator | Justification | Review | Finder | — | medium | complete | guides/[slug] + product-guides factory | existing:guide-agent | Approved indexable ×22; fit/trial/plan gates |
| CRM-PRD-EX-HS | ✅ EXISTING | P0 | CRM | Products | Products | software-review | HubSpot CRM Review | `/software/hubspot/` | same | Domain hub | Products | — | Compare / Pricing / Calculator | Research | Visit | — | — | high | sufficient-or-n/a | software/[slug] hub | existing:software-review-agent | Flagship |
| CRM-PRD-EX-SF | ✅ EXISTING | P0 | CRM | Products | Products | software-review | Salesforce Review | `/software/salesforce/` | same | Domain hub | Products | — | Compare / Pricing / Calculator | Research | Visit | — | — | high | sufficient-or-n/a | software/[slug] hub | existing:software-review-agent | Flagship |
| CRM-PRD-EX-PD | ✅ EXISTING | P0 | CRM | Products | Products | software-review | Pipedrive Review | `/software/pipedrive/` | same | Domain hub | Products | — | Compare / Pricing / Calculator | Research | Visit | — | — | high | sufficient-or-n/a | software/[slug] hub | existing:software-review-agent | Flagship |
| CRM-PRD-EX-PD-ALT | 🔬/🟡 EXISTING-BUT-THIN | P1 | CRM | Products | Products | alternatives-detail | Pipedrive Alternatives | `/alternatives/pipedrive/` | same | Pipedrive hub | Products | — | Compare / Pricing / Calculator | Switch | Compare | Finder | — | high | research-required | alternatives/[slug] | existing:alternatives-agent | noindex |
| CRM-CMP-000 | ✅ EXISTING | P0 | CRM | Compare | Compare | comparison-landing | Comparisons hub | `/compare/` | same | Domain hub | Compare | — | Calculator / Select | Discover | Builder | — | RES-013 | — | sufficient-or-n/a | compare/ | existing:comparison-agent |  |
| CRM-CMP-001 | ✅ EXISTING | P0 | CRM | Compare | Compare | comparison-detail | Head-to-head template | `/compare/[slug]/` | same | Compare hub | Compare | — | Calculator / Select | Decide | Product CTAs | — | RES-013 | **high** | sufficient-or-n/a | compare/[slug] | existing:comparison-agent | ~231 live |
| CRM-CMP-002 | 🟡 PARTIAL | P1 | CRM | Compare | Compare | comparison-builder | Compare builder | `/compare/build/` | same | Compare hub | Compare | — | Calculator / Select | Ad-hoc | Published compare | — | — | medium | partial | compare/build | existing:comparison-agent | noindex |
| CRM-CMP-003 | ✅ LIVE | P2 | CRM | Compare | Compare | tool | Multi-product compare | `/tools/crm-multi-compare/` | same | Compare hub | Compare | — | Calculator / Select | Multi | Scorecard | — | RES-013 | high | shipped | tools/crm-multi-compare | existing:comparison-agent | Live — 2–4 CRM matrix of existing pairwise pages; no invented 3-way winner · CQ-GAP-008 |
| CRM-CMP-CTX-001 | 🚫 DO NOT CREATE (default) / ⚪ OPTIONAL | P3 | CRM | Compare | Compare | guide | Contextual compare articles | — | `/guides/{a}-vs-{b}-for-{context}/` | Base compare | Compare | — | Calculator / Select | Niche decide | Base compare | — | — | high | not-started | guides/[slug] | existing:comparison-agent | Default DNC mass industry variants (CQ-GAP-048); OPTIONAL only w/ §13 eligibility |
| CRM-AUD-000 | ✅ EXISTING | P1 | CRM | Business Type | Business Type | audience-landing | For index | `/for/` | same | Domain hub | Business Type | — | Finder / Best | Discover | — | — | — | — | sufficient-or-n/a | for/ + audience-hub | approved | Indexable; explore grid + unique hub visual |
| CRM-AUD-001 | ✅ EXISTING | P0 | CRM | Business Type | Business Type | audience-detail | CRM for Small Business | `/for/small-business/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | Finder | RES-001 | medium | complete | for/[slug] + audience-hub | approved | Indexable; unique hero + concept visual |
| CRM-AUD-002 | ✅ EXISTING | P1 | CRM | Business Type | Business Type | audience-detail | CRM for Startups | `/for/startups/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | Finder | — | medium | complete | for/[slug] + audience-hub | approved | Indexable; unique hero + concept visual |
| CRM-AUD-003 | ✅ EXISTING | P1 | CRM | Business Type | Business Type | audience-detail | CRM for Enterprise | `/for/enterprise/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Best | — | RES-003 | medium | complete | for/[slug] + audience-hub | approved | Indexable; unique hero + concept visual |
| CRM-AUD-004 | ✅ EXISTING | P3 | CRM | Business Type | Business Type | audience-detail | CRM for Freelancers | `/for/freelancers/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | — | — | light | complete | for/[slug] + audience-hub | approved | Indexable |
| CRM-AUD-005 | ✅ EXISTING | P1 | CRM | Business Type | Business Type | audience-detail | CRM for Agencies | `/for/agencies/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | Finder | — | medium | complete | for/[slug] + audience-hub | approved | Indexable; unique hero + concept visual |
| CRM-AUD-006 | ✅ EXISTING | P2 | CRM | Business Type | Business Type | audience-detail | CRM for Nonprofits | `/for/nonprofits/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | — | — | medium | complete | for/[slug] + audience-hub | approved | Indexable; unique hero + concept visual |
| CRM-AUD-007 | ✅ EXISTING | P2 | CRM | Business Type | Business Type | audience-detail | CRM for Growing Teams | `/for/growing-teams/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | — | — | light | complete | for/[slug] + audience-hub | approved | Indexable |
| CRM-AUD-008 | ✅ EXISTING | P1 | CRM | Business Type | Business Type | audience-detail | CRM for Remote Sales Teams | `/for/sales-teams/` | same | `/for/` | Business Type | — | Finder / Best | Fit | Finder | Finder | — | medium | complete | for/[slug] + audience-hub | approved | Indexable; unique hero + concept visual |
| CRM-IND-000 | ✅ EXISTING | P0 | CRM | Industries | Industries | industry-landing | Industries index | `/industries/` | same | Domain hub | Industries | — | Use case / Capability / Finder | Discover | Best/Finder | Finder | — | — | complete | industries/ | needs-extension:industry-builders→agent | Published landing (indexable false); child hubs are the indexable verticals |
| CRM-IND-FS | ✅ EXISTING | P0 | CRM | Industries | Industries | industry-detail | CRM for Financial Services | `/industries/financial-services/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | Finder | — | high when ranked | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-SAAS | ✅ EXISTING | P0 | CRM | Industries | Industries | industry-detail | CRM for SaaS | `/industries/saas/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | Finder | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-SMB | ✅ EXISTING | P0 | CRM | Industries | Industries | industry-detail | CRM for Small Business (industry) | `/industries/small-business/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack. Related `/for/small-business/` remains a distinct audience page (CQ-GAP-033). |
| CRM-IND-RE | ✅ EXISTING | P1 | CRM | Industries | Industries | industry-detail | CRM for Real Estate | `/industries/real-estate/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-HC | ✅ EXISTING | P1 | CRM | Industries | Industries | industry-detail | CRM for Healthcare | `/industries/healthcare/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-RET | ✅ EXISTING | P1 | CRM | Industries | Industries | industry-detail | CRM for Retail | `/industries/retail-ecommerce/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-LEG | ✅ EXISTING | P1 | CRM | Industries | Industries | industry-detail | CRM for Legal | `/industries/legal-services/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-MFG | ✅ EXISTING | P2 | CRM | Industries | Industries | industry-detail | CRM for Manufacturing | `/industries/manufacturing/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-EDU | ✅ EXISTING | P2 | CRM | Industries | Industries | industry-detail | CRM for Education | `/industries/education/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-NP | ✅ EXISTING | P2 | CRM | Industries | Industries | industry-detail | CRM for Nonprofit | `/industries/nonprofit/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-HOSP | ✅ EXISTING | P2 | CRM | Industries | Industries | industry-detail | CRM for Hospitality | `/industries/hospitality/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-CON | ✅ EXISTING | P2 | CRM | Industries | Industries | industry-detail | CRM for Construction | `/industries/construction/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-LOG | ✅ EXISTING | P2 | CRM | Industries | Industries | industry-detail | CRM for Logistics | `/industries/transportation-logistics/` | same | Industries index | Industries | see §3 | Use case / Capability / Finder | Vertical | Finder | — | — | complete | complete | industries/[slug] | industry-hub | Indexable hub + quality pack (priorities, use-cases, implementation) |
| CRM-IND-L3-FS | 🟢 LIVE | P1 | CRM | Industries | Industries | industry-guide | FS supporting guide pack | `/guides/financial-services-crm/` + 6 companions | `/guides/financial-services-crm-*` | FS hub | Industries | — | Use case / Capability / Finder | Educate | FS hub | Finder | checklists | medium | complete | guides/[slug] | guide-agent | 7 approved indexable articles |
| CRM-IND-NEST | 🔬/🟡 PARTIAL | P1 | CRM | Industries | Industries | capability/uc/feature/req nests | Industry nested entities | FS nests live | same pattern | Industry hub | Industries | — | Use case / Capability / Finder | Deepen | Finder | — | — | high | research-required | capability/uc/feature/req nests | missing:CapabilityPageAgent | Expand per research |
| CRM-UC-000 | ✅ EXISTING | P0 | CRM | Use Cases | Use Cases | use-case-landing | Use cases index | `/use-cases/` | same | Domain hub | Use Cases | — | Requirements / Finder / Products | Discover | Finder | Finder | — | — | complete | use-cases/ | use-case-hub | approved | Indexable; explore grid + depth hubs |
| CRM-UC-001 | ✅ EXISTING | P0 | CRM | Use Cases | Use Cases | use-case-detail | Pipeline Management | `/use-cases/pipeline-management/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | Finder | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-002 | ✅ EXISTING | P0 | CRM | Use Cases | Use Cases | use-case-detail | Lead Management | `/use-cases/lead-management/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | Finder | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-003 | ✅ EXISTING | P0 | CRM | Use Cases | Use Cases | use-case-detail | Contact Management | `/use-cases/contact-management/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-004 | ✅ EXISTING | P0 | CRM | Use Cases | Use Cases | use-case-detail | Sales Automation | `/use-cases/sales-automation/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | Finder | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-005 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Email Outreach | `/use-cases/email-outreach/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-006 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Prospecting | `/use-cases/prospecting/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-007 | ✅ EXISTING | P0 | CRM | Use Cases | Use Cases | use-case-detail | Relationship Management | `/use-cases/relationship-management/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-008 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Sales Engagement | `/use-cases/sales-engagement/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-009 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Reporting | `/use-cases/reporting/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-010 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Account Management | `/use-cases/account-management/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | Finder | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-011 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Outbound Sales | `/use-cases/outbound-sales/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-012 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Inbound Sales | `/use-cases/inbound-sales/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-013 | ✅ EXISTING | P2 | CRM | Use Cases | Use Cases | use-case-detail | Field Sales | `/use-cases/field-sales/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-014 | ✅ EXISTING | P2 | CRM | Use Cases | Use Cases | use-case-detail | High-volume Lead Management | `/use-cases/high-volume-lead-management/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-015 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Complex Sales Processes | `/use-cases/complex-sales-processes/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals; FS nest also exists |
| CRM-UC-016 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Customer Follow-up | `/use-cases/customer-follow-up/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-UC-017 | ✅ EXISTING | P1 | CRM | Use Cases | Use Cases | use-case-detail | Sales Forecasting | `/use-cases/sales-forecasting/` | same | UC index | Use Cases | see §3 | Requirements / Finder / Products | Job | Finder | — | — | medium | complete | use-cases/[slug] | use-case-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-000 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-landing | Capabilities index | `/capabilities/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-001 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Contact Management | `/capabilities/contact-management/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-002 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Relationship Management | `/capabilities/relationship-management/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-003 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Lead Management | `/capabilities/lead-management/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-004 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Pipeline Management | `/capabilities/pipeline-management/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals; FS nest also exists |
| CRM-CAP-005 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Deal Management | `/capabilities/deal-management/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-006 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Workflow Automation | `/capabilities/workflow-automation/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals; FS nest also exists |
| CRM-CAP-007 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Email Capabilities | `/capabilities/email/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-008 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Calling / Sales Engagement | `/capabilities/sales-engagement/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-009 | ✅ EXISTING | P0 | CRM | Capabilities | Capabilities | capability-detail | Reporting | `/capabilities/reporting/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-010 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Forecasting | `/capabilities/forecasting/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-011 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Customization | `/capabilities/customization/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-012 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Integrations | `/capabilities/integrations/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-013 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Administration | `/capabilities/administration/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-014 | ✅ EXISTING | P1 | CRM | Capabilities | Capabilities | capability-detail | Security | `/capabilities/security/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-015 | ✅ EXISTING | P2 | CRM | Capabilities | Capabilities | capability-detail | Mobile | `/capabilities/mobile/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-CAP-016 | ✅ EXISTING | P2 | CRM | Capabilities | Capabilities | capability-detail | AI Assistance | `/capabilities/ai-assistance/` | same | CAP index | Capabilities | — | Requirements / Features / Finder | Define | UC/Req | Finder | — | medium | complete | capabilities/[slug] | capability-hub | approved | Indexable; depth + teaching visuals |
| CRM-REQ-000 | ✅ EXISTING | P1 | CRM | Requirements | Requirements | requirement-landing | Requirements index | `/requirements/` | same | Domain hub | Requirements | — | Finder / Products | Discover | Finder | Finder | RES-002 | — | complete | requirements/ | requirement-detail | approved | Indexable; explore grid + depth hubs |
| CRM-REQ-001 | ✅ EXISTING | P0 | CRM | Requirements | Requirements | requirement-detail | Separate sales processes | `/requirements/separate-sales-processes/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | Finder | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-002 | ✅ EXISTING | P0 | CRM | Requirements | Requirements | requirement-detail | Automate lead follow-up | `/requirements/automate-lead-follow-up/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | Finder | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-003 | ✅ EXISTING | P0 | CRM | Requirements | Requirements | requirement-detail | Restrict access by team | `/requirements/restrict-access-by-team/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | Finder | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-004 | ✅ EXISTING | P1 | CRM | Requirements | Requirements | requirement-detail | Forecast revenue | `/requirements/forecast-revenue/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | — | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-005 | ✅ EXISTING | P0 | CRM | Requirements | Requirements | requirement-detail | Track client interactions | `/requirements/track-client-interactions/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | — | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-006 | ✅ EXISTING | P1 | CRM | Requirements | Requirements | requirement-detail | Customize record fields | `/requirements/customize-record-fields/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | — | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-007 | ✅ EXISTING | P2 | CRM | Requirements | Requirements | requirement-detail | Support multiple currencies | `/requirements/support-multiple-currencies/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | — | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-008 | ✅ EXISTING | P0 | CRM | Requirements | Requirements | requirement-detail | Integrate with email | `/requirements/integrate-with-email/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | Finder | — | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-009 | ✅ EXISTING | P1 | CRM | Requirements | Requirements | requirement-detail | Support SSO | `/requirements/support-sso/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | — | RES-012 | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-REQ-010 | ✅ EXISTING | P1 | CRM | Requirements | Requirements | requirement-detail | Audit user activity | `/requirements/audit-user-activity/` | same | REQ index | Requirements | — | Finder / Products | Specify | Finder | — | RES-012 | medium | complete | requirements/[slug] | requirement-detail | approved | Indexable; depth + teaching visuals |
| CRM-FEAT-000 | ✅ EXISTING | P1 | CRM | Features | Features | feature-landing | Features index | `/features/` | same | Domain hub | Features | — | Products / Requirement / Finder | Discover | Products | — | — | — | sufficient-or-n/a | features/ | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-001 | ✅ EXISTING | P0 | CRM | Features | Features | feature-detail | Multiple pipelines | `/features/multiple-pipelines/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-002 | ✅ EXISTING | P0 | CRM | Features | Features | feature-detail | Workflow automation | `/features/workflow-automation/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-003 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Custom pipeline stages | `/features/custom-pipeline-stages/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-004 | ✅ EXISTING | P0 | CRM | Features | Features | feature-detail | Email sync | `/features/email-sync/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-005 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Lead scoring | `/features/lead-scoring/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-006 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Custom fields | `/features/custom-fields/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-007 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Forecasting | `/features/forecasting/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-008 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Reporting dashboards | `/features/reporting-dashboards/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-009 | ✅ EXISTING | P2 | CRM | Features | Features | feature-detail | Calling | `/features/calling/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-010 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Sequences | `/features/email-sequences/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-011 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | SSO | `/features/sso/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable; evidence thin |
| CRM-FEAT-012 | ✅ EXISTING | P2 | CRM | Features | Features | feature-detail | Audit logs | `/features/audit-logs/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable; evidence thin |
| CRM-FEAT-013 | ✅ EXISTING | P1 | CRM | Features | Features | feature-detail | Role permissions | `/features/role-permissions/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-014 | ✅ EXISTING | P2 | CRM | Features | Features | feature-detail | API access | `/features/api-access/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-015 | ✅ EXISTING | P2 | CRM | Features | Features | feature-detail | Mobile app | `/features/mobile-app/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-FEAT-016 | ✅ EXISTING | P2 | CRM | Features | Features | feature-detail | AI assistance | `/features/ai-assistance/` | same | FEAT index | Features | — | Products / Requirement / Finder | Explain | Products | — | — | high | sufficient-or-n/a | features/[slug] | needs-extension:feature-builders→agent | indexable |
| CRM-IMP-000 | ✅ EXISTING | P0 | CRM | Implementation | Implement | implementation-guide | CRM Implementation Guide | — | `/guides/crm-implementation/` | Domain hub | Implement | see §3 | Migration / Training / Go-live | Deliver | Checklist | — | RES-006 | medium | complete | guides/[slug] | existing:guide-agent | indexable; Pillar |
| CRM-IMP-001 | ✅ EXISTING | P0 | CRM | Implementation | Implement | how-to | Plan CRM Implementation | — | `/guides/crm-implementation-planning/` | IMP-000 | Implement | — | Migration / Training / Go-live | Plan | Project plan | — | RES-006 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-002 | ✅ EXISTING | P1 | CRM | Implementation | Implement | guide | Implementation Timeline | — | `/guides/crm-implementation-timeline/` | IMP-000 | Implement | — | Migration / Training / Go-live | Plan | — | — | — | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-003 | ✅ EXISTING | P1 | CRM | Implementation | Implement | guide | Implementation Cost | — | `/guides/crm-implementation-cost/` | IMP-000 | Implement | — | Migration / Training / Go-live | Cost | Calculator | Calculator | — | medium | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-004 | ✅ EXISTING | P1 | CRM | Implementation | Implement | guide | Implementation Roles | — | `/guides/crm-implementation-roles/` | IMP-000 | Implement | — | Migration / Training / Go-live | Staff | — | — | — | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-005 | ✅ EXISTING | P1 | CRM | Implementation | Implement | guide | Implementation Mistakes | — | `/guides/crm-implementation-mistakes/` | IMP-000 | Implement | — | Migration / Training / Go-live | Risk | Checklist | — | RES-006 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-006 | ✅ EXISTING | P0 | CRM | Implementation | Implement | migration | CRM Data Migration Guide | — | `/guides/crm-data-migration/` | IMP-000 | Implement | — | Migration / Training / Go-live | Migrate | Migration checklist | — | RES-007 | medium | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-007 | ✅ EXISTING | P1 | CRM | Implementation | Implement | how-to | Clean CRM Data | — | `/guides/crm-data-cleaning/` | IMP-006 | Implement | — | Migration / Training / Go-live | Hygiene | Cleanup | — | RES-016 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-008 | ✅ EXISTING | P1 | CRM | Implementation | Implement | how-to | Field Mapping Guide | — | `/guides/crm-field-mapping/` | IMP-006 | Implement | — | Migration / Training / Go-live | Map | Mapping template | — | RES-011 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-009 | ✅ EXISTING | P2 | CRM | Implementation | Implement | how-to | CRM Testing Guide | — | `/guides/crm-testing/` | IMP-000 | Implement | — | Migration / Training / Go-live | Test | Test plan | — | — | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-010 | ✅ EXISTING | P1 | CRM | Implementation | Implement | how-to | CRM Go-Live Guide | — | `/guides/crm-go-live/` | IMP-000 | Implement | — | Migration / Training / Go-live | Launch | Go-live checklist | — | RES-008 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-011 | ✅ EXISTING | P1 | CRM | Implementation | Implement | how-to | CRM Training Guide | — | `/guides/crm-training/` | IMP-000 | Implement | — | Migration / Training / Go-live | Train | Training plan | — | RES-009 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-012 | ✅ EXISTING | P0 | CRM | Implementation | Implement→Optimize | guide | CRM Adoption Guide | — | `/guides/crm-adoption/` | IMP-000 | Implement→Optimize | — | Migration / Training / Go-live | Adopt | Optimization | — | RES-015 | medium | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-013 | ✅ EXISTING | P2 | CRM | Implementation | Implement | guide | CRM Governance Guide | — | `/guides/crm-governance/` | IMP-000 | Implement | — | Migration / Training / Go-live | Govern | — | — | — | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-014 | ✅ EXISTING | P1 | CRM | Implementation | Implement | guide | CRM Data Quality Guide | — | `/guides/crm-data-quality/` | IMP-000 | Implement | — | Migration / Training / Go-live | Quality | Cleanup | — | RES-016 | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-015 | ✅ EXISTING | P2 | CRM | Implementation | Implement | guide | CRM Change Management | — | `/guides/crm-change-management/` | IMP-000 | Implement | — | Migration / Training / Go-live | Change | — | — | — | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-IMP-016 | ✅ EXISTING | P2 | CRM | Implementation | Implement | guide | CRM Implementation KPIs | — | `/guides/crm-implementation-kpis/` | IMP-000 | Implement | — | Migration / Training / Go-live | Measure | Health check | — | — | light | complete | guides/[slug] | existing:guide-agent | indexable |
| CRM-OPT-001 | ✅ EXISTING | P0 | CRM | Optimization | Optimize | guide | Improve CRM Adoption | — | `/guides/improve-crm-adoption/` | Domain hub | Optimize | — | Health check / Replace | Adopt | Health check | — | RES-015 | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-002 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | guide | CRM Data Hygiene | — | `/guides/crm-data-hygiene/` | OPT cluster | Optimize | — | Health check / Replace | Hygiene | Cleanup | — | RES-016 | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-003 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | guide | Reporting Best Practices | — | `/guides/crm-reporting-best-practices/` | OPT cluster | Optimize | — | Health check / Replace | Report | — | — | — | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-004 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | guide | Automation Best Practices | — | `/guides/crm-automation-best-practices/` | OPT cluster | Optimize | — | Health check / Replace | Automate | — | — | — | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-005 | ✅ EXISTING | P2 | CRM | Optimization | Optimize | guide | CRM Governance Ops | — | `/guides/crm-governance-operations/` | OPT cluster | Optimize | — | Health check / Replace | Govern | — | — | — | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-006 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | guide | CRM Audit Guide | — | `/guides/crm-audit/` | OPT cluster | Optimize | — | Health check / Replace | Audit | Health check | — | RES-015 | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-007 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | guide | CRM Health Check | — | `/guides/crm-health-check/` | OPT cluster | Optimize | — | Health check / Replace | Diagnose | Checklist | — | RES-015 | light | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-OPT-009 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | decision-guide | When to Replace CRM | — | `/guides/when-to-replace-crm/` | OPT cluster | Optimize | — | Health check / Replace | Replace | Finder/Compare | Finder | — | medium | complete | guides/[slug] + guide-template-v1 | existing:guide-agent |  | indexable |
| CRM-OPT-010 | ✅ EXISTING | P1 | CRM | Optimization | Optimize | migration | Migrate to Another Vendor | — | `/guides/crm-vendor-migration/` | OPT cluster | Optimize | — | Health check / Replace | Switch | Migration checklist | — | RES-007 | medium | complete | guides/[slug] | existing:guide-agent |  | indexable |
| CRM-RES-001 | ✅ EXISTING | P0 | CRM | Resources | Choose | checklist | Evaluation Checklist | `/resources/crm-evaluation-checklist/` | same | Choose | Choose | — | Parent pillar next step | Completeness | Finder | Finder | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download; unique visuals |
| CRM-RES-002 | ✅ EXISTING | P0 | CRM | Resources | Choose | template | Requirements Template | `/resources/crm-requirements-template/` | same | Choose | Choose | — | Parent pillar next step | Capture needs | Requirements | Finder | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download; unique visuals |
| CRM-RES-003 | ✅ EXISTING | P0 | CRM | Resources | Choose | scorecard | Vendor Scorecard | `/resources/crm-vendor-scorecard/` | same | Choose | Choose | — | Parent pillar next step | Score vendors | Compare | Compare | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md+csv; companion to interactive tool |
| CRM-RES-004 | ✅ EXISTING | P2 | CRM | Resources | Choose | template | RFP Template | `/resources/crm-rfp-template/` | same | Choose | Choose | — | Parent pillar next step | Formal buy | Vendor eval | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-005 | ✅ EXISTING | P1 | CRM | Resources | Choose | checklist | Demo Checklist | `/resources/crm-demo-checklist/` | same | Choose | Choose | — | Parent pillar next step | Demo | Demo guide | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-006 | ✅ EXISTING | P0 | CRM | Resources | Implement | checklist | Implementation Checklist | `/resources/crm-implementation-checklist/` | same | Implement | Implement | — | Parent pillar next step | Deliver | IMP guide | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-UAT | ✅ EXISTING | P2 | CRM | Resources | Implement | worksheet | UAT test script worksheet (CRM) | `/resources/crm-uat-test-script/` | same | `/guides/crm-testing/` | Implement | Testing + Go-live guides | Go-Live Checklist / Planner | Deliver | Go-live | Implementation Planner | self | none | complete | resources/[slug] | ResourceAgent / authored | Shipped 2026-08-18 · CQ-GAP-009 |
| CRM-RES-007 | ✅ EXISTING | P0 | CRM | Resources | Implement | checklist | Migration Checklist | `/resources/crm-migration-checklist/` | same | Implement | Implement | — | Parent pillar next step | Migrate | Migration guide | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-008 | ✅ EXISTING | P1 | CRM | Resources | Implement | checklist | Go-Live Checklist | `/resources/crm-go-live-checklist/` | same | Implement | Implement | — | Parent pillar next step | Launch | Go-live | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-009 | ✅ EXISTING | P1 | CRM | Resources | Implement | planner | Training Plan | `/resources/crm-training-plan/` | same | Implement | Implement | — | Parent pillar next step | Train | Training guide | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-010 | ✅ EXISTING | P1 | CRM | Resources | Implement | template | Data Migration Template | `/resources/crm-data-migration-template/` | same | Implement | Implement | — | Parent pillar next step | Migrate | Migration | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md+csv |
| CRM-RES-011 | ✅ EXISTING | P1 | CRM | Resources | Implement | template | Field Mapping Template | `/resources/crm-field-mapping-template/` | same | Implement | Implement | — | Parent pillar next step | Map | Mapping guide | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md+csv |
| CRM-RES-012 | ✅ EXISTING | P1 | CRM | Resources | Security | checklist | Security Checklist | `/resources/crm-security-checklist/` | same | Choose/Implement | Security | — | Parent pillar next step | Secure | Security cap | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-013 | ✅ EXISTING | P0 | CRM | Resources | Compare | worksheet | Comparison Worksheet | `/resources/crm-comparison-worksheet/` | same | Compare | Compare | — | Parent pillar next step | Compare | Compare hub | Compare | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md+csv |
| CRM-RES-014 | ✅ EXISTING | P2 | CRM | Resources | Choose | template | Business Case Template | `/resources/crm-business-case-template/` | same | Choose | Choose | — | Parent pillar next step | Justify | Calculator | Calculator | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; PDF workbook + Excel financial model (not Pass/Fail) — corrected 2026-08-15 |
| CRM-RES-015 | ✅ EXISTING | P1 | CRM | Resources | Optimize | checklist | Optimization Checklist | `/resources/crm-optimization-checklist/` | same | Optimize | Optimize | — | Parent pillar next step | Improve | Health check | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-016 | ✅ EXISTING | P2 | CRM | Resources | Optimize | checklist | Cleanup Checklist | `/resources/crm-cleanup-checklist/` | same | Optimize | Optimize | — | Parent pillar next step | Clean | Hygiene | — | self | none | complete | resources/[slug] + resource-hub | approved | Indexable; md download |
| CRM-RES-TPL | ✅ EXISTING | P0 | CRM | Resources | Resources | template-system | Resources route template | `/resources/[slug]/` | same | Domain hub | Resources | — | Parent pillar next step | Host artifacts | Parent pillar | — | — | — | complete | resources/[slug] + Resource schema | approved | Platform shipped; ResourceGeneratorAgent still missing |
| CRM-EVD-001 | ✅ EXISTING | P0 | CRM | Evidence | Evidence | methodology | Editorial methodology | `/company/editorial-methodology/` | same | Company | Evidence | — | Best / Product trust | Trust | — | — | — | — | sufficient-or-n/a | company/* | n/a:site-foundation |  |
| CRM-EVD-002 | ✅ EXISTING | P0 | CRM | Evidence | Evidence | methodology | How we review | `/company/how-we-review-software/` | same | Company | Evidence | — | Best / Product trust | Trust | — | — | — | — | sufficient-or-n/a | company/* | n/a:site-foundation |  |
| CRM-GUIDES-000 | ✅ EXISTING | P1 | CRM | Learn/Choose | Learn/Choose | guides-landing | Guides hub | `/guides/` | same | Domain hub | Learn/Choose | — | How to Choose / Finder | Discover | Tools | soft | — | — | complete | guides-landing | existing:guide-agent | indexable hub live (`buildGuidesHubModel`); 140+ guides — 2026-08-15 |
| CRM-ALT-000 | 🟡 PARTIAL | P1 | CRM | Products | Products | alternatives-landing | Alternatives hub | `/alternatives/` | same | Domain hub | Products | — | Compare / Pricing / Calculator | Discover | — | — | — | — | partial | alternatives/ | existing:alternatives-agent | scaffold |
| CRM-SOFT-000 | ✅ EXISTING | P0 | CRM | Products | Products | software-directory | Software directory | `/software/` | same | Home | Products | — | Compare / Pricing / Calculator | Browse | Product hubs | — | — | — | sufficient-or-n/a | software/ | existing:software-review-agent + onboard |  |

---

## 3. Pillar support map

Each pillar lists what must support it. Status uses the same legend.

### PILLAR: ✅ CRM Hub

**Route:** `/categories/crm/`

**SUPPORTED BY:**

- ✅ Best CRM Software
- 🟡 How to Choose CRM
- ✅ CRM Finder
- ✅ CRM Cost Calculator
- ✅ Product reviews (22)
- ✅ Comparisons hub + pairs
- 🟡 Industries index
- 🟢 Use cases index
- ✅ Capabilities index
- 🟡 Requirements index
- ✅ Features index
- 🔴 Implementation pillar
- 🔴 Resources surface
- ✅ Guides hub

### PILLAR: 🟡🔬 Best CRM Software

**Route:** `/best/crm-software/`

**Quality:** 76 · GOOD BUT IMPROVABLE · CQ-P1 · backlog `CQ-IMP` (Best) · gap `CQ-GAP` research-first (not a new URL)

**SUPPORTED BY (existing):**

- ✅ How to Choose / Requirements / Evaluation / Pricing guides (soft-published)
- ✅ Product reviews + Comparisons
- ✅ Vendor Scorecard tool + Evaluation Checklist resource
- ✅ CRM Finder + Cost/TCO calculators

**WEAK:**

- Approved recommendation rationales / evidence depth on Best itself

**MISSING / RESEARCH:**

- 🔬 RESEARCH REQUIRED: complete Best rationales before indexability (do **not** create alternate best-list URLs)
- ✅ Readiness, Plan Selector, Demo Checklist Builder shipped (CQ-GAP-003…005)

### PILLAR: ✅ How to Choose CRM

**Route:** `/guides/how-to-choose-crm/`

**SUPPORTED BY (existing):**

- ✅ Do I need a CRM? / Requirements / Evaluation / Demo / Trial guides
- ✅ Finder + calculators
- ✅ Requirements Builder tool + Evaluation Checklist / related RES pack

**WEAK:**

- Soft-publish / indexability on some Choose guides; evidence dating

**MISSING:**

- ✅ ROI Calculator + RFP/Demo/Readiness/Plan tools live (§11a)

### PILLAR: ✅ CRM Implementation Guide

**Route:** `/guides/crm-implementation/`

**Quality (2026-08-15):** Strong supporting guide pack (see §0c Implementation). Avg audited IMP guides typically STRONG.

**SUPPORTED BY (existing):**

- ✅ Implementation Cost / Timeline / Roles / Mistakes
- ✅ Data Migration Guide / Field Mapping / Testing / Go-Live / Training / Adoption
- ✅ Governance / Data Quality / Change Mgmt / KPIs
- ✅ Implementation Checklist (RES-006)
- ✅ Migration Checklist + related RES pack
- ✅ Go-Live Checklist / Training Plan resources
- ✅ Product implementation guides (catalogue)
- ✅ Tools: Implementation Planner / Migration Planner

**WEAK / IMPROVE:**

- Link-graph next-step consistency on some child guides (see backlog)

**MISSING supporting:**

- ✅ UAT test script worksheet (CRM-RES-UAT / CQ-GAP-009)

**Resources / Tools:** RES-006…016 + UAT · TOOL-009/010/015 live

### PILLAR: 🟡🔬 Industries index

**Route:** `/industries/`

**Quality:** 12 hubs @40 POOR (CQ-P0) — critical cluster health issue (§0a/§0c)

**SUPPORTED BY (existing):**

- 🟡🔬 13 industry hubs (shell + visuals; depth research incomplete)
- ✅ FS supporting guide pack (pattern for other verticals)
- ✅ Finder + Calculator

**WEAK:**

- All non-FS hubs lack industry-priorities / workflows / compliance / next-step wiring (SYS-INDUSTRY-DEPTH)

**MISSING / CANDIDATES:**

- 🔬 RESEARCH REQUIRED depth packs on existing hubs (not new URLs) — CQ-GAP industry rows
- 🔀 MERGE SMB industry ↔ `/for/small-business/`
- ⚪ OPTIONAL: workflow supporting guides after hub research (SaaS/HC/RE)
- 🚫 DO NOT CREATE product×industry permutations

### PILLAR: 🟢 Use Cases index

**Route:** `/use-cases/`

**SUPPORTED BY:**

- 🟢 17 use-case pages (approved / indexable)
- 🔴 Capability links
- 🟡 Requirements
- ✅ Finder
- 🔴 Resources

### PILLAR: 🟢 Requirements index

**Route:** `/requirements/`

**SUPPORTED BY:**

- 🟢 Separate sales processes (approved)
- 🟢 Automate lead follow-up (approved)
- 🟢 Restrict access by team (approved)
- 🟢 Forecast revenue (approved)
- 🟢 Track client interactions (approved)
- 🟢 Customize record fields (approved)
- 🟢 Support multiple currencies (approved)
- 🟢 Integrate with email (approved)
- 🟢 Support SSO (approved)
- 🟢 Audit user activity (approved)
- 🔴 Requirements Template
- ✅ Finder

### PILLAR: ✅ Features index

**Route:** `/features/`

**SUPPORTED BY:**

- ✅ Multiple pipelines
- ✅ Workflow automation
- ✅ 14 additional feature details (CRM-FEAT-003…016)
- ✅ Depth + hero/needs/workflow visuals; indexable

### PILLAR: ✅ Capabilities (global)

**Route:** `/capabilities/`

**SUPPORTED BY:**

- ✅ 16 capability pages (approved / indexable)
- 🟡 FS industry nests for pipeline + automation
- ✅ Finder / Requirements Builder / guides via HubDecisionLinks

### PILLAR: ✅ Compare hub

**Route:** `/compare/`

**SUPPORTED BY:**

- ✅ ~231 head-to-heads
- 🟡 Builder
- 🔴 Contextual compare articles (optional)
- 🔴 Comparison Worksheet

### PILLAR: ✅ Pricing index

**Route:** `/pricing/`

**SUPPORTED BY:**

- ✅ 22 product pricing pages
- 🔴 CRM Pricing Guide
- ✅ Calculator

### PILLAR: 🔴 Optimization pillar (virtual)

**Route:** `guides optimize cluster`

**SUPPORTED BY:**

- 🔴
-  
- A
- d
- o
- p
- t
- i
- o
- n
-  
- /
-  
- H
- y
- g
- i
- e
- n
- e
-  
- /
-  
- R
- e
- p
- o
- r
- t
- i
- n
- g
-  
- /
-  
- A
- u
- t
- o
- m
- a
- t
- i
- o
- n
-  
- /
-  
- A
- u
- d
- i
- t
-  
- /
-  
- H
- e
- a
- l
- t
- h
-  
- /
-  
- R
- e
- p
- l
- a
- c
- e
-  
- /
-  
- V
- e
- n
- d
- o
- r
-  
- m
- i
- g
- r
- a
- t
- i
- o
- n
- 🔴
-  
- O
- p
- t
- i
- m
- i
- z
- a
- t
- i
- o
- n
-  
- +
-  
- C
- l
- e
- a
- n
- u
- p
-  
- c
- h
- e
- c
- k
- l
- i
- s
- t
- s

---

## 4. Product support map

For each CRM catalogue product. Tabs count as ✅ where the software hub template exists.

| Product | Review | Pricing | Features tab | Alternatives page | Comparisons | Implementation guide | Migration | Setup | Feature guides | Industry guides | Use-case guides | Plan / Free vs Paid | Worth It? | Resources |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pipedrive | ✅ `/software/pipedrive/` (strong) | ✅ `/pricing/pipedrive/` | ✅ tab | ✅🟡 deepen / research | ✅ (pairs exist) | ✅ | ✅ | ✅ | ⚪ KEEP AS SECTION | 🚫 DNC mass | 🚫 DNC mass | ✅ | ✅ | via RES |
| freshsales | ✅ `/software/freshsales/` (strong) | ✅ `/pricing/freshsales/` | ✅ tab | 🟡🔬 RESEARCH FIRST | ✅ (pairs exist) | ✅ | ✅ | ✅ | ⚪ KEEP AS SECTION | 🚫 DNC mass | 🚫 DNC mass | ✅ | ✅ | via RES |
| close | ✅ `/software/close/` | ✅ `/pricing/close/` | ✅ tab | 🟡🔬 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| salesflare | ✅ `/software/salesflare/` | ✅ `/pricing/salesflare/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| folk | ✅ `/software/folk/` | ✅ `/pricing/folk/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| keap | ✅ `/software/keap/` | ✅ `/pricing/keap/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| streak | ✅ `/software/streak/` | ✅ `/pricing/streak/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| capsule | ✅ `/software/capsule/` | ✅ `/pricing/capsule/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| salesforce | ✅ `/software/salesforce/` (strong) | ✅ `/pricing/salesforce/` | ✅ tab | 🔬 RESEARCH FIRST alt page | ✅ (pairs exist) | ✅ | ✅ | ✅ | ⚪ KEEP AS SECTION | 🚫 DNC mass | 🚫 DNC mass | ✅ | ✅ | via RES |
| hubspot | ✅ `/software/hubspot/` (strong) | ✅ `/pricing/hubspot/` | ✅ tab | 🔬 RESEARCH FIRST alt page | ✅ (pairs exist) | ✅ | ✅ | ✅ | ⚪ KEEP AS SECTION | 🚫 DNC mass | 🚫 DNC mass | ✅ | ✅ | via RES |
| dynamics-365 | ✅ `/software/dynamics-365/` | ✅ `/pricing/dynamics-365/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| zoho-crm | ✅ `/software/zoho-crm/` (strong) | ✅ `/pricing/zoho-crm/` | ✅ tab | 🔬 RESEARCH FIRST alt page | ✅ (pairs exist) | ✅ | ✅ | ✅ | ⚪ KEEP AS SECTION | 🚫 DNC mass | 🚫 DNC mass | ✅ | ✅ | via RES |
| attio | ✅ `/software/attio/` | ✅ `/pricing/attio/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| copper | ✅ `/software/copper/` | ✅ `/pricing/copper/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| monday-sales-crm | ✅ `/software/monday-sales-crm/` (strong) | ✅ `/pricing/monday-sales-crm/` | ✅ tab | 🔬 RESEARCH FIRST alt page | ✅ (pairs exist) | ✅ | ✅ | ✅ | ⚪ KEEP AS SECTION | 🚫 DNC mass | 🚫 DNC mass | ✅ | ✅ | via RES |
| nutshell | ✅ `/software/nutshell/` | ✅ `/pricing/nutshell/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| insightly | ✅ `/software/insightly/` | ✅ `/pricing/insightly/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| bitrix24 | ✅ `/software/bitrix24/` | ✅ `/pricing/bitrix24/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| oracle-cx | ✅ `/software/oracle-cx/` | ✅ `/pricing/oracle-cx/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft (quote-led) | ✅ soft | 🔴 |
| sugarcrm | ✅ `/software/sugarcrm/` | ✅ `/pricing/sugarcrm/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| creatio | ✅ `/software/creatio/` | ✅ `/pricing/creatio/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |
| activecampaign | ✅ `/software/activecampaign/` | ✅ `/pricing/activecampaign/` | ✅ tab | 🔴 | ✅ (pairs exist) | ✅ soft | ✅ soft | ✅ soft | ⚪ | ⚪ | ⚪ | ✅ soft | ✅ soft | 🔴 |

**Notes:** Prefer hub tabs until standalone guides pass publication eligibility (`02` §7). Product guides above are approved/indexable via `src/services/product-guides`. Do not auto-create product×industry pages.

---

## 5. Industry support map

| Industry | Pillar | Supporting articles | Use cases | Capabilities | Requirements | Features | Product×industry | Comparisons | Resources | Tools |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| financial-services | 🟡🔬 `/industries/financial-services/` | 🔴 L3 pack | ✅ 2 nests | ✅ 2 nests | ✅ 2 nests | ✅ 2 nests | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| saas | 🟡🔬 `/industries/saas/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| small-business | 🔀🔬 `/industries/small-business/` MERGE→`/for/small-business/` | 🔴 (defer) | 🔴 nests | 🔴 | 🔴 | 🔴 | 🚫 DNC | 🟡 selective | ⚪ addendum on RES-001 | ✅ Finder/Calc |
| real-estate | 🟡🔬 `/industries/real-estate/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| healthcare | 🟡🔬 `/industries/healthcare/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| retail-ecommerce | 🟡🔬 `/industries/retail-ecommerce/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| legal-services | 🟡🔬 `/industries/legal-services/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| manufacturing | 🟡🔬 `/industries/manufacturing/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| education | 🟡🔬 `/industries/education/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| nonprofit | 🟡🔬 `/industries/nonprofit/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| hospitality | 🟡🔬 `/industries/hospitality/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| construction | 🟡🔬 `/industries/construction/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |
| transportation-logistics | 🟡🔬 `/industries/transportation-logistics/` | 🔴 | 🔴 nests | 🔴 | 🔴 | 🔴 | ⚪ | 🟡 selective | 🔴 | ✅ Finder/Calc |

---

## 6. Use case support map

| Use case | Status | Capabilities (target) | Requirements | Features | Products | Guides | Comparisons | Resources | Finder |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pipeline-management | 🟢 approved | Pipeline, Deal | Separate sales processes + planned | Multiple pipelines, custom stages | CRM catalogue | 🔴 | Rec | 🔴 | ✅ |
| lead-management | 🟢 approved | Lead | Automate lead follow-up + planned | Lead scoring, sequences | CRM catalogue | 🔴 | Rec | 🔴 | ✅ |
| contact-management | 🟢 approved | Contact, Relationship | Track interactions (🔴) | Contact mgmt, email sync | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| sales-automation | 🟢 approved | Workflow Automation | Automate lead follow-up | Workflow automation, sequences | CRM catalogue | 🔴 | Rec | 🔴 | ✅ |
| email-outreach | 🟢 approved | Email | Integrate with email (🔴) | Email sync, sequences | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| prospecting | 🟢 approved | Lead / Engagement | — | Sequences, calling | CRM + SI adjacency | 🔴 | O | 🔴 | ✅ |
| relationship-management | 🟢 approved | Relationship | Track interactions (🔴) | Contact, activities | CRM catalogue | 🔴 | Rec | 🔴 | ✅ |
| sales-engagement | 🟢 approved | Engagement | — | Calling, sequences | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| reporting | 🟢 approved | Reporting, Forecasting | Forecast revenue (🔴) | Dashboards, forecasting | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| account-management | 🟢 approved | Relationship / Pipeline | TBD | Activities, accounts | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| outbound-sales | 🟢 approved | Lead / Engagement | TBD | Sequences, calling | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| inbound-sales | 🟢 approved | Lead | Automate lead follow-up | Lead scoring, sequences | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| field-sales | 🟢 approved | Mobile / Pipeline | TBD | Mobile, activities | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| high-volume-lead-management | 🟢 approved | Lead | Automate lead follow-up | Lead scoring, sequences | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| complex-sales-processes | 🟢 approved | Pipeline, Deal | Separate sales processes | Multiple pipelines, custom stages | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| customer-follow-up | 🟢 approved | Relationship / Email | Automate lead follow-up | Sequences, activities | CRM catalogue | 🔴 | O | 🔴 | ✅ |
| sales-forecasting | 🟢 approved | Reporting, Forecasting | Forecast revenue (🔴) | Dashboards, forecasting | CRM catalogue | 🔴 | O | 🔴 | ✅ |

---

## 7. Capability → requirement → feature map

### Existing mappings (from live profiles)

```text
✅/🟡 Pipeline Management (capability)
│
├── ✅ Requirement: Support separate sales processes
│   ├── ✅ Feature: Multiple pipelines
│   ├── 🔴 Feature: Custom pipeline stages (detail page)
│   └── 🟡 related: Workflow automation
│
✅/🟡 Workflow Automation (capability)
│
├── ✅ Requirement: Automate lead follow-up
│   ├── ✅ Feature: Workflow automation
│   └── 🔴 Feature: Email sequences (detail)
```

### Proposed mappings (not yet researched as full graph)

```text
🔴 Contact Management
├── 🔴 Track client interactions
│   ├── contact-management, email-sync, activity logging
│
🔴 Lead Management
├── 🔴 Automate lead follow-up (exists)
├── 🔴 Capture/score leads
│   ├── lead-scoring, email-sequences
│
🔴 Deal Management
├── 🔴 Track opportunity progress
│   ├── deal-management, pipeline-management, forecasting
│
🔴 Reporting
├── 🔴 Forecast revenue
│   ├── forecasting, reporting-dashboards
│
🔴 Security / Administration
├── 🔴 Restrict access by team
├── 🔴 Support SSO
├── 🔴 Audit user activity
│   ├── role-permissions, sso, audit-logs
│
🔴 Customization
├── 🔴 Customize record fields
│   └── custom-fields
│
🔴 Email
├── 🔴 Integrate with email
│   └── email-sync, email-tracking
│
🔴 Integrations
├── API access, crm-sync (adjacency)
```

---

## 8. Resource support map

| Resource | Type | Status | Supports pillar/article | Tool | Next step |
| --- | --- | --- | --- | --- | --- |
| CRM Evaluation Checklist | checklist | ✅ | How to Choose / Evaluation Guide | Finder | Finder |
| CRM Requirements Template | template | ✅ | Requirements Guide | Requirements Builder | Requirements / Finder |
| CRM Vendor Scorecard | scorecard | ✅ | Evaluation / Vendor Evaluation | Vendor Scorecard (interactive ✅) | Compare |
| CRM RFP Template | template | ✅ | RFP Guide | — | Vendor Evaluation |
| CRM Demo Checklist | checklist | ✅ | Demo Guide | Demo Checklist Builder (interactive ✅) | Trial Evaluation |
| CRM Implementation Checklist | checklist | ✅ | Implementation Guide | Implementation Planner (✅) | Migration |
| CRM Migration Checklist | checklist | ✅ | Migration Guide | Migration Planner (✅) | Go-Live |
| CRM Go-Live Checklist | checklist | ✅ | Go-Live Guide | — | Training |
| CRM Training Plan | planner | ✅ | Training Guide | — | Adoption |
| CRM Data Migration Template | template | ✅ | Migration Guide | — | Field Mapping |
| CRM Field Mapping Template | template | ✅ | Field Mapping Guide | — | Testing |
| CRM Security Checklist | checklist | ✅ | Security capability / Vendor eval | — | SSO/Permissions reqs |
| CRM Comparison Worksheet | worksheet | ✅ | Compare hub | Compare | Calculator |
| CRM Business Case Template | template | ✅ | Business Case / ROI guides | Calculator | Select |
| CRM Optimization Checklist | checklist | ✅ | Health Check / Optimization | — | Audit |
| CRM Cleanup Checklist | checklist | ✅ | Data Hygiene | — | Optimize |
| CRM UAT test script worksheet | worksheet | ✅ | Testing / Go-Live guides | Implementation Planner | Go-Live Checklist |
| Resource route template `/resources/[slug]/ | platform | ✅ | All resources | — | — |

**Calculators (tools, not downloads):** ✅ CRM Cost Calculator · ✅ CRM TCO Calculator · ✅ CRM ROI Calculator · ✅ CRM Migration Cost Calculator

**Interactive planners / builders (tools, not downloads):** ✅ Requirements Builder · ✅ Vendor Scorecard · ✅ Implementation Planner · ✅ Migration Planner · ✅ RFP Builder · ✅ Demo Checklist Builder · ✅ Readiness Assessment · ✅ Plan Selector · ✅ Adoption / Health Assessment · ✅ Multi-product compare

---

## 9. Buyer journey map

| Buyer stage | User question | Primary pillar | Supporting article | Tool | Resource | Next stage |
| --- | --- | --- | --- | --- | --- | --- |
| Learn | What is CRM? | CRM Hub + What is CRM (✅ soft) | How CRM works / Types (✅ soft) | — | Glossary (✅ soft) | Need |
| Need | Do we need a CRM? | Do I need a CRM? (✅ soft) | CRM vs spreadsheet (✅ soft) | Finder / Requirements Builder | — | Requirements |
| Requirements | What must it do? | Requirements Guide (✅ soft) | Requirement details | Requirements Builder | Requirements Template | Discovery |
| Discovery | What are options? | Best CRM + Finder | How to Choose (✅ soft) | CRM Finder | Evaluation Checklist | Evaluation |
| Evaluation | How do we evaluate? | Evaluation Guide (✅ soft) | Demo/Trial/Vendor Q (✅ soft) | Vendor Scorecard | Scorecard (static ✅) | Comparison |
| Comparison | A or B? | Compare hub | Contextual guides (⚪) | Builder / Scorecard | Comparison Worksheet | Pricing |
| Pricing | What will it cost? | Pricing index + Pricing Guide (✅ soft) | TCO/ROI guides (✅ soft) | Cost + TCO Calculators | Business Case Template | Selection |
| Selection | Which vendor? | Best + Product reviews | Vendor Evaluation (✅ soft) | Finder / Scorecard / TCO | Scorecard (static ✅) | Implementation |
| Implementation | How do we roll out? | Implementation Guide (✅) | Product implementation guides (✅) | Implementation Planner | Implementation Checklist | Migration |
| Migration | How do we move data? | Migration Guide (🔴) | Product migration guides (✅) | Migration Planner | Migration Checklist | Training |
| Training | How do teams learn? | Training Guide (🔴) | — | — | Training Plan | Adoption |
| Adoption | Will people use it? | Adoption Guide (🔴) | Change management | — | Optimization Checklist | Optimization |
| Optimization | How do we improve? | Optimization cluster (🔴) | Audit / Health / Hygiene | Finder (re-eval) | Cleanup Checklist | (loop) |

---

## 10. Current gap summary by cluster

> **2026-08-15 quality note:** Row counts below are the **map register** (§2). Live audit coverage is **524** pages (avg 84.2) — see §0a. Implementation / Optimization / Requirements / Features / Resources / Use Cases / Capabilities have largely shipped since the original gap table; treat 🔴 cells here as stale unless confirmed in §2 Status + §0c.

| Cluster | Map existing | Partial/thin / research | Missing / CREATE | Optional / DNC | Quality signal (2026-08-15) |
| --- | ---: | ---: | ---: | ---: | --- |
| Learn | 14 | 0 | 0 | 0 | Strong–Excellent guides |
| Choose | 14 | 1 (Best) | 0 pages; tools missing | — | Best 76 CQ-P1; guides strong |
| Products | catalogue hubs + guides | Alternatives thin | flagship alt RESEARCH | product×industry 🚫 | Reviews strong (~91) |
| Comparisons | hub + pairs | builder partial | Multi-compare CREATE | contextual mass 🚫 | Strong comparisons |
| Industries | 13 hubs | 13 thin + SMB MERGE | supporting packs after research | product×industry 🚫 | **12×40 CQ-P0** critical |
| Use Cases | 18 | link/decision modules | — | — | ~79 needs decision CTAs |
| Capabilities | 17 | link/decision modules | — | — | ~79 needs decision CTAs |
| Requirements | 11 | evidence dating | — | — | Evidence gaps CQ-P2 |
| Features | 17 | evidence matrices | — | feature×UC 🚫 | Evidence gaps CQ-P2–P3 |
| Implementation | 17 guides | link polish | UAT worksheet | — | Strong coverage |
| Optimization | 9+ guides | — | Adoption Health tool | — | Strong |
| Resources | 16+ | — | UAT worksheet CREATE | industry checklist addendum ⚪ | Strong |
| Tools | 8 live + hub | Stack Builder partial | 7 CREATE (004,011–016) | — | See §11a |

Additional clusters in master table: Entry, Domain, Pricing, Business Type, Evidence (see §2). Operational queue: **§0f NEXT 50**.

---

## 11. Prioritized implementation backlog — TOP 25 P0/P1 gaps

> **Superseded for day-to-day ops by §0f NEXT 50 CONTENT ACTIONS** (quality + gap IDs). Historical P0/P1 build list retained below for traceability; many IMP/UC/CAP/RES items are now ✅ shipped.

| # | Priority | Item | Why it matters | Dependency | Existing template? | Research needed? | Agent | Recommended next step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | P0 | RecommendedNextStep + ParentHubLink modules on CRM pages | Journey orphans; linking architecture P0 | Linking §15 modules | Partial (guide sidebar) | No | needs-extension:internal-link + page models | Spec modules; wire category hub/guides first |
| 2 | P0 | CRM Hub CTA completeness (Best/Finder/Calc/UC/Industries) | L1 routing correctness | Category hub model | ✅ category hub | Light copy | category-hub-agent refresh | Audit hub model vs §3 required outbound |
| 3 | P0 | Best CRM indexability + ranking approval | Primary commercial anchor noindex | Editorial rankings approved | ✅ best template | Yes — research in-progress | best-software-agent | Finish research; approve rankings; set seo.indexable |
| 4 | P0 | What is CRM / How to Choose indexability | Learn/Choose anchors noindex | Quality gate | ✅ guides | Light | guide-agent | Editorial gate + seo.indexable when ready |
| 5 | P0 | How CRM Works (+ Learn pack LRN-002…014) | Learn journey soft-published | Hub + What is CRM | ✅ guides (indexable false) | Low | guide-agent | Editorial gate + raise seo.indexable |
| 6 | P0 | Do I need a CRM? + CRM vs spreadsheet | Need-stage | Learn cluster | ✅ shipped soft | Low | guide-agent | Soft-published LRN-007 + LRN-012; raise indexable after editorial |
| 7 | P0 | CRM Requirements Guide + Requirements Template | Requirements stage | Requirements index | ✅ guide soft; ✅ Requirements Builder; 🔴 resource tpl | Medium | guide-agent + missing ResourceAgent | Guide + interactive builder shipped; template resource still open |
| 8 | P0 | CRM Evaluation Guide + Evaluation Checklist + Scorecard | Evaluation stage | How to Choose | ✅ guide soft; ✅ Vendor Scorecard tool; 🔴 static resources | Medium | guide-agent + ResourceAgent | Interactive scorecard live; ship static checklist/resource |
| 9 | P0 | CRM Pricing Guide (+ TCO/ROI guides) | Pricing literacy | Pricing index + calculators | ✅ guides soft; ✅ Cost + TCO tools | Medium | guide-agent | Raise indexable; ROI calculator still open (TOOL-004) |
| 10 | P0 | CRM Implementation Guide pillar | Post-purchase path missing | Select stage | ✅ guide | Medium | guide-agent | Pillar first; then children |
| 11 | P0 | CRM Data Migration Guide + Migration Checklist | Implementation critical path | Implementation pillar | ✅ guide; 🔴 resource | Medium | guide-agent | After IMP pillar |
| 12 | P0 | ~~Deepen top use cases~~ | **Done 2026-08-14** — UC-000…017 approved/indexable | UC template | ✅ use-case-hub | Complete | use-case-hub | Cap/Req/Feature links still open |
| 13 | P0 | ~~Global capabilities index + detail hubs~~ | **Done 2026-08-14** — CAP-000…016 approved/indexable | capability-hub | ✅ capabilities | Complete | capability-hub | Cap↔Req↔Feature reciprocal graph still open |
| 14 | P0 | Expand requirements (access control, interactions, email integrate) | Finder/criteria coverage | Req template | ✅ req detail | Yes evidence | requirement-detail | Shipped CRM-REQ-000…010 indexable depth hubs |
| 15 | P0 | Feature details: email-sync (+ custom stages) | Feature graph thin | Feature template | ✅ feature detail | Yes | feature builders→agent | Add profiles |
| 16 | P0 | Orphan inbound / next-step publish validation | Prevent thin orphans | Audit CLI | Partial site-audit | No | LinkValidation (extend audit) | Add checks from linking §17 |
| 17 | P1 | Financial Services L3 supporting guide pack | Only rich industry lacks educational depth | FS hub profile | ✅ industry hub | Yes vertical | guide-agent | Plan 3–5 FS guides |
| 18 | P1 | Audience `/for/[slug]/` for small-business, startups, agencies, sales-teams | Business type cluster placeholder | Audience seed | 🔴 detail route | Medium | needs-extension | Implement for/[slug]; CRM-first |
| 19 | P1 | Pipedrive Alternatives indexability + more alternatives pages | Alternatives weak | alternatives template | ✅/🟡 | Yes relationships | alternatives-agent | Approve edges; publish |
| 20 | P1 | Stack Builder CRM completion | Partial tool | Tools registry | 🟡 | Product rules | tools-platform | Finish CRM path; keep noindex until ready |
| 21 | P1 | SaaS + SMB industry profile depth | Next verticals after FS | Industry hub builder | ✅ shell | Yes | industry builders | Research profiles like FS |
| 22 | P1 | Implementation child guides (timeline, cost, training, go-live) | Pillar needs children | IMP pillar | ✅ guide | Medium | guide-agent | After IMP-000 |
| 23 | P1 | Optimization: Improve Adoption + Health Check | Post-purchase loop | IMP adoption | ✅ guide | Low-Medium | guide-agent | After adoption guide |
| 24 | P1 | ~~Resource platform `/resources/[slug]/`~~ | **Done 2026-08-14** — RES-001…016 + RES-TPL approved/indexable | Resource schema + route | ✅ resource-hub | Complete | authored depth (agent still missing) | Optional: ResourceGeneratorAgent later |
| 25 | P1 | UC↔Cap↔Req↔Feature reciprocal link modules | Research graph incomplete | Linking architecture | Partial components | No | internal-link-agent + models | Implement Related* modules |

---

## 11a. Tools inventory — shipped interactive CRM tools

Interactive CRM tools **shipped** (distinct from downloadable Resources / checklists). Owned by **tools platform**.

**Live today (registry `available`):** CRM Finder · Cost Calculator · TCO Calculator · ROI Calculator · Requirements Builder · Vendor Scorecard · RFP Builder · Demo Checklist Builder · Readiness Assessment · Plan Selector · Implementation Planner · Migration Planner · Migration Cost Calculator · Adoption / Health Assessment · Multi-product compare · Tools hub. **Partial:** Software Stack Builder.

| Priority | Tool | ID | Why it matters | Where it fits |
| --- | --- | --- | --- | --- |
| P1 | CRM ROI Calculator | CRM-TOOL-004 | ✅ LIVE — estimates economic value vs cost | Business case |
| P1 | CRM RFP / Vendor Brief Builder | CRM-TOOL-011 | ✅ LIVE — converts requirements into a vendor-ready document | Procurement |
| P1 | CRM Demo Checklist Builder | CRM-TOOL-012 | ✅ LIVE — generates vendor-demo scenarios/questions from requirements | Evaluation |
| P1 | CRM Readiness Assessment | CRM-TOOL-013 | ✅ LIVE — selection vs implementation readiness, gaps, action plan | Early discovery |
| P1 | CRM Plan Selector | CRM-TOOL-014 | ✅ LIVE — lowest qualifying plan from verified matrices | Product decision |
| P2 | CRM Migration Cost Calculator | CRM-TOOL-015 | ✅ LIVE — migration effort/cost separate from software | Implementation |
| P2 | CRM Adoption / Health Assessment | CRM-TOOL-016 | ✅ LIVE — people vs system diagnostic after go-live | Post-purchase |
| P2 | Multi-product compare | CRM-CMP-003 | ✅ LIVE — 2–4 CRM matrix of existing pairwise pages | Compare |

**Companion resources (✅ shipped):** RES-001…016 downloadable under `/resources/` + `public/resources/*.{md,csv}` — tools remain interactive companions, not substitutes.

---

## 12. Agent ownership

| Agent / orchestrator | Page/content types | Status | Notes |
| --- | --- | --- | --- |
| SoftwareOnboardingOrchestrator (`onboard:software`) | Product candidates, PageCandidates | **existing** | Drafts via agents; approval gates |
| CategoryOnboardingOrchestrator (`onboard:category`) | Category hub + graph | **existing** | CRM densest |
| CatalogueOnboarding (`catalogue:*`) | Affiliate inventory → onboard | **existing** | existing-only scope |
| Workflow orchestration | multi-step publish | **existing** | stopAfterApproval defaults |
| `software-review-agent` | Product review | **existing** | |
| `pricing-page-agent` | Product pricing editorial | **existing** | |
| `comparison-agent` | Head-to-head | **existing** | CRM bulk scripts |
| `alternatives-agent` | Alternatives | **existing** | |
| `best-software-agent` | Best pages | **existing** | |
| `category-hub-agent` | Category hub | **existing** | |
| `use-case-page-agent` | Use-case pages | **existing** | |
| `guide-agent` | Learn/Choose/IMP/OPT guides | **existing** | |
| `internal-link-agent` | Link plans | **existing** | Extend for journey modules |
| `refresh-agent` | Refresh reviews | **existing** | |
| `qa-agent` | Draft QA | **existing** | |
| Knowledge planners (3) | knowledge-plan | **existing** | |
| CapabilityPageAgent | Global capabilities | **missing** | Builders exist for industry nests |
| RequirementPageAgent | Requirement details | **needs extension** | Profiles/builders; no registry agent |
| FeaturePageAgent | Feature details | **needs extension** | Profiles/builders; no registry agent |
| IndustryPageAgent | Industry hubs/L3 | **needs extension** | `industry-hub` services |
| ResourceGeneratorAgent | checklists/templates | **missing** (pages shipped via authored depth) | Schema/route ✅; agent optional follow-up |
| LinkValidationAgent | orphan/next-step gates | **needs extension** | site-audit linking checks partial |
| ResearchRefreshAgent | facts freshness | **existing** as refresh/research CLIs | Align naming |
| Audience/For page agent | `/for/[slug]/` | **missing** | |
| Tools platform (non-agent) | Finder/Cost/TCO/ROI/Requirements/Scorecard/RFP/Demo/Readiness/Plan/Planners/Migration Cost/Adoption/Multi-compare | **existing** | Interactive tools shipped 2026-08-18; not content-agent drafts |

---

## 13. Publication eligibility rules

| Content type | Eligibility (all required unless noted) | Avoid |
| --- | --- | --- |
| Supporting article (guide) | Unique intent; primary pillar; journey stage; next-step; not duplicate of section; meaningful depth | Thin keyword pages |
| Product guide | Product hub exists; verified facts; distinct from tab; ParentHubLink to review | Auto every product×topic |
| Industry article | Industry hub researched; vertical specificity; links to hub + Finder | Generic CRM copy with industry noun swapped |
| Use-case page | Clear job; capability/requirement links; ≥N tagged products with evidence | Empty product grids |
| Capability page | Definition; requirements; features; use cases; evidence path | Name-only stubs |
| Requirement page | Acceptance criteria; feature mappings; product fit cells; Finder mapping | Unmeasurable requirements |
| Feature page | Product support matrix; capability parent; requirement links | Taxonomy dump without evidence |
| Comparison | Both products public; relationship/facts; quality gate; `02` §8 rules | Every permutation; contextual without research |
| Resource | Parent pillar/guide; actionable fields; next-step; not duplicate of guide body | Download walls without guidance |

Indexation additionally requires `seo.indexable` + publish status + quality gates (`01` inventory).

---

## 14. Counts (final report inputs)

| Metric | Count |
| --- | ---: |
| Content-map version | 2026-08-15.1 |
| Master register rows (§2) | ~207 (includes CRM-RES-UAT live) |
| Live quality-audited pages | **524** (avg **84.2**) |
| Excellent / Strong / Needs improvement / Weak / Critical | 36 / 430 / 46 / 12 / 0 |
| Map↔quality overlay joins (§0b) | 145 |
| Improvement opportunities | 394 |
| New content candidates (§0e) | 50 (CREATE 9 · RESEARCH 23 · MERGE 1 · KEEP AS SECTION 14 · DO NOT CREATE 3) |
| Missing P1 tools | 0 (TOOL-004, 011–016, CMP-003, RES-UAT live 2026-08-18) |
| Research-required (industry thin + Best + alts) | industries CQ-P0 + Best CQ-P1 + flagship alternatives |
| Products covered (CRM pricing catalogue) | 22 |
| Industries covered (seed hubs) | 13 (1 MERGE candidate: SMB) |
| Use cases / Capabilities / Requirements / Features | shipped indexable hubs (evidence/link polish open) |
| Resources | 17 ✅ (UAT worksheet shipped 2026-08-18) |
| Product guides (PRD-T008…012 ×22) | 110 ✅ indexable |
| Tools | 16 interactive CRM tools + hub live (§11a); Software Stack Builder still partial |
| Path | `docs/content-ecosystem/04-crm-master-content-map.md` |

---

## Related documents

- Inventory: `01-current-page-inventory.md`
- Target ecosystem: `02-crm-target-ecosystem.md`
- Linking: `03-crm-linking-architecture.md`
- Quality inventory: `docs/content-quality/CONTENT-QUALITY-LATEST.md`
- Improvement backlog: `docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md`
- New content opportunities: `docs/content-quality/NEW-CONTENT-OPPORTUNITIES.md`
- Quality framework: `docs/content-quality/01-quality-framework.md` (v1.0.0)
- Agents: `docs/softwareglimpse/content-agents.md`
- Internal linking code: `docs/softwareglimpse/internal-linking.md`

### Final merge report (2026-08-15)

| Item | Result |
| --- | --- |
| Master map updated | Yes — version `2026-08-15.1` |
| Existing pages enriched | Yes — §0b quality overlay (score/band/CQ priority/gaps/backlog IDs) for 145 map routes; full 524 in quality latest |
| New candidates added | Yes — §0e (50) with MISSING / RESEARCH / OPTIONAL / DO NOT CREATE / MERGE; + CRM-RES-UAT row; tool/CMP annotations |
| High priority gaps | Industry hubs CQ-P0 @40; Best CRM research; SMB MERGE. Interactive tools + UAT worksheet shipped 2026-08-18 |
| Next recommended content action | RESEARCH `/industries/saas/` (`CQ-IMP-001` / CRM-IND-SAAS) — deepen existing hub, do not create sibling keyword URLs |

*End of CRM master content map. No pages implemented by this document.*
