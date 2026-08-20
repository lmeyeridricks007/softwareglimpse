import type {
  ContentQualityAssessment,
  ContentQualityDimensionId,
  DimensionAssessment,
  DimensionScoreValue,
  PageQualitySnapshot,
  QualityEvidence,
  QualityRecommendation,
} from "@/domain/schemas/content-quality";
import {
  CONTENT_QUALITY_EVALUATOR_VERSION,
  normalizePageQualitySnapshot,
} from "@/domain/schemas/content-quality";
import {
  computeOverallScore,
  DIMENSION_LABELS,
  qualityBandForScore,
} from "./dimensions";
import {
  getProfileForPageType,
  resolveWeights,
  type PageQualityProfile,
} from "./profiles";

type NormalizedSnap = ReturnType<typeof normalizePageQualitySnapshot>;

type ScoreParts = {
  score: DimensionScoreValue;
  reason: string;
  evidence: QualityEvidence[];
  gap?: string;
  recommendations: QualityRecommendation[];
};

function clampScore(n: number): DimensionScoreValue {
  return Math.max(0, Math.min(5, Math.round(n))) as DimensionScoreValue;
}

function scoreIntent(
  snap: NormalizedSnap,
  profile: PageQualityProfile,
): ScoreParts {
  const evidence: QualityEvidence[] = [
    {
      label: "Primary intent",
      detail: snap.primaryIntent,
      present: true,
    },
    {
      label: "Expected intent",
      detail: profile.expectedIntent,
      present: true,
    },
  ];
  const titleMatches =
    !snap.h1 ||
    snap.h1.toLowerCase().includes(snap.title.split(" ")[0]?.toLowerCase() ?? "") ||
    snap.title.toLowerCase().includes(snap.h1.split(" ")[0]?.toLowerCase() ?? "");
  if (snap.h1) {
    evidence.push({
      label: "H1",
      detail: snap.h1,
      present: titleMatches,
    });
  }

  const intentMatch = snap.primaryIntent === profile.expectedIntent;
  const mixed =
    snap.secondaryIntents.length > 0 &&
    snap.secondaryIntents.some((i) => i !== snap.primaryIntent);
  const diluteCommercial =
    profile.expectedIntent === "implementation" &&
    (snap.secondaryIntents.includes("commercial") ||
      snap.notes.some((n) => /half.*rank|product ranking/i.test(n)));

  let score = 3;
  if (intentMatch && !mixed && titleMatches) score = 5;
  else if (intentMatch && !diluteCommercial) score = 4;
  else if (intentMatch && mixed) score = 2;
  else if (!intentMatch) score = 1;
  if (diluteCommercial) score = Math.min(score, 2);
  if (!snap.summary && !snap.h1) score = Math.min(score, 2);

  const recommendations: QualityRecommendation[] = [];
  let gap: string | undefined;
  if (!intentMatch) {
    gap = `Page intent is ${snap.primaryIntent}; profile expects ${profile.expectedIntent}.`;
    recommendations.push({
      summary: `Refocus the page on ${profile.expectedIntent} intent; move mismatched sections to linked pages.`,
      priority: "major",
      relatedDimension: "user-intent-fit",
    });
  }
  if (diluteCommercial) {
    gap =
      "Implementation/educational page spends material space ranking products.";
    recommendations.push({
      summary:
        "Keep product rankings on Best/Review/Comparison pages; link out instead of embedding half-page rankings.",
      priority: "critical",
      relatedDimension: "user-intent-fit",
    });
  }

  return {
    score: clampScore(score),
    reason: intentMatch
      ? diluteCommercial
        ? "Intent label matches but commercial ranking dilutes the primary job."
        : mixed
          ? "Primary intent matches, but secondary intents compete for attention."
          : "Page intent, title/H1, and profile expectations align."
      : "Declared intent does not match the page-type profile.",
    evidence,
    gap,
    recommendations,
  };
}

function scoreCompleteness(
  snap: NormalizedSnap,
  profile: PageQualityProfile,
): ScoreParts {
  const expected = profile.expectedSections;
  const present = new Set([
    ...snap.presentSections,
    ...snap.pageTypeChecklist.passed.filter((p) =>
      expected.some((e) => p.includes(e) || e.includes(p)),
    ),
  ]);
  const missing = [
    ...new Set([
      ...snap.missingSections,
      ...expected.filter((e) => !present.has(e) && !snap.presentSections.includes(e)),
    ]),
  ].filter((e) => !snap.presentSections.includes(e));

  const hit = expected.filter((e) => snap.presentSections.includes(e)).length;
  const ratio = expected.length ? hit / expected.length : 1;
  let score = Math.round(ratio * 5);
  if (missing.length === 0 && hit >= expected.length) score = 5;
  if (hit === 0) score = 0;
  const surface =
    snap.depthSignals.some((s) => /surface:/i.test(s)) ||
    snap.originalValueSignals.some((s) =>
      /paraphrase|vendor.?doc|template outcome/i.test(s),
    );
  if (surface && score >= 4) {
    score = 3;
  }

  const evidence: QualityEvidence[] = [
    {
      label: "Expected sections",
      detail: `${hit}/${expected.length} present`,
      present: hit > 0,
    },
    ...snap.presentSections.slice(0, 8).map((s) => ({
      label: `Present: ${s}`,
      present: true as const,
    })),
    ...missing.slice(0, 8).map((s) => ({
      label: `Missing: ${s}`,
      present: false as const,
    })),
  ];

  const recommendations: QualityRecommendation[] = missing.slice(0, 5).map((s) => ({
    summary: `Add expected section “${s}” for ${profile.label}.`,
    priority: (score <= 2 ? "critical" : "major") as QualityRecommendation["priority"],
    relatedDimension: "content-completeness" as const,
  }));
  if (surface && missing.length === 0) {
    recommendations.push({
      summary:
        "Expected sections are present, but the copy is still template or surface language — replace it with pair-specific research.",
      priority: "major",
      relatedDimension: "content-completeness",
    });
  }

  return {
    score: clampScore(score),
    reason:
      surface && missing.length === 0
        ? "Expected sections exist, but the copy is still surface or template language."
        : missing.length === 0
        ? "All profile-expected sections are present."
        : `Missing ${missing.length} expected section(s) for ${profile.pageType}.`,
    evidence,
    gap: missing.length ? `Missing: ${missing.join(", ")}` : undefined,
    recommendations,
  };
}

function scoreDepth(snap: NormalizedSnap): ScoreParts {
  const signals = snap.depthSignals;
  const valuable = [
    "workflow",
    "trade-off",
    "edge-case",
    "example",
    "criteria",
    "limitation",
    "implementation",
    "requirement",
  ];
  const hits = valuable.filter((v) =>
    signals.some((s) => s.toLowerCase().includes(v)),
  ).length;
  let score = 1;
  if (signals.length === 0) score = 1;
  else if (signals.length <= 1) score = 2;
  else if (hits >= 2 && signals.length >= 3) score = 4;
  else if (hits >= 4) score = 5;
  else score = 3;
  if (signals.some((s) => /surface|generic paraphrase|marketing fluff/i.test(s))) {
    score = Math.min(score, 2);
  }

  return {
    score: clampScore(score),
    reason:
      signals.length === 0
        ? "No depth signals (workflows, trade-offs, examples, edge cases)."
        : `Found ${signals.length} depth signal(s); ${hits} high-value categories covered.`,
    evidence: signals.slice(0, 10).map((s) => ({ label: s, present: true })),
    gap:
      score <= 2
        ? "Page stays surface-level — add workflows, trade-offs, or worked examples."
        : undefined,
    recommendations:
      score <= 3
        ? [
            {
              summary:
                "Add concrete workflows, decision criteria, limitations, or edge cases — not more word count.",
              priority: "major",
              relatedDimension: "subject-depth",
            },
          ]
        : [],
  };
}

function scoreOriginal(snap: NormalizedSnap): ScoreParts {
  const signals = snap.originalValueSignals;
  let score = signals.length === 0 ? 1 : Math.min(5, 1 + signals.length);
  if (signals.some((s) => /vendor.?doc.?summary|generic paraphrase/i.test(s))) {
    score = Math.min(score, 1);
  }
  return {
    score: clampScore(score),
    reason:
      signals.length === 0
        ? "No SoftwareGlimpse-original value detected (frameworks, assessments, tools, taxonomies)."
        : `Original value signals: ${signals.join("; ")}.`,
    evidence: signals.map((s) => ({ label: s, present: true })),
    gap:
      score <= 2
        ? "Content largely summarizes vendor material without SG frameworks or assessments."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Add an SG framework, scorecard, checklist, assessment, or interactive tool — avoid vendor-doc paraphrase.",
              priority: "major",
              relatedDimension: "original-value",
            },
          ]
        : [],
  };
}

function scoreEvidence(snap: NormalizedSnap): ScoreParts {
  const e = snap.evidenceSignals;
  let score = 2;
  const points =
    Math.min(2, e.primarySourceCount) +
    Math.min(1, e.officialDocCount) +
    Math.min(1, e.pricingSourceCount > 0 ? 1 : 0) +
    (e.screenshotCount + e.officialVideoCount > 0 ? 1 : 0) +
    (e.factRefCount > 0 ? 1 : 0) +
    (e.verificationDatesPresent ? 1 : 0);
  score = Math.min(5, Math.max(0, points - e.unsupportedClaimFlags));
  if (
    e.primarySourceCount + e.officialDocCount + e.factRefCount === 0 &&
    e.unsupportedClaimFlags === 0
  ) {
    // Informational pages may not need heavy evidence
    score = 3;
  }
  if (e.unsupportedClaimFlags > 0) score = Math.min(score, 2);

  const evidence: QualityEvidence[] = [
    {
      label: "Primary sources",
      detail: String(e.primarySourceCount),
      present: e.primarySourceCount > 0,
    },
    {
      label: "Official docs",
      detail: String(e.officialDocCount),
      present: e.officialDocCount > 0,
    },
    {
      label: "Fact refs",
      detail: String(e.factRefCount),
      present: e.factRefCount > 0,
    },
    {
      label: "Verification dates",
      present: e.verificationDatesPresent,
    },
    {
      label: "Unsupported claim flags",
      detail: String(e.unsupportedClaimFlags),
      present: e.unsupportedClaimFlags === 0,
    },
  ];

  return {
    score: clampScore(score),
    reason:
      e.unsupportedClaimFlags > 0
        ? `${e.unsupportedClaimFlags} unsupported claim flag(s); evidence trail incomplete.`
        : e.primarySourceCount + e.factRefCount > 0
          ? "Claims appear backed by primary/official sources and/or fact refs."
          : "No heavy evidence attached — acceptable only for general guidance.",
    evidence,
    gap:
      e.unsupportedClaimFlags > 0 || score <= 2
        ? "Attach primary sources, verification dates, or remove unsupported claims."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Link official documentation / pricing sources and record verification dates; drop unsupported superlatives.",
              priority: "critical",
              relatedDimension: "evidence-source-quality",
            },
          ]
        : [],
  };
}

function scoreFreshness(snap: NormalizedSnap): ScoreParts {
  const f = snap.freshness;
  let score = 3;
  if (f.withinPolicy === true && f.staleClaimFlags === 0 && f.brokenSourceFlags === 0) {
    score = 5;
  } else if (f.withinPolicy === false || f.staleClaimFlags > 0) {
    score = 2;
  }
  if (f.brokenSourceFlags > 0 || f.obsoleteScreenshotFlags > 0) score = Math.min(score, 1);
  if (f.pricingFresh === false) score = Math.min(score, 2);
  if (!f.lastReviewedAt && !f.sourcesVerifiedAt) score = Math.min(score, 3);

  return {
    score: clampScore(score),
    reason:
      f.withinPolicy === true
        ? "Research/pricing freshness within policy."
        : f.staleClaimFlags > 0 || f.brokenSourceFlags > 0
          ? "Stale or broken research signals present."
          : "Freshness partially unknown — last-reviewed / verified dates incomplete.",
    evidence: [
      {
        label: "Last reviewed",
        detail: f.lastReviewedAt ?? "missing",
        present: Boolean(f.lastReviewedAt),
      },
      {
        label: "Sources verified",
        detail: f.sourcesVerifiedAt ?? "missing",
        present: Boolean(f.sourcesVerifiedAt),
      },
      {
        label: "Within policy",
        present: f.withinPolicy !== false,
        detail: f.withinPolicy === undefined ? "unknown" : String(f.withinPolicy),
      },
      {
        label: "Stale claim flags",
        detail: String(f.staleClaimFlags ?? 0),
        present: (f.staleClaimFlags ?? 0) === 0,
      },
    ],
    gap:
      score <= 2
        ? "Refresh stale sources, pricing, or screenshots per research freshness policies."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Run research refresh for stale domains (pricing 30d, features 90d, etc.) and re-verify sources.",
              priority: "major",
              relatedDimension: "research-freshness",
            },
          ]
        : [],
  };
}

function scoreDecision(snap: NormalizedSnap): ScoreParts {
  const signals = snap.decisionSupportSignals;
  let score =
    signals.length === 0 ? 1 : Math.min(5, 1 + Math.ceil(signals.length * 0.9));
  return {
    score: clampScore(score),
    reason:
      signals.length === 0
        ? "No decision-support modules (scorecards, trade-offs, best-fit, questions)."
        : `Decision support present: ${signals.join("; ")}.`,
    evidence: signals.map((s) => ({ label: s, present: true })),
    gap:
      score <= 2
        ? "Page explains a topic but does not help the reader choose or evaluate."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Add requirements, scorecard, comparison handoff, best-fit scenarios, or vendor questions.",
              priority: "major",
              relatedDimension: "decision-support",
            },
          ]
        : [],
  };
}

function scoreAction(snap: NormalizedSnap): ScoreParts {
  const signals = snap.actionSignals;
  let score =
    signals.length === 0 ? 1 : Math.min(5, 1 + signals.length);
  return {
    score: clampScore(score),
    reason:
      signals.length === 0
        ? "No clear post-read action (checklist, tool, compare, calculate, implement)."
        : `Actionable outs: ${signals.join("; ")}.`,
    evidence: signals.map((s) => ({ label: s, present: true })),
    gap: score <= 2 ? "Reader cannot do something concrete after reading." : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Add a checklist download, Finder/Requirements Builder, comparison, calculator, or step process CTA.",
              priority: "major",
              relatedDimension: "actionability",
            },
          ]
        : [],
  };
}

function scoreStructure(snap: NormalizedSnap): ScoreParts {
  const s = snap.structure;
  let score = 3;
  if (s.hasQuickAnswer) score += 1;
  if (s.headingCount >= 3 && s.hasLogicalSequence) score += 1;
  if (s.usesTablesOrCards) score += 0.5;
  if (s.bloatedIntro) score -= 1;
  if (s.excessiveFaqDuplication) score -= 1;
  if (s.repetitive) score -= 1;
  if (s.headingCount === 0) score = Math.min(score, 2);

  return {
    score: clampScore(score),
    reason: s.bloatedIntro || s.repetitive || s.excessiveFaqDuplication
      ? "Structure issues: bloated intro, repetition, or FAQ duplication."
      : s.hasQuickAnswer && s.headingCount >= 3
        ? "Clear opening, headings, and scannable structure."
        : "Structure is adequate but could be more scannable.",
    evidence: [
      { label: "Quick answer", present: s.hasQuickAnswer },
      {
        label: "Headings",
        detail: String(s.headingCount),
        present: s.headingCount >= 3,
      },
      { label: "Logical sequence", present: s.hasLogicalSequence },
      { label: "Tables/cards", present: s.usesTablesOrCards },
      { label: "Bloated intro", present: !s.bloatedIntro },
    ],
    gap:
      score <= 2
        ? "Tighten intro, improve heading hierarchy, reduce repetition."
        : undefined,
    recommendations:
      score <= 3
        ? [
            {
              summary:
                "Lead with a quick answer, use purposeful headings, prefer tables/cards over dense prose where comparing.",
              priority: "quick-win",
              relatedDimension: "structure-readability",
            },
          ]
        : [],
  };
}

function scoreMedia(
  snap: NormalizedSnap,
  profile: PageQualityProfile,
): ScoreParts {
  const m = snap.media;
  if (profile.visualsOptional && !m.subjectNeedsVisuals) {
    return {
      score: 4,
      reason: "Visuals optional for this subject; not penalized for simplicity.",
      evidence: [{ label: "Visuals optional", present: true }],
      recommendations: [],
    };
  }
  let score = 2;
  if (m.teachingVisualCount >= 1) score = 3;
  if (m.teachingVisualCount >= 2 || m.workflowDiagram || m.comparisonMatrix) {
    score = 4;
  }
  if (
    m.teachingVisualCount >= 2 &&
    (m.workflowDiagram || m.comparisonMatrix || m.checklistVisual)
  ) {
    score = 5;
  }
  if (m.decorativeOnly && m.teachingVisualCount === 0) score = 1;
  if (m.subjectNeedsVisuals && m.teachingVisualCount === 0) score = Math.min(score, 2);

  return {
    score: clampScore(score),
    reason:
      m.teachingVisualCount === 0
        ? m.subjectNeedsVisuals
          ? "No teaching visuals where the subject would benefit."
          : "No visuals; subject may not require them."
        : `Teaching visuals present (${m.teachingVisualCount}).`,
    evidence: [
      {
        label: "Teaching visuals",
        detail: String(m.teachingVisualCount),
        present: m.teachingVisualCount > 0,
      },
      { label: "Workflow diagram", present: m.workflowDiagram },
      { label: "Comparison matrix", present: m.comparisonMatrix },
      { label: "Decorative only", present: !m.decorativeOnly },
    ],
    gap:
      score <= 2 && m.subjectNeedsVisuals
        ? "Add workflow diagram, matrix, screenshot, or teaching figure — not decorative filler."
        : undefined,
    recommendations:
      score <= 2 && m.subjectNeedsVisuals
        ? [
            {
              summary:
                "Add a teaching visual (workflow, matrix, screenshot, checklist) with a caption that explains the concept.",
              priority: "major",
              relatedDimension: "visual-media-support",
            },
          ]
        : [],
  };
}

function scoreLinking(snap: NormalizedSnap): ScoreParts {
  const l = snap.linking;
  let score = 1;
  if (l.parentHubLink) score += 1;
  if (l.supportingContentLinks > 0) score += 1;
  if (l.productLinks + l.toolLinks + l.resourceLinks > 0) score += 1;
  if (l.nextStepLink) score += 1;
  if (l.orphanRisk) score = Math.min(score, 1);
  if (l.lowQualityLinkSpam) score = Math.min(score, 2);

  return {
    score: clampScore(score),
    reason: l.orphanRisk
      ? "Orphan risk — missing parent/hub or meaningful outbound links."
      : l.parentHubLink && l.nextStepLink
        ? "Parent/hub and next-step linking present; supporting links evaluated for quality."
        : "Internal linking incomplete relative to journey architecture.",
    evidence: [
      { label: "Parent/hub link", present: l.parentHubLink },
      {
        label: "Supporting links",
        detail: String(l.supportingContentLinks),
        present: l.supportingContentLinks > 0,
      },
      {
        label: "Tool links",
        detail: String(l.toolLinks),
        present: l.toolLinks > 0,
      },
      { label: "Next-step link", present: l.nextStepLink },
      { label: "Orphan risk", present: !l.orphanRisk },
    ],
    gap:
      score <= 2
        ? "Add parent hub, supporting entity, tool/resource, and next-step links per linking architecture."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Wire parent/hub, supports/supported-by, tool-for / resource-for, and next-step per CRM linking blueprint.",
              priority: "major",
              relatedDimension: "internal-linking",
            },
          ]
        : [],
  };
}

function scoreJourney(snap: NormalizedSnap): ScoreParts {
  const j = snap.journey;
  const hasNext = snap.linking.nextStepLink || Boolean(j.nextStepLabel);
  let score = 2;
  if (!j.missingNextStep && hasNext) {
    score = 3;
  }
  if (j.nextStepFitsStage === true) score = 5;
  if (j.nextStepFitsStage === false) score = 2;
  if (j.missingNextStep || !hasNext) score = Math.min(score, 1);

  return {
    score: clampScore(score),
    reason: j.missingNextStep || !hasNext
      ? "No logical next-step for the buyer journey stage."
      : j.nextStepFitsStage === false
        ? `Next step “${j.nextStepLabel ?? "?"}” does not fit stage ${j.stage ?? "unknown"}.`
        : `Next step fits journey stage${j.stage ? ` (${j.stage})` : ""}.`,
    evidence: [
      { label: "Stage", detail: j.stage ?? "unknown", present: Boolean(j.stage) },
      {
        label: "Next step",
        detail: j.nextStepLabel ?? "missing",
        present: hasNext,
      },
      {
        label: "Fits stage",
        present: j.nextStepFitsStage !== false,
        detail:
          j.nextStepFitsStage === undefined ? "unknown" : String(j.nextStepFitsStage),
      },
    ],
    gap:
      score <= 2
        ? "Define a stage-appropriate next step (Learn→Requirements→Finder→Review→Compare→Cost→Implement)."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Add a RecommendedNextStep module that matches the page’s journey stage.",
              priority: "major",
              relatedDimension: "journey-next-step",
            },
          ]
        : [],
  };
}

function scoreTrust(
  snap: NormalizedSnap,
  profile: PageQualityProfile,
): ScoreParts {
  const t = snap.trust;
  const commercial = ["product-review", "comparison", "best", "tool-landing"].includes(
    profile.pageType,
  );
  let hits = 0;
  const checks: QualityEvidence[] = [
    {
      label: "Editorial ownership",
      present: t.authorOrEditorialOwnership,
    },
    { label: "Methodology", present: t.methodologyReferenced },
    { label: "Updated date", present: t.updatedDateVisible },
    { label: "Source transparency", present: t.sourceTransparency },
    { label: "Affiliate disclosure", present: t.affiliateDisclosure },
    { label: "Limitations", present: t.limitationsNoted },
    { label: "Confidence", present: t.confidenceStated },
  ];
  hits = checks.filter((c) => c.present).length;
  let score = Math.min(5, Math.ceil(hits / 1.4));
  if (commercial && !t.affiliateDisclosure) score = Math.min(score, 2);
  if (commercial && !t.methodologyReferenced && profile.pageType !== "tool-landing") {
    score = Math.min(score, 3);
  }

  return {
    score: clampScore(score),
    reason: commercial
      ? t.affiliateDisclosure && (t.methodologyReferenced || profile.pageType === "tool-landing")
        ? "Commercial trust signals present (disclosure, methodology/ownership as applicable)."
        : "Commercial page missing key trust signals (disclosure and/or methodology)."
      : hits >= 3
        ? "Adequate trust/transparency for page type."
        : "Limited trust signals — acceptable if page type does not require all elements.",
    evidence: checks,
    gap:
      commercial && (!t.affiliateDisclosure || !t.methodologyReferenced)
        ? "Add affiliate disclosure and methodology reference where commercial."
        : undefined,
    recommendations:
      commercial && !t.affiliateDisclosure
        ? [
            {
              summary: "Surface affiliate disclosure on commercial decision pages.",
              priority: "critical",
              relatedDimension: "trust-transparency",
            },
          ]
        : [],
  };
}

function scoreDifferentiation(snap: NormalizedSnap): ScoreParts {
  const d = snap.differentiation;
  let score = 4;
  if (!d.distinctPurpose) score = 1;
  if (d.duplicateIntentRisk) score = Math.min(score, 1);
  if (d.onlyH1Changed) score = Math.min(score, 1);
  if (d.genericCategoryCopy) score = Math.min(score, 2);
  if (d.semanticOverlapWith.length > 0) score = Math.min(score, 3);
  if (
    d.distinctPurpose &&
    !d.duplicateIntentRisk &&
    !d.onlyH1Changed &&
    !d.genericCategoryCopy
  ) {
    score = 5;
  }

  return {
    score: clampScore(score),
    reason: d.duplicateIntentRisk || d.onlyH1Changed
      ? `Differentiation risk${d.nearDuplicateOf ? ` vs ${d.nearDuplicateOf}` : ""}.`
      : d.genericCategoryCopy
        ? "Industry/use-case content reads like a generic category copy."
        : "Page has a distinct purpose from related siblings.",
    evidence: [
      { label: "Distinct purpose", present: d.distinctPurpose },
      { label: "Duplicate intent risk", present: !d.duplicateIntentRisk },
      { label: "Only H1 changed", present: !d.onlyH1Changed },
      { label: "Generic category copy", present: !d.genericCategoryCopy },
      ...(d.nearDuplicateOf
        ? [
            {
              label: "Near duplicate of",
              detail: d.nearDuplicateOf,
              present: false as const,
            },
          ]
        : []),
      ...d.semanticOverlapWith.map((id) => ({
        label: `Overlap: ${id}`,
        present: false as const,
      })),
    ],
    gap:
      score <= 2
        ? "Merge, retarget, or deepen the page so it owns a unique question/job."
        : undefined,
    recommendations:
      score <= 2
        ? [
            {
              summary:
                "Resolve duplicate intent / H1-only variants; give this page a unique job in the content map.",
              priority: "critical",
              relatedDimension: "content-differentiation",
            },
          ]
        : [],
  };
}

function scorePageTypeSpecific(
  snap: NormalizedSnap,
  profile: PageQualityProfile,
): ScoreParts {
  const expected = profile.checklist;
  const passed = new Set(snap.pageTypeChecklist.passed);
  const failed = [
    ...new Set([
      ...snap.pageTypeChecklist.failed,
      ...expected.filter((c) => !passed.has(c)),
    ]),
  ].filter((c) => !passed.has(c));
  const hit = expected.filter((c) => passed.has(c)).length;
  const ratio = expected.length ? hit / expected.length : 1;
  let score = Math.round(ratio * 5);
  if (hit === 0 && expected.length) score = 0;

  return {
    score: clampScore(score),
    reason:
      failed.length === 0
        ? `All ${profile.id} checklist items passed.`
        : `${failed.length} ${profile.id} checklist item(s) failed.`,
    evidence: [
      ...[...passed].slice(0, 10).map((c) => ({
        label: `Pass: ${c}`,
        present: true as const,
      })),
      ...failed.slice(0, 10).map((c) => ({
        label: `Fail: ${c}`,
        present: false as const,
      })),
    ],
    gap: failed.length ? `Failed: ${failed.join(", ")}` : undefined,
    recommendations: failed.slice(0, 5).map((c) => ({
      summary: `Satisfy page-type checklist item “${c}”.`,
      priority: (score <= 2 ? "critical" : "major") as QualityRecommendation["priority"],
      relatedDimension: "page-type-specific" as const,
    })),
  };
}

const SCORERS: Record<
  ContentQualityDimensionId,
  (snap: NormalizedSnap, profile: PageQualityProfile) => ScoreParts
> = {
  "user-intent-fit": scoreIntent,
  "content-completeness": scoreCompleteness,
  "subject-depth": (s) => scoreDepth(s),
  "original-value": (s) => scoreOriginal(s),
  "evidence-source-quality": (s) => scoreEvidence(s),
  "research-freshness": (s) => scoreFreshness(s),
  "decision-support": (s) => scoreDecision(s),
  actionability: (s) => scoreAction(s),
  "structure-readability": (s) => scoreStructure(s),
  "visual-media-support": scoreMedia,
  "internal-linking": (s) => scoreLinking(s),
  "journey-next-step": (s) => scoreJourney(s),
  "trust-transparency": scoreTrust,
  "content-differentiation": (s) => scoreDifferentiation(s),
  "page-type-specific": scorePageTypeSpecific,
};

function collectBuckets(dimensions: DimensionAssessment[]): {
  strengths: string[];
  weaknesses: string[];
  criticalGaps: string[];
  quickWins: string[];
  majorImprovements: string[];
  researchGaps: string[];
  linkingGaps: string[];
  mediaGaps: string[];
  toolOpportunities: string[];
  resourceOpportunities: string[];
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const criticalGaps: string[] = [];
  const quickWins: string[] = [];
  const majorImprovements: string[] = [];
  const researchGaps: string[] = [];
  const linkingGaps: string[] = [];
  const mediaGaps: string[] = [];
  const toolOpportunities: string[] = [];
  const resourceOpportunities: string[] = [];

  for (const d of dimensions) {
    if (d.score >= 4) strengths.push(`${d.label}: ${d.reason}`);
    if (d.score <= 2) weaknesses.push(`${d.label}: ${d.reason}`);
    if (d.gap && d.score <= 1) criticalGaps.push(`${d.label}: ${d.gap}`);
    for (const r of d.recommendations) {
      if (r.priority === "critical" || r.priority === "major") {
        if (d.score <= 1) criticalGaps.push(r.summary);
        else majorImprovements.push(r.summary);
      }
      if (r.priority === "quick-win") quickWins.push(r.summary);
      if (
        /research refresh|stale|verification dates|unsupported claim|primary sources|pricing sources|fact ref/i.test(
          r.summary,
        )
      ) {
        researchGaps.push(r.summary);
      }
      if (
        /parent\/hub|orphan|next-step|supports\/supported-by|internal.?link|linking blueprint/i.test(
          r.summary,
        )
      ) {
        linkingGaps.push(r.summary);
      }
      if (/visual|screenshot|diagram|media|figure|teaching visual/i.test(r.summary)) {
        mediaGaps.push(r.summary);
      }
      if (
        /Finder|Calculator|Requirements Builder|decision tool|open .*tool/i.test(
          r.summary,
        )
      ) {
        toolOpportunities.push(r.summary);
      }
      if (/checklist|scorecard|resource|download|worksheet|template/i.test(r.summary)) {
        resourceOpportunities.push(r.summary);
      }
    }
  }

  const uniq = (arr: string[]) => [...new Set(arr)];
  return {
    strengths: uniq(strengths),
    weaknesses: uniq(weaknesses),
    criticalGaps: uniq(criticalGaps),
    quickWins: uniq(quickWins),
    majorImprovements: uniq(majorImprovements),
    researchGaps: uniq(researchGaps),
    linkingGaps: uniq(linkingGaps),
    mediaGaps: uniq(mediaGaps),
    toolOpportunities: uniq(toolOpportunities),
    resourceOpportunities: uniq(resourceOpportunities),
  };
}

/**
 * Evaluate a normalized page snapshot. Never mutates content.
 */
export function evaluatePageQuality(
  snap: PageQualitySnapshot,
  opts?: { evaluatedAt?: string },
): ContentQualityAssessment {
  const normalized = normalizePageQualitySnapshot(snap);
  const profile = getProfileForPageType(normalized.pageType);
  const weights = resolveWeights(profile);
  const dimensions: DimensionAssessment[] = (
    Object.keys(SCORERS) as ContentQualityDimensionId[]
  ).map((id) => {
    const parts = SCORERS[id](normalized, profile);
    return {
      id,
      label: DIMENSION_LABELS[id],
      score: parts.score,
      weight: weights[id],
      reason: parts.reason,
      evidence: parts.evidence,
      gap: parts.gap,
      recommendations: parts.recommendations,
    };
  });

  const overallScore = computeOverallScore(dimensions);
  const buckets = collectBuckets(dimensions);

  return {
    contentId: normalized.contentId,
    route: normalized.route,
    pageType: normalized.pageType,
    title: normalized.title,
    overallScore,
    qualityBand: qualityBandForScore(overallScore),
    dimensions,
    ...buckets,
    evaluatedAt: opts?.evaluatedAt ?? new Date().toISOString(),
    evaluatorVersion: CONTENT_QUALITY_EVALUATOR_VERSION,
    profileId: profile.id,
    notes: [
      ...normalized.notes,
      "Evaluation only — no content rewrite, publish, or link mutation performed.",
    ],
  };
}
