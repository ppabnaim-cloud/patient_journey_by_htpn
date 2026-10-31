/* ===========================================================================
   medsheet.js — the medicines table, and what can honestly be read into it.

   WHAT READS THE PHOTOGRAPH, AND WHY IT IS NOT A LANGUAGE MODEL
   HTPN asked for "AI will analyse → transcribe → thematic analysis". The
   reading here is done ON THE DEVICE, by the OCR engine already vendored into
   this app, and the sorting into columns is done by the rules below.

   That is a deliberate limit, not a shortcut. Every other screen in this app
   tells the patient their record never leaves their phone, and a pharmacy
   sticker carries their name and IC number. Sending that photograph to a
   vision model means sending those to somebody else's server, which would
   make the disclaimer false. If HTPN decides that trade is worth making, the
   place to add it is here: one function that takes the image and returns
   rows, behind an explicit consent the patient gives each time. Everything
   below — the columns, the table, the editing, the storage — stays as it is.

   WHAT THE RULES CAN AND CANNOT DO
   A printed Malaysian pharmacy label is read well: drug, strength, frequency
   and the dispensing date are all in predictable shapes. Handwriting is read
   badly and sometimes not at all. So nothing here is ever accepted silently:
   a reading becomes a DRAFT ROW the patient looks at and corrects, and a
   field the rules are unsure of is left EMPTY rather than guessed. An empty
   cell a patient fills in is a small nuisance. A wrong dose they did not
   notice, on a sheet they later show to a nurse, is not.
   ========================================================================= */

/* The nine columns HTPN specified, in HTPN's order. One place: the table
   header, the card labels, the CSV and the print sheet all read this, so a
   column cannot exist in one and be missing from another. */
export const MED_COLUMNS = [
  { id: 'name', en: 'Medicine', ms: 'Nama Ubat', wide: true },
  { id: 'brand', en: 'Brand', ms: 'Jenama' },
  { id: 'dose', en: 'Dose', ms: 'Dos' },
  { id: 'frequency', en: 'Frequency', ms: 'Kekerapan' },
  { id: 'startedOn', en: 'Prescribed on', ms: 'Tarikh Preskripsi', type: 'date' },
  { id: 'lastOn', en: 'Last prescribed', ms: 'Preskripsi Terakhir', type: 'date' },
  { id: 'duration', en: 'Duration', ms: 'Tempoh', derived: true },
  /* The date on the packet, not the prescription. A patient holding a box
     they were given months ago has no other way to be told it is past. */
  { id: 'expiryOn', en: 'Expires', ms: 'Tarikh Luput', type: 'date' },
  /* Still taking it, finished the course, or told to stop — and WHEN, which
     is the half that makes "stopped" mean anything to the next clinician. */
  { id: 'status', en: 'Status', ms: 'Status', type: 'status' },
  { id: 'hospital', en: 'Prescribed by', ms: 'Hospital Preskripsi' }
]

/* The three states a medicine is actually in. "Stopped" carries the date
   separately rather than as free text, because "stopped by doctor" with no
   date tells the next clinician nothing they can act on. */
export const MED_STATUS = [
  { id: 'active', en: 'Still taking', ms: 'Masih diambil' },
  { id: 'completed', en: 'Course finished', ms: 'Tamat rawatan' },
  { id: 'stopped', en: 'Stopped by the doctor', ms: 'Dihentikan oleh doktor' }
]
export const statusLabel = id => MED_STATUS.find(s => s.id === id) || null

export const EMPTY_MED = {
  name: '', brand: '', dose: '', frequency: '',
  startedOn: '', lastOn: '', expiryOn: '', status: '', statusOn: '',
  hospital: '', reactions: []
}

/* ── frequency ────────────────────────────────────────────────────────────
   The abbreviations a Malaysian label actually carries. Expanded on screen
   because "BD" means nothing to most patients and "twice a day" is the whole
   point of writing it down. */
export const FREQ_CODES = {
  od:   { en: 'Once a day', ms: 'Sekali sehari' },
  om:   { en: 'Once each morning', ms: 'Sekali setiap pagi' },
  on:   { en: 'Once each night', ms: 'Sekali setiap malam' },
  bd:   { en: 'Twice a day', ms: 'Dua kali sehari' },
  tds:  { en: 'Three times a day', ms: 'Tiga kali sehari' },
  qid:  { en: 'Four times a day', ms: 'Empat kali sehari' },
  prn:  { en: 'When needed', ms: 'Bila perlu' },
  stat: { en: 'One dose now', ms: 'Satu dos sekarang' }
}

export function expandFrequency (v) {
  const k = String(v || '').trim().toLowerCase().replace(/[^a-z]/g, '')
  return FREQ_CODES[k] || null
}

/* ── duration ─────────────────────────────────────────────────────────────
   Column 7 is COMPUTED from columns 5 and 6, never typed and never stored.
   A typed duration and two typed dates are three chances to disagree with
   each other, and nothing in the app could then say which was right. */
export function durationOf (med) {
  const a = String(med?.startedOn || ''), b = String(med?.lastOn || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a) || !/^\d{4}-\d{2}-\d{2}$/.test(b)) return null
  /* Dates are compared as strings-turned-UTC, never as local Date objects:
     a local Date shifts across midnight by timezone and silently loses a day. */
  const days = Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000)
  if (!Number.isFinite(days) || days < 0) return null
  return days
}

export function durationLabel (med) {
  const d = durationOf(med)
  if (d === null) return null
  if (d === 0) return { en: 'Same day', ms: 'Hari yang sama' }
  if (d < 14) return { en: `${d} days`, ms: `${d} hari` }
  const w = Math.round(d / 7)
  if (d < 70) return { en: `${w} weeks`, ms: `${w} minggu` }
  const m = Math.round(d / 30)
  return { en: `${m} months`, ms: `${m} bulan` }
}

/* ── reading a label ──────────────────────────────────────────────────────
   Conservative on purpose. A line has to look like a medicine line before
   anything is taken from it, and each field is taken only when its own
   pattern matches. */
const STRENGTH = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|g|ml|iu|unit|units|%)\b/i
const FREQ = /\b(od|om|on|bd|bid|tds|tid|qid|qds|prn|stat)\b/i
const FREQ_WORDS = /\b(sekali sehari|dua kali sehari|tiga kali sehari|empat kali sehari|bila perlu|once daily|twice daily|three times)\b/i
const ISO = /\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/
const DMY = /\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})\b/
/* Words a label prints around the medicine, which must not end up in the
   name column. Kept short: a long list starts deleting real drug names. */
const NOISE = /\b(tablet|tab|kapsul|capsule|cap|syrup|sirap|injection|suntikan|cream|krim|drops|titis|ubat|medication|qty|quantity|kuantiti|bil|no|ref|lot|exp|tarikh|date|nama|name|ic|rn|rm)\b/gi

export function normaliseFreq (raw) {
  const s = String(raw || '').toLowerCase()
  const m = s.match(FREQ)
  if (m) {
    const k = m[1].toLowerCase()
    return ({ bid: 'bd', tid: 'tds', qds: 'qid' })[k] || k
  }
  const w = s.match(FREQ_WORDS)
  if (!w) return ''
  return ({ 'sekali sehari': 'od', 'once daily': 'od', 'dua kali sehari': 'bd',
            'twice daily': 'bd', 'tiga kali sehari': 'tds', 'three times': 'tds',
            'empat kali sehari': 'qid', 'bila perlu': 'prn' })[w[1].toLowerCase()] || ''
}

export function readDate (line) {
  const iso = String(line || '').match(ISO)
  const pad = n => String(n).padStart(2, '0')
  if (iso) {
    const mo = Number(iso[2]), d = Number(iso[3])
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return `${iso[1]}-${pad(mo)}-${pad(d)}`
    return ''
  }
  const dmy = String(line || '').match(DMY)
  if (!dmy) return ''
  /* 03/04/2026 is ambiguous the world over. Malaysian labels print
     day/month, so that is what is read — and the patient sees the date in a
     date field they can correct, never a date silently used for anything. */
  const d = Number(dmy[1]), mo = Number(dmy[2])
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return ''
  return `${dmy[3]}-${pad(mo)}-${pad(d)}`
}

/* HTPN hospitals that print their name on a label. Matched so the hospital
   column fills itself for the common case; anything else is left for the
   patient, never guessed from a fragment. */
const HOSPITALS = [
  [/tengku\s+permaisuri\s+norashikin|\bhtpn\b/i, 'Hospital Tengku Permaisuri Norashikin'],
  [/hospital\s+kajang/i, 'Hospital Kajang'],
  [/hospital\s+serdang/i, 'Hospital Serdang'],
  [/hospital\s+selayang/i, 'Hospital Selayang'],
  [/hospital\s+sungai\s+buloh/i, 'Hospital Sungai Buloh'],
  [/hospital\s+kuala\s+lumpur|\bhkl\b/i, 'Hospital Kuala Lumpur'],
  [/klinik\s+kesihatan\s+([a-z ]{3,24})/i, null]
]

export function readHospital (text) {
  const s = String(text || '')
  for (const [re, name] of HOSPITALS) {
    const m = s.match(re)
    if (!m) continue
    if (name) return name
    return ('Klinik Kesihatan ' + m[1].trim()).replace(/\s+/g, ' ')
  }
  return ''
}

/* One photograph is one dispensing event, so the date and the hospital are
   read from the whole sheet and applied to every row, while the drug, the
   strength and the frequency are read line by line. */
export function readMedSheet (text) {
  const whole = String(text || '')
  const lines = whole.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 2)
  const hospital = readHospital(whole)
  let sheetDate = ''
  for (const line of lines) { sheetDate = readDate(line); if (sheetDate) break }

  const rows = []
  for (const line of lines) {
    const st = line.match(STRENGTH)
    if (!st) continue
    const name = line.slice(0, st.index)
      /* A label numbers its items: "1.", "2)", "3 -". That is the position
         on the sheet, not part of the drug's name. */
      .replace(/^\s*\(?\d{1,2}\s*[.)\-:]\s*/, ' ')
      .replace(NOISE, ' ')
      .replace(/[^A-Za-z0-9 \-/+]/g, ' ').replace(/\s+/g, ' ').trim()
    if (name.length < 3) continue
    if (/^\d+$/.test(name)) continue
    rows.push({
      ...EMPTY_MED,
      name,
      dose: st[1].replace(',', '.') + ' ' + st[2].toLowerCase().replace('µg', 'mcg'),
      frequency: normaliseFreq(line),
      startedOn: sheetDate,
      hospital,
      fromOcr: true
    })
  }
  /* The same drug printed twice on one label is one medicine. */
  const seen = new Set()
  return rows.filter(r => {
    const k = (r.name + '|' + r.dose).toLowerCase()
    if (seen.has(k)) return false
    seen.add(k); return true
  }).slice(0, 25)
}

/* ── expiry ───────────────────────────────────────────────────────────────
   Said against a date the PATIENT typed, never against anything this app
   claims to know. It is a prompt to look at the box, not a ruling on the
   medicine, and it says so on screen. */
export function expiryState (med, today) {
  const d = String(med?.expiryOn || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null
  const now = String(today || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(now)) return null
  if (d < now) return 'expired'
  /* A month's notice is what makes the warning useful rather than a surprise
     on the day. */
  const soon = new Date(Date.parse(now + 'T00:00:00Z') + 30 * 86400000).toISOString().slice(0, 10)
  return d <= soon ? 'soon' : 'ok'
}

/* What the patient still has to fill in, said per row so the table can mark
   it rather than leaving somebody to compare nine columns by eye. */
export function missingFields (med) {
  return MED_COLUMNS.filter(c => !c.derived && !String(med?.[c.id] || '').trim()).map(c => c.id)
}

export function isBlank (med) {
  return MED_COLUMNS.every(c => c.derived || !String(med?.[c.id] || '').trim())
}
