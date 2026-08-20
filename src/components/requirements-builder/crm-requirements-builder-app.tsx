/**
 * CRM Requirements Builder — interactive wizard.
 * Persistence: localStorage `sg-crm-decision-profile-v1` only.
 * Does not recommend products. Affiliate status has zero influence.
 */
"use client";

import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shield,
} from "lucide-react";
import { track } from "@/analytics";
import type {
  AdminComplexity,
  CapabilitySelectionPriority,
  CrmCurrentState,
  CrmDecisionProfile,
  FeaturePriority,
  IntegrationPriority,
  MigrationComplexity,
  RequirementPriority,
  UseCaseSelectionPriority,
} from "@/domain";
import {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  INTEGRATION_OPTIONS,
  labelForOption,
} from "@/components/finder/crm-finder-questions";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/cn";
import {
  buildProfileCompleteness,
  buildProfileWarnings,
  createEmptyCrmDecisionProfile,
  deriveCapabilitiesFromUseCases,
  deriveFeaturesFromRequirements,
  deriveRequirementsFromCapabilities,
  listOptionalDirectFeatures,
  listSelectableCrmCapabilities,
  listSelectableCrmUseCases,
  loadCrmDecisionProfile,
  profileToCsvChecklist,
  profileToJsonExport,
  profileToPlainTextSummary,
  resetCrmDecisionProfile,
  resolveRequirementMeta,
  saveCrmDecisionProfile,
  seedProfileFromQuery,
  syncDecisionProfileToCostStorage,
  syncDecisionProfileToFinderStorage,
  touchCrmDecisionProfile,
} from "@/services/decision-profile/client";
import {
  downloadBlob,
  downloadProfilePdf,
  profileToExcelXml,
} from "@/services/decision-profile/export-documents";
import {
  ADMIN_COMPLEXITY_OPTIONS,
  CURRENT_STATE_OPTIONS,
  MIGRATION_COMPLEXITY_OPTIONS,
  SECURITY_REQUIREMENT_SLUGS,
  TEAM_OPTIONS,
  crmRequirementsBuilderDefinition,
} from "./crm/definition";
import { RequirementsBuilderHero } from "./landing/hero";
import {
  RequirementsFaq,
  RequirementsMethodology,
  RequirementsNextSteps,
  RequirementsRelatedGuides,
  RequirementsTrustFooter,
} from "./landing/sections";
import {
  PriorityBadge,
  PrioritySelect,
  SelectableCard,
} from "./ui/priority-controls";
import {
  ProfilePreviewSidebar,
  industryOptions,
  profilePreviewCounts,
} from "./ui/profile-preview";
import { ProfileResultsView } from "./ui/profile-results";

const REQ_PRIORITY_OPTIONS = [
  { value: "must-have", label: "Must have" },
  { value: "important", label: "Important" },
  { value: "nice-to-have", label: "Nice to have" },
  { value: "not-needed", label: "Not needed" },
];

const FEATURE_PRIORITY_OPTIONS = REQ_PRIORITY_OPTIONS.filter(
  (o) => o.value !== "not-needed",
);

const USE_CASE_PRIORITY_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "important", label: "Important" },
  { value: "relevant", label: "Relevant" },
];

const INTEGRATION_PRIORITY_OPTIONS = [
  { value: "required", label: "Required" },
  { value: "preferred", label: "Preferred" },
  { value: "optional", label: "Optional" },
];

type Props = {
  relatedGuides?: Array<{ href: string; label: string }>;
  faqItems: Array<{ question: string; answer: string }>;
  /** When the page shell already emits an SSR H1, pass `"none"`. */
  titleElement?: "h1" | "h2" | "none";
};

export function CrmRequirementsBuilderApp({
  relatedGuides = [],
  faqItems,
  titleElement = "h1",
}: Props) {
  const searchParams = useSearchParams();
  const def = crmRequirementsBuilderDefinition;
  const stages = def.stages;
  const headingId = useId();
  const wizardRef = useRef<HTMLElement | null>(null);

  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  /** Furthest step unlocked for jump-back navigation. */
  const [maxStepIndex, setMaxStepIndex] = useState(0);
  const [profile, setProfile] = useState<CrmDecisionProfile>(() =>
    createEmptyCrmDecisionProfile(),
  );
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const startedTracked = useRef(false);

  useEffect(() => {
    const stored = loadCrmDecisionProfile();
    const base = stored ?? createEmptyCrmDecisionProfile();
    const seeded = seedProfileFromQuery(base, {
      industry: searchParams.get("industry"),
      useCase: searchParams.get("useCase"),
      requirement: searchParams.get("requirement"),
      feature: searchParams.get("feature"),
    });
    setProfile(seeded);
    if (stored?.wizardStepId) {
      const idx = stages.findIndex((s) => s.id === stored.wizardStepId);
      if (idx >= 0) {
        setStepIndex(idx);
        setMaxStepIndex(idx);
        setStarted(true);
      }
    }
    if (
      searchParams.get("industry") ||
      searchParams.get("useCase") ||
      searchParams.get("start") === "1"
    ) {
      setStarted(true);
    }
    setHydrated(true);
  }, [searchParams, stages]);

  const persist = useCallback((next: CrmDecisionProfile) => {
    saveCrmDecisionProfile(next);
    setProfile(next);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<CrmDecisionProfile>) => {
      const next = touchCrmDecisionProfile(profile, {
        ...patch,
        wizardStepId: stages[stepIndex]?.id,
      });
      persist(next);
    },
    [persist, profile, stages, stepIndex],
  );

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(stages.length - 1, index));
      setStepIndex(clamped);
      setMaxStepIndex((prev) => Math.max(prev, clamped));
      const next = touchCrmDecisionProfile(profile, {
        wizardStepId: stages[clamped]?.id,
      });
      persist(next);
      wizardRef.current?.focus();
      if (clamped > 0 && clamped < stages.length - 1) {
        track({
          name: "requirements_step_completed",
          properties: {
            step: stages[clamped - 1]?.id ?? String(clamped),
            category: "crm",
          },
        });
      }
    },
    [persist, profile, stages],
  );

  const startBuilding = () => {
    setStarted(true);
    setStepIndex(0);
    setMaxStepIndex(0);
    if (!startedTracked.current) {
      startedTracked.current = true;
      track({
        name: "crm_requirements_started",
        properties: { category: "crm" },
      });
      track({ name: "tool_start", properties: { tool: def.id } });
    }
    requestAnimationFrame(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      wizardRef.current?.focus();
    });
  };

  const seeExample = () => {
    document
      .getElementById("example-anchor")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const activeStep = stages[stepIndex];
  const isResults = activeStep?.id === "results";
  const warnings = useMemo(() => buildProfileWarnings(profile), [profile]);
  const completeness = useMemo(
    () => buildProfileCompleteness(profile),
    [profile],
  );

  const handleReset = () => {
    const empty = resetCrmDecisionProfile();
    setProfile(empty);
    setStepIndex(0);
    setMaxStepIndex(0);
    setStarted(false);
  };

  const handoffToFinder = () => {
    syncDecisionProfileToFinderStorage(profile);
    track({
      name: "requirements_to_finder_clicked",
      properties: { category: "crm" },
    });
    window.location.href = def.finderHref;
  };

  const handoffToCost = () => {
    syncDecisionProfileToCostStorage(profile);
    track({
      name: "requirements_to_cost_clicked",
      properties: { category: "crm" },
    });
    window.location.href = def.calculatorHref;
  };

  const handoffToCompare = () => {
    syncDecisionProfileToFinderStorage(profile);
    window.location.href = def.compareHref;
  };

  const handoffToScorecard = () => {
    if (!def.scorecardHref) return;
    syncDecisionProfileToFinderStorage(profile);
    window.location.href = def.scorecardHref;
  };

  const exportText = async (kind: "copy" | "json" | "csv") => {
    const payload =
      kind === "json"
        ? profileToJsonExport(profile)
        : kind === "csv"
          ? profileToCsvChecklist(profile)
          : profileToPlainTextSummary(profile);
    if (kind === "copy") {
      await navigator.clipboard.writeText(payload);
      setCopyStatus("Copied requirements summary");
    } else {
      const blob = new Blob([payload], {
        type: kind === "json" ? "application/json" : "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        kind === "json"
          ? "crm-requirements-profile.json"
          : "crm-requirements-checklist.csv";
      a.click();
      URL.revokeObjectURL(url);
      setCopyStatus(kind === "json" ? "Downloaded JSON" : "Downloaded CSV");
    }
    track({
      name: "requirements_exported",
      properties: { format: kind, category: "crm" },
    });
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const exportPdf = () => {
    void downloadProfilePdf(profile)
      .then(() => {
        track({
          name: "requirements_exported",
          properties: { format: "pdf", category: "crm" },
        });
        setCopyStatus("Downloaded PDF");
        setTimeout(() => setCopyStatus(null), 2500);
      })
      .catch(() => {
        setCopyStatus("PDF download failed — try again");
        setTimeout(() => setCopyStatus(null), 3500);
      });
  };

  const exportExcel = () => {
    downloadBlob(
      profileToExcelXml(profile),
      "crm-requirements-profile.xls",
      "application/vnd.ms-excel",
    );
    track({
      name: "requirements_exported",
      properties: { format: "excel", category: "crm" },
    });
    setCopyStatus("Downloaded Excel spreadsheet");
    setTimeout(() => setCopyStatus(null), 2500);
  };

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
        Loading requirements builder…
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <RequirementsBuilderHero
        onStart={startBuilding}
        onSeeExample={seeExample}
        titleElement={titleElement}
      />
      <div id="example-anchor" className="sr-only">
        Example output is shown in the hero preview.
      </div>

      <section
        ref={wizardRef}
        tabIndex={-1}
        aria-labelledby={headingId}
        className="scroll-mt-24 outline-none"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id={headingId}
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
            >
              {started ? activeStep?.label : "Interactive requirements builder"}
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {def.estimatedMinutes} · Progress saves on this device
            </p>
          </div>
          {started ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-navy)]"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset profile
            </button>
          ) : null}
        </div>

        {!started ? (
          <Card className="border-dashed border-[var(--sg-color-border)] p-8 text-center">
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              Start the builder to define business context, use cases,
              requirements and priorities. No product rankings — just your
              structured profile.
            </p>
            <Button type="button" className="mt-4" onClick={startBuilding}>
              Start building requirements
            </Button>
          </Card>
        ) : (
          <>
            <FinderStepper
              stages={stages.map((s) => ({
                id: s.id,
                label: s.shortLabel ?? s.label,
              }))}
              activeIndex={stepIndex}
              maxReachableIndex={maxStepIndex}
              onStageSelect={(_id, index) => goToStep(index)}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
              <div className="min-w-0 space-y-6">
                {stepIndex === 0 && (
                  <BusinessStep profile={profile} onChange={updateProfile} />
                )}
                {stepIndex === 1 && (
                  <UseCasesStep profile={profile} onChange={updateProfile} />
                )}
                {stepIndex === 2 && (
                  <CapabilitiesStep
                    profile={profile}
                    onChange={updateProfile}
                  />
                )}
                {stepIndex === 3 && (
                  <RequirementsStep
                    profile={profile}
                    onChange={updateProfile}
                  />
                )}
                {stepIndex === 4 && (
                  <FeaturesStep profile={profile} onChange={updateProfile} />
                )}
                {stepIndex === 5 && (
                  <IntegrationsStep
                    profile={profile}
                    onChange={updateProfile}
                  />
                )}
                {stepIndex === 6 && (
                  <SecurityStep profile={profile} onChange={updateProfile} />
                )}
                {stepIndex === 7 && (
                  <BudgetStep profile={profile} onChange={updateProfile} />
                )}
                {stepIndex === 8 && (
                  <PrioritizeStep
                    profile={profile}
                    onChange={updateProfile}
                    warnings={warnings}
                  />
                )}
                {stepIndex === 9 && (
                  <ResultsStep
                    profile={profile}
                    completeness={completeness}
                    warnings={warnings}
                    copyStatus={copyStatus}
                    onCopy={() => void exportText("copy")}
                    onPdf={exportPdf}
                    onExcel={exportExcel}
                    onJson={() => void exportText("json")}
                    onCompleteTrack={() => {
                      track({
                        name: "requirements_profile_completed",
                        properties: { category: "crm" },
                      });
                    }}
                  />
                )}

                <WizardControls
                  canBack={stepIndex > 0}
                  isLast={isResults}
                  onBack={() => goToStep(stepIndex - 1)}
                  onNext={() => {
                    if (isResults) return;
                    if (stepIndex === stages.length - 2) {
                      track({
                        name: "requirements_profile_completed",
                        properties: { category: "crm" },
                      });
                    }
                    goToStep(stepIndex + 1);
                  }}
                  onSkip={() => goToStep(stepIndex + 1)}
                  showSkip={!isResults && stepIndex !== 9}
                />
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <ProfilePreviewSidebar
                    profile={profile}
                    onReview={() => goToStep(stages.length - 1)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 lg:hidden">
              <button
                type="button"
                onClick={() => setProfileDrawerOpen(true)}
                className="w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm font-medium text-[var(--sg-color-navy)]"
              >
                View profile ({profilePreviewCounts(profile)})
              </button>
            </div>

            {profileDrawerOpen ? (
              <div
                className="fixed inset-0 z-50 bg-black/40 p-4 lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Requirements profile"
              >
                <div className="ml-auto flex h-full max-w-md flex-col overflow-auto rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface)] p-4">
                  <div className="mb-3 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setProfileDrawerOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <ProfilePreviewSidebar profile={profile} />
                </div>
              </div>
            ) : null}

            {/* Sticky mobile nav */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 p-3 backdrop-blur lg:hidden">
              <div className="mx-auto flex max-w-lg gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={stepIndex === 0}
                  onClick={() => goToStep(stepIndex - 1)}
                >
                  <ChevronLeft className="size-4" aria-hidden />
                  Back
                </Button>
                {!isResults ? (
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => goToStep(stepIndex + 1)}
                  >
                    Continue
                    <ChevronRight className="size-4" aria-hidden />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={handoffToFinder}
                  >
                    Find CRMs
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {isResults || !started ? (
        <RequirementsNextSteps
          onFind={handoffToFinder}
          onCompare={handoffToCompare}
          onCost={handoffToCost}
          onScorecard={def.scorecardHref ? handoffToScorecard : undefined}
        />
      ) : null}

      <RequirementsMethodology />
      <RequirementsRelatedGuides guides={relatedGuides} />
      <RequirementsFaq items={faqItems} />
      <RequirementsTrustFooter />
    </div>
  );
}

function WizardControls({
  canBack,
  isLast,
  onBack,
  onNext,
  onSkip,
  showSkip,
}: {
  canBack: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  showSkip: boolean;
}) {
  return (
    <div className="hidden items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4 lg:flex">
      <Button
        type="button"
        variant="outline"
        disabled={!canBack}
        onClick={onBack}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back
      </Button>
      <div className="flex items-center gap-3">
        {showSkip && !isLast ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:underline"
          >
            Skip for now
          </button>
        ) : null}
        {!isLast ? (
          <Button type="button" onClick={onNext}>
            Save & Continue
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="space-y-6 border-[var(--sg-color-border)] p-5 sm:p-6">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}

function BusinessStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const bc = profile.businessContext;
  const industries = industryOptions();

  return (
    <StepShell
      title="Tell us about your business"
      description="Only details that help evaluate CRM fit downstream."
    >
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Industry and business type</legend>
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-navy)]">
            Industry
          </span>
          <select
            className="mt-1.5 w-full min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3"
            value={bc.industrySlug ?? ""}
            onChange={(e) =>
              onChange({
                businessContext: {
                  ...bc,
                  industrySlug: e.target.value || undefined,
                },
              })
            }
          >
            <option value="">Not sure / skip</option>
            {industries.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-navy)]">
            Business type
          </span>
          <select
            className="mt-1.5 w-full min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3"
            value={bc.businessTypeSlug ?? ""}
            onChange={(e) =>
              onChange({
                businessContext: {
                  ...bc,
                  businessTypeSlug: e.target.value || undefined,
                },
              })
            }
          >
            <option value="">Not sure / skip</option>
            {BUSINESS_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Company size and CRM users</legend>
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-navy)]">
            Company size
          </span>
          <select
            className="mt-1.5 w-full min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3"
            value={bc.companySizeSlug ?? ""}
            onChange={(e) =>
              onChange({
                businessContext: {
                  ...bc,
                  companySizeSlug: e.target.value || undefined,
                },
              })
            }
          >
            <option value="">Select…</option>
            {COMPANY_SIZE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-navy)]">
            Expected CRM users
          </span>
          <input
            type="number"
            min={1}
            max={10000}
            className="mt-1.5 w-full min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3"
            value={bc.crmUserCount ?? ""}
            onChange={(e) => {
              const n = Number(e.target.value);
              onChange({
                businessContext: {
                  ...bc,
                  crmUserCount: Number.isFinite(n) && n >= 1 ? n : undefined,
                },
              });
            }}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Who will primarily use CRM?
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TEAM_OPTIONS.map((team) => {
            const selected = bc.teamIds.includes(team.value);
            return (
              <button
                key={team.value}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  const teamIds = selected
                    ? bc.teamIds.filter((t) => t !== team.value)
                    : [...bc.teamIds, team.value];
                  onChange({ businessContext: { ...bc, teamIds } });
                }}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--sg-radius-md)] border px-3 text-sm font-medium",
                  selected
                    ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)]"
                    : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)]",
                )}
              >
                {selected ? <Check className="size-3.5" aria-hidden /> : null}
                {team.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Current situation
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {CURRENT_STATE_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              selected={bc.currentState === opt.value}
              title={opt.label}
              description={opt.description}
              icon={<Building2 className="size-4 text-[var(--sg-color-primary)]" />}
              onClick={() =>
                onChange({
                  businessContext: {
                    ...bc,
                    currentState: opt.value as CrmCurrentState,
                  },
                })
              }
            />
          ))}
        </div>
      </fieldset>
    </StepShell>
  );
}

function UseCasesStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const options = listSelectableCrmUseCases();

  const toggle = (slug: string) => {
    const existing = profile.useCases.find((u) => u.id === slug);
    if (existing) {
      onChange({
        useCases: profile.useCases.filter((u) => u.id !== slug),
      });
      return;
    }
    const hasPrimary = profile.useCases.some((u) => u.priority === "primary");
    onChange({
      useCases: [
        ...profile.useCases,
        {
          id: slug,
          priority: (hasPrimary ? "important" : "primary") as UseCaseSelectionPriority,
        },
      ],
    });
  };

  return (
    <StepShell
      title="What do you need CRM for?"
      description="Select use cases from the SoftwareGlimpse CRM taxonomy. Mark one as primary."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((uc) => {
          const selected = profile.useCases.find((u) => u.id === uc.slug);
          return (
            <div key={uc.slug} className="space-y-2">
              <SelectableCard
                multi
                selected={Boolean(selected)}
                title={uc.name}
                description={uc.tagline}
                onClick={() => toggle(uc.slug)}
              />
              {selected ? (
                <PrioritySelect
                  id={`uc-pri-${uc.slug}`}
                  label={`Priority for ${uc.name}`}
                  value={selected.priority}
                  options={USE_CASE_PRIORITY_OPTIONS}
                  onChange={(value) => {
                    onChange({
                      useCases: profile.useCases.map((u) =>
                        u.id === uc.slug
                          ? {
                              ...u,
                              priority: value as UseCaseSelectionPriority,
                            }
                          : u,
                      ),
                    });
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}

function CapabilitiesStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const { recommended, other } = deriveCapabilitiesFromUseCases(
    profile.useCases.map((u) => u.id),
    profile.capabilities,
  );

  // Keep recommended in profile when entering step
  useEffect(() => {
    const mergedIds = new Set(profile.capabilities.map((c) => c.id));
    const toAdd = recommended.filter((r) => !mergedIds.has(r.id));
    if (toAdd.length === 0) return;
    onChange({ capabilities: [...profile.capabilities, ...toAdd] });
    // intentionally only on mount / use-case change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.useCases.map((u) => u.id).join(",")]);

  const selectedIds = new Set(profile.capabilities.map((c) => c.id));
  const allCaps = listSelectableCrmCapabilities();

  const toggle = (slug: string) => {
    if (selectedIds.has(slug)) {
      onChange({
        capabilities: profile.capabilities.filter((c) => c.id !== slug),
      });
      return;
    }
    onChange({
      capabilities: [
        ...profile.capabilities,
        {
          id: slug,
          priority: "important" as CapabilitySelectionPriority,
          source: "user-selected",
        },
      ],
    });
  };

  return (
    <StepShell
      title="Which CRM capabilities matter?"
      description="Recommended capabilities come from your use cases. Add or remove freely."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Recommended based on your use cases
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {recommended.map((cap) => {
            const meta = allCaps.find((c) => c.slug === cap.id);
            return (
              <SelectableCard
                key={cap.id}
                multi
                selected={selectedIds.has(cap.id)}
                title={meta?.name ?? cap.id}
                description={meta?.coreObjective}
                badge={<PriorityBadge priority={cap.priority} />}
                onClick={() => toggle(cap.id)}
              />
            );
          })}
          {recommended.length === 0 ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              Select use cases first to see recommendations — or pick from other
              capabilities below.
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Other CRM capabilities
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {other.map((cap) => (
            <SelectableCard
              key={cap.slug}
              multi
              selected={selectedIds.has(cap.slug)}
              title={cap.name}
              description={cap.coreObjective}
              onClick={() => toggle(cap.slug)}
            />
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function RequirementsStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const derived = useMemo(
    () =>
      deriveRequirementsFromCapabilities(
        profile.capabilities.map((c) => c.id),
        profile.useCases.map((u) => u.id),
        profile.requirements,
      ),
    [profile.capabilities, profile.useCases, profile.requirements],
  );

  useEffect(() => {
    const existing = new Set(profile.requirements.map((r) => r.id));
    const missing = derived.filter((d) => !existing.has(d.id));
    if (missing.length === 0) return;
    onChange({ requirements: [...profile.requirements, ...missing] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derived.map((d) => d.id).join(",")]);

  const byCapability = new Map<string, typeof derived>();
  for (const req of profile.requirements) {
    const meta = resolveRequirementMeta(req.id);
    const key = meta?.capabilityName ?? "Other";
    const list = byCapability.get(key) ?? [];
    list.push(req);
    byCapability.set(key, list);
  }

  return (
    <StepShell
      title="Prioritize buyer requirements"
      description="Requirements are derived from your capabilities and use cases via the CRM knowledge graph."
    >
      {[...byCapability.entries()].map(([capName, reqs]) => (
        <div key={capName} className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {capName}
          </h4>
          {reqs.map((req) => {
            const meta = resolveRequirementMeta(req.id);
            if (!meta) return null;
            return (
              <div
                key={req.id}
                className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--sg-color-navy)]">
                      {meta.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                      {meta.shortExplanation}
                    </p>
                    <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                      Capability: {meta.capabilityName} · {meta.featureCount}{" "}
                      related features
                      {meta.href ? (
                        <>
                          {" · "}
                          <a
                            href={meta.href}
                            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                          >
                            Learn more
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <PrioritySelect
                    id={`req-${req.id}`}
                    label={`Priority for ${meta.name}`}
                    value={req.priority}
                    options={REQ_PRIORITY_OPTIONS}
                    onChange={(value) => {
                      track({
                        name: "requirement_priority_changed",
                        properties: {
                          requirement: req.id,
                          priority: value,
                        },
                      });
                      onChange({
                        requirements: profile.requirements.map((r) =>
                          r.id === req.id
                            ? {
                                ...r,
                                priority: value as RequirementPriority,
                                source: "user-selected",
                              }
                            : r,
                        ),
                      });
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {profile.requirements.length === 0 ? (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Select capabilities to surface buyer requirements.
        </p>
      ) : null}
    </StepShell>
  );
}

function FeaturesStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const derived = useMemo(
    () =>
      deriveFeaturesFromRequirements(profile.requirements, profile.features),
    [profile.requirements, profile.features],
  );

  useEffect(() => {
    const existing = new Set(profile.features.map((f) => f.id));
    const missing = derived.filter((d) => !existing.has(d.id));
    if (missing.length === 0) return;
    onChange({ features: [...profile.features, ...missing] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derived.map((d) => `${d.id}:${d.priority}`).join(",")]);

  const optional = listOptionalDirectFeatures().filter(
    (f) => !profile.features.some((pf) => pf.id === f.slug),
  );

  const activeReqs = profile.requirements.filter(
    (r) => r.priority !== "not-needed",
  );

  return (
    <StepShell
      title="Feature priorities"
      description="Most features are implied by your requirements. Optionally add direct feature needs."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Features implied by your requirements
        </p>
        <ul className="mt-3 space-y-2">
          {profile.features.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sg-color-navy)]">
                <Check className="size-4 text-[var(--sg-color-success)]" aria-hidden />
                {featureLabel(f.id)}
              </span>
              <PrioritySelect
                id={`feat-${f.id}`}
                label={`Priority for ${f.id}`}
                value={f.priority}
                options={FEATURE_PRIORITY_OPTIONS}
                onChange={(value) =>
                  onChange({
                    features: profile.features.map((item) =>
                      item.id === f.id
                        ? {
                            ...item,
                            priority: value as FeaturePriority,
                            source: "user-selected",
                          }
                        : item,
                    ),
                  })
                }
              />
            </li>
          ))}
        </ul>
      </div>

      {activeReqs.slice(0, 3).map((req) => {
        const meta = resolveRequirementMeta(req.id);
        if (!meta || meta.featureLinks.length === 0) return null;
        return (
          <div
            key={req.id}
            className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-surface-muted)]/50 p-4"
          >
            <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
              {meta.name}
            </p>
            <p className="mt-2 text-xs font-medium uppercase text-[var(--sg-color-text-muted)]">
              Requires
            </p>
            <ul className="mt-1 space-y-1">
              {meta.featureLinks
                .filter((l) => l.relationship === "required")
                .map((l) => (
                  <li key={l.featureSlug} className="text-sm">
                    ✓ {l.name}
                  </li>
                ))}
            </ul>
            <p className="mt-2 text-xs font-medium uppercase text-[var(--sg-color-text-muted)]">
              Supported by
            </p>
            <ul className="mt-1 space-y-1">
              {meta.featureLinks
                .filter((l) => l.relationship !== "required")
                .map((l) => (
                  <li key={l.featureSlug} className="text-sm text-[var(--sg-color-text-muted)]">
                    ○ {l.name}
                  </li>
                ))}
            </ul>
          </div>
        );
      })}

      {optional.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Optionally add direct feature requirements
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {optional.map((f) => (
              <button
                key={f.slug}
                type="button"
                className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] px-3 py-1.5 text-sm hover:border-[var(--sg-color-primary)]"
                onClick={() =>
                  onChange({
                    features: [
                      ...profile.features,
                      {
                        id: f.slug,
                        priority: "nice-to-have",
                        source: "user-selected",
                      },
                    ],
                  })
                }
              >
                + {f.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </StepShell>
  );
}

function IntegrationsStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const options = INTEGRATION_OPTIONS.filter((o) => o.value !== "none");

  return (
    <StepShell
      title="What must the CRM connect to?"
      description="Named integrations from the SoftwareGlimpse catalogue. Priority: required, preferred, or optional."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = profile.integrations.find((i) => i.id === opt.value);
          return (
            <div key={opt.value} className="space-y-2">
              <SelectableCard
                multi
                selected={Boolean(selected)}
                title={opt.label}
                onClick={() => {
                  if (selected) {
                    onChange({
                      integrations: profile.integrations.filter(
                        (i) => i.id !== opt.value,
                      ),
                    });
                  } else {
                    onChange({
                      integrations: [
                        ...profile.integrations,
                        { id: opt.value, priority: "preferred" },
                      ],
                    });
                  }
                }}
              />
              {selected ? (
                <PrioritySelect
                  id={`int-${opt.value}`}
                  label={`Priority for ${opt.label}`}
                  value={selected.priority}
                  options={INTEGRATION_PRIORITY_OPTIONS}
                  onChange={(value) =>
                    onChange({
                      integrations: profile.integrations.map((i) =>
                        i.id === opt.value
                          ? { ...i, priority: value as IntegrationPriority }
                          : i,
                      ),
                    })
                  }
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}

function SecurityStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  const ensureSecurityReqs = () => {
    const existing = new Set(profile.requirements.map((r) => r.id));
    const additions = SECURITY_REQUIREMENT_SLUGS.filter(
      (slug) => !existing.has(slug) && resolveRequirementMeta(slug),
    ).map((slug) => ({
      id: slug,
      priority: "important" as RequirementPriority,
      source: "inferred-from-capability" as const,
    }));
    if (additions.length === 0) return profile.requirements;
    return [...profile.requirements, ...additions];
  };

  useEffect(() => {
    const next = ensureSecurityReqs();
    if (next.length !== profile.requirements.length) {
      onChange({ requirements: next });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepShell
      title="Security & administration"
      description="Requirement-level controls from the CRM taxonomy. We do not imply regulatory compliance."
    >
      <div className="space-y-3">
        {SECURITY_REQUIREMENT_SLUGS.map((slug) => {
          const meta = resolveRequirementMeta(slug);
          const req = profile.requirements.find((r) => r.id === slug);
          if (!meta) return null;
          return (
            <div
              key={slug}
              className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
            >
              <div className="flex gap-3">
                <Shield className="mt-0.5 size-5 text-[var(--sg-color-primary)]" aria-hidden />
                <div>
                  <p className="font-semibold text-[var(--sg-color-navy)]">
                    {meta.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {meta.shortExplanation}
                  </p>
                </div>
              </div>
              <PrioritySelect
                id={`sec-${slug}`}
                label={`Priority for ${meta.name}`}
                value={req?.priority ?? "important"}
                options={REQ_PRIORITY_OPTIONS}
                onChange={(value) => {
                  const others = profile.requirements.filter(
                    (r) => r.id !== slug,
                  );
                  onChange({
                    requirements: [
                      ...others,
                      {
                        id: slug,
                        priority: value as RequirementPriority,
                        source: "user-selected",
                      },
                    ],
                  });
                }}
              />
            </div>
          );
        })}
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          How complex can administration be?
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ADMIN_COMPLEXITY_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              selected={
                profile.implementation.adminComplexity === opt.value
              }
              title={opt.label}
              description={opt.description}
              onClick={() =>
                onChange({
                  implementation: {
                    ...profile.implementation,
                    adminComplexity: opt.value as AdminComplexity,
                  },
                })
              }
            />
          ))}
        </div>
      </fieldset>
    </StepShell>
  );
}

function BudgetStep({
  profile,
  onChange,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
}) {
  return (
    <StepShell
      title="Budget & setup preferences"
      description="Constraints reused by Finder and the Cost Calculator. Currency is EUR per user / month."
    >
      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Budget per user / month
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {BUDGET_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              selected={profile.budget.band === opt.value}
              title={opt.label}
              onClick={() =>
                onChange({
                  budget: {
                    ...profile.budget,
                    band: opt.value as CrmDecisionProfile["budget"]["band"],
                  },
                })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Billing preference
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["monthly", "Monthly"],
              ["annual", "Annual"],
              ["either", "Either"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={profile.budget.billingPreference === value}
              className={cn(
                "min-h-11 rounded-[var(--sg-radius-md)] border px-4 text-sm font-medium",
                profile.budget.billingPreference === value
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                  : "border-[var(--sg-color-border)]",
              )}
              onClick={() =>
                onChange({
                  budget: { ...profile.budget, billingPreference: value },
                })
              }
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Implementation preference
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-1">
          {EASE_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              selected={profile.implementation.complexity === opt.value}
              title={opt.label}
              description={opt.description}
              onClick={() =>
                onChange({
                  implementation: {
                    ...profile.implementation,
                    complexity: opt.value as NonNullable<
                      CrmDecisionProfile["implementation"]["complexity"]
                    >,
                  },
                })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Migration complexity
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {MIGRATION_COMPLEXITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={
                profile.implementation.migrationComplexity === opt.value
              }
              className={cn(
                "min-h-11 rounded-[var(--sg-radius-md)] border px-4 text-sm font-medium",
                profile.implementation.migrationComplexity === opt.value
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                  : "border-[var(--sg-color-border)]",
              )}
              onClick={() =>
                onChange({
                  implementation: {
                    ...profile.implementation,
                    migrationComplexity: opt.value as MigrationComplexity,
                  },
                })
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>
    </StepShell>
  );
}

function PrioritizeStep({
  profile,
  onChange,
  warnings,
}: {
  profile: CrmDecisionProfile;
  onChange: (patch: Partial<CrmDecisionProfile>) => void;
  warnings: ReturnType<typeof buildProfileWarnings>;
}) {
  const must = profile.requirements.filter((r) => r.priority === "must-have");
  const important = profile.requirements.filter(
    (r) => r.priority === "important",
  );
  const nice = profile.requirements.filter(
    (r) => r.priority === "nice-to-have",
  );

  const byCapability = new Map<
    string,
    CrmDecisionProfile["requirements"]
  >();
  for (const req of profile.requirements.filter(
    (r) => r.priority !== "not-needed",
  )) {
    const meta = resolveRequirementMeta(req.id);
    const key = meta?.capabilityName ?? "Other";
    const list = byCapability.get(key) ?? [];
    list.push(req);
    byCapability.set(key, list);
  }

  return (
    <StepShell
      title="Review your priorities"
      description="Adjust priorities so the final profile is intentional."
    >
      <div className="grid grid-cols-3 gap-3">
        <SummaryStat label="Must have" value={must.length} />
        <SummaryStat label="Important" value={important.length} />
        <SummaryStat label="Nice to have" value={nice.length} />
      </div>

      {warnings.map((w) => (
        <Alert
          key={w.id}
          variant={w.severity === "warning" ? "warning" : "info"}
        >
          {w.message}
        </Alert>
      ))}

      {[...byCapability.entries()].map(([cap, reqs]) => (
        <div key={cap} className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            {cap}
          </h4>
          {reqs.map((req) => {
            const meta = resolveRequirementMeta(req.id);
            return (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
              >
                <span className="text-sm font-medium text-[var(--sg-color-text)]">
                  {meta?.name ?? req.id}
                </span>
                <PrioritySelect
                  id={`pri-${req.id}`}
                  label={`Priority for ${req.id}`}
                  value={req.priority}
                  options={REQ_PRIORITY_OPTIONS}
                  onChange={(value) =>
                    onChange({
                      requirements: profile.requirements.map((r) =>
                        r.id === req.id
                          ? {
                              ...r,
                              priority: value as RequirementPriority,
                              source: "user-selected",
                            }
                          : r,
                      ),
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      ))}
    </StepShell>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)]/40 px-3 py-4 text-center">
      <p className="text-2xl font-semibold text-[var(--sg-color-navy)]">
        {value}
      </p>
      <p className="text-xs text-[var(--sg-color-text-muted)]">{label}</p>
    </div>
  );
}

function ResultsStep({
  profile,
  completeness,
  warnings,
  copyStatus,
  onCopy,
  onPdf,
  onExcel,
  onJson,
  onCompleteTrack,
}: {
  profile: CrmDecisionProfile;
  completeness: ReturnType<typeof buildProfileCompleteness>;
  warnings: ReturnType<typeof buildProfileWarnings>;
  copyStatus: string | null;
  onCopy: () => void;
  onPdf: () => void;
  onExcel: () => void;
  onJson: () => void;
  onCompleteTrack: () => void;
}) {
  useEffect(() => {
    onCompleteTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileResultsView
      profile={profile}
      completeness={completeness}
      warnings={warnings}
      copyStatus={copyStatus}
      onCopy={onCopy}
      onPdf={onPdf}
      onExcel={onExcel}
      onJson={onJson}
    />
  );
}

function featureLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
