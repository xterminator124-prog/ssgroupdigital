import { CheckCircle2, Clock, Link2, Lock } from "lucide-react";

import { PageHeader, Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { listAdapters } from "@/lib/connectors/registry";
import type { PlatformMeta } from "@/lib/connectors/types";

export const dynamic = "force-static";

const AUTH_LABEL: Record<PlatformMeta["auth"], string> = {
  oauth2: "OAuth 2.0",
  client_credentials: "App-level token",
  jwt: "Signed developer token",
  public: "No authentication required",
  csv_import: "Report ingestion",
};

const CATEGORY_ORDER: PlatformMeta["category"][] = ["music", "video", "social", "rights"];

const CATEGORY_LABEL: Record<PlatformMeta["category"], string> = {
  music: "Music platforms",
  video: "Video platforms",
  social: "Social platforms",
  rights: "Rights & monetization",
};

function ConnectionCard({ meta }: { meta: PlatformMeta }) {
  const isPlanned = meta.status === "planned";
  const isLive = meta.status === "live";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-ink-900/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: meta.color, boxShadow: `0 0 14px ${meta.color}55` }}
          />
          <h3 className="truncate text-sm font-semibold text-white">{meta.name}</h3>
        </div>

        {isLive ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-signal-400/12 px-2 py-0.5 text-[11px] text-signal-400">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </span>
        ) : isPlanned ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/6 px-2 py-0.5 text-[11px] text-ink-400">
            <Lock className="h-3 w-3" />
            Planned
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-500/12 px-2 py-0.5 text-[11px] text-accent-400">
            <Clock className="h-3 w-3" />
            In build
          </span>
        )}
      </div>

      <p className="mt-3 text-[11px] text-ink-400">{AUTH_LABEL[meta.auth]}</p>

      {meta.notes ? (
        <p className="mt-3 flex-1 text-xs leading-relaxed text-ink-400">{meta.notes}</p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-4 flex flex-wrap gap-1">
        {meta.supports.slice(0, 5).map((m) => (
          <span key={m} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-400">
            {m.replace(/_/g, " ")}
          </span>
        ))}
        {meta.supports.length > 5 ? (
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-400">
            +{meta.supports.length - 5}
          </span>
        ) : null}
      </div>

      <Button
        variant={isPlanned ? "ghost" : "outline"}
        size="sm"
        disabled={isPlanned}
        className="mt-4 w-full"
      >
        <Link2 className="h-3.5 w-3.5" />
        {isPlanned ? "Not yet available" : isLive ? "Manage" : "Connect"}
      </Button>
    </div>
  );
}

export default function PlatformsPage() {
  const adapters = listAdapters();

  return (
    <>
      <PageHeader
        title="Platforms"
        description="Connect a platform to pull its data into your analytics"
      />

      <Panel className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Sync schedule</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-400">
              Connected platforms sync once daily at 03:00 UTC. Platform API quotas
              make continuous polling impractical, so the dashboard reads from our
              synced store rather than calling providers on page load.
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            Sync now
          </Button>
        </div>
      </Panel>

      {CATEGORY_ORDER.map((category) => {
        const group = adapters.filter((a) => a.meta.category === category);
        if (group.length === 0) return null;

        return (
          <section key={category} className="mb-8">
            <h2 className="mb-4 text-xs font-semibold tracking-[0.16em] text-ink-400 uppercase">
              {CATEGORY_LABEL[category]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.map((a) => (
                <ConnectionCard key={a.meta.id} meta={a.meta} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
