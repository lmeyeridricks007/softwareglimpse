import { permanentRedirect } from "next/navigation";
import { COMPANY_ROUTES } from "@/services/site-foundation";

export default function AboutAliasPage() {
  permanentRedirect(COMPANY_ROUTES.about);
}
