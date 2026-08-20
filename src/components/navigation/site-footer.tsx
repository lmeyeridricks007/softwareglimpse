import Link from "next/link";
import { Logo } from "@/components/navigation/logo";
import { CookieSettingsButton } from "@/components/site/cookie-settings-button";
import { NewsletterSignupForm } from "@/components/site/newsletter-signup";
import { getTopLevelCategories } from "@/data/repositories/categories";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
} from "@/services/site-foundation/config";

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]"
      >
        {label}
      </Link>
    </li>
  );
}

export function SiteFooter() {
  const categories = getTopLevelCategories().slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
      <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Logo variant="footer" />
            <p className="mt-3 max-w-xs text-sm text-[var(--sg-color-text-muted)]">
              Which software should I choose? Structured research, comparisons,
              and decision tools — rankings ignore affiliate commissions.
            </p>
            <div className="mt-5 max-w-sm">
              <p className="text-sm font-semibold">Newsletter</p>
              <div className="mt-2">
                <NewsletterSignupForm
                  source="footer"
                  placement="site-footer"
                  compact
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Explore</h2>
            <ul className="mt-3 space-y-2">
              <FooterLink href="/software/" label="Software" />
              <FooterLink href="/best/" label="Best Software" />
              <FooterLink href="/compare/" label="Comparisons" />
              <FooterLink href="/tools/" label="Tools" />
              <FooterLink href="/guides/" label="Guides" />
              <FooterLink href="/use-cases/" label="Use Cases" />
              <FooterLink href="/resources/" label="Resources" />
              <FooterLink href="/industries/" label="Industries" />
              <FooterLink href="/search/" label="Search" />
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Popular Categories</h2>
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <FooterLink
                  key={c.id}
                  href={`/categories/${c.path.join("/")}/`}
                  label={c.name}
                />
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Company</h2>
            <ul className="mt-3 space-y-2">
              <FooterLink href={COMPANY_ROUTES.about} label="About" />
              <FooterLink href={COMPANY_ROUTES.myStory} label="My Story" />
              <FooterLink
                href={COMPANY_ROUTES.methodology}
                label="Methodology"
              />
              <FooterLink
                href={COMPANY_ROUTES.howWeReview}
                label="How We Review"
              />
              <FooterLink href={COMPANY_ROUTES.contact} label="Contact" />
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Legal</h2>
            <ul className="mt-3 space-y-2">
              <FooterLink
                href={LEGAL_ROUTES.affiliateDisclosure}
                label="Affiliate Disclosure"
              />
              <FooterLink href={LEGAL_ROUTES.privacy} label="Privacy" />
              <FooterLink href={LEGAL_ROUTES.cookies} label="Cookies" />
              <FooterLink href={LEGAL_ROUTES.terms} label="Terms" />
              <FooterLink
                href={LEGAL_ROUTES.accessibility}
                label="Accessibility"
              />
              <li>
                <CookieSettingsButton className="text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-text)] hover:underline" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--sg-color-border)] pt-6 text-sm text-[var(--sg-color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SoftwareGlimpse</p>
          <p>
            Some links may be affiliate links. Rankings are never based on
            commission.{" "}
            <Link
              href={LEGAL_ROUTES.affiliateDisclosure}
              className="underline underline-offset-2"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
