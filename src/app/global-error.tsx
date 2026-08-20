"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error.digest ?? error.message);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-4 p-8 font-sans">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-neutral-600">
          Please try again. If the problem continues, contact us.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-teal-700 px-3 py-2 text-sm text-white"
          >
            Retry
          </button>
          <Link href="/" className="rounded-md border px-3 py-2 text-sm">
            Home
          </Link>
          <Link
            href="/company/contact/?reason=technical"
            className="rounded-md border px-3 py-2 text-sm"
          >
            Contact
          </Link>
        </div>
      </body>
    </html>
  );
}
