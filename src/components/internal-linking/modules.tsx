import Link from "next/link";
import type { ContextualLink, PageLinkPlan } from "@/services/internal-linking/types";
import { cn } from "@/lib/cn";

function ModuleSection({
  title,
  description,
  links,
  className,
}: {
  title: string;
  description?: string;
  links: ContextualLink[];
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <section className={cn("mt-10", className)} aria-label={title}>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          {description}
        </p>
      ) : null}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={`${link.module}-${link.href}`}>
            <Link
              href={link.href}
              className="block rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {link.label}
              {link.description ? (
                <span className="mt-1 block text-xs font-normal text-[var(--sg-color-text-muted)]">
                  {link.description}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ParentHubLink({ links }: { links: ContextualLink[] }) {
  if (links.length === 0) return null;
  const primary = links[0]!;
  return (
    <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
      Part of{" "}
      <Link
        href={primary.href}
        className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        {primary.label}
      </Link>
      {links.slice(1).map((link) => (
        <span key={link.href}>
          {" "}
          ·{" "}
          <Link
            href={link.href}
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </p>
  );
}

export function RecommendedNextStep({ links }: { links: ContextualLink[] }) {
  if (links.length === 0) return null;
  const [primary, ...rest] = links;
  return (
    <aside className="mt-10 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/50 px-5 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
        Next step
      </p>
      <p className="mt-1 font-semibold text-[var(--sg-color-text)]">
        Continue your CRM decision journey
      </p>
      {primary.description ? (
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          {primary.description}
        </p>
      ) : null}
      <ul className="mt-4 space-y-2">
        <li>
          <Link
            href={primary.href}
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {primary.label}
          </Link>
        </li>
        {rest.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function TryDecisionTool({ links }: { links: ContextualLink[] }) {
  return (
    <ModuleSection
      title="Try a decision tool"
      description="Interactive helpers use recommendation criteria — affiliate status never changes outcomes."
      links={links}
    />
  );
}

export function RelatedGuides({ links }: { links: ContextualLink[] }) {
  return (
    <ModuleSection
      title="Related guides"
      description="Supporting reading in this topic — not a generic related-posts dump."
      links={links}
    />
  );
}

export function RelatedProducts({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related products" links={links} />;
}

export function RelatedComparisons({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related comparisons" links={links} />;
}

export function RelatedCapabilities({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related capabilities" links={links} />;
}

export function RelatedRequirements({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related requirements" links={links} />;
}

export function RelatedFeatures({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related features" links={links} />;
}

export function RelatedUseCases({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related use cases" links={links} />;
}

export function RelatedIndustries({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related industries" links={links} />;
}

export function RelatedResources({ links }: { links: ContextualLink[] }) {
  return <ModuleSection title="Related resources" links={links} />;
}

type PlanModulesProps = {
  plan: PageLinkPlan;
  /** When a page already renders some modules natively, skip duplicates. */
  omit?: Array<keyof PageLinkPlan>;
  showParentInline?: boolean;
  className?: string;
};

export function InternalLinkingModules({
  plan,
  omit = [],
  showParentInline = true,
  className,
}: PlanModulesProps) {
  const skip = new Set(omit);
  return (
    <div className={cn("space-y-2", className)}>
      {showParentInline && !skip.has("parentHub") ? (
        <ParentHubLink links={plan.parentHub} />
      ) : null}
      {!skip.has("recommendedNextStep") ? (
        <RecommendedNextStep links={plan.recommendedNextStep} />
      ) : null}
      {!skip.has("tryDecisionTool") ? (
        <TryDecisionTool links={plan.tryDecisionTool} />
      ) : null}
      {!skip.has("relatedGuides") ? (
        <RelatedGuides links={plan.relatedGuides} />
      ) : null}
      {!skip.has("relatedProducts") ? (
        <RelatedProducts links={plan.relatedProducts} />
      ) : null}
      {!skip.has("relatedComparisons") ? (
        <RelatedComparisons links={plan.relatedComparisons} />
      ) : null}
      {!skip.has("relatedCapabilities") ? (
        <RelatedCapabilities links={plan.relatedCapabilities} />
      ) : null}
      {!skip.has("relatedRequirements") ? (
        <RelatedRequirements links={plan.relatedRequirements} />
      ) : null}
      {!skip.has("relatedFeatures") ? (
        <RelatedFeatures links={plan.relatedFeatures} />
      ) : null}
      {!skip.has("relatedUseCases") ? (
        <RelatedUseCases links={plan.relatedUseCases} />
      ) : null}
      {!skip.has("relatedIndustries") ? (
        <RelatedIndustries links={plan.relatedIndustries} />
      ) : null}
      {!skip.has("relatedResources") ? (
        <RelatedResources links={plan.relatedResources} />
      ) : null}
    </div>
  );
}
