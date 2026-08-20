import type { TCOCostCategory } from "@/domain";

export const TCO_CATEGORY_LABELS: Record<TCOCostCategory, string> = {
  software: "Software",
  implementation: "Implementation",
  migration: "Migration",
  integrations: "Integrations",
  training: "Training",
  administration: "Administration",
  support: "Support",
  addon: "Add-ons",
  custom: "Other",
};

/** Tailwind fill classes for stacked / driver bars. */
export const TCO_CATEGORY_BAR: Record<TCOCostCategory, string> = {
  software: "bg-[var(--sg-color-success)]",
  implementation: "bg-orange-400",
  migration: "bg-amber-500",
  integrations: "bg-sky-500",
  training: "bg-indigo-400",
  administration: "bg-[var(--sg-color-primary)]",
  support: "bg-teal-500",
  addon: "bg-lime-600",
  custom: "bg-[var(--sg-color-text-muted)]",
};

export const TCO_CATEGORY_ORDER: TCOCostCategory[] = [
  "software",
  "implementation",
  "migration",
  "integrations",
  "training",
  "administration",
  "support",
  "addon",
  "custom",
];
