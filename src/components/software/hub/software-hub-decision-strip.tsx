import type { SoftwareReviewModel } from "@/services/software-review";
import { SoftwareHubTabLink } from "@/components/software/hub/software-product-hub-client";

type Props = {
  model: SoftwareReviewModel;
};

/**
 * Decision-hub strip — surfaces overlay pack built from canonical sources only.
 * Missing sections are listed, never filled with invented copy.
 */
export function SoftwareHubDecisionStrip({ model }: Props) {
  const hub = model.decisionHub;
  if (!hub) return null;

  const hasBody =
    hub.whatItIs ||
    hub.bestFor.length > 0 ||
    hub.notIdealFor.length > 0 ||
    hub.keyTradeoffs.length > 0 ||
    hub.importantComparisons.length > 0 ||
    hub.nextDecisionStep;

  if (!hasBody) return null;

  return (
    <section
      aria-labelledby="decision-hub-heading"
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="decision-hub-heading"
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
        >
          Decision snapshot
        </h2>
        {hub.fieldAuditScore != null ? (
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            Entity field audit {hub.fieldAuditScore}/100
          </p>
        ) : null}
      </div>

      {hub.whatItIs ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text)]">
          {hub.whatItIs}
        </p>
      ) : null}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {hub.bestFor.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Best for
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[var(--sg-color-text-muted)]">
              {hub.bestFor.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {hub.notIdealFor.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Not ideal for
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[var(--sg-color-text-muted)]">
              {hub.notIdealFor.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {hub.keyTradeoffs.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Key tradeoffs
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[var(--sg-color-text-muted)]">
            {hub.keyTradeoffs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {hub.pricingSummary ? (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          <span className="font-medium text-[var(--sg-color-text)]">Pricing: </span>
          {hub.pricingSummary}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Evidence: {hub.evidenceState}
      </p>

      {hub.missingSections.length > 0 ? (
        <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
          Incomplete entity fields (not invented):{" "}
          {hub.missingSections.slice(0, 8).join(", ")}
        </p>
      ) : null}

      {hub.nextDecisionStep ? (
        <p className="mt-4 text-sm font-medium text-[var(--sg-color-text)]">
          Next step: {hub.nextDecisionStep}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        {hub.importantComparisons[0] ? (
          <a
            href={hub.importantComparisons[0].href}
            className="inline-flex h-9 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 text-sm font-medium"
          >
            Important comparison →
          </a>
        ) : null}
        {hub.relevantGuides[0] ? (
          <a
            href={hub.relevantGuides[0].href}
            className="inline-flex h-9 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 text-sm font-medium"
          >
            Relevant guide →
          </a>
        ) : null}
        <SoftwareHubTabLink
          tab="alternatives"
          className="inline-flex h-9 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 text-sm font-medium"
        >
          Alternatives →
        </SoftwareHubTabLink>
        <SoftwareHubTabLink
          tab="evidence"
          className="inline-flex h-9 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 text-sm font-medium"
        >
          Evidence →
        </SoftwareHubTabLink>
      </div>
    </section>
  );
}
