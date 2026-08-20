# IT Tier-B + ITSM SMB onboarding — 2026-08-18

**Purpose:** Combined wave — focused ITSM SMB depth **and** remaining industry Tier-B peers.

**Plan:** [`it-industry-gap-plan-2026-08-18.md`](./it-industry-gap-plan-2026-08-18.md)  
**Prior:** [`it-industry-tiera-onboarding-2026-08-18.md`](./it-industry-tiera-onboarding-2026-08-18.md)

**Rules held:** Rank only inside clusters. Existing awards unchanged. No WordPress auto-publish. Affiliate economics excluded. `handsOnTesting=false`.

---

## ITSM SMB (3)

| Product | Slug | Overall | Published floor |
| --- | --- | ---: | --- |
| HaloITSM | `haloitsm` | **7.9** | **£66/agent/mo** annual (UK calculator); all-in-one |
| ManageEngine ServiceDesk Plus | `manageengine-servicedesk-plus` | **7.8** | Cloud Standard from **$13/tech/mo**; free ≤5 techs |
| SysAid | `sysaid` | **7.7** | Professional **~$89/agent/mo** (medium confidence) |

ITSM awards unchanged: ServiceNow **8.7**; Freshservice **8.4** remains published-price peer; JSM 8.0.

## Observability (2)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| AppDynamics (Cisco) | `appdynamics` | **7.9** | Premium from **~$33/vCPU/mo** annual |
| Honeycomb | `honeycomb` | **7.8** | Free; Pro from **$150/mo** |

Datadog **8.6** award unchanged.

## Incident / on-call (2)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| FireHydrant | `firehydrant` | **7.7** | Free ≤10; Pro **$25/responder/mo** annual |
| Rootly | `rootly` | **7.7** | IR Essentials **$20/user/mo** |

PagerDuty **8.0** award unchanged (incident.io 7.8 remains peer).

## CI / DevOps (1)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| Buildkite | `buildkite` | **7.6** | Free; Pro **$30/active user/mo** |

GitHub **9.1** award unchanged. Buildkite is CI path (like CircleCI), not a git host.

## Hosting providers (1)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| SiteGround | `siteground` | **7.3** | StartUp **renews $17.99/mo** (promo $2.99 not used as floor) |

WP Engine **7.7** award unchanged.

## Web-data (2)

| Product | Slug | Overall | Floor |
| --- | --- | ---: | --- |
| Zyte | `zyte` | **7.4** | Commitments from **$100/mo**; $5 trial credit |
| IPRoyal | `iproyal` | **6.7** | Residential from **$1.75/GB** |

Bright Data **7.7** award unchanged.

---

## Deliverables

- Seed: +11 soft entries (`software.ts` soft count **255** after this wave)
- Comparisons: 19 pairs (same-cluster + landscape)
- Best IT page + category **configVersion 1.4.0**
- Lettermarks under `public/brands/`
- Overview PNGs under `public/software/{slug}/`
- Product-guide visuals: **39 IT primaries / 1170 PNGs**
- Scripts: `scripts/lib/it-tierb-itsm-products.mjs` + onboard / patch / append / lettermark helpers

### Media notes (OG)

| Slug | Overview source |
| --- | --- |
| `sysaid`, `honeycomb`, `firehydrant`, `buildkite`, `rootly`, `siteground`, `iproyal` | Vendor OG / marketing visual (`vendor-ui`) |
| `manageengine-servicedesk-plus` | Teaching diagram (no `og:image`) |
| `haloitsm` | Teaching diagram (homepage HTTP 403) |
| `appdynamics` | Teaching diagram (OG host skipped: `www.splunk.com`) |
| `zyte` | Teaching diagram (OG host skipped: `assets.contento.io`) |

Official YouTube: not embedded this wave (`videos: []`); only add when oEmbed `author_name` matches vendor allow-list.

---

## Still deferred / optional next

- New use cases: `error-monitoring`, `cicd-pipeline` (optional taxonomy)
- More ITSM: TOPdesk, Ivanti, BMC Helix (enterprise landscape)
- More obs: Chronosphere, Coralogix
- Hosting: Fly.io / Render (PaaS — new cluster candidate)
