# Official Asset Discovery Framework

> Spec date: 2026-08-15  
> Framework version: `1.0.0`  
> Status: foundational — recommend only; no auto-publish / download / rehost

## 1. Purpose

Create a reusable system that can:

1. Inspect existing Software / Product pages  
2. Inspect existing Guides / Articles  
3. Understand what each page discusses  
4. Identify where visual/media evidence would improve the page  
5. Search official vendor / authoritative sources for suitable assets  
6. Classify discovered assets  
7. Verify that the source is official  
8. Determine whether embedding / linking / referencing is appropriate  
9. Map each asset to product, feature, capability, requirement, use case, industry, guide section, or claim  
10. Write detailed recommendations to local Markdown documents  

**Asset discovery is separate from asset publishing.**

## 2. Architecture reused

Inspected and reused (not duplicated):

| Existing | Reuse |
| --- | --- |
| `ResearchMedia` (`src/domain/schemas/product-media.ts`) | Canonical video model; bridge drafts via `bridgeDiscoveredAssetToResearchMedia` |
| `ResearchSource` + `SOURCE_TYPE_PRIORITY` | Official docs / pricing / help-center evidence URLs |
| `ProductOfficialLinks` / outbound resolve | Website, pricing, docs, help-center destinations |
| Feature / Capability / Use Case / Requirement / Industry media research | Lifecycle: discovered → verified → classified → needs-review → active |
| Product screenshots on enrichment | Existing UI captures (not duplicated into ResearchMedia) |
| Media health / governance | Refresh flags; never auto-delete research history |
| Content Quality (`visual-media-support`, `mediaGaps`) | Downstream editorial scoring; discovery feeds recommendations |
| Software + Guide schemas / loaders | Live page inspection without mutating seeds |
| Vendor research `sources.json` + `enrichment.json` | Known official URLs for seeded candidates |

### Explicit non-goals

- Do not scrape/rehost copyrighted assets blindly  
- Do not invent asset URLs  
- Do not let media presence alter software rankings  
- Do not treat affiliate URLs as evidence URLs  
- Do not auto-activate ResearchMedia  

```text
PageAssetSnapshot
        ↓
AssetOpportunity[]          ← needs FIRST (no web search yet)
        ↓
AssetSearchTask[]           ← entity + need queries
        ↓
SearchProvider / seeds      ← real URLs only (or empty)
        ↓
verifyOfficialSource
        ↓
classifyUsageRights + scoreAssetQuality
        ↓
DiscoveredAsset[] recommendations
        ↓
Markdown report (reports/content-assets/)
        ↓
(optional, separate) Approved Asset Workflow
  DISCOVERED → … → EDITORIALLY APPROVED → import → ACTIVE
  see docs/content-assets/02-approved-asset-workflow.md
```

## 3. Asset taxonomy

### AssetType

| Type | Typical use |
| --- | --- |
| `official-product-video` | Product overview demo |
| `official-feature-demo` | Feature-specific demo |
| `official-workflow-demo` | End-to-end workflow |
| `official-tutorial` | Setup / how-to |
| `official-webinar` | Vendor webinar |
| `official-customer-story` | Vendor-published story (weak evidence) |
| `official-screenshot` | Vendor UI capture |
| `official-ui-image` | UI marketing image |
| `official-product-tour` | Interactive tour page |
| `official-diagram` | Vendor diagram |
| `official-architecture-diagram` | Architecture |
| `official-workflow-diagram` | Workflow diagram |
| `official-pricing-visual` | Pricing page / table visual |
| `official-integration-diagram` | Integrations map |
| `official-logo` | Logo |
| `official-brand-asset` | Brand kit asset |
| `official-pdf-guide` | Downloadable vendor PDF |
| `authoritative-reference-visual` | Gov / regulator / standards |
| `softwareglimpse-original-visual-opportunity` | Prefer SG original teaching visual |

### MediaFormat

`video` · `image` · `diagram` · `pdf` · `interactive` · `page` · `embed`

## 4. Source types

Prefer primary sources (lower priority number = better):

| SourceType | Role |
| --- | --- |
| `vendor-official-site` | Primary product site |
| `vendor-documentation` | Docs |
| `vendor-help-center` | Help / knowledge base |
| `vendor-youtube` / `vendor-vimeo` | Official channels only |
| `vendor-academy` | Training |
| `vendor-webinar` | Webinar hubs |
| `vendor-trust-center` | Security / trust |
| `vendor-pricing` | Pricing |
| `vendor-brand-center` | Brand kit |
| `vendor-customer-story` | Case studies |
| `government` / `regulator` / `standards-body` | Non-vendor authoritative |
| `authoritative-primary` | Other primary authorities |
| `secondary` | Not preferred; usually do-not-use |

## 5. Discover page needs first

Do **not** search the web blindly.

For every page:

1. Parse page/topic structure → `PageAssetSnapshot`  
2. Identify product / entity references  
3. Identify major sections  
4. Identify features / workflows  
5. Identify claims / evidence needs  
6. Identify visual explanation opportunities  
7. Generate explicit `AssetOpportunity` + `AssetSearchTask` records  

Example (HubSpot review):

| Section | Need |
| --- | --- |
| Overview | official product overview demo |
| Features | workflow automation demo / reporting screenshot |
| Implementation | official setup tutorial |
| Evidence / pricing | pricing documentation / help-center visuals |

If overview video already exists on enrichment, that opportunity is marked `satisfied-existing` and does **not** generate redundant search noise for that need.

## 6. Models

### AssetOpportunity

See `AssetOpportunitySchema` — pageId, route, section, entity ids, needType, preferredAssetTypes, importance, purpose, status.

### DiscoveredAsset

See `DiscoveredAssetSchema` — sourceUrl (real only), assetType, mediaFormat, sourceType, officialSource, entity mappings, usageRightsStatus, qualityAssessment, recommendation, reason.

Prefer bridging videos into **ResearchMedia** rather than storing a parallel public media table.

### VendorOfficialSourceRegistryEntry

Canonical per-product:

- `officialDomains`  
- docs / help / academy / trust domains  
- `brandCenterUrls`  
- `officialVideoChannels`  

Do not hardcode domains randomly in page-specific agents when registry metadata exists.

## 7. Official source verification

Checks (as applicable):

- URL parseable  
- Not affiliate / partner tracking host  
- Domain ownership vs vendor registry  
- YouTube/Vimeo: channel association / researcher confirmation  
- Government / standards host classification for non-vendor topics  

**Never** set `officialSource=true` from title or search snippet alone.

## 8. Copyright / usage classification

| Status | Recommendation | Example |
| --- | --- | --- |
| `safe-to-embed` | `embed` | Official YouTube embed enabled |
| `safe-to-link` | `link` / `use-as-evidence` | Official docs / pricing page |
| `potentially-reusable-with-permission` | `link` | Brand kit (verify terms) |
| `better-create-original-visual` | `create-original-visual-based-on-source` | Vendor screenshots/diagrams |
| `usage-rights-unclear-link-only` | `cite` | Unclear terms |
| `do-not-use` | `do-not-use` | Secondary / unclear rights |

When terms are unclear, use: **“usage rights unclear — link/reference only”**.  
Do not make definitive legal claims.

## 9. Search strategy

Queries are built from entity + need, e.g.:

- `[Product] official workflow automation demo`  
- `[Product] workflow automation site:youtube.com`  
- `[Product] pipeline tutorial official`  
- `[Product] reporting documentation`  
- `[Product] brand assets`  
- `[Product] official screenshots`  
- `[Product] setup guide`  
- `[Product] onboarding webinar`  
- `[Product] financial services demo`  

Provider interface (`AssetSearchProvider`):

- `noop` — lists tasks, invents nothing  
- `seeded-candidates` — researcher / fixture / existing research URLs only  
- Future: wire a real search API without scraping hacks  

## 10. Quality criteria

Integer 0–5 dimensions → overall 0–100:

Relevance · Specificity · Official-source confidence · Freshness · Visual clarity · Buyer usefulness · Evidence usefulness · Embedding usability  

Prefer **specific product workflow demos** over **generic corporate brand videos**.

## 11. Review lifecycle

```text
needs identified
  → search tasks
  → candidates (real URLs only)
  → official verification
  → usage classification
  → quality score
  → Markdown recommendation
  → editorial approval
  → (optional) ResearchMedia discover → verify → classify → review → activate
```

### Connection to content-quality audits

Open opportunities and media gaps inform Content Quality dimensions (`visual-media-support`, `evidence-source-quality`) as improvement recommendations. They do **not** rewrite pages or change publish gates by themselves.

## 12. Commands

| Script | Purpose |
| --- | --- |
| `npm run assets:audit` | Audit fixture / software / guide / file |
| `npm run assets:audit:software` | Product page audit |
| `npm run assets:audit:guides` | Guide page audit |
| `npm run assets:audit:crm` | Sample CRM products + guides |
| `npm run assets:validate` | Schema + fixture sanity |
| `npm run assets:registry` | List vendor registry |
| `npm run assets:fixtures` | List fixture ids |

## 13. Limitations

- No built-in commercial web search API in-repo yet — use seeds / future provider  
- YouTube official status requires channel confirmation against registry  
- Image rehosting is out of scope; prefer link or original SG visuals  
- Discovery never proves product superiority or pricing accuracy by itself  
- Media counts must never feed ranking / scorecard formulas  
