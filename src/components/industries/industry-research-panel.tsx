import Link from "next/link";
import { BookOpen, Scale, ShieldCheck } from "lucide-react";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  researchedProductCount: number;
  lastRefresh?: string | null;
  evidenceCoverageLabel?: string | null;
  methodologyHref?: string;
  className?: string;
};

export function IndustryResearchPanel({
  title = "How SoftwareGlimpse evaluates CRM software",
  researchedProductCount,
  lastRefresh,
  evidenceCoverageLabel,
  methodologyHref = COMPANY_ROUTES.methodology,
  className,
}: Props) {
  const columns = [
    {
      title: "Evidence",
      body: "Product capabilities and pricing are tied to recorded evidence.",
      Icon: BookOpen,
      href: COMPANY_ROUTES.howWeReview,
    },
    {
      title: "Evaluation",
      body: "Products are compared using consistent category criteria.",
      Icon: Scale,
      href: methodologyHref,
    },
    {
      title: "Independence",
      body: "Affiliate relationships never determine rankings or recommendations.",
      Icon: ShieldCheck,
      href: LEGAL_ROUTES.editorialIndependence,
    },
  ] as const;

  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="research-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {columns.map(({ title: colTitle, body, Icon, href }) => (
          <li key={colTitle}>
            <Link href={href} className="group block">
              <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {colTitle}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {body}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--sg-color-text-muted)]">
        <div>
          <dt className="inline font-medium text-[var(--sg-color-text)]">
            Catalogue coverage:{" "}
          </dt>
          <dd className="inline">
            {researchedProductCount} CRM{" "}
            {researchedProductCount === 1 ? "product" : "products"}
          </dd>
        </div>
        {lastRefresh ? (
          <div>
            <dt className="inline font-medium text-[var(--sg-color-text)]">
              Last recommendation refresh:{" "}
            </dt>
            <dd className="inline">{lastRefresh.slice(0, 10)}</dd>
          </div>
        ) : null}
        {evidenceCoverageLabel ? (
          <div className="basis-full">
            <dt className="sr-only">Evidence coverage</dt>
            <dd>{evidenceCoverageLabel}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6">
        <ButtonLink href={methodologyHref} variant="outline">
          {withSingleArrow("Read our methodology")}
        </ButtonLink>
      </div>
    </section>
  );
}
