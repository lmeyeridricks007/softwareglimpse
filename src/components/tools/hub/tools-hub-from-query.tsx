"use client";

import { useSearchParams } from "next/navigation";
import { ToolsHubView } from "@/components/tools/hub/tools-hub-view";
import type { ToolsHubModel } from "@/services/tools-hub";

export type ToolsCategoryVariant = Pick<
  ToolsHubModel,
  | "hero"
  | "activeCategory"
  | "intents"
  | "featuredTools"
  | "comingSoonTools"
  | "researchPaths"
  | "directory"
  | "primaryFinder"
  | "decisionPreview"
  | "calculatorPreview"
  | "stackSlots"
>;

type Props = {
  base: ToolsHubModel;
  variants: Record<string, ToolsCategoryVariant>;
  categoryOptions: Array<{ slug: string; name: string }>;
  newsletterEnabled: boolean;
};

export function ToolsHubFromQuery({
  base,
  variants,
  categoryOptions,
  newsletterEnabled,
}: Props) {
  const params = useSearchParams();
  const raw = params.get("category");
  const variant = raw ? variants[raw] : undefined;
  const model: ToolsHubModel = variant
    ? {
        ...base,
        ...variant,
      }
    : base;

  return (
    <ToolsHubView
      model={model}
      categoryOptions={categoryOptions}
      newsletterEnabled={newsletterEnabled}
      categorySlug={variant ? raw : null}
    />
  );
}
