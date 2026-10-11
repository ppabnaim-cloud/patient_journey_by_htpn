/* ===========================================================================
   labs.js — blood results. Pure functions only. No React, no DOM.

   Design decision a reviewer should understand before reading further:

   For every analyte EXCEPT fasting glucose and HbA1c, this app does NOT hold a
   reference range of its own. Reference ranges are method- and analyser-
   specific; the only correct range for a result is the one the issuing
   laboratory printed next to it. So the patient enters that range from their
   own report, and the app compares against it and attributes it to the lab.

   Fasting glucose and HbA1c are the exceptions because WHO publishes
   population-level diagnostic cut-offs that do not vary by analyser.

   Nothing here diagnoses. The output words are "within / above / below the
   usual range", never a disease name.
   ========================================================================= */

import { SRC, FPG_BANDS, HBA1C_BANDS, LAB_PANEL, UNVERIFIED_NOTE } from './sources.js'

const BANDSETS = { FPG_BANDS, HBA1C_BANDS }

const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : null
}

export function analyte (id) {
  return LAB_PANEL.find(a => a.id === id) || null
}

function bandFor (value, bands) {
  for (const b of bands) if (value < b.max) return b
  return bands[bands.length - 1]
}

/* A single result. `ownRange` is { low, high } as printed on the patient's own
   report; it is only consulted for analytes whose interpret is 'OWN_RANGE'. */
export function classifyResult (analyteId, value, ownRange) {
  const a = analyte(analyteId)
  const v = num(value)
  if (!a) return null

  if (v === null) {
    return {
      id: `lab_${analyteId}`, level: 'none', value: null, analyteId,
      title: a.label,
      detail: { en: 'No value entered.', ms: 'Tiada nilai dimasukkan.' },
      steps: [], source: SRC.NO_GUIDELINE.id, flag: null
    }
  }

  /* --- Anchored analytes: WHO cut-offs ---------------------------------- */
  if (a.interpret === 'FPG_BANDS' || a.interpret === 'HBA1C_BANDS') {
    const set = BANDSETS[a.interpret]
    const band = bandFor(v, set.bands)
    const steps = []
    if (band.level !== 'none') {
      steps.push({
        en: 'Bring this result to your next appointment. One reading on its own does not settle anything.',
        ms: 'Bawa keputusan ini ke temujanji anda yang seterusnya. Satu bacaan sahaja tidak menentukan apa-apa.'
      })
    }
    if (band.id === 'low') {
      steps.push({
        en: 'If you also felt shaky, sweaty or confused around the time of the test, say so — that combination needs attention sooner.',
        ms: 'Jika anda juga berasa menggigil, berpeluh atau keliru sekitar masa ujian, nyatakannya — gabungan itu perlu perhatian lebih awal.'
      })
    }
    const extra = a.interpret === 'HBA1C_BANDS' ? set.note : set.divergenceNote
    return {
      id: `lab_${analyteId}`,
      level: band.id === 'low' ? 'warning' : band.level,
      value: v, analyteId,
      title: a.label,
      detail: {
        en: `${v} ${a.unit} — ${band.label.en}.`,
        ms: `${v} ${a.unit} — ${band.label.ms}.`
      },
      note: extra,
      steps,
      source: set.anchoredTo,
      flag: set.verified ? null : UNVERIFIED_NOTE
    }
  }

  /* --- Everything else: the patient's own printed range ------------------ */
  const lo = num(ownRange && ownRange.low)
  const hi = num(ownRange && ownRange.high)
  if (lo === null || hi === null || hi <= lo) {
    return {
      id: `lab_${analyteId}`, level: 'none', value: v, analyteId,
      title: a.label,
      detail: {
        en: `${v} ${a.unit} recorded. Not compared to anything — copy the reference range from your report to have it checked.`,
        ms: `${v} ${a.unit} direkodkan. Tidak dibandingkan dengan apa-apa — salin julat rujukan daripada laporan anda untuk disemak.`
      },
      steps: [], source: SRC.OWN_LAB_REPORT.id,
      flag: {
        en: 'No reference range entered, so this app will not say whether the value is normal.',
        ms: 'Tiada julat rujukan dimasukkan, jadi aplikasi ini tidak akan menyatakan sama ada nilai ini normal.'
      }
    }
  }
  const above = v > hi
  const below = v < lo
  return {
    id: `lab_${analyteId}`,
    level: above || below ? 'watch' : 'none',
    value: v, analyteId,
    title: a.label,
    detail: above
      ? { en: `${v} ${a.unit} — above the ${lo}–${hi} range on your own report.`, ms: `${v} ${a.unit} — atas julat ${lo}–${hi} pada laporan anda sendiri.` }
      : below
        ? { en: `${v} ${a.unit} — below the ${lo}–${hi} range on your own report.`, ms: `${v} ${a.unit} — bawah julat ${lo}–${hi} pada laporan anda sendiri.` }
        : { en: `${v} ${a.unit} — inside the ${lo}–${hi} range on your own report.`, ms: `${v} ${a.unit} — dalam julat ${lo}–${hi} pada laporan anda sendiri.` },
    steps: above || below ? [{
      en: 'Out-of-range on a single test is common and often means nothing. Ask about it rather than acting on it.',
      ms: 'Keputusan luar julat pada satu ujian adalah biasa dan selalunya tidak bermakna apa-apa. Tanyakan mengenainya, jangan bertindak sendiri.'
    }] : [],
    source: SRC.OWN_LAB_REPORT.id,
    flag: null
  }
}

/* The serial view: latest result per analyte, plus the direction of travel.
   Direction is reported, never judged — "up" is not "worse" for every analyte
   and this app does not hold the knowledge to say which. */
export function latestPerAnalyte (labRows) {
  const byAnalyte = new Map()
  for (const r of labRows || []) {
    if (!r || !r.analyteId || !r.date) continue
    const prev = byAnalyte.get(r.analyteId)
    if (!prev || String(r.date) > String(prev.date)) byAnalyte.set(r.analyteId, r)
  }
  return [...byAnalyte.values()]
}

export function seriesFor (labRows, analyteId) {
  return (labRows || [])
    .filter(r => r.analyteId === analyteId && num(r.value) !== null && r.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
}

export function changeSince (labRows, analyteId) {
  const s = seriesFor(labRows, analyteId)
  if (s.length < 2) return null
  const d = Math.round((num(s[s.length - 1].value) - num(s[0].value)) * 100) / 100
  return { delta: d, n: s.length, from: s[0].date, to: s[s.length - 1].date }
}
