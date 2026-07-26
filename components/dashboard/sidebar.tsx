"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Disc3,
  LayoutDashboard,
  Menu,
  Plug,
  Settings,
  Wallet,
  X,
} from "lucide-react";

import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/releases", label: "Releases", icon: Disc3 },
  { href: "/dashboard/royalties", label: "Royalties", icon: Wallet },
  { href: "/dashboard/platforms", label: "Platforms", icon: Plug },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-brand-600/15 text-white ring-1 ring-brand-500/30"
                : "text-ink-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/8 bg-ink-950/90 px-4 backdrop-blur-xl lg:hidden">
        <Logo href="/dashboard" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-b border-white/8 bg-ink-950 p-4 lg:hidden">{links}</div>
      ) : null}

      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/8 bg-ink-950 p-5 lg:flex">
        <Logo href="/dashboard" priority />

        <div className="mt-8 flex-1">{links}</div>

        <div className="flex flex-col gap-1 border-t border-white/8 pt-4">
          <Link
            href="/dashboard/platforms"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4.5 w-4.5" />
            Settings
          </Link>

          <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/4 px-3 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-semibold text-white">
              AS
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">Aarav Sen</p>
              <p className="truncate text-[11px] text-ink-400">Artist plan</p>
            </div>
          </div>

          <Link
            href="/"
            className="mt-1 px-3 py-1.5 text-[11px] text-ink-400 transition-colors hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
