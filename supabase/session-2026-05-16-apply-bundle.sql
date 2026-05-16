-- ═════════════════════════════════════════════════════════════════════════════
-- SESSION 16 MAY 2026 — APPLY BUNDLE (full audit fix-up)
-- ═════════════════════════════════════════════════════════════════════════════
--
-- Single file ready to paste into Supabase dashboard → SQL Editor → Run.
-- Wraps every operation in one transaction so the bundle applies atomically
-- or not at all. Each section is documented inline.
--
-- Scope:
--   1. v19 — badges RLS policy (closes dashboard root cause)
--   2. v19 — user_badges FK → CASCADE (preventive)
--   3. Admin grant for alphablacklady83
--   4. v20 §1 — dilemma_feedback_stats view → security_invoker
--   5. v20 §2 — 7 functions: pin search_path = (public, pg_temp)
--   6. v20 §3 — revoke EXECUTE on 2 trigger functions from anon/authenticated
--   7. v20 §4 — document intent on 5 RPC-intended SECURITY DEFINER functions
--   8. v20 §6 — document RLS-no-policy intent on role_audit_log + stripe_webhook_events
--   9. v20 §7 — document profiles role-update policy (advisor false positive)
--
-- Not included (require separate decisions / not SQL):
--   - v20 §5: poll_votes "Anyone can insert votes" — pick Option A or B first.
--   - v20 §8: leaked_password_protection — dashboard toggle (Auth → Settings).

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. v19 §1: badges RLS policy
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can read badge definitions"
  ON public.badges
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. v19 §2: user_badges.badge_id FK → CASCADE
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_badge_id_fkey;

ALTER TABLE public.user_badges
  ADD CONSTRAINT user_badges_badge_id_fkey
  FOREIGN KEY (badge_id)
  REFERENCES public.badges(id)
  ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Admin grant for alphablacklady83 (guarded against super_admin downgrade)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'alphablacklady83@gmail.com'
  AND role <> 'super_admin';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. v20 §1: dilemma_feedback_stats view → security_invoker
-- ─────────────────────────────────────────────────────────────────────────────
ALTER VIEW public.dilemma_feedback_stats
  SET (security_invoker = true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. v20 §2: pin search_path on 7 SECURITY DEFINER functions
-- ─────────────────────────────────────────────────────────────────────────────
ALTER FUNCTION public.award_mission_xp(p_user_id uuid, p_mission_id text)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.enforce_role_immutability_fn()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.set_updated_at()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.increment_poll_vote(p_poll_id uuid, p_option character)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.increment_user_vote_count(p_user_id uuid)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.check_and_award_badges(p_user_id uuid)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.update_stripe_webhook_events_updated_at()
  SET search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. v20 §3: revoke EXECUTE on trigger-only functions
-- ─────────────────────────────────────────────────────────────────────────────
-- These run as triggers; they don't need to be callable via /rest/v1/rpc/.
-- Revoking EXECUTE doesn't affect trigger firing.
REVOKE EXECUTE ON FUNCTION public.enforce_role_immutability_fn() FROM anon;
REVOKE EXECUTE ON FUNCTION public.enforce_role_immutability_fn() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. v20 §4: document intent on RPC-intended SECURITY DEFINER functions
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON FUNCTION public.award_mission_xp(uuid, text) IS
  'Server-mediated mission XP award. SECURITY DEFINER required to update '
  'profiles.xp regardless of caller RLS. Caller identity validated by the '
  'API route (app/api/missions/complete) before this function is invoked.';

COMMENT ON FUNCTION public.check_and_award_badges(uuid) IS
  'Server-mediated badge award. SECURITY DEFINER required to read profile '
  'stats and INSERT into user_badges regardless of caller RLS. Caller '
  'identity validated upstream.';

COMMENT ON FUNCTION public.increment_user_vote_count(uuid) IS
  'Server-mediated vote count + streak update. SECURITY DEFINER required '
  'to bypass profiles RLS. Also awards streak milestone badges in the same '
  'transaction. Called only from app/api/vote after vote success.';

COMMENT ON FUNCTION public.increment_poll_vote(uuid, character) IS
  'Anonymous-callable poll vote increment. SECURITY DEFINER to bypass '
  'poll_votes RLS. Rate limiting + dedup happens at the API edge via Redis.';

COMMENT ON FUNCTION public.upsert_vote_daily_stat(date, text, character, boolean) IS
  'Server-mediated daily vote stats upsert. SECURITY DEFINER to write '
  'vote_daily_stats regardless of caller. Called from app/api/vote.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. v20 §6: document intentional RLS-no-policy tables
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE public.role_audit_log IS
  'Admin role assignment audit trail. RLS enabled with NO policies '
  'intentionally — written only via service_role from /api/admin/roles. '
  'Anon/authenticated reads/writes are correctly blocked by zero policies.';

COMMENT ON TABLE public.stripe_webhook_events IS
  'Stripe webhook idempotency guard. RLS enabled with NO policies '
  'intentionally — written only via service_role from /api/stripe/webhook. '
  'Anon/authenticated reads/writes are correctly blocked by zero policies.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. v20 §7: document advisor false-positive on profiles role-update policy
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON POLICY "Only super_admin can update role" ON public.profiles IS
  'USING (true) is intentional — the role-change guard lives in the '
  'WITH CHECK clause and is reinforced by trigger '
  'enforce_role_immutability_fn. Together they prevent any non-service-role '
  'client from escalating their role.';

COMMIT;

-- ═════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES — run after the COMMIT above
-- ═════════════════════════════════════════════════════════════════════════════

-- 1. badges policy exists
SELECT polname, polroles::regrole[] AS roles, polcmd
FROM pg_policy
WHERE polrelid = 'public.badges'::regclass;
-- Expected: 1 row, polname = 'Anyone can read badge definitions', roles = {anon,authenticated}

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
-- Expected: role = 'admin' (or 'super_admin' if pre-existing)

-- 4. view is security_invoker
SELECT relname,
       (SELECT option_value FROM pg_options_to_table(c.reloptions)
        WHERE option_name = 'security_invoker') AS security_invoker
FROM pg_class c WHERE relname = 'dilemma_feedback_stats';
-- Expected: security_invoker = 'true'

-- 5. 7 functions have pinned search_path
SELECT proname, proconfig
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'award_mission_xp','enforce_role_immutability_fn','set_updated_at',
    'increment_poll_vote','increment_user_vote_count',
    'check_and_award_badges','update_stripe_webhook_events_updated_at')
ORDER BY proname;
-- Expected: every row's proconfig contains 'search_path=public, pg_temp'

-- 6. trigger functions no longer EXECUTE-grantable to anon/authenticated
SELECT p.proname, r.rolname AS still_granted
FROM pg_proc p
JOIN aclexplode(p.proacl) ax ON true
JOIN pg_roles r ON r.oid = ax.grantee
WHERE p.proname IN ('enforce_role_immutability_fn','handle_new_user')
  AND r.rolname IN ('anon','authenticated');
-- Expected: 0 rows

-- 7. Smoke check — authenticated user can read badges
SET ROLE authenticated;
SELECT count(*) FROM public.badges;
-- Expected: > 0 (was 0 before this bundle)
RESET ROLE;

-- 8. Re-run advisor to confirm errors/warnings dropped
-- (open Supabase dashboard → Database → Linter; should see:
--   - rls_enabled_no_policy on badges: GONE
--   - security_definer_view on dilemma_feedback_stats: GONE
--   - function_search_path_mutable: GONE (7→0)
--   - anon_security_definer_function_executable on
--     enforce_role_immutability_fn + handle_new_user: GONE
--   - poll_votes open insert: STILL PRESENT (needs PM decision §5)
--   - profiles role-update policy: STILL PRESENT (documented false positive)
--   - leaked_password_protection: STILL PRESENT (dashboard toggle))
