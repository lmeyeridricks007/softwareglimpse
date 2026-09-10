import { permanentRedirect } from "next/navigation";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export default function AffiliateDisclosureAliasPage() {
  permanentRedirect(LEGAL_ROUTES.affiliateDisclosure);
}
