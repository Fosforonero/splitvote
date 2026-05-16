-- migration_v20_security_hardening.sql
--
-- ⚠️  PROPOSAL — REVIEW & APPLY SECTION-BY-SECTION ⚠️
--
-- Addresses Supabase security advisor findings as of 16 May 2026, populated
-- with the actual function/view/policy names from a live advisor query.
-- See CURRENT_HANDOFF.md §1a + the audit report for context.
--
-- Sections are independent. Apply in numbered order; each is reversible.
-- Section 1 was already shipped in the manual apply bundle
-- (supabase/session-2026-05-16-apply-bundle.sql) — leaving it here for
-- completeness so anyone reading v20 alone sees the full picture.

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 1. ALREADY APPLIED (session 16 May) — dilemma_feedback_stats security_invoker
-- ═════════════════════════════════════════════════════════════════════════════
-- ALTER VIEW public.dilemma_feedback_stats SET (security_invoker = true);
--
-- Status: applied via session-2026-05-16-apply-bundle.sql. Listed here for
-- audit completeness. Re-running is a no-op (already set).

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 2. Functions with mutable search_path (7) — pin to (public, pg_temp)
-- ═════════════════════════════════════════════════════════════════════════════
-- All 7 confirmed names from advisor 16 May 2026. Pinning the search_path
-- closes the shadow-schema attack vector for SECURITY DEFINER functions.
-- Zero behavioural cost when function bodies are correct.

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

-- Verify:
--   SELECT proname, proconfig FROM pg_proc
--   WHERE pronamespace = 'public'::regnamespace AND prosecdef = true
--     AND proname IN (
--       'award_mission_xp','enforce_role_immutability_fn','set_updated_at',
--       'increment_poll_vote','increment_user_vote_count',
--       'check_and_award_badges','update_stripe_webhook_events_updated_at');
--   -- Expected: every row has proconfig containing 'search_path=public, pg_temp'

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 3. Trigger functions exposed as RPC — REVOKE EXECUTE
-- ═════════════════════════════════════════════════════════════════════════════
-- Two SECURITY DEFINER functions are wired as triggers (not meant as RPC) but
-- are still callable via /rest/v1/rpc/<name>. PostgREST auto-exposes any
-- function in the public schema unless EXECUTE is revoked. We revoke from
-- both anon and authenticated.
--
--   1. enforce_role_immutability_fn() — BEFORE UPDATE trigger on profiles
--      (blocks client role escalation). Not a callable RPC.
--   2. handle_new_user() — auth.users → profiles bootstrap trigger.
--      Not a callable RPC; calling it directly would create a malformed row.

REVOKE EXECUTE ON FUNCTION public.enforce_role_immutability_fn() FROM anon;
REVOKE EXECUTE ON FUNCTION public.enforce_role_immutability_fn() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- Note: revoking EXECUTE does NOT affect the trigger firing — triggers run
-- with the function's privileges, not the caller's. This only prevents the
-- function from being invoked as a REST RPC.
--
-- Verify:
--   SELECT proname, r.rolname AS granted_to
--   FROM pg_proc p
--   JOIN aclexplode(p.proacl) ax ON true
--   JOIN pg_roles r ON r.oid = ax.grantee
--   WHERE p.proname IN ('enforce_role_immutability_fn','handle_new_user')
--     AND r.rolname IN ('anon','authenticated');
--   -- Expected: 0 rows (no anon/authenticated EXECUTE grant remaining)

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 4. RPC-intended SECURITY DEFINER functions — document intent
-- ═════════════════════════════════════════════════════════════════════════════
-- These functions are intentionally callable from authenticated clients (or
-- server-side via admin client) to mediate writes that bypass RLS. Adding
-- a SQL COMMENT documents the intent so future auditors don't second-guess.

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

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 5. poll_votes "Anyone can insert votes" — DECISION
-- ═════════════════════════════════════════════════════════════════════════════
-- DECISION REQUIRED before applying ONE of these blocks.
--
-- Background: poll voting today is anonymous (mirrors the dilemma vote
-- flow). The RLS policy lets any client INSERT directly into poll_votes.
-- If poll voting must remain anonymous WITHOUT writing a server API route,
-- this policy is necessary — choose Option A.
-- If poll voting should go through a server API (like dilemma voting now
-- does), choose Option B and write app/api/polls/[id]/vote/route.ts.
--
-- Option A — keep open, document intent (NO CODE CHANGE NEEDED):
--   COMMENT ON POLICY "Anyone can insert votes" ON public.poll_votes IS
--     'Intentional: anonymous poll voting mirrors the dilemma flow. '
--     'Rate limiting + dedup enforced at the API edge via Redis. RLS is '
--     'structural only here, not the security boundary.';
--
-- Option B — lock down (REQUIRES new server route first):
--   -- 1. Write app/api/polls/[id]/vote/route.ts that uses admin client
--   --    to insert with auth + rate limit. Deploy that route.
--   -- 2. THEN drop the open policy:
--   DROP POLICY "Anyone can insert votes" ON public.poll_votes;
--   -- Without step 1, all anonymous poll voting breaks immediately.

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 6. RLS-enabled-no-policy tables — likely intentional, document
-- ═════════════════════════════════════════════════════════════════════════════
-- Two tables have RLS enabled with zero policies, BY DESIGN — they are
-- written only via server admin client (service_role bypasses RLS):
--
--   - public.role_audit_log    (migration_v15) — admin role assignments
--   - public.stripe_webhook_events (migration_v11) — Stripe idempotency
--
-- Adding documentation comments so the advisor noise is contextualised
-- rather than chased.

COMMENT ON TABLE public.role_audit_log IS
  'Admin role assignment audit trail. RLS enabled with NO policies '
  'intentionally — written only via service_role from /api/admin/roles. '
  'Anon/authenticated reads/writes are correctly blocked by zero policies.';

COMMENT ON TABLE public.stripe_webhook_events IS
  'Stripe webhook idempotency guard. RLS enabled with NO policies '
  'intentionally — written only via service_role from /api/stripe/webhook. '
  'Anon/authenticated reads/writes are correctly blocked by zero policies.';

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 7. profiles "Only super_admin can update role" — FALSE POSITIVE
-- ═════════════════════════════════════════════════════════════════════════════
-- The advisor flags this policy because USING (true) is permissive — but the
-- WITH CHECK clause enforces:
--   (role = current row's role) OR (caller is service_role)
-- which means a non-service-role caller can run the UPDATE but cannot
-- actually change role. The trigger enforce_role_immutability_fn provides
-- a second layer of defence. No fix needed; treating as documented.

COMMENT ON POLICY "Only super_admin can update role" ON public.profiles IS
  'USING (true) is intentional — the role-change guard lives in the '
  'WITH CHECK clause and is reinforced by trigger '
  'enforce_role_immutability_fn. Together they prevent any non-service-role '
  'client from escalating their role.';

-- ═════════════════════════════════════════════════════════════════════════════
-- ── 8. auth.leaked_password_protection — DASHBOARD TOGGLE (no SQL)
-- ═════════════════════════════════════════════════════════════════════════════
-- Supabase dashboard → Authentication → Settings → Password protection
-- → Enable "Leaked password protection"
--
-- Effect: signup + password change checked against HIBP. No code change.

-- ═════════════════════════════════════════════════════════════════════════════
-- APPLY ORDER & ROLLBACK
-- ═════════════════════════════════════════════════════════════════════════════
-- 1. Section 1 — done.
-- 2. Sections 2 + 3 — apply together in one transaction (zero risk).
-- 3. Section 4 — pure documentation (idempotent, instantly reversible with
--    COMMENT ... IS NULL).
-- 4. Section 5 — pick Option A or B with PM. Don't apply blindly.
-- 5. Sections 6 + 7 — pure documentation (same as section 4).
-- 6. Section 8 — dashboard toggle, not SQL.
--
-- Rollback for section 2:  ALTER FUNCTION ... RESET search_path;
-- Rollback for section 3:  GRANT EXECUTE ON FUNCTION ... TO anon, authenticated;
-- Rollback for sections 4/6/7: COMMENT ON ... IS NULL;
