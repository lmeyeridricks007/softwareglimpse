import { Badge } from "@/components/ui/badge";
import type { TCOCostSourceType } from "@/domain";

const CONFIG: Record<
  TCOCostSourceType,
  { label: string; variant: "success" | "warning" | "primary" | "neutral" }
> = {
  researched: { label: "Verified", variant: "success" },
  "user-input": { label: "Your estimate", variant: "warning" },
  calculated: { label: "Calculated", variant: "primary" },
  unknown: { label: "Unknown", variant: "neutral" },
};

type Props = {
  sourceType: TCOCostSourceType;
  className?: string;
};

/** Consistent cost-source badge — never rely on colour alone (label is text). */
export function TcoSourceBadge({ sourceType, className }: Props) {
  const cfg = CONFIG[sourceType];
  return (
    <Badge variant={cfg.variant} className={className}>
      {cfg.label}
    </Badge>
  );
}
