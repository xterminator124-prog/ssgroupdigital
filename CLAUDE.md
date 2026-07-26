# SS Group Digital — project brief

Working directory for this project. All edits happen here.

Music distribution + cross-platform creator analytics for **ssgroupdigital.com**.
Structurally modelled on hardanmusic.com — same page inventory — rebuilt on a
modern stack with an analytics product the original doesn't have.

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 (CSS-first
`@theme`, no JS config) · Recharts · lucide-react. npm, not pnpm. No UI kit —
`components/ui` is hand-rolled and owns its styling.

## Commands

```bash
npm install
npm run dev        # localhost:3000
npm run build
npm run typecheck  # run before every commit
```

## Layout

```
app/(marketing)/   Public site: home, features, distribution, analytics,
                   pricing, about, contact. Nav + footer layout.
app/dashboard/     Authenticated shell (noindex): overview, analytics,
                   releases, royalties, platforms.
app/api/           analytics/summary (dashboard hydration), connectors
                   (capability manifest).
lib/connectors/    The core abstraction — see below.
components/        site/ (nav, footer, logo, marquee, faq)
                   dashboard/ (sidebar, charts, panel)
                   ui/ (button, primitives, reveal)
```

## The connector layer — read this before touching analytics

`lib/connectors/types.ts` defines `PlatformAdapter`. Every platform — Spotify,
YouTube, Instagram, TikTok, Deezer, Content ID — implements that one interface.
UI code never imports a platform SDK; it only sees normalized `MetricPoint`,
`ContentItem`, `GeoBreakdown`.

Rules that matter:

- **Capabilities are declared, not assumed.** `meta.supports` lists the metrics
  a platform can actually return; `meta.status` is `live` / `stub` / `planned`.
  The dashboard renders only widgets a platform can fill. The public
  `/analytics` page is generated from the same registry, so marketing claims
  can't drift from the code.
- **Every method except `meta` is optional.** Deezer needs no auth, Apple Music
  needs a signed JWT, JioSaavn has no API at all. Don't force parity.
- **Failures are isolated.** `registry.ts` fans out with `Promise.allSettled`.
  One platform 429-ing must never blank the dashboard.
- Adding a platform = one adapter file + registration in `ALL_ADAPTERS`.
  No UI changes.

Currently all adapters serve deterministic seeded mock data (`mock.ts`) through
the real contract. Seeded, not random — random mocks cause hydration mismatches.

## Non-negotiable product principle

**Spotify and Apple Music publish no per-artist streaming API.** Anyone showing
live Spotify stream counts is using report exports or estimating. We ingest
Spotify for Artists / Apple Music for Artists reports plus royalty statements,
and every metric in the UI carries a `<SourceNote>` naming its provenance.

Keep that convention. It's the main honesty differentiator against competitors
who blend estimates into "analytics" silently. Don't drop a SourceNote to make
a panel look cleaner.

See `docs/API-INTEGRATION.md` for per-platform detail and build order.

## Brand assets

`public/mark-simple-{white,black}.png` is the **default** mark — the supplied
artwork with the "GROUP DIGITAL" micro-text band removed and the ring closed
behind it, because that band becomes an illegible smudge below ~48px. The
untouched artwork is `mark-{white,black}.png`, for 96px and above.
`logo-{white,black}.png` is the full lockup. Regenerate from source artwork if
the brand changes — don't hand-edit the PNGs. Components: `components/site/logo.tsx`.

## State as of this writing

- 55 files committed, pushed to GitHub (`ssgroupdigital`, branch `main`).
- **First real build passed on Vercel** — compiled in 14.4s, type checking
  clean, all 21 routes generated. No errors in application code.
- That deployment was still rejected: Vercel blocks Next.js versions affected
  by CVE-2025-66478 (CVSS 10.0 RCE in the React Server Components protocol).
  Pinned `next` bumped 15.5.4 → **15.5.7**, the patched release for the 15.5
  line. `react`/`react-dom` moved to `^19.1.0` so patches flow through.
  Redeploy after `npm install` regenerates the lockfile.
- Outstanding: recharts 2.x is deprecated upstream (warning only, not
  blocking). v3 is a breaking migration — schedule it, don't rush it.

## Roadmap

1. *(current)* Marketing site + dashboard shell on mock data.
2. Postgres + auth + encrypted per-creator OAuth token storage.
3. Live integrations in this order: Deezer (no auth, cheapest win) → YouTube
   (richest data) → Instagram → TikTok. Nightly sync job writes to
   `metric_points`; the dashboard reads that table, never the platform APIs
   directly — quotas make on-request polling impossible.
4. Royalty statement ingestion (unlocks Spotify/Apple/JioSaavn figures),
   YouTube CMS partnership for Content ID.
5. Read API + webhooks for Label-tier customers.

## Working constraints

Claude can read and write files here directly, but shell commands run in an
isolated container with **no internet**. So `git push`, `npm install`, and any
network call must be run by the user from their own Terminal. Vercel is
available through an MCP connector (build logs, runtime errors, deployments) —
that routes through Anthropic's servers, not the container, so it works.

Never commit `.env.local`. Rotate any credential pasted into a chat.
Audio masters belong in S3/R2, never on the app server's disk.
