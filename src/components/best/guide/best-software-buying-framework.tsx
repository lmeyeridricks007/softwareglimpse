import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  framework: NonNullable<BestPageModel["buyingFramework"]>;
  className?: string;
};

export function BestSoftwareBuyingFramework({ framework, className }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        {framework.heading}
      </h2>
      <ol className="mt-6 grid gap-4 lg:grid-cols-5">
        {framework.steps.map((step) => (
          <li
            key={step.step}
            className="relative rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-sm font-semibold text-white">
              {step.step}
            </span>
            <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
              {step.title}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-[var(--sg-color-text-muted)]">
              {step.body}
            </p>
            <div className="mt-3 space-y-1">
              {step.toolHref && step.toolLabel ? (
                <Link
                  href={step.toolHref}
                  className="block text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  → {step.toolLabel}
                </Link>
              ) : null}
              {step.guideHref && step.guideLabel ? (
                <Link
                  href={step.guideHref}
                  className="block text-sm font-medium text-[var(--sg-color-text-muted)] underline-offset-2 hover:underline"
                >
                  → {step.guideLabel}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

type GroupsProps = {
  groups: BestPageModel["guideGroups"];
  exploreAllHref?: string;
  className?: string;
};

export function BestSoftwareGuideGroups({
  groups,
  exploreAllHref = "/guides/",
  className,
}: GroupsProps) {
  if (groups.length === 0) return null;

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          CRM buying guides
        </h2>
        <ButtonLink href={exploreAllHref} variant="outline" size="sm">
          Explore all CRM guides →
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {groups.slice(0, 4).map((group) => (
          <div
            key={group.id}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--sg-color-text-muted)]">
              {group.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {group.items.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

type HubsProps = {
  hubs: BestPageModel["productHubs"];
  className?: string;
};

export function BestSoftwareProductHubs({ hubs, className }: HubsProps) {
  if (hubs.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Learn about individual CRM platforms
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <li
            key={hub.product.slug}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <Link
              href={hub.product.href}
              className="font-semibold underline-offset-2 hover:underline"
            >
              {hub.product.name}
            </Link>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {hub.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

type TransparencyProps = {
  data: NonNullable<BestPageModel["researchTransparency"]>;
  className?: string;
};

export function BestSoftwareResearchTransparency({
  data,
  className,
}: TransparencyProps) {
  const metrics = [
    { label: "Products evaluated", value: String(data.productsEvaluated) },
    {
      label: "Feature-support records",
      value: String(data.featureSupportRows),
    },
    {
      label: "Products with pricing coverage",
      value: String(data.productsWithPricing),
    },
    {
      label: "Products with screenshots",
      value: String(data.productsWithScreenshots),
    },
    {
      label: "Official source IDs",
      value: String(data.officialSourceIds),
    },
    ...(data.lastRefresh
      ? [{ label: "Last recommendation refresh", value: data.lastRefresh }]
      : []),
  ];

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5",
        className,
      )}
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--sg-color-text-muted)]">
        How we recommend
      </h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-xs text-[var(--sg-color-text-muted)]">
              {m.label}
            </dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-[var(--sg-color-navy)]">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
      {data.methodologyVersion ? (
        <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
          Methodology version {data.methodologyVersion}
        </p>
      ) : null}
    </div>
  );
}
