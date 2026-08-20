# Email marketing core research (GetResponse, AWeber, Campaign Monitor)

**Date:** 2026-08-17  
**Scope:** Existing affiliate inventory only (`aff-getresponse`, `aff-aweber`, `aff-campaign-monitor`). No affiliate economics. Prices = published vendor USD facts only.  
**JSON:** [`_em-research-core.json`](./_em-research-core.json)

## Snapshot

| Product | Free plan | Free trial | Pricing model | Paid floor (USD/mo, lowest published band) | Role |
|---------|-----------|------------|---------------|--------------------------------------------|------|
| **GetResponse** | Yes (≤500 contacts) | Yes (14-day premium on Free) | Contact tiers | Starter **$19** @ ~1k contacts | primary |
| **AWeber** | Yes (≤500 subs / 3k sends) | Yes (14-day on paid) | Contact tiers | Lite **$15** @ 500 subs | primary |
| **Campaign Monitor** (Marigold) | No | Yes (30-day) | Contact tiers | Lite **~$13** @ 0–500 | primary |
| Mailchimp *(context)* | Yes | No *(repo facts)* | Contact tiers | Verify live | context |
| ActiveCampaign *(context)* | No | Yes (14-day) | Contact tiers | ~$15 Starter *(repo facts)* | context |

## GetResponse

- **Positioning:** AI email + automation (+ SMS on Enterprise) for lifecycle / repeat revenue; all-in-one LPs, funnels, webinars/courses on higher plans.
- **Plans:** Free → Starter ($19) → Marketer ($59) → Creator ($69) → Enterprise (quote). Annual ~18% off. Unlimited sends on paid.
- **Features:** Campaigns, templates, automation, segmentation, LPs, analytics, AI generators, A/B, integrations, deliverability tools (DKIM, spam check, etc.).
- **Best for:** SMB/ecommerce/creators wanting a bundled stack; freemium entry.
- **Watchouts:** Starter automation/AI caps; Free limits after trial; Enterprise for SMS/dedicated IP.
- **Official YouTube overview:** Not verified on research date (blocker).

## AWeber

- **Positioning:** Simple email/automation for small businesses and creators.
- **Plans:** Free → Lite ($15) → Plus ($30) → Done For You (setup + Plus) → Unlimited ($899 docs) → 100k+ contact sales. Annual discounts on Lite/Plus.
- **Features:** Newsletters, automations, templates, LPs, segments (tiered), AI subject/forms, ecommerce, A/B, integrations.
- **Best for:** Creators/solopreneurs; forever-free start.
- **Watchouts:** Free branding + hard caps; Lite feature ceilings vs Plus; promo setup fees are not evergreen.
- **Official video:** [AI Sign-Up Form Builder (Shift AI Show)](https://www.youtube.com/watch?v=rdUpyHxG9PA) — product demo, not a classic overview reel.

## Campaign Monitor (Marigold)

- **Positioning:** Design-led “smarter email” for businesses and agencies; Marigold’s SMB/agency email product.
- **Plans:** Trial → Lite (~$13) → Essentials ($31) → Premier (~$171) @ 0–500 contacts → Enterprise (sales). ~10% annual discount. Lite send-capped; Essentials/Premier unlimited sends. Website builder +$10/mo on lower tiers.
- **Features:** Drag-drop builder, templates, automation/journeys, segmentation, AI writer/booster, analytics, A/B, deliverability/spam testing, integrations; agency tooling on higher plans.
- **Best for:** Design-first brands and agencies.
- **Watchouts:** No forever free; Lite send caps; Premier price jump; contact-band scaling.
- **Official video:** [Product Overview](https://www.youtube.com/watch?v=0hMDzGuc6WY) (`0hMDzGuc6WY`).

## Credibility context (repo)

- **Mailchimp** — freemium, widely known ESP/marketing suite; use `src/data/research/mailchimp/` (do not invent paid ladders).
- **ActiveCampaign** — automation + CRM hybrid; trial, no free plan; use `src/data/research/activecampaign/`.

## Blockers

1. **GetResponse official YouTube overview** — channel exists; no verified official overview embed confirmed (third-party tutorials excluded).
2. **Campaign Monitor price scrape** — page HTML mangled decimals; floors reconciled from annual 10% figures + on-page Essentials “$31/month” copy. Re-check slider live before publishing exact mid-band prices.
3. **AWeber Free** — confirmed on **docs.aweber.com**; marketing pricing hero focuses on Lite/Plus/Done For You + trials.

## Sources (primary)

- https://www.getresponse.com/pricing · https://www.getresponse.com/pricing/free  
- https://www.aweber.com/pricing.htm · https://docs.aweber.com/getting-started-with-aweber/aweber-information/how-much-does-aweber-cost  
- https://www.campaignmonitor.com/pricing/ · https://meetmarigold.com/
