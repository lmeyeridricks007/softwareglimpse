# Sales Intelligence — Product Coverage Map

**Date:** 2026-08-17  
**Purpose:** Local planning doc — which SI products industry buyers expect, vs what SoftwareGlimpse already covers (live site + Next.js catalogue).  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

---

## Category scope (SoftwareGlimpse)

Primary job: **discover contacts/companies, enrich records, enable outbound prospecting** — not replace a CRM.

| In scope | Out of scope / adjacent |
| --- | --- |
| Contact & company databases | Core CRM without a data/prospecting core |
| Enrichment & buying signals / intent | Conversation intelligence (Gong, Chorus) as primary job |
| Sales engagement / sequencing **with a data core** | Pure marketing automation / ABM ad platforms without SI data job |
| Dialers when used as outbound execution on prospect data | LinkedIn itself as a social network (Sales Navigator is in-scope as a SI-adjacent product) |

Source: `src/data/category-onboarding/seed/sales-intelligence.ts`.

---

## What’s on SoftwareGlimpse today

### A) Live site — [softwareglimpse.com](https://www.softwareglimpse.com) (WordPress)

| Product | Live URL | Status |
| --- | --- | --- |
| **Lusha** | [/lusha-review/](https://www.softwareglimpse.com/lusha-review/) | Live review |
| **Closely** | [/closely-review/](https://www.softwareglimpse.com/closely-review/) | Live review |

**Not live on WordPress today:** category hub `/categories/sales-intelligence/`, best page `/best/sales-intelligence-software/`, and `/software/{slug}/` SI hubs (404 as of 2026-08-17). Those paths exist in the Next.js migration inventory but are not published on the current WP site.

### B) Next.js catalogue (repo — migration / not yet the public WP surface)

Eight products with `primaryCategorySlug: "sales-intelligence"` in `src/data/seed/software.ts`, all marked `published` in seed metadata:

| # | Product | Slug | Role in SI landscape | Affiliate inventory |
| ---: | --- | --- | --- | --- |
| 1 | Apollo.io | `apollo` | Data + engagement (best overall) | Yes (`aff-apollo-io`) |
| 2 | Lusha | `lusha` | Enrichment-first data | Yes (`aff-lusha`) |
| 3 | Reply.io | `reply` | Multichannel engagement + data | Yes (`aff-reply-io`) |
| 4 | BookYourData | `bookyourdata` | Pay-as-you-go contact lists | Yes (`aff-bookyourdata`) |
| 5 | Amplemarket | `amplemarket` | AI-assisted outbound | Yes (`aff-amplemarket`) |
| 6 | RocketReach | `rocketreach` | Contact lookup database | Yes (`aff-rocketreach`) |
| 7 | Kixie | `kixie` | Sales dialer / phone outbound | Yes (`aff-kixie`) — inventory hint is communications |
| 8 | Closely | `closely` | LinkedIn + email outbound | Yes (`aff-closely`) |

**Best-page ranked set (editorial):** Apollo, Lusha, Reply, BookYourData, Amplemarket, RocketReach, Kixie.  
**In catalogue but not in ranked top picks:** Closely (still in landscape / engagement bucket).

### C) Next.js catalogue after Priority-1 (2026-08-17)

Added non-affiliate credibility products (see [`si-priority1-onboarding-2026-08-17.md`](./si-priority1-onboarding-2026-08-17.md)):

| Product | Slug | Best rank | CQ review |
| --- | --- | ---: | ---: |
| ZoomInfo | `zoominfo` | 2 | 93 |
| Cognism | `cognism` | 3 | 93 |
| LinkedIn Sales Navigator | `linkedin-sales-navigator` | 4 | 93 |

Best-page order after Priority-1: Apollo → ZoomInfo → Cognism → LinkedIn Sales Navigator → Lusha → Reply → BookYourData → Amplemarket → RocketReach → Kixie.

### D) Next.js catalogue after Priority-2 (2026-08-17)

Added non-affiliate white-space products (see [`si-priority2-onboarding-2026-08-17.md`](./si-priority2-onboarding-2026-08-17.md)):

| Product | Slug | Best rank | CQ review |
| --- | --- | ---: | ---: |
| Seamless.AI | `seamless-ai` | 3 | 93 |
| Clay | `clay` | 4 | 93 |
| 6sense | `sixsense` | 6 | 93 |
| Demandbase | `demandbase` | 7 | 93 |
| Clearbit | `clearbit` | 9 | 93 |
| Bombora | `bombora` | landscape / decision path | 93 |

Best-page order after Priority-2: Apollo → ZoomInfo → Seamless.AI → Clay → Cognism → 6sense → Demandbase → LinkedIn Sales Navigator → Clearbit → Lusha → Reply → BookYourData → Amplemarket → RocketReach → Kixie.

### E) Next.js catalogue after Priority-3 (2026-08-17)

Added mid-tier comparables (see [`si-priority3-onboarding-2026-08-17.md`](./si-priority3-onboarding-2026-08-17.md)):

| Product | Slug | Best rank | CQ review |
| --- | --- | ---: | ---: |
| Hunter | `hunter` | 11 | 93 |
| Snov.io | `snov` | 12 | 93 |
| LeadIQ | `leadiq` | 13 | 93 |
| UpLead | `uplead` | 14 | 93 |
| Kaspr | `kaspr` | landscape / decision path | 93 |
| Ocean.io | `ocean` | landscape / decision path | 93 |

Best-page order after Priority-3: Apollo → ZoomInfo → Seamless.AI → Clay → Cognism → 6sense → Demandbase → LinkedIn Sales Navigator → Clearbit → Lusha → Hunter → Snov.io → LeadIQ → UpLead → Reply → BookYourData → Amplemarket → RocketReach → Kixie.

### F) Next.js catalogue after Priority-4 (2026-08-17)

Added optional / adjacent products (see [`si-priority4-onboarding-2026-08-17.md`](./si-priority4-onboarding-2026-08-17.md)) — **all landscape** (none inserted into ranked recommendations):

| Product | Slug | Role | SI overall | CQ review |
| --- | --- | --- | ---: | ---: |
| Adapt.io | `adapt-io` | Regional contact DB peer (landscape) | 6.3 | 91 |
| Outreach | `outreach` | SEP / sales engagement | 6.3 | 91 |
| Salesloft | `salesloft` | SEP peer | 6.3 | 91 |
| Instantly | `instantly` | Cold-email infra | 6.6 | 91 |
| Lemlist | `lemlist` | Cold-email / multichannel | 6.6 | 91 |
| Smartlead | `smartlead` | Cold-email infra | 6.3 | 91 |
| Gong | `gong` | Conversation intelligence (adjacent) | 4.9 | 91 |

Ranked Best order unchanged from Priority-3.

---

## Industry products that matter (by buyer job)

Industry “best of” lists (G2-style / 2026 comparison writeups) repeatedly surface these **segment leaders**. Priority = how often buyers expect them when evaluating SI, and how large the coverage gap is for SoftwareGlimpse.

### Priority 1 — Must consider for a credible SI category

| Product | Why industry cares | On SG live? | In Next.js SI catalogue? | Suggested action |
| --- | --- | --- | --- | --- |
| **ZoomInfo** | Enterprise NA gold standard: deep company/contact data, org charts, technographics, intent add-ons | No (WP) | **Yes** (2026-08-17) | Onboarded — see `si-priority1-onboarding-2026-08-17.md` |
| **Cognism** | EMEA / GDPR-first; phone-verified mobiles; compliance-led buying | No (WP) | **Yes** (2026-08-17) | Onboarded — see `si-priority1-onboarding-2026-08-17.md` |
| **LinkedIn Sales Navigator** | Default relationship / job-change / social graph layer; already compared in guides | No product page (WP) | **Yes** (2026-08-17) | Onboarded — see `si-priority1-onboarding-2026-08-17.md` |
| **Apollo.io** | SMB/mid-market bundled data + sequencing default | No (WP) | **Yes** | Keep; publish hub when SI cluster ships |
| **Lusha** | Accessible enrichment + contact data; strong SMB presence | **Yes** (review) | **Yes** | Keep |

### Priority 2 — Strongly recommended (fills white space)

| Product | Why industry cares | On SG? | Suggested action |
| --- | --- | --- | --- |
| **6sense** | Predictive intent / ABM account prioritization at enterprise scale | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority2-onboarding-2026-08-17.md` |
| **Demandbase** | Enterprise ABM + intent orchestration | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority2-onboarding-2026-08-17.md` |
| **Seamless.AI** | High-volume contact/phone prospecting; common SMB shortlist name | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority2-onboarding-2026-08-17.md` |
| **Clay** | Multi-provider enrichment / waterfall workflows; rising fast with GTM engineers | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority2-onboarding-2026-08-17.md` |
| **Clearbit** (HubSpot Breeze Intelligence) | Enrichment standard for inbound + CRM fill | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority2-onboarding-2026-08-17.md` |
| **Bombora** | Specialist third-party intent often layered on ZoomInfo/ABM stacks | No (WP) / **Yes** (Next.js) | Onboarded as intent specialist — landscape + decision path |

### Priority 3 — Useful coverage / mid-tier comparables

| Product | Role | On SG? | Suggested action |
| --- | --- | --- | --- |
| **UpLead** | Verified B2B lists; SMB data alternative | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority3-onboarding-2026-08-17.md` |
| **LeadIQ** | Chrome / LinkedIn-adjacent capture + CRM sync | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority3-onboarding-2026-08-17.md` |
| **Hunter.io** | Domain email finder; light prospecting | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority3-onboarding-2026-08-17.md` |
| **Snov.io** | Finder + sequencer; budget SMB | No (WP) / **Yes** (Next.js) | Onboarded — see `si-priority3-onboarding-2026-08-17.md` |
| **Kaspr** | LinkedIn-centric EU contact data | No (WP) / **Yes** (Next.js) | Onboarded as LinkedIn-centric mid-tier — landscape + decision path |
| **Ocean.io** | Lookalike / similar-company prospecting | No (WP) / **Yes** (Next.js) | Onboarded as lookalike specialist — landscape + decision path |
| **Adapt.io** / **Cognism peers** | Regional contact DB alternatives | No (WP) / **Yes** (Next.js landscape) | Onboarded as landscape mid-tier — see `si-priority4-onboarding-2026-08-17.md` |

### Already covered well (don’t treat as gaps)

Apollo, Lusha, RocketReach, BookYourData, Amplemarket, Reply, Closely, Kixie — solid **affiliate-friendly SMB / mid-market** SI + engagement coverage. Weakness is **enterprise / EMEA / intent / Sales Navigator**, not “more Apollo alternatives.”

### Usually adjacent (mention in guides; product page only if scope expands)

| Product | Primary job | Note |
| --- | --- | --- |
| Salesloft / Outreach | Sales engagement platform (SEP) | **Onboarded P4 as SI landscape** (not ranked contact-DB peers) |
| Instantly / Lemlist / Smartlead | Cold email infrastructure | **Onboarded P4 as SI landscape** |
| Gong / Chorus / Fireflies | Conversation intelligence | **Gong onboarded P4 as SI landscape adjacent**; Chorus/Fireflies still optional |
| HubSpot / Salesforce as CRM | System of record | Already CRM category |

---

## Gap summary

```text
Industry expectation          SoftwareGlimpse today
─────────────────────────     ────────────────────────────
Enterprise data (ZoomInfo)    ✅ Next.js catalogue (CQ 93)
EMEA / compliance (Cognism)   ✅ Next.js catalogue (CQ 93)
Social graph (Sales Nav)      ✅ Next.js catalogue (CQ 93)
Intent / ABM (6sense, …)      ✅ Next.js catalogue (CQ 93; Bombora landscape)
Modern enrichment (Clay, …)   ✅ Next.js catalogue (CQ 93)
Mid-tier comparables (P3)     ✅ Next.js catalogue (CQ 93; Kaspr/Ocean landscape)
Optional/adjacent (P4)        ✅ Next.js landscape (Adapt.io, SEP, cold-email, Gong)
SMB data+engage (Apollo…)     ✅ strong in Next.js catalogue
Live WP public SI surface     ⚠️ only Lusha + Closely reviews
```

**Priority 1–4 onboarded 2026-08-17.** Remaining planning gap is WP publish of SI hubs (and optional Chorus/Fireflies if conversation-intel expands).

---

## Recommended inclusion batches (planning only)

### Batch A — Credibility (non-affiliate OK)

1. ZoomInfo  
2. Cognism  
3. LinkedIn Sales Navigator  

### Batch B — Intent & enrichment depth

4. 6sense  
5. Demandbase *(or pick one ABM leader first)*  
6. Clay  
7. Clearbit / Breeze Intelligence  
8. Bombora  
9. Seamless.AI  

### Batch C — Mid-tier comparables (optional)

10. UpLead, LeadIQ, Hunter, Kaspr, Ocean.io  

### Already in catalogue — publish / migrate when SI cluster goes live

Apollo, Lusha, RocketReach, Amplemarket, Closely, BookYourData, Reply, Kixie.

---

## Sources used for “industry good”

- Cross-check of 2026 SI comparison writeups (ZoomInfo / Apollo / Cognism / 6sense as segment leaders; Clay, Bombora, Sales Navigator as common stack layers).  
- SoftwareGlimpse category definition + `software.ts` SI seeds + affiliate inventory `categoryHint: "sales-intelligence"`.  
- Live WP check: Lusha + Closely reviews only; SI category/best hubs 404 on www.

---

## Notes

- Catalogue onboarding CLI is **existing-affiliate-only**; ZoomInfo/Cognism/Sales Nav/etc. need **manual / migration-style** product onboarding (same pattern as enterprise CRM gap batch).  
- Do not let affiliate presence alone decide Best-page rank.  
- Kixie is SI-primary in seed but affiliate-hinted as communications — keep classification consistent when expanding.  
- Update this file when Batch A–C products are onboarded or when SI hubs go live on production.  
- Priority 1–4 batches completed 2026-08-17 (see `si-priority{1,2,3,4}-onboarding-2026-08-17.md`).
