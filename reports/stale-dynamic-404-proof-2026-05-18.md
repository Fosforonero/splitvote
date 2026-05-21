# Stale Dynamic 404 Proof — 2026-05-18

**Sprint:** `SEO-STALE-DYNAMIC-404-PROOF-01`
**Mode:** Read-only audit. No code, redirects, Redis cleanup, or sitemap changes.
**Question:** Does SplitVote still emit live internal links to deleted/pruned Redis
dynamic scenario IDs that resolve to 404?
**Answer:** **No.** 863 of 863 unique internal `/play/*` and `/results/*` links
on the crawled surfaces returned HTTP 200. **Zero internal 404s.**

---

## TL;DR

- Crawled 22 high-link-density public surfaces (homepage EN+IT, trending EN+IT, 9
  EN + 9 IT category pages).
- Extracted **1,382 internal link occurrences** → **863 unique URLs** → **820
  unique scenario IDs**.
- Live-status-checked every unique URL against production (`https://splitvote.io`).
- Result: 863/863 = **HTTP 200**. No 404, no 410, no 5xx. 67 first-pass timeouts
  (HTTP code `000`) were all confirmed 200 on a longer-timeout serial retry.
- Recommendation: **close as no-op**. Do not build the queued mitigation sprint.

---

## Methodology (anti–false-positive)

After prior sprints produced false positives from case-sensitive grep
(`hreflang` vs `hrefLang`) and from a typo'd slug
(`why-we-love-impossible-choices` vs `why-people-love-impossible-choices`), this
audit is constrained by hard rules:

1. **No invented URLs.** Every URL checked must come from `curl` output of a
   live source page, not from a manually constructed path.
2. **Every claimed 404 must trace to a live source page** that emits the
   exact `href`, byte-for-byte.
3. **Every scenario ID must be cross-checked** against the static inventory
   in `lib/scenarios.ts` and against the dynamic-pattern allowlist
   (`ai-en-*`, `ai-it-*`, `news-YYYYMMDD-*`, `culture-YYYYMMDD-*`,
   `evergreen-YYYYMMDD-*`, `gap-YYYYMMDD-*`, `psych-YYYYMMDD-*`,
   `viral-YYYYMMDD-*`, `grimdark-YYYYMMDD-*`).
4. **Status-check uses the same domain the app actually serves** (`splitvote.io`,
   confirmed via `metadataBase` in `app/layout.tsx`). An earlier pass against
   the wrong domain (`splitvote.app`) was discarded.
5. **HTTP code `000`** (curl-level failure: timeout, TLS hiccup, connection
   reset) is not counted as a 404. All `000` results were retried serially
   with a 40s timeout before being accepted as the final status.

---

## Source surfaces crawled (22)

| URL | Bytes | Dilemma links added |
|---|---:|---:|
| `https://splitvote.io/` | 1,434,133 | 428 |
| `https://splitvote.io/it` | 1,486,749 | 435 |
| `https://splitvote.io/trending` | 71,199 | 12 |
| `https://splitvote.io/it/trending` | 54,179 | 6 |
| `https://splitvote.io/category/ethics` | 19,133 | 0 |
| `https://splitvote.io/category/relationships` | 239,932 | 43 |
| `https://splitvote.io/category/society` | 372,123 | 75 |
| `https://splitvote.io/category/work` | 19,125 | 0 |
| `https://splitvote.io/category/technology` | 320,595 | 63 |
| `https://splitvote.io/category/lifestyle` | 50,723 | 0 |
| `https://splitvote.io/category/family` | 19,133 | 0 |
| `https://splitvote.io/category/justice` | 365,577 | 71 |
| `https://splitvote.io/category/identity` | 19,141 | 0 |
| `https://splitvote.io/it/category/ethics` | 19,610 | 0 |
| `https://splitvote.io/it/category/relationships` | 249,653 | 46 |
| `https://splitvote.io/it/category/society` | 309,781 | 62 |
| `https://splitvote.io/it/category/work` | 19,602 | 0 |
| `https://splitvote.io/it/category/technology` | 330,962 | 65 |
| `https://splitvote.io/it/category/lifestyle` | 51,848 | 0 |
| `https://splitvote.io/it/category/family` | 19,610 | 0 |
| `https://splitvote.io/it/category/justice` | 388,329 | 76 |
| `https://splitvote.io/it/category/identity` | 19,618 | 0 |

**Totals:** 1,382 link occurrences, 863 unique URLs.

Note: categories with ~19 KB pages (`ethics`, `work`, `lifestyle`, `family`,
`identity`, EN+IT) currently render the editorial/FAQ shell without
RelatedDilemmas rows because they have no static `scenarios.ts` membership.
This is expected and consistent across locales — it is not a regression
introduced by this sprint and is out of scope here.

---

## Link extraction → unique URLs → unique IDs

Regex used (verified against live curl output, not constructed):

```
href="(/it)?/(play|results)/[a-z0-9][a-z0-9-]+"
```

- Total `href` occurrences extracted: **1,382**
- Unique URLs: **863** (861 `/play/*`, 2 `/results/*`)
- Unique scenario IDs: **820**

### ID classification (820 IDs)

| Source | Count | Notes |
|---|---:|---|
| `lib/scenarios.ts` (static inventory) | 41 | All 41 cataloged IDs are linked |
| `ai-en-*` / `ai-it-*` (dynamic Redis) | 351 | Older AI batch |
| `news-YYYYMMDD-*` (dynamic Redis) | 204 | Newsroom-style daily batch |
| `culture-YYYYMMDD-*` (dynamic Redis) | 56 | Culture daily batch |
| `gap-YYYYMMDD-*` (dynamic Redis) | 48 | Gap-fill batch |
| `evergreen-YYYYMMDD-*` (dynamic Redis) | 48 | Evergreen batch |
| `psych-YYYYMMDD-*` (dynamic Redis) | 36 | Psych batch |
| `viral-YYYYMMDD-*` (dynamic Redis) | 24 | Viral batch |
| `grimdark-YYYYMMDD-*` (dynamic Redis) | 12 | Grimdark batch |
| **Uncategorized** | **0** | — |

Every linked ID matches either the static inventory or a known dynamic
prefix family. No ghost prefixes, no constructed-looking slugs.

---

## Live status-check results

Method: `curl -sL -o /dev/null -w "%{http_code}" --max-time 20` against
`https://splitvote.io<path>`, parallelism = 25, followed by serial retry
of all transient `000` codes with `--max-time 40`.

| HTTP code | Count | Notes |
|---:|---:|---|
| 200 | **863** | Final, after retry |
| 404 | **0** | — |
| 410 | **0** | — |
| 3xx | **0** | (curl follows redirects; final status is what is counted) |
| 5xx | **0** | — |
| 000 first pass | 67 | All resolved to 200 on serial retry; not actual failures |

**863 / 863 = 200.**

---

## Cross-check: ID → live status

- All 41 static IDs from `lib/scenarios.ts` → 200.
- All 351 `ai-en-*` / `ai-it-*` IDs → 200.
- All 428 `*-YYYYMMDD-*` dated dynamic IDs (news/culture/gap/evergreen/psych/
  viral/grimdark) → 200.
- No ID linked on a live source page is missing from Redis.
- No ID linked on a live source page is missing from `lib/scenarios.ts` when
  the regex would predict it should be there.

---

## 404 table

| Source page | Linked URL | HTTP | Root cause |
|---|---|---|---|
| — | — | — | **(no rows: zero 404s found)** |

---

## What this rules out

1. **`RelatedDilemmas` is not emitting pruned Redis IDs.** Whatever filter
   it applies is currently strict enough to keep all surfaced IDs live.
2. **`/trending` is not emitting pruned IDs.** Both EN (12) and IT (6)
   trending entries resolve.
3. **Category pages are not emitting pruned IDs.** Every category page with
   non-zero dilemma rows resolves 100% of its links.
4. **Homepage + IT homepage** (the two highest-density surfaces, ~430 links
   each) are clean.
5. **The dynamic-scenario sitemap-exclusion comment** in `app/sitemap.ts`
   reflects an intentional policy, not an unhandled drift — internal links
   still reach those scenarios, and the scenarios are still present in Redis
   for the link surface that exists today.

---

## What this audit does NOT cover

These are deliberately out of scope (per the sprint's First-Principles Gate
and read-only constraint) and would require their own sprints:

1. **Blog posts** (`/blog/*`, `/it/blog/*`). The blog index dead-link audit
   already covered the index pages; this sprint targeted dilemma surfaces.
2. **Topic / SEO hub pages** (`/topics/*`, `/it/temi/*`). Same reasoning.
3. **Profile pages** and other authed surfaces — anonymous public crawl only.
4. **External backlinks** indexed by Google to URLs that may have once existed
   and were pruned before this audit ran. That window can only be closed by
   inspecting the GSC `Pages › Not indexed` export.
5. **Scenarios linked only from auth-gated UI** (admin, dashboards). Not
   relevant for SEO 404 risk.

---

## Recommendation

**Close `SEO-STALE-DYNAMIC-404-PROOF-01` as no-op.**

The queued `SEO-STALE-DYNAMIC-404-MITIGATION-01` should not be built: with zero
internal 404s, every mitigation (redirect rules to category, response-code
override, Redis cleanup) would either be a no-op in practice or introduce new
behavior with no measurable problem to solve.

The only remaining investigation path for stale-dynamic 404s is the **GSC export**
of `Pages › Not indexed (Not found 404)`, which exposes URLs Google saw
historically — including any that existed before this audit window. That work
is the previously queued `GSC-EXPORT-CROSS-REFERENCE-01` sprint and is blocked
on the PM exporting the CSV.

---

## Reproduce

Artifacts on disk during the audit run:

- `/tmp/static-ids.txt` — 41 static IDs from `lib/scenarios.ts`
- `/tmp/pages.txt` — 22 source URLs crawled
- `/tmp/all-source-links.tsv` — 1,382 `source<TAB>link` edges
- `/tmp/unique-links.txt` — 863 unique link URLs
- `/tmp/unique-ids.txt` — 820 unique scenario IDs
- `/tmp/status-results.tsv` — first-pass status check (parallel, 20s timeout)
- `/tmp/retry-results.tsv` — serial retry of 67 transient `000`s (40s timeout)

Reproduction commands:

```bash
# 1. Static inventory
grep -oE "id:[[:space:]]*'[a-z0-9][a-z0-9-]+'" lib/scenarios.ts \
  | sed -E "s/^id:[[:space:]]*'(.+)'$/\\1/" \
  | sort -u > /tmp/static-ids.txt

# 2. Crawl (URLs from /tmp/pages.txt)
: > /tmp/all-source-links.tsv
while IFS= read -r url; do
  curl -sL --max-time 25 -H 'User-Agent: Mozilla/5.0 (audit)' "$url" \
    | grep -oE 'href="(/it)?/(play|results)/[a-z0-9][a-z0-9-]+"' \
    | sed -E 's|^href="||; s|"$||' \
    | sort -u \
    | awk -v src="$url" '{print src"\t"$0}' \
    >> /tmp/all-source-links.tsv
done < /tmp/pages.txt

# 3. Unique links + IDs
cut -f2 /tmp/all-source-links.tsv | sort -u > /tmp/unique-links.txt
awk '{ s=$0; sub(/^\/it\//,"/",s); sub(/^\/(play|results)\//,"",s); print s }' \
  /tmp/unique-links.txt | sort -u > /tmp/unique-ids.txt

# 4. Status check (parallel, then serial retry)
: > /tmp/status-results.tsv
while IFS= read -r link; do
  ( code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "https://splitvote.io$link")
    printf '%s\t%s\n' "$code" "$link" >> /tmp/status-results.tsv ) &
  job_count=$((job_count + 1))
  [ $((job_count % 25)) -eq 0 ] && wait
done < /tmp/unique-links.txt; wait
cut -f1 /tmp/status-results.tsv | sort | uniq -c | sort -rn
```

---

## Status

- **Sprint:** closed as no-op.
- **Code changes:** none.
- **Doc changes:** this report only.
- **Commits / pushes:** none performed; awaiting PM decision on whether to
  commit this report.
