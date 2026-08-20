import type {
  AssetNeedType,
  AssetOpportunity,
  AssetType,
  PageAssetSnapshot,
} from "@/domain/schemas/asset-discovery";
import { AssetOpportunitySchema } from "@/domain/schemas/asset-discovery";

/**
 * Discover visual/media asset needs from a page snapshot BEFORE searching.
 * Presence/absence of media must never influence software rankings.
 */

type NeedTemplate = {
  needType: AssetNeedType;
  sectionKinds: PageAssetSnapshot["sections"][number]["kind"][];
  preferredAssetTypes: AssetType[];
  importance: AssetOpportunity["importance"];
  purpose: AssetOpportunity["purpose"];
  description: (sectionTitle: string, context: string) => string;
  /** When true, create even if section already has a visual (deeper evidence). */
  alwaysSuggest?: boolean;
  skipIfHasVisual?: boolean;
  skipIfHasOfficialVideo?: boolean;
  skipIfHasScreenshot?: boolean;
};

const PRODUCT_NEED_TEMPLATES: NeedTemplate[] = [
  {
    needType: "overview-demo",
    sectionKinds: ["overview"],
    preferredAssetTypes: [
      "official-product-video",
      "official-product-tour",
      "official-feature-demo",
    ],
    importance: "high",
    purpose: "demonstrate",
    description: (t, ctx) =>
      `Official product overview demo for ${ctx} (${t})`,
    skipIfHasOfficialVideo: true,
  },
  {
    needType: "feature-demo",
    sectionKinds: ["features"],
    preferredAssetTypes: [
      "official-feature-demo",
      "official-workflow-demo",
      "official-screenshot",
      "official-ui-image",
    ],
    importance: "high",
    purpose: "demonstrate",
    description: (t, ctx) =>
      `Feature / workflow visual evidence for ${ctx} — ${t}`,
    skipIfHasOfficialVideo: true,
  },
  {
    needType: "ui-screenshot",
    sectionKinds: ["features", "overview"],
    preferredAssetTypes: ["official-screenshot", "official-ui-image"],
    importance: "medium",
    purpose: "evidence",
    description: (t, ctx) =>
      `Official UI screenshot / help-center visual for ${ctx} — ${t}`,
    skipIfHasScreenshot: true,
  },
  {
    needType: "setup-tutorial",
    sectionKinds: ["implementation"],
    preferredAssetTypes: [
      "official-tutorial",
      "official-pdf-guide",
      "official-webinar",
    ],
    importance: "high",
    purpose: "explain",
    description: (t, ctx) =>
      `Official setup / onboarding tutorial for ${ctx} — ${t}`,
    skipIfHasOfficialVideo: true,
  },
  {
    needType: "pricing-evidence",
    sectionKinds: ["pricing"],
    preferredAssetTypes: ["official-pricing-visual"],
    importance: "medium",
    purpose: "evidence",
    description: (t, ctx) =>
      `Official pricing documentation / visual for ${ctx} — ${t}`,
  },
  {
    needType: "integration-diagram",
    sectionKinds: ["integrations"],
    preferredAssetTypes: [
      "official-integration-diagram",
      "official-diagram",
      "softwareglimpse-original-visual-opportunity",
    ],
    importance: "medium",
    purpose: "explain",
    description: (t, ctx) =>
      `Integration architecture / directory visual for ${ctx} — ${t}`,
    skipIfHasVisual: true,
  },
  {
    needType: "customer-story",
    sectionKinds: ["evidence"],
    preferredAssetTypes: ["official-customer-story"],
    importance: "low",
    purpose: "trust",
    description: (t, ctx) =>
      `Official vendor customer-story media for ${ctx} — ${t} (vendor claims only)`,
  },
];

const GUIDE_NEED_TEMPLATES: NeedTemplate[] = [
  {
    needType: "teaching-diagram",
    sectionKinds: ["teaching", "workflow", "overview"],
    preferredAssetTypes: [
      "softwareglimpse-original-visual-opportunity",
      "official-workflow-diagram",
      "authoritative-reference-visual",
    ],
    importance: "high",
    purpose: "explain",
    description: (t) =>
      `Teaching diagram opportunity for guide section “${t}” — prefer original SoftwareGlimpse visual grounded in facts`,
    skipIfHasVisual: true,
  },
  {
    needType: "workflow-diagram",
    sectionKinds: ["workflow"],
    preferredAssetTypes: [
      "official-workflow-diagram",
      "softwareglimpse-original-visual-opportunity",
      "authoritative-reference-visual",
    ],
    importance: "high",
    purpose: "explain",
    description: (t) => `Workflow diagram for “${t}”`,
    skipIfHasVisual: true,
  },
  {
    needType: "feature-demo",
    sectionKinds: ["features"],
    preferredAssetTypes: [
      "official-feature-demo",
      "official-workflow-demo",
      "official-tutorial",
    ],
    importance: "medium",
    purpose: "demonstrate",
    description: (t, ctx) =>
      `Official feature/workflow demo to illustrate “${t}”${ctx ? ` (${ctx})` : ""}`,
    skipIfHasOfficialVideo: true,
  },
  {
    needType: "authoritative-reference",
    sectionKinds: ["security", "evidence"],
    preferredAssetTypes: [
      "authoritative-reference-visual",
      "official-pdf-guide",
    ],
    importance: "medium",
    purpose: "evidence",
    description: (t) =>
      `Authoritative primary / standards / regulator visual for “${t}”`,
  },
  {
    needType: "setup-tutorial",
    sectionKinds: ["implementation"],
    preferredAssetTypes: ["official-tutorial", "official-pdf-guide"],
    importance: "medium",
    purpose: "explain",
    description: (t) => `Official setup / implementation tutorial for “${t}”`,
  },
];

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function productContext(snap: PageAssetSnapshot): string {
  return snap.productIds[0] ?? snap.title;
}

function templatesForPage(
  snap: PageAssetSnapshot,
): NeedTemplate[] {
  if (
    snap.pageType === "product-review" ||
    snap.pageType === "product-guide"
  ) {
    return PRODUCT_NEED_TEMPLATES;
  }
  return GUIDE_NEED_TEMPLATES;
}

function shouldSkip(
  template: NeedTemplate,
  section: PageAssetSnapshot["sections"][number],
): boolean {
  if (template.skipIfHasOfficialVideo && section.hasOfficialVideo) return true;
  if (template.skipIfHasScreenshot && section.hasScreenshot) return true;
  if (template.skipIfHasVisual && section.hasVisual) return true;
  return false;
}

/**
 * Build explicit AssetOpportunity records from page structure.
 * Does not search the web.
 */
export function discoverAssetOpportunities(
  snap: PageAssetSnapshot,
): AssetOpportunity[] {
  const opportunities: AssetOpportunity[] = [];
  const templates = templatesForPage(snap);
  const ctx = productContext(snap);
  const sections =
    snap.sections.length > 0
      ? snap.sections
      : [
          {
            id: "page",
            title: snap.title,
            kind: "overview" as const,
            topics: [],
            hasVisual: snap.existingFigureCount > 0,
            hasOfficialVideo: snap.existingOfficialVideoCount > 0,
            hasScreenshot: snap.existingScreenshotCount > 0,
            claimHeavy: false,
          },
        ];

  for (const section of sections) {
    for (const template of templates) {
      if (!template.sectionKinds.includes(section.kind)) continue;
      if (!template.alwaysSuggest && shouldSkip(template, section)) {
        // Still record as satisfied-existing when coverage is present
        if (
          (template.skipIfHasOfficialVideo && section.hasOfficialVideo) ||
          (template.skipIfHasScreenshot && section.hasScreenshot) ||
          (template.skipIfHasVisual && section.hasVisual)
        ) {
          const id = `opp-${slugPart(snap.pageId)}-${slugPart(section.id)}-${template.needType}-satisfied`;
          opportunities.push(
            AssetOpportunitySchema.parse({
              id,
              pageId: snap.pageId,
              route: snap.route,
              pageType: snap.pageType,
              sectionId: section.id,
              sectionTitle: section.title,
              productId: snap.productIds[0],
              industryId: snap.industryIds[0],
              useCaseId: snap.useCaseIds[0],
              capabilityId: snap.capabilityIds[0],
              requirementId: snap.requirementIds[0],
              featureId: snap.featureIds[0] ?? section.topics[0],
              needType: template.needType,
              description: template.description(section.title, ctx),
              preferredAssetTypes: template.preferredAssetTypes,
              importance: template.importance,
              purpose: template.purpose,
              status: "satisfied-existing",
              existingAssetIds: snap.existingMediaIds,
            }),
          );
        }
        continue;
      }

      const id = `opp-${slugPart(snap.pageId)}-${slugPart(section.id)}-${template.needType}`;
      opportunities.push(
        AssetOpportunitySchema.parse({
          id,
          pageId: snap.pageId,
          route: snap.route,
          pageType: snap.pageType,
          sectionId: section.id,
          sectionTitle: section.title,
          productId: snap.productIds[0],
          industryId: snap.industryIds[0],
          useCaseId: snap.useCaseIds[0],
          capabilityId: snap.capabilityIds[0],
          requirementId: snap.requirementIds[0],
          featureId: snap.featureIds[0] ?? section.topics[0],
          needType: template.needType,
          description: template.description(section.title, ctx),
          preferredAssetTypes: template.preferredAssetTypes,
          importance: template.importance,
          purpose: template.purpose,
          status: "open",
          existingAssetIds: [],
        }),
      );
    }
  }

  // Brand / logo opportunity for product pages lacking logo evidence note
  if (
    (snap.pageType === "product-review" ||
      snap.pageType === "product-guide") &&
    snap.productIds[0]
  ) {
    opportunities.push(
      AssetOpportunitySchema.parse({
        id: `opp-${slugPart(snap.pageId)}-brand-logo`,
        pageId: snap.pageId,
        route: snap.route,
        pageType: snap.pageType,
        sectionId: "brand",
        sectionTitle: "Brand assets",
        productId: snap.productIds[0],
        needType: "brand-logo",
        description: `Official brand / logo assets for ${ctx} (prefer vendor brand center)`,
        preferredAssetTypes: ["official-logo", "official-brand-asset"],
        importance: "low",
        purpose: "navigation",
        status: "open",
      }),
    );
  }

  // Industry guides: prefer authoritative refs for compliance topics
  if (
    snap.industryIds.length > 0 &&
    snap.pageType === "guide" &&
    !opportunities.some((o) => o.needType === "authoritative-reference")
  ) {
    opportunities.push(
      AssetOpportunitySchema.parse({
        id: `opp-${slugPart(snap.pageId)}-authoritative-ref`,
        pageId: snap.pageId,
        route: snap.route,
        pageType: snap.pageType,
        sectionId: "authoritative",
        sectionTitle: "Authoritative references",
        productId: snap.productIds[0],
        industryId: snap.industryIds[0],
        needType: "authoritative-reference",
        description:
          "Standards-body / regulator / government reference visuals where relevant (non-vendor topics)",
        preferredAssetTypes: ["authoritative-reference-visual"],
        importance: "medium",
        purpose: "evidence",
        status: "open",
      }),
    );
  }

  return opportunities;
}
