"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Check, CircleHelp, Copy, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/cn";

type Listener = () => void;

const listenersByKey = new Map<string, Set<Listener>>();
const cacheByKey = new Map<string, { raw: string | null; value: unknown }>();

function emit(key: string) {
  const listeners = listenersByKey.get(key);
  if (!listeners) return;
  for (const listener of listeners) listener();
}

function subscribeKey(key: string, listener: Listener) {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  set.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set!.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readCachedJson<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  const cached = cacheByKey.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }
  let value: T = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cacheByKey.set(key, { raw, value });
  return value;
}

function writeCachedJson(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    /* ignore */
  }
  cacheByKey.set(key, { raw, value });
  emit(key);
}

const emptyObject = {} as Record<string, never>;

function getServerSnapshot() {
  return emptyObject;
}

export function InteractiveSelectionChecklist({
  storageKey,
  dimensions,
  className,
}: {
  storageKey: string;
  dimensions: Array<{ id: string; label: string; options: string[] }>;
  className?: string;
}) {
  const selected = useSyncExternalStore(
    (listener) => subscribeKey(storageKey, listener),
    () => readCachedJson<Record<string, string>>(storageKey, emptyObject),
    getServerSnapshot,
  ) as Record<string, string>;

  function pick(dimId: string, option: string) {
    writeCachedJson(storageKey, { ...selected, [dimId]: option });
  }

  const filled = Object.keys(selected).length;

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        {filled}/{dimensions.length} dimensions noted — saved in this browser
        only.
      </p>
      <ul className="space-y-4">
        {dimensions.map((dim) => (
          <li
            key={dim.id}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <p className="font-semibold text-[var(--sg-color-text)]">
              {dim.label}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dim.options.map((opt) => {
                const active = selected[dim.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pick(dim.id, opt)}
                    className={cn(
                      "cursor-pointer rounded-[var(--sg-radius-pill)] border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-white"
                        : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)]",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CopyableChecklist({
  title,
  items,
  className,
}: {
  title?: string;
  items: Array<{ id: string; label: string; description?: string }>;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(
    () =>
      items
        .map(
          (item, i) =>
            `${i + 1}. ${item.label}${item.description ? ` — ${item.description}` : ""}`,
        )
        .join("\n"),
    [items],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn(
        "sg-guide-card overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--sg-guide-card-border)] bg-[var(--sg-color-surface-muted)] px-5 py-4">
        {title ? (
          <h3 className="font-semibold text-[var(--sg-color-text)]">{title}</h3>
        ) : (
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
              <MessageSquareText className="size-4.5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">
                Bring these questions to every demo
              </p>
              <p className="text-xs text-[#64748b]">
                Ask vendors to show the workflow live, not just describe it.
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#bfdbfe] bg-white px-3 py-2 text-sm font-semibold text-[#2563eb] shadow-sm hover:bg-[#eff6ff]"
        >
          {copied ? (
            <Check className="size-4 text-[var(--sg-color-success)]" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy checklist"}
        </button>
      </div>
      <ul className="grid gap-px bg-[#e8eef5] sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-3 bg-white p-4">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-xs font-bold text-[#2563eb]">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                {item.label}
                <CircleHelp className="size-3.5 shrink-0 text-[#93c5fd]" aria-hidden />
              </span>
              {item.description ? (
                <span className="mt-1 block text-sm leading-relaxed text-[#64748b]">
                  {item.description}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InteractiveScorecard({
  storageKey,
  criteria,
  products,
  className,
}: {
  storageKey: string;
  criteria: Array<{ id: string; label: string; weight: number }>;
  products: Array<{ slug: string; name: string }>;
  className?: string;
}) {
  const scores = useSyncExternalStore(
    (listener) => subscribeKey(storageKey, listener),
    () => readCachedJson<Record<string, number>>(storageKey, emptyObject),
    getServerSnapshot,
  ) as Record<string, number>;

  function setScore(productSlug: string, criterionId: string, value: number) {
    const key = `${productSlug}:${criterionId}`;
    writeCachedJson(storageKey, { ...scores, [key]: value });
  }

  const totals = products.map((p) => {
    let weighted = 0;
    let max = 0;
    for (const c of criteria) {
      const v = scores[`${p.slug}:${c.id}`] ?? 0;
      weighted += v * c.weight;
      max += 5 * c.weight;
    }
    return {
      slug: p.slug,
      name: p.name,
      score: max > 0 ? Math.round((weighted / max) * 100) : 0,
    };
  });

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--sg-color-border)]">
            <th className="px-2 py-2 font-medium text-[var(--sg-color-text-muted)]">
              Criterion (weight)
            </th>
            {products.map((p) => (
              <th key={p.slug} className="px-2 py-2 font-semibold">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.id} className="border-b border-[var(--sg-color-border)]">
              <td className="px-2 py-2 text-[var(--sg-color-text-muted)]">
                {c.label}{" "}
                <span className="text-xs">×{c.weight}</span>
              </td>
              {products.map((p) => (
                <td key={p.slug} className="px-2 py-2">
                  <select
                    className="cursor-pointer rounded border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2 py-1"
                    value={scores[`${p.slug}:${c.id}`] ?? 0}
                    onChange={(e) =>
                      setScore(p.slug, c.id, Number(e.target.value))
                    }
                    aria-label={`${p.name} ${c.label} score`}
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="px-2 py-3 font-semibold">Weighted fit %</td>
            {totals.map((t) => (
              <td key={t.slug} className="px-2 py-3 font-semibold tabular-nums">
                {t.score}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
        Scores are yours — not SoftwareGlimpse rankings. Affiliate status never
        changes this scorecard.
      </p>
    </div>
  );
}
