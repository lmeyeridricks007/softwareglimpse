# Affiliate model

> Prefer **[affiliate-management.md](./affiliate-management.md)** for the full programme / destination / promotion system.

## Flow

```text
affiliates store (programmes → destinations → promotions)
  → resolveCommercialCta(...)
  → externalUrl (direct) + goPath (compat redirect)
  → SoftwareCta / AffiliateLink / AffiliateAnchor
  → analytics affiliate_clicked (client; /go/ also logs for legacy hits)
```

Legacy: `Software.affiliate` remains for disclosure sync and migration fallback via `resolveAffiliateLink`.

## Two outbound systems

| Purpose | Component | Destination | rel |
| --- | --- | --- | --- |
| Commercial CTA | `SoftwareCta` / `AffiliateLink` | Affiliate registry URL | `sponsored noopener noreferrer` |
| Research / evidence | `ExternalLink` / `EvidenceSourceLink` | Official primary source | editorial (no sponsored) |

Never confuse “Where can I buy this?” with “What proves this claim?”

## Rules

1. Never paste tracking URLs into MDX/prose or agent drafts.
2. Affiliate href → `rel="sponsored noopener noreferrer"`.
3. Official fallback → `noopener noreferrer` (not sponsored).
4. Ranking/recommendations must ignore affiliate enabled state and promotions.
5. Expired promotions must not appear in public CTA resolution.
6. Never use affiliate destinations as research evidence sources.
7. Prefer primary vendor docs/pricing/security pages for evidence links.
