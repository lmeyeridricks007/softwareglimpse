# SoftwareGlimpse CRM Target Content Ecosystem

> Spec date: 2026-08-14  
> Status: **authoritative target blueprint** (documentation only — no page implementation in this change)  
> Factual baseline: [`01-current-page-inventory.md`](./01-current-page-inventory.md)  
> Reuse rule: every CRM pattern below is a **category-scoped instance** of a reusable SoftwareGlimpse content architecture.

---

## How to read this document

### Template vs instance

| Term | Meaning |
| --- | --- |
| **Template** | Reusable page type / route pattern (e.g. `/software/[slug]/`, `/guides/[slug]/`, `/industries/[slug]/`) |
| **Instance** | A concrete URL + content object (e.g. `/guides/what-is-crm/`, `/software/hubspot/`) |
| **Cluster** | A journey-aligned set of pages/resources/tools that support one decision layer |

### Status vocabulary (strict)

| Status | Meaning |
| --- | --- |
| **EXISTING** | Inventory proves a live route + substantive template/content for that role |
| **EXISTING-BUT-THIN** | Route/template exists but content depth, research maturity, or indexability is incomplete |
| **PARTIAL** | Route/UI exists but is scaffold, incomplete, or CRM-scoped with missing depth |
| **MISSING** | No route / no content object for the proposed target |
| **NOT-YET-RESEARCHED** | Target is in scope, but research/facts/maturity do not yet justify publishable depth |
| **NOT-YET-IMPLEMENTED** | Architecture intended; product/tool/template not built yet |
| **OPTIONAL** | Valuable only after demand, research density, or commercial anchors justify it |

Do **not** treat “template exists” as “every instance exists.”

### Canonical CRM domain route

**Canonical Level-1 CRM Domain Hub = `/categories/crm/`**  
(Inventory: category hub template COMPLETE at `/categories/[...slug]/`.)

Proposed `/crm/` is **OPTIONAL** as a redirect/alias only — do not invent a second competing hub unless product strategy explicitly requires it.

Reusable pattern for future categories:

```text
/categories/{category}/          → Domain Hub (Level 1)
/best/{category}-software/       → Best pillar
/guides/{topic}/                 → Supporting knowledge
/software/{product}/            → Product hub
/compare/{a}-vs-{b}/            → Head-to-head
/for/{audience}/                 → Business type / audience
/industries/{industry}/          → Industry hub (category-aware)
/use-cases/{use-case}/           → Use-case hub (category-tagged)
/features/{feature}/            → Feature detail
/requirements/{requirement}/    → Requirement detail
/tools/{category}-finder/        → Category finder
```

---

## 1. Core CRM decision ecosystem

```text
CRM
│
├── Learn
├── Choose
├── Products
├── Compare
├── Business Type
├── Industries
├── Use Cases
├── Capabilities
├── Requirements
├── Features
├── Pricing
├── Implementation
├── Optimization
├── Resources
├── Tools
└── Evidence / Methodology
```

| Layer | Role | Primary buyer job | Typical destinations |
| --- | --- | --- | --- |
| **Learn** | Build shared vocabulary and reduce category confusion | “What is CRM and do we need it?” | Guides, glossary, vs-pages |
| **Choose** | Turn goals into a selection process | “How do we pick responsibly?” | Best, how-to-choose, evaluation guides, checklists |
| **Products** | Deep research on individual vendors | “Is this product right for us?” | Software hubs, pricing, alternatives |
| **Compare** | Resolve shortlists | “A or B (under our constraints)?” | Comparisons, builder, worksheets |
| **Business Type** | Audience / company-shape framing (`/for/`) | “What fits teams like ours?” | Audience pages → Finder / Best |
| **Industries** | Vertical constraints & workflows | “What matters in our industry?” | Industry hubs + nests |
| **Use Cases** | Job-to-be-done framing | “What are we actually trying to run?” | Use-case pages → capabilities/requirements |
| **Capabilities** | Capability areas (broader than features) | “Do we need pipeline + automation?” | Capability pages |
| **Requirements** | Testable buyer needs | “Must support X” | Requirement pages → Finder criteria |
| **Features** | Concrete product mechanisms | “Does it have multiple pipelines?” | Feature pages → product evidence |
| **Pricing** | Cost realism | “What will this cost?” | Pricing pages + calculator |
| **Implementation** | Post-selection delivery risk | “Can we actually roll this out?” | Implementation guides + checklists |
| **Optimization** | Post-purchase value | “How do we get ROI after go-live?” | Adoption / hygiene / audit guides |
| **Resources** | Reusable artifacts | “Give me a checklist/template” | Downloads / worksheets |
| **Tools** | Interactive decision engines | “Help me choose / estimate” | Finder, calculators, stack builder |
| **Evidence / Methodology** | Trust & defensibility | “Why should we trust this?” | Methodology, sources, research panels |

---

## 2. CRM buyer journey map

```text
We need a CRM
→ Understand CRM
→ Determine whether CRM is needed
→ Define business goals
→ Define use case
→ Identify capabilities
→ Define requirements
→ Prioritize requirements
→ Find candidate software
→ Research products
→ Compare products
→ Compare pricing
→ Evaluate implementation
→ Select vendor
→ Implement
→ Migrate
→ Train
→ Adopt
→ Measure
→ Optimize
```

| Stage | Buyer question | Supporting page types | Tools | Resources | Commercial / decision destination | Next step |
| --- | --- | --- | --- | --- | --- | --- |
| Need signal | “We need a CRM?” | Domain hub, Learn pillar | — | — | `/categories/crm/` | Understand CRM |
| Understand | “What is CRM?” | definition, explainer guides | — | glossary | Learn guides | Need assessment |
| Need assessment | “Do we need one?” | decision-guide | Finder (light) | — | Do-I-need + Best | Goals |
| Goals | “What outcomes matter?” | choose guides, industry/audience hubs | Finder | requirements template | Finder / Requirements | Use case |
| Use case | “What job are we buying for?” | use-case pages | Finder | use-case checklist | `/use-cases/{slug}/` | Capabilities |
| Capabilities | “Which capability areas?” | capability pages | Finder | capability map | capability → requirements | Requirements |
| Requirements | “What must be true?” | requirement pages | Finder criteria | requirements template | requirement detail | Prioritize |
| Prioritize | “What is must vs nice?” | evaluation / RFP guides | Finder | scorecard | scorecard + Finder | Candidates |
| Find candidates | “What’s on the shortlist?” | Best, Finder results, category software | **CRM Finder** | scorecard | `/best/crm-software/`, Finder | Research |
| Research products | “Is this vendor credible?” | product review hubs | — | vendor questions | `/software/{slug}/` | Compare |
| Compare products | “A vs B?” | comparison pages | compare builder | comparison worksheet | `/compare/{slug}/` | Pricing |
| Compare pricing | “What will we pay?” | product pricing, pricing guide | **Cost Calculator** | TCO worksheet | `/pricing/{slug}/`, calculator | Implementation fit |
| Evaluate implementation | “Can we roll it out?” | implementation cluster | — | implementation checklist | implementation pillar | Select |
| Select vendor | “Which one do we buy?” | Best, compare, vendor eval | Finder + calculator | business case | Best + CTAs (`/go/`) | Implement |
| Implement | “How do we launch?” | implementation guides | — | project plan, go-live | product setup guides | Migrate |
| Migrate | “How do we move data?” | migration guides | — | migration / mapping templates | product migration pages | Train |
| Train | “How do teams learn it?” | training guides | — | training plan | product setup | Adopt |
| Adopt | “Will people use it?” | adoption guides | — | adoption checklist | optimization cluster | Measure |
| Measure | “Is it working?” | KPI / reporting guides | — | health check | reporting best practices | Optimize |
| Optimize | “How do we improve / replace?” | optimization cluster | — | audit / cleanup | replace / migrate guides | Loop |

---

## 3. Page levels

| Level | Name | Role | CRM examples |
| --- | --- | --- | --- |
| **L0** | Home | Cross-category entry; CRM as featured vertical | `/` |
| **L1** | CRM Domain Hub | Single composition for the CRM decision system | `/categories/crm/` |
| **L2** | Pillar / decision hubs | Journey anchors with commercial weight | Best CRM, Use Cases index, Industries index, Tools, Pricing index, Guides (CRM filter) |
| **L3** | Supporting guides / decision pages | Educational & process content that feeds L2 | What is CRM, How to choose, Implementation guide |
| **L4** | Structured research entities | Graph-backed entities with evidence | Software hubs, comparisons, features, requirements, industry×capability |
| **L5** | Evidence / sources | Trust layer; rarely standalone SEO destinations | Research sources, methodology pages, source lists on L4 |

Publication rule: **L5 never invents rankings.** L4 may be noindex until research maturity allows. L3 supports L2; it does not replace Best/Compare/Finder.

---

## 4. CRM Domain Hub (L1)

| Field | Spec |
| --- | --- |
| **Canonical route** | `/categories/crm/` |
| **Optional alias** | `/crm/` → redirect (**OPTIONAL**) |
| **Template** | Category hub (`/categories/[...slug]/`) |
| **Status** | **EXISTING** (template COMPLETE; CRM densest profile per inventory) |
| **Priority** | **P0** |
| **Role** | Orientation + routing into Learn / Choose / Products / Compare / Tools / vertical knowledge |

### Required sections (target)

1. Quick answer: who CRM is for / not for  
2. Primary CTAs: CRM Finder, Best CRM, Cost Calculator  
3. Learn strip (fundamentals)  
4. Choose strip (how to choose, requirements, evaluation)  
5. Product explorer (researched CRM catalogue)  
6. Comparisons entry  
7. Industries entry  
8. Use cases entry  
9. Capabilities / Requirements / Features entry  
10. Pricing / TCO entry  
11. Implementation & optimization entry  
12. Resources & methodology  
13. Trust / evidence panel  

### Must link to

| Destination | Current route | Status |
| --- | --- | --- |
| Learn CRM | `/guides/` (CRM) + fundamentals | PARTIAL (hub noindex; 2 guides) |
| Best CRM | `/best/crm-software/` | EXISTING-BUT-THIN (published, indexable:false) |
| CRM Finder | `/tools/crm-finder/` | EXISTING |
| CRM Cost Calculator | `/tools/crm-cost-calculator/` | EXISTING |
| Software | `/software/` (CRM-filtered via hub) | EXISTING |
| Comparisons | `/compare/?category=crm` or hub module | EXISTING |
| Industries | `/industries/` | EXISTING-BUT-THIN (noindex) |
| Use Cases | `/use-cases/` | **APPROVED** (indexable; depth + teaching visuals) |
| Capabilities | `/capabilities/` + details | **APPROVED** (indexable; depth + teaching visuals); industry nests remain |
| Requirements | `/requirements/` | PARTIAL (2 items) |
| Features | `/features/` | PARTIAL (2 items) |
| Implementation | `/guides/crm-implementation/` (proposed) | MISSING |
| Resources | `/resources/` or guide-tagged resources | MISSING as dedicated taxonomy |

---

## 5. Learn cluster

Pillar parent: CRM Domain Hub → Learn.  
Primary commercial CTAs: Best CRM, CRM Finder (soft).

| ID | Proposed title | Type | Intent | Pillar | Primary CTA | Tools | Status | Current / proposed route | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM-LRN-001 | What is CRM? | definition | Educate | Learn | How to choose | Finder | **EXISTING** (noindex) | `/guides/what-is-crm/` | P0 |
| CRM-LRN-002 | How CRM works | explainer | Understand mechanics | Learn | Do I need a CRM? | — | **EXISTING** | `/guides/how-crm-works/` | P0 |
| CRM-LRN-003 | Types of CRM | explainer | Segment category | Learn | Best CRM | Finder | **EXISTING** | `/guides/types-of-crm/` | P1 |
| CRM-LRN-004 | CRM benefits | explainer | Motivate adoption | Learn | Finder | Finder | **EXISTING** | `/guides/crm-benefits/` | P1 |
| CRM-LRN-005 | CRM terminology / glossary | glossary | Vocabulary | Learn | Requirements guide | — | **EXISTING** | `/guides/crm-glossary/` | P1 |
| CRM-LRN-006 | CRM examples | explainer | Concrete scenarios | Learn | Use cases | Finder | **EXISTING** | `/guides/crm-examples/` | P2 |
| CRM-LRN-007 | CRM vs spreadsheet | decision-guide | Boundary | Learn | Do I need | — | **EXISTING** (soft) | `/guides/crm-vs-spreadsheet/` | P0 |
| CRM-LRN-008 | CRM vs ERP | comparison-education | Boundary | Learn | Category hub | — | **EXISTING** (soft) | `/guides/crm-vs-erp/` | P1 |
| CRM-LRN-009 | CRM vs marketing automation | comparison-education | Boundary | Learn | Category hub | — | **EXISTING** (soft) | `/guides/crm-vs-marketing-automation/` | P1 |
| CRM-LRN-010 | CRM vs customer service software | comparison-education | Boundary | Learn | Category hub | — | **EXISTING** (soft) | `/guides/crm-vs-customer-service-software/` | P2 |
| CRM-LRN-011 | CRM vs CDP | comparison-education | Boundary | Learn | Category hub | — | **EXISTING** (soft) | `/guides/crm-vs-cdp/` | P3 |
| CRM-LRN-012 | Do I need a CRM? | decision-guide | Qualify | Learn→Choose | Finder | Finder | **EXISTING** (soft) | `/guides/do-i-need-a-crm/` | P0 |
| CRM-LRN-013 | When should a business adopt CRM? | decision-guide | Timing | Learn→Choose | How to choose | — | **EXISTING** (soft) | `/guides/when-to-adopt-crm/` | P1 |
| CRM-LRN-014 | Common CRM mistakes | guide | Risk reduction | Learn→Choose | Evaluation checklist | — | **EXISTING** (soft) | `/guides/common-crm-mistakes/` | P1 |

**Internal links (cluster pattern):** Learn pages → Domain Hub, How to choose, Use cases, Best (soft), Methodology.

---

## 6. Choose / buying cluster

### Guides / decision pages

| ID | Title | Type | Status | Route | Priority |
| --- | --- | --- | --- | --- | --- |
| CRM-BUY-001 | Best CRM Software | best-detail | **EXISTING-BUT-THIN** | `/best/crm-software/` | P0 |
| CRM-BUY-002 | How to Choose CRM Software | decision-guide | **EXISTING** (noindex) | `/guides/how-to-choose-crm/` | P0 |
| CRM-BUY-003 | CRM Requirements Guide | guide | **EXISTING** (soft) | `/guides/crm-requirements-guide/` | P0 |
| CRM-BUY-004 | CRM Evaluation Guide | decision-guide | **EXISTING** (soft) | `/guides/crm-evaluation-guide/` | P0 |
| CRM-BUY-005 | CRM Selection Process | how-to | **EXISTING** (soft) | `/guides/crm-selection-process/` | P1 |
| CRM-BUY-006 | CRM Vendor Evaluation | decision-guide | **EXISTING** (soft) | `/guides/crm-vendor-evaluation/` | P1 |
| CRM-BUY-007 | CRM RFP Guide | guide | **MISSING** | `/guides/crm-rfp-guide/` | P2 |
| CRM-BUY-008 | CRM Demo Guide | how-to | **MISSING** | `/guides/crm-demo-guide/` | P1 |
| CRM-BUY-009 | CRM Trial Evaluation Guide | how-to | **MISSING** | `/guides/crm-trial-evaluation/` | P1 |
| CRM-BUY-010 | CRM Pricing Guide | pricing-education | **MISSING** | `/guides/crm-pricing-guide/` | P0 |
| CRM-BUY-011 | CRM Total Cost Guide | pricing-education | **MISSING** | `/guides/crm-total-cost-guide/` | P1 |
| CRM-BUY-012 | CRM ROI Guide | guide | **MISSING** | `/guides/crm-roi-guide/` | P2 |
| CRM-BUY-013 | CRM Business Case Guide | guide | **MISSING** | `/guides/crm-business-case/` | P2 |
| CRM-BUY-014 | CRM Vendor Questions | guide | **MISSING** | `/guides/crm-vendor-questions/` | P1 |
| CRM-BUY-015 | CRM Selection Mistakes | guide | **MISSING** | `/guides/crm-selection-mistakes/` | P1 |

Primary CTAs: **CRM Finder**, Cost Calculator, Best CRM, Compare.  
Tool integration: Finder for shortlist; Calculator for cost realism.

### Support resources (see §17)

Evaluation Checklist, Vendor Scorecard, Requirements Template, RFP Template, Comparison Worksheet, Business Case Template — all **MISSING** as first-class resources.

### Tools

| Tool | Status | Route | Priority |
| --- | --- | --- | --- |
| CRM Finder | **EXISTING** | `/tools/crm-finder/` | P0 |
| CRM Cost Calculator | **EXISTING** | `/tools/crm-cost-calculator/` | P0 |
| CRM ROI Calculator | **NOT-YET-IMPLEMENTED** | `/tools/crm-roi-calculator/` | P2 |
| CRM TCO Calculator | **NOT-YET-IMPLEMENTED** | `/tools/crm-tco-calculator/` | P2 |
| Software Stack Builder (CRM-first) | **PARTIAL** | `/tools/software-stack-builder/` | P1 |

---

## 7. Product ecosystem (reusable Product Hub)

### Current architecture (inventory)

| Piece | Route | Status |
| --- | --- | --- |
| Product review hub | `/software/[slug]/` | **EXISTING** |
| Hub tabs | `/software/[slug]/{tab}/` | **EXISTING** (features, pricing, use-cases, comparisons, alternatives, evidence, methodology, faq) |
| Standalone pricing | `/pricing/[slug]/` | **EXISTING** (CRM snapshots) |
| Alternatives | `/alternatives/[slug]/` | **PARTIAL** (1 published Pipedrive; others researching) |

### Reusable product taxonomy

| Template ID | Page / section | Standalone vs tab | Publish when | Priority |
| --- | --- | --- | --- | --- |
| PRD-T-001 | `[Product] Review` | Standalone hub | Always for active catalogue products | P0 |
| PRD-T-002 | `[Product] Pricing` | Tab **and/or** `/pricing/{slug}/` | Verified pricing | P0 |
| PRD-T-003 | `[Product] Features` | Tab first; standalone guide OPTIONAL | Evidence matrix ready | P0 tab / P2 page |
| PRD-T-004 | `[Product] Pros & Cons` | Section on review | Always with review | P0 (section) |
| PRD-T-005 | `[Product] Alternatives` | Standalone when researched | Approved alternative-to graph | P1 |
| PRD-T-006 | `[Product] Integrations` | Tab/section → standalone OPTIONAL | Integration research | P2 |
| PRD-T-007 | `[Product] Security / Admin` | Section → standalone OPTIONAL | Security research | P2 |
| PRD-T-008 | `[Product] Implementation Guide` | Standalone guide | Post-purchase demand + product depth | P1 |
| PRD-T-009 | `[Product] Migration Guide` | Standalone guide | Migration paths researched | P2 |
| PRD-T-010 | `[Product] Setup Guide` | Standalone / section | After implementation pillar | P2 |
| PRD-T-011 | Feature guides (product-scoped) | Standalone OPTIONAL | Feature + product evidence | P2–P3 |
| PRD-T-012 | Use-case guides (product-scoped) | Standalone OPTIONAL | Fit assessment exists | P2 |
| PRD-T-013 | Industry guides (product × industry) | Standalone OPTIONAL | Industry profile + product evidence | P2–P3 |
| PRD-T-014 | Plan guide / Free vs Paid / Which plan | Standalone or pricing child | Plan matrix verified | P1 |
| PRD-T-015 | Worth it? / SMB / Sales-team variants | Standalone OPTIONAL | Avoid thin duplicates of review | P2–P3 |
| PRD-T-016 | Comparison cluster | `/compare/{product}-vs-{other}/` | Eligibility rules (§8) | P0–P1 |
| PRD-T-017 | Checklists (setup/migration) | Resource | After guides | P2 |

**Rule:** Prefer **hub tabs/sections** until content depth + unique intent justify a new URL (`decideTopicPlacement` principle from supporting-content-clusters).

### Example instance map: HubSpot (illustrative)

| Content | Status | Route |
| --- | --- | --- |
| HubSpot CRM Review | **EXISTING** | `/software/hubspot/` |
| HubSpot Pricing | **EXISTING** | `/pricing/hubspot/` + pricing tab |
| HubSpot Features / Use cases / Comparisons / Alternatives / Evidence tabs | **EXISTING** (tab templates) | `/software/hubspot/{tab}/` |
| HubSpot Alternatives page | **NOT-YET-RESEARCHED** / MISSING instance | `/alternatives/hubspot/` |
| HubSpot Implementation / Migration / Setup / Pipeline / Workflow / Reporting / Lead scoring / Permissions guides | **MISSING** | `/guides/hubspot-…/` |
| HubSpot Free vs Paid / Which plan / Worth it | **MISSING** | `/guides/…` |
| HubSpot for Small Business / Sales / industries / use cases | **OPTIONAL** / NOT-YET-RESEARCHED | `/guides/…` or `/for/` + industry nests |

Same taxonomy applies to all ~22 CRM catalogue products; **do not auto-publish** every product×guide permutation.

**CRM product instance set (catalogue anchors):**  
pipedrive, freshsales, close, salesflare, folk, keap, streak, capsule, salesforce, hubspot, dynamics-365, zoho-crm, attio, copper, monday-sales-crm, nutshell, insightly, bitrix24, oracle-cx, sugarcrm, creatio, activecampaign.

---

## 8. Comparison ecosystem

| Type | Template / route | Status | Notes |
| --- | --- | --- | --- |
| Comparison landing | `/compare/` | **EXISTING** | CRM-heavy |
| Head-to-head | `/compare/{a}-vs-{b}/` | **EXISTING** (~231 indexable) | Lexicographic slug |
| Compare builder | `/compare/build/` | **PARTIAL** | noindex |
| Multi-product comparison | proposed tool/page | **NOT-YET-IMPLEMENTED** | Beyond pair builder |
| Feature-focused comparison article | `/guides/…` or compare tab depth | **MISSING** as dedicated articles | OPTIONAL/P2 |
| Requirement-focused comparison | article | **MISSING** | OPTIONAL |
| Use-case-focused comparison | article | **MISSING** | OPTIONAL |
| Industry-context comparison | article | **MISSING** | OPTIONAL; needs industry research |

### Eligibility rules (do **not** auto-publish every permutation)

Publish / index a comparison **instance** only when **all** are true:

1. Both products are active CRM catalogue entities with public software hubs.  
2. An approved `competes-with` / comparison relationship exists (or research job completed).  
3. Enough verified facts exist for features, pricing posture, and fit dimensions.  
4. Editorial/QA gate passes (`isEntityIndexable` path).  
5. Intent is not a near-duplicate of an existing pair page.

Publish a **contextual** comparison article (e.g. “HubSpot vs Salesforce for Financial Services”) only when:

1. Base head-to-head exists and is solid.  
2. The context entity (industry / use case / audience) has researched profile depth.  
3. Differentiation is material (not a thin rewrite).  
4. Placement decision ≠ `ADD_SECTION` on the base compare page.  
5. Priority ≤ demand (default **P2–P3**, never blanket P0).

**Examples in scope as targets, not auto-build list:** HubSpot vs Salesforce; Pipedrive vs Close; HubSpot vs Pipedrive; + optional SMB / FS / Pricing / Automation variants under eligibility.

---

## 9. Business type cluster (`/for/`)

Inventory: `/for/` is **PLACEHOLDER**; **no `/for/[slug]/`**. Seeded audiences: small-business, startups, agencies, sales-teams.

| ID | Title | Pillar | Status | Proposed route | Priority |
| --- | --- | --- | --- | --- | --- |
| CRM-AUD-000 | Audience index | audience-landing | **PARTIAL** | `/for/` | P1 |
| CRM-AUD-001 | CRM for Small Business | audience-detail | **MISSING** | `/for/small-business/` (CRM-aware) | P0 |
| CRM-AUD-002 | CRM for Startups | audience-detail | **MISSING** | `/for/startups/` | P1 |
| CRM-AUD-003 | CRM for Enterprise | audience-detail | **MISSING** | `/for/enterprise/` | P1 |
| CRM-AUD-004 | CRM for Freelancers | audience-detail | **OPTIONAL** | `/for/freelancers/` | P3 |
| CRM-AUD-005 | CRM for Agencies | audience-detail | **MISSING** | `/for/agencies/` | P1 |
| CRM-AUD-006 | CRM for Nonprofits | audience-detail | **MISSING** | `/for/nonprofits/` | P2 |
| CRM-AUD-007 | CRM for Growing Teams | audience-detail | **OPTIONAL** | `/for/growing-teams/` | P2 |
| CRM-AUD-008 | CRM for Remote Sales Teams | audience-detail | **MISSING** | `/for/sales-teams/` (extend seed) | P1 |

**Per audience page must include:** supporting articles, key requirements, resources, shortlist products, Finder CTA, links to Best + relevant use cases.  
Until cross-category aggregation exists, CRM-first content is acceptable; keep `/for/` distinct from `/industries/` (IA decision).

---

## 10. Industry cluster

### Architecture

```text
/industries/{industry}/                          → Industry hub (CRM-aware)
/industries/{industry}/use-cases/{useCase}/    → Industry × use case
/industries/{industry}/capabilities/{cap}/     → Industry × capability
/industries/{industry}/features/{feature}/      → Industry × feature
/industries/{industry}/requirements/{req}/    → Industry × requirement
```

Supporting L3 guides (proposed under `/guides/`):

- How {Industry} firms use CRM  
- {Industry} CRM requirements  
- CRM features for {Industry}  
- CRM implementation for {Industry}  
- CRM security for {Industry}  
- CRM data migration for {Industry}  
- Vendor / evaluation checklists  

Product × industry and use-case × industry pages: **OPTIONAL**, eligibility = industry research maturity ≥ researched + product evidence.

### Target industries (from seed)

| Industry slug | Hub status | Rich profile | Nested FS-style depth | Priority to deepen |
| --- | --- | --- | --- | --- |
| financial-services | **EXISTING-BUT-THIN** (noindex) | **EXISTING** profile | 2 capability, 2 UC, 2 feature, 2 requirement nests | P0 |
| saas | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P0 |
| small-business | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P0 (also overlaps `/for/`) |
| real-estate | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P1 |
| healthcare | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P1 |
| retail-ecommerce | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P1 |
| legal-services | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P1 |
| manufacturing | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P2 |
| education | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P2 |
| nonprofit | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P2 |
| hospitality | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P2 |
| construction | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P2 |
| transportation-logistics | **EXISTING-BUT-THIN** | NOT-YET-RESEARCHED | MISSING | P2 |

### Financial Services example tree (target)

| Node | Status | Route |
| --- | --- | --- |
| CRM for Financial Services | EXISTING-BUT-THIN | `/industries/financial-services/` |
| Supporting L3 guides (how used, requirements, features, implementation, security, migration, checklists) | **LIVE** (7 guides, indexable) | `/guides/financial-services-crm-…/` |
| Pipeline Management for FS | **EXISTING** (noindex) | `/industries/financial-services/capabilities/pipeline-management/` |
| Workflow Automation for FS | **EXISTING** (noindex) | `…/capabilities/workflow-automation/` |
| Advisory / Complex sales UC | **EXISTING** (noindex) | nested use-cases |
| Feature/requirement nests | **EXISTING** (noindex) | nested features/requirements |
| HubSpot/Salesforce/Pipedrive for FS | **OPTIONAL** | guides or product sections |
| Indexability | — | Raise only after research maturity + editorial gate |

---

## 11. Use case cluster

### Approved instances (17 hubs + index; editorial gate 2026-08-14)

| Slug | Status | Route | Priority |
| --- | --- | --- | --- |
| *(index)* | **APPROVED** (indexable) | `/use-cases/` | P0 |
| pipeline-management | **APPROVED** | `/use-cases/pipeline-management/` | P0 |
| lead-management | **APPROVED** | `/use-cases/lead-management/` | P0 |
| contact-management | **APPROVED** | `/use-cases/contact-management/` | P0 |
| sales-automation | **APPROVED** | `/use-cases/sales-automation/` | P0 |
| email-outreach | **APPROVED** | `/use-cases/email-outreach/` | P1 |
| prospecting | **APPROVED** | `/use-cases/prospecting/` | P1 |
| relationship-management | **APPROVED** | `/use-cases/relationship-management/` | P0 |
| sales-engagement | **APPROVED** | `/use-cases/sales-engagement/` | P1 |
| reporting | **APPROVED** | `/use-cases/reporting/` | P1 |
| account-management | **APPROVED** | `/use-cases/account-management/` | P1 |
| outbound-sales | **APPROVED** | `/use-cases/outbound-sales/` | P1 |
| inbound-sales | **APPROVED** | `/use-cases/inbound-sales/` | P1 |
| field-sales | **APPROVED** | `/use-cases/field-sales/` | P2 |
| high-volume-lead-management | **APPROVED** | `/use-cases/high-volume-lead-management/` | P2 |
| complex-sales-processes | **APPROVED** (FS nest also exists) | `/use-cases/complex-sales-processes/` | P1 |
| customer-follow-up | **APPROVED** | `/use-cases/customer-follow-up/` | P1 |
| sales-forecasting | **APPROVED** | `/use-cases/sales-forecasting/` | P1 |

### Per use-case package (shipped depth bar)

- Pillar page (L4 entity) with overview, challenges, outcomes, must/nice needs, workflow, FAQ  
- Unique teaching visuals: `{slug}-hero|needs|workflow.png`  
- Catalogue products tagged for the entity = explore lists (not rankings)  
- Linked capabilities / requirements / features still mostly open  
- Finder CTAs + related links  

Index hub `/use-cases/`: **APPROVED** (indexable) — depth hubs live.

---

## 12. Capability cluster

**Status:** Global `/capabilities/` live and **APPROVED** (indexable). Industry nests remain for FS pipeline/automation.

### Target global capability set

| ID | Capability | Status | Proposed route | Priority |
| --- | --- | --- | --- | --- |
| CRM-CAP-000 | Capabilities index | **APPROVED** | `/capabilities/` (CRM-filtered) or category module | P1 |
| CRM-CAP-001 | Contact Management | **APPROVED** | `/capabilities/contact-management/` | P0 |
| CRM-CAP-002 | Relationship Management | **APPROVED** | `/capabilities/relationship-management/` | P0 |
| CRM-CAP-003 | Lead Management | **APPROVED** | `/capabilities/lead-management/` | P0 |
| CRM-CAP-004 | Pipeline Management | **APPROVED** (global + FS nest) | `/capabilities/pipeline-management/` | P0 |
| CRM-CAP-005 | Deal Management | **APPROVED** | `/capabilities/deal-management/` | P0 |
| CRM-CAP-006 | Workflow Automation | **APPROVED** (global + FS nest) | `/capabilities/workflow-automation/` | P0 |
| CRM-CAP-007 | Email Capabilities | **APPROVED** | `/capabilities/email/` | P1 |
| CRM-CAP-008 | Calling / Sales Engagement | **APPROVED** | `/capabilities/sales-engagement/` | P1 |
| CRM-CAP-009 | Reporting | **APPROVED** | `/capabilities/reporting/` | P0 |
| CRM-CAP-010 | Forecasting | **APPROVED** | `/capabilities/forecasting/` | P1 |
| CRM-CAP-011 | Customization | **APPROVED** | `/capabilities/customization/` | P1 |
| CRM-CAP-012 | Integrations | **APPROVED** | `/capabilities/integrations/` | P1 |
| CRM-CAP-013 | Administration | **APPROVED** | `/capabilities/administration/` | P1 |
| CRM-CAP-014 | Security | **APPROVED** | `/capabilities/security/` | P1 |
| CRM-CAP-015 | Mobile | **APPROVED** | `/capabilities/mobile/` | P2 |
| CRM-CAP-016 | AI Assistance | **APPROVED** | `/capabilities/ai-assistance/` | P2 |

Each capability page: definition, use cases, requirements, features, supporting articles, product comparisons, Finder mapping, status/evidence.

Reusable pattern: `/capabilities/[slug]/` is category-tagged (like use cases), not CRM-only forever.

Index hub `/capabilities/`: **APPROVED** (indexable) — 16 depth hubs live with teaching visuals.

---

## 13. Requirement cluster

| ID | Requirement | Capability | Finder | Status | Route | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| CRM-REQ-000 | Requirements index | — | — | **PARTIAL** | `/requirements/` | P1 |
| CRM-REQ-001 | Support separate sales processes | Pipeline | yes | **EXISTING** (noindex) | `/requirements/separate-sales-processes/` | P0 |
| CRM-REQ-002 | Automate lead follow-up | Automation | yes | **EXISTING** (noindex) | `/requirements/automate-lead-follow-up/` | P0 |
| CRM-REQ-003 | Restrict access by team | Security/Admin | yes | **MISSING** | `/requirements/restrict-access-by-team/` | P0 |
| CRM-REQ-004 | Forecast revenue | Forecasting | yes | **MISSING** | `/requirements/forecast-revenue/` | P1 |
| CRM-REQ-005 | Track client interactions | Relationship | yes | **MISSING** | `/requirements/track-client-interactions/` | P0 |
| CRM-REQ-006 | Customize record fields | Customization | yes | **MISSING** | `/requirements/customize-record-fields/` | P1 |
| CRM-REQ-007 | Support multiple currencies | Admin/Pricing | yes | **MISSING** | `/requirements/support-multiple-currencies/` | P2 |
| CRM-REQ-008 | Integrate with email | Email | yes | **MISSING** | `/requirements/integrate-with-email/` | P0 |
| CRM-REQ-009 | Support SSO | Security | yes | **MISSING** | `/requirements/support-sso/` | P1 |
| CRM-REQ-010 | Audit user activity | Security | yes | **MISSING** | `/requirements/audit-user-activity/` | P1 |

**Publication eligibility:** requirement page indexable only with clear definition, acceptance criteria, feature mappings, and ≥N products with evidence cells — else noindex / draft.

Industry nests for requirements: publish when industry profile + requirement both mature (FS pattern already proves template).

---

## 14. Feature cluster

Canonical feature seeds already include many CRM features (`src/data/seed/features.ts`). **Detail pages** exist only for:

- `/features/multiple-pipelines/` — **EXISTING** (noindex)  
- `/features/workflow-automation/` — **EXISTING** (noindex)

| ID | Feature | Capability | Status | Route | Priority |
| --- | --- | --- | --- | --- | --- |
| CRM-FEAT-000 | Features index | — | **PARTIAL** | `/features/` | P1 |
| CRM-FEAT-001 | Multiple pipelines | Pipeline | **EXISTING** | `/features/multiple-pipelines/` | P0 |
| CRM-FEAT-002 | Workflow automation | Automation | **EXISTING** | `/features/workflow-automation/` | P0 |
| CRM-FEAT-003 | Custom pipeline stages | Pipeline | **MISSING** detail | `/features/custom-pipeline-stages/` | P1 |
| CRM-FEAT-004 | Email sync | Email | **MISSING** detail | `/features/email-sync/` | P0 |
| CRM-FEAT-005 | Lead scoring | Lead | **MISSING** detail | `/features/lead-scoring/` | P1 |
| CRM-FEAT-006 | Custom fields | Customization | **MISSING** detail | `/features/custom-fields/` | P1 |
| CRM-FEAT-007 | Forecasting | Forecasting | **MISSING** detail | `/features/forecasting/` | P1 |
| CRM-FEAT-008 | Reporting dashboards | Reporting | **MISSING** detail | `/features/reporting-dashboards/` | P1 |
| CRM-FEAT-009 | Calling | Engagement | **MISSING** detail | `/features/calling/` | P2 |
| CRM-FEAT-010 | Sequences | Email/Engagement | **MISSING** detail | `/features/email-sequences/` | P1 |
| CRM-FEAT-011 | SSO | Security | **MISSING** detail | `/features/sso/` | P1 |
| CRM-FEAT-012 | Audit logs | Security | **MISSING** detail | `/features/audit-logs/` | P2 |
| CRM-FEAT-013 | Role permissions | Admin | **MISSING** detail | `/features/role-permissions/` | P1 |
| CRM-FEAT-014 | API access | Integrations | **MISSING** detail | `/features/api-access/` | P2 |
| CRM-FEAT-015 | Mobile app | Mobile | **MISSING** detail | `/features/mobile-app/` | P2 |
| CRM-FEAT-016 | AI assistance | AI | **MISSING** detail | `/features/ai-assistance/` | P2 |

**Eligibility:** feature detail pages require evidence across products + clear requirement/capability links; otherwise keep taxonomy-only (seed) without public feature URL.

---

## 15. Implementation cluster

| ID | Title | Type | Status | Proposed route | Priority |
| --- | --- | --- | --- | --- | --- |
| CRM-IMP-000 | CRM Implementation Guide (pillar) | implementation-guide | **MISSING** | `/guides/crm-implementation/` | P0 |
| CRM-IMP-001 | How to Plan CRM Implementation | how-to | **MISSING** | `/guides/crm-implementation-planning/` | P0 |
| CRM-IMP-002 | CRM Implementation Timeline | guide | **MISSING** | `/guides/crm-implementation-timeline/` | P1 |
| CRM-IMP-003 | CRM Implementation Cost | guide | **MISSING** | `/guides/crm-implementation-cost/` | P1 |
| CRM-IMP-004 | CRM Implementation Team / Roles | guide | **MISSING** | `/guides/crm-implementation-roles/` | P1 |
| CRM-IMP-005 | CRM Implementation Mistakes | guide | **MISSING** | `/guides/crm-implementation-mistakes/` | P1 |
| CRM-IMP-006 | CRM Data Migration Guide | migration | **MISSING** | `/guides/crm-data-migration/` | P0 |
| CRM-IMP-007 | How to Clean CRM Data | how-to | **MISSING** | `/guides/crm-data-cleaning/` | P1 |
| CRM-IMP-008 | CRM Field Mapping Guide | how-to | **MISSING** | `/guides/crm-field-mapping/` | P1 |
| CRM-IMP-009 | CRM Testing Guide | how-to | **MISSING** | `/guides/crm-testing/` | P2 |
| CRM-IMP-010 | CRM Go-Live Guide | how-to | **MISSING** | `/guides/crm-go-live/` | P1 |
| CRM-IMP-011 | CRM Training Guide | how-to | **MISSING** | `/guides/crm-training/` | P1 |
| CRM-IMP-012 | CRM Adoption Guide | guide | **MISSING** | `/guides/crm-adoption/` | P0 |
| CRM-IMP-013 | CRM Governance Guide | guide | **MISSING** | `/guides/crm-governance/` | P2 |
| CRM-IMP-014 | CRM Data Quality Guide | guide | **MISSING** | `/guides/crm-data-quality/` | P1 |
| CRM-IMP-015 | CRM Change Management | guide | **MISSING** | `/guides/crm-change-management/` | P2 |
| CRM-IMP-016 | CRM Implementation KPIs | guide | **MISSING** | `/guides/crm-implementation-kpis/` | P2 |

Resources: Implementation Checklist, Project Plan, Migration Checklist, Field Mapping Template, Test Plan, Training Plan, Go-Live Checklist — **MISSING** (§17).

---

## 16. Optimization / post-purchase cluster

| ID | Title | Status | Proposed route | Priority |
| --- | --- | --- | --- | --- |
| CRM-OPT-001 | How to Improve CRM Adoption | **MISSING** | `/guides/improve-crm-adoption/` | P0 |
| CRM-OPT-002 | CRM Data Hygiene | **MISSING** | `/guides/crm-data-hygiene/` | P1 |
| CRM-OPT-003 | CRM Reporting Best Practices | **MISSING** | `/guides/crm-reporting-best-practices/` | P1 |
| CRM-OPT-004 | CRM Automation Best Practices | **MISSING** | `/guides/crm-automation-best-practices/` | P1 |
| CRM-OPT-005 | CRM Governance (ops) | **MISSING** | `/guides/crm-governance-operations/` | P2 |
| CRM-OPT-006 | CRM Audit Guide | **MISSING** | `/guides/crm-audit/` | P1 |
| CRM-OPT-007 | CRM Health Check | **MISSING** | `/guides/crm-health-check/` | P1 |
| CRM-OPT-008 | CRM Optimization Checklist | **MISSING** (resource) | `/resources/crm-optimization-checklist/` | P1 |
| CRM-OPT-009 | When to Replace Your CRM | **MISSING** | `/guides/when-to-replace-crm/` | P1 |
| CRM-OPT-010 | CRM Migration to Another Vendor | **MISSING** | `/guides/crm-vendor-migration/` | P1 |
| CRM-OPT-011 | CRM Cleanup Checklist | **MISSING** (resource) | `/resources/crm-cleanup-checklist/` | P2 |

Primary CTAs: product hubs (current vendor), compare (replacement), Finder (re-evaluate).

---

## 17. Resources taxonomy

### Resource types

| Type | Purpose | Typical format | Downloadable? | Interactive? |
| --- | --- | --- | --- | --- |
| checklist | Completeness / process control | Markdown/PDF/web | preferred | optional |
| template | Fill-in artifact | Doc/sheet | yes | no |
| worksheet | Structured comparison/work | Sheet/web | yes | optional |
| scorecard | Weighted evaluation | Sheet/web | yes | yes preferred |
| calculator | Numeric estimate | Tool page | no | yes |
| planner | Multi-step plan | Doc/web | yes | optional |
| download | Generic file asset | File | yes | no |
| interactive assessment | Guided Q&A | App | no | yes |

**Note:** Inventory has **no** `Resource` domain schema and **no** `/resources/` route — resource layer is **MISSING** / **NOT-YET-IMPLEMENTED** as a first-class surface. Until then, resources may ship as guide appendices (**PARTIAL workaround**, not the target).

### Initial CRM resources

| ID | Resource | Audience | Pillar | Format | DL | Interactive | Data required | CTA | Status | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM-RES-001 | CRM Evaluation Checklist | buyers | Choose | checklist | yes | no | none | Finder | **MISSING** | P0 |
| CRM-RES-002 | CRM Requirements Template | buyers | Choose | template | yes | no | none | Requirements guide | **MISSING** | P0 |
| CRM-RES-003 | CRM Vendor Scorecard | buyers | Choose | scorecard | yes | yes | product shortlist | Compare | **MISSING** | P0 |
| CRM-RES-004 | CRM RFP Template | mid-market+ | Choose | template | yes | no | requirements | Vendor eval | **MISSING** | P2 |
| CRM-RES-005 | CRM Demo Checklist | buyers | Choose | checklist | yes | no | shortlist | Demo guide | **MISSING** | P1 |
| CRM-RES-006 | CRM Implementation Checklist | implementers | Implement | checklist | yes | no | vendor chosen | Implementation guide | **MISSING** | P0 |
| CRM-RES-007 | CRM Migration Checklist | implementers | Implement | checklist | yes | no | source system | Migration guide | **MISSING** | P0 |
| CRM-RES-008 | CRM Go-Live Checklist | implementers | Implement | checklist | yes | no | test plan | Go-live guide | **MISSING** | P1 |
| CRM-RES-009 | CRM Training Plan | admins | Implement | planner | yes | no | roles | Training guide | **MISSING** | P1 |
| CRM-RES-010 | CRM Data Migration Template | admins | Implement | template | yes | no | schema | Migration guide | **MISSING** | P1 |
| CRM-RES-011 | CRM Field Mapping Template | admins | Implement | template | yes | no | fields | Field mapping guide | **MISSING** | P1 |
| CRM-RES-012 | CRM Security Checklist | security/IT | Choose/Implement | checklist | yes | no | none | Security capability | **MISSING** | P1 |
| CRM-RES-013 | CRM Comparison Worksheet | buyers | Compare | worksheet | yes | yes | shortlist | Compare | **MISSING** | P0 |
| CRM-RES-014 | CRM Business Case Template | sponsors | Choose | template | yes | no | costs | ROI guide / Calculator | **MISSING** | P2 |
| CRM-RES-015 | CRM Optimization Checklist | operators | Optimize | checklist | yes | no | live CRM | Health check | **MISSING** | P1 |
| CRM-RES-016 | CRM Cleanup Checklist | operators | Optimize | checklist | yes | no | live CRM | Data hygiene | **MISSING** | P2 |

Proposed resource routes: `/resources/{slug}/` (**NOT-YET-IMPLEMENTED** template).

---

## 18. Article content types (formal taxonomy)

| Type | Purpose | Typical structure | Depth | Primary CTA | Internal links | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| definition | Define term/category | answer → scope → non-goals | medium | Learn next / Choose | upward to hub | light citations |
| explainer | Mechanism understanding | concept → how → examples | medium | related guides | hub, use cases | light |
| guide | Broad topic coverage | TOC → sections → next steps | high | pillar CTA | anchors | moderate |
| how-to | Procedural steps | steps → pitfalls → checklist | medium-high | checklist/tool | resources | process evidence |
| decision-guide | Choice framing | criteria → tradeoffs → next | high | Finder/Best | Best, compare | methodology aware |
| product-guide | Product-scoped education | context → steps → product CTA | medium | product hub/`/go/` | review, pricing | product facts |
| industry-guide | Vertical education | industry needs → CRM mapping | high | industry hub / Finder | industry hub | industry research |
| use-case-guide | Job education | scenario → requirements → products | medium-high | use-case page | UC, features | fit evidence |
| implementation-guide | Delivery | plan → roles → risks | high | checklists | resources | operational |
| feature-guide | Feature education | what/why/how → products | medium | feature page | capability/req | feature evidence |
| requirement-guide | Need articulation | need → criteria → features | medium | requirement page | Finder | criteria clarity |
| checklist | Completeness | list + usage notes | low-medium | related guide | parent pillar | none/light |
| template | Fill-in artifact | instructions + fields | low-medium | related guide | pillar | none |
| worksheet | Working artifact | tables/scores | medium | compare/Finder | compare | none |
| scorecard | Weighted decision | criteria + weights | medium | compare | Best/compare | methodology |
| research | Structured entity research | model-driven sections | high | product/compare | graph links | **required** |
| benchmark | Aggregate patterns | method → findings | high | Best | methodology | strong |
| FAQ | Objections | Q&A | low-medium | parent page | parent | light |
| case-study | Narrative proof | context → approach → outcome | medium | product/hub | products | sourced |
| news/update | Change log | what changed | low | entity | entity | dated sources |

---

## 19–20. Status & priority rules (operating)

- **P0:** Journey-blocking or commercial anchors (hub, Best, Finder, Calculator, core Learn/Choose, core UC/capabilities/requirements, implementation pillar).  
- **P1:** Strong supporting depth that improves conversion quality and trust.  
- **P2:** Expansion after P0/P1 density.  
- **P3:** Long-tail / OPTIONAL after research demand.  

Never mark OPTIONAL items P0. Do not mark MISSING as EXISTING.

---

## 21. Master content inventory table

> Counts at end of document. Product-scoped long-tail guides are represented as **templates** + flagship examples, not 22×N forced rows. Comparison pairs already live as entities; contextual variants are OPTIONAL rows.

| ID | Domain | Cluster | Page/content type | Proposed title | Current route | Proposed route | Status | Priority | Primary parent | Supports pillar | Primary intent | Primary CTA | Tool integration | Resource integration | Evidence requirement | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM-L0-001 | CRM | Entry | home | SoftwareGlimpse Home | `/` | `/` | EXISTING | P0 | — | Entry | Orient | CRM Finder | soft | — | light | CRM-leaning |
| CRM-L1-001 | CRM | Domain | category-hub | CRM Software | `/categories/crm/` | `/categories/crm/` | EXISTING | P0 | Home | Domain | Orient+route | Finder/Best/Calc | yes | — | medium | Canonical L1 |
| CRM-L1-002 | CRM | Domain | redirect | CRM alias | — | `/crm/` | OPTIONAL | P3 | Domain hub | Domain | Alias | — | — | — | none | Redirect only |
| CRM-LRN-001 | CRM | Learn | definition | What is CRM? | `/guides/what-is-crm/` | same | EXISTING | P0 | Domain hub | Learn | Educate | How to choose | soft | glossary | light | noindex today |
| CRM-LRN-002 | CRM | Learn | explainer | How CRM works | — | `/guides/how-crm-works/` | EXISTING | P0 | Domain hub | Learn | Educate | Do I need | — | — | light | |
| CRM-LRN-003 | CRM | Learn | explainer | Types of CRM | — | `/guides/types-of-crm/` | EXISTING | P1 | Domain hub | Learn | Educate | Best | Finder | — | light | |
| CRM-LRN-004 | CRM | Learn | explainer | CRM benefits | — | `/guides/crm-benefits/` | EXISTING | P1 | Domain hub | Learn | Motivate | Finder | Finder | — | light | |
| CRM-LRN-005 | CRM | Learn | glossary | CRM glossary | — | `/guides/crm-glossary/` | EXISTING | P1 | Domain hub | Learn | Vocabulary | Requirements | — | — | light | |
| CRM-LRN-006 | CRM | Learn | explainer | CRM examples | — | `/guides/crm-examples/` | EXISTING | P2 | Domain hub | Learn | Educate | Use cases | — | — | light | |
| CRM-LRN-007 | CRM | Learn | decision-guide | CRM vs spreadsheet | `/guides/crm-vs-spreadsheet/` | same | EXISTING | P0 | Domain hub | Learn | Boundary | Do I need | — | — | light | soft noindex |
| CRM-LRN-008 | CRM | Learn | comparison-education | CRM vs ERP | `/guides/crm-vs-erp/` | same | EXISTING | P1 | Domain hub | Learn | Boundary | Hub | — | — | light | soft noindex |
| CRM-LRN-009 | CRM | Learn | comparison-education | CRM vs marketing automation | `/guides/crm-vs-marketing-automation/` | same | EXISTING | P1 | Domain hub | Learn | Boundary | Hub | — | — | light | soft noindex |
| CRM-LRN-010 | CRM | Learn | comparison-education | CRM vs customer service software | `/guides/crm-vs-customer-service-software/` | same | EXISTING | P2 | Domain hub | Learn | Boundary | Hub | — | — | light | soft noindex |
| CRM-LRN-011 | CRM | Learn | comparison-education | CRM vs CDP | `/guides/crm-vs-cdp/` | same | EXISTING | P3 | Domain hub | Learn | Boundary | Hub | — | — | light | soft noindex |
| CRM-LRN-012 | CRM | Learn | decision-guide | Do I need a CRM? | `/guides/do-i-need-a-crm/` | same | EXISTING | P0 | Domain hub | Learn→Choose | Qualify | Finder | Finder | — | light | soft noindex |
| CRM-LRN-013 | CRM | Learn | decision-guide | When to adopt CRM | `/guides/when-to-adopt-crm/` | same | EXISTING | P1 | Domain hub | Learn→Choose | Timing | How to choose | — | — | light | soft noindex |
| CRM-LRN-014 | CRM | Learn | guide | Common CRM mistakes | `/guides/common-crm-mistakes/` | same | EXISTING | P1 | Domain hub | Learn→Choose | Risk | Checklist | — | RES-001 | light | soft noindex |
| CRM-BUY-001 | CRM | Choose | best-detail | Best CRM Software | `/best/crm-software/` | same | EXISTING-BUT-THIN | P0 | Domain hub | Choose | Decide | Finder | Finder/Calc | scorecard | **high** | research in-progress; noindex |
| CRM-BUY-002 | CRM | Choose | decision-guide | How to Choose CRM | `/guides/how-to-choose-crm/` | same | EXISTING | P0 | Domain hub | Choose | Decide | Finder | Finder | RES-001 | medium | noindex |
| CRM-BUY-003 | CRM | Choose | guide | CRM Requirements Guide | `/guides/crm-requirements-guide/` | same | EXISTING | P0 | Domain hub | Choose | Specify | Requirements | Finder | RES-002 | medium | soft noindex |
| CRM-BUY-004 | CRM | Choose | decision-guide | CRM Evaluation Guide | `/guides/crm-evaluation-guide/` | same | EXISTING | P0 | Best | Choose | Evaluate | Scorecard | Finder | RES-003 | medium | soft noindex |
| CRM-BUY-005 | CRM | Choose | how-to | CRM Selection Process | `/guides/crm-selection-process/` | same | EXISTING | P1 | How to choose | Choose | Process | Finder | — | RES-001 | light | soft noindex |
| CRM-BUY-006 | CRM | Choose | decision-guide | CRM Vendor Evaluation | `/guides/crm-vendor-evaluation/` | same | EXISTING | P1 | Evaluation | Choose | Vendor fit | Compare | — | RES-003 | medium | soft noindex |
| CRM-BUY-007 | CRM | Choose | guide | CRM RFP Guide | — | `/guides/crm-rfp-guide/` | MISSING | P2 | Vendor eval | Choose | Formal buy | RFP template | — | RES-004 | light | |
| CRM-BUY-008 | CRM | Choose | how-to | CRM Demo Guide | — | `/guides/crm-demo-guide/` | MISSING | P1 | Evaluation | Choose | Demo | Demo checklist | — | RES-005 | light | |
| CRM-BUY-009 | CRM | Choose | how-to | CRM Trial Evaluation | — | `/guides/crm-trial-evaluation/` | MISSING | P1 | Evaluation | Choose | Trial | Scorecard | — | RES-003 | light | |
| CRM-BUY-010 | CRM | Choose | pricing-education | CRM Pricing Guide | — | `/guides/crm-pricing-guide/` | MISSING | P0 | Pricing hub | Pricing | Cost literacy | Calculator | Calculator | — | medium | |
| CRM-BUY-011 | CRM | Choose | pricing-education | CRM Total Cost Guide | — | `/guides/crm-total-cost-guide/` | MISSING | P1 | Pricing guide | Pricing | TCO | Calculator | TCO tool | RES-014 | medium | |
| CRM-BUY-012 | CRM | Choose | guide | CRM ROI Guide | — | `/guides/crm-roi-guide/` | MISSING | P2 | Business case | Choose | Justify | ROI tool | ROI tool | RES-014 | medium | |
| CRM-BUY-013 | CRM | Choose | guide | CRM Business Case | — | `/guides/crm-business-case/` | MISSING | P2 | ROI | Choose | Justify | Calculator | — | RES-014 | light | |
| CRM-BUY-014 | CRM | Choose | guide | CRM Vendor Questions | — | `/guides/crm-vendor-questions/` | MISSING | P1 | Vendor eval | Choose | Diligence | Demo | — | RES-005 | light | |
| CRM-BUY-015 | CRM | Choose | guide | CRM Selection Mistakes | — | `/guides/crm-selection-mistakes/` | MISSING | P1 | How to choose | Choose | Risk | Checklist | — | RES-001 | light | |
| CRM-TOOL-001 | CRM | Tools | finder | CRM Finder | `/tools/crm-finder/` | same | EXISTING | P0 | Tools hub | Choose | Shortlist | Product CTAs | self | — | fit model | |
| CRM-TOOL-002 | CRM | Tools | calculator | CRM Cost Calculator | `/tools/crm-cost-calculator/` | same | EXISTING | P0 | Tools hub | Pricing | Estimate | Pricing pages | self | — | pricing verified | |
| CRM-TOOL-003 | CRM | Tools | stack-builder | Software Stack Builder | `/tools/software-stack-builder/` | same | PARTIAL | P1 | Tools hub | Choose | Stack | Finder | soft | — | CRM-first | |
| CRM-TOOL-004 | CRM | Tools | calculator | CRM ROI Calculator | — | `/tools/crm-roi-calculator/` | NOT-YET-IMPLEMENTED | P2 | Tools hub | Choose | Justify | Business case | self | RES-014 | model | |
| CRM-TOOL-005 | CRM | Tools | calculator | CRM TCO Calculator | — | `/tools/crm-tco-calculator/` | NOT-YET-IMPLEMENTED | P2 | Tools hub | Pricing | TCO | Pricing guide | self | — | model | |
| CRM-TOOL-006 | CRM | Tools | tools-landing | Tools hub | `/tools/` | same | EXISTING | P0 | Home | Tools | Discover tools | CRM tools | — | — | — | |
| CRM-PRICE-000 | CRM | Pricing | pricing-landing | CRM Pricing index | `/pricing/` | same | EXISTING | P0 | Domain hub | Pricing | Browse costs | Calculator | Calculator | — | CRM-only today |
| CRM-PRD-T001 | CRM | Products | software-review | [Product] Review hub | `/software/[slug]/` | same | EXISTING | P0 | Domain hub | Products | Research | Visit/compare | — | — | **high** | Template |
| CRM-PRD-T002 | CRM | Products | product-pricing | [Product] Pricing | `/pricing/[slug]/` | same | EXISTING | P0 | Product hub | Pricing | Cost | Calculator | Calculator | — | verified | CRM snapshots |
| CRM-PRD-T003 | CRM | Products | software-review-tab | [Product] Features tab | `/software/[slug]/features/` | same | EXISTING | P0 | Product hub | Products | Features | Review CTA | — | — | high | Prefer tab |
| CRM-PRD-T004 | CRM | Products | section | [Product] Pros & Cons | (review section) | same | EXISTING | P0 | Product hub | Products | Verdict | Compare | — | — | medium | Section |
| CRM-PRD-T005 | CRM | Products | alternatives-detail | [Product] Alternatives | `/alternatives/[slug]/` | same | PARTIAL | P1 | Product hub | Products | Switch | Compare | — | worksheet | high | Few instances |
| CRM-PRD-T006 | CRM | Products | section/guide | [Product] Integrations | tab/section | guide OPTIONAL | PARTIAL | P2 | Product hub | Products | Integrate | Review | — | — | medium | |
| CRM-PRD-T007 | CRM | Products | section/guide | [Product] Security | section | guide OPTIONAL | PARTIAL | P2 | Product hub | Products | Trust | Review | — | RES-012 | high | |
| CRM-PRD-T008 | CRM | Products | product-guide | [Product] Implementation | — | `/guides/{product}-implementation/` | MISSING | P1 | Implementation pillar | Implement | Rollout | Checklist | — | RES-006 | medium | Eligibility |
| CRM-PRD-T009 | CRM | Products | product-guide | [Product] Migration | — | `/guides/{product}-migration/` | MISSING | P2 | Migration pillar | Implement | Move data | Migration checklist | — | RES-007 | medium | |
| CRM-PRD-T010 | CRM | Products | product-guide | [Product] Setup | — | `/guides/{product}-setup/` | MISSING | P2 | Implementation | Implement | Configure | Setup checklist | — | — | medium | |
| CRM-PRD-T011 | CRM | Products | product-guide | [Product] Plan / Free vs Paid | — | `/guides/{product}-plans/` | MISSING | P1 | Pricing | Pricing | Plan choice | Pricing page | Calculator | — | pricing facts | |
| CRM-PRD-T012 | CRM | Products | product-guide | [Product] Worth It? | — | `/guides/is-{product}-worth-it/` | OPTIONAL | P3 | Review | Products | Justification | Review | — | — | medium | Avoid thin dupes |
| CRM-PRD-EX-HS | CRM | Products | software-review | HubSpot CRM Review | `/software/hubspot/` | same | EXISTING | P0 | Domain hub | Products | Research | Visit | — | — | high | Flagship |
| CRM-PRD-EX-SF | CRM | Products | software-review | Salesforce Review | `/software/salesforce/` | same | EXISTING | P0 | Domain hub | Products | Research | Visit | — | — | high | Flagship |
| CRM-PRD-EX-PD | CRM | Products | software-review | Pipedrive Review | `/software/pipedrive/` | same | EXISTING | P0 | Domain hub | Products | Research | Visit | — | — | high | Flagship |
| CRM-PRD-EX-PD-ALT | CRM | Products | alternatives-detail | Pipedrive Alternatives | `/alternatives/pipedrive/` | same | EXISTING-BUT-THIN | P1 | Pipedrive hub | Products | Switch | Compare | Finder | — | high | noindex |
| CRM-CMP-000 | CRM | Compare | comparison-landing | Comparisons hub | `/compare/` | same | EXISTING | P0 | Domain hub | Compare | Discover | Builder | — | RES-013 | — | |
| CRM-CMP-001 | CRM | Compare | comparison-detail | Head-to-head template | `/compare/[slug]/` | same | EXISTING | P0 | Compare hub | Compare | Decide | Product CTAs | — | RES-013 | **high** | ~231 live |
| CRM-CMP-002 | CRM | Compare | comparison-builder | Compare builder | `/compare/build/` | same | PARTIAL | P1 | Compare hub | Compare | Ad-hoc | Published compare | — | — | medium | noindex |
| CRM-CMP-003 | CRM | Compare | tool | Multi-product compare | — | TBD | NOT-YET-IMPLEMENTED | P2 | Compare hub | Compare | Multi | — | — | RES-013 | high | |
| CRM-CMP-CTX-001 | CRM | Compare | guide | Contextual compare articles | — | `/guides/{a}-vs-{b}-for-{context}/` | OPTIONAL | P3 | Base compare | Compare | Niche decide | Base compare | — | — | high | Eligibility §8 |
| CRM-AUD-000 | CRM | Business Type | audience-landing | For index | `/for/` | same | PARTIAL | P1 | Domain hub | Business Type | Discover | — | — | — | — | PLACEHOLDER |
| CRM-AUD-001 | CRM | Business Type | audience-detail | CRM for Small Business | — | `/for/small-business/` | MISSING | P0 | `/for/` | Business Type | Fit | Finder | Finder | RES-001 | medium | |
| CRM-AUD-002 | CRM | Business Type | audience-detail | CRM for Startups | — | `/for/startups/` | MISSING | P1 | `/for/` | Business Type | Fit | Finder | Finder | — | medium | |
| CRM-AUD-003 | CRM | Business Type | audience-detail | CRM for Enterprise | — | `/for/enterprise/` | MISSING | P1 | `/for/` | Business Type | Fit | Best | — | RES-003 | medium | audience seed gap |
| CRM-AUD-004 | CRM | Business Type | audience-detail | CRM for Freelancers | — | `/for/freelancers/` | OPTIONAL | P3 | `/for/` | Business Type | Fit | Finder | — | — | light | |
| CRM-AUD-005 | CRM | Business Type | audience-detail | CRM for Agencies | — | `/for/agencies/` | MISSING | P1 | `/for/` | Business Type | Fit | Finder | Finder | — | medium | |
| CRM-AUD-006 | CRM | Business Type | audience-detail | CRM for Nonprofits | — | `/for/nonprofits/` | MISSING | P2 | `/for/` | Business Type | Fit | Finder | — | — | medium | |
| CRM-AUD-007 | CRM | Business Type | audience-detail | CRM for Growing Teams | — | `/for/growing-teams/` | OPTIONAL | P2 | `/for/` | Business Type | Fit | Finder | — | — | light | |
| CRM-AUD-008 | CRM | Business Type | audience-detail | CRM for Remote Sales Teams | — | `/for/sales-teams/` | MISSING | P1 | `/for/` | Business Type | Fit | Finder | Finder | — | medium | seed exists |
| CRM-IND-000 | CRM | Industries | industry-landing | Industries index | `/industries/` | same | EXISTING-BUT-THIN | P0 | Domain hub | Industries | Discover | Best/Finder | Finder | — | — | noindex |
| CRM-IND-FS | CRM | Industries | industry-detail | CRM for Financial Services | `/industries/financial-services/` | same | EXISTING-BUT-THIN | P0 | Industries index | Industries | Vertical | Finder | Finder | — | high when ranked | profile exists |
| CRM-IND-SAAS | CRM | Industries | industry-detail | CRM for SaaS | `/industries/saas/` | same | EXISTING-BUT-THIN | P0 | Industries index | Industries | Vertical | Finder | Finder | — | NOT-YET-RESEARCHED depth | |
| CRM-IND-SMB | CRM | Industries | industry-detail | CRM for Small Business (industry) | `/industries/small-business/` | same | EXISTING-BUT-THIN | P0 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | overlaps /for/ |
| CRM-IND-RE | CRM | Industries | industry-detail | CRM for Real Estate | `/industries/real-estate/` | same | EXISTING-BUT-THIN | P1 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-HC | CRM | Industries | industry-detail | CRM for Healthcare | `/industries/healthcare/` | same | EXISTING-BUT-THIN | P1 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-RET | CRM | Industries | industry-detail | CRM for Retail | `/industries/retail-ecommerce/` | same | EXISTING-BUT-THIN | P1 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-LEG | CRM | Industries | industry-detail | CRM for Legal | `/industries/legal-services/` | same | EXISTING-BUT-THIN | P1 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-MFG | CRM | Industries | industry-detail | CRM for Manufacturing | `/industries/manufacturing/` | same | EXISTING-BUT-THIN | P2 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-EDU | CRM | Industries | industry-detail | CRM for Education | `/industries/education/` | same | EXISTING-BUT-THIN | P2 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-NP | CRM | Industries | industry-detail | CRM for Nonprofit | `/industries/nonprofit/` | same | EXISTING-BUT-THIN | P2 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-HOSP | CRM | Industries | industry-detail | CRM for Hospitality | `/industries/hospitality/` | same | EXISTING-BUT-THIN | P2 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-CON | CRM | Industries | industry-detail | CRM for Construction | `/industries/construction/` | same | EXISTING-BUT-THIN | P2 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-LOG | CRM | Industries | industry-detail | CRM for Logistics | `/industries/transportation-logistics/` | same | EXISTING-BUT-THIN | P2 | Industries index | Industries | Vertical | Finder | — | — | NOT-YET-RESEARCHED | |
| CRM-IND-L3-FS | CRM | Industries | industry-guide | FS supporting guide pack | `/guides/financial-services-crm/` | `/guides/financial-services-crm-*` | LIVE | P1 | FS hub | Industries | Educate | FS hub | Finder | checklists | medium | 7 approved indexable articles |
| CRM-IND-NEST | CRM | Industries | capability/uc/feature/req nests | Industry nested entities | FS nests live | same pattern | PARTIAL | P1 | Industry hub | Industries | Deepen | Finder | — | — | high | Expand per research |
| CRM-UC-000 | CRM | Use Cases | use-case-landing | Use cases index | `/use-cases/` | same | APPROVED | P0 | Domain hub | Use Cases | Discover | Finder | Finder | — | — | indexable |
| CRM-UC-001 | CRM | Use Cases | use-case-detail | Pipeline Management | `/use-cases/pipeline-management/` | same | APPROVED | P0 | UC index | Use Cases | Job | Finder | Finder | — | medium | indexable |
| CRM-UC-002 | CRM | Use Cases | use-case-detail | Lead Management | `/use-cases/lead-management/` | same | APPROVED | P0 | UC index | Use Cases | Job | Finder | Finder | — | medium | indexable |
| CRM-UC-003 | CRM | Use Cases | use-case-detail | Contact Management | `/use-cases/contact-management/` | same | APPROVED | P0 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-004 | CRM | Use Cases | use-case-detail | Sales Automation | `/use-cases/sales-automation/` | same | APPROVED | P0 | UC index | Use Cases | Job | Finder | Finder | — | medium | indexable |
| CRM-UC-005 | CRM | Use Cases | use-case-detail | Email Outreach | `/use-cases/email-outreach/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-006 | CRM | Use Cases | use-case-detail | Prospecting | `/use-cases/prospecting/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-007 | CRM | Use Cases | use-case-detail | Relationship Management | `/use-cases/relationship-management/` | same | APPROVED | P0 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-008 | CRM | Use Cases | use-case-detail | Sales Engagement | `/use-cases/sales-engagement/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-009 | CRM | Use Cases | use-case-detail | Reporting | `/use-cases/reporting/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-010 | CRM | Use Cases | use-case-detail | Account Management | `/use-cases/account-management/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | Finder | — | medium | indexable |
| CRM-UC-011 | CRM | Use Cases | use-case-detail | Outbound Sales | `/use-cases/outbound-sales/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-012 | CRM | Use Cases | use-case-detail | Inbound Sales | `/use-cases/inbound-sales/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-013 | CRM | Use Cases | use-case-detail | Field Sales | `/use-cases/field-sales/` | same | APPROVED | P2 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-014 | CRM | Use Cases | use-case-detail | High-volume Lead Management | `/use-cases/high-volume-lead-management/` | same | APPROVED | P2 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-015 | CRM | Use Cases | use-case-detail | Complex Sales Processes | `/use-cases/complex-sales-processes/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable; FS nest also exists |
| CRM-UC-016 | CRM | Use Cases | use-case-detail | Customer Follow-up | `/use-cases/customer-follow-up/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-UC-017 | CRM | Use Cases | use-case-detail | Sales Forecasting | `/use-cases/sales-forecasting/` | same | APPROVED | P1 | UC index | Use Cases | Job | Finder | — | — | medium | indexable |
| CRM-CAP-000 | CRM | Capabilities | capability-landing | Capabilities index | `/capabilities/ | `/capabilities/` | APPROVED | P1 | Domain hub | Capabilities | Discover | Finder | Finder | — | — | indexable |
| CRM-CAP-001 | CRM | Capabilities | capability-detail | Contact Management | `/capabilities/ | `/capabilities/contact-management/` | APPROVED | P0 | CAP index | Capabilities | Define | UC/Req | Finder | — | medium | indexable |
| CRM-CAP-002 | CRM | Capabilities | capability-detail | Relationship Management | `/capabilities/ | `/capabilities/relationship-management/` | APPROVED | P0 | CAP index | Capabilities | Define | UC/Req | Finder | — | medium | indexable |
| CRM-CAP-003 | CRM | Capabilities | capability-detail | Lead Management | `/capabilities/ | `/capabilities/lead-management/` | APPROVED | P0 | CAP index | Capabilities | Define | UC/Req | Finder | — | medium | indexable |
| CRM-CAP-004 | CRM | Capabilities | capability-detail | Pipeline Management | industry nest only | `/capabilities/pipeline-management/` | APPROVED | P0 | CAP index | Capabilities | Define | UC/Req | Finder | — | medium | indexable |
| CRM-CAP-005 | CRM | Capabilities | capability-detail | Deal Management | `/capabilities/ | `/capabilities/deal-management/` | APPROVED | P0 | CAP index | Capabilities | Define | UC/Req | Finder | — | medium | indexable |
| CRM-CAP-006 | CRM | Capabilities | capability-detail | Workflow Automation | industry nest only | `/capabilities/workflow-automation/` | APPROVED | P0 | CAP index | Capabilities | Define | UC/Req | Finder | — | medium | indexable |
| CRM-CAP-007 | CRM | Capabilities | capability-detail | Email Capabilities | `/capabilities/ | `/capabilities/email/` | APPROVED | P1 | CAP index | Capabilities | Define | Features | — | — | medium | indexable |
| CRM-CAP-008 | CRM | Capabilities | capability-detail | Calling / Sales Engagement | `/capabilities/ | `/capabilities/sales-engagement/` | APPROVED | P1 | CAP index | Capabilities | Define | Features | — | — | medium | indexable |
| CRM-CAP-009 | CRM | Capabilities | capability-detail | Reporting | `/capabilities/ | `/capabilities/reporting/` | APPROVED | P0 | CAP index | Capabilities | Define | Features | — | — | medium | indexable |
| CRM-CAP-010 | CRM | Capabilities | capability-detail | Forecasting | `/capabilities/ | `/capabilities/forecasting/` | APPROVED | P1 | CAP index | Capabilities | Define | Req | — | — | medium | indexable |
| CRM-CAP-011 | CRM | Capabilities | capability-detail | Customization | `/capabilities/ | `/capabilities/customization/` | APPROVED | P1 | CAP index | Capabilities | Define | Req | — | — | medium | indexable |
| CRM-CAP-012 | CRM | Capabilities | capability-detail | Integrations | `/capabilities/ | `/capabilities/integrations/` | APPROVED | P1 | CAP index | Capabilities | Define | Features | — | — | medium | indexable |
| CRM-CAP-013 | CRM | Capabilities | capability-detail | Administration | `/capabilities/ | `/capabilities/administration/` | APPROVED | P1 | CAP index | Capabilities | Define | Req | — | — | medium | indexable |
| CRM-CAP-014 | CRM | Capabilities | capability-detail | Security | `/capabilities/ | `/capabilities/security/` | APPROVED | P1 | CAP index | Capabilities | Define | Req | — | RES-012 | high | indexable |
| CRM-CAP-015 | CRM | Capabilities | capability-detail | Mobile | `/capabilities/ | `/capabilities/mobile/` | APPROVED | P2 | CAP index | Capabilities | Define | Features | — | — | medium | indexable |
| CRM-CAP-016 | CRM | Capabilities | capability-detail | AI Assistance | `/capabilities/ | `/capabilities/ai-assistance/` | APPROVED | P2 | CAP index | Capabilities | Define | Features | — | — | medium | indexable |
| CRM-REQ-000 | CRM | Requirements | requirement-landing | Requirements index | `/requirements/` | same | PARTIAL | P1 | Domain hub | Requirements | Discover | Finder | Finder | RES-002 | — | |
| CRM-REQ-001 | CRM | Requirements | requirement-detail | Separate sales processes | `/requirements/separate-sales-processes/` | same | EXISTING | P0 | REQ index | Requirements | Specify | Finder | Finder | — | medium | noindex |
| CRM-REQ-002 | CRM | Requirements | requirement-detail | Automate lead follow-up | `/requirements/automate-lead-follow-up/` | same | EXISTING | P0 | REQ index | Requirements | Specify | Finder | Finder | — | medium | noindex |
| CRM-REQ-003 | CRM | Requirements | requirement-detail | Restrict access by team | — | `/requirements/restrict-access-by-team/` | MISSING | P0 | REQ index | Requirements | Specify | Finder | Finder | — | medium | |
| CRM-REQ-004 | CRM | Requirements | requirement-detail | Forecast revenue | — | `/requirements/forecast-revenue/` | MISSING | P1 | REQ index | Requirements | Specify | Finder | — | — | medium | |
| CRM-REQ-005 | CRM | Requirements | requirement-detail | Track client interactions | — | `/requirements/track-client-interactions/` | MISSING | P0 | REQ index | Requirements | Specify | Finder | — | — | medium | |
| CRM-REQ-006 | CRM | Requirements | requirement-detail | Customize record fields | — | `/requirements/customize-record-fields/` | MISSING | P1 | REQ index | Requirements | Specify | Finder | — | — | medium | |
| CRM-REQ-007 | CRM | Requirements | requirement-detail | Support multiple currencies | — | `/requirements/support-multiple-currencies/` | MISSING | P2 | REQ index | Requirements | Specify | Finder | — | — | medium | |
| CRM-REQ-008 | CRM | Requirements | requirement-detail | Integrate with email | — | `/requirements/integrate-with-email/` | MISSING | P0 | REQ index | Requirements | Specify | Finder | Finder | — | medium | |
| CRM-REQ-009 | CRM | Requirements | requirement-detail | Support SSO | — | `/requirements/support-sso/` | MISSING | P1 | REQ index | Requirements | Specify | Finder | — | RES-012 | medium | |
| CRM-REQ-010 | CRM | Requirements | requirement-detail | Audit user activity | — | `/requirements/audit-user-activity/` | MISSING | P1 | REQ index | Requirements | Specify | Finder | — | RES-012 | medium | |
| CRM-FEAT-000 | CRM | Features | feature-landing | Features index | `/features/` | same | PARTIAL | P1 | Domain hub | Features | Discover | Products | — | — | — | |
| CRM-FEAT-001 | CRM | Features | feature-detail | Multiple pipelines | `/features/multiple-pipelines/` | same | EXISTING | P0 | FEAT index | Features | Explain | Products | — | — | high | noindex |
| CRM-FEAT-002 | CRM | Features | feature-detail | Workflow automation | `/features/workflow-automation/` | same | EXISTING | P0 | FEAT index | Features | Explain | Products | — | — | high | noindex |
| CRM-FEAT-003 | CRM | Features | feature-detail | Custom pipeline stages | — | `/features/custom-pipeline-stages/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-004 | CRM | Features | feature-detail | Email sync | — | `/features/email-sync/` | MISSING | P0 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-005 | CRM | Features | feature-detail | Lead scoring | — | `/features/lead-scoring/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-006 | CRM | Features | feature-detail | Custom fields | — | `/features/custom-fields/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-007 | CRM | Features | feature-detail | Forecasting | — | `/features/forecasting/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-008 | CRM | Features | feature-detail | Reporting dashboards | — | `/features/reporting-dashboards/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-009 | CRM | Features | feature-detail | Calling | — | `/features/calling/` | MISSING | P2 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-010 | CRM | Features | feature-detail | Sequences | — | `/features/email-sequences/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-011 | CRM | Features | feature-detail | SSO | — | `/features/sso/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-012 | CRM | Features | feature-detail | Audit logs | — | `/features/audit-logs/` | MISSING | P2 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-013 | CRM | Features | feature-detail | Role permissions | — | `/features/role-permissions/` | MISSING | P1 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-014 | CRM | Features | feature-detail | API access | — | `/features/api-access/` | MISSING | P2 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-015 | CRM | Features | feature-detail | Mobile app | — | `/features/mobile-app/` | MISSING | P2 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-FEAT-016 | CRM | Features | feature-detail | AI assistance | — | `/features/ai-assistance/` | MISSING | P2 | FEAT index | Features | Explain | Products | — | — | high | |
| CRM-IMP-000 | CRM | Implementation | implementation-guide | CRM Implementation Guide | — | `/guides/crm-implementation/` | MISSING | P0 | Domain hub | Implement | Deliver | Checklist | — | RES-006 | medium | Pillar |
| CRM-IMP-001 | CRM | Implementation | how-to | Plan CRM Implementation | — | `/guides/crm-implementation-planning/` | MISSING | P0 | IMP-000 | Implement | Plan | Project plan | — | RES-006 | light | |
| CRM-IMP-002 | CRM | Implementation | guide | Implementation Timeline | — | `/guides/crm-implementation-timeline/` | MISSING | P1 | IMP-000 | Implement | Plan | — | — | — | light | |
| CRM-IMP-003 | CRM | Implementation | guide | Implementation Cost | — | `/guides/crm-implementation-cost/` | MISSING | P1 | IMP-000 | Implement | Cost | Calculator | Calculator | — | medium | |
| CRM-IMP-004 | CRM | Implementation | guide | Implementation Roles | — | `/guides/crm-implementation-roles/` | MISSING | P1 | IMP-000 | Implement | Staff | — | — | — | light | |
| CRM-IMP-005 | CRM | Implementation | guide | Implementation Mistakes | — | `/guides/crm-implementation-mistakes/` | MISSING | P1 | IMP-000 | Implement | Risk | Checklist | — | RES-006 | light | |
| CRM-IMP-006 | CRM | Implementation | migration | CRM Data Migration Guide | — | `/guides/crm-data-migration/` | MISSING | P0 | IMP-000 | Implement | Migrate | Migration checklist | — | RES-007 | medium | |
| CRM-IMP-007 | CRM | Implementation | how-to | Clean CRM Data | — | `/guides/crm-data-cleaning/` | MISSING | P1 | IMP-006 | Implement | Hygiene | Cleanup | — | RES-016 | light | |
| CRM-IMP-008 | CRM | Implementation | how-to | Field Mapping Guide | — | `/guides/crm-field-mapping/` | MISSING | P1 | IMP-006 | Implement | Map | Mapping template | — | RES-011 | light | |
| CRM-IMP-009 | CRM | Implementation | how-to | CRM Testing Guide | — | `/guides/crm-testing/` | MISSING | P2 | IMP-000 | Implement | Test | Test plan | — | — | light | |
| CRM-IMP-010 | CRM | Implementation | how-to | CRM Go-Live Guide | — | `/guides/crm-go-live/` | MISSING | P1 | IMP-000 | Implement | Launch | Go-live checklist | — | RES-008 | light | |
| CRM-IMP-011 | CRM | Implementation | how-to | CRM Training Guide | — | `/guides/crm-training/` | MISSING | P1 | IMP-000 | Implement | Train | Training plan | — | RES-009 | light | |
| CRM-IMP-012 | CRM | Implementation | guide | CRM Adoption Guide | — | `/guides/crm-adoption/` | MISSING | P0 | IMP-000 | Implement→Optimize | Adopt | Optimization | — | RES-015 | medium | |
| CRM-IMP-013 | CRM | Implementation | guide | CRM Governance Guide | — | `/guides/crm-governance/` | MISSING | P2 | IMP-000 | Implement | Govern | — | — | — | light | |
| CRM-IMP-014 | CRM | Implementation | guide | CRM Data Quality Guide | — | `/guides/crm-data-quality/` | MISSING | P1 | IMP-000 | Implement | Quality | Cleanup | — | RES-016 | light | |
| CRM-IMP-015 | CRM | Implementation | guide | CRM Change Management | — | `/guides/crm-change-management/` | MISSING | P2 | IMP-000 | Implement | Change | — | — | — | light | |
| CRM-IMP-016 | CRM | Implementation | guide | CRM Implementation KPIs | — | `/guides/crm-implementation-kpis/` | MISSING | P2 | IMP-000 | Implement | Measure | Health check | — | — | light | |
| CRM-OPT-001 | CRM | Optimization | guide | Improve CRM Adoption | — | `/guides/improve-crm-adoption/` | MISSING | P0 | Domain hub | Optimize | Adopt | Health check | — | RES-015 | light | |
| CRM-OPT-002 | CRM | Optimization | guide | CRM Data Hygiene | — | `/guides/crm-data-hygiene/` | MISSING | P1 | OPT cluster | Optimize | Hygiene | Cleanup | — | RES-016 | light | |
| CRM-OPT-003 | CRM | Optimization | guide | Reporting Best Practices | — | `/guides/crm-reporting-best-practices/` | MISSING | P1 | OPT cluster | Optimize | Report | — | — | — | light | |
| CRM-OPT-004 | CRM | Optimization | guide | Automation Best Practices | — | `/guides/crm-automation-best-practices/` | MISSING | P1 | OPT cluster | Optimize | Automate | — | — | — | light | |
| CRM-OPT-005 | CRM | Optimization | guide | CRM Governance Ops | — | `/guides/crm-governance-operations/` | MISSING | P2 | OPT cluster | Optimize | Govern | — | — | — | light | |
| CRM-OPT-006 | CRM | Optimization | guide | CRM Audit Guide | — | `/guides/crm-audit/` | MISSING | P1 | OPT cluster | Optimize | Audit | Health check | — | RES-015 | light | |
| CRM-OPT-007 | CRM | Optimization | guide | CRM Health Check | — | `/guides/crm-health-check/` | MISSING | P1 | OPT cluster | Optimize | Diagnose | Checklist | — | RES-015 | light | |
| CRM-OPT-009 | CRM | Optimization | decision-guide | When to Replace CRM | — | `/guides/when-to-replace-crm/` | MISSING | P1 | OPT cluster | Optimize | Replace | Finder/Compare | Finder | — | medium | |
| CRM-OPT-010 | CRM | Optimization | migration | Migrate to Another Vendor | — | `/guides/crm-vendor-migration/` | MISSING | P1 | OPT cluster | Optimize | Switch | Migration checklist | — | RES-007 | medium | |
| CRM-RES-001 | CRM | Resources | checklist | Evaluation Checklist | — | `/resources/crm-evaluation-checklist/` | MISSING | P0 | Choose | Choose | Completeness | Finder | Finder | self | none | |
| CRM-RES-002 | CRM | Resources | template | Requirements Template | — | `/resources/crm-requirements-template/` | MISSING | P0 | Choose | Choose | Capture needs | Requirements | Finder | self | none | |
| CRM-RES-003 | CRM | Resources | scorecard | Vendor Scorecard | — | `/resources/crm-vendor-scorecard/` | MISSING | P0 | Choose | Choose | Score vendors | Compare | Compare | self | none | |
| CRM-RES-004 | CRM | Resources | template | RFP Template | — | `/resources/crm-rfp-template/` | MISSING | P2 | Choose | Choose | Formal buy | Vendor eval | — | self | none | |
| CRM-RES-005 | CRM | Resources | checklist | Demo Checklist | — | `/resources/crm-demo-checklist/` | MISSING | P1 | Choose | Choose | Demo | Demo guide | — | self | none | |
| CRM-RES-006 | CRM | Resources | checklist | Implementation Checklist | — | `/resources/crm-implementation-checklist/` | MISSING | P0 | Implement | Implement | Deliver | IMP guide | — | self | none | |
| CRM-RES-007 | CRM | Resources | checklist | Migration Checklist | — | `/resources/crm-migration-checklist/` | MISSING | P0 | Implement | Implement | Migrate | Migration guide | — | self | none | |
| CRM-RES-008 | CRM | Resources | checklist | Go-Live Checklist | — | `/resources/crm-go-live-checklist/` | MISSING | P1 | Implement | Implement | Launch | Go-live | — | self | none | |
| CRM-RES-009 | CRM | Resources | planner | Training Plan | — | `/resources/crm-training-plan/` | MISSING | P1 | Implement | Implement | Train | Training guide | — | self | none | |
| CRM-RES-010 | CRM | Resources | template | Data Migration Template | — | `/resources/crm-data-migration-template/` | MISSING | P1 | Implement | Implement | Migrate | Migration | — | self | none | |
| CRM-RES-011 | CRM | Resources | template | Field Mapping Template | — | `/resources/crm-field-mapping-template/` | MISSING | P1 | Implement | Implement | Map | Mapping guide | — | self | none | |
| CRM-RES-012 | CRM | Resources | checklist | Security Checklist | — | `/resources/crm-security-checklist/` | MISSING | P1 | Choose/Implement | Security | Secure | Security cap | — | self | none | |
| CRM-RES-013 | CRM | Resources | worksheet | Comparison Worksheet | — | `/resources/crm-comparison-worksheet/` | MISSING | P0 | Compare | Compare | Compare | Compare hub | Compare | self | none | |
| CRM-RES-014 | CRM | Resources | template | Business Case Template | — | `/resources/crm-business-case-template/` | MISSING | P2 | Choose | Choose | Justify | Calculator | Calculator | self | none | |
| CRM-RES-015 | CRM | Resources | checklist | Optimization Checklist | — | `/resources/crm-optimization-checklist/` | MISSING | P1 | Optimize | Optimize | Improve | Health check | — | self | none | |
| CRM-RES-016 | CRM | Resources | checklist | Cleanup Checklist | — | `/resources/crm-cleanup-checklist/` | MISSING | P2 | Optimize | Optimize | Clean | Hygiene | — | self | none | |
| CRM-RES-TPL | CRM | Resources | template-system | Resources route template | — | `/resources/[slug]/` | NOT-YET-IMPLEMENTED | P0 | Domain hub | Resources | Host artifacts | Parent pillar | — | — | — | New IA surface |
| CRM-EVD-001 | CRM | Evidence | methodology | Editorial methodology | `/company/editorial-methodology/` | same | EXISTING | P0 | Company | Evidence | Trust | — | — | — | — | |
| CRM-EVD-002 | CRM | Evidence | methodology | How we review | `/company/how-we-review-software/` | same | EXISTING | P0 | Company | Evidence | Trust | — | — | — | — | |
| CRM-GUIDES-000 | CRM | Learn/Choose | guides-landing | Guides hub | `/guides/` | same | EXISTING-BUT-THIN | P1 | Domain hub | Learn/Choose | Discover | Tools | soft | — | — | hard noindex |
| CRM-ALT-000 | CRM | Products | alternatives-landing | Alternatives hub | `/alternatives/` | same | PARTIAL | P1 | Domain hub | Products | Discover | — | — | — | — | scaffold |
| CRM-SOFT-000 | CRM | Products | software-directory | Software directory | `/software/` | same | EXISTING | P0 | Home | Products | Browse | Product hubs | — | — | — | |

### Expansion backlog (counted in totals as policy rows, not forced URLs)

| ID | Item | Status | Priority | Notes |
| --- | --- | --- | --- | --- |
| CRM-EXP-PRD | Remaining ~19 CRM product hubs | EXISTING instances | P0 maintain | Catalogue already public |
| CRM-EXP-PRD-GUIDES | Product implementation/setup/plan guides | MISSING | P2 | Eligibility per product depth |
| CRM-EXP-PRD-IND | Product × industry guides | OPTIONAL | P3 | Requires industry research |
| CRM-EXP-CMP | Additional head-to-heads | EXISTING engine | P1 | Eligibility §8; do not auto-blast |
| CRM-EXP-IND-L3 | Non-FS industry L3 packs | MISSING | P2 | After industry profiles |
| CRM-EXP-CAP-NEST | Capability×industry beyond FS | PARTIAL | P2 | Template exists |

---

## Operating principles (reusable beyond CRM)

1. **Category Domain Hub** (`/categories/{category}/`) is L1 — not a parallel `/ {category}/` site.  
2. **Commercial anchors** (Best, Compare, Products, Tools, Pricing) before long-tail guides.  
3. **Graph before pages:** requirements/features/capabilities need evidence cells before indexation.  
4. **Tabs before twin URLs** on product hubs.  
5. **No permutation explosion** (compare×industry×audience×feature).  
6. **Agents draft; publishing gates decide.**  
7. **Resources are first-class** eventually (`/resources/`), not only guide footnotes.  
8. **Post-purchase content is in-scope** (implementation + optimization).  
9. **`/for/` ≠ `/industries/`.**  
10. CRM is the reference implementation; next categories clone the cluster map, not the CRM copy.

---

## Totals (this blueprint)

Verified by counting master-table rows in this file (excluding expansion-backlog `CRM-EXP-*` policy rows, which are not discrete URL commitments).

| Metric | Count |
| --- | ---: |
| **1. Total target CRM page/content candidates** | **196** |
| **2. Existing** (`EXISTING` only) | **24** |
| **3. Thin / partial** (`EXISTING-BUT-THIN` + `PARTIAL`) | **39** |
| **4. Missing** (`MISSING`) | **123** |
| **5. P0** | **65** |
| **6. P1** | **88** |
| **7. Resources/templates** (`CRM-RES-001`…`016` + `CRM-RES-TPL`) | **17** |
| **8. Tools** (`CRM-TOOL-001`…`006`) | **6** |
| **9. Supporting article candidates** (Learn + Choose article rows + Implementation + Optimization article rows in master; excludes Best/tools/resources) | **54** |
| **10. Document path** | `docs/content-ecosystem/02-crm-target-ecosystem.md` |

### Additional status buckets in master

| Status | Count |
| --- | ---: |
| NOT-YET-IMPLEMENTED | 4 |
| OPTIONAL | 6 |
| P2 | 38 |
| P3 | 5 |
| NOT-YET-RESEARCHED (depth) | called out on industry rows still marked EXISTING-BUT-THIN |

---

*End of CRM target ecosystem specification. No pages implemented by this document.*
