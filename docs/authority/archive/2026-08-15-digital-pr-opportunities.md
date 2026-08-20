# Digital PR Opportunities — Latest

> Agent: **DigitalPROpportunityAgent** · Topic: **CRM / business software / RevOps**
> Generated: 2026-08-15T08:36:05.985Z · Framework v1.0.0
> Live web search required: **yes** · Invents statistics: **no** · Sends outreach: **no**

## Summary

| Metric | Value |
| --- | --- |
| PR ideas (scored) | 9 |
| Ready / near-ready | 9 |
| Deferred (no data support) | 5 |
| Data inventory items | 9 |
| Publication matches | 10 |
| Expert commentary channels | 4 |
| Seasonal hooks | 4 |

## Policy

- Only recommend studies where underlying SoftwareGlimpse data can genuinely support them.
- **Do not invent statistics.**
- Do not invent journalist names — publication matches list outlets and coverage angles from live verification.
- Embeddable assets may require attribution; **never require followed links** as a condition for use.
- Sponsored content is never characterized as independent editorial coverage.
- Report only — this agent does not pitch or publish.

## Existing data inventory

| Asset | Scale | Citeable as | Not citeable as | Source |
| --- | --- | --- | --- | --- |
| CRM list pricing & plan rules | 28 products · 104 plans · 27 with pricing.verifiedAt · free plan 10/28 · free trial 26/28 | Dated SoftwareGlimpse researched set: list prices, team-cost recomputes via pricing engine, free/trial prevalence — with methodology and as… | Market-wide average buyer spend, negotiated discounts, renewal uplift, or longitudinal price histor… | `src/data/research/*/enrichment.json → pricing` |
| Feature availability / plan gating matrix | 444 rows · mix {"supported":341,"higher-plan-only":50,"limited":32,"not-supported":10,"unknown":7,"add-on":4} · top hig… | Share of researched CRMs where specific features are plan-gated or limited — sourced feature matrix, not survey. | Buyer preference rankings or 'most wanted features' without a survey corpus. | `enrichment.featureSupport + src/data/seed/features.ts` |
| CRM AI capability labels | 104 capability rows across 28 products | Which researched CRMs list which AI capability types as supported / limited / gated — availability comparison only. | AI accuracy, ROI, adoption rates, or agent outcome benchmarks (not measured). | `enrichment.aiCapabilities` |
| Editorial vendor assessments | 28 assessment files | SoftwareGlimpse desk-research score distributions with full methodology disclosure (not hands-on lab). | User-review star averages (G2-style), lab-verified performance, or affiliate-influenced rankings. | `src/data/editorial/assessments/*.json + src/data/seed/crm-methodology.ts` |
| Team-size cost calculator engine | Recomputable scenarios (e.g. 5 / 25 / 50 seats) from published plan rules | Modeled list costs at stated team sizes under SG pricing rules — interactive + downloadable tables. | Observed customer invoices or true TCO without user inputs. | `src/services/pricing/* + /tools/crm-cost-calculator/ + fixtures` |
| Implementation & migration planning models | Deterministic planning heuristics — not outcome corpus | Transparent methodology for how SG scores planning complexity (educational). | Empirical 'average CRM migration takes X weeks' without primary research. | `src/services/implementation-planner/* + /tools/crm-*-planner/` |
| Buyer requirements & CRM graph | Structured ontology (framework citation) | Publishable buyer-requirement framework and feature mapping as educational taxonomy. | Prevalence of requirements across real buyers (no survey). | `src/data/crm-graph/* + requirement-detail + seed dimensions` |
| Financial services CRM requirements depth | Deep hub for one industry; others mostly stubs | FS CRM security / requirements checklist research with clear educational framing. | Cross-industry prevalence stats or '% of banks requiring X'. | `src/data/industry-hub/financial-services.ts + FS guides` |
| Sourced facts, sources, product media | Hundreds of sourced facts + media across enrichments | Supporting evidence for product claims with source attribution. | Standalone market statistics detached from sources. | `facts.json / sources.json / enrichment media` |

## Master table

| Priority | PR idea | Data required | Existing data | New research needed | Target audiences | Potential publications | Timeliness | Linkability | Effort | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | CRM Pricing Index 2026 | Public list prices by plan; Billing period (monthly/annual); Currency; As-of / … | enrichment.pricing for 28 products (104 plans); 27/28 with pricing.verifiedAt; Pricing en… | Optional: refresh any stale verifiedAt rows before publish; Explicit … | SMB / mid-market CRM buyers; RevOps / procurement; SaaS journalists c… | Capterra Resources; Sasanova; CompareEdge; CIOPages; Zylo (category e… | High — competing 2026 CRM pricing reports already in market… | EXCELLENT (96) · ready | M | Export dated pricing table + methodology draft; land on /tools/crm-cost-calculator/ and /methodolog… |
| 2 | Which CRM features are most often locked behind higher plans? | featureSupport.availability; feature taxonomy; product coverage | 444 feature-support rows; Availability mix: {"supported":341,"higher-plan-only":50,"limit… | Human QA on ambiguous planSlugs before headline claims | CRM buyers evaluating Starter vs Pro; Consultants; Industry publicati… | Capterra Resources; Sasanova; CRM Curator; CIOPages | Strong whenever vendors re-bundle AI/automation into higher… | EXCELLENT (96) · ready | M | Publish heatmap of feature × availability; lead with forecasting / automation / AI gating; offer do… |
| 3 | How CRM list prices change by team size | Per-seat / flat plan rules; Seat minimums; Feature eligibility at each band | Pricing engine + fixtures (5/25/50 style scenarios); Plan rules across 28 products | Standardize scenario definitions (features required at each band) | Founders / sales leaders planning headcount; Finance / procurement; R… | Sasanova; CompareEdge; Capterra Resources; TechCrunch (data cite) | Peak in Q4 budget season; evergreen for hiring ramps. | EXCELLENT (94) · ready | M | Generate seat-band cost chart + dataset; publish with Cost Calculator CTA; pitch as complementary d… |
| 4 | CRM buyer requirements framework (ontology publication) | CRM graph requirements; feature links; use cases | crm-graph requirements/capabilities/use-cases; Requirements Builder tool; Downloadable re… | Polished visual ontology diagram for embed | CRM professionals; implementation consultants; educators | CIOPages; RevOps newsletters; consultant resource pages | Evergreen educational citation magnet. | STRONG (81) · ready | S | Publish framework page + embeddable diagram; link Requirements Builder and checklist downloads. |
| 5 | Free CRM plans & free trials among researched vendors | hasFreePlan; hasFreeTrial; limits notes | hasFreePlan=10; hasFreeTrial=26 | Optional footnotes on free-plan contact/seat caps from plan.limits | SMB founders; bootstrapped teams; buyer-guide editors | CompareEdge; Capterra Resources; Zylo | Useful for SMB software-planning seasons. | STRONG (73) · ready | S | Ship short data note + chart; cross-link Cost Calculator free/trial filters if available. |
| 6 | CRM AI-feature availability comparison (researched set) | aiCapabilities.capability; availability; sourceIds; notes | 104 AI capability rows; Vendor notes (e.g. assistant names) | Normalize capability taxonomy for apples-to-apples chart; Separate li… | Technology leaders; RevOps evaluating AI SKUs; Trade press covering A… | CRM Curator; MarketScale; Salesforce Break; TechCrunch | Peak around Dreamforce 2026 (Sep 15–17) and ongoing AI-pric… | EXCELLENT (90) · near-ready | M | Normalize AI capability taxonomy; publish availability matrix with Dreamforce news hook; clearly la… |
| 7 | Financial services CRM security & requirements map | FS hub security dimensions; capability priorities; related guides | industry-hub/financial-services.ts; FS CRM guides seed; security checklist resource | Editorial polish + disclaimer (not compliance certification) | FS technology leaders; compliance-aware buyers; industry consultants | FS trade press; CIOPages; industry association resource lists | Steady demand; spikes with regulatory news. | GOOD (68) · near-ready | M | Publish visual security-dimension map + checklist; do not claim certification rates. |
| 8 | SoftwareGlimpse CRM editorial scoreboard (methodology-first) | Approved assessments; crm-methodology criteria; handsOnTesting flags | 28 assessment files; 10 equal-weight criteria seed | Editorial pass to ensure all cited scores are approved; Clear non-aff… | Consultants; buyer-guide authors; educators | CIOPages; industry blogs seeking methodology cites | Evergreen; refresh quarterly with assessment updates. | GOOD (68) · near-ready | M | Ship scoreboard + methodology with Vendor Scorecard tool CTA; never frame as user-review aggregate. |
| 9 | CRM implementation complexity — methodology explainer (not a benchmark study) | complexity driver weights; phase model | implementation-planner complexity rules; Implementation Planner tool; implementation chec… | Primary research if claiming empirical timelines (separate project) | implementation consultants; project managers; educators | consultant blogs; CIOPages | Evergreen methodology cite. | GOOD (63) · near-ready | S | Publish methodology article with interactive planner; explicitly refuse fake 'average weeks' stats. |

## PR ideas detail

### 1. CRM Pricing Index 2026

**Status:** ready · **Linkability:** EXCELLENT (96) · **Effort:** M

Publish a dated index of list prices across SoftwareGlimpse’s researched CRM set (28 products / 104 plans), with methodology, verification dates, and currency notes — not market-wide averages.

| Field | Detail |
| --- | --- |
| Data required | Public list prices by plan; Billing period (monthly/annual); Currency; As-of / verifiedAt dates |
| Existing data available | enrichment.pricing for 28 products (104 plans); 27/28 with pricing.verifiedAt; Pricing engine for consistent recomputes |
| New research needed | Optional: refresh any stale verifiedAt rows before publish; Explicit methodology page stating researched-set scope (not universe) |
| Target audiences | SMB / mid-market CRM buyers; RevOps / procurement; SaaS journalists covering pricing; Consultants building buyer guides |
| Potential publications | Capterra Resources; Sasanova; CompareEdge; CIOPages; Zylo (category example cites) |
| Timeliness | High — competing 2026 CRM pricing reports already in market; SG can differentiate with transparent methodology + calculator. |
| Landing pages | `/tools/crm-cost-calculator/`, `/methodology/`, `/compare/` |
| Recommended next action | Export dated pricing table + methodology draft; land on /tools/crm-cost-calculator/ and /methodology/; prepare embeddable chart with attribution (no follow-link requirement). |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| strong | strong | excellent | excellent | excellent | excellent | excellent | excellent |

**Recommended visuals / embeddables**

- **benchmark-table:** Entry / mid / enterprise list prices by vendor (as-of date) _(embeddable; attribution OK; no follow-link required)_
- **chart:** Distribution of starting list prices across researched set _(embeddable; attribution OK; no follow-link required)_
- **downloadable-dataset:** CSV of plans with verifiedAt and source IDs
- **methodology:** Scope, exclusions, currency, annual vs monthly rules
- **interactive-calculator:** CRM Cost Calculator deep-link for team-size scenarios

**Limitations**

- 28 researched CRM products · 104 plans · 444 feature-support rows (live corpus scan)
- List prices only — not negotiated customer pricing.

### 2. Which CRM features are most often locked behind higher plans?

**Status:** ready · **Linkability:** EXCELLENT (96) · **Effort:** M

Analyze featureSupport availability across the researched set. Current live scan: 50 higher-plan-only rows; top gated include forecasting, email-sequences, workflow-automation.

| Field | Detail |
| --- | --- |
| Data required | featureSupport.availability; feature taxonomy; product coverage |
| Existing data available | 444 feature-support rows; Availability mix: {"supported":341,"higher-plan-only":50,"limited":32,"not-supported":10,"unknown":7,"add-on":4}; Canonical feature seed |
| New research needed | Human QA on ambiguous planSlugs before headline claims |
| Target audiences | CRM buyers evaluating Starter vs Pro; Consultants; Industry publications covering packaging |
| Potential publications | Capterra Resources; Sasanova; CRM Curator; CIOPages |
| Timeliness | Strong whenever vendors re-bundle AI/automation into higher tiers. |
| Landing pages | `/tools/crm-finder/`, `/tools/crm-vendor-scorecard/`, `/resources/crm-comparison-worksheet/` |
| Recommended next action | Publish heatmap of feature × availability; lead with forecasting / automation / AI gating; offer downloadable matrix + methodology. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| excellent | excellent | strong | strong | excellent | excellent | excellent | excellent |

**Recommended visuals / embeddables**

- **chart:** Bar chart: features by higher-plan-only count _(embeddable; attribution OK; no follow-link required)_
- **visual-comparison:** Heatmap vendor × feature availability _(embeddable; attribution OK; no follow-link required)_
- **downloadable-dataset:** Feature gating CSV with sourceIds

**Limitations**

- Describes researched set packaging — not buyer preference rankings.

### 3. How CRM list prices change by team size

**Status:** ready · **Linkability:** EXCELLENT (94) · **Effort:** M

Recompute comparable monthly/annual costs at fixed seat bands (e.g. 5 / 25 / 50) using SG pricing rules — shows scaling cliffs without inventing discounts.

| Field | Detail |
| --- | --- |
| Data required | Per-seat / flat plan rules; Seat minimums; Feature eligibility at each band |
| Existing data available | Pricing engine + fixtures (5/25/50 style scenarios); Plan rules across 28 products |
| New research needed | Standardize scenario definitions (features required at each band) |
| Target audiences | Founders / sales leaders planning headcount; Finance / procurement; RevOps |
| Potential publications | Sasanova; CompareEdge; Capterra Resources; TechCrunch (data cite) |
| Timeliness | Peak in Q4 budget season; evergreen for hiring ramps. |
| Landing pages | `/tools/crm-cost-calculator/`, `/resources/crm-evaluation-checklist/` |
| Recommended next action | Generate seat-band cost chart + dataset; publish with Cost Calculator CTA; pitch as complementary data to existing cliff analyses (e.g. HubSpot-style discontinuities) without copying others’ stats. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| strong | strong | strong | excellent | excellent | excellent | excellent | excellent |

**Recommended visuals / embeddables**

- **chart:** Cost vs seats lines for major researched CRMs _(embeddable; attribution OK; no follow-link required)_
- **visual-comparison:** Side-by-side 10-seat vs 50-seat total list cost _(embeddable; attribution OK; no follow-link required)_
- **embeddable-chart:** iframe/SVG chart with SoftwareGlimpse attribution _(embeddable; attribution OK; no follow-link required)_

**Limitations**

- Modeled list cost — not true TCO.

### 4. CRM buyer requirements framework (ontology publication)

**Status:** ready · **Linkability:** STRONG (81) · **Effort:** S

Publish the requirements → capabilities → features graph as a citeable educational framework for RFPs and consultants.

| Field | Detail |
| --- | --- |
| Data required | CRM graph requirements; feature links; use cases |
| Existing data available | crm-graph requirements/capabilities/use-cases; Requirements Builder tool; Downloadable requirements templates |
| New research needed | Polished visual ontology diagram for embed |
| Target audiences | CRM professionals; implementation consultants; educators |
| Potential publications | CIOPages; RevOps newsletters; consultant resource pages |
| Timeliness | Evergreen educational citation magnet. |
| Landing pages | `/tools/crm-requirements-builder/`, `/resources/crm-requirements-template/`, `/resources/crm-rfp-template/` |
| Recommended next action | Publish framework page + embeddable diagram; link Requirements Builder and checklist downloads. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| strong | strong | good | good | strong | strong | excellent | excellent |

**Recommended visuals / embeddables**

- **map:** Requirements → features ontology diagram _(embeddable; attribution OK; no follow-link required)_
- **downloadable-dataset:** Requirements checklist CSV

**Limitations**

- Framework citation — not survey prevalence.

### 5. Free CRM plans & free trials among researched vendors

**Status:** ready · **Linkability:** STRONG (73) · **Effort:** S

Report prevalence of free plans (10/28) and free trials (26/28) in the SG corpus — clear, citeable, no survey needed.

| Field | Detail |
| --- | --- |
| Data required | hasFreePlan; hasFreeTrial; limits notes |
| Existing data available | hasFreePlan=10; hasFreeTrial=26 |
| New research needed | Optional footnotes on free-plan contact/seat caps from plan.limits |
| Target audiences | SMB founders; bootstrapped teams; buyer-guide editors |
| Potential publications | CompareEdge; Capterra Resources; Zylo |
| Timeliness | Useful for SMB software-planning seasons. |
| Landing pages | `/tools/crm-finder/`, `/tools/crm-cost-calculator/` |
| Recommended next action | Ship short data note + chart; cross-link Cost Calculator free/trial filters if available. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| good | good | good | strong | good | strong | strong | excellent |

**Recommended visuals / embeddables**

- **chart:** Share of researched CRMs with free plan vs trial _(embeddable; attribution OK; no follow-link required)_

### 6. CRM AI-feature availability comparison (researched set)

**Status:** near-ready · **Linkability:** EXCELLENT (90) · **Effort:** M

Compare AI capability labels across enrichments (104 rows) — what vendors claim as supported / limited / gated — timed for Dreamforce / Agentforce news cycles.

| Field | Detail |
| --- | --- |
| Data required | aiCapabilities.capability; availability; sourceIds; notes |
| Existing data available | 104 AI capability rows; Vendor notes (e.g. assistant names) |
| New research needed | Normalize capability taxonomy for apples-to-apples chart; Separate list-price AI add-ons where pricing enrichment allows — do not invent credit costs |
| Target audiences | Technology leaders; RevOps evaluating AI SKUs; Trade press covering Agentforce / Breeze / Freddy |
| Potential publications | CRM Curator; MarketScale; Salesforce Break; TechCrunch |
| Timeliness | Peak around Dreamforce 2026 (Sep 15–17) and ongoing AI-pricing coverage. |
| Landing pages | `/tools/crm-finder/`, `/compare/`, `/methodology/` |
| Recommended next action | Normalize AI capability taxonomy; publish availability matrix with Dreamforce news hook; clearly label as packaging/availability — not performance. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| strong | strong | excellent | excellent | strong | strong | excellent | strong |

**Recommended visuals / embeddables**

- **visual-comparison:** AI capability × vendor availability matrix _(embeddable; attribution OK; no follow-link required)_
- **methodology:** What 'supported' means in SG enrichment

**Limitations**

- Availability labels ≠ quality, accuracy, or ROI.
- Do not invent token/credit consumption figures.

### 7. Financial services CRM security & requirements map

**Status:** near-ready · **Linkability:** GOOD (68) · **Effort:** M

Package the deep FS industry hub as a citeable educational scorecard for regulated buyers — one industry where SG already has depth.

| Field | Detail |
| --- | --- |
| Data required | FS hub security dimensions; capability priorities; related guides |
| Existing data available | industry-hub/financial-services.ts; FS CRM guides seed; security checklist resource |
| New research needed | Editorial polish + disclaimer (not compliance certification) |
| Target audiences | FS technology leaders; compliance-aware buyers; industry consultants |
| Potential publications | FS trade press; CIOPages; industry association resource lists |
| Timeliness | Steady demand; spikes with regulatory news. |
| Landing pages | `/industries/financial-services/`, `/resources/crm-security-checklist/` |
| Recommended next action | Publish visual security-dimension map + checklist; do not claim certification rates. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| good | good | good | good | strong | good | strong | strong |

**Recommended visuals / embeddables**

- **map:** FS CRM security dimensions visual _(embeddable; attribution OK; no follow-link required)_
- **benchmark-table:** Capability priority table for FS buyers _(embeddable; attribution OK; no follow-link required)_

**Limitations**

- Educational framework — not audit results or market prevalence.

### 8. SoftwareGlimpse CRM editorial scoreboard (methodology-first)

**Status:** near-ready · **Linkability:** GOOD (68) · **Effort:** M

Publish criterion distributions from 28 editorial assessments with full methodology — desk research, handsOnTesting disclosed.

| Field | Detail |
| --- | --- |
| Data required | Approved assessments; crm-methodology criteria; handsOnTesting flags |
| Existing data available | 28 assessment files; 10 equal-weight criteria seed |
| New research needed | Editorial pass to ensure all cited scores are approved; Clear non-affiliate ranking disclaimer |
| Target audiences | Consultants; buyer-guide authors; educators |
| Potential publications | CIOPages; industry blogs seeking methodology cites |
| Timeliness | Evergreen; refresh quarterly with assessment updates. |
| Landing pages | `/tools/crm-vendor-scorecard/`, `/methodology/`, `/resources/crm-vendor-scorecard/` |
| Recommended next action | Ship scoreboard + methodology with Vendor Scorecard tool CTA; never frame as user-review aggregate. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| good | good | good | good | strong | good | strong | strong |

**Recommended visuals / embeddables**

- **chart:** Overall score distribution across assessed CRMs _(embeddable; attribution OK; no follow-link required)_
- **methodology:** 10 criteria definitions + desk-research scope

**Limitations**

- Desk research — not hands-on lab or user reviews.

### 9. CRM implementation complexity — methodology explainer (not a benchmark study)

**Status:** near-ready · **Linkability:** GOOD (63) · **Effort:** S

Explain how SG’s Implementation Planner scores complexity drivers. Useful for education/citations; NOT an empirical duration study.

| Field | Detail |
| --- | --- |
| Data required | complexity driver weights; phase model |
| Existing data available | implementation-planner complexity rules; Implementation Planner tool; implementation checklist resource |
| New research needed | Primary research if claiming empirical timelines (separate project) |
| Target audiences | implementation consultants; project managers; educators |
| Potential publications | consultant blogs; CIOPages |
| Timeliness | Evergreen methodology cite. |
| Landing pages | `/tools/crm-implementation-planner/`, `/resources/crm-implementation-checklist/` |
| Recommended next action | Publish methodology article with interactive planner; explicitly refuse fake 'average weeks' stats. |

**Linkability dimensions**

| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| good | good | low | good | good | good | strong | excellent |

**Recommended visuals / embeddables**

- **methodology:** Complexity driver diagram _(embeddable; attribution OK; no follow-link required)_

**Limitations**

- Not an empirical implementation-duration benchmark.

## Deferred ideas (insufficient data)

| Idea | Why deferred |
| --- | --- |
| CRM buyer requirements survey | No survey/panel corpus in SoftwareGlimpse — would invent prevalence statistics if published now. |
| CRM implementation complexity benchmark (empirical) | Only deterministic planning heuristics exist — no measured timeline/failure corpus. |
| CRM migration readiness benchmark (empirical) | Migration Planner is a planning model, not observed migration outcomes. |
| Longitudinal CRM Pricing Index (YoY price change study) | No historical pricing snapshots stored for trend analysis yet. |
| CRM integration landscape report | integrationSupport rows are too sparse vs real marketplaces for a serious landscape study. |

## Publication / coverage matches

| Publication | Recent coverage angle | Author (if verified) | Source URL | Verified |
| --- | --- | --- | --- | --- |
| Capterra Resources | Guide to CRM software pricing models — subscription tiers, upfront/recurring costs, how pricing changes with growth (2026 Shortlist context… | — | https://www.capterra.com/resources/customer-relationship-management-software-pricing-models/ | 2026-08-15 |
| Sasanova | State of CRM Pricing Q1 2026 — per-seat tables by team size, HubSpot cliff analysis, Salesforce list-price increases. | — | https://www.sasanova.com/guides/state-of-crm-pricing-q1-2026 | 2026-08-15 |
| CompareEdge | CRM Pricing Report 2026 — entry prices, free-tier prevalence, multi-vendor comparison tables. | — | https://comparedge.com/reports/crm-pricing-2026 | 2026-08-15 |
| Zylo | 2026 SaaS pricing trends — AI monetization, hybrid/consumption layers, budget predictability vs usage meters. | — | https://zylo.com/blog/saas-pricing-trends | 2026-08-15 |
| TechCrunch | AI SaaS investor preferences — notes rigid per-seat models harder to defend; consumption/hybrid pricing context (Mar 2026). | — | https://techcrunch.com/2026/03/01/investors-spill-what-they-arent-looking-for-anymore-in-ai-saas-companies/ | 2026-08-15 |
| CIOPages | CRM buyer guide — per-user tiers plus AI agent consumption; TCO drivers beyond list seat price. | — | https://www.ciopages.com/buyer-guides/crm-platform | 2026-08-15 |
| CRM Curator | CRM AI pricing shake-out 2026 — seats, tokens, outcomes; Agentforce / hybrid meter discussion. | — | https://crmcurator.com/articles/general/crm-vendor-ai-pricing-shake-out-2026/ | 2026-08-15 |
| Salesforce Break | Agentforce pricing tiers explained (Jul 2026) — Flex Credits, conversations, edition bundles. | — | https://salesforcebreak.com/2026/07/17/agentforce-pricing-tiers-explained/ | 2026-08-15 |
| MarketScale | Dreamforce 2026 preview — Agentic Enterprise, Agentforce, Data 360; Sept 15–17 San Francisco timing. | — | https://www.marketscale.com/industries/software-and-technology/dreamforce-2026-puts-the-agentic-enterprise-on-trial-in-san-francisco-this-september | 2026-08-15 |
| PressVerified | 2026 comparison of journalist source-request platforms (Featured, Qwoted, Help A B2B Writer, Source of Sources). | — | https://pressverified.com/blog/after-haro-source-request-platforms-tested-2026 | 2026-08-15 |

_Journalist/author names omitted unless observed on the live page — no invented names._

## Expert commentary opportunities

| Platform | Notes | Cost notes | Source URL | Verified |
| --- | --- | --- | --- | --- |
| Featured.com (incl. HARO brand relaunch) | Live research (2026): Featured.com runs curated expert roundups; HARO brand relaunched under Featured ownership as free journalist-request digests — pitch only… | Free digests reported; Featured Pro tiers ~$99–$149/mo in 2026 roundups | https://featured.com/ | 2026-08-15 |
| Qwoted | Verified journalist ↔ expert marketplace; B2B/tech queries common — use for software-buying insights with sourced SG figures, not invented stats. | Free tier with limits; Pro tiers reported in 2026 comparisons | https://www.qwoted.com/ | 2026-08-15 |
| Help A B2B Writer | Niche B2B source requests (lower volume). Good fit for CRM/RevOps buying commentary when queries match. Acquired by Superpath; free source registration remains… | Reported free for sources | https://helpab2bwriter.com/ | 2026-08-15 |
| Source of Sources (coverage) | Peter Shankman post-HARO source network described in 2026 platform tests — public requests; higher spam risk per reviews — filter carefully. Use PressVerified … | Free + optional early-access tier reported | https://pressverified.com/blog/after-haro-source-request-platforms-tested-2026 | 2026-08-15 |

## Seasonal / news hooks

### Dreamforce 2026 — Agentic Enterprise / Agentforce news cycle

- **Window:** 2026-09-15 → 2026-09-17 (plus ±2 weeks news window)
- **Related ideas:** pr-ai-feature-comparison, pr-pricing-index
- **Source:** https://www.marketscale.com/industries/software-and-technology/dreamforce-2026-puts-the-agentic-enterprise-on-trial-in-san-francisco-this-september
- Pair AI-capability availability study + list-price vs AI-add-on framing; do not invent Agentforce usage stats.

### Q4 budget / year-end software planning season

- **Window:** Oct–Dec annually (peak Nov–Jan renewals)
- **Related ideas:** pr-pricing-index, pr-team-size-pricing, pr-plan-gating
- Natural demand for team-size cost tables, plan-gating cliffs, free/trial prevalence.

### Ongoing CRM AI pricing / consumption-meter coverage

- **Window:** Ongoing through 2026 (post Agentforce SKU changes)
- **Related ideas:** pr-ai-feature-comparison, pr-pricing-index
- **Source:** https://crmcurator.com/articles/general/crm-vendor-ai-pricing-shake-out-2026/
- Media already covering seats/tokens/outcomes — SG can contribute researched availability + list-price structure, not outcome ROI claims.

### Annual SaaS pricing-trend roundups

- **Window:** Q1 reports + mid-year trend pieces
- **Related ideas:** pr-free-trial-prevalence, pr-plan-gating
- **Source:** https://zylo.com/blog/saas-pricing-trends
- Contribute CRM-category slices from SG corpus when trend pieces need concrete category examples.

## Queries run

- `CRM pricing 2026 journalist coverage SaaS pricing trends`
- `expert commentary request CRM software AI SaaS 2026 Help a Reporter Out`
- `Featured.com Qwoted HARO expert sources SaaS CRM`
- `CRM buying guide pricing comparison Capterra`
- `Dreamforce 2026 Salesforce AI announcement`
- `SaaS Pricing Trends to Watch in 2026 Zylo`
- `State of CRM Pricing Q1 2026`
- `CRM AI Pricing Shake-Out 2026`

## Limitations

- Report only — never invents statistics, never pitches journalists, never publishes assets.
- PR ideas marked ready/near-ready are limited to dimensions present in SoftwareGlimpse research corpora.
- Publication matches list outlets + coverage angles from live verification; journalist names only when verified on-page.
- Embeddable assets should require attribution at most — never followed links as a usage condition.
- Refresh live publication/commentary matches and re-scan enrichment before treating opportunities as current.
- Corpus scan: 28 products · 104 plans · 444 feature-support rows.

---

Regenerate: `npm run authority:digital-pr` · Schema 1.0.0
