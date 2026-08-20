import { GuideFaq } from "@/components/guides/guide-faq";
import type { CompareHubFaq } from "@/services/compare-hub";
import { cn } from "@/lib/cn";

type Props = {
  items: CompareHubFaq[];
  className?: string;
};

export function ComparisonFaq({ items, className }: Props) {
  if (items.length === 0) return null;
  return (
    <div className={cn(className)}>
      <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Comparison FAQ
      </h2>
      <GuideFaq items={items} />
    </div>
  );
}
