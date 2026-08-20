import { GuideFaq, type GuideFaqItem } from "@/components/guides/guide-faq";
import { cn } from "@/lib/cn";

type Props = {
  items: GuideFaqItem[];
  className?: string;
};

export function CategoryFAQ({ items, className }: Props) {
  if (items.length === 0) return null;
  return (
    <div className={cn("scroll-mt-28", className)}>
      <GuideFaq items={items} />
    </div>
  );
}
