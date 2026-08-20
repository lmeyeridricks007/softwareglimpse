import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ToolsTrackedLink } from "@/components/tools/hub/tools-tracked-link";
import type { ToolsHubResearchPath } from "@/services/tools-hub";

type Props = {
  paths: ToolsHubResearchPath[];
};

export function ToolResearchPaths({ paths }: Props) {
  return (
    <Section padding="md" background="muted" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        Research your recommendations
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Tools are the start — continue with reviews, comparisons and rankings.
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {paths.map((path) => (
          <li key={path.id}>
            <ToolsTrackedLink
              href={path.href}
              sourceSection="research_paths"
              toolType={path.id}
              event="cta_clicked"
              className="group flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sg-color-primary)]">
                {path.eyebrow}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--sg-color-text)]">
                {path.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {path.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                {path.cta}
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </ToolsTrackedLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
