/* ===========================================================================
   vendor-ocr.mjs — copies the OCR engine out of node_modules into public/ocr/.

   Why this exists: left alone, tesseract.js fetches its worker, its wasm core
   and its language data from a CDN at first use. The app tells the patient on
   screen that it works with no internet, so a CDN fetch would make that line
   untrue. This copies all four pieces locally and src/ocr.js points at them.

   The files are NOT committed (public/ocr/ is in .gitignore). They come from
   the pinned dependencies, so `npm ci && npm run build` reproduces them
   exactly, on Vercel as well as here.

   Size: about 10 MB, almost all of it the two wasm cores and the English
   model. The service worker does NOT precache any of it — it is fetched the
   first time a patient actually uses OCR, and only the one core their device
   needs. Nobody downloads it for opening the way-finding tab.
   ========================================================================= */
import { cp, mkdir, readdir, stat, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const OUT = 'public/ocr'

/* lstmOnly is what src/ocr.js asks for (oem = 1), so only the LSTM cores are
   needed. Both are copied because SIMD support is detected on the device. */
const WANTED = [
  ['tesseract.js/dist/worker.min.js', 'worker.min.js'],
  ['tesseract.js-core/tesseract-core-simd-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm.js'],
  ['tesseract.js-core/tesseract-core-lstm.wasm.js', 'tesseract-core-lstm.wasm.js'],
  ['@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz', 'eng.traineddata.gz']
]

function resolveAsset (spec) {
  try { return require.resolve(spec) } catch { /* fall through */ }
  /* require.resolve refuses paths a package does not export, so fall back to
     walking node_modules directly. */
  const direct = path.join('node_modules', spec)
  return existsSync(direct) ? direct : null
}

async function main () {
  /* Clear first: a stale file left by an older version of this script would
     otherwise sit in the build and be served for ever. */
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })
  const missing = []
  let bytes = 0
  for (const [spec, name] of WANTED) {
    const src = resolveAsset(spec)
    if (!src) { missing.push(spec); continue }
    await cp(src, path.join(OUT, name))
    bytes += (await stat(src)).size
  }
  const files = await readdir(OUT)
  console.log(`[vendor-ocr] ${files.length} file(s), ${(bytes / 1048576).toFixed(1)} MB in ${OUT}`)
  if (missing.length) {
    console.error('[vendor-ocr] MISSING: ' + missing.join(', '))
    console.error('[vendor-ocr] OCR would fall back to a CDN, which breaks the offline promise.')
    console.error('[vendor-ocr] Fix the dependency or set OCR_LOCAL_ASSETS=false in src/ocr.js.')
    process.exit(1)
  }
}
main()
