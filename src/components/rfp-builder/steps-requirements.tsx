"use client";

import { useMemo, useState } from "react";
import type { CrmRfpDraft, RfpRequirement, RfpRequirementPriority } from "@/domain";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import {
  RFP_PRIORITY_LABELS,
  analyzeRequirementsQuality,
  countByPriority,
  newRfpId,
} from "@/services/rfp-builder";
import { StepHeader, type DraftPatch } from "./steps-early";

type Props = {
  draft: CrmRfpDraft;
  patch: DraftPatch;
  onImportProfile: () => void;
  onImportLibrary: () => void;
  hasProfile: boolean;
};

const PRIORITIES: RfpRequirementPriority[] = [
  "must-have",
  "should-have",
  "could-have",
  "future",
  "out-of-scope",
];

function priorityBadgeClass(p: RfpRequirementPriority): string {
  if (p === "must-have") return "bg-red-50 text-red-700";
  if (p === "should-have") return "bg-amber-50 text-amber-800";
  if (p === "could-have") return "bg-blue-50 text-blue-800";
  if (p === "future") return "bg-violet-50 text-violet-800";
  return "bg-slate-100 text-slate-600";
}

export function RfpStepRequirements({
  draft,
  patch,
  onImportProfile,
  onImportLibrary,
  hasProfile,
}: Props) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const counts = countByPriority(draft.requirements);
  const quality = useMemo(
    () => analyzeRequirementsQuality(draft.requirements),
    [draft.requirements],
  );

  const categories = useMemo(() => {
    const set = new Set(draft.requirements.map((r) => r.category));
    return [...set].sort();
  }, [draft.requirements]);

  const filtered = draft.requirements
    .filter((r) => {
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.requirement.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const updateReq = (id: string, patchRow: Partial<RfpRequirement>) =>
    patch((d) => ({
      ...d,
      requirements: d.requirements.map((r) =>
        r.id === id ? { ...r, ...patchRow } : r,
      ),
    }));

  const applySuggestion = (id: string, suggestion: string) =>
    updateReq(id, { requirement: suggestion });

  return (
    <div>
      <StepHeader
        stepLabel="Step 4"
        title="Requirements"
        description="Add, edit and prioritise the requirements vendors must respond to. Prefer Must / Should / Could — not High / Medium / Low alone."
      />

      <div className="flex flex-wrap gap-2">
        {hasProfile ? (
          <Button variant="outline" size="sm" onClick={onImportProfile}>
            Import my CRM Requirements
          </Button>
        ) : null}
        <Button variant="outline" size="sm" onClick={onImportLibrary}>
          Start from SoftwareGlimpse library
        </Button>
        <Button
          size="sm"
          onClick={() =>
            patch((d) => {
              const id = `REQ-${String(d.requirements.length + 1).padStart(3, "0")}`;
              return {
                ...d,
                requirements: [
                  ...d.requirements,
                  {
                    id: id.includes("REQ") ? id : newRfpId("REQ"),
                    category: "Core CRM",
                    requirement: "",
                    priority: "should-have",
                    rationale: "",
                    acceptanceCriterion: "",
                    evidenceRequested: "",
                    mandatory: false,
                    owner: "",
                    source: "manual",
                    sortOrder: d.requirements.length,
                  },
                ],
              };
            })
          }
        >
          Add requirement
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">
          {counts.total} total
        </span>
        <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">
          {counts.mustHave} Must-have
        </span>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
          {counts.shouldHave} Should-have
        </span>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-800">
          {counts.couldHave} Could-have
        </span>
        <span className="rounded-full bg-violet-50 px-2.5 py-1 font-medium text-violet-800">
          {counts.future} Future
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
          {counts.outOfScope} Out of scope
        </span>
      </div>

      {counts.total >= 150 ? (
        <Alert variant="warning" className="mt-4">
          Your RFP contains {counts.total} requirements. Consider moving
          lower-priority items to demo validation or future-phase scope.
        </Alert>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Search" htmlFor="rfp-req-search">
          <Input
            id="rfp-req-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ID or text…"
          />
        </Field>
        <Field label="Category" htmlFor="rfp-req-cat">
          <Select
            id="rfp-req-cat"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Priority" htmlFor="rfp-req-pri">
          <Select
            id="rfp-req-pri"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {RFP_PRIORITY_LABELS[p]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            <tr>
              <th scope="col" className="px-3 py-2">
                ID
              </th>
              <th scope="col" className="px-3 py-2">
                Requirement
              </th>
              <th scope="col" className="px-3 py-2">
                Category
              </th>
              <th scope="col" className="px-3 py-2">
                Priority
              </th>
              <th scope="col" className="px-3 py-2">
                Mandatory
              </th>
              <th scope="col" className="px-3 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-[var(--sg-color-text-muted)]"
                >
                  No requirements yet. Import from Requirements Builder, start
                  from the library, or add manually.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const issue = quality.find(
                  (q) => q.requirementId === r.id && q.kind === "vague",
                );
                const isEditing = editingId === r.id;
                return (
                  <tr
                    key={r.id}
                    className="border-t border-[var(--sg-color-border)] align-top"
                  >
                    <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Textarea
                            value={r.requirement}
                            onChange={(e) =>
                              updateReq(r.id, { requirement: e.target.value })
                            }
                          />
                          <Input
                            placeholder="Rationale"
                            value={r.rationale}
                            onChange={(e) =>
                              updateReq(r.id, { rationale: e.target.value })
                            }
                          />
                          <Input
                            placeholder="Acceptance criterion"
                            value={r.acceptanceCriterion}
                            onChange={(e) =>
                              updateReq(r.id, {
                                acceptanceCriterion: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Evidence requested"
                            value={r.evidenceRequested}
                            onChange={(e) =>
                              updateReq(r.id, {
                                evidenceRequested: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <p>{r.requirement || "(empty)"}</p>
                          {issue ? (
                            <div className="mt-2 rounded-[var(--sg-radius-md)] border border-amber-200 bg-amber-50 p-2 text-xs">
                              <p className="font-medium text-amber-900">
                                Vague: {issue.message}
                              </p>
                              {issue.suggestion ? (
                                <>
                                  <p className="mt-1 text-amber-800">
                                    Suggested: {issue.suggestion}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() =>
                                      applySuggestion(r.id, issue.suggestion!)
                                    }
                                  >
                                    Use suggested wording
                                  </Button>
                                </>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <Input
                          value={r.category}
                          onChange={(e) =>
                            updateReq(r.id, { category: e.target.value })
                          }
                        />
                      ) : (
                        <Badge className="font-normal">{r.category}</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Select
                        aria-label={`${r.id} priority`}
                        value={r.priority}
                        onChange={(e) =>
                          updateReq(r.id, {
                            priority: e.target
                              .value as RfpRequirementPriority,
                            mandatory:
                              e.target.value === "must-have"
                                ? true
                                : r.mandatory,
                          })
                        }
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {RFP_PRIORITY_LABELS[p]}
                          </option>
                        ))}
                      </Select>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityBadgeClass(r.priority)}`}
                      >
                        {RFP_PRIORITY_LABELS[r.priority]}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={r.mandatory}
                        aria-label={`${r.id} mandatory`}
                        onChange={(e) =>
                          updateReq(r.id, { mandatory: e.target.checked })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditingId(isEditing ? null : r.id)
                          }
                        >
                          {isEditing ? "Done" : "Edit"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            patch((d) => ({
                              ...d,
                              requirements: d.requirements.filter(
                                (x) => x.id !== r.id,
                              ),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {quality.length > 0 ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-[var(--sg-radius-md)] border border-amber-200 bg-amber-50/60 p-3 text-sm">
            <h3 className="font-semibold text-amber-950">
              Requirement quality check
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900">
              {quality.slice(0, 8).map((q) => (
                <li key={`${q.requirementId}-${q.kind}`}>{q.message}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3 text-sm">
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Tips for better requirements
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--sg-color-text-muted)]">
              <li>Write observable outcomes a vendor can demonstrate.</li>
              <li>Name the user role and the job to be done.</li>
              <li>Ask for evidence (demo path, screenshot, doc link).</li>
              <li>Do not silently rewrite — use suggested wording only when you agree.</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
