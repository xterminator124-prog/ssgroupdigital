import Link from "next/link";
import { Instagram, Linkedin, Youtube } from "lucide-react";

import { LogoLockup } from "@/components/site/logo";
import { footerNav, site } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-ink-950">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label={`${site.name} home`} className="inline-block">
              <LogoLockup width={200} className="h-auto w-[200px]" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-400">
              {site.description}
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, href: site.social.instagram, label: "Instagram" },
                { Icon: Youtube, href: site.social.youtube, label: "YouTube" },
                { Icon: Linkedin, href: site.social.linkedin, label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-ink-300 transition-colors hover:border-white/25 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold tracking-[0.16em] text-white uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400" />
            All systems operational · India &amp; worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
