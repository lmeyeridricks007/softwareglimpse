"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/forms";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  /** Current numeric value. `undefined` shows as empty when allowEmpty is true. */
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  /**
   * When true, empty input commits `undefined` instead of `min`.
   * When false (default), empty commits `min` (usually 0) but still displays blank for 0.
   */
  allowEmpty?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

/**
 * Number entry that does not force a visible "0" while typing.
 * Uses text + inputMode so browsers do not fight intermediate strings.
 */
export function RoiNumberInput({
  id,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder = "0",
  className,
  allowEmpty = false,
  ...aria
}: Props) {
  const focusedRef = useRef(false);

  function format(v: number | undefined): string {
    if (v == null) return "";
    if (!allowEmpty && v === 0) return "";
    return String(v);
  }

  const [text, setText] = useState(() => format(value));

  useEffect(() => {
    if (focusedRef.current) return;
    setText(format(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- format depends on allowEmpty which is stable per field
  }, [value, allowEmpty]);

  function normalize(n: number): number {
    let next = n;
    if (next < min) next = min;
    if (max != null && next > max) next = max;
    if (step > 0 && step < 1) {
      const decimals = String(step).split(".")[1]?.length ?? 0;
      const factor = 10 ** decimals;
      next = Math.round(next * factor) / factor;
    } else if (step >= 1) {
      next = Math.round(next);
    }
    return next;
  }

  function commit(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === ".") {
      setText("");
      onChange(allowEmpty ? undefined : min);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      setText(format(value));
      return;
    }
    const next = normalize(parsed);
    onChange(next);
    setText(format(next));
  }

  return (
    <Input
      id={id}
      type="text"
      inputMode={step < 1 ? "decimal" : "numeric"}
      placeholder={placeholder}
      value={text}
      className={cn("tabular-nums", className)}
      autoComplete="off"
      {...aria}
      onFocus={(e) => {
        focusedRef.current = true;
        e.target.select();
      }}
      onBlur={() => {
        focusedRef.current = false;
        commit(text);
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
        setText(raw);
        if (raw === "" || raw === ".") {
          if (allowEmpty) onChange(undefined);
          return;
        }
        const n = Number(raw);
        if (!Number.isFinite(n) || n < min) return;
        if (max != null && n > max) return;
        onChange(normalize(n));
      }}
    />
  );
}
