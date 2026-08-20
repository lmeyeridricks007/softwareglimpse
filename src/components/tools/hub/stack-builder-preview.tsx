import type { ToolsHubStackSlot } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

type Props = {
  slots: ToolsHubStackSlot[];
  className?: string;
};

export function StackBuilderPreview({ slots, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-violet-200/80 bg-violet-50/50 p-3",
        className,
      )}
      aria-hidden
    >
      <ul className="space-y-2">
        {slots.map((slot) => (
          <li
            key={slot.categoryLabel}
            className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-sm)] border border-violet-200/70 bg-white px-2.5 py-2 text-xs"
          >
            <span className="font-medium text-[var(--sg-color-text-muted)]">
              {slot.categoryLabel}
            </span>
            {slot.value ? (
              <span className="rounded-[var(--sg-radius-pill)] bg-violet-100 px-2.5 py-0.5 font-semibold text-violet-800">
                {slot.value}
              </span>
            ) : (
              <span className="rounded-[var(--sg-radius-pill)] border border-dashed border-violet-300 px-2.5 py-0.5 font-medium text-violet-600">
                {slot.placeholder}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
