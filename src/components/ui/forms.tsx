import { Children, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/cn";

const fieldClass =
  "w-full min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5 text-sm text-[var(--sg-color-text)] placeholder:text-[var(--sg-color-text-muted)] transition-colors focus-visible:border-[var(--sg-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]/25 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--sg-color-danger)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--sg-color-danger)]/20";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        fieldClass,
        type === "search" && "cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-32 py-3", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const hintId = htmlFor && hint ? `${htmlFor}-hint` : undefined;
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = Children.map(children, (child) => {
    if (!isValidElement<{
      "aria-describedby"?: string;
      "aria-invalid"?: boolean | "true" | "false";
      "aria-required"?: boolean | "true" | "false";
    }>(child)) {
      return child;
    }
    return cloneElement(child, {
      "aria-describedby":
        [child.props["aria-describedby"], describedBy]
          .filter(Boolean)
          .join(" ") || undefined,
      "aria-invalid": error ? true : child.props["aria-invalid"],
      "aria-required": required || child.props["aria-required"],
    });
  });

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[var(--sg-text-label)] font-medium text-[var(--sg-color-text)]"
      >
        {label}
        {required ? (
          <span className="text-[var(--sg-color-danger)]" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {control}
      {hint && !error && hintId ? (
        <p
          id={hintId}
          className="text-[var(--sg-text-caption)] text-[var(--sg-color-text-muted)]"
        >
          {hint}
        </p>
      ) : null}
      {hint && !error && !hintId ? (
        <p className="text-[var(--sg-text-caption)] text-[var(--sg-color-text-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-[var(--sg-text-caption)] text-[var(--sg-color-danger)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
