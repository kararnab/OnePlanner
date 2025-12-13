# OnePlanner — Product Spec (v2)

**One-line pitch:** The practice OS for independent experts. Schedule, meet, track each client's progress, collaborate on a live whiteboard, and see how your business is doing — under your own brand.

**Status:** Draft v2 spec. Last updated 2026-05-18.

---

## 1. Why now

A consultant, trainer, tutor, or coach today stitches together five+ tools to run their practice:

1. **Calendly / Cal.com** — scheduling
2. **Zoom / Meet** — sessions
3. **Notion / Google Docs** — per-client notes
4. **Miro / Excalidraw / a Zoom whiteboard** — live collaboration
5. **A spreadsheet** — revenue, hours, retention

Each tool is built for a different user; nothing knows that *all of these revolve around the same client*. The expert ends up doing the integration work in their head — flipping tabs mid-session, copy-pasting notes after, building spreadsheets at month-end.

OnePlanner collapses the stack. One branded URL hosts the booking page, the session room, the whiteboard, the per-client record, and the practice dashboard. The expert sees one timeline per client; the client sees one polished service.

## 2. Target user (ICP)

**Primary cluster — knowledge-work 1:1 professionals:**

| Sub-segment | Sessions look like | Examples |
| --- | --- | --- |
| Consultants / advisors | Discovery → recurring strategy calls | Marketing strategists, ops consultants, career advisors |
| Trainers | Curriculum-driven, often recurring | Sales-skills trainers, soft-skills facilitators, fitness trainers (online) |
| Tutors | Weekly cadence, longitudinal progress | K-12 academic, test prep, music, language |
| Coaches | Open-ended, relationship-heavy | Executive coaches, life coaches, performance coaches |

**Shared traits that make the product work for all four:**
- Run mostly 1:1 sessions, often recurring
- Repeat clients with longitudinal history that matters
- Build their brand on craft + relationship, not on a marketplace
- Currently juggling 4–6 disconnected tools

**Not in v1, by design:**
- **Tutoring centers, training agencies** — multi-expert businesses. Single-expert accounts in v1.
- **Group classes / cohorts** — 1:1 only in v1.

**Not pursued:** Healthcare verticals (doctors, therapists, dietitians). The regulatory tax (HIPAA / DPDP / e-prescription, retention requirements, identity verification) outweighs the ROI for the foreseeable roadmap.

## 3. Jobs-to-be-done

When an expert hires OnePlanner, they want it to:

- **JTBD-1** — "Let my clients book me without back-and-forth email."
- **JTBD-2** — "Run the session in a way that feels like *my* service."
- **JTBD-3** — "Remember what we covered last time so I can pick up where we left off."
- **JTBD-4** — "Let me sketch / mark up / draw alongside the client live, not link out to Miro."
- **JTBD-5** — "Tell me at a glance how my practice is doing — hours, sessions, revenue, who's lapsing."
- **JTBD-6** — "Save me from chasing no-shows and reschedules."

v1 must serve all six. JTBD-3 and JTBD-4 are the wedge that justifies switching from a Calendly + Zoom stack.

## 4. Differentiation

| Competitor | Strength | Gap OnePlanner exploits |
| --- | --- | --- |
| Calendly + Zoom (stack) | Each is best-in-class | Two URLs, two brands, two logins, no client memory |
| Cal.com | Open scheduler, embedded Daily video | Generic video tab; no client record, no whiteboard, no analytics |
| HoneyBook / Dubsado | Solo-pro CRM + invoicing | Built for creatives (deliverable-based, not session-based); no live session tools |
| TutorBird / TutorCruncher | Tutor-CRM with scheduling | Tutor-only; dated UI; $30–60/mo; no real whiteboard; no live meeting |
| Practice Better, SimplePractice | Wellness practice management | Healthcare regulatory scope, expensive, overkill for consultants/trainers |
| Notion + Calendly + Zoom + Stripe (DIY) | Maximum flexibility | The expert *is* the integration; everything is manual |

**Wedge:** OnePlanner is the only tool where *one branded URL* combines (a) booking, (b) the meeting room, (c) a CRDT whiteboard during the session, (d) a per-client record that auto-fills with what just happened, and (e) a practice dashboard. The client never feels handed off; the expert never re-enters anything.

## 5. Scope — v1 MVP

### Always-on capabilities

**Expert account & branding**
- Email sign-up (OAuth post-MVP)
- Profile: name, photo, bio, specialties, languages, timezone, hourly rate
- Public page at `oneplanner.app/<handle>`
- Light/dark theme; accent color

**Session types**
- v1: up to 3 session types per expert (e.g., "Discovery — 30 min", "Strategy — 60 min")
- Per type: duration, description, buffer, rate, color
- Recurring booking option ("every Tuesday for 8 weeks")

**Availability**
- Weekly recurring + one-off blackouts
- Timezone-aware; booking page renders in the client's timezone

**Booking (client-side, no account)**
- Pick a date → pick a slot → enter name + email → confirm
- ICS attachment; reminder emails at 24 h and 10 min

**Live session room (1:1)**
- Browser-only, no install
- WebRTC P2P, TURN fallback
- Mic, camera, screen-share, hang up, text chat
- **Whiteboard tab** (see below)
- "Waiting for <expert>..." screen for early clients
- Branded with the expert's name/photo, not OnePlanner's

**Client profile / mini-CRM (the relationship layer)**
- One record per client, auto-created on first booking
- Timeline view: every past + upcoming session, with notes
- Per-session notes — written *during or after* the session, attached to that session
- Free-form tags ("priority", "renewal due", "trial")
- File attachments per client (PDFs, images)
- Quick-add note from inside the session room
- Manual client entry too (for clients onboarded outside OnePlanner)

**Collaborative whiteboard (the in-session wedge)**
- One whiteboard per session, persists into the client profile
- Real-time, multi-user — built on **Y.js (CRDT)** + **Excalidraw** for the canvas
- Tools: pen, shapes, text, sticky notes, image paste, basic templates
- Re-openable from past sessions — the expert can show a student "here's what we did three weeks ago"
- Mobile-viewable (read-mostly); editing optimized for tablet/desktop

**Practice dashboard (the business layer)**
- Tiles for: sessions this week / month, hours billed, est. revenue (sessions × rate), no-show rate, active-client count
- "Who's lapsing" — clients with no upcoming booking and no session in the last 30 days
- 12-week rolling chart of sessions and hours
- CSV export for accounting

**Notifications**
- Email confirmations, reminders, cancellations (Resend / Postmark)
- Expert notified on every new booking
- Optional pre-session "you have a client in 10 min" desktop push

### Out of scope — v1

- **Payments / charging clients** → v2 (Stripe Connect adds tax, KYC, refund flow complexity)
- **Recording** → v1.5 (local-only, no server storage)
- **Group sessions** → product decision, not in v1
- **Vertical modules** (doctor prescription pad, dietitian meal plan, therapist intake forms, etc.) → §9
- **Mobile native apps** → PWA only
- **LMS integrations**
- **Marketplace / discovery**
- **AI session summaries, smart reschedule suggestions** → v3

## 6. Key flows

### 6.1 Expert onboarding (target: < 10 min to live booking page)
1. Sign up → pick handle
2. Set timezone + weekly availability (smart defaults)
3. Add one session type (pre-filled "30-min consultation")
4. Set rate
5. Copy booking link

### 6.2 Client booking (target: < 90 sec)
1. Open `oneplanner.app/<handle>`
2. Pick session type → date → slot → name + email → confirm
3. Confirmation + ICS in inbox

### 6.3 Running a session (the moment of truth)
1. Expert opens dashboard 5 min before, clicks "Start" on the upcoming card
2. Video room opens with client's profile docked on the right (past sessions, last note, tags)
3. Client clicks "Join" from their reminder → P2P video connects
4. Expert toggles whiteboard mid-session → real-time collaboration → whiteboard auto-saves to the client's timeline
5. Expert types a note in the docked panel during or after; saved against this session

### 6.4 Reviewing a client (the relationship moment)
1. Sidebar → "Clients" → click a client
2. Timeline of every session, each with notes + whiteboard thumbnail
3. "Book next session" CTA pre-fills based on cadence

### 6.5 Reviewing the business
1. Sidebar → "Dashboard"
2. See the week / month tiles, the "lapsing" list, the rolling chart
3. Click a tile to drill down into the session list

## 7. Technical approach

| Layer | Choice | Notes |
| --- | --- | --- |
| Frontend | Next.js static export (existing) | Cloudflare Pages / Vercel free tier |
| Auth | Supabase Auth or Clerk | Generous free tiers |
| DB | Supabase Postgres | Bookings, clients, notes, files, whiteboard refs |
| File storage | Supabase Storage (or R2) | Profile photos, client attachments |
| Realtime signaling | Supabase Realtime | One channel per session for SDP/ICE |
| Video | WebRTC P2P, 1:1 only | No SFU |
| TURN | Twilio / Cloudflare Calls | ~10% of NATs need it |
| **Whiteboard CRDT** | **Y.js + `y-websocket` (self-hosted)** | One Y.Doc per whiteboard; persistence via `y-leveldb` server-side; snapshot to Postgres on session end |
| Whiteboard UI | **Excalidraw** (open source) with a Y.js binding | Established renderer; we only own the sync layer |
| Email | Resend | Confirmations + reminders |
| Cron (reminders) | Cloudflare Worker scheduled trigger | Free tier sufficient |
| Analytics | Computed in-app from Postgres views | No third-party analytics product in v1 |

**Why Y.js + Excalidraw, not OT:** CRDTs converge without a central authoritative server, which matches our static-first posture. Y.js is the most battle-tested library and has a working Excalidraw binding. OT (operational transform) would require a custom transformation function per shape type — too much rope for v1.

**Estimated infra cost at 1k MAU (~10k sessions/mo):** $80–150/mo. Whiteboard sync server is the new line item versus the previous spec.

**Privacy posture:** Media (video/audio) is P2P — never touches OnePlanner servers. Whiteboard state, client notes, and files are stored in our DB. v1 ships with a single region (call it out in the privacy policy).

## 8. Pricing & monetization

| Tier | Price | Key limits |
| --- | --- | --- |
| **Free** | $0 | 5 sessions/mo, OnePlanner branding, no whiteboard, 1 session type, 10 clients |
| **Pro** | **$19/mo** or $190/year | Unlimited sessions, whiteboard, 3 session types, unlimited clients, no branding, `<handle>.oneplanner.app` subdomain, full dashboard |

**Why these numbers**
- $19/mo lands clearly under TutorBird ($25+), TutorCruncher ($40+), HoneyBook ($39+), SimplePractice ($69+).
- The whiteboard cap on free is the single sharpest upgrade trigger — once an expert runs one session and wants a sketch, they're at the wall.
- Session cap of 5/mo lets a part-time expert do a few sessions to validate before paying; a full-time expert hits it inside a week.

**Future revenue lines (v2+):** payment processing fee (Stripe Connect, OnePlanner takes 0.5–1% on top of Stripe), vertical modules ($5–10/mo add-on per module), Studio tier ($39+ for custom domain + multi-expert).

## 9. Vertical extensibility (post-v1, but informs v1 architecture)

The data model should make new verticals shippable without forking the product. v1 doesn't ship any of these, but the model has to accommodate them.

**The pattern:** every client profile has a vertical-agnostic core (timeline, notes, tags, files) plus an optional **module bundle** that adds vertical-specific fields and views.

| Vertical module | Adds | When |
| --- | --- | --- |
| **Fitness training** | Workout plan, rep/weight logs, progress photos | v2 |
| **Language tutoring** | Vocabulary list, level tracker, pronunciation recordings | v2 |
| **Music tutoring** | Repertoire list, practice log, audio attachments | v2 |
| **Sales training** | Roleplay scenarios, scorecards, skill rubric | v2.5 |

**Architecture implication for v1:** the client profile is built as `core fields + a JSON/JSONB "module data" column + a registry of modules`. v1 ships with only the core. Vertical modules are added behind a feature flag, gated by tier or industry.

Example: a fitness trainer would enable the *Fitness* module, which adds a workout-plan tab to each client profile and a per-session rep/weight log. The core (booking, video, whiteboard, dashboard) is unchanged. v1 ships only the core; modules are how we extend into adjacent verticals without forking the product.

## 10. Success metrics

| Stage | Metric | v1 target |
| --- | --- | --- |
| Activation | % of signups who publish booking link + complete one session | 50% within 14 days |
| TTV | Median signup → first session run | < 5 days |
| Engagement | Sessions per active expert per month | 8+ (median) |
| Whiteboard adoption | % of paid sessions using the whiteboard | 40% |
| Client retention | % of clients with ≥2 sessions in 60 days | 50% |
| Conversion | Free → Pro within 60 days | 8% |
| Logo retention | Paid retention at 90 days | 80% |
| Margin | Infra cost per paid expert / month | < $2 |

## 11. Risks & mitigations

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Trying to serve 4 sub-segments dilutes the product | High | Pick one sub-segment for paid acquisition (recommend tutors or trainers); copy/landing pages stay specific |
| Whiteboard scope creep (chasing Miro/Excalidraw feature parity) | High | Use Excalidraw as-is; our only contribution is the Y.js sync layer + session persistence |
| TURN + Y.js sync server eat the free tier | Medium | Rate-limit sessions; usage caps; scale to dedicated TURN/Yjs only when paid traction warrants |
| P2P video fails on flaky networks | Medium | Audio fallback; "network unstable" UX |
| Clients don't trust an unfamiliar tool | Medium | Lean on the expert's brand on every client-facing page |
| Switching cost from existing stack is real | High | Import availability from Calendly; one-click migrate-clients from CSV |

## 12. Roadmap

| Phase | Theme | Concrete bets |
| --- | --- | --- |
| **v1** (target 12 weeks) | Practice OS for experts | Everything in §5 |
| **v1.5** (+3 mo) | Session polish | Local recording, file uploads, recurring bookings (already in v1), whiteboard templates per vertical |
| **v2** (+6 mo) | Money | Stripe Connect: clients pay through OnePlanner; expert auto-invoiced; revenue tile becomes real (no longer manual rate-based estimate) |
| **v2.5** (+9 mo) | Vertical modules | Fitness, Language tutoring, Music tutoring, Sales-training — sold as $5–10/mo add-ons |
| **v3** (+12 mo) | Intelligence | AI session summaries, smart "you should reschedule X" nudges, client-progress reports |
| **v3+** | Studio tier | Multi-expert businesses; custom domain (CNAME); team analytics |

## 13. Open questions

- **Sub-segment to lead acquisition with** — consultants pay more but are scarcer; tutors are easier to acquire (Reddit, FB groups) but lower ACV. Recommend **trainers + consultants** for paid acquisition, **tutors** for SEO/content funnel.
- **Whiteboard persistence cost** — Y.js snapshots can balloon. Cap snapshot size? Garbage-collect after 90 days for free tier?
- **India / non-English markets** — Hindi already in app. If India is a priority, payments need to handle UPI in v2.
- **Custom-domain CNAME** — high-value paid feature; charge separately as a "Studio" add-on, or roll into Pro?
- **What kills the free tier** — is the session cap right? Is the whiteboard-gating right? Watch upgrade-trigger metric closely.
---

## Decisions captured (from spec planning)

- ICP cluster: **consultants, trainers, tutors, coaches** — knowledge-work 1:1 professionals
- Healthcare verticals: **not pursued** (regulatory tax outweighs ROI)
- Call scope: **1:1 only** (no group calls in v1)
- Whiteboard tech: **Y.js (CRDT) + Excalidraw**, not OT
- Monetization: **freemium + single paid tier ($19/mo)**; payments arrive in v2
