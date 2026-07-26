import Image from "next/image";
import Link from "next/link";

import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Brand mark only — the circular G/S device.
 *
 * Two cuts of the same mark:
 *
 * - `simple` (default) drops the "GROUP DIGITAL" micro-text band, which turns
 *   into an illegible smudge below ~48px. Use for navbars, sidebars, favicons —
 *   anywhere the mark renders small. This is standard responsive-logo practice.
 * - `full` is the artwork exactly as supplied, text band included. Use at 96px
 *   and above, where the text is actually readable.
 *
 * Both are monochrome PNGs with transparency, so pick the variant that suits
 * the surface: `white` on dark, `black` on light. The site is dark-first.
 */
export function Mark({
  size = 36,
  variant = "white",
  detail = "simple",
  className,
  priority = false,
}: {
  size?: number;
  variant?: "white" | "black";
  detail?: "simple" | "full";
  className?: string;
  priority?: boolean;
}) {
  const src = detail === "simple" ? `/mark-simple-${variant}.png` : `/mark-${variant}.png`;

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      priority={priority}
      quality={90}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

/**
 * Full lockup (mark + stacked wordmark) as supplied. Use where there is real
 * estate — OG images, print, the footer on wide screens. Too dense for a
 * 40px-tall navbar, which is why `Logo` composes the mark with live text
 * instead.
 */
export function LogoLockup({
  width = 220,
  variant = "white",
  className,
}: {
  width?: number;
  variant?: "white" | "black";
  className?: string;
}) {
  return (
    <Image
      src={`/logo-${variant}.png`}
      alt={site.name}
      width={width}
      height={Math.round((width * 560) / 1200)}
      quality={90}
      className={cn("object-contain", className)}
    />
  );
}

/**
 * Primary navigation logo: brand mark + typeset wordmark.
 *
 * The wordmark is live text rather than an image so it stays crisp at every
 * size, scales with the user's font settings, and is selectable/searchable.
 */
export function Logo({
  className,
  href = "/",
  showTagline = true,
  size = 36,
  variant = "white",
  priority = false,
}: {
  className?: string;
  href?: string;
  showTagline?: boolean;
  size?: number;
  variant?: "white" | "black";
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${site.name} home`}
    >
      <Mark
        size={size}
        variant={variant}
        priority={priority}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-medium tracking-tight lowercase",
            variant === "white" ? "text-white" : "text-ink-950",
          )}
        >
          ss group digital
        </span>
        {showTagline ? (
          <span className="mt-1 text-[10px] tracking-[0.2em] text-ink-400 uppercase">
            Distribution &amp; Analytics
          </span>
        ) : null}
      </span>
    </Link>
  );
}
