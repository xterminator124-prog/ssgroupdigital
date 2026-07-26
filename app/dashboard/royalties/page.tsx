import { Download } from "lucide-react";

import { RevenueDonut, TrendChart } from "@/components/dashboard/charts";
import { PageHeader, Panel, SourceNote, StatCard } from "@/components/dashboard/panel";
import { ButtonLink } from "@/components/ui/button";
import { rangeForDays } from "@/lib/connectors/mock";
import { getAggregateSeries, listAdapters } from "@/lib/connectors/registry";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-static";

const STATEMENTS = [
  { period: "June 2026", gross: 6115.15, splits: 1223.03, net: 4892.12, status: "Paid" },
  { period: "May 2026", gross: 5480.9, splits: 1096.18, net: 4384.72, status: "Paid" },
  { period: "April 2026", gross: 5921.44, splits: 1184.29, net: 4737.15, status: "Paid" },
  { period: "March 2026", gross: 4802.6, splits: 960.52, net: 3842.08, status: "Paid" },
  { period: "July 2026", gross: 2140.75, splits: 428.15, net: 1712.6, status: "Pending" },
];

const SPLITS = [
  { name: "Aarav Sen", role: "Primary artist", pct: 60 },
  { name: "Kavya Rao", role: "Featured vocals", pct: 20 },
  { name: "The Ninth Floor", role: "Producer", pct: 15 },
  { name: "Dust & Echo", role: "Co-writer", pct: 5 },
];

export default async function RoyaltiesPage() {
  const range = rangeForDays(90);
  const revenue = await getAggregateSeries({ creatorId: "demo", range }, "revenue");

  const byPlatform = await Promise.all(
    listAdapters()
      .filter((a) => a.meta.supports.includes("revenue") && a.meta.status !== "planned")
      .map(async (a) => {
        const rows = (await a.fetchSummary?.({ creatorId: "demo", range })) ?? [];
        return {
          name: a.meta.name,
          value: Math.round(rows.find((r) => r.metric === "revenue")?.value ?? 0),
          color: a.meta.color,
        };
      }),
  );

  const total = byPlatform.reduce((s, r) => s + r.value, 0);
  const pendingBalance = 1712.6;

  return (
    <>
      <PageHeader
        title="Royalties"
        description="Last 90 days · reconciled monthly"
        actions={
          <>
            <ButtonLink href="#" variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export CSV
            </ButtonLink>
            <ButtonLink href="#" size="sm">
              Withdraw
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross (90d)" value={formatCurrency(total)} accent="#8b5cf6" />
        <StatCard
          label="Available balance"
          value={formatCurrency(pendingBalance)}
          hint="withdrawable now"
          accent="#a3e635"
        />
        <StatCard label="Paid to collaborators" value={formatCurrency(4892.17)} accent="#22d3ee" />
        <StatCard label="Next statement" value="31 Jul" hint="July 2026 period" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Daily earnings" subtitle="All platforms, platform-reported">
          <TrendChart
            data={revenue.map((p) => ({ date: p.date, value: p.value }))}
            label="Revenue"
          />
          <SourceNote>
            Estimates until the period closes. Final statements reconcile against
            distributor reports and can move a few percent in either direction.
          </SourceNote>
        </Panel>

        <Panel title="Source mix" subtitle="Where the money came from">
          <RevenueDonut data={byPlatform} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Statements">
          <div className="overflow-x-auto">
            <table className="w-full min-w-lg text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-ink-400">
                  <th className="pb-3 font-medium">Period</th>
                  <th className="pb-3 text-right font-medium">Gross</th>
                  <th className="pb-3 text-right font-medium">Splits out</th>
                  <th className="pb-3 text-right font-medium">Your net</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {STATEMENTS.map((s) => (
                  <tr key={s.period} className="border-b border-white/5 last:border-0">
                    <td className="py-3.5 font-medium text-white">{s.period}</td>
                    <td className="py-3.5 text-right text-ink-200">
                      {formatCurrency(s.gross)}
                    </td>
                    <td className="py-3.5 text-right text-ink-400">
                      −{formatCurrency(s.splits)}
                    </td>
                    <td className="py-3.5 text-right font-medium text-white">
                      {formatCurrency(s.net)}
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={
                          s.status === "Paid"
                            ? "rounded-full bg-signal-400/12 px-2 py-0.5 text-[11px] text-signal-400"
                            : "rounded-full bg-accent-500/12 px-2 py-0.5 text-[11px] text-accent-400"
                        }
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Active splits" subtitle="Applied automatically each period">
          <ul className="flex flex-col gap-4">
            {SPLITS.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{s.name}</p>
                    <p className="truncate text-xs text-ink-400">{s.role}</p>
                  </div>
                  <span className="shrink-0 font-medium text-white">{s.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
