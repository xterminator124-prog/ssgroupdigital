import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn, formatCompact, formatPercent } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-ink-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/8 bg-ink-900/50 p-5 backdrop-blur-sm lg:p-6",
        className,
      )}
    >
      {title ? (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  changePct,
  hint,
  accent,
}: {
  label: string;
  value: number | string;
  changePct?: number | null;
  hint?: string;
  accent?: string;
}) {
  const up = (changePct ?? 0) >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-ink-900/50 p-5">
      {accent ? (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      ) : null}

      <p className="text-xs tracking-[0.1em] text-ink-400 uppercase">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-white lg:text-3xl">
        {typeof value === "number" ? formatCompact(value) : value}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {changePct !== undefined && changePct !== null ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
              up ? "bg-signal-400/12 text-signal-400" : "bg-red-400/12 text-red-400",
            )}
          >
            {up ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {formatPercent(changePct)}
          </span>
        ) : null}
        {hint ? <span className="text-[11px] text-ink-400">{hint}</span> : null}
      </div>
    </div>
  );
}

/** Marks where a number came from. Non-negotiable for trust. */
export function SourceNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 flex items-start gap-2 border-t border-white/6 pt-3 text-[11px] leading-relaxed text-ink-400">
      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink-600" />
      {children}
    </p>
  );
}
