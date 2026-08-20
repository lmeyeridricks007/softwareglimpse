# GuideAssetDiscoveryAgent

> Agent ID: `guide-asset-discovery-agent`  
> Version: `1.0.0`  
> Status: recommendations only — **never edits guides**

## Purpose

Audit Guides / Articles and identify where **official**, **authoritative**, or **original SoftwareGlimpse** assets would materially improve explanation, evidence, or actionability — not decoration.

## CLI

```bash
npm run assets:agent:guides -- --all --write
npm run assets:agent:guides -- --guide how-to-choose-crm --write
npm run assets:agent:guides -- --all --include-unpublished --write --json
```

## Outputs

| Path | Content |
| --- | --- |
| `docs/content-assets/guides/[slug]-asset-opportunities.md` | Per-guide section audit |
| `docs/content-assets/GUIDE-ASSET-OPPORTUNITIES.md` | Master table + top 30 |

## Judgment rules

| Guide kind | Prefer |
| --- | --- |
| Vendor-neutral fundamental / selection | Original SG diagrams; vendor media only in evaluation/demo sections |
| Product implementation / setup / migration | Official tutorials, setup demos, import docs |
| Industry | Original architecture + authoritative/regulatory cites; never vendor promo as compliance evidence |
| Feature / comparison blocks | Original comparison graphics |

Searches are **section-derived** (e.g. Field Mapping → official import docs), not page-title-only.

## Content Quality link

When `visual-media-support` ≤ 2, recommendations include `Resolves: CQ-GUIDE-{SLUG}-VISUAL` so asset work is not disconnected from CQ audits.

## Code

`src/services/asset-discovery/guide-agent/`
