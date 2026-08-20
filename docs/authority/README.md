# Authority, Backlink & Promotion Intelligence

Reusable **DISCOVER → VERIFY → QUALIFY → RECOMMEND → DRAFT ANGLES** framework for SoftwareGlimpse.

It answers where SoftwareGlimpse can realistically earn visibility and links — without acquiring links, contacting anyone, paying for placements, or modifying production content.

## What this system does

1. Understand existing SoftwareGlimpse content and tools (linkable inventory)
2. Identify pages/assets worth promoting
3. Search hypotheses / query packs for live-web backlink & promotion opportunities
4. Distinguish earned, contributed, partnership, directory, and paid opportunities
5. Score **SEO value separately** from referral / brand / relationship value
6. Surface promotion channels beyond backlinks (newsletters, podcasts, communities, partners)
7. Write prioritized local Markdown reports
8. Re-check opportunities periodically (`RECHECK` mode + snapshot diffs)

## What it never does

- Send email or perform outreach
- Submit directory/newsletter forms
- Buy placements or create accounts
- Post comments or publish guest posts
- Mutate production content, rankings, or affiliate configuration
- Treat DA / DR / “Authority Score” as Google ranking metrics
- Recommend “pay for dofollow backlinks” or other link-spam schemes

## Architecture

```text
Existing intelligence (reuse — do not duplicate)
├── Site Intelligence          → AuthorityLimitations bridge / Ranking Opportunity constraint
├── SEOHealthOrchestrator      → technical readiness context
├── ContentIntelligence        → quality / gaps (what is worth promoting)
├── ContentAssetIntelligence   → media/asset enrichment
├── Content ecosystem map      → clusters / journey
├── Tools registry + resources → linkable magnets
        ↓
AuthorityVisibilityIntelligenceOrchestrator
├── Consumes: Site / Ranking / Competitor / Content / Asset intelligence
├── EarnedBacklinkOpportunityAgent
├── PaidPromotionOpportunityAgent
├── DigitalPROpportunityAgent
├── PresenceOpportunityAgent
├── PartnershipOpportunityAgent
├── ContentPromotionOpportunityAgent
└── (optional seed) AuthorityIntelligenceOrchestrator via authority:seed
        ↓
AUTHORITY-VISIBILITY-LATEST.md + specialized *-LATEST.md + tracking/
        ↓
AuthorityLimitations pack → Site Intelligence (optional consume)
```

Implementation: `src/services/authority-intelligence/`  
Schemas: `src/domain/schemas/authority-intelligence.ts`  
Methodology: [`01-authority-methodology.md`](./01-authority-methodology.md)  
System: [`AUTHORITY-VISIBILITY-SYSTEM.md`](./AUTHORITY-VISIBILITY-SYSTEM.md)

## Commands

```bash
# Master recurring report
npm run authority:intelligence
npm run authority:audit
npm run authority:intelligence -- --mode FAST
npm run authority:intelligence -- --mode FULL
npm run authority:intelligence -- --mode RECHECK
npm run authority:intelligence -- --json
npm run authority:intelligence -- --no-write

# Specialized agents
npm run authority:links          # earned backlinks
npm run authority:paid
npm run authority:pr
npm run authority:partners
npm run authority:promotion
npm run authority:presence       # directories / listings
npm run authority:seed           # foundational seed catalog orchestrator

npx vitest run src/services/authority-intelligence/visibility/visibility.test.ts
```

### Modes

| Mode | Intent |
| --- | --- |
| **FAST** | Fewer outreach angles; local/dev |
| **FULL** | Full seed catalog + reports + archive |
| **RECHECK** | Same pipeline with snapshot diff emphasis + archive |

## Report locations

| Report | Path |
| --- | --- |
| Master | `docs/authority/reports/AUTHORITY-INTELLIGENCE-LATEST.md` (seed) |
| **Authority visibility (master)** | `docs/authority/AUTHORITY-VISIBILITY-LATEST.md` |
| Authority visibility system | `docs/authority/AUTHORITY-VISIBILITY-SYSTEM.md` |
| Visibility archive | `docs/authority/archive/YYYY-MM-DD-authority-visibility.md` |
| Tracking / acquisitions | `docs/authority/tracking/` |
| **Earned backlinks (live)** | `docs/authority/EARNED-BACKLINK-OPPORTUNITIES-LATEST.md` |
| Earned rejects | `docs/authority/earned-backlink-rejects-latest.md` |
| Earned per-domain | `docs/authority/earned/[domain].md` |
| **Paid promotion (live)** | `docs/authority/PAID-PROMOTION-OPPORTUNITIES-LATEST.md` |
| Paid promotion archive | `docs/authority/archive/YYYY-MM-DD-paid-promotion-opportunities.md` |
| **Digital PR (live)** | `docs/authority/DIGITAL-PR-OPPORTUNITIES-LATEST.md` |
| Digital PR archive | `docs/authority/archive/YYYY-MM-DD-digital-pr-opportunities.md` |
| **Partnerships (live)** | `docs/authority/PARTNERSHIP-OPPORTUNITIES-LATEST.md` |
| Partnership archive | `docs/authority/archive/YYYY-MM-DD-partnership-opportunities.md` |
| **Content promotion (plans)** | `docs/authority/PROMOTION-OPPORTUNITIES-LATEST.md` |
| Promotion archive | `docs/authority/archive/YYYY-MM-DD-promotion-opportunities.md` |
| Linkable assets | `docs/authority/reports/linkable-assets-latest.md` |
| All opportunities | `docs/authority/reports/opportunities-latest.md` |
| Free-first | `docs/authority/reports/free-first-latest.md` |
| Paid exposure | `docs/authority/reports/paid-exposure-latest.md` |
| Avoid / spam | `docs/authority/reports/avoid-latest.md` |
| Outreach angles | `docs/authority/reports/outreach-angles-latest.md` |
| Content gaps for links | `docs/authority/reports/content-gaps-for-links-latest.md` |
| Snapshot | `docs/authority/archive/opportunities-latest.json` |
| Dated archives | `docs/authority/archive/YYYY-MM-DD-authority-intelligence.md` |

## Opportunity score bands

| Band | Meaning |
| --- | --- |
| **EXCELLENT** | High relevance + legitimacy + fit; pursue soon |
| **STRONG** | Clear free or high-quality opportunity |
| **GOOD** | Worth a human look |
| **LOW** | Weak fit / hard / low likelihood |
| **AVOID** | Link-spam risk or policy reject |

Optional 0–100 normalized score is contextual — not fake ranking precision.

## Acquisition vs link treatment

| acquisitionType | Meaning |
| --- | --- |
| EARNED | Editorial / citation without payment |
| OWNED_PROFILE | Profile or listing we control |
| CONTRIBUTED | Guest expertise, podcast, contributed article |
| PARTNERSHIP | Vendor / integration / association relationship |
| PAID | Money changes hands |
| UGC | Forums / communities |
| UNKNOWN | Unclear |

| expectedLinkTreatment | Meaning |
| --- | --- |
| EDITORIAL | Natural citation |
| SPONSORED | Paid / disclosed |
| NOFOLLOW | Explicitly nofollow |
| UGC | User-generated |
| UNKNOWN | Unverified |

**Paid ≠ SEO link equity.** Paid opportunities may still score well for referral/brand when appropriately qualified.

## Google-compliance rule

Strategies whose primary value is manipulative link acquisition are marked:

**AVOID — LINK SPAM RISK**

Including: pay-for-dofollow packages, bulk guest-post networks, PBNs, automated link insertion, expired-domain schemes, mass syndication for anchors, purchased sitewide footer links, link exchanges at scale.

## Relationship to other systems

| System | Role |
| --- | --- |
| **Site Intelligence** | Consumes `AuthorityLimitations`; authority is **not** part of Overall Website Quality (H) |
| **SEO audit / SEO Intelligence** | On-site health & GSC opportunities — complementary |
| **Content Quality / Assets / Ecosystem** | What is worth promoting and what to create |
| **Affiliate `promotion:*`** | Commercial offer promotions — **not** this framework |

## Docs in this folder

| File | Purpose |
| --- | --- |
| [`README.md`](./README.md) | This overview |
| [`01-authority-methodology.md`](./01-authority-methodology.md) | Types, scoring, compliance, model, lifecycle, reporting |
| [`reports/`](./reports/) | Generated intelligence reports |
| [`archive/`](./archive/) | Snapshots + dated archives |

## Lifecycle (human in the loop)

```text
DISCOVER → VERIFY → QUALIFY → RECOMMEND → DRAFT ANGLES
  → HUMAN selects opportunity
  → HUMAN performs outreach / listing / sponsorship (outside this system)
  → RECHECK (diff NEW / IMPROVED / RESOLVED / AVOIDED)
```
