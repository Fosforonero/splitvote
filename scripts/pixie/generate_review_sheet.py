#!/usr/bin/env python3
"""Compose Pixie review contact sheets.

Two modes:

1. Single-root tiling (legacy, default):
   python3 scripts/pixie/generate_review_sheet.py --input pixie/work

2. Baseline-vs-WIP compare:
   python3 scripts/pixie/generate_review_sheet.py \\
     --baseline-input pixie/original --wip-input public/pixie \\
     --species angel,banana,caffe,devil,fuoco,hologram,ice,leaf,moonlight,scintille,triste,voidcore

   Compare mode emits one PNG per species under
   reports/pixie/review-sheets/<species>-baseline-vs-wip-YYYY-MM-DD.png
   (and optionally a single combined sheet via --combined).

Reads only. Never writes under public/pixie/ or pixie/original/.
"""

from __future__ import annotations

import argparse
import math
import re
import sys
from datetime import date
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.stderr.write("ERROR: Pillow not available. Install with: pip install Pillow\n")
    sys.exit(2)


FORBIDDEN_OUTPUT_ROOTS = ("public/pixie", "pixie/original")
DEFAULT_TILE = 128
COMPARE_TILE = 192
LABEL_HEIGHT = 18
LABEL_COL_W = 96
HEADER_ROW_H = 24
TITLE_BAR_H = 36
ROW_SEP_H = 8
BG_COLOR = (16, 18, 28, 255)
GRID_COLOR = (40, 44, 64, 255)
LABEL_COLOR = (215, 220, 240, 255)
TITLE_COLOR = (245, 245, 250, 255)
ACCENT_COLOR = (180, 200, 240, 255)
MISSING_COLOR = (200, 120, 120, 255)
STAGE_RE = re.compile(r"^pixie-([a-z0-9]+)-stage-([1-9]\d*)\.png$")


def assert_safe_output(path: Path) -> None:
    abs_path = path.resolve()
    for forbidden in FORBIDDEN_OUTPUT_ROOTS:
        forbidden_abs = Path(forbidden).resolve()
        try:
            abs_path.relative_to(forbidden_abs)
        except ValueError:
            continue
        raise SystemExit(f"REFUSING to write to forbidden path: {path}")


def load_font(size: int = 10):
    try:
        return ImageFont.truetype("Arial.ttf", size)
    except Exception:  # noqa: BLE001
        return ImageFont.load_default()


def list_stage_files(root: Path) -> dict[tuple[str, int], Path]:
    """Return {(species, stage): path} for canonical pixie stage PNGs under root."""
    out: dict[tuple[str, int], Path] = {}
    if not root.exists():
        return out
    for species_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        for f in sorted(species_dir.iterdir()):
            if not f.is_file():
                continue
            m = STAGE_RE.match(f.name)
            if m:
                out[(species_dir.name, int(m.group(2)))] = f
    return out


def paste_image(
    sheet: Image.Image,
    src: Path | None,
    x: int,
    y: int,
    tile: int,
    draw: ImageDraw.ImageDraw,
    font,
) -> None:
    """Paste a thumbnail of src into the (x,y,tile,tile) cell, centered. Renders MISSING/ERR on failure."""
    if src is None or not src.exists():
        draw.text((x + tile // 2 - 24, y + tile // 2 - 6), "MISSING", fill=MISSING_COLOR, font=font)
        return
    try:
        with Image.open(src) as im:
            im_rgba = im.convert("RGBA")
            im_rgba.thumbnail((tile - 8, tile - 8), Image.Resampling.LANCZOS)
            paste_x = x + (tile - im_rgba.width) // 2
            paste_y = y + (tile - im_rgba.height) // 2
            sheet.paste(im_rgba, (paste_x, paste_y), im_rgba)
    except Exception as exc:  # noqa: BLE001
        draw.text((x + 4, y + tile // 2 - 6), f"ERR:{type(exc).__name__}", fill=MISSING_COLOR, font=font)


def compose_species_sheet(
    species: str,
    baseline: dict[int, Path],
    wip: dict[int, Path],
    today: str,
    tile: int = COMPARE_TILE,
) -> Image.Image:
    """Compose a per-species 6-column × 2-row baseline-vs-WIP sheet."""
    stages = sorted(set(baseline.keys()) | set(wip.keys())) or [1, 2, 3, 4, 5, 6]
    n_cols = len(stages)
    sheet_w = LABEL_COL_W + n_cols * tile
    sheet_h = TITLE_BAR_H + HEADER_ROW_H + 2 * tile
    sheet = Image.new("RGBA", (sheet_w, sheet_h), BG_COLOR)
    draw = ImageDraw.Draw(sheet)
    tile_font = load_font(10)
    header_font = load_font(14)
    title_font = load_font(18)

    # Title bar
    draw.text((12, 8), f"pixie {species} — baseline vs WIP — {today}", fill=TITLE_COLOR, font=title_font)

    # Header row (stage labels)
    header_y = TITLE_BAR_H
    draw.rectangle((0, header_y, sheet_w - 1, header_y + HEADER_ROW_H - 1), outline=GRID_COLOR)
    for col, stage in enumerate(stages):
        x = LABEL_COL_W + col * tile
        draw.text((x + tile // 2 - 24, header_y + 4), f"stage {stage}", fill=ACCENT_COLOR, font=header_font)

    # Row labels + image cells
    row_specs = [("BASELINE", baseline), ("WIP", wip)]
    for row_idx, (row_label, files) in enumerate(row_specs):
        y = TITLE_BAR_H + HEADER_ROW_H + row_idx * tile
        # Row-label column
        draw.rectangle((0, y, LABEL_COL_W - 1, y + tile - 1), outline=GRID_COLOR)
        draw.text((10, y + tile // 2 - 8), row_label, fill=TITLE_COLOR, font=header_font)
        for col, stage in enumerate(stages):
            x = LABEL_COL_W + col * tile
            draw.rectangle((x, y, x + tile - 1, y + tile - 1), outline=GRID_COLOR)
            paste_image(sheet, files.get(stage), x, y, tile, draw, tile_font)

    return sheet


def run_compare_mode(
    baseline_root: Path,
    wip_root: Path,
    reports_root: Path,
    species_filter: list[str] | None,
    do_per_species: bool,
    do_combined: bool,
    tile: int,
) -> int:
    out_dir = reports_root / "review-sheets"
    assert_safe_output(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    baseline_files = list_stage_files(baseline_root)
    wip_files = list_stage_files(wip_root)

    if not baseline_files and not wip_files:
        sys.stderr.write(f"NOTE: no canonical stage files under {baseline_root} or {wip_root}.\n")
        return 0

    baseline_species = {sp for (sp, _) in baseline_files}
    wip_species = {sp for (sp, _) in wip_files}
    candidate_species = sorted(baseline_species | wip_species)

    if species_filter:
        wanted = {s.strip() for s in species_filter if s.strip()}
        candidate_species = [s for s in candidate_species if s in wanted]
        missing = sorted(wanted - set(candidate_species))
        for m in missing:
            sys.stderr.write(f"WARN: requested species not found in either root: {m}\n")

    if not candidate_species:
        sys.stderr.write("NOTE: no species to compare after applying --species filter.\n")
        return 0

    today = date.today().isoformat()
    per_species_sheets: list[tuple[str, Image.Image]] = []

    for species in candidate_species:
        bl = {st: p for (sp, st), p in baseline_files.items() if sp == species}
        wp = {st: p for (sp, st), p in wip_files.items() if sp == species}
        sheet = compose_species_sheet(species, bl, wp, today, tile=tile)
        per_species_sheets.append((species, sheet))
        if do_per_species:
            out_path = out_dir / f"{species}-baseline-vs-wip-{today}.png"
            assert_safe_output(out_path)
            sheet.save(out_path, format="PNG", optimize=True)
            print(f"compare sheet: {out_path} ({sheet.width}x{sheet.height})")

    if do_combined and per_species_sheets:
        total_w = max(im.width for _, im in per_species_sheets)
        total_h = sum(im.height for _, im in per_species_sheets) + ROW_SEP_H * (len(per_species_sheets) - 1)
        combined = Image.new("RGBA", (total_w, total_h), BG_COLOR)
        y = 0
        for _, im in per_species_sheets:
            combined.paste(im, (0, y), im)
            y += im.height + ROW_SEP_H
        out_path = out_dir / f"baseline-vs-wip-{today}.png"
        assert_safe_output(out_path)
        combined.save(out_path, format="PNG", optimize=True)
        print(f"combined sheet: {out_path} ({combined.width}x{combined.height})")

    return 0


def run_single_mode(
    input_root: Path,
    reports_root: Path,
    tile: int,
    cols: int,
    tag: str | None,
) -> int:
    if not input_root.exists():
        sys.stderr.write(f"NOTE: input root does not exist: {input_root}\n")
        return 0

    assert_safe_output(reports_root)
    reports_root.mkdir(parents=True, exist_ok=True)

    images: list[tuple[str, Path]] = []
    for path in sorted(input_root.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".png", ".webp"}:
            continue
        images.append((str(path.relative_to(input_root)), path))

    if not images:
        sys.stderr.write(f"NOTE: no assets found under {input_root}\n")
        return 0

    tile = max(32, tile)
    cell_h = tile + LABEL_HEIGHT
    auto_cols = max(1, min(12, int(math.sqrt(len(images)))))
    n_cols = cols if cols > 0 else auto_cols
    rows = math.ceil(len(images) / n_cols)
    sheet_w = n_cols * tile
    sheet_h = rows * cell_h

    sheet = Image.new("RGBA", (sheet_w, sheet_h), BG_COLOR)
    draw = ImageDraw.Draw(sheet)
    tile_font = load_font(10)

    for idx, (label, path) in enumerate(images):
        row, col = divmod(idx, n_cols)
        x = col * tile
        y = row * cell_h
        draw.rectangle((x, y, x + tile - 1, y + cell_h - 1), outline=GRID_COLOR)
        paste_image(sheet, path, x, y, tile, draw, tile_font)
        draw.text((x + 2, y + tile + 2), label[-32:], fill=LABEL_COLOR, font=tile_font)

    suffix = f"-{tag}" if tag else ""
    today = date.today().isoformat()
    out_path = reports_root / f"review-sheet-{today}{suffix}.png"
    assert_safe_output(out_path)
    sheet.save(out_path, format="PNG", optimize=True)
    print(f"review sheet: {out_path} ({sheet_w}x{sheet_h}, {len(images)} tiles)")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Generate a Pixie review contact sheet (single-root or baseline-vs-WIP compare).",
    )
    parser.add_argument("--input", default=None, help="Single-root mode: asset root to tile (default: pixie/work).")
    parser.add_argument("--baseline-input", default=None, help="Compare mode: baseline asset root.")
    parser.add_argument("--wip-input", default=None, help="Compare mode: WIP asset root.")
    parser.add_argument("--species", default=None, help="Compare mode: comma-separated allowlist (default: every species present in either root).")
    parser.add_argument("--per-species", action="store_true", default=False, help="Compare mode: emit one PNG per species. Default if no other compare-output flag is set.")
    parser.add_argument("--combined", action="store_true", default=False, help="Compare mode: emit a single combined sheet stacking every species vertically.")
    parser.add_argument("--reports", default="reports/pixie", help="Reports output directory.")
    parser.add_argument("--tile", type=int, default=0, help="Per-asset tile size (default: 128 single-root, 192 compare).")
    parser.add_argument("--cols", type=int, default=0, help="Single-root only: force column count (0 = auto).")
    parser.add_argument("--tag", default=None, help="Single-root only: optional suffix on the output filename.")
    args = parser.parse_args(argv)

    in_compare_mode = bool(args.baseline_input) or bool(args.wip_input)

    if in_compare_mode:
        if not args.baseline_input or not args.wip_input:
            sys.stderr.write("ERROR: compare mode requires both --baseline-input and --wip-input.\n")
            return 2
        if args.input:
            sys.stderr.write("ERROR: --input cannot be combined with --baseline-input/--wip-input.\n")
            return 2
        species_filter = args.species.split(",") if args.species else None
        # Default to --per-species if no output flag was set.
        do_per = args.per_species or not (args.per_species or args.combined)
        tile = args.tile if args.tile > 0 else COMPARE_TILE
        return run_compare_mode(
            baseline_root=Path(args.baseline_input).resolve(),
            wip_root=Path(args.wip_input).resolve(),
            reports_root=Path(args.reports),
            species_filter=species_filter,
            do_per_species=do_per,
            do_combined=args.combined,
            tile=tile,
        )

    # Single-root mode (default)
    input_root = Path(args.input or "pixie/work").resolve()
    tile = args.tile if args.tile > 0 else DEFAULT_TILE
    return run_single_mode(
        input_root=input_root,
        reports_root=Path(args.reports),
        tile=tile,
        cols=args.cols,
        tag=args.tag,
    )


if __name__ == "__main__":
    raise SystemExit(main())
