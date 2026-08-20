# SEO health remediation log — 2026-08-15

Actions taken against the prior `SEO-HEALTH-LATEST.md` (43 findings) before re-audit.

## Engineering fixes

| Finding class | Action |
| --- | --- |
| Sitemap “Best CRM” / “Industry” missing | Not defects — pages are **intentionally noindex**. Technical agent now skips sitemap checks for non-indexable representative routes. |
| Weak `/software/rocketreach/` | False CRM orphan — RocketReach is **sales-intelligence**, not CRM. Orphan detector now only scores CRM-category software. |
| Conditional next-step tips (Best/Industry) | Removed as standing findings while targets remain noindex (tracked on content map / editorial gates). |
| Oversized heroes (LCP) | Compressed four flagged heroes; content switched to **WebP** (~35–50KB). PNG sources also under 900KB budget. |
| Tool pages missing SSR H1 | Requirements Builder + Migration Planner H1 lived only in client bundles. Added SSR `<h1>` + `titleElement="none"` (same pattern as Implementation Planner). |
| Feature workflow hero LCP | `features/workflow-automation-hero` → WebP (~70KB); PNG clamped under 900KB. |
| Media P2 noise | Audit no longer flags decorative `alt=""` or dims reserved by `next/image` / `aspect-*` / `size-*` / absolute fill. Gallery imgs got explicit width/height. |
| Schema P2 noise | FAQ check validates Question entities (not title heuristics). Skip JSON-LD on intentionally noindex Best / Industry / Guide pages. |
| Closely Loom thumb | Added official oEmbed `thumbnailUrl` for `closely-video-loom-linkedin-outreach`. |
| Local lab TTFB P1 flood | TTFB findings suppressed when `BASE_URL` is loopback; still measured and noted in check reason. |
| “YouTube IFrame API globally” | False positive — scanner matched the **audit agent source string**. Scan limited to `src/app` + `src/components`. |

## Content-coverage findings (33)

MISSING / NOT-YET-IMPLEMENTED tools (ROI calculator, RFP builder, etc.) and thin **noindex** hubs are **roadmap / editorial**, not production crawl breaks.

ContentCoverageAuditAgent v1.1.0 now:

- Omits roadmap MISSING/NOT-YET-IMPLEMENTED from production health findings
- Omits thin pages that are still noindex
- Only raises **thin + indexable** live pages as P2

Building those tools/pages remains explicit product/editorial work via onboarding agents — not SEO auto-fix.

## Map hygiene (final remaining finding)

| Finding | Action |
| --- | --- |
| Thin Guides hub (`CRM-GUIDES-000`) | Master map still said EXISTING-BUT-THIN / hard noindex; live `/guides/` is indexable with full hub UI + 140+ guides. Updated row + tree bullets to ✅ EXISTING. |

## Latest FULL + BASE_URL result (2026-08-15)

```text
npm run seo:audit -- --mode=full --base-url=http://127.0.0.1:3000
→ Findings: 0 | Checks completed: 31 | skipped: 0 | failed: 0
```

Local lab TTFB still measured (often over warn on `next dev`) but **not** raised as findings. Re-probe a production/`next start` origin for real TTFB signal.
