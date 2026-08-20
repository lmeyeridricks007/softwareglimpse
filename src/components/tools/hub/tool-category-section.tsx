import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ToolsTrackedLink } from "@/components/tools/hub/tools-tracked-link";
import type { ToolsHubCategoryGroup } from "@/services/tools-hub";

type Props = {
  groups: ToolsHubCategoryGroup[];
};

export function ToolCategorySection({ groups }: Props) {
  if (groups.length === 0) return null;

  return (
    <Section padding="md" background="muted" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        Tools by software category
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Categories appear here automatically as tools are added for them.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <li
            key={group.categorySlug}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-[var(--sg-color-text)]">
                {group.categoryName}
              </h3>
              <Badge variant="neutral">
                {group.toolCount} {group.toolCount === 1 ? "tool" : "tools"}
              </Badge>
            </div>
            <ul className="mt-3 space-y-1.5">
              {group.tools.map((tool) => (
                <li key={tool.id} className="text-sm text-[var(--sg-color-text-muted)]">
                  {tool.href ? (
                    <ToolsTrackedLink
                      href={tool.href}
                      toolId={tool.id}
                      category={group.categorySlug}
                      sourceSection="category_tools"
                      event="tool_category_click"
                      className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                    >
                      {tool.name}
                    </ToolsTrackedLink>
                  ) : (
                    tool.name
                  )}
                </li>
              ))}
            </ul>
            <ToolsTrackedLink
              href="#explore-tools"
              category={group.categorySlug}
              sourceSection="category_tools"
              event="tool_category_click"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]"
            >
              Explore {group.categoryName} tools
              <ArrowRight className="size-4" aria-hidden />
            </ToolsTrackedLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
