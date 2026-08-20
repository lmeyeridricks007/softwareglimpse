import Link from "next/link";
import {
  BookOpen,
  Building2,
  Calculator,
  ClipboardList,
  Compass,
  Layers,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import {
  buildCrmHubDecisionLinks,
  type CrmHubLink,
  type CrmHubLinkContext,
} from "@/services/hub-linking/crm-hub-links";
import { cn } from "@/lib/cn";

const ICONS: Record<string, LucideIcon> = {
  "/tools/crm-finder/": Compass,
  "/tools/crm-cost-calculator/": Calculator,
  "/tools/crm-requirements-builder/": ClipboardList,
  "/tools/crm-vendor-scorecard/": Scale,
  "/guides/how-to-choose-crm/": BookOpen,
  "/guides/what-is-crm/": BookOpen,
  "/guides/crm-requirements-guide/": BookOpen,
  "/best/crm-software/": Layers,
  "/categories/crm/": Layers,
  "/capabilities/": Layers,
  "/features/": Layers,
  "/use-cases/": Layers,
  "/industries/": Building2,
  "/for/": Users,
  "/resources/": ClipboardList,
  "/compare/": Scale,
};

function iconFor(href: string): LucideIcon {
  const path = href.split("?")[0] ?? href;
  return ICONS[path] ?? Layers;
}

type Props = {
  title?: string;
  description?: string;
  context?: CrmHubLinkContext;
  /** Override auto-built groups when a hub already curated tools/guides. */
  tools?: CrmHubLink[];
  guides?: CrmHubLink[];
  hubs?: CrmHubLink[];
  className?: string;
};

function LinkGroup({
  heading,
  items,
}: {
  heading: string;
  items: CrmHubLink[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {heading}
      </h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = iconFor(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className="group block h-full">
                <Card
                  variant="interactive"
                  className="flex h-full items-start gap-3 p-4"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {withSingleArrow(item.label)}
                    </span>
                    {item.description ? (
                      <span className="mt-1 block text-sm text-[var(--sg-color-text-muted)]">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Shared tools / guides / related hubs strip for CRM audience, industry,
 * and use-case detail pages.
 */
export function HubDecisionLinks({
  title = "Tools, guides & related pages",
  description = "Continue with decision tools and pages — affiliate relationships never change recommendations.",
  context,
  tools,
  guides,
  hubs,
  className,
}: Props) {
  const built = buildCrmHubDecisionLinks(context);
  const toolItems = (tools ?? built.tools).slice(0, 4);
  const guideItems = (guides ?? built.guides).slice(0, 3);
  const hubItems = (hubs ?? built.hubs).slice(0, 8);

  if (toolItems.length + guideItems.length + hubItems.length === 0) {
    return null;
  }

  return (
    <section
      id="next-steps"
      aria-labelledby="hub-decision-links-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-5 py-7 sm:px-7",
        className,
      )}
    >
      <h2
        id="hub-decision-links-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
          {description}
        </p>
      ) : null}
      <div className="mt-6 space-y-7">
        <LinkGroup heading="Decision tools" items={toolItems} />
        <LinkGroup heading="Guides" items={guideItems} />
        <LinkGroup heading="Related pages" items={hubItems} />
      </div>
    </section>
  );
}
