import { Check, X } from "lucide-react";
import { Section } from "@/components/layout/section";

const LEFT = [
  "Prioritize paying vendors",
  "Hide how recommendations work",
  "Push users directly toward demos",
  "Provide little supporting research",
] as const;

const RIGHT = [
  "Uses structured software research",
  "Explains why products match",
  "Links recommendations to reviews",
  "Separates affiliate relationships from rankings",
  "Lets users continue researching",
] as const;

export function ToolTrustSection() {
  return (
    <Section padding="md" background="tint" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        Not another sponsored software quiz
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Recommendations are scored from published product research — affiliate
        relationships never change Finder rankings.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-text-muted)]">
            Most software recommendation tools
          </h3>
          <ul className="mt-4 space-y-3">
            {LEFT.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--sg-color-text)]">
                <X
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-primary)]">
            SoftwareGlimpse
          </h3>
          <ul className="mt-4 space-y-3">
            {RIGHT.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--sg-color-text)]">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
