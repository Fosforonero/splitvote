# reports/pixie/

Generated output from the Pixie pipeline scripts (`scripts/pixie/*.py`) and findings from the Pixie governance agents (`.claude/agents/pixie-*.md`).

## What lives here

| Filename pattern | Producer | Purpose |
|---|---|---|
| `audit-YYYY-MM-DD.{md,json}` | `scripts/pixie/scan_pixie.py` / `pixie-auditor` | Inventory of `pixie/original/`, naming drift, missing combinations. |
| `normalize-YYYY-MM-DD.{md,log}` | `scripts/pixie/normalize_pixie.py` / `pixie-normalizer` | Per-file normalization log + summary counts. |
| `enhance-YYYY-MM-DD.{md,log}` | `pixie-enhancer` | Stage-effect application log. |
| `review-YYYY-MM-DD.md` | `pixie-reviewer` | Per-asset verdict (`accept` / `rework` / `pm_decision`). |
| `review-sheet-YYYY-MM-DD.png` | `scripts/pixie/generate_review_sheet.py` (single-root) | Contact-sheet PNG for visual QA. |
| `review-sheets/<species>-baseline-vs-wip-YYYY-MM-DD.png` | `scripts/pixie/generate_review_sheet.py` (compare mode, `--per-species`) | Per-species baseline-vs-WIP side-by-side (6 cols × 2 rows). |
| `review-sheets/baseline-vs-wip-YYYY-MM-DD.png` | `scripts/pixie/generate_review_sheet.py` (compare mode, `--combined`) | Single combined sheet stacking every species vertically. |
| `validate-YYYY-MM-DD.{md,json}` | `scripts/pixie/validate_pixie.py` / `pixie-validator` | Final promotion-readiness gate. |

## Conventions

- One report per day, per step. If a step is run multiple times in a day, suffix `-rN` (e.g. `audit-2026-05-21-r2.md`).
- Markdown reports are the human surface; JSON siblings (when present) are for downstream automation.
- Run logs (`*.log`) capture per-file operations and may be large; rotate or trim before commit if they exceed a few hundred KB.

## Tracked vs ignored

- This README and the pipeline scripts in `scripts/pixie/` are **tracked**.
- Asset working trees (`pixie/original/`, `pixie/work/`, `pixie/final/`, `pixie/firefly_import/`) are **gitignored**.
- Report files in this directory are tracked by default. If a particular run produces an oversized review sheet PNG that should not be committed, add it under an explicit per-file `.gitignore` entry — do not blanket-ignore the directory.

## What does NOT live here

- Raw assets — those live in `pixie/original/` (gitignored, local-only).
- Working assets — `pixie/work/` (gitignored).
- Production assets — `public/pixie/<species>/` (tracked, but never written by these scripts).
