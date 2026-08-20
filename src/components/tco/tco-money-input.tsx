"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

type Props = {
  id: string;
  label: string;
  valueMajor: number | null | undefined;
  currency?: string;
  onChange: (valueMajor: number | null | undefined) => void;
  /** When true, empty field means explicitly unknown (null). */
  allowUnknown?: boolean;
  hint?: string;
  className?: string;
  /** Wider field by default for step layouts. */
  fullWidth?: boolean;
};

function currencySymbol(currency: string): string {
  if (currency === "EUR") return "€";
  if (currency === "USD") return "$";
  if (currency === "GBP") return "£";
  return currency;
}

function formatDisplay(valueMajor: number | null | undefined): string {
  if (valueMajor === null || valueMajor === undefined) return "";
  // Keep explicit 0 visible only after the user typed it; blank is easier to edit.
  if (valueMajor === 0) return "";
  return String(valueMajor);
}

/**
 * Currency major-unit input. Empty + allowUnknown → null (unknown, not €0).
 * Uses text entry (not type=number) so values are easy to clear and retype.
 */
export function TcoMoneyInput({
  id,
  label,
  valueMajor,
  currency = "EUR",
  onChange,
  allowUnknown = true,
  hint,
  className,
  fullWidth = true,
}: Props) {
  const focusedRef = useRef(false);
  const [text, setText] = useState(() => formatDisplay(valueMajor));
  const currencyLabel = currencySymbol(currency);

  useEffect(() => {
    if (focusedRef.current) return;
    setText(formatDisplay(valueMajor));
  }, [valueMajor]);

  function emptyValue(): null | undefined {
    return allowUnknown ? null : undefined;
  }

  function commit(raw: string) {
    const trimmed = raw.trim().replace(/,/g, "");
    if (trimmed === "" || trimmed === ".") {
      setText("");
      onChange(emptyValue());
      return;
    }
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n < 0) {
      setText(formatDisplay(valueMajor));
      return;
    }
    onChange(n);
    setText(n === 0 ? "" : String(n));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--sg-color-text)]"
        >
          {label}
        </label>
        {allowUnknown && valueMajor === null ? (
          <Badge variant="neutral">Unknown</Badge>
        ) : valueMajor != null ? (
          <Badge variant="warning">Your estimate</Badge>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-[var(--sg-color-text-muted)]">
          {hint}
        </p>
      ) : null}
      <div
        className={cn(
          "flex min-h-12 items-stretch overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] focus-within:border-[var(--sg-color-primary)] focus-within:ring-2 focus-within:ring-[var(--sg-color-primary)]/20",
          fullWidth ? "w-full" : "max-w-[14rem]",
        )}
      >
        <span className="flex items-center bg-[var(--sg-color-surface-muted)]/80 px-3 text-sm font-semibold text-[var(--sg-color-text-muted)]">
          {currencyLabel}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          aria-describedby={hint ? `${id}-hint` : undefined}
          placeholder={allowUnknown ? "Leave blank if unknown" : "0"}
          onFocus={(e) => {
            focusedRef.current = true;
            e.target.select();
          }}
          onBlur={() => {
            focusedRef.current = false;
            commit(text);
          }}
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, "");
            if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
            setText(raw);
            if (raw === "" || raw === ".") {
              onChange(emptyValue());
              return;
            }
            const n = Number(raw);
            if (!Number.isFinite(n) || n < 0) return;
            onChange(n);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm tabular-nums text-[var(--sg-color-text)] outline-none"
        />
      </div>
      {allowUnknown && valueMajor === null ? (
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          Marked unknown — not counted as {currencyLabel}0.
        </p>
      ) : null}
    </div>
  );
}
