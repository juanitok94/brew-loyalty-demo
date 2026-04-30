# Haywood Hoppers — Group Loyalty Platform
## Project Handoff Document
**Owner:** Juan (Peachy Kean DevOps LLC) / juanitok94  
**Business Stakeholder:** Audrie Blomquist, Odd's Cafe, West Asheville NC  
**Date:** April 29, 2026  
**Status:** Migration complete, 49 shops seeded, env var pattern implemented — Rowan fix pending

---

## Context

Audrie Blomquist (Odd's Cafe) introduced Juan Kean to Alice Oglesby (Moonio Media)
via email on April 13, 2026. The conversation surfaced a business case for a
group loyalty program across independent coffee shops on Haywood Road,
West Asheville — starting with the infrastructure Juan already built.

---

## Completed Milestones (as of April 29, 2026)

- `migration_001_additive.sql` ran successfully against Supabase
- 49 shops seeded into `shops` table (from `wavl-guide/shops.json`)
- `odds-cafe` row: `loyalty_enabled = true`
- `rowan` slug renamed to `rowan-coffee` to match wavl-guide data
- `NEXT_PUBLIC_SHOP_SLUG` env var pattern implemented in `brew-loyalty-mvp`
  — each Vercel deployment sets its own slug; no shop slug is hardcoded in app code

---

## Two Existing Apps (Both Live on Vercel)

### 1. brew-loyalty-mvp
- **Repo:** https://github.com/juanitok94/brew-loyalty-mvp
- **Live:** https://brew-loyalty-mvp.vercel.app
- **Stack:** Next.js 15, TypeScript, Tailwind CSS 4, App Router, Supabase (Postgres)
- **What it does:** Per-shop digital stamp card loyalty program
- **Identity:** Phone number (customer-facing, no app download required)
- **Admin:** Password-protected per-shop dashboard
- **Current shops:** Odd's Cafe (active), Rowan Coffee (separate repo — see below)
- **Env var pattern:** `NEXT_PUBLIC_SHOP_SLUG` implemented — each deployment reads its slug from env, no hardcoding
- **Reward logic:** Buy N drinks → get 1 free (Odds = 9 stamps)
- **Note:** README references JSON flat file — that is outdated.
  App is fully migrated to Supabase Postgres.

### 1b. brew-loyalty-mvp-2 (Rowan Coffee — separate Vercel deployment)
- **Repo:** separate repo from brew-loyalty-mvp (forked/cloned for Rowan)
- **Status:** Needs the same `NEXT_PUBLIC_SHOP_SLUG` env var fix applied
- **Slug:** `rowan-coffee`
- **Warning:** This repo contains `design-system/` and `docs/` folders that are
  Rowan-specific. **Do not touch those folders.** Only apply the env var pattern
  to app code (the same surgical change made in brew-loyalty-mvp).

### 2. wavl-guide (Haywood Hoppers)
- **Repo:** https://github.com/juanitok94/wavl-guide
- **Live:** https://wavl-guide.vercel.app
- **Stack:** Next.js 16 (Turbopack), TypeScript, Tailwind CSS 4
- **What it does:** Neighborhood guide and passport game for Haywood Road.
  Camino de Santiago model — collect stamps at 10 core coffee stops,
  earn your True Local badge.
- **Data:** Static JSON (`shops.json` — 49 stops, 9 layers), `layers.json`,
  `badges.json`, `trivia.json`
- **Identity:** localStorage only — NO server-side customer identity
- **Current stamp state:** Lives in browser. Clearing localStorage loses progress.
- **Note:** This is the critical gap. No phone number, no Supabase, no persistence.

---

## Agreed Integration Strategy

### Phase 1 — Connect (do first, low risk)
Add one API route to brew-loyalty:
`POST /api/passport/checkin` — accepts `{ phone, shop_slug }`

wavl-guide calls this when a customer checks in at a stop.
Passport state moves from localStorage → Supabase.
Both apps stay as separate Vercel deployments.

### Phase 2 — Merge (after pilot is proven)
One Next.js app, one Supabase, one Vercel deployment.
wavl-guide's shop data and passport UI + brew-loyalty's loyalty engine, unified.
Do this when pilot shops (Odds + 2–3 Haywood shops) are confirmed
and stamp/reward logic is stable.

**Do not rush the merge.** wavl-guide's 49-stop data model is still
evolving. Connect first, merge when the product shape is clear.

---

## Pilot Shop Plan

- **Confirmed loyalty shops:** Odd's Cafe, (Rowan Coffee — test only, not a
  first-choice pilot partner)
- **Target pilot shops:** Battlecat Coffee Bar, Flora & Forage
  (neither has a website currently — outreach needed)
- **Geography:** Haywood Road first, broader Asheville area later
- **Proven speed:** A new shop tenant (Rowan) was stood up in under 1 hour
  using Claude + existing multi-tenant architecture

---

## Reward Model

### Per-shop loyalty (buying)
- Customer buys drinks at a specific shop
- Stamps tracked in `loyalty_stamps` table
- After N stamps → free drink at that shop
- Each shop funds their own rewards
- Threshold configurable per shop (`stamps_required` column)

### Cross-shop passport (visiting)
- Customer checks in at a shop (separate from buying)
- One check-in per shop ever (Camino model)
- Tracked in `passport_checkins` table
- Earns badges (True Local, Hygge Five, etc.)
- Collective/group reward mechanic: flag reserved (`is_group_reward`
  on `badges` table), not yet wired

---

## Agreed Database Schema

### Design Decisions
- `loyalty_stamps` and `passport_checkins` are **separate tables**
  (buying ≠ visiting — different triggers, different admin flows)
- `current_stamps` uses **modulo math** against `stamps_required`
- Passport check-in has a **unique constraint** per customer per shop
  (one stamp per shop ever)
- `required_shop_slugs text[]` on badges — Hygge Five lists exactly
  those 5 slugs; True Local = null (all loyalty shops)
- `is_group_reward boolean` on badges — placeholder, not wired yet
- `email` on customers is **nullable** — phone required, email optional
- `is_super boolean` on `shop_admins` — Juan = true, shop owners = false

### Schema

```sql
create table shops (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  address         text,
  layer           text,
  haywood_order   int,
  loyalty_enabled boolean not null default false,
  stamps_required int not null default 9,
  reward_label    text,
  created_at      timestamptz not null default now()
);

create table customers (
  id          uuid primary key default gen_random_uuid(),
  phone       text unique not null,
  email       text unique,
  created_at  timestamptz not null default now()
);

create table loyalty_stamps (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  shop_id     uuid not null references shops(id),
  stamped_at  timestamptz not null default now(),
  approved_by text
);

create table loyalty_rewards (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  shop_id     uuid not null references shops(id),
  redeemed_at timestamptz not null default now(),
  approved_by text
);

create table passport_checkins (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references customers(id),
  shop_id       uuid not null references shops(id),
  checked_in_at timestamptz not null default now(),
  constraint one_checkin_per_shop unique (customer_id, shop_id)
);

create table badges (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  label               text not null,
  description         text,
  required_shop_slugs text[],
  is_group_reward     boolean not null default false
);

create table customer_badges (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  badge_id    uuid not null references badges(id),
  earned_at   timestamptz not null default now(),
  constraint one_badge_per_customer unique (customer_id, badge_id)
);

create table shop_admins (
  id            uuid primary key default gen_random_uuid(),
  shop_id       uuid not null references shops(id),
  username      text not null,
  password_hash text not null,
  is_super      boolean not null default false,
  created_at    timestamptz not null default now()
);
```

### Views

```sql
create view customer_loyalty_summary as
select
  c.id as customer_id,
  c.phone,
  s.id as shop_id,
  s.slug,
  s.name as shop_name,
  s.stamps_required,
  count(ls.id) as total_stamps,
  count(lr.id) as total_redeems,
  count(ls.id) % s.stamps_required as current_stamps,
  floor(count(ls.id) / s.stamps_required) as rewards_available
from customers c
cross join shops s
left join loyalty_stamps ls
  on ls.customer_id = c.id and ls.shop_id = s.id
left join loyalty_rewards lr
  on lr.customer_id = c.id and lr.shop_id = s.id
where s.loyalty_enabled = true
group by c.id, c.phone, s.id, s.slug, s.name, s.stamps_required;

create view customer_passport_progress as
select
  c.id as customer_id,
  c.phone,
  count(pc.id) as shops_visited,
  array_agg(s.slug) filter (where pc.id is not null) as visited_slugs
from customers c
cross join shops s
left join passport_checkins pc
  on pc.customer_id = c.id and pc.shop_id = s.id
group by c.id, c.phone;
```

---

## Task Queue (ordered)

### ✅ Done
1. Run `migration_001_additive.sql` against Supabase
2. Seed 49 shops from `wavl-guide/shops.json`
3. Set `odds-cafe` `loyalty_enabled = true`
4. Rename `rowan` slug → `rowan-coffee`
5. Implement `NEXT_PUBLIC_SHOP_SLUG` env var pattern in `brew-loyalty-mvp`

### 🔲 Next: Apply env var fix to brew-loyalty-mvp-2 (Rowan)
- Open `brew-loyalty-mvp-2` repo
- Apply the same `NEXT_PUBLIC_SHOP_SLUG` change that was made in `brew-loyalty-mvp`
- Do NOT touch `design-system/` or `docs/` — those are Rowan-owned assets
- Set `NEXT_PUBLIC_SHOP_SLUG=rowan-coffee` in Vercel env for that deployment
- Verify admin and card pages resolve correctly for Rowan

### 🔲 After that: POST /api/passport/checkin bridge
- Add route to `brew-loyalty-mvp`: `POST /api/passport/checkin`
- Accepts `{ phone, shop_slug }`
- Upserts customer (by phone), records a row in `passport_checkins`
- Returns `{ success, already_visited, shops_visited }`
- `wavl-guide` calls this on check-in; passport state moves from localStorage → Supabase

**The slug is the join key across everything.
It was seeded correctly from wavl-guide's source data — never change it.**

---

## People

| Person | Role | Contact |
|---|---|---|
| Juan Kean | Developer, DBA, architect | juanitok94, john@peachykeandev.com |
| Audrie Blomquist | Business owner, Odd's Cafe | audrie@oddscafe.com |
| Alice Oglesby | Connector, Moonio Media | aliceio@mooniomedia.com |

---

## Repo / Infra Summary

| Item | Value |
|---|---|
| brew-loyalty repo | github.com/juanitok94/brew-loyalty-mvp |
| wavl-guide repo | github.com/juanitok94/wavl-guide |
| Database | Supabase Postgres (brew-loyalty project) |
| Hosting | Vercel (both apps, separate deployments) |
| Auth pattern | Phone number + password-protected admin |
| Super admin | Juan (is_super = true) |