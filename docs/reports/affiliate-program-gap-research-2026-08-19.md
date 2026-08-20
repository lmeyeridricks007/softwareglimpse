# Affiliate programmes for catalogue products without live links

**Date:** 2026-08-19  
**Scope:** **250 published SoftwareGlimpse products** with affiliate status `NONE` (no live programme in `programmes.json`). Motion is **PENDING** and is excluded. The **28** already-active programmes are not repeated here.

**This is research for ops.** Do not auto-import, invent PartnerStack URLs, or change Finder / Best / comparison rankings because a programme exists. Wire approved destinations only through `affiliate:import` / `partner-links.ts`.

Rates and eligibility **change**. Confirm the number in the vendor dashboard after approval. Where a public page was not found, the row says so — do not treat that as “definitely no programme.”

---

## Snapshot

| Bucket | Count | What to do |
| --- | ---: | --- |
| Tracking URL already in `partner-links.ts` but **not** an active programme | **26** | Import / activate. Application is already done. |
| In partner registry with **null** URL | **10** | Apply on the vendor’s public programme (Freshworks family, Apollo, RocketReach, Livestorm, Uniqode). |
| Not in the partner registry | **214** | Apply where a **content-affiliate** programme exists; skip or use consulting/ISV tracks where it does not. |
| **Total gap** | **250** | |

**monday sales CRM** is in the 250. The **monday.com** programme is already **ACTIVE** on slug `monday`. Do not re-apply. Add `monday-sales-crm` to that programme’s `productSlugs` and reuse `https://try.monday.com/h9l0vmame38h`.

---

## Apply first (commercial value)

These are the gaps that overlap high-intent pages. Official apply URLs only.

| Product | Programme? | How to apply | Pays (public, confirm in dashboard) |
| --- | --- | --- | --- |
| **HubSpot** | **Yes** — content affiliate (Impact) | [hubspot.com/partners/affiliates](https://www.hubspot.com/partners/affiliates) → Impact. Content sites OK; coupon/cashback often rejected. `affiliates@hubspot.com` | **30% recurring up to 12 months**; **180-day** cookie. Free CRM signups do **not** pay. Tiers (Sprocket/Elite) add CPS / custom. |
| **Zoho CRM** (covers Zoho Desk too once approved) | **Yes** — in-house affiliate | [zoho.com/affiliate](https://www.zoho.com/affiliate/) → sign-up form. **Cannot** also be a Zoho consulting/reseller partner. | **15% / 18% / 20%** of revenue for **12 months** (volume tiers). Referral must stay **≥60 days**. Cookie **90 days**. Commission is on the **first** Zoho product only, not later cross-sell. |
| **Apollo.io** | **Yes** — PartnerStack | [apollo.io/partners/affiliates](https://www.apollo.io/partners/affiliates) | **15%** monthly plans / **20%** annual, **first 12 months**. |
| **Freshworks** (Freshsales, Freshdesk, Freshservice, Freshchat, Freshcaller, Freshmarketer, Freshteam) | **Yes** — one PartnerStack programme, **seven product links** | [freshworks.com/partners/affiliate-partner-individual](https://www.freshworks.com/partners/affiliate-partner-individual/) or [PartnerStack Freshworks](https://market.partnerstack.com/page/freshworks4391) | **20%** first-year recurring default; **25%** / custom at volume. Same application unlocks all Freshworks SKUs. |
| **ActiveCampaign** | **Yes** — PartnerStack | [activecampaign.com/partners/affiliate](https://www.activecampaign.com/partners/affiliate) → `activecampaign.partnerstack.com/?group=affiliatepartners` | **30% recurring up to 12 months**. **90-day** cookie. **60-day** hold. |
| **Shopify** | **Yes** — Impact | [shopify.com/affiliates](https://www.shopify.com/affiliates) | **Up to $150 USD one-time** per full-price Basic/Grow/Advanced signup. Amount **varies by merchant country**. Plus **not** commissionable. ~30-day click; trial tracking longer. |
| **Zendesk** (Sell + Suite) | **Yes** — PartnerStack | [zendesk.com/programs/affiliate-program](https://www.zendesk.com/programs/affiliate-program/) | **15%** of first-year sales (top affiliates can earn more). Existing Zendesk **partners/resellers excluded**. |
| **Webflow** | **Yes** — PartnerStack (creators) | [webflow.com/solutions/affiliates](https://webflow.com/solutions/affiliates). Agencies use Certified Partner instead. | Commission on a **new user’s first subscription for up to 12 months** + **90-day** cookie. Starting % is in the PartnerStack offer after apply (public page says “competitive,” not a single number). |
| **Beehiiv** | **Yes** | [beehiiv.com/partners](https://www.beehiiv.com/partners) (needs a beehiiv account + Dub.co for payouts) | **50%** of referred revenue for **12 months** (up to **60%** at Gold). Cookie **60 days**. Cap **$15,000** per referral. PayPal, 15th of month. |
| **MailerLite** | **Yes** | [mailerlite.com/affiliate](https://www.mailerlite.com/affiliate) → Trackdesk sign-up | **30% recurring for the life of the customer**. |
| **Hunter** | **Yes** | [hunter.io/affiliate-program](https://hunter.io/affiliate-program) | **30% recurring, 12 months**. Cookie **30 days**. PayPal, **$100** min, 45-day hold. |
| **Snov.io** | **Yes** | Apply from [Snov affiliate KB](https://snov.io/knowledgebase/how-snov-io-affiliate-program-works/) (in-product form after review) | **40%** on premium plan purchases (ongoing, not first-only). Extra **20%** on LinkedIn slots. No PPC. |
| **Instantly** | **Yes** — PartnerStack | [instantly.ai/affiliate](https://instantly.ai/affiliate) | **20% / 30% / 40%** recurring by referral count (Silver/Gold/Platinum). |
| **ClickUp** | **Yes** | [clickup.com/partners/affiliates](https://clickup.com/partners/affiliates) → PartnerStack | **Up to $25 CPA** per new **free workspace** (one-time, by country). Not a SaaS revenue share at starter tier. |
| **Printful** | **Yes** | [printful.com/affiliates](https://www.printful.com/affiliates) | **10%** of orders for **12 months** after first purchase; **$25** for Growth plan first sub. Cookie **30 days**. PayPal, **$25** min. |
| **Printify** | **Yes** | [printify.com/affiliate](https://printify.com/affiliate) | **5%** of catalog product price for **12 months**. Cookie **90 days**. Monthly PayPal. |
| **monday sales CRM** | **Already in house** | Do **not** apply again. Attach slug to existing monday.com programme. | Same as live monday.com deal (see PartnerStack / existing dashboard). |

**Salesforce:** there is **no public content-affiliate programme**. Path is [Salesforce Partner Community](https://www.salesforce.com/partners/become-a-partner/) (consulting / reseller / ISV). Lead-referral cash, if any, is PAM-gated — not a `/go/` link you can put on a review page. Treat as **official CTA only** unless a Partner Account Manager issues a referral mechanic.

---

## Already have a tracking URL (26) — wire, don’t re-apply

These published products have `affiliateUrl` in `src/data/affiliates/source/partner-links.ts` but **no active programme**. Next step: `npm run affiliate:import` (or set programme + destination) after confirming the link still live. **Do not invent a second PartnerStack URL.**

| Product | Category | Tracking URL (already yours) | Public pay (if published) |
| --- | --- | --- | --- |
| AdCreative.ai | AI | `https://free-trial.adcreative.ai/az59uqmj4faf-96w1li` | Confirm in PartnerStack dashboard |
| ElevenLabs | AI | `https://try.elevenlabs.io/2tsfz1jc3rce` | Confirm in dashboard (creator/affiliate offer) |
| Gamma | AI | `https://try.gamma.app/m8cx9huc5414` | Confirm in dashboard |
| MindStudio | AI | `https://get.mindstudio.ai/lgjc5c17fkpb` | Confirm in dashboard |
| QuillBot | AI | `https://try.quillbot.com/db3a97ce993a` | Confirm in dashboard |
| Wegic | AI | `https://try.wegic.ai/4p512poiwlw9` | Confirm in dashboard |
| Aircall | Comms | `https://get.aircall.io/1iaj04fel1ok` | Confirm in PartnerStack |
| CallHippo | Comms | `https://join.callhippo.com/nmdfk28yy5a9` | Confirm in dashboard |
| **Fastmail** | Comms | `https://join.fastmail.com/leemeyeridricks5543` | **20% for up to 2 years**; referred customer **10% off 12 months**. Cookie **90 days**. PartnerStack. |
| KrispCall | Comms | `https://try.krispcall.com/4l3iuvw2crqn` | Confirm in dashboard |
| SaneBox | Comms | `https://try.sanebox.com/vub7fxpb2g7m` | Confirm in PartnerStack |
| Wati | Comms | `https://affiliates.wati.io/v2fe9kxh7wq8` | Confirm in dashboard |
| Zenzap | Comms | `https://try.zenzap.co/7rv36pfxdvvy` | Confirm in dashboard |
| Tidio | CS | `https://affiliate.tidio.com/9dfzehpzpg2p-8xvu4` | Confirm in Tidio affiliate portal |
| AWeber | Email | `https://psjoin.aweber.com/6dw4eb19d1rc` | Confirm in PartnerStack |
| Bouncer | Email | `https://withlove.usebouncer.com/7f96frxz2xmj` | Confirm in dashboard |
| Campaign Monitor | Email | `https://partners.campaignmonitor.com/ezb6s7olowj1` | Confirm in dashboard |
| InboxAlly | Email | `https://get.inboxally.com/email-placement-tester-bznqt8ycxvhu` | Confirm in dashboard |
| Bright Data | IT | `https://get.brightdata.com/egcchebrm7g5` | Confirm in PartnerStack |
| Plesk | IT | `https://try.plesk.com/tu2la8fk5ac9-z4f5m7` | Confirm in PartnerStack |
| ThorData | IT | `https://affiliate.thordata.com/eu3nfozhzp5f` | Confirm in dashboard |
| Switcher Studio | Marketing | `https://start.switcherstudio.com/pqjil7ivf3t7` | Confirm in dashboard |
| WhatConverts | Marketing | `https://partners.whatconverts.com/dmbfqglmddkr` | Confirm in dashboard |
| BookYourData | SI | `https://join.bookyourdata.com/iyjf5ka4hj9j` | Confirm in dashboard |
| Kixie | SI | `https://get.kixie.com/g2td1yz9zi5n` | Confirm in dashboard |
| Reply.io | SI | `https://get.reply.io/se3w5qrz6hyy` | Confirm in PartnerStack |

---

## Registry null URL (10) — apply, then paste the real link

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Apollo.io | Yes | [apollo.io/partners/affiliates](https://www.apollo.io/partners/affiliates) | 15% monthly / 20% annual × 12 months |
| Freshsales, Freshdesk, Freshservice, Freshchat, Freshcaller, Freshmarketer | Yes (shared Freshworks) | [Freshworks affiliate](https://www.freshworks.com/partners/affiliate-partner-individual/) | 20%+ first year (see Apply first) |
| Livestorm | **Unclear** | Partner-links row is null. Check [livestorm.co](https://livestorm.co) partners / PartnerStack search. **Do not invent a URL.** | Not published here |
| Uniqode | **Unclear** | Same — registry null. Check vendor partners page. | Not published here |
| RocketReach | **Unclear / likely partner-not-affiliate** | Registry null. Check [rocketreach.co](https://rocketreach.co) partners. | Not published here |

---

## Full gap list by category

Legend: **Yes** = public content-affiliate found · **Partner-only** = consulting/ISV/reseller, not a review-site `/go/` link · **None found** = no public content-affiliate page located on 19 Aug 2026 · **Wire** = URL already in `partner-links.ts`.

### CRM (31)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| HubSpot | **Yes** | [hubspot.com/partners/affiliates](https://www.hubspot.com/partners/affiliates) | 30% × 12 months (Impact) |
| Zoho CRM | **Yes** | [zoho.com/affiliate](https://www.zoho.com/affiliate/) | 15–20% × 12 months |
| Freshsales | **Yes** (Freshworks) | Freshworks PartnerStack (above) | 20%+ Y1 |
| monday sales CRM | **Yes (existing monday.com)** | Add slug to live programme | Same as monday.com |
| Salesforce / Account Engagement (Pardot) | **Partner-only** | [salesforce.com/partners](https://www.salesforce.com/partners/become-a-partner/) | Not a public % for publishers |
| Dynamics 365 | **Partner-only** | Microsoft Partner Center / Solutions Partner | Not a content-affiliate % |
| Oracle CX / NetSuite / Siebel | **Partner-only** | Oracle partner network | Not public CPA/RevShare for reviews |
| SAP Customer Experience | **Partner-only** | SAP PartnerEdge | Not public |
| Pega CRM | **Partner-only** | Pega Partner | Not public |
| Mailchimp | **Partner-ish (Mailchimp & Co)** | [mailchimp.com/help/earn-commission](https://mailchimp.com/help/earn-commission/) — **agency connected-accounts**, not a classic review-site link | **25%** new connected paid referrals / **5%** managed revenue; quarterly Payoneer; must stay connected to **≥2** paid accounts |
| Zendesk Sell | **Yes** | [Zendesk affiliate](https://www.zendesk.com/programs/affiliate-program/) | 15% Y1 |
| Bitrix24 | Check | [bitrix24.com](https://www.bitrix24.com) partners / affiliate | Often has an in-house affiliate; confirm current % on apply |
| Agile CRM | Check | Vendor site → Affiliate | Historically public; confirm current terms |
| Copper | Check | copper.com partners | Confirm; do not invent PartnerStack slug |
| Attio | Check | attio.com partners | Confirm |
| Nutshell | Check | nutshell.com affiliates | Confirm |
| Insightly | Check | insightly.com partners | Confirm |
| Nimble | Check | nimble.com partners | Confirm |
| Pipeline CRM | Check | pipelinecrm.com | Confirm |
| ACT! | Check | act.com partners | Confirm |
| Apptivo | Check | apptivo.com | Confirm |
| Cloze | Check | cloze.com | Confirm |
| Creatio | **Partner-only likely** | creatio.com partners | Implementation/reseller, not typical CPA |
| Affinity | **None found / private** | affinity.co | Deal CRM; no public content-affiliate located |
| Podio | **None found** | (Citrix/Podio) | No public programme located |
| Streak | **None found** | streak.com | No public programme located |
| SugarCRM | **Partner-only likely** | sugarcrm.com partners | Confirm |
| Wealthbox | Check | wealthbox.com advisors/partners | Niche; confirm |

### Email marketing (16)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| ActiveCampaign | **Yes** | [activecampaign.com/partners/affiliate](https://www.activecampaign.com/partners/affiliate) | 30% × 12 months |
| AWeber | **Wire** | Already have PartnerStack URL | Dashboard |
| Campaign Monitor | **Wire** | Already have URL | Dashboard |
| Bouncer | **Wire** | Already have URL | Dashboard |
| InboxAlly | **Wire** | Already have URL | Dashboard |
| Beehiiv | **Yes** | [beehiiv.com/partners](https://www.beehiiv.com/partners) | 50–60% × 12 months |
| MailerLite | **Yes** | [mailerlite.com/affiliate](https://www.mailerlite.com/affiliate) | 30% lifetime |
| Omnisend | **Yes** (Impact, commonly) | Search Impact / [omnisend.com](https://www.omnisend.com) partners | Public roundup: **~20% recurring up to 24 months** — **confirm on Impact** |
| Brevo | Check | brevo.com/partners or affiliate | Confirm current % |
| Constant Contact | Check | constantcontact.com affiliates | Historically Impact/CJ; confirm 2026 terms |
| Flodesk | **None found** | flodesk.com | No public content-affiliate located |
| Klaviyo | **Partner program (not open coupon affiliate)** | [Klaviyo Partner Programs](https://www.klaviyo.com) → Partners — agencies/qualified referrals | Not a self-serve review-site rate on a public page |
| Customer.io | **None found / partner** | customer.io partners | Confirm |
| Drip | Check | drip.com affiliates | Confirm |
| Mailjet (Sinch) | Check | mailjet.com partners | Confirm |
| Moosend | Check | moosend.com affiliate | Confirm |

### Sales intelligence (27)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Apollo.io | **Yes** | [apollo.io/partners/affiliates](https://www.apollo.io/partners/affiliates) | 15%/20% × 12 months |
| Reply.io | **Wire** | Existing URL | Dashboard |
| BookYourData | **Wire** | Existing URL | Dashboard |
| Kixie | **Wire** | Existing URL | Dashboard |
| Hunter | **Yes** | [hunter.io/affiliate-program](https://hunter.io/affiliate-program) | 30% × 12 months |
| Snov.io | **Yes** | [Snov affiliate how-to](https://snov.io/knowledgebase/how-snov-io-affiliate-program-works/) | 40% on premium purchases |
| Instantly | **Yes** | [instantly.ai/affiliate](https://instantly.ai/affiliate) | 20–40% recurring (tiered) |
| Lemlist | **Yes** (vs service partner) | [lemlist.com/service-partners](https://www.lemlist.com/service-partners) — use **Affiliate** track, not agency service partner | **25%** of plan (Email Pro / Multichannel / Scale) within 30 days of click; PartnerStack; 30-day validation |
| Smartlead | Check | smartlead.ai affiliate / PartnerStack | Confirm |
| Kaspr | Check | kaspr.io affiliate | Confirm |
| UpLead | Check | uplead.com affiliates | Confirm |
| Adapt.io | Check | adapt.io | Confirm |
| Ocean.io | Check | ocean.io | Confirm |
| Seamless.AI | Check | seamless.ai partners | Confirm |
| Clay | **None found / private** | clay.com | No public content-affiliate located |
| RocketReach | Null in registry | Check partners page | Unknown |
| LinkedIn Sales Navigator | **None** (LinkedIn Marketing Partners / ads) | No publisher CPA | — |
| ZoomInfo | **Partner-only** | ZoomInfo partner network | Not public CPA |
| 6sense / Demandbase / Bombora | **Partner-only** | ABM vendor partner teams | Not public CPA |
| Gong / Outreach / Salesloft | **Partner-only** | Revenue-tech partner | Not public CPA |
| Cognism / LeadIQ / Clearbit | **Partner-only or acquired** | Confirm (Clearbit is HubSpot) | Not typical review CPA |

### Marketing (16)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Freshmarketer | **Yes** (Freshworks) | Same as Freshworks | 20%+ Y1 |
| WhatConverts | **Wire** | Existing URL | Dashboard |
| Switcher Studio | **Wire** | Existing URL | Dashboard |
| ClickFunnels | **Yes** | clickfunnels.com affiliates (official funnel) | Commonly **~30–40% recurring**; **confirm on official apply page** after login |
| Buffer | Check | buffer.com affiliates | Confirm |
| Agorapulse | Check | agorapulse.com affiliates | Often public; confirm % |
| Later | Check | later.com affiliates | Confirm |
| Hootsuite / Sprout Social / Brandwatch / Meltwater | **Partner-only likely** | Vendor partner portals | Enterprise; no simple CPA found |
| Braze / Iterable | **Partner-only** | Agency/tech partner | Not public CPA |
| Adobe Marketo Engage | **Partner-only** | Adobe Solution Partner | Not content-affiliate |
| Livestorm / Uniqode | Null in registry | See above | Unknown |

### Customer service (9)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Freshdesk / Freshchat / Freshservice | **Yes** (Freshworks) | Freshworks PartnerStack | 20%+ Y1 |
| Tidio | **Wire** | Existing URL | Dashboard |
| Zendesk Suite | **Yes** | Zendesk PartnerStack | 15% Y1 |
| Zoho Desk | **Yes** (Zoho affiliate — same as CRM) | [zoho.com/affiliate](https://www.zoho.com/affiliate/) | Same 15–20% × 12 months |
| Gorgias | Check | gorgias.com partners | Ecommerce helpdesk; confirm affiliate vs agency |
| Help Scout | Check | helpscout.com partners | Confirm |
| LiveChat (Text) | Check | livechat.com affiliates / PartnerStack | Confirm |

### Business communications (28)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Fastmail, SaneBox, Aircall, CallHippo, KrispCall, Wati, Zenzap | **Wire** | Existing URLs | Fastmail **20% × 2 years**; others dashboard |
| Freshcaller | **Yes** (Freshworks) | Freshworks apply | 20%+ Y1 |
| Intercom | **Partner-only / limited** | intercom.com partners | No open content-affiliate page located |
| ManyChat | Check | manychat.com affiliates | Confirm |
| OpenPhone | Check | openphone.com affiliates | Confirm |
| respond.io | Check | respond.io partners | Confirm |
| Grasshopper | Check | grasshopper.com | Confirm |
| Slack / Microsoft Teams / Webex / Zoom | **Partner-only or none** | Salesforce / Microsoft / Cisco / Zoom partner | No publisher CPA for the product SKU |
| RingCentral / 8x8 / Vonage / Nextiva / Ooma / GoTo / Dialpad / Five9 / Genesys / Talkdesk / Twilio | **Partner-only** | CCaaS/CPaaS partner or agency | Not a review-site programme |

### Ecommerce (21)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Shopify | **Yes** | [shopify.com/affiliates](https://www.shopify.com/affiliates) | Up to **$150** one-time (geo-based) |
| Webflow | **Yes** | [webflow.com/solutions/affiliates](https://webflow.com/solutions/affiliates) | First-sub commission × up to 12 months (PartnerStack) |
| Printful | **Yes** | [printful.com/affiliates](https://www.printful.com/affiliates) | 10% × 12 months |
| Printify | **Yes** | [printify.com/affiliate](https://printify.com/affiliate) | 5% × 12 months |
| Wix | Check | wix.com/affiliates (Impact historically) | Confirm 2026 bounty |
| Squarespace | Check | squarespace.com/affiliates | Confirm |
| BigCommerce | Check | bigcommerce.com/partners | Affiliate vs partner — confirm |
| WooCommerce (Automattic) | Check | woocommerce.com affiliates / Automattic | Confirm |
| Ecwid (Lightspeed) | Check | ecwid.com affiliates | Confirm |
| Square Online | **None found** | Square partner | Not typical SaaS CPA |
| Lightspeed Retail | **Partner-only** | lightspeedhq.com partners | Confirm |
| Adobe Magento | **Partner-only** | Adobe | — |
| Salesforce Commerce Cloud | **Partner-only** | Salesforce | — |
| VTEX / commercetools / Shopware / Tiendanube | **Partner-only** | Vendor partner | — |
| Medusa / Saleor | **None** (open source) | Sponsorship/cloud if any | No classic affiliate |
| OpenCart / PrestaShop | Check | Vendor affiliate pages | Confirm |

### Project management (12)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| ClickUp | **Yes** | [clickup.com/partners/affiliates](https://clickup.com/partners/affiliates) | Up to **$25** per free workspace |
| Notion | **Closed to new affiliates** (public page as of recent listings) | [notion.so](https://www.notion.so) affiliate page — **watchlist only** | Was cited as ~$50 + 20% Y1 when open; **do not apply if closed** |
| Asana | Check | Impact / asana.com partners | Confirm bounty; mixed public info |
| Todoist | Check | todoist.com affiliates | Confirm |
| Wrike | Check | wrike.com affiliates | Confirm |
| Airtable | Check | airtable.com affiliates | Confirm |
| Smartsheet | **Partner-only likely** | smartsheet.com partners | Confirm |
| Trello / Jira | **Atlassian Solution Partner**, not a simple review CPA | atlassian.com/partners | Not a % you paste on `/software/jira/` |
| Linear | **None found** | linear.app | No public affiliate located |
| Basecamp | **None found** | basecamp.com | No public affiliate located |
| Microsoft Project | **Partner-only** | Microsoft | — |

### HR (20)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Gusto | Check | gusto.com/partners or affiliate | Confirm (often partner not open CPA) |
| Rippling | **Partner-only likely** | rippling.com partners | Confirm |
| BambooHR | **Partner-only likely** | bamboohr.com partners | Confirm |
| Homebase / When I Work / Deputy / 7shifts | Check | Vendor affiliate pages | Shift-scheduling tools sometimes have Impact/PartnerStack — confirm each |
| Workable | Check | workable.com affiliates | Confirm |
| Greenhouse / Lever / Ashby | **Partner-only** | ATS partner | Not publisher CPA |
| Personio / HiBob | **Partner-only** | EU HR partner | Confirm |
| ADP / Dayforce / Paycor / Paylocity / UKG / Oracle HCM / Workday | **Partner-only** | Payroll/HCM partner networks | No content-affiliate |

### AI (21)

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| AdCreative.ai, ElevenLabs, Gamma, MindStudio, QuillBot, Wegic | **Wire** | Existing URLs | Dashboard |
| Zapier | Check | zapier.com/l/partner or affiliates (Impact historically) | Confirm 2026 % |
| Fireflies.ai | Check | fireflies.ai affiliates | Confirm |
| Synthesia | Check | synthesia.io affiliates / PartnerStack | Confirm |
| n8n | Check | n8n.io (cloud vs OSS) | Confirm cloud affiliate if any |
| Otter.ai | Check | otter.ai affiliates | Confirm |
| Perplexity / Runway / Midjourney | **None found** | — | No public SaaS CPA located |
| ChatGPT / Claude / Gemini / Copilot / Cursor / GitHub Copilot / Adobe Firefly | **None / API partner / Microsoft-Adobe partner** | Not a review-site affiliate | Keep official CTAs |

### IT & development (49)

Most observability, ITSM, and hyperscaler products are **partner-only**. Apply only where a **publisher** programme exists.

| Product | Programme? | Apply | Pays |
| --- | --- | --- | --- |
| Bright Data, Plesk, ThorData | **Wire** | Existing URLs | Dashboard |
| Kinsta | **Yes** (often) | kinsta.com/affiliates | Confirm current recurring % |
| Cloudways (DigitalOcean) | **Yes** (often) | cloudways.com/en/affiliate.php | Confirm |
| SiteGround | **Yes** (often) | siteground.com/affiliates | Confirm |
| WP Engine | Check | wpengine.com/partners | Affiliate vs agency — confirm |
| cPanel / DirectAdmin | Check | Vendor affiliate | Confirm |
| Heroku / Fly.io / Render / Railway | **None found / credits** | Referral credits ≠ commission | Not a `/go/` payout |
| GitHub / GitLab / Bitbucket / Azure DevOps / CircleCI / Buildkite | **Partner or none** | — | Not typical review CPA |
| Datadog / New Relic / Dynatrace / Splunk / Elastic / Grafana Cloud / Honeycomb / Chronosphere / Coralogix / AppDynamics | **Partner-only** | Marketplace/ISV | — |
| Sentry | Check | sentry.io partners | Confirm |
| PagerDuty / incident.io / Rootly / FireHydrant | **Partner-only or none** | Confirm | — |
| ServiceNow / Jira Service Management / BMC Helix / Ivanti / HaloITSM / ManageEngine / SysAid / TOPdesk | **Partner-only** | ITSM partner | — |
| Apify / ScraperAPI / Oxylabs / IPRoyal / Decodo / Zyte | Check | Several proxy/data vendors have PartnerStack — search `{vendor} affiliate` and apply on **their** page only | Confirm %; Bright Data/ThorData already wired |
| HaloITSM etc. | Partner | — | — |

---

## How to apply (same steps every time)

1. Open the **official** programme URL in the tables (not a scraped PartnerStack slug unless it is on the vendor’s own page).  
2. Apply as a **content / publisher / SaaS review site** (SoftwareGlimpse). Coupon and deal-site traffic is often banned.  
3. After approval, copy the **default homepage or trial** tracking URL into `partner-links.ts` and run `npm run affiliate:import`.  
4. `affiliate:validate`. Do **not** paste the URL into MDX.  
5. Finder / Best / comparison scores stay affiliate-blind.

---

## What “pays” actually means

- **Recurring % × N months** — you earn on each invoice for N months, then it stops (HubSpot, Zoho, Apollo, Freshworks, ActiveCampaign).  
- **Lifetime %** — rare and valuable (MailerLite).  
- **CPA / bounty** — one cheque per qualified signup (Shopify, ClickUp starter). Worse for a decision site unless volume is huge.  
- **Partner-only** — you will not get a tracking link for `/software/{slug}/` without becoming a reseller/consultant. Leave the official CTA.

Do not forecast SoftwareGlimpse revenue from these percentages. That needs live GSC × conversion × plan mix.

---

## Recommended order of applications

1. **Import the 26** existing `partner-links.ts` URLs into active programmes (Fastmail, Reply.io, Aircall, Tidio, AWeber, ElevenLabs, …).  
2. **HubSpot** (Impact) — highest overlap with ranked CRM content.  
3. **Zoho** — one apply covers CRM + Desk (+ other Zoho SKUs on first product only).  
4. **Freshworks** — one apply covers seven catalogue slugs.  
5. **Apollo**, **ActiveCampaign**, **Shopify**, **Zendesk**.  
6. **Hunter, Snov, Instantly, Lemlist** — SI cluster.  
7. **Beehiiv, MailerLite, Webflow, Printful/Printify**.  
8. Skip Salesforce / Microsoft / Oracle / SAP / Workday / ServiceNow / Datadog until a real referral contract exists.

---

## Appendix

| Source | Path |
| --- | --- |
| Gap extract | published software × `getProductAffiliateStatus` === `NONE` |
| Existing tracking URLs | `src/data/affiliates/source/partner-links.ts` |
| Live programmes | `src/data/affiliates/programmes.json` (28 active + Motion pending) |
| Import | `npm run affiliate:import -- src/data/affiliates/source/partner-links.import.csv` |
| Editorial rule | `docs/softwareglimpse/affiliate-management.md` |

Public programme pages checked 19 Aug 2026 include HubSpot, Zoho, Apollo, Freshworks/PartnerStack, ActiveCampaign, Shopify, Zendesk, Webflow, Beehiiv, MailerLite, Hunter, Snov, Instantly, ClickUp, Printful, Printify, Fastmail PartnerStack, Lemlist. Rows marked **Check** or **None found** were not given a fabricated apply URL.
