"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList, FileSpreadsheet, ListChecks } from "lucide-react";
import type { BuyingStage, Resource, ResourceType } from "@/domain";
import { hubToneClass } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const KIND_ICON = {
  checklist: ListChecks,
  template: FileSpreadsheet,
  scorecard: ClipboardList,
  worksheet: FileSpreadsheet,
  planner: ClipboardList,
} as const;

const STAGE_FILTERS: Array<{ id: "all" | BuyingStage | Resource["stage"]; label: string }> = [
  { id: "all", label: "All" },
  { id: "DEFINE", label: "Define" },
  { id: "EVALUATE", label: "Evaluate" },
  { id: "VALIDATE", label: "Validate" },
  { id: "DECIDE", label: "Decide" },
  { id: "IMPLEMENT", label: "Implement" },
  { id: "OPTIMIZE", label: "Optimize" },
];

const TYPE_FILTERS: Array<{ id: "all" | ResourceType | Resource["kind"]; label: string }> = [
  { id: "all", label: "All types" },
  { id: "CHECKLIST", label: "Checklist" },
  { id: "SCORECARD", label: "Scorecard" },
  { id: "WORKSHEET", label: "Worksheet" },
  { id: "TEMPLATE", label: "Template" },
  { id: "MATRIX", label: "Matrix" },
];

function matchesStage(resource: Resource, filter: string): boolean {
  if (filter === "all") return true;
  if (resource.buyingStage === filter) return true;
  // Legacy stage fallbacks
  if (filter === "DEFINE" || filter === "EVALUATE") {
    return resource.stage === "choose";
  }
  if (filter === "IMPLEMENT") return resource.stage === "implement";
  if (filter === "OPTIMIZE") return resource.stage === "optimize";
  if (filter === "VALIDATE") return resource.stage === "security";
  if (filter === "DECIDE") return resource.stage === "compare";
  return resource.stage === filter;
}

function matchesType(resource: Resource, filter: string): boolean {
  if (filter === "all") return true;
  if (resource.resourceType === filter) return true;
  return resource.kind === filter.toLowerCase();
}

export function ResourceExploreGrid({
  resources,
  covers,
  className,
}: {
  resources: Resource[];
  covers?: Record<string, { src: string; alt?: string }>;
  className?: string;
}) {
  const [stage, setStage] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const filtered = useMemo(
    () =>
      resources.filter(
        (r) => matchesStage(r, stage) && matchesType(r, type),
      ),
    [resources, stage, type],
  );

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex flex-col gap-3">
        <FilterRow
          label="Buying stage"
          value={stage}
          options={STAGE_FILTERS}
          onChange={setStage}
        />
        <FilterRow
          label="Type"
          value={type}
          options={TYPE_FILTERS}
          onChange={setType}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          No resources match these filters.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource, index) => {
            const Icon = KIND_ICON[resource.kind];
            const image = covers?.[resource.slug];
            const href =
              resource.seo.canonicalPath || `/resources/${resource.slug}/`;
            const typeLabel =
              resource.resourceType?.replace(/_/g, " ") ?? resource.kind;
            const stageLabel =
              resource.buyingStage ?? resource.stage;
            return (
              <li key={resource.slug}>
                <Link href={href} className="group block h-full">
                  <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow group-hover:shadow-[var(--sg-shadow-md)]">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.src}
                        alt=""
                        className="h-36 w-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-36 items-center justify-center",
                          hubToneClass(index),
                        )}
                      >
                        <Icon className="size-10 opacity-80" aria-hidden />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                        {typeLabel} · {stageLabel}
                      </p>
                      <h3 className="mt-1 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                        {resource.name}
                      </h3>
                      {resource.jobToBeDone || resource.shortDescription ? (
                        <p className="mt-2 line-clamp-3 text-sm text-[var(--sg-color-text-muted)]">
                          {resource.jobToBeDone ?? resource.shortDescription}
                        </p>
                      ) : null}
                      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                        Excel + PDF
                        {resource.timeToComplete
                          ? ` · ${resource.timeToComplete}`
                          : ""}
                      </p>
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-[var(--sg-radius-pill)] border px-3 py-1 text-xs font-medium transition-colors",
              value === opt.id
                ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-white"
                : "border-[var(--sg-color-border)] bg-white text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)]",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
