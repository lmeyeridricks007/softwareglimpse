"use client";

import { useState } from "react";
import Link from "next/link";
import type { CrmRfpSession } from "@/domain";
import { track } from "@/analytics";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/forms";
import {
  countByPriority,
  downloadRfpExcel,
  downloadRfpMarkdown,
  downloadRfpPdf,
  downloadVendorPackages,
  setRequirementsFrozen,
} from "@/services/rfp-builder";

type Props = {
  session: CrmRfpSession;
  onEdit: () => void;
  onSessionUpdate: (session: CrmRfpSession) => void;
};

export function RfpResults({ session, onEdit, onSessionUpdate }: Props) {
  const draft = session.draft;
  const counts = countByPriority(draft.requirements);
  const modeLabel =
    session.mode === "formal-rfp" ? "Formal RFP" : "Vendor Brief";
  const [vendorNames, setVendorNames] = useState(
    draft.vendorPackageNames.join(", ") || "",
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async (key: string, fn: () => Promise<void> | void) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
          Ready
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
          Your CRM {modeLabel} is ready
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Version {session.versionMeta.version}
          {session.versionMeta.changedAfterIssue
            ? " · Requirements changed after previous issue"
            : ""}
        </p>
      </div>

      {session.versionMeta.changedAfterIssue ? (
        <Alert variant="warning">
          RFP changed after initial generation. Consider generating Version{" "}
          {session.versionMeta.version} change summary before re-issuing.
        </Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">PDF</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Vendor-facing document
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            loading={busy === "pdf"}
            onClick={() =>
              run("pdf", async () => {
                await downloadRfpPdf(session);
                track({ name: "rfp_pdf_exported", properties: { mode: session.mode } });
              })
            }
          >
            Download PDF
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">Excel</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Structured vendor response workbook
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            loading={busy === "xlsx"}
            onClick={() =>
              run("xlsx", async () => {
                await downloadRfpExcel(session);
                track({
                  name: "rfp_excel_exported",
                  properties: { mode: session.mode },
                });
              })
            }
          >
            Download Excel
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">Markdown</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Editable / collaborative format
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="secondary"
            loading={busy === "md"}
            onClick={() =>
              run("md", () => {
                downloadRfpMarkdown(session);
                track({
                  name: "rfp_markdown_exported",
                  properties: { mode: session.mode },
                });
              })
            }
          >
            Download Markdown
          </Button>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">RFP summary</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--sg-color-text-muted)]">Requirements</dt>
            <dd className="tabular-nums font-medium">{counts.total}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--sg-color-text-muted)]">Must-haves</dt>
            <dd className="tabular-nums font-medium">{counts.mustHave}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--sg-color-text-muted)]">Integrations</dt>
            <dd className="tabular-nums font-medium">
              {draft.integrations.length}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--sg-color-text-muted)]">Security</dt>
            <dd className="tabular-nums font-medium">
              {draft.securityQuestions.filter((q) => q.required).length}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--sg-color-text-muted)]">Pricing model</dt>
            <dd className="font-medium">Included</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--sg-color-text-muted)]">Target date</dt>
            <dd className="font-medium">
              {draft.project.responseDeadline ||
                draft.responseRules.responseDeadline ||
                "—"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Multi-vendor pack
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Export identical RFP packs. Do not personalize requirements per vendor.
        </p>
        <Field label="Vendor names (comma-separated)" htmlFor="rfp-vendors-pack">
          <Input
            id="rfp-vendors-pack"
            value={vendorNames}
            onChange={(e) => setVendorNames(e.target.value)}
            placeholder="Vendor A, Vendor B, Vendor C"
          />
        </Field>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          loading={busy === "pack"}
          onClick={() =>
            run("pack", async () => {
              const names = vendorNames
                .split(",")
                .map((n) => n.trim())
                .filter(Boolean);
              onSessionUpdate({
                ...session,
                draft: { ...draft, vendorPackageNames: names },
              });
              await downloadVendorPackages(session, names);
            })
          }
        >
          Generate vendor packages (PDF + Excel)
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Requirement freeze
        </h3>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Changing criteria after seeing vendor responses can bias the
          evaluation. Freeze is optional — changes remain allowed but should be
          recorded.
        </p>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={() =>
            onSessionUpdate(
              setRequirementsFrozen(
                session,
                !session.versionMeta.frozen,
              ),
            )
          }
        >
          {session.versionMeta.frozen
            ? "Unfreeze requirements"
            : "Freeze evaluation requirements"}
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Vendor response tracker
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Local status only — no automated outreach.
        </p>
        <div className="mt-3 space-y-2">
          {draft.vendorTracker.map((v) => (
            <div
              key={v.id}
              className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-2 sm:grid-cols-[1fr_auto]"
            >
              <Input
                value={v.vendor}
                placeholder="Vendor name"
                onChange={(e) =>
                  onSessionUpdate({
                    ...session,
                    draft: {
                      ...draft,
                      vendorTracker: draft.vendorTracker.map((x) =>
                        x.id === v.id ? { ...x, vendor: e.target.value } : x,
                      ),
                    },
                  })
                }
              />
              <select
                className="min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-2 text-sm"
                value={v.status}
                aria-label={`${v.vendor || "Vendor"} status`}
                onChange={(e) =>
                  onSessionUpdate({
                    ...session,
                    draft: {
                      ...draft,
                      vendorTracker: draft.vendorTracker.map((x) =>
                        x.id === v.id
                          ? {
                              ...x,
                              status: e.target.value as typeof x.status,
                            }
                          : x,
                      ),
                    },
                  })
                }
              >
                <option value="not-sent">Not sent</option>
                <option value="sent">Sent</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="questions">Questions</option>
                <option value="response-received">Response received</option>
                <option value="clarification-required">
                  Clarification required
                </option>
                <option value="qualified">Qualified</option>
                <option value="rejected">Rejected</option>
                <option value="demo">Demo</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          ))}
        </div>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={() =>
            onSessionUpdate({
              ...session,
              draft: {
                ...draft,
                vendorTracker: [
                  ...draft.vendorTracker,
                  {
                    id: `VT-${draft.vendorTracker.length + 1}`,
                    vendor: "",
                    rfpSent: false,
                    acknowledged: false,
                    questionsReceived: false,
                    responseReceived: false,
                    complete: false,
                    clarificationRequired: false,
                    demoInvited: false,
                    status: "not-sent",
                    notes: "",
                  },
                ],
              },
            })
          }
        >
          Add vendor
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Clarification log
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Share material clarifications with all vendors to avoid information
          asymmetry.
        </p>
        <div className="mt-3 space-y-2">
          {draft.clarifications.map((c) => (
            <div
              key={c.id}
              className="space-y-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-2"
            >
              <Input
                value={c.vendor}
                placeholder="Vendor"
                onChange={(e) =>
                  onSessionUpdate({
                    ...session,
                    draft: {
                      ...draft,
                      clarifications: draft.clarifications.map((x) =>
                        x.id === c.id ? { ...x, vendor: e.target.value } : x,
                      ),
                    },
                  })
                }
              />
              <Input
                value={c.question}
                placeholder="Question"
                onChange={(e) =>
                  onSessionUpdate({
                    ...session,
                    draft: {
                      ...draft,
                      clarifications: draft.clarifications.map((x) =>
                        x.id === c.id ? { ...x, question: e.target.value } : x,
                      ),
                    },
                  })
                }
              />
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={c.sharedWithAll}
                  onChange={(e) =>
                    onSessionUpdate({
                      ...session,
                      draft: {
                        ...draft,
                        clarifications: draft.clarifications.map((x) =>
                          x.id === c.id
                            ? { ...x, sharedWithAll: e.target.checked }
                            : x,
                        ),
                      },
                    })
                  }
                />
                Shared with all vendors
              </label>
            </div>
          ))}
        </div>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={() =>
            onSessionUpdate({
              ...session,
              draft: {
                ...draft,
                clarifications: [
                  ...draft.clarifications,
                  {
                    id: `CL-${draft.clarifications.length + 1}`,
                    vendor: "",
                    question: "",
                    rfpSection: "",
                    askedDate: "",
                    response: "",
                    responseDate: "",
                    sharedWithAll: false,
                    decisionImpact: "",
                  },
                ],
              },
            })
          }
        >
          Add clarification
        </Button>
      </Card>

      <div>
        <h3 className="font-semibold text-[var(--sg-color-navy)]">Next steps</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
          <li>Review internally</li>
          <li>Freeze requirements (optional)</li>
          <li>Send the same pack to vendors</li>
          <li>Track clarification questions</li>
          <li>Import vendor responses (by stable requirement ID)</li>
          <li>Score evidence in Vendor Scorecard</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink
            href="/tools/crm-vendor-scorecard/"
            onClick={() =>
              track({
                name: "rfp_scorecard_clicked",
                properties: { mode: session.mode },
              })
            }
          >
            Open Vendor Scorecard
          </ButtonLink>
          <Button variant="secondary" onClick={onEdit}>
            Edit RFP
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const { buildRfpPlainText } = await import(
                "@/services/rfp-builder"
              );
              await navigator.clipboard.writeText(buildRfpPlainText(session));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied" : "Copy text"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-[var(--sg-color-text-muted)]">
        Workflow:{" "}
        <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-requirements-builder/">
          Requirements Builder
        </Link>{" "}
        → RFP Builder → Vendor Responses →{" "}
        <Link className="text-[var(--sg-color-primary)] underline" href="/tools/crm-vendor-scorecard/">
          Vendor Scorecard
        </Link>{" "}
        →{" "}
        <Link className="text-[var(--sg-color-primary)] underline" href="/resources/crm-comparison-worksheet/">
          Decision Matrix
        </Link>{" "}
        → Cost / ROI → Business Case
      </p>
    </div>
  );
}
