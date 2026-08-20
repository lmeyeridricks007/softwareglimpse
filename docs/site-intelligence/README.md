# Site Intelligence — Website Quality, SEO Competitiveness & Ranking Opportunity

Foundational **evaluation framework** for SoftwareGlimpse.

It answers how healthy, useful, differentiated, and competitively positioned the site is — at **site**, **page-type**, **content-cluster**, **page**, and **search/topic opportunity** levels — without collapsing everything into one unexplained “SEO score.”

## Current scorecard (2026-08-15)

| Component | Score / status |
| --- | ---: |
| **Overall Website Quality** | **83 / 100** |
| Technical SEO | **100** |
| Content Quality | 86 |
| Website Experience | 83 |
| Content Ecosystem | 84 |
| Competitive Strength | 50 |
| Search Visibility | NOT CONNECTED |

Source: [`WEBSITE-INTELLIGENCE-LATEST.md`](./WEBSITE-INTELLIGENCE-LATEST.md). Technical SEO is **already over 80**; the prior scorecard “65” was a stale pre-refresh snapshot — see [`docs/seo/03-technical-seo-current-status.md`](../seo/03-technical-seo-current-status.md).

This layer is **evaluate / recommend only**. It does **not**:

- mutate production content, canonicals, robots, rankings, or affiliate links  
- invent Search Console / backlink / authority metrics  
- claim that any score predicts Google rankings  
- re-run underlying audits when their latest results already exist  

## Score model (independent)

| ID | Score | Range | Notes |
| --- | --- | --- | --- |
| **A** | Technical SEO Health | 0–100 | Deterministic SEO audit checks |
| **B** | Content Quality | 0–100 | Importance-weighted CQ aggregate |
| **C** | Website Experience | 0–100 | Product/UX beyond SEO |
| **D** | Content Ecosystem Strength | 0–100 | Cluster / journey coherence |
| **E** | Competitive Content Strength | 0–100 | Requires competitor research |
| **F** | Search Visibility / Discoverability | 0–100 **or DATA NOT AVAILABLE** | Live/synthetic GSC only |
| **G** | Ranking Opportunity | Band + optional 0–100 | Per query / topic / cluster — **not** a ranking probability |
| **H** | Overall Website Quality | 0–100 | Weighted from A–E only |

**Authority / off-site limitations** are tracked separately. They constrain Ranking Opportunity confidence and interpretation — they are **not** folded into Overall Website Quality as a fake “authority score,” and missing off-site data must never invent a visibility score.

## Architecture

```text
Existing systems (reuse — do not duplicate)
├── SEOHealthOrchestrator + 7 SEO audit agents     → Technical SEO Health
├── ContentIntelligenceOrchestrator / CQ agents    → Content Quality
├── Site audit / site foundation / tools registry  → Website Experience inputs
├── CRM master map / clusters / internal linking   → Ecosystem Strength
├── Competitor research packs (future / fixtures)  → Competitive Strength
├── Search performance provider (GSC / fixtures)   → Search Visibility
├── Authority Intelligence (docs/authority/)       → AuthorityLimitations / earn-authority opportunities
└── SEO opportunity detectors + CQ + competitive   → Ranking Opportunity
        ↓
SiteIntelligence scoring engine (deterministic composition)
        ↓
Site / page-type / cluster / page / opportunity assessments
        ↓
Markdown reports under docs/site-intelligence/reports/ (when generated)
```

Implementation: `src/services/site-intelligence/`  
Schemas: `src/domain/schemas/site-intelligence.ts`  
Methodology: [`01-scoring-methodology.md`](./01-scoring-methodology.md)

## Evaluation levels

| Level | Typical questions |
| --- | --- |
| **Site** | Overall Website Quality; Technical Health; Experience; Visibility (if data) |
| **Page type** | Avg / weighted CQ by type; technical issues concentrated by template |
| **Content cluster** | Ecosystem completeness; competitive strength; ranking opportunity |
| **Individual page** | CQ score; technical readiness; “unlikely to rank without substantial improvement” flags |
| **Search / topic opportunity** | Ranking Opportunity band for a query/topic/cluster |

## Commands

```bash
# Master Website Intelligence (orchestrator — no production mutation)
npm run site:intelligence
npm run site:intelligence:crm
npm run site:intelligence -- --mode LIGHT|FULL|DEEP
npm run site:intelligence -- --fixture
npm run site:intelligence -- --json --no-write

# Executive website overview (consumes existing latest reports — no production mutation)
npm run site:overview
npm run site:overview -- --json
npm run site:overview -- --no-write

# Framework unit tests (fixture scenarios — no production mutation)
npx vitest run src/services/site-intelligence/site-intelligence.test.ts
npx vitest run src/services/site-intelligence/overview/overview.test.ts
npx vitest run src/services/site-intelligence/orchestrator/orchestrator.test.ts

# Optional evaluate against fixture packs
npm run site:intelligence:fixtures
```

### WebsiteIntelligenceOrchestrator

Authoritative master assessment. See [`02-website-intelligence-orchestrator.md`](./02-website-intelligence-orchestrator.md).

Produces:

- `docs/site-intelligence/WEBSITE-INTELLIGENCE-LATEST.md`
- `docs/site-intelligence/archive/YYYY-MM-DD-website-intelligence.md`
- `docs/site-intelligence/website-intelligence-latest.json`
- `docs/site-intelligence/website-intelligence-scorecard-latest.json` (history)

**Schedule:** `.github/workflows/website-intelligence.yml` — weekly LIGHT, monthly FULL, quarterly DEEP.

### WebsiteOverviewAgent

Produces:

- `docs/site-intelligence/WEBSITE-OVERVIEW-LATEST.md`
- `docs/site-intelligence/archive/YYYY-MM-DD-website-overview.md`

Inputs (read-only): SEO health/performance/linking, Content Intelligence + scores snapshot, Asset Intelligence, Resource audit, Content map coverage. Does **not** re-run expensive audits unless those reports are missing (then confidence drops).

### SERPCompetitorDiscoveryAgent

Discovers **organic** SERP competitors by topic (starting: CRM) from current search results — **not** a hardcoded business-competitor list.

```bash
# Requires approved API (Brave / Serper / Google CSE) — never scrapes Google HTML
npm run site:serp-competitors

# Offline / CI
npm run site:serp-competitors -- --fixture
npm run site:serp-competitors -- --import docs/site-intelligence/competitors/snapshots/<file>.json
```

Outputs:

- `docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md`
- `docs/site-intelligence/competitors/CRM-QUERY-SET.md`
- `docs/site-intelligence/competitors/snapshots/YYYY-MM-DD-crm-serp.json`
- dated archive under `competitors/archive/`

Re-run periodically — SERP snapshots go stale.

### CompetitorWebsiteAnalysisAgent

Evaluates **representative** competitor pages from SERP discovery (not full-site crawls). Externally observable signals only.

```bash
npm run site:competitive-benchmark -- --fixture
npm run site:competitive-benchmark -- --live
npm run site:competitive-benchmark -- --serp-snapshot docs/site-intelligence/competitors/snapshots/<file>.json
```

Outputs:

- `docs/site-intelligence/competitors/COMPETITIVE-BENCHMARK-LATEST.md`
- `docs/site-intelligence/competitors/<domain>.md` (per sampled domain)
- `docs/site-intelligence/competitors/competitor-pack-latest.json` (for Competitive Strength pillar)
- `docs/site-intelligence/competitors/competitive-benchmark-latest.json`

### CompetitiveGapAgent

Finds where SoftwareGlimpse is **STRONGER / COMPARABLE / WEAKER / MISSING** vs ranking pages. Rejects feature-copy without user value.

```bash
npm run site:competitive-gaps
npm run site:competitive-gaps -- --fixture
```

Output: `docs/site-intelligence/competitors/COMPETITIVE-GAPS-LATEST.md`

### RankingOpportunityAgent

Estimates **relative** opportunity/feasibility per query and cluster (not ranking probability).

**Coverage:** full CRM catalogue (all product reviews, guides, comparisons, tools, resources, industries, use cases, capabilities, features, requirements, audiences) — not a flagship-only sample. SERP competitor discovery stays **bounded** for API cost; ranking scores still run for pages without live SERP rows.

Full keyword inventory (all CRM pages):

- `docs/site-intelligence/CRM-KEYWORD-TARGETS.md`
- Refresh: `npm run site:crm-keywords`

```bash
npm run site:ranking-opportunities
npm run site:ranking-opportunities -- --fixture
npm run site:crm-keywords
```

Output: `docs/site-intelligence/RANKING-OPPORTUNITIES-LATEST.md`

Always states: *External authority not measured. Ranking feasibility may be overstated.* when backlink/DA data is absent.

### PageRankingReadinessAgent

Per-page answer to: *How competitive is this page and what would need to change for a stronger chance of ranking?* — **not** a ranking promise.

```bash
npm run site:page-readiness -- /best/crm-software/
npm run site:page-readiness -- /resources/crm-evaluation-checklist/
npm run site:page-readiness -- /software/pipedrive/
npm run site:page-readiness -- software:pipedrive
npm run site:page-readiness -- /guides/how-to-choose-crm/ --json
```

Output: `docs/site-intelligence/pages/[slug]-ranking-readiness.md`

Consumes CQ scores, ranking opportunities, competitive benchmark/gaps, SEO issues, linking, search performance (when live/import). Authority stays **NOT MEASURED** unless a future approved provider exists.

### SearchPerformanceAgent / GSC connector

**Inspection result:** SoftwareGlimpse already has an approved Search Console–shaped interface (`SearchPerformanceProvider`, fixture + GSC stub, SEO sync/detectors). The live googleapis client is **not** implemented — credentials alone do not invent rows. Do not scrape GSC.

```bash
npm run site:search-performance -- --fixture
npm run site:search-performance -- --import path/to/gsc-export.json
npm run site:search-performance   # prefers live/import snapshots in src/data/seo/snapshots
```

Output: `docs/site-intelligence/SEARCH-PERFORMANCE-LATEST.md`  
Also writes `search-visibility-metrics-latest.json` for Site Intelligence pillar F when data is live/import (never promotes synthetic fixtures to live visibility).

**Average position** is documented as an impression-weighted period average — **not** a fixed SERP rank.


Live site evaluation (future CLI) must **consume** existing reports:

| Input | Source |
| --- | --- |
| SEO findings / check status | `docs/seo/reports/SEO-HEALTH-LATEST.md` + agent `*-latest.md` / orchestrator JSON |
| Content quality scores | `docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md` + `archive/scores-latest.json` |
| Map / cluster coverage | `docs/content-ecosystem/04-crm-master-content-map.md`, `CONTENT-MAP-COVERAGE-LATEST.md`, `content:clusters` |
| Asset / media gaps | `docs/content-assets/ASSET-INTELLIGENCE-LATEST.md` |
| Search performance | `npm run seo:sync` / GSC provider — **only** when data exists |
| Competitor packs | Explicit research inputs — **not evaluated in this foundational step** |
| Authority / promotion opportunities | `npm run authority:intelligence` → `docs/authority/reports/` + `AuthorityLimitations` bridge |

## Relationship to existing systems

| System | Role vs Site Intelligence |
| --- | --- |
| **SEO audit agents** (`docs/seo/`) | Source of truth for Technical SEO Health dimensions |
| **SEO Intelligence** (`docs/softwareglimpse/seo-intelligence.md`) | GSC-shaped opportunities + `scoreOpportunity` priority — feeds Visibility / Opportunity inputs |
| **Content Quality** (`docs/content-quality/`) | Source of truth for dimensional page quality |
| **Site audit** (`docs/softwareglimpse/site-audit.md`) | Validity / readiness / issue ledger — complementary; its internal health formula stays **separate** and non-public |
| **Content ecosystem** (`docs/content-ecosystem/`) | Target clusters, linking architecture, master map |
| **Content assets** (`docs/content-assets/`) | Media/tool enrichment signals for Experience + Competitive depth |
| **Authority Intelligence** (`docs/authority/`) | Backlink / promotion opportunity discovery — feeds AuthorityLimitations only; never invents DA/backlink counts |

Do **not** collapse Site Intelligence, site-audit health, Content Quality, and SEO opportunity priority into one number.

## Confidence

Every major assessment includes:

| Level | Meaning |
| --- | --- |
| **HIGH** | Primary data sources present and checks completed |
| **MEDIUM** | Partial coverage, sampling, or known skipped checks |
| **LOW** | Sparse fixtures, missing competitor/off-site data, or many skipped checks |

Always state **why**.

## What this framework does *not* claim

- An Overall Website Quality of 82 does **not** mean “82% chance of ranking.”  
- Ranking Opportunity **STRONG** means relative opportunity given current evidence — not a SERP guarantee.  
- Competitive Strength without researched competitors must be marked **unavailable** / low confidence — never inferred from on-site quality alone.  
- Search Visibility without performance data = **DATA NOT AVAILABLE**.

## Docs in this folder

| File | Purpose |
| --- | --- |
| [`README.md`](./README.md) | This overview |
| [`01-scoring-methodology.md`](./01-scoring-methodology.md) | Dimensions, weights, formulas, missing-data rules |
| [`02-website-intelligence-orchestrator.md`](./02-website-intelligence-orchestrator.md) | Master orchestrator modes, schedule, limitations |
| [`03-page-ranking-readiness.md`](./03-page-ranking-readiness.md) | Per-page ranking readiness agent |
| [`CRM-KEYWORD-TARGETS.md`](./CRM-KEYWORD-TARGETS.md) | Full CRM cluster keyword → page inventory |
| [`WEBSITE-INTELLIGENCE-LATEST.md`](./WEBSITE-INTELLIGENCE-LATEST.md) | Master WebsiteIntelligenceOrchestrator report |
| [`WEBSITE-OVERVIEW-LATEST.md`](./WEBSITE-OVERVIEW-LATEST.md) | Executive WebsiteOverviewAgent report |
| [`../seo/03-technical-seo-current-status.md`](../seo/03-technical-seo-current-status.md) | Technical SEO live scores + sustain plan (not climb-from-65) |
| [`reports/`](./reports/) | Reserved for future assessment artifacts |
| [`archive/`](./archive/) | Dated overview / intelligence snapshots |

## Tests (required archetypes)

See `src/services/site-intelligence/site-intelligence.test.ts`:

1. Technically strong but thin content  
2. Content-rich but technically broken  
3. Strong site with no authority / off-site data  
4. Cluster stronger than competitors  
5. Cluster weaker than competitors  

## Out of scope (this foundational step)

- Running competitor evaluations against live SERPs  
- Auto-remediation or publish gates driven by Overall score  
- Fabricating GSC / backlink / DA metrics  
- Changing production pages or SEO configuration  
