"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import type {
  CategoryTestProtocol,
  ProductTestSession,
  TestTaskStatus,
} from "@/domain";

type ProtocolSummary = {
  slug: string;
  name: string;
  categorySlug: string;
  version: string;
  taskCount: number;
};

type QueueItemSummary = {
  rank: number;
  slug: string;
  name: string;
  categorySlug: string;
  evidenceLevel: string;
  impressions: number;
  comparisonCount: number;
};

type Props = {
  secret: string;
  products: Array<{ slug: string; name: string; categorySlug: string }>;
  queueItems?: QueueItemSummary[];
  protocols: ProtocolSummary[];
  initialSessions: ProductTestSession[];
  protocolDetails: CategoryTestProtocol[];
};

const TASK_STATUSES: TestTaskStatus[] = [
  "NOT_STARTED",
  "PASS",
  "PARTIAL",
  "FAIL",
  "NOT_AVAILABLE",
  "NOT_APPLICABLE",
  "BLOCKED",
];

async function api(
  secret: string,
  init?: {
    method?: string;
    body?: Record<string, unknown>;
  },
): Promise<Response> {
  const headers = new Headers();
  headers.set("x-testing-secret", secret);
  headers.set("content-type", "application/json");
  return fetch(`/api/dev/product-testing/?secret=${encodeURIComponent(secret)}`, {
    method: init?.method,
    headers,
    body: init?.body != null ? JSON.stringify(init.body) : undefined,
  });
}

async function uploadScreenshot(
  secret: string,
  input: {
    sessionId: string;
    taskId?: string;
    file: File;
    publicCaption?: string;
    public?: boolean;
  },
): Promise<Response> {
  const form = new FormData();
  form.set("sessionId", input.sessionId);
  if (input.taskId) form.set("taskId", input.taskId);
  form.set("file", input.file);
  form.set("public", input.public === false ? "false" : "true");
  if (input.publicCaption) form.set("publicCaption", input.publicCaption);
  return fetch(
    `/api/dev/product-testing/upload/?secret=${encodeURIComponent(secret)}`,
    {
      method: "POST",
      headers: { "x-testing-secret": secret },
      body: form,
    },
  );
}

export function ProductTestingWorkspace({
  secret,
  products,
  queueItems = [],
  protocols,
  initialSessions,
  protocolDetails,
}: Props) {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeId, setActiveId] = useState<string | null>(
    initialSessions[0]?.id ?? null,
  );
  const [productSlug, setProductSlug] = useState(
    queueItems[0]?.slug ?? products[0]?.slug ?? "",
  );
  const [protocolSlug, setProtocolSlug] = useState(
    protocols[0]?.slug ?? "crm-hands-on",
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const active = useMemo(
    () => sessions.find((s) => s.id === activeId) ?? null,
    [sessions, activeId],
  );

  const protocol = useMemo(() => {
    const slug = active?.protocolSlug ?? protocolSlug;
    return protocolDetails.find((p) => p.slug === slug) ?? null;
  }, [active, protocolSlug, protocolDetails]);

  function selectProduct(slug: string) {
    setProductSlug(slug);
    const product = products.find((p) => p.slug === slug);
    const match = protocols.find((p) => p.categorySlug === product?.categorySlug);
    if (match) setProtocolSlug(match.slug);
  }

  const refresh = useCallback(async () => {
    const res = await api(secret);
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed to load");
      return;
    }
    const data = (await res.json()) as { sessions: ProductTestSession[] };
    setSessions(data.sessions);
  }, [secret]);

  async function runAction(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await api(secret, { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Action failed");
        return;
      }
      if (data.session) {
        setSessions((prev) => {
          const rest = prev.filter((s) => s.id !== data.session.id);
          return [data.session, ...rest];
        });
        setActiveId(data.session.id);
      } else {
        await refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {queueItems.length > 0 ? (
        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Top 10 testing queue</h2>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Priority from GSC demand, affiliate value, comparison dependents,
            category importance, and evidence gap. Click to preload product +
            category protocol.
          </p>
          <ol className="grid gap-2 sm:grid-cols-2">
            {queueItems.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  className={`w-full rounded-[var(--sg-radius-md)] border px-3 py-2 text-left text-sm ${
                    productSlug === item.slug
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                      : "border-[var(--sg-color-border)] hover:bg-[var(--sg-color-surface-muted)]"
                  }`}
                  onClick={() => selectProduct(item.slug)}
                >
                  <span className="font-medium">
                    {item.rank}. {item.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                    {item.categorySlug} · {item.evidenceLevel} ·{" "}
                    {item.impressions} imp · {item.comparisonCount} comps
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      <Card className="space-y-4 p-5">
        <h2 className="text-lg font-semibold">Start a human test session</h2>
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          This workspace assists a human tester. It never invents PASS results
          or public hands-on claims. Incomplete sessions stay private. Finish
          requires every required task recorded (PASS/PARTIAL/FAIL/N/A/BLOCKED) plus
          strengths or weaknesses and explicit human confirmation — tasks never auto-PASS.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product" htmlFor="product">
            <Select
              id="product"
              value={productSlug}
              onChange={(e) => selectProduct(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} ({p.slug})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Protocol" htmlFor="protocol">
            <Select
              id="protocol"
              value={protocolSlug}
              onChange={(e) => setProtocolSlug(e.target.value)}
            >
              {protocols.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} · {p.taskCount} tasks
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Button
          disabled={busy || !productSlug}
          onClick={() =>
            void runAction({
              action: "create",
              productSlug,
              protocolSlug,
            })
          }
        >
          Create session
        </Button>
      </Card>

      {error ? (
        <p className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-danger)]/40 bg-[var(--sg-color-danger-soft)] px-3 py-2 text-sm text-[var(--sg-color-danger)]">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Sessions
          </h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No sessions yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {sessions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`w-full rounded-[var(--sg-radius-md)] px-3 py-2 text-left text-sm ${
                      s.id === activeId
                        ? "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                        : "hover:bg-[var(--sg-color-surface-muted)]"
                    }`}
                    onClick={() => setActiveId(s.id)}
                  >
                    <span className="font-medium">{s.productSlug}</span>
                    <span className="mt-0.5 block text-xs opacity-80">
                      {s.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {active && protocol ? (
          <SessionEditor
            key={`${active.id}-${active.updatedAt}`}
            secret={secret}
            session={active}
            protocol={protocol}
            busy={busy}
            onAction={runAction}
            onUploaded={async () => {
              await refresh();
            }}
          />
        ) : (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Select or create a session to begin.
          </p>
        )}
      </div>
    </div>
  );
}

function SessionEditor({
  secret,
  session,
  protocol,
  busy,
  onAction,
  onUploaded,
}: {
  secret: string;
  session: ProductTestSession;
  protocol: CategoryTestProtocol;
  busy: boolean;
  onAction: (body: Record<string, unknown>) => Promise<void>;
  onUploaded: () => Promise<void>;
}) {
  const [meta, setMeta] = useState({
    planTested: session.planTested ?? "",
    testEnvironment: session.testEnvironment ?? "",
    testScenario: session.testScenario ?? "",
    productVersion: session.productVersion ?? "",
    notes: session.notes ?? "",
    internalNotes: session.internalNotes ?? "",
    setupMinutes: session.setupMinutes?.toString() ?? "",
    pricingObserved: session.pricingObserved ?? "",
    pricingVerifiedAt: session.pricingVerifiedAt?.slice(0, 10) ?? "",
    strengths: (session.finalAssessment?.strengths ?? []).join("\n"),
    weaknesses: (session.finalAssessment?.weaknesses ?? []).join("\n"),
    unexpected: (session.finalAssessment?.unexpectedFindings ?? []).join("\n"),
    setupFrictionSummary: session.finalAssessment?.setupFrictionSummary ?? "",
    recommendHandsOnClaim:
      session.finalAssessment?.recommendHandsOnClaim !== false,
    humanConfirmedCompletion:
      session.finalAssessment?.humanConfirmedCompletion === true,
  });

  const locked =
    session.status === "completed" || session.status === "abandoned";

  const requiredTasks = protocol.tasks.filter((t) => t.required !== false);
  const requiredDone = requiredTasks.filter((task) => {
    const result = session.tasks.find((t) => t.taskId === task.id);
    return result && result.status !== "NOT_STARTED";
  }).length;
  const progressLabel = `${requiredDone}/${requiredTasks.length} required tasks recorded`;

  function assessmentPayload() {
    return {
      strengths: lines(meta.strengths),
      weaknesses: lines(meta.weaknesses),
      unexpectedFindings: lines(meta.unexpected),
      setupFrictionSummary: meta.setupFrictionSummary || undefined,
      recommendHandsOnClaim: meta.recommendHandsOnClaim,
      humanConfirmedCompletion: meta.humanConfirmedCompletion,
    };
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold">{session.productSlug}</h2>
        <Badge variant={session.status === "completed" ? "success" : "warning"}>
          {session.status}
        </Badge>
        <Badge variant="neutral">{progressLabel}</Badge>
        <Link
          href={`/software/${session.productSlug}/`}
          className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Public product page
        </Link>
      </div>

      {!locked ? (
        <div className="flex flex-wrap gap-2">
          {session.status === "draft" || session.status === "blocked" ? (
            <Button
              disabled={busy}
              onClick={() =>
                void onAction({ action: "start", sessionId: session.id })
              }
            >
              {session.status === "blocked" ? "Resume test" : "Start test"}
            </Button>
          ) : null}
          {session.status === "in_progress" ? (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => {
                const reason =
                  window.prompt("Block reason (signup wall, outage, credits…)") ??
                  "";
                void onAction({
                  action: "block",
                  sessionId: session.id,
                  reason,
                });
              }}
            >
              Mark blocked
            </Button>
          ) : null}
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() =>
              void onAction({
                action: "update",
                sessionId: session.id,
                planTested: meta.planTested || undefined,
                testEnvironment: meta.testEnvironment || undefined,
                testScenario: meta.testScenario || undefined,
                productVersion: meta.productVersion || undefined,
                notes: meta.notes || undefined,
                internalNotes: meta.internalNotes || undefined,
                setupMinutes: meta.setupMinutes
                  ? Number(meta.setupMinutes)
                  : undefined,
                pricingObserved: meta.pricingObserved || undefined,
                pricingVerifiedAt: meta.pricingVerifiedAt
                  ? `${meta.pricingVerifiedAt}T12:00:00.000Z`
                  : undefined,
                finalAssessment: assessmentPayload(),
              })
            }
          >
            Save progress
          </Button>
          <Button
            variant="outline"
            disabled={busy || !meta.humanConfirmedCompletion}
            onClick={() => {
              if (!meta.humanConfirmedCompletion) {
                window.alert(
                  "Confirm you personally completed this test before finishing.",
                );
                return;
              }
              const ok = window.confirm(
                "Finish this human test? HANDS_ON_TESTED is only assigned after this confirmation. Dependent pages will be flagged for refresh — not auto-rewritten.",
              );
              if (!ok) return;
              void onAction({
                action: "complete",
                sessionId: session.id,
                finalAssessment: assessmentPayload(),
              });
            }}
          >
            Finish test (human only)
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              const reason = window.prompt("Abandon reason (optional)") ?? "";
              void onAction({
                action: "abandon",
                sessionId: session.id,
                reason,
              });
            }}
          >
            Abandon
          </Button>
        </div>
      ) : (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          {session.status === "completed"
            ? "Completed sessions are immutable. Create a new session to re-test."
            : "Abandoned sessions cannot be finished. Create a new session to re-test."}
        </p>
      )}

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Plan tested" htmlFor="plan">
          <Input
            id="plan"
            disabled={locked}
            value={meta.planTested}
            onChange={(e) =>
              setMeta((m) => ({ ...m, planTested: e.target.value }))
            }
          />
        </Field>
        <Field label="Product version" htmlFor="version">
          <Input
            id="version"
            disabled={locked}
            value={meta.productVersion}
            onChange={(e) =>
              setMeta((m) => ({ ...m, productVersion: e.target.value }))
            }
          />
        </Field>
        <Field label="Test environment" htmlFor="env">
          <Input
            id="env"
            disabled={locked}
            value={meta.testEnvironment}
            onChange={(e) =>
              setMeta((m) => ({ ...m, testEnvironment: e.target.value }))
            }
            placeholder="Browser / OS / trial region"
          />
        </Field>
        <Field label="Test scenario" htmlFor="scenario">
          <Input
            id="scenario"
            disabled={locked}
            value={meta.testScenario}
            onChange={(e) =>
              setMeta((m) => ({ ...m, testScenario: e.target.value }))
            }
            placeholder="e.g. SMB sales pipeline trial"
          />
        </Field>
        <Field label="Setup minutes" htmlFor="setup">
          <Input
            id="setup"
            type="number"
            disabled={locked}
            value={meta.setupMinutes}
            onChange={(e) =>
              setMeta((m) => ({ ...m, setupMinutes: e.target.value }))
            }
          />
        </Field>
        <Field label="Pricing verified (date)" htmlFor="pricing-date">
          <Input
            id="pricing-date"
            type="date"
            disabled={locked}
            value={meta.pricingVerifiedAt}
            onChange={(e) =>
              setMeta((m) => ({ ...m, pricingVerifiedAt: e.target.value }))
            }
          />
        </Field>
        <Field label="Pricing observed" htmlFor="pricing">
          <Input
            id="pricing"
            disabled={locked}
            value={meta.pricingObserved}
            onChange={(e) =>
              setMeta((m) => ({ ...m, pricingObserved: e.target.value }))
            }
            placeholder="List prices / plan labels seen"
          />
        </Field>
        <Field label="Public notes" htmlFor="notes">
          <Textarea
            id="notes"
            disabled={locked}
            value={meta.notes}
            onChange={(e) => setMeta((m) => ({ ...m, notes: e.target.value }))}
          />
        </Field>
        <Field
          label="Internal notes (never published)"
          htmlFor="internal"
          hint="Workspace-only. Not shown on public pages."
        >
          <Textarea
            id="internal"
            disabled={locked}
            value={meta.internalNotes}
            onChange={(e) =>
              setMeta((m) => ({ ...m, internalNotes: e.target.value }))
            }
          />
        </Field>
        <Field label="Strengths (one per line)" htmlFor="strengths">
          <Textarea
            id="strengths"
            disabled={locked}
            value={meta.strengths}
            onChange={(e) =>
              setMeta((m) => ({ ...m, strengths: e.target.value }))
            }
          />
        </Field>
        <Field label="Weaknesses (one per line)" htmlFor="weaknesses">
          <Textarea
            id="weaknesses"
            disabled={locked}
            value={meta.weaknesses}
            onChange={(e) =>
              setMeta((m) => ({ ...m, weaknesses: e.target.value }))
            }
          />
        </Field>
        <Field
          label="Unexpected findings (one per line)"
          htmlFor="unexpected"
        >
          <Textarea
            id="unexpected"
            disabled={locked}
            value={meta.unexpected}
            onChange={(e) =>
              setMeta((m) => ({ ...m, unexpected: e.target.value }))
            }
          />
        </Field>
        <Field
          label="Setup friction summary"
          htmlFor="friction"
          hint="Time-to-value, confusing steps, blockers."
        >
          <Textarea
            id="friction"
            disabled={locked}
            value={meta.setupFrictionSummary}
            onChange={(e) =>
              setMeta((m) => ({ ...m, setupFrictionSummary: e.target.value }))
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            disabled={locked}
            checked={meta.recommendHandsOnClaim}
            onChange={(e) =>
              setMeta((m) => ({
                ...m,
                recommendHandsOnClaim: e.target.checked,
              }))
            }
          />
          Recommend public HANDS_ON_TESTED claim after genuine completion
          (uncheck if the session should only stay data-verified)
        </label>
        <label className="flex items-start gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            className="mt-1"
            disabled={locked}
            checked={meta.humanConfirmedCompletion}
            onChange={(e) =>
              setMeta((m) => ({
                ...m,
                humanConfirmedCompletion: e.target.checked,
              }))
            }
          />
          <span>
            I personally completed this test and confirm the results are accurate.
            Required before Finish — AI must never check this box.
          </span>
        </label>
      </Card>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Protocol checklist</h3>
        {protocol.tasks.map((task) => {
          const result = session.tasks.find((t) => t.taskId === task.id);
          return (
            <Card key={task.id} className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {task.displayOrder}. {task.title}
                    {task.required ? null : (
                      <span className="ml-2 text-xs text-[var(--sg-color-text-muted)]">
                        optional
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {task.description}
                  </p>
                </div>
                <Select
                  className="w-44"
                  disabled={locked || busy}
                  value={result?.status ?? "NOT_STARTED"}
                  onChange={(e) =>
                    void onAction({
                      action: "update-task",
                      sessionId: session.id,
                      taskId: task.id,
                      status: e.target.value,
                    })
                  }
                >
                  {TASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Task notes" htmlFor={`notes-${task.id}`}>
                  <Textarea
                    id={`notes-${task.id}`}
                    disabled={locked || busy}
                    defaultValue={result?.notes ?? ""}
                    onBlur={(e) => {
                      if (e.target.value === (result?.notes ?? "")) return;
                      void onAction({
                        action: "update-task",
                        sessionId: session.id,
                        taskId: task.id,
                        notes: e.target.value,
                      });
                    }}
                  />
                </Field>
                <Field
                  label="Time spent (minutes)"
                  htmlFor={`time-${task.id}`}
                >
                  <Input
                    id={`time-${task.id}`}
                    type="number"
                    min={0}
                    disabled={locked || busy}
                    defaultValue={result?.timeSpentMinutes?.toString() ?? ""}
                    onBlur={(e) => {
                      const raw = e.target.value.trim();
                      const next = raw === "" ? undefined : Number(raw);
                      if (
                        next === result?.timeSpentMinutes ||
                        (next == null && result?.timeSpentMinutes == null)
                      ) {
                        return;
                      }
                      void onAction({
                        action: "update-task",
                        sessionId: session.id,
                        taskId: task.id,
                        timeSpentMinutes: next,
                      });
                    }}
                  />
                </Field>
              </div>
              <TaskScreenshotUpload
                secret={secret}
                sessionId={session.id}
                taskId={task.id}
                taskTitle={task.title}
                locked={locked || busy}
                existingPaths={result?.screenshotPaths ?? []}
                onUploaded={onUploaded}
              />
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function TaskScreenshotUpload({
  secret,
  sessionId,
  taskId,
  taskTitle,
  locked,
  existingPaths,
  onUploaded,
}: {
  secret: string;
  sessionId: string;
  taskId: string;
  taskTitle: string;
  locked: boolean;
  existingPaths: string[];
  onUploaded: () => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2">
      <Field
        label="Screenshot upload"
        htmlFor={`upload-${taskId}`}
        hint="PNG / JPEG / WebP / GIF · max 5MB · stored under /testing-evidence/ (secret-gated API)."
      >
        <Input
          id={`upload-${taskId}`}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={locked || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setUploading(true);
            setError(null);
            void uploadScreenshot(secret, {
              sessionId,
              taskId,
              file,
              public: true,
              publicCaption: `${taskTitle} during hands-on test`,
            })
              .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                  setError(data.error ?? "Upload failed");
                  return;
                }
                await onUploaded();
              })
              .finally(() => setUploading(false));
          }}
        />
      </Field>
      {uploading ? (
        <p className="text-xs text-[var(--sg-color-text-muted)]">Uploading…</p>
      ) : null}
      {error ? (
        <p className="text-xs text-[var(--sg-color-danger)]">{error}</p>
      ) : null}
      {existingPaths.length > 0 ? (
        <ul className="space-y-1 text-xs text-[var(--sg-color-text-muted)]">
          {existingPaths.map((p) => (
            <li key={p}>
              <a
                href={p}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {p}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
