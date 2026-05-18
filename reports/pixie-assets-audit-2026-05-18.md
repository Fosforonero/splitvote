# Pixie asset audit — 2026-05-18

Read-only audit of every PNG under `public/pixie/`. Drives the per-species scale
overrides in `lib/pixie-rendering.ts` so the dashboard / store / explainer surfaces
render every species at a consistent visual size, without rewriting the PNGs themselves.

- Total files scanned: **144**
- Files with errors: 0
- Files with bbox area ratio < 12.0% (small subject): **28**
- Files with baked-in opaque background (no transparency): **138**

## Per-species summary

Sorted by median bbox area ratio ASC — species at the top need the most boost.

| Species | Stages | Median bbox | Min | Max | Opaque? | BG estimate | Suggested scale |
|---|---:|---:|---:|---:|---:|---|---:|
| `galaxy` | 6 | 10.4% | 6.1% | 26.6% | 6/6 | `#000019` (α=255) | **2.3×** |
| `diamond` | 6 | 11.4% | 6.7% | 24.0% | 6/6 | `#00011a` (α=255) | **2.2×** |
| `crown` | 6 | 11.7% | 7.6% | 23.2% | 6/6 | `#000119` (α=255) | **2.16×** |
| `heart` | 6 | 15.1% | 9.2% | 25.7% | 6/6 | `#000019` (α=255) | **1.91×** |
| `void` | 6 | 15.1% | 5.3% | 26.1% | 6/6 | `#090914` (α=255) | **1.91×** |
| `shade` | 6 | 16.0% | 9.6% | 26.0% | 6/6 | `#000019` (α=255) | **1.85×** |
| `overseer` | 6 | 16.8% | 4.9% | 30.3% | 6/6 | `#000018` (α=255) | **1.81×** |
| `robot` | 6 | 18.6% | 12.7% | 29.4% | 6/6 | `#00011b` (α=255) | **1.72×** |
| `spark` | 6 | 19.4% | 13.8% | 28.8% | 6/6 | `#000219` (α=255) | **1.68×** |
| `momo` | 6 | 19.9% | 12.2% | 31.6% | 6/6 | `#000219` (α=255) | **1.66×** |
| `blip` | 6 | 20.6% | 12.9% | 31.0% | 6/6 | `#00031c` (α=255) | **1.63×** |
| `voidcore` | 6 | 26.1% | 7.7% | 41.3% | 6/6 | `#090914` (α=255) | **1.45×** |
| `caffe` | 6 | 27.6% | 10.1% | 38.7% | 6/6 | `#090914` (α=255) | **1.41×** |
| `scintille` | 6 | 28.5% | 8.3% | 43.8% | 6/6 | `#090914` (α=255) | **1.39×** |
| `devil` | 6 | 30.4% | 12.1% | 30.4% | 6/6 | `#090914` (α=255) | **1.34×** |
| `fuoco` | 6 | 30.6% | 11.3% | 40.6% | 6/6 | `#090914` (α=255) | **1.34×** |
| `triste` | 6 | 31.1% | 11.1% | 44.8% | 6/6 | `#090914` (α=255) | **1.33×** |
| `banana` | 6 | 32.0% | 11.9% | 41.9% | 6/6 | `#090914` (α=255) | **1.31×** |
| `angel` | 6 | 32.7% | 13.0% | 32.7% | 6/6 | `#090914` (α=255) | **1.3×** |
| `leaf` | 6 | 36.1% | 22.3% | 65.4% | 6/6 | `#090914` (α=255) | **1.23×** |
| `ice` | 6 | 38.5% | 13.6% | 46.4% | 6/6 | `#090914` (α=255) | **1.19×** |
| `moonlight` | 6 | 41.0% | 21.6% | 65.6% | 6/6 | `#090914` (α=255) | **1.16×** |
| `hologram` | 6 | 42.2% | 22.7% | 54.2% | 6/6 | `#090914` (α=255) | **1.14×** |
| `orbit` | 6 | 44.9% | 42.2% | 52.7% | — | `#000000` (α=0) | **1.11×** |

## Files with warnings

- `public/pixie/angel/pixie-angel-stage-1.png` — opaque (baked background)
- `public/pixie/angel/pixie-angel-stage-2.png` — opaque (baked background)
- `public/pixie/angel/pixie-angel-stage-3.png` — opaque (baked background)
- `public/pixie/angel/pixie-angel-stage-4.png` — opaque (baked background)
- `public/pixie/angel/pixie-angel-stage-5.png` — opaque (baked background)
- `public/pixie/angel/pixie-angel-stage-6.png` — opaque (baked background)
- `public/pixie/banana/pixie-banana-stage-1.png` — bbox_area_ratio=11.9% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/banana/pixie-banana-stage-2.png` — opaque (baked background)
- `public/pixie/banana/pixie-banana-stage-3.png` — opaque (baked background)
- `public/pixie/banana/pixie-banana-stage-4.png` — opaque (baked background)
- `public/pixie/banana/pixie-banana-stage-5.png` — opaque (baked background)
- `public/pixie/banana/pixie-banana-stage-6.png` — opaque (baked background)
- `public/pixie/blip/pixie-blip-stage-1.png` — opaque (baked background)
- `public/pixie/blip/pixie-blip-stage-2.png` — opaque (baked background)
- `public/pixie/blip/pixie-blip-stage-3.png` — opaque (baked background)
- `public/pixie/blip/pixie-blip-stage-4.png` — opaque (baked background)
- `public/pixie/blip/pixie-blip-stage-5.png` — opaque (baked background)
- `public/pixie/blip/pixie-blip-stage-6.png` — opaque (baked background)
- `public/pixie/caffe/pixie-caffe-stage-1.png` — bbox_area_ratio=10.1% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/caffe/pixie-caffe-stage-2.png` — opaque (baked background)
- `public/pixie/caffe/pixie-caffe-stage-3.png` — opaque (baked background)
- `public/pixie/caffe/pixie-caffe-stage-4.png` — opaque (baked background)
- `public/pixie/caffe/pixie-caffe-stage-5.png` — opaque (baked background)
- `public/pixie/caffe/pixie-caffe-stage-6.png` — opaque (baked background)
- `public/pixie/crown/pixie-crown-stage-1.png` — bbox_area_ratio=7.6% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/crown/pixie-crown-stage-2.png` — bbox_area_ratio=8.2% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/crown/pixie-crown-stage-3.png` — bbox_area_ratio=10.6% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/crown/pixie-crown-stage-4.png` — bbox_area_ratio=11.7% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/crown/pixie-crown-stage-5.png` — opaque (baked background)
- `public/pixie/crown/pixie-crown-stage-6.png` — opaque (baked background)
- `public/pixie/devil/pixie-devil-stage-1.png` — opaque (baked background)
- `public/pixie/devil/pixie-devil-stage-2.png` — opaque (baked background)
- `public/pixie/devil/pixie-devil-stage-3.png` — opaque (baked background)
- `public/pixie/devil/pixie-devil-stage-4.png` — opaque (baked background)
- `public/pixie/devil/pixie-devil-stage-5.png` — opaque (baked background)
- `public/pixie/devil/pixie-devil-stage-6.png` — opaque (baked background)
- `public/pixie/diamond/pixie-diamond-stage-1.png` — bbox_area_ratio=6.7% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/diamond/pixie-diamond-stage-2.png` — bbox_area_ratio=7.9% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/diamond/pixie-diamond-stage-3.png` — bbox_area_ratio=10.1% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/diamond/pixie-diamond-stage-4.png` — bbox_area_ratio=11.4% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/diamond/pixie-diamond-stage-5.png` — opaque (baked background)
- `public/pixie/diamond/pixie-diamond-stage-6.png` — opaque (baked background)
- `public/pixie/fuoco/pixie-fuoco-stage-1.png` — bbox_area_ratio=11.3% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/fuoco/pixie-fuoco-stage-2.png` — opaque (baked background)
- `public/pixie/fuoco/pixie-fuoco-stage-3.png` — opaque (baked background)
- `public/pixie/fuoco/pixie-fuoco-stage-4.png` — opaque (baked background)
- `public/pixie/fuoco/pixie-fuoco-stage-5.png` — opaque (baked background)
- `public/pixie/fuoco/pixie-fuoco-stage-6.png` — opaque (baked background)
- `public/pixie/galaxy/pixie-galaxy-stage-1.png` — bbox_area_ratio=6.1% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/galaxy/pixie-galaxy-stage-2.png` — bbox_area_ratio=7.8% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/galaxy/pixie-galaxy-stage-3.png` — bbox_area_ratio=9.5% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/galaxy/pixie-galaxy-stage-4.png` — bbox_area_ratio=10.4% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/galaxy/pixie-galaxy-stage-5.png` — opaque (baked background)
- `public/pixie/galaxy/pixie-galaxy-stage-6.png` — opaque (baked background)
- `public/pixie/heart/pixie-heart-stage-1.png` — bbox_area_ratio=9.2% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/heart/pixie-heart-stage-2.png` — bbox_area_ratio=11.4% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/heart/pixie-heart-stage-3.png` — opaque (baked background)
- `public/pixie/heart/pixie-heart-stage-4.png` — opaque (baked background)
- `public/pixie/heart/pixie-heart-stage-5.png` — opaque (baked background)
- `public/pixie/heart/pixie-heart-stage-6.png` — opaque (baked background)
- `public/pixie/hologram/pixie-hologram-stage-1.png` — opaque (baked background)
- `public/pixie/hologram/pixie-hologram-stage-2.png` — opaque (baked background)
- `public/pixie/hologram/pixie-hologram-stage-3.png` — opaque (baked background)
- `public/pixie/hologram/pixie-hologram-stage-4.png` — opaque (baked background)
- `public/pixie/hologram/pixie-hologram-stage-5.png` — opaque (baked background)
- `public/pixie/hologram/pixie-hologram-stage-6.png` — opaque (baked background)
- `public/pixie/ice/pixie-ice-stage-1.png` — opaque (baked background)
- `public/pixie/ice/pixie-ice-stage-2.png` — opaque (baked background)
- `public/pixie/ice/pixie-ice-stage-3.png` — opaque (baked background)
- `public/pixie/ice/pixie-ice-stage-4.png` — opaque (baked background)
- `public/pixie/ice/pixie-ice-stage-5.png` — opaque (baked background)
- `public/pixie/ice/pixie-ice-stage-6.png` — opaque (baked background)
- `public/pixie/leaf/pixie-leaf-stage-1.png` — opaque (baked background)
- `public/pixie/leaf/pixie-leaf-stage-2.png` — opaque (baked background)
- `public/pixie/leaf/pixie-leaf-stage-3.png` — opaque (baked background)
- `public/pixie/leaf/pixie-leaf-stage-4.png` — opaque (baked background)
- `public/pixie/leaf/pixie-leaf-stage-5.png` — opaque (baked background)
- `public/pixie/leaf/pixie-leaf-stage-6.png` — opaque (baked background)
- `public/pixie/momo/pixie-momo-stage-1.png` — opaque (baked background)
- `public/pixie/momo/pixie-momo-stage-2.png` — opaque (baked background)
- `public/pixie/momo/pixie-momo-stage-3.png` — opaque (baked background)
- `public/pixie/momo/pixie-momo-stage-4.png` — opaque (baked background)
- `public/pixie/momo/pixie-momo-stage-5.png` — opaque (baked background)
- `public/pixie/momo/pixie-momo-stage-6.png` — opaque (baked background)
- `public/pixie/moonlight/pixie-moonlight-stage-1.png` — opaque (baked background)
- `public/pixie/moonlight/pixie-moonlight-stage-2.png` — opaque (baked background)
- `public/pixie/moonlight/pixie-moonlight-stage-3.png` — opaque (baked background)
- `public/pixie/moonlight/pixie-moonlight-stage-4.png` — opaque (baked background)
- `public/pixie/moonlight/pixie-moonlight-stage-5.png` — opaque (baked background)
- `public/pixie/moonlight/pixie-moonlight-stage-6.png` — opaque (baked background)
- `public/pixie/overseer/pixie-overseer-stage-1.png` — bbox_area_ratio=4.9% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/overseer/pixie-overseer-stage-2.png` — bbox_area_ratio=8.3% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/overseer/pixie-overseer-stage-3.png` — bbox_area_ratio=11.9% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/overseer/pixie-overseer-stage-4.png` — opaque (baked background)
- `public/pixie/overseer/pixie-overseer-stage-5.png` — opaque (baked background)
- `public/pixie/overseer/pixie-overseer-stage-6.png` — opaque (baked background)
- `public/pixie/robot/pixie-robot-stage-1.png` — opaque (baked background)
- `public/pixie/robot/pixie-robot-stage-2.png` — opaque (baked background)
- `public/pixie/robot/pixie-robot-stage-3.png` — opaque (baked background)
- `public/pixie/robot/pixie-robot-stage-4.png` — opaque (baked background)
- `public/pixie/robot/pixie-robot-stage-5.png` — opaque (baked background)
- `public/pixie/robot/pixie-robot-stage-6.png` — opaque (baked background)
- `public/pixie/scintille/pixie-scintille-stage-1.png` — bbox_area_ratio=8.3% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/scintille/pixie-scintille-stage-2.png` — opaque (baked background)
- `public/pixie/scintille/pixie-scintille-stage-3.png` — opaque (baked background)
- `public/pixie/scintille/pixie-scintille-stage-4.png` — opaque (baked background)
- `public/pixie/scintille/pixie-scintille-stage-5.png` — opaque (baked background)
- `public/pixie/scintille/pixie-scintille-stage-6.png` — opaque (baked background)
- `public/pixie/shade/pixie-shade-stage-1.png` — bbox_area_ratio=9.6% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/shade/pixie-shade-stage-2.png` — bbox_area_ratio=10.9% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/shade/pixie-shade-stage-3.png` — opaque (baked background)
- `public/pixie/shade/pixie-shade-stage-4.png` — opaque (baked background)
- `public/pixie/shade/pixie-shade-stage-5.png` — opaque (baked background)
- `public/pixie/shade/pixie-shade-stage-6.png` — opaque (baked background)
- `public/pixie/spark/pixie-spark-stage-1.png` — opaque (baked background)
- `public/pixie/spark/pixie-spark-stage-2.png` — opaque (baked background)
- `public/pixie/spark/pixie-spark-stage-3.png` — opaque (baked background)
- `public/pixie/spark/pixie-spark-stage-4.png` — opaque (baked background)
- `public/pixie/spark/pixie-spark-stage-5.png` — opaque (baked background)
- `public/pixie/spark/pixie-spark-stage-6.png` — opaque (baked background)
- `public/pixie/triste/pixie-triste-stage-1.png` — bbox_area_ratio=11.1% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/triste/pixie-triste-stage-2.png` — opaque (baked background)
- `public/pixie/triste/pixie-triste-stage-3.png` — opaque (baked background)
- `public/pixie/triste/pixie-triste-stage-4.png` — opaque (baked background)
- `public/pixie/triste/pixie-triste-stage-5.png` — opaque (baked background)
- `public/pixie/triste/pixie-triste-stage-6.png` — opaque (baked background)
- `public/pixie/void/pixie-void-stage-1.png` — bbox_area_ratio=5.3% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/void/pixie-void-stage-2.png` — bbox_area_ratio=8.7% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/void/pixie-void-stage-3.png` — bbox_area_ratio=9.3% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/void/pixie-void-stage-4.png` — opaque (baked background)
- `public/pixie/void/pixie-void-stage-5.png` — opaque (baked background)
- `public/pixie/void/pixie-void-stage-6.png` — opaque (baked background)
- `public/pixie/voidcore/pixie-voidcore-stage-1.png` — bbox_area_ratio=7.7% below 12.0% (character is tiny on canvas); opaque (baked background)
- `public/pixie/voidcore/pixie-voidcore-stage-2.png` — opaque (baked background)
- `public/pixie/voidcore/pixie-voidcore-stage-3.png` — opaque (baked background)
- `public/pixie/voidcore/pixie-voidcore-stage-4.png` — opaque (baked background)
- `public/pixie/voidcore/pixie-voidcore-stage-5.png` — opaque (baked background)
- `public/pixie/voidcore/pixie-voidcore-stage-6.png` — opaque (baked background)

## How to use

Copy the "Suggested scale" column into `lib/pixie-rendering.ts` to set the per-species
`SPECIES_SCALE` map used by `<PixieSprite>`. Species not listed there fall back to
the default scale.
