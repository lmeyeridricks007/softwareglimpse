# Email & Marketing — Adjacent / Marketing Catalogue Research

**Researched:** 2026-08-17  
**Scope:** Existing-only affiliate inventory  
**Sources:** Official vendor sites (WebFetch / WebSearch)  
**Pricing rule:** Published official prices only — no invented figures  

**Output JSON:** [`docs/reports/_em-research-adjacent-marketing.json`](_em-research-adjacent-marketing.json)

---

## Classification summary

| # | Product | membershipRole | recommendedPrimaryCategorySlug | One-line note |
|---|---------|----------------|--------------------------------|---------------|
| 1 | Bouncer | `adjacent` | `email-marketing` | Email verification / list hygiene — not an ESP |
| 2 | InboxAlly | `adjacent` | `email-marketing` | Deliverability / reputation repair — complements ESP |
| 3 | SaneBox | `adjacent` | `business-communications` | Inbox productivity — not email marketing |
| 4 | Kartra | `primary` | `marketing` | All-in-one marketing; email is built-in secondary capability |
| 5 | SocialBee | `primary` | `marketing` | Social scheduling / management |
| 6 | Brand24 | `primary` | `marketing` | Social listening / brand monitoring |
| 7 | Freshmarketer | `primary` | `marketing` | Marketing automation (Freshworks); update broken inventory URL |
| 8 | Fastmail | `wrong-category` | `business-communications` | Email **hosting/client** — NOT email marketing |
| 9 | NiceJob | `wrong-category` | `customer-service` | Reviews / reputation for local businesses |
| 10 | Zypper | `exclude-review` | `unknown` | Personal finance PFM — out of EM scope |

---

## Per-product briefs

### 1. Bouncer — adjacent · email-marketing

| Field | Value |
|-------|--------|
| Website / pricing | https://www.usebouncer.com · https://www.usebouncer.com/pricing/ |
| Pricing model | Pay-as-you-go credits (never expire) + optional Deliverability Kit / Shield subscriptions |
| Free | 100 free credits to start; no free “plan” |
| Trial | Free credits / no CC to start |
| Verified prices | Verification packs from **$8 / 1,000** up to **$2,000 / 1M**; Deliverability Kit **$25 / $125 / $250**/mo + Enterprise custom; Shield volume tiers from **~$2**/mo |

**Positioning:** Secure email verification (app + API), Shield form protection, toxicity checks, deliverability kit.

**Competitors (reasonable slugs):** neverbounce, zerobounce, hunter, clearout, debounce

---

### 2. InboxAlly — adjacent · email-marketing

| Field | Value |
|-------|--------|
| Website / pricing | https://inboxally.com · https://www.inboxally.com/pricing |
| Pricing model | Monthly subscription by seed volume + sender profiles |
| Free plan | No (free toolkit/tester) |
| Trial | **10 days**, no credit card |
| Verified prices | **Starter $149** · **Plus $645** · **Premium $1,190**/mo · Enterprise custom |

**Positioning:** Repair-grade deliverability via seed engagement, Autowarmup, IA Score — works with any ESP.

**Competitors:** mailreach, warmup-inbox, lemwarm, instantly, gmass

---

### 3. SaneBox — adjacent · business-communications

| Field | Value |
|-------|--------|
| Website / pricing | https://www.sanebox.com · https://www.sanebox.com/pricing |
| Pricing model | Snack / Lunch / Dinner subscription (monthly, yearly, bi-yearly) |
| Free plan | No |
| Trial | Homepage: **14 days**; one help article also mentions **7 days** — verify at signup |
| Verified prices | Help center: plans **start at $7/month**. Per-tier dollars not crawlable (JS pricing page) — **do not invent** |

**Positioning:** AI inbox management for any email client — filtering, BlackHole, digest, reminders, snooze.

**Do not** onboard as a peer to Mailchimp-class ESPs. Inventory `categoryHint: email-marketing` should be corrected toward `business-communications`.

---

### 4. Kartra — primary · marketing

| Field | Value |
|-------|--------|
| Website / pricing | https://home.kartra.com · https://home.kartra.com/pricing |
| Pricing model | Monthly or yearly subscription |
| Free plan | No |
| Trial | Free trial CTA + **30-day money-back** |
| Verified prices | **Essentials $59/$52** · **Starter $119/$99** · **Growth $229/$189** · **Professional $549/$429** (mo / effective annual mo) |

**Positioning:** All-in-one for coaches/creators — pages, email/SMS, courses, checkouts, funnels, AI.

**Optional secondary:** `email-marketing` (built-in ESP features).

**Competitors:** clickfunnels, kajabi, systeme-io, gohighlevel, hubspot, activecampaign

---

### 5. SocialBee — primary · marketing

| Field | Value |
|-------|--------|
| Website / pricing | https://socialbee.com · https://socialbee.com/pricing/ |
| Company | SocialBee LABS SRL (WebPros) |
| Pricing model | Monthly / yearly; Standard + Agency tiers |
| Free plan | No |
| Trial | **14 days** Pro access, no CC; 30-day money-back |
| Verified prices | Bootstrap **$29/$24** · Accelerate **$49/$40** · Pro **$99/$82** · Agency Pro50/100/150 **$179–$449** mo (lower when annual) |

**Positioning:** AI social scheduling, recycling, analytics, agency workspaces.

**Competitors:** buffer, hootsuite, later, sprout-social, agorapulse

---

### 6. Brand24 — primary · marketing

| Field | Value |
|-------|--------|
| Website / pricing | https://brand24.com · https://brand24.com/prices/ |
| Pricing model | Keywords + mentions capacity; monthly or annual |
| Free plan | No |
| Trial | **14 days**, no CC |
| Verified prices (doc dated 2026-06-10) | Individual **$249/$199** · Team **$349/$299** · Pro **$499/$399** · Business **$699/$599** · Enterprise **from $1,499**/mo annual |

**Positioning:** AI social listening across 25M+ sources.

**Competitors:** mention, meltwater, brandwatch, talkwalker, sprout-social

---

### 7. Freshmarketer — primary · marketing

| Field | Value |
|-------|--------|
| Current product URL | https://www.freshworks.com/crm/marketing/ |
| Pricing | https://www.freshworks.com/crm/marketing/pricing/ |
| Inventory URL | https://www.freshworks.com/freshmarketer/ → **404 on 2026-08-17** — update |
| Pricing model | Marketing contacts; Free + Enterprise on public page |
| Free plan | Yes — **$0**, 100 contacts, 500 monthly email sends |
| Trial | **21 days**, no CC |
| Verified prices | Enterprise **$15/mo** with 500 contacts (billed annually label); add-ons e.g. contacts from **$100/5k/mo**, CRO from **$219**, dedicated IP **$199**, Freddy AI Agent **$49/100 sessions**, Messaging Agent **$79/agent/mo** |

**Note:** Older third-party “Growth/Pro” tables not confirmed on live official pricing page — omitted.

**Competitors:** hubspot, activecampaign, mailchimp, klaviyo, brevo

---

### 8. Fastmail — wrong-category · business-communications

| Field | Value |
|-------|--------|
| Website / pricing | https://www.fastmail.com · https://www.fastmail.com/pricing/ |
| Pricing model | Per-user / family subscription |
| Free plan | No |
| Trial | **Up to 30 days**, no CC |
| Verified prices | Individual **$6/$5** · Duo **$10/$8** · Family **$14/$11** · Business Basic **$4/$3** · Standard **$6/$5** per user/mo (month vs yearly) |

**Exclude** from Email & Marketing ESP gap onboarding.

---

### 9. NiceJob — wrong-category · customer-service

| Field | Value |
|-------|--------|
| Website / pricing | https://get.nicejob.com · https://get.nicejob.com/pricing |
| Pricing model | Monthly USD subscription (+ optional Sites) |
| Free plan | No |
| Trial | **14 days**, no CC up front |
| Verified prices | Reviews **$75**/mo · Pro **$125**/mo · Sites **$99**/mo + **$199** setup · Grow+Sites bundle **$174**/mo + setup |

**Reputation marketing for local businesses** — not email marketing. Inventory `customer-service` hint is appropriate.

---

### 10. Zypper — exclude-review · unknown

| Field | Value |
|-------|--------|
| Website / pricing | https://zypper.com · https://zypper.com/pricing |
| Product type | **Personal financial management** (banks, budgeting, net worth, AI assistant) |
| Free / trial | Neither stated on pricing page |
| Verified prices | Essentials Individual **$12.99**/mo or **$7.92**/mo annual · Couple **$14.99**/mo or **$8.33**/mo annual |

**Scope resolved:** Not marketing, not email. Inventory `terms-review` → recommend **exclude** from EM catalogue onboarding (do not create a fake marketing `/software/` page).

---

## Onboarding recommendations (Email & Marketing gap)

| Action | Products |
|--------|----------|
| Onboard as **email-marketing adjacent** | Bouncer, InboxAlly |
| Re-home / do **not** treat as ESP | SaneBox → `business-communications` |
| Onboard as **marketing primary** | Kartra, SocialBee, Brand24, Freshmarketer |
| Skip EM batch (`wrong-category`) | Fastmail, NiceJob |
| Exclude / terms close (`exclude-review`) | Zypper |

---

## Catalogue hygiene flags

1. **Freshmarketer** inventory website 404 → use `https://www.freshworks.com/crm/marketing/`.
2. **SaneBox** inventory `categoryHint: email-marketing` is misleading → prefer `business-communications`.
3. **Kartra composite** programme (`Kartra, WebinarJam & EverWebinar`) remains separate inventory review — not expanded here.
4. Promo codes (SocialBee `SBDAY2026`, InboxAlly `BFCM2025`) are time-sensitive — re-verify before editorial/affiliate offers.
