export function ToolSegmentLoading() {
  return (
    <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 py-16 sm:px-6">
      <p className="text-sm text-[var(--sg-color-text-muted)]" role="status">
        Loading tool…
      </p>
    </div>
  );
}

export default function Loading() {
  return <ToolSegmentLoading />;
}
