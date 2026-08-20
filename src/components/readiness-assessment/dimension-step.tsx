"use client";

import type { ReadinessAnswer, ReadinessAnswerValue } from "@/domain";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type {
  ReadinessDimensionDef,
  ReadinessQuestionDef,
} from "@/services/readiness-assessment/catalog";

type Props = {
  dimension: ReadinessDimensionDef;
  dimensionIndex: number;
  totalDimensions: number;
  questions: ReadinessQuestionDef[];
  answers: Record<string, ReadinessAnswer>;
  importedIds: string[];
  onAnswer: (questionId: string, value: ReadinessAnswerValue) => void;
  onBack: () => void;
  onNext: () => void;
};

export function DimensionStep({
  dimension,
  dimensionIndex,
  totalDimensions,
  questions,
  answers,
  importedIds,
  onAnswer,
  onBack,
  onNext,
}: Props) {
  const allAnswered =
    questions.length === 0 ||
    questions.every((q) => {
      const a = answers[q.id];
      if (a == null || a.value == null) return false;
      if (Array.isArray(a.value) && a.value.length === 0) return false;
      return true;
    });

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Step {dimensionIndex + 1} of {totalDimensions}
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)] sm:text-2xl">
        {dimension.title}
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        {dimension.description}
      </p>

      <div className="mt-6 space-y-6">
        {questions.length === 0 ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            No questions for your organization profile in this dimension —
            continue.
          </p>
        ) : (
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={answers[q.id]?.value}
              imported={importedIds.includes(q.id)}
              onAnswer={(value) => onAnswer(q.id, value)}
            />
          ))
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--sg-color-border)] pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!allAnswered && questions.length > 0}>
          {dimensionIndex >= totalDimensions - 1
            ? "See results"
            : "Next dimension"}
        </Button>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  value,
  imported,
  onAnswer,
}: {
  question: ReadinessQuestionDef;
  value: ReadinessAnswerValue | undefined;
  imported: boolean;
  onAnswer: (value: ReadinessAnswerValue) => void;
}) {
  const multi = question.type === "multi";
  const selected = multi
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string"
      ? value
      : "";

  return (
    <fieldset className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
      <legend className="px-1 text-sm font-semibold text-[var(--sg-color-navy)]">
        {question.prompt}
      </legend>
      {imported ? (
        <p className="mt-1 text-xs text-[var(--sg-color-primary)]">
          Imported from Requirements Builder — confirm or correct
        </p>
      ) : null}
      {question.helpText ? (
        <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
          {question.helpText}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-3 gap-2",
          multi ? "grid sm:grid-cols-2" : "flex flex-col",
        )}
        role={multi ? "group" : "radiogroup"}
        aria-label={question.prompt}
      >
        {question.options.map((opt) => {
          const isOn = multi
            ? (selected as string[]).includes(opt.id)
            : selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={cn(
                "rounded-[var(--sg-radius-md)] border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]",
                isOn
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-navy)]"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)]/40",
              )}
              aria-pressed={isOn}
              onClick={() => {
                if (multi) {
                  const cur = selected as string[];
                  const next = isOn
                    ? cur.filter((id) => id !== opt.id)
                    : [...cur, opt.id];
                  onAnswer(next);
                } else {
                  onAnswer(opt.id);
                }
              }}
            >
              <span className="font-medium text-[var(--sg-color-navy)]">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
