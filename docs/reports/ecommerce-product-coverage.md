# Ecommerce — Product Coverage Map

**Date:** 2026-08-18  
**Purpose:** Local planning doc — ecommerce category vs SoftwareGlimpse coverage (Next.js catalogue).  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

---

## Category scope

Primary jobs (job clusters):

| Cluster | Job |
| --- | --- |
| `saas-platform` | Hosted all-in-one / embeddable / enterprise / LATAM storefront (Shopify / Ecwid / SFCC / commercetools / VTEX / Tiendanube-class) |
| `open-source-platform` | WordPress / Magento / PrestaShop / Shopware / OpenCart / Saleor / Medusa-class open commerce |
| `website-builder` | Website-first commerce (Wix / Squarespace / Webflow) |
| `omnichannel-pos` | POS + online bundle (Square / Lightspeed Retail) |
| `dropshipping-sourcing` | Supplier import + print-on-demand apps (require a store) |

Source: `src/data/category-onboarding/seed/ecommerce.ts` (**v1.4.0** — Priority-3 membership; methodology `ecommerce-editorial` v1.0.0).

**Activated:** `src/data/category-onboarding/activated/ecommerce.json` — software onboarding ready.  
**Excluded from `/software/`:** ShipBob (3PL service), Bïrch (ad automation — marketing category).

---

## Catalogue (Wave-1 + Priority-1 + Priority-2 + Priority-2b + Priority-3)

**Twenty-three** primary products with `primaryCategorySlug: "ecommerce"`.

| Product | Cluster | Overall | Role | Affiliate |
| --- | --- | ---: | --- | --- |
| Shopify | saas-platform | **9.2** | Award | No |
| BigCommerce | saas-platform | **8.5** | Peer | No |
| Salesforce Commerce Cloud | saas-platform | **8.3** | Enterprise landscape | No |
| WooCommerce | open-source-platform | **8.1** | Award | No |
| Magento | open-source-platform | **8.0** | Landscape | No |
| Square Online | omnichannel-pos | **8.0** | Award | No |
| Lightspeed Retail | omnichannel-pos | **7.7** | Landscape (X-Series POS; not Ecwid) | No |
| commercetools | saas-platform | **7.7** | Composable landscape | No |
| VTEX | saas-platform | **7.5** | Enterprise landscape | No |
| Ecwid | saas-platform | **7.3** | Embeddable landscape | No |
| Shopware | open-source-platform | **7.3** | Landscape (EU) | No |
| Wix | website-builder | **7.1** | Award | No |
| PrestaShop | open-source-platform | **7.1** | Landscape (EU) | No |
| Spocket | dropshipping-sourcing | **7.1** | Award (supplier import) | Yes — mapped |
| Printful | dropshipping-sourcing | **7.0** | POD landscape | No |
| AliDrop | dropshipping-sourcing | **7.0** | Peer | Yes — mapped |
| Printify | dropshipping-sourcing | **6.9** | POD peer | No |
| Medusa | open-source-platform | **6.9** | Headless JS landscape | No |
| Tiendanube | saas-platform | **6.9** | LATAM landscape (Nuvemshop alias) | No |
| Saleor | open-source-platform | **6.8** | Headless GraphQL landscape | No |
| Squarespace | website-builder | **6.6** | Peer | No |
| Webflow | website-builder | **6.6** | Landscape (visual CMS) | No |
| OpenCart | open-source-platform | **6.0** | Landscape (GPL PHP) | No |

**Comparisons (approved):** Shopify vs BigCommerce, Spocket vs AliDrop, Wix vs Squarespace, Magento vs WooCommerce, Printful vs Printify, PrestaShop vs Shopware, Ecwid vs Shopify, Salesforce Commerce Cloud vs Magento, Webflow vs Wix, Lightspeed Retail vs Square Online, OpenCart vs WooCommerce, commercetools vs Salesforce Commerce Cloud, VTEX vs BigCommerce, Saleor vs Medusa, Tiendanube vs Shopify.

**Editor’s picks / landscape:** see `/best/ecommerce-software/` — cluster awards unchanged; Priority-2 / 2b / 3 are landscape only. Spocket keeps sourcing award. Lightspeed Retail is distinct from Ecwid (Lightspeed eCom). Tiendanube ≠ separate Nuvemshop page. No cross-cluster `recommendations[]` ranked list.

---

## Content & hubs shipped

| Asset | Status |
| --- | --- |
| Category hub | ✅ `/categories/ecommerce/` |
| Best page | ✅ `/best/ecommerce-software/` (23 eligible + landscape) |
| Guides (what-is, how-to-choose, pricing) | ✅ ecommerce copy |
| Use-case hubs (8) | ✅ includes `website-builder-commerce` |
| Capability hubs (11) | ✅ |
| Product guides (23 × 5 kinds) | ✅ **115** guides |
| Research + editorial packs | ✅ all 23 |
| Brand logos | ✅ (lettermarks where favicons were tiny) |
| Product screenshots | ✅ Wave-1/P1 + P2 OG/video frames; **Priority-3 vendor-UI** (OpenCart feature admin, commercetools OG, Saleor dashboard, Medusa admin, Tiendanube hero; VTEX YouTube frames) |
| Official videos | ✅ Priority-3: commercetools, VTEX, Saleor, Medusa, Tiendanube (OpenCart: screenshots only — no verified vendor channel video) |
| Affiliates | ✅ Spocket + AliDrop only |
| Category activation | ✅ v1.4.0 |

---

## Priority-3 scripts

```bash
node scripts/onboard-ecommerce-priority3-batch.mjs
node scripts/patch-software-seed-ecommerce-priority3.mjs
node scripts/fetch-brand-logos.mjs opencart commercetools vtex saleor medusa tiendanube
node scripts/source-ecommerce-product-media.mjs --slug=opencart
# …repeat --slug for commercetools vtex saleor medusa tiendanube
npm run onboard:category -- ecommerce --reconcile
```

---

## QA snapshot (2026-08-18)

| Check | Result |
| --- | --- |
| Category status | ACTIVE · 23 primaries · software onboarding ready |
| Site publication gate | Still blocked by site-wide `LEGAL_CONFIGURATION_INCOMPLETE` |
| Cluster awards | Unchanged after Priority-3 |
| Priority-3 media | `RESEARCH_GAP` (missing major official media) **cleared** for all six — vendor-UI screenshots on disk; official YouTube for five (OpenCart screenshots-only) |
| Deeper enterprise media | commercetools **6** shots / **4** videos; VTEX **4** shots / **4** videos (incl. Redesigned Admin); SFCC **8** first-party B2C marketing UI shots + Salesforce videos. True logged-in Business Manager / Merchant Center admin still CDN/bot-limited. |
| P2 / P2b media fill | Webflow **4** shots / **2** official videos; Lightspeed Retail **5** / **2**; Ecwid **5** / **2**; PrestaShop **3** / **2**; Printify **1**; Shopware **2** — all clear `missingMajorMediaCoverage` |

---

## Optional follow-ups

- Richer SFCC / PrestaShop / Ecwid / Webflow / Lightspeed / VTEX / commercetools deep admin vendor-UI screenshots when CDN assets are obtainable
- Confirm Lightspeed third-party processor surcharge live on pricing
- Confirm OpenCart managed-cloud floors live (secondary-cited only)
- Confirm Tiendanube txn fees / Pago Nube waiver live
- WP publish of ecommerce hubs (manual approval — never auto)
- Site legal identity / privacy configuration
- Priority-4 candidates (not onboarded): Gelato/DSers (POD/sourcing peers), Toast/Clover Online (POS peers), CS-Cart, 1C-Bitrix (regional)

---

## Editorial notes

- `handsOnTesting=false` for all products  
- Never rank Shopify vs Wix vs Spocket vs Printful on one undifferentiated list  
- Affiliate commission excluded from `ecommerce-editorial` criterion scores  
- Adobe Commerce / SFCC / commercetools / VTEX pricing is quote-only — open-source cores are free license + hosting TCO  
- Printful/Printify are POD (print-on-demand) — not Spocket-class physical supplier marketplaces  
- Webflow Ecommerce requires a Site plan in addition to the Ecommerce plan  
- Lightspeed Retail (X-Series POS) is not Ecwid (Lightspeed eCom embeddable cart)  
- Saleor Cloud Forever Free is non-commercial prototyping only — not a production merchant free plan  
- Tiendanube and Nuvemshop share one page (aliases only)  
- commercetools is composable / MACH landscape — does not steal Shopify’s SaaS award  
