# AI & IT — Priority-2 onboarding

**Date:** 2026-08-18  
**Scope:** Credibility wave (no affiliate required) — industry shortlist names buyers expect after Wave-1.  
**No WordPress auto-publish.** Editorial gates cleared in Next.js seed only.

Related: [`ai-it-wave1-onboarding-2026-08-18.md`](./ai-it-wave1-onboarding-2026-08-18.md) · [`ai-product-coverage.md`](./ai-product-coverage.md) · [`it-development-product-coverage.md`](./it-development-product-coverage.md)

## Summary

| Category | Products | Comparisons | Best-page cluster awards |
| --- | ---: | ---: | --- |
| **AI** | 8 | 8 | Cursor (code), Midjourney (image), Runway (video), Otter.ai (meetings); ChatGPT remains LLM |
| **IT & Development** | 8 | 9 | ServiceNow (ITSM), PagerDuty (on-call); Datadog / GitHub / Plesk unchanged |

**Software seed:** 203 → **219** products (+16)

## AI Priority-2 (8)

| Product | Slug | Cluster | Overall | Notes |
| --- | --- | --- | ---: | --- |
| Microsoft 365 Copilot | `microsoft-copilot` | llm-assistant | **8.2** | Add-on; not GitHub Copilot |
| Perplexity | `perplexity` | llm-assistant | **8.3** | Cited research |
| GitHub Copilot | `github-copilot` | ai-code | **8.3** | Distinct from `github` |
| Cursor | `cursor` | ai-code | **8.4** | Cluster award |
| Midjourney | `midjourney` | ai-image | **8.3** | Cluster award |
| Adobe Firefly | `adobe-firefly` | ai-image | **8.1** | Creative Cloud / IP peer |
| Runway | `runway` | ai-video | **7.7** | Cluster award |
| Otter.ai | `otter-ai` | ai-meeting | **8.0** | Cluster award |

**Still deferred:** Meta AI (consumer/social), DALL·E standalone (in ChatGPT), Synthesia, Fireflies, Zapier AI / n8n (automation overlay).

## IT Priority-2 (8)

| Product | Slug | Cluster | Overall | Notes |
| --- | --- | --- | ---: | --- |
| ServiceNow | `servicenow` | itsm-service-desk | **8.7** | Cluster award; quote-only |
| Jira Service Management | `jira-service-management` | itsm-service-desk | **8.0** | Distinct from Jira Software (PM) |
| New Relic | `new-relic` | observability-monitoring | **8.0** | Ingest + user model |
| Grafana Cloud | `grafana-cloud` | observability-monitoring | **7.5** | $19 + usage |
| PagerDuty | `pagerduty` | incident-oncall | **8.0** | New cluster — not Datadog |
| GitLab | `gitlab` | source-control-devops | **8.3** | Premium $29 annual |
| Bitbucket Cloud | `bitbucket` | source-control-devops | **7.6** | 5-user paid minimum |
| cPanel | `cpanel` | hosting-operations | **7.3** | Store list 2026 |

**Still deferred:** Dynatrace, Azure DevOps, Cloudways / WP Engine, Oxylabs / Apify / ScraperAPI, ThorData.

## Pricing grounding (2026-08-18)

| Product | Confidence | Published floor |
| --- | --- | --- |
| Microsoft 365 Copilot | high | Business add-on from $21/user/mo annual; Enterprise $30; **base M365 extra** |
| Perplexity | high | Free; Pro $20/mo; Max $200 |
| GitHub Copilot | high | Pro $10; Business $19/user; Enterprise $39; AI Credits from Jun 2026 |
| Cursor | high | Hobby free; Pro $20; Teams $40/user |
| Midjourney | high | No free; Basic $10/mo ($8 annual) |
| Adobe Firefly | medium | Standalone ~$9.99 Standard; confirm live CC bundles |
| Runway | high | Standard $12/editor/mo annual; credits |
| Otter.ai | high | Pro $8.33/user/mo annual |
| ServiceNow | **low** | No list; $100 placeholder is third-party small-band estimate |
| JSM | high | Free ≤3 agents; Standard from $20/agent |
| New Relic | high | 100 GB free; Standard first full user $10 |
| Grafana Cloud | high | Free caps; Pro from $19 + usage |
| PagerDuty | high | Professional $21/user/mo annual |
| GitLab | high | Premium $29/user/mo annual; Ultimate custom |
| Bitbucket | high | Standard $3.65/user; 5-user min |
| cPanel | high | Solo $29.99/mo |

## Cluster rules

- **Microsoft 365 Copilot ≠ GitHub Copilot ≠ GitHub**
- **Jira Service Management ≠ Jira Software** (PM-primary)
- **PagerDuty ≠ Datadog** (on-call vs observability)
- Rank **within** job clusters only

## Deliverables

- Category seeds bumped to **v1.1.0** (new clusters: ai-image, ai-video, ai-code, ai-meeting, incident-oncall)
- Activated: `activated/ai.json`, `activated/it-development.json`
- Research / editorial packs under `src/data/research|editorial/`
- Best pages updated
- 17 comparison pairs
- Teaching PNGs: `ai-code-hero`, `ai-image-hero`, `incident-oncall-hero`
- Brand marks: official fetch + SG lettermark fallback for Midjourney

## Quality / gates

- Reviews **approved**, `handsOnTesting=false`
- Affiliate economics excluded
- **No WordPress publish**
- Official YouTube embeds: still not wired
- CORE category guides / product-guide builders: still follow-up

## Follow-ups (Priority-3)

1. Synthesia, Fireflies, Copilot vs Cursor official videos
2. Oxylabs (web-data peer), Dynatrace, Azure DevOps
3. CORE 5-guide packs for `ai` and `it-development`
4. Per-product `public/software/{slug}/overview.png`
5. Replace tiny favicon marks (Microsoft Copilot, Grafana) with higher-res brand assets
