# EXISTING_ESTATE_GAP_REVIEW

**Source:** Locale 410 topic review (Locale410TopicReview v1.0.0)  
**Generated:** 2026-09-06T21:23:28.422Z  
**Resolved:** 2026-09-06 (gap recovery — preserve → improve → promote)

Manual consideration queue for legacy **topics** that previously had locale
URLs returning **410**, with historical/user signal, but **no** English page
that could legitimately absorb them.

## Rules

- Remain English-only — do **not** restore multilingual pages
- Do **not** auto-create placeholder pages
- Do **not** 301 to homepage or unrelated hubs just to “save” the URL
- Prefer onboarding a real catalogue/guide entity first, then map locales
- Junk / off-strategy tooling is **not** listed here (stays 410)

## Resolution summary (4/4)

| EN topic | Decision | Canonical | Redirects | Indexability |
| --- | --- | --- | --- | --- |
| `/content-at-scale-review/` | TRUE_OBSOLETE | — | remain 410 | n/a |
| `/miocommerce-review/` | RECOVERED | `/software/miocommerce/` | EN + 7 locales 301 | INDEXABLE |
| `/tidio-vs-live-chat/` | RECOVERED | `/compare/livechat-vs-tidio/` | EN + 7 locales 301 | INDEXABLE |
| `/tidio-vs-crisp/` | RECOVERED | `/compare/crisp-vs-tidio/` | EN + 7 locales 301 | INDEXABLE |

## Open candidates (0)

_No open gap candidates — queue cleared._

## Resolved archive

### `/content-at-scale-review/`

| Field | Value |
| --- | --- |
| Decision | **TRUE_OBSOLETE** |
| Canonical target | none |
| Product entity | BrandWell rebrand; no catalogue fit |
| Quality result | n/a |
| Redirect status | remain 410 |
| Indexability | n/a |
| Reason | 0 GSC; do not create a page solely for URL recovery |

### `/miocommerce-review/`

| Field | Value |
| --- | --- |
| Decision | **RECOVERED** |
| Canonical target | `/software/miocommerce/` |
| Product entity | MioCommerce (field-service-operations) |
| Quality result | INDEXABLE |
| Redirect status | EN + 7 locales 301 |
| Indexability | INDEXABLE |
| Reason | Active SaaS; modern /software/ canonical |

### `/tidio-vs-live-chat/`

| Field | Value |
| --- | --- |
| Decision | **RECOVERED** |
| Canonical target | `/compare/livechat-vs-tidio/` |
| Product entity | tidio + livechat |
| Quality result | INDEXABLE |
| Redirect status | EN + 7 locales 301 |
| Indexability | INDEXABLE |
| Reason | Existing CS pair; Live Chat ≠ generic |

### `/tidio-vs-crisp/`

| Field | Value |
| --- | --- |
| Decision | **RECOVERED** |
| Canonical target | `/compare/crisp-vs-tidio/` |
| Product entity | crisp + tidio |
| Quality result | INDEXABLE |
| Redirect status | EN + 7 locales 301 |
| Indexability | INDEXABLE |
| Reason | Crisp onboarded; overlapping live-chat thesis |
