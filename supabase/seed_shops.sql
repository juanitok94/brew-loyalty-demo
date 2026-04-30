-- seed_shops.sql
-- Upsert all 49 wavl-guide shops into the shops table.
-- Source: C:\wavl-guide\src\data\shops.json
--
-- Mapping:  shops.json id         → slug          (canonical join key — never change)
--           shops.json name        → name
--           shops.json address     → address
--           shops.json layers[0]   → layer
--           shops.json passportStop → haywood_order (null for non-core stops)
--
-- ON CONFLICT: updates name/address/layer/haywood_order only.
-- loyalty_enabled and stamps_required are excluded from the UPDATE clause
-- to preserve live production values on re-runs.
--
-- After upsert: a targeted UPDATE sets odds-cafe loyalty_enabled = true.
-- Run migration_001_additive.sql first.

INSERT INTO shops (slug, name, address, layer, haywood_order, loyalty_enabled, stamps_required)
VALUES
  ('cooperative-coffee-roasters', 'Cooperative Coffee Roasters',   '210 Haywood Rd',  'coffee',   1,    false, 9),
  ('short-street-cakes',          'Short Street Cakes',             '225 Haywood Rd',  'bakery',   null, false, 9),
  ('archetype-brewing',           'Archetype Brewing',              '265 Haywood Rd',  'bars',     null, false, 9),
  ('smokey-bear-hemp',            'Smokey Bear Hemp Co.',           '278 Haywood Rd',  'cannabis', null, false, 9),
  ('gan-shan-west',               'Gan Shan West',                  '285 Haywood Rd',  'food',     null, false, 9),
  ('heron-mark-tattoo',           'Heron Mark Tattoo',              '290 Haywood Rd',  'tattoo',   null, false, 9),
  ('owl-bakery',                  'OWL Bakery',                     '295 Haywood Rd',  'coffee',   null, false, 9),
  ('battlecat-coffee-bar',        'BattleCat Coffee Bar',           '373 Haywood Rd',  'coffee',   2,    false, 9),
  ('cellarest-beer-project',      'Cellarest Beer Project',         '395 Haywood Rd',  'bars',     null, false, 9),
  ('walk',                        'W.A.L.K.',                       '401 Haywood Rd',  'bars',     null, false, 9),
  ('harvest-records',             'Harvest Records',                '415 Haywood Rd',  'books',    null, false, 9),
  ('flora-forage',                'Flora & Forage',                 '428 Haywood Rd',  'coffee',   3,    false, 9),
  ('bagatelle-books',             'Bagatelle Books',                '428 Haywood Rd',  'books',    null, false, 9),
  ('early-girl-eatery',           'Early Girl Eatery',              '444 Haywood Rd',  'food',     null, false, 9),
  ('emote',                       'EMOTE',                          '444 Haywood Rd',  'clothing', null, false, 9),
  ('asheville-kava-coffee',       'Asheville Kava X Coffee',        '487 Haywood Rd',  'coffee',   null, false, 9),
  ('the-whale',                   'The Whale — A Craft Beer Collective', '507 Haywood Rd', 'bars', null, false, 9),
  ('haywood-common',              'Haywood Common',                 '507 Haywood Rd',  'food',     null, false, 9),
  ('haywood-famous',              'Haywood Famous',                 '508 Haywood Rd',  'coffee',   4,    false, 9),
  ('one-world-brewing',           'One World Brewing West',         '520 Haywood Rd',  'bars',     null, false, 9),
  ('woodland-tattoo',             'Woodland Tattoo & Talismans',    'Haywood Rd',      'tattoo',   null, false, 9),
  ('seven-swords-tattoo',         'Seven Swords Tattoo Company',    'Haywood Rd',      'tattoo',   null, false, 9),
  ('hail-mary',                   'Hail Mary',                      '575 Haywood Rd',  'food',     null, false, 9),
  ('chlorophyll',                 'Chlorophyll',                    '585 Haywood Rd',  'plants',   null, false, 9),
  ('deep-time-coffee',            'Deep Time Coffee',               '587 Haywood Rd',  'coffee',   null, false, 9),
  ('local-604-bottle-shop',       'Local 604 Bottle Shop',          '604 Haywood Rd',  'bars',     null, false, 9),
  ('girl-and-goblin',             'Girl & Goblin',                  '610 Haywood Rd',  'tattoo',   null, false, 9),
  ('oyster-house-brewing',        'Oyster House Brewing Company',   '625 Haywood Rd',  'bars',     null, false, 9),
  ('west-avl-street-market',      'West AVL Street Market',         '662 Haywood Rd',  'clothing', null, false, 9),
  ('twice-round-vintage',         'Twice Round Vintage',            '667 Haywood Rd',  'clothing', null, false, 9),
  ('bad-manners-coffee',          'Bad Manners Coffee',             '697 Haywood Rd',  'coffee',   5,    false, 9),
  ('revolve',                     'rEvolve Buy+Sell+Trade',         '697 Haywood Rd',  'clothing', null, false, 9),
  ('dobra-tea-house',             'Dobra Tea House',                '707 Haywood Rd',  'coffee',   null, false, 9),
  ('bebop-bottle-shop',           'Bebop Bottle Shop',              '723 Haywood Rd',  'bars',     null, false, 9),
  ('reciprocity',                 'Reciprocity',                    '732 Haywood Rd',  'clothing', null, false, 9),
  ('west-end-bakery',             'The West End Bakery',            '757 Haywood Rd',  'bakery',   10,   false, 9),
  ('the-brew-pump',               'The Brew Pump',                  '760 Haywood Rd',  'bars',     null, false, 9),
  ('westville-pub',               'Westville Pub',                  '777 Haywood Rd',  'bars',     null, false, 9),
  ('rowan-coffee',                'Rowan Coffee',                   '785 Haywood Rd',  'coffee',   6,    false, 9),
  ('character-study',             'Character Study',                '797 Haywood Rd',  'bars',     null, false, 9),
  ('odds-cafe',                   'Odd''s Cafe',                    '800 Haywood Rd',  'coffee',   7,    false, 9),
  ('plant-bar',                   'Plant Bar',                      '919 Haywood Rd',  'coffee',   8,    false, 9),
  ('asheville-dispensary',        'Asheville Dispensary',           '919 Haywood Rd',  'cannabis', null, false, 9),
  ('izzys-coffee-house',          'Izzy''s Coffee House',           '976 Haywood Rd',  'coffee',   9,    false, 9),
  ('firestorm-books-coffee',      'Firestorm Books & Coffee',       '1022 Haywood Rd', 'coffee',   null, false, 9),
  ('diatribe-brewing',            'Diatribe Brewing Co.',           '1042 Haywood Rd', 'bars',     null, false, 9),
  ('mocha-box-coffee',            'Mocha Box Coffee',               '1050 Haywood Rd', 'coffee',   null, false, 9),
  ('leos-house-of-thirst',        'Leo''s House of Thirst',         '1055 Haywood Rd', 'bars',     null, false, 9),
  ('drawing-board-tattoo',        'Drawing Board Tattoo',           '1061 Haywood Rd', 'tattoo',   null, false, 9)
ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  address       = EXCLUDED.address,
  layer         = EXCLUDED.layer,
  haywood_order = EXCLUDED.haywood_order;
  -- loyalty_enabled and stamps_required intentionally excluded:
  -- existing rows keep their live production values on re-runs.

-- ─── Set loyalty flag for active production tenant ────────────────────────────

UPDATE shops SET loyalty_enabled = true WHERE slug = 'odds-cafe';

-- ─── Verify ───────────────────────────────────────────────────────────────────
-- Run after both files to confirm results:
--
-- SELECT slug, name, loyalty_enabled, haywood_order
-- FROM shops
-- ORDER BY haywood_order NULLS LAST, slug;
--
-- Expected: 49 rows total
--           odds-cafe:    loyalty_enabled = true,  haywood_order = 7
--           rowan-coffee: loyalty_enabled = false, haywood_order = 6
--           slug 'rowan' no longer exists
