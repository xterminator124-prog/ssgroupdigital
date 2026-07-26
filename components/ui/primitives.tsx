import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 " +
          "px-3 py-1 text-xs font-medium tracking-[0.18em] text-brand-200 uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 p-6 backdrop-blur-xl",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-white/16 hover:bg-ink-850/80",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 lg:py-28", className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-ink-300 lg:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

/** Soft radial glow used behind hero and CTA blocks. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <div className="absolute top-[-20%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px] animate-glow" />
      <div className="absolute top-[10%] right-[5%] h-[360px] w-[360px] rounded-full bg-accent-500/18 blur-[100px] animate-glow [animation-delay:2s]" />
      <div className="absolute bottom-[-10%] left-[8%] h-[320px] w-[420px] rounded-full bg-brand-400/12 blur-[110px] animate-glow [animation-delay:4s]" />
    </div>
  );
}
