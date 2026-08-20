# Best CRM page upgrade — implementation report

**Route:** `/best/crm-software/`  
**Date:** 2026-08-15  
**Status:** Editorially approved and indexable (`editorialStatus: approved`, `seo.indexable: true`, research complete — 2026-08-15)

---

## 1. Existing components reused

| Component | Role |
| --- | --- |
| `BestSoftwareHero` | Upgraded hero layout |
| `BestSoftwareQuickSummary` | Top picks panel (scores + pricing) |
| `BestSoftwareQuickAnswer` | Visual shortlist cards |
| `BestSoftwareProductSection` | Detailed recommendation blocks |
| `BestSoftwareFeatureMatrix` | Capability comparison |
| `BestSoftwareFinderCta` | Dark Finder CTA |
| `BestSoftwareComparisons` | Head-to-head cards |
| `BestSoftwareAlternatives` | Alternatives cards |
| `BestMethodologySummary` | Evaluation criteria |
| `BestSoftwareTrust` / `BestSoftwareFaq` | Trust + FAQ |
| `CategoryQuickNav` | Section nav |
| CRM Cost Calculator engine (`calculateProductCost`) | Interactive pricing estimates |
| CRM Finder (linked, not duplicated) | Personalized shortlist |
| Enrichment / assessments / reviews | Evidence sources |

---

## 2. Components created

| File | Purpose |
| --- | --- |
| `best-software-glance-table.tsx` | Product-as-rows comparison + compare checkboxes |
| `best-software-by-need.tsx` | Scenario / need matrix |
| `best-software-tradeoffs.tsx` | Strengths vs limitations |
| `best-software-decision-explore.tsx` | Priority selector → Finder handoff |
| `best-software-pricing-interactive.tsx` | Team size / billing + calculator engine |
| `best-software-buying-framework.tsx` | 5-step choose framework + guide groups + product hubs + research transparency |
| `services/best-page/enrichment-deps.ts` | Pricing, features, scores, screenshots, transparency helpers |

---

## 3. Data sources used

| Source | Fields consumed |
| --- | --- |
| `src/data/seed/best.ts` | Shortlist, rationales, FAQs, decision paths, landscape, buying steps |
| `src/data/editorial/assessments/*.json` | Approved criterion scores, strengths/weaknesses (via scores) |
| `src/data/editorial/reviews/*.json` | Approved overall scores |
| `src/data/research/*/enrichment.json` | Pricing, featureSupport, screenshots, sourceIds |
| `src/data/seed/crm-methodology.ts` | Criterion names/descriptions |
| `src/data/seed/features.ts` | Feature display names |
| Guides catalogue | Grouped buying guides + product-linked guides |
| Comparisons / alternatives seeds | Related commercial pages |

**No invented scores, prices, awards, or feature claims.**

---

## 4. New page section order

1. Hero + fit highlights + top picks panel  
2. Best CRM at a glance (visual cards)  
3. Interactive comparison table  
4. Detailed ranked/shortlist recommendations (deep dives)  
5. Best CRM by need  
6. CRM pricing compared (interactive)  
7. Feature / capability matrix  
8. Trade-offs  
9. Which CRM should I choose? (decision explore → Finder)  
10. Find your CRM (dark CTA)  
11. How to choose (5-step framework + tools)  
12. Popular comparisons  
13. CRM buying guides (grouped)  
14. Individual CRM hubs  
15. How we evaluate + research transparency  
16. Alternatives  
17. FAQ + trust  

---

## 5. Internal links added / reinforced

- `/software/{slug}/`, `/pricing/`, `/features/`  
- `/features/{featureSlug}/` from matrix rows  
- `/use-cases/{slug}/` from by-need cards  
- `/compare/` and `/compare/?products=…`  
- `/alternatives/{slug}/` when alternatives exist  
- `/tools/crm-finder/`, `/tools/crm-cost-calculator/`  
- `/tools/crm-requirements-builder/`, `/tools/crm-vendor-scorecard/`  
- `/guides/…` grouped resources  
- Methodology / independence / disclosure routes  

---

## 6. Structured data changes

- Unchanged pattern: `WebPage` + `BreadcrumbList` + `FAQPage` when FAQ present  
- Still gated on `indexable`  
- **No** AggregateRating / invented award schema  
- **No** SoftwareApplication spam  

---

## 7. SEO changes

- Meta description updated to reflect evidence-backed buying guide  
- H1 remains **Best CRM Software**  
- Canonical remains `/best/crm-software/`  
- ~~`seo.indexable` remains **false** until approved-recommendation quality gate~~ → **Resolved 2026-08-15 / confirmed 2026-08-17:** `seo.indexable: true`, `editorialStatus: approved`, research complete, 13/13 recommendations approved with rationales; content-quality score **91/100 EXCELLENT** (`docs/content-quality/pages/best--crm-software.md`). CQ-BEST-CRM-SOFTWARE-EVIDENCE-5386 closed.  
- FAQ expanded for commercial intent queries  

---

## 8. Performance considerations

- Screenshots use `next/image` with `loading="lazy"` and reserved aspect ratio  
- Interactive pricing / decision explore / glance compare are client islands only  
- Editorial content remains server-rendered for crawlability  
- Pricing snapshots built on server; client runs pure calculator math  

---

## 9. Missing research / data (explicit)

| Gap | Handling |
| --- | --- |
| ~~All `recommendations[].approved: false`~~ | **Resolved 2026-08-15** — 13/13 recommendations approved with ranks + fit badges |
| ~~use-case / decision / verdict unapproved~~ | **Resolved** — awards and decision paths approved |
| ~~`editorialStatus: review-required`~~ | **Resolved** — `approved` + `seo.indexable: true` + research complete |
| ~~Some alternatives pages thin (HubSpot/Attio/Zoho)~~ | **Resolved 2026-08-17** — `alt-hubspot`, `alt-attio`, `alt-zoho-crm` approved + indexable |
| ~~No HubSpot vs Pipedrive relatedComparisonSlug~~ | **Resolved 2026-08-17** — `hubspot-vs-pipedrive` wired into `relatedComparisonSlugs` (research CQ 86 already existed) |
| Hands-on testing `false` everywhere | Scores remain research-grounded editorial judgments |
| ~~Matrix limited to `featureMatrixSlugs` (6 features)~~ | **Resolved 2026-08-17** — expanded to 16 CRM catalogue feature slugs |

**Editorial approval note:** Fit awards (e.g. “Best for pipeline management”, “Best freemium CRM”) are evidence-backed positioning labels — not a claim that Pipedrive has the highest overall score (HubSpot / Freshsales / Salesforce tie at 7.8).

---

## 10. Content opportunities

1. ~~Approve shortlist recommendations + use-case awards when editorial gate passes~~ **Done**  
2. ~~Add HubSpot vs Pipedrive to related comparisons if research supports it~~ **Done** (2026-08-17 polish)  
3. ~~Enrich HubSpot / Attio / Zoho alternatives pages~~ **Done** (`alt-hubspot`, `alt-attio`, `alt-zoho-crm`)  
4. ~~Expand feature matrix slugs toward full CRM capability taxonomy~~ **Done** (16 slugs on best-crm-software)  
5. Annotate more screenshots with capability-specific captions  
6. ~~Flip `seo.indexable` after CQ-BEST-CRM-SOFTWARE-EVIDENCE-5386 closes~~ **Done** (indexable + CQ gate closed 2026-08-17)

### CRM polish pass (2026-08-17)

- Wired existing research comparison `hubspot-vs-pipedrive` into `relatedComparisonSlugs`
- Added approved alternatives pages: `alt-hubspot`, `alt-attio`, `alt-zoho-crm`
- Expanded `featureMatrixSlugs` from 6 → 16 catalogue features

---

## 11. Screenshots / assets still needed

- Prefer pipeline-focused vendor UI shots where caption quality is weak  
- Optional: annotated callout screenshots per top shortlist product  
- Official vendor videos exist in enrichment for some products but are not yet surfaced on this page (backlog)  

---

## 12. Recommended next improvements

1. Editorial approval pass on recommendation awards  
2. Wire vendor video when `media` entries are editorial-approved for public use  
3. Sticky mobile compare bar polish  
4. ItemList JSON-LD only after ranked awards are approved  
5. Re-run content-quality score for `/best/crm-software/`  

---

## Claims that could NOT be implemented (evidence missing)

| Requested claim / UI | Why omitted |
| --- | --- |
| “Best Overall: Pipedrive” (and similar award chips) | Recommendation awards not approved |
| Numeric featureSnapshot scores from best seed before approval | Gated by `rec.approved`; replaced with approved assessment criterion scores |
| Fake Finder match percentages | Explicitly forbidden; Finder handoff only |
| Universal comparison winners | Comparisons say “depends on priorities” |
| Full 22-product deep dives | Only shortlist products with enough researched copy (up to 8) |
| Pseudo-precise radar charts beyond methodology criteria | Used horizontal bars from real criterion scores only |
| Invented evidence-record counts | Transparency metrics derived from enrichment only |

---

## AVAILABLE / DERIVABLE / MISSING (summary)

| Field | Class |
| --- | --- |
| 22 platforms evaluated | AVAILABLE |
| Overall scores (approved) | AVAILABLE |
| 10 criterion scores / product | AVAILABLE |
| Starting price / free plan / trial | AVAILABLE (enrichment) |
| Feature support matrix cells | AVAILABLE |
| Screenshots + captions | AVAILABLE (most shortlist) |
| Strengths / trade-offs | AVAILABLE (best seed + assessments) |
| Approved “Best for X” awards | MISSING (flags false) |
| Ranked #1/#2 public badges | MISSING |
| Indexable publish | MISSING (quality gate) |
