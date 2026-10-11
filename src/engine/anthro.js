/* ===========================================================================
   anthro.js — body measurements. Pure functions only. No React, no DOM.
   Every exported function returns either a plain number/null, or a FINDING:

     { id, level, title, detail, steps[], source, flag, value }

   level is one of: 'warning' | 'attention' | 'watch' | 'none'
     warning   — a safety item that must be seen now; never folded away.
     attention — outside the cited band; bring it up at the next visit.
     watch     — borderline against the cited band.
     none      — nothing to act on. The UI folds these, it does not delete them.

   source is an SRC id. flag is null when the number is anchored, or a bilingual
   sentence when it is not. Nothing here diagnoses anything.
   ========================================================================= */

import { SRC, BMI_BANDS, WAIST_THRESHOLD, UNVERIFIED_NOTE } from './sources.js'

const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : null
}

/* BMI = kg / m^2. Returns null rather than NaN when either input is unusable,
   so a caller can never render "NaN" at a patient. */
export function calcBMI (weightKg, heightCm) {
  const w = num(weightKg)
  const h = num(heightCm)
  if (w === null || h === null) return null
  if (w <= 0 || w > 400) return null
  if (h <= 0 || h > 260) return null
  const m = h / 100
  return Math.round((w / (m * m)) * 10) / 10
}

/* Lowest band whose `max` the value is strictly under. The final band's max is
   Infinity, so this always resolves. */
function bandFor (value, bands) {
  for (const b of bands) if (value < b.max) return b
  return bands[bands.length - 1]
}

export function classifyBMI (bmiValue) {
  const v = num(bmiValue)
  if (v === null) {
    return {
      id: 'bmi', level: 'none', value: null,
      title: { en: 'Body mass index', ms: 'Indeks jisim badan' },
      detail: { en: 'Enter a height and a weight to work this out.', ms: 'Masukkan tinggi dan berat untuk mengiranya.' },
      steps: [], source: BMI_BANDS.anchoredTo, flag: null
    }
  }
  const band = bandFor(v, BMI_BANDS.bands)
  const steps = []
  if (band.level !== 'none') {
    steps.push({
      en: 'Show this number to your doctor or nurse at your next visit.',
      ms: 'Tunjukkan nombor ini kepada doktor atau jururawat anda pada lawatan berikutnya.'
    })
  }
  if (band.id === 'underweight') {
    steps.push({
      en: 'Say whether you have lost weight without trying. That matters more than the number itself.',
      ms: 'Nyatakan sama ada anda hilang berat tanpa mencuba. Itu lebih penting daripada nombor itu sendiri.'
    })
  }
  if (band.id === 'overweight' || band.id === 'obese1' || band.id === 'obese2') {
    steps.push({
      en: 'Ask whether you are due for a blood sugar, cholesterol and blood pressure check.',
      ms: 'Tanya sama ada anda perlu pemeriksaan gula dalam darah, kolesterol dan tekanan darah.'
    })
  }
  return {
    id: 'bmi',
    level: band.level,
    value: v,
    title: { en: 'Body mass index', ms: 'Indeks jisim badan' },
    detail: {
      en: `BMI ${v} ${BMI_BANDS.unit} — ${band.label.en}. Asian cut-offs, which sit lower than the international ones.`,
      ms: `BMI ${v} ${BMI_BANDS.unit} — ${band.label.ms}. Titik potong Asia, yang lebih rendah daripada antarabangsa.`
    },
    steps,
    source: BMI_BANDS.anchoredTo,
    flag: BMI_BANDS.verified ? null : UNVERIFIED_NOTE
  }
}

/* Sex is needed because the cited threshold is sex-specific. When it is not
   recorded the app refuses to pick one for the patient. */
export function classifyWaist (waistCm, sex) {
  const v = num(waistCm)
  if (v === null) {
    return {
      id: 'waist', level: 'none', value: null,
      title: { en: 'Waist circumference', ms: 'Lilit pinggang' },
      detail: { en: 'Measure around the waist at the level of the navel, standing, breathing out.', ms: 'Ukur di sekeliling pinggang pada aras pusat, berdiri, sambil menghembus nafas.' },
      steps: [], source: WAIST_THRESHOLD.anchoredTo, flag: null
    }
  }
  if (sex !== 'male' && sex !== 'female') {
    return {
      id: 'waist', level: 'none', value: v,
      title: { en: 'Waist circumference', ms: 'Lilit pinggang' },
      detail: {
        en: `${v} cm recorded. The cited threshold is different for men and women, so this app will not interpret the number until that is recorded.`,
        ms: `${v} cm direkodkan. Ambang yang dipetik berbeza bagi lelaki dan wanita, jadi aplikasi ini tidak akan mentafsir nombor ini sehingga ia direkodkan.`
      },
      steps: [], source: WAIST_THRESHOLD.anchoredTo,
      flag: { en: 'Not interpreted: sex not recorded.', ms: 'Tidak ditafsir: jantina tidak direkodkan.' }
    }
  }
  const cut = sex === 'male' ? WAIST_THRESHOLD.male : WAIST_THRESHOLD.female
  const over = v >= cut
  return {
    id: 'waist',
    level: over ? 'attention' : 'none',
    value: v,
    title: { en: 'Waist circumference', ms: 'Lilit pinggang' },
    detail: over
      ? { en: `${v} cm, at or above the ${cut} cm mark used for this population.`, ms: `${v} cm, pada atau melebihi paras ${cut} cm bagi populasi ini.` }
      : { en: `${v} cm, under the ${cut} cm mark used for this population.`, ms: `${v} cm, bawah paras ${cut} cm bagi populasi ini.` },
    steps: over ? [{
      en: 'Mention this alongside your weight. Waist size carries information that BMI alone does not.',
      ms: 'Sebutkan ini bersama berat anda. Saiz pinggang membawa maklumat yang tidak diberikan oleh BMI sahaja.'
    }] : [],
    source: WAIST_THRESHOLD.anchoredTo,
    flag: WAIST_THRESHOLD.verified ? null : UNVERIFIED_NOTE
  }
}

/* Trend over the stored measurement series. Deliberately descriptive only:
   it reports the change and does not call it good or bad, because no cited
   guideline in this app defines a meaningful rate of weight change. */
export function weightTrend (measurements) {
  const rows = (measurements || [])
    .filter(m => num(m.weightKg) !== null && m.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
  if (rows.length < 2) return null
  const first = rows[0]
  const last = rows[rows.length - 1]
  const delta = Math.round((num(last.weightKg) - num(first.weightKg)) * 10) / 10
  return {
    id: 'weight_trend',
    level: 'none',
    value: delta,
    n: rows.length,
    from: first.date,
    to: last.date,
    title: { en: 'Weight change', ms: 'Perubahan berat' },
    detail: {
      en: `${delta > 0 ? '+' : ''}${delta} kg across ${rows.length} entries, ${first.date} to ${last.date}.`,
      ms: `${delta > 0 ? '+' : ''}${delta} kg merentas ${rows.length} catatan, ${first.date} hingga ${last.date}.`
    },
    steps: [],
    source: SRC.NO_GUIDELINE.id,
    flag: {
      en: 'Description only. No guideline in this app defines what a given rate of weight change means.',
      ms: 'Keterangan sahaja. Tiada garis panduan dalam aplikasi ini mentakrifkan maksud kadar perubahan berat tertentu.'
    }
  }
}
