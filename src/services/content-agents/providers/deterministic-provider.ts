import {
  EditorialDraftSchema,
  type AgentBrief,
  type EditorialDraft,
} from "@/domain";
import { buildPageTitle } from "@/services/editorial/title-templates";
import type { GenerationProvider, GenerationRequest, GenerationResponse } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function labelFor(brief: AgentBrief): string {
  const slug = brief.targetSlug;
  const fromFacts = brief.editorialBrief.productSlug;
  return fromFacts ?? slug;
}

/**
 * Deterministic structured renderer — used in CI and as default provider.
 * Never invents numbers or hands-on claims.
 */
export class DeterministicGenerationProvider implements GenerationProvider {
  readonly id = "deterministic-v1";

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const { brief, skeleton } = request;
    const createdAt = nowIso();
    const productLabel =
      brief.editorialBrief.productSlug ??
      brief.editorialBrief.productSlugs[0] ??
      brief.targetSlug;
    const title = buildPageTitle(brief.pageType, {
      name: productLabel,
      category: brief.editorialBrief.audience ?? productLabel,
      a: brief.editorialBrief.productSlugs[0],
      b: brief.editorialBrief.productSlugs[1],
    });

    const baseSections =
      skeleton?.sections ??
      defaultSections(brief);

    const draft = EditorialDraftSchema.parse({
      id:
        skeleton?.id ??
        `draft-${this.id}-${brief.agentId}-${brief.targetSlug}-${createdAt.replace(/[:.]/g, "-")}`,
      briefId: brief.id,
      pageType: brief.pageType,
      targetSlug: brief.targetSlug,
      provider: this.id,
      status: "generated",
      summary:
        skeleton?.summary ??
        `Based on our evaluation of available evidence for ${labelFor(brief)}, this ${brief.pageType} draft uses only approved context facts and assessments.`,
      verdict: skeleton?.verdict,
      pros: skeleton?.pros ?? [],
      cons: skeleton?.cons ?? [],
      sections: baseSections,
      faq: skeleton?.faq ?? defaultFaq(brief),
      seoTitle: skeleton?.seoTitle ?? title,
      seoDescription:
        skeleton?.seoDescription ??
        `Evidence-backed ${brief.pageType} notes — not live vendor truth until editorial approval.`,
      h1: skeleton?.h1 ?? title,
      factRefs: skeleton?.factRefs ?? [
        {
          section: "summary",
          factIds: brief.editorialBrief.facts.slice(0, 5).map((f) => f.id),
        },
      ],
      validationErrors: [],
      createdAt,
    });

    return {
      draft,
      cost: {
        provider: this.id,
        model: request.profile.modelKey,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostUsd: 0,
      },
      providerVersion: "1.0.0",
    };
  }
}

function defaultSections(brief: AgentBrief): EditorialDraft["sections"] {
  const facts = brief.editorialBrief.facts;
  const factIds = facts.slice(0, 8).map((f) => f.id);
  return brief.requiredSections.map((id) => ({
    id,
    heading: headingFor(id),
    body: sectionBody(brief, id),
    factRefs: factIds.slice(0, 4),
  }));
}

function headingFor(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function sectionBody(brief: AgentBrief, sectionId: string): string {
  const name = labelFor(brief);
  const assessments = brief.editorialBrief.editorialAssessments;
  const methodology = brief.methodologyVersion
    ? `Methodology ${brief.methodologyVersion} drives criterion coverage.`
    : "Category methodology drives criterion coverage.";
  switch (sectionId) {
    case "executive-summary":
    case "summary":
      return `Based on our evaluation of ${name}, this summary uses only approved research facts (${brief.editorialBrief.facts.length} fact refs in brief). Unsupported detail is omitted.`;
    case "verdict":
      return assessments.length
        ? `Based on our evaluation of ${name}, criterion notes exist and must pass editorial approval before scores publish.`
        : `Based on our evaluation of ${name}, criterion assessments are incomplete — keep the verdict qualitative until approval.`;
    case "product-experience":
      return `Based on documented product capabilities for ${name}, describe the buyer workflow from researched features only. Do not invent personal usage claims. ${methodology}`;
    case "detailed-criteria":
      return `Expand each active methodology criterion for ${name} using researched feature support and approved assessment rationales. Prefer evidence-linked mini-reviews over binary availability lists. ${methodology}`;
    case "why-we-like":
      return `Explain ${name}'s central strengths in plain language using approved strengths and positioning — no filler praise.`;
    case "plan-recommendations":
      return `Recommend plan tiers for ${name} only from structured pricing plans and researched feature-to-plan links. Do not invent plan feature matrices.`;
    case "competitor-context":
      return `Include strategic competitor deep dives only when comparison outcomes or alternative research exist for ${name}. Link to full comparison pages rather than duplicating them.`;
    case "final-verdict":
      return `Close with buyer-specific choose-if / consider-other-if guidance for ${name}, then a short decision conclusion. Avoid generic “great product” language.`;
    case "pricing-overview":
    case "pricing":
      return brief.editorialBrief.approvedNumbers.length
        ? `Based on our evaluation of structured pricing only: ${brief.editorialBrief.approvedNumbers
            .slice(0, 4)
            .map((n) => `${n.kind}=${String(n.value)}`)
            .join("; ")}.`
        : `Based on our evaluation of ${name}, structured pricing figures are not yet approved for citation.`;
    case "methodology-summary":
    case "methodology":
      return `This draft follows methodology version ${brief.methodologyVersion ?? "unspecified"}. Affiliate economics are excluded from editorial judgment.`;
    case "limitations":
      return `Document where ${name} falls short using researched limitations and approved weaknesses. Each limitation should note who it affects and an alternative when evidence supports one.`;
    default:
      return `Based on our evaluation of ${name}, the ${sectionId} section is constrained to approved brief evidence. Gaps are omitted rather than invented.`;
  }
}

function defaultFaq(brief: AgentBrief): EditorialDraft["faq"] {
  const name = labelFor(brief);
  return [
    {
      question: `Is this ${brief.pageType} page based on live vendor verification?`,
      answer:
        "Only approved or verified facts and pricing-engine outputs in the brief may be cited. Unverified research is not treated as live vendor truth.",
      factRefs: brief.editorialBrief.facts.slice(0, 2).map((f) => f.id),
    },
    {
      question: `Has SoftwareGlimpse personally tested ${name}?`,
      answer: brief.editorialBrief.handsOnTestingAllowed
        ? "Product-testing metadata is recorded as allowed for this brief."
        : "No. This draft is based on our evaluation of research evidence, not personal product usage.",
      factRefs: [],
    },
  ];
}

/**
 * Live LLM providers are intentionally stubbed until Prompt 12+ workflows.
 * Calling generate throws unless allowLiveNetwork is enabled and an adapter is registered.
 */
export class UnconfiguredLiveGenerationProvider implements GenerationProvider {
  constructor(
    readonly id: string,
    private readonly providerName: string,
  ) {}

  async generate(_request: GenerationRequest): Promise<GenerationResponse> {
    void _request;
    throw new Error(
      `Live provider ${this.providerName} is not configured. Use deterministic-v1 in CI/tests.`,
    );
  }
}

export function createGenerationProvider(
  profileId: string,
): GenerationProvider {
  switch (profileId) {
    case "deterministic-v1":
    case "manual-v1":
      return new DeterministicGenerationProvider();
    case "openai-default":
      return new UnconfiguredLiveGenerationProvider("openai-default", "openai");
    case "anthropic-default":
      return new UnconfiguredLiveGenerationProvider(
        "anthropic-default",
        "anthropic",
      );
    case "gemini-default":
      return new UnconfiguredLiveGenerationProvider("gemini-default", "gemini");
    default:
      return new DeterministicGenerationProvider();
  }
}
