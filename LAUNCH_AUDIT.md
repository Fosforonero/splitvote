# SplitVote — Launch Audit

> Audit completo dello stato del progetto al 27 Aprile 2026.
> Ultimo aggiornamento: 12 Maggio 2026 — Sprint A/B/C + launch fixes.
> Aggiornare ad ogni sprint significativo.

---

## A. Completato ✅

### Core Voting
- [x] Vote flow: cookie dedup + 3-tier Redis rate limiting (IP global/scenario/user)
- [x] replaceVote atomic-safe (Lua eval, no partial failure, clamp ≥ 0)
- [x] IP hashing in rate-limit keys (SHA-256, optional RATE_LIMIT_SALT)
- [x] Vote funnel server-side tracking (vote_success, vote_change, vote_duplicate, vote_rate_limited)
- [x] Supabase dedup per utenti loggati (24h change window)
- [x] Results real-time: voti Redis aggregati, share flow completo

### Auth & Gamification
- [x] Supabase Auth + profili pseudonimi (Splitvoter-XXXXXX)
- [x] XP system + streak + companion
- [x] Daily missions server-validated (vote_3, vote_2_categories, daily_dilemma, challenge_friend, share_result)
- [x] Referral/challenge_friend tracking server-side (migration_v9 applicata)
- [x] Share mission server-verified via user_events (migration_v8 applicata)
- [x] Badges (user_badges table, migration_v2 applicata)

### i18n EN/IT
- [x] Route IT complete: /it, /it/trending, /it/play/[id], /it/results/[id], /it/category/[cat]
- [x] Route IT complete: /it/faq, /it/privacy, /it/terms, /it/personality, /it/blog
- [x] i18n copia separata EN/IT in tutti i client component (EN_COPY/IT_COPY pattern)
- [x] Accept-Language redirect per utenti italiani
- [x] LangSwitcher componente su home EN/IT

### SEO Tecnico
- [x] Title deduplication (template layout appende " | SplitVote" automaticamente)
- [x] hreflang EN/IT su play + results + home + blog (reciproci, x-default)
- [x] Canonical corretto per tutte le route
- [x] JSON-LD: Question (play), BreadcrumbList + Dataset (results), FAQPage (home IT), Organization (layout)
- [x] Sitemap locale-aware (dynamic approved + static + blog + categorie + SEO landing)
- [x] robots.txt con /admin/ disallow
- [x] SEO landing pages: /would-you-rather-questions, /moral-dilemmas, /it/domande-would-you-rather, /it/dilemmi-morali
- [x] OpenGraph + Twitter card su tutte le pagine chiave
- [x] Google Search Console verificata + sitemap inviata

### Privacy & Sicurezza
- [x] Privacy policy EN/IT accurata e aggiornata (IP hashing, account data, cookie list)
- [x] Termini di servizio EN/IT
- [x] IP non salvato raw: SHA-256 hash con salt opzionale (RATE_LIMIT_SALT)
- [x] ADMIN_EMAILS server-side only, mai esposto al client
- [x] CRON_SECRET fail-closed (401 se mancante o errato)
- [x] SUPABASE_SERVICE_ROLE_KEY server-side only
- [x] Stripe secrets: solo process.env, nessun valore hardcoded
- [x] OPENROUTER_API_KEY server-side only
- [x] Nessuna PII nei tracking events (solo scenario_id, category, locale, choice)
- [x] Trust strip "Anonymous voting / No account required" su home + vote + footer
- [x] Open Redirect fix: `safeRedirect()` in `auth/callback` e `login/page` — blocca `//`, backslash, URL assoluti
- [x] JSON-LD escaping: `JsonLd.tsx` + VoteClientPage escapa `</script>` injection
- [x] GA4 direct loading (sprint `GA4-PROXY-GEO-FIX-01`, 19 May 2026): il first-party proxy `/api/ga/script` + `/api/ga/g/collect` è stato rimosso perché GA4 non rispettava `X-Forwarded-For` e collassava la geo sull'IP edge Vercel (utenti IT mostrati come US/EU). gtag.js ora carica diretto da `googletagmanager.com`; i hit vanno a `google-analytics.com/g/collect`. Consent Mode v2 invariato (default all-denied).
- [x] API input bounds: metadata 2KB cap, scenarioId pattern, countryCode regex, avatarEmoji max 8, displayName no control chars
- [x] Stripe webhook non logga display name in chiaro; profile/update riduce error log a error code
- [x] Cookie consent banner granulare (28 Apr 2026): Decline / Personalizza / Accetta tutto
- [x] Consent Mode v2: analytics_storage + ad_storage + ad_user_data + ad_personalization — tutti denied by default
- [x] Preferenze granulari: toggle separati Analytics (GA4 + Vercel) e Advertising (AdSense)
- [x] localStorage backward-compat: sv_cookie_consent ('granted'/'denied'/'custom') + sv_cookie_prefs (JSON granulare)
- [x] "Cookie settings" riapribile dal Footer in qualsiasi momento (event: sv:openCookieSettings)
- [x] Privacy policy EN/IT: tutti i processor documentati (Stripe, Resend, Anthropic, OpenRouter, Vercel Analytics)
- [x] Privacy policy EN/IT: GA4 first-party proxy + X-Forwarded-For forwarding dichiarato esplicitamente
- [x] Privacy policy EN: rimossa frase errata "powered by Google's CMP"; banner è custom
- [x] Terms EN/IT allineati: account/gamification, Premium/Stripe, AI content, moderazione
- [x] Terms IT: contatto legale corretto in legal@splitvote.io (era hello@splitvote.io)
- [x] LEGAL.md: gap tracker aggiornato con items chiusi e ancora aperti prima di scaling

### Middleware & Performance
- [x] isAuthRelevantPath(): Supabase auth.getUser() solo su route che lo richiedono
- [x] Route pubbliche (play, results, blog) senza roundtrip Supabase
- [x] Service worker PWA: network-first, skip /api/, offline fallback

### Stripe & Monetizzazione
- [x] Premium subscription MVP (Stripe checkout + customer portal)
- [x] Webhook lifecycle: checkout.session.completed, subscription.updated, subscription.deleted
- [x] Entitlements centralizzati (lib/entitlements.ts): noAds, unlimitedRenames, canSubmitPoll
- [x] Poll submission server-enforced: `POST /api/polls/submit` verifica auth + entitlement server-side; insert via admin client con `status='pending'`; input validation server-side — ✅ 28 Apr 2026
- [x] `user_polls` RLS abilitato (migration_v12): INSERT client bloccato; policy SELECT own polls presente; INSERT/UPDATE/DELETE da client non autorizzati → 42501 — ✅ migration v12 applicata in Supabase (28 Apr 2026); ✅ migration v13 applicata in Supabase (28 Apr 2026): policy residua "Users can update own pending polls" rimossa; restano solo "Anyone can view approved polls" + "Users can view own polls" — zero policy INSERT/UPDATE/DELETE client
- [x] AdSense official script (pagead2.googlesyndication.com)
- [x] AdSlot: no ads per admin/premium via /api/me/entitlements

### AI Content System
- [x] OpenRouter draft generation (POST /api/admin/generate-draft — preview + save)
- [x] Cron giornaliero Anthropic Claude (generate-dilemmas — trend signals → draft queue)
- [x] Seed batch 20 drafts (POST /api/admin/seed-draft-batch)
- [x] Draft/approved separation: dynamic:drafts + dynamic:scenarios (Redis)
- [x] Admin approve/reject UI (CronDebug.tsx)
- [x] Novelty dedup guard (threshold 55 per draft save, 75 per autopublish)
- [x] Content inventory + Jaccard dedup (lib/content-inventory.ts + lib/content-dedup.ts)
- [x] Quality gates centralizzati (lib/content-quality-gates.ts) — 12 hard gates
- [x] Autopublish controllato con env var fail-closed (AUTO_PUBLISH_DILEMMAS=false default)
- [x] Content opportunities endpoint (GET /api/admin/content-opportunities)
- [x] Sitemap esclude SEMPRE i draft (doppio filtro)
- [x] Blog: 6 articoli statici in lib/blog.ts (3 EN + 3 IT)

### Social & Viral
- [x] Web Share API + clipboard fallback su results
- [x] Story cards 9:16 PNG (Instagram/TikTok manual share)
- [x] Challenge friend referral (URL con ?ref=<10-hex>)
- [x] Social Content Factory phase 1 (generate:social-content — zero cost, template-based)
- [x] Social links: Instagram @splitvote.io + TikTok @splitvote8 in Footer + Organization JSON-LD

### Admin Dashboard
- [x] KPI: utenti, voti, badge, poll, premium, votes 24h/7d, feedback %
- [x] Charts: votes 14d + signups 14d (dati reali da vote_daily_stats)
- [x] Anonymous vs logged-in breakdown (all-time)
- [x] Draft queue con approve/reject + novelty score + AI badge
- [x] GenerateDraftPanel: preview + save as draft + low-novelty override
- [x] SeedBatchPanel: 20 topics batch generation
- [x] CronDebug: badge ⚡ AUTO per dilemmi auto-pubblicati

### PWA
- [x] site.webmanifest: standalone, shortcuts (Trending + Profile), maskable icons
- [x] Service worker: network-first, cache-first assets, offline fallback /offline
- [x] Installabile da Chrome/Safari

### Email & DNS
- [x] lib/email.ts (Resend wrapper, fail-silent se RESEND_API_KEY mancante)
- [x] Alias @splitvote.io configurati (hello, support, privacy, legal, business, research)

---

## B. Iniziato ma da chiudere ⚠️

### Stripe QA End-to-End

**Runbook v2 — 28 Apr 2026.** Aggiornato dopo aver verificato che la produzione usa live mode.

---

> **⚠️ PRODUZIONE IN LIVE MODE — non eseguire QA su splitvote.io**
>
> `STRIPE_SECRET_KEY` su Vercel production è `sk_live_...`. Le carte test Stripe (`4242 4242 4242 4242`)
> **non funzionano in live mode** — Stripe le rifiuta. Qualsiasi checkout su `splitvote.io` con carta test
> fallirà silenziosamente o genererà un errore Stripe.
>
> **Il QA manuale deve essere eseguito su un Vercel Preview deployment con variabili d'ambiente
> in test mode (`sk_test_...`), price IDs test, e webhook endpoint test separato.**
>
> Non sostituire mai `sk_live_...` con `sk_test_...` su Vercel production.

---

#### Endpoint Stripe coinvolti

| Endpoint | Trigger | Env richiesti |
|---|---|---|
| `POST /api/stripe/subscription` | Upgrade to Premium button | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PREMIUM` |
| `POST /api/stripe/portal` | Manage subscription button | `STRIPE_SECRET_KEY` |
| `POST /api/stripe/checkout` | Name change (free user) | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_NAME_CHANGE` |
| `POST /api/stripe/webhook` | Stripe → server events | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |

#### Webhook events gestiti

| Event | Effetto su `profiles` |
|---|---|
| `checkout.session.completed` (type=subscription) | `is_premium=true`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status='active'` |
| `checkout.session.completed` (type=name_change) | `display_name`, `name_changes++` |
| `customer.subscription.updated` | `is_premium` (true se active/trialing), `subscription_status`, `stripe_subscription_id` |
| `customer.subscription.deleted` | `is_premium=false`, `stripe_subscription_id=null`, `subscription_status='cancelled'` |

---

#### Setup — Vercel Preview con Test Mode (percorso raccomandato)

Questo è il percorso corretto per eseguire il QA senza toccare la produzione live.

**Step 1 — Attiva test mode nel dashboard Stripe**

1. Apri [dashboard.stripe.com](https://dashboard.stripe.com) → toggle "Test mode" in alto a destra
2. Copia la chiave segreta test: `Developers → API keys → Secret key` → `sk_test_...`

**Step 2 — Crea o identifica i price IDs test**

In Stripe test mode (`Products → Add product`):
- Crea prodotto **SplitVote Premium** → piano ricorrente mensile → copia `price_test_...` (Premium subscription)
- Crea prodotto **Name Change** → prezzo una tantum €0.99 → copia `price_test_...` (Name change)

Se i prodotti test esistono già (da sessioni precedenti), recupera i price IDs dalla lista Products in test mode.

**Step 3 — Configura le env vars sul Vercel Preview**

Vai su Vercel → Settings → Environment Variables → seleziona scope **Preview** (non Production):

```
STRIPE_SECRET_KEY       = sk_test_...
STRIPE_PRICE_ID_PREMIUM = price_test_...  (subscription test)
STRIPE_PRICE_ID_NAME_CHANGE = price_test_...  (one-time test)
```

> Non modificare le variabili con scope Production — lasciale su `sk_live_...`.

**Step 4 — Crea il webhook endpoint test in Stripe**

1. Stripe dashboard (test mode) → `Developers → Webhooks → Add endpoint`
2. Endpoint URL: `https://<preview-url>.vercel.app/api/stripe/webhook`
   - L'URL del Preview è visibile su Vercel → Deployments → copia il dominio del branch
3. Events da ascoltare: seleziona `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Crea → copia il `whsec_...` generato

**Step 5 — Aggiungi il webhook secret su Vercel Preview**

Vercel → Settings → Environment Variables → scope **Preview**:

```
STRIPE_WEBHOOK_SECRET = whsec_...  (dal webhook test creato al passo 4)
```

Opzionale — se il Preview URL non corrisponde a `NEXT_PUBLIC_BASE_URL`:
```
NEXT_PUBLIC_BASE_URL = https://<preview-url>.vercel.app
```

**Step 6 — Redeploy il Preview**

Vercel → Deployments → Redeploy il branch (per far leggere le nuove env vars).

**Step 7 — Crea un utente test**

1. Apri `https://<preview-url>.vercel.app` → crea account normale (non admin)
2. Verifica Supabase → Table Editor → `profiles` — stato iniziale:
   - `is_premium = false`
   - `stripe_customer_id = null`
   - `stripe_subscription_id = null`
   - `subscription_status = null`

---

#### Alternativa: Setup Stripe CLI (test locale)

Usare solo se si vuole testare in locale invece che su Preview. Richiede `npm run dev` attivo.

```bash
# Terminal 1 — dev server
nvm use && npm run dev

# Terminal 2 — forward webhook a localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copia il whsec_... stampato → .env.local STRIPE_WEBHOOK_SECRET=whsec_...
# Ricorda: serve anche STRIPE_SECRET_KEY=sk_test_... in .env.local
```

---

#### Test 1 — Checkout Premium

> Eseguire su Preview URL o localhost (mai su splitvote.io production)

- [ ] Navigare a `/profile` o `/dashboard` con utente test loggato
- [ ] Cliccare "Upgrade to Premium" → redirect a Stripe Checkout
- [ ] Completare con carta test: `4242 4242 4242 4242` exp: `12/29` CVC: `123`
- [ ] Verificare redirect a `/profile?premium=activated`

**Verifica Supabase → `profiles` dopo checkout:**
- [ ] `is_premium = true`
- [ ] `stripe_customer_id` popolato (`cus_...`)
- [ ] `stripe_subscription_id` popolato (`sub_...`)
- [ ] `subscription_status = 'active'`

**Verifica Vercel logs (Preview) o log Terminal 2 (locale):**
- [ ] `✅ Premium activated: user=<truncated_id>`
- [ ] Supabase → `stripe_webhook_events`: riga con `status = 'processed'`, `processed_at` non null

#### Test 2 — Dashboard Premium Active

- [ ] Navigare `/dashboard` → banner/stato Premium visibile
- [ ] Navigare `/profile` → label Premium presente, CTA upgrade assente

#### Test 3 — No Ads

- [ ] Navigare una pagina con AdSlot (es. `/results/[id]` con slot configurato)
- [ ] DevTools → Network: nessuna request a `pagead2.googlesyndication.com`
- [ ] `GET /api/me/entitlements` risponde `{ noAds: true, effectivePremium: true }`

#### Test 4 — Customer Portal

- [ ] Cliccare "Manage subscription" in `/profile` (chiama `POST /api/stripe/portal`)
- [ ] Verificare redirect a `https://billing.stripe.com/...`
- [ ] Navigare nel portal e verificare subscription attiva
- [ ] Tornare a `/profile` via link "Return to site" → URL `/profile`

#### Test 5 — Cancellation

- [ ] Nel Customer Portal, cancellare la subscription
- [ ] Attendere webhook `customer.subscription.deleted` (Stripe dashboard → Webhooks → log, o Terminal 2 locale)
- [ ] Verificare log: `✅ Subscription cancelled: customer=cus_...`
- [ ] Verificare Supabase → `profiles`:
  - [ ] `is_premium = false`
  - [ ] `stripe_subscription_id = null`
  - [ ] `subscription_status = 'cancelled'`
- [ ] Ricaricare `/dashboard` → banner Premium assente
- [ ] `GET /api/me/entitlements` → `{ noAds: false }` — AdSlot torna a renderizzare

#### Test 6 — Webhook Idempotency (duplicate event)

Da Stripe dashboard test mode → `Developers → Webhooks → <endpoint> → Event log`:
copia l'event ID `evt_...` del `checkout.session.completed` appena processato.

```bash
# Con Stripe CLI
stripe events resend evt_1AbCdEfGhIjKlMnOp...

# Oppure: Stripe dashboard → Webhooks → endpoint test → Event log → "Resend"
```

- [ ] Webhook risponde 200 `{ received: true, duplicate: true }` (nessun reprocessing)
- [ ] Supabase → `stripe_webhook_events`: nessuna nuova riga per lo stesso `stripe_event_id`
- [ ] `profiles.is_premium` invariato
- [ ] Nessun `✅ Premium activated` nel log per il secondo evento

#### Test 7 — Failure Modes

| Scenario | Come testare | Risultato atteso |
|---|---|---|
| Webhook senza firma | `curl -X POST <preview-url>/api/stripe/webhook` senza `stripe-signature` | 400 `Missing stripe-signature header` |
| Firma errata | Modificare `STRIPE_WEBHOOK_SECRET` con valore sbagliato e reinviare | 400 `Invalid signature` |
| Utente già premium → subscribe | Chiamare `POST /api/stripe/subscription` con utente già premium | 409 `Already premium` |
| Portal senza `stripe_customer_id` | Chiamare `POST /api/stripe/portal` con utente senza checkout | 404 `No billing account found` |
| `STRIPE_SECRET_KEY` mancante | Rimuovere var e chiamare `/api/stripe/subscription` | 500 `Stripe not configured` |
| Admin → checkout name change | Admin tenta `POST /api/stripe/checkout` | 400 `Admin rename does not require payment` |

#### Rollback / Manual Recovery

Se il webhook fallisce e `profiles` non viene aggiornato, eseguire in Supabase SQL Editor (admin only):

```sql
-- Attivare premium manualmente (emergency)
UPDATE public.profiles
SET is_premium = true, subscription_status = 'active'
WHERE stripe_customer_id = 'cus_...';

-- Revocare premium manualmente
UPDATE public.profiles
SET is_premium = false, stripe_subscription_id = null, subscription_status = 'cancelled'
WHERE stripe_customer_id = 'cus_...';

-- Verificare eventi webhook falliti
SELECT stripe_event_id, event_type, status, error, processed_at, updated_at
FROM public.stripe_webhook_events
WHERE status IN ('failed', 'processing')
ORDER BY created_at DESC LIMIT 10;
```

Stripe retry schedule: ~1min, 5min, 30min, 2h, 5h, 10h, 24h. Un evento in stato `failed` verrà reclamato automaticamente dall'idempotency guard al prossimo retry Stripe.

#### Checklist stato

- [x] **Vercel Preview configurata con Stripe test mode** — ✅ Eseguito 28 Apr 2026. Branch: `stripe-preview-qa`. URL: `splitvote-git-stripe-preview-qa-matpizzi-gmailcoms-projects.vercel.app`. Env vars test (`sk_test_...`, price IDs test, `whsec_...`) configurate su scope Preview.
- [x] **Test acquisto premium — backend/webhook/entitlements** — ✅ Verificato 28 Apr 2026. `POST /api/stripe/subscription` genera Checkout Session test correttamente. Webhook `checkout.session.completed` ricevuto e processato. Supabase `profiles` dopo attivazione: `is_premium=true`, `stripe_customer_id` valorizzato, `stripe_subscription_id` valorizzato, `subscription_status='active'`. `GET /api/me/entitlements`: `effectivePremium=true`, `noAds=true`, `canSubmitPoll=true`. ⚠️ Submit finale della hosted Checkout page non completato via browser automatizzato (Stripe applica controlli anti-automation sull'UI di pagamento) — richiede una singola verifica manuale umana con carta `4242 4242 4242 4242`.
- [x] **Test customer portal e cancellazione** — ✅ Verificato 28 Apr 2026. `POST /api/stripe/portal` apre correttamente il Stripe Billing Portal. Cancellazione immediata forzata via Stripe CLI → evento `customer.subscription.deleted` generato → webhook processato (log Vercel: `Subscription cancelled`). `profiles` dopo cancellazione: `is_premium=false`, `noAds=false`, `canSubmitPoll=false`.
- [x] **Webhook idempotency verificata end-to-end** — ✅ Verificato 28 Apr 2026. Duplicate webhook resend eseguito: nessuna seconda attivazione Premium, nessuna nuova riga in `stripe_webhook_events` per lo stesso `stripe_event_id`. Idempotency operativa.
- [x] Idempotenza webhook implementata: `lib/stripe-webhook-events.ts` + `migration_v11_stripe_webhook_events.sql` — ✅ migration v11 applicata in Supabase (28 Apr 2026); trigger `updated_at` presente; indici presenti; RLS abilitato; zero policy client
- [x] **Bug fix (28 Apr 2026)**: aggiunto try/catch su `stripe.checkout.sessions.create()` in checkout, subscription e `billingPortal.sessions.create()` in portal — prima, Stripe throw → 500 non-JSON → client "Network error"; ora → 500 JSON con messaggio utile
- [x] **Audit statico completo (28 Apr 2026)**: webhook lifecycle, idempotency, premium activation, cancellation, AdSlot, entitlements API, log safety — tutti verificati. Runbook allineato al codice.
- [x] **Env var fix (29 Apr 2026): `STRIPE_PRICE_ID_PREMIUM` Production corretta** — Root cause reale: `STRIPE_PRICE_ID_PREMIUM` in Vercel Production conteneva per errore una Stripe Secret Key (`sk_live_...`) invece di un Price ID. Il codice usa `mode: 'subscription'` con `line_items: [{ price: STRIPE_PRICE_ID_PREMIUM }]` — Stripe rifiutava la chiamata perché il valore non era un Price ID valido. Nota: la narrativa precedente "prezzo one-time vs ricorrente" era imprecisa; la root cause era l'env var errata, non la configurazione del prodotto Stripe. Fix manuale (Matteo, 29 Apr 2026): env var aggiornata con il Price ID corretto del prodotto SplitVote Premium (recurring monthly, €4.99/mese). Vercel Production redeployata. Nessuna modifica al codice runtime.
- [x] **Checkout UI su `splitvote.io/profile` — verifica manuale ✅ 19 Mag 2026** — PM ha aperto `splitvote.io/profile` con account reale non-premium e cliccato "Upgrade to Premium": Stripe Checkout si apre correttamente in live mode e mostra il prodotto Premium ricorrente mensile (€4.99/mese). Sprint `PREMIUM-STRIPE-LIVE-QA-01`.
- [ ] **Pagamento live end-to-end — verifica manuale** — il loop completo (checkout → webhook → `is_premium=true` → entitlements) non è ancora stato eseguito in live mode con carta reale o prepagata. La verifica UI sopra (✅ 19 Mag 2026) conferma che il prodotto/prezzo è corretto; resta da chiudere solo il submit + webhook live. Raccomandato prima di promuovere Premium a utenti reali, ma non urgente: il rischio principale (env var errata) è già stato eliminato dal fix del 29 Apr.

### Store One-Time Purchases (Pixie / Cosmetics) — Intentionally Deferred

Decisione PM (19 Mag 2026): **non lanciare** i Pixie/cosmetic one-time purchases ora. Il modal "Checkout coming online soon — sit tight" mostrato dal Store su `splitvote.io/store` è il fallback intenzionale del codice quando le env vars `STRIPE_PRICE_*` (14 totali — 6 Pixie + 8 cosmetics) non sono configurate.

- **Codice**: corretto e production-ready. `POST /api/checkout/one-time` restituisce `{ comingSoon: true }` + HTTP 501 quando `getStripePriceId(productId)` non trova l'env var; il client mostra il modal di cortesia.
- **Migration**: `migration_v16_user_purchases` ✅ applicata — la tabella di destinazione esiste.
- **Webhook**: handler `one_time_purchase` ✅ implementato con cross-check Stripe Price ID ↔ catalog anti-tampering.
- **Bloccante per il lancio**: nessuno tecnico. Decisione di business — il PM sceglie quando attivare il lancio.

**Per riattivare il lancio (sprint futuro `STORE-ONE-TIME-LAUNCH-01`)**: creare 6 Products in Stripe live mode + impostare le 6 env vars `STRIPE_PRICE_PIXIE_*` su Vercel Production scope + redeploy + test su lowest-cost Pixie. Runbook completo in `reports/qa-open-items-audit-2026-05-19.md` (sprint `STRIPE-STORE-COSMETICS-CHECKOUT-CONFIG-AUDIT-01` chiuso 19 Mag 2026 come configuration-known/no-code).

**Rischi residui dello state deferred**:
- Refund reverse-state per `one_time_purchase` rows usa il catalog legacy `lib/cosmetics-store.ts` invece di `lib/purchases.ts` → da auditare prima del lancio (`STORE-REFUND-PARITY-AUDIT-01`).
- UX 409 `alreadyOwned` non gestita lato client (`ProductCard.tsx handleBuy` ignora il flag) → minore, non bloccante.
- Tax/VAT inclusion default su Stripe Products → confermare politica con PM prima di Phase 1.

Sprint `STRIPE-STORE-COSMETICS-CHECKOUT-CONFIG-AUDIT-01` chiuso come configuration-known/no-code (nessuna modifica al codice; nessuna modifica a Stripe; nessuna modifica a env vars).

### Blog Dynamic Storage
- [ ] Progettare BlogDraft schema (vedi ROADMAP — Blog Weekly Generation)
- [ ] POST /api/admin/generate-blog-draft (OpenRouter, save in blog:drafts)
- [ ] Aggiornare route blog/[slug] per leggere da Redis blog:published
- [ ] Admin UI per review blog drafts
- [ ] Cron settimanale generate-blog-draft (schedule: `0 9 * * 1`)

### Social Content Factory Phase 2 (Remotion Video)
- [ ] Template Remotion 1080×1920 per TikTok/Reels (installare solo a sprint dedicato)
- [ ] npm run render-social <dilemmaId>
- [ ] Template EN/IT separati

### Autopublish Quality Gates — Live Test
- [ ] Abilitare AUTO_PUBLISH_DILEMMAS=true in Vercel e monitorare per 7 giorni
- [ ] Verificare che nessun contenuto inappropriato sia stato auto-pubblicato
- [ ] Aggiustare thresholds se necessario (75/75 potrebbe essere troppo conservativo)

### Challenge Friend / Share Result Live Retest
- [ ] Retest challenge_friend mission end-to-end post-reset migration_v9
- [ ] Retest share_result mission con utente reale
- [ ] Verificare referral_visit dedup 1/giorno funziona in produzione

### Category Pages SEO
- [ ] Contenuto editoriale su /category/[cat] e /it/category/[cat] (oggi solo lista dilemmi)
- [ ] h1 + descrizione + FAQ per le categorie principali (morality, technology, society)

---

## C. Da fare 📋

### Performance & Scalabilità
- [x] ISR/dynamic audit completato 28 Apr 2026 — play/results restano force-dynamic (per-user state: cookie anon, Supabase votedIds, nextId personalizzato); home/trending/category già ISR 3600; category pages ora hanno `dynamicParams=false` per 404 immediato su slug invalidi
- [x] Harness k6 aggiunto 28 Apr 2026 — `tests/load/splitvote-smoke-load.js` con safety guard produzione, scenari read + write opzionale, thresholds conservativi (vedi §Load Test k6 sotto)
- [x] **k6 production read-only baseline — ✅ passed 28 Apr 2026** (vedi `LOAD_TEST_RESULTS.md`): Run #1 homepage cold cache 3.20s (k6 threshold fail — warmup); Run #2 tutti i threshold passati — homepage 1.28s, play 545ms, results 553ms, http_req_failed 0%, checks 100%. Raccomandazione: Vercel Preview baseline + 20 VU stress test prima di campagne paid aggressive.
- [x] **Homepage cold-cache pattern identificato e ottimizzato (28 Apr 2026)**: Run #3 post-deploy mostra homepage p95 2.36s (cold) — pattern coerente con ogni nuovo deploy (ISR revalidation). Root cause: `getVotesBatch` faceva 30 HTTP call separate ad Upstash; `getVotes(daily)` fetchato separatamente; trending non parallelizzato. Fix: `getVotesBatch` convertito a Upstash pipeline (30 HTTP → 1 HTTP), daily vote merge nel batch, `getVotesBatch` e `getTrendingScenarioIds24h` parallelizzati con `Promise.allSettled`. Comportamento homepage warm (ISR hit) invariato. Rerun k6 necessario post-deploy per misurare miglioramento cold render.
- [ ] Redis latenza: verificare percentili p99 con Upstash metrics
- [ ] Image optimization: verificare che og-images siano cached e non ri-generate ogni volta
- [ ] Bundle analysis: `npm run build` analizzare JS bundle size — target < 200KB first load

### Load Test k6 — Setup e Comandi

#### Installare k6 localmente

```bash
# macOS
brew install k6

# Ubuntu / Debian
sudo gpg -k && sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Windows (Chocolatey)
choco install k6
```

#### Comandi

```bash
# Smoke test localhost (dev server deve girare: npm run dev)
k6 run tests/load/splitvote-smoke-load.js
# oppure
npm run load:smoke

# Smoke test con write test opzionale (POST /api/vote anonimo):
ENABLE_WRITE_TESTS=true k6 run tests/load/splitvote-smoke-load.js

# Contro Vercel Preview deployment:
BASE_URL=https://my-branch.vercel.app ALLOW_PROD_LOAD_TEST=true k6 run tests/load/splitvote-smoke-load.js

# Contro produzione (finestra controllata, bassa intensità):
BASE_URL=https://splitvote.io ALLOW_PROD_LOAD_TEST=true k6 run tests/load/splitvote-smoke-load.js
```

**⚠️ Non lanciare test pesanti su produzione senza una finestra controllata.** Il safety guard blocca automaticamente BASE_URL che contiene `splitvote.io` a meno che `ALLOW_PROD_LOAD_TEST=true`. Aumentare `--vus` solo gradualmente e monitorare Vercel dashboard in tempo reale.

#### Metriche da monitorare

| Metrica | Descrizione | Cosa fare se alta |
|---|---|---|
| `http_req_failed` | % richieste fallite (5xx, errori rete) | Investigare Vercel logs + Redis/Supabase status |
| `http_req_duration{name:GET /play} p(95)` | Latenza p95 per la pagina force-dynamic più critica | Se >3s: Redis latency? Supabase cold start? |
| `http_req_duration{name:GET /results} p(95)` | Latenza p95 results (force-dynamic) | Stesso debug di play |
| `http_req_duration{name:GET /} p(95)` | Latenza home (ISR — deve essere <200ms dal cache) | Se alta: Vercel edge cache miss? |
| `checks` | % check passati (status 200) | Se <90%: guardare quali check falliscono |
| `vote_rate_limited` | % richieste vote che ricevono 429 | Se alta (>50%): rate limit corretto — ridurre rate nel test |

#### Cosa significa "pass" per soft launch

- `http_req_failed` < 1% (zero errori 5xx stabili)
- `http_req_duration{name:GET /play} p(95)` < 3000ms con 5 VU concurrent
- `http_req_duration{name:GET /}  p(95)` < 500ms (ISR cached)
- `checks` > 98%
- Nessun 500 in Vercel logs durante il test
- `vote_rate_limited` < 20% nel write test (rate limit attivo ma non dominante a 1 req/s)

#### Vercel Preview baseline — procedura consigliata

Ottenere l'URL della Vercel Preview più recente dal deploy log o da `npx vercel ls`.

```bash
# Prima esecuzione: solo read-only (NO ENABLE_WRITE_TESTS — non serve per il baseline)
BASE_URL=https://<branch>.vercel.app ALLOW_PROD_LOAD_TEST=true k6 run tests/load/splitvote-smoke-load.js
```

**Non usare `ENABLE_WRITE_TESTS=true` per il primo baseline.** I write test su Preview consumano rate-limit Redis reali e potrebbero causare 429 che distorcono le metriche ISR/dynamic.

Metriche da registrare e riportare nel commit/ROADMAP:

| Metrica | Descrizione | Pass target soft launch |
|---|---|---|
| `http_req_duration{name:GET /} p(95)` | Home ISR — deve arrivare da edge cache | < 500ms |
| `http_req_duration{name:GET /trending} p(95)` | Trending ISR | < 500ms |
| `http_req_duration{name:GET /category/technology} p(95)` | Category ISR | < 1500ms |
| `http_req_duration{name:GET /play/trolley} p(95)` | Play force-dynamic — ogni VU colpisce server | < 3000ms |
| `http_req_duration{name:GET /results/trolley} p(95)` | Results force-dynamic | < 3000ms |
| `http_req_failed` | % richieste fallite (5xx, rete) | < 1% |
| `checks` | % check status 200 passati | > 98% |

Se play/results p95 > 2s a 5 VU: investigare Redis cold start su Upstash free tier (latenza primo hit).

Dopo il baseline su Preview (se ok):
1. Eseguire test più lungo (`20 VU, 2m`) sempre su Preview
2. Solo dopo: stesso test su produzione in orario basso traffico con esplicita finestra controllata

**Registrare i risultati di ogni run in [`LOAD_TEST_RESULTS.md`](LOAD_TEST_RESULTS.md)** — contiene tabella, soglie, e procedura completa per baseline e follow-up.

#### Spike test — simulazione burst TikTok/Instagram

Script: `tests/load/splitvote-spike-load.js` (`npm run load:spike`). Usa `default` export → `--vus`/`--duration` CLI override funzionano senza errori. Read-only, nessun write test.

**✅ Production spike read-only passed (28 Apr 2026)** — vedi `LOAD_TEST_RESULTS.md` → Spike Tests:
- Spike #1 (10 VU × 30s, 11.59 req/s): overall p95 847ms, play p95 617ms, results p95 614ms — PASS
- Spike #2 (25 VU × 60s, ~30 req/s): overall p95 777ms, play p95 564ms, results p95 580ms — PASS
- play/results p95 < 600ms a ~30 req/s — ottimi per force-dynamic sotto carico moderato sociale.

**⚠️ No 50 VU su produzione** senza aver prima eseguito Preview spike 50 VU o una finestra controllata dedicata (basso traffico, orario notturno). Mai senza `ALLOW_PROD_LOAD_TEST=true`.

### Analytics & Business Intelligence
- [ ] GA4 funnel: vote → results → share → signup (verificare eventi in GA4 dashboard)
- [ ] Google Search Console: monitorare impressioni/click dopo sitemap submission
- [ ] Business dashboard v1: revenue MRR, premium churn, top converting dilemmi
- [ ] Feedback quality signal: verificare che feedbackScore si aggiorni correttamente nei dynamic scenarios
- [ ] **GA4 Custom Dimensions registration** (PM-side, ~5 min): register `reveal_state`, `reveal_pct_voted`, `previous_reveal_state`, `previous_reveal_pct_voted` as event-scoped Custom Dimensions in GA4 Admin → Custom definitions. These payload fields ship in `REVEAL-STATE-INSTRUMENTATION-01` (commit `1384296`, 20 May 2026) on `result_viewed`, `next_dilemma_clicked`, and `share_clicked` (results-page sites only). Until registered they're visible only in DebugView + Explorations. No new event names; no public legal page update required.

### AdSense

**19 May 2026 — AdSense rejected SplitVote again for "Contenuti di scarso valore" (low-value content, minimum content requirements, thin content with little or no added value, publisher policies/low-value inventory).** Remediation Phase 1 + Phase 2 deployed the same day.

**Deployed remediation:**
- ✅ Ad suppression on thin/template surfaces — `<AdSlot>` on `/play/[id]` and `/it/play/[id]` only renders when `hasStaticInsight(scenario.id)` is true; `/results/[id]` (shared by EN+IT) adds `total >= 50` gate (commit `87741d5`).
- ✅ `/store` + `/it/store` `robots: { index: false, follow: true }` + removed from sitemap (commit `87741d5`).
- ✅ Dynamic AI play/results pages `robots: { index: false, follow: true }` when not in `static-insights` (commit `87741d5`).
- ✅ Per-id static insights expanded from 5 → 41 (EN+IT, 328 substantive strings; commit `19a020b`). The Phase 1 gate now opens for every static dilemma once it crosses 50 votes.
- ✅ Results vote-CTA bugfix (`c88beaf`) — unrelated improvement: unvoted users on `/results/<id>` now see a "Vote on this dilemma →" card instead of a dead-end.
- Full audit: [reports/adsense-low-value-remediation-audit-2026-05-19.md](reports/adsense-low-value-remediation-audit-2026-05-19.md).

**Pending:**
- [ ] Wait 24-48 h after deploy for Googlebot recrawl with new content + noindex/sitemap state.
- [ ] Run `ADSENSE-REVIEW-READY-CHECKLIST-01` (read-only verification of every checklist item in the audit report's "Do not request AdSense review until these are done" section).
- [ ] PM submits AdSense re-review from the AdSense dashboard once the checklist is green.
- [ ] If re-review fails again: Phase 2 trust/E-E-A-T sprint — enrich `/about`, add `/editorial-policy` + `/methodology`, `Person`-typed author bylines.

**Pre-existing AdSense queue items (still open):**
- [ ] Verifica account AdSense approvato (controlla status in dashboard Google) — currently rejected; pending re-review per above.
- [ ] NEXT_PUBLIC_ADSENSE_SLOT_RESULTS e NEXT_PUBLIC_ADSENSE_SLOT_PLAY con slot ID reali.
- [ ] Test ads visibili per utenti anonimi non-premium — deferred until account approval.
- [ ] Monitoring: policy violations alerts.

### Legal & Privacy
- [x] Cookie banner granulare con Consent Mode v2 — COMPLETATO 28 Apr 2026
- [x] Privacy policy EN/IT aggiornate con tutti i processor e GA proxy disclosure — COMPLETATO 28 Apr 2026
- [x] Terms EN/IT allineati con AI content, Premium, gamification — COMPLETATO 28 Apr 2026
- [ ] GDPR/CCPA review finale con avvocato prima di scaling (>50k utenti/mese)
- [ ] Google-certified TCF CMP: valutare prima di servire annunci personalizzati in EEA/UK/Svizzera a scala
- [ ] Privacy policy: data processor agreements formali (DPA firmati con Upstash, OpenRouter, Resend)

### Accessibilità
- [ ] WCAG 2.1 AA pass: focus states, color contrast su tutti i componenti
- [ ] Screen reader test: vote buttons e results bars accessibili
- [ ] Keyboard navigation: form + dialogs + modal

### Disaster Recovery & Backup
- [ ] Redis backup strategy: Upstash automatic backups abilitati?
- [ ] Supabase backup: Point-in-Time Recovery configurato?
- [ ] Runbook per: Redis loss (dynamic:scenarios/drafts), Supabase outage, Vercel deploy failure
- [ ] Environment variables backup sicuro (non solo in Vercel dashboard)

### Mobile Store Apps
- [ ] Android TWA: assetlinks.json + APK firmato (Bubblewrap CLI)
- [ ] iOS Capacitor: Universal Links + haptics + native share + local notifications
- [ ] Prerequisito: crescita organica misurabile prima di submission Apple/Google

### DNS & Infrastructure
- [x] **Redirect www → non-www — ✅ 12 Maggio 2026** — `vercel.json` permanent 301 da `www.splitvote.io` → `splitvote.io` (Cloudflare è DNS-only, redirect gestito da Vercel)
- [ ] Cloudflare Email Routing: test forward alias tutti gli indirizzi @splitvote.io
- [ ] Resend DNS: SPF + DKIM verificati per outbound email
- [ ] DMARC record: `v=DMARC1; p=quarantine; rua=mailto:hello@splitvote.io`

---

## D. Launch Readiness

### READY_FOR_SOFT_LAUNCH: ✅ YES

**Criteri soddisfatti:**
- Vote flow funzionante e anti-abuse
- i18n EN/IT completo
- SEO tecnico in ordine (sitemap, hreflang, canonical, JSON-LD)
- Privacy policy accurata
- Admin dashboard operativo
- AI content system con quality gates

**Rischi residui accettabili per soft launch:**
- Stripe non testato end-to-end con carta reale (feature non-critica per MVP)
- AdSense non ancora approvato (no revenue impact sul funzionamento)
- DPA formali non firmati con tutti i processor (rischio basso a traffico minimo)

---

### READY_FOR_HIGH_TRAFFIC_LAUNCH: ⚠️ NO

**Blockers prima dell'high-traffic launch:**

1. **Load test**: comportamento sotto 1000+ richieste/secondo non verificato. Redis e Supabase connection pooling non testati sotto stress.

2. **AdSense approval**: account deve essere approvato prima di scalare il traffico. Pubblicità su traffico non approvato può portare alla disabilitazione dell'account.

3. **Google-certified TCF CMP**: per servire annunci personalizzati AdSense in EEA/UK/Svizzera a scala, Google richiede una CMP certificata TCF. Il banner custom attuale è sufficiente per il soft launch; prima di scaling aggressivo valutare CMP certificata (Cookiebot, Axeptio, ecc.).

4. **Stripe go-live Premium**: backend/webhook/entitlements verificati su Preview (28 Apr 2026). Env var fix (29 Apr 2026): `STRIPE_PRICE_ID_PREMIUM` in Vercel Production conteneva per errore una Stripe Secret Key invece di un Price ID — corretta con il Price ID del prodotto SplitVote Premium (recurring monthly, €4.99/mese); Vercel Production redeployata. Codice già corretto, nessuna modifica runtime. Residuo: verifica checkout UI su `splitvote.io/profile` + pagamento live end-to-end non ancora eseguiti.

5. **Disaster recovery**: senza runbook e backup verificati, un'interruzione Redis o Supabase durante alto traffico è un evento catastrofico senza piano di risposta.

---

### Top 5 Blockers Priorità

| # | Blocker | Impatto | Effort |
|---|---------|---------|--------|
| 1 | Load test + Redis/Supabase stress test | Stabilità a scala | Medio (1 sprint) |
| 2 | Stripe Premium — pagamento live end-to-end (checkout UI ✅ 19 Mag 2026, env fix ✅ 29 Apr) | Revenue + user trust | Basso (1 test manuale residuo) |
| 3 | AdSense approval | Monetizzazione | Fuori dal nostro controllo |
| 4 | Google TCF CMP (per personalized ads EEA a scala) | AdSense policy compliance | Basso-medio (libreria esterna) |
| 5 | Disaster recovery runbook | Resilienza operativa | Basso (documentazione) |

---

*Generato automaticamente — aggiornare ad ogni sprint.*
