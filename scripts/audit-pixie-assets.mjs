#!/usr/bin/env node
/**
 * scripts/audit-pixie-assets.mjs
 *
 * READ-ONLY audit of every Pixie sprite under public/pixie/.
 *
 * For each `public/pixie/<species>/pixie-<species>-stage-<n>.png` it computes:
 *   - canvas size (always 256×256 by convention)
 *   - visible bbox (top/left/right/bottom of non-fully-transparent pixels)
 *   - bbox area ratio (bbox / canvas)
 *   - padding (left/right/top/bottom) in pixels
 *   - whether the image has an alpha channel
 *   - whether the file is effectively opaque (no transparent pixel)
 *   - estimated dominant background color (corner-pixel average)
 *
 * Output:
 *   - JSON next to the report: reports/pixie-assets-audit-<date>.json
 *   - Human-readable markdown summary
 *
 * Used to populate `lib/pixie-rendering.ts` with per-species scale overrides
 * so the dashboard / store / explainer surfaces render every species at a
 * consistent visual size, without rewriting the PNGs themselves.
 *
 * No file mutation. Run with: `node scripts/audit-pixie-assets.mjs`
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const PIXIE_DIR = join(REPO_ROOT, 'public', 'pixie')
const REPORTS_DIR = join(REPO_ROOT, 'reports')

/** A pixel is "visible" if its alpha is above this threshold (0-255). */
const ALPHA_THRESHOLD = 16

/** Bbox area ratio below this triggers a "tiny character" warning. */
const TINY_RATIO = 0.12

/**
 * Most Pixie PNGs have BAKED-IN opaque backgrounds (~#090914 / #000019).
 * Alpha-based bbox therefore returns 100% for all of them — useless for
 * sizing. We additionally compute a LUMA-based bbox: any pixel whose RGB
 * differs from the corner-average by more than DELTA is considered part
 * of the visible character.
 */
const LUMA_DELTA = 38

function loadPng(filepath) {
  const buf = readFileSync(filepath)
  return PNG.sync.read(buf)
}

/**
 * Returns the visible bbox of a PNG.
 * Scans pixels whose alpha is >= ALPHA_THRESHOLD. If the image is fully
 * opaque (e.g. JPEG-flattened PNG with baked background), returns the full
 * canvas as bbox AND flags it via the `opaque` boolean.
 */
function computeBbox(png) {
  const { width, height, data } = png
  let minX = width, minY = height, maxX = -1, maxY = -1
  let opaqueCount = 0
  let visibleCount = 0
  let totalAlpha = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const a = data[idx + 3]
      totalAlpha += a
      if (a === 255) opaqueCount++
      if (a >= ALPHA_THRESHOLD) {
        visibleCount++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const allOpaque = opaqueCount === width * height
  const hasAnyTransparent = totalAlpha < width * height * 255
  if (maxX < 0) {
    // Fully transparent — no visible pixels at all.
    return { bbox: null, opaque: false, visiblePixelCount: 0, hasAnyTransparent }
  }
  return {
    bbox: { left: minX, top: minY, right: maxX, bottom: maxY, width: maxX - minX + 1, height: maxY - minY + 1 },
    opaque: allOpaque,
    visiblePixelCount: visibleCount,
    hasAnyTransparent,
  }
}

/**
 * Compute a LUMA-based bbox: pixels that differ from the corner-average
 * colour by more than LUMA_DELTA (Euclidean distance in RGB) are
 * considered character pixels. Robust against baked-in backgrounds.
 */
function computeLumaBbox(png, bg) {
  const { width, height, data } = png
  let minX = width, minY = height, maxX = -1, maxY = -1
  let visible = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const dr = data[i] - bg.r
      const dg = data[i + 1] - bg.g
      const db = data[i + 2] - bg.b
      const dist2 = dr * dr + dg * dg + db * db
      if (dist2 > LUMA_DELTA * LUMA_DELTA) {
        visible++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return { bbox: null, visiblePixelCount: 0 }
  return {
    bbox: { left: minX, top: minY, right: maxX, bottom: maxY, width: maxX - minX + 1, height: maxY - minY + 1 },
    visiblePixelCount: visible,
  }
}

/** Estimate background colour as the average of the 4 corner pixels. */
function estimateBgColor(png) {
  const { width, height, data } = png
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ]
  let r = 0, g = 0, b = 0, a = 0
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4
    r += data[i]; g += data[i + 1]; b += data[i + 2]; a += data[i + 3]
  }
  return {
    r: Math.round(r / 4),
    g: Math.round(g / 4),
    b: Math.round(b / 4),
    a: Math.round(a / 4),
    hex: '#' + [r, g, b].map(v => Math.round(v / 4).toString(16).padStart(2, '0')).join(''),
  }
}

function listSpecies() {
  return readdirSync(PIXIE_DIR).filter(name => {
    const p = join(PIXIE_DIR, name)
    return statSync(p).isDirectory()
  }).sort()
}

function listStages(species) {
  const dir = join(PIXIE_DIR, species)
  return readdirSync(dir)
    .filter(f => /pixie-.+-stage-\d+\.png$/i.test(f))
    .map(f => {
      const m = f.match(/-stage-(\d+)\.png$/i)
      return { file: f, stage: parseInt(m[1], 10) }
    })
    .sort((a, b) => a.stage - b.stage)
}

function pct(n) {
  return (n * 100).toFixed(1) + '%'
}

function auditAll() {
  const results = []
  const speciesList = listSpecies()
  for (const species of speciesList) {
    for (const { file, stage } of listStages(species)) {
      const filepath = join(PIXIE_DIR, species, file)
      const rel = `public/pixie/${species}/${file}`
      try {
        const png = loadPng(filepath)
        const alphaResult = computeBbox(png)
        const bg = estimateBgColor(png)
        // Luma bbox: works for baked-bg PNGs where alpha bbox = 100%.
        const lumaResult = computeLumaBbox(png, bg)
        // Choose the more selective bbox. If the image has real transparency
        // (orbit) the alpha bbox is the authoritative one. Otherwise we trust
        // the luma bbox.
        const useLuma = alphaResult.opaque
        const bbox = useLuma ? lumaResult.bbox : alphaResult.bbox
        const visiblePixelCount = useLuma ? lumaResult.visiblePixelCount : alphaResult.visiblePixelCount
        const canvas = { width: png.width, height: png.height }
        const canvasArea = canvas.width * canvas.height
        const bboxArea = bbox ? bbox.width * bbox.height : 0
        const ratio = bboxArea / canvasArea
        const padding = bbox ? {
          left: bbox.left,
          right: canvas.width - bbox.right - 1,
          top: bbox.top,
          bottom: canvas.height - bbox.bottom - 1,
        } : null
        const warnings = []
        if (ratio < TINY_RATIO) warnings.push(`bbox_area_ratio=${pct(ratio)} below ${pct(TINY_RATIO)} (character is tiny on canvas)`)
        if (alphaResult.opaque) warnings.push('opaque (baked background)')
        if (!bbox) warnings.push('no visible pixels')
        results.push({
          species, stage, file: rel,
          canvas,
          bbox,
          padding,
          bbox_area_ratio: ratio,
          visible_pixel_count: visiblePixelCount,
          opaque: alphaResult.opaque,
          has_transparency: alphaResult.hasAnyTransparent,
          bg_estimate: bg,
          bbox_method: useLuma ? 'luma' : 'alpha',
          warnings,
        })
      } catch (err) {
        results.push({ species, stage, file: rel, error: err.message })
      }
    }
  }
  return results
}

/** Aggregate per-species median bbox area ratio + avg padding to drive
 *  the per-species scale override config. */
function summarisePerSpecies(rows) {
  const bySpecies = new Map()
  for (const r of rows) {
    if (!r.bbox || r.error) continue
    if (!bySpecies.has(r.species)) bySpecies.set(r.species, [])
    bySpecies.get(r.species).push(r)
  }
  const summary = []
  for (const [species, list] of bySpecies) {
    const ratios = list.map(r => r.bbox_area_ratio).sort((a, b) => a - b)
    const median = ratios[Math.floor(ratios.length / 2)]
    const avgPad = list.reduce((acc, r) => {
      acc.l += r.padding.left
      acc.r += r.padding.right
      acc.t += r.padding.top
      acc.b += r.padding.bottom
      return acc
    }, { l: 0, r: 0, t: 0, b: 0 })
    const n = list.length
    const baked = list.filter(r => r.opaque).length
    summary.push({
      species,
      stages: n,
      median_bbox_ratio: median,
      min_bbox_ratio: ratios[0],
      max_bbox_ratio: ratios[ratios.length - 1],
      avg_padding: { left: avgPad.l / n, right: avgPad.r / n, top: avgPad.t / n, bottom: avgPad.b / n },
      opaque_stages: baked,
      bg_estimate: list[0].bg_estimate,
    })
  }
  summary.sort((a, b) => a.median_bbox_ratio - b.median_bbox_ratio)
  return summary
}

/** Suggest a scale value per species inversely proportional to median bbox
 *  ratio. Target visible footprint ~0.55 (character fills ~55% of canvas
 *  after scale). Clamped to [1.0, 2.4] so we never blow up huge sprites. */
function suggestScale(median) {
  const TARGET = 0.55
  if (median <= 0) return 1.8
  // bbox_area_ratio is area; the linear scale needed to reach the target
  // is sqrt(target / current).
  const linear = Math.sqrt(TARGET / median)
  return Math.max(1.0, Math.min(2.4, Number(linear.toFixed(2))))
}

function renderMarkdown(rows, summary) {
  const date = new Date().toISOString().slice(0, 10)
  const totalFiles = rows.length
  const withErrors = rows.filter(r => r.error).length
  const tiny = rows.filter(r => r.bbox_area_ratio < TINY_RATIO).length
  const opaqueRows = rows.filter(r => r.opaque).length
  const lines = []
  lines.push(`# Pixie asset audit — ${date}`)
  lines.push('')
  lines.push('Read-only audit of every PNG under `public/pixie/`. Drives the per-species scale')
  lines.push('overrides in `lib/pixie-rendering.ts` so the dashboard / store / explainer surfaces')
  lines.push('render every species at a consistent visual size, without rewriting the PNGs themselves.')
  lines.push('')
  lines.push(`- Total files scanned: **${totalFiles}**`)
  lines.push(`- Files with errors: ${withErrors}`)
  lines.push(`- Files with bbox area ratio < ${pct(TINY_RATIO)} (small subject): **${tiny}**`)
  lines.push(`- Files with baked-in opaque background (no transparency): **${opaqueRows}**`)
  lines.push('')
  lines.push('## Per-species summary')
  lines.push('')
  lines.push('Sorted by median bbox area ratio ASC — species at the top need the most boost.')
  lines.push('')
  lines.push('| Species | Stages | Median bbox | Min | Max | Opaque? | BG estimate | Suggested scale |')
  lines.push('|---|---:|---:|---:|---:|---:|---|---:|')
  for (const s of summary) {
    const suggested = suggestScale(s.median_bbox_ratio)
    const opaqueFlag = s.opaque_stages > 0 ? `${s.opaque_stages}/${s.stages}` : '—'
    lines.push(`| \`${s.species}\` | ${s.stages} | ${pct(s.median_bbox_ratio)} | ${pct(s.min_bbox_ratio)} | ${pct(s.max_bbox_ratio)} | ${opaqueFlag} | \`${s.bg_estimate.hex}\` (α=${s.bg_estimate.a}) | **${suggested}×** |`)
  }
  lines.push('')
  lines.push('## Files with warnings')
  lines.push('')
  const warned = rows.filter(r => (r.warnings ?? []).length > 0 || r.error)
  if (warned.length === 0) {
    lines.push('_None._')
  } else {
    for (const r of warned) {
      if (r.error) {
        lines.push(`- \`${r.file}\` — ERROR: ${r.error}`)
      } else {
        lines.push(`- \`${r.file}\` — ${r.warnings.join('; ')}`)
      }
    }
  }
  lines.push('')
  lines.push('## How to use')
  lines.push('')
  lines.push('Copy the "Suggested scale" column into `lib/pixie-rendering.ts` to set the per-species')
  lines.push('`SPECIES_SCALE` map used by `<PixieSprite>`. Species not listed there fall back to')
  lines.push('the default scale.')
  lines.push('')
  return lines.join('\n')
}

function main() {
  if (!existsSync(PIXIE_DIR)) {
    console.error('No public/pixie directory found at', PIXIE_DIR)
    process.exit(1)
  }
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true })
  console.log('Scanning', PIXIE_DIR, '...')
  const rows = auditAll()
  const summary = summarisePerSpecies(rows)
  const date = new Date().toISOString().slice(0, 10)
  const md = renderMarkdown(rows, summary)
  const mdPath = join(REPORTS_DIR, `pixie-assets-audit-${date}.md`)
  const jsonPath = join(REPORTS_DIR, `pixie-assets-audit-${date}.json`)
  writeFileSync(mdPath, md)
  writeFileSync(jsonPath, JSON.stringify({ rows, summary }, null, 2))
  console.log(`Wrote ${mdPath}`)
  console.log(`Wrote ${jsonPath}`)
  console.log(`Done: ${rows.length} files, ${summary.length} species.`)
}

main()
