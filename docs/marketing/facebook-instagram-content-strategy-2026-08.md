# Facebook & Instagram content strategy

**Window:** 18 Aug 2026 → 18 Feb 2027 (six months)  
**Channels:** Facebook Page + Instagram (same Meta Business Suite)  
**Owner:** Lee Meyeridricks (founder-operated; no social team assumed)  
**Job of the channels:** Send qualified buyers to decision tools, then to reviews / comparisons / downloads — not to grow vanity followers.

Companion docs: [six-month calendar](./facebook-instagram-calendar-2026-08-to-2027-02.md) · [templates](./facebook-instagram-post-templates.md) · [week 1](./week-1-copy-paste.md) · [week 2](./week-2-copy-paste.md) · [week 3](./week-3-copy-paste.md) · [week 4](./week-4-copy-paste.md) · [week 5](./week-5-copy-paste.md) · [week 6](./week-6-copy-paste.md) · [week 7](./week-7-copy-paste.md) · [week 8](./week-8-copy-paste.md) · [week 9](./week-9-copy-paste.md) · [week 10](./week-10-copy-paste.md) · [week 11](./week-11-copy-paste.md) · [week 12](./week-12-copy-paste.md)

---

## 1. What this strategy is for

SoftwareGlimpse is a **software decision platform**. The public question is always:

> Which software should I choose?

Social is a distribution layer on top of pages that already exist (or will exist) in the Next.js rebuild: finders, calculators, planners, product reviews (`/software/{slug}/`), comparisons, best-of, guides, and CRM downloadable resources.

It is **not** a second editorial surface. If a claim is not allowed on the site (invented prices, unaudited “we tested”, commission-shaped rankings), it is not allowed in a Reel.

### Launch gate (do not skip)

The 18 Aug 2026 site-wide audit marked publication readiness **NOT_PUBLISHABLE** because legal identity fields are empty. Social can still run as “rebuilding in public,” but:

| Allowed now | Wait until legal identity + disclosures are real |
| --- | --- |
| Founder/rebuild story | “SoftwareGlimpse is fully live / launch day” as a paid campaign |
| Tool walkthroughs of **available** routes | Promising a specific public launch date you have not set |
| Education posts that link to indexable pages | Paid ads, boosted posts, lead ads — see [calendar spend](./facebook-instagram-calendar-2026-08-to-2027-02.md) |
| Soft “new site is coming onto softwareglimpse.com” | Collecting emails if newsletter provider is still unconfigured |

Treat **relaunch week** in the calendar as a switch you flip when the legal/foundation config is complete — not as a date you must hit.

---

## 2. Positioning on Meta

**One-line bio (both profiles):**  
SoftwareGlimpse — which software should I choose? Fit-based finders, cost tools, and reviews. Affiliate links never rank the list.

**About / longer FB description:**  
SoftwareGlimpse helps founders, sales leaders, and operators shortlist business software under real constraints: budget, team size, integrations, and the job the tool has to do. We publish structured product pages, comparisons, guides, and free decision tools. Commercial relationships can change a button label; they do not change scores or Finder order.

**Profile setup (once):** field-by-field + images — [Facebook](./facebook-page-setup.md) · [Instagram](./instagram-profile-setup.md)

- Handle: keep identical on FB + IG if possible (`softwareglimpse`). Confirm the live handles and paste them into site foundation `socialProfiles` when ready.
- Link in bio: start with `https://www.softwareglimpse.com/tools/` (the moat). After relaunch week, rotate monthly via Linktree-or-equivalent **only if** you need more than one destination; otherwise keep a single tools hub link and put specific URLs in Facebook captions (FB still passes link juice in-feed).
- Highlights (IG): Tools · CRM · Sales intel · My Story · Resources — covers in `docs/marketing/assets/instagram-profile/`
- Cover / grid: navy `#0f172a`, primary blue `#2563eb`, white type. No stock “handshake in an office.” Screens of real tools and simple type-on-color carousels beat lifestyle photography for this brand.
- CTA button: FB = “Learn more” → `/tools/`; IG = website in bio (no extra action button).
- Disclosure in bio: “Affiliate links never rank the list.”

---

## 3. Who we talk to

Primary: **people mid-buy** (shortlist, demo week, replacing a tool), not software-Twitter pundits.

| Persona | What they need from a post | Best destination |
| --- | --- | --- |
| Founder / operator (5–50 people) | “Don’t pick the logo. Pick the fit.” | CRM Finder, Software Finder, cost calculator |
| Sales / RevOps lead | Coverage, credits, CRM writeback, TCO | SI Finder, SI scorecard, SI cost calculator (label as partial) |
| Marketer choosing ESP / automation | Deliverability vs all-in-one | Email marketing finder, how-to-choose guides |
| Ops / people lead (Jan–Feb) | HRIS vs payroll vs ATS as different jobs | HR Finder, best/HR page once you are happy to promote it |

Tone matches the editorial style guide: **direct, practical, buyer-first**. Decisive when evidence supports it; explicit when it depends. No “game changer,” no manufactured certainty, no “we tested X” unless `handsOnTesting` is documented for that product.

---

## 4. What we actually have to promote

Use this as the **source of truth for destinations**. Do not invent new tools in captions.

### 4.1 Interactive tools (the differentiator)

**CRM (available — lead with these for months 1–2)**

| Tool | Path |
| --- | --- |
| CRM Finder | `/tools/crm-finder/` |
| CRM Cost Calculator | `/tools/crm-cost-calculator/` |
| CRM TCO Calculator | `/tools/crm-tco-calculator/` |
| CRM ROI Calculator | `/tools/crm-roi-calculator/` |
| CRM Plan Selector | `/tools/crm-plan-selector/` |
| CRM Vendor Scorecard | `/tools/crm-vendor-scorecard/` |
| CRM Requirements Builder | `/tools/crm-requirements-builder/` |
| CRM RFP / Vendor Brief | `/tools/crm-rfp-builder/` |
| CRM Demo Checklist | `/tools/crm-demo-checklist-builder/` |
| CRM Readiness Assessment | `/tools/crm-readiness-assessment/` |
| CRM Implementation Planner | `/tools/crm-implementation-planner/` |
| CRM Migration Planner | `/tools/crm-migration-planner/` |
| CRM Migration Cost Calculator | `/tools/crm-migration-cost-calculator/` |

**Sales intelligence (available unless noted)**

Finder, vendor scorecard, demo checklist, RFP builder, readiness assessment, requirements builder.  
**Partial (say so in copy):** SI Cost Calculator, SI Plan Selector.

**Cross-category**

- Software Finder `/tools/software-finder/` — available (router into category finders)
- Software Stack Builder `/tools/software-stack-builder/` — **partial** (category routing live; cross-stack scoring limited)
- Software Cost Calculator — **partial** (category calculators live)

**Other category finders (available, promote from month 3+):** Marketing, Email Marketing, Business Communications, Customer Service, Project Management, HR, Ecommerce, AI, IT & Development — plus matching cost / plan / requirements / scorecard / RFP / demo / readiness tools per category.

### 4.2 Editorial pages (promote only if you would stand behind the live URL)

- Reviews: `/software/{slug}/` (canonical — never say `/reviews/`)
- Comparisons: `/compare/{a}-vs-{b}/`
- Best-of: `/best/crm-software/`, `/best/sales-intelligence-software/`, plus email marketing, marketing, BC, PM, HR, ecommerce, AI, IT, customer service
- Guides: `/guides/{slug}/` — prefer CORE “how to choose / requirements / evaluation / pricing” over thin product-pack pages
- Resources (CRM downloads): `/resources/` — evaluation checklist, RFP template, demo checklist, implementation / migration / go-live, business case, comparison worksheet, etc.
- Trust: `/company/about/`, `/company/my-story/`, `/company/how-we-review-software/`, `/company/editorial-methodology/`, `/legal/affiliate-disclosure/`

**CRM is the only category the audit called MATURE.** Other categories are TOOL_READY: promote **tools + named “how we think about this job”** first; promote “best of” and dense comparison meshes only after you have personally opened the URL and are willing to send a stranger there.

### 4.3 Flagship named products (for review / comparison posts)

Use products that exist in the catalogue. Prefer pairs buyers already search.

| Category | Safe named posts (examples) |
| --- | --- |
| CRM | Pipedrive, HubSpot, Salesforce, Freshsales, Close, Keap, Capsule |
| Sales intelligence | Apollo, ZoomInfo, Clay, Cognism, Lusha, LinkedIn Sales Navigator |
| Email marketing | (use the live best-page shortlist before naming a “winner”) |
| PM | monday.com, Asana, ClickUp, Notion, Jira — **rank within job cluster**, never “best PM tool on earth” |
| HR | Rippling, BambooHR, Greenhouse, Gusto, Connecteam — **different jobs**; never force one winner |

Every named-product post needs the affiliate line in §8.

---

## 5. Content pillars (mix for the six months)

Hold this mix on a rolling four-week average. Individual weeks can skew (relaunch week is 50% brand).

| Pillar | Share | Purpose | Default format |
| --- | --- | --- | --- |
| **A. Tools** | 30% | Unique reason to follow / click | Screen recording Reel + FB native video; carousel “3 inputs → 1 shortlist” |
| **B. Decision education** | 25% | Trust + save/share | Carousel frameworks, “it depends” posts, glossary |
| **C. Reviews & comparisons** | 20% | Capture high-intent demand | 8-slide “who it’s for / not for”; 2-product “pick this if” |
| **D. Guides & resources** | 15% | Lead magnet without a newsletter provider | Checklist carousel → PDF/Excel on `/resources/` |
| **E. Founder / methodology** | 10% | Why this rebuild exists | Talking-head Reel, FB long caption, Stories |

**What we will not do**

- Daily “top 10 CRMs” listicles with logos and no criteria
- Stitch/Duet drama, vendor-bashing, or fake controversy
- Giveaways, engagement-bait (“comment YES”), or “link in comments”
- Promoting unpublished, noindex, or thin comparison shells
- Ranking language that contradicts the site (“#1 overall” unless that page is approved and you quote the **fit** not a universal winner)

---

## 6. Facebook vs Instagram (same assets, different jobs)

| | Instagram | Facebook |
| --- | --- | --- |
| **Job** | Discovery + saveable education | Click-through + discussion |
| **Hero format** | Reels (9:16), carousels (4:5) | Feed link posts, native video, carousels |
| **Links** | Bio + Stories sticker (if eligible); otherwise “full URL in FB / site” | **Paste the URL in the caption** every time. That is the conversion path. |
| **Caption** | Hook in line 1, ≤150 words, 5–8 hashtags | 80–200 words, question at the end, **no hashtag soup** |
| **Stories** | 4–7 frames: tool demo, poll (“CRM or spreadsheet?”), screenshot of a finder result | Mirror the useful frames; skip the aesthetic filler |
| **Groups** | — | After month 2: answer software-buying questions in 2–3 relevant groups with value-first comments; do not spam the site. One helpful comment + profile as proof beats a link dump. |
| **DMs** | Treat as light support: send the relevant tool URL, not a sales pitch | Same |

**Cross-posting rule:** Publish from Meta Business Suite. Write the **Facebook caption first** (it has the URL). Shorten for IG and move the URL to the first comment on IG if you want a cleaner grid — but still keep the bio pointed at `/tools/`.

**Reels on both:** Upload as Reel on IG and as Reel/video on FB (not a FB “share of IG post” if you care about FB distribution). Burned-in captions always — a large share of views are silent.

---

## 7. Cadence (sustainable for one person)

**4 feed posts per week + 1 Reel among them + Stories 4 days/week.**

| Day | Slot | Format |
| --- | --- | --- |
| Tuesday | Feed | Carousel (education or comparison) |
| Wednesday | Stories | Tool clip / poll / “building in public” |
| Thursday | Feed | **Reel** (tool demo or founder) — also the week’s discovery bet |
| Friday | Stories | Resource or checklist teaser |
| Saturday | Feed | Named product or comparison |
| Sunday | Feed | Soft: methodology, resource download, or week recap + FB link |

Skip Monday. Batch on Sunday (see templates doc). If a week is on fire with product work, **cut Saturday and Sunday** — never cut Thursday’s Reel. Consistency of one weekly demo beats a dead grid.

**Stories volume:** 4–8 frames on the four Story days. Not a second full-time job.

**Do not start:** daily posting, IG Broadcast Channel, or paid until the **calendar gate** is open (legal identity live **and** four weeks of organic data, or one tool Reel with ≥20 FB link clicks). Spend amounts live on the [calendar](./facebook-instagram-calendar-2026-08-to-2027-02.md) — default **$0** until then, then about **$300–500/month** on tool Reels only.

---

## 8. Creative + claims rules

### Visual system

- Background: `#0f172a` or `#f8fafc`
- Accent: `#2563eb`
- Type: high-contrast sans, large enough to read on a phone at arm’s length
- Logo small, top-left or last slide; first slide is the hook, not the brand
- Real UI of finders/calculators whenever the post is about a tool
- Carousel length: 6–8 slides. Slide 1 hook, 2–6 teaching, last slide CTA + URL + disclosure

### On-screen text formula (Reels, first 1.5 seconds)

Bad: “Check out our new website!”  
Good: “Stop ranking CRMs. Rank the job.” / “Your CRM quote is not the cost.” / “Apollo vs ZoomInfo is the wrong first question.”

**Mute-proof Reel bar (do not ship below this):**
- Frame 1 is a **complete sentence** a stranger can disagree with. Not two words (“Job first.” / “Enrichment.”).
- Frames 2–6 teach a consequence or a next action. Not a label.
- **Not type-only posters.** Frame 1 = pattern-interrupt photo or tool UI + the hook sentence. Mid-frames alternate lifestyle / Harbor·Pulse·Northstar UI / type so the Reel does not feel like eight title cards.
- No stock ships, gym, ice cubes, or prompt leftovers (`BLUE:`, `GIANT`, “No scores, no prices” burned in).
- Tool UI only with fictional Harbor / Pulse / Northstar and **empty** cells — never 9.2, 92%, or invented dollar totals.
- Last frame is the CTA + URL. Affiliate/ranking lectures stay in the caption.
- **Export:** generated stills are 1024×1536 (2:3). Fit to 9:16 with **pad**, never center-crop — crop clips left-aligned hooks and CTA URLs.  
  `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0f172a`

### Claims (copy-paste from editorial policy)

- No live prices as facts. Say “list pricing changes — run the calculator.”
- No “best overall” without pointing at the methodology page and a fit condition.
- Prefer `depends`: “Pick Pipedrive if X. Pick HubSpot if Y.”
- Affiliate: **every named-product recommendation** ends with  
  `SoftwareGlimpse may earn a commission if you buy through our links. That does not change scores or Finder order.`  
  Tool-only posts that do not name a vendor can skip the commission sentence but should still say recommendations are fit-based.
- Do not imply hands-on lab testing.

### Hashtags (IG only)

Rotate a short set. Never more than eight.

`#crmsoftware` `#salessoftware` `#b2bsales` `#revops` `#softwarebuying` `#saas` `#founders` `#hubspot` `#pipedrive` (only when the post is actually about that product)

Facebook: zero hashtags, or one if it is a real FB topic.

---

## 9. Six-month narrative

The calendar is the week-by-week version. This is the arc.

| Month | Theme | Why | Primary destinations |
| --- | --- | --- | --- |
| **0 — late Aug** | Profile + rebuilding in public | Legal gate; audience is empty; teach the category | About, My Story, Tools hub |
| **1 — Sep** | **Relaunch + CRM tools** | CRM is MATURE; tools are the proof the rebuild is real | CRM Finder, Cost / TCO / ROI, Software Finder |
| **2 — Oct** | CRM depth: reviews, comparisons, resources | Convert curiosity into shortlists and PDFs | `/software/pipedrive/`, comparisons, `/resources/` |
| **3 — Nov** | Sales intelligence + outbound buying | Second-strongest tool set; Q4 outbound budgets | SI Finder, scorecard, demo checklist, RFP |
| **4 — Dec** | Cost honesty + email/marketing | People buy badly in December; TCO/ROI content is the counter | TCO, migration cost, email-marketing finder, “don’t rip-and-replace on a deadline” |
| **5 — Jan** | New-year stack + HR / PM | Classic buying season for people ops and work OS | HR Finder, PM Finder, Stack Builder (as partial), best-of only if URLs hold up |
| **6 — Feb** | Wider catalogue + compounding | CS, comms, ecommerce/IT lightly; double down on what worked in Sep–Jan | Winning tools from analytics; 1–2 new category finders |

**Campaigns inside the arc (not extra volume — they replace a week’s posts):**

1. **Relaunch week** (calendar Week 4 or whenever legal is done): 7-day sequence — story, tools, methodology, Finder, one comparison, resource, “what’s next.”
2. **Demo week kit** (November): SI + CRM demo checklist + scorecard as a mini-series.
3. **January reset:** “Build the stack, don’t collect logos” + Stack Builder + Software Finder.

---

## 10. Production system

Sunday 90-minute batch (templates doc has the checklist):

1. Read the calendar row for the coming week.
2. Open the destination URL. If it is thin, swap to a tool or a CORE guide. **Never post a broken promise.**
3. Write four Facebook captions with UTMs.
4. Cut IG captions from those.
5. Record one 25–40s Loom-style Reel of a real tool (phone vertical, or desktop + crop).
6. Build two carousels (Canva or Figma). Reuse the same 6-slide master.
7. Schedule in Meta Business Suite: Tue / Thu / Sat / Sun.
8. Pre-write Wednesday + Friday Story frames as notes.

**UTM standard** (append to every Facebook URL):

```text
?utm_source=facebook&utm_medium=social&utm_campaign=sg_meta_2026h2&utm_content={pillar}_{slug}
```

Instagram clicks from bio cannot be post-level unless you use a tracked short link. For IG Reels, put the same `utm_source=instagram` link in the first comment when you remember; otherwise rely on FB for measurable traffic.

**utm_content examples:** `tool_crm-finder`, `review_pipedrive`, `compare_freshsales-vs-pipedrive`, `resource_crm-rfp-template`, `founder_my-story`

---

## 11. What success looks like (six months)

This is a new/relaunch audience. Optimize for **site actions**, not follower count.

| Metric | Where | Month 2 target | Month 6 target | Notes |
| --- | --- | --- | --- | --- |
| FB + IG combined followers | Native | 300 | 1,000 | Vanity; do not steer content by this |
| Link clicks (FB) | Meta Suite | 80 / month | 400 / month | Leading indicator |
| Tool starts from social | Analytics (when GA is live) | Track | Track | Event: tool start / finder complete |
| Saves + shares (IG carousels) | IG insights | Rising | Rising | Education is working |
| DMs asking “which CRM?” | Native | A few | Weekly | Reply with Finder, not a hot take |
| Negative: “this ranking is paid” complaints | Native | Zero unaddressed | Zero | Point at methodology + disclosure |

**Kill / keep monthly (last Sunday):**

- Kill any pillar that gets reach but zero clicks (usually vague inspiration).
- Keep and clone any Reel that starts a tool session.
- If comparison posts outperform tools, you still **lead with tools in the CTA** — comparisons are the hook, Finder is the close.

**Paid:** amounts, which posts, and how to boost are on the [calendar](./facebook-instagram-calendar-2026-08-to-2027-02.md) (Promote + Spend columns). Summary: **$0** until legal identity is live; then cap **$300/month** (Sep–Oct), **$400** (Nov, Jan), **$300** (Dec, no Christmas week), **$500** (Feb clones). Boost **tool Reels** (Finder, TCO, scorecard, demo checklist) to Traffic → landing page. Never boost “we launched,” named-product trophies, or methodology posts. Kill a test after ~$40 if CTR &lt; 0.6% or ≥$2.50 per landing-page view.

---

## 12. Risks specific to this site

| Risk | Mitigation |
| --- | --- |
| Catalogue is wide; social gets generic | 70% of posts in months 1–3 stay in CRM + SI |
| Thin pages in non-CRM categories | Promote finders first; spot-check every URL |
| Affiliate optics | Bio + named-product footer; never “#1 because we partner” |
| Founder time | 4 posts/week hard cap; batch Sunday |
| Legal identity empty | No paid, no “fully launched” until foundation config is complete |
| Newsletter provider unconfigured | Use `/resources/` PDFs as the capture; do not promise a weekly email |

---

## Related internal docs

- [`docs/softwareglimpse/product-vision.md`](../softwareglimpse/product-vision.md)
- [`docs/softwareglimpse/editorial-style-guide.md`](../softwareglimpse/editorial-style-guide.md)
- [`docs/softwareglimpse/affiliate-model.md`](../softwareglimpse/affiliate-model.md)
- [`docs/reports/site-wide-editorial-audit-2026-08-18.md`](../reports/site-wide-editorial-audit-2026-08-18.md)
- Tools registry: `src/data/config/tools/registry.ts`
- Resources seed: `src/data/seed/resources.ts`
