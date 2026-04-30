-- migration_001_additive.sql
-- Haywood Hoppers unified schema — additive migration
-- Does NOT touch loyalty_cards, stamp_events, or any existing loyalty flow.
-- Run in Supabase SQL Editor before seed_shops.sql.

-- ─── 1. Extend shops table ────────────────────────────────────────────────────

ALTER TABLE shops
  ADD COLUMN IF NOT EXISTS address         text,
  ADD COLUMN IF NOT EXISTS layer           text,
  ADD COLUMN IF NOT EXISTS haywood_order   int,
  ADD COLUMN IF NOT EXISTS loyalty_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reward_label    text;

-- ─── 2. Fix Rowan Coffee slug (legacy shorthand → wavl-guide canonical id) ───
-- Must run before seed so ON CONFLICT (slug) matches correctly.

UPDATE shops SET slug = 'rowan-coffee' WHERE slug = 'rowan';

-- ─── 3. Passport check-ins ───────────────────────────────────────────────────
-- One check-in per customer per shop, ever (Camino de Santiago model).

CREATE TABLE IF NOT EXISTS passport_checkins (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid        NOT NULL REFERENCES customers(id),
  shop_id       uuid        NOT NULL REFERENCES shops(id),
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT one_checkin_per_shop UNIQUE (customer_id, shop_id)
);

-- ─── 4. Badges ───────────────────────────────────────────────────────────────
-- required_shop_slugs: null = all loyalty shops (True Local).
-- Specific slug array = named subset (e.g. Hygge Five).
-- is_group_reward: reserved, not yet wired.

CREATE TABLE IF NOT EXISTS badges (
  id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text    UNIQUE NOT NULL,
  label               text    NOT NULL,
  description         text,
  required_shop_slugs text[],
  is_group_reward     boolean NOT NULL DEFAULT false
);

-- ─── 5. Customer badges ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS customer_badges (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid        NOT NULL REFERENCES customers(id),
  badge_id    uuid        NOT NULL REFERENCES badges(id),
  earned_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT one_badge_per_customer UNIQUE (customer_id, badge_id)
);

-- ─── 6. Shop admins ──────────────────────────────────────────────────────────
-- is_super = true for Juan (super admin); false for shop owners.

CREATE TABLE IF NOT EXISTS shop_admins (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       uuid        NOT NULL REFERENCES shops(id),
  username      text        NOT NULL,
  password_hash text        NOT NULL,
  is_super      boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ─── Views ───────────────────────────────────────────────────────────────────
-- customer_loyalty_summary and customer_passport_progress are intentionally
-- deferred to a future migration. They reference loyalty_stamps and
-- loyalty_rewards (Phase 2 tables not yet created) and have no callers yet.
