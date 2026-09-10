# Audit cleanup — Pipedrive alternatives + migration QA (2026-09-09)

## Task A — `/alternatives/pipedrive/`

Deepened seed (`src/data/seed/alternatives.ts`) to **6** real substitutes with buyer jobs, limitations, directional pricing signals, and decision guidance:

| Alternative | Buyer job |
| --- | --- |
| Freshsales | CRM + native calling / scoring |
| HubSpot | Freemium platform / marketing+service path |
| Close | Outbound dialer-centric CRM |
| Zoho CRM | Value / modular customization |
| Capsule | Lighter SMB CRM |
| Salesflare | Automated relationship capture |

Master map `CRM-PRD-EX-PD-ALT` flipped **EXISTING-BUT-THIN → ✅ EXISTING** (research `complete`).

**Results:** ContentCoverage **0 findings**; SEO health **P0=0 P1=0 P2=0**; thin finding `SEO-THIN-CRM-PRD-EX-PD-ALT-B8CE` **RESOLVED**.

## Task B — Migration QA noise

| Prior finding | Classification | Fix |
| --- | --- | --- |
| GSC snapshot `/fr/contact/` + locale compare | **STALE_SNAPSHOT** | Exclude `src/data/seo/snapshots/**` from repo scan |
| `verify-pricing.ts` `…/bot` UA | **INTENTIONAL** | Treat `/bot` as intentional absolute path |
| lucrovox `/vendor-ui/…` | **INTENTIONAL** | Allow `/vendor-ui/` (+ `/research/`) as new IA |
| `live-hits.ts` homepage URL | **INTENTIONAL** | Treat `/` as intentional (own-property reject row) |

No legitimate live redirect/fate defects were suppressed.

**Results:** `migration:seo-audit --base-url=http://127.0.0.1:3000` → **PASS (static+live)** · **P0=0 P1=0 P2=0**.
