# Platform API integration

What each platform actually gives you, what it costs to get, and where the
walls are. Written so nobody on the team has to rediscover these constraints
the hard way.

---

## The uncomfortable truth about music analytics

**Spotify and Apple Music do not publish per-artist streaming APIs.**

Spotify's Web API covers catalogue, playlists and audio features. It does not
return how many times your track was played. That data lives in Spotify for
Artists, which has no public API. Apple Music is the same story — MusicKit
serves catalogue data; play counts live in Apple Music for Artists, export only.

So any product showing "live Spotify streams" is doing one of three things:
ingesting Spotify for Artists report exports, reading distributor royalty
statements, or estimating from playlist and follower proxies and calling the
estimate a fact.

We do the first two and label them. `<SourceNote>` on every panel exists for
exactly this reason. It is the product's main honesty differentiator — please
don't quietly drop it to make a chart look cleaner.

---

## Per-platform detail

### YouTube Data API + YouTube Analytics API

**The best integration available. Build this first after Deezer.**

- **Auth:** OAuth 2.0, Google Cloud project. Scopes: `youtube.readonly`,
  `yt-analytics.readonly`, `yt-analytics-monetary.readonly`.
- **Gives you:** daily views, watch time, average view duration, subscribers
  gained/lost, likes, comments, shares, traffic sources, device types,
  geography, age/gender demographics, and estimated revenue.
- **Quota:** 10,000 units/day by default — the binding constraint. A search
  costs 100 units, a video list costs 1. Analytics API is metered separately at
  720 queries/min/user.
- **Watch out:** quota is per *project*, not per user, so it does not scale with
  your creator count without an increase request (~2 weeks). Batch a nightly
  sync; never query on page load.

### Instagram Graph API

- **Auth:** OAuth via Meta. Requires a **Business or Creator** account linked to
  a Facebook Page — personal accounts cannot be connected at all.
- **Gives you:** follower count, reach, impressions, profile visits, and
  per-media likes/comments/shares/saves.
- **Permissions:** `instagram_basic`, `instagram_manage_insights`,
  `pages_read_engagement`. All require **App Review**, which takes 2–6 weeks and
  wants a screencast of the actual flow. Start early.
- **Watch out:** account-level insights have a 2-year lookback; media insights
  much shorter. Backfill on first connect or you lose the history permanently.

### TikTok Display API

- **Auth:** OAuth 2.0 via TikTok for Developers.
- **Gives you:** profile stats (followers, likes) and per-video view, like,
  comment and share counts, with user consent.
- **Rate limit:** ~600 req/min per app.
- **Watch out:** no sound-level attribution — you cannot see how many videos
  used your track. That is the number musicians most want, and it is only
  available through TikTok for Business or the Research API (approval required,
  region-restricted, academic-leaning).

### Spotify Web API

- **Auth:** Client Credentials for catalogue reads; OAuth for user-scoped data.
- **Gives you:** track and album metadata, artist follower counts, playlist
  placements, audio features, popularity index (0–100, relative, not a count).
- **Does not give you:** streams, listeners, saves, demographics.
- **Rate limit:** rolling 30-second window, undocumented ceiling, `429` with
  `Retry-After`. Implement backoff from the first commit.
- **Real stream data path:** Spotify for Artists CSV export → our ingestion →
  `metric_points`, plus monthly royalty statements for revenue.

### Apple Music (MusicKit)

- **Auth:** ES256 JWT signed with a `.p8` private key, using your Team ID and
  Key ID. Valid up to 6 months. Requires a $99/yr Apple Developer membership.
- **Gives you:** catalogue metadata, charts, editorial playlists.
- **Does not give you:** play counts. Apple Music for Artists is export-only.
- **Watch out:** keep the `.p8` in a secret manager and generate tokens at
  runtime. Never bundle it into the app or commit it.

### Deezer API

- **Auth:** none for most reads.
- **Gives you:** artist, album and track metadata plus fan counts.
- **Rate limit:** 50 requests per 5 seconds per IP.
- **Why build this first:** no OAuth, no review, no key. It proves the adapter
  contract end-to-end in an afternoon.

### YouTube Content ID

- **Auth:** OAuth against an approved CMS account.
- **Gives you:** asset-level claims, views on third-party uploads, and revenue.
- **Watch out:** requires a **YouTube CMS partnership** — not self-serve, takes
  months, and has ongoing policy obligations. Data comes from the YouTube
  Reporting API as asynchronous bulk report jobs, not live queries, so treat it
  as a scheduled ingestion pipeline rather than an API call.
- **Eligibility rules to enforce before submitting:** exclusive rights only. No
  covers, non-exclusively licensed instrumentals, karaoke, remasters,
  sound-alikes, DJ mixes, mashups, compilations, public-domain recordings, or
  non-musical audio (podcasts, ASMR, audiobooks, gameplay). Recordings over 10
  minutes are flagged ineligible. Submitting ineligible assets risks the whole
  CMS relationship — screen aggressively.

### JioSaavn, Amazon Music, Gaana, Wynk

No public developer APIs. Numbers arrive through distributor royalty feeds.
Modelled as first-class platforms in the UI with `auth: "csv_import"` and
`status: "planned"`, sourced from monthly statement ingestion.

---

## Recommended build order

1. **Deezer** — no auth. Proves the contract works end to end.
2. **YouTube** — richest data, immediate user value. Start the quota increase
   request the day you begin.
3. **Instagram** — submit for App Review while building; the review is the
   critical path, not the code.
4. **TikTok** — similar shape to Instagram once OAuth plumbing exists.
5. **Spotify + Apple catalogue metadata** — enriches the UI even without streams.
6. **Report ingestion pipeline** — unlocks Spotify, Apple, JioSaavn and Amazon
   stream and revenue figures all at once. Highest value per unit of work after
   YouTube.
7. **Content ID** — only once the CMS partnership lands.

---

## Architecture rules

**Never call platform APIs during a page render.** Quotas are per-project and
will exhaust in minutes under real traffic. Run a nightly job that writes to
`metric_points`; serve every dashboard read from that table.

**Store tokens encrypted, per creator.** Envelope encryption with a KMS key.
Adapters receive credentials through `FetchContext` — they must never read
user-scoped secrets from `process.env`.

**Refresh proactively.** Refresh at 80% of token lifetime on a schedule rather
than reactively on 401, so a failure surfaces as an alert and not as a blank
dashboard for a customer.

**Back off and isolate.** Every adapter needs exponential backoff honouring
`Retry-After`. `registry.ts` already isolates failures with
`Promise.allSettled` — keep it that way, and surface per-platform sync status
in the UI rather than silently showing zero.

**Backfill on connect.** Grab the maximum history each platform allows the
moment a creator connects. Instagram's 2-year window in particular is gone
forever if you skip it.
