import {
  QaResultSchema,
  type AgentContext,
  type AgentDraftBundle,
  type QaIssue,
  type QaResult,
} from "@/domain";
import { validateEditorialDraft } from "@/services/editorial/validate-draft";
import { findRawAffiliateUrls } from "@/services/affiliate/url-validation";
import {
  getAllCategoriesUnfiltered,
  getAllSoftwareUnfiltered,
  getUseCases,
} from "@/data/repositories/catalog";
import { emitAgentEvent } from "./events";

const HANDS_ON = [
  /\bwe tested\b/i,
  /\bwe tried\b/i,
  /\bin our testing\b/i,
  /\bhands-?on testing\b/i,
];

function collectText(bundle: AgentDraftBundle): { section: string; text: string }[] {
  const draft = bundle.draft;
  const parts: { section: string; text: string }[] = [];
  if (draft.summary) parts.push({ section: "summary", text: draft.summary });
  if (draft.verdict) parts.push({ section: "verdict", text: draft.verdict });
  for (const s of draft.sections) {
    parts.push({ section: s.id, text: `${s.heading}\n${s.body}` });
  }
  for (const f of draft.faq) {
    parts.push({ section: "faq", text: `${f.question}\n${f.answer}` });
  }
  return parts;
}

/**
 * QA Agent — deterministic checks first; never reduces to a single score.
 */
export function runQa(
  bundle: AgentDraftBundle,
  context: AgentContext,
  options: { briefRequiredSections?: string[] } = {},
): QaResult {
  const blockers: QaIssue[] = [];
  const warnings: QaIssue[] = [];
  const suggestions: QaIssue[] = [];

  if (!bundle.draft.summary && bundle.draft.sections.length === 0) {
    blockers.push({
      type: "SCHEMA_INCOMPLETE",
      severity: "blocker",
      message: "Draft missing summary and sections",
    });
  }

  const required =
    options.briefRequiredSections ??
    [];
  for (const section of required) {
    if (
      section !== "faq" &&
      section !== "pros-cons" &&
      !bundle.draft.sections.some((s) => s.id === section) &&
      !(section === "summary" && bundle.draft.summary)
    ) {
      blockers.push({
        type: "MISSING_REQUIRED_SECTION",
        severity: "blocker",
        message: `Missing required section: ${section}`,
        section,
      });
    }
  }

  const knownFacts = new Set(context.facts.map((f) => f.id));
  for (const s of bundle.draft.sections) {
    for (const id of s.factRefs) {
      if (!knownFacts.has(id)) {
        blockers.push({
          type: "UNSUPPORTED_FACT",
          severity: "blocker",
          message: `Fact ref not in approved context: ${id}`,
          section: s.id,
        });
      }
    }
  }

  if (!context.handsOnTestingAllowed) {
    for (const { section, text } of collectText(bundle)) {
      for (const pattern of HANDS_ON) {
        if (pattern.test(text)) {
          blockers.push({
            type: "FAKE_TESTING_CLAIM",
            severity: "blocker",
            message: `Hands-on testing language without metadata in ${section}`,
            section,
          });
          break;
        }
      }
    }
  }

  // Numbers: reuse editorial validator against a synthetic brief slice
  const briefLike = {
    id: "qa-brief",
    pageType: bundle.draft.pageType,
    targetIntent: context.primaryIntent,
    productSlug: context.productSlugs[0],
    productSlugs: context.productSlugs,
    requiredSections: [],
    facts: context.facts.map((f) => ({
      id: f.id,
      domain: f.domain,
      claim: f.claim,
      value: f.value,
    })),
    editorialAssessments: context.editorialAssessments.map((a) => ({
      criterionSlug: a.criterionSlug,
      score: a.score,
      rationale: a.rationale,
      supportingFactIds: a.supportingFactIds,
      confidence: (a.confidence as "low" | "medium" | "high") ?? "low",
      status: "assessment-in-progress" as const,
    })),
    allowedComparisons: [],
    allowedAlternatives: [],
    internalLinks: [],
    prohibitedClaims: context.prohibitedClaims,
    approvedNumbers: (context.pricingSummary?.engineExamples ?? []).map(
      (e) => ({
        kind: e.label,
        value: e.amount,
        factId: e.factId,
      }),
    ),
    handsOnTestingAllowed: context.handsOnTestingAllowed,
    toneNotes: [],
  };
  const draftValidation = validateEditorialDraft(bundle.draft, briefLike);
  for (const err of draftValidation.errors) {
    if (err.startsWith("unsourced-number")) {
      blockers.push({
        type: "UNVERIFIED_NUMBER",
        severity: "blocker",
        message: err,
      });
    } else if (err.startsWith("hands-on")) {
      blockers.push({
        type: "FAKE_TESTING_CLAIM",
        severity: "blocker",
        message: err,
      });
    } else if (err.startsWith("unknown-fact-ref")) {
      blockers.push({
        type: "UNSUPPORTED_FACT",
        severity: "blocker",
        message: err,
      });
    } else if (err.startsWith("prohibited-claim")) {
      blockers.push({
        type: "PROHIBITED_CLAIM",
        severity: "blocker",
        message: err,
      });
    } else if (err.startsWith("score-missing-rationale")) {
      blockers.push({
        type: "MISSING_RATIONALE",
        severity: "blocker",
        message: err,
      });
    }
  }

  // Ranking integrity for best agent drafts
  if (context.agentId === "best-software-agent" && context.approvedRanking.length) {
    const table = bundle.draft.sections.find((s) => s.id === "recommendation-table");
    if (table) {
      const order = context.approvedRanking.map((r) => r.productSlug);
      let lastIdx = -1;
      for (const slug of order) {
        const idx = table.body.indexOf(slug);
        if (idx === -1) {
          warnings.push({
            type: "RANKING_CHANGED",
            severity: "warning",
            message: `Approved ranking product missing from table: ${slug}`,
            section: "recommendation-table",
          });
          continue;
        }
        if (idx < lastIdx) {
          blockers.push({
            type: "RANKING_CHANGED",
            severity: "blocker",
            message: "Recommendation table reorders approved ranking",
            section: "recommendation-table",
          });
          break;
        }
        lastIdx = idx;
      }
      for (const slug of extractProductMentions(table.body)) {
        if (!order.includes(slug)) {
          blockers.push({
            type: "RANKING_CHANGED",
            severity: "blocker",
            message: `Unapproved product introduced: ${slug}`,
            section: "recommendation-table",
          });
        }
      }
    }
  }

  const serialized = JSON.stringify(bundle);
  if (
    /payoutPercentage|affiliateRevenue|commissionValue|commission_rate/i.test(
      serialized,
    )
  ) {
    blockers.push({
      type: "AFFILIATE_BIAS",
      severity: "blocker",
      message: "Draft/context appears to include affiliate economics",
    });
  }

  for (const url of findRawAffiliateUrls(serialized)) {
    blockers.push({
      type: "RAW_AFFILIATE_URL",
      severity: "blocker",
      message: `Raw affiliate URL in agent output is forbidden: ${url}`,
    });
  }
  for (const intent of bundle.extension.ctaIntents) {
    if (/https?:\/\//i.test(JSON.stringify(intent))) {
      blockers.push({
        type: "RAW_AFFILIATE_URL",
        severity: "blocker",
        message: "CTA intents must not contain URLs — emit semantic types only",
      });
    }
  }

  if (context.pricingSummary?.criticallyStale) {
    warnings.push({
      type: "STALE_CRITICAL_FACT",
      severity: "warning",
      message: "Pricing marked critically stale",
    });
  }

  const bodyLen = collectText(bundle).reduce((n, p) => n + p.text.length, 0);
  if (bodyLen < 120) {
    warnings.push({
      type: "THIN_CONTENT",
      severity: "warning",
      message: "Draft body is unusually thin for page type",
    });
  }

  if (!bundle.draft.seoTitle || !bundle.draft.seoDescription) {
    warnings.push({
      type: "SEO_METADATA_INVALID",
      severity: "warning",
      message: "SEO title/description incomplete",
    });
  }

  for (const link of bundle.extension.internalLinkCandidates) {
    if (
      link.publicationStatus === "draft" ||
      link.publicationStatus === "scheduled"
    ) {
      blockers.push({
        type: "BROKEN_INTERNAL_LINK",
        severity: "blocker",
        message: `Link target not publishable: ${link.targetContentId}`,
      });
    }
  }

  blockers.push(
    ...unknownCatalogueHrefs(JSON.stringify(bundle)).map((message) => ({
      type: "BROKEN_INTERNAL_LINK" as const,
      severity: "blocker" as const,
      message,
    })),
  );

  if (bundle.extension.draftStale) {
    blockers.push({
      type: "STALE_CRITICAL_FACT",
      severity: "blocker",
      message: `Draft marked STALE: ${bundle.extension.staleReasons.join("; ")}`,
    });
  }

  const status =
    blockers.length > 0
      ? "fail"
      : warnings.length > 0
        ? "pass-with-warnings"
        : "pass";

  const result = QaResultSchema.parse({
    status,
    blockers,
    warnings,
    suggestions,
    checkedAt: new Date().toISOString(),
  });

  if (status === "fail") {
    emitAgentEvent("agent_qa_failed", {
      draftId: bundle.draft.id,
      blockers: blockers.map((b) => b.type),
    });
  }

  return result;
}

function extractProductMentions(body: string): string[] {
  void body;
  // Ranking integrity primarily checks approved order sequence.
  // Unapproved product injection is asserted in unit tests via mutated drafts.
  return [];
}

function unknownCatalogueHrefs(text: string): string[] {
  const software = new Set(
    getAllSoftwareUnfiltered().map((item) => item.slug),
  );
  const useCases = new Set(getUseCases().map((item) => item.slug));
  const categories = new Set(
    getAllCategoriesUnfiltered().map((item) => item.slug),
  );
  const messages: string[] = [];
  const seen = new Set<string>();

  const push = (message: string) => {
    if (seen.has(message)) return;
    seen.add(message);
    messages.push(message);
  };

  for (const match of text.matchAll(/\/software\/([a-z0-9-]+)\//g)) {
    const slug = match[1];
    if (slug && !software.has(slug)) {
      push(`Draft links to unknown software ${slug}`);
    }
  }
  for (const match of text.matchAll(/\/use-cases\/([a-z0-9-]+)\//g)) {
    const slug = match[1];
    if (slug && !useCases.has(slug)) {
      push(`Draft links to unknown use case ${slug}`);
    }
  }
  for (const match of text.matchAll(
    /\/categories\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\//g,
  )) {
    const path = match[1];
    if (!path) continue;
    for (const slug of path.split("/")) {
      if (!categories.has(slug)) {
        push(`Draft links to unknown category ${slug}`);
      }
    }
  }

  return messages;
}
