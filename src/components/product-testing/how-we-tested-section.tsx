import Image from "next/image";
import Link from "next/link";
import type { PublicHandsOnTestSummary } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  productName: string;
  summary: PublicHandsOnTestSummary;
  className?: string;
};

/**
 * Public "How we tested" section.
 * Only render when a valid completed human test summary exists.
 * Never shows internalNotes.
 */
export function HowWeTestedSection({
  productName,
  summary,
  className,
}: Props) {
  const screenshots = summary.publicEvidence.filter(
    (e) => e.kind === "SCREENSHOT" && e.assetPath,
  );

  return (
    <section
      className={cn("space-y-5", className)}
      aria-labelledby="how-we-tested-heading"
    >
      <div>
        <h2
          id="how-we-tested-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          How we tested {productName}
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          First-hand evaluation recorded in a completed human test session — not
          inferred from AI content generation.{" "}
          <Link
            href={COMPANY_ROUTES.howWeReview}
            className="underline-offset-2 hover:underline"
          >
            How evidence levels work
          </Link>
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Meta label="Hands-on tested" value={formatDate(summary.testedAt)} />
        {summary.testerName ? (
          <Meta label="Tester" value={summary.testerName} />
        ) : null}
        {summary.planTested ? (
          <Meta label="Plan tested" value={summary.planTested} />
        ) : null}
        {summary.testScenario ? (
          <Meta label="Testing scenario" value={summary.testScenario} />
        ) : null}
        {summary.testEnvironment ? (
          <Meta label="Environment" value={summary.testEnvironment} />
        ) : null}
        {summary.productVersion ? (
          <Meta label="Product version" value={summary.productVersion} />
        ) : null}
        {summary.setupMinutes != null ? (
          <Meta
            label="Setup time"
            value={`About ${summary.setupMinutes} minutes`}
          />
        ) : null}
        {summary.pricingObserved ? (
          <Meta label="Pricing observed" value={summary.pricingObserved} />
        ) : null}
      </dl>

      {summary.taskSummary ? (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Protocol tasks: {summary.taskSummary.pass} pass,{" "}
          {summary.taskSummary.partial} partial, {summary.taskSummary.fail}{" "}
          fail
          {summary.taskSummary.notAvailable
            ? `, ${summary.taskSummary.notAvailable} not available`
            : ""}
          {summary.taskSummary.notApplicable
            ? `, ${summary.taskSummary.notApplicable} not applicable`
            : ""}{" "}
          (of {summary.taskSummary.total}).
        </p>
      ) : null}

      {summary.strengths.length > 0 ? (
        <div>
          <h3 className="font-medium text-[var(--sg-color-text)]">
            Strengths observed
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
            {summary.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.weaknesses.length > 0 ? (
        <div>
          <h3 className="font-medium text-[var(--sg-color-text)]">
            Weaknesses observed
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
            {summary.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {screenshots.length > 0 ? (
        <div>
          <h3 className="font-medium text-[var(--sg-color-text)]">
            Selected evidence
          </h3>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {screenshots.slice(0, 6).map((shot) => (
              <li
                key={shot.id}
                className="overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]"
              >
                {shot.assetPath?.startsWith("/") ? (
                  <Image
                    src={shot.assetPath}
                    alt={shot.publicCaption || shot.title}
                    width={960}
                    height={540}
                    className="h-auto w-full object-cover"
                  />
                ) : null}
                <p className="px-3 py-2 text-xs text-[var(--sg-color-text-muted)]">
                  {shot.publicCaption || shot.title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--sg-color-text)]">
        {value}
      </dd>
    </div>
  );
}
