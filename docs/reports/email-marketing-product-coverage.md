# Email Marketing & Marketing — Product Coverage Map

**Date:** 2026-08-17  
**Purpose:** Local planning doc — which Email Marketing + Marketing & Growth products industry buyers expect, vs what SoftwareGlimpse already covers (live site + Next.js catalogue).  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

Related onboarding logs:

- [`email-marketing-onboarding-2026-08-17.md`](./email-marketing-onboarding-2026-08-17.md) — affiliate wave
- [`em-priority1-onboarding-2026-08-17.md`](./em-priority1-onboarding-2026-08-17.md) — Klaviyo / Brevo / MailerLite
- [`em-priority2-onboarding-2026-08-17.md`](./em-priority2-onboarding-2026-08-17.md) — Omnisend / Kit / Constant Contact / Flodesk / Moosend / Beehiiv
- [`em-priority3-onboarding-2026-08-17.md`](./em-priority3-onboarding-2026-08-17.md) — Drip / Mailjet / Customer.io
- [`marketing-priority1-onboarding-2026-08-17.md`](./marketing-priority1-onboarding-2026-08-17.md) — Buffer / ClickFunnels / Marketo / Braze (+ Pardot landscape)
- [`marketing-priority2-onboarding-2026-08-17.md`](./marketing-priority2-onboarding-2026-08-17.md) — Later / Agorapulse / Hootsuite / Sprout / Meltwater / Brandwatch / Iterable + WhatConverts / Uniqode / Switcher Studio
- [`em-activecampaign-rescore-2026-08-17.md`](./em-activecampaign-rescore-2026-08-17.md) — ActiveCampaign EM re-score 7.7 + email-marketing primary

---

## Category scope (SoftwareGlimpse)

### Email Marketing (`email-marketing`) — READY / activated

Primary job: **create, send, and measure marketing email** to subscriber lists (newsletters + email-centered automation).

| In scope | Out of scope / adjacent |
| --- | --- |
| Email campaign / newsletter ESPs | Personal email clients (Gmail, Outlook, Fastmail) |
| Marketing email automation | Cold-email sales sequencers (prefer Sales Intelligence) |
| List hygiene & deliverability tooling (adjacent) | Inbox productivity (SaneBox → business-communications) |
| Ecommerce lifecycle email when email is the primary job | Pure transactional email APIs (SendGrid/SES as primary) |

Source: `src/data/category-onboarding/seed/email-marketing.ts`.

### Marketing & Growth (`marketing`) — READY / activated

Primary job: **broader marketing stack** — social scheduling, listening, all-in-one funnels, marketing automation (non-ESP-primary).

| In scope | Out of scope |
| --- | --- |
| Social media management / listening | Core ESP (prefer email-marketing) |
| All-in-one marketing / funnel platforms | CRM systems without a marketing core |
| Marketing automation (non-email-primary) | SI databases / prospecting tools |

Source: `src/data/category-onboarding/seed/marketing.ts`.

---

## What’s on SoftwareGlimpse today

### A) Live site — [softwareglimpse.com](https://www.softwareglimpse.com) (WordPress)

Checked 2026-08-17 (HTTP status on www).

| Product | Live URL | Status |
| --- | --- | --- |
| **GetResponse** | [/getresponse-review/](https://www.softwareglimpse.com/getresponse-review/) | Live review |
| **Mailchimp** | [/mailchimp-crm-review/](https://www.softwareglimpse.com/mailchimp-crm-review/) (+ `/mailchimp-crm-review-2/`) | Live — framed as CRM, not EM hub |
| **ActiveCampaign** | [/activecampaign-crm-review/](https://www.softwareglimpse.com/activecampaign-crm-review/) | Live — framed as CRM |
| **HubSpot** | [/hubspot-crm-review/](https://www.softwareglimpse.com/hubspot-crm-review/) | Live — CRM primary (Marketing Hub is adjacent) |
| HubSpot vs Mailchimp | [/hubspot-vs-mailchimp/](https://www.softwareglimpse.com/hubspot-vs-mailchimp/) | Live comparison |
| HubSpot vs ActiveCampaign | [/hubspot-vs-activecampaign/](https://www.softwareglimpse.com/hubspot-vs-activecampaign/) | Live comparison |

**Not live on WordPress today:**

- Category hubs `/categories/email-marketing/`, `/categories/marketing/`
- Best pages `/best/email-marketing-software/`, `/best/marketing-software/`
- Most Next.js-onboarded EM/Marketing products (Klaviyo, Omnisend, Kit, Buffer, Marketo, Braze, etc.)

Those paths exist (or are planned) in the Next.js migration inventory but are not the public WP surface yet.

### B) Next.js catalogue — Email Marketing

Products with `primaryCategorySlug: "email-marketing"` (core + adjacent):

| # | Product | Slug | Role / best-page | Overall |
| ---: | --- | --- | --- | ---: |
| 1 | Klaviyo | `klaviyo` | Rank #1 — ecommerce email + SMS | 7.9 |
| 2 | ActiveCampaign | `activecampaign` | Rank #2 — automation depth | 7.7* |
| 3 | Omnisend | `omnisend` | Rank #3 — ecommerce multichannel alt | 7.7 |
| 4 | Brevo | `brevo` | Rank #4 — send-based value | 7.5 |
| 5 | GetResponse | `getresponse` | Rank #5 — all-in-one free-tier | 7.5 |
| 6 | Kit | `kit` | Rank #6 — creator / newsletter | 7.1 |
| 7 | MailerLite | `mailerlite` | Rank #7 — simple free-tier / SMB | 7.2 |
| 8 | Moosend | `moosend` | Rank #8 — budget automation | 6.9 |
| 9 | Mailjet | `mailjet` | Rank #9 — EU marketing + transactional | 6.9 |
| 10 | Drip | `drip` | Rank #10 — ecommerce CRM/email | 6.8 |
| 11 | Mailchimp | `mailchimp` | Rank #11 — beginners / brand | 6.8 |
| 12 | Flodesk | `flodesk` | Rank #12 — design-led creator | 6.6 |
| 13 | Campaign Monitor | `campaign-monitor` | Rank #13 — design-led campaigns | 7.0 |
| 14 | Constant Contact | `constant-contact` | Rank #14 — SMB / local brand | 6.5 |
| 15 | AWeber | `aweber` | Rank #15 — simple creator / SMB | 6.5 |
| — | Beehiiv | `beehiiv` | Landscape — newsletter growth | 6.2 |
| — | Customer.io | `customer-io` | Landscape — product-led messaging | 7.1 |
| — | Bouncer | `bouncer` | Landscape — list hygiene | 4.5 |
| — | InboxAlly | `inboxally` | Landscape — deliverability | 5.0 |

\*ActiveCampaign overall **7.7** after email-marketing-editorial re-score 2026-08-17 (was CRM-era 7.0); primaryCategorySlug is now `email-marketing` with CRM secondary.

**Best-page ranked set (editorial, post P2/P3):**  
Klaviyo → ActiveCampaign → Omnisend → Brevo → GetResponse → Kit → MailerLite → Moosend → Mailjet → Drip → Mailchimp → Flodesk → Campaign Monitor → Constant Contact → AWeber.

**Landscape only:** Beehiiv, Customer.io, Bouncer, InboxAlly.

### C) Next.js catalogue — Marketing & Growth

| # | Product | Slug | Role / best-page | Overall |
| ---: | --- | --- | --- | ---: |
| 1 | Kartra | `kartra` | Rank #1 — creator all-in-one | 7.4 |
| 2 | Adobe Marketo Engage | `marketo` | Rank #2 — enterprise B2B MAP (**marketing-primary**) | 7.4 |
| 3 | Braze | `braze` | Rank #3 — enterprise B2C engagement | 7.0 |
| 4 | Iterable | `iterable` | Rank #4 — Braze peer B2C engagement | 6.9 |
| 5 | Freshmarketer | `freshmarketer` | Rank #5 — Freshworks MA | 7.0 |
| 6 | ClickFunnels | `clickfunnels` | Rank #6 — funnel peer | 6.8 |
| 7 | Buffer | `buffer` | Rank #7 — mainstream social scheduler award | 6.6 |
| 8 | SocialBee | `socialbee` | Rank #8 — social recycling / agency | 6.6 |
| 9 | Brand24 | `brand24` | Rank #9 — social listening | 6.2 |
| — | Later / Agorapulse | `later` / `agorapulse` | Landscape — social peers | 5.9 / 6.2 |
| — | Hootsuite / Sprout Social | `hootsuite` / `sprout-social` | Landscape — major social suites | 6.3 / 6.4 |
| — | Meltwater / Brandwatch | `meltwater` / `brandwatch` | Landscape — enterprise listening | 5.8 / 6.1 |
| — | WhatConverts / Uniqode / Switcher | `whatconverts` / `uniqode` / `switcher-studio` | Landscape — specialty / affiliate | 5.2 / 4.9 / 4.3 |
| — | LearnWorlds | `learnworlds` | Landscape — LMS | 7.1 |
| — | Livestorm | `livestorm` | Landscape — webinar | 6.8 |
| — | Salesforce Account Engagement | `pardot` | Landscape — Salesforce B2B MA (**CRM-primary**) | 6.7 |

**Marketo reclassified 2026-08-17:** `primaryCategorySlug: "marketing"`, `secondaryCategorySlugs: ["crm"]`. Pardot stays CRM-primary with marketing secondary (landscape / decision path only). Marketing Priority-2 closed 2026-08-17 (see log).

### D) Related but CRM-primary (mention in EM/Marketing guides; not EM catalogue)

| Product | Primary category | Why it matters for EM/Marketing buyers |
| --- | --- | --- |
| **HubSpot** | `crm` | Marketing Hub is a default shortlist name for B2B email + automation |
| **Pardot / Account Engagement** | `crm` | Salesforce-native B2B MA — marketing landscape only |

### E) Affiliate inventory still available (optional / deferred)

| Product | Hint | Note |
| --- | --- | --- |
| Diginius | marketing | Terms-review; marketing analytics |
| Kartra + WebinarJam composite | marketing | Composite programme — do not fake a single `/software/` page |

WhatConverts / Uniqode / Switcher Studio onboarded Marketing P2 (landscape).

---

## Industry products that matter (by buyer job)

### Priority 1 — Must consider for a credible Email Marketing category

| Product | Why industry cares | On SG live? | In Next.js EM catalogue? | Suggested action |
| --- | --- | --- | --- | --- |
| **Klaviyo** | Ecommerce email + SMS default | No | **Yes** (P1) | Keep; best #1 |
| **Brevo** (Sendinblue) | Budget multi-channel; send-based | No | **Yes** (P1) | Keep; best #4 |
| **MailerLite** | Simple + generous free tier | No | **Yes** (P1) | Keep; best #7 |
| **ActiveCampaign** | Automation depth | **Yes** (CRM-framed live URL) | **Yes** (EM primary; EM re-score **7.7** 2026-08-17) | Keep; best #2 |
| **Mailchimp** | Brand recognition / beginners | **Yes** (CRM-framed) | **Yes** | Keep; best #11 |
| **HubSpot Marketing Hub** | All-in-one B2B | **Yes** as CRM | CRM primary | Keep CRM home; deep-link |
| **GetResponse** | All-in-one SMB ESP | **Yes** | **Yes** | Keep; best #5 |

### Priority 2 — Strongly recommended (fills white space) — **DONE 2026-08-17**

| Product | Why industry cares | Next.js? | Disposition |
| --- | --- | --- | --- |
| **Omnisend** | Ecommerce multichannel Klaviyo alt | **Yes** | Rank #3 |
| **Kit** (ConvertKit) | Creator / newsletter ESP | **Yes** | Rank #6 |
| **Constant Contact** | SMB / local brand recognition | **Yes** | Rank #14 |
| **Beehiiv** | Newsletter growth platform | **Yes** | Landscape |
| **Flodesk** | Design-led creator ESP | **Yes** | Rank #12 |
| **Moosend** | Budget automation ESP | **Yes** | Rank #8 |

### Priority 3 — Useful coverage / mid-tier & enterprise MAP peers — **DONE 2026-08-17**

| Product | Role | Next.js? | Disposition |
| --- | --- | --- | --- |
| **Drip** | Ecommerce CRM/email | **Yes** | Rank #10 |
| **Mailjet** | EU transactional + marketing | **Yes** | Rank #9 |
| **Customer.io** | Product-led / event-driven messaging | **Yes** | Landscape (adjacent) |
| **Braze** | Enterprise B2C multi-channel | **Yes** (marketing) | Marketing best #3 |
| **Adobe Marketo Engage** | Enterprise B2B MAP | **Yes** (marketing-primary) | Marketing best #2 |
| **Salesforce Account Engagement (Pardot)** | Enterprise B2B on Salesforce | **Yes** (CRM-primary) | Marketing landscape |

### Marketing & Growth — industry products

#### Priority 1 — Marketing credibility — **DONE 2026-08-17**

| Product | Why industry cares | Next.js? | Disposition |
| --- | --- | --- | --- |
| **HubSpot Marketing Hub** | Default B2B MA shortlist | CRM | Cross-link only |
| **Buffer** | Social scheduling category default | **Yes** | Marketing best **#7** (mainstream scheduler award; was #6 before Iterable) |
| **Marketo Engage** | Enterprise B2B MAP | **Yes** (marketing-primary) | Marketing best #2 |
| **ClickFunnels** | Funnel peer to Kartra | **Yes** | Marketing best #6 |

#### Priority 2 — Marketing depth — **DONE 2026-08-17**

| Product | Role | Next.js? | Disposition |
| --- | --- | --- | --- |
| **Later** | Visual social scheduling peer | **Yes** (5.9) | Landscape (Buffer keeps mainstream scheduler award) |
| **Agorapulse** | Social inbox / scheduling peer | **Yes** (6.2) | Landscape |
| **Hootsuite** | Major social suite | **Yes** (6.3) | Landscape |
| **Sprout Social** | Major social suite | **Yes** (6.4) | Landscape |
| **Meltwater** | Enterprise listening | **Yes** (5.8) | Landscape |
| **Brandwatch** | Enterprise listening / consumer intel | **Yes** (6.1) | Landscape |
| **Iterable** | Enterprise B2C engagement peer to Braze | **Yes** (6.9) | Marketing best **#4** |
| **WhatConverts** | Lead / call attribution (affiliate) | **Yes** (5.2) | Landscape |
| **Uniqode** | QR / offline→online (affiliate) | **Yes** (4.9) | Landscape |
| **Switcher Studio** | Live video production (affiliate) | **Yes** (4.3) | Marketing landscape (not BC peer) |

See [`marketing-priority2-onboarding-2026-08-17.md`](./marketing-priority2-onboarding-2026-08-17.md).

### Already covered well (don’t treat as gaps)

**Email:** Full ESP shortlist through Constant Contact + hygiene/deliverability adjacent tools; ActiveCampaign EM re-score **7.7** (2026-08-17).  
**Marketing:** Creator funnels (Kartra/ClickFunnels), social (Buffer/SocialBee + Later/Agorapulse/Hootsuite/Sprout landscape), listening (Brand24 + Meltwater/Brandwatch), MA (Freshmarketer/Marketo), B2C engagement (Braze/Iterable).

Optional depth closed 2026-08-17. Remaining adjacent only: transactional email APIs (SendGrid/SES — out of scope).

### Usually adjacent (mention in guides; product page only if scope expands)

| Product | Primary job | Note |
| --- | --- | --- |
| Instantly / Lemlist / Smartlead | Cold email infrastructure | **Onboarded SI P4 landscape** — not EM |
| SendGrid / Postmark / Amazon SES | Transactional email APIs | Developer infra, not marketing ESP — **out of scope** |
| Gong / conversation intel | Sales call intelligence | **Onboarded SI P4 landscape** |
| HubSpot / Salesforce as CRM | System of record | Already CRM category |

---

## Gap summary

```text
Industry expectation              SoftwareGlimpse today
─────────────────────────────     ────────────────────────────
Ecommerce email (Klaviyo)         ✅ Next.js (not WP)
Value / EU multi-channel (Brevo)  ✅ Next.js (not WP)
Simple free-tier (MailerLite)     ✅ Next.js (not WP)
Creator ESP (Kit)                 ✅ Next.js P2 (not WP)
Ecommerce alt (Omnisend)          ✅ Next.js P2 (not WP)
Automation ESP (ActiveCampaign)   ✅ Next.js EM primary + EM re-score 7.7 (live URL still CRM-framed)
Brand ESP (Mailchimp)             ✅ Next.js + live (CRM-framed)
All-in-one SMB (GetResponse)      ✅ live + Next.js
Design ESP (Campaign Monitor)     ✅ Next.js only (not WP)
Creator SMB (AWeber)              ✅ Next.js only (not WP)
Budget automation (Moosend)       ✅ Next.js P2
SMB local (Constant Contact)      ✅ Next.js P2
Design-led creator (Flodesk)      ✅ Next.js P2
Newsletter growth (Beehiiv)       ✅ Next.js landscape
Ecommerce CRM/email (Drip)        ✅ Next.js P3
EU transactional (Mailjet)        ✅ Next.js P3
Product messaging (Customer.io)   ✅ Next.js landscape
B2B MAP via HubSpot               ✅ CRM catalogue + live CRM review
Social schedulers (Buffer)        ✅ Next.js Marketing P1
Enterprise MAP (Marketo)          ✅ Next.js marketing-primary
Funnel peers (ClickFunnels)       ✅ Next.js Marketing P1
Enterprise B2C (Braze/Iterable)   ✅ Next.js Marketing P1 + P2 (#3/#4)
Social suites (Hootsuite/Sprout)  ✅ Next.js Marketing P2 landscape
Enterprise listening peers        ✅ Next.js Marketing P2 landscape
Affiliate leftovers (WC/Uniqode/Switcher) ✅ Next.js Marketing P2 landscape
Live WP EM/Marketing hubs         ⚠️ no category/best pages; CRM-framed reviews only
```

**Planned Batches A–D for Priority 1–3 coverage: all ✅ DONE in Next.js (2026-08-17).** Marketing P2 + ActiveCampaign EM re-score closed 2026-08-17. Remaining work is WordPress publish / migration of hubs — not catalogue gaps.

---

## Recommended inclusion batches (planning only)

### Batch A — Email credibility (non-affiliate OK) — **DONE 2026-08-17**

1. Klaviyo — onboarded (best #1, overall 7.9)  
2. Brevo — onboarded (best #4, overall 7.5)  
3. MailerLite — onboarded (best #7, overall 7.2)  

See [`em-priority1-onboarding-2026-08-17.md`](./em-priority1-onboarding-2026-08-17.md).

### Batch B — Email segment depth — **DONE 2026-08-17**

4. Omnisend — rank #3 (7.7)  
5. Kit (ConvertKit) — rank #6 (7.1)  
6. Constant Contact — rank #14 (6.5)  
(+ Flodesk #12, Moosend #8, Beehiiv landscape)

See [`em-priority2-onboarding-2026-08-17.md`](./em-priority2-onboarding-2026-08-17.md).

### Batch C — Marketing credibility — **DONE 2026-08-17**

7. Buffer — marketing best #6  
8. ClickFunnels — marketing best #5  
9. Marketo Engage — marketing-primary; best #2 enterprise MAP award  

See [`marketing-priority1-onboarding-2026-08-17.md`](./marketing-priority1-onboarding-2026-08-17.md).

### Batch D — Affiliate inventory / enterprise peers — **DONE 2026-08-17**

10. LearnWorlds, Livestorm — landscape  
11. Braze — marketing best #3; Pardot — CRM-primary + marketing landscape  
12. EM P3: Drip, Mailjet ranked; Customer.io landscape  

### Batch E — Marketing Priority-2 depth — **DONE 2026-08-17**

Later / Agorapulse / Hootsuite / Sprout / Meltwater / Brandwatch landscape; Iterable rank #4; WhatConverts / Uniqode / Switcher Studio landscape (Switcher marketing-primary, not BC).

See [`marketing-priority2-onboarding-2026-08-17.md`](./marketing-priority2-onboarding-2026-08-17.md).

### Already in catalogue — publish / migrate when EM + Marketing cluster goes live

Full EM ranked set + Marketing ranked set above (+ HubSpot via CRM).

---

## Affiliate gap → disposition (inventory wave 2026-08-17)

| Product | Inventory hint | Disposition | Primary category | Editorial overall | CQ review |
| --- | --- | ---: | --- | ---: | ---: |
| **GetResponse** | email-marketing | Onboarded (was partial) | email-marketing | 7.5 | **93** |
| **AWeber** | email-marketing | Onboarded | email-marketing | 6.5 | **93** |
| **Campaign Monitor** | email-marketing | Onboarded | email-marketing | 7.0 | **93** |
| **Bouncer** | email-marketing | Onboarded — **adjacent** | email-marketing | 4.5 | **91** |
| **InboxAlly** | email-marketing | Onboarded — **adjacent** | email-marketing | 5.0 | **91** |
| **Kartra** | marketing | Onboarded (secondary email-marketing) | marketing | 7.4 | **91** |
| **SocialBee** | marketing | Onboarded | marketing | 6.6 | **91** |
| **Brand24** | marketing | Onboarded | marketing | 6.2 | **91** |
| **Freshmarketer** | marketing | Onboarded (secondary email-marketing) | marketing | 7.0 | **91** |
| **LearnWorlds** | marketing | Onboarded — LMS landscape | marketing | 7.1 | **91** |
| **Livestorm** | marketing | Onboarded — webinar landscape | marketing | 6.8 | **91** |
| **Mailchimp** | (existing) | Reclassified → email-marketing primary | email-marketing | 6.8* | **93** |
| **ActiveCampaign** | (existing) | Reclassified → email-marketing primary | email-marketing | 7.0* | **91** |
| **SaneBox** | was email-marketing | Deferred — re-homed to business-communications | — | — | — |
| **Fastmail** | business-communications | Deferred — wrong category for EM/Mkt | — | — | — |
| **NiceJob** | customer-service | Deferred — reputation/reviews | — | — | — |
| **Zypper** | unclear | **Excluded** — personal finance | — | — | — |

\*Best-page ranks for Mailchimp/ActiveCampaign; ActiveCampaign still carries a CRM-era assessment pending optional EM re-score.

---

## Sources used for “industry good”

- 2026 ESP / MAP comparison writeups repeatedly shortlisting Mailchimp, Klaviyo, ActiveCampaign, Brevo, MailerLite, HubSpot; ecommerce peers Omnisend; creator peers Kit; enterprise MAP Marketo / Braze / Pardot; social Buffer.  
- SoftwareGlimpse category definitions + `software.ts` EM/Marketing seeds + affiliate inventory `categoryHint: "email-marketing" | "marketing"`.  
- Live WP check (2026-08-17): GetResponse review + Mailchimp/ActiveCampaign/HubSpot CRM-framed pages + two HubSpot comparisons; no EM/Marketing category or best hubs on WP.

---

## Notes

- Catalogue Priority 1–3 EM + Marketing P1–P2 depth gaps are closed in Next.js (Batches A–E).  
- Do not let affiliate presence alone decide Best-page rank — Klaviyo/Omnisend/Marketo/Iterable outrank or sit beside affiliate products without programs.  
- Live reviews for Mailchimp/ActiveCampaign are still **CRM-URL framed**; migration should land EM-primary hubs without breaking those high-impression CRM URLs (see redirect manifest).  
- Update this file when WP hubs go live.
