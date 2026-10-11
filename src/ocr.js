/* ===========================================================================
   ocr.js — reading text out of a photograph, on the device.

   One adapter, one engine. tesseract.js is loaded LAZILY, from the app's own
   bundle rather than a CDN, so the first use costs a moment but no network
   call — which is what the "works offline" promise on screen requires.

   Honest limits, which the UI repeats to the patient rather than hiding:
   - Printed pharmacy labels and lab printouts read reasonably well.
   - Handwriting reads badly. Malay text reads worse than English.
   - Output is ALWAYS a draft. It is shown for checking and is never written
     into the record until the patient confirms it field by field.

   To remove the dependency entirely: delete the dynamic import below and
   return { available: false }. Everything else in the app keeps working;
   the tab falls back to photograph-plus-typing.
   ========================================================================= */

let worker = null
let loadFailed = false

/* Everything the engine needs is served from this app's own origin, put there
   at build time by scripts/vendor-ocr.mjs. Nothing is fetched from a CDN, so
   OCR keeps working with no connection — which is what the line on screen
   about working offline requires.

   OEM 1 is LSTM_ONLY. That choice matters here: it is what makes tesseract
   load the much smaller "-lstm" wasm core rather than the full legacy one. */
const LOCAL = {
  workerPath: '/ocr/worker.min.js',
  corePath: '/ocr',                 // a directory: SIMD support is detected per device
  langPath: '/ocr',                 // holds eng.traineddata.gz
  gzip: true
}

export function ocrAvailable () {
  return !loadFailed
}

async function getWorker (onProgress) {
  if (worker) return worker
  const { createWorker } = await import('tesseract.js')
  /* English only. The Malay model adds several megabytes, and on the label and
     lab-printout photographs this app sees it has little to work with: drug
     names, numbers and units are Latin script and largely English either way. */
  worker = await createWorker('eng', 1, {
    ...LOCAL,
    logger: m => {
      if (onProgress && m.status === 'recognizing text') onProgress(m.progress || 0)
    }
  })
  return worker
}

export async function readText (fileOrBlob, onProgress) {
  try {
    const w = await getWorker(onProgress)
    const { data } = await w.recognize(fileOrBlob)
    return { ok: true, text: (data?.text || '').trim(), confidence: data?.confidence ?? null }
  } catch (err) {
    loadFailed = true
    return { ok: false, text: '', error: String(err?.message || err) }
  }
}

export async function disposeOcr () {
  try { await worker?.terminate() } catch { /* nothing to do */ }
  worker = null
}

/* --- Turning read text into a draft -------------------------------------
   Deliberately conservative. These patterns only propose; nothing is accepted
   without the patient looking at it. A pattern that is unsure returns nothing
   rather than a guess, because a wrong dose silently accepted is worse than
   no dose at all. */

const DOSE_RE = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|g|ml|iu|unit|units|%)\b/i
const FREQ_RE = /\b(od|bd|tds|qid|on|om|prn|stat|daily|sekali sehari|dua kali sehari|tiga kali sehari)\b/i
const DATE_RE = /\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b|\b(\d{1,2})[-/](\d{1,2})[-/](20\d{2})\b/

export function draftMedicationsFrom (text) {
  const lines = String(text || '').split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 2)
  const out = []
  for (const line of lines) {
    const dose = line.match(DOSE_RE)
    if (!dose) continue
    const name = line.slice(0, dose.index).replace(/[^A-Za-z0-9 \-/]/g, ' ').trim()
    if (name.length < 3) continue
    const freq = line.match(FREQ_RE)
    out.push({
      drug: name,
      dose: [dose[1].replace(',', '.') + ' ' + dose[2].toLowerCase(), freq ? freq[1].toUpperCase() : '']
        .filter(Boolean).join(' '),
      indication: '',
      status: 'on',
      fromOcr: true
    })
  }
  return out.slice(0, 20)
}

export function draftDateFrom (text) {
  const m = String(text || '').match(DATE_RE)
  if (!m) return ''
  const pad = n => String(n).padStart(2, '0')
  if (m[1]) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`
  return `${m[6]}-${pad(m[5])}-${pad(m[4])}`
}

/* Lab lines look like:  HbA1c  8.1  %  (4.0 - 6.0)
   Only analytes the app already knows are proposed; an unknown test name is
   skipped rather than guessed at. */
export function draftLabsFrom (text, panel) {
  const lines = String(text || '').split(/\r?\n/)
  const out = []
  for (const raw of lines) {
    const line = raw.trim()
    if (line.length < 3) continue
    for (const a of panel) {
      const names = [a.id, a.label.en, a.label.ms].map(s => String(s).toLowerCase())
      const hit = names.some(n => n.length > 2 && line.toLowerCase().includes(n))
      if (!hit) continue
      const nums = line.match(/-?\d+(?:[.,]\d+)?/g)
      if (!nums || !nums.length) break
      const value = parseFloat(nums[0].replace(',', '.'))
      if (!Number.isFinite(value)) break
      const range = line.match(/\(?\s*(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*\)?/)
      out.push({
        analyteId: a.id,
        value,
        refLow: range ? parseFloat(range[1].replace(',', '.')) : '',
        refHigh: range ? parseFloat(range[2].replace(',', '.')) : '',
        fromOcr: true
      })
      break
    }
  }
  return out.slice(0, 20)
}
