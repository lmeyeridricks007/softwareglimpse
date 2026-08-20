# Business Communications — Priority-3 Onboarding

**Date:** 2026-08-17  
**Category:** `business-communications`  
**Methodology:** `business-communications-editorial` v1.0.0  
**Hands-on testing:** `false`  
**Affiliate economics:** excluded from every score and best-page rank. **No WordPress auto-publish.**

Closes Priority-3 from [`business-communications-product-coverage.md`](./business-communications-product-coverage.md): enterprise UC mid-tier (Webex), SMB/mid VoIP (Vonage, Ooma), and CCaaS landscape (Talkdesk, Genesys, Five9). Deferred still: Twilio, ManyChat, Intercom/Front.

## Products

| Product | Slug | Job cluster | Overall | Best-page role | Entry price (researched) | CQ |
| --- | --- | --- | ---: | --- | --- | ---: |
| Cisco Webex | `webex` | cloud-phone | **8.0** | Phone rank #7 — Best enterprise UC / Webex Calling | Meet ~$14.50 / Suite ~$22.50 (medium); Free $0 | **91** |
| Vonage | `vonage` | cloud-phone | **6.9** | Phone rank #11 — Best SMB/mid published-line VoIP | Mobile $13.99/line/mo annual promo (high) | **91** |
| Ooma | `ooma` | cloud-phone | **6.6** | Phone rank #13 — Best no-contract SMB Office VoIP | Essentials $19.95/user/mo (high) | **91** |
| Talkdesk | `talkdesk` | contact-center | **8.4** | Landscape — Best cloud contact center for mid-market CX | Digital Essentials $85/user/mo (high) | **91** |
| Genesys | `genesys` | contact-center | **8.8** | Landscape — Best enterprise cloud contact center | CX 1 $75 named annual (high) | **91** |
| Five9 | `five9` | contact-center | **8.2** | Landscape — Best dialer-forward cloud contact center | Digital $119 concurrent (50-seat min; high) | **91** |

### Phone ranks after P3 (editorial fit + scores)

1. RingCentral 8.8  
2. 8x8 (`eightx8`) 8.6  
3. Dialpad 8.5  
4. Zoom 8.4  
5. Aircall 8.3  
6. Nextiva 8.1  
7. **Webex 8.0**  
8. OpenPhone 7.5  
9. GoTo Connect 7.4  
10. CallHippo 7.2  
11. **Vonage 6.9**  
12. KrispCall 6.8 (fit above Freshcaller)  
13. **Ooma 6.6** (≥ ~6.5 phone threshold)  
14. Freshcaller 7.0 (inbound-only shape)

### Criterion matrix (P3)

| Product | ease | voice | routing | integr | analytics | outbound | scale | value | ai | overall |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| webex | 7 | 9 | 8 | 9 | 8 | 6 | 10 | 6 | 8 | 8.0 |
| vonage | 8 | 8 | 7 | 7 | 6 | 5 | 7 | 7 | 5 | 6.9 |
| ooma | 8 | 7 | 7 | 6 | 6 | 5 | 6 | 8 | 5 | 6.6 |
| talkdesk | 7 | 9 | 10 | 9 | 9 | 8 | 9 | 5 | 9 | 8.4 |
| genesys | 6 | 10 | 10 | 10 | 10 | 8 | 10 | 5 | 9 | 8.8 |
| five9 | 7 | 9 | 9 | 9 | 8 | 9 | 9 | 5 | 8 | 8.2 |

## Deliverables

| Artifact | Path |
| --- | --- |
| Batch script | `scripts/onboard-bc-priority3-batch.mjs` |
| Shared runtime | `scripts/lib/bc-onboard-runtime.mjs` (`planPerSeatMonthly`, `contact-center` cluster) |
| Product pack | `scripts/lib/bc-priority3-products.mjs` |
| Seed patcher | `scripts/patch-software-seed-bc-priority3.mjs` |
| Seed snippet | `scripts/_bc-priority3-seed-snippet.ts` |
| Lettermarks | `scripts/generate-bc-priority3-lettermarks.mjs` → `public/brands/{slug}.png` |
| Teaching visuals | `scripts/generate-bc-priority3-teaching-visuals.mjs` → `public/software/{slug}/overview.png` + `workflow.png` |
| Research / editorial | `src/data/research/{slug}/`, `editorial/assessments|reviews/{slug}.json` |
| Soft seeds | `src/data/seed/software.ts` (108 → **114**) |
| Category seeds | `src/data/category-onboarding/seed/business-communications.ts` `seedProductSlugs` |
| Best page | `src/data/seed/best.ts` — phone ranks 1–14 + CCaaS landscape cluster |
| Comparisons | 7 new `approvedBcPair` entries in `src/data/seed/comparisons.ts` |

## Comparisons added

- `webex-vs-zoom`
- `ringcentral-vs-webex`
- `nextiva-vs-vonage`
- `callhippo-vs-ooma`
- `genesys-vs-talkdesk`
- `five9-vs-talkdesk`
- `genesys-vs-ringcentral` (cross-cluster decision-path only)

CCaaS pairs are intentionally not mixed into phone ranks.

## Pricing grounding (2026-08-17)

| Product | Confidence | Notes |
| --- | --- | --- |
| Cisco Webex | medium (paid) / high (Free) | Free confirmed on webex.com/pricing; Meet/Suite dollars from research consensus (~$14.50 / ~$22.50) — UI is region/SKU dynamic; Calling/CC often EA |
| Vonage | high | Mobile/Premium/Advanced $13.99/$20.99/$27.99 annual promo on vonage.com/unified-communications/pricing |
| Ooma | high | Essentials/Pro/Pro Plus $19.95/$24.95/$29.95 monthly on Office pricing chart (updated 2026-04-15) |
| Talkdesk | high | Digital $85 / Voice $105 / Elite $165 / Industry $225 on talkdesk.com/pricing; CXA AI add-on |
| Genesys | high | CX 1–4 $75/$115/$155/$240 named annual on genesys.com/pricing |
| Five9 | high (Digital/Core) | Digital $119 / Core $159 concurrent; 50-seat min; Plus/Pro/Enterprise **quote-only — no invented dollars** |

## Best-page cluster rules

- **Phone / UCaaS ranks:** RingCentral → 8x8 → Dialpad → Zoom → Aircall → Nextiva → Webex → OpenPhone → GoTo Connect → CallHippo → Vonage → KrispCall → Ooma → Freshcaller  
- **Landscape awards (not phone peers):** Talkdesk / Genesys / Five9 (CCaaS), Grasshopper, respond.io, Slack, Microsoft Teams, Wati, Zenzap, Kixie, Fastmail, SaneBox  
- Do **not** rank CCaaS platforms against SMB/mid business phones

## Quality / gates

- Assessments + reviews: **approved**, `handsOnTesting=false`, methodology `business-communications-editorial` v1.0.0  
- Product-review CQ: **91** target pattern (same editorial depth as Wave-1 / P1 / P2; aim ≥75)  
- Availability enums: supported | limited | add-on | higher-plan-only | not-supported | unknown only  
- Logos: SoftwareGlimpse lettermarks (not scraped trademarks)  
- Teaching visuals: educational SVG→PNG diagrams  
- No WP auto-publish  

## Blockers / follow-ups

- **Webex paid seat dollars:** medium confidence behind dynamic/EA pricing — re-check live cart before hard dollar claims in guides  
- **Five9 Plus/Pro/Enterprise:** quote-only — do not invent list prices  
- **Talkdesk CXA AI:** add-on commercial — keep separate from CX Cloud seat floors  
- Prefer premium GenerateImage teaching visuals when refreshing BC guide packs  
- Replace lettermarks with vendor press-kit assets only if licensing allows  
- Deferred products remain: Twilio, ManyChat, Intercom/Front  
- WP publish of BC hubs / reviews still open (optional)  
