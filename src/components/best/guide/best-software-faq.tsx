import { CategoryFAQ } from "@/components/category/category-faq";
import type { BestPageModel } from "@/services/best-page";

type Props = {
  items: BestPageModel["faq"];
  className?: string;
};

export function BestSoftwareFaq({ items, className }: Props) {
  if (items.length === 0) return null;
  return <CategoryFAQ items={items} className={className} />;
}
