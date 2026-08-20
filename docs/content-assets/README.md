# Content Asset Discovery

Reusable **Official Asset Discovery** framework for SoftwareGlimpse.

Inspects existing Software / Product pages and Guides, identifies where visual or media evidence would help, searches (or accepts) **official / authoritative** candidates, verifies source authority, classifies usage rights, and writes **Markdown recommendations**.

This is **discovery + recommendation only**. It does **not**:

- embed or publish assets automatically  
- download or rehost media into the site  
- mutate ResearchMedia enrichment, rankings, or page content  
- invent asset URLs  

## Docs

- [`01-asset-discovery-framework.md`](./01-asset-discovery-framework.md) — taxonomy, verification, usage, search, models, scoring, lifecycle
- [`02-approved-asset-workflow.md`](./02-approved-asset-workflow.md) — approve → import ResearchMedia / Evidence (discovery ≠ approval)
- [`02-software-asset-discovery-agent.md`](./02-software-asset-discovery-agent.md) — SoftwareAssetDiscoveryAgent
- [`03-guide-asset-discovery-agent.md`](./03-guide-asset-discovery-agent.md) — GuideAssetDiscoveryAgent
- [`04-asset-opportunity-prioritization-agent.md`](./04-asset-opportunity-prioritization-agent.md) — AssetOpportunityPrioritizationAgent
- [`05-content-asset-intelligence-orchestrator.md`](./05-content-asset-intelligence-orchestrator.md) — ContentAssetIntelligenceOrchestrator
- [`SOFTWARE-ASSET-OPPORTUNITIES.md`](./SOFTWARE-ASSET-OPPORTUNITIES.md) — master software table
- [`GUIDE-ASSET-OPPORTUNITIES.md`](./GUIDE-ASSET-OPPORTUNITIES.md) — master guide table
- [`ASSET-ENRICHMENT-BACKLOG.md`](./ASSET-ENRICHMENT-BACKLOG.md) — prioritized enrichment backlog
- [`ASSET-INTELLIGENCE-LATEST.md`](./ASSET-INTELLIGENCE-LATEST.md) — orchestrator master report
- [`software/`](./software/) — per-product opportunity reports
- [`guides/`](./guides/) — per-guide opportunity reports

## CLI

```bash
npm run assets:validate
npm run assets:registry
npm run assets:fixtures

npm run assets:audit -- --fixture hubspot-product --report
npm run assets:audit -- --all-fixtures --with-seeds --report

npm run assets:audit -- --software hubspot --report
npm run assets:audit -- --software pipedrive --report
npm run assets:audit:software -- hubspot --report

npm run assets:audit -- --guide what-is-crm --report
npm run assets:audit -- --guide financial-services-crm --report
npm run assets:audit -- --guide crm-automation-best-practices --report
npm run assets:audit:guides -- what-is-crm --report

npm run assets:audit:crm -- --report
```

Reports write to `reports/content-assets/` when `--report` is set.

## Code

| Path | Role |
| --- | --- |
| `src/domain/schemas/asset-discovery.ts` | Taxonomy + opportunity / discovered-asset / report schemas |
| `src/services/asset-discovery/` | Needs → search tasks → verify → usage → quality → report |
| `scripts/asset-discovery-cli.ts` | CLI |

## Relationship to existing systems

| Layer | Job |
| --- | --- |
| **ResearchMedia** (`product-media` + `*-media-research`) | Canonical video storage + lifecycle (discover→activate) |
| **ResearchSource** / Evidence | Official docs, pricing, help-center facts |
| **Content Quality** (`visual-media-support`) | Dimensional page scoring; media gaps |
| **Asset Discovery** (this) | Page-needs-first audit + official candidate recommendations |

Video candidates that pass verification can later enter the existing ResearchMedia lifecycle via `bridgeDiscoveredAssetToResearchMedia` — still **not** auto-published.

## Quick start

```bash
npm run assets:validate
npm test -- src/services/asset-discovery/asset-discovery.test.ts
npm run assets:audit -- --fixture hubspot-product --with-seeds --report
```

## SoftwareAssetDiscoveryAgent

Audits **every** software/product page for official asset opportunities.  
Does **not** edit product pages.

```bash
npm run assets:agent:software -- --all --write
npm run assets:agent:software -- --product hubspot --write
npm test -- src/services/asset-discovery/software-agent/software-agent.test.ts
```

Outputs:

- `docs/content-assets/software/[slug]-asset-opportunities.md`
- `docs/content-assets/SOFTWARE-ASSET-OPPORTUNITIES.md`

## GuideAssetDiscoveryAgent

Audits **guides/articles** for official, authoritative, and original visual opportunities.  
Does **not** edit guides.

```bash
npm run assets:agent:guides -- --all --write
npm run assets:agent:guides -- --guide how-to-choose-crm --write
npm test -- src/services/asset-discovery/guide-agent/guide-agent.test.ts
```

Outputs:

- `docs/content-assets/guides/[slug]-asset-opportunities.md`
- `docs/content-assets/GUIDE-ASSET-OPPORTUNITIES.md`

## AssetOpportunityPrioritizationAgent

Prioritizes software + guide asset opportunities by **material impact** (not asset count).  
Does **not** implement assets.

```bash
npm run assets:agent:prioritize -- --write
npm test -- src/services/asset-discovery/prioritization-agent/prioritization-agent.test.ts
```

Output:

- `docs/content-assets/ASSET-ENRICHMENT-BACKLOG.md`

## Approved Asset Workflow

Discovery ≠ approval. Selected candidates advance through explicit gates, then
import into ResearchMedia / ResearchSource with dedupe + separate placements.

```bash
npm run assets:approve -- help
npm run assets:approve -- register --product hubspot --url URL --title "..."
npm run assets:approve -- inspect <id>
npm run assets:approve -- import <id> --persist   # never auto; requires editorial approval
npm run audit:media-health
```

See [`02-approved-asset-workflow.md`](./02-approved-asset-workflow.md).

## ContentAssetIntelligenceOrchestrator

Periodic evaluate → recommend workflow for official media opportunities.  
Does **not** auto-edit content.

```bash
npm run assets:intelligence -- --mode LIGHT
npm run assets:intelligence -- --mode FULL
npm run assets:intelligence:crm
npm test -- src/services/asset-discovery/intelligence/intelligence.test.ts
```

Outputs:

- `docs/content-assets/ASSET-INTELLIGENCE-LATEST.md`
- `docs/content-assets/archive/YYYY-MM-DD-asset-intelligence.md`
- Maintains software / guide / backlog reports on FULL/DEEP

See [`05-content-asset-intelligence-orchestrator.md`](./05-content-asset-intelligence-orchestrator.md).
