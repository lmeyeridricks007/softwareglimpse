"use client";

import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  ADOPTION_QUESTIONS,
  clusterScore,
  findingsFor,
  overallScore,
  type AdoptionAnswer,
} from "@/services/adoption-health/catalog";
import {
  loadAdoptionHealthSession,
  resetAdoptionHealthSession,
  saveAdoptionHealthSession,
  unansweredCount,
} from "@/services/adoption-health/persistence";

const ANSWERS: Array<{ id: AdoptionAnswer; label: string }> = [
  { id: "yes", label: "Yes" },
  { id: "partly", label: "Partly" },
  { id: "no", label: "No" },
];

export function CrmAdoptionHealthApp() {
  const [session, setSession] = useState(loadAdoptionHealthSession);
  const unanswered = unansweredCount(session.answers);
  const people = clusterScore(session.answers, "people");
  const system = clusterScore(session.answers, "system");
  const overall = overallScore(session.answers);
  const findings = useMemo(
    () => findingsFor(session.answers),
    [session.answers],
  );

  function setAnswer(id: string, value: AdoptionAnswer) {
    const next = {
      ...session,
      answers: { ...session.answers, [id]: value },
    };
    setSession(next);
    saveAdoptionHealthSession(next);
  }

  return (
    <div className="mt-8 space-y-8">
      <ol className="space-y-5">
        {ADOPTION_QUESTIONS.map((question, index) => (
          <li
            key={question.id}
            className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-text-muted)]">
              {index + 1} · {question.cluster === "people" ? "People" : "System"}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--sg-color-navy)]">
              {question.prompt}
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {question.helpText}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ANSWERS.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  size="sm"
                  variant={
                    session.answers[question.id] === option.id
                      ? "primary"
                      : "outline"
                  }
                  onClick={() => setAnswer(question.id, option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <section
        id="results"
        className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-6 shadow-[var(--sg-shadow-sm)]"
      >
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          Diagnostic snapshot
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Scores are your answers on this device — not a vendor ranking, and
          not a claim we audited your CRM.
        </p>
        {unanswered > 0 ? (
          <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
            Answer the remaining {unanswered} question
            {unanswered === 1 ? "" : "s"} to finish the snapshot.
          </p>
        ) : (
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <ScoreCard label="People adoption" value={people} />
            <ScoreCard label="System health" value={system} />
            <ScoreCard label="Combined" value={overall} />
          </dl>
        )}

        {unanswered === 0 && findings.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {findings.map((finding) => (
              <li key={finding.id} className="text-sm">
                <span className="font-semibold text-[var(--sg-color-navy)]">
                  {finding.severity === "high" ? "Fix first" : "Watch"}
                  {": "}
                </span>
                <span className="text-[var(--sg-color-text-muted)]">
                  {finding.detail}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/resources/crm-optimization-checklist/">
            Optimization checklist
          </ButtonLink>
          <ButtonLink href="/guides/crm-health-check/" variant="outline">
            CRM health-check guide
          </ButtonLink>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSession(resetAdoptionHealthSession())}
          >
            Clear answers
          </Button>
        </div>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-surface-muted)] px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-[var(--sg-color-navy)]">
        {value}
      </dd>
    </div>
  );
}
