"use client";

import { track } from "@/analytics/events";
import { ButtonLink } from "@/components/ui/button";

type Props = React.ComponentProps<typeof ButtonLink> & {
  toolId?: string;
  toolType?: string;
  category?: string;
  sourceSection: string;
  event?:
    | "tool_card_click"
    | "tool_start"
    | "tools_final_cta_click"
    | "cta_clicked";
};

export function ToolsTrackedButtonLink({
  toolId,
  toolType,
  category,
  sourceSection,
  event = "tool_start",
  onClick,
  ...props
}: Props) {
  return (
    <ButtonLink
      {...props}
      onClick={(e) => {
        track({
          name: event,
          properties: {
            tool_id: toolId,
            tool_type: toolType,
            category,
            source_section: sourceSection,
          },
        });
        onClick?.(e);
      }}
    />
  );
}
