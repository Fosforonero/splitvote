-- ═════════════════════════════════════════════════════════════════════════════
-- SESSION 16 MAY 2026 — APPLY BUNDLE (4 operations)
-- ═════════════════════════════════════════════════════════════════════════════
--
-- Bundle of all 4 DB operations the PM authorized this session that Claude
-- Code could not apply directly via Supabase MCP (auto-mode classifier
-- requires per-action approval at write time and rejected the bulk grant).
--
-- COPY THIS WHOLE FILE → paste into Supabase dashboard → SQL Editor → Run.
-- Sections are wrapped in an explicit transaction so they apply together or
-- not at all. Verification queries follow each section as comments.
--
-- After applying, refresh /dashboard logged in as a regular user — you
-- should see the user's badge collection populated again (was empty for
-- every authenticated user due to RLS-without-policies on badges).

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. v19: badges RLS policy (root cause of dashboard empty badges)
-- ─────────────────────────────────────────────────────────────────────────────
-- Cause: badges table had RLS enabled with ZERO policies, so any join
--   badges(...) returned null for authenticated users. The defensive
--   .filter(b => b.badges != null) in app code stopped the crash but left
--   every dashboard with an empty badge collection.

CREATE POLICY "Anyone can read badge definitions"
  ON public.badges
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. v19: user_badges.badge_id FK hardening (NO ACTION → ON DELETE CASCADE)
-- ─────────────────────────────────────────────────────────────────────────────
-- Preventive: 0 orphan rows at write time, but safer to cascade on future
-- badge definition deletes.

ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_badge_id_fkey;

ALTER TABLE public.user_badges
  ADD CONSTRAINT user_badges_badge_id_fkey
  FOREIGN KEY (badge_id)
  REFERENCES public.badges(id)
  ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Admin grant for alphablacklady83
-- ─────────────────────────────────────────────────────────────────────────────
-- Guarded: skips if user is already super_admin (won't downgrade).

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'alphablacklady83@gmail.com'
  AND role <> 'super_admin';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. v20 sec 1: dilemma_feedback_stats view → security_invoker
-- ─────────────────────────────────────────────────────────────────────────────
-- Was SECURITY DEFINER (bypasses caller RLS). security_invoker makes the
-- view honour the caller's RLS on the underlying tables — safer for
-- admin-facing stats surfaces.

ALTER VIEW public.dilemma_feedback_stats
  SET (security_invoker = true);

COMMIT;

-- ═════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES — run after the COMMIT above
-- ═════════════════════════════════════════════════════════════════════════════

-- 1. badges policy exists
SELECT polname, polroles::regrole[] AS roles, polcmd
FROM pg_policy
WHERE polrelid = 'public.badges'::regclass;
-- Expected: 1 row, polname = 'Anyone can read badge definitions',
--           roles = {anon, authenticated}, polcmd = 'r' (SELECT)

-- 2. FK now CASCADE
SELECT tc.constraint_name, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_name = 'user_badges_badge_id_fkey';
-- Expected: delete_rule = 'CASCADE'

-- 3. alphablacklady83 role
SELECT email, role FROM public.profiles
WHERE email = 'alphablacklady83@gmail.com';
-- Expected: role = 'admin' (or 'super_admin' if she was already promoted)

-- 4. view is now security_invoker
SELECT relname,
       (SELECT option_value FROM pg_options_to_table(c.reloptions)
        WHERE option_name = 'security_invoker') AS security_invoker
FROM pg_class c
WHERE relname = 'dilemma_feedback_stats';
-- Expected: security_invoker = 'true'

-- 5. Smoke check — authenticated user can now read badges
SET ROLE authenticated;
SELECT count(*) FROM public.badges;
-- Expected: > 0 (was 0 before this bundle)
RESET ROLE;
