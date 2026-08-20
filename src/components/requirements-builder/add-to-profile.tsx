"use client";

/**
 * Minimal client-only profile mutations for Requirement/Feature detail pages.
 * Intentionally avoids the decision-profile service barrel so Turbopack never
 * pulls graph synthesizers / catalogue fs stores into these pages.
 */

import { useState } from "react";
import { track } from "@/analytics";
import {
  CrmDecisionProfileSchema,
  createEmptyCrmDecisionProfile,
  CRM_DECISION_PROFILE_STORAGE_KEY,
  type FeaturePriority,
  type RequirementPriority,
  type CrmDecisionProfile,
} from "@/domain";
import { Button } from "@/components/ui/button";

type RequirementProps = {
  kind: "requirement";
  slug: string;
  name: string;
};

type FeatureProps = {
  kind: "feature";
  slug: string;
  name: string;
};

type Props = RequirementProps | FeatureProps;

const PRIORITIES: Array<{
  value: RequirementPriority | FeaturePriority;
  label: string;
}> = [
  { value: "must-have", label: "Must have" },
  { value: "important", label: "Important" },
  { value: "nice-to-have", label: "Nice to have" },
];

function loadProfile(): CrmDecisionProfile {
  if (typeof window === "undefined") return createEmptyCrmDecisionProfile();
  try {
    const raw = localStorage.getItem(CRM_DECISION_PROFILE_STORAGE_KEY);
    if (!raw) return createEmptyCrmDecisionProfile();
    return CrmDecisionProfileSchema.parse(JSON.parse(raw));
  } catch {
    return createEmptyCrmDecisionProfile();
  }
}

function saveProfile(profile: CrmDecisionProfile): void {
  if (typeof window === "undefined") return;
  try {
    const next = CrmDecisionProfileSchema.parse({
      ...profile,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(CRM_DECISION_PROFILE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // non-fatal
  }
}

export function AddToRequirementsProfile(props: Props) {
  const [priority, setPriority] = useState<
    RequirementPriority | FeaturePriority
  >("must-have");
  const [status, setStatus] = useState<string | null>(null);

  const onAdd = () => {
    const existing = loadProfile();
    if (props.kind === "requirement") {
      const requirements = existing.requirements.filter(
        (r) => r.id !== props.slug,
      );
      requirements.push({
        id: props.slug,
        priority: priority as RequirementPriority,
        source: "user-selected",
      });
      saveProfile(
        CrmDecisionProfileSchema.parse({
          ...existing,
          requirements,
          updatedAt: new Date().toISOString(),
        }),
      );
      track({
        name: "requirement_selected",
        properties: {
          requirement: props.slug,
          priority,
          source: "requirement-detail",
        },
      });
    } else {
      const features = existing.features.filter((f) => f.id !== props.slug);
      features.push({
        id: props.slug,
        priority: priority as FeaturePriority,
        source: "user-selected",
      });
      saveProfile(
        CrmDecisionProfileSchema.parse({
          ...existing,
          features,
          updatedAt: new Date().toISOString(),
        }),
      );
      track({
        name: "requirement_selected",
        properties: {
          feature: props.slug,
          priority,
          source: "feature-detail",
        },
      });
    }
    setStatus(`Added to your CRM requirements (${priority})`);
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`add-priority-${props.slug}`}>
        Priority
      </label>
      <select
        id={`add-priority-${props.slug}`}
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as RequirementPriority | FeaturePriority)
        }
        className="min-h-10 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2 text-sm"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <Button type="button" variant="outline" onClick={onAdd}>
        {props.kind === "requirement"
          ? "Add to my requirements"
          : "Require this feature"}
      </Button>
      <a
        href="/tools/crm-requirements-builder/?start=1"
        className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        Open builder
      </a>
      {status ? (
        <span className="text-sm text-[var(--sg-color-success)]" role="status">
          {status}
        </span>
      ) : null}
    </div>
  );
}
