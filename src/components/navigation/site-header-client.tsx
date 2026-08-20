"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/navigation/logo";
import { GlobalSearchField } from "@/components/search/global-search-field";
import { ButtonLink } from "@/components/ui/button";

export type NavChild = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
  allLabel?: string;
};

function NavDropdown({
  item,
  open,
  onToggle,
  onClose,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const children = item.children ?? [];
  if (children.length === 0) {
    return (
      <Link
        href={item.href}
        className="rounded-[var(--sg-radius-md)] px-3 py-2 text-sm font-medium text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-[var(--sg-radius-md)] px-3 py-2 text-sm font-medium text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {item.label}
        <ChevronDown className="size-4" aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 max-h-[min(70vh,28rem)] min-w-56 overflow-y-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-2 shadow-[var(--sg-shadow-md)]"
        >
          {children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              role="menuitem"
              onClick={onClose}
              className="block rounded-[var(--sg-radius-sm)] px-3 py-2 text-sm text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href={item.href}
            role="menuitem"
            onClick={onClose}
            className="mt-1 block rounded-[var(--sg-radius-sm)] px-3 py-2 text-sm font-medium text-[var(--sg-color-primary)]"
          >
            {item.allLabel ?? `All ${item.label.toLowerCase()}`}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function MobileNavSection({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const children = item.children ?? [];

  if (children.length === 0) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="rounded-[var(--sg-radius-md)] px-3 py-2.5 text-sm font-medium"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-[var(--sg-radius-md)] px-3 py-2.5 text-sm font-medium"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {item.label}
        <ChevronDown
          className={`size-4 text-[var(--sg-color-text-muted)] transition ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {expanded ? (
        <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-[var(--sg-color-border)] pl-2">
          {children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              onClick={onNavigate}
              className="rounded-[var(--sg-radius-md)] px-3 py-2 text-sm text-[var(--sg-color-text-muted)]"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href={item.href}
            onClick={onNavigate}
            className="rounded-[var(--sg-radius-md)] px-3 py-2 text-sm font-medium text-[var(--sg-color-primary)]"
          >
            {item.allLabel ?? `All ${item.label.toLowerCase()}`}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeaderClient({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const panelId = useId();
  const navRef = useRef<HTMLElement>(null);

  function closeMenus() {
    setOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    if (!openMenu) return;

    function onPointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[var(--sg-container-wide)] items-center gap-3 px-4 sm:px-6">
        <Logo />

        <nav
          ref={navRef}
          aria-label="Primary"
          className="ml-1 hidden items-center gap-0.5 lg:flex"
        >
          {navItems.map((item) => (
            <NavDropdown
              key={item.href}
              item={item}
              open={openMenu === item.href}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === item.href ? null : item.href,
                )
              }
              onClose={closeMenus}
            />
          ))}
        </nav>

        <div className="ml-auto hidden min-w-0 max-w-xs flex-1 md:block">
          <GlobalSearchField id="global-search" />
        </div>

        <ButtonLink
          href="/tools/software-finder/"
          variant="primary"
          size="sm"
          className="ml-2 hidden sm:inline-flex"
        >
          Find Software
        </ButtonLink>

        <button
          type="button"
          className="ml-auto inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] lg:hidden md:ml-2"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {open ? (
        <div
          id={panelId}
          className="border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4 lg:hidden"
        >
          <div className="mb-4">
            <GlobalSearchField id="mobile-global-search" />
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <MobileNavSection
                key={item.href}
                item={item}
                onNavigate={closeMenus}
              />
            ))}
            <ButtonLink href="/tools/software-finder/" className="mt-3" size="md">
              Find Software
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
