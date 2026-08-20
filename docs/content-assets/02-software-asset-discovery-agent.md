# SoftwareAssetDiscoveryAgent

> Agent ID: `software-asset-discovery-agent`  
> Version: `1.0.0`  
> Status: recommendations only — **never edits product pages**

## Purpose

Audit every SoftwareGlimpse software/product page and identify useful **official** assets (videos, tutorials, screenshots, pricing/docs sources, industry demos) with placement and priority recommendations.

## CLI

```bash
npm run assets:agent:software -- --all --write
npm run assets:agent:software -- --product hubspot --write
npm run assets:agent:software -- --all --include-unpublished --write --json
```

## Outputs

| Path | Content |
| --- | --- |
| `docs/content-assets/software/[slug]-asset-opportunities.md` | Per-product section audit + assets |
| `docs/content-assets/SOFTWARE-ASSET-OPPORTUNITIES.md` | Master table across all products |

## Pipeline

```text
Load Software + Enrichment + Sources + ResearchMedia
  → section need analysis (Overview…FAQ/Implementation)
  → major feature / use-case / industry search tasks (importance-gated)
  → reuse existing ResearchMedia (dedupe YouTube URL variants)
  → recommendation levels (ADD NOW … DO NOT USE)
  → stale media + original SG visual opportunities
  → Markdown reports
```

## Recommendation levels

| Level | Meaning |
| --- | --- |
| ADD NOW | High-value missing official demo/tutorial — search vendor sources next |
| STRONG OPPORTUNITY | Strong fit; pursue after ADD NOW |
| OPTIONAL | Nice-to-have (e.g. industry demo if vendor publishes one) |
| SOURCE ONLY | Official docs/pricing already known — link/cite only |
| REUSE EXISTING MEDIA | Already on ResearchMedia — do not duplicate |
| DO NOT USE | Brand ads / no UI / unclear rights |

## Code

`src/services/asset-discovery/software-agent/`
