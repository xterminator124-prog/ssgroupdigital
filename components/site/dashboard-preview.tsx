import { ArrowUpRight } from "lucide-react";

import { formatCompact } from "@/lib/utils";

/**
 * Static hero visual — a stylised version of the real dashboard.
 * Deliberately hand-drawn in SVG rather than a screenshot so it stays crisp,
 * themeable, and weighs ~2KB instead of 400KB.
 */

const SERIES = [
  18, 22, 20, 27, 25, 31, 29, 36, 34, 41, 38, 46, 44, 52, 49, 58, 55, 64, 61, 71, 68,
  79, 76, 88, 84, 96, 92, 105,
];

const PLATFORMS = [
  { name: "Spotify", value: 1_284_000, change: "+18.2%", color: "#1DB954" },
  { name: "YouTube", value: 942_000, change: "+24.6%", color: "#FF0033" },
  { name: "Instagram", value: 511_000, change: "+9.1%", color: "#E1306C" },
  { name: "TikTok", value: 389_000, change: "+41.3%", color: "#25F4EE" },
];

function Sparkline() {
  const w = 620;
  const h = 170;
  const max = Math.max(...SERIES);
  const min = Math.min(...SERIES);
  const step = w / (SERIES.length - 1);

  const points = SERIES.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / (max - min)) * (h - 16) - 8;
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ssgd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.42" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ssgd-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-brand-400)" />
          <stop offset="100%" stopColor="var(--color-accent-400)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ssgd-area)" />
      <path
        d={line}
        fill="none"
        stroke="url(#ssgd-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-600/25 via-transparent to-accent-500/20 blur-2xl"
      />

      <div className="glass overflow-hidden rounded-3xl shadow-2xl shadow-black/60">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-ink-400">
            ssgroupdigital.com/dashboard
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.16em] text-ink-400 uppercase">
                Total streams · 28 days
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold text-white sm:text-4xl">
                3.12M
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-signal-400/12 px-2.5 py-1 text-xs font-medium text-signal-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              22.4%
            </span>
          </div>

          <div className="mt-5 h-32 sm:h-40">
            <Sparkline />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="rounded-xl border border-white/6 bg-white/3 p-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-[11px] text-ink-400">{p.name}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {formatCompact(p.value)}
                </p>
                <p className="text-[11px] text-signal-400">{p.change}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
