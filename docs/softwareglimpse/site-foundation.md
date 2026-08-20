# Site foundation

SoftwareGlimpse public trust, legal, privacy, contact, newsletter, and UX foundation.

## Pages & routes

### Company (indexable)

| Path | Purpose |
|------|---------|
| `/company/about/` | What the site is, monetization, independence, founder link |
| `/company/my-story/` | Founder entity — **no fabricated biography** |
| `/company/editorial-methodology/` | Global methodology + live category methodologies |
| `/company/how-we-review-software/` | Reader-friendly review process |
| `/company/contact/` | Contact + corrections + privacy reasons |

### Legal (mostly indexable, low SEO priority)

| Path | Source |
|------|--------|
| `/legal/privacy/` | Rendered from processing activities + identity |
| `/legal/cookies/` | Rendered from cookie/storage inventory |
| `/legal/terms/` | Config sections; governing law placeholder until configured |
| `/legal/affiliate-disclosure/` | Commission + editorial separation |
| `/legal/editorial-independence/` | Platform invariants |
| `/legal/advertising-sponsorship/` | Policy even if sponsorship not offered |
| `/legal/disclaimer/` | Informational / estimates / vendor responsibility |
| `/legal/accessibility/` | Commitment without untested WCAG claims |

### Utility (noindex)

| Path | Notes |
|------|--------|
| `/privacy-request/` | Privacy-focused contact |
| `/newsletter/confirm/` | Double opt-in states |
| `/newsletter/thanks/` | Post-confirm |
| `/newsletter/preferences/` | Stub until provider supports |
| `/search/` | Site search (noindex) |

## Site identity

Central config: `src/data/config/site/foundation.ts` (`SiteFoundationConfig`).

Do **not** invent:

- legal entity name / KvK / address / country
- privacy/contact emails
- hosting / analytics / newsletter providers
- retention periods

Missing values keep `identity.configurationComplete = false` and surface `LEGAL_CONFIGURATION_INCOMPLETE`.

## Author / founder

`Author` entities live in foundation config. Commercial pages may use `AuthorshipByline`. Deterministic tools must not fake authorship.

## Navigation

- **Header:** Software, Categories, Best, Compare, Tools, Guides, Search — no legal clutter
- **Footer:** Company + Legal groups + Cookie settings

## Legal lifecycle

Each `LegalDocument` has `status`: `draft` | `legal-review-required` | `approved` | `published`, plus `version`, optional `effectiveAt` / `approvedAt`.

Generated legal text is **not** auto-approved.

## Launch readiness

`assessSiteLaunchReadiness()` + audit check `site-launch-readiness`.

Critical until identity is complete and core legal docs exist/approved.

## Related docs

- [privacy-consent.md](./privacy-consent.md)
- [newsletter.md](./newsletter.md)
