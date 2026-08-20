import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CheckCircle2,
  Link2,
  Megaphone,
  MessageSquare,
  Shield,
  Wrench,
} from "lucide-react";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type {
  ContactIconKey,
  ContactIconTone,
} from "@/services/contact/reasons";
import { cn } from "@/lib/cn";

export const CONTACT_ICON_MAP: Record<ContactIconKey, LucideIcon> = {
  check: CheckCircle2,
  message: MessageSquare,
  building: Building2,
  link: Link2,
  megaphone: Megaphone,
  shield: Shield,
  wrench: Wrench,
};

const TONE_TO_GUIDE: Record<
  ContactIconTone,
  keyof typeof GUIDE_ICON_TONE_CLASSES
> = {
  emerald: "emerald",
  blue: "blue",
  violet: "violet",
  amber: "amber",
  orange: "orange",
  teal: "teal",
  rose: "fuchsia",
};

export function ContactIconChip({
  iconKey,
  tone,
  className,
  size = "md",
}: {
  iconKey: ContactIconKey;
  tone: ContactIconTone;
  className?: string;
  size?: "sm" | "md";
}) {
  const Icon = CONTACT_ICON_MAP[iconKey];
  return (
    <span
      className={cn(
        "sg-guide-icon-chip inline-flex shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
        size === "sm" ? "size-9" : "size-11",
        GUIDE_ICON_TONE_CLASSES[TONE_TO_GUIDE[tone]],
        className,
      )}
      aria-hidden
    >
      <Icon className={size === "sm" ? "size-4" : "size-5"} />
    </span>
  );
}
