# Business Communications — Product Coverage Map

**Date:** 2026-08-17  
**Purpose:** Local planning doc — which Business Communications products industry buyers expect, vs what SoftwareGlimpse already covers (live site + Next.js catalogue).  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

Related onboarding logs:
- [`business-communications-wave1-onboarding-2026-08-17.md`](./business-communications-wave1-onboarding-2026-08-17.md)
- [`bc-priority1-onboarding-2026-08-17.md`](./bc-priority1-onboarding-2026-08-17.md) — RingCentral, Dialpad, Zoom, Nextiva, Microsoft Teams, Slack
- [`bc-priority2-onboarding-2026-08-17.md`](./bc-priority2-onboarding-2026-08-17.md) — OpenPhone, 8x8 (`eightx8`), GoTo Connect, Grasshopper, respond.io
- [`bc-priority3-onboarding-2026-08-17.md`](./bc-priority3-onboarding-2026-08-17.md) — Webex, Vonage, Ooma, Talkdesk, Genesys, Five9
- [`bc-priority4-onboarding-2026-08-17.md`](./bc-priority4-onboarding-2026-08-17.md) — Twilio, ManyChat, Intercom (**landscape deferred-closed**)

---

## Category scope (SoftwareGlimpse)

Primary job: **enable business voice, customer messaging, or team communication**.

| In scope | Out of scope / adjacent |
| --- | --- |
| Cloud business phone / VoIP | Primary CRM with dialer module only |
| Contact-center calling / IVR | Sales-intelligence databases without a phone core |
| WhatsApp Business API / customer messaging platforms | Ticketing helpdesks without phone/messaging core |
| Team messaging | Digital accessibility / assistive AI (Aira) |
| Sales power dialers **with a phone-system core** | Webinar-only / live-streaming production (prefer marketing) |
| Inbox productivity / email clients (**adjacent**) | Composite multi-product programmes (WebinarJam+Kartra) |
| Programmable CPaaS (**landscape adjacent**) | Discord / Telegram business chat (usually out of scope) |

Source: `src/data/category-onboarding/seed/business-communications.ts`.

**Job clusters (do not rank across clusters on one undifferentiated list):**

1. **Cloud phone / UCaaS** — business numbers, softphone, IVR, CTI  
2. **Contact center (CCaaS)** — agent queues, omnichannel, WFM (landscape awards only)  
3. **Customer messaging** — WhatsApp BSP / shared inbox / marketing messaging  
4. **Team messaging** — internal chat (Slack/Teams-class)  
5. **Communications platform (CPaaS)** — programmable APIs (landscape adjacent)  
6. **Adjacent** — email clients / inbox productivity  

---

## What’s on SoftwareGlimpse today

### A) Live site — [softwareglimpse.com](https://www.softwareglimpse.com) (WordPress)

Checked 2026-08-17 (HTTP status on www).

| Product | Live URL | Status |
| --- | --- | --- |
| **KrispCall** | [/krispcall-review/](https://www.softwareglimpse.com/krispcall-review/) | Live review |
| **Fastmail** | [/fastmail-review/](https://www.softwareglimpse.com/fastmail-review/) | Live review (adjacent email client) |
| **SaneBox** | [/sanebox-review/](https://www.softwareglimpse.com/sanebox-review/) | Live review (adjacent inbox productivity) |

**Not live on WordPress today:**

- Category hub `/categories/business-communications/`
- Best page `/best/business-communications-software/`
- Reviews for Aircall, CallHippo, Freshcaller, Wati, Zenzap, Kixie
- Priority-1 + Priority-2 + Priority-3 + Priority-4 products now in Next.js but **not** on WP: RingCentral, Dialpad, Zoom, Slack, Microsoft Teams, Nextiva, OpenPhone, 8x8, GoTo Connect, Grasshopper, respond.io, Webex, Vonage, Ooma, Talkdesk, Genesys, Five9, Twilio, ManyChat, Intercom

### B) Next.js catalogue — Business Communications primary

**Twenty-eight** products with `primaryCategorySlug: "business-communications"` (Wave-1 + Priority-1–4, 2026-08-17). Product-review CQ **91** each for onboarded reviews.

| # | Product | Slug | Role / job cluster | Overall | Affiliate |
| ---: | --- | --- | --- | ---: | --- |
| 1 | RingCentral | `ringcentral` | Enterprise / mid UCaaS | **8.8** | No |
| 2 | Genesys | `genesys` | Enterprise CCaaS (landscape) | **8.8** | No |
| 3 | 8x8 | `eightx8` | Global / enterprise UCaaS peer | **8.6** | No |
| 4 | Dialpad | `dialpad` | AI-native UCaaS | **8.5** | No |
| 5 | Zoom | `zoom` | Video + Zoom Phone UCaaS | **8.4** | No |
| 6 | Talkdesk | `talkdesk` | Mid-market CCaaS (landscape) | **8.4** | No |
| 7 | Aircall | `aircall` | Mid-market cloud phone + CTI | **8.3** | Yes (`aff-aircall`) |
| 8 | Five9 | `five9` | Dialer-forward CCaaS (landscape) | **8.2** | No |
| 9 | respond.io | `respond-io` | Omnichannel WhatsApp messaging | **8.2** | No |
| 10 | Nextiva | `nextiva` | SMB/mid all-in-one business comms | **8.1** | No |
| 11 | Cisco Webex | `webex` | Enterprise UC / Webex Calling | **8.0** | No |
| 12 | Intercom | `intercom` | AI customer messaging / CS-borderline (landscape) | **8.0** | No |
| 13 | Twilio | `twilio` | CPaaS adjacent platform (landscape) | **7.9** | No |
| 14 | Wati | `wati` | WhatsApp Business BSP | **7.6** | Yes (`aff-wati`) |
| 15 | OpenPhone | `openphone` | Modern SMB shared business phone | **7.5** | No |
| 16 | GoTo Connect | `goto-connect` | Remote-team UCaaS | **7.4** | No |
| 17 | Microsoft Teams | `microsoft-teams` | M365 collaboration hub (+ Teams Phone add-on) | **7.3** | No |
| 18 | CallHippo | `callhippo` | SMB cloud phone + dialer | **7.2** | Yes (`aff-callhippo`) |
| 19 | ManyChat | `manychat` | Marketing messaging chatbot (landscape) | **7.2** | No |
| 20 | Freshcaller | `freshcaller` | Freshworks inbound cloud PBX | **7.0** | Yes (`aff-freshcaller`) |
| 21 | Vonage | `vonage` | SMB/mid published-line VoIP | **6.9** | No |
| 22 | KrispCall | `krispcall` | Budget global VoIP | **6.8** | Yes (`aff-krispcall`) |
| 23 | Slack | `slack` | Channel-first team messaging | **6.7** | No |
| 24 | Ooma | `ooma` | SMB Office VoIP (no contract) | **6.6** | No |
| 25 | Grasshopper | `grasshopper` | SMB virtual numbers | **6.2** | No |
| 26 | Zenzap | `zenzap` | Frontline / work team chat | **6.1** | Yes (`aff-zenzap`, pending) |
| 27 | Fastmail | `fastmail` | Adjacent — business email client | **4.8** | Yes (`aff-fastmail`) |
| 28 | SaneBox | `sanebox` | Adjacent — inbox productivity | **4.6** | Yes (`aff-sanebox`) |

### C) Related — secondary BC / other primary

| Product | Primary | BC role |
| --- | --- | --- |
| **Kixie** | `sales-intelligence` | Secondary `business-communications` — sales power dialer; landscape on BC best page |
| **Livestorm** | `marketing` | Webinar specialist — taxonomy seed only, not BC ranked peer |
| **Switcher Studio** | (inventory / marketing) | Live video production — not BC peer |
| **Intercom** | `business-communications` | Secondary `customer-service` — CS-borderline landscape |
| **ManyChat** | `business-communications` | Secondary `marketing` — marketing-adjacent messaging |

### D) Best page (Next.js) — `/best/business-communications-software/`

**Phone-cluster ranked set (editorial fit + scores):** unchanged from Priority-3

1. RingCentral — Best enterprise / all-in-one UCaaS (8.8)  
2. 8x8 — Best global / enterprise UCaaS peer (8.6)  
3. Dialpad — Best AI-powered calling (8.5)  
4. Zoom — Best video-led UCaaS / Zoom Phone path (8.4)  
5. Aircall — Best mid-market CRM CTI phone (8.3)  
6. Nextiva — Best SMB/mid all-in-one business communications (8.1)  
7. Cisco Webex — Best enterprise UC / Webex Calling (8.0)  
8. OpenPhone — Best modern SMB shared phone (7.5)  
9. GoTo Connect — Best remote-team UCaaS (7.4)  
10. CallHippo — Best SMB cloud phone value (7.2)  
11. Vonage — Best SMB/mid published-line VoIP (6.9)  
12. KrispCall — Best budget global numbers (6.8; fit above Freshcaller)  
13. Ooma — Best no-contract SMB Office VoIP (6.6)  
14. Freshcaller — Best Freshworks-aligned inbound voice (7.0)  

**Landscape / awards (not ranked as phone peers):** Talkdesk, Genesys, Five9 (CCaaS), Twilio (CPaaS adjacent), Grasshopper, respond.io, ManyChat, Intercom, Slack, Microsoft Teams, Wati, Zenzap, Kixie, Fastmail + SaneBox (adjacent).

---

## Industry products that matter (by buyer job)

### Priority 1 — Must consider for a credible BC category — **DONE 2026-08-17**

| Product | Why industry cares | On SG live? | In Next.js BC catalogue? | Suggested action |
| --- | --- | --- | --- | --- |
| **RingCentral** | Enterprise / mid-market UCaaS gold standard | No | **Yes** (8.8, CQ 91) | Onboarded — phone rank #1 |
| **Dialpad** | AI-native calling / coaching | No | **Yes** (8.5, CQ 91) | Onboarded — phone rank #3 |
| **Zoom** (Zoom Phone / Workplace) | Default video; phone extension | No | **Yes** (8.4, CQ 91) | Onboarded — phone rank #4 |
| **Microsoft Teams** (+ Teams Phone) | M365 collaboration default | No | **Yes** (7.3, CQ 91) | Landscape award |
| **Slack** | Channel-first team messaging | No | **Yes** (6.7, CQ 91) | Landscape award |
| **Aircall** | Mid-market CRM-first cloud phone | No (WP) | **Yes** | Keep; publish when BC hubs ship |
| **Nextiva** | SMB/mid all-in-one business communications | No | **Yes** (8.1, CQ 91) | Onboarded — phone rank #6 |

### Priority 2 — Strongly recommended — **DONE 2026-08-17** (deferred trio closed in P4)

| Product | Why industry cares | On SG? | Suggested action |
| --- | --- | --- | --- |
| **8x8** | Global UCaaS + contact center | **Yes** (Next.js, slug `eightx8`, 8.6, CQ 91) | Onboarded — phone rank #2 |
| **OpenPhone** | Modern SMB shared business phone | **Yes** (Next.js, 7.5, CQ 91) | Onboarded — phone rank #8 |
| **Grasshopper** | SMB virtual numbers | **Yes** (Next.js, 6.2, CQ 91) | Onboarded — landscape (thin UCaaS) |
| **GoTo Connect** | Remote-team UCaaS | **Yes** (Next.js, 7.4, CQ 91) | Onboarded — phone rank #9 |
| **respond.io** | Omnichannel / WhatsApp peer to Wati | **Yes** (Next.js, 8.2, CQ 91) | Onboarded — landscape messaging award |
| **Twilio** | Programmable voice/SMS infra | **Yes** (Next.js, 7.9, CQ 91) | **DONE** — landscape CPaaS adjacent (P4) |
| **ManyChat** | Chatbot / Messenger+WhatsApp marketing | **Yes** (Next.js, 7.2, CQ 91) | **DONE** — landscape marketing messaging (P4) |
| **Intercom** | Shared inbox (borderline CS) | **Yes** (Next.js, 8.0, CQ 91) | **DONE** — landscape CS-borderline (P4; secondary `customer-service`) |

### Priority 3 — Useful coverage / mid-tier & CCaaS peers — **DONE 2026-08-17**

| Product | Role | On SG? | Suggested action |
| --- | --- | --- | --- |
| **Cisco Webex** | Enterprise UC | **Yes** (Next.js, 8.0, CQ 91) | Onboarded — phone rank #7 |
| **Vonage** | SMB/mid VoIP | **Yes** (Next.js, 6.9, CQ 91) | Onboarded — phone rank #11 |
| **Ooma** | SMB/mid VoIP | **Yes** (Next.js, 6.6, CQ 91) | Onboarded — phone rank #13 |
| **Talkdesk** | CCaaS contact center | **Yes** (Next.js, 8.4, CQ 91) | Onboarded — **landscape** (Batch C DONE) |
| **Genesys** | Enterprise CCaaS | **Yes** (Next.js, 8.8, CQ 91) | Onboarded — **landscape** (Batch C DONE) |
| **Five9** | CCaaS | **Yes** (Next.js, 8.2, CQ 91) | Onboarded — landscape |
| **Discord** / **Telegram** (business use) | Informal team chat | No | Usually out of scope — **skip** |
| **WhatsApp Business App** (Meta) | Native app vs BSP | No | Mention vs Wati / respond.io in guides only — no product page |

### Priority 4 — Landscape deferred-closed — **DONE 2026-08-17**

| Product | Role | On SG? | Suggested action |
| --- | --- | --- | --- |
| **Twilio** | CPaaS adjacent platform | **Yes** (7.9) | Landscape only — not phone peer |
| **ManyChat** | Marketing messaging | **Yes** (7.2) | Landscape messaging (peer to Wati/respond.io) |
| **Intercom** | AI customer messaging / CS-borderline | **Yes** (8.0) | Landscape + secondary customer-service |

### Already covered well (don’t treat as gaps)

**Affiliate phone/messaging slice:** Aircall, CallHippo, KrispCall, Freshcaller, Wati, Zenzap + Kixie + Fastmail/SaneBox.  
**Priority-1–4 closed 2026-08-17.** Remaining = WP publish of BC hubs/reviews (optional). Discord/Telegram skipped.

---

## Gap summary

```text
Industry expectation                 SoftwareGlimpse today
─────────────────────────────────    ────────────────────────────
Enterprise UCaaS (RingCentral)       ✅ Next.js (not WP) — P1 2026-08-17
AI calling (Dialpad)                 ✅ Next.js (not WP) — P1
Video + phone (Zoom)                 ✅ Next.js (not WP) — P1
Collaboration default (Teams)        ✅ Next.js landscape (not WP) — P1
Team messaging default (Slack)       ✅ Next.js landscape (not WP) — P1
SMB all-in-one (Nextiva)             ✅ Next.js (not WP) — P1
Modern SMB phone (OpenPhone)         ✅ Next.js (not WP) — P2 2026-08-17
Global UCaaS (8x8)                   ✅ Next.js eightx8 (not WP) — P2
Remote UCaaS (GoTo Connect)          ✅ Next.js (not WP) — P2
SMB virtual numbers (Grasshopper)    ✅ Next.js landscape (not WP) — P2
WhatsApp/omni peer (respond.io)      ✅ Next.js landscape (not WP) — P2
Enterprise UC (Webex)                ✅ Next.js (not WP) — P3 2026-08-17
SMB/mid VoIP (Vonage, Ooma)          ✅ Next.js (not WP) — P3
CCaaS (Talkdesk, Genesys, Five9)     ✅ Next.js landscape (not WP) — P3 / Batch C DONE
CPaaS (Twilio)                       ✅ Next.js landscape (not WP) — P4 2026-08-17 DONE
Marketing messaging (ManyChat)       ✅ Next.js landscape (not WP) — P4 DONE
AI CS messaging (Intercom)           ✅ Next.js landscape (not WP) — P4 DONE
Mid-market CTI phone (Aircall)       ✅ Next.js (not WP)
SMB phone value (CallHippo)          ✅ Next.js (not WP)
Budget global VoIP (KrispCall)       ✅ Next.js + live review
Freshworks PBX (Freshcaller)         ✅ Next.js (not WP)
WhatsApp BSP (Wati)                  ✅ Next.js (not WP)
Team chat SMB (Zenzap)               ✅ Next.js (not WP)
Sales dialer (Kixie)                 ✅ SI primary + BC secondary
Adjacent email (Fastmail/SaneBox)    ✅ Next.js + live reviews
Live WP BC category/best hubs        ⚠️ 404 — only 3 live reviews
Discord / Telegram                   ❌ skipped (out of scope)
```

**Wave-1 + Priority-1 + Priority-2 + Priority-3 + Priority-4 done.** Remaining = **WP publish only**.

---

## Recommended inclusion batches (planning only)

### Batch A — UCaaS credibility — **DONE 2026-08-17**

1. RingCentral ✅  
2. Dialpad ✅  
3. Zoom ✅  
4. Nextiva ✅  

### Batch B — Collaboration & messaging — **DONE 2026-08-17**

5. Microsoft Teams ✅  
6. Slack ✅  
7. OpenPhone ✅ (Priority-2)  
8. respond.io ✅ (Priority-2)  
8b. ManyChat ✅ (Priority-4 landscape)  
8c. Intercom ✅ (Priority-4 landscape)  

### Batch C — Mid-tier / enterprise depth — **DONE 2026-08-17**

9. 8x8 ✅ (Priority-2, slug `eightx8`)  
10. GoTo Connect ✅  
11. Grasshopper ✅  
12. Talkdesk ✅ (Priority-3, **landscape CCaaS**)  
13. Genesys ✅ (Priority-3, **landscape CCaaS**)  
14. Five9 ✅ (Priority-3, landscape CCaaS)  
15. Webex / Vonage / Ooma ✅ (Priority-3 phone mid-tier)  
16. Twilio ✅ (Priority-4, **landscape CPaaS**)  

### Already in catalogue — publish / migrate when BC cluster goes live

Aircall, CallHippo, KrispCall, Freshcaller, Wati, Zenzap, Fastmail, SaneBox (+ Kixie via SI).

---

## Notes

- Catalogue CLI is **existing-affiliate-only**; Priority-2/3/4 used manual onboarding — now complete.  
- Keep **phone vs CCaaS vs messaging vs team-chat vs CPaaS** clusters separate on the best page.  
- Priority 4 completed 2026-08-17 — see `bc-priority4-onboarding-2026-08-17.md`. Remaining: WP publish of BC hubs (optional). Discord/Telegram skipped.
