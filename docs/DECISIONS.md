# DECISIONS.md
## BrewLoyalty — Decision Log

> Anti-amnesia system. Every decision that cost time goes here.
> When in doubt, check here before re-deciding.

**Last Updated:** May 2026

---

## Scan Flow

### Native iPhone camera over in-app QR scanner
- Faster and more reliable than any JS scanner library
- Zero code, zero dependency, zero maintenance
- Works on all modern iPhones out of the box
- Trade-off: Android behavior varies — acceptable for MVP (Odd's Cafe is iPhone-heavy)

### QR encodes a full URL (not a code or token)
- Camera auto-opens Safari without any intermediate step
- URL routes directly to the correct page (admin or customer)
- Simpler than encoding an ID and resolving it server-side
- Trade-off: URL exposed in QR — acceptable, no sensitive data in URL

---

## Data & State

### Supabase (Postgres) as data store — LanceDB retired
- LanceDB was the original MVP data store; retired after Supabase migration
- Supabase chosen for: managed Postgres, Auth, Row Level Security, good dashboard, easy solo operator workflow
- **Why Postgres over LanceDB:** Stronger durability, relational model, multi-location reporting, multi-tenant SaaS growth
- All data access still goes through `src/lib/stamps.ts` only — API routes and pages were not changed
- **Current schema:**
  - `customers` — id, phone, nickname, location_id, stamps, redeemed_count, last_visit, created_at
  - `stamp_transactions` — id, customer_id, action, stamp_delta, resulting_stamps, created_at
  - `locations` — id, slug, name, stamp_target, reward_text, created_at

### stamps.ts as the only data access layer
- Pages never import from DB directly
- One file to swap if we change backends — already migrated from LanceDB → Supabase/Postgres behind this boundary
- Rule: all DB calls go through `src/lib/stamps.ts`, nothing else

### Stamp target = 9
- Set based on Odd's Cafe context (Audrie's preference)
- Not hardcoded in UI — confirm with Audrie before changing
- Should be configurable per location in V2

---

## Real-Time vs. Polling

### Polling every 5 seconds over WebSockets or SSE
- Simpler to implement and maintain
- 5s lag is invisible to users in practice (barista stamps → customer looks down)
- WebSockets add server complexity with no meaningful UX benefit at this scale
- Re-evaluate only if lag becomes a real complaint from baristas or customers

---

## Identity & Auth

### Customer identity: nickname + last 4 digits of phone
- Full phone number is not stored or displayed — only last 4 digits used for lookup
- Nickname (min 3 chars) provides a human-readable display name and is required at signup
- Combined lookup key: `nickname + last4` — collision unlikely in practice at single-location scale
- **Collision handling:** if two customers share the same nickname + last 4 (e.g. two "Sam" with phones ending in 1234), the first registered record is returned. At pilot scale this is acceptable. If collisions become real, append a disambiguator (e.g. nickname + last 4 + created_at tiebreak) without changing the lookup UX.
- Trade-off: slightly more signup friction than phone-only, but eliminates full phone exposure and feels more personal to the customer

### T&C checkbox required at signup
- Customers must check a Terms & Conditions checkbox before submitting the signup form
- Required for basic legal coverage before pilot goes beyond Odds Cafe
- T&C page exists at `/terms` — linked from the checkbox label
- No acceptance timestamp stored in MVP; add to `customers` table if legal requires it later

### Single shared admin password (no per-user auth)
- Audrie is the only admin at MVP
- Adding user accounts adds complexity with zero V1 benefit
- Password lives in Vercel env var only — never in code or git
- Re-evaluate for V2 if multi-barista or franchise model emerges

---

## Frontend

### PWA over native app
- No App Store, no install friction for customers
- Baristas bookmark the admin URL — no install needed
- Trade-off: no push notifications without extra work — not needed for V1

### Official logo over emoji placeholders
- Completed during MVP polish before Audrie demo
- Sets professional tone for client presentation

---

## Business

### Pilot with Odd's Cafe before productizing
- Real-world validation shaped the UX (especially scan flow and polling interval)
- NDA in progress — formalizes the relationship before V1.1 handoff

### SaaS model ($29–$59/mo), not project fee
- Recurring revenue is the goal, not one-time builds
- Odd's Cafe is the proof point — then expand to other SMB cafes

### locationId as human-readable slug (e.g. `odds`)
- Easier to debug in logs and DB than UUIDs
- Convention: short lowercase café name slug
- Multi-location is additive — add new slugs, existing data untouched

---

## AI Tooling

### CLAUDE.md auto-loaded by Claude Code
- Eliminates re-explaining the project at session start
- Keep it under one page — full context in PROJECT-BRAIN.md

### Docs in `/docs` are the source of truth, not chat history
- Chat history is ephemeral and scattered across tools
- If a decision was made in chat but not written here, it doesn't count
- Rule: after any AI session that produces a decision, update this file
