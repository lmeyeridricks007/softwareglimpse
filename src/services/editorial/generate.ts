import {
  EditorialBriefSchema,
  EditorialDraftSchema,
  ProductEditorialAssessmentSchema,
  ProductReviewSchema,
  type EditorialBrief,
  type EditorialDraft,
  type EditorialPageType,
  type ProductEditorialAssessment,
  type ProductReview,
} from "@/domain";
import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getSoftwareBySlug,
} from "@/data/repositories/catalog";
import { loadEnrichment, loadFacts } from "@/data/research/store";
import {
  getMethodologyBySlug,
  loadAssessment,
  saveAssessment,
  saveDraft,
  saveReview,
} from "@/data/editorial/store";

export type GenerateOptions = {
  dryRun?: boolean;
  force?: boolean;
};

export type GenerateResult = {
  pageType: EditorialPageType | "software";
  targetSlug: string;
  dryRun: boolean;
  wrote: string[];
  skipped: string[];
  messages: string[];
  assessment?: ProductEditorialAssessment;
  review?: ProductReview;
  draft?: EditorialDraft;
  brief?: EditorialBrief;
};

export function generateEditorial(
  kind: "software" | "comparison" | "best",
  targetSlug: string,
  options: GenerateOptions = {},
): GenerateResult {
  switch (kind) {
    case "software":
      return generateSoftwareEditorial(targetSlug, options);
    case "comparison":
      return generateComparisonEditorial(targetSlug, options);
    case "best":
      return generateBestEditorial(targetSlug, options);
    default:
      throw new Error(`Unsupported generate kind: ${kind}`);
  }
}

function generateSoftwareEditorial(
  productSlug: string,
  options: GenerateOptions,
): GenerateResult {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) {
    throw new Error(`Unknown software slug: ${productSlug}`);
  }

  const existing = loadAssessment(productSlug);
  const wrote: string[] = [];
  const skipped: string[] = [];
  const messages: string[] = [];

  if (existing && existing.status === "approved" && !options.force) {
    skipped.push("assessment");
    messages.push(
      "Approved assessment exists — pass --force to regenerate a new draft assessment.",
    );
    return {
      pageType: "software",
      targetSlug: productSlug,
      dryRun: Boolean(options.dryRun),
      wrote,
      skipped,
      messages,
      assessment: existing,
    };
  }

  const enrichment = loadEnrichment(productSlug);
  const facts = loadFacts(productSlug).filter(
    (fact) => fact.status === "approved" || fact.status === "verified",
  );
  const categorySlug = product.primaryCategorySlug;
  const methodology =
    getMethodologyBySlug(`${categorySlug}-editorial`) ??
    (categorySlug === "crm"
      ? (getMethodologyBySlug("crm-editorial") ??
        getMethodologyBySlug("crm-software-v1"))
      : undefined) ??
    getMethodologyBySlug("crm-editorial") ??
    getMethodologyBySlug("crm-software-v1");
  const methodologyKey =
    methodology?.slug?.includes("sales-intelligence") ||
    categorySlug === "sales-intelligence"
      ? "si"
      : "crm";
  const now = new Date().toISOString();

  const featureLines =
    enrichment?.featureSupport.map(
      (f) => `${f.featureSlug}: ${f.availability}`,
    ) ?? [];

  const assessment = ProductEditorialAssessmentSchema.parse({
    id: `assess-${productSlug}-${methodologyKey}-v1`,
    productSlug,
    methodologySlug: methodology?.slug ?? "crm-editorial",
    methodologyVersion: methodology?.version ?? "1.0.0",
    status: "assessment-in-progress",
    verdict: `${product.name} has structured research available for editorial assessment, but this draft is provisional. Fixture or vendor research is not a finished SoftwareGlimpse review.`,
    strengths: featureLines
      .filter((line) => line.includes("supported"))
      .slice(0, 4)
      .map((line) => `Evidence of ${line}`),
    weaknesses: featureLines
      .filter((line) => line.includes("limited"))
      .slice(0, 3)
      .map((line) => `Limited evidence for ${line}`),
    bestFor: product.bestFor.length
      ? product.bestFor
      : [
          `Teams evaluating ${product.name} within ${categorySlug.replace(/-/g, " ")} workflows`,
        ],
    notIdealFor: product.notIdealFor.length
      ? product.notIdealFor
      : ["Buyers needing an approved, hands-on SoftwareGlimpse review today"],
    tradeoffs: [
      "Research completeness vs editorial approval",
      "Feature breadth signals vs unverified live pricing claims",
    ],
    recommendation: `Use related comparisons and alternatives pages; do not treat this draft as an approved score.`,
    handsOnTesting: false,
    confidence: facts.length > 5 ? "medium" : "low",
    criterionAssessments: (methodology?.criteria ?? [])
      .slice(0, Math.min(8, methodology?.criteria?.length ?? 3))
      .map((criterion: { slug: string; name: string }) => ({
        criterionSlug: criterion.slug,
        score: 5,
        rationale: `Placeholder criterion note for ${criterion.name} — requires human scoring against evidence. Not approved.`,
        supportingFactIds: facts.slice(0, 2).map((f) => f.id),
        confidence: "low" as const,
        status: "assessment-in-progress" as const,
      })),
    editorialNotes:
      "Generated by editorial:generate. Do not set seo.indexable or approved without human review. Never invent live prices or claim hands-on testing.",
    createdAt: now,
    updatedAt: now,
  });

  const brief = EditorialBriefSchema.parse({
    id: `brief-software-${productSlug}-${Date.now()}`,
    pageType: "software-review",
    targetIntent: `Draft structured review sections for ${product.name}`,
    primaryKeyword: `${product.name} review`,
    productSlug,
    productSlugs: [productSlug],
    requiredSections: [
      "verdict",
      "best-for",
      "score-breakdown",
      "tradeoffs",
      "methodology",
      "disclosures",
    ],
    facts: facts.slice(0, 20).map((fact) => ({
      id: fact.id,
      domain: fact.domain,
      claim:
        typeof fact.value === "string"
          ? fact.value
          : `${fact.field}: ${JSON.stringify(fact.value)}`,
      value: fact.value,
    })),
    editorialAssessments: assessment.criterionAssessments,
    prohibitedClaims: [
      "hands-on testing",
      "we tested",
      "live price guarantee",
      "best overall",
    ],
    approvedNumbers: [],
    handsOnTestingAllowed: false,
    methodologyVersion: assessment.methodologyVersion,
    toneNotes: [
      "Decisive but uncertain where evidence is thin",
      "Canonical review URL is /software/{slug}/",
    ],
  });

  const draft = EditorialDraftSchema.parse({
    id: `draft-software-${productSlug}-${Date.now()}`,
    briefId: brief.id,
    pageType: "software-review",
    targetSlug: productSlug,
    provider: "deterministic-editorial-generate",
    status: "generated",
    summary: assessment.verdict,
    verdict: assessment.verdict,
    pros: assessment.strengths,
    cons: assessment.weaknesses,
    sections: [
      {
        id: "methodology",
        heading: "How we evaluate",
        body:
          methodology?.description ??
          `${categorySlug} methodology applied; scores remain provisional until approved.`,
        factRefs: [],
      },
      {
        id: "limitations",
        heading: "Evidence limitations",
        body: "This draft may rely on fixture research. It is not indexable and does not claim hands-on testing or verified live pricing.",
        factRefs: [],
      },
    ],
    seoTitle: `${product.name} review (draft)`,
    seoDescription: `Provisional SoftwareGlimpse assessment draft for ${product.name}.`,
    h1: `${product.name} review`,
    createdAt: now,
    updatedAt: now,
  });

  const review = ProductReviewSchema.parse({
    id: `review-${productSlug}-draft`,
    productSlug,
    assessmentId: assessment.id,
    editorialStatus: "assessment-in-progress",
    title: `${product.name} review`,
    h1: `${product.name} review`,
    intro: assessment.verdict,
    summary: assessment.verdict,
    verdict: assessment.verdict,
    overallScore: undefined,
    criterionAssessments: assessment.criterionAssessments,
    bestFor: assessment.bestFor,
    notIdealFor: assessment.notIdealFor,
    pros: assessment.strengths,
    cons: assessment.weaknesses,
    methodologySlug: assessment.methodologySlug,
    methodologyVersion: assessment.methodologyVersion,
    confidence: assessment.confidence,
    handsOnTesting: false,
    draftId: draft.id,
    metadata: { status: "draft", researchStatus: "in-progress" },
    seo: {
      title: `${product.name} review`,
      description: `Provisional assessment for ${product.name}.`,
      indexable: false,
      canonicalPath: `/software/${productSlug}/`,
    },
  });

  if (!options.dryRun) {
    saveAssessment(assessment);
    wrote.push(`assessment:${productSlug}`);
    saveDraft(draft);
    wrote.push(`draft:${draft.id}`);
    saveReview(review);
    wrote.push(`review:${productSlug}`);
  } else {
    messages.push("Dry run — no files written.");
  }

  return {
    pageType: "software",
    targetSlug: productSlug,
    dryRun: Boolean(options.dryRun),
    wrote,
    skipped,
    messages,
    assessment,
    review,
    draft,
    brief,
  };
}

function generateComparisonEditorial(
  slug: string,
  options: GenerateOptions,
): GenerateResult {
  const comparison = getAllComparisonsUnfiltered().find((item) => item.slug === slug);
  if (!comparison) {
    throw new Error(`Unknown comparison slug: ${slug}`);
  }

  const messages: string[] = [
    `Comparison ${slug} editorialStatus=${comparison.editorialStatus}; outcomes=${comparison.outcomes.length}.`,
    "Comparison seed/outcomes are authored in src/data/seed/comparisons.ts — generate does not invent winners.",
    "Ensure overallWinnerKind prefers depends/tie unless evidence clearly supports a single winner.",
  ];

  if (comparison.seo.indexable) {
    messages.push("WARNING: comparison is marked indexable — POC should stay noindex until approved.");
  }

  if (!options.dryRun && options.force) {
    messages.push(
      "No comparison file rewrite performed (seed-owned). Review outcomes manually.",
    );
  }

  return {
    pageType: "comparison",
    targetSlug: slug,
    dryRun: Boolean(options.dryRun),
    wrote: [],
    skipped: options.dryRun ? [] : ["comparison-seed-owned"],
    messages,
  };
}

function generateBestEditorial(
  slug: string,
  options: GenerateOptions,
): GenerateResult {
  const page = getAllBestPagesUnfiltered().find((item) => item.slug === slug);
  if (!page) {
    throw new Error(`Unknown best-page slug: ${slug}`);
  }

  const messages: string[] = [
    `Best page ${slug}: ${page.recommendations.length} recommendations, methodology=${Boolean(page.methodology)}.`,
    'Do not emit "Best overall" badges unless approved:false provisional candidates are explicitly intended — prefer use-case labels.',
    "researchStatus must remain incomplete until editorial approval; seo.indexable must stay false for POC.",
  ];

  if (page.seo.indexable) {
    messages.push("WARNING: best page is indexable — unexpected for POC.");
  }

  if (!options.dryRun && options.force) {
    messages.push("No best-page rewrite performed (seed-owned).");
  }

  return {
    pageType: "best",
    targetSlug: slug,
    dryRun: Boolean(options.dryRun),
    wrote: [],
    skipped: options.dryRun ? [] : ["best-seed-owned"],
    messages,
  };
}
