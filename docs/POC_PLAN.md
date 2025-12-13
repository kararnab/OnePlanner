# OnePlanner — POC Plan

**Goal:** Prove the wedge end-to-end on one laptop. By the end of the POC you can demo: an expert publishes a booking link, a "client" books a slot in another browser, both join a 1:1 video call, sketch on a shared whiteboard, and the expert ends with a saved note on the client's profile — all from `localhost`.

**Constraint:** Nothing leaves your machine. No cloud accounts, no API keys, no external services beyond Google's free public STUN (and even that is optional for LAN demos).

**Timeline:** ~3 weeks part-time / ~2 weeks full-time. Six milestones.

**Status:** Plan only. Last updated 2026-05-18.

---

## 1. Demo script (the success criterion)

If at the end you can run this script without code changes, the POC is done:

1. `npm run dev:all` — Next.js (:3000) and `y-websocket` (:1234) start in one terminal.
2. **Tab A** (expert): log in as `arnab@local`, set weekly availability `Mon/Wed 4–7pm`, set one session type "30-min consult", copy link `http://localhost:3000/arnab`.
3. **Tab B** (client): open `http://localhost:3000/arnab`, book the next available slot as `Sam` / `sam@example.com`.
4. **Tab A** dashboard shows the upcoming session; click "Start now" → video room opens; the booking confirmation in Tab B has a "Join" link.
5. **Tab B** clicks Join → P2P video connects between the two tabs.
6. Either side opens the whiteboard tab → drawing appears live on the other.
7. Expert types a note "Covered async/await basics" in the docked panel during the call.
8. Both hang up. Expert opens `Clients → Sam` → sees the session, the note, and a thumbnail of the whiteboard. Clicks the thumbnail → whiteboard reopens read-only.
9. Expert dashboard tile: "1 session this week · 0.5 hours."

That's the wedge in 9 steps. No cloud. No mock data.

---

## 2. POC scope

### In

- Email/password auth (local, JWT in HTTP-only cookies; one seeded expert account)
- Expert profile (name, handle, photo, timezone, hourly rate)
- One configurable session type (duration, description)
- Weekly availability (recurring time slots, no blackouts in POC)
- Public booking page at `localhost:3000/<handle>`
- Booking flow without a client account (name + email captured)
- 1:1 video room with WebRTC P2P (mic, cam, hang-up — reuse existing controls)
- Collaborative whiteboard tab inside the room (Excalidraw + Y.js via `y-websocket`)
- Per-client profile auto-created on first booking
- Session timeline per client, with notes + whiteboard snapshot
- Docked notes panel inside the video room
- Tiny dashboard: this-week session count, total hours, lapsing-client list

### Out (deferred to v1 proper)

- Email — confirmations log to console instead
- Reminders / cron
- Recurring bookings
- Multiple session types
- File uploads beyond profile photo
- Recording
- Payments
- Custom branding / themes
- TURN server (use STUN only; demo across LAN)
- Mobile-specific polish
- Real i18n beyond what already exists

### Explicitly out (per product spec)

- Group calls
- Healthcare verticals
- Multi-expert / studio accounts

---

## 3. Local architecture

```
┌──────────────────────────────────────────────────────┐
│                Your machine (POC)                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Next.js dev               :3000                     │
│   ├── pages (existing UI, retooled)                  │
│   ├── /api/auth/*          (JWT cookie auth)         │
│   ├── /api/bookings/*                                │
│   ├── /api/clients/*                                 │
│   ├── /api/sessions/*                                │
│   ├── /api/signaling       (WebSocket upgrade)       │
│   └── better-sqlite3 ──► ./data/oneplanner.db        │
│                                                      │
│  y-websocket               :1234                     │
│   └── whiteboard Y.Docs (in-memory + snapshot to FS) │
│                                                      │
│  ./uploads/                profile photos, snapshots │
│                                                      │
└──────────────────────────────────────────────────────┘

       Browser A (expert)            Browser B (client)
            │                              │
            └──── WebRTC P2P ──────────────┘
                  (STUN: Google free, optional)
```

**The required architectural change:** drop `output: "export"` from `next.config.ts` so API routes work. Production builds for the eventual cloud version will need to either keep Next.js as a Node host (Fly/Render) or split frontend/backend. Not the POC's problem.

---

## 4. Data model (SQLite)

Minimum tables for the demo script:

```sql
users (
  id            INTEGER PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    INTEGER NOT NULL
)

experts (
  id            INTEGER PRIMARY KEY,
  user_id       INTEGER UNIQUE NOT NULL REFERENCES users(id),
  handle        TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  photo_path    TEXT,
  timezone      TEXT NOT NULL,           -- IANA, e.g. 'Asia/Kolkata'
  hourly_rate   INTEGER NOT NULL DEFAULT 0
)

session_types (
  id            INTEGER PRIMARY KEY,
  expert_id     INTEGER NOT NULL REFERENCES experts(id),
  name          TEXT NOT NULL,
  duration_min  INTEGER NOT NULL,
  description   TEXT
)

availability_rules (
  id            INTEGER PRIMARY KEY,
  expert_id     INTEGER NOT NULL REFERENCES experts(id),
  weekday       INTEGER NOT NULL,         -- 0=Sun … 6=Sat
  start_minute  INTEGER NOT NULL,         -- minutes since midnight (in expert tz)
  end_minute    INTEGER NOT NULL
)

clients (
  id            INTEGER PRIMARY KEY,
  expert_id     INTEGER NOT NULL REFERENCES experts(id),
  email         TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  UNIQUE(expert_id, email)
)

bookings (
  id              INTEGER PRIMARY KEY,
  expert_id       INTEGER NOT NULL REFERENCES experts(id),
  client_id       INTEGER NOT NULL REFERENCES clients(id),
  session_type_id INTEGER NOT NULL REFERENCES session_types(id),
  start_at        INTEGER NOT NULL,        -- unix ms, UTC
  end_at          INTEGER NOT NULL,
  status          TEXT NOT NULL,           -- 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  room_token      TEXT UNIQUE NOT NULL     -- random string in room URL
)

session_notes (
  booking_id    INTEGER PRIMARY KEY REFERENCES bookings(id),
  body          TEXT NOT NULL DEFAULT '',
  updated_at    INTEGER NOT NULL
)

whiteboard_snapshots (
  booking_id    INTEGER PRIMARY KEY REFERENCES bookings(id),
  ydoc_blob     BLOB NOT NULL,             -- Y.encodeStateAsUpdate output
  thumbnail_path TEXT,                     -- PNG export, optional
  updated_at    INTEGER NOT NULL
)
```

Migrations live as numbered SQL files in `./migrations/` and a tiny runner applies them at boot.

---

## 5. Milestones

Each milestone has a written acceptance check. Don't move on until the check passes.

### M0 — Project surgery (½ day)

| Task | Notes |
| --- | --- |
| Remove `output: "export"` from `next.config.ts` | Lets API routes work |
| `npm i better-sqlite3 jsonwebtoken bcryptjs y-websocket yjs concurrently` | Core POC deps |
| `npm i -D @types/better-sqlite3 @types/jsonwebtoken @types/bcryptjs tsx` | Types + script runner |
| Add `data/`, `uploads/`, `migrations/` to repo + `.gitignore` | Keep blobs out of git |
| Add scripts: `dev:next`, `dev:yws`, `dev:all` (via `concurrently`) | One command to start everything |

**Acceptance:** `npm run dev:all` starts Next on :3000 and `y-websocket` on :1234 without errors.

### M1 — Local auth + DB (1 day)

| Task | Notes |
| --- | --- |
| Migration runner + `001_initial.sql` with the schema above | |
| `lib/db.ts` exporting a shared `better-sqlite3` connection | |
| Seed script `scripts/seed.ts` — creates one expert (`arnab@local` / `password`, handle `arnab`) | |
| `/api/auth/login` — verifies bcrypt, sets `oneplanner_token` HTTP-only cookie | |
| `/api/auth/me` — returns the user from cookie | |
| `/api/auth/logout` — clears cookie | |
| Replace mock adapter in `src/lib/api/api.ts` with real `fetch` calls to API routes (or just delete the mock branch and use `fetchAdapter`) | |

**Acceptance:** Logging in with the seeded creds redirects to `/dashboard`; refresh keeps you logged in; sidebar logout clears state.

### M2 — Expert profile + booking page (2 days)

| Task | Notes |
| --- | --- |
| Settings page: edit display name, hourly rate, weekly availability grid | |
| `/api/availability` GET/PUT | |
| Session-types: one row hardcoded by seed for POC; UI to edit name + duration | |
| Public booking page at `/[handle]/page.tsx` — server component, reads expert + availability + existing bookings, renders slot picker | Use `next/dynamic` only for client-only widgets |
| `/api/bookings` POST — validates slot is free, creates client (or finds by email), creates booking, returns `room_token` | |
| Confirmation page with copyable room link | |
| Console-log the "confirmation email" content | |

**Acceptance:** From an incognito window with no login, you can open `localhost:3000/arnab`, pick a slot, book as `Sam`, see a confirmation page, and the booking shows up on Tab A's dashboard.

### M3 — Video room + signaling (3 days)

| Task | Notes |
| --- | --- |
| `/api/signaling` route — WebSocket upgrade; rooms keyed by `room_token` | Use the `ws` package; Next 16 supports custom WS in API routes via Node runtime |
| Room joining page `/[handle]/room/[token]` — both sides land here; one is "host" if logged in as the expert | |
| `RTCPeerConnection` setup, SDP/ICE exchange over the signaling WS | Use Google STUN: `stun:stun.l.google.com:19302` |
| Reuse `VideoGrid` for the 1:1 layout; reuse `Controls` for mic/cam/share/hang-up | Wire the real state |
| "Waiting for <expert>" screen for early arrivals | |
| Mark booking `completed` when the host hangs up | |

**Acceptance:** Two tabs (one logged in as expert, one not) join the room URL → video flows both ways → hanging up bounces both to a "Thanks!" page → booking status is `completed` in DB.

### M4 — Client profiles + session notes (2 days)

| Task | Notes |
| --- | --- |
| `/clients` list page | |
| `/clients/[id]` profile page — timeline of past + upcoming sessions, list of notes | |
| Docked notes panel inside the video room — textarea bound to `/api/sessions/[id]/note` (debounced PUT) | |
| Display the note on the session timeline | |

**Acceptance:** Notes typed during the call are visible on the client's profile after hang-up.

### M5 — Whiteboard (3 days)

| Task | Notes |
| --- | --- |
| Install `@excalidraw/excalidraw` + `yjs` + `y-websocket` (client) | |
| Pick a `y-excalidraw` binding — start with the community lib; if flaky, port the small adapter we need (~200 LOC) | This is the only "unknown work" in the POC |
| Whiteboard tab in the room — connects to `ws://localhost:1234/board/<room_token>` | |
| On session end (hang-up), POST the Y.Doc state to `/api/sessions/[id]/whiteboard` → SQLite blob | |
| Re-opening from the client profile loads the blob into a fresh Y.Doc, renders read-only | Add an "Edit" toggle later |
| Optional: PNG thumbnail via Excalidraw's `exportToBlob` for the timeline card | |

**Acceptance:** Drawings sync live between the two tabs; after both hang up, opening the booking from the client profile shows the same drawing.

### M6 — Dashboard + polish (2 days)

| Task | Notes |
| --- | --- |
| Dashboard tiles: sessions this week, hours, est. revenue (sessions × rate) | Existing dashboard layout exists; swap in real data |
| Lapsing-client list — clients with no future booking and no session in 30 days | |
| Replace remaining mock data in the dashboard | |
| Walk the demo script end-to-end; fix the rough edges | |
| Record a 2-min screencap for the README | |

**Acceptance:** The demo script in §1 runs without devtools open.

---

## 6. Folder layout (after POC)

```
src/
  app/
    [handle]/                     # public expert pages
      page.tsx                    # booking page
      room/[token]/page.tsx       # video room
    api/
      auth/{login,logout,me}/route.ts
      availability/route.ts
      bookings/route.ts
      clients/route.ts
      sessions/[id]/{note,whiteboard}/route.ts
      signaling/route.ts          # WebSocket upgrade
    dashboard/
    clients/
    settings/
    meeting/                      # legacy; merge into [handle]/room
    login/
  components/
    meeting/                      # existing
    whiteboard/                   # NEW
    auth/
    ui/
  lib/
    db/
      index.ts                    # better-sqlite3 connection
      migrate.ts
    auth/
      jwt.ts
      session.ts
    api/                          # client-side fetch wrappers
    store/                        # zustand (existing)

migrations/
  001_initial.sql
scripts/
  seed.ts
  yws.ts                          # tiny y-websocket starter that persists snapshots
data/                             # gitignored
  oneplanner.db
uploads/                          # gitignored
  photos/
  whiteboard-thumbs/
docs/
  PRODUCT_SPEC.md
  POC_PLAN.md
```

---

## 7. Running it

```bash
# one-time
npm install
npm run db:migrate
npm run db:seed

# every dev session
npm run dev:all     # Next on :3000, y-websocket on :1234
```

Stop with `Ctrl+C`. Reset with `rm -rf data/oneplanner.db && npm run db:migrate && npm run db:seed`.

---

## 8. Risks / things to validate

| Risk | Likelihood | Mitigation in POC |
| --- | --- | --- |
| Community `y-excalidraw` binding is unstable | Medium | Time-box M5 at 3 days; if blocked, fall back to a simpler shared-canvas (Konva + Y.js Maps for shapes) — uglier but proves the sync model |
| Next.js 16 + WebSocket in an API route has rough edges | Medium | Fallback: run a tiny `ws` server alongside `y-websocket` in `scripts/yws.ts` and point the browser at it directly |
| WebRTC works on loopback but fails LAN due to a flaky local network | Low | Test on the actual two devices you'll demo with; have a known-good network |
| SQLite write contention if both Next workers hit the DB | Low | Single worker for POC; use `better-sqlite3` synchronous API |
| Time zones turn into a multi-day rabbit hole | Medium | Store everything in UTC; do display conversion only in the UI using `Intl.DateTimeFormat` |

---

## 9. What's deliberately not specified yet

- **Tests** — POC is for demo, not coverage. Add tests once the wedge is validated.
- **Form validation** — minimal in POC; real validation in v1.
- **Accessibility audit** — skip for POC; cleanup in v1.
- **Error states** — happy path only in POC; full states in v1.
- **Production deploy** — out of scope; product spec covers the cloud version.

---

## 10. Decisions captured

- POC runs entirely on one machine; no cloud accounts.
- Next.js is the **whole** backend in POC (drop `output: "export"`).
- SQLite via `better-sqlite3` for persistence.
- `y-websocket` runs as a sidecar process; Excalidraw + community Y.js binding for the whiteboard.
- WebRTC uses Google's public STUN; no TURN in POC.
- Email is a console log; no real send.
