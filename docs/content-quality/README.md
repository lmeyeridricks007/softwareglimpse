# Content Quality Evaluation

Reusable system that inspects public SoftwareGlimpse editorial/research pages and produces **structured ratings + improvement recommendations** as local Markdown.

This is **evaluation only**. It does not rewrite pages, publish content, add links, change rankings, or mutate research facts.

## Agent architecture

```text
ContentIntelligenceOrchestrator
├── inventory (live CRM loaders)
├── Content Quality Audit Agents (per page type)
├── content-clusters coverage inspect
├── ContentImprovementOpportunityAgent
├── ContentGapOpportunityAgent (+ duplicates)
├── content-map coverage inspect
├── internal-link / next-step gap harvest
└── master recommendations + change tracking
```

| Agent / layer | Job |
| --- | --- |
| **ContentIntelligenceOrchestrator** | Full workflow → master report + child reports |
| **Content Quality Audit Agents** | Dimensional scores per page |
| **ContentImprovementOpportunityAgent** | Improve-existing backlog (`CQ-…` IDs) |
| **ContentGapOpportunityAgent** | New-content / do-not-create (`CG-…` IDs) |
| **Site audit** (separate) | Validity / readiness / issue ledger |
| **Draft QA** (`agent:qa`) | Typed issues on drafts |

**Non-negotiable:** AUDIT → RECOMMEND → HUMAN SELECTS → SEPARATE IMPROVEMENT/CREATION PROMPT → RE-AUDIT. The orchestrator must never create or publish pages.

## Relationship to existing systems

| Layer | Job |
| --- | --- |
| **Site audit** (`docs/softwareglimpse/site-audit.md`) | Validity / readiness / issue ledger / health formula |
| **Quality gates** (`src/domain/quality-gates.ts`) | Indexability / publish boolean gates |
| **Draft QA** (`agent:qa`) | Typed issues on agent drafts |
| **Content Quality Evaluation** (this) | Dimensional 0–5 scores + evidence + recommendations |
| **Content Intelligence** | Orchestrated reports + diffs + action queue |

Do not collapse these into one opaque SEO score.

## Docs / report locations

| File | Purpose |
| --- | --- |
| [`01-quality-framework.md`](./01-quality-framework.md) | Dimensions, bands, rubrics |
| [`CONTENT-INTELLIGENCE-LATEST.md`](./CONTENT-INTELLIGENCE-LATEST.md) | Master intelligence report |
| [`CONTENT-QUALITY-LATEST.md`](./CONTENT-QUALITY-LATEST.md) | Inventory (lowest score first) |
| [`CONTENT-IMPROVEMENT-BACKLOG.md`](./CONTENT-IMPROVEMENT-BACKLOG.md) | Improve-existing backlog |
| [`NEW-CONTENT-OPPORTUNITIES.md`](./NEW-CONTENT-OPPORTUNITIES.md) | Gap / create-or-not opportunities |
| [`CONTENT-MAP-COVERAGE-LATEST.md`](./CONTENT-MAP-COVERAGE-LATEST.md) | Map missing/thin coverage |
| [`archive/`](./archive/) | Dated intelligence snapshots + `scores-latest.json` |
| [`pages/`](./pages/) | Per-page audit Markdown |

Master CRM map (operational SoT): `docs/content-ecosystem/04-crm-master-content-map.md` — enriched by humans from intelligence outputs; not auto-edited by the orchestrator.

## Industry hub quality packs

Industry hubs combine narrative depth (`src/data/industry-hub/deep.ts`) with scored profile fields (`quality-fields.ts`) merged in `industry-hub/index.ts`. The quality agent reads the **profile** (priorities, use-cases, security, implementation, evaluation questions, Finder CTAs) — UI-only defaults do not lift scores. Financial Services remains the hand-authored reference; the other 12 verticals use quality packs.

## Commands

```bash
# Full orchestrated intelligence (CRM)
npm run content:intelligence
npm run content:intelligence:crm

# Modes
npm run content:intelligence:fast   # pillars / commercial / thin hubs
npm run content:intelligence:full   # all CRM inventory

# npm run content:intelligence -- --mode FAST
# npm run content:intelligence -- --no-write
# npm run content:intelligence -- --strict-integrity   # fail only on deterministic integrity
# npm run content:intelligence -- --update-master-map  # writes PENDING note only (no auto-edit)

# Individual steps
npm run content:quality             # quality audit (= content:audit:crm)
npm run content:audit:crm
npm run content:backlog             # improvement opportunities
npm run content:gaps                # new content opportunities (gap agent)
npm run content:opportunities       # alias of content:gaps

# Supporting knowledge clusters (separate system)
npm run content:clusters -- crm
npm run content:clusters:gaps -- --category crm

# Framework tooling
npm run quality:fixtures
npm run quality:evaluate -- --fixture excellent-guide --report
npm run quality:validate
```

## Scoring

- Per-dimension **0–5**; overall **0–100** + band (excellent → critical-incomplete). See [`01-quality-framework.md`](./01-quality-framework.md).
- Improvement priority **CQ-P0…CQ-P3** = gap severity × page importance × journey importance.
- Subjective scores are **non-blocking** in CI. Only deterministic integrity (empty published page, placeholder copy, broken entity, evidence-gated zero) may fail under `--strict-integrity`.

## Stable recommendation IDs

| Prefix | Meaning | Example |
| --- | --- | --- |
| `CQ-…` | Improve existing page | `CQ-SOFTWARE-HUBSPOT-EVIDENCE-A3F1` |
| `CG-…` | Gap / new content / do-not-create | `CG-TOOLS-CRM-ROI-CALCULATOR-B2C9` |
| `CI-…` | Master action alias (usually reuses CQ/CG) | — |

IDs hash route + type + problem signature — they do **not** renumber when sort order changes.

## How to interpret recommendations

1. Read **Executive summary** + **Next 25** in `CONTENT-INTELLIGENCE-LATEST.md`.
2. Prefer **systemic template** fixes when a pattern hits many pages.
3. `RESEARCH FIRST` / research-required → do research before drafting.
4. `DO NOT CREATE` / MERGE → do not spawn URLs; consolidate.
5. `CREATE` tools/resources → separate build/prompt; orchestrator only recommends.

## Content-map integration

1. Intelligence writes `CONTENT-MAP-COVERAGE-LATEST.md`.
2. Humans merge into `04-crm-master-content-map.md` (§0 health / candidates / NEXT 50).
3. `--update-master-map` only writes `CONTENT-MAP-UPDATE-PENDING.md` — never rewrites the master map automatically.

## How to action improvements

```text
AUDIT (content:intelligence)
  → RECOMMEND (Markdown reports)
  → HUMAN SELECTS action ID
  → SEPARATE improvement / creation prompt or agent draft
  → approval / publish (existing publishing gates)
  → RE-AUDIT (diff shows IMPROVED / RESOLVED)
```

## Change tracking

Each run compares `archive/scores-latest.json`:

| Kind | Meaning |
| --- | --- |
| NEW ISSUES | Route newly in audit set |
| RESOLVED | Route left audited set |
| IMPROVED | Score +3 or more |
| REGRESSED | Score −3 or more |
| UNCHANGED | Within ±2 |

## Scheduling (CI)

`.github/workflows/content-intelligence.yml`:

- Weekly: FAST
- Monthly (first Sunday): FULL
- Uploads artifacts — **does not auto-commit** reports
- Job does **not** fail on subjective quality scores

## Audit agents (page types)

| Agent | Page types |
| --- | --- |
| ArticleQualityAgent | article |
| GuideQualityAgent | guide, product-guide, implementation-guide |
| ProductReviewQualityAgent | product-review |
| ComparisonQualityAgent | comparison |
| BestPageQualityAgent | best |
| IndustryQualityAgent | industry |
| UseCaseQualityAgent | use-case |
| CapabilityQualityAgent | capability |
| RequirementQualityAgent | requirement |
| FeatureQualityAgent | feature |
| ResourceQualityAgent | resource |

## How to add a new page type

1. Extend `ContentQualityPageType` + snapshot loader in `loaders/`.
2. Add profile weights in `profiles.ts` + dimension rubric notes in `01-quality-framework.md`.
3. Register agent strategy in `agents.ts`.
4. Include in inventory scope filters + FAST heuristics if commercially important.
5. Re-run `npm run content:intelligence:fast` and confirm the type appears in Quality by page type.

## Code

| Path | Role |
| --- | --- |
| `src/services/content-quality/intelligence/` | Orchestrator, diffs, stable IDs, master report |
| `src/services/content-quality/audit-engine.ts` | Inventory audit runner (FAST/FULL) |
| `src/services/content-quality/improvement/` | Improvement backlog |
| `src/services/content-quality/gaps/` | Gap / new-content agent |
| `scripts/content-intelligence-cli.ts` | Orchestrator CLI |

## Page types supported

article · guide · product-review · comparison · best · product-guide · industry · use-case · capability · requirement · feature · implementation-guide · resource · tool-landing
