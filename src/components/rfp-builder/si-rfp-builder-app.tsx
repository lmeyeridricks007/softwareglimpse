/**
 * Sales Intelligence RFP / Vendor Brief Builder interactive app.
 * Persistence: localStorage `sg-si-rfp-brief-v1`
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { track } from "@/analytics";
import type {
  CrmRfpDraft,
  CrmRfpSession,
  DecisionProfile,
  RfpIntegration,
  RfpMode,
  RfpRequirement,
  RfpWizardStep,
} from "@/domain";
import { loadSiDecisionProfile } from "@/services/decision-profile/client";
import {
  detectPostIssueChanges,
  generateNextVersion,
  markIssued,
  requirementsFromLibrary,
  setSiWizardStep,
  STEP_LABELS,
  stepsForMode,
} from "@/services/rfp-builder";
import {
  createSeededSiRfpSession,
  loadSiRfpSession,
  resetSiRfpSession,
  saveSiRfpSession,
  touchSiRfpSession,
} from "@/services/rfp-builder/si-persistence";
import {
  applySiProfileToDraft,
  siIntegrationsFromProfile,
} from "@/services/rfp-builder/si-from-profile";
import {
  RfpPackProvider,
  SI_RFP_PACK,
  type RfpContentPack,
} from "@/services/rfp-builder/pack-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import { RfpModeSelect } from "./mode-select";
import { RfpLiveSummary } from "./live-summary";
import { RfpResults } from "./results";
import {
  RfpStepBusinessContext,
  RfpStepProject,
  RfpStepScopeUsers,
} from "./steps-early";
import { RfpStepRequirements } from "./steps-requirements";
import {
  RfpStepCommercials,
  RfpStepImplementation,
  RfpStepIntegrations,
  RfpStepResponseRules,
  RfpStepReview,
  RfpStepSecuritySupport,
} from "./steps-late";

export type SiRfpBuilderRuntime = {
  pack: RfpContentPack;
  loadSession: () => CrmRfpSession | null;
  saveSession: (session: CrmRfpSession) => void;
  createSeeded: () => CrmRfpSession;
  resetSession: () => CrmRfpSession;
  loadProfile: () => DecisionProfile | null;
  applyProfile: (
    draft: CrmRfpDraft,
    profile: DecisionProfile,
    options?: { replaceRequirements?: boolean; replaceIntegrations?: boolean },
  ) => CrmRfpDraft;
  integrationsFromProfile: (profile: DecisionProfile) => RfpIntegration[];
  requirementsFromLibrary: () => RfpRequirement[];
};

const SI_RFP_RUNTIME: SiRfpBuilderRuntime = {
  pack: SI_RFP_PACK,
  loadSession: loadSiRfpSession,
  saveSession: saveSiRfpSession,
  createSeeded: createSeededSiRfpSession,
  resetSession: resetSiRfpSession,
  loadProfile: loadSiDecisionProfile,
  applyProfile: applySiProfileToDraft,
  integrationsFromProfile: siIntegrationsFromProfile,
  requirementsFromLibrary,
};

function SiRfpBuilderAppInner({ runtime }: { runtime: SiRfpBuilderRuntime }) {
  const [session, setSession] = useState<CrmRfpSession>(() =>
    runtime.createSeeded(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [issuedSnapshot, setIssuedSnapshot] = useState(
    session.draft.requirements,
  );
  const startedRef = useRef(false);
  /** ~1.5–2s reveal so Generate matches other SI decision tools. */
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal(1800);

  useEffect(() => {
    const stored = runtime.loadSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
    if (stored) setSession(stored);
    else setSession(runtime.createSeeded());
    setHasProfile(Boolean(runtime.loadProfile()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    runtime.saveSession(session);
  }, [session, hydrated]);

  const persist = useCallback((next: CrmRfpSession) => {
    setSession(detectPostIssueChanges(next));
  }, []);

  const patchDraft = useCallback(
    (updater: (prev: CrmRfpDraft) => CrmRfpDraft) => {
      setSession((prev) => {
        const nextDraft = updater(prev.draft);
        return detectPostIssueChanges(
          touchSiRfpSession(prev, { draft: nextDraft }),
        );
      });
    },
    [],
  );

  const mode = session.mode;
  const step = session.wizardStepId;
  const formal = mode === "formal-rfp";
  const brief = mode === "vendor-brief";
  const contentSteps = useMemo(() => stepsForMode(mode), [mode]);

  const go = (next: RfpWizardStep) => {
    if (next !== "results") {
      resetReveal();
    }
    persist(setSiWizardStep(session, next));
    if (next !== "mode" && next !== "results") {
      track({
        name: "rfp_step_completed",
        properties: { step: session.wizardStepId, mode: mode ?? null },
      });
    }
  };

  const selectMode = (nextMode: RfpMode) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track({ name: "rfp_builder_started" });
    }
    track({ name: "rfp_mode_selected", properties: { mode: nextMode } });
    resetReveal();
    persist(
      touchSiRfpSession(session, {
        mode: nextMode,
        wizardStepId: "project",
      }),
    );
  };

  const importProfileRequirements = () => {
    const profile = runtime.loadProfile();
    if (!profile) return;
    patchDraft((d) => runtime.applyProfile(d, profile));
    track({ name: "rfp_requirements_imported", properties: { source: "profile" } });
  };

  const importLibrary = () => {
    patchDraft((d) => ({
      ...d,
      requirements: runtime.requirementsFromLibrary(),
    }));
    track({ name: "rfp_requirements_imported", properties: { source: "library" } });
  };

  const importIntegrationsOnly = () => {
    const profile = runtime.loadProfile();
    if (!profile) return;
    patchDraft((d) => ({
      ...d,
      integrations: runtime.integrationsFromProfile(profile),
    }));
  };

  const importBusinessContextHint = () => {
    const profile = runtime.loadProfile();
    if (!profile) return;
    patchDraft((d) =>
      runtime.applyProfile(d, profile, {
        replaceRequirements: false,
        replaceIntegrations: false,
      }),
    );
  };

  const canGenerate =
    session.draft.requirements.filter((r) => r.priority !== "out-of-scope")
      .length > 0;

  const generate = () => {
    if (isLoading) return;
    let next = session;
    if (session.lastIssuedRequirementFingerprint) {
      next = generateNextVersion(session, issuedSnapshot);
    } else {
      next = markIssued(session);
    }
    next = setSiWizardStep(next, "results");
    setIssuedSnapshot(next.draft.requirements);
    persist(next);
    track({
      name: "rfp_generated",
      properties: {
        mode: next.mode ?? null,
        version: next.versionMeta.version,
      },
    });
    startReveal(() => {
      // status flips to ready; results panel renders when !isLoading
    });
  };

  const stepIndex = contentSteps.indexOf(
    step === "results" || step === "mode" ? "review" : (step as typeof contentSteps[number]),
  );

  if (!hydrated) {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]" role="status">
        Loading RFP builder…
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
      {/* Left stepper */}
      <nav
        aria-label="RFP builder steps"
        className="hidden lg:block"
      >
        <Card className="sticky top-4 space-y-4 p-4">
          {mode ? (
            <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Mode
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--sg-color-navy)]">
                {mode === "formal-rfp" ? "Formal RFP" : "Vendor Brief"}
              </p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-[var(--sg-color-primary)]"
                onClick={() => go("mode")}
              >
                Switch mode
              </button>
            </div>
          ) : null}
          <ol className="space-y-1">
            {contentSteps.map((id, idx) => {
              const active = step === id;
              const done =
                stepIndex > idx ||
                step === "results" ||
                (step === "review" && idx < contentSteps.length - 1);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-[var(--sg-radius-md)] px-2 py-1.5 text-left text-sm",
                      active
                        ? "bg-[var(--sg-color-primary-soft)] font-semibold text-[var(--sg-color-primary)]"
                        : "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]",
                    )}
                    onClick={() => go(id)}
                    aria-current={active ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                        done
                          ? "bg-[var(--sg-color-success)] text-white"
                          : active
                            ? "bg-[var(--sg-color-primary)] text-white"
                            : "bg-[var(--sg-color-surface-muted)]",
                      )}
                      aria-hidden
                    >
                      {done ? <Check className="size-3" /> : idx + 1}
                    </span>
                    {STEP_LABELS[id]}
                  </button>
                </li>
              );
            })}
          </ol>
          <Link
            href={runtime.pack.requirementsBuilderHref}
            className="block rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 text-xs text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)]"
          >
            Import requirements from {runtime.pack.requirementsBuilderLabel} →
          </Link>
        </Card>
      </nav>

      {/* Main */}
      <div className="min-w-0">
        <Card className="p-5 sm:p-6">
          {step === "mode" || !mode ? (
            <RfpModeSelect onSelect={selectMode} />
          ) : null}

          {step === "project" && mode ? (
            <RfpStepProject draft={session.draft} patch={patchDraft} brief={brief} />
          ) : null}
          {step === "business-context" && mode ? (
            <RfpStepBusinessContext
              draft={session.draft}
              patch={patchDraft}
              hasProfile={hasProfile}
              onImportProfile={importBusinessContextHint}
            />
          ) : null}
          {step === "scope-users" && mode ? (
            <RfpStepScopeUsers draft={session.draft} patch={patchDraft} />
          ) : null}
          {step === "requirements" && mode ? (
            <RfpStepRequirements
              draft={session.draft}
              patch={patchDraft}
              hasProfile={hasProfile}
              onImportProfile={importProfileRequirements}
              onImportLibrary={importLibrary}
            />
          ) : null}
          {step === "integrations" && mode ? (
            <RfpStepIntegrations
              draft={session.draft}
              patch={patchDraft}
              formal={formal}
              onImportIntegrations={
                hasProfile ? importIntegrationsOnly : undefined
              }
            />
          ) : null}
          {step === "implementation" && mode ? (
            <RfpStepImplementation
              draft={session.draft}
              patch={patchDraft}
              formal={formal}
            />
          ) : null}
          {step === "security-support" && mode ? (
            <RfpStepSecuritySupport draft={session.draft} patch={patchDraft} />
          ) : null}
          {step === "commercials" && mode ? (
            <RfpStepCommercials draft={session.draft} patch={patchDraft} />
          ) : null}
          {step === "response-rules" && mode ? (
            <RfpStepResponseRules draft={session.draft} patch={patchDraft} />
          ) : null}
          {step === "review" && mode ? (
            <RfpStepReview
              draft={session.draft}
              mode={mode}
              onEditStep={(s) => go(s as RfpWizardStep)}
              onGenerate={generate}
              canGenerate={canGenerate && !isLoading}
            />
          ) : null}
          {step === "results" && mode && isLoading ? (
            <ResultsLoadingState
              title={
                mode === "formal-rfp"
                  ? "Generating your Formal RFP…"
                  : "Generating your Vendor Brief…"
              }
              description="Assembling your package from the project context, requirements, integrations and pricing assumptions you entered — nothing invented."
            />
          ) : null}
          {step === "results" && mode && !isLoading ? (
            <RfpResults
              session={session}
              onEdit={() => go("review")}
              onSessionUpdate={persist}
            />
          ) : null}

          {mode && step !== "mode" && step !== "results" && !isLoading ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  const idx = contentSteps.indexOf(step as (typeof contentSteps)[number]);
                  if (idx <= 0) go("mode");
                  else go(contentSteps[idx - 1]!);
                }}
              >
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    runtime.saveSession(session);
                  }}
                >
                  Save draft
                </Button>
                {step !== "review" ? (
                  <Button
                    onClick={() => {
                      const idx = contentSteps.indexOf(
                        step as (typeof contentSteps)[number],
                      );
                      const next = contentSteps[idx + 1];
                      if (next) go(next);
                    }}
                  >
                    Continue
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {mode && step !== "mode" ? (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset this RFP draft on this device? This cannot be undone.",
                    )
                  ) {
                    persist(runtime.resetSession());
                  }
                }}
              >
                Reset draft
              </Button>
            </div>
          ) : null}
        </Card>
      </div>

      {/* Right rail */}
      <div className="hidden lg:block">
        {mode ? (
          <RfpLiveSummary
            session={session}
            onReview={() => go("review")}
          />
        ) : null}
      </div>

      {/* Mobile summary */}
      {mode ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3 lg:hidden">
          <RfpLiveSummary
            session={session}
            collapsed={!mobileSummaryOpen}
            onToggleCollapsed={() => setMobileSummaryOpen((v) => !v)}
            onReview={() => go("review")}
          />
        </div>
      ) : null}
    </div>
  );
}


export function SiRfpBuilderApp({
  runtime = SI_RFP_RUNTIME,
}: {
  runtime?: SiRfpBuilderRuntime;
}) {
  return (
    <RfpPackProvider pack={runtime.pack}>
      <SiRfpBuilderAppInner runtime={runtime} />
    </RfpPackProvider>
  );
}
