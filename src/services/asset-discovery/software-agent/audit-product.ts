import type {
  ProductMedia,
  ProductResearchEnrichment,
  ResearchSource,
  Software,
} from "@/domain";
import {
  SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
  SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION,
  SoftwareProductAssetAuditSchema,
  type AssetSearchTask,
  type SoftwareAssetRecommendation,
  type SoftwareHubSectionId,
  type SoftwareProductAssetAudit,
  type SoftwareSectionAudit,
} from "@/domain/schemas/asset-discovery";
import { AssetSearchTaskSchema } from "@/domain/schemas/asset-discovery";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";
import { getVendorOfficialSourceEntry } from "../vendor-registry";
import {
  detectStaleMedia,
  featureSearchLabel,
  findExistingMediaForNeed,
  hasOriginalSgDiagramForFeature,
  hasOriginalSgDiagramForUseCase,
  listActiveOfficialMedia,
  officialSourcesAsEvidenceCandidates,
  selectIndustriesForSearch,
  selectMajorFeaturesForSearch,
  selectUseCasesForSearch,
  toCoverageItems,
} from "./analyze";
import {
  classifyRecommendationLevel,
  rateMediaCoverage,
} from "./rating";

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

function searchTask(
  id: string,
  opportunityId: string,
  query: string,
  domains: string[],
  notes?: string,
): AssetSearchTask {
  return AssetSearchTaskSchema.parse({
    id,
    opportunityId,
    query,
    preferredDomains: domains,
    preferredSourceTypes: [
      "vendor-official-site",
      "vendor-documentation",
      "vendor-help-center",
      "vendor-youtube",
      "vendor-academy",
    ],
    notes,
  });
}

function reuseRec(input: {
  product: Software;
  media: ProductMedia;
  sectionId: SoftwareHubSectionId;
  sectionTitle: string;
  subsection?: string;
}): SoftwareAssetRecommendation {
  return {
    id: slugId(["reuse", input.product.slug, input.media.id]),
    title: input.media.title,
    assetType:
      input.media.type === "official-tutorial"
        ? "official-tutorial"
        : input.media.type === "official-webinar"
          ? "official-webinar"
          : input.media.type === "official-customer-case-study"
            ? "official-customer-story"
            : "official-product-video",
    mediaFormat: "video",
    sourceUrl: input.media.sourceUrl,
    officialSource: input.media.officialSource,
    sourceOrganization: input.media.sourceOrganization,
    whatItShows: input.media.whatThisShows?.length
      ? input.media.whatThisShows
      : input.media.whatToNotice ?? [],
    freshnessStatus: "acceptable",
    embedStatus:
      input.media.status === "embedding-disabled" ||
      input.media.embeddingAllowed === false
        ? "link-only"
        : "embeddable",
    usageRecommendation:
      input.media.status === "embedding-disabled" ? "link" : "embed",
    recommendationLevel: "reuse-existing",
    placement: {
      pageRoute: `/software/${input.product.slug}/`,
      sectionId: input.sectionId,
      sectionTitle: input.sectionTitle,
      subsection: input.subsection,
      recommendedUse:
        "Reuse existing ResearchMedia — do not create a duplicate record",
      why: "Same official asset already catalogued on enrichment",
    },
    productIds: [input.product.slug],
    featureIds: input.media.featureIds,
    capabilityIds: input.media.capabilityIds,
    requirementIds: input.media.requirementIds,
    useCaseIds: input.media.useCaseIds,
    industryIds: input.media.industryIds,
    reuseOfMediaId: input.media.id,
    reason: "REUSE EXISTING MEDIA — already in ResearchMedia",
    searchQueries: [],
  };
}

function openSearchRec(input: {
  product: Software;
  id: string;
  title: string;
  assetType: SoftwareAssetRecommendation["assetType"];
  sectionId: SoftwareHubSectionId;
  sectionTitle: string;
  subsection?: string;
  why: string;
  recommendedUse: string;
  featureIds?: string[];
  useCaseIds?: string[];
  industryIds?: string[];
  specificity: "high" | "medium" | "low";
  sectionImportance: "critical" | "high" | "medium" | "low";
  queries: string[];
}): SoftwareAssetRecommendation {
  const level = classifyRecommendationLevel({
    hasSourceUrl: false,
    officialSource: false,
    reuseExisting: false,
    specificity: input.specificity,
    sectionImportance: input.sectionImportance,
  });
  return {
    id: input.id,
    title: input.title,
    assetType: input.assetType,
    officialSource: false,
    whatItShows: [],
    freshnessStatus: "unknown",
    embedStatus: "unknown",
    recommendationLevel: level,
    placement: {
      pageRoute: `/software/${input.product.slug}/`,
      sectionId: input.sectionId,
      sectionTitle: input.sectionTitle,
      subsection: input.subsection,
      recommendedUse: input.recommendedUse,
      why: input.why,
    },
    productIds: [input.product.slug],
    featureIds: input.featureIds ?? [],
    capabilityIds: [],
    requirementIds: [],
    useCaseIds: input.useCaseIds ?? [],
    industryIds: input.industryIds ?? [],
    reason: `${level}: ${input.why}`,
    searchQueries: input.queries,
  };
}

function sourceLinkRec(input: {
  product: Software;
  source: ResearchSource;
  sectionId: SoftwareHubSectionId;
  sectionTitle: string;
  assetType: SoftwareAssetRecommendation["assetType"];
  why: string;
}): SoftwareAssetRecommendation | null {
  if (!input.source.url) return null;
  return {
    id: slugId(["src", input.product.slug, input.source.id]),
    title: input.source.title ?? input.source.url,
    assetType: input.assetType,
    mediaFormat: "page",
    sourceUrl: input.source.url,
    officialSource: true,
    sourceOrganization: input.source.publisher,
    whatItShows: input.source.notes ? [input.source.notes] : [],
    freshnessStatus: "acceptable",
    embedStatus: "not-applicable",
    usageRecommendation: "use-as-evidence",
    recommendationLevel: "source-only",
    placement: {
      pageRoute: `/software/${input.product.slug}/`,
      sectionId: input.sectionId,
      sectionTitle: input.sectionTitle,
      recommendedUse: "Link / cite as evidence — do not scrape or rehost",
      why: input.why,
    },
    productIds: [input.product.slug],
    featureIds: [],
    capabilityIds: [],
    requirementIds: [],
    useCaseIds: [],
    industryIds: [],
    reason: "SOURCE ONLY — official documentation/pricing already in ResearchSource",
    searchQueries: [],
  };
}

/**
 * SoftwareAssetDiscoveryAgent — audit one product page.
 * Recommendations only. Never edits product pages or enrichment.
 */
export function auditSoftwareProductAssets(input: {
  software: Software;
  enrichment?: ProductResearchEnrichment | null;
  sources?: ResearchSource[];
  generatedAt?: string;
}): SoftwareProductAssetAudit {
  const product = input.software;
  const enrichment = input.enrichment ?? null;
  const sources = input.sources?.length
    ? input.sources
    : product.sources ?? [];
  const media = enrichment?.media ?? [];
  const screenshots = enrichment?.screenshots ?? [];
  const activeOfficial = listActiveOfficialMedia(media);
  const officialLinks = resolveProductOfficialLinks({
    ...product,
    sources,
  });
  const registry = getVendorOfficialSourceEntry(product.slug);
  const domains = registry
    ? [
        ...registry.officialDomains,
        ...registry.documentationDomains,
        ...registry.helpCenterDomains,
        ...registry.academyDomains,
      ]
    : [];

  const majorFeatures = selectMajorFeaturesForSearch({
    software: product,
    enrichment,
  });
  const useCases = selectUseCasesForSearch(product);
  const industries = selectIndustriesForSearch(product);

  const searchTasks: AssetSearchTask[] = [];
  const recommendations: SoftwareAssetRecommendation[] = [];
  const sections: SoftwareSectionAudit[] = [];

  const overviewMedia = findExistingMediaForNeed({
    media,
    placement: "overview",
  });
  const featureMedia = activeOfficial.filter(
    (m) => m.featureIds.length > 0 || m.placements.includes("features"),
  );
  const implMedia = findExistingMediaForNeed({
    media,
    placement: "implementation",
    types: ["official-tutorial", "official-video", "official-webinar"],
  });
  const useCaseMedia = activeOfficial.filter((m) => m.useCaseIds.length > 0);
  const industryMedia = activeOfficial.filter((m) => m.industryIds.length > 0);

  // ---- Overview ----
  const overviewCurrent: string[] = [];
  const overviewGaps: string[] = [];
  const overviewOpps: SoftwareAssetRecommendation[] = [];
  if (overviewMedia) {
    overviewCurrent.push(
      `Official video: ${overviewMedia.title} (${overviewMedia.id})`,
    );
    overviewOpps.push(
      reuseRec({
        product,
        media: overviewMedia,
        sectionId: "overview",
        sectionTitle: "Overview",
      }),
    );
  } else {
    overviewGaps.push("No overview official product tour/demo on ResearchMedia");
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "overview-demo"]),
      title: `${product.name} official product overview / tour`,
      assetType: "official-product-video",
      sectionId: "overview",
      sectionTitle: "Overview",
      why: "Overview section would benefit from an official product tour or demo",
      recommendedUse:
        "Embed thumbnail/player near the editorial verdict / product summary",
      specificity: "medium",
      sectionImportance: "high",
      queries: [
        `${product.name} official product overview demo`,
        `${product.name} product tour official`,
      ],
    });
    overviewOpps.push(opp);
    recommendations.push(opp);
    for (const q of opp.searchQueries) {
      searchTasks.push(
        searchTask(
          slugId(["search", opp.id, q.slice(0, 24)]),
          opp.id,
          q,
          domains,
          "Prefer vendor YouTube / official site — not third-party review sites",
        ),
      );
    }
  }
  sections.push({
    sectionId: "overview",
    sectionTitle: "Overview",
    current: overviewCurrent,
    gaps: overviewGaps,
    proseHeavy: !overviewMedia,
    opportunities: overviewOpps,
  });

  // ---- Features (major only) ----
  const featureCurrent = featureMedia.map(
    (m) => `${m.title} → features: ${m.featureIds.join(", ") || "general"}`,
  );
  const featureGaps: string[] = [];
  const featureOpps: SoftwareAssetRecommendation[] = [];
  for (const featureSlug of majorFeatures) {
    const existing = findExistingMediaForNeed({
      media,
      featureId: featureSlug,
    });
    const label = featureSearchLabel(featureSlug);
    if (existing) {
      featureCurrent.push(
        `REUSE: ${existing.title} covers ${featureSlug}`,
      );
      featureOpps.push(
        reuseRec({
          product,
          media: existing,
          sectionId: "features",
          sectionTitle: "Features",
          subsection: label,
        }),
      );
      continue;
    }
    featureGaps.push(`No official demo mapped to feature “${featureSlug}”`);
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "feature", featureSlug]),
      title: `${product.name} official ${label} demo`,
      assetType: "official-feature-demo",
      sectionId: "features",
      sectionTitle: "Features",
      subsection: label,
      why: `Features → ${label} is text/analysis-heavy without a mapped official demonstration`,
      recommendedUse: `Embed beside the ${label} feature analysis card/row`,
      featureIds: [featureSlug],
      specificity: "high",
      sectionImportance: "high",
      queries: [
        `${product.name} ${label} official demo`,
        `${product.name} ${label} tutorial official`,
        `${product.name} ${label} site:youtube.com`,
      ],
    });
    featureOpps.push(opp);
    recommendations.push(opp);
    for (const q of opp.searchQueries) {
      searchTasks.push(
        searchTask(slugId(["search", opp.id, q.slice(0, 20)]), opp.id, q, domains),
      );
    }
  }
  sections.push({
    sectionId: "features",
    sectionTitle: "Features",
    current: [...new Set(featureCurrent)],
    gaps: featureGaps,
    proseHeavy: featureGaps.length > 0,
    opportunities: featureOpps,
  });

  // ---- Use cases ----
  const ucCurrent = useCaseMedia.map(
    (m) => `${m.title} → ${m.useCaseIds.join(", ")}`,
  );
  const ucGaps: string[] = [];
  const ucOpps: SoftwareAssetRecommendation[] = [];
  for (const useCaseSlug of useCases) {
    const existing = findExistingMediaForNeed({
      media,
      useCaseId: useCaseSlug,
    });
    const label = useCaseSlug.replace(/-/g, " ");
    if (existing) {
      ucOpps.push(
        reuseRec({
          product,
          media: existing,
          sectionId: "use-cases",
          sectionTitle: "Use Cases",
          subsection: label,
        }),
      );
      continue;
    }
    ucGaps.push(`No workflow demo mapped to use case “${useCaseSlug}”`);
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "usecase", useCaseSlug]),
      title: `${product.name} ${label} workflow demo`,
      assetType: "official-workflow-demo",
      sectionId: "use-cases",
      sectionTitle: "Use Cases",
      subsection: label,
      why: `Use Cases → ${label} lacks an official workflow demonstration`,
      recommendedUse: `Embed or link in the ${label} use-case panel`,
      useCaseIds: [useCaseSlug],
      specificity: "high",
      sectionImportance: "high",
      queries: [
        `${product.name} ${label} workflow demo official`,
        `${product.name} ${label} tutorial official`,
      ],
    });
    ucOpps.push(opp);
    recommendations.push(opp);
    for (const q of opp.searchQueries) {
      searchTasks.push(
        searchTask(slugId(["search", opp.id, q.slice(0, 20)]), opp.id, q, domains),
      );
    }
  }
  sections.push({
    sectionId: "use-cases",
    sectionTitle: "Use Cases",
    current: ucCurrent,
    gaps: ucGaps,
    proseHeavy: ucGaps.length > 0,
    opportunities: ucOpps,
  });

  // ---- Implementation ----
  const implCurrent: string[] = [];
  const implGaps: string[] = [];
  const implOpps: SoftwareAssetRecommendation[] = [];
  if (implMedia) {
    implCurrent.push(`Official tutorial/video: ${implMedia.title}`);
    implOpps.push(
      reuseRec({
        product,
        media: implMedia,
        sectionId: "implementation",
        sectionTitle: "Implementation / setup",
      }),
    );
  } else {
    implGaps.push("No official setup/onboarding tutorial on ResearchMedia");
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "implementation-tutorial"]),
      title: `${product.name} official setup / onboarding tutorial`,
      assetType: "official-tutorial",
      sectionId: "implementation",
      sectionTitle: "Implementation / setup",
      why: "Implementation guidance is prose-heavy without an official setup walkthrough",
      recommendedUse:
        "Embed or link on Guides/implementation context and Evidence setup claims",
      specificity: "high",
      sectionImportance: "high",
      queries: [
        `${product.name} setup guide official`,
        `${product.name} onboarding tutorial official`,
        `${product.name} getting started academy`,
      ],
    });
    implOpps.push(opp);
    recommendations.push(opp);
    for (const q of opp.searchQueries) {
      searchTasks.push(
        searchTask(slugId(["search", opp.id, q.slice(0, 20)]), opp.id, q, domains),
      );
    }
  }
  sections.push({
    sectionId: "implementation",
    sectionTitle: "Implementation / setup",
    current: implCurrent,
    gaps: implGaps,
    proseHeavy: !implMedia,
    opportunities: implOpps,
  });

  // ---- Pricing ----
  const pricingSources = officialSourcesAsEvidenceCandidates(sources).filter(
    (s) =>
      s.sourceType === "official-pricing-page" ||
      s.sourceType === "pricing-page" ||
      s.domains?.includes("pricing"),
  );
  const pricingOpps: SoftwareAssetRecommendation[] = [];
  const pricingCurrent: string[] = [];
  if (officialLinks.pricing) {
    pricingCurrent.push(`Official pricing URL: ${officialLinks.pricing}`);
  }
  for (const src of pricingSources.slice(0, 2)) {
    const rec = sourceLinkRec({
      product,
      source: src,
      sectionId: "pricing",
      sectionTitle: "Pricing",
      assetType: "official-pricing-visual",
      why: "Official pricing documentation already researched — cite/link only",
    });
    if (rec) {
      pricingOpps.push(rec);
      recommendations.push(rec);
    }
  }
  if (!pricingSources.length && !officialLinks.pricing) {
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "pricing-source"]),
      title: `${product.name} official pricing page`,
      assetType: "official-pricing-visual",
      sectionId: "pricing",
      sectionTitle: "Pricing",
      why: "Pricing section lacks a verified official pricing source URL",
      recommendedUse: "Link as pricing evidence — never affiliate URL",
      specificity: "medium",
      sectionImportance: "medium",
      queries: [`${product.name} official pricing`],
    });
    pricingOpps.push(opp);
    recommendations.push(opp);
    searchTasks.push(
      searchTask(slugId(["search", opp.id]), opp.id, opp.searchQueries[0]!, domains),
    );
  }
  sections.push({
    sectionId: "pricing",
    sectionTitle: "Pricing",
    current: pricingCurrent,
    gaps: pricingSources.length || officialLinks.pricing
      ? []
      : ["No official pricing source"],
    proseHeavy: false,
    opportunities: pricingOpps,
  });

  // ---- Screenshots ----
  const shotCurrent =
    screenshots.length > 0
      ? screenshots.map((s) => s.alt || s.caption || s.id)
      : [];
  const shotGaps: string[] = [];
  const shotOpps: SoftwareAssetRecommendation[] = [];
  if (screenshots.length === 0) {
    shotGaps.push("No verified product screenshots on enrichment");
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "screenshots"]),
      title: `${product.name} official UI screenshots / help-center visuals`,
      assetType: "official-screenshot",
      sectionId: "screenshots",
      sectionTitle: "Screenshots / media",
      why: "Key UI surfaces lack screenshot evidence",
      recommendedUse:
        "Prefer original SG captures or help-center references — do not blindly rehost vendor marketing images",
      specificity: "medium",
      sectionImportance: "medium",
      queries: [
        `${product.name} official screenshots`,
        `${product.name} help center pipeline`,
      ],
    });
    shotOpps.push(opp);
    recommendations.push(opp);
    for (const q of opp.searchQueries) {
      searchTasks.push(
        searchTask(slugId(["search", opp.id, q.slice(0, 20)]), opp.id, q, domains),
      );
    }
  }
  sections.push({
    sectionId: "screenshots",
    sectionTitle: "Screenshots / media",
    current: shotCurrent,
    gaps: shotGaps,
    proseHeavy: screenshots.length === 0,
    opportunities: shotOpps,
  });

  // ---- Evidence ----
  const evidenceSources = officialSourcesAsEvidenceCandidates(sources);
  const evidenceCurrent = [
    ...activeOfficial
      .filter((m) => m.placements.includes("evidence"))
      .map((m) => m.title),
    ...evidenceSources.slice(0, 5).map((s) => s.title ?? s.url ?? s.id),
  ];
  const evidenceOpps: SoftwareAssetRecommendation[] = [];
  for (const src of evidenceSources.slice(0, 4)) {
    const rec = sourceLinkRec({
      product,
      source: src,
      sectionId: "evidence",
      sectionTitle: "Reviews & Evidence",
      assetType:
        src.sourceType === "official-help-center"
          ? "official-pdf-guide"
          : "official-product-tour",
      why: "Official source already in research inventory — cite on Evidence tab",
    });
    if (rec) {
      evidenceOpps.push(rec);
      recommendations.push(rec);
    }
  }
  sections.push({
    sectionId: "evidence",
    sectionTitle: "Reviews & Evidence",
    current: evidenceCurrent,
    gaps:
      evidenceSources.length === 0
        ? ["Few/no official ResearchSource URLs"]
        : [],
    proseHeavy: evidenceSources.length < 2 && activeOfficial.length === 0,
    opportunities: evidenceOpps,
  });

  // ---- Industry ----
  const indCurrent = industryMedia.map(
    (m) => `${m.title} → ${m.industryIds.join(", ")}`,
  );
  const indGaps: string[] = [];
  const indOpps: SoftwareAssetRecommendation[] = [];
  for (const industrySlug of industries) {
    const existing = findExistingMediaForNeed({
      media,
      industryId: industrySlug,
    });
    const label = industrySlug.replace(/-/g, " ");
    if (existing) {
      indOpps.push(
        reuseRec({
          product,
          media: existing,
          sectionId: "industry",
          sectionTitle: "Industry fit",
          subsection: label,
        }),
      );
      continue;
    }
    // Do not force — mark as optional search
    indGaps.push(
      `No official industry demo for “${industrySlug}” (optional — skip if none exists)`,
    );
    const opp = openSearchRec({
      product,
      id: slugId([product.slug, "industry", industrySlug]),
      title: `${product.name} ${label} official industry solution / demo`,
      assetType: "official-feature-demo",
      sectionId: "industry",
      sectionTitle: "Industry fit",
      subsection: label,
      why: `Product references ${label}; search official industry edition/demo only if vendor publishes one`,
      recommendedUse:
        "Only embed if genuinely industry-specific — never label a generic CRM demo as industry-specific",
      industryIds: [industrySlug],
      specificity: "medium",
      sectionImportance: "low",
      queries: [
        `${product.name} ${label} official`,
        `${product.name} ${label} cloud demo`,
      ],
    });
    // Force optional for industry when no URL
    opp.recommendationLevel = "optional";
    opp.reason = `OPTIONAL: ${opp.placement?.why}`;
    indOpps.push(opp);
    recommendations.push(opp);
    for (const q of opp.searchQueries) {
      searchTasks.push(
        searchTask(
          slugId(["search", opp.id, q.slice(0, 20)]),
          opp.id,
          q,
          domains,
          "Do not force an industry video if none exists",
        ),
      );
    }
  }
  if (industries.length === 0) {
    indCurrent.push("No industry slugs on product — industry media search skipped");
  }
  sections.push({
    sectionId: "industry",
    sectionTitle: "Industry",
    current: indCurrent,
    gaps: indGaps,
    proseHeavy: false,
    opportunities: indOpps,
  });

  // Comparisons / Alternatives / Methodology / FAQ — usually no vendor media needed
  for (const [sectionId, sectionTitle, note] of [
    [
      "comparisons",
      "Comparisons",
      "Comparison tables are SoftwareGlimpse analysis — vendor media optional only for feature proof",
    ],
    [
      "alternatives",
      "Alternatives",
      "Alternatives are editorial — do not pad with unrelated vendor brand films",
    ],
    [
      "methodology",
      "Methodology",
      "Methodology is first-party SoftwareGlimpse — no vendor asset required",
    ],
    [
      "faq",
      "FAQ",
      "FAQ is editorial — link evidence sources when claims need support",
    ],
  ] as const) {
    sections.push({
      sectionId,
      sectionTitle,
      current: [note],
      gaps: [],
      proseHeavy: false,
      opportunities: [],
    });
  }

  // Original visuals — skip features/use cases that already have SG teaching diagrams
  const originalVisualOpportunities = [
    ...(!overviewMedia ? [] : []),
    ...majorFeatures
      .slice(0, 3)
      .filter((f) => !hasOriginalSgDiagramForFeature(screenshots, f))
      .map((f) => ({
        id: slugId([product.slug, "original", f]),
        title: `Create an original SoftwareGlimpse diagram: How ${product.name} ${featureSearchLabel(f)} works`,
        description: `Redraw a teaching diagram grounded in official ${product.name} documentation — do not copy vendor imagery`,
        basedOnSourceHint:
          officialLinks.documentation ?? officialLinks.helpCenter,
        relatedFeatureIds: [f],
        relatedUseCaseIds: [] as string[],
        sectionId: "features" as const,
        priority: "medium" as const,
      })),
    ...(useCases[0] &&
    !hasOriginalSgDiagramForUseCase(screenshots, useCases[0])
      ? [
          {
            id: slugId([product.slug, "original", "workflow", useCases[0]]),
            title: `Create an original SoftwareGlimpse workflow: ${product.name} ${useCases[0].replace(/-/g, " ")}`,
            description:
              "Original workflow diagram based on verified product behavior — separate from official asset reuse",
            basedOnSourceHint: officialLinks.documentation,
            relatedFeatureIds: [] as string[],
            relatedUseCaseIds: [useCases[0]],
            sectionId: "use-cases" as const,
            priority: "high" as const,
          },
        ]
      : []),
  ];

  const staleAssets = detectStaleMedia({ media, screenshots });

  // Avoid list — placeholder pattern for generic brand ads (no invented URLs)
  const assetsToAvoid: SoftwareAssetRecommendation[] = [
    {
      id: slugId([product.slug, "avoid-generic-brand"]),
      title: `Generic ${product.name} brand / culture film (if found)`,
      assetType: "official-product-video",
      officialSource: false,
      recommendationLevel: "do-not-use",
      reason:
        "DO NOT USE: old branding ads or culture films with no product UI/workflow — even on an official channel",
      whatItShows: [],
      searchQueries: [],
      productIds: [product.slug],
      featureIds: [],
      capabilityIds: [],
      requirementIds: [],
      useCaseIds: [],
      industryIds: [],
      embedStatus: "not-applicable",
      freshnessStatus: "unknown",
    },
  ];

  const proseHeavyGaps = sections.filter((s) => s.proseHeavy).length;
  const coverage = rateMediaCoverage({
    officialVideoCount: activeOfficial.length,
    screenshotCount: screenshots.length,
    officialSourceCount: evidenceSources.length,
    hasOverviewVideo: Boolean(overviewMedia),
    hasFeatureSpecificVideo: featureMedia.some((m) => m.featureIds.length > 0),
    hasImplementationVideo: Boolean(implMedia),
    proseHeavyGaps,
    staleCount: staleAssets.length,
  });

  // Deduplicate recommendations into primary list (open + source + already added)
  const reuseOnes = sections
    .flatMap((s) => s.opportunities)
    .filter((o) => o.recommendationLevel === "reuse-existing");
  const allRecs = [...reuseOnes, ...recommendations];

  const addNow = allRecs.filter((r) => r.recommendationLevel === "add-now");
  const strong = allRecs.filter(
    (r) => r.recommendationLevel === "strong-opportunity",
  );
  const implementationOrder = [
    ...addNow.map(
      (r) =>
        `ADD NOW: ${r.title}${r.placement ? ` → ${r.placement.sectionTitle}${r.placement.subsection ? ` / ${r.placement.subsection}` : ""}` : ""}`,
    ),
    ...strong.map(
      (r) =>
        `STRONG: ${r.title}${r.searchQueries[0] ? ` (search: ${r.searchQueries[0]})` : ""}`,
    ),
    ...staleAssets
      .slice(0, 5)
      .map((s) => `REFRESH: ${s.title} — ${s.refreshRecommendation}`),
    ...originalVisualOpportunities
      .slice(0, 3)
      .map((o) => `ORIGINAL: ${o.title}`),
  ];

  return SoftwareProductAssetAuditSchema.parse({
    agentId: SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
    agentVersion: SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION,
    productSlug: product.slug,
    productName: product.name,
    route: `/software/${product.slug}/`,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    coverageRating: coverage.rating,
    coverageReason: coverage.reason,
    currentMedia: toCoverageItems(activeOfficial),
    currentScreenshotCount: screenshots.length,
    currentOfficialVideoCount: activeOfficial.length,
    currentOfficialSourceCount: evidenceSources.length,
    sections,
    recommendations: allRecs,
    staleAssets,
    originalVisualOpportunities,
    assetsToAvoid,
    implementationOrder,
    searchTasks,
    majorFeaturesSearched: majorFeatures,
    useCasesSearched: useCases,
    industriesSearched: industries,
    summary: {
      addNow: allRecs.filter((r) => r.recommendationLevel === "add-now").length,
      strongOpportunity: allRecs.filter(
        (r) => r.recommendationLevel === "strong-opportunity",
      ).length,
      optional: allRecs.filter((r) => r.recommendationLevel === "optional")
        .length,
      sourceOnly: allRecs.filter((r) => r.recommendationLevel === "source-only")
        .length,
      reuseExisting: allRecs.filter(
        (r) => r.recommendationLevel === "reuse-existing",
      ).length,
      doNotUse: allRecs.filter((r) => r.recommendationLevel === "do-not-use")
        .length,
      staleCount: staleAssets.length,
      originalVisualCount: originalVisualOpportunities.length,
      openSearchTaskCount: searchTasks.length,
    },
    notes: [
      "SoftwareAssetDiscoveryAgent — recommendations only; does not edit product pages",
      "Do not invent asset URLs; search tasks list queries for official sources only",
      "Affiliate URLs are never evidence URLs",
      "Media presence must not influence software rankings",
      registry
        ? `Vendor registry loaded for ${registry.organizationName}`
        : "No vendor registry entry — manual official verification required for any candidate URL",
    ],
  });
}
