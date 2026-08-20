# IT optional-next onboarding — 2026-08-18

**Purpose:** Close the deferred “optional next” set after Tier-B + ITSM SMB: enterprise ITSM, obs peers, new **cloud-paas** cluster, and vendor-verified YouTube only.

**Prior:** [`it-tierb-itsm-onboarding-2026-08-18.md`](./it-tierb-itsm-onboarding-2026-08-18.md) · [`it-industry-gap-plan-2026-08-18.md`](./it-industry-gap-plan-2026-08-18.md)

**Rules held:** Rank only inside clusters. Existing awards unchanged except **new** `cloud-paas` award (Render). No WordPress auto-publish. Affiliate economics excluded. `handsOnTesting=false`.

**PaaS cluster slug (user choice):** `cloud-paas`

---

## ITSM enterprise (3)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| BMC Helix ITSM | `bmc-helix` | **8.3** | ~**$115**/named user/mo (AppExchange signal, **medium**); always RFP |
| Ivanti Neurons for ITSM | `ivanti` | **8.0** | Quote-led; **$95** low-confidence named-agent estimate (not a vendor SKU) |
| TOPdesk | `topdesk` | **7.8** | Essential **£51**/agent/mo (GBP); Engaged £72; Excellent £101 |

ITSM awards unchanged: ServiceNow **8.7**; Freshservice **8.4** published-price peer.

## Observability (2)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| Chronosphere | `chronosphere` | **7.9** | Contact sales / pilot (no public list) |
| Coralogix | `coralogix` | **7.8** | Published rate card — logs **$0.42**/GB; traces $0.16/GB; metrics $0.06/GB; 14-day / 8-unit trial |

Datadog **8.6** award unchanged.

## Cloud PaaS — new cluster (2)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| Render | `render` | **7.9** (**award**) | Hobby free; **Pro $25**/mo + compute |
| Fly.io | `fly-io` | **7.7** | shared-cpu-1x from **~$1.94**/mo; support **$29** is support, not hosting; no free allowance for new accounts |

Landscape-only vs WP Engine / Cloudways (hosting-providers) and vs Plesk (hosting-operations).

---

## Official YouTube (oEmbed vendorAllow only)

| Slug | Video | Author |
| --- | --- | --- |
| `topdesk` | `8eZDe24Bq8o` | TOPdesk |
| `ivanti` | `V5ZIhtPR8TY` | Ivanti |
| `bmc-helix` | `MsELM-v29FM` | BMC Helix Product Documentation |
| `coralogix` | `_ky2hztcwkk` | Coralogix |
| `fly-io` | `-gDjLF7x27k` | Fly․io |
| `chronosphere` | — | **Skipped** (no verified Chronosphere channel; `@ChronosphereHQ` oEmbed is wrong) |
| `render` | — | **Skipped** (no verified Render vendor channel) |

---

## Media notes (OG)

| Slug | Overview |
| --- | --- |
| `topdesk`, `chronosphere`, `render`, `fly-io` | Vendor OG (`vendor-ui`) |
| `ivanti`, `bmc-helix`, `coralogix` | Teaching diagram (404 / 403 / no og:image) |

---

## Deliverables

- Seed: +7 soft entries (`software.ts` soft count **270**)
- Comparisons: same-cluster + landscape PaaS pairs
- Best IT page + category **configVersion 1.5.0** (`cloud-paas` use case + feature)
- Lettermarks, overviews, product-guide primaries expanded
- Scripts: `scripts/lib/it-optional-next-products.mjs` + onboard / patch / append / lettermark helpers

---

## Still deferred

- Chronosphere / Render official YouTube when a verified vendor channel appears
- Optional taxonomy: `error-monitoring`, `cicd-pipeline` use cases
- More PaaS peers (Railway, etc.) only if identity-reviewed
