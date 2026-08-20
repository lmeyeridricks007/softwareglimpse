import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ToolIcon } from "@/components/tools/hub/tool-icon";
import { ToolsTrackedLink } from "@/components/tools/hub/tools-tracked-link";
import type { ToolsHubIntent } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

type Props = {
  intents: ToolsHubIntent[];
  className?: string;
};

export function ToolIntentGrid({ intents, className }: Props) {
  return (
    <Section
      id="choose-intent"
      padding="md"
      background="muted"
      container="wide"
      className={className}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        What do you want help with?
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {intents.map((intent) => (
          <li key={intent.id}>
            <ToolsTrackedLink
              href={intent.href}
              sourceSection="intent_grid"
              toolType={intent.id}
              event="tool_start"
              className={cn(
                "group flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)] hover:shadow-[var(--sg-shadow-md)]",
              )}
            >
              <ToolIcon icon={intent.icon} tone={intent.tone} />
              <h3 className="mt-4 text-base font-semibold text-[var(--sg-color-text)]">
                {intent.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {intent.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                {intent.cta}
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
