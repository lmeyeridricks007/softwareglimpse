# AssetOpportunityPrioritizationAgent

Prioritizes asset opportunities that will **materially** improve SoftwareGlimpse.

Does **not** implement, embed, download, or publish assets.

## Identity

| Field | Value |
| --- | --- |
| Name | `AssetOpportunityPrioritizationAgent` |
| ID | `asset-opportunity-prioritization-agent` |
| Version | `1.0.0` |
| Mutates content | **No** |

## Inputs

| Input | Role |
| --- | --- |
| `SOFTWARE-ASSET-OPPORTUNITIES.md` corpus | Via `SoftwareAssetDiscoveryAgent` audits |
| `GUIDE-ASSET-OPPORTUNITIES.md` corpus | Via `GuideAssetDiscoveryAgent` audits |
| `CONTENT-IMPROVEMENT-BACKLOG.md` | Visual/media CQ issue linkage |
| `04-crm-master-content-map.md` | Page importance (P0–P3) + cluster |

## Priority factors (not asset count)

1. Page importance  
2. Current quality weakness  
3. Asset relevance  
4. Buyer usefulness  
5. Evidence value  
6. Differentiation value  
7. Ease of use  
8. Source quality  
9. Freshness  
10. Implementation effort  

**One excellent workflow video may outrank fifteen screenshots.**

## Bands

| Band | Meaning |
| --- | --- |
| **A0** | Critical / high-impact missing media on important pages |
| **A1** | Strong near-term improvement |
| **A2** | Useful enhancement |
| **A3** | Optional |

## Systemic / TEMPLATE FIX

When the same gap repeats across many pages (e.g. Features tabs cannot surface official videos), the agent emits a **TEMPLATE FIX** instead of N manual edits.

## CLI

```bash
npm run assets:agent:prioritize -- --write
npm run assets:agent:prioritize -- --write --json
npm run assets:agent:prioritize -- --software-limit 5 --guide-limit 10 --write
```

## Output

`docs/content-assets/ASSET-ENRICHMENT-BACKLOG.md`

Includes:

- Full prioritized table (columns per backlog contract)
- Groups by implementation type, product, and cluster
- Systemic template opportunities
- Top 30 actions
- A0–A3 final report counts

## Code

| Path | Role |
| --- | --- |
| `src/services/asset-discovery/prioritization-agent/` | Agent |
| `scripts/asset-opportunity-prioritization-agent.ts` | CLI |
| schemas in `src/domain/schemas/asset-discovery.ts` | Backlog models |
