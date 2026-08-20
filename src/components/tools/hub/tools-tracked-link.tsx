"use client";

import Link from "next/link";
import { track } from "@/analytics/events";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  toolId?: string;
  toolType?: string;
  category?: string;
  sourceSection: string;
  event?:
    | "tool_card_click"
    | "tool_start"
    | "tool_filter"
    | "tool_category_click"
    | "tools_final_cta_click"
    | "cta_clicked";
};

export function ToolsTrackedLink({
  href,
  children,
  className,
  toolId,
  toolType,
  category,
  sourceSection,
  event = "tool_card_click",
}: Props) {
  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={() => {
        track({
          name: event,
          properties: {
            tool_id: toolId,
            tool_type: toolType,
            category,
            source_section: sourceSection,
          },
        });
      }}
    >
      {children}
    </Link>
  );
}
