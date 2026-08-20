import type { GuidePage } from "@/domain";
import type {
  GuideAssetCategory,
  GuideAssetGuideKind,
  GuideAssetRecommendation,
  MediaCoverageRating,
} from "@/domain/schemas/asset-discovery";
import { AssetSearchTaskSchema } from "@/domain/schemas/asset-discovery";
import { evaluatePageQuality } from "@/services/content-quality/evaluate";
import { snapshotFromGuide as cqSnapshotFromGuide } from "@/services/content-quality/loaders/guides";
import {
  classifyGuideKind,
  detectIndustryIds,
  isProductHeavyKind,
  isVendorNeutralKind,
  sectionLooksLikeDemo,
  sectionLooksLikeFieldMapping,
  sectionLooksLikePricing,
  sectionLooksLikeSecurity,
  sectionLooksLikeWorkflow,
} from "./classify";
import { classifyRecommendationLevel } from "../software-agent/rating";

function slugId(parts: string[]): string {
  return parts
    .map((p) =>
      p
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .filter(Boolean)
    .join("-")
    .slice(0, 100);
}

function cqVisualIssueId(guideSlug: string): string {
  return `CQ-GUIDE-${guideSlug.replace(/[^a-zA-Z0-9]+/g, "-").toUpperCase()}-VISUAL`;
}

export function countGuideFigures(guide: GuidePage): number {
  let n = 0;
  if (guide.heroVisual?.src) n += 1;
  for (const b of guide.blocks ?? []) {
    if (b.type === "figure") n += 1;
    if (
      (b.type === "step" ||
        b.type === "decision-framework" ||
        b.type === "feature-matrix" ||
        b.type === "size-match") &&
      "figure" in b &&
      b.figure?.src
    ) {
      n += 1;
    }
  }
  return n;
}

export function rateGuideVisualQuality(input: {
  figureCount: number;
  hasHero: boolean;
  teachingSectionGaps: number;
  kind: GuideAssetGuideKind;
}): { rating: MediaCoverageRating; reason: string } {
  const { figureCount, hasHero, teachingSectionGaps, kind } = input;
  if (figureCount >= 3 && teachingSectionGaps === 0) {
    return {
      rating: "excellent",
      reason: "Multiple teaching visuals with no major section gaps",
    };
  }
  if (figureCount >= 2 && teachingSectionGaps <= 1) {
    return {
      rating: "strong",
      reason: "Solid teaching visual coverage for guide length/complexity",
    };
  }
  if (figureCount >= 1 || hasHero) {
    return {
      rating: teachingSectionGaps >= 3 ? "weak" : "adequate",
      reason:
        teachingSectionGaps >= 3
          ? "Some visuals present but several explanation-heavy sections remain prose-only"
          : "At least one teaching visual; additional section-level support would help",
    };
  }
  if (isVendorNeutralKind(kind) || isProductHeavyKind(kind)) {
    return {
      rating: "very-weak",
      reason: "No teaching visuals where the guide would benefit from explanation aids",
    };
  }
  return {
    rating: "weak",
    reason: "Minimal visual support",
  };
}

function makeRec(input: {
  guide: GuidePage;
  sectionId: string;
  sectionTitle: string;
  title: string;
  category: GuideAssetCategory;
  usage: GuideAssetRecommendation["usageRecommendation"];
  level: GuideAssetRecommendation["recommendationLevel"];
  placementUse: string;
  why: string;
  queries?: string[];
  products?: string[];
  industries?: string[];
  features?: string[];
  supporting?: string[];
  cqIds?: string[];
  requiresUsageReview?: boolean;
  assetType?: GuideAssetRecommendation["assetType"];
}): GuideAssetRecommendation {
  return {
    id: slugId([input.guide.slug, input.sectionId, input.category, input.title.slice(0, 32)]),
    title: input.title,
    category: input.category,
    assetType: input.assetType,
    usageRecommendation: input.usage,
    recommendationLevel: input.level,
    sectionId: input.sectionId,
    sectionTitle: input.sectionTitle,
    placementUse: input.placementUse,
    why: input.why,
    productIds: input.products ?? input.guide.productSlugs ?? [],
    industryIds: input.industries ?? detectIndustryIds(input.guide),
    useCaseIds: [],
    featureIds: input.features ?? [],
    searchQueries: input.queries ?? [],
    supportingSourceHints: input.supporting ?? [],
    resolvesContentQualityIds: input.cqIds ?? [],
    requiresUsageReview: input.requiresUsageReview ?? false,
  };
}

/**
 * Section-first recommendations for a guide.
 * Prefer original SG visuals on vendor-neutral pages; official media on product guides.
 */
export function buildGuideSectionRecommendations(input: {
  guide: GuidePage;
  kind: GuideAssetGuideKind;
  cqIssueIds: string[];
}): {
  sections: Array<{
    sectionId: string;
    sectionTitle: string;
    blockType?: string;
    hasTeachingVisual: boolean;
    visualWouldHelp: boolean;
    current: string[];
    recommendations: GuideAssetRecommendation[];
  }>;
  recommendations: GuideAssetRecommendation[];
} {
  const { guide, kind, cqIssueIds } = input;
  const products = guide.productSlugs ?? [];
  const primaryProduct = products[0];
  const sections: Array<{
    sectionId: string;
    sectionTitle: string;
    blockType?: string;
    hasTeachingVisual: boolean;
    visualWouldHelp: boolean;
    current: string[];
    recommendations: GuideAssetRecommendation[];
  }> = [];
  const allRecs: GuideAssetRecommendation[] = [];

  const blocks: Array<{
    id: string;
    type: string;
    title?: string;
    heading?: string;
    body?: string;
    figure?: { src?: string };
    src?: string;
  }> =
    guide.blocks.length > 0
      ? guide.blocks.map((b) => ({
          id: b.id,
          type: b.type,
          title: "title" in b && typeof b.title === "string" ? b.title : undefined,
          heading:
            "heading" in b && typeof b.heading === "string" ? b.heading : undefined,
          body: "body" in b && typeof b.body === "string" ? b.body : undefined,
          figure:
            "figure" in b && b.figure
              ? { src: b.figure.src }
              : undefined,
          src: "src" in b && typeof b.src === "string" ? b.src : undefined,
        }))
      : guide.sections.map((s) => ({
          id: s.id,
          type: "step",
          heading: s.heading,
          body: s.body,
        }));

  for (const block of blocks) {
    const sectionId = block.id;
    const sectionTitle = block.title || block.heading || block.type;
    const body = block.body ?? "";
    const hasVisual = Boolean(
      block.type === "figure" || block.figure?.src || block.src,
    );
    const current: string[] = [];
    if (hasVisual) {
      current.push(
        block.src
          ? `Figure: ${block.src}`
          : block.figure?.src
            ? `Step figure: ${block.figure.src}`
            : "Teaching visual present",
      );
    }

    const recs: GuideAssetRecommendation[] = [];
    let visualWouldHelp = false;

    // Skip decorative recommendations for FAQ / related-content
    if (block.type === "faq" || block.type === "related-content") {
      sections.push({
        sectionId,
        sectionTitle,
        blockType: block.type,
        hasTeachingVisual: hasVisual,
        visualWouldHelp: false,
        current: current.length
          ? current
          : ["Editorial section — visuals usually not required"],
        recommendations: [],
      });
      continue;
    }

    // Decision framework / step without figure (only blocks that can hold a figure)
    if (
      !hasVisual &&
      (block.type === "decision-framework" || block.type === "step")
    ) {
      visualWouldHelp = true;
      const level = classifyRecommendationLevel({
        hasSourceUrl: false,
        officialSource: false,
        reuseExisting: false,
        specificity: "high",
        sectionImportance: "high",
      });
      recs.push(
        makeRec({
          guide,
          sectionId,
          sectionTitle,
          title: `Create original SoftwareGlimpse diagram for “${sectionTitle}”`,
          category: "original-softwareglimpse-diagram",
          usage: "create-original-visual-based-on-source",
          level,
          placementUse: `Place a teaching diagram beside/under “${sectionTitle}” with a caption that explains the decision rule or workflow`,
          why: "Section explains a process/framework in prose — an original diagram teaches faster than decoration or a single-vendor screenshot",
          queries: isVendorNeutralKind(kind)
            ? []
            : primaryProduct
              ? [`${primaryProduct} ${sectionTitle} workflow official`]
              : [],
          supporting: primaryProduct
            ? [`Official ${primaryProduct} docs as factual grounding (do not copy imagery)`]
            : [],
          cqIds: cqIssueIds,
          assetType: "softwareglimpse-original-visual-opportunity",
        }),
      );
    }

    // Field mapping — only when the section is actually about mapping (not every
    // migration-topic guide that merely mentions “migrate” / cutover).
    if (!hasVisual && sectionLooksLikeFieldMapping(sectionTitle, body)) {
      visualWouldHelp = true;
      recs.push(
        makeRec({
          guide,
          sectionId,
          sectionTitle,
          title: "Create original SoftwareGlimpse source-to-target field mapping diagram",
          category: "original-softwareglimpse-diagram",
          usage: "create-original-visual-based-on-source",
          level: "add-now",
          placementUse: `Insert under “${sectionTitle}” as the primary teaching visual`,
          why: "An original mapping diagram communicates the generic concept better than embedding a single-vendor screenshot",
          supporting: products.length
            ? products.slice(0, 3).map(
                (p) => `official ${p} import / field mapping documentation`,
              )
            : [
                "official HubSpot import docs",
                "official Salesforce migration docs",
                "official Pipedrive import docs",
              ],
          queries: (products.length
            ? products
            : ["hubspot", "salesforce", "pipedrive"]
          )
            .slice(0, 3)
            .flatMap((p) => [
              `${p} field mapping import documentation official`,
              `${p} data import guide official`,
            ]),
          cqIds: cqIssueIds,
          assetType: "softwareglimpse-original-visual-opportunity",
        }),
      );
      for (const p of (products.length ? products : ["hubspot", "salesforce", "pipedrive"]).slice(
        0,
        3,
      )) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: `Official ${p} import / field-mapping documentation`,
            category: "official-migration-documentation",
            usage: "cite",
            level: "source-only",
            placementUse: `Cite as supporting evidence near “${sectionTitle}” — link, do not scrape`,
            why: "Section-specific official docs beat a page-title-only search for “CRM migration”",
            products: [p],
            queries: [
              `${p} field mapping import documentation official`,
              `${p} import data guide official`,
            ],
            assetType: "official-pdf-guide",
          }),
        );
      }
    }

    // Pricing
    if (sectionLooksLikePricing(sectionTitle, body) || block.type === "cost-breakdown") {
      visualWouldHelp = !hasVisual;
      const targets = products.length ? products.slice(0, 3) : [];
      if (targets.length) {
        for (const p of targets) {
          recs.push(
            makeRec({
              guide,
              sectionId,
              sectionTitle,
              title: `${p} official pricing source`,
              category: "official-checklist-pdf-source",
              usage: "use-as-evidence",
              level: "source-only",
              placementUse: `Link official pricing near “${sectionTitle}” — never affiliate URLs as evidence`,
              why: "Pricing claims need primary vendor pricing documentation",
              products: [p],
              queries: [`${p} official pricing`],
              assetType: "official-pricing-visual",
            }),
          );
        }
      } else if (
        !hasVisual &&
        (kind === "vendor-neutral-pricing" || kind === "vendor-neutral-selection")
      ) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: "Original SoftwareGlimpse pricing-comparison teaching graphic",
            category: "original-comparison-graphic",
            usage: "create-original-visual-based-on-source",
            level: "strong-opportunity",
            placementUse: `Use an original cost-structure graphic under “${sectionTitle}”`,
            why: "Vendor-neutral pricing education should not depend on one vendor’s marketing screenshot",
            cqIds: cqIssueIds,
            assetType: "softwareglimpse-original-visual-opportunity",
          }),
        );
      }
    }

    // Security / GDPR / standards
    if (sectionLooksLikeSecurity(sectionTitle, body) || kind === "industry-guide") {
      if (sectionLooksLikeSecurity(sectionTitle, body)) {
        visualWouldHelp = !hasVisual;
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: "Authoritative primary reference (regulator / standards body)",
            category:
              /gdpr|privacy/i.test(`${sectionTitle} ${body}`)
                ? "government-regulatory-diagram"
                : "standards-body-diagram",
            usage: "cite",
            level: "strong-opportunity",
            placementUse: `Cite authoritative primary source beside “${sectionTitle}” — do not use vendor promo video as regulatory evidence`,
            why: "Vendor-neutral compliance topics need government/standards sources, not product ads",
            queries: /gdpr|privacy/i.test(`${sectionTitle} ${body}`)
              ? [
                  "GDPR official EU source",
                  "data protection CRM guidance site:europa.eu",
                ]
              : [
                  "security standards CRM access control",
                  "NIST cybersecurity framework overview",
                ],
            industries: detectIndustryIds(guide),
            assetType: "authoritative-reference-visual",
          }),
        );
        if (isProductHeavyKind(kind) && primaryProduct) {
          recs.push(
            makeRec({
              guide,
              sectionId,
              sectionTitle,
              title: `${primaryProduct} official trust / security / permissions documentation`,
              category: "official-documentation-diagram",
              usage: "link",
              level: "source-only",
              placementUse: `Link vendor trust/permissions docs under “${sectionTitle}” as product evidence — not as law`,
              why: "Product permission models are vendor-documented; keep regulatory claims on primary authorities",
              products: [primaryProduct],
              queries: [
                `${primaryProduct} trust center official`,
                `${primaryProduct} permissions documentation official`,
              ],
              assetType: "official-pdf-guide",
            }),
          );
        }
      }
    }

    // Demo / shortlist / evaluation — official product demos OK
    if (
      block.type === "product-shortlist" ||
      sectionLooksLikeDemo(sectionTitle, body)
    ) {
      visualWouldHelp = true;
      const targets = products.length ? products.slice(0, 4) : ["hubspot", "pipedrive", "salesforce"];
      for (const p of targets.slice(0, 3)) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: `${p} official product demo / tour`,
            category: "official-product-demo",
            usage: "embed",
            level: isVendorNeutralKind(kind) ? "optional" : "add-now",
            placementUse: `Optional embed/link in “${sectionTitle}” for shortlisted examples — prefer workflow demos over brand films`,
            why: isVendorNeutralKind(kind)
              ? "Early conceptual sections usually do not need vendor media; evaluation/demo sections can show UI differences via official demos"
              : "Product-focused evaluation benefits from official demos",
            products: [p],
            queries: [
              `${p} official product overview demo`,
              `${p} product tour official`,
            ],
            cqIds: cqIssueIds,
            assetType: "official-product-video",
            requiresUsageReview: true,
          }),
        );
      }
    }

    // Product-heavy implementation / setup blocks
    if (
      isProductHeavyKind(kind) &&
      primaryProduct &&
      !hasVisual &&
      (block.type === "step" ||
        block.type === "checklist" ||
        sectionLooksLikeWorkflow(sectionTitle, body))
    ) {
      visualWouldHelp = true;
      const label = sectionTitle.toLowerCase();
      if (/setup|import|onboard|getting started/.test(label)) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: `${primaryProduct} official setup / import tutorial`,
            category: "official-implementation-video",
            usage: "embed",
            level: "add-now",
            placementUse: `Embed or link beside “${sectionTitle}”`,
            why: "Product implementation guides should lean on official setup media when available",
            products: [primaryProduct],
            queries: [
              `${primaryProduct} setup guide official`,
              `${primaryProduct} import tutorial official`,
              `${primaryProduct} onboarding academy`,
            ],
            cqIds: cqIssueIds,
            assetType: "official-tutorial",
            requiresUsageReview: true,
          }),
        );
      }
      if (/pipeline|workflow|automat/.test(label)) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: `${primaryProduct} official ${/pipeline/.test(label) ? "pipeline" : "workflow"} demo`,
            category: "official-product-demo",
            usage: "embed",
            level: "add-now",
            placementUse: `Embed thumbnail/player beside “${sectionTitle}” analysis`,
            why: "Current section is text-only and official media can demonstrate configuration",
            products: [primaryProduct],
            queries: [
              `${primaryProduct} pipeline setup demo official`,
              `${primaryProduct} workflow automation demo official`,
            ],
            features: [/pipeline/.test(label) ? "pipeline-management" : "workflow-automation"],
            cqIds: cqIssueIds,
            assetType: "official-feature-demo",
            requiresUsageReview: true,
          }),
        );
      }
      if (/permission|role|access/.test(label)) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: `${primaryProduct} official permissions documentation`,
            category: "official-documentation-diagram",
            usage: "link",
            level: "source-only",
            placementUse: `Link docs under “${sectionTitle}”`,
            why: "Permissions are best evidenced by official help-center docs; prefer original SG diagram for teaching the model",
            products: [primaryProduct],
            queries: [`${primaryProduct} permissions roles documentation official`],
            assetType: "official-pdf-guide",
          }),
        );
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: `Original SoftwareGlimpse ${primaryProduct} permission model diagram`,
            category: "original-softwareglimpse-diagram",
            usage: "create-original-visual-based-on-source",
            level: "strong-opportunity",
            placementUse: `Teaching diagram under “${sectionTitle}” grounded in official docs`,
            why: "Copying vendor UI screenshots is weaker than an original explanatory permission model",
            products: [primaryProduct],
            supporting: [`${primaryProduct} official permissions documentation`],
            cqIds: cqIssueIds,
            assetType: "softwareglimpse-original-visual-opportunity",
          }),
        );
      }
    }

    // Checklist without visual
    if (
      !hasVisual &&
      (block.type === "checklist" || block.type === "selection-checklist")
    ) {
      visualWouldHelp = true;
      recs.push(
        makeRec({
          guide,
          sectionId,
          sectionTitle,
          title: `Original SoftwareGlimpse checklist visualization for “${sectionTitle}”`,
          category: "original-checklist-visualization",
          usage: "create-original-visual-based-on-source",
          level: "optional",
          placementUse: `Optional visual summary above/beside the checklist — only if it improves scannability`,
          why: "Do not decorate; only add a checklist visual when it clarifies grouping or sequence",
          cqIds: cqIssueIds,
          assetType: "softwareglimpse-original-visual-opportunity",
        }),
      );
    }

    // Feature matrix / comparison without figure
    if (
      !hasVisual &&
      (block.type === "feature-matrix" ||
        block.type === "comparison-framework" ||
        block.type === "size-match")
    ) {
      visualWouldHelp = true;
      recs.push(
        makeRec({
          guide,
          sectionId,
          sectionTitle,
          title: `Original SoftwareGlimpse comparison graphic for “${sectionTitle}”`,
          category: "original-comparison-graphic",
          usage: "create-original-visual-based-on-source",
          level: "strong-opportunity",
          placementUse: `Add a teaching matrix/graphic under “${sectionTitle}”`,
          why: "Comparison sections benefit from original SG graphics, not vendor promo screenshots",
          cqIds: cqIssueIds,
          assetType: "softwareglimpse-original-visual-opportunity",
        }),
      );
    }

    // Interactive CTA / tools
    if (block.type === "interactive-cta") {
      recs.push(
        makeRec({
          guide,
          sectionId,
          sectionTitle,
          title: "Tool CTA teaching visual (e.g. Requirements Builder)",
          category: "tool-cta-visual",
          usage: "create-original-visual-based-on-source",
          level: "optional",
          placementUse: `Support the CTA with a small original UI mock of the SoftwareGlimpse tool — not a vendor asset`,
          why: "Tool CTAs convert better with a clear original product visual of the SG tool itself",
          assetType: "softwareglimpse-original-visual-opportunity",
        }),
      );
    }

    // Industry architecture opportunity once per industry guide on overview-like blocks
    if (
      kind === "industry-guide" &&
      !hasVisual &&
      (block.type === "decision-framework" || block.type === "step") &&
      !sectionTitle.toLowerCase().includes("quick answer")
    ) {
      // only add one architecture rec for first such section without visual
      if (
        !allRecs.some(
          (r) =>
            r.category === "original-softwareglimpse-diagram" &&
            r.title.includes("architecture"),
        )
      ) {
        visualWouldHelp = true;
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title: "Original SoftwareGlimpse industry CRM architecture / workflow diagram",
            category: "original-softwareglimpse-diagram",
            usage: "create-original-visual-based-on-source",
            level: "add-now",
            placementUse: `Primary teaching visual near “${sectionTitle}”`,
            why: "Industry guides need an original architecture/workflow explanation; vendor promo videos are not regulatory evidence",
            industries: detectIndustryIds(guide),
            cqIds: cqIssueIds,
            assetType: "softwareglimpse-original-visual-opportunity",
          }),
        );
      }
    }

    // Vendor-neutral fundamentals: discourage early vendor media
    if (
      isVendorNeutralKind(kind) &&
      (block.type === "direct-answer" || block.type === "key-takeaways") &&
      !hasVisual &&
      !guide.heroVisual?.src
    ) {
      visualWouldHelp = true;
      if (
        !allRecs.some(
          (r) =>
            r.category === "original-softwareglimpse-diagram" &&
            (r.title.includes("buying journey") ||
              r.title.includes("concept diagram")),
        )
      ) {
        recs.push(
          makeRec({
            guide,
            sectionId,
            sectionTitle,
            title:
              kind === "vendor-neutral-selection"
                ? "Original SoftwareGlimpse CRM buying journey diagram"
                : "Original SoftwareGlimpse concept diagram for this guide’s core idea",
            category: "original-softwareglimpse-diagram",
            usage: "create-original-visual-based-on-source",
            level: "add-now",
            placementUse: `Hero/body teaching visual for “${sectionTitle}” — official vendor media usually NOT necessary here`,
            why: "Conceptual sections improve with original SG diagrams; early vendor embeds distract from vendor-neutral teaching",
            cqIds: cqIssueIds,
            assetType: "softwareglimpse-original-visual-opportunity",
          }),
        );
      }
    } else if (
      isVendorNeutralKind(kind) &&
      (block.type === "direct-answer" || block.type === "key-takeaways") &&
      guide.heroVisual?.src
    ) {
      current.push(
        "Hero visual present — early conceptual vendor media usually not necessary",
      );
    }
    sections.push({
      sectionId,
      sectionTitle,
      blockType: block.type,
      hasTeachingVisual: hasVisual,
      visualWouldHelp,
      current: current.length ? current : ["Prose-only / no figure"],
      recommendations: recs,
    });
    allRecs.push(...recs);
  }

  // Hero opportunity
  if (!guide.heroVisual?.src) {
    const heroRec = makeRec({
      guide,
      sectionId: "hero",
      sectionTitle: "Guide hero",
      title: "Unique SoftwareGlimpse hero teaching visual",
      category: "original-softwareglimpse-diagram",
      usage: "create-original-visual-based-on-source",
      level: "add-now",
      placementUse: "Set guide.heroVisual to a unique teaching illustration for this slug",
      why: "Published guides should have a unique hero visual — never reuse another guide’s artwork",
      cqIds: cqIssueIds,
      assetType: "softwareglimpse-original-visual-opportunity",
    });
    allRecs.unshift(heroRec);
    sections.unshift({
      sectionId: "hero",
      sectionTitle: "Guide hero",
      hasTeachingVisual: false,
      visualWouldHelp: true,
      current: ["Missing unique heroVisual"],
      recommendations: [heroRec],
    });
  }

  return { sections, recommendations: allRecs };
}

export function loadContentQualityVisualContext(guide: GuidePage): {
  score?: number;
  issueIds: string[];
  mediaGaps: string[];
} {
  try {
    const snap = cqSnapshotFromGuide(guide);
    const assessment = evaluatePageQuality(snap, {
      evaluatedAt: "2026-08-15T06:00:00.000Z",
    });
    const mediaDim = assessment.dimensions.find(
      (d) => d.id === "visual-media-support",
    );
    const score = mediaDim?.score;
    const issueIds: string[] = [];
    if (score !== undefined && score <= 2) {
      issueIds.push(cqVisualIssueId(guide.slug));
    }
    return {
      score,
      issueIds,
      mediaGaps: assessment.mediaGaps ?? [],
    };
  } catch {
    return { issueIds: [], mediaGaps: [] };
  }
}

export function buildSearchTasksFromRecommendations(
  recommendations: GuideAssetRecommendation[],
) {
  const tasks = [];
  for (const rec of recommendations) {
    for (const [i, query] of rec.searchQueries.entries()) {
      tasks.push(
        AssetSearchTaskSchema.parse({
          id: slugId(["search", rec.id, String(i + 1)]),
          opportunityId: rec.id,
          query,
          preferredSourceTypes:
            rec.category.includes("government") ||
            rec.category.includes("standards")
              ? ["government", "regulator", "standards-body", "authoritative-primary"]
              : [
                  "vendor-official-site",
                  "vendor-documentation",
                  "vendor-help-center",
                  "vendor-youtube",
                  "vendor-academy",
                ],
          notes: "Section-derived query — prefer primary sources; no third-party review sites",
        }),
      );
    }
  }
  return tasks;
}

export { classifyGuideKind, detectIndustryIds };
