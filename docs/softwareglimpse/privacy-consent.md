# Privacy & consent

## Processing model

`ProcessingActivity` records drive Privacy Policy copy (`buildPrivacySections`).

`DataProcessor` inventory lists only real/stub providers — unconfigured processors are labeled as such.

## Cookie / storage inventory

`CookieDefinition` includes `storageType`: `cookie` | `localStorage` | `sessionStorage`.

Cookie Policy renders from inventory categories in use (`consent.categoriesInUse`).

## Consent manager

Client: `ConsentProvider` + banner + preferences modal (`SiteModal`).

Behavior:

1. First visit → necessary storage only
2. Banner: Accept all / Reject non-essential / Manage preferences
3. Choice persisted as `sg_consent` (localStorage) with **version + timestamp + categories**
4. Version change or `renewAfterDays` → reconsent
5. Footer **Cookie settings** reopens preferences

### Script gating

`ConsentScript` / `ConsentAwareAnalytics` — no analytics SDK before consent when `analyticsRequiresConsent` is true.

Affiliate redirects must continue without analytics consent.

### Official product video embeds

YouTube / Vimeo players are gated on the **marketing** consent category:

1. Page renders a first-party thumbnail + play control (no third-party iframe yet).
2. If marketing consent is missing → “Video from YouTube” / “Allow and play” (or Cookie settings).
3. After consent **and** explicit play → load privacy-enhanced embed (`youtube-nocookie.com` when YouTube).
4. Canonical “Watch on YouTube ↗” source link remains available without loading the player.

`ConsentEmbed` is the generic gate; `OfficialProductVideo` is the product-media path.

## Modal priority

Cookie UI blocks newsletter popup (`cookieUiBlocking`).

## Policy dependencies

Changing processors / cookies / processing activities flags Privacy + Cookie docs via `flagPoliciesForProviderChange`.

## Rights & requests

Rights described in privacy copy. Operational path: Contact (reason Privacy) or `/privacy-request/`.
