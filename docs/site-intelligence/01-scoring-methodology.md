# Site Intelligence Scoring Methodology

> Spec version: `1.0.0`  
> Status: foundational — evaluate only; no auto-fixes; no ranking predictions  
> Code: `src/services/site-intelligence/` · Schema: `src/domain/schemas/site-intelligence.ts`

## 1. Purpose

Provide a **defensible, evidence-backed** multi-score model that answers:

1. How healthy is the website technically?  
2. How good is the website overall?  
3. How strong is the content?  
4. How differentiated/useful is the product experience?  
5. How strong is SoftwareGlimpse vs current competitors?  
6. Where is SoftwareGlimpse stronger?  
7. Where is SoftwareGlimpse weaker?  
8. Which topic clusters have realistic ranking opportunities?  
9. Which pages are unlikely to rank without substantial improvement?  
10. What should be improved next?

## 2. Non-negotiable principles

| Principle | Rule |
| --- | --- |
| **No single SEO score** | Never publish one unexplained “SEO score.” |
| **Score ≠ ranking prediction** | No “chance of ranking = N%.” |
| **Separate concerns** | Technical ≠ Content ≠ Experience ≠ Ecosystem ≠ Competitive ≠ Visibility ≠ Opportunity ≠ Authority. |
| **Evidence required** | Every score traces to inputs with reasons / evidence IDs. |
| **Reuse, don’t recompute** | Prefer existing agent outputs over duplicate checks. |
| **Missing data is explicit** | Unavailable dimensions are `unavailable` or `DATA NOT AVAILABLE`, never invent. |
| **Importance weighting** | Pillars outweigh long-tail volume in aggregates. |

## 3. Top-level scores

### 3.1 Summary

| ID | Name | Scale | Included in Overall (H)? |
| --- | --- | --- | --- |
| A | Technical SEO Health | 0–100 | Yes |
| B | Content Quality | 0–100 | Yes |
| C | Website Experience | 0–100 | Yes |
| D | Content Ecosystem Strength | 0–100 | Yes |
| E | Competitive Content Strength | 0–100 or unavailable | Yes **if available** |
| F | Search Visibility | 0–100 or **DATA NOT AVAILABLE** | **No** |
| G | Ranking Opportunity | Band + optional 0–100 | **No** (query/topic/cluster scoped) |
| H | Overall Website Quality | 0–100 + band | — |
| — | Authority / Off-site Limitations | structured note + confidence impact | **No** (constraint layer) |

### 3.2 Quality / opportunity bands

Shared display bands for A–E and H:

| Range | Band label |
| --- | --- |
| 90–100 | Excellent |
| 80–89 | Strong |
| 70–79 | Good |
| 60–69 | Fair |
| 40–59 | Weak |
| 0–39 | Critical |

Ranking Opportunity bands (G) — **not** probability labels:

| Band | Optional score range | Meaning |
| --- | --- | --- |
| **VERY LOW** | 0–19 | Unrealistic without major new assets + authority growth |
| **LOW** | 20–39 | Weak fit or far behind SERP / quality gap |
| **MODERATE** | 40–59 | Plausible with focused improvement |
| **GOOD** | 60–79 | Realistic with targeted work |
| **STRONG** | 80–100 | Favorable relative opportunity given evidence |

## 4. Data dependencies (reuse map)

| Score | Primary sources | Do not re-derive if present |
| --- | --- | --- |
| **A Technical** | `TechnicalSEOAuditAgent`, `InternalLinkAuditAgent`, `StructuredDataAuditAgent`, `PerformanceAuditAgent`, `MediaSEOAuditAgent`, `OutboundLinkAuditAgent` (+ SEO-HEALTH rollup) | Same checks inside Site Intelligence |
| **B Content Quality** | Content Quality audits / `CONTENT-INTELLIGENCE-LATEST` / `scores-latest.json` | Re-score page dimensions |
| **C Experience** | Site foundation, tools registry, IA inventory, performance budgets, accessibility notes, CQ structure/readability + journey dims | Full UX lab studies (optional later) |
| **D Ecosystem** | Master content map, content-clusters coverage, InternalLinkAuditAgent orphans/gaps, CQ linking dims | Invent cluster completeness from word counts |
| **E Competitive** | Competitor research packs (fixtures or future research jobs) | Infer from on-site CQ alone |
| **F Visibility** | Search performance provider (GSC / labeled fixtures) | Page quality or technical scores |
| **G Opportunity** | Intent fit, CQ, competitive pack, ecosystem support, visibility row (if any), authority notes | Treat as ranking probability |
| **Authority** | External DA/backlink providers when integrated; otherwise explicit gap | Fake DA from content depth |

## 5. Score A — Technical SEO Health

### 5.1 Dimensions

Each dimension is scored 0–100 from deterministic findings + check status, then weighted.

| Dimension ID | Weight | Inputs |
| --- | --- | --- |
| `crawlability` | 0.12 | Internal-link crawl paths, orphan rate signals, robots crawl blocks |
| `indexability` | 0.14 | Indexable gates, noindex/sitemap conflicts, thin-indexable flags |
| `canonicals` | 0.10 | Canonical mismatches, duplicate consolidation |
| `robots-sitemaps` | 0.08 | robots.txt / meta robots / sitemap hygiene |
| `status-redirects` | 0.10 | 4xx/5xx, redirect chains (when probed) |
| `metadata` | 0.08 | Title/description/H1 structural checks |
| `structured-data` | 0.08 | Schema validity findings |
| `performance-cwv` | 0.12 | PerformanceAuditAgent budgets / lab proxies |
| `media-implementation` | 0.08 | MediaSEOAuditAgent |
| `outbound-hygiene` | 0.05 | OutboundLinkAuditAgent |
| `rendering-mobile` | 0.05 | Rendering / mobile-parity checks (often skipped → confidence only) |

Weights sum to **1.00**.

### 5.2 Finding → dimension deduction

Start each dimension at **100**. Apply capped deductions from open findings mapped to that dimension:

| Severity | Deduction per finding | Cap contribution |
| --- | --- | --- |
| P0 | −25 | −80 |
| P1 | −12 | −60 |
| P2 | −5 | −40 |
| P3 | −2 | −20 |

```text
dimensionScore = max(0, 100 − min(cap, Σ deductions))
technicalHealthRaw = round(Σ dimensionScore_i × weight_i)

# Site-wide severity floor — clean dimensions must not hide P0 breakage
if any P0:
  technicalHealth = min(technicalHealthRaw, 45 − min(20, (P0_count − 1) × 8))
else if P1_count ≥ 3:
  technicalHealth = min(technicalHealthRaw, 65)
else if any P1:
  technicalHealth = min(technicalHealthRaw, 78)
else:
  technicalHealth = technicalHealthRaw
```

### 5.3 Incomplete runs

If checks are skipped/failed:

- Still compute from completed evidence.  
- Confidence drops (see §11).  
- Report must state: **do not claim clean technical SEO** when skips/failures exist (same contract as SEOHealthOrchestrator).

Skipped live probes (`status-codes-live`, `field-cwv`, etc.) do **not** invent perfect scores for those sub-checks — leave dimension evidence tagged `partial`.

## 6. Score B — Content Quality

### 6.1 Source

Reuse Content Quality **overall 0–100** per page (already dimensionally evidenced). Site Intelligence **aggregates** — it does not replace CQ rubrics.

CQ dimensions (reference): intent fit, completeness, depth, original value, evidence, freshness, decision support, actionability, structure, media, linking, journey, trust, differentiation, page-type-specific. See `docs/content-quality/01-quality-framework.md`.

### 6.2 Importance weights

| Page importance | Weight |
| --- | --- |
| `pillar` | 20 |
| `high-commercial` | 8 |
| `supporting` | 3 |
| `long-tail` | 1 |

Reuse `classifyPageImportance` from content-quality priority where possible. Weights are deliberately skewed so a weak pillar is not drowned by dozens of adequate long-tail pages.

### 6.3 Aggregation formulas

**Site / cluster / page-type:**

```text
contentQuality = round(
  Σ (pageScore × importanceWeight) / Σ importanceWeight
)
```

Optional page-type rollup uses the same formula filtered by type.

**Rule:** Hundreds of long-tail comparisons must not outweigh a weak Best / pillar page.

### 6.4 “Unlikely to rank without substantial improvement”

A page is flagged when **any** of:

- CQ overall &lt; 50 **and** importance ∈ {pillar, high-commercial}  
- CQ overall &lt; 40 (any importance)  
- Critical integrity / evidence failures on commercial page types  
- Technical P0 on the same URL (indexability/canonical catastrophe)

This is a **remediation priority flag**, not a ranking forecast.

## 7. Score C — Website Experience

Broader than SEO. Dimensions (equal weight unless overridden):

| Dimension ID | Focus |
| --- | --- |
| `navigation` | Chrome nav, hubs, findability |
| `search` | Site search / finder entry points |
| `information-architecture` | Hierarchy vs inventory / target ecosystem |
| `visual-hierarchy` | Scannable priority of brand/decision cues |
| `mobile-usability` | Responsive parity / mobile budgets |
| `page-readability` | CQ structure-readability aggregate |
| `decision-workflow` | Tools + next-step journey completeness |
| `tool-integration` | Finder, calculator, scorecard, builders wired |
| `downloads-resources` | Resource hub maturity |
| `comparison-experience` | Compare UX depth |
| `accessibility` | Known a11y issues / skips |
| `performance` | Shared with technical perf (lab) — UX framing |
| `dead-ends` | Orphans, placeholder/coming-soon traps |
| `consistency` | Template/IA consistency across page types |

```text
experience = round(mean(dimensionScores))
```

Missing UX research → score from structural inventory signals; confidence **MEDIUM** or **LOW**.

## 8. Score D — Content Ecosystem Strength

Evaluates whether content forms a coherent knowledge system (cluster-aware).

| Dimension ID | Weight | Evidence |
| --- | --- | --- |
| `pillar-coverage` | 0.15 | Master map LIVE pillars |
| `supporting-coverage` | 0.12 | Guides / supporting hubs vs target |
| `entity-relationships` | 0.10 | Graph relationship density |
| `internal-linking` | 0.12 | InternalLinkAuditAgent + CQ linking |
| `content-depth` | 0.10 | Weighted CQ depth/completeness |
| `tool-relationships` | 0.08 | Tools linked into journey |
| `resource-relationships` | 0.06 | Resources attached to clusters |
| `buyer-journey` | 0.10 | Learn→Choose→Compare→Implement coverage |
| `cluster-completeness` | 0.10 | content-clusters core coverage ratios |
| `orphan-rate` | 0.04 | Inverse orphan severity (higher = healthier) |
| `duplication-control` | 0.03 | Duplicate-intent / cannibalization findings |

Example: CRM scores high when pillar + buying guides + reviews + comparisons + features + capabilities + requirements + use cases + industries + tools + resources + implementation/migration exist **with coherent links**.

## 9. Score E — Competitive Content Strength

**Requires competitor research.** Without a competitor pack:

```text
status = unavailable
score = null
confidence = LOW
reason = "No competitor research pack supplied — competitive strength not inferred from on-site quality."
```

When packs exist, score SoftwareGlimpse **relative** to sampled competitors (0–100):

| Dimension ID | Weight |
| --- | --- |
| `topic-coverage` | 0.12 |
| `content-depth` | 0.12 |
| `original-research-value` | 0.10 |
| `tools-interactive` | 0.10 |
| `comparison-quality` | 0.08 |
| `review-depth` | 0.08 |
| `evidence-transparency` | 0.08 |
| `media` | 0.06 |
| `resources` | 0.06 |
| `internal-linking` | 0.06 |
| `ux` | 0.06 |
| `freshness` | 0.04 |
| `serp-alignment` | 0.04 |

Relative scoring convention:

| Relative position | Typical dimension score |
| --- | --- |
| Clearly ahead | 80–100 |
| Roughly parity | 55–79 |
| Behind on this dimension | 25–54 |
| Far behind / missing capability competitors have | 0–24 |

Outputs must list **stronger-than** and **weaker-than** competitor notes with evidence.

> Foundational step: **do not evaluate live competitors yet** — engine + fixtures only.

## 10. Score F — Search Visibility / Discoverability

**Only** when search-performance data exists (live GSC or explicitly labeled fixtures consumed as performance data).

### 10.1 When unavailable

```text
status: DATA_NOT_AVAILABLE
score: null
message: "No search-performance snapshot — visibility not fabricated from page quality."
```

### 10.2 When available

Suggested composite (weights sum 1.0):

| Factor | Weight | Notes |
| --- | --- | --- |
| Indexed / performing page coverage | 0.15 | Pages with impressions vs indexable set (if known) |
| Impressions volume (normalized) | 0.20 | Soft log scale |
| Clicks | 0.15 | Soft log scale |
| CTR vs expected band | 0.15 | Guard tiny samples |
| Average position distribution | 0.15 | Share in top 10 / 20 |
| Query coverage (non-brand) | 0.10 | Distinct non-brand queries |
| Non-brand click share | 0.10 | Brand vs non-brand |

Synthetic fixtures may be used for **pipeline tests** but reports must label `synthetic: true` and must not be claimed as live SoftwareGlimpse GSC (same rule as SEO Intelligence).

### 10.3 Average position is not a fixed SERP rank

Google Search Console **average position** is an impression-weighted average across the reporting period (and often across devices/countries when not segmented). A URL can appear at different ranks for the same query on different days; the metric blends those appearances.

Site Intelligence therefore:

- treats average position as a **relative traction / near-win signal**
- never converts it into “always rank #N” or “% chance to rank”
- documents this caveat in `SEARCH-PERFORMANCE-LATEST.md`

Connector: approved `SearchPerformanceProvider` (fixture / import / GSC stub). Live googleapis client is optional and must not be faked. Do not scrape Search Console HTML.

## 11. Score G — Ranking Opportunity

Scoped to **query**, **topic**, or **content cluster**. This is an **opportunity assessment**, not a ranking probability.

### 11.1 Factors

| Factor | Weight | Notes |
| --- | --- | --- |
| `intent-fit` | 0.14 | Query intent vs page/cluster intent |
| `content-quality` | 0.16 | Weighted CQ for target URL(s) |
| `serp-competitor-strength` | 0.14 | Inverse of competitor pack strength on topic |
| `topical-coverage` | 0.10 | Ecosystem coverage for cluster |
| `differentiation` | 0.10 | Original tools/frameworks/evidence |
| `internal-link-support` | 0.08 | Inbound/outbound support |
| `evidence-depth` | 0.08 | Evidence / media depth |
| `freshness` | 0.05 | Research freshness |
| `current-visibility` | 0.08 | From F if available; else neutral 50 with LOW confidence tag |
| `authority-gap` | 0.07 | Off-site limitation proxy — **penalty when known weak; neutral when unknown** |

```text
opportunityScore = round(Σ factor_i × weight_i)
opportunityBand = bandFor(opportunityScore)
```

When visibility or authority data is missing:

- Use **neutral mid values** only for those factors.  
- Mark confidence **MEDIUM** or **LOW**.  
- Never claim “we will rank.”

Reuse SEO Intelligence `scoreOpportunity` for **editorial queue priority** when GSC rows exist — Site Intelligence Ranking Opportunity is the broader cluster/topic assessment and may incorporate that priority as one evidence input, not a replacement.

### 11.2 Authority / off-site limitations (constraint layer)

Track separately on every site/cluster assessment:

```text
AuthorityLimitations {
  status: available | unavailable
  confidence: HIGH | MEDIUM | LOW
  notes[]           // e.g. "Backlink data unavailable"
  knownGaps[]       // e.g. "Competitor domains have substantially larger referring domains"
  impactOnOpportunity: "neutral-unknown" | " constraining" | "supporting"
}
```

Rules:

- Unavailable off-site data → `impactOnOpportunity = neutral-unknown`, confidence ↓  
- Known large backlink/authority gap → constrains G (lowers `authority-gap` factor)  
- Never invent DA/DR numbers  

## 12. Score H — Overall Website Quality

### 12.1 Default weights

| Component | Weight |
| --- | --- |
| A Technical SEO Health | 0.20 |
| B Content Quality | 0.30 |
| C Website Experience | 0.15 |
| D Content Ecosystem Strength | 0.20 |
| E Competitive Content Strength | 0.15 |

```text
If E unavailable:
  renormalize A–D weights to sum 1.0
  overallConfidence ≤ MEDIUM (unless all A–D HIGH and note competitive gap)

overall = round(Σ availableComponentScore × renormalizedWeight)
```

**Excluded from H:** Ranking Opportunity (varies by query), Search Visibility (performance metric, not quality), raw authority numbers.

### 12.2 Display format

```text
Overall Website Quality
82 / 100
Strong

Breakdown:
- Technical SEO Health …… 90  (weight 0.20)
- Content Quality ……… 85  (weight 0.30)
- Website Experience …… 78  (weight 0.15)
- Content Ecosystem …… 80  (weight 0.20)
- Competitive Strength … 70  (weight 0.15)  confidence: MEDIUM
```

## 13. Confidence model

| Level | Criteria (any matching) |
| --- | --- |
| **HIGH** | Primary sources present; &lt;15% checks skipped for A; CQ coverage includes pillars; competitor sample ≥5 for E when scored; GSC non-synthetic for F when scored |
| **MEDIUM** | Partial inventories; FAST-mode sampling; some live probes skipped; competitor sample 2–4; synthetic GSC used for pipeline only |
| **LOW** | Missing competitor pack (for E); missing GSC (for F); majority checks skipped; sparse page sample; authority unknown and competitive claims attempted |

Every major block must include:

```text
confidence: MEDIUM
confidenceReasons:
  - "5 competitors sampled, but backlink data unavailable"
  - "11 SEO checks skipped (no live HTML probe)"
```

## 14. Evaluation levels — outputs

### 14.1 Site level

- Scores A–F, H  
- Authority limitations  
- Top strengths / weaknesses  
- Next improvement themes  

### 14.2 Page-type level

- Weighted CQ mean  
- Technical finding concentration  
- Experience notes for that template  

### 14.3 Content-cluster level

- Ecosystem Strength (D)  
- Competitive Strength (E) when researched  
- Ranking Opportunity (G) for cluster topic  
- Stronger / weaker vs competitors  

### 14.4 Individual page level

- CQ score + band  
- Technical flags for URL  
- Unlikely-to-rank-without-improvement flag  
- Linked opportunity IDs (`CQ-…`, `SEO-…`, `CG-…`)  

### 14.5 Search / topic opportunity level

- Ranking Opportunity band + score  
- Factor breakdown  
- Recommended next action class: improve-existing / create / consolidate / build-tool / earn-authority / defer  

## 15. Missing-data handling matrix

| Missing input | Behavior |
| --- | --- |
| SEO agent findings | A score from available dimensions; confidence ↓; list skipped agents |
| CQ scores | B unavailable → Overall cannot include B; halt site overall or mark incomplete |
| Competitor pack | E = unavailable; Overall renormalizes; questions 5–7 deferred |
| GSC / analytics | F = DATA NOT AVAILABLE |
| Backlinks / DA | Authority = unavailable; G authority factor neutral; confidence ↓ |
| Live CWV / status probes | Partial technical dimensions; do not claim field truth |

## 16. Why score ≠ ranking prediction

Search rankings depend on query competition, off-site authority, SERP features, localization, personalization, and Google system changes that **no on-site quality model can deterministically predict**.

Site Intelligence measures **readiness, usefulness, coherence, relative content competitiveness, observed visibility (when measured), and relative opportunity** — so teams can prioritize work honestly.

## 17. Improvement prioritization (question 10)

Suggested next-action ordering:

1. **P0 technical** blockers (indexability / canonical / status)  
2. **Integrity / evidence** failures on commercial pillars  
3. **Pillar / cluster gaps** that block ecosystem completeness  
4. **CQ major gaps** on high-importance pages  
5. **Experience dead-ends** that waste demand  
6. **Competitive weaknesses** on clusters with GOOD+ opportunity  
7. Long-tail polish  

Affiliate/commercial urgency may reorder **within** a priority band; it must not rewrite editorial quality scores (same boundary as site-audit / SEO Intelligence).

## 18. Versioning

Bump `SITE_INTELLIGENCE_VERSION` when weights or formulas change. Store version on every assessment artifact for trend integrity.
