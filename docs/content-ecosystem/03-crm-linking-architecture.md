# SoftwareGlimpse CRM Internal-Linking & Content-Support Architecture

> Spec date: 2026-08-14  
> Status: **authoritative linking blueprint** (documentation only — do **not** implement links from this change)  
> Inputs: [`01-current-page-inventory.md`](./01-current-page-inventory.md), [`02-crm-target-ecosystem.md`](./02-crm-target-ecosystem.md)  
> Related code today: `src/services/relationships/`, `src/services/graph/`, `docs/softwareglimpse/internal-linking.md`

---

## Executive summary

Internal linking for SoftwareGlimpse CRM is a **buyer-journey + research graph**, not a “related posts” SEO widget.

- **Chrome nav** is intentionally sparse and hardcoded (hub discovery).  
- **In-page modules** must be **graph- and journey-driven**: parent/child, supports/supported-by, next-step, tool-for, resource-for, evidence-for.  
- Today, **product → category/compare/alternatives/guides/tools** is the only mature graph linker (`getSoftwareRelationshipLinks`). Most L3/L4 knowledge pages lack standardized next-step and parent modules.  
- Target: every published CRM page has **≥1 parent/hub inbound** and **≥1 meaningful next-step outbound** (orphan rule), with density caps (typically **3–6** items per module).

Canonical CRM hub remains **`/categories/crm/`**.

---

## 1. Relationship taxonomy

| Relationship | Direction sense | Semantics | Typical FROM → TO |
| --- | --- | --- | --- |
| **parent** | structural | Hub or pillar that owns the child in IA | Hub → Best; Implementation pillar → Migration guide |
| **child** | inverse of parent | Owned supporting page or entity | Guide → Hub; Feature → Capability |
| **supports** | knowledge → anchor | Supporting content strengthens a commercial/decision anchor | Guide → Best / Product / Tool |
| **supported-by** | inverse | Anchor surfaces its supporting knowledge | Best → How to choose; Product → Setup guide |
| **related** | lateral | Same stage/cluster, not hierarchical | Two use cases; two requirements |
| **next-step** | journey forward | Recommended progress in the buyer journey | Learn → Requirements; Compare → Calculator |
| **previous-step** | journey back | Soft return path (never the only CTA) | Pricing → Compare; Implement → Select |
| **evidence-for** | claim → proof | Internal claim backed by research object | Product claim → Evidence tab / source list |
| **explains** | education | Page defines or teaches a concept used elsewhere | What is CRM → Domain hub concepts |
| **compares** | decision | Explicit A vs B (or multi) relationship | Product → Comparison; Hub → Compare |
| **alternative-to** | substitute | Typed graph edge for substitutes | Product → Alternatives page / peers |
| **implements** | delivery | How to roll out / configure | Implementation guide → Product setup |
| **requires** | need | Capability/use case depends on a requirement | Use case → Requirement |
| **satisfies** | inverse of requires | Feature/product meets a requirement | Feature → Requirement; Product → Requirement |
| **used-by** | reverse usage | Entity consumed by a higher job | Feature used-by Use case |
| **relevant-to-industry** | vertical | Entity materially matters in an industry context | Industry → Feature / Capability |
| **relevant-to-use-case** | job | Entity matters for a job-to-be-done | Use case → Feature |
| **pricing-for** | commercial | Cost surface for an entity | Product → Pricing; Guide → Calculator |
| **tool-for** | interactive | Decision tool that operationalizes the page’s job | How to choose → Finder |
| **resource-for** | artifact | Checklist/template that operationalizes the page | Evaluation guide → Scorecard |

### Relationship classes

| Class | Purpose | Link UI |
| --- | --- | --- |
| **Structural** | parent/child | Breadcrumbs, ParentHubLink |
| **Journey** | next/previous-step | RecommendedNextStep |
| **Support** | supports/supported-by | RelatedGuides, In this topic |
| **Research graph** | requires/satisfies/compares/alternative-to/relevant-to-* | Related* entity modules |
| **Commercial** | tool-for / pricing-for / resource-for | TryDecisionTool, DownloadResource |
| **Evidence** | evidence-for | EvidenceSources (separate from nav) |

---

## 2. Buyer journey linking

Canonical CRM journey (linking stages):

```text
Learn → Define requirements → Find → Research → Compare → Price → Select → Implement → Adopt → Optimize
```

| Stage | Primary page types | Incoming links (from) | Outgoing links (to) | Recommended next-step module |
| --- | --- | --- | --- | --- |
| **Learn** | Domain hub, Learn guides | Home, nav Categories, Guides | Requirements guide, Do I need, How to choose | “Define what you need” → Requirements guide / template |
| **Define requirements** | Requirements guide, requirement details, scorecard | Learn guides, Hub, Industry/UC | Finder, Evaluation checklist, Best | “Find matching CRM” → Finder |
| **Find** | Finder, Best, category product grid | Choose guides, UC/Industry/Req | Product reviews, Compare | “Research top matches” → Product review |
| **Research** | Product reviews (+ tabs) | Finder, Best, Compare, Alternatives | Pricing, Alternatives, Compare, Features/UC | “Compare shortlist” → Compare |
| **Compare** | Compare hub + pairs | Product, Best, Hub | Pricing, Calculator, Product | “Check total cost” → Calculator / Pricing |
| **Price** | Pricing index/pages, pricing guides | Compare, Product pricing tab | Calculator, Select (Best/Product CTA) | “Estimate your cost” → Calculator |
| **Select** | Best, scorecard, vendor questions | Compare, Calculator, Evaluation | Implementation pillar, Product CTA (`/go/`) | “Plan rollout” → Implementation guide |
| **Implement** | Implementation cluster + resources | Select, Product setup guides | Migration, Training, Go-live | “Migrate data” → Migration guide/checklist |
| **Adopt** | Adoption / training guides | Implementation | Optimization, Health check | “Improve adoption” → Adoption / Health check |
| **Optimize** | Optimization cluster | Adoption, Product ops | Audit, Replace/Migrate, Finder (re-evaluate) | “Audit CRM health” → Health check / Replace guide |

### Journey module copy pattern

```text
NEXT STEP
{one-sentence bridge}
→ {primary action page}
→ {tool}
→ {resource}   // when available
```

---

## 3. CRM Hub (`/categories/crm/`) linking

### Required outbound (target)

| Destination | Relationship | Strength | Module |
| --- | --- | --- | --- |
| Best CRM | parent→child / tool-for decision | **required** | Decision CTAs |
| How to Choose CRM | supports | **required** | Learn/Choose strip |
| CRM Finder | tool-for | **required** | TryDecisionTool |
| CRM Cost Calculator | tool-for / pricing-for | **required** | TryDecisionTool |
| Products (grid) | parent→child | **required** | RelatedProducts |
| Comparisons | compares | **required** | RelatedComparisons |
| Industries | parent→child | **required** | RelatedIndustries |
| Use Cases | parent→child | **required** | RelatedUseCases |
| Capabilities | parent→child | **recommended** | RelatedCapabilities |
| Requirements | parent→child | **recommended** | RelatedRequirements |
| Features | parent→child (selected) | **optional** | RelatedFeatures (top N) |
| Implementation pillar | next-step (post-select) | **recommended** | RecommendedNextStep |
| Resources index / featured | resource-for | **recommended** | DownloadResource |

### Required inbound (supporting clusters → hub)

Every CRM Learn/Choose/Industry/UC/Capability/Requirement/Feature/Implementation/Optimization guide and resource must include **ParentHubLink** → `/categories/crm/` (or breadcrumb including it), unless the page’s primary parent is a more specific pillar that itself links to the hub (then hub may be breadcrumb-only).

---

## 4. Pillar ↔ supporting article rules

### Pattern

```text
PILLAR (L2/L3)
├── In this topic (children)     ← parent → child
├── Download resource           ← resource-for
├── Try tool                    ← tool-for
└── Next step                   ← journey

SUPPORTING ARTICLE
├── ParentHubLink / pillar      ← child → parent
├── Related guides (≤3)        ← related (high relevance only)
├── Next step                   ← journey
└── Download / Try tool        ← if applicable
```

### Example: CRM Implementation Guide

**Pillar outbound (required):** Implementation Cost, Timeline, Migration Guide, Training Guide, Go-Live Checklist, Implementation Checklist (and other IMP cluster children when published).

**Each supporting article inbound (required):** link back to **CRM Implementation Guide**.

**Sideways:** only when highly relevant (e.g. Field Mapping ↔ Data Migration; Training ↔ Adoption). Avoid linking every IMP article to every other.

### Standard modules on pillars & supports

| Module | Pillar | Supporting article |
| --- | --- | --- |
| **In this topic** | required | optional (siblings ≤3) |
| **Related guides** | recommended | recommended (strict relevance) |
| **Next step** | required | required |
| **Download resource** | recommended | required if resource-for edge exists |
| **Try tool** | recommended | optional (usually on Choose/Price stages) |

---

## 5. Product review linking

### Every Product Review (`/software/{slug}/`) should link to

| Target | Relationship | Strength | Notes |
| --- | --- | --- | --- |
| Pricing | pricing-for | **required** | Tab and/or `/pricing/{slug}/` |
| Features | child / explains | **required** | Tab + selected Feature detail pages |
| Pros/Cons | section (same page) | **required** | Same-URL anchors OK |
| Alternatives | alternative-to | **recommended** | When alternatives entity publishable |
| Comparisons | compares | **required** | Max per `INTERNAL_LINK_LIMITS` |
| Feature detail pages | satisfies / used-by | **recommended** | From feature matrix cells |
| Use-case pages | relevant-to-use-case | **recommended** | Fit-tagged only |
| Industry pages | relevant-to-industry | **optional** | When industry evidence exists |
| Product implementation / setup guides | implements / supported-by | **recommended** | When published |
| Evidence / sources | evidence-for | **required** | EvidenceSources module |
| CRM Finder | tool-for | **recommended** | Category CRM |
| Cost Calculator | pricing-for | **recommended** | Especially from pricing tab |

### Supporting product guides → Review

**required:** ParentHubLink → `/software/{slug}/` (not only category hub).

---

## 6. Industry linking

### Industry hub outbound

| Target | Strength |
| --- | --- |
| Industry use cases | **required** (strong) |
| Capabilities (industry nests and/or global) | **required** |
| Requirements (selective) | **recommended** |
| Industry L3 guides | **recommended** |
| Product × industry pages | **optional** (eligibility) |
| Comparisons (industry-relevant pairs) | **recommended** |
| Finder | **required** (tool-for) |
| Cost Calculator | **recommended** |
| Domain hub | parent | **required** |

### Industry supporting articles

**required** back-link to industry pillar.

### Capability / Use Case pages with industry context

Must expose **relevant-to-industry** back to the industry hub when rendered under `/industries/{industry}/…` or when profile declares industry context.

---

## 7. Use case linking

### Use case page outbound

| Target | Strength |
| --- | --- |
| Capabilities | **required** (`requires` / used-by) |
| Requirements | **required** |
| Features | **recommended** |
| Recommended products | **required** |
| Comparisons | **recommended** |
| Pricing / Calculator | **optional** |
| Industry context | **recommended** when tagged |
| Finder | **required** (tool-for) |
| Resources | **recommended** |

### Back-links

Requirements and capabilities that participate in the use case must list it under RelatedUseCases (**supported-by** / **used-by**).

---

## 8. Capability linking

### Capability outbound

| Target | Strength |
| --- | --- |
| Requirements | **required** |
| Features | **required** |
| Product assessments / reviews | **recommended** |
| Use cases | **required** |
| Industries | **optional**/selective |
| Comparisons | **optional** |
| Finder | **recommended** |

### Back-links

Feature and Requirement pages **required** Parent/RelatedCapabilities → primary capability.

---

## 9. Requirement linking

### Requirement outbound

| Target | Strength |
| --- | --- |
| Primary capability | **required** (parent) |
| Related use cases | **required** |
| Supporting features | **required** (`satisfies`) |
| Product fit / reviews | **strong / required** |
| Comparisons | **recommended** |
| Finder | **required** (criteria mapping) |
| Cost Calculator | **optional** if plan/pricing impact |
| Related requirements | **optional** (≤3) |

### Feature → Requirement

Feature pages link to requirements they **satisfy** (**recommended**, max 3–6).

---

## 10. Feature linking

### Feature outbound

| Target | Strength |
| --- | --- |
| Capability | **required** |
| Requirements | **recommended** |
| Product support matrix → reviews | **required** |
| Plans/pricing notes | **optional** → pricing-for |
| Comparisons | **optional** |
| Industries | **selective** |
| Use cases | **recommended** |
| Finder | **optional**/meaningful only |

### Product → Feature

Feature sections/matrices on product hubs **recommended** link to Feature detail URLs when those pages are published (not every mention).

---

## 11. Guide linking contract

Every Guide instance must declare (content metadata / `supports` edges):

| Field | Required | Purpose |
| --- | --- | --- |
| **primary pillar** | yes | ParentHubLink target |
| **primary category** | yes | Usually `crm` → Domain hub breadcrumb |
| **buyer journey stage** | yes | next-step selection |
| **related tool** | recommended | TryDecisionTool |
| **related resource** | recommended | DownloadResource |
| **recommended next step** | required | RecommendedNextStep |

**Forbidden as sole related UI:** generic “Related posts” without journey/graph typing.

### Example module

```text
NEXT STEP
Now that you understand CRM requirements:
→ Build your requirements profile   (/guides/crm-requirements-guide/ or /requirements/)
→ Try CRM Finder                    (/tools/crm-finder/)
→ Download CRM Evaluation Checklist (/resources/crm-evaluation-checklist/)
```

---

## 12. Resource linking

### Every checklist/template/worksheet

| Outbound | Strength |
| --- | --- |
| Supporting pillar | **required** (parent) |
| Relevant guide | **required** |
| Related tool | **recommended** |
| Next decision step | **required** |

### Every relevant pillar

Must surface its resources via **DownloadResource** (max 3 featured).

Resources **usually avoid** deep product-review grids unless the artifact is vendor-specific.

---

## 13. Tool linking

### CRM Finder should be linked from

| Source | Strength |
| --- | --- |
| How to Choose CRM | **required** |
| Best CRM | **required** |
| Industry pages | **required** |
| Use case pages | **required** |
| Requirement pages | **required** |
| Feature pages | **optional** (when Finder criterion maps) |
| Domain hub | **required** |
| Evaluation / requirements guides | **required** |

### CRM Cost Calculator linked from

| Source | Strength |
| --- | --- |
| Pricing Guide | **required** |
| Product Pricing | **required** |
| Comparison pricing sections | **recommended** |
| Requirement pages with plan impact | **optional** |
| Finder results | **recommended** |
| Domain hub | **required** |

### Finder results outbound

| Target | Strength |
| --- | --- |
| Product reviews | **required** |
| Comparisons (among results) | **recommended** |
| Pricing pages | **recommended** |
| Calculator | **recommended** |

---

## 14. Evidence linking

```text
claim → evidence object → authoritative source (external)
```

### Rules

1. **External sources never replace** internal decision navigation (Hub, Best, Compare, Finder).  
2. Evidence drawers / EvidenceSources sit **beside** journey modules, not instead of them.  
3. Prefer internal paths: Product Evidence tab → ResearchSource list → outbound official link via existing outbound components.  
4. Affiliate `/go/` links are **commercial CTAs**, not evidence.  
5. Methodology pages (`/company/editorial-methodology/`, how-we-review) are **trust parents**, linked from Best/Compare/Product trust strips — not from every paragraph.

### Coexistence layout (target)

```text
[Body claim]
[Optional inline “How we know” → EvidenceSources]
…
[RecommendedNextStep]
[TryDecisionTool]
[RelatedProducts / RelatedComparisons]
[EvidenceSources (full)]
```

---

## 15. Reusable link modules

| Module | Page types that render it | Data source | Max items | Selection logic |
| --- | --- | --- | --- | --- |
| **TopicBreadcrumbs** | All content pages | IA parent chain | 4–5 crumbs | Fixed trail: Home → Hub → Pillar → Self |
| **ParentHubLink** | Guides, resources, UC/cap/req/feature, industry nests | `primary pillar` / category | 1 | Explicit parent; fallback Domain hub |
| **RelatedGuides** | Hubs, Best, Product, Industry, UC, pillars | `supports` / journey stage / category | **4** | Same pillar first; then stage; exclude self; publishable only |
| **RelatedProducts** | Hub, Best, UC, Industry, Cap, Req, Feature, Finder results | catalogue + fit/evidence | **6** | Score/fit/evidence; never commission |
| **RelatedComparisons** | Product, Best, Hub, UC, Industry | comparison entities + graph | **4** | Shared products; publishable |
| **RelatedCapabilities** | UC, Industry, Req, Feature, Hub | taxonomy edges | **6** | Direct requires/used-by |
| **RelatedRequirements** | UC, Cap, Feature, Product, Finder | requirement graph | **6** | Primary first |
| **RelatedFeatures** | Cap, Req, Product, UC | feature graph + evidence | **6** | Satisfies / matrix |
| **RelatedUseCases** | Cap, Req, Feature, Industry, Product | tags/edges | **6** | Tagged only |
| **RelatedIndustries** | Hub, Product, Cap, Feature, UC | industry profiles/tags | **6** | Researched industries preferred |
| **RecommendedNextStep** | All non-legal content | journey stage map | **1–3** actions | Stage table §2; one primary |
| **DownloadResource** | Pillars, guides, tools landings | `resource-for` edges | **3** | Featured + matching stage |
| **TryDecisionTool** | Hub, Best, Choose, UC, Industry, Req, Pricing | tools registry + category | **2** | Finder and/or Calculator by stage |
| **EvidenceSources** | Product, Compare, Best, Feature/Req with claims | research sources / evidence | **8** | Verified/approved sources only |

Current code limits (`INTERNAL_LINK_LIMITS`) already encode several maxima for **software** pages; this table extends the same discipline to all CRM page types.

---

## 16. Link density rules

1. **Parent once, prominently** (breadcrumb + optional ParentHubLink CTA) — do not spam hub URL.  
2. **3–6 items per Related* module** (tools max 2–3; next-step max 3).  
3. **Do not autolink every entity mention** in body copy; reserve intentional modules + selective inline links.  
4. **Dedupe URLs** on a page (one href wins; highest-priority relationship).  
5. **Buyer journey > SEO volume** — prefer next-step over stuffing synonyms.  
6. **Descriptive anchors** (“Compare HubSpot and Salesforce”, not “click here”).  
7. **No orphaned published pages** (§17).  
8. **Unpublished / noindex drafts** may appear in preview only — not in public modules.  
9. **Avoid reciprocal spam**: A→B and B→A allowed when relationships differ (parent vs child); do not mirror entire related lists.  
10. **Contextual compare / product×industry** links only when eligibility from `02` passes.

---

## 17. Orphan-page rule

### Definition

A **published** CRM content page (not legal/system/newsletter/dev) is an **orphan** if either:

1. No **parent/hub inbound** from a published page ( Domian hub, pillar, index, or nav-discoverable hub), **or**  
2. No **meaningful next-step outbound** (journey tool, pillar child, product/compare/pricing, or resource).

**Exempt:** legal, privacy-request, newsletter confirm/thanks/preferences, `/api/*`, `/go/*`, `/dev/*`, pure redirects.

### Publication validation (target)

Deterministic check (site-audit / publishing gate):

```text
ORPHAN_INBOUND  — zero qualifying parent/hub links into this URL
MISSING_NEXT_STEP — page type requires RecommendedNextStep but none resolved
LINK_DEDUP_FAIL — same href repeated beyond policy
LINK_LIMIT_EXCEEDED — module over max
```

Block **indexable** publish (or warn for soft-published noindex) when `ORPHAN_INBOUND` or `MISSING_NEXT_STEP` fires for CRM category content.

### Current orphan / weak-discovery candidates (from inventory)

Not all are true graph orphans (footer may link), but **journey-orphans / under-parented**:

| Page / pattern | Issue |
| --- | --- |
| `/features/`, `/requirements/` | Not in header/footer; weak hub inbound |
| Feature/requirement details (4) | Mostly self-index cards; industry nests isolated |
| `/for/` | Placeholder; no children; weak utility |
| Guides (2) | Hub noindex; Best/Hub support edges incomplete for journey modules |
| Alternatives researching URLs | gSP exists; weak public inbound |
| Industry hubs (12 non-FS) | Footer industries index only; thin next-step |
| `/pricing/` | Indexable but under-linked from Choose journey |

Exact automated orphan count requires a graph crawl; **inventory-based weak-discovery set ≈ 20+ URL patterns / hubs**, with **hundreds of comparison URLs well-linked** from compare hub/products.

---

## 18. Relationship matrix

Legend: **R** = required · **Rec** = recommended · **O** = optional · **A** = avoid (except rare eligibility)

Rows = FROM · Columns = TO

| FROM ↓ \ TO → | Domain Hub | Best | Guide | Product | Compare | Pricing | Audience | Industry | Use Case | Capability | Requirement | Feature | Resource | Finder | Calculator | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Domain Hub** | — | R | Rec | R | R | Rec | Rec | R | R | Rec | Rec | O | Rec | R | R | O |
| **Best** | R | — | Rec | R | R | Rec | O | O | Rec | O | Rec | O | Rec | R | Rec | Rec |
| **Guide** | R | Rec | Rec* | O | O | O | O | O | O | O | O | O | Rec | Rec | O | O |
| **Product** | R | Rec | Rec | — | R | R | O | O | Rec | O | Rec | Rec | O | Rec | Rec | R |
| **Compare** | Rec | Rec | O | R | — | Rec | A | O | O | O | O | O | Rec | Rec | Rec | Rec |
| **Pricing** | Rec | Rec | Rec | R | Rec | — | A | A | A | A | O | O | O | Rec | R | Rec |
| **Audience** | R | Rec | Rec | Rec | Rec | O | — | O | Rec | O | Rec | O | Rec | R | Rec | A |
| **Industry** | R | Rec | Rec | Rec | Rec | Rec | O | — | R | R | Rec | O | Rec | R | Rec | O |
| **Use Case** | R | Rec | Rec | R | Rec | O | O | Rec | — | R | R | Rec | Rec | R | O | O |
| **Capability** | Rec | O | Rec | Rec | O | A | A | O | R | — | R | R | O | Rec | A | O |
| **Requirement** | Rec | Rec | Rec | R | Rec | O | A | O | R | R | — | R | Rec | R | O | O |
| **Feature** | Rec | O | Rec | R | O | O | A | O | Rec | R | Rec | — | A | O | A | Rec |
| **Resource** | Rec | Rec | R | A/O | Rec | O | A | O | O | O | O | A | — | Rec | Rec | A |
| **Finder** | Rec | Rec | Rec | R | Rec | Rec | O | Rec | Rec | O | Rec | O | Rec | — | Rec | A |
| **Calculator** | Rec | Rec | Rec | R | Rec | R | A | O | A | A | O | A | O | Rec | — | Rec |
| **Evidence** | O | Rec | A | R | Rec | O | A | A | A | A | O | O | A | A | A | — |

\*Guide→Guide: related siblings only, not entire catalogue.

### Matrix relationship count

Counting each non-“—” / non-empty cell in the 17×16 content matrix above (excluding self dashes): **17 × 16 − 17 = 255** directed page-type slots; of which policy assigns **R/Rec/O/A** (all defined).  
**Defined directed relationships (with explicit R/Rec/O/A): 255.**

---

## 19. Example complete journeys

### Example 1 — Core commercial path

```text
CRM Hub (/categories/crm/)
→ How to Choose CRM (/guides/how-to-choose-crm/)
→ CRM Requirements Template (/resources/crm-requirements-template/)   [MISSING today]
→ CRM Finder (/tools/crm-finder/)
→ Pipedrive Review (/software/pipedrive/)
→ Pipedrive vs HubSpot (/compare/hubspot-vs-pipedrive/)
→ CRM Cost Calculator (/tools/crm-cost-calculator/)
→ CRM Implementation Guide (/guides/crm-implementation/)                 [MISSING today]
```

Relationships: tool-for, resource-for, next-step, compares, pricing-for, implements.

### Example 2 — Industry deep path

```text
CRM for Financial Services (/industries/financial-services/)
→ Advisory Relationship Management (…/use-cases/advisory-relationship-management/)
→ Client Relationship / related Capability (pipeline or relationship capability)
→ Track Client Interactions Requirement (/requirements/track-client-interactions/)  [MISSING]
→ Supporting Feature (e.g. contact / activity tracking feature page)
→ Product comparison (FS-relevant pair)
→ CRM Finder
```

Relationships: relevant-to-industry, requires, satisfies, compares, tool-for.

### Example 3 — Product pricing path

```text
HubSpot Review (/software/hubspot/)
→ HubSpot Pricing (/pricing/hubspot/ or pricing tab)
→ HubSpot vs Salesforce (/compare/hubspot-vs-salesforce/)
→ CRM Cost Calculator
→ (Select) Best CRM or Visit CTA
```

Relationships: pricing-for, compares, next-step, tool-for.

### Example 4 — Implementation path

```text
CRM Implementation Guide (/guides/crm-implementation/)          [MISSING]
→ CRM Data Migration Guide (/guides/crm-data-migration/)     [MISSING]
→ CRM Migration Checklist (/resources/crm-migration-checklist/) [MISSING]
→ HubSpot Migration Guide (/guides/hubspot-migration/)       [MISSING / OPTIONAL]
→ HubSpot Review (parent product)
```

Relationships: parent/child, implements, resource-for, previous-step to product.

### Example 5 — Feature → requirement → use case → tool

```text
Workflow Automation Feature (/features/workflow-automation/)
→ Automate Lead Follow-Up Requirement (/requirements/automate-lead-follow-up/)
→ Lead Management Use Case (/use-cases/lead-management/)
→ CRM Finder
→ Recommended product reviews
```

Relationships: satisfies, used-by / requires, tool-for, RelatedProducts.

---

## 20. Current-vs-target gap analysis

### Existing working relationships

| Area | What works today |
| --- | --- |
| Product graph links | `getSoftwareRelationshipLinks` → category, competitors, comparisons, alternatives, guides, tools |
| Category hub model | CRM hub modules to products, best preview, compare, finder, guides, industries, use cases (model-driven) |
| Compare ecosystem | Large published pair set; hub discovery |
| Tool cross-links | Finder ↔ Calculator; Calculator → Best/guides |
| Guide template | Sidebar TOC + tools/related slots (not full journey contract) |
| Industry FS nests | Capability/UC/feature/requirement nested under FS |
| Chrome | Header/footer hardcoded hubs |

### Missing relationships (target not implemented)

| Gap | Impact |
| --- | --- |
| Standardized **RecommendedNextStep** on all CRM pages | Journey breaks after Learn/Research |
| **Resource-for** graph + `/resources/` surface | No first-class resource linking |
| Global **capabilities** index/pages | Capability linking only via industry nests |
| Requirement ↔ Finder criterion wiring as universal module | Partial via finder app, not page modules |
| Feature ↔ Product deep links from all hubs | Tabs exist; feature detail reciprocal weak |
| Guide metadata: pillar + stage + tool + resource + next | Incomplete vs §11 contract |
| Audience `/for/[slug]/` | No detail pages to link |
| Implementation / Optimization clusters | Entire next-step chain missing |
| Orphan validation in publish gate | Not enforced as specified |
| Evidence drawer coexisting with next-step on all research pages | Partial on product hub |

### Hardcoded relationships

| Location | Behavior |
| --- | --- |
| Site header/footer | Fixed hub list; industries/use-cases footer-only |
| Homepage CRM comparison filter | `categorySlug === "crm"` |
| Many CRM CTAs in industry/use-case/tools copy | CRM Finder / Calculator hrefs hardcoded |
| Docs example still cites `/tools/software-finder/` | Placeholder; product links may still point at coming-soon finder |

### Weak hubs

| Hub | Issue |
| --- | --- |
| `/guides/` | Complete UI but hard noindex; weak SEO parent |
| `/use-cases/`, `/industries/` | noindex; thin next-step standardization |
| `/features/`, `/requirements/` | Partial indexes; not in global nav |
| `/alternatives/` | Scaffold when empty |
| `/for/` | Placeholder |
| `/best/crm-software/` | Published but noindex; research in-progress |

### Duplicate / competing routes

| Issue | Guidance |
| --- | --- |
| Product pricing tab vs `/pricing/{slug}/` | Both OK; cross-link; canonical per SEO fields |
| Software Finder vs CRM Finder | Prefer CRM Finder for CRM journey; software-finder placeholder |
| Industry “small-business” vs `/for/small-business/` | Distinct IA; cross-link, don’t merge |
| Optional `/crm/` vs `/categories/crm/` | Alias only |

### Missing parent / next-step (priority)

| Priority | Fix |
| --- | --- |
| **P0** | Add ParentHubLink + RecommendedNextStep to guides, Best, use cases, industries, requirements, features |
| **P0** | Wire Hub → Finder/Calculator/Best as required CTA module (verify completeness) |
| **P0** | Finder results → review + compare + pricing + calculator |
| **P1** | Reciprocal UC ↔ capability ↔ requirement ↔ feature modules |
| **P1** | Resource surface + resource-for edges |
| **P1** | Orphan checks in `audit:site` / publishing |
| **P2** | Product → industry / product implementation guides |
| **P2** | Replace software-finder references in CRM journey with CRM Finder |

---

## 21. Implementation recommendations (docs only — do not build yet)

1. **Extend relationship vocabulary** in domain/graph beyond current software-centric edges to include journey `next-step`, `resource-for`, `requires`/`satisfies`, `relevant-to-industry|use-case`.  
2. **Module library** matching §15; prefer data-driven props from page models (as category hub already does).  
3. **Guide schema fields** for pillar, stage, tool, resource, nextAction (align with supporting-content-clusters `supports`).  
4. **Publication gate** for orphan inbound + missing next-step.  
5. **Keep chrome hardcoded**; put journey density in-page.  
6. **Reuse limits** from `link-limits.ts`; extend keys for capabilities/requirements/features/resources.  
7. **CRM first**, then generalize modules to `categorySlug`.  
8. **Do not** auto-link every comparison permutation or every feature mention.

---

## Totals & finish metrics

| # | Metric | Value |
| --- | --- | --- |
| 1 | **Total page-type relationships defined** | **255** directed slots in §18 matrix (each R/Rec/O/A) |
| 2 | **Current gaps identified** | **24** primary gap rows across §20 (missing modules, weak hubs, hardcoded CRM CTAs, missing clusters, validation) |
| 3 | **Orphan / weak-discovery count** | **≈20+** URL patterns/hubs under-parented or journey-weak; exact orphans need crawl (comparisons/products largely non-orphan) |
| 4 | **Highest-priority linking fixes** | (1) ParentHubLink + RecommendedNextStep on CRM knowledge pages · (2) Hub/Best/Choose ↔ Finder/Calculator completeness · (3) UC↔Cap↔Req↔Feature reciprocal modules · (4) Finder results → review/compare/pricing · (5) Orphan publish validation |
| 5 | **Document path** | `docs/content-ecosystem/03-crm-linking-architecture.md` |

---

*End of linking architecture. No links implemented by this document.*
