/* ===========================================================================
   review.js — assembles every finding for the dashboard and puts them in the
   order a patient should read them. Pure functions only. No React, no DOM.

   RULE 4 of this project: sort by what needs acting on. A warning sign comes
   first, then highest concern to lowest. Items with nothing to act on are
   FOLDED, never deleted — a patient is entitled to see that the app looked at
   something and found nothing.
   ========================================================================= */

import { SRC } from './sources.js'
import { calcBMI, classifyBMI, classifyWaist, weightTrend } from './anthro.js'
import { classifyResult, latestPerAnalyte } from './labs.js'

export const LEVEL_RANK = { warning: 3, attention: 2, watch: 1, none: 0 }

export function rankOf (finding) {
  return LEVEL_RANK[finding && finding.level] ?? 0
}

/* A finding is folded when there is nothing to act on. Folding is a UI default,
   not a deletion: `folded: true` still renders, closed. */
export function withFolding (findings) {
  return findings.map(f => ({ ...f, folded: rankOf(f) === 0 }))
}

export function sortByUrgency (findings) {
  return [...findings].sort((a, b) => {
    const d = rankOf(b) - rankOf(a)
    if (d !== 0) return d
    return String(a.id).localeCompare(String(b.id))
  })
}

/* --- Safety items drawn from what the patient recorded -------------------
   These are display rules, not clinical claims: the app is surfacing the
   patient's own entry, not deciding anything about it. Sourced accordingly. */

function allergyFindings (record, lang) {
  const list = record.allergies || []
  const out = []

  if (list.length === 0) {
    out.push({
      id: 'allergy_unrecorded',
      level: 'watch',
      title: { en: 'Allergies not recorded', ms: 'Alahan tidak direkodkan' },
      detail: {
        en: 'Nothing is recorded here yet. "No known allergy" is itself worth writing down — staff ask this at every admission.',
        ms: 'Tiada apa-apa direkodkan di sini lagi. "Tiada alahan diketahui" itu sendiri berbaloi dicatat — kakitangan bertanya ini pada setiap kemasukan.'
      },
      steps: [{
        en: 'Open My Records and add your allergies, or record that you have none known.',
        ms: 'Buka Rekod Saya dan tambah alahan anda, atau rekodkan bahawa anda tiada alahan yang diketahui.'
      }],
      source: SRC.NO_GUIDELINE.id,
      flag: null
    })
    return out
  }

  const severe = list.filter(a => a.severity === 'severe')
  if (severe.length) {
    out.push({
      id: 'allergy_severe',
      level: 'warning',
      neverFold: true,
      title: { en: 'Severe allergy recorded', ms: 'Alahan teruk direkodkan' },
      detail: {
        en: `${severe.map(a => a.substance).filter(Boolean).join(', ')} — you marked this as a severe reaction. Show this screen before any new medicine is given to you.`,
        ms: `${severe.map(a => a.substance).filter(Boolean).join(', ')} — anda menanda ini sebagai tindak balas teruk. Tunjukkan skrin ini sebelum sebarang ubat baharu diberikan kepada anda.`
      },
      steps: [{
        en: 'Say it out loud at registration as well. Do not rely on a screen alone.',
        ms: 'Sebutkan juga semasa pendaftaran. Jangan bergantung pada skrin sahaja.'
      }],
      source: SRC.NO_GUIDELINE.id,
      flag: {
        en: 'This is your own entry shown back to you. The app has not checked it against any medicine list.',
        ms: 'Ini catatan anda sendiri yang dipaparkan semula. Aplikasi tidak menyemaknya dengan mana-mana senarai ubat.'
      }
    })
  }

  const mild = list.length - severe.length
  if (mild > 0) {
    out.push({
      id: 'allergy_other',
      level: 'none',
      title: { en: 'Other allergies on file', ms: 'Alahan lain dalam fail' },
      detail: {
        en: `${mild} recorded without a severe reaction marked.`,
        ms: `${mild} direkodkan tanpa tindak balas teruk ditanda.`
      },
      steps: [], source: SRC.NO_GUIDELINE.id, flag: null
    })
  }
  return out
}

function medicationFindings (record) {
  const meds = record.medications || []
  const active = meds.filter(m => m.status !== 'off')
  if (meds.length === 0) {
    return [{
      id: 'meds_unrecorded',
      level: 'watch',
      title: { en: 'Medicines not recorded', ms: 'Ubat tidak direkodkan' },
      detail: {
        en: 'Staff ask for your current medicines at almost every visit. Having the list ready saves the whole appointment time.',
        ms: 'Kakitangan bertanya ubat semasa anda pada hampir setiap lawatan. Senarai yang sedia ada menjimatkan masa temujanji.'
      },
      steps: [{
        en: 'Photograph your medicine labels in My Records, or type them in.',
        ms: 'Ambil gambar label ubat anda dalam Rekod Saya, atau taipkannya.'
      }],
      source: SRC.NO_GUIDELINE.id, flag: null
    }]
  }
  const missingIndication = active.filter(m => !m.indication || !String(m.indication).trim())
  const out = [{
    id: 'meds_count',
    level: 'none',
    title: { en: 'Medicines on file', ms: 'Ubat dalam fail' },
    detail: {
      en: `${active.length} currently on, ${meds.length - active.length} stopped.`,
      ms: `${active.length} sedang diambil, ${meds.length - active.length} telah dihentikan.`
    },
    steps: [], source: SRC.NO_GUIDELINE.id, flag: null
  }]
  if (missingIndication.length) {
    out.push({
      id: 'meds_no_indication',
      level: 'watch',
      title: { en: 'Some medicines have no reason written', ms: 'Sebahagian ubat tiada sebab ditulis' },
      detail: {
        en: `${missingIndication.length} of your current medicines have no condition written beside them. Knowing what each one is for is the single most useful thing to be able to say.`,
        ms: `${missingIndication.length} daripada ubat semasa anda tiada penyakit ditulis di sebelahnya. Mengetahui kegunaan setiap satu adalah perkara paling berguna untuk dinyatakan.`
      },
      steps: [{
        en: 'Ask the pharmacist at your next collection — that is exactly what the counter is for.',
        ms: 'Tanya ahli farmasi pada pengambilan seterusnya — itulah tujuan kaunter tersebut.'
      }],
      source: SRC.NO_GUIDELINE.id, flag: null
    })
  }
  return out
}

function issueFindings (record) {
  const issues = (record.issues || []).filter(i => i.status !== 'resolved')
  if (!issues.length) return []
  return [{
    id: 'issues_active',
    level: 'none',
    title: { en: 'Active problems on file', ms: 'Masalah aktif dalam fail' },
    detail: {
      en: `${issues.length}: ${issues.map(i => i.text).filter(Boolean).slice(0, 4).join('; ')}${issues.length > 4 ? '…' : ''}`,
      ms: `${issues.length}: ${issues.map(i => i.text).filter(Boolean).slice(0, 4).join('; ')}${issues.length > 4 ? '…' : ''}`
    },
    steps: [], source: SRC.NO_GUIDELINE.id, flag: null
  }]
}

function surgeryFindings (record) {
  const ops = record.surgeries || []
  if (!ops.length) return []
  return [{
    id: 'surgery_history',
    level: 'none',
    title: { en: 'Operations on file', ms: 'Pembedahan dalam fail' },
    detail: {
      en: `${ops.length} recorded, most recent ${ops.map(o => o.date).filter(Boolean).sort().slice(-1)[0] || 'date not given'}.`,
      ms: `${ops.length} direkodkan, terkini ${ops.map(o => o.date).filter(Boolean).sort().slice(-1)[0] || 'tarikh tidak diberikan'}.`
    },
    steps: [], source: SRC.NO_GUIDELINE.id, flag: null
  }]
}

/* --- The whole review ---------------------------------------------------- */

export function reviewRecord (record) {
  const r = record || {}
  const findings = []

  findings.push(...allergyFindings(r))
  findings.push(...medicationFindings(r))
  findings.push(...issueFindings(r))
  findings.push(...surgeryFindings(r))

  const latestMeasure = (r.measurements || [])
    .filter(m => m && m.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-1)[0]

  if (latestMeasure) {
    const bmi = calcBMI(latestMeasure.weightKg, latestMeasure.heightCm)
    findings.push(classifyBMI(bmi))
    findings.push(classifyWaist(latestMeasure.waistCm, r.sex))
    const trend = weightTrend(r.measurements)
    if (trend) findings.push(trend)
  }

  for (const row of latestPerAnalyte(r.labs)) {
    const f = classifyResult(row.analyteId, row.value, { low: row.refLow, high: row.refHigh })
    if (f) findings.push({ ...f, date: row.date })
  }

  const folded = withFolding(findings).map(f => (f.neverFold ? { ...f, folded: false } : f))
  return sortByUrgency(folded)
}

/* Counts for the dashboard header. */
export function summarise (findings) {
  const c = { warning: 0, attention: 0, watch: 0, none: 0 }
  for (const f of findings) c[f.level] = (c[f.level] || 0) + 1
  return c
}
