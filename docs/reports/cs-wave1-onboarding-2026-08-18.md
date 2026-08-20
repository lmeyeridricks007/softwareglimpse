# Customer Service — Wave 1 Onboarding

**Date:** 2026-08-18  
**Category:** `customer-service` (ACTIVATED)  
**Methodology:** `customer-service-editorial` v1.0.0  
**Hands-on testing:** `false` — all scores are research-grounded editorial judgments from vendor documentation and pricing pages, not lab testing.  
**Affiliate economics:** excluded from scoring. No commission, payout, or programme data entered any criterion score, rationale, or ranking input.

## Summary

Nine primary products onboarded end to end (research pack → enrichment → assessment → review → `soft()` seed). Tidio was **re-homed** from CRM-primary to customer-service live-chat primary (not a sales CRM). Intercom remains business-communications primary with CS secondary only.

This supporting-content pass (same day) wired comparisons, best page, category + product guides, use-case hubs, capability hubs, teaching visuals, official videos, and vendor OG screenshots. **Do not auto-publish WordPress.**

## Products written

Overall scores are weighted averages over the ten CS criteria (support job fit 15, ease of use 12, workflow depth 12, omnichannel 10, integrations 10, value 10, self-service 8, analytics 8, scalability 8, AI 7).

| Product | Role | Job cluster | Overall | Entry price (researched) |
| --- | --- | --- | ---: | --- |
| Zendesk Suite | primary | helpdesk-ticketing | **8.2** | Support Team $19/agent/mo annual; Suite Team $55, Suite Pro $115 |
| Freshservice | primary | itsm-service-desk | **8.0** | Starter $19, Growth $49, Pro $99 agent/mo annual |
| Freshdesk | primary | helpdesk-ticketing | **7.9** | Growth $19/agent/mo annual; 14-day trial; no free forever |
| Zoho Desk | primary | helpdesk-ticketing | **7.8** | Free ≤3 agents; Express $7 … Enterprise $40 agent/mo annual |
| Gorgias | primary | ecommerce-helpdesk | **7.7** | Starter $40/mo (50 tickets); Basic $77/mo annual |
| Freshchat | primary | live-chat-support | **7.6** | Free ≤10 agents; Growth $19, Pro $49, Enterprise $79 |
| Help Scout | primary | helpdesk-ticketing (SMB inbox) | **7.5** | Free ≤5 users; Standard $25, Plus $45, Pro $75 user/mo annual |
| LiveChat | primary | live-chat-support | **7.4** | Starter $19 … Business $79 per person/mo annual; no free |
| Tidio | primary (re-homed) | live-chat-support | **7.3** | Starter $24.17/mo annual (100 billable convos); Growth from $49.17 |

### Editorial ranking guidance (best page)

These nine do **not** form one ranked list.

- **Helpdesk / ticketing:** Zendesk Suite **8.2** cluster award; Freshdesk **7.9** Freshworks mid-market peer award; Help Scout **7.5** SMB shared-inbox landscape; Zoho Desk **7.8** value landscape.
- **Live chat:** Freshchat **7.6** award; LiveChat **7.4** and Tidio **7.3** peers. Tidio is conversation-cap + Lyro — not CRM.
- **Ecommerce helpdesk:** Gorgias **7.7** — ticket-based; do not rank against generic helpdesk or ITSM.
- **ITSM:** Freshservice **8.0** landscape only — distinct from Freshdesk and Freshchat.
- **Intercom:** BC-primary; Best CS eligible as secondary/borderline note only.

`recommendations: []` on the best page — awards live in `useCaseRecommendations` + `decisionPaths` + `landscape`.

## Comparisons

Nine same-cluster pairs from `scripts/_cs-wave1-comparisons.json`, seeded via `approvedCsPair()` (`categorySlug: "customer-service"`, `editorialStatus: approved`, `seo.indexable: true`).

**Helpdesk cluster**

| Canonical slug | Overall A vs B |
| --- | --- |
| `freshdesk-vs-zendesk-suite` | 7.9 vs 8.2 |
| `freshdesk-vs-help-scout` | 7.9 vs 7.5 |
| `freshdesk-vs-zoho-desk` | 7.9 vs 7.8 |
| `help-scout-vs-zendesk-suite` | 8.2 vs 7.5 |
| `zendesk-suite-vs-zoho-desk` | 8.2 vs 7.8 |
| `help-scout-vs-zoho-desk` | 7.5 vs 7.8 |

**Live-chat cluster**

| Canonical slug | Overall A vs B |
| --- | --- |
| `freshchat-vs-livechat` | 7.6 vs 7.4 |
| `freshchat-vs-tidio` | 7.6 vs 7.3 |
| `livechat-vs-tidio` | 7.4 vs 7.3 |

No Freshdesk-vs-Freshservice, Gorgias-vs-Zendesk, or other cross-cluster manufactured pages.

Criteria: starting-pricing, free-plan, agent-minimum (factual) + ticketing-depth, live-chat, knowledge-base, omnichannel, sla-routing, ecommerce-helpdesk, ai-features, integrations (editorial).

## Supporting content files

**Best / comparisons / criteria**

- `src/data/seed/best.ts` — `best-customer-service-software` (`slug: customer-service-software`); Tidio not on Best CRM
- `src/data/seed/comparisons.ts` — `CS_COMPARISON_CRITERIA` + `approvedCsPair()` + 9 pairs
- `src/data/seed/comparison-criteria.ts` — CS applicable slugs

**Guides** (`softwareglimpse-guide-template-v1`, `seo.indexable: true`)

- `guides-cs-cluster.ts` → `csCategoryGuides`
- `guides-what-is-customer-service-software.ts`
- `guides-how-to-choose-customer-service-software.ts`
- `guides-customer-service-pricing-guide.ts`
- `guides-customer-service-requirements-guide.ts`
- `guides-customer-service-evaluation-guide.ts`
- `guides-product-cs.ts` — what-is + is-worth-it for freshdesk, zendesk-suite, help-scout, gorgias, tidio
- Wired in `src/data/seed/guides.ts`

**Use-case hubs**

- `src/data/use-case-hub/customer-service-deep.ts` — helpdesk-ticketing, live-chat-support, ecommerce-support, knowledge-base-self-service, omnichannel-support, itsm-service-desk, ai-customer-service
- Merged in `src/data/use-case-hub/index.ts`

**Hero visual paths (assets generated 2026-08-18)**

Category: `public/categories/customer-service-{hero,needs,workflow}.png`.

Guides: five category-guide heroes + body figures (`-building-blocks`, `-loop`, `-needs`, `-framework`, `-stack`, `-worked-example`, `-sheet`, `-script`) and ten product-guide heroes (`what-is-{slug}` / `is-{slug}-worth-it` for freshdesk, zendesk-suite, help-scout, gorgias, tidio).

Use-case hubs (7 × hero / needs-v2 / workflow-v2): helpdesk-ticketing, live-chat-support, ecommerce-support, knowledge-base-self-service, omnichannel-support, itsm-service-desk, ai-customer-service.

Capability hubs (8 × hero / needs-v2 / workflow-v2): ticketing, live-chat, knowledge-base, omnichannel-inbox, sla-routing, ecommerce-helpdesk, itsm-service-desk, chatbot-ai-agent.

All 71 wired PNGs are on disk at ~1MB+ (16:9 teaching visuals). Do not cache-bust with `?v=`.

**Official videos** (Approved Asset Workflow — `npx tsx scripts/import-cs-wave1-official-videos.ts`)

Vendor registry entries added for freshdesk, zendesk-suite, help-scout, freshservice. Activated:

| Product | videoId | Channel |
| --- | --- | --- |
| freshdesk | D_h1-nkpWDo, OYLneG_flBc | Freshworks |
| zendesk-suite | yeWWAWQz24Y, Rpvakye33d0 | Zendesk |
| help-scout | NZ-91yXEv4c | Help Scout |
| freshservice | 3hFyhxceMXA | Freshservice |

No verified official-channel IDs imported for gorgias, tidio, freshchat, livechat, zoho-desk (do not import third-party tutorials).

**Official screenshots** (`node scripts/source-cs-wave1-product-media.mjs`)

Vendor `og:image` from first-party product pages already in research `sources.json`. Freshservice already had five vendor-ui frames from the IT/CS overlap pass.

| Product | File | Note |
| --- | --- | --- |
| freshdesk | overview.webp | Freshworks DAM omnichannel OG |
| freshchat | overview.jpg | Freshworks DAM OG |
| help-scout | overview.jpg | Contentful home meta (imgix 403 unwrapped) |
| livechat | overview.png | livechat.com OG |
| tidio | overview.png | tidio.com OG |
| zoho-desk | overview.png | zohowebstatic desk-logo OG |
| gorgias | overview.png | Website-files homepage thumbnail (small) |
| zendesk-suite | overview.png | Zendesk only publishes a favicon as OG — not a product UI frame |

## Affiliates

| Product | Inventory | Destination in inventory |
| --- | --- | --- |
| tidio | aff-tidio | Yes — `https://affiliate.tidio.com/9dfzehpzpg2p-8xvu4` |
| freshdesk | aff-freshdesk (Impact) | URL missing — do not invent |
| freshchat | aff-freshchat (Impact) | URL missing — do not invent |
| freshservice | aff-freshservice (Impact) | URL missing — do not invent |
| Others | No CS affiliate row | Credibility only |

Economics never entered ranking.

## Deliberately out of scope

- WordPress auto-publish
- Cross-cluster comparisons (helpdesk vs ITSM, live chat vs ecommerce)
- Intercom CS-primary re-score
- Invented affiliate floors or commission-ordered awards
- Third-party YouTube tutorials as “official” videos
- Invented Zendesk product-UI screenshots (vendor OG is a favicon)
