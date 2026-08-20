# SoftwareGlimpse ranking, competition, and affiliate traffic

**Date:** 2026-08-19 (updated: all 11 categories, not CRM-only)  
**Assumption:** Real legal identity is in place. This note does **not** treat launch-legal fields as a ranking or revenue blocker.

**Verdict:** The site is a strong **multi-category decision product** (279 products, 11 Best pages, CORE maps complete). It is **not** yet a ranking competitor on any “best {category} software” head term, and it is **not** yet an affiliate-traffic engine. Completeness is high everywhere. Distinctiveness, off-site authority, and monetized SERP coverage are not. CRM is the only cluster the Ranking Opportunity Agent fully scored; other categories use the same playbook plus catalogue, Best-page scores, and affiliate coverage.

**Keywords it can actually chase:** mid-intent **choose / what-is** in every category; product setup–implementation–migration packs; reviews of **mid-tier names that already pay** (Pipedrive, Close, monday, GetResponse, Kit, Lusha, Hive, Breezy, …); a short list of money comparisons. Not “best CRM/PM/email/AI software” vs G2, and not the 3,368 Difficult comparison pairs.

**Traffic you could expect (scenario, not GSC):** **400–2,000 / month at 6 months**; **2,000–11,000 at 12 months** if CRM lands and one other wedge (email or PM) is distinctive; **12,000–40,000 site-wide at 18–24 months** if 3–4 categories each have a choose pillar + a paying product cluster. Affiliate clicks **~30–200 → 150–800 → 500–3,000 / month** on those horizons if programmes stay as they are plus HubSpot/Shopify/ActiveCampaign/Apollo/Freshworks if approved. Search Console is not connected.

This document does **not** rewrite or publish anything.

---

## Direct answers

| Question | Answer |
| --- | --- |
| How strong is the website now? | **Strong as a product, not as a ranking brand.** Website Intelligence **84/100**. Technical SEO **100** (19 live probes). Content quality **87**. Experience **83**. Ecosystem **85**. Competitive strength **56** (weak). CRM is **MATURE**; other primary categories **TOOL_READY**. |
| Will it rank? | **Not on any “best {X} software” head against G2 / PCMag / Forbes / vendors in the near term.** All 11 Best pages except CRM scored **Difficult (31)**. Better chance on choose / what-is / setup / mid-tier reviews — CRM first (scored), then email, PM, sales intelligence by analogue. Of 4,896 scored opportunities: **819** Good · **4** Moderate · **4,073** Difficult. Median **31**. |
| Will it compete in the market? | **On-page tools and decision frameworks beat thin affiliate listicles.** Marketplaces, magazines, and vendors still win media, review volume, and DA on commercial heads in **every** category (G2, Shopify, Slack, ChatGPT, Datadog, Workday, …). |
| Which keywords (all categories)? | **CRM (scored):** `how to choose crm`, `what is crm`, Pipedrive/HubSpot/Salesforce/Zoho/monday setup packs, `pipedrive review`, `hubspot vs pipedrive`. **Other categories (pages exist, not fully scored):** `how to choose {email marketing \| project management \| sales intelligence \| ecommerce \| HR \| customer service \| AI \| IT \| marketing \| business communications}`, matching what-is pages, and reviews of **in-programme** products (GetResponse, Kit, monday, Hive, Lusha, LearnWorlds, Breezy, Tidio/Fastmail once wired). |
| How much traffic (range)? | **Not measured.** **0.4k–2k / month at 6 months**, **2k–11k at 12 months**, **12k–40k site-wide at 18–24 months**. CRM is most of the 12-month base; other categories are upside if executed, not a ×11 multiplier on Best pages. Affiliate clicks **~30–200 / 150–800 / 500–3,000**. |
| Will it get affiliate traffic? | **Not at catalogue scale.** **28** programmes / **279** products; **54** affiliate CTAs vs **225** official. Paying clusters today: CRM (Pipedrive/Close/…), PM (monday/Hive), email (GetResponse/Kit), SI (Lusha/Amplemarket/Closely), marketing (LearnWorlds/Kartra/…), HR (Breezy/Connecteam/…). IT, CS, AI, BC, ecommerce heads mostly do not pay yet. |

---

## How this was produced

| Layer | Command / source | Result |
| --- | --- | --- |
| Website intelligence | `npm run site:intelligence -- --mode FULL` | Overall **84** · competitive **56** · visibility **NOT CONNECTED** · **CRM cluster only** |
| Ranking opportunities | same FULL run | **4,896** pages · median **31** · 83% Difficult. **Best pages for all 11 categories scored.** Product-review/guide seeds are CRM-weighted. |
| Keyword inventory | `CRM-KEYWORD-TARGETS.md` | 4,896 query → page pairs (includes all Best URLs + full comparison mesh) |
| Catalogue + affiliates | `getAllSoftwareUnfiltered` × `getProductAffiliateStatus` × guides/best | 11 categories, 279 products, 1,346 guides, 11 Best |
| Page readiness | four CRM URLs | Choose **73** · Pipedrive **71** · Best CRM **69** · HubSpot vs Pipedrive **69** |
| Affiliates | `affiliate:coverage` + `affiliate:validate` | 28 / 1 pending / 250 none · validate **PASS** |
| Editorial ledger | `docs/reports/site-wide-editorial-audit-2026-08-19.md` | 100% in-category pair mesh; CORE gaps **0 × 11 maps** |
| Live SEO | `seo:audit --mode=full` | 0 findings · 31 completed · 1 skipped |

**Caveat:** Ranking Opportunity **topical authority is CRM-shaped**. Non-CRM how-to-choose/review pages **exist** (CORE maps green) but mostly **were not given 60–69 opportunity scores**. Non-CRM Best pages **were** scored: **10 / 11 Difficult**. Do not read “unscored” as “will not rank”; do not read CRM 69 as a score the other choose pages already have.

SERP competitor pack is **15 Aug CRM fixtures**. Other categories use known SERP incumbents (G2, vendors), not a live SERP crawl.

---

## Scorecard (legal identity ignored)

```text
Overall website quality     84 / 100
Technical SEO              100
Content quality             87
Website experience          83
Content ecosystem           85
Competitive strength        56   ← the market number (CRM sample)
Search visibility          NOT CONNECTED
```

| Inventory | Count |
| --- | ---: |
| Sitemap URLs | 5,741 |
| Published / indexable registry | 6,016 / 5,435 |
| Published software | 279 |
| Indexable comparisons | 3,462 (578 thin pairs noindex) |
| In-category pair mesh | **100%** (3,964 / 3,964) |
| Published guides | 1,346 (CORE gaps 0 on 11 maps) |
| Best pages | **11 / 11** indexable |
| Internal-link edges | 26,116 · 0 orphans |
| Affiliate programmes | 28 active · 1 pending (Motion) · 250 none |
| Published affiliate CTAs | 54 (some from `partner-links.ts` without a programme row) |
| Published official CTAs | 225 |

High dimensional scores mean **modules exist**. Comparison sample avg **87** with **0** outcomes at `confidence: high`. Product-guide packs avg **84** (ecommerce worth-it/plans floor **81**).

---

## All 11 categories at a glance

Primary-category product counts. Email marketing is nested under marketing. Affiliate **active** = programme status ACTIVE. **CTA aff** can be higher when `partner-links.ts` already has a URL.

| Category | Products | Mesh pairs (indexable / noindex) | Guides (approx) | Choose / what-is | Best page (agent) | Programmes live | Affiliate CTAs | Rank + money outlook |
| --- | ---: | ---: | ---: | --- | --- | ---: | ---: | --- |
| CRM | 37 | 223 / 443 | 249 | Yes + do-I-need | **Good 63** | 6 | 6 | **First.** Pipedrive cluster. |
| Sales intelligence | 30 | 425 / 10 | 184 | Yes + do-I-need | Difficult 31 | 3 | 6 | Second-wave. Lusha/Amplemarket/Closely pay; apply Apollo/Hunter. |
| Email marketing | 18 | 145 / 8 | 80 | Yes (no do-I-need) | Difficult 31 | 2 | 6 | Strong analogue to CRM. GetResponse/Kit pay; apply ActiveCampaign/Beehiiv/MailerLite. |
| Marketing | 21 | 209 / 1 | 113 | Yes | Difficult 31 | 5 | 7 | LearnWorlds/Kartra/SocialBee/Leadpages/Brand24 pay. Heads (Hootsuite/Marketo) do not. |
| Business communications | 28 | 361 / 17 | 123 | Yes | Difficult 31 | 0* | 7 | Slack/Zoom/Teams unwinnable soon. Fastmail/Aircall/SaneBox URLs exist — **wire programmes**. TIER_3 Fastmail/SaneBox. |
| Customer service | 9 | 35 / 1 | 19 | Yes | Difficult 31 | 0* | 1 | Small set. Tidio URL exists. Apply Freshworks + Zendesk. |
| Project management | 19 | 163 / 8 | 84 | Yes | Difficult 31 | 6 + Motion pending | 6 | **Best non-CRM paying cluster** (monday, Hive). ClickUp is CPA not rev-share. |
| HR | 24 | 270 / 6 | 28 | Yes | Difficult 31 | 4 | 4 | Breezy/Connecteam/Jibble/Trainual. Workday/ADP are partner-only. |
| Ecommerce | 23 | 251 / 2 | 123 | Yes | Difficult 31 | 2 | 2 | Spocket/AliDrop only. Apply Shopify/Webflow/Printful. Factory CQ floor 81. |
| AI | 21 | 209 / 1 | 98 | Yes | Difficult 31 | 0* | 6 | ChatGPT/Claude SERPs are brutal. Wire QuillBot/ElevenLabs/Gamma. |
| IT & development | 49 | 1,123 / 53 | 253 | Yes (hub is broad) | Difficult 31 | 0* | 3 | Largest mesh, worst affiliate. Wire Plesk/Bright Data/ThorData. Split hosting vs observability vs ITSM. |

\*Programme row missing; some tracking URLs already in `partner-links.ts`.

**Category maturity (editorial):** CRM **MATURE**. All other primary categories **TOOL_READY**. That is coverage, not “a practitioner would cite this over G2.”

---

## Will it rank?

**Short version:** A new domain can win **long-tail and mid-intent** in CRM (scored) and, with the same work, in email / PM / SI. It cannot take **best {category} software** from G2, PCMag, Forbes, Zapier, or the category vendor (HubSpot, Shopify, Slack, ChatGPT, Datadog) until authority exists. Comparison URL volume is not a ranking advantage — 83% of scored pages are Difficult.

### Feasibility by page type (scored set)

| Page type | Pages scored | Good | Difficult | Avg score | What it includes |
| --- | ---: | ---: | ---: | ---: | --- |
| Software reviews | 40 | 39 | 1 | 63 | **CRM products only** |
| Tools | 18 | 18 | 0 | 64 | CRM tools (+ a few global finders) |
| Industry hubs | 25 | 25 | 0 | 64 | CRM-for-{industry} |
| Guides | 251 | 32 | 219 | 37 | Mostly CRM-tagged packs |
| Comparisons | 4,041 | 672 | 3,368 | 36 | **All categories’ pairs** (scoring still CRM-weighted) |
| Best-of lists | 11 | 1 | 10 | 34 | **All 11 Best pages** |
| Alternatives | 277 | 0 | 277 | 31 | Site-wide |
| Resources | 17 | 0 | 16 | 33 | Mostly CRM |

### Best pages (all scored)

| Keyword | Page | Score | Band |
| --- | --- | ---: | --- |
| best crm software | `/best/crm-software/` | 63 | GOOD on paper (SERP still G2/PCMag/Forbes) |
| best sales intelligence software | `/best/sales-intelligence-software/` | 31 | DIFFICULT |
| best email marketing software | `/best/email-marketing-software/` | 31 | DIFFICULT |
| best marketing software | `/best/marketing-software/` | 31 | DIFFICULT |
| best business communications software | `/best/business-communications-software/` | 31 | DIFFICULT |
| best project management software | `/best/project-management-software/` | 31 | DIFFICULT |
| best hr software | `/best/hr-software/` | 31 | DIFFICULT |
| best ecommerce software | `/best/ecommerce-software/` | 31 | DIFFICULT |
| best ai software | `/best/ai-software/` | 31 | DIFFICULT |
| best it & development software | `/best/it-development-software/` | 31 | DIFFICULT |
| best customer service software | `/best/customer-service-software/` | 31 | DIFFICULT |

Same competitive pattern in every vertical: marketplace + magazine + vendor occupy page 1.

### Sampled CRM page readiness (not a rank promise)

| Page | Readiness | Band | Vs current SERP |
| --- | ---: | --- | --- |
| `/guides/how-to-choose-crm/` | 73 | Good | Stronger on decision-criteria depth; media still behind |
| `/software/pipedrive/` | 71 | Good | Strongest affiliate-aligned cluster |
| `/compare/hubspot-vs-pipedrive/` | 69 | Good (low confidence) | **0** high-confidence comparison outcomes site-wide |
| `/best/crm-software/` | 69 | Good on paper | G2 / PCMag / Forbes / HubSpot; media gap **−35** |

---

## Which keywords could it rank for?

Treat lists as **priority targets**. Public volume sources disagree; use traffic potential, not a single cell. Authority unmeasured — optimistic.

### Site-wide pattern (every category)

| Tier | Query class | Exists today? | Rank odds (new domain) |
| --- | --- | --- | --- |
| A | `how to choose {category}`, `what is {category}` | **Yes in all 11** | Best first ranks (CRM scored 68–69; others analogue) |
| A | `{paying-product} review` + setup/implementation/migration | Factory packs yes | Good if the name is mid-tier (Pipedrive, GetResponse, Hive), not ChatGPT/Salesforce |
| A | 3–5 **money comparisons** with ≥1 in-programme side | Mesh yes; research thin | Only if rewritten distinctive; keep thin pairs noindex |
| B | Niche `{category} for {industry/job}` | CRM industries strong; others thinner | Easier SERPs, small demand |
| B | Tools (finder, TCO, planner) | CRM-rich; other cats fewer | High intent, modest volume |
| C | `best {category} software` | 11/11 indexable | Difficult (10/11 scored 31) |
| C | `{giant} alternatives`, most `{a} vs {b}` mesh | 277 alts, 4,040 pairs | Do not plan traffic |

---

### CRM (scored) — still the #1 cluster

**Tier A:** `how to choose crm` (69), `what is crm` (68), `do i need a crm` (68), `how crm software works`, requirements/evaluation guides (67), Pipedrive/HubSpot/Salesforce/Zoho/monday/Freshsales **setup · implementation · migration** (66–67), `pipedrive review` (64), `close review` (64), `hubspot vs pipedrive` (64), `close vs pipedrive`, `pipedrive vs zoho crm`, `pipedrive vs salesforce`, `monday sales crm vs pipedrive` (62), `crm vs spreadsheet`, `crm pricing guide`.

**Pipedrive cluster:** 41 GOOD queries. **Only large overlap of GOOD + live affiliate CTA.**

**Tier C:** `best crm software`, `{product} alternatives` (0/277 Good), ~3,368 Difficult pairs.

---

### Sales intelligence

**Pages in hand:** `/guides/how-to-choose-sales-intelligence/`, `/guides/what-is-sales-intelligence/`, `/guides/do-i-need-sales-intelligence/`, `/best/sales-intelligence-software/` (Difficult 31), 30 reviews, 435 pairs.

**Chase:** how to choose / what is / do I need SI; **lusha review**, **amplemarket review**, **closely review**, **reply.io review** (URL already in partner-links); `hunter vs apollo` / `lusha vs apollo` after Apollo apply.

**Do not plan on:** `best sales intelligence`, `zoominfo review`, `gong review`, `linkedin sales navigator`, `6sense vs demandbase` (enterprise SERPs).

**Pays today:** Lusha, Amplemarket, Closely (+ Reply/BookYourData/Kixie if wired). **Apply:** Apollo (15/20% × 12 mo), Hunter, Instantly, Snov, Lemlist.

---

### Email marketing

**Pages in hand:** `/guides/how-to-choose-email-marketing/`, `/guides/what-is-email-marketing/`, Best (Difficult 31), 18 products.

**Scored overlap:** `activecampaign review` (64) and ActiveCampaign vs HubSpot/Mailchimp (61–62) — ActiveCampaign has **no live programme yet**.

**Chase:** how to choose / what is email marketing; **getresponse review** + setup packs; **kit review**; `getresponse vs mailchimp`, `kit vs mailerlite`, `activecampaign vs klaviyo` after apply.

**Do not plan on:** `best email marketing software`, `klaviyo review` vs Klaviyo.com + G2 (partner-only affiliate).

**Pays today:** GetResponse, Kit (+ AWeber, Campaign Monitor, Bouncer, InboxAlly if wired). **Apply:** ActiveCampaign 30% × 12 mo, Beehiiv 50–60% × 12 mo, MailerLite 30% lifetime.

---

### Marketing & growth

**Pages in hand:** how to choose / what is marketing software, Best (Difficult 31).

**Chase:** how to choose marketing software; **learnworlds**, **kartra**, **leadpages**, **socialbee**, **brand24** reviews; ClickFunnels after apply.

**Do not plan on:** `best marketing software`, Hootsuite/Sprout/Marketo/Braze (partner-only or vendor SERP).

**Pays today:** LearnWorlds, Brand24, Kartra, SocialBee, Leadpages.

---

### Business communications

**Pages in hand:** how to choose / what is, Best (Difficult 31). **0 active programmes**, 7 affiliate CTAs from stored URLs. Fastmail + SaneBox remain **TIER_3**.

**Chase:** how to choose business communications (narrow to email hosting / VoIP / team chat — the hub query is vague); **fastmail**, **aircall**, **sanebox**, **wati** once programmes are wired.

**Do not plan on:** `best business communications`, `slack vs microsoft teams`, Zoom/Webex/RingCentral/Genesys.

---

### Customer service

**Pages in hand:** how to choose / what is, five product “what is” pages, Best (Difficult 31). Only **9** products.

**Chase:** how to choose customer service software; **tidio review** (URL exists); Freshdesk/Zendesk **after** Freshworks + Zendesk apply (20% Y1 / 15% Y1).

**Do not plan on:** `best help desk software` vs G2/Zendesk; Intercom.

---

### Project management & productivity

**Pages in hand:** how to choose / what is, Best (Difficult 31). **Richest non-CRM affiliate set.**

**Chase:** how to choose project management software; **monday.com review** + monday vs Asana/ClickUp (monday pays); **hive review**; Office Timeline / Getscreen / WebCatalog for long-tail; ClickUp only if you accept **~$25 CPA**.

**Do not plan on:** `best project management software` (G2/Capterra/Asana), `notion review` (affiliate **closed** to new), Jira/Linear/MS Project.

**Pays today:** monday, Hive, Office Timeline, Foxit, Getscreen.me, WebCatalog. Motion **PENDING**.

---

### HR

**Pages in hand:** how to choose / what is, Best (Difficult 31). Thin guide set (28).

**Chase:** how to choose HR software; **breezy hr**, **connecteam**, **jibble**, **trainual**; scheduling long-tails if 7shifts/Homebase programmes appear.

**Do not plan on:** `best HR software`, Workday, ADP, Greenhouse, BambooHR (partner-only).

---

### Ecommerce

**Pages in hand:** how to choose / what is, Best (Difficult 31). Factory packs **weakest CQ (81)**.

**Chase:** how to choose ecommerce software (platform vs POD vs apps — split intent); **printful / printify** after apply; **webflow** after apply; Spocket/AliDrop only for dropshipping queries.

**Do not plan on:** `best ecommerce platform`, `shopify vs woocommerce` until Shopify programme + distinctive research. Open-source (Medusa/Saleor) will not pay.

**Pays today:** Spocket, AliDrop only. **Apply:** Shopify (up to $150 CPA), Webflow, Printful 10% × 12 mo, Printify 5% × 12 mo.

---

### AI

**Pages in hand:** how to choose / what is, Best (Difficult 31). **0 programmes**, 6 stored URLs.

**Chase:** **quillbot**, **elevenlabs**, **gamma**, **mindstudio**, **adcreative.ai**, **wegic** (wire first). `n8n vs zapier` if a Zapier programme exists.

**Do not plan on:** `best AI software`, `chatgpt vs claude`, Copilot, Midjourney, Gemini (no affiliate + impossible SERPs).

---

### IT & development

**Pages in hand:** how to choose / what is (query is too broad), Best (Difficult 31), **1,176 pairs** (largest mesh). **0 programmes**, 3 stored URLs.

**Chase (split the hub):** web hosting/control panels (**plesk**, Kinsta/Cloudways/SiteGround after apply); web data (**bright data**, ThorData, ScraperAPI); not “IT software.”

**Do not plan on:** `best observability software`, Datadog/GitHub/ServiceNow/Jira SM (partner-only + vendor SERPs).

---

## How much traffic could you expect?

**Not measured.** GSC **NOT CONNECTED**. No keyword-volume store. Do not treat ranges as Ahrefs or a ranking probability.

**Method:** GOOD / analogue Tier A–B queries only; wide US demand bands; typical CTR by rank band (page 2 ≈ 0.5–2%; 6–10 ≈ 2–7%; 3–5 ≈ 8–15%); traffic potential > exact-match volume. Affiliate clicks ≈ sessions on **monetized** URLs × 8–20% CTA click-through.

### Demand bands (US / month, not a vendor export)

| Query class | Examples | Band used |
| --- | --- | --- |
| Informational pillar | what is crm / how to choose PM / email | 300–8,000 |
| Product how-to | pipedrive setup, monday implementation | 100–2,000 |
| Mid-tier review | pipedrive, getresponse, hive, lusha | 200–5,000 |
| Head review | hubspot, shopify, chatgpt, datadog | 2,000–80,000 (do **not** assume capture) |
| Money comparison | hubspot vs pipedrive, shopify vs woo | 200–8,000 |
| Long-tail comparison | attio vs pipedrive, 7shifts vs deputy | 10–200 |
| Best-of head | best {crm\|pm\|email\|ai} software | 800–50,000 (not in the plan) |
| Tools | crm finder, TCO | 50–1,200 |

### Organic sessions

| Horizon | What “good” looks like | Organic visits / month |
| --- | --- | ---: |
| **Now → 6 months** | Indexed; long-tails page 2–3 | **400–2,000** |
| **~12 months, CRM-first** | Distinctive Pipedrive + CRM choose/what-is | **2,000–8,000** |
| **~12 months, CRM + one wedge** | Same + email **or** PM choose + 1 paying product cluster | **2,500–11,000** |
| **~18–24 months** | 3–4 categories with choose pillar + paying cluster + a few money pairs | **12,000–40,000** site-wide |
| **Not in the plan** | #1–3 for any `best {X} software` | Could add thousands per URL; **requires authority this model does not grant** |

**Do not multiply CRM by 11.** Ten Best pages scored Difficult. Ecommerce/AI/IT factory + affiliate gaps mean those categories add **slowly**.

#### Illustrative 18–24 month split (if the playbook is actually executed)

| Source | Share of the 12k–40k band |
| --- | --- |
| CRM (choose, Pipedrive, money pairs, tools, niche industry) | ~40–55% |
| Email + project management | ~15–25% |
| Sales intelligence + marketing (in-programme names) | ~10–15% |
| HR + CS + BC (wired Fastmail/Tidio/Breezy etc.) | ~5–10% |
| Ecommerce + AI + IT (after Shopify/Webflow/hosting applies) | ~5–15% |

### Affiliate clicks (commissioned)

Paying keyword set **today:** Pipedrive, Close, monday, GetResponse, Kit, Lusha, Amplemarket, Closely, Hive, Keap/Capsule/folk/Salesflare, LearnWorlds/Kartra/Leadpages/SocialBee/Brand24, Breezy/Connecteam/Jibble/Trainual, Spocket/AliDrop, plus any **wired** partner-link products (Fastmail, Reply, Tidio, QuillBot, …).

| Horizon | Affiliate clicks / month | Note |
| --- | --- | --- |
| 6 months | **30–200** | Informational visits dominate |
| 12 months | **150–800** | Pipedrive + monday/GetResponse starting |
| 18–24 months | **500–3,000** | Same clusters + applied HubSpot/Shopify/ActiveCampaign/Apollo/Freshworks **if approved** |

A click is not revenue. Do not invent EPC.

### Why 5,741 URLs ≠ 5,741 visits

- 83% of **scored** queries are Difficult.  
- Most of 672 GOOD comparisons are low-demand CRM pairs. Traffic lives in **~40–120 queries site-wide**, not the mesh.  
- Non-CRM choose pages can join that set only after they are as distinctive as CRM’s how-to-choose (CQ 93), not factory-complete.  
- Page-2 CTR is small. New domains live there first.

---

## Will it compete?

**On-site (all categories):** Finders, requirements, scorecards, TCO — strongest in **CRM**. Other categories have Best + choose + reviews + mesh, but fewer interactive tools. That is still a better user product than a 40-tool G2 listicle **if** the copy is distinctive.

**Off-site incumbents (typical page-1, not a live crawl):**

| Category | Who occupies the SERP |
| --- | --- |
| CRM | G2, PCMag, Forbes, HubSpot, Zapier, TechRadar |
| Email | Klaviyo, Mailchimp, ActiveCampaign, G2, Brevo |
| PM | G2, Capterra, Asana, ClickUp, Notion, monday |
| Ecommerce | Shopify, Woo, G2, BigCommerce, Webflow |
| AI | OpenAI, Anthropic, G2, Zapier, Forbes “best AI” |
| IT | Datadog, GitHub, Atlassian, G2, vendor docs |
| SI | ZoomInfo, Apollo, G2, LinkedIn |
| HR | G2, Capterra, BambooHR, Gusto, Workday |
| CS | Zendesk, G2, Intercom, Freshdesk |
| BC | Slack, Zoom, Microsoft, G2 |
| Marketing | HubSpot, G2, Hootsuite, Sprout |

**Positioning that can win in every vertical:** job-first choose pages + interactive tools + honest mid-tier reviews — not 3,462 schema-valid pairs and not marketplace review volume.

---

## Will it get affiliate traffic?

Plumbing is fine (validate **PASS**, 0 missing destinations, every software page has a CTA). **Coverage is not.**

| Metric | Count |
| --- | ---: |
| Published software | 279 |
| Active programmes | 28 (10%) |
| Pending | 1 (Motion) |
| Without programme | 250 |
| Affiliate CTA | 54 |
| Official CTA only | 225 |

**Where a click can pay today (live programme):**

| Cluster | Products |
| --- | --- |
| CRM | Pipedrive, Close, Salesflare, folk, Keap, Capsule |
| SI | Lusha, Amplemarket, Closely |
| Email | GetResponse, Kit |
| Marketing | LearnWorlds, Brand24, Kartra, SocialBee, Leadpages |
| PM | monday, Hive, Office Timeline, Foxit, Getscreen.me, WebCatalog |
| HR | Breezy HR, Connecteam, Jibble, Trainual |
| Ecommerce | Spocket, AliDrop |
| Stored URL, programme not activated | Fastmail, Aircall, Tidio, QuillBot, ElevenLabs, Gamma, Reply.io, Plesk, Bright Data, … (26) |

**Heads that rank in SERPs with no programme:** HubSpot, Salesforce, Zoho, Shopify, Klaviyo, Slack, ChatGPT, Datadog, Workday, Zendesk (until applied).

Guides that rank first **only pay** if they next-step into a monetized review. Do **not** rank Finder/Best/comparisons by who pays.

---

## Recommended improvements

Prioritized for **ranking + affiliate yield** across the whole site. Do not auto-execute. Do not invent verdicts, PartnerStack URLs, or GSC numbers.

### P0

1. **Connect Search Console.** Flying blind in every category.  
2. **Pipedrive (+ Close) cluster** — only scored GOOD + live CTA at scale.  
3. **Wire the 26 `partner-links.ts` URLs** into active programmes (Fastmail, Reply, Tidio, QuillBot, ElevenLabs, Plesk, …). Application is already done.  
4. **High-intent comparisons only** — HubSpot vs Pipedrive, Close vs Pipedrive, monday vs Asana/ClickUp, GetResponse vs Mailchimp. Keep 578 noindex. Do not invent `confidence: high`.

### P1

5. **Second wedge: email marketing or project management** (not both at once). Same playbook as CRM: distinctive choose/what-is + in-programme review + 3 money pairs. PM already has monday/Hive; email has GetResponse/Kit.  
6. **Apply real programmes** (see `docs/reports/affiliate-program-gap-research-2026-08-19.md`): HubSpot, Zoho, Freshworks (7 SKUs), Apollo, ActiveCampaign, Shopify, Zendesk.  
7. **Best pages stay research projects**, not traffic forecasts. CRM first (media + unique rationales), then email/PM. The other nine stay Difficult until authority exists.  
8. **Next-step wiring:** every how-to-choose should point at Finder **and** 2–3 **in-programme** reviews in that category.

### P2

9. **CRM tools still missing on the map** (ROI, RFP, Plan Selector) — only CRM has this advantage; protect it.  
10. **Factory pack rewrites** on paying clusters: Pipedrive, monday, GetResponse, Hive, Lusha — not all 1,175 packs. Ecommerce worth-it/plans (CQ 81) if Shopify/Webflow will pay.  
11. **Split IT and AI hubs** in internal links (hosting vs observability; writing/voice AI vs ChatGPT) so “how to choose IT software” is not the money query.  
12. **Alternatives:** 277 scored Difficult. Do not invent lists. Fastmail/SaneBox TIER_3.

### P3

13. Production JS budget + CrUX.  
14. `catalogue:coverage` enum mismatch.  
15. Teaching-visual leftovers.  
16. Off-site authority when measurable. Outreach on distinctive pages (choose + paying reviews), not the mesh.

---

## What not to do

- Do not index the 578 thin comparisons.  
- Do not invent comparison winners or `confidence: high`.  
- Do not rank Finder / Best / comparisons by affiliate availability.  
- Do not treat 5,741 URLs, 4,896 seeds, or 11 Best pages as ×11 CRM traffic.  
- Do not claim live GSC. Replace ranges when connected.  
- Do not apply to Salesforce/Microsoft/Oracle/Workday/ServiceNow expecting a review-site `/go/` link.  
- Do not plan revenue on #1 for any `best {X} software`.

---

## 90-day focus

1. GSC on.  
2. **CRM Tier A:** Pipedrive (+ Close) + choose/what-is + 3–5 money comparisons.  
3. **Wire 26 existing partner URLs.**  
4. **One other category:** monday/Hive (PM) **or** GetResponse/Kit (email) — distinctive choose + one review + two pairs.  
5. Apply HubSpot + Shopify or ActiveCampaign (whichever matches the wedge).  
6. Best CRM media — do not count it in the 12-month traffic base.

That is how you move toward **~2.5k–11k organic / 150–800 affiliate clicks a month at ~12 months**. Filling the 3,462-pair mesh cannot.

---

## Appendix — artifacts

| Artifact | Path |
| --- | --- |
| This report | `docs/reports/ranking-affiliate-competitiveness-2026-08-19.md` |
| Affiliate programme gap (250 products) | `docs/reports/affiliate-program-gap-research-2026-08-19.md` |
| Editorial audit | `docs/reports/site-wide-editorial-audit-2026-08-19.md` |
| Website intelligence | `docs/site-intelligence/WEBSITE-INTELLIGENCE-LATEST.md` |
| Ranking opportunities | `docs/site-intelligence/RANKING-OPPORTUNITIES-LATEST.md` |
| CRM keyword inventory | `docs/site-intelligence/CRM-KEYWORD-TARGETS.md` |
| Competitive gaps (CRM SERP) | `docs/site-intelligence/competitors/COMPETITIVE-GAPS-LATEST.md` |
| SEO health | `docs/seo/reports/SEO-HEALTH-LATEST.md` |
