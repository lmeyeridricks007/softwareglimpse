# IT hosting providers + AI automation overlay — 2026-08-18

**Purpose:** Close the remaining track items after web-data peers: official YouTube for ScraperAPI / Apify / ThorData; Cloudways / WP Engine as managed hosting *providers* (not panels); Zapier / n8n as AI workflow-automation overlay.

**Rules held:** Rank only inside job clusters. No WordPress auto-publish. Affiliate economics excluded from scores. `handsOnTesting=false`.

---

## YouTube (web-data close-out)

| Product | Official embed | Notes |
| --- | --- | --- |
| Apify | `x-Zzwq6KOLw` | oEmbed author **Apify** |
| ThorData | `pJGF19bFMlg` | oEmbed author **Thordata** |
| ScraperAPI | — | **Known gap** — no official vendor channel found; third-party tutorials not embedded |

---

## New clusters

### `hosting-providers` (IT)

Managed cloud / WordPress hosts — **not** Plesk/cPanel panel licences (`hosting-operations`).

| Product | Slug | Overall | Role |
| --- | ---: | ---: | --- |
| WP Engine | `wp-engine` | **7.7** | **Cluster award** — managed WordPress; Essential Startup from **$30/mo** (first-year Essential disclaimer) |
| Cloudways | `cloudways` | **7.6** | Multi-cloud peer; Flexible from **$11/mo** DigitalOcean Standard |

Pricing grounded 2026-08-18 from `cloudways.com/pricing.php` and `wpengine.com/plans/`.

**Comparisons:** `wp-engine-vs-cloudways` (same cluster); `cloudways-vs-plesk`, `wp-engine-vs-plesk` (landscape only).

### `ai-automation` (AI)

Workflow automation with AI steps — **not** LLM assistants and **not** MindStudio agent builders.

| Product | Slug | Overall | Role |
| --- | ---: | ---: | --- |
| Zapier | `zapier` | **8.1** | **Cluster award** — Free 100 tasks; Pro from **$19.99/mo** annual (750 tasks) |
| n8n | `n8n` | **8.0** | Technical / self-host peer — Community free; Cloud Starter from **€20/mo** annual |

Pricing grounded 2026-08-18 from `zapier.com/pricing` and `n8n.io/pricing/`.

**Comparisons:** `zapier-vs-n8n` (same cluster); `zapier-vs-mindstudio`, `n8n-vs-mindstudio` (landscape only).

---

## Official media for new products

| Product | YouTube | Overview visual |
| --- | --- | --- |
| Cloudways | `_M2CHetCobc` (author Cloudways) | Original teaching diagram (vendor OG HTTP 403) |
| WP Engine | `LK2VgEGaO9s` (author WP Engine) | Official OG |
| Zapier | `3S1yzf9FDnk` (author Zapier) | Official OG |
| n8n | `1MwSoB0gnM4` (author n8n) | Original teaching diagram (third-party OG host blocked) |

---

## Taxonomy / activation

- Category definitions bumped to **configVersion 1.2.0** and re-activated.
- Features: `managed-hosting` (IT), `workflow-automation` shared CRM+AI slug.
- Use cases: `hosting-providers`, `ai-automation` (hub-ready in `dimensions.ts`).
- Best pages updated with cluster awards (WP Engine / Zapier).
- Product-guide primaries include `cloudways`, `wp-engine`, `zapier`, `n8n`.

---

## Identity reminders

- Cloudways ≠ Plesk ≠ cPanel ≠ WP Engine as one “best hosting” list
- Zapier ≠ ChatGPT ≠ MindStudio ≠ n8n Community as one “best AI” list
- n8n Cloud Starter ≠ Community Edition self-host (same vendor, different packaging)
- Zapier Agents add-on ≠ platform task-plan floor

---

## Scripts

- `scripts/lib/it-hosting-providers-products.mjs`
- `scripts/lib/ai-automation-overlay-products.mjs`
- `scripts/onboard-it-hosting-providers-batch.mjs` / `onboard-ai-automation-overlay-batch.mjs`
- `scripts/patch-software-seed-it-hosting-providers.mjs` / `patch-software-seed-ai-automation-overlay.mjs`
- `scripts/append-it-hosting-providers-comparisons.mjs` / `append-ai-automation-overlay-comparisons.mjs`
- `scripts/generate-hosting-automation-lettermarks.mjs`
