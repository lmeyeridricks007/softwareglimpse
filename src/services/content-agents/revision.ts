import {
  AgentRevisionRecordSchema,
  type AgentContext,
  type AgentDraftBundle,
  type AgentRevisionRecord,
  type QaIssue,
} from "@/domain";
import { saveAgentDraftBundle, saveAgentRevision } from "@/data/agents/store";
import { emitAgentEvent } from "./events";

/**
 * Targeted revision — revise only affected sections when possible.
 */
export function reviseDraft(input: {
  original: AgentDraftBundle;
  issues: QaIssue[];
  instructions: string[];
  context: AgentContext;
}): { bundle: AgentDraftBundle; record: AgentRevisionRecord } {
  const sectionsTargeted = [
    ...new Set(
      input.issues
        .map((i) => i.section)
        .filter((s): s is string => Boolean(s)),
    ),
  ];

  const draft = structuredClone(input.original.draft);
  const now = new Date().toISOString();
  draft.id = `${input.original.draft.id}-rev-${Date.now()}`;
  draft.updatedAt = now;
  draft.status = "generated";

  for (const sectionId of sectionsTargeted) {
    const section = draft.sections.find((s) => s.id === sectionId);
    if (!section) continue;

    const relatedIssues = input.issues.filter((i) => i.section === sectionId);
    // Remove unsupported fact refs
    if (relatedIssues.some((i) => i.type === "UNSUPPORTED_FACT")) {
      const known = new Set(input.context.facts.map((f) => f.id));
      section.factRefs = section.factRefs.filter((id) => known.has(id));
      section.body = `${section.body}\n\n[Revised] Removed unsupported fact references per QA.`;
    }
    if (
      relatedIssues.some(
        (i) =>
          i.type === "FAKE_TESTING_CLAIM" || i.type === "PROHIBITED_CLAIM",
      )
    ) {
      section.body =
        "Based on our evaluation of approved research evidence only. Unsupported experiential claims were removed.";
      section.factRefs = section.factRefs.filter((id) =>
        input.context.facts.some((f) => f.id === id),
      );
    }
    if (relatedIssues.some((i) => i.type === "UNVERIFIED_NUMBER")) {
      section.body =
        "Based on our evaluation of approved pricing-engine figures only. Unverified numeric claims were removed.";
      section.factRefs = input.context.facts
        .filter((f) => f.domain === "pricing" || f.domain === "plans")
        .map((f) => f.id)
        .slice(0, 5);
    }
  }

  // Also scrub summary/verdict for fake testing
  if (input.issues.some((i) => i.type === "FAKE_TESTING_CLAIM")) {
    if (draft.summary) {
      draft.summary = draft.summary.replace(/\bwe tested\b/gi, "based on our evaluation of");
    }
    if (draft.verdict) {
      draft.verdict = draft.verdict.replace(/\bwe tested\b/gi, "based on our evaluation of");
    }
  }

  // Global unsupported fact scrub
  if (input.issues.some((i) => i.type === "UNSUPPORTED_FACT" && !i.section)) {
    const known = new Set(input.context.facts.map((f) => f.id));
    for (const s of draft.sections) {
      s.factRefs = s.factRefs.filter((id) => known.has(id));
    }
  }

  for (const instruction of input.instructions) {
    if (instruction.startsWith("remove-fact:")) {
      const factId = instruction.slice("remove-fact:".length);
      for (const s of draft.sections) {
        s.factRefs = s.factRefs.filter((id) => id !== factId);
      }
    }
  }

  const bundle: AgentDraftBundle = {
    draft,
    extension: {
      ...input.original.extension,
      generatedAt: now,
      sectionsChanged: sectionsTargeted,
      changeReasons: sectionsTargeted.map((section) => ({
        section,
        reason: "qa-targeted-revision",
      })),
    },
  };

  const record = AgentRevisionRecordSchema.parse({
    id: `rev-${Date.now()}`,
    originalDraftId: input.original.draft.id,
    revisedDraftId: draft.id,
    issues: input.issues,
    instructions: input.instructions,
    sectionsTargeted,
    createdAt: now,
  });

  saveAgentDraftBundle(bundle);
  saveAgentRevision(record);
  emitAgentEvent("agent_revision_created", {
    revisionId: record.id,
    originalDraftId: record.originalDraftId,
    revisedDraftId: record.revisedDraftId,
  });

  return { bundle, record };
}
