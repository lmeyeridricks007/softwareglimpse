import {
  Bot,
  Headphones,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  Radar,
  Server,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { hubToneClassForSlug } from "@/components/category/hub-icons";
import {
  GUIDE_ICON_TONE_CLASSES,
  type GuideIconToneKey,
} from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  crm: UsersRound,
  "sales-intelligence": Radar,
  "business-communications": MessageSquare,
  "customer-service": Headphones,
  marketing: Megaphone,
  "email-marketing": Megaphone,
  "project-management": LayoutGrid,
  hr: Users,
  ai: Sparkles,
  "it-development": Server,
  ecommerce: ShoppingBag,
  productivity: Target,
};

/** Intentional pastel tones aligned with category-hub / Best mockups. */
const CATEGORY_TONES: Record<string, GuideIconToneKey> = {
  crm: "emerald",
  "sales-intelligence": "sky",
  "project-management": "violet",
  marketing: "fuchsia",
  "email-marketing": "fuchsia",
  "customer-service": "blue",
  hr: "amber",
  "business-communications": "orange",
  ai: "violet",
  "it-development": "teal",
  ecommerce: "orange",
  productivity: "teal",
};

export function categoryToneClass(categoryId: string): string {
  const key = CATEGORY_TONES[categoryId];
  if (key) return GUIDE_ICON_TONE_CLASSES[key];
  return hubToneClassForSlug(categoryId);
}

export function CategoryIcon({
  categoryId,
  className,
  size = "md",
}: {
  /** Category slug (e.g. `crm`). */
  categoryId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = CATEGORY_ICONS[categoryId] ?? Bot;
  const sizeClass =
    size === "sm" ? "size-9" : size === "lg" ? "size-14" : "size-11";
  const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--sg-radius-md)] border",
        sizeClass,
        categoryToneClass(categoryId),
        className,
      )}
      aria-hidden
    >
      <Icon className={iconSize} />
    </span>
  );
}
