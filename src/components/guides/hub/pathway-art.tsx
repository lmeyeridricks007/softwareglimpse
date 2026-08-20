/** Mini UI previews for research pathway cards. */

export function ReviewsArtMini() {
  return (
    <div className="space-y-1.5" aria-hidden>
      {[1, 0.75, 0.9].map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-4 rounded border border-[var(--sg-color-border)] bg-white" />
          <span
            className="h-2 rounded bg-[var(--sg-color-border)]"
            style={{ width: `${w * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function CompareArtMini() {
  return (
    <div className="grid grid-cols-3 gap-1.5" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex h-7 items-center justify-center rounded border border-[var(--sg-color-border)] bg-white text-[10px] text-[var(--sg-color-success)]"
        >
          {i % 3 !== 2 ? "✓" : "–"}
        </div>
      ))}
    </div>
  );
}

export function TrophyArtMini() {
  return (
    <div className="flex items-end justify-center gap-2 pt-1" aria-hidden>
      {[40, 64, 48].map((h, i) => (
        <div
          key={i}
          className="w-8 rounded-t-md bg-[var(--sg-color-primary-soft)]"
          style={{ height: h }}
        >
          <div
            className="mx-auto mt-1 flex size-5 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-[10px] font-bold text-white"
            style={{ opacity: i === 1 ? 1 : 0.55 }}
          >
            {i === 1 ? "1" : i === 0 ? "2" : "3"}
          </div>
        </div>
      ))}
    </div>
  );
}
