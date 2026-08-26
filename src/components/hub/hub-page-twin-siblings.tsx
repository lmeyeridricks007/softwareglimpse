import Link from "next/link";
import {
  hubPageTwinSiblingsForPath,
  type HubPageTwinSibling,
} from "@/data/config/hub-page-twins";
import { cn } from "@/lib/cn";

type Props = {
  path: string;
  title?: string;
  className?: string;
};

function SiblingCard({ sibling }: { sibling: HubPageTwinSibling }) {
  return (
    <li>
      <Link
        href={sibling.href}
        className="group block rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]/40 hover:shadow-[var(--sg-shadow-md)]"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          {sibling.pageType.replace("-", " ")}
        </p>
        <p className="mt-1 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
          {sibling.label}
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          {sibling.intent}
        </p>
      </Link>
    </li>
  );
}

/**
 * Clarifies intent vs near-duplicate hub twins (pipeline, forecast, AI assistance).
 */
export function HubPageTwinSiblings({
  path,
  title = "Same topic, different page type",
  className,
}: Props) {
  const siblings = hubPageTwinSiblingsForPath(path);
  if (siblings.length === 0) return null;

  return (
    <section
      aria-labelledby="hub-page-twin-siblings-heading"
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-5 py-6 sm:px-6",
        className,
      )}
    >
      <h2
        id="hub-page-twin-siblings-heading"
        className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        These pages cover related CRM topics but serve different jobs — buyer
        workflow, capability evaluation, or feature evidence — not duplicate
        rankings.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {siblings.map((sibling) => (
          <SiblingCard key={sibling.href} sibling={sibling} />
        ))}
      </ul>
    </section>
  );
}
