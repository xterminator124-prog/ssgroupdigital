import { PageHeader, Panel } from "@/components/dashboard/panel";
import { ButtonLink } from "@/components/ui/button";
import { rangeForDays } from "@/lib/connectors/mock";
import { getTopContent } from "@/lib/connectors/registry";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";

export const dynamic = "force-static";

type ReleaseState = "Live" | "In review" | "Scheduled" | "Draft";

const STATE_STYLE: Record<ReleaseState, string> = {
  Live: "bg-signal-400/12 text-signal-400",
  "In review": "bg-accent-500/12 text-accent-400",
  Scheduled: "bg-brand-500/15 text-brand-300",
  Draft: "bg-white/6 text-ink-400",
};

const STATES: ReleaseState[] = ["Live", "Live", "Live", "In review", "Scheduled", "Draft"];

export default async function ReleasesPage() {
  const releases = await getTopContent(
    { creatorId: "demo", range: rangeForDays(90) },
    12,
  );

  const counts = releases.reduce<Record<string, number>>((acc, _, i) => {
    const state = STATES[i % STATES.length];
    acc[state] = (acc[state] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Releases"
        description={`${releases.length} releases in your catalogue`}
        actions={<ButtonLink href="#" size="sm">New release</ButtonLink>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(STATE_STYLE) as ReleaseState[]).map((state) => (
          <span
            key={state}
            className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-ink-900/50 px-3 py-1.5 text-xs"
          >
            <span className={cn("rounded-full px-1.5 py-0.5", STATE_STYLE[state])}>
              {state}
            </span>
            <span className="text-ink-400">{counts[state] ?? 0}</span>
          </span>
        ))}
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs text-ink-400">
                <th className="pb-3 font-medium">Release</th>
                <th className="pb-3 font-medium">Released</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Streams</th>
                <th className="pb-3 text-right font-medium">Saves</th>
                <th className="pb-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((r, i) => {
                const state = STATES[i % STATES.length];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/2"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-600/40 to-accent-500/25 text-[11px] font-semibold text-white">
                          {r.title.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{r.title}</p>
                          <p className="truncate text-xs text-ink-400">{r.creator}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-ink-400">{r.releasedAt}</td>
                    <td className="py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          STATE_STYLE[state],
                        )}
                      >
                        {state}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-ink-200">
                      {formatCompact(r.metrics.streams ?? 0)}
                    </td>
                    <td className="py-3.5 text-right text-ink-400">
                      {formatCompact(r.metrics.saves ?? 0)}
                    </td>
                    <td className="py-3.5 text-right text-ink-200">
                      {formatCurrency(r.metrics.revenue ?? 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
