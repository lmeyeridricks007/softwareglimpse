# Affiliate management

Centralized monetization for SoftwareGlimpse: **one source of truth** for affiliate programmes, destinations, promotions, and CTAs.

## Architecture

```text
Canonical Product
        ↓
Affiliate Programme
        ↓
Affiliate Destination(s)
        ↓
Active Promotion (optional)
        ↓
resolveCommercialCta() → externalUrl (+ goPath for compat)
        ↓
SoftwareCta / AffiliateLink / AffiliateAnchor
        ↓
Direct vendor/partner URL (rel=sponsored) + client analytics
```

**Not** hardcoded URLs in article JSON.

`/go/[product]/[type]` remains as a **backward-compatible** 302 redirect for old shared links. New markup must use `externalUrl` directly.

## Editorial independence (invariant)

Affiliate data may influence:

- CTA destination / availability
- promotion messaging
- commercial reporting / ops priority

Affiliate data must **never** influence:

- review scores, comparison winners, Best rankings
- Finder recommendation scores
- pros/cons, verdicts, alternative relationships

Tests: `src/services/affiliate/affiliate.test.ts`, `src/services/recommendation/recommend.test.ts`.

## Data location

```text
src/data/affiliates/
  programmes.json
  destinations.json
  promotions.json
  store.ts
  source/
    partner-links.ts          # canonical partner URL registry
    partner-links.csv         # full spreadsheet export
    partner-links.import.csv  # known-product import for CLI
```

Override root with `SG_AFFILIATES_ROOT` (tests).

Partner URLs live in `source/partner-links.ts`. After editing that registry, re-import known products:

```bash
npm run affiliate:import -- src/data/affiliates/source/partner-links.import.csv
```

Pages must use `SoftwareCta` / `AffiliateLink` — never paste raw affiliate URLs into content. Links resolve to the registry `externalUrl` with `rel="sponsored noopener noreferrer"`.

## Models

### Programme

`id`, `name`, `network`, `status` (active|pending|inactive|suspended|expired), `productSlugs[]`

### Destination

Multiple per product: `homepage | pricing | signup | trial | demo | contact-sales | offer | other`

`isDefault`, `url` (tracking params preserved), `status`

### Promotion

Verified commercial facts only — agents must not invent discounts.

Fields: headline, type, value, promoCode, codeRequired, startsAt/endsAt/noExpiry, scope (public|affiliate|exclusive), destinationId?, verifiedAt, source.

Effective status derived from dates; `disabled` always wins. Expired promotions disappear from public resolution automatically.

## CTA resolver

`resolveCommercialCta({ productSlug, context, intent?, preferredDestinationType?, promotionId?, now? })`

Fallback order (`src/services/affiliate/policy.ts`):

1. requested promotional destination  
2. preferred context destination  
3. intent destination  
4. default affiliate destination  
5. any active affiliate destination  
6. legacy `Software.affiliate.trackingUrl`  
7. official website / destinationUrl  
8. no CTA  

Pages should prefer `externalUrl` (direct affiliate destination). `goPath` (`/go/pipedrive/trial`) is retained for backward-compatible redirects only — destination updates still flow from the central registry without content regeneration.

## Components

```tsx
<SoftwareCta productId="pipedrive" context="software-review" intent="START_TRIAL" />
<AffiliateLink softwareId="pipedrive" placement="review-hero">Visit Pipedrive</AffiliateLink>
<ExternalLink href={pricingUrl} type="pricing-source">Pipedrive pricing documentation</ExternalLink>
<SoftwarePromotionBanner productId="pipedrive" context="pricing-page" />
```

Never pass raw affiliate URLs into components. Never use affiliate URLs as research evidence.

## Redirects (compat only)

- `/go/[product]` and `/go/[product]/[destinationType]` — **legacy shared links**
- New page CTAs use direct `externalUrl`
- `dynamic = force-dynamic`, `Cache-Control: no-store`, `X-Robots-Tag: noindex`
- **Rejects** `?url=` / `?redirect=` (open-redirect protection)
- Disallowed in `robots.ts`
- Not in sitemap

## Agent contract

Agents emit semantic CTA intents only (`VISIT`, `START_TRIAL`, `visit-product`, …).

QA fails on raw affiliate URLs (`RAW_AFFILIATE_URL`) and commission fields.

## Finder / calculator

1. Rank / calculate first (no affiliate inputs)  
2. Resolve CTA afterward via `resolveVisitCta` / `buildVisitCtaMap` → direct `externalUrl`  

Promotions may display as “Current offer” without changing scores. Canonical plan prices are never mutated by promotions.

## CLI

```bash
npm run affiliate:set -- pipedrive --url "https://..." --type trial --default
npm run affiliate:list
npm run affiliate:show -- pipedrive
npm run affiliate:coverage -- --category crm
npm run promotion:add -- --product pipedrive --headline "20% off annual plans" --type percentage-discount --value 20 --ends 2026-08-31
npm run promotion:add -- --product example --headline "Ongoing deal" --no-expiry --code SOFTWARE20 --code-required
npm run promotion:list -- --active
npm run promotion:disable -- promo-...
npm run affiliate destination-disable -- dest-...
npm run affiliate:import -- affiliates.csv --dry-run
npm run affiliate:import -- affiliates.csv
npm run affiliate:export
npm run affiliate:validate
```

### Bulk CSV

```csv
product,affiliate_url,status,programme,destination_type,promotion,promo_code,starts_at,ends_at
pipedrive,https://...,active,PartnerStack,trial,20% off,,2026-08-01,2026-08-31
```

Unknown products → `UNKNOWN_PRODUCT` (no auto-create). Idempotent re-import.

## Audit

Commercial integrity checks (do not fail editorial solely for “no affiliate”):

- `MISSING_AFFILIATE_DESTINATION`, `MALFORMED_AFFILIATE_URL`, `INACTIVE_AFFILIATE_USED`
- `MULTIPLE_DEFAULT_DESTINATIONS`, `EXPIRED_PROMOTION_VISIBLE`, `UNVERIFIED_PROMOTION`
- `STALE_PROMOTION`, `BROKEN_PROMOTION_DESTINATION`, `PROMOTION_CONFLICT`, `MISSING_CTA_FALLBACK`
- existing `AFFILIATE_BIAS`, `RAW_AFFILIATE_URL`, `MISSING_DISCLOSURE`

## Revalidation

Changing destinations/promotions emits `domain:affiliate` change events and tags:

`affiliate:{slug}`, `software:{slug}`, `pricing:{slug}`, tool tags.

Does **not** trigger editorial regeneration.

## Secrets

Do not store network API credentials in JSON. Destination URLs with tracking IDs are OK in the affiliates store; keep commission notes out of public client bundles.

## POC note

No live vendor tracking URLs were invented in production seed. Use CLI or test fixtures (`SG_AFFILIATES_ROOT`) to configure programmes/destinations/promotions.
