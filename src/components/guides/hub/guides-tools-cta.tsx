import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import type { GuidesHubTool } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  tools: GuidesHubTool[];
  className?: string;
};

export function GuidesToolsCta({ tools, className }: Props) {
  if (tools.length === 0) return null;

  return (
    <Section
      padding="md"
      background="tint"
      container="wide"
      className={className}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight text-[var(--sg-color-navy)]">
            Don&apos;t want to research everything yourself?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
            Use SoftwareGlimpse interactive tools to turn your requirements into
            a shortlist, estimate costs and compare your options.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/tools/" size="lg">
              Explore decision tools
            </ButtonLink>
            <ButtonLink href="/tools/crm-finder/" variant="outline" size="lg">
              Find my software
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.id}>
              <Link
                href={tool.href}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] transition hover:shadow-[var(--sg-shadow-md)]"
              >
                <div className="border-b border-[var(--sg-color-border)] bg-[linear-gradient(180deg,#eff6ff,#fff)] p-3">
                  <ToolPreview kind={tool.preview} />
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="text-sm font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {tool.title}
                  </h3>
                  <p className="mt-1 flex-1 text-xs text-[var(--sg-color-text-muted)]">
                    {tool.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--sg-color-primary)]">
                    Open
                    <ArrowRight
                      className="size-3 transition-transform motion-safe:group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function ToolPreview({ kind }: { kind: GuidesHubTool["preview"] }) {
  if (kind === "finder") {
    return (
      <div className="space-y-1.5" aria-hidden>
        {["Team size", "Integrations", "Budget"].map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-md border border-[var(--sg-color-border)] bg-white px-2 py-1.5"
          >
            <span
              className={cn(
                "size-3 rounded border",
                i === 0
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)]"
                  : "border-[var(--sg-color-border-strong)]",
              )}
            />
            <span className="text-[10px] text-[var(--sg-color-text-muted)]">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (kind === "calculator") {
    return (
      <div className="space-y-2" aria-hidden>
        <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Team size
        </p>
        <div className="h-1.5 rounded-full bg-[var(--sg-color-border)]">
          <div className="h-full w-2/3 rounded-full bg-[var(--sg-color-primary)]" />
        </div>
        <div className="rounded-md border border-[var(--sg-color-border)] bg-white px-2.5 py-2">
          <p className="text-[9px] text-[var(--sg-color-text-muted)]">
            Estimated cost
          </p>
          <p className="text-sm font-semibold tabular-nums text-[var(--sg-color-navy)]">
            From list prices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5" aria-hidden>
      {["CRM", "Email", "Support"].map((label) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-md border border-[var(--sg-color-border)] bg-white px-2 py-1.5"
        >
          <span className="text-[10px] font-medium text-[var(--sg-color-text)]">
            {label}
          </span>
          <span className="text-[9px] font-semibold text-[var(--sg-color-primary)]">
            + Add
          </span>
        </div>
      ))}
    </div>
  );
}
