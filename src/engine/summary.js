/* ===========================================================================
   engine/summary.js — the five views of a patient's own record.

   WHAT THIS IS, AND WHAT IT DELIBERATELY IS NOT
   HTPN asked for "AI thematic analysis" grouping a record into comorbidities,
   active issues, medicines, investigation trends and imaging. This file does
   that grouping, and it does it with rules rather than a model, for one
   reason: every other screen in this app promises that what the patient
   enters stays on their device. Sending their medicines and diagnoses to a
   model to be themed would make that sentence false. Not storing is not the
   same as not sending.

   So the grouping below runs in the browser, offline, on what the patient
   typed or corrected after OCR. It is deterministic: the same record always
   produces the same five buckets, and a patient can see why anything landed
   where it did. When HTPN's data owner rules on sending text to a model, the
   step slots in above this one — it does not replace it.

   WHAT IT WILL NOT DECIDE
   It does not judge whether a result is normal; engine/labs.js does that
   against cited thresholds. It does not decide what is a comorbidity and
   what is an acute problem — the PATIENT marks that, because this app has no
   business inferring a diagnosis from free text and then showing the patient
   its guess as if it were theirs.
   ========================================================================= */

import { classifyResult } from './labs.js'

/* Every entry carries two different times and they answer different
   questions: `date` is when the thing happened clinically, `recordedAt` is
   when it was typed in. A result from March entered in October is both, and
   a summary that conflates them misleads about how current the record is. */
export function recordedStamp (entry) {
  return entry?.recordedAt || null
}

export function latestRecordedAt (record) {
  const all = [
    ...(record?.medications || []), ...(record?.issues || []),
    ...(record?.allergies || []), ...(record?.surgeries || []),
    ...(record?.labs || []), ...(record?.imaging || []),
    ...(record?.measurements || []), ...(record?.activity || [])
  ]
  let best = null
  for (const e of all) {
    const t = recordedStamp(e)
    if (t && (!best || t > best)) best = t
  }
  return best
}

/* --- 1 & 2. Problems, split the way the patient marked them --------------
   `chronic` is the patient's own flag. Nothing here guesses: an untagged
   problem is an active issue, which is the safer of the two to be wrong
   about — it stays visible rather than settling into a background list. */
export function comorbidities (record) {
  return (record?.issues || [])
    .filter(i => i.status !== 'resolved' && i.chronic)
    .sort(byDateDesc)
}

export function activeIssues (record) {
  return (record?.issues || [])
    .filter(i => i.status !== 'resolved' && !i.chronic)
    .sort(byDateDesc)
}

export function resolvedIssues (record) {
  return (record?.issues || []).filter(i => i.status === 'resolved').sort(byDateDesc)
}

/* --- 3. Medicines, now and before ----------------------------------------
   A medicine is past if it was marked stopped, or if its supply end date has
   gone by. Both are the patient's own entry; neither is inferred. */
export function medicinesNow (record, today) {
  return (record?.medications || [])
    .filter(m => m.status !== 'off' && !(m.endsOn && m.endsOn < today))
    .sort(byDateDesc)
}

export function medicinesPast (record, today) {
  return (record?.medications || [])
    .filter(m => m.status === 'off' || (m.endsOn && m.endsOn < today))
    .sort(byDateDesc)
}

/* --- 4. Investigation trends ---------------------------------------------
   One row per analyte, in the patient's own units, with the direction of
   travel between the two most recent values. The direction is arithmetic,
   not interpretation: "higher than last time" is a fact; "worse" would be a
   judgement this app is not entitled to make. */
export function investigationTrends (record) {
  const byAnalyte = new Map()
  for (const l of record?.labs || []) {
    if (!l?.analyteId || l.value == null || l.value === '') continue
    if (!byAnalyte.has(l.analyteId)) byAnalyte.set(l.analyteId, [])
    byAnalyte.get(l.analyteId).push(l)
  }
  const out = []
  for (const [analyteId, rows] of byAnalyte) {
    rows.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
    const latest = rows[rows.length - 1]
    const previous = rows.length > 1 ? rows[rows.length - 2] : null
    const dv = previous ? Number(latest.value) - Number(previous.value) : null
    out.push({
      analyteId,
      rows,
      count: rows.length,
      latest,
      previous,
      /* null where there is nothing to compare against. One reading is not a
         trend and must not be drawn as one. */
      direction: dv === null || !Number.isFinite(dv) ? null : (dv > 0 ? 'up' : dv < 0 ? 'down' : 'same'),
      delta: Number.isFinite(dv) ? dv : null,
      finding: classifyResult(analyteId, latest.value, { low: latest.refLow, high: latest.refHigh })
    })
  }
  return out.sort((a, b) => b.count - a.count ||
    String(b.latest.date || '').localeCompare(String(a.latest.date || '')))
}

/* --- 5. Imaging, by region, newest first ---------------------------------
   Grouped by body part rather than by modality, because a patient following
   one problem wants every scan of that part together — the CT and the
   ultrasound of the same abdomen belong side by side. */
export function imagingGroups (record) {
  const byPart = new Map()
  for (const img of record?.imaging || []) {
    const key = String(img?.bodyPart || '').trim().toLowerCase() || '—'
    if (!byPart.has(key)) byPart.set(key, [])
    byPart.get(key).push(img)
  }
  const out = []
  for (const [, rows] of byPart) {
    rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    out.push({
      bodyPart: rows[0].bodyPart || '—',
      rows,
      count: rows.length,
      latest: rows[0],
      /* More than one scan of the same region is the thing worth noticing:
         it is a problem somebody has been following. */
      repeated: rows.length > 1
    })
  }
  return out.sort((a, b) => b.count - a.count ||
    String(b.latest.date || '').localeCompare(String(a.latest.date || '')))
}

function byDateDesc (a, b) {
  return String(b.date || b.startedOn || '').localeCompare(String(a.date || a.startedOn || ''))
}

/* The whole summary in one call, so a screen renders from one object and
   cannot show two buckets computed from different moments. */
export function buildSummary (record, today) {
  return {
    comorbidities: comorbidities(record),
    activeIssues: activeIssues(record),
    resolvedIssues: resolvedIssues(record),
    medicinesNow: medicinesNow(record, today),
    medicinesPast: medicinesPast(record, today),
    investigations: investigationTrends(record),
    imaging: imagingGroups(record),
    lastEntry: latestRecordedAt(record),
    isEmpty: !(record?.issues?.length || record?.medications?.length ||
               record?.labs?.length || record?.imaging?.length)
  }
}
