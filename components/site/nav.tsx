"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import { primaryNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/8 bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-x flex h-18 items-center justify-between gap-6">
        <Logo priority />

        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            const children = "children" in item ? item.children : undefined;

            return (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors",
                    active ? "text-white" : "text-ink-300 hover:text-white",
                  )}
                >
                  {item.label}
                  {children ? (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  ) : null}
                </Link>

                {children ? (
                  <div className="invisible absolute top-full left-0 w-72 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="glass rounded-2xl p-2 shadow-2xl shadow-black/50">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/6"
                        >
                          <span className="block text-sm font-medium text-white">
                            {child.label}
                          </span>
                          <span className="block text-xs text-ink-400">{child.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/dashboard" variant="ghost" size="sm">
            Log in
          </ButtonLink>
          <ButtonLink href="/pricing" size="sm">
            Start free
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/8 bg-ink-950/98 backdrop-blur-xl lg:hidden">
          <div className="container-x flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto py-6">
            {primaryNav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-white hover:bg-white/5"
                >
                  {item.label}
                </Link>
                {"children" in item
                  ? item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl py-2 pr-3 pl-7 text-sm text-ink-300 hover:bg-white/5 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <ButtonLink href="/dashboard" variant="outline" size="md">
                Log in
              </ButtonLink>
              <ButtonLink href="/pricing" size="md">
                Start free
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
