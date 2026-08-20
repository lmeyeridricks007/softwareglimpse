# Customer Service — Product Coverage Map

**Date:** 2026-08-18  
**Purpose:** Local planning doc — which customer-service products industry buyers expect, vs what SoftwareGlimpse covers (Next.js catalogue), with Wave-1 onboarding status.  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

Related:

- [`cs-wave1-onboarding-2026-08-18.md`](./cs-wave1-onboarding-2026-08-18.md) — Freshdesk, Zendesk Suite, Help Scout, Gorgias, Tidio (re-homed), Freshchat, LiveChat, Zoho Desk, Freshservice

**Onboarding bias:** credibility first — onboard industry shortlist names even without affiliate deals. Rank **within** job clusters — never force Zendesk Suite vs Tidio vs Freshservice into one undifferentiated best list.

---

## Category scope

Primary jobs buyers mean when they search “customer service software” / “helpdesk” / “live chat”:

| Job cluster | Buyer intent | Wave-1 examples |
| --- | --- | --- |
| **helpdesk-ticketing** | Email-to-ticket queues, SLAs, macros | Zendesk Suite, Freshdesk, Help Scout, Zoho Desk |
| **live-chat-support** | Website/in-app messengers | Freshchat, LiveChat, Tidio |
| **ecommerce-helpdesk** | Order/refund context in the inbox | Gorgias |
| **itsm-service-desk** | Incidents, problems, changes, assets | Freshservice |
| **knowledge-base-self-service** | Help center / Docs deflection | Help Scout Docs, Zoho / Zendesk KB |
| **omnichannel-support** | Email + chat + social in one workspace | Zendesk Suite, Freshdesk |
| **ai-customer-service** | Bots / copilots as assistance | Tidio Lyro; Zendesk Suite AI; Intercom Fin (BC-primary) |

Source of truth: `src/data/category-onboarding/seed/customer-service.ts` (activated; methodology `customer-service-editorial` v1.0.0).

Keep ranking **within** clusters — never force a helpdesk, a live-chat widget, an ecommerce inbox, and an ITSM desk into one undifferentiated list.

---

## What’s on SoftwareGlimpse today

### A) Live site — WordPress

Not auto-published. Wave-1 CS reviews, best page, and guides live in the Next.js catalogue / editorial seed only until a human publish pass.

### B) Next.js catalogue — CS primary (Wave-1)

**Nine** products with `primaryCategorySlug: "customer-service"`, plus **Intercom** (`primaryCategorySlug: "business-communications"`, `secondaryCategorySlugs: ["customer-service"]`) as a borderline AI-inbox note only.

#### Editor’s picks by job (no cross-cluster ranking)

| Job cluster | Product | Slug | Overall | Role |
| --- | --- | ---: | --- | --- |
| helpdesk-ticketing | Zendesk Suite | `zendesk-suite` | **8.2** | Cluster award |
| helpdesk-ticketing | Freshdesk | `freshdesk` | **7.9** | Freshworks mid-market peer award |
| ecommerce-helpdesk | Gorgias | `gorgias` | **7.7** | Cluster award |
| live-chat-support | Freshchat | `freshchat` | **7.6** | Cluster award |
| helpdesk-ticketing (SMB inbox) | Help Scout | `help-scout` | **7.5** | Shared-inbox / Docs landscape |
| live-chat-support | LiveChat | `livechat` | **7.4** | Live-chat peer |
| live-chat-support | Tidio | `tidio` | **7.3** | Conversation-cap + Lyro peer (re-homed from CRM) |
| helpdesk-ticketing (value) | Zoho Desk | `zoho-desk` | **7.8** | Value / Zoho-suite landscape |
| itsm-service-desk | Freshservice | `freshservice` | **8.0** | ITSM landscape — not a helpdesk peer |

Methodology: `customer-service-editorial` v1.0.0 · `handsOnTesting=false` · affiliate economics excluded.

#### Secondary / borderline

| Product | Primary category | Notes |
| --- | --- | --- |
| Intercom | business-communications | Fin AI + messenger. Shown on Best CS as secondary/borderline only — **not** scored as a CS methodology peer. |

### C) Affiliate inventory — CS-hinted

| Inventory | Catalogue | Destination URL | Notes |
| --- | --- | --- | --- |
| **Tidio** (`aff-tidio`) | Mapped | Yes (`affiliate.tidio.com/…`) | Live-chat primary after CRM re-home |
| **Freshdesk** (`aff-freshdesk`) | Mapped (Impact) | **No URL in inventory** | Destination pending `affiliate:set` |
| **Freshchat** (`aff-freshchat`) | Mapped (Impact) | **No URL in inventory** | Destination pending |
| **Freshservice** (`aff-freshservice`) | Mapped (Impact) | **No URL in inventory** | ITSM; also noted under it-development |
| Zendesk Suite / Help Scout / Gorgias / LiveChat / Zoho Desk | Software pages | No CS affiliate rows | Credibility onboarding |

Commercial metrics stay planning-only. They never entered criterion scores or best-page order.

---

## Industry products that matter (planning)

### Priority 1 — Wave-1 (done)

Helpdesk: Zendesk Suite, Freshdesk, Help Scout, Zoho Desk. Live chat: Freshchat, LiveChat, Tidio. Ecommerce: Gorgias. ITSM: Freshservice.

### Priority 2 — optional later (not this wave)

Intercom as CS-primary (currently BC). Re:amaze / Gorgias peers. ServiceNow as ITSM peer (IT-development overlap). Front, Dixa, Gladly. Do **not** invent comparisons until researched.

---

## Supporting content (wired 2026-08-18)

| Surface | Status |
| --- | --- |
| Best page `/best/customer-service-software/` | Seeded — cluster awards only; `seo.indexable=true` |
| Comparisons | 9 same-cluster pairs via `approvedCsPair()` |
| Category guides | 5 indexable (`softwareglimpse-guide-template-v1`) |
| Product shorts | what-is + is-worth-it for Freshdesk, Zendesk Suite, Help Scout, Gorgias, Tidio |
| Use-case hubs | 7 CS use cases in `customer-service-deep.ts` |
| Teaching visuals | **Pending** — placeholder `heroVisual` paths wired; GenerateImage not run this pass |
| WordPress publish | **Not done** (approval gate) |

Tidio was removed from Best CRM `eligibleProductSlugs` (already absent in current seed).
