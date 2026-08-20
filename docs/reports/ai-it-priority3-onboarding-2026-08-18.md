# AI & IT — Priority-3 onboarding

**Date:** 2026-08-18  
**Scope:** Remaining industry shortlist names after Wave-1 + Priority-2: Synthesia, Fireflies.ai, Dynatrace, Azure DevOps.  
**No WordPress auto-publish.** Editorial gates cleared in Next.js seed only.

Related: [`ai-it-wave1-onboarding-2026-08-18.md`](./ai-it-wave1-onboarding-2026-08-18.md) · [`ai-it-priority2-onboarding-2026-08-18.md`](./ai-it-priority2-onboarding-2026-08-18.md) · [`ai-product-coverage.md`](./ai-product-coverage.md) · [`it-development-product-coverage.md`](./it-development-product-coverage.md)

## Summary

| Category | Products | Comparisons | Cluster award change |
| --- | ---: | ---: | --- |
| **AI** | 2 | 4 | Synthesia takes **ai-video**; Fireflies.ai takes **ai-meeting** |
| **IT & Development** | 2 | 4 | Datadog / GitHub awards **unchanged** |

This wave also closed the remaining AI/IT content gaps from Priority-2: CORE 5-guide packs, product-guide builders, official YouTube embeds, and per-product `overview.png` files.

## AI Priority-3 (2)

| Product | Slug | Cluster | Overall | Notes |
| --- | --- | --- | ---: | --- |
| Synthesia | `synthesia` | ai-video | **8.0** (award) | Avatar / L&D video. Starter $18/mo annual; Basic free has no MP4. Runway **7.7** remains the generative-filmmaking peer |
| Fireflies.ai | `fireflies` | ai-meeting | **8.2** (award) | Pro $10/seat annual. Otter.ai **8.0** remains the lower individual-floor peer |

**Still deferred:** Meta AI (consumer), DALL·E standalone (covered via ChatGPT), Zapier AI / n8n AI (automation overlay — review).

## IT Priority-3 (2)

| Product | Slug | Cluster | Overall | Notes |
| --- | --- | --- | ---: | --- |
| Dynatrace | `dynatrace` | observability-monitoring | 8.2 | DPS annual commit; Full-Stack list unit ~$58/mo per 8 GiB host. Datadog **8.6** stays award. Not PagerDuty |
| Azure DevOps | `azure-devops` | source-control-devops | 8.2 | 5 Basic users free, then $6/user; Test Plans $52. GitHub **9.1** stays award. Not GitHub Copilot and not Jira Software |

**Still deferred:** Cloudways / WP Engine (hosting *providers*, not panels), Oxylabs / ScraperAPI / Apify, ThorData (`REVIEW_REQUIRED`).

## Pricing grounding (2026-08-18)

| Product | Confidence | Published floor |
| --- | --- | --- |
| Synthesia | high | Basic free (watermark, no MP4); Starter $18/mo annual ($29 monthly) |
| Fireflies.ai | high | Free 400 min storage; Pro $10/seat/mo annual |
| Dynatrace | high (commit) | DPS quote + public rate card; Full-Stack ~$58/8 GiB host is a unit, not a self-serve SKU |
| Azure DevOps | high | 5 Basic free; additional Basic $6/user/mo; Basic + Test Plans $52/user/mo |

## Cluster rules

- **Synthesia ≠ Runway** — same `ai-video` cluster, different production job (avatar/L&D vs generative clips)
- **Fireflies.ai ≠ Microsoft 365 Copilot** — meeting notes vs Teams recap add-on
- **Dynatrace ≠ PagerDuty** — observability vs on-call
- **Azure DevOps ≠ GitHub Copilot ≠ Jira Software**
- Rank **within** job clusters only. Affiliate economics excluded. `handsOnTesting=false`

## Deliverables

- Seed entries in `src/data/seed/software.ts` (Synthesia, Fireflies.ai, Dynatrace, Azure DevOps)
- Research packs under `src/data/research/{slug}/`
- Approved assessments + product reviews (product-review CQ path unchanged; `handsOnTesting=false`)
- Brand marks: `public/brands/{synthesia,fireflies,dynatrace,azure-devops}.png` (SG lettermarks)
- Best pages: Synthesia / Fireflies.ai cluster awards; Datadog / GitHub awards name the new peers
- 8 approved comparison pairs
- Category `seedProductSlugs` updated in `ai.ts` / `it-development.ts` and activated JSON
- CORE what-is copy now names the P3 products as cluster examples
- Product-guide SVG v3 packs: 60 AI + 60 IT PNGs under `public/guides/`
- Official YouTube embeds in enrichment `media` (vendor-channel oEmbed)
- Per-product `public/software/{slug}/overview.png`

### Comparisons added

- runway-vs-synthesia  
- fireflies-vs-otter-ai  
- fireflies-vs-microsoft-copilot (landscape — meeting notes vs Teams recap)  
- midjourney-vs-synthesia (landscape — stills vs avatar video)  
- datadog-vs-dynatrace  
- dynatrace-vs-new-relic  
- azure-devops-vs-github  
- azure-devops-vs-gitlab  

## CORE 5-guide packs + product-guide builders

Shipped in this close-out (written before P3, then P3 names added to what-is copy):

| Pack | Status |
| --- | --- |
| AI CORE 5 (`what-is`, `how-to-choose`, pricing, requirements, evaluation) | Published / indexable, unique 1536×1024 heroes |
| IT CORE 5 | Same |
| `buildAiProductGuide` / `buildAllAiProductGuides` | Wired; 16 primaries × 5 kinds = **80** pages |
| `buildItProductGuide` / `buildAllItProductGuides` | Wired; 14 primaries × 5 kinds = **70** pages (Freshservice stays customer-service primary) |

Niche AI catalogue (Wegic, AdCreative.ai, MindStudio) stays on category guides — no full 5-kind packs.

## Official media

| Product | Official YouTube | `overview.png` |
| --- | --- | --- |
| Synthesia | `ikQZ8yLhHRU` (Synthesia) | Yes (OG) |
| Fireflies.ai | `TOnbh8tUljY` (Fireflies AI) | Yes (OG) |
| Dynatrace | `qo6vjyE-Ak0` (Dynatrace) | Yes |
| Azure DevOps | `JhqpF-5E10I` (Microsoft) | Yes (official YT thumb fallback) |
| Remaining Wave-1 / P2 AI+IT | Official vendor-channel embeds where oEmbed author matched | Yes for every primary slug |

**Known gaps:** QuillBot and MindStudio have no official vendor-channel YouTube that passed the allowlist. QuillBot homepage OG was blocked; teaching visual is an original diagram, not vendor-ui.

## Quality / gates

- Reviews **approved**, `handsOnTesting=false`
- Affiliate economics excluded from scores
- **No WordPress publish**
- Identity: Microsoft 365 Copilot ≠ GitHub Copilot ≠ GitHub; Jira Service Management ≠ Jira Software; PagerDuty ≠ Datadog
- Seed patchers now insert before `export const softwareSeed` so `sanitizePeerSlugLists` is not split again

## Follow-ups (Priority-3+)

1. Zapier AI / n8n AI — treat as automation overlay, not a new LLM-assistant peer, if onboarded  
2. Oxylabs, ScraperAPI, Apify — web-data peers of Bright Data  
3. ThorData remains `REVIEW_REQUIRED`  
4. Cloudways / WP Engine only if hosting-*provider* cluster is explicitly opened  
5. GenerateImage `-v4` teaching packs for P3 product guides (current assets are SVG v3 fallbacks)  
6. Replace SG lettermarks with press-kit logos when available  
7. Optional WP publish — live WordPress still has no AI/IT coverage  
