import { createElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import {
  AudienceConceptVisual,
  audienceHowItWorksCaption,
} from "@/components/for/audience-visuals";
import {
  iconForAudienceSlug,
} from "@/components/for/audience-hero";
import { businessTypePlural } from "@/components/for/business-type-labels";
import { hubToneClass } from "@/components/category/hub-icons";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { SoftwareCard } from "@/components/software/software-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSoftwareBySlug } from "@/data";
import type { AudienceHubModel } from "@/services/audience-hub";
import { cn } from "@/lib/cn";

function stripWorkedExamplePrefix(text: string): string {
  return text.replace(/^Worked example:\s*/i, "").trim();
}

function parseWorkedExample(text: string): {
  lead: string;
  before?: string;
  after?: string;
} {
  const raw = stripWorkedExamplePrefix(text);
  const split = raw.match(
    /^(.*?)\s*Before CRM[,:]?\s*(.+?)\s*After CRM[,:]?\s*(.+)$/is,
  );
  if (split) {
    return {
      lead: split[1].trim().replace(/\.$/, ""),
      before: split[2].trim().replace(/\.$/, ""),
      after: split[3].trim().replace(/\.$/, ""),
    };
  }
  return { lead: raw };
}

export function AudienceGlanceStrip({
  model,
  className,
}: {
  model: AudienceHubModel;
  className?: string;
}) {
  const items = [
    model.glance.primaryGoal
      ? {
          label: "Primary goal",
          value: model.glance.primaryGoal,
          Icon: Target,
        }
      : null,
    model.glance.typicalTeam
      ? {
          label: "Typical team",
          value: model.glance.typicalTeam,
          Icon: Users,
        }
      : null,
    model.glance.commonPriorities.length > 0
      ? {
          label: "Priorities",
          value: model.glance.commonPriorities.slice(0, 4).join(" · "),
          Icon: CheckCircle2,
        }
      : null,
    {
      label: "CRM options shown",
      value: `${model.glance.taggedProductCount} products to explore`,
      Icon: Lightbulb,
    },
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    Icon: typeof Target;
  }>;

  return (
    <section
      aria-label="At a glance"
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[linear-gradient(180deg,var(--sg-color-surface)_0%,#f8fbff_100%)] px-4 py-4 shadow-[var(--sg-shadow-sm)] sm:px-6",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        At a glance
      </p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ label, value, Icon }) => (
          <li key={label} className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-[var(--sg-color-primary-soft)]">
                <Icon className="size-3.5" aria-hidden />
              </span>
              {label}
            </span>
            <p className="mt-1.5 text-sm leading-snug text-[var(--sg-color-text)]">
              {value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AudienceQuickNav({
  items,
  className,
}: {
  items: AudienceHubModel["navItems"];
  className?: string;
}) {
  return (
    <nav
      aria-label="On this page"
      className={cn(
        "flex flex-wrap gap-2 border-b border-[var(--sg-color-border)] pb-4",
        className,
      )}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)]/40 hover:text-[var(--sg-color-primary)]"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function AudienceOverview({
  overview,
  whoThisIsFor,
  workedExample,
  workedExampleSecondary,
  focusAreas,
  needsVisual,
  slug,
  label,
  visualKind,
  className,
}: {
  overview: string;
  whoThisIsFor?: string | null;
  workedExample?: string | null;
  workedExampleSecondary?: string | null;
  focusAreas?: string[];
  needsVisual?: AudienceHubModel["needsVisual"];
  slug: string;
  label: string;
  visualKind: AudienceHubModel["visualKind"];
  className?: string;
}) {
  const plural = businessTypePlural(slug, label);
  const Icon = iconForAudienceSlug(slug);
  const examples = [workedExample, workedExampleSecondary].filter(
    Boolean,
  ) as string[];
  const chips = (focusAreas ?? []).slice(0, 5);

  return (
    <section
      id="overview-body"
      aria-labelledby="overview-body-heading"
      className={cn("scroll-mt-28", className)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Fit snapshot
      </p>
      <h2
        id="overview-body-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Overview
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
        {overview}
      </p>

      {chips.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text)]"
            >
              {chip}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6">
        {needsVisual ? (
          <figure className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
            <Image
              src={needsVisual.src}
              alt={needsVisual.alt}
              width={1536}
              height={1024}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 48rem, 100vw"
              priority
              unoptimized
            />
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
              {needsVisual.caption ??
                `Teaching diagram — typical CRM pressure points for ${plural}.`}
            </figcaption>
          </figure>
        ) : (
          <AudienceConceptVisual
            kind={visualKind}
            audienceName={label}
            slug={slug}
          />
        )}
      </div>

      {whoThisIsFor ? (
        <div className="sg-guide-tip mt-6 flex gap-3 px-4 py-4 sm:gap-4 sm:px-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
            {createElement(Icon, {
              className: "size-5",
              "aria-hidden": true,
            })}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Who this is for
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {whoThisIsFor}
            </p>
          </div>
        </div>
      ) : null}

      {examples.length > 0 ? (
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
              Real-world examples
            </h3>
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              How {plural} put CRM to work
            </p>
          </div>
          <ul
            className={cn(
              "mt-4 grid gap-4",
              examples.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2",
            )}
          >
            {examples.map((example, index) => {
              const parsed = parseWorkedExample(example);
              return (
                <li key={`example-${index}`}>
                  <Card className="relative h-full overflow-hidden border-[var(--sg-color-border)] p-0 shadow-[var(--sg-shadow-sm)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--sg-color-primary),#93c5fd)]" />
                    <div className="p-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                            hubToneClass(index),
                          )}
                        >
                          {index + 1}
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                          Example {index + 1}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-snug text-[var(--sg-color-text)]">
                        {parsed.lead}
                      </p>
                      {parsed.before && parsed.after ? (
                        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                          <div className="rounded-[var(--sg-radius-md)] border border-amber-200/80 bg-amber-50/80 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                              Before CRM
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
                              {parsed.before}
                            </p>
                          </div>
                          <div className="hidden items-center justify-center text-[var(--sg-color-primary)] sm:flex">
                            <ArrowRight className="size-4" aria-hidden />
                          </div>
                          <div className="rounded-[var(--sg-radius-md)] border border-emerald-200/80 bg-emerald-50/80 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                              After CRM
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
                              {parsed.after}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function AudienceChallenges({
  items,
  slug,
  label,
  className,
}: {
  items: AudienceHubModel["challenges"];
  slug: string;
  label: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="challenges"
      aria-labelledby="challenges-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="challenges-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Challenges {businessTypePlural(slug, label)} face
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        These are the operating problems that usually push{" "}
        {businessTypePlural(slug, label)} toward CRM — not feature wish lists.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="h-full p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index),
                  )}
                >
                  <AlertTriangle className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    <span className="font-medium text-[var(--sg-color-danger)]">
                      Without CRM discipline:{" "}
                    </span>
                    {item.pain}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AudienceHowCrmHelps({
  items,
  outcomes,
  slug,
  label,
  className,
}: {
  items: AudienceHubModel["challenges"];
  outcomes: AudienceHubModel["outcomes"];
  slug: string;
  label: string;
  className?: string;
}) {
  if (items.length === 0 && outcomes.length === 0) return null;
  const plural = businessTypePlural(slug, label);
  return (
    <section
      id="how-crm-helps"
      aria-labelledby="how-crm-helps-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-crm-helps-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How CRM helps {plural}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        A CRM only helps when the team keeps owners, history, and next steps
        current. Here is what “good” looks like for {plural}.
      </p>
      {items.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={`help-${item.id}`}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
            >
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-success)]">
                  With a maintained CRM:{" "}
                </span>
                {item.crmHelps}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {outcomes.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
            Outcomes to expect when adoption sticks
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {outcomes.map((item, index) => (
              <li key={item.id}>
                <Card className="h-full p-4">
                  <span
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                      hubToneClass(index),
                    )}
                  >
                    {index + 1}
                  </span>
                  <h4 className="mt-3 font-semibold text-[var(--sg-color-text)]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function AudienceCapabilityNeeds({
  items,
  slug,
  label,
  className,
}: {
  items: AudienceHubModel["capabilityNeeds"];
  slug: string;
  label: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  const musts = items.filter((i) => i.priority === "must");
  const nices = items.filter((i) => i.priority === "nice");
  const plural = businessTypePlural(slug, label);
  return (
    <section
      id="needs"
      aria-labelledby="needs-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="needs-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What to look for in a CRM
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Start with must-haves that match day-to-day work. Nice-to-haves can wait
        until the basics are trusted.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text)]">
            Must-haves
          </h3>
          <ul className="mt-3 space-y-3">
            {musts.map((item) => (
              <li key={item.id}>
                <Card className="p-4">
                  <h4 className="font-semibold text-[var(--sg-color-text)]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {withSingleArrow("Learn more")}
                    </Link>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text)]">
            Nice-to-haves later
          </h3>
          {nices.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {nices.map((item) => (
                <li key={item.id}>
                  <Card className="p-4" variant="soft">
                    <h4 className="font-semibold text-[var(--sg-color-text)]">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                      {item.description}
                    </p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {withSingleArrow("Learn more")}
                      </Link>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              Focus on must-haves first for {plural}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function AudienceWorkflow({
  steps,
  workflowVisual,
  audienceName,
  slug,
  visualKind,
  className,
}: {
  steps: AudienceHubModel["workflowSteps"];
  workflowVisual?: AudienceHubModel["workflowVisual"];
  audienceName: string;
  slug: string;
  visualKind: AudienceHubModel["visualKind"];
  className?: string;
}) {
  const plural = businessTypePlural(slug, audienceName);
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="workflow-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        A practical CRM workflow for {plural}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        {audienceHowItWorksCaption(audienceName, visualKind)}
      </p>
      {workflowVisual ? (
        <figure className="mt-5 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
          <Image
            src={workflowVisual.src}
            alt={workflowVisual.alt}
            width={960}
            height={540}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            unoptimized
          />
          {workflowVisual.caption ? (
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
              {workflowVisual.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : (
        <AudienceConceptVisual
          kind={visualKind}
          audienceName={audienceName}
          slug={slug}
          className="mt-5"
        />
      )}
      {steps.length > 0 ? (
        <ol className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="flex gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-sm font-semibold text-[var(--sg-color-primary)]">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  {step.label}
                </h3>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

export function AudienceWhatMatters({
  title,
  intro,
  items,
  className,
}: {
  title: string;
  intro?: string;
  items: AudienceHubModel["priorities"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="what-matters"
      aria-labelledby="what-matters-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="what-matters-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          {intro}
        </p>
      ) : null}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          const content = (
            <>
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(index),
                )}
              >
                {createElement(Icon, {
                  className: "size-5",
                  "aria-hidden": true,
                })}
              </span>
              <h3 className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {item.href ? (
                <p className="mt-2 text-sm font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow("Explore")}
                </p>
              ) : null}
            </>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="group block h-full">
                  <Card variant="interactive" className="h-full p-4">
                    {content}
                  </Card>
                </Link>
              ) : (
                <Card className="h-full p-4">{content}</Card>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AudienceFitSignals({
  items,
  className,
}: {
  items: AudienceHubModel["fitSignals"];
  className?: string;
}) {
  if (items.length === 0) return null;
  const iconFor = (kind: string) => {
    if (kind === "fit") return CheckCircle2;
    if (kind === "watch") return CircleAlert;
    return AlertTriangle;
  };
  const toneFor = (kind: string) => {
    if (kind === "fit") return "text-[var(--sg-color-success)]";
    if (kind === "watch") return "text-[var(--sg-color-warning)]";
    return "text-[var(--sg-color-danger)]";
  };
  return (
    <section
      id="fit"
      aria-labelledby="fit-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="fit-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Fit signals
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Use these as decision checks — not as product rankings.
      </p>
      <ul className="mt-5 space-y-2">
        {items.map((item) => {
          const Icon = iconFor(item.kind);
          return (
            <li
              key={item.id}
              className="flex items-start gap-2.5 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5"
            >
              <Icon
                className={cn("mt-0.5 size-4 shrink-0", toneFor(item.kind))}
                aria-hidden
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  {item.kind === "fit"
                    ? "Good fit when"
                    : item.kind === "watch"
                      ? "Watch out"
                      : "Usually avoid"}
                </p>
                <p className="text-sm text-[var(--sg-color-text)]">
                  {item.label}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AudienceHowItWorks({
  audienceName,
  slug,
  visualKind,
  className,
}: {
  audienceName: string;
  slug: string;
  visualKind: AudienceHubModel["visualKind"];
  className?: string;
}) {
  const plural = businessTypePlural(slug, audienceName);
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-it-works-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How CRM usually works for {plural}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {audienceHowItWorksCaption(audienceName, visualKind)}
      </p>
      <AudienceConceptVisual
        kind={visualKind}
        audienceName={audienceName}
        slug={slug}
        className="mt-5"
      />
    </section>
  );
}

export function AudienceScenarios({
  items,
  className,
}: {
  items: AudienceHubModel["scenarios"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="scenarios-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Common scenarios
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          const inner = (
            <>
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(index),
                )}
              >
                {createElement(Icon, {
                  className: "size-4",
                  "aria-hidden": true,
                })}
              </span>
              <h3 className="mt-3 font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-text)]">
                  Best when:{" "}
                </span>
                {item.bestWhen}
              </p>
            </>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="block h-full">
                  <Card variant="interactive" className="h-full p-4">
                    {inner}
                  </Card>
                </Link>
              ) : (
                <Card className="h-full p-4">{inner}</Card>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AudienceSoftware({
  products,
  slug,
  label,
  className,
}: {
  products: AudienceHubModel["products"];
  slug: string;
  label: string;
  className?: string;
}) {
  const plural = businessTypePlural(slug, label);
  return (
    <section
      id="software"
      aria-labelledby="software-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="software-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        CRM software to explore
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        These CRM products commonly fit {plural}. This is a starting shortlist
        to review — not a ranked best-of list. Affiliate relationships never
        change what appears here.
      </p>
      {products.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {products.map((p) => {
            const software = getSoftwareBySlug(p.slug);
            if (!software) return null;
            return <SoftwareCard key={p.slug} software={software} />;
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          We do not have a curated shortlist for {plural} yet. Use Finder to get
          fit-based recommendations from your answers.
        </p>
      )}
    </section>
  );
}

export function AudienceBuyingSteps({
  steps,
  guideHref,
  className,
}: {
  steps: AudienceHubModel["buyingFramework"];
  guideHref?: string;
  className?: string;
}) {
  if (steps.length === 0) return null;
  return (
    <section
      id="choose"
      aria-labelledby="choose-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="choose-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How to choose
      </h2>
      <ol className="mt-5 space-y-3">
        {steps.map((step) => (
          <li
            key={step.step}
            className="flex gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-sm font-semibold text-[var(--sg-color-primary)]">
              {step.step}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                {step.title}
              </h3>
              {step.description ? (
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {step.description}
                </p>
              ) : null}
              {step.href ? (
                <Link
                  href={step.href}
                  className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(step.ctaLabel ?? "Learn more")}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {guideHref ? (
        <p className="mt-4">
          <Link
            href={guideHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("Read the full CRM buying guide")}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

export function AudienceFaq({
  items,
  className,
}: {
  items: AudienceHubModel["faq"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="faq-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        FAQ
      </h2>
      <dl className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.question}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <dt className="font-semibold text-[var(--sg-color-text)]">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function AudienceRelated({
  audiences,
  useCases,
  className,
}: {
  audiences: AudienceHubModel["relatedAudiences"];
  useCases: AudienceHubModel["relatedUseCases"];
  className?: string;
}) {
  if (audiences.length === 0 && useCases.length === 0) return null;
  return (
    <section
      aria-labelledby="related-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="related-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]"
      >
        Related
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {audiences.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Other business types
            </h3>
            <ul className="mt-2 space-y-2">
              {audiences.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={a.href}
                    className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    CRM for {a.name}
                  </Link>
                  {a.description ? (
                    <p className="text-sm text-[var(--sg-color-text-muted)]">
                      {a.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {useCases.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Related use cases
            </h3>
            <ul className="mt-2 space-y-2">
              {useCases.map((uc) => (
                <li key={uc.slug}>
                  <Link
                    href={uc.href}
                    className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {uc.name}
                  </Link>
                  {uc.description ? (
                    <p className="text-sm text-[var(--sg-color-text-muted)]">
                      {uc.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function AudienceSidebar({
  comparisons,
  guides,
  resources,
  finderHref,
  className,
}: {
  comparisons: AudienceHubModel["comparisons"];
  guides: AudienceHubModel["guides"];
  resources: AudienceHubModel["resources"];
  finderHref: string;
  className?: string;
}) {
  return (
    <aside className={cn("space-y-6", className)}>
      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-primary-soft)] p-4">
        <p className="font-semibold text-[var(--sg-color-text)]">
          Not sure which CRM fits?
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Answer a few questions for a fit-based shortlist. Affiliate
          relationships never change the order.
        </p>
        <ButtonLink href={finderHref} className="mt-3 w-full" size="md">
          Find My CRM
        </ButtonLink>
      </div>

      {comparisons.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Comparisons
          </h2>
          <ul className="mt-2 space-y-2">
            {comparisons.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {guides.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Guides
          </h2>
          <ul className="mt-2 space-y-2">
            {guides.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
          Resources
        </h2>
        <ul className="mt-2 space-y-2">
          {resources.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function AudienceFinalCta({
  title,
  description,
  primaryCta,
  compareHref,
  requirementsHref = "/tools/crm-requirements-builder/?start=1",
  className,
}: {
  title: string;
  description: string;
  primaryCta: { href: string; label: string };
  compareHref: string;
  requirementsHref?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-primary-soft)] px-5 py-8 text-center sm:px-8 sm:py-10",
        className,
      )}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href={primaryCta.href} size="lg">
          {primaryCta.label}
        </ButtonLink>
        <ButtonLink href={compareHref} variant="outline" size="lg">
          Compare CRM
        </ButtonLink>
        <ButtonLink href={requirementsHref} variant="outline" size="lg">
          Build my requirements
        </ButtonLink>
      </div>
    </section>
  );
}

export function AudienceExploreGrid({
  items,
  title = "Explore CRM by business type",
  className,
}: {
  items: Array<{
    slug: string;
    title: string;
    description?: string | null;
    href: string;
  }>;
  title?: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={cn(className)} aria-labelledby="audience-explore-heading">
      <h2
        id="audience-explore-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => {
          const Icon = iconForAudienceSlug(item.slug);
          return (
            <li key={item.slug}>
              <Card className="flex h-full flex-col items-start text-left">
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full",
                    hubToneClass(index),
                  )}
                >
                  {createElement(Icon, {
                    className: "size-5",
                    "aria-hidden": true,
                  })}
                </span>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  View business type →
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
