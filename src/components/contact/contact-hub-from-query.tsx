"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ContactHub } from "@/components/contact/contact-hub";
import { parseContactReasonParam } from "@/services/contact/reasons";
import type { ContactReason } from "@/domain";

export function ContactHubFromQuery({
  allowed,
}: {
  allowed: readonly ContactReason[];
}) {
  const params = useSearchParams();
  const reason = useMemo(
    () => parseContactReasonParam(params.get("reason"), allowed),
    [params, allowed],
  );
  return <ContactHub key={reason} defaultReason={reason} />;
}
