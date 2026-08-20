import type { EditorialBrief, EditorialDraft } from "@/domain";
import { EditorialDraftSchema } from "@/domain";
import {
  renderTitle,
  titleTemplates,
} from "@/services/editorial/title-templates";

export interface EditorialGenerator {
  generate(brief: EditorialBrief): Promise<EditorialDraft>;
}

function nowIso(): string {
  return new Date().toISOString();
}

function productLabel(brief: EditorialBrief): string {
  return brief.productSlug ?? brief.productSlugs[0] ?? "this product";
}

function factIdsForDomains(
  brief: EditorialBrief,
  domains: string[],
): string[] {
  return brief.facts
    .filter((f) => domains.includes(f.domain))
    .map((f) => f.id);
}

function summarizeApprovedNumbers(brief: EditorialBrief): string {
  if (brief.approvedNumbers.length === 0) {
    return "Structured pricing figures are not yet approved for citation in this draft.";
  }
  return brief.approvedNumbers
    .slice(0, 6)
    .map((n) => `${n.kind}=${String(n.value)}`)
    .join("; ");
}

function assessmentLines(brief: EditorialBrief): string {
  if (brief.editorialAssessments.length === 0) {
    return "Criterion scores are not yet available; this draft summarizes research facts only.";
  }
  return brief.editorialAssessments
    .map(
      (a) =>
        `${a.criterionSlug}: ${a.score}/10 (${a.confidence}) — ${a.rationale}`,
    )
    .join("\n");
}

function buildSections(brief: EditorialBrief): EditorialDraft["sections"] {
  const label = productLabel(brief);
  const featureFacts = factIdsForDomains(brief, ["features", "ai-capabilities"]);
  const pricingFacts = factIdsForDomains(brief, ["pricing", "plans", "free-plan", "free-trial"]);
  const positioningFacts = factIdsForDomains(brief, [
    "product-positioning",
    "identity",
  ]);

  const linksBlurb =
    brief.internalLinks.length > 0
      ? brief.internalLinks
          .slice(0, 5)
          .map((l) => `${l.label} (${l.href})`)
          .join("; ")
      : "No publishable internal links resolved yet.";

  return [
    {
      id: "summary",
      heading: "Summary",
      body: brief.handsOnTestingAllowed
        ? `Based on our evaluation of ${label}, this review synthesizes approved research facts, provisional criterion assessments, and recorded product-testing notes.`
        : `Based on our evaluation of ${label}, this review synthesizes approved research facts and provisional criterion assessments. SoftwareGlimpse has not personally tested this product.`,
      factRefs: positioningFacts.slice(0, 5),
    },
    {
      id: "verdict",
      heading: "Verdict",
      body: `Based on our evaluation of available evidence, ${label} should be considered in context of the criterion notes below. Final publishable verdicts require editorial approval.\n\n${assessmentLines(brief)}`,
      factRefs: brief.editorialAssessments.flatMap((a) => a.supportingFactIds).slice(0, 8),
    },
    {
      id: "key-features",
      heading: "Key features",
      body:
        featureFacts.length > 0
          ? `Based on our evaluation of documented feature evidence for ${label}, the following research fact IDs underpin feature claims: ${featureFacts.join(", ")}.`
          : `Based on our evaluation of ${label}, feature evidence is still incomplete; do not invent feature claims.`,
      factRefs: featureFacts,
    },
    {
      id: "pricing",
      heading: "Pricing",
      body: `Based on our evaluation of structured pricing data only: ${summarizeApprovedNumbers(brief)}. Do not introduce unsourced prices.`,
      factRefs: [
        ...pricingFacts,
        ...brief.approvedNumbers
          .map((n) => n.factId)
          .filter((id): id is string => Boolean(id)),
      ],
    },
    {
      id: "who-should-choose",
      heading: "Who should choose it",
      body: `Based on our evaluation of ${label}, buyers should weigh the criterion assessments and alternatives links before deciding. Affiliate availability does not change fit.`,
      factRefs: positioningFacts.slice(0, 3),
    },
    {
      id: "related",
      heading: "Related pages",
      body: `Internal links permitted by the brief: ${linksBlurb}`,
      factRefs: [],
    },
  ];
}

function buildDraft(
  brief: EditorialBrief,
  provider: string,
): EditorialDraft {
  const label = productLabel(brief);
  const targetSlug = brief.productSlug ?? brief.productSlugs[0] ?? "unknown";
  const createdAt = nowIso();
  const title = renderTitle(titleTemplates["software-review"], {
    name: label,
  });

  const featureFacts = factIdsForDomains(brief, ["features"]);
  const pricingFacts = factIdsForDomains(brief, ["pricing", "plans"]);

  return EditorialDraftSchema.parse({
    id: `draft-${provider}-${targetSlug}-${createdAt.replace(/[:.]/g, "-")}`,
    briefId: brief.id,
    pageType: brief.pageType,
    targetSlug,
    provider,
    status: "generated",
    summary: `Based on our evaluation of ${label}, this draft is generated from approved facts and assessments only.`,
    verdict:
      brief.editorialAssessments.length > 0
        ? `Based on our evaluation of ${label}, provisional criterion scores are available and require editorial review before publication.`
        : `Based on our evaluation of ${label}, criterion scores are not yet complete.`,
    pros: brief.editorialAssessments
      .filter((a) => a.score >= 7)
      .slice(0, 5)
      .map((a) => `${a.criterionSlug} scored ${a.score}/10 in provisional assessment`),
    cons: brief.editorialAssessments
      .filter((a) => a.score < 6)
      .slice(0, 5)
      .map((a) => `${a.criterionSlug} scored ${a.score}/10 in provisional assessment`),
    sections: buildSections(brief),
    faq: [
      {
        question: `Is the ${label} pricing in this draft verified live?`,
        answer:
          "Only structured approvedNumbers from research may be cited. Fixture-derived figures must not be published as live vendor truth.",
        factRefs: pricingFacts.slice(0, 3),
      },
      {
        question: `Has SoftwareGlimpse personally tested ${label}?`,
        answer: brief.handsOnTestingAllowed
          ? "Product-testing notes are recorded as allowed for this brief."
          : "No. This draft is based on our evaluation of research evidence, not personal product usage.",
        factRefs: [],
      },
    ],
    seoTitle: title,
    seoDescription: `Based on our evaluation of ${label} — evidence-backed review notes for buyers.`,
    h1: title,
    factRefs: [
      { section: "key-features", factIds: featureFacts },
      { section: "pricing", factIds: pricingFacts },
    ],
    validationErrors: [],
    createdAt,
  });
}

/**
 * Deterministic template generator — never invents numbers or hands-on claims.
 */
export class DeterministicEditorialGenerator implements EditorialGenerator {
  readonly providerId = "deterministic-v1";

  async generate(brief: EditorialBrief): Promise<EditorialDraft> {
    return buildDraft(brief, this.providerId);
  }
}

/**
 * Manual workflow generator — same template contract for human editing queues.
 */
export class ManualEditorialGenerator implements EditorialGenerator {
  readonly providerId = "manual-v1";

  async generate(brief: EditorialBrief): Promise<EditorialDraft> {
    const draft = buildDraft(brief, this.providerId);
    return EditorialDraftSchema.parse({
      ...draft,
      status: "editorial-review",
      summary: `${draft.summary} Queued for manual editorial completion.`,
    });
  }
}
