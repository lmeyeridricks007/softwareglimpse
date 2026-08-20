# Authority Intelligence — Methodology

Version: **1.0.0**  
Orchestrator: **AuthorityIntelligenceOrchestrator**  
Contract: **evaluate / recommend only** — no automated outreach or production mutation.

---

## 1. Purpose

Build a reusable system that helps SoftwareGlimpse answer:

- Where can we realistically **earn** links?
- Which pages are most **linkable**?
- Which sites are actually **relevant**?
- Which **free** opportunities should we pursue first?
- Which **paid** opportunities could be worthwhile for **exposure** (not rankings)?
- Which opportunities are **risky/spammy** and should be avoided?
- What **outreach angle** would make sense (draft only)?
- What **content/assets** should we create to earn more links?
- Where should SoftwareGlimpse be **listed**?
- Which journalists / newsletters / podcasts / communities might care?
- Which partners / vendors could naturally reference us?
- What **promotion channels** generate visibility even without SEO link equity?

---

## 2. Opportunity types (canonical)

| Type | Typical intent |
| --- | --- |
| EARNED_EDITORIAL_LINK | Natural editorial citation |
| RESOURCE_PAGE | Inclusion on curated resource lists |
| REFERENCE_LINK | Reference / citation style links |
| DATA_CITATION | Stats / research citations |
| TOOL_CITATION | Interactive tool mentions |
| TEMPLATE_CITATION | Checklist / template / scorecard citations |
| JOURNALIST_SOURCE | Press / reporter sourcing |
| EXPERT_CONTRIBUTION | Expert quotes / commentary |
| PODCAST | Episode / show-notes visibility |
| NEWSLETTER | Editorial newsletter features |
| GUEST_CONTRIBUTION | Genuine contributed expertise (not bulk networks) |
| PARTNERSHIP | Mutual partnership references |
| VENDOR_ECOSYSTEM | CRM vendor blogs / partner hubs |
| INTEGRATION_PARTNER | Integration marketplace / partner pages |
| DIRECTORY | General directories |
| SOFTWARE_DIRECTORY | Software review directories |
| STARTUP_DIRECTORY | Startup catalogs |
| PROFESSIONAL_DIRECTORY | Professional / practitioner directories |
| COMMUNITY | Communities (careful — UGC) |
| FORUM | Forums (careful — UGC) |
| ACADEMIC_EDUCATIONAL | .edu / training resources |
| ASSOCIATION | Industry associations |
| EVENT | Event pages |
| WEBINAR | Webinar resource lists |
| CONFERENCE | Conference partner / resource pages |
| SPONSORSHIP | Event/content sponsorship |
| PAID_NEWSLETTER | Sponsored newsletter placements |
| PAID_DIRECTORY | Paid directory listings |
| PAID_CONTENT_DISTRIBUTION | Paid distribution networks (exposure-framed) |
| PAID_ADVERTISING | Ads (referral/brand) |
| PR_OUTREACH | PR / media relations |
| BROKEN_LINK_REPLACEMENT | Replace dead utility links |
| UNLINKED_MENTION | Brand mention without link |
| COMPETITOR_LINK_GAP | Sites linking to competitors but not us |

---

## 3. Link acquisition classification

Every opportunity carries:

### `acquisitionType`

| Value | Meaning |
| --- | --- |
| EARNED | No payment; editorial merit |
| OWNED_PROFILE | We control the listing/profile |
| CONTRIBUTED | We contribute expertise/content |
| PARTNERSHIP | Relationship-driven |
| PAID | Money changes hands |
| UGC | User-generated contexts |
| UNKNOWN | Unclear |

### `expectedLinkTreatment`

| Value | Meaning |
| --- | --- |
| EDITORIAL | Natural citation |
| SPONSORED | Disclosed paid |
| NOFOLLOW | Explicitly nofollow |
| UGC | User-generated rel |
| UNKNOWN | Not verified |

### `likelyFollowStatus`

`follow` | `nofollow` | `sponsored` | `ugc` | `unknown`

**Do not assume paid = SEO link equity.**

---

## 4. Google-compliance / spam-risk policy

### Hard reject (primary value = manipulative links)

Mark **AVOID — LINK SPAM RISK** when the primary proposition is:

- Pay $X for a dofollow backlink
- Large-scale guest-post placement networks
- Private blog networks (PBNs)
- Automated link insertion / niche-edit packages sold for rankings
- Expired-domain link schemes
- Mass article syndication for anchor-rich links
- Sitewide footer links purchased for ranking
- Link exchanges at scale

Implementation: `src/services/authority-intelligence/compliance.ts`

### Allowed paid opportunities

Paid promotions may be **recommended** when:

1. Primary value is **audience exposure / referral / brand**
2. Link treatment is **sponsored**, **nofollow**, or clearly qualified
3. Compliance does **not** match link-spam patterns

Example: niche newsletter sponsorship featuring CRM Finder with disclosure.

---

## 5. Opportunity model

Conceptual `AuthorityOpportunity` (Zod: `AuthorityOpportunitySchema`):

| Field group | Fields |
| --- | --- |
| Identity | `id`, `type`, `acquisitionType`, `domain`, `organization`, `url`, `opportunityUrl?` |
| Targets | `targetSoftwareGlimpsePage?`, `targetCluster?`, `targetAssetIds` |
| Fit | `relevance`, `audienceFit` |
| Narrative | `opportunityDescription`, `reasonWhyTheyMightLink`, `suggestedPitchAngle?` |
| Link economics | `expectedLinkTreatment`, `likelyFollowStatus` |
| Value bands | `seoValue`, `referralValue`, `brandValue`, `relationshipValue` |
| Cost / effort | `estimatedEffort`, `estimatedCost?`, `recurringCost?`, `difficulty`, `likelihood` |
| Quality / risk | `sourceQuality`, `spamRisk`, `complianceFlags` |
| Paths | `contactPath?`, `submissionPath?` |
| Scoring | `scoreBand`, `scoreNormalized?`, `scoreBreakdown?` |
| Lifecycle | `discoveredAt`, `verifiedAt?`, `status` |
| External metrics | `externalMetrics?` (DA/DR optional, **not ranking truth**) |

Stable IDs: `AUT-{TYPE}-{DOMAIN}-{HASH}` (not sort-order dependent).

---

## 6. External authority metrics (contextual only)

If third-party metrics exist (Moz DA, Ahrefs DR, etc.):

- Store under `externalMetrics`
- Always treat as **provider-specific estimates**
- **Never** claim they are Google ranking factors
- **Never** invent them when unavailable
- Prefer: relevance, real audience, editorial quality, organic visibility if measurable, site quality, placement, traffic potential, relationship value

Site Intelligence already excludes off-site authority from Overall Website Quality (H) and uses `AuthorityLimitations` as a Ranking Opportunity constraint only.

---

## 7. Opportunity scoring

Transparent composite → band + optional 0–100.

### Inputs

| Factor | Role |
| --- | --- |
| Relevance | Topical fit to CRM / B2B software evaluation |
| Editorial legitimacy | Real publication quality |
| Audience overlap | Buyer / practitioner overlap |
| Referral value | Likely qualified visits |
| SEO value | Potential equity **if** editorial/follow — scored separately |
| Target-page fit | Deep link to tool/resource vs homepage |
| Likelihood | Realistic chance of success |
| Effort | Time/complexity penalty |
| Cost | Paid burden penalty |
| Spam risk | Hard penalty / force AVOID |

### Bands

`EXCELLENT` | `STRONG` | `GOOD` | `LOW` | `AVOID`

No fake precision: bands are the decision surface; normalized score is optional context.

Implementation: `src/services/authority-intelligence/scoring.ts`

---

## 8. Target page selection

**Do not default to the homepage.**

Prefer linkable magnets:

### Tools (registry)

- CRM Finder
- CRM Vendor Scorecard
- CRM Cost Calculator / TCO Calculator
- Requirements Builder
- Implementation Planner
- Migration Planner

### Resources

- Evaluation / demo / security / optimization checklists
- Requirements / RFP / business case / migration templates
- Vendor scorecard downloads
- Training / go-live plans

### Guides & research

- What is CRM, types of CRM, glossary, how to choose
- Comparison research, methodology pages
- Original statistics / datasets (create if missing — see content gaps)

Inventory: `inventoryLinkableAssets()` → `docs/authority/reports/linkable-assets-latest.md`

---

## 9. Agents & qualification process

| Agent | Job | Must not |
| --- | --- | --- |
| **AuthorityDiscoverAgent** | Seed + query-pack hypotheses; optional live hits | Contact anyone |
| **AuthorityVerifyAgent** | Mark verification state / placeholder notes | Submit forms |
| **AuthorityQualifyAgent** | Compliance + scoring + target asset attach | Buy anything |
| **AuthorityRecommendAgent** | Free-first / paid-exposure / avoid queues + content gaps | Acquire links |
| **AuthorityDraftAnglesAgent** | Human-only pitch drafts | Send email / post |

### Qualification flow

```text
seed/live hit
  → compliance gate (reject link spam)
  → score bands
  → attach linkable targets
  → free-first vs paid-exposure vs avoid
  → draft angles for GOOD+
```

---

## 10. Outreach lifecycle

```text
DISCOVER
  → VERIFY
  → QUALIFY
  → RECOMMEND
  → DRAFT ANGLES
  → HUMAN SELECTS
  → HUMAN OUTREACH / LISTING / SPONSORSHIP (outside platform)
  → RECHECK (diff snapshot)
```

Statuses: `discovered` → `verified` → `qualified` → `recommended` → `drafted` | `deferred` | `dismissed` | `avoid` | `stale`

Authority Intelligence **stops at draft angles**. Explicit user action outside this system is required for any real-world contact.

---

## 11. Reporting

Master report sections:

1. Executive summary + change tracking
2. Non-negotiable compliance rules
3. Site Intelligence `AuthorityLimitations` bridge
4. Top recommendations
5. Free-first queue
6. Paid exposure candidates
7. AVOID — LINK SPAM RISK
8. Linkable assets
9. Content gaps for earning links
10. Outreach angles (human only)
11. Discovery query packs
12. Re-check commands

Child reports mirror queues for operational triage.

### Diff kinds

`NEW` · `STILL OPEN` · `IMPROVED` · `REGRESSED` · `RESOLVED` · `AVOIDED`

---

## 12. Live web search

Foundational mode uses a **curated CRM-niche seed catalog** plus **query packs** for manual or future provider execution.

Live search may append opportunities via `liveHits` on Discover **without** enabling outreach.

Query pack themes:

- Resource pages
- Tool citations
- Journalist sources
- Directories
- Newsletters / podcasts

---

## 13. Integration with Site Intelligence

`toAuthorityLimitations(opportunities)` produces:

- `status: available`
- confidence based on strong opportunity depth
- `impactOnOpportunity`: `supporting` | `constraining` | `neutral-unknown`
- known gaps: no invented backlink index / DA

Feed into `evaluateSiteIntelligence` when composing live site assessments. Do **not** fold into Overall Website Quality (H).

---

## 14. Tests (required)

`src/services/authority-intelligence/authority-intelligence.test.ts` covers:

1. Reject pay-for-dofollow / link-equity purchase
2. Allow paid sponsored exposure
3. Reject bulk guest-post signals
4. Scoring forces AVOID on link-spam
5. Linkable inventory includes tools/resources; homepage low
6. Full agent pipeline without outreach flags
7. Orchestrator `--no-write` end-to-end

---

## 15. Out of scope (foundational)

- Automated email / CRM outreach sequences
- Purchasing or negotiating placements
- Live Ahrefs/Moz API wiring (schema-ready via `externalMetrics`)
- Auto-creating research datasets or pages
- Claiming ranking predictions from opportunity scores

---

## 16. EarnedBacklinkOpportunityAgent (live web)

Name: **EarnedBacklinkOpportunityAgent**  
CLI: `npm run authority:earned`  
Contract: live-verified hits only — **do not invent opportunities**.

### Inputs

- Live web/search hits (`LiveSearchHit`) captured with approved search capability
- Linkable SG tools/resources/guides
- Existing authority / content / SEO intelligence context (human-guided topic: CRM)

### Finds

Resource pages · reference/citation fits · broken-link replacements (when verified) · tool citations · template/checklist citations · associations · educational hubs · competitor link-gap (complementary vs replacement) · unlinked mentions

### Outputs

| Path | Role |
| --- | --- |
| `docs/authority/EARNED-BACKLINK-OPPORTUNITIES-LATEST.md` | Top 50 master table |
| `docs/authority/earned-backlink-rejects-latest.md` | Investigated but rejected |
| `docs/authority/earned/[domain].md` | Per-domain detail |

### Reject reasons

Irrelevant · Spammy · Paid link scheme · Low quality · No editorial value · No actual submission route · Outdated · Vendor-locked competitor asset · Direct competitor selling same artifact · Own property / not third-party · Insufficient live verification

Refresh the hit catalog with a new live search pass before treating opportunities as current.

---

## 17. PaidPromotionOpportunityAgent (live web)

Name: **PaidPromotionOpportunityAgent**  
CLI: `npm run authority:paid`  
Contract: live-verified hits only — **report only; never purchase**. Paid SEO / dofollow link buys are **not** the objective.

### Inputs

- Live web/search hits (`PaidLiveHit`) with verified sponsorship / advertising pages
- Linkable SG tools/resources (landing targets for experiments)
- Link policy: expected treatment **SPONSORED** | **NOFOLLOW** | **UNKNOWN**

### Finds

Newsletter sponsorships · podcast ads · community/partner sponsorships · event sponsorships · directory **visibility** (not paid SEO links) · webinar/conference packages · native / sponsored editorial (labeled, never as independent coverage) · paid social channels

### Link-scheme rejects

Offers pitching **dofollow**, **SEO link juice**, or guaranteed ranking links → **AVOID — LINK SCHEME RISK**.

### Outputs

| Path | Role |
| --- | --- |
| `docs/authority/PAID-PROMOTION-OPPORTUNITIES-LATEST.md` | Master table + budget tiers + best paid experiments |
| `docs/authority/archive/YYYY-MM-DD-paid-promotion-opportunities.md` | Dated snapshot |

### Budget tiers

€0 · €1–250 · €250–1,000 · €1,000–5,000 · €5,000+ · otherwise **PRICE UNKNOWN** (published costs only).

### Experiments

“Best paid experiments” are tests (sessions, downloads, Finder starts, newsletter signup, branded search lift) — not “buy these links.”

Refresh the paid hit catalog with a new live search pass before treating opportunities as current.

---

## 18. DigitalPROpportunityAgent (live web + corpus scan)

Name: **DigitalPROpportunityAgent**  
CLI: `npm run authority:digital-pr`  
Contract: recommend only studies the SoftwareGlimpse corpus can support — **never invent statistics**; **never pitch**.

### Inputs

- Live scan of `src/data/research/*/enrichment.json` (+ editorial assessments)
- Live-verified publication / expert-commentary / seasonal matches
- Linkable tools/resources as landing targets

### Finds

Data-led PR ideas (pricing index, team-size costs, plan-gating, AI availability, frameworks) · publication coverage matches · expert commentary platforms · seasonal hooks · embeddable chart/dataset recommendations (attribution OK; **no follow-link requirement**)

### Deferred when data missing

Buyer surveys · empirical implementation/migration benchmarks · longitudinal price history · sparse integration landscape studies

### Outputs

| Path | Role |
| --- | --- |
| `docs/authority/DIGITAL-PR-OPPORTUNITIES-LATEST.md` | Inventory + master table + pubs + commentary + hooks |
| `docs/authority/archive/YYYY-MM-DD-digital-pr-opportunities.md` | Dated snapshot |

Refresh corpus scan + live matches before treating opportunities as current.

---

## 19. PartnershipOpportunityAgent (live web)

Name: **PartnershipOpportunityAgent**  
CLI: `npm run authority:partnerships`  
Contract: genuine mutual-value collaboration only — **never contacts partners**; **rejects mass link exchange**; **never misrepresents SG as an SI**.

### Partner types

CRM consultants · implementation partners · RevOps / sales consultancies · digital transformation · SaaS / IT advisory · coaches · accelerators · SMB associations · training · tech communities · software vendors · integration providers · industry alliances

### Models

Co-authored guides · webinars · expert interviews · benchmarks · tool/resource sharing · checklist collab · directory/resource inclusion · newsletter/podcast · data/research contribution · workshops · vendor-ecosystem content (with SI caveats)

### Rejects

| Reason | Meaning |
| --- | --- |
| `REJECT — MASS LINK EXCHANGE` | “You link to me / I link to you” as primary model |
| Misrepresentation risk (SI/partner claim) | False HubSpot/Zoho/Pipedrive Solutions Partner enrollment |

### Outputs

| Path | Role |
| --- | --- |
| `docs/authority/PARTNERSHIP-OPPORTUNITIES-LATEST.md` | Master table + detail + rejects |
| `docs/authority/archive/YYYY-MM-DD-partnership-opportunities.md` | Dated snapshot |

Refresh live hits before treating opportunities as current.

---

## 21. AuthorityVisibilityIntelligenceOrchestrator

Name: **AuthorityVisibilityIntelligenceOrchestrator**  
CLI: `npm run authority:intelligence` · alias `npm run authority:audit`

Runs specialized agents, consumes site/content/asset intelligence paths, writes:

| Path | Role |
| --- | --- |
| `docs/authority/AUTHORITY-VISIBILITY-LATEST.md` | Master report |
| `docs/authority/archive/YYYY-MM-DD-authority-visibility.md` | Archive |
| `docs/authority/AUTHORITY-VISIBILITY-SYSTEM.md` | Agents/commands/schedule |
| `docs/authority/tracking/visibility-snapshot-latest.json` | History snapshot |
| `docs/authority/tracking/link-acquisitions.json` | Evidence-only won links |

Tracking statuses: NEW · CONTACTED · IN_PROGRESS · WON · DECLINED · EXPIRED · DISMISSED · LOST  

WON requires acquisition evidence — never invented.

---

## 20. ContentPromotionOpportunityAgent

Name: **ContentPromotionOpportunityAgent**  
CLI: `npm run authority:promote`  
Contract: audience-fit distribution plans — **never posts**; **never generates all creative assets**; **community-safe**.

### Inputs consumed (when present)

Content map · Ranking opportunities · Content quality · Earned / Paid / Digital PR / Partnership authority reports · Tools registry · Resources seed

### Outputs per priority asset

Audience · Primary channels · Promotion angle (insight-led) · Repurposing ideas · Expected outcome · Effort · Paid/free · Measurement

### Also

Major tool launch plans (Finder, Cost Calculator, Requirements Builder, Vendor Scorecard, Migration Planner) · Rejected unsafe tactics

### Outputs

| Path | Role |
| --- | --- |
| `docs/authority/PROMOTION-OPPORTUNITIES-LATEST.md` | Master promotion + launch plans |
| `docs/authority/archive/YYYY-MM-DD-promotion-opportunities.md` | Dated snapshot |
