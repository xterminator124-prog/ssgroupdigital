# SS Group Digital

Music distribution + cross-platform creator analytics for **ssgroupdigital.com**.

Structurally modelled on hardanmusic.com — same page inventory and information
architecture, rebuilt on a modern stack with a dark, motion-aware design system
and an analytics product the original doesn't have.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
```

> **Not yet compiled.** This project was authored in a sandbox without npm
> registry access, so `npm install` and `next build` have not been run against
> it. Imports, module resolution and `.ts` syntax were verified statically.
> Run `npm run typecheck` first — expect to fix a small number of type
> annotations in `components/dashboard/charts.tsx` if recharts' generic
> inference disagrees with the narrowed formatter signatures.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components keep analytics queries off the client; API routes give the connector layer a home |
| Language | TypeScript, strict | The connector contract is the core abstraction — it needs real types |
| Styling | Tailwind CSS v4 | CSS-first `@theme` tokens, no JS config file |
| Charts | Recharts | Composable, small, SSR-friendly |
| Icons | lucide-react | Tree-shakeable |

No UI kit dependency. Components in `components/ui` are ~200 lines total and
own their own styling, which avoids the usual shadcn/Radix upgrade tax.

---

## Layout

```
app/
  (marketing)/          Public site — nav + footer layout
    page.tsx            Home (the hardanmusic replica, modernized)
    features/           Full feature inventory
    distribution/       How distribution works + delivery guidelines
    analytics/          The differentiator; renders live from the adapter registry
    pricing/            Three tiers + comparison table
    about/  contact/
  dashboard/            Authenticated shell — sidebar layout, noindex
    page.tsx            Overview: KPIs, trend, geography, top content
    analytics/          Platform comparison, geo, revenue mix, capability matrix
    releases/           Catalogue table with release states
    royalties/          Earnings, statements, collaborator splits
    platforms/          Connect / manage integrations
  api/
    analytics/summary/  GET — the endpoint the dashboard hydrates from
    connectors/         GET — capability manifest for all platforms

lib/connectors/         ← the important part
  types.ts              PlatformAdapter contract + normalized metric schema
  adapters.ts           One adapter per platform, honest capability metadata
  registry.ts           Fan-out, aggregation, per-platform failure isolation
  mock.ts               Deterministic seeded mock data
```

---

## Brand assets

Derived from the supplied artwork. All monochrome PNGs with transparency —
pick the variant that matches the surface, don't recolour them in CSS.

| File | Use |
|---|---|
| `public/mark-simple-{white,black}.png` | **Default mark.** Navbar, sidebar, favicons — anywhere under ~96px |
| `public/mark-{white,black}.png` | Mark exactly as supplied, with the "GROUP DIGITAL" band. Use at 96px+ |
| `public/logo-{white,black}.png` | Full lockup (mark + stacked wordmark). Footer, print, decks |
| `app/icon.png` | Favicon — Next.js picks this up automatically |
| `app/apple-icon.png` | iOS home screen; opaque background by design |
| `app/opengraph-image.png` | Social card, auto-wired by the App Router |

**Why two cuts of the mark.** The "GROUP DIGITAL" micro-text sits in a band
across the lower third. Below roughly 48px it stops being text and becomes a
grey smudge. `mark-simple-*` removes the band and closes the ring behind it, so
the mark stays legible down to 16px. This is normal responsive-logo practice —
the full lockup still carries the wordmark wherever there's room for it.

The simplified cut was produced by masking the text band and redrawing that
slice of the ring from a least-squares circle fit of the original artwork
(centre 255.3, 256.8, R 229.2, stroke 43 — max residual 2.2px), then flattening
the colour to remove compression noise. Regenerate from the source files if the
brand artwork is ever updated; don't hand-edit the PNGs.

Components live in `components/site/logo.tsx`: `<Mark>`, `<LogoLockup>` and
`<Logo>` (mark + live text, used in the navbar).

---

## The connector layer

This is the piece worth understanding, because it's what the whole analytics
product rests on.

**One contract, every platform.** `PlatformAdapter` in `lib/connectors/types.ts`
defines a normalized shape — canonical `MetricKey` values, `MetricPoint`,
`ContentItem`, `GeoBreakdown`. No UI code ever imports a platform SDK. Adding a
platform means writing one adapter file and registering it; nothing else changes.

**Capabilities are declared, not assumed.** Every adapter's `meta.supports`
lists the metrics that platform can actually return, and `meta.status` is one of
`live` / `stub` / `planned`. The dashboard reads these and renders only widgets a
platform can fill. The `/analytics` marketing page is generated from the same
registry, so the public capability table can't drift from what the code does.

**Every method is optional except `meta`.** Platforms differ enormously — Deezer
needs no auth, Apple Music needs a signed JWT, JioSaavn has no API at all. The
interface accommodates that instead of forcing a lowest common denominator.

**Failures are isolated.** `registry.ts` fans out with `Promise.allSettled`. One
platform returning 429 degrades that series only; the rest of the dashboard
still renders.

### Adding a platform

```ts
export const nextPlatform: PlatformAdapter = {
  meta: {
    id: "example",
    name: "Example",
    category: "social",
    auth: "oauth2",
    supports: ["followers", "views", "likes"],
    color: "#8b5cf6",
    status: "live",
  },
  getAuthorizationUrl: (state) => `https://example.com/oauth?state=${state}`,
  exchangeCode: async (code) => exchange(code),
  fetchTimeSeries: async (ctx) => mapToMetricPoints(await api.insights(ctx)),
};
```

Then add it to `ALL_ADAPTERS` in `lib/connectors/adapters.ts`. Done.

---

## Where the data actually comes from

The single most important design decision here is being honest about this.
See `docs/API-INTEGRATION.md` for the full per-platform breakdown, but the
short version:

- **YouTube** has the best API by a wide margin — real daily views, watch time,
  geography, demographics, estimated revenue, all via OAuth.
- **Instagram and TikTok** give solid account and post insights with user
  consent, subject to app review.
- **Spotify and Apple Music publish no per-artist streaming API.** Anyone
  showing you live Spotify stream counts is using report exports or estimating.
  We use Spotify for Artists / Apple Music for Artists report ingestion plus
  distributor royalty statements, and we label those figures as such.
- **JioSaavn, Amazon Music** arrive only through royalty statements.

Every metric in the UI carries a `<SourceNote>` explaining its provenance.
Please keep that convention — it's the product's main differentiator against
competitors who blend estimates into "analytics" without saying so.

---

## Roadmap

**Phase 1 — current.** Marketing site + dashboard shell on deterministic mock
data through the real adapter contract.

**Phase 2 — auth and persistence.** Postgres + Drizzle or Prisma, session auth,
encrypted per-creator OAuth token storage, real user accounts.

**Phase 3 — first live integrations.** Deezer (no auth, cheapest first win),
then YouTube (richest data), then Instagram and TikTok. Nightly sync job writing
to a `metric_points` table; dashboard reads the table, never the platform APIs
directly.

**Phase 4 — reports and rights.** Royalty statement ingestion pipeline for
Spotify/Apple/JioSaavn, YouTube CMS partnership for Content ID.

**Phase 5 — open API.** Read endpoints and webhooks for Label-tier customers.

---

## Notes

- `npm run typecheck` before every commit.
- Never commit `.env.local`. Rotate any credential that has been pasted into
  chat, a ticket, or a shared doc.
- Audio masters must go to S3/R2, never the app server's disk.
