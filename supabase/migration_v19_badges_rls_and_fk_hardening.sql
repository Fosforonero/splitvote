-- migration_v19_badges_rls_and_fk_hardening.sql
--
-- Fixes the root cause of the dashboard crash (digests 2512231454 + 1932806716):
-- the `badges` table had RLS enabled with zero policies, so every join
-- `badges(...)` from the dashboard returned `null` for authenticated users.
-- The defensive `filter(b => b.badges != null)` in app code masks the crash
-- but leaves every dashboard with an empty badge collection.
--
-- This migration:
--   1. Adds a public-readable SELECT policy on `badges` (it's a definitions
--      table — name/emoji/rarity/description — no PII, safe to expose).
--   2. Tightens user_badges.badge_id FK from `NO ACTION` to `ON DELETE CASCADE`
--      so deleting a badge definition automatically cleans up user_badges
--      rows. Prevents future FK orphan scenarios without relying on app-level
--      defensive filtering.
--   3. (Optional, commented) Cleanup query for any pre-existing orphan rows
--      in user_badges — verified empty at migration write time (16 May 2026)
--      so the query is left commented as documentation only.
--
-- Run this with service_role access (Supabase SQL Editor with admin privileges).
-- Verify after applying with the SELECT queries at the bottom.

-- ── 1. Public SELECT policy on badges ─────────────────────────────────────────
-- badges holds the public definition of every trophy (id, name, emoji, rarity,
-- description). The same data is hard-coded in product copy / marketing — there
-- is no reason to hide it from authenticated or anonymous users.

CREATE POLICY "Anyone can read badge definitions"
  ON public.badges
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── 2. ON DELETE CASCADE on user_badges.badge_id ─────────────────────────────
-- Drop the existing FK and recreate it with the safer delete rule.
-- This is idempotent-safe (constraint name is preserved by the recreate).

ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_badge_id_fkey;

ALTER TABLE public.user_badges
  ADD CONSTRAINT user_badges_badge_id_fkey
  FOREIGN KEY (badge_id)
  REFERENCES public.badges(id)
  ON DELETE CASCADE;

-- ── 3. Orphan cleanup (commented — 0 orphan rows at migration write time) ────
-- Uncomment and run if `SELECT COUNT(*) FROM user_badges ub LEFT JOIN badges b
-- ON b.id = ub.badge_id WHERE b.id IS NULL;` ever returns > 0.
--
-- DELETE FROM public.user_badges
-- WHERE badge_id NOT IN (SELECT id FROM public.badges);

-- ── 4. Verification (run after applying) ─────────────────────────────────────
-- a) Confirm the policy exists and is permissive:
--    SELECT polname, polroles::regrole[] AS roles, polcmd, polqual
--    FROM pg_policy WHERE polrelid = 'public.badges'::regclass;
--
-- b) Confirm FK now cascades:
--    SELECT tc.constraint_name, rc.delete_rule
--    FROM information_schema.table_constraints tc
--    JOIN information_schema.referential_constraints rc
--      ON tc.constraint_name = rc.constraint_name
--    WHERE tc.constraint_name = 'user_badges_badge_id_fkey';
--    -- Expected: delete_rule = 'CASCADE'
--
-- c) Confirm authenticated users can read badges:
--    SET ROLE authenticated;
--    SELECT count(*) FROM public.badges;
--    -- Expected: > 0 (was 0 before this migration)
--    RESET ROLE;
