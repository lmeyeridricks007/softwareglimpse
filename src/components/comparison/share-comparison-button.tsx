"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareComparisonButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0"
      onClick={async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* user cancelled share */
        }
      }}
    >
      {copied ? (
        <>
          <Check className="size-4" aria-hidden />
          Link copied
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden />
          Share this comparison
        </>
      )}
    </Button>
  );
}
