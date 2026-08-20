# Content Asset Intelligence Orchestrator

Name: **ContentAssetIntelligenceOrchestrator**  
ID: `content-asset-intelligence-orchestrator`  
Version: `1.0.0`

Periodically evaluate whether Software and Guide content could be materially improved using better official media and authoritative sources.

**Does NOT auto-edit content.** Discovery ≠ approval.

## Flow

1. Inventory current Software pages  
2. Inventory current Guides  
3. Load current ResearchMedia  
4. Identify media/visual gaps  
5. Search official sources (via discovery agents / seeds)  
6. Verify candidate sources  
7. Deduplicate against known assets + search memory  
8. Classify relevance (prioritization agent)  
9. Identify exact page placements (backlog + approval placements)  
10. Identify original SoftwareGlimpse visual opportunities  
11. Prioritize (A0–A3)  
12. Generate local reports  

## Modes

| Mode | Intent | Typical schedule |
| --- | --- | --- |
| **LIGHT** | Media-health + inventory + change diffs | Weekly |
| **FULL** | Full software + guide discovery + prioritize | Monthly |
| **DEEP** | Flagship products + prioritized guide sample | Quarterly |

## Commands

```bash
npm run assets:intelligence
npm run assets:intelligence:software
npm run assets:intelligence:guides
npm run assets:intelligence:crm

npm run assets:intelligence -- --mode LIGHT
npm run assets:intelligence -- --mode FULL
npm run assets:intelligence -- --mode DEEP
npm run assets:intelligence -- --no-write
npm run assets:intelligence -- --strict-integrity
npm run assets:intelligence -- --software-limit 5 --guide-limit 10
```

## Outputs

| Path | Role |
| --- | --- |
| `docs/content-assets/ASSET-INTELLIGENCE-LATEST.md` | Master intelligence report |
| `docs/content-assets/SOFTWARE-ASSET-OPPORTUNITIES.md` | Maintained by software agent |
| `docs/content-assets/GUIDE-ASSET-OPPORTUNITIES.md` | Maintained by guide agent |
| `docs/content-assets/ASSET-ENRICHMENT-BACKLOG.md` | Prioritized backlog |
| `docs/content-assets/archive/YYYY-MM-DD-asset-intelligence.md` | Archive |
| `docs/content-assets/archive/opportunities-latest.json` | Change-tracking snapshot |
| `data/content-assets/search-memory.json` | Avoid rediscovering same videos |

## Change tracking

Stable IDs: `CAI-{ENTITY}-{KIND}-{HASH}`

| Kind | Meaning |
| --- | --- |
| NEW | First seen this run |
| STILL OPEN | Present in previous + current |
| IMPLEMENTED | Previous opportunity whose provider/URL now exists in ResearchMedia |
| NO LONGER AVAILABLE | Dropped without implementation evidence |
| STALE | Stale/unavailable media signal |
| DISMISSED | Explicitly dismissed id list |

Link related Content Quality issue ids + content-map node ids on snapshot items.

## CI / scheduling

Workflow: `.github/workflows/content-asset-intelligence.yml`

- Weekly LIGHT  
- Monthly FULL (first Sunday)  
- Quarterly DEEP (first Sunday of Jan/Apr/Jul/Oct)

**Never fails the build** for missing screenshots or opportunity gaps.  
`--strict-integrity` may exit non-zero only for deterministic problems (broken active media, invalid required URLs).

## Agents composed

- SoftwareAssetDiscoveryAgent  
- GuideAssetDiscoveryAgent  
- AssetOpportunityPrioritizationAgent  
- Product media health (`audit:media-health` logic)  
- Approved Asset Workflow (downstream, manual)

## Code

`src/services/asset-discovery/intelligence/`
