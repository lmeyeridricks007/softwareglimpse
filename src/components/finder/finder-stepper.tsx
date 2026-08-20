import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/cn";

export type FinderStage = {
  id: string;
  label: string;
};

type StepperProps = {
  stages: FinderStage[];
  /** 0-based active stage index */
  activeIndex: number;
  className?: string;
  /**
   * When set, completed / reachable stages become buttons so users can jump
   * back (or forward within what they have already unlocked).
   */
  onStageSelect?: (stageId: string, index: number) => void;
  /**
   * Highest index the user may open (inclusive). Defaults to `activeIndex`
   * when `onStageSelect` is provided — completed + current only.
   */
  maxReachableIndex?: number;
};

/** Numbered stage stepper (mockup progress). */
export function FinderStepper({
  stages,
  activeIndex,
  className,
  onStageSelect,
  maxReachableIndex,
}: StepperProps) {
  const reachable =
    maxReachableIndex ?? (onStageSelect ? activeIndex : -1);

  return (
    <nav
      aria-label="Finder progress"
      className={cn("mb-8", className)}
      role={onStageSelect ? undefined : "status"}
    >
      <ol className="flex items-start justify-between gap-1">
        {stages.map((stage, index) => {
          const done = index < activeIndex;
          const current = index === activeIndex;
          const canSelect =
            Boolean(onStageSelect) && index <= reachable && !current;

          return (
            <li
              key={stage.id}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {index < stages.length - 1 ? (
                <span
                  className={cn(
                    "absolute top-4 left-[calc(50%+1rem)] right-[calc(-50%+1rem)] h-0.5",
                    // Only fill the connector after a stage is completed — not while it's current
                    done
                      ? "bg-[var(--sg-color-success)]"
                      : "bg-[var(--sg-color-border)]",
                  )}
                  aria-hidden
                />
              ) : null}
              {canSelect ? (
                <button
                  type="button"
                  onClick={() => onStageSelect?.(stage.id, index)}
                  className={cn(
                    "relative z-[1] inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
                    done
                      ? "bg-[var(--sg-color-success)] text-white"
                      : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                  )}
                  aria-label={`Go to ${stage.label}`}
                >
                  {done ? <Check className="size-4" aria-hidden /> : index + 1}
                </button>
              ) : (
                <span
                  className={cn(
                    "relative z-[1] inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                    done
                      ? "bg-[var(--sg-color-success)] text-white"
                      : current
                        ? "size-9 bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)] ring-4 ring-[var(--sg-color-primary-soft)]"
                        : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  {done ? <Check className="size-4" aria-hidden /> : index + 1}
                </span>
              )}
              {canSelect ? (
                <button
                  type="button"
                  onClick={() => onStageSelect?.(stage.id, index)}
                  className={cn(
                    "mt-2 hidden cursor-pointer text-xs font-medium underline-offset-2 hover:underline sm:block",
                    done
                      ? "text-[var(--sg-color-text)]"
                      : "text-[var(--sg-color-text-muted)]",
                  )}
                >
                  {stage.label}
                </button>
              ) : (
                <span
                  className={cn(
                    "mt-2 hidden text-xs font-medium sm:block",
                    current
                      ? "font-semibold text-[var(--sg-color-primary)]"
                      : done
                        ? "text-[var(--sg-color-text)]"
                        : "text-[var(--sg-color-text-muted)]",
                  )}
                >
                  {stage.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="sr-only">
        Step {activeIndex + 1} of {stages.length}: {stages[activeIndex]?.label}
        {onStageSelect
          ? ". Completed steps are links you can open to edit earlier answers."
          : ""}
      </p>
    </nav>
  );
}

export function FinderPrivacyNote({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "mt-6 flex gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]",
        className,
      )}
    >
      <Lock
        className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
        aria-hidden
      />
      <p>
        Your answers stay on this device to resume the quiz. We do not put them
        in the URL, and they are not used to send marketing email.
      </p>
    </aside>
  );
}
