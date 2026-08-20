/**
 * Category Requirements Builder — writes a DecisionProfile for Finder / Cost / Scorecard.
 * Persistence: localStorage `sg-{category}-decision-profile-v1`.
 */
"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { track } from "@/analytics";
import type {
  DecisionCategorySlug,
  DecisionProfile,
  FeaturePriority,
  IntegrationPriority,
  UseCaseSelectionPriority,
} from "@/domain";
import { createEmptyDecisionProfile } from "@/domain";
import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
} from "@/components/finder/crm-finder-questions";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  loadDecisionProfile,
  saveDecisionProfile,
  syncDecisionProfileToFinderStorage,
  profileToJsonExport,
  profileToPlainTextSummary,
} from "@/services/decision-profile/client";
import {
  downloadBlob,
  downloadProfilePdf,
  profileToExcelXml,
} from "@/services/decision-profile/export-documents";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: "business", label: "Business" },
  { id: "use-cases", label: "Jobs" },
  { id: "capabilities", label: "Capabilities" },
  { id: "integrations", label: "Integrations" },
  { id: "budget", label: "Budget" },
  { id: "results", label: "Results" },
] as const;

type StageId = (typeof STAGES)[number]["id"];

type Props = {
  kit: CategoryFinderClientKit;
};

export function CategoryRequirementsBuilderApp({ kit }: Props) {
  const [stage, setStage] = useState<StageId>("business");
  const [maxIndex, setMaxIndex] = useState(0);
  const [profile, setProfile] = useState<DecisionProfile>(() =>
    createEmptyDecisionProfile(kit.categorySlug as DecisionCategorySlug),
  );
  const [hydrated, setHydrated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadDecisionProfile(
      kit.categorySlug as DecisionCategorySlug,
    );
    if (loaded) setProfile(loaded);
    setHydrated(true);
    track({
      name: "si_requirements_started",
      properties: { category: kit.categorySlug },
    });
  }, [kit.categorySlug]);

  useEffect(() => {
    if (!hydrated) return;
    saveDecisionProfile(profile);
  }, [hydrated, profile]);

  const activeIndex = STAGES.findIndex((s) => s.id === stage);

  function goTo(next: StageId) {
    const idx = STAGES.findIndex((s) => s.id === next);
    setStage(next);
    setMaxIndex((prev) => Math.max(prev, idx));
    track({
      name: "requirements_step_completed",
      properties: { category: kit.categorySlug, step: next },
    });
  }

  function toggleUseCase(slug: string) {
    setProfile((prev) => {
      const exists = prev.useCases.some((uc) => uc.id === slug);
      const useCases = exists
        ? prev.useCases.filter((uc) => uc.id !== slug)
        : [
            ...prev.useCases,
            {
              id: slug,
              priority: "important" as UseCaseSelectionPriority,
            },
          ];
      return { ...prev, useCases };
    });
  }

  function toggleCapability(slug: string) {
    setProfile((prev) => {
      const exists = prev.features.some((f) => f.id === slug);
      const features = exists
        ? prev.features.filter((f) => f.id !== slug)
        : [
            ...prev.features,
            {
              id: slug,
              priority: "must-have" as FeaturePriority,
              source: "user-selected" as const,
            },
          ];
      return { ...prev, features };
    });
  }

  function toggleIntegration(slug: string) {
    if (slug === "none") {
      setProfile((prev) => ({ ...prev, integrations: [] }));
      return;
    }
    setProfile((prev) => {
      const exists = prev.integrations.some((i) => i.id === slug);
      const integrations = exists
        ? prev.integrations.filter((i) => i.id !== slug)
        : [
            ...prev.integrations,
            {
              id: slug,
              priority: "preferred" as IntegrationPriority,
            },
          ];
      return { ...prev, integrations };
    });
  }

  function finish() {
    saveDecisionProfile(profile);
    syncDecisionProfileToFinderStorage(profile);
    goTo("results");
    track({
      name: "requirements_profile_completed",
      properties: { category: kit.categorySlug },
    });
  }

  const exportText = async (kind: "copy" | "json") => {
    const payload =
      kind === "json"
        ? profileToJsonExport(profile)
        : profileToPlainTextSummary(profile);
    if (kind === "copy") {
      await navigator.clipboard.writeText(payload);
      setCopyStatus("Copied requirements summary");
    } else {
      downloadBlob(
        payload,
        `${kit.categorySlug}-requirements-profile.json`,
        "application/json",
      );
      setCopyStatus("Downloaded JSON");
    }
    track({
      name: "requirements_exported",
      properties: { format: kind, category: kit.categorySlug },
    });
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const exportPdf = () => {
    void downloadProfilePdf(profile)
      .then(() => {
        track({
          name: "requirements_exported",
          properties: { format: "pdf", category: kit.categorySlug },
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
      `${kit.categorySlug}-requirements-profile.xls`,
      "application/vnd.ms-excel",
    );
    track({
      name: "requirements_exported",
      properties: { format: "excel", category: kit.categorySlug },
    });
    setCopyStatus("Downloaded Excel spreadsheet");
    setTimeout(() => setCopyStatus(null), 2500);
  };

  return (
    <div id="how-it-works" className="mt-10 space-y-6">
      <FinderStepper
        stages={STAGES.map((s) => ({ id: s.id, label: s.label }))}
        activeIndex={activeIndex}
        maxReachableIndex={maxIndex}
        onStageSelect={(id) => goTo(id as StageId)}
      />

      {stage === "business" ? (
        <Card className="p-5 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            Tell us about your team
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Used to match {kit.softwarePhrase} — not to rank vendors.
          </p>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Company size</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {COMPANY_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      businessContext: {
                        ...prev.businessContext,
                        companySizeSlug: option.value,
                      },
                    }))
                  }
                  className={cn(
                    "min-h-11 rounded-[var(--sg-radius-md)] border px-3 text-sm",
                    profile.businessContext.companySizeSlug === option.value
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                      : "border-[var(--sg-color-border)]",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="mt-6 block text-sm font-medium">
            How many people will use the tool?
            <input
              type="number"
              min={1}
              max={5000}
              value={profile.businessContext.crmUserCount ?? 5}
              onChange={(e) => {
                const n = Number(e.target.value);
                setProfile((prev) => ({
                  ...prev,
                  businessContext: {
                    ...prev.businessContext,
                    crmUserCount: Number.isFinite(n) ? Math.round(n) : 5,
                  },
                }));
              }}
              className="mt-1.5 min-h-12 w-full max-w-xs rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4"
            />
          </label>
          <div className="mt-6">
            <Button type="button" size="lg" onClick={() => goTo("use-cases")}>
              Continue →
            </Button>
          </div>
        </Card>
      ) : null}

      {stage === "use-cases" ? (
        <Card className="p-5 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            Which jobs matter most?
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Select one or more. These become your primary use cases — we do not
            invent product rankings here.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {kit.useCaseOptions.map((option) => {
              const selected = profile.useCases.some((uc) => uc.id === option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => toggleUseCase(option.value)}
                    className={cn(
                      "flex min-h-12 w-full items-center rounded-[var(--sg-radius-md)] border px-3 text-left text-sm",
                      selected
                        ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                        : "border-[var(--sg-color-border)]",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex gap-3">
            <Button type="button" variant="outline" onClick={() => goTo("business")}>
              Back
            </Button>
            <Button type="button" size="lg" onClick={() => goTo("capabilities")}>
              Continue →
            </Button>
          </div>
        </Card>
      ) : null}

      {stage === "capabilities" ? (
        <Card className="p-5 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            Must-have capabilities
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Mark capabilities that would disqualify a product if missing.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {kit.capabilityOptions.map((option) => {
              const selected = profile.features.some((f) => f.id === option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => toggleCapability(option.value)}
                    className={cn(
                      "flex min-h-12 w-full items-center rounded-[var(--sg-radius-md)] border px-3 text-left text-sm",
                      selected
                        ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                        : "border-[var(--sg-color-border)]",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex gap-3">
            <Button type="button" variant="outline" onClick={() => goTo("use-cases")}>
              Back
            </Button>
            <Button type="button" size="lg" onClick={() => goTo("integrations")}>
              Continue →
            </Button>
          </div>
        </Card>
      ) : null}

      {stage === "integrations" ? (
        <Card className="p-5 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            Preferred integrations
          </h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {kit.integrationOptions.map((option) => {
                  const selected =
                    option.value === "none"
                      ? profile.integrations.length === 0
                      : profile.integrations.some((i) => i.id === option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => toggleIntegration(option.value)}
                    className={cn(
                      "flex min-h-12 w-full items-center rounded-[var(--sg-radius-md)] border px-3 text-left text-sm",
                      selected
                        ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                        : "border-[var(--sg-color-border)]",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex gap-3">
            <Button type="button" variant="outline" onClick={() => goTo("capabilities")}>
              Back
            </Button>
            <Button type="button" size="lg" onClick={() => goTo("budget")}>
              Continue →
            </Button>
          </div>
        </Card>
      ) : null}

      {stage === "budget" ? (
        <Card className="p-5 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            Budget and setup
          </h2>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Budget per user / month</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      budget: { ...prev.budget, band: option.value },
                    }))
                  }
                  className={cn(
                    "min-h-11 rounded-[var(--sg-radius-md)] border px-3 text-sm",
                    profile.budget.band === option.value
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                      : "border-[var(--sg-color-border)]",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Setup complexity</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {EASE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      implementation: {
                        ...prev.implementation,
                        complexity: option.value,
                      },
                    }))
                  }
                  className={cn(
                    "min-h-11 rounded-[var(--sg-radius-md)] border px-3 text-sm",
                    profile.implementation.complexity === option.value
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                      : "border-[var(--sg-color-border)]",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-6 flex gap-3">
            <Button type="button" variant="outline" onClick={() => goTo("integrations")}>
              Back
            </Button>
            <Button type="button" size="lg" onClick={finish}>
              Save profile →
            </Button>
          </div>
        </Card>
      ) : null}

      {stage === "results" ? (
        <Card className="p-5 sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            Your {kit.shortName} requirements profile
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Stored on this device only. Affiliate status has zero influence.
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Jobs</dt>
              <dd className="font-medium">
                {profile.useCases
                  .map(
                    (uc) =>
                      kit.useCaseOptions.find((o) => o.value === uc.id)?.label ??
                      uc.id,
                  )
                  .join(", ") || "None selected"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Must-have capabilities</dt>
              <dd className="font-medium">
                {profile.features
                  .map(
                    (f) =>
                      kit.capabilityOptions.find((o) => o.value === f.id)
                        ?.label ?? f.id,
                  )
                  .join(", ") || "None selected"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Integrations</dt>
              <dd className="font-medium">
                {profile.integrations
                  .map(
                    (i) =>
                      kit.integrationOptions.find((o) => o.value === i.id)
                        ?.label ?? i.id,
                  )
                  .join(", ") || "None selected"}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" onClick={exportPdf}>
              <FileText className="size-4" aria-hidden />
              Download PDF
            </Button>
            <Button type="button" variant="outline" onClick={exportExcel}>
              <FileSpreadsheet className="size-4" aria-hidden />
              Download Excel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void exportText("copy")}
            >
              Copy summary
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void exportText("json")}
            >
              <Download className="size-4" aria-hidden />
              JSON
            </Button>
          </div>
          {copyStatus ? (
            <p
              className="mt-3 text-sm text-[var(--sg-color-success)]"
              role="status"
            >
              {copyStatus}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={kit.finderHref} size="lg">
              Find matching {kit.productNounPlural} →
            </ButtonLink>
            <ButtonLink href={kit.costHref} variant="outline">
              Estimate costs
            </ButtonLink>
            <ButtonLink href={kit.scorecardHref} variant="outline">
              Open vendor scorecard
            </ButtonLink>
            <Button type="button" variant="ghost" onClick={() => goTo("business")}>
              Edit profile
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export const CATEGORY_REQUIREMENTS_FAQ = [
  {
    question: "Does this recommend products?",
    answer:
      "No. The Requirements Builder captures buyer needs only. Affiliate status has zero influence.",
  },
  {
    question: "Where is my profile stored?",
    answer:
      "Download a PDF, Excel spreadsheet, JSON file, or copy a plain-text summary from the results step. Profiles stay in localStorage on this device, in a category-specific key separate from CRM and sales intelligence.",
  },
];
