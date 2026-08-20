import Link from "next/link";

type Props = {
  name: string;
  href?: string;
  reason?: string;
  betterWhen?: string[];
  worseWhen?: string[];
  keyTradeoff?: string;
  provisional?: boolean;
};

export function AlternativeCard({
  name,
  href,
  reason,
  betterWhen = [],
  worseWhen = [],
  keyTradeoff,
  provisional = false,
}: Props) {
  const title = href ? (
    <Link href={href} className="underline-offset-2 hover:underline">
      {name}
    </Link>
  ) : (
    name
  );

  return (
    <article className="border-b border-[var(--color-border)] py-5 last:border-b-0">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
        {title}
      </h2>
      {provisional ? (
        <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
          Structured reasons pending research
        </p>
      ) : null}
      {reason ? (
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{reason}</p>
      ) : (
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Reason pending research
        </p>
      )}
      {betterWhen.length > 0 ? (
        <div className="mt-3">
          <h3 className="text-sm font-medium">Better when</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
            {betterWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {worseWhen.length > 0 ? (
        <div className="mt-3">
          <h3 className="text-sm font-medium">Worse when</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
            {worseWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {keyTradeoff ? (
        <p className="mt-3 text-sm">
          <span className="font-medium">Key tradeoff: </span>
          <span className="text-[var(--color-fg-muted)]">{keyTradeoff}</span>
        </p>
      ) : null}
    </article>
  );
}
