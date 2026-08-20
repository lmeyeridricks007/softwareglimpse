import type { ReactNode } from "react";
import Link from "next/link";
import {
  ClipboardList,
  FileSpreadsheet,
  ListChecks,
} from "lucide-react";
import { hubToneClassForSlug, withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ResourceHubItem = {
  slug: string;
  name: string;
  description: string | null;
  href: string;
  kind: string;
  stage: string;
};

const KIND_ICON = {
  checklist: ListChecks,
  template: FileSpreadsheet,
  scorecard: ClipboardList,
  worksheet: FileSpreadsheet,
  planner: ClipboardList,
} as const;

type Props = {
  title: string;
  items: ResourceHubItem[];
  viewAllHref?: string;
  emptyHint?: ReactNode;
  className?: string;
};

export function CategoryResources({
  title,
  items,
  viewAllHref = "/resources/",
  emptyHint,
  className,
}: Props) {
  return (
    <section
      id="resources"
      aria-labelledby="resources-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-muted)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="resources-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Free downloadable checklists, templates, and worksheets — no signup
            wall.
          </p>
        </div>
        {items.length > 0 && viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("View all resources")}
          </Link>
        ) : null}
      </div>
      {items.length === 0 ? (
        <p className="mt-5 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          {emptyHint ??
            "Downloadable CRM resources will appear here when published."}
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const Icon =
              KIND_ICON[item.kind as keyof typeof KIND_ICON] ?? ClipboardList;
            return (
              <li key={item.slug}>
                <Link href={item.href} className="group block h-full">
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-4"
                  >
                    <span
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                        hubToneClassForSlug(item.slug),
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                      {item.kind} · {item.stage}
                    </p>
                    <p className="mt-1 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {item.name}
                    </p>
                    {item.description ? (
                      <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                    <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                      {withSingleArrow("Download & use")}
                    </span>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
