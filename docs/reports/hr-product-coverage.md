# HR, Workforce & Training — Product Coverage Map

**Date:** 2026-08-18  
**Purpose:** Local planning doc — which HR / workforce products industry buyers expect, vs what SoftwareGlimpse already covers (live WordPress + Next.js catalogue), with **prioritized onboarding**.  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

Related:

- [`hr-priority3-onboarding-2026-08-18.md`](./hr-priority3-onboarding-2026-08-18.md) — Workday, Oracle Cloud HCM, UKG Pro, Dayforce, ADP Workforce Now, Paylocity, Paycor
- [`hr-priority2-onboarding-2026-08-18.md`](./hr-priority2-onboarding-2026-08-18.md) — Homebase, When I Work, Deputy, 7shifts, Lever, Ashby, HiBob, Personio
- [`hr-priority1-onboarding-2026-08-18.md`](./hr-priority1-onboarding-2026-08-18.md) — BambooHR, Rippling, Gusto, Greenhouse, Workable
- [`hr-wave1-onboarding-2026-08-17.md`](./hr-wave1-onboarding-2026-08-17.md) — Breezy HR, Connecteam, Jibble, Trainual (+ LearnWorlds secondary)
- [`hr-supporting-content-2026-08-17.md`](./hr-supporting-content-2026-08-17.md) — Best page, guides, hubs
- [`hr-visuals-assets-2026-08-17.md`](./hr-visuals-assets-2026-08-17.md)

**Onboarding bias (this refresh):** credibility first — onboard industry shortlist names even without affiliate deals (same pattern as BC / PM / SI priority waves). Freshteam was **skipped** (Freshworks sunset); Workable substituted as the fifth ATS peer. FlexiQuiz remains optional P4 adjacent.

---

## Category scope (expanded planning view)

Primary jobs buyers mean when they search “HR software” / “workforce management”:

| Job cluster | Buyer intent | Examples |
| --- | --- | --- |
| **hris-core** | Employee system of record, onboarding, PTO, org chart | BambooHR, HiBob, Personio, Namely |
| **payroll-benefits** | Run payroll / benefits admin (often bundled with HRIS) | Gusto, ADP, Paylocity, Paycor, Justworks (PEO) |
| **people-platform** | HR + IT + spend / modular “HR OS” | Rippling |
| **global-eor-payroll** | Hire abroad / EOR / global payroll | Deel, Remote |
| **ats-recruiting** | Applicant tracking / hiring workflows | Greenhouse, Lever, Ashby, Workable, Breezy HR, Freshteam |
| **frontline-wfm** | Shift scheduling, deskless ops, frontline comms | Connecteam, Homebase, When I Work, Deputy, 7shifts |
| **time-attendance** | Time clocks, geofence, timesheets | Jibble, Homebase (adjacent), UKG time |
| **performance-engagement** | Reviews, OKRs, continuous feedback | Lattice, 15Five, Culture Amp |
| **sop-training** | SOPs, playbooks, role training paths | Trainual |
| **lms-academy** | Employee / customer LMS | LearnWorlds (SG: marketing-primary), TalentLMS, Docebo, Cornerstone |
| **enterprise-hcm** | Full HCM for 1,000+ employees | Workday, Oracle HCM, UKG Pro, Dayforce |

Source of truth for current category seed: `src/data/category-onboarding/seed/hr.ts` (**v1.2.0**, enterprise HCM include added 2026-08-18).

### Seed vs this doc

v1.2 **includes** ATS, core HRIS, payroll/benefits, people platforms, **enterprise HCM**, frontline WFM, time & attendance, SOP training, LMS. Standalone PEO-only services stay excluded (`exc-peo-only`). Performance-engagement and global EOR remain planned clusters (Priority 4) — rank within cluster when onboarded.

Keep ranking **within** clusters — never force BambooHR vs Connecteam vs Lattice into one undifferentiated best list.

---

## What’s on SoftwareGlimpse today

### A) Live site — [softwareglimpse.com](https://www.softwareglimpse.com) (WordPress)

Checked **2026-08-18** (HTTP GET).

| Surface | Status |
| --- | --- |
| HR product reviews (`/*-review/`) | **None live** — Breezy, Connecteam, Jibble, Trainual, Freshteam, BambooHR, Gusto, Rippling, Greenhouse, Workday, etc. all **404** |
| Category hub `/categories/hr/` | **404** (path appears in Next.js migration inventory only) |
| Best page `/best/hr-software/` | **404** |
| Site search (breezy / connecteam / bamboo / workforce) | No dedicated HR hits — CRM / SEO noise |

**Bottom line:** WordPress has **zero** published HR / workforce product coverage today. All HR work so far lives in the Next.js catalogue / editorial seed.

### B) Next.js catalogue — HR primary (Wave-1 + Priority-1 + Priority-2 + Priority-3)

**Twenty-four** products with `primaryCategorySlug: "hr"`, plus **LearnWorlds** (`primaryCategorySlug: "marketing"`, `secondaryCategorySlugs: ["hr"]`).

#### Editor’s picks by job (no cross-cluster ranking)

| Job cluster | Product | Slug | Overall | Affiliate |
| --- | --- | --- | ---: | --- |
| people-platform | Rippling | `rippling` | **8.0** | No |
| ats-recruiting | Greenhouse | `greenhouse` | **8.0** | No |
| frontline-wfm | Connecteam | `connecteam` | **8.3** | Yes (`aff-connecteam`) |
| ats-recruiting (SMB free-tier path) | Breezy HR | `breezy-hr` | **7.9** | Yes (`aff-breezy-hr`) |
| hris-core | BambooHR | `bamboohr` | **7.8** | No |
| time-attendance | Jibble | `jibble` | **7.7** | Yes (`aff-jibble`) |
| sop-training | Trainual | `trainual` | **7.3** | Yes (`aff-trainual`) |
| ats-recruiting (published-floor peer) | Workable | `workable` | **7.2** | No |
| payroll-benefits | Gusto | `gusto` | **7.1** | No |

Connecteam remains the highest overall score but is **not** ranked against HRIS/ATS/payroll peers.

#### Landscape / secondary

| Product | Cluster | Overall | Notes |
| --- | --- | ---: | --- |
| Deputy | frontline-wfm | **8.2** | Multi-location WFM peer (Connecteam keeps award at 8.3) |
| 7shifts | frontline-wfm | **8.2** | **Hospitality landscape** — not a generic WFM #1 |
| Workday | enterprise-hcm | **8.2** | **Enterprise-HCM landscape award** — not an SMB HRIS peer |
| Homebase | frontline-wfm | **8.1** | SMB hourly per-location peer |
| UKG Pro | enterprise-hcm | **8.1** | WFM-heavy enterprise path (Connecteam keeps frontline-WFM award) |
| HiBob | hris-core | **8.0** | Mid-market HRIS peer (BambooHR keeps SMB published-PEPM award) |
| When I Work | frontline-wfm | **7.9** | Per-user scheduling peer |
| Oracle Cloud HCM | enterprise-hcm | **7.9** | Fusion ERP/EPM adjacency path |
| Ashby | ats-recruiting | **7.9** | Modern AI ATS landscape |
| Dayforce | enterprise-hcm | **7.8** | Continuous-calc payroll + time path |
| Personio | hris-core | **7.7** | EU GDPR-native HRIS peer (EUR Core floor; no USD invented) |
| Paylocity | payroll-benefits | **7.7** | Mid-market HR+payroll landscape (Gusto keeps published-SMB award) |
| Lever | ats-recruiting | **7.6** | ATS+CRM landscape (Employ) |
| ADP Workforce Now | payroll-benefits | **7.3** | Mid-market payroll compliance landscape |
| Paycor | payroll-benefits | **7.3** | Paychex-orbit HCM landscape (quote-only after 2025) |
| LearnWorlds | lms-academy | **7.1** | marketing-editorial — HR secondary/adjacent only; never ranked as ATS/WFM/HRIS peer |

Methodology: `hr-editorial` v1.0.0 · `handsOnTesting=false` · CQ **91** on Wave-1, Priority-1, Priority-2, and Priority-3 reviews.

### C) Affiliate inventory — HR-hinted (not yet software pages)

| Inventory | Status in catalogue | Suggested disposition |
| --- | --- | --- |
| **Freshteam** (`aff-freshteam`) | Classified SOFTWARE — **do not onboard** | **Skipped 2026-08-18** — Freshworks sunset (renewals stopped ~Mar 2026; site redirects to Freshservice). Workable substituted. |
| **FlexiQuiz** (`aff-flexiquiz`) | Classified — **not** onboarded | **Priority 4 / adjacent** — quiz & assessment builder; LMS/training adjacent, not a core HRIS/ATS peer |

Wave-1 four + LearnWorlds are already mapped / onboarded commercially where applicable. Priority-1 five are non-affiliate (credibility).

---

## Industry products that matter (by buyer job)

### Priority 1 — Must consider for a credible HR category

Closes the “buyers won’t trust this category” gap: core HRIS, modern people platforms, SMB payroll default, and a mainstream ATS peer set (so Breezy isn’t alone).

| Product | Why industry cares | On SG live? | In Next.js HR? | Suggested action |
| --- | --- | --- | --- | --- |
| **BambooHR** | Default SMB/mid **core HRIS** shortlist name | No | **Yes** (P1, 7.8) | Keep; core-HRIS award |
| **Rippling** | Modern **HR + IT + payroll** platform | No | **Yes** (P1, 8.0) | Keep; people-platform award |
| **Gusto** | Default US **SMB payroll + HR** starting point | No | **Yes** (P1, 7.1) | Keep; payroll-benefits award |
| **Greenhouse** | Category-standard dedicated **ATS** | No | **Yes** (P1, 8.0) | Keep; ATS cluster award |
| **Workable** | SMB ATS with published floors + trial (Freshteam substitute) | No | **Yes** (P1, 7.2) | Keep; ATS peer |

**Freshteam skipped** (sunset). Workable onboarded as the fifth P1 ATS peer.

### Priority 2 — Strongly recommended (fills white space)

Makes each Wave-1 cluster competitively believable and adds EU / mid-market HRIS.

| Product | Cluster | Why | Suggested action |
| --- | --- | --- | --- |
| **Homebase** | frontline-wfm / time | SMB scheduling + time peer to Connecteam | **Done** (8.1 WFM peer) |
| **When I Work** | frontline-wfm | Long-standing scheduling shortlist | **Done** (7.9 WFM peer) |
| **Deputy** | frontline-wfm | Mid-market / multi-location WFM | **Done** (8.2 WFM peer) |
| **7shifts** | frontline-wfm | Hospitality WFM specialist | **Done** — landscape / hospitality path |
| **Lever** | ats-recruiting | Mid-market ATS peer (Greenhouse cohort) | **Done** — landscape ATS |
| **Ashby** | ats-recruiting | Modern / startup ATS | **Done** — landscape ATS |
| **HiBob** | hris-core | Culture-forward mid-market HRIS | **Done** — HRIS peer (award stays BambooHR) |
| **Personio** | hris-core | EU mid-market HRIS default | **Done** — EU HRIS peer |

### Priority 3 — Enterprise HCM & payroll scale (landscape)

Buyers and analysts expect these names; score as **landscape / enterprise path**, not false SMB peers.

| Product | Cluster | Why | Suggested action |
| --- | --- | --- | --- |
| **Workday** | enterprise-hcm (+ TA suite) | Enterprise HCM default; Gartner HCM / TA leader | **Done** — landscape award (8.2) |
| **ADP Workforce Now** | payroll-benefits / HCM | Mid→enterprise payroll compliance depth | **Done** — landscape (7.3) |
| **UKG Pro** | enterprise-hcm / WFM | HCM + workforce management leader | **Done** — WFM-heavy path (8.1) |
| **Oracle Fusion Cloud HCM** | enterprise-hcm | Enterprise HCM leader | **Done** — landscape (7.9) |
| **Dayforce** (Ceridian) | enterprise-hcm / WFM | HCM + WFM continuous calc story | **Done** — landscape (7.8) |
| **Paylocity** | payroll-benefits / mid HCM | US mid-market payroll+HR shortlist | **Done** — landscape (7.7) |
| **Paycor** | payroll-benefits / mid HCM | Paychex-acquired HCM (2025) | **Done** — landscape (7.3) |

### Priority 4 — Performance, global employment, LMS depth, affiliate adjacent

| Product | Cluster | Why | Suggested action |
| --- | --- | --- | --- |
| **Lattice** | performance-engagement | Reviews / OKRs category default | Onboard performance cluster |
| **15Five** | performance-engagement | Continuous feedback / manager coaching | Landscape or peer |
| **Culture Amp** | performance-engagement | Engagement / people science | Landscape |
| **Deel** | global-eor-payroll | Global hiring / EOR shortlist | Landscape (not core HRIS peer) |
| **TalentLMS** / **Docebo** / **Cornerstone** | lms-academy | Employee LMS / enterprise learning | Landscape; LearnWorlds stays marketing-primary |
| **FlexiQuiz** | training-adjacent | Affiliate inventory; quiz builder | Optional landscape — do not rank vs Trainual as SOP peer |
| **Justworks** | payroll-benefits (PEO) | SMB PEO / benefits path | Mention in guides; product page only if PEO cluster expands |

### Usually adjacent (guides / decision paths; product page only if scope expands)

| Product / class | Note |
| --- | --- |
| Remote.com, Papaya Global | Global payroll / EOR peers to Deel |
| Namely | Mid-market all-in-one HRIS (US) — Priority 2 overflow |
| Process Street / SweetProcess | SOP peers to Trainual — optional later |
| Guru / Notion | Knowledge base — prefer PM / docs, not HR primary |
| Toggl Track / Clockify | Project time ≠ HR attendance — stay PM / productivity |
| LinkedIn Recruiter | Recruiting channel, not ATS system of record |

---

## Gap summary

```text
Industry expectation                 SoftwareGlimpse today
─────────────────────────────────    ────────────────────────────
Core HRIS (BambooHR)                 ✅ Next.js P1 (not WP)
People platform (Rippling)           ✅ Next.js P1 (not WP)
SMB payroll (Gusto)                  ✅ Next.js P1 (not WP)
Mainstream ATS (Greenhouse)          ✅ Next.js P1 (not WP) — ATS award
SMB ATS published floors (Workable)  ✅ Next.js P1 (not WP)
SMB ATS free tier (Breezy)           ✅ Next.js Wave-1 (not WP)
Enterprise HCM (Workday / UKG / …)   ✅ Next.js P3 landscape (not WP)
ATS inventory (Freshteam)            ⛔ skipped — sunset
EU / mid HRIS (Personio / HiBob)     ✅ Next.js P2 (not WP)
Frontline WFM peers (Homebase/…)     ✅ Next.js P2 (Connecteam award + peers)
Mid-market payroll (ADP / Paylocity / Paycor) ✅ Next.js P3 landscape (Gusto award)
Time & attendance peers              ⚠️ Jibble only
Performance (Lattice / 15Five)       ❌ missing (P4)
Global EOR (Deel)                    ❌ missing (P4)
SOP training                         ✅ Trainual (Next.js only)
LMS employee academy                 ⚠️ LearnWorlds secondary only
Live WP HR reviews / hubs            ❌ all 404
```

**Priority-1 credibility hole, Priority-2 white space, and Priority-3 enterprise/payroll landscape are closed in Next.js.** Remaining = P4 performance/global/LMS depth, then WP publish.

---

## Recommended inclusion batches (planning only)

Execute after seed/methodology expansion for new clusters. Catalogue CLI remains **existing-affiliate-only** for inventory batches; Priority waves for non-affiliate names use the same manual research → assessment → `soft()` pattern as SI/BC/PM.

### Batch A — Priority 1 credibility (HRIS + payroll + ATS peers) — **DONE 2026-08-18**

1. BambooHR ✅  
2. Rippling ✅  
3. Gusto ✅  
4. Greenhouse ✅  
5. Workable ✅ (Freshteam sunset — skipped)

**Best-page effect (within clusters):**

- `hris-core` award → BambooHR (7.8)  
- `people-platform` award → Rippling (8.0)  
- `payroll-benefits` award → Gusto (7.1)  
- `ats-recruiting` award → Greenhouse (8.0); Breezy HR free-tier path; Workable published-floor peer

### Batch B — Priority 2 white space (WFM peers + mid HRIS + ATS depth) — **DONE 2026-08-18**

6. Homebase ✅ (8.1 WFM peer)  
7. When I Work ✅ (7.9 WFM peer)  
8. Deputy ✅ (8.2 WFM peer)  
9. 7shifts ✅ (8.2 hospitality landscape)  
10. Lever ✅ (7.6) + Ashby ✅ (7.9) ATS landscape  
11. HiBob ✅ (8.0) + Personio ✅ (7.7) HRIS peers  

**Best-page effect (within clusters):**

- Frontline WFM award stays **Connecteam (8.3)**; Homebase / When I Work / Deputy are peers; 7shifts is hospitality-only landscape  
- ATS award stays **Greenhouse (8.0)**; Lever / Ashby landscape  
- Core HRIS award stays **BambooHR (7.8)**; HiBob mid-market path; Personio EU path

### Batch C — Priority 3 enterprise landscape — **DONE 2026-08-18**

12. Workday ✅ (8.2 enterprise-HCM landscape award)  
13. ADP Workforce Now ✅ (7.3 payroll landscape)  
14. UKG Pro ✅ (8.1 WFM-heavy enterprise path)  
15. Oracle Cloud HCM ✅ (7.9) + Dayforce ✅ (7.8)  
16. Paylocity ✅ (7.7) + Paycor ✅ (7.3) payroll landscape  

**Best-page effect (within clusters):**

- Enterprise HCM landscape award → **Workday (8.2)**; Oracle / UKG Pro / Dayforce peers  
- Payroll award stays **Gusto (7.1)**; ADP / Paylocity / Paycor are quote-only landscape  
- UKG Pro does **not** steal Connecteam’s frontline-WFM award  

### Batch D — Priority 4 performance / global / LMS / affiliate adjacent

17. Lattice (+ 15Five landscape)  
18. Culture Amp (landscape)  
19. Deel (global path)  
20. TalentLMS or Docebo (LMS landscape)  
21. FlexiQuiz (optional affiliate adjacent)

### Already in catalogue — publish / migrate when HR cluster goes live on WP

Breezy HR, Connecteam, Jibble, Trainual, BambooHR, Rippling, Gusto, Greenhouse, Workable, Homebase, When I Work, Deputy, 7shifts, Lever, Ashby, HiBob, Personio, Workday, Oracle Cloud HCM, UKG Pro, Dayforce, ADP Workforce Now, Paylocity, Paycor (+ LearnWorlds cross-link). Supporting guides/hubs already seeded in Next.js — see supporting-content + Priority-1 / Priority-2 / Priority-3 logs.

---

## Completed batches

| Batch | Status |
| --- | --- |
| Wave-1 affiliates (Breezy, Connecteam, Jibble, Trainual) + LearnWorlds secondary | ✅ 2026-08-17 |
| Supporting content (best, guides, hubs, category hub — Next.js) | ✅ 2026-08-17 |
| Priority 1 credibility (BambooHR, Rippling, Gusto, Greenhouse, Workable) | ✅ 2026-08-18 (Freshteam skipped) |
| Priority 2 white space (Homebase, When I Work, Deputy, 7shifts, Lever, Ashby, HiBob, Personio) | ✅ 2026-08-18 |
| Priority 3 enterprise / payroll landscape (Workday, Oracle HCM, UKG Pro, Dayforce, ADP WFN, Paylocity, Paycor) | ✅ 2026-08-18 |
| Priority 4 | ❌ not started |
| WP publish of HR hubs / reviews | ❌ not started (nothing to publish yet beyond Wave-1 drafts in Next.js) |

---

## Suggested execution order (practical)

1. ~~**Seed update**~~ ✅ v1.2.0 (enterprise HCM include)  
2. ~~**Priority 1**~~ ✅ BambooHR, Rippling, Gusto, Greenhouse, Workable  
3. ~~**Priority 2**~~ ✅ WFM peers + 7shifts hospitality landscape + Lever/Ashby ATS + HiBob/Personio HRIS  
4. ~~**Enterprise landscape pack**~~ ✅ Workday / Oracle / UKG / Dayforce + ADP / Paylocity / Paycor (no false SMB ranking)  
5. **Performance + global** — Lattice, Deel.  
6. **WP publish** — after Next.js Priority-3 depth so live site isn’t a thin affiliate shelf.

Commercial metrics (clicks/revenue in `affiliate-inventory.ts`) are **planning-only** — never feed editorial scores.

---

## Notes

- Rank **within** job clusters only.  
- LearnWorlds stays marketing-primary for course commerce.  
- PM `time-tracking` ≠ HR `time-attendance`.  
- No WordPress auto-publish.  
- `handsOnTesting=false` on Wave-1 through Priority-3 assessments; keep the same disclosure unless lab testing is scheduled.  
- Freshteam is sunset — do not onboard as a live ATS peer.  
- ATS comparisons shipped: Greenhouse vs Workable / Breezy, plus Greenhouse vs Lever / Ashby, Ashby vs Lever.  
- WFM comparisons shipped: Connecteam vs Homebase / Deputy, Homebase vs When I Work / 7shifts.  
- HRIS comparisons shipped: BambooHR vs HiBob, HiBob vs Personio.
- Enterprise HCM comparisons shipped: Workday vs Oracle / UKG / Dayforce, Dayforce vs UKG Pro.  
- Payroll-scale comparisons shipped: Gusto vs ADP WFN / Paylocity, ADP WFN vs Paylocity, Paycor vs Paylocity. 
